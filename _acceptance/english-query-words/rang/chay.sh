#!/usr/bin/env bash
# english-query-words: runs the cases each eval names, from the repository root found from this script's own place.
#   bash chay.sh E2 | E3 | E4 | E7
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../../.."
V=(npx vitest run --coverage.enabled=false --reporter=verbose)
case "${1:-}" in
  E2) "${V[@]}" tests/old-query-words.test.ts -t "^(dich|dich-bien|trang) " ;;
  E3) "${V[@]}" tests/old-query-words.test.ts -t "^ghi " ;;
  E4)
    "${V[@]}" tests/unit-jump.test.tsx tests/inventory-page.test.tsx tests/loi-vao-ho-so.test.tsx
    "${V[@]}" tests/old-query-words.test.ts -t "^tu-cu "
    ;;
  E7)
    node _acceptance/english-query-words/rang/query-words.mjs --root . --luu-tru
    "${V[@]}" tests/old-query-words.test.ts -t "^khu-hoi "
    ;;
  *)
    echo "chay.sh: eval khong biet: ${1:-}" >&2
    exit 2
    ;;
esac
