#!/bin/bash
# PreToolUse (Edit|Write|MultiEdit|NotebookEdit): block edits to committed migrations and secret files.
# Exit 2 blocks; stderr is shown to Claude as the reason.
set -uo pipefail

input=$(cat)
file=$(jq -r '.tool_input.file_path // .tool_input.notebook_path // empty' <<<"$input")
[ -z "$file" ] && exit 0

# Resolve the root from the file itself: inside a worktree CLAUDE_PROJECT_DIR points at the main checkout.
dir=$(dirname "$file")
while [ ! -d "$dir" ] && [ "$dir" != "/" ]; do dir=$(dirname "$dir"); done
root=$(git -C "$dir" rev-parse --show-toplevel 2>/dev/null)
if [ -n "$root" ]; then
  rel="$(git -C "$dir" rev-parse --show-prefix)${file#"$dir"/}"
else
  rel="$file"
fi

case "$rel" in
  db/migrations/*.sql)
    if git -C "$root" cat-file -e "HEAD:$rel" 2>/dev/null; then
      echo "Blocked: $rel is committed. Schema changes go in a new numbered migration." >&2
      exit 2
    fi ;;
  .env|*/.env|.env.local|*/.env.local|*.env.*.local)
    echo "Blocked: $rel holds secrets set by a person. Agents do not write it." >&2
    exit 2 ;;
esac
exit 0
