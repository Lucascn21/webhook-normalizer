# Webhook Normalizer

**Vivo Care Engineering - Take-Home Coding Challenge (Part 3B)**

A NestJS-based webhook event normalizer that deduplicates and orders events according to specified business rules.

---

## Quick Start

```bash
# Install dependencies
npm install

# Run the application
npm run start:dev

# Run all tests
npm test

# Test coverage
npm run test:cov
```

**Endpoint:** `POST http://localhost:3000/webhooks/normalize`

---

## Example

### Input

```json
{
  "events": [
    {
      "event_id": "evt_003",
      "source": "stripe",
      "timestamp": "2025-11-15T10:35:00Z"
    },
    {
      "event_id": "evt_001",
      "source": "github",
      "timestamp": "2025-11-15T10:25:00Z"
    },
    {
      "event_id": "evt_002",
      "source": "shopify",
      "timestamp": "2025-11-15T10:35:00Z"
    }
  ]
}
```

### Output

```json
{
  "ordered_event_ids": ["evt_001", "evt_002", "evt_003"],
  "unique_count": 3,
  "first_timestamp": "2025-11-15T10:25:00Z",
  "last_timestamp": "2025-11-15T10:35:00Z"
}
```

---

## Business Rules

1. **Deduplication by `event_id`:**
   - Keep event with earliest `timestamp`
   - If timestamps are equal, keep lexicographically smaller `source`

2. **Sorting:**
   - Primary: `timestamp` ASC
   - Secondary (ties): `event_id` ASC

---

## Edge Cases Tested

- ✅ Empty events array
- ✅ Single event
- ✅ All duplicate events
- ✅ Timestamp tie-breaks (source comparison)
- ✅ Sorting tie-breaks (event_id comparison)

---

## Key Assumptions

- **Empty array handling:** Treated as valid input, returns empty normalized response (this is a normalizer, not a validator also the requirements state that we can have null timestamps which led me to believe that an empty array is a valid input as in we wouldnt have to return an error for it)
- **Timestamp format:** ISO 8601 validated at the controller layer via `ValidationPipe`.
- **Date parsing:** Using `Date` objects for robustness over string comparison (despite ISO 8601 being lexicographically sortable, and the controller layer already ensuring the incoming data type)

---

## Technical Decisions

- **TDD approach:** Unit tests (service) + integration tests (controller) for reliable, production-ready code
- **NestJS framework:** TypeScript, dependency injection, built-in validation
- **Testing tools:** Jest (unit), Supertest (HTTP integration)
- **Git workflow:** Direct commits to `main` for simplicity; in production would follow GitFlow

---

## Project Structure

```
src/
  webhooks/
    dto/                    # Data Transfer Objects with validation
    test/                   # Test fixtures
    webhooks.controller.ts  # HTTP layer (validation, routing)
    webhooks.service.ts     # Business logic (deduplication, sorting)
    *.spec.ts              # Unit & integration tests
```

---

## Validation

**Request validation** ensures:

- `events` is an array
- Each event has required fields: `event_id`, `source`, `timestamp`
- `timestamp` is valid ISO 8601 format
- Returns `400 Bad Request` for invalid input

---

## Test Suites

**Service Tests (Unit):**

- Empty array handling
- Single event
- Deduplication (earliest timestamp)
- Tie-breaking (lexicographic source)
- Sorting (timestamp → event_id)
- All duplicates edge case

**Controller Tests (Integration-like):**

- Missing/invalid fields validation
- Invalid ISO 8601 timestamp
- Empty array (valid case)
- Full normalization flow

Run: `npm test`

---

**Author:** Lucas Goldental
**Framework:** NestJS 11 + TypeScript
