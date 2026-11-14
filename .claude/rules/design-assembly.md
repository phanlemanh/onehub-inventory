---
paths: ["src/**/*.tsx"]
---

# Design rules the gate holds

`make design-assembly` checks what this page lists, and `make check` runs it. A failure names
the decision and what is wrong. `design/decisions.yaml` lists every design decision of this
repository and what holds it. This page is written by the design-assembly scripts: do not edit
it.

## A screen

- An empty state offers a button only where the person can fill the list from this screen; otherwise at most one link inside its words. A link dressed as a button fails the gate.

## No check holds these: a person reviews them

- A screen that needs a concept or an action the data model does not name adds it to `ontology/` first, in the same change, and says in the change's description that the data model changed and a person reviews it before it merges. Only where the repository forbids an agent to change the data model does the agent stop and ask. It never names the concept in a screen alone.
- A row of `design/decisions.yaml` is for a rule a second screen must follow. A choice that only one screen makes stays in that screen.

## After a change

- A value in the stylesheet changed: run `make design-tokens`.
- Never edit by hand the files those commands write, `design/theme.json`, `tools/design-assembly/` or `mk/design-assembly.mk`.
