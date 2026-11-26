#!/usr/bin/env bash
# english-route-names: the record's own test commands (E2, E3, E5, E8), so the grading report names a script that exists
# as their verifier. E5 and E8 read design/role-screen-buttons.md, a generated (gitignored) file: draw it first.
set -u
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$ROOT" || exit 2
case "${1:-}" in
  E2) exec npx vitest run tests/company-layer-route.test.ts src/modules/company-config/ui --coverage.enabled=false --reporter=verbose ;;
  E3) exec npx vitest run tests/company-layer-route.test.ts --coverage.enabled=false --reporter=verbose ;;
  E5)
    make design-role-table >/dev/null || exit 1
    exec npx vitest run tests/vai-man-so-man.test.ts tests/vai-man-nut-sinh.test.ts tests/bo-nut-vai-man.test.ts tests/vong-doi-thao-tac.test.ts tests/coverage-matrix.test.ts tools/e2e_templates --coverage.enabled=false --reporter=verbose ;;
  E8)
    make design-role-table >/dev/null || exit 1
    exec npx playwright test tests/e2e/bo-nut.spec.ts --project=1440 ;;
  *) echo "chay.sh: unknown eval '${1:-}' (E2, E3, E5, E8)" >&2; exit 2 ;;
esac
