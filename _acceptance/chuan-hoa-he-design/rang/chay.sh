#!/usr/bin/env bash
# Commands of the record chuan-hoa-he-design (VP11, slice 1), one per eval group, run from the repository root.
# Usage: bash _acceptance/chuan-hoa-he-design/rang/chay.sh <E-id>
set -euo pipefail
cd "$(dirname "$0")/../../.."

pw() { npx playwright test "$@" --reporter=list; }

case "${1:-}" in
  E1) pw tests/e2e/chuan-hoa-mau.spec.ts -g "AC-1 · " ;;
  E3) pw tests/e2e/chuan-hoa-mau.spec.ts -g "AC-2 · " ;;
  E4) pw tests/e2e/chuan-hoa-mau.spec.ts -g "AC-3 · " ;;
  E19) pw tests/e2e/chuan-hoa-mau.spec.ts -g "AC-11 · " ;;
  E5) pw tests/e2e/chuan-hoa-sua-o.spec.ts -g "AC-4 · " && npx vitest run src/components/candidate/data-region-keys.test.tsx --coverage.enabled=false --reporter=verbose ;;
  E6) pw tests/e2e/chuan-hoa-sua-o.spec.ts -g "AC-5 · " ;;
  E7) pw tests/e2e/chuan-hoa-sua-o.spec.ts -g "AC-6 · " ;;
  E8) pw tests/e2e/chuan-hoa-sua-o.spec.ts -g "AC-7 · " ;;
  E9) pw tests/e2e/chuan-hoa-tro-giup.spec.ts ;;
  E18) DB_LANE="${DB_LANE:-vp11}" DB_PORT="${DB_PORT:-5568}" npx playwright test -c playwright.db.config.ts tests/e2e-db/chuan-hoa-ghi-mot-lan.spec.ts --reporter=list ;;
  E12) make -s design-role-table && DB_LANE="${DB_LANE:-vp11}" DB_PORT="${DB_PORT:-5568}" npx playwright test -c playwright.db.config.ts --reporter=list ;;
  E13) git diff --exit-code --stat "$(git merge-base HEAD origin/main)" HEAD -- src/components/ui src/components/reui && echo "vendor folders untouched" ;;
  *) echo "chay.sh: unknown eval '${1:-}'" >&2; exit 2 ;;
esac
