---
name: inventory-ui
description: Project UI standard. Use for any UI work in src/app, src/components or src/modules/*/ui, after the reui skill. Says what to reuse, where a component belongs, and which decisions are already made.
---

# Inventory UI

Read only what the task needs, in this order:

1. `design/component-registry.json`: what exists, its level, and each part's props, variants and defaults. Do not read component source to find this out.
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

## Prove the screen before you present it

A round that lists a product screen in its contract's `screens:` proves it in `_acceptance/<slug>/chung-minh-man.md`
(decision 0019). Copy the template `tools/proof_gate/khuon-chung-minh.md`; keep its section names, column names and
result words exactly. You do not choose the path — `design/screens.yaml` and the family file `design/patterns/<family>.md`
do:

- **New family** (no family, or no family file): `### Hướng`, two or three really different directions, one image each,
  one marked chosen. Needed once the contract is approved.
- **New reference** (the family file says `Màn: chưa có`, or names this screen): `### Ma trận trạng thái`, every state of
  `design/states.md` passed with a real test file, or not applicable with a reason. Then change the line to
  `Màn: <screen id>` in the same round.
- **Follows the reference**: `### Ảnh cạnh màn mẫu` (one PNG pair per width in the family's `## Khổ so`, same data) and
  `### Mặt so` (every aspect of the family). `giống` points at an image (`ảnh 1440`), never at a component name;
  `khác — có lý do` points at a real file or decision; fix every `khác — vô cớ` before you present.

Every path lists its blocks in `### Khối` with the rung `trong-kho`, `reui` or `ve-tay`. Leaving `trong-kho` needs what
you searched, the nearest candidate (a real name in the registry or in `design/reui-catalog.json`, searched offline with
`tools/reui_catalog`) and why it does not fit. The whole proof is needed once the contract is `implemented`.

Check yourself with `python3 tools/proof_gate/check.py --root .` (it also runs in `make test`).

## Before you finish

- `make check`, then `make e2e` for visible changes.
- Every new screen is added to the axe test in `tests/e2e/`, in light and dark.
- One frame family per screen: Frame on workspace screens, card on the customer page, never one inside the other.
- Adapting a ReUI block changes its data, text and props only.
- A UI test must be shown to fail when the thing it measures is broken.
- A new decision gets a line in `design/decisions.yaml`. An escaped bug gets a line in `design/escapes.md`.
