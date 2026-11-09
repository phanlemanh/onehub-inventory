---
name: inventory-ui
description: Project UI standard. Use for any UI work in src/app, src/components or src/modules/*/ui, after the reui skill. Says what to reuse, where a component belongs, and which decisions are already made.
---

# Inventory UI

Read only what the task needs, in this order:

1. `design/component-registry.json`: what exists, its level, variants and defaults. Do not read component source to find this out.
2. The reference screen of the screen type, declared in `design/patterns/`.
3. `design/behaviors.md` and `design/states.md`: closed answers. Do not choose row height, alignment, column width or formats.
4. `design/language.md` and `ontology/labels.yaml`: words.

## Where a component goes

| It is                                        | It goes in                                                      |
| -------------------------------------------- | --------------------------------------------------------------- |
| Tied to one module                           | `src/modules/<name>/ui/`                                        |
| Used by a second module, or part of the grid | `src/components/candidate/`                                     |
| A page frame with slots                      | `src/components/templates/`                                     |
| A vendor primitive                           | `src/components/ui`, `reui`, installed by the CLI, never edited |

## Authority

Brand (logo, colours, type, tone): OneHub DS. Behaviour and accessibility: shadcn on Base UI. Dense blocks: ReUI. Everything else: Tailwind and shadcn defaults. A deviation needs a line in `design/decisions.yaml`.

## Before you finish

- `make check`, then `make e2e` for visible changes.
- A UI test must be shown to fail when the thing it measures is broken.
- A new decision gets a line in `design/decisions.yaml`. An escaped bug gets a line in `design/escapes.md`.
