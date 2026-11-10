# Claude Code

@AGENTS.md

Product rules: `PRODUCT-INVARIANTS.md`. Cite the `SP-<n>` code when a change breaks one. Only the owner edits that file.

## Claude Code specifics

- This repo keeps its procedures in `.claude/skills/`. Use them instead of improvising:
  `/ontology-add` (new or changed business concept),
  `/wiki-ingest` (record a change, decision or incident),
  `/wiki-query` (answer "why" questions from the wiki),
  `/wiki-health` (periodic check),
  `/review-change` (review a change you did not write),
  `/new-migration` (add or change the schema),
  `/verify` (check before a commit or before saying done).
