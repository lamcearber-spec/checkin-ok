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

const SYSTEM_PROMPT = `You are a Belgian payroll compliance expert. You receive invalid attendance data rows that failed deterministic validation.

Your task: Fix the data so it passes validation.

**NISS/INSZ validation rules:**
- 11 digits total, format: YY.MM.DD-NNN.CC
- Checksum: CC = 97 - (first9digits mod 97). If result = 0, CC = 97.
- Post-2000 births: CC = 97 - ((2000000000 + first9digits) mod 97)
- BIS numbers: month + 20 (unknown gender) or month + 40 (known gender)
- Common OCR errors: O↔0, l↔1, B↔8, S↔5, Z↔2

**Limosa L1 rules:**
- Alphanumeric, spaces, hyphens allowed
- Max 64 characters

**Date/Time rules:**
- Dates must be ISO 8601 (YYYY-MM-DD)
- Times must be HH:MM:SS
- Convert natural language ("7am" → "07:00:00", "3:30pm" → "15:30:00")

**Data separation:**
- Detect concatenated names+IDs: "JanJansen_24911834005214037" → name: "Jan Jansen", limosa: "24911834005214037"

Respond ONLY with valid JSON:
{
  "correctedNiss": "string or null",
  "correctedDate": "string or null",
  "correctedName": "string or null",
  "correctedLimosaId": "string or null",
  "correctedArrival": "string or null",
  "correctedDeparture": "string or null",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation"
}`;

const CONFIDENCE_THRESHOLD = 0.85;

async function callAzureOpenAI(invalidRow: Record<string, string>, errors: string[]): Promise<Partial<AiCorrection> | null> {
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
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
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
