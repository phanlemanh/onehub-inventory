#!/usr/bin/env bash
# E4 (AC-7): former screen ids — closed contracts pass, open ones are red — in both register readers, then the break pair:
# a copy of the role × screen check that lets open contracts use old ids must turn the open case red.
set -u
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$ROOT" || exit 2
T=tests/screen-old-ids.test.ts
out="$(npx vitest run "$T" --coverage.enabled=false --reporter=verbose 2>&1)"; rc=$?
printf '%s\n' "$out"
[ $rc -eq 0 ] || { echo "old-ids: tests red"; exit 1; }
n="$(printf '%s\n' "$out" | grep -cE '✓ .*old-ids: (closed contract passes|open contract uses tuy-chinh-san) — (coverage matrix|proof gate)')"
echo "old-ids: $n/4"
[ "$n" -eq 4 ] || exit 1

# Break pair: open contracts may use old ids in a copy of tools/coverage_matrix.
BROKEN="$(mktemp -d "${TMPDIR:-/tmp}/old-ids-pha.XXXX")"
cp -R tools/coverage_matrix "$BROKEN/coverage_matrix"
cp tools/*.py "$BROKEN/" 2>/dev/null || true
python3 - "$BROKEN/coverage_matrix/contracts.py" <<'PY'
import sys
p = sys.argv[1]
t = open(p).read()
old = "            if status not in CLOSED:\n"
assert old in t, "break point moved"
open(p, "w").write(t.replace(old, "            if False:\n"))
PY
pout="$(OLD_IDS_COVERAGE="$BROKEN/coverage_matrix/check.py" npx vitest run "$T" -t 'open contract uses tuy-chinh-san — coverage matrix' --coverage.enabled=false --reporter=verbose 2>&1)"; prc=$?
if [ $prc -ne 0 ] && printf '%s' "$pout" | grep -q "old-ids: open contract uses tuy-chinh-san"; then
  echo "pha-thu-mo-dung-ma-cu: do dung cho — old-ids: open contract uses tuy-chinh-san"
else
  printf '%s\n' "$pout" | tail -20
  echo "pha-thu-mo-dung-ma-cu: KHONG do — the break pair did not turn the open case red"
  exit 1
fi
