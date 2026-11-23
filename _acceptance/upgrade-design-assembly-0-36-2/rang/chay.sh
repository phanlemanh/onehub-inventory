#!/usr/bin/env bash
# Commands of this record that are not shared repository commands (LENH-HO-SO).
#   chay.sh <mode>     one measure of kiem.mjs: gate|tool|font|rules|adopt|states|changes
#   chay.sh two-way    every measure green on a clean copy and red, with its pinned line, on a broken one
#   chay.sh two-way <pattern>   only the pairs whose name matches
set -euo pipefail
cd "$(dirname "$0")/../../.."
HERE=_acceptance/upgrade-design-assembly-0-36-2/rang
case "${1:-}" in
  gate|tool|font|rules|adopt|states|changes) node "$HERE/kiem.mjs" "$1" ;;
  two-way) if [ -n "${2:-}" ]; then node --test --test-name-pattern "$2" "$HERE/hai-chieu.mjs"; else node --test "$HERE/hai-chieu.mjs"; fi ;;
  *) echo "usage: chay.sh gate|tool|font|rules|adopt|states|changes|two-way [pattern]" >&2; exit 2 ;;
esac
