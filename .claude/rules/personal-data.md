---
paths:
  - "src/**"
  - "tests/**"
  - "docs/**"
  - "wiki/**"
---

# Personal data and secrets

- No real names, phone numbers or addresses in code, tests, fixtures or docs. Use `[Tên]` and `0900 000 0xx`.
- Keys and connection strings live only in `.env.local`. New variables are declared in `.env.example`.
- Data leaving the company is built from the redaction rule and the data class ceilings, never hidden in the UI.
