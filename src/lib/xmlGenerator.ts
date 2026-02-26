/**
 * NSSO XML Generator — XSD v1.13 PresenceRegistration
 *
 * Two payload types:
 * - Checkinatwork (construction): daily presence only
 * - CIAO (cleaning): real-time timestamps with rest breaks
 *
 * Uses xml2js Builder for XML construction.
 * Runs local XSD validation before output.
 */

import { Builder } from 'xml2js';
import type { AttendanceRecord } from '@/schema/attendanceSchema';

/* ─── XSD Validation (local, pre-transmission) ─────── */

interface XsdError {
  field: string;
  message: string;
}

function validateRecord(record: AttendanceRecord): XsdError[] {
  const errors: XsdError[] = [];

  // NISS or Limosa required
  if (!record.niss && !record.limosaId) {
    errors.push({ field: 'NissId/LimosaId', message: 'Either NISS or Limosa ID is required' });
  }

  // NISS format: 11 digits
  if (record.niss && !/^\d{11}$/.test(record.niss.replace(/[\s.\-]/g, ''))) {
    errors.push({ field: 'NissId', message: 'NISS must be exactly 11 digits' });
  }

  // Workplace required
  if (!record.workplaceId) {
    errors.push({ field: 'WorkplaceId', message: 'Workplace ID is required' });
  }

  // Date required and valid
  if (!record.dateOfPresence || !/^\d{4}-\d{2}-\d{2}$/.test(record.dateOfPresence)) {
    errors.push({ field: 'DateOfPresence', message: 'Date must be ISO 8601 (YYYY-MM-DD)' });
  }

  // CIAO: arrival time required
  if (record.declarationType === 'ciao' && !record.timeOfArrival) {
    errors.push({ field: 'TimeOfArrival', message: 'CIAO declarations require arrival time' });
  }

  return errors;
}

/* ─── XML Generation ──────────────────────────────── */

export function generateNssoXml(records: AttendanceRecord[]): {
  xml: string;
  errors: { rowIndex: number; errors: XsdError[] }[];
} {
  const allErrors: { rowIndex: number; errors: XsdError[] }[] = [];
  const validRecords: AttendanceRecord[] = [];

  // Pre-validate all records
  for (let i = 0; i < records.length; i++) {
    const recordErrors = validateRecord(records[i]);
    if (recordErrors.length > 0) {
      allErrors.push({ rowIndex: i, errors: recordErrors });
    } else {
      validRecords.push(records[i]);
    }
  }

  if (validRecords.length === 0) {
    return { xml: '', errors: allErrors };
  }

  // Build XML
  const builder = new Builder({
    xmldec: { version: '1.0', encoding: 'UTF-8' },
    renderOpts: { pretty: true, indent: '  ', newline: '\n' },
  });

  const registrations = validRecords.map((record) => {
    const reg: Record<string, unknown> = {};

    // Identification
    if (record.niss) {
      reg['NissId'] = record.niss.replace(/[\s.\-]/g, '');
    } else if (record.limosaId) {
      reg['LimosaId'] = record.limosaId;
    }

    // Enterprise
    if (record.enterpriseNumber) {
      reg['EnterpriseNumber'] = record.enterpriseNumber.replace(/[\s.]/g, '');
    }

    // Workplace
    reg['WorkplaceId'] = record.workplaceId;

    // Checkinatwork: daily presence
    reg['DateOfPresence'] = record.dateOfPresence;

    // CIAO: timestamps
    if (record.declarationType === 'ciao') {
      if (record.timeOfArrival) {
        reg['TimeOfArrival'] = `${record.dateOfPresence}T${record.timeOfArrival}`;
      }
      if (record.timeOfDeparture) {
        reg['TimeOfDeparture'] = `${record.dateOfPresence}T${record.timeOfDeparture}`;
      }
      if (record.restBreaks && record.restBreaks.length > 0) {
        reg['RestBreaks'] = {
          RestBreak: record.restBreaks.map((b) => `${record.dateOfPresence}T${b}`),
        };
      }
    }

    return reg;
  });

  const xmlObj = {
    PresenceRegistrationBatch: {
      $: { xmlns: 'http://www.rsz-onss.fgov.be/presenceregistration/v1.13' },
      PresenceRegistration: registrations,
    },
  };

  const xml = builder.buildObject(xmlObj);

  return { xml, errors: allErrors };
}
