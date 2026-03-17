# Checkin OK — Technical Research Summary

## System Overview
- **Checkinatwork (C@W):** Daily boolean presence registration (SOAP/XML)
- **CIAO (Check In And Out):** Granular IN/OUT/BREAK timestamping (REST/XML)
- **NSSO XSD:** v1.13 schema
- **Namespaces:** `v1=http://socialsecurity.be/presenceregistration/v1`, `v11=http://socialsecurity.be/presenceregistration/schemas/v1`
- **Sim endpoint:** `https://services-sim.socialsecurity.be/REST/presenceRegistration/v1`

## Joint Committees
| JC | Sector | System | Threshold |
|----|--------|--------|-----------|
| 124 | Construction | C@W | Works >€500K excl. VAT |
| 121 | Cleaning | CIAO | All immovable property, no threshold |
| 118 | Meat Processing | C@W | FASFC sites, no threshold |
| 317 | Security | C@W | All guarding |

## Identity Validation (Modulo-97)

### NISS (Belgian nationals): 11 digits = YYMMDD-SEQ-CC
- Pre-2000: CC = 97 - (N mod 97) where N = first 9 digits
- Post-2000: CC = 97 - ((2000000000 + N) mod 97)
- SEQ odd = male, even = female

### BIS (non-residents): same structure, mutated month
- Unknown gender: MM + 20 (range 21-32)
- Known gender: MM + 40 (range 41-52)
- Day/month can be 00 for unknown DOB

### Limosa: L-prefix alphanumeric, maps to `LimosaDeclaration` node (NOT `INSS`)

## NSSO Error Codes
| Code | Meaning |
|------|---------|
| 2, 3 | Invalid KBO/BCE number |
| 4 | Invalid WorkPlaceId (malformed, expired, or unlinked) |
| 5 | Invalid INSS (Mod-97 fail or deprecated) |
| 6 | Invalid date (retroactive blocked, 30-day correction window) |

## Key Rules
- RegistrationDate: current day or tomorrow only
- CompanyID = direct employer (subcontractor KBO, not prime contractor)
- Temp agencies: agency KBO in CompanyID, client WorkPlaceId
- Night shifts: register on shift start date only
- CIAO: mandatory IN→OUT pairs with BREAK demarcation
- Batch limit: 200 registrations per HTTP request
- No UPDATE operation: must CANCEL + re-REGISTER
- CancellationReason enum: SICKNESS, HOLIDAY, ERROR

## Fines
- €600–€6,000 per unregistered employee
- €300–€3,000 administrative supplement
- Article 30bis invoice withholding for systemic non-compliance
