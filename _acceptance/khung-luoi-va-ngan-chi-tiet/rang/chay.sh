#!/usr/bin/env bash
# Commands of the record khung-luoi-va-ngan-chi-tiet (VP10), one per eval group, run from the repository root.
# Usage: bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh <E-id>
set -euo pipefail
cd "$(dirname "$0")/../../.."

pw() { npx playwright test "$@" --reporter=list; }

case "${1:-}" in
  E1) pw tests/e2e/ho-so-can.spec.ts -g "E2 · the record floats beside the grid" ;;
  E2) pw tests/e2e/khung-luoi-nut.spec.ts -g "Q3 · " ;;
  E3) pw tests/e2e/ghim-ngan.spec.ts ;;
  E4) pw tests/e2e/khung-luoi-nut.spec.ts -g "Q2 · " ;;
  E5) pw tests/e2e/ho-so-can.spec.ts -g "toolbar" ;;
  E6) pw tests/e2e/ho-so-can.spec.ts -g "the record head on one line" ;;
  E7) pw tests/e2e/ho-so-can.spec.ts -g "44 px to press on a phone" ;;
  E8) pw tests/e2e/the-dien-thoai.spec.ts tests/e2e/sheet.spec.ts -g "vung-cham|sheet tab stops|tiep-can" ;;
  E9) pw tests/e2e/khung-luoi-nut.spec.ts -g "L2 · " ;;
  E10) pw tests/e2e/khung-luoi-nut.spec.ts -g "L3 · " ;;
  E11) pw tests/e2e/sheet.spec.ts -g "header buttons in view" ;;
  E12) pw tests/e2e/khung-luoi-nut.spec.ts -g "L6 · " ;;
  E20) pw tests/e2e/khung-luoi-nut.spec.ts -g "Đã gửi · " ;;
  E15) make -s design-role-table && DB_LANE="${DB_LANE:-h}" DB_PORT="${DB_PORT:-5567}" npx playwright test -c playwright.db.config.ts --reporter=list ;;
  E16) git diff --exit-code --stat "$(git merge-base HEAD origin/main)" HEAD -- src/components/ui src/components/reui && echo "vendor folders untouched" ;;
  *) echo "chay.sh: unknown eval '${1:-}'" >&2; exit 2 ;;
esac
