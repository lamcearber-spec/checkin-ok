import { pdfToImages } from './pdfToImages';
/**
 * AI Fallback — Azure GPT-4o
 *
 * Triggered on deterministic parse failures. Tasks:
 * 1. Typographical substitution (O vs 0, l vs 1)
 * 2. Natural language time extraction
 * 3. Fuzzy data separation (concatenated fields)
 *
 * Returns corrected JSON with confidence score.
 * Only surfaces corrections with confidence >= 0.85
 */

import type { AiCorrection, AttendanceRecord } from '@/schema/attendanceSchema';

const SYSTEM_PROMPT = `You are a Belgian NSSO (RSZ/ONSS) attendance registration compliance expert. You receive invalid attendance data rows that failed deterministic validation. Your task: fix the data so it passes NSSO API validation.

**IDENTITY VALIDATION:**

1. NISS/INSZ (Rijksregisternummer / Numero de Registre National):
   - 11 digits, structure: YYMMDD-SEQ.CC
   - First 6 digits: date of birth (YYMMDD)
   - Next 3 digits (SEQ): daily sequence counter. Odd=male, Even=female.
   - Last 2 digits (CC): Modulo 97 checksum
   - Pre-2000 births: CC = 97 - (first9digits mod 97). If result = 0, CC = 97.
   - Post-2000 births: CC = 97 - ((2000000000 + first9digits) mod 97)

2. BIS Number (non-resident workers):
   - Same 11-digit format and Modulo 97 checksum as NISS
   - Month field is MUTATED to prevent collisions:
     * Gender known: month + 40 (valid months: 41-52)
     * Gender unknown: month + 20 (valid months: 21-32)
   - Day may be 00 if birth date unknown (refugees)
   - Still passes Modulo 97 with the mutated month value

3. Limosa L1 Declaration (posted foreign workers):
   - Format: L-XXXXXXXXXX or similar alphanumeric reference
   - Maps to <v11:LimosaDeclaration> node, NOT <v11:INSS>
   - If input contains "L-" prefix or "Limosa" keyword, route to Limosa field

4. KBO/BCE Enterprise Number:
   - 10 digits, format: 0NNN.NNN.NNN
   - Strip dots, spaces, "BE" prefix
   - Modulo 97 checksum: last 2 digits = 97 - (first8digits mod 97)
   - CompanyID must be the DIRECT EMPLOYER (subcontractor, not prime)
   - For temp agencies (uitzendkrachten): use agency KBO, not client

**COMMON OCR/TYPO CORRECTIONS:**
- O\u21940, l\u21941, I\u21941, B\u21948, S\u21945, Z\u21942
- Strip dots, dashes, spaces from NISS before validation
- "PeetersJ_85.05.12-123.45" \u2192 name: "Peeters J", NISS: "85051212345"

**DATE/TIME RULES:**
- Dates: ISO 8601 (YYYY-MM-DD). Only today or tomorrow accepted by NSSO.
- Times: HH:MM:SS format with timezone +01:00 (CET) or +02:00 (CEST)
- Night shifts crossing midnight: register on SHIFT START date

Belgian time colloquialisms (CRITICAL):
- Dutch: "half acht" = 07:30, "kwart voor negen" = 08:45, "kwart over zeven" = 07:15
- French: "midi et quart" = 12:15, "sept heures et demie" = 07:30, "huit heures moins le quart" = 07:45
- "s morgens" / "s ochtends" = AM, "s middags" / "s avonds" = PM
- "7u" / "7u30" = 07:00 / 07:30 (Belgian Dutch shorthand)
- "7h" / "7h30" = 07:00 / 07:30 (Belgian French shorthand)

**DATA SEPARATION (concatenated fields):**
- "PeetersJ_85.05.12-123.45 starts at half acht" \u2192
  name: "Peeters J", NISS: "85051212345", arrival: "07:30:00"
- "Novak, Ivan - Limosa: L-9876543210" \u2192
  name: "Novak, Ivan", limosaId: "L-9876543210"
- "Site KBO 0412345678 code W123456789" \u2192
  companyId: "0412345678", workplaceId: "W123456789"

**SECTOR ROUTING (Joint Committee):**
- JC 124 (Construction): Checkinatwork (daily boolean, single registration)
- JC 121 (Cleaning): CIAO (granular IN/OUT timestamps with rest breaks)
- JC 118 (Meat processing): Checkinatwork
- JC 317 (Security): Checkinatwork
- If work periods are provided (e.g., "07:00-12:00, 13:00-17:00"), route to CIAO

Respond ONLY with valid JSON:
{
  "correctedNiss": "string or null",
  "correctedDate": "string or null",
  "correctedName": "string or null",
  "correctedLimosaId": "string or null",
  "correctedArrival": "string or null",
  "correctedDeparture": "string or null",
  "correctedCompanyId": "string or null",
  "correctedWorkplaceId": "string or null",
  "detectedSector": "JC124|JC121|JC118|JC317|unknown",
  "registrationType": "checkinatwork|ciao",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation"
}`;

