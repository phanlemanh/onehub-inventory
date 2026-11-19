#!/bin/bash
# For each merged PR: find merge-backs of main into the PR branch, replay them with merge-tree, report conflicted ledger files.
LEDGERS='^(wiki/log\.md|wiki/index\.md|ontology/glossary\.md|src/generated/ontology\.ts)$'
cd /Users/manh-macmini/dev/onehub-inventory
tot_mb=0; tot_conf=0; tot_ledger=0; prs_ledger=0
while read -r pr M at; do
  git cat-file -e "$M^2" 2>/dev/null || { echo "PR $pr: not a merge commit (skip)"; continue; }
  mbs=0; conf=0; led=0; files=""
  for c in $(git rev-list --merges "$M^1..$M^2"); do
    a=$(git rev-parse "$c^1"); b=$(git rev-parse "$c^2")
    # merge-back = second parent already on main before the PR merged
    git merge-base --is-ancestor "$b" "$M^1" || continue
    mbs=$((mbs+1))
    out=$(GIT_ATTR_SOURCE="$a" git merge-tree --write-tree --name-only "$a" "$b" 2>/dev/null); rc=$?
    if [ $rc -eq 1 ]; then
      conf=$((conf+1))
      cf=$(echo "$out" | sed -n '2,/^$/p' | grep -v '^$' | sort -u)
      lf=$(echo "$cf" | grep -E "$LEDGERS" | tr '\n' ' ')
      [ -n "$lf" ] && { led=$((led+1)); files="$files $lf"; }
    fi
  done
  tot_mb=$((tot_mb+mbs)); tot_conf=$((tot_conf+conf)); tot_ledger=$((tot_ledger+led)); [ $led -gt 0 ] && prs_ledger=$((prs_ledger+1))
  echo "PR $pr ($at): merge-backs=$mbs conflicted=$conf ledger-conflicted=$led ${files:+[$(echo $files | tr ' ' '\n' | sort -u | tr '\n' ' ')]}"
done < "$1"
echo "TOTAL: PRs=$(wc -l < "$1" | tr -d ' ') merge-backs=$tot_mb conflicted=$tot_conf ledger-conflicted=$tot_ledger PRs-with-ledger-conflict=$prs_ledger"
