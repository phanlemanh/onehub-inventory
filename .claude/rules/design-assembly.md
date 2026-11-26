---
paths: ["src/**/*.tsx"]
---

# Design rules the gate holds

`make design-assembly` checks what this page lists, and `make check` runs it. A failure names
the decision and what is wrong. `design/decisions.yaml` lists every design decision of this
repository and what holds it. This page is written by the design-assembly scripts: do not edit
it.

## Type

- Running text is set in the typeface the font loader in src/app/layout.tsx sets as `--font-sans` and headings in `var(--font-sans)`, as `src/app/globals.css` sets them today, adopted as found: the gate holds `--font-heading` to it.
- Never name a typeface in a screen or a component: text takes `--font-sans` from the page, and a heading takes `--font-heading`. Another typeface is the owner's answer in the guide, never a class.
- Every typeface the stylesheet names is loaded, or is one every device has: a new one comes with what loads it (an @font-face rule, a font package the stylesheet imports, or the build's own font loader), or the gate fails.

## A screen

- An empty state offers a button only where the person can fill the list from this screen; otherwise at most one link inside its words. A link dressed as a button fails the gate.

## Questions only the owner answers

- A choice that `design/decisions.yaml`, the components and the pages of kinds do not settle is not yours to make alone. Ask it on the decision sheet, `/design-assembly:decide --ask "QUESTION" --recommend TEXT --because TEXT --easy-to-undo` (or `--hard-to-undo`; add `--item decision:ID` when it is about one row of the ledger), and go on with your recommendation: it writes one new file, `design/waiting/<id>.json`, and touches nothing else. Never write an answer for the owner. A judgment you write into the ledger says in its note that a person has not confirmed it, or a question names it: the gate fails otherwise.
- A new kind of screen and the brand colour are the owner's alone. Before you add a page of a new kind of screen, `design/patterns/<kind>.md`, or change the `--primary` line of `:root`, ask with `--item pattern:NAME` or `--item source-color:VALUE`, and stop there: the gate fails on the branch until the owner keeps that very item.

## No check holds these: a person reviews them

- A screen that needs a concept or an action the data model does not name adds it to `ontology/` first, in the same change, and says in the change's description that the data model changed and a person reviews it before it merges. Only where the repository forbids an agent to change the data model does the agent stop and ask. It never names the concept in a screen alone.
- A row of `design/decisions.yaml` is for a rule a second screen must follow. A choice that only one screen makes stays in that screen.

## Controls

- A control is at least 24px high. Do not add a smaller size to a component, and do not shrink one in a screen.

## After a change

- A value in the stylesheet changed: run `make design-tokens`.
- A component or one of its variants changed: run `make design-components`. Look a component and its variants up in `design/component-registry.json` before reading its source; when the file is not there, the repository keeps it out of git and the same command writes it.
- Never edit by hand the files those commands write, `design/theme.json`, `tools/design-assembly/` or `mk/design-assembly.mk`.
