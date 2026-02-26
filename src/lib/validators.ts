/**
 * Belgian Government ID Validation — Cryptographic Modulo-97 Module
 *
 * NISS/INSZ: National Register Number (11 digits)
 *   Pre-2000: CC = 97 - (first9digits mod 97), if 0 then 97
 *   Post-2000: CC = 97 - ((2000000000 + first9digits) mod 97)
 *
 * BIS: Same structure but month inflated (+20 unknown gender, +40 known gender)
 *   Refugees: handle 00 day/month without fatal error
 *
 * Limosa L1: Alphanumeric, max 64 chars
 */

import type { ValidationResult } from '@/schema/attendanceSchema';

/* ─── NISS Validation ─────────────────────────────── */

export function validateNiss(raw: string): ValidationResult {
  // Strip formatting characters
  const cleaned = raw.replace(/[\s.\-\/]/g, '');

  // Must be exactly 11 digits
  if (!/^\d{11}$/.test(cleaned)) {
    return {
      isValid: false,
      sanitizedValue: cleaned,
      errorReason: cleaned.length !== 11 ? 'invalid_length' : 'invalid_characters',
    };
  }

  const first9 = parseInt(cleaned.substring(0, 9), 10);
  const checkDigits = parseInt(cleaned.substring(9, 11), 10);

  // Try pre-2000 birth first
  let expected = 97 - (first9 % 97);
  if (expected === 0) expected = 97;

  if (expected === checkDigits) {
    return { isValid: true, sanitizedValue: cleaned, errorReason: 'none' };
  }

  // Try post-2000 birth (prepend 2)
  const post2000 = 2000000000 + first9;
  let expectedPost = 97 - (post2000 % 97);
  if (expectedPost === 0) expectedPost = 97;

  if (expectedPost === checkDigits) {
    return { isValid: true, sanitizedValue: cleaned, errorReason: 'none' };
  }

  return {
    isValid: false,
    sanitizedValue: cleaned,
    errorReason: 'invalid_checksum',
  };
}

/* ─── BIS Validation ──────────────────────────────── */

export function validateBis(raw: string): ValidationResult {
  const cleaned = raw.replace(/[\s.\-\/]/g, '');

  if (!/^\d{11}$/.test(cleaned)) {
    return {
      isValid: false,
      sanitizedValue: cleaned,
      errorReason: cleaned.length !== 11 ? 'invalid_length' : 'invalid_characters',
    };
  }

  // BIS numbers have inflated months: +20 (unknown gender) or +40 (known gender)
  const monthRaw = parseInt(cleaned.substring(2, 4), 10);
  const dayRaw = parseInt(cleaned.substring(4, 6), 10);

  // Detect BIS: month > 12 (inflated) or month == 0 (refugee)
  const isBis = monthRaw > 12 || monthRaw === 0;

  if (!isBis) {
    // Not a BIS number — could be normal NISS, validate as NISS
    return validateNiss(raw);
  }

  // For refugees: day/month can be 00, don't reject
  // Validate checksum same as NISS (against raw digits, NOT normalized)
  const first9 = parseInt(cleaned.substring(0, 9), 10);
  const checkDigits = parseInt(cleaned.substring(9, 11), 10);

  // Try pre-2000
  let expected = 97 - (first9 % 97);
  if (expected === 0) expected = 97;

  if (expected === checkDigits) {
    return { isValid: true, sanitizedValue: cleaned, errorReason: 'none' };
  }

  // Try post-2000
  const post2000 = 2000000000 + first9;
  let expectedPost = 97 - (post2000 % 97);
  if (expectedPost === 0) expectedPost = 97;

  if (expectedPost === checkDigits) {
    return { isValid: true, sanitizedValue: cleaned, errorReason: 'none' };
  }

  return {
    isValid: false,
    sanitizedValue: cleaned,
    errorReason: 'invalid_checksum',
  };
}

/* ─── Limosa L1 Validation ────────────────────────── */

const LIMOSA_REGEX = /^[\da-zA-Z\s/\-]*$/;
const LIMOSA_MAX_LENGTH = 64;

export function validateLimosa(raw: string): ValidationResult {
  // Strip whitespace, colons, formatting chars
  const cleaned = raw.replace(/[\s:;,]/g, '').trim();

  if (cleaned.length === 0) {
    return { isValid: false, sanitizedValue: '', errorReason: 'invalid_length' };
  }

  if (cleaned.length > LIMOSA_MAX_LENGTH) {
    return { isValid: false, sanitizedValue: cleaned, errorReason: 'invalid_length' };
  }

  if (!LIMOSA_REGEX.test(cleaned)) {
    return { isValid: false, sanitizedValue: cleaned, errorReason: 'invalid_characters' };
  }

  return { isValid: true, sanitizedValue: cleaned, errorReason: 'none' };
}

/* ─── Smart Detect: NISS vs BIS ───────────────────── */

export function validateId(raw: string): ValidationResult & { idType: 'niss' | 'bis' | 'limosa' | 'unknown' } {
  const cleaned = raw.replace(/[\s.\-\/]/g, '');

  // If it's 11 digits, try NISS then BIS
  if (/^\d{11}$/.test(cleaned)) {
    const monthRaw = parseInt(cleaned.substring(2, 4), 10);

    if (monthRaw > 12) {
      // BIS number (inflated month)
      const result = validateBis(raw);
      return { ...result, idType: 'bis' };
    }

    // Try as NISS
    const nissResult = validateNiss(raw);
    if (nissResult.isValid) {
      return { ...nissResult, idType: 'niss' };
    }

    // Try as BIS (some edge cases with month == 0 for refugees)
    const bisResult = validateBis(raw);
    if (bisResult.isValid) {
      return { ...bisResult, idType: 'bis' };
    }

    return { ...nissResult, idType: 'unknown' };
  }

  // Otherwise try Limosa
  const limosaResult = validateLimosa(raw);
  if (limosaResult.isValid) {
    return { ...limosaResult, idType: 'limosa' };
  }

  return {
    isValid: false,
    sanitizedValue: cleaned,
    errorReason: 'format_error',
    idType: 'unknown',
  };
}
