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

## Choose before you make (decision 0023)

`wiki/decisions/0023-chon-truoc-tao-sau.md`. Every UI need — the frame and layout of a screen, a region inside it, a small
block — goes down this scale, one rung at a time, and only drops a rung when the rung above cannot do the user's job or
breaks a product rule ("looks nicer" or "faster by hand" is not a reason):

1. **Compose from the store.** A supplier component, or a template in `design/so-khoi.yaml`. The machine does this alone.
2. **The store plus ReUI Pro.** What the store has comes from the store; what it lacks is chosen from ReUI Pro
   (`design/reui-catalog.json`, searched offline with `tools/reui_catalog`).
3. **Make it by hand.**

The store grows: whatever is used for the first time, chosen from ReUI or made by hand, is taken into the store with one
line of `design/so-khoi.yaml` (what it is, which ReUI block or by hand, for which need, the day the owner approved it), and
the next time the same need comes it is rung 1. One need, one solution: if the store's answer is not enough, extend it —
never put a second one beside it. Something made in this round is not "in the store" for this round. Rung 2 the first
time and rung 3 always are shown at the scope gate with two or three ReUI candidates and their images, for the owner to
choose.

Keep the shape, by layer:

- **Component** (one item from ReUI or shadcn): keep it as the supplier ships it — look, behaviour, motion.
- **ReUI block** (several components arranged for someone else's problem): a starting point for the arrangement. Take a
  region that serves the user's job, drop one that does not, add a missing one from the store's components — one line of
  reason per region taken, dropped or added. A block that loses more than half its regions is called by its real name,
  "composed from components".
- **Template** of the store (our own arrangement, approved by the owner): this is what enters the store, and from then on
  it keeps its shape; later screens fill in data, text and props only. Change it everywhere it is used, never fork it for
  one screen.
- A sub-need the store already solves (error, notice, empty state) uses the store's answer, not the one inside a block.

## Read Quỹ hàng first

Quỹ hàng is the required reference for every screen and the first ReUI candidate — not a rung above the store. Read, in
this order: the screen's page of the context book under `docs/tri-thuc/wiki/chu-de/`; then in `onehub-quy-hang`
(read only) the screen's row in `docs/design/vo-va-ia.md` §2, the group's `design/patterns/<group>.md`, the ADRs it cites
(ADR-0002, ADR-0019), and the signed records of that screen. The proof says what Quỹ hàng chose, what you keep, what you
drop and why (`### Từ Quỹ hàng`).

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

With decision 0023 on (the repo has `design/so-khoi.yaml`), the proof also carries, per screen:

- from `approved`: `### Từ Quỹ hàng` (the context page, or `chưa có trang — <reason>`), `### Họ` (the family you propose
  and the path it gives — the family is the owner's call at the scope gate), and for a new family or new reference the
  `màn` group of `### Ứng viên ReUI` (two or three candidates, one PNG each);
- from `implemented`: a candidate group for every `reui` or `ve-tay` block, `### Vùng` and the `Cách` column for every
  ReUI block, and its line in `design/so-khoi.yaml` with `ho_so` = your round. `trong-kho` means a supplier component or a
  ledger line taken in by another round.

A round that builds a wrapping template such as the App Shell declares `khuon_boc: <id>` in its contract (the id must be
in `tools/proof_gate/khuon-boc.yaml`) and proves `## Khuôn <id>`, not the screens it wraps.

Check yourself with `python3 tools/proof_gate/check.py --root .` (it also runs in `make test`).

## Before you finish

- `make check`, then `make e2e` for visible changes.
- Every new screen is added to the axe test in `tests/e2e/`, in light and dark.
- One frame family per screen: Frame on workspace screens, card on the customer page, never one inside the other.
- Adapting a ReUI block follows the three layers of "Choose before you make": components unchanged, block regions
  taken, dropped or added with a reason each, the approved template kept as is.
- A UI test must be shown to fail when the thing it measures is broken.
- A new decision gets a line in `design/decisions.yaml`. An escaped bug gets a line in `design/escapes.md`.
