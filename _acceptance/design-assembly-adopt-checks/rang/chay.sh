#!/usr/bin/env bash
# Commands of this record that are not shared repository commands (LENH-HO-SO).
#   chay.sh pointers   AC-2 measure
#   chay.sh shape      AC-4 measure
#   chay.sh rules      AC-5 measure
#   chay.sh two-way    both measures, green on the repository and red on broken copies
#   chay.sh unit       AC-3: the two unit test files the rows now point at
set -euo pipefail
cd "$(dirname "$0")/../../.."
HERE=_acceptance/design-assembly-adopt-checks/rang
case "${1:-}" in
  pointers) node "$HERE/kiem.mjs" pointers ;;
  shape) node "$HERE/kiem.mjs" shape ;;
  rules) node "$HERE/kiem.mjs" rules ;;
  two-way) node --test "$HERE/hai-chieu.mjs" ;;
  unit) npx vitest run tests/format.test.ts tests/grid.test.tsx --coverage.enabled=false --reporter=verbose ;;
  *) echo "usage: chay.sh pointers|rules|shape|two-way|unit" >&2; exit 2 ;;
esac
