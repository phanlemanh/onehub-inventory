#!/usr/bin/env bash
# Row 1u, E3 (AC-3): the cho-tai break is still caught with its old message, the run shows no hydration warning, and
# the register of cho-tai breaks is the one on main. The red side of «no hydration warning» is E5 (same guard).
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$ROOT"
OUT="$(mktemp)"
npx playwright test -g "cho-tai" --project=360 --project=1440 >"$OUT" 2>&1
CODE=$?
fail() { echo "cho-tai-pha: $1"; tail -40 "$OUT"; exit 1; }
[ "$CODE" -eq 0 ] || fail "lượt chạy thoát $CODE"
grep -q "gac-hydration: 0 canh bao" "$OUT" || fail "phep gac khong bao 0 canh bao"
grep -q "Hydration failed" "$OUT" && fail "con canh bao Hydration failed"
for size in 360 1440; do
  grep -E "✓ .*\[$size\] .*pha vung cho-tai: khung cho khong bao gio hien" "$OUT" >/dev/null ||
    fail "ca pha khung cho khong bao gio hien khong dat o $size"
done
BASE="$(git merge-base HEAD origin/main)"
OLD="$(git show "$BASE:tools/e2e_templates/e2e-templates.test.ts" | grep '\["cho-tai",')"
NEW="$(grep '\["cho-tai",' tools/e2e_templates/e2e-templates.test.ts)"
[ "$OLD" = "$NEW" ] || fail "so dang ky ca pha cho-tai khac main"
grep -q 'fail("cho-tai: khung cho khong hien")' tools/e2e_templates/recipes.ts || fail "mat thong diep khung cho khong hien"
echo "cho-tai-pha: ca pha bat dung 'cho-tai: khung cho khong hien' o 360 va 1440, 0 canh bao, so dang ky bang main"