const CONFIDENCE_THRESHOLD = 0.85;

async function callAzureOpenAI(invalidRow: Record<string, string>, errors: string[], imageBuffers?: Array<{buffer: Buffer, mimeType: string}>): Promise<Partial<AiCorrection> | null> {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-12-01-preview';

  if (!endpoint || !apiKey) {
    return null;
  }

  const url = `${endpoint.replace(/\/+$/, '')}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  const userPrompt = [
    'Invalid attendance row data:',
    JSON.stringify(invalidRow, null, 2),
    '',
    'Validation errors:',
    ...errors.map((e) => `- ${e}`),
    '',
    'Fix the data and return corrected values with confidence score.',
  ].join('\n');

  try {
    // Build multimodal content if images available
    const userContent: any[] = [];
    if (imageBuffers && imageBuffers.length > 0) {
      for (const img of imageBuffers) {
        const base64 = img.buffer.toString('base64');
        userContent.push({
          type: 'image_url',
          image_url: { url: `data:${img.mimeType};base64,${base64}`, detail: 'high' },
        });
      }
    }
    userContent.push({ type: 'text', text: userPrompt });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: imageBuffers ? userContent : userPrompt },
        ],
        max_tokens: 512,
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      console.error(`Azure OpenAI error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    return JSON.parse(content);
  } catch (err) {
    console.error('AI fallback error:', err);
    return null;
  }
}

/* ─── Heuristic fallback ──────────────────────────── */

function heuristicCorrect(rawData: Record<string, string>, errors: string[]): Partial<AiCorrection> | null {
  let correctedNiss: string | undefined;

  // Try common OCR substitutions on NISS
  for (const key of Object.keys(rawData)) {
    const val = rawData[key];
    if (!val) continue;

    // Check if it looks like a NISS with OCR errors
    const cleaned = val.replace(/[\s.\-\/]/g, '');
    if (cleaned.length === 11 && /[OolISsBbZz]/.test(cleaned)) {
      const fixed = cleaned
        .replace(/[Oo]/g, '0')
        .replace(/[lI]/g, '1')
        .replace(/[Ss]/g, '5')
        .replace(/[Bb]/g, '8')
        .replace(/[Zz]/g, '2');

      if (/^\d{11}$/.test(fixed)) {
        // Verify checksum
        const first9 = parseInt(fixed.substring(0, 9), 10);
        const cc = parseInt(fixed.substring(9, 11), 10);
        let expected = 97 - (first9 % 97);
        if (expected === 0) expected = 97;

        if (expected === cc) {
          correctedNiss = fixed;
        } else {
          const post2000 = 2000000000 + first9;
          let expectedPost = 97 - (post2000 % 97);
          if (expectedPost === 0) expectedPost = 97;
          if (expectedPost === cc) correctedNiss = fixed;
        }
      }
    }
  }

  if (correctedNiss) {
    return { correctedNiss, confidence: 0.88, reasoning: 'OCR character substitution (O→0, l→1, etc.)' };
  }

  return null;
}

/* ─── Public API ──────────────────────────────────── */

