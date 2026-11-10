---
name: new-migration
description: Create a new PostgreSQL migration for onehub-inventory with the company isolation rules, least-privilege grants and a case in the isolation suite. Use when adding or changing a table, column, index or constraint.
---

# New migration

1. **Number:** `ls db/migrations/`, take the highest number plus one, three digits. Name: `NNN_lower_snake_case.sql`.
2. **First line:** what the migration does and why, naming the wiki decision if there is one.
3. **Company table** (almost every table):
   - `company_id uuid not null references companies (id)`
   - `alter table ... enable row level security;` and `force row level security;`
   - read and write policies on the current company; write policies have `with check`
   - grants to the application role only, nothing more. The role must not own the table.
4. **Names** follow RESO when it defines the concept. Otherwise add the concept through `/ontology-add`.
5. **Personal data:** mark the property `pii: true` in `ontology/`. Tests and fixtures use `[Tên]` and `0900 000 0xx`.
6. **Isolation suite:** add a case proving one company cannot read or write another company's rows in the new table.
7. **Run:** the database step of `/verify`. A migration must be safe to run twice: the second run applies nothing.

A committed migration is never edited; a hook blocks it. Write a new one.
