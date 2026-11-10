---
paths:
  - "src/app/**"
  - "src/components/**"
  - "src/modules/*/ui/**"
---

# UI work

Load the `inventory-ui` skill first. Rules that always apply here:

- Follow the reuse order: reference screen and recipe, then `candidate`, then a ReUI block, then write your own.
- Never hard-code a label: use `label()` from `company-config`, backed by `ontology/labels.yaml`.
- Never edit `src/components/ui` or `src/components/reui`; they are installed by the CLI.
- Every data region covers `design/states.md`. Behaviour comes from `design/behaviors.md`; do not improvise it.
- Internal labels never reach the customer page.
