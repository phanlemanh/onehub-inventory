---
paths:
  - "db/**"
---

# Database work

- Schema changes are a new numbered file in `db/migrations/`. A committed migration is never edited (a hook blocks it).
- Every company table has `company_id`, enabled and forced row level security, and one case in the isolation suite.
