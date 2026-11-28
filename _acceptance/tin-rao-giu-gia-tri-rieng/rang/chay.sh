#!/usr/bin/env bash
# Commands of the record tin-rao-giu-gia-tri-rieng (row 3h), one per eval, run from the repository root.
# Usage: bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh <E-id>
# Every command names the cases it runs and fails when none of them ran: a filter that matches nothing exits 0 in
# vitest and Playwright, and a record must not pass on nothing (G-2811-52).
set -euo pipefail
cd "$(dirname "$0")/../../.."

export DB_LANE="${DB_LANE:-r}" DB_PORT="${DB_PORT:-5565}"
DB_TEST=tests/db/tin-rao-gia-tri-rieng.db.test.ts
SPEC=tests/e2e-db/tin-rao-gia-tri-rieng.spec.ts

# ran <log> <pattern> <at least>: fails unless at least that many passed cases name the pattern.
ran() {
  local n
  n="$(grep -E "✓" "$1" | grep -cE -- "$2" || true)"
  if [ "$n" -lt "$3" ]; then echo "chay.sh: ${n} passed case(s) named «$2», want at least $3" >&2; exit 1; fi
  echo "chay.sh: ${n} passed case(s) named «$2»"
}

# vt <pattern> <at least> <vitest args…>: unit or database tests, by case name.
vt() {
  local pattern="$1" least="$2" log
  shift 2
  log="$(mktemp)"
  npx vitest run "$@" --coverage.enabled=false --reporter=verbose -t "$pattern" | tee "$log"
  ran "$log" "$pattern" "$least"
}

# pw <pattern> <at least> <playwright args…>: browser tests on the lane's Postgres, by case name.
pw() {
  local pattern="$1" least="$2" log
  shift 2
  log="$(mktemp)"
  npx playwright test -c playwright.db.config.ts "$@" -g "$pattern" --reporter=list | tee "$log"
  ran "$log" "$pattern" "$least"
}

case "${1:-}" in
  E1b) vt "doc-gia-tri-rieng" 1 -c vitest.db.config.ts "$DB_TEST" ;;
  E2b) pw "o-dien-tich" 2 "$SPEC" --project=1024 --project=1440 ;;
  E3) pw "sua-nam-truong" 4 "$SPEC" ;;
  E4) pw "dau-khac" 2 "$SPEC" --project=360 --project=1440 ;;
  E5) pw "lay-lai" 2 "$SPEC" --project=360 --project=1440 ;;
  E6) vt "danh-muc-khong-de" 1 -c vitest.db.config.ts "$DB_TEST" ;;
  E7) vt "nhap-tep-gia-tri-tep|doc-lai-lan-nhap-cu" 2 -c vitest.db.config.ts "$DB_TEST" ;;
  E8) pw "dau-xem-truoc" 2 "$SPEC" --project=360 --project=1440 ;;
  E9) vt "can-cho-khop" 1 -c vitest.db.config.ts "$DB_TEST" ;;
  E10) vt "gan-sang-can-khac" 1 -c vitest.db.config.ts "$DB_TEST" ;;
  E10b) pw "gan-sang-can-khac-tren-man" 2 "$SPEC" --project=360 --project=1440 ;;
  E11) bash db/scripts/cach-ly.sh
       vt "sua-lay-lai-theo-vai|san-khac-khong-cham|cung-san-khac-nguoi-giu" 3 -c vitest.db.config.ts "$DB_TEST" ;;
  # Row 4's suite, unchanged, then the phone case of row 3h's two cells. The case lives in the listings module: a
  # shared component's test may not import a module (G-2811-52, «sửa sau Cổng Phạm vi»).
  E13) npx vitest run src/modules/listings/edit-rules.test.ts src/modules/listings/save-door.test.ts \
         src/components/candidate/use-change.test.tsx src/components/candidate/data-region-cell-edit.test.tsx \
         --coverage.enabled=false --reporter=verbose
       vt "o-thuoc-tinh-theo-kho" 2 src/modules/listings/ui/attribute-cell-edit.test.tsx ;;
  E14b) pw "khoa-ba-trang-thai" 3 "$SPEC" --project=360 --project=414 --project=1440 ;;
  E15b) pw "than-ho-so" 2 "$SPEC" --project=360 --project=1440 ;;
  *) echo "chay.sh: unknown eval '${1:-}'" >&2; exit 2 ;;
esac
