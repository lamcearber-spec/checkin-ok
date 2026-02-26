/**
 * Dual-Stage Attendance Parser
 *
 * Stage 1: Deterministic parsing with Papaparse + Zod validation + NISS/BIS/Limosa crypto checks
 * Stage 2: Invalid rows routed to AI fallback (Azure GPT-4o)
 */

import Papa from 'papaparse';
import { validateNiss, validateBis, validateLimosa } from './validators';
import type { AttendanceRecord, ParsedAttendance } from '@/schema/attendanceSchema';

/* ─── Column mapping ──────────────────────────────── */

interface RawRow {
  [key: string]: string;
}

function findColumn(row: RawRow, candidates: string[]): string {
  for (const c of candidates) {
    const key = Object.keys(row).find((k) => k.toLowerCase().replace(/[\s_\-]/g, '') === c.toLowerCase().replace(/[\s_\-]/g, ''));
    if (key && row[key]) return row[key].trim();
  }
  return '';
}

/* ─── Date normalization ──────────────────────────── */

function normalizeDate(raw: string): string | null {
  if (!raw) return null;

  // ISO 8601
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.substring(0, 10);

  // DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const euMatch = raw.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (euMatch) return `${euMatch[3]}-${euMatch[2].padStart(2, '0')}-${euMatch[1].padStart(2, '0')}`;

  // MM/DD/YYYY (US format)
  const usMatch = raw.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (usMatch) {
    const m = parseInt(usMatch[1], 10);
    const d = parseInt(usMatch[2], 10);
    if (m > 12 && d <= 12) {
      // Swap: DD/MM/YYYY masquerading as US
      return `${usMatch[3]}-${usMatch[2].padStart(2, '0')}-${usMatch[1].padStart(2, '0')}`;
    }
  }

  return null;
}

/* ─── Time normalization ──────────────────────────── */

function normalizeTime(raw: string): string | null {
  if (!raw) return null;

  // HH:MM or HH:MM:SS
  const timeMatch = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (timeMatch) return `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}${timeMatch[3] ? ':' + timeMatch[3] : ':00'}`;

  // H.MM or HH.MM
  const dotMatch = raw.match(/^(\d{1,2})\.(\d{2})$/);
  if (dotMatch) return `${dotMatch[1].padStart(2, '0')}:${dotMatch[2]}:00`;

  return null;
}

/* ─── Main parser ─────────────────────────────────── */

export function parseAttendanceCsv(content: string, fileName: string): ParsedAttendance {
  const warnings: string[] = [];
  const validRows: AttendanceRecord[] = [];
  const invalidRows: { rowIndex: number; rawData: Record<string, string>; errors: string[] }[] = [];

  const parsed = Papa.parse<RawRow>(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (parsed.errors.length > 0) {
    warnings.push(...parsed.errors.map((e) => `CSV row ${e.row}: ${e.message}`));
  }

  for (let i = 0; i < parsed.data.length; i++) {
    const row = parsed.data[i];
    const errors: string[] = [];

    // Extract fields with flexible column mapping
    const nissRaw = findColumn(row, ['niss', 'insz', 'bis', 'rijksregisternummer', 'numnat', 'nationalNumber', 'workerID', 'id']);
    const limosaRaw = findColumn(row, ['limosa', 'limosaId', 'limosaL1', 'l1']);
    const workplaceRaw = findColumn(row, ['workplace', 'workplaceId', 'workplaceID', 'site', 'siteId', 'chantier', 'werf']);
    const dateRaw = findColumn(row, ['date', 'dateOfPresence', 'datum', 'datePresence', 'dag']);
    const arrivalRaw = findColumn(row, ['arrival', 'timeOfArrival', 'aankomst', 'arrivee', 'startTime', 'start', 'begin']);
    const departureRaw = findColumn(row, ['departure', 'timeOfDeparture', 'vertrek', 'depart', 'endTime', 'end', 'einde']);
    const typeRaw = findColumn(row, ['type', 'declarationType', 'regime', 'sector']);
    const nameRaw = findColumn(row, ['name', 'workerName', 'naam', 'nom', 'employee']);
    const enterpriseRaw = findColumn(row, ['enterprise', 'enterpriseNumber', 'ondernemingsnummer', 'kbo', 'bce']);

    // Validate NISS / BIS / Limosa
    let nissValid = true;
    let sanitizedNiss = nissRaw;

    if (nissRaw) {
      const nissResult = validateNiss(nissRaw);
      if (!nissResult.isValid) {
        // Try BIS
        const bisResult = validateBis(nissRaw);
        if (!bisResult.isValid) {
          nissValid = false;
          errors.push(`NISS/BIS checksum failed: ${nissRaw} (${nissResult.errorReason})`);
        } else {
          sanitizedNiss = bisResult.sanitizedValue;
        }
      } else {
        sanitizedNiss = nissResult.sanitizedValue;
      }
    } else if (limosaRaw) {
      const limResult = validateLimosa(limosaRaw);
      if (!limResult.isValid) {
        errors.push(`Limosa validation failed: ${limosaRaw} (${limResult.errorReason})`);
      }
    } else {
      errors.push('No NISS/BIS or Limosa ID found');
    }

    // Validate date
    const normalizedDate = normalizeDate(dateRaw);
    if (!normalizedDate) {
      errors.push(`Invalid or missing date: "${dateRaw}"`);
    }

    // Validate workplace
    if (!workplaceRaw) {
      errors.push('Missing workplace ID');
    }

    // Determine type
    const isCiao = typeRaw.toLowerCase().includes('ciao') || typeRaw.toLowerCase().includes('cleaning') || typeRaw.toLowerCase().includes('schoonmaak') || !!arrivalRaw;
    const declarationType: 'checkinatwork' | 'ciao' = isCiao ? 'ciao' : 'checkinatwork';

    // Normalize times (only for CIAO)
    const normalizedArrival = normalizeTime(arrivalRaw);
    const normalizedDeparture = normalizeTime(departureRaw);

    if (isCiao && !normalizedArrival) {
      errors.push(`CIAO requires arrival time, got: "${arrivalRaw}"`);
    }

    if (errors.length > 0) {
      invalidRows.push({
        rowIndex: i,
        rawData: row as Record<string, string>,
        errors,
      });
    } else {
      validRows.push({
        niss: sanitizedNiss,
        limosaId: limosaRaw ? validateLimosa(limosaRaw).sanitizedValue : undefined,
        workplaceId: workplaceRaw,
        enterpriseNumber: enterpriseRaw || undefined,
        dateOfPresence: normalizedDate!,
        timeOfArrival: normalizedArrival || undefined,
        timeOfDeparture: normalizedDeparture || undefined,
        restBreaks: undefined,
        declarationType,
        workerName: nameRaw || undefined,
      });
    }
  }

  return {
    fileName,
    validRows,
    invalidRows,
    aiCorrections: [], // Populated after AI fallback
    warnings,
  };
}
