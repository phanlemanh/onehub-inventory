#!/bin/bash
# Stop: type-check and lint the files changed in this turn. Exit 2 sends the errors back to Claude; the second stop passes.
set -uo pipefail

input=$(cat)
[ "$(jq -r '.stop_hook_active // false' <<<"$input")" = "true" ] && exit 0

cwd=$(jq -r '.cwd // empty' <<<"$input")
root=$(git -C "${cwd:-.}" rev-parse --show-toplevel 2>/dev/null)
cd "${root:-${CLAUDE_PROJECT_DIR:-.}}" || exit 0

changed=$( { git diff --name-only HEAD 2>/dev/null; git ls-files --others --exclude-standard 2>/dev/null; } \
  | grep -E '\.(ts|tsx|mjs)$' | sort -u)
[ -z "$changed" ] && exit 0
[ -x node_modules/.bin/tsc ] || exit 0

report=""
out=$(node_modules/.bin/tsc --noEmit 2>&1)
while read -r f; do
  hit=$(grep -F "$f(" <<<"$out")
  [ -n "$hit" ] && report+="$hit"$'\n'
done <<<"$changed"

files=()
while read -r f; do [ -f "$f" ] && files+=("$f"); done <<<"$changed"
if [ "${#files[@]}" -gt 0 ]; then
  lint=$(node_modules/.bin/eslint --no-warn-ignored "${files[@]}" 2>&1) || report+="$lint"$'\n'
fi

if [ -n "$report" ]; then
  echo "$report" >&2
  exit 2
fi
exit 0
