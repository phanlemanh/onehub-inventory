---
name: verify
description: Check onehub-inventory before a commit or before saying a task is done. Use when asked to verify, or right before committing a code change.
---

# Verify

Run from the repo root, in order. Stop at the first red step and report the exact error.

1. `make check`
2. `npm run build`, when `src/` or a dependency changed.
3. `make e2e`, when anything visible changed. Every new screen must already be in the axe test.
4. When `db/` changed: `make db-up DB_LANE=<lane> DB_PORT=<port>`, apply the migrations, run the isolation suite, then `make db-down DB_LANE=<lane>`.

Report one table: step, result, tests passed or failed. Give the reason for any skipped step. Never report done while a step is red.
