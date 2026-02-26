import { z } from 'zod';

export const attendanceRecordSchema = z.object({
  niss: z.string(),
  limosaId: z.string().optional(),
  workplaceId: z.string(),
  enterpriseNumber: z.string().optional(),
  dateOfPresence: z.string(),
  timeOfArrival: z.string().optional(),
  timeOfDeparture: z.string().optional(),
  restBreaks: z.array(z.string()).optional(),
  declarationType: z.enum(['checkinatwork', 'ciao']),
  workerName: z.string().optional(),
});

export const validationResultSchema = z.object({
  isValid: z.boolean(),
  sanitizedValue: z.string(),
  errorReason: z.enum([
    'none',
    'invalid_length',
    'invalid_checksum',
    'invalid_date',
    'invalid_characters',
    'format_error',
    'unknown',
  ]),
});

export const aiCorrectionSchema = z.object({
  rowIndex: z.number(),
  originalRow: attendanceRecordSchema,
  correctedNiss: z.string().optional(),
  correctedDate: z.string().optional(),
  correctedName: z.string().optional(),
  correctedLimosaId: z.string().optional(),
  correctedArrival: z.string().optional(),
  correctedDeparture: z.string().optional(),
  confidence: z.number(),
  reasoning: z.string().optional(),
});

export const parsedAttendanceSchema = z.object({
  fileName: z.string(),
  validRows: z.array(attendanceRecordSchema),
  invalidRows: z.array(z.object({
    rowIndex: z.number(),
    rawData: z.record(z.string()),
    errors: z.array(z.string()),
  })),
  aiCorrections: z.array(aiCorrectionSchema),
  warnings: z.array(z.string()),
});

export type AttendanceRecord = z.infer<typeof attendanceRecordSchema>;
export type ValidationResult = z.infer<typeof validationResultSchema>;
export type AiCorrection = z.infer<typeof aiCorrectionSchema>;
export type ParsedAttendance = z.infer<typeof parsedAttendanceSchema>;