export async function runAiFallback(
  invalidRows: { rowIndex: number; rawData: Record<string, string>; errors: string[] }[],
  originalRows: AttendanceRecord[] | undefined
): Promise<AiCorrection[]> {
  const corrections: AiCorrection[] = [];

  for (const row of invalidRows) {
    // Try Azure OpenAI first
    let result = await callAzureOpenAI(row.rawData, row.errors);

    // Fallback to heuristics
    if (!result) {
      result = heuristicCorrect(row.rawData, row.errors);
    }

    if (!result || (result.confidence !== undefined && result.confidence < CONFIDENCE_THRESHOLD)) {
      // Below threshold — still include for UI display but won't auto-approve
      if (result && result.confidence !== undefined) {
        corrections.push({
          rowIndex: row.rowIndex,
          originalRow: {
            niss: row.rawData['niss'] || row.rawData['insz'] || row.rawData['NISS'] || '',
            workplaceId: row.rawData['workplace'] || row.rawData['workplaceId'] || '',
            dateOfPresence: row.rawData['date'] || row.rawData['datum'] || '',
            declarationType: 'checkinatwork',
          },
          correctedNiss: result.correctedNiss || undefined,
          correctedDate: result.correctedDate || undefined,
          correctedName: result.correctedName || undefined,
          correctedLimosaId: result.correctedLimosaId || undefined,
          correctedArrival: result.correctedArrival || undefined,
          correctedDeparture: result.correctedDeparture || undefined,
          confidence: (result.confidence || 0) * 100,
          reasoning: result.reasoning || undefined,
        });
      }
      continue;
    }

    corrections.push({
      rowIndex: row.rowIndex,
      originalRow: {
        niss: row.rawData['niss'] || row.rawData['insz'] || row.rawData['NISS'] || '',
        workplaceId: row.rawData['workplace'] || row.rawData['workplaceId'] || '',
        dateOfPresence: row.rawData['date'] || row.rawData['datum'] || '',
        declarationType: 'checkinatwork',
      },
      correctedNiss: result.correctedNiss || undefined,
      correctedDate: result.correctedDate || undefined,
      correctedName: result.correctedName || undefined,
      correctedLimosaId: result.correctedLimosaId || undefined,
      correctedArrival: result.correctedArrival || undefined,
      correctedDeparture: result.correctedDeparture || undefined,
      confidence: (result.confidence || 0) * 100,
      reasoning: result.reasoning || undefined,
    });
  }

  return corrections;
}


/**
 * Vision-based attendance extraction from scanned documents.
 * Converts images to GPT-4o vision prompts for direct extraction.
 */
export async function runAiFallbackVision(
  imageBuffers: Array<{buffer: Buffer, mimeType: string}>
): Promise<{ validRows: any[], invalidRows: any[], aiCorrections: any[], warnings: string[] }> {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-12-01-preview';

  if (!endpoint || !apiKey) {
    return { validRows: [], invalidRows: [], aiCorrections: [], warnings: ['Azure OpenAI not configured'] };
  }

  const url = `${endpoint.replace(/\/+$/, '')}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  const userContent: any[] = [];
  for (const img of imageBuffers) {
    const base64 = img.buffer.toString('base64');
    userContent.push({
      type: 'image_url',
      image_url: { url: `data:${img.mimeType};base64,${base64}`, detail: 'high' },
    });
  }
  userContent.push({
    type: 'text',
    text: `Extract ALL attendance records from this scanned document image. Return JSON with this structure:
{
  "rows": [
    {
      "workerName": "string",
      "niss": "11-digit NISS/INSZ or BIS number",
      "date": "YYYY-MM-DD",
      "arrival": "HH:MM:SS or null",
      "departure": "HH:MM:SS or null",
      "companyId": "10-digit KBO or null",
      "workplaceId": "string or null",
      "limosaId": "string or null"
    }
  ],
  "confidence": 0.0-1.0,
  "warnings": ["list of extraction issues"]
}`,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
        max_tokens: 4096,
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) throw new Error(await response.text());
    const result = await response.json();
    const parsed = JSON.parse(result.choices?.[0]?.message?.content || '{}');

    return {
      validRows: parsed.rows || [],
      invalidRows: [],
      aiCorrections: [],
      warnings: parsed.warnings || [],
    };
  } catch (err) {
    return { validRows: [], invalidRows: [], aiCorrections: [], warnings: [(err as Error).message] };
  }
}
