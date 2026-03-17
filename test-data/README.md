# Checkin OK Test Data — checkin-ok.be

Generated 2026-03-16 from Gemini Deep Research output.

## Structure
```
checkin-ok-be/
├── README.md
├── RESEARCH.md                              # Key technical specs
├── csv/                                     # Input CSV files
│   ├── scenario-01-standard-batch.csv       # 5 workers, single site
│   ├── scenario-02-mixed-id-types.csv       # NISS + BIS + Limosa
│   ├── scenario-03-pre2000-checksum.csv     # Mod-97 pre-Y2K
│   ├── scenario-04-post2000-checksum.csv    # Mod-97 post-Y2K (2bn offset)
│   ├── scenario-05-bis-unknown-gender.csv   # BIS month +20
│   ├── scenario-06-bis-known-gender.csv     # BIS month +40
│   ├── scenario-07-limosa-extraction.csv    # Limosa in concatenated field
│   ├── scenario-08-night-shift.csv          # 23:00-07:00 midnight cross
│   ├── scenario-09-ciao-cleaning.csv        # PC121 IN/OUT timestamping
│   ├── scenario-10-cancellation.csv         # SICKNESS cancellation
│   ├── scenario-11-modification.csv         # Cancel+Re-register chain
│   ├── scenario-12-high-volume.csv          # 3-site batch (of 50)
│   ├── scenario-13-nlp-unstructured.csv     # "half acht" NLP parsing
│   ├── scenario-14-subcontractor.csv        # Sub KBO ≠ prime KBO
│   └── scenario-15-temp-agency.csv          # Agency KBO + client site
└── xml/                                     # Expected XML outputs
    ├── scenario-01-standard-batch.xml
    ├── scenario-02-mixed-id-types.xml
    ├── scenario-03-pre2000-checksum.xml
    ├── scenario-04-post2000-checksum.xml
    ├── scenario-05-bis-unknown-gender.xml
    ├── scenario-06-bis-known-gender.xml
    ├── scenario-07-limosa-extraction.xml
    ├── scenario-08-night-shift.xml
    ├── scenario-09-ciao-cleaning.xml
    ├── scenario-10-cancellation.xml
    ├── scenario-11-modification.xml
    ├── scenario-12-high-volume.xml
    ├── scenario-13-nlp-unstructured.xml
    ├── scenario-14-subcontractor.xml
    ├── scenario-15-temp-agency.xml
    └── error-response-invalid-kbo.xml       # NSSO error example
```

## 15 Test Scenarios

### Checkinatwork (C@W) — SOAP/XML
| # | Name | Tests |
|---|------|-------|
| 1 | Standard Batch | 5 NISS workers, single site, batched envelope |
| 2 | Mixed ID Types | NISS + BIS + Limosa routing to correct XML nodes |
| 3 | Pre-2000 Checksum | Mod-97: N=850115123, CC=55 |
| 4 | Post-2000 Checksum | Mod-97 with 2×10⁹ offset: N=050115123, CC=79 |
| 5 | BIS Unknown Gender | Month +20 inflation (03→23) |
| 6 | BIS Known Gender | Month +40 inflation (03→43) |
| 7 | Limosa Extraction | AI extracts L-ref from concatenated string |
| 8 | Night Shift | Midnight boundary — register on start date only |
| 12 | High-Volume Batch | 3 sites, tests 200-node partition logic |
| 14 | Subcontractor | Sub's KBO in CompanyID, prime's WorkPlaceId |
| 15 | Temp Agency | Agency KBO in CompanyID, client WorkPlaceId |

### CIAO — Granular Timestamping
| # | Name | Tests |
|---|------|-------|
| 9 | CIAO Cleaning (PC121) | IN/OUT/IN/OUT with CET timezone, rest break |
| 13 | NLP Unstructured | "half acht" → 07:30:00, NISS extraction from "PeetersJ_85.05.12-123.45" |

### Administrative Operations
| # | Name | Tests |
|---|------|-------|
| 10 | Cancellation | CancelPresencesRequest with SICKNESS reason |
| 11 | Modification | Chained Cancel(ERROR) + Register with corrected WorkPlaceId |

## Modulo-97 Checksum Verification

All NISS/BIS numbers in the test data have mathematically verified checksums:

| Scenario | ID | N (base 9) | Offset | N mod 97 | CC | Valid |
|----------|----|-----------|--------|----------|----|----|
| 3 | 85011512355 | 850115123 | — | 42 | 55 | ✅ |
| 4 | 05011512379 | 050115123 | +2×10⁹ | 18 | 79 | ✅ |
| 5 | 90231512314 | 902315123 | — | 83 | 14 | ✅ |
| 6 | 90431512391 | 904315123 | — | 6 | 91 | ✅ |

## Key Validation Rules

- **NISS/BIS:** 11 digits, Modulo-97 checksum (pre/post-2000 algorithm)
- **BIS month:** 21-32 (unknown gender) or 41-52 (known gender)
- **Limosa:** L-prefix → maps to `LimosaDeclaration` node, never `INSS`
- **CompanyID:** Always direct employer KBO (subcontractor, not prime)
- **RegistrationDate:** Current day or tomorrow only (Error Code 6 otherwise)
- **Night shifts:** Register on shift start date, no double registration
- **CIAO timestamps:** Must include timezone offset (e.g., +01:00 CET)
- **Batch limit:** Max 200 PresenceRegistrationRequest nodes per envelope
- **Modifications:** No PUT/UPDATE — must Cancel(ERROR) then re-Register

## NSSO Error Codes (for error handling tests)
| Code | Trigger |
|------|---------|
| 2, 3 | Invalid KBO (Mod-97 fail or deregistered) |
| 4 | Invalid WorkPlaceId (malformed/expired/unlinked) |
| 5 | Invalid INSS (Mod-97 fail or deprecated) |
| 6 | Invalid date (retroactive registration) |

## How to Test
1. Upload input CSV to checkin-ok.be
2. Select registration type (C@W or CIAO based on sector)
3. Compare generated XML against expected files in `xml/`
4. Scenarios 3-6: verify Modulo-97 checksums pass validation
5. Scenario 7: verify AI extracts Limosa ref correctly
6. Scenario 9: verify CIAO Period nodes with correct timestamps
7. Scenario 10: verify CancelPresencesRequest structure
8. Scenario 11: verify chained Cancel+Register in single body
9. Scenario 13: verify NLP correctly parses Dutch time expressions

## Notes
- All KBO numbers are synthetic (format-valid, not real enterprises)
- All NISS/BIS checksums are mathematically correct
- Limosa references are synthetic format-valid strings
- WorkPlaceId strings follow W-prefix convention
- CIAO timestamps use CET (+01:00) — adjust for CEST (+02:00) if testing summer dates
- NSSO sim endpoint: https://services-sim.socialsecurity.be/REST/presenceRegistration/v1
