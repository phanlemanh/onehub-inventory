# English route names — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the company layer screen and the permitted-actions prototype, their query words and their screen ids to
English, without touching signed acceptance records.

**Architecture:** Move two route folders, make the six part names equal the API's names, add `old_ids` to the screen
register so closed contracts keep resolving, and add a scan (`rang/old-names.mjs`) that turns any leftover old word red.

**Tech Stack:** Next.js 16 app router, TypeScript, Vitest, Playwright, Python checks in `tools/`.

**Spec:** `docs/superpowers/specs/2026-11-23-english-route-names-design.md`, contract
`_acceptance/english-route-names/contract.md`, evals `_acceptance/english-route-names/evals.yaml`.

## Global Constraints

- Old → new: `/tuy-chinh-san` → `/company-layer`; `?phan=` → `?part=`; parts `nhan, truong, tu-dien, can-cho, mau,
thue-phi` → `labels, fields, aliases, pending-units, templates, fee-schedule`; `/proto/bo-nut-theo-quyen` →
  `/proto/permitted-actions`; `bang=an, man, vai, mo` → `board=hidden, screen, role, open`; screen ids `tuy-chinh-san` →
  `company-layer`, `proto-bo-nut` → `proto-permitted-actions`.
- Old addresses answer 404; no redirect (Hỏi-4).
- No edit under any other `_acceptance/<slug>/`, `.github/workflows/`, `governance/`, `ontology/`, `db/migrations/`,
  `tools/design-assembly/`.
- User-facing words keep coming from `ontology/labels.yaml`.
- Evidence image names that signed proofs cite (`tuy-chinh-san-<width>.png`) stay as they are.

## Review Focus

1. `?phan=can-cho` after the change → the page opens `labels` (old word ignored). Pinned in Task 2 (unit) and Task 5
   (browser).
2. A contract still open naming `tuy-chinh-san` → red with the new id named. Pinned in Task 1.
3. The second column marks the open part as current with `?part=` (the App Shell matches by query). Pinned in Task 5
   image case and E14-ui.
4. Production build: `/proto/permitted-actions` 404 (`tools/deploy/thu-ban-dung.sh` reads proto folders from the code).
   Covered by E15, no code change.
5. Signed-in redirect: `/company-layer` signed out → `/login?next=%2Fcompany-layer`. Pinned in Task 5.

---

### Task 1: `old_ids` in the screen register (independent: false — Tasks 2 and 3 need it)

**Files:** Modify `tools/coverage_matrix/registry.py`, `tools/coverage_matrix/contracts.py`, `tools/proof_gate/model.py`,
`tools/proof_gate/check.py`, `design/screens/_shared.yaml` (document the key). Test: `tests/screen-old-ids.test.ts`.
Create `_acceptance/english-route-names/rang/old-ids.sh` (runs that test file).

**Interfaces — produces:** register key `old_ids: [<id>, …]` on a screen file; `Registry.old_ids: dict[str, str]` (old →
current) in coverage_matrix; `Repo.old_ids: dict[str, str]` in proof_gate. Error text, both tools:
`screen '<old>' is an old id of '<new>'`.

- [ ] Step 1: write `tests/screen-old-ids.test.ts` — builds a temp root (copy of `design/screens/`, `ontology/` read paths
      the tools need, one closed and one open contract fixture written by the real contract template shape of
      `_acceptance/thue-phi/contract.md`) and runs both Python tools. Cases: `old-ids: closed contract passes`
      (coverage_matrix exit 0; proof_gate no finding for the slug), `old-ids: open contract uses tuy-chinh-san` (both name
      `screen 'tuy-chinh-san' is an old id of 'company-layer'`), plus `old-ids: unknown id still red` (`is not in`).
      `old-ids.sh` prints `old-ids: 4/4` when all four tool × status cases pass.
- [ ] Step 2: run, see it fail (no `old_ids` yet).
- [ ] Step 3: registry reads `old_ids`; an old id equal to a current id or listed twice is a register error.
      contracts.py: CLOSED contracts map old → current before the lookup; OPEN contracts get the error above.
      proof_gate model/check: same mapping for CLOSED, a finding `ma-man-cu` for OPEN.
- [ ] Step 4: break pair — on a copy, let OPEN contracts use old ids too: the open case must go red with
      `old-ids: open contract uses tuy-chinh-san`. Run green on the real tree.
- [ ] Step 5: commit `feat(tools): screen register accepts old ids for closed contracts`.

### Task 2: `/company-layer` and `?part=` (independent: false)

**Files:** Move `src/app/(app)/tuy-chinh-san/page.tsx` → `src/app/(app)/company-layer/page.tsx`; modify
`src/modules/company-config/ui/copy.ts`, `layer-screen.tsx`, `fee-part.tsx`, `index.ts`, `layer-screen.test.tsx`,
`src/app/(app)/nav.ts`; `git mv design/screens/tuy-chinh-san.yaml design/screens/company-layer.yaml` (id, route,
`vao_vung: /company-layer?part=pending-units`, comment words, `old_ids: [tuy-chinh-san]`). Test:
`tests/company-layer-route.test.ts`. Update `tests/vai-man-so-man.test.ts`, `tests/vai-man-nut-sinh.test.ts`,
`tests/vong-doi-thao-tac.test.ts`, `tests/coverage-matrix.test.ts`, `tools/e2e_templates/recipes.ts` (key
`company-layer`), `tools/e2e_templates/e2e-templates.test.ts`, `tests/e2e-db/screens.spec.ts` (MEASURED list).

**Interfaces — produces:** `GRID_PARTS = ["labels","fields","aliases","pending-units","templates"]`,
`LAYER_PARTS_SHOWN = [...GRID_PARTS, "fee-schedule"]`, `GridPart` equal to the API's `LayerPart` (drop `API_PART`),
`layerPartFrom(query: Record<string, string | string[] | undefined>): ShownPart` in `copy.ts`, `LAYER_ROUTE =
"/company-layer"` and `layerPartHref(part: ShownPart): string` (labels → `/company-layer`, else `?part=<part>`).

- [ ] Step 1: `tests/company-layer-route.test.ts` — `doc-phan` 9 cases (six names, absent → labels, `xyz` → labels,
      `{ phan: "can-cho" }` → labels, message `doc-phan: ?phan=can-cho` when it fails); `cot-hai` — the company layer entry
      of `NAV` has exactly 6 items with hrefs `/company-layer`, `/company-layer?part=fields`, `…aliases`,
      `…pending-units`, `…templates`, `…fee-schedule` and titles `label(PART_TITLE[p])`.
- [ ] Step 2: run, fail.
- [ ] Step 3: implement; page reads `layerPartFrom(query)`, `redirect(loginHref(LAYER_ROUTE))`; `fee-part.tsx`
      `data-part="fee-schedule"`.
- [ ] Step 4: `npx vitest run tests/company-layer-route.test.ts src/modules/company-config tests/vai-man-so-man.test.ts
tests/vai-man-nut-sinh.test.ts tests/vong-doi-thao-tac.test.ts tests/coverage-matrix.test.ts tools/e2e_templates`
      green; `make gen` and `make design-role-table` clean.
- [ ] Step 5: commit `refactor: company layer screen at /company-layer with ?part=`.

### Task 3: `/proto/permitted-actions` (independent: true of Task 2's files)

**Files:** `git mv src/app/(app)/proto/bo-nut-theo-quyen src/app/(app)/proto/permitted-actions`; page reads `q.board ===
"hidden"`, `q.screen`, `q.role`, `q.open`; `git mv design/screens/proto-bo-nut.yaml
design/screens/proto-permitted-actions.yaml` (id, route, `old_ids: [proto-bo-nut]`); update `tests/e2e/bo-nut.spec.ts`
(URL, section name `proto-permitted-actions`), `src/proxy.test.ts`, `tests/coverage-matrix.test.ts`,
`tests/vai-man-so-man.test.ts`, `tests/vai-man-nut-sinh.test.ts`, `tools/e2e_templates/e2e-templates.test.ts` (`bo qua:
proto-permitted-actions — dev`).

- [ ] Step 1: add case `dia-chi-cu-khong-con` to `tests/e2e/bo-nut.spec.ts`: `/tuy-chinh-san` and
      `/proto/bo-nut-theo-quyen` answer status 404 with no redirect (response URL unchanged).
- [ ] Step 2: rename; run `npx playwright test tests/e2e/bo-nut.spec.ts --project=1440` green.
- [ ] Step 3: commit `refactor: permitted actions prototype at /proto/permitted-actions`.

### Task 4: the old-word scan (independent: false — runs on the finished tree)

**Files:** Create `_acceptance/english-route-names/rang/old-names.mjs`, `rang/giu.txt`.

- [ ] Step 1: patterns (10): `/tuy-chinh-san`; `[?&]phan=`; `proto/bo-nut-theo-quyen`; `proto-bo-nut`; `[?&]bang=`;
      `[?&]man=`; `[?&]mo=` (each of the last three only in a line that also names `/proto/`); quoted part keys
      `"(nhan|truong|tu-dien|can-cho|thue-phi)"` and `data-part="mau"`; file names `design/screens/(tuy-chinh-san|proto-bo-nut).yaml`;
      reading `phan` from a query (`\.phan\b|\["phan"\]`). Regions: `src/`, `design/screens/`, `tools/e2e_templates/`,
      `tests/`. Lines matching `giu.txt` (file : literal : reason) are kept; the pinned list is the two lines of the
      contract's Notes, and a different `giu.txt` prints `giu: lech danh sach ghim` and exits 1. Output `quet: 10 mau x 4
vung · cham: <n> · giu: <k>` and `luu-tru: <n> bang luu dia chi` (migrations naming `tuy-chinh-san` or `phan`). Root
      from `--root`, never hardcoded.
- [ ] Step 2: `--self-test`: per pattern a copy (`git worktree`-free: `cp -R` of the four regions into a temp dir)
      with that pattern planted in one file, the ten copies spread over the four regions; each must exit 1 with `chu-cu:
<pattern>`; one more copy with an extra `giu.txt` line must print `giu: lech danh sach ghim`; real tree green; print
      `self-test: 11/11 do dung cho`. `--wiki`: `wiki/entities/*.md` naming `/tuy-chinh-san` count 0 and one `wiki/log/`
      file naming `english-route-names`.
- [ ] Step 3: run all three modes; commit `test(english-route-names): old-word scan with break pairs`.

### Task 5: browser cases with Postgres (independent: false)

**Files:** `tests/e2e-db/lop-rieng.spec.ts` (openPart takes API names; `page.goto(layerPartHref(part))`; new cases
`phan-cu-khong-doc`, `vai-khong-quyen`, `chua-dang-nhap`; new case `english route images` gated by `URL_ANH=1` writing
`.acceptance-runs/english-route-names/company-layer-fields-1440.png` and `…-templates-1440.png` and printing the address),
`tests/e2e-db/thue-phi.spec.ts` (`/company-layer?part=fee-schedule`, `data-part="fee-schedule"`; proof image names
unchanged), `tests/e2e-db/screens.spec.ts`.

- [ ] Step 1: edit; run with lanes: `make db-up DB_LANE=r` then `config:executors.script.lop_rieng_e2e`; lane N
      `thue_phi_e2e`; lane H `kiem_chung_phien`; lane V `bo_nut_e2e_db`. All green.
- [ ] Step 2: commit `test: browser cases follow /company-layer`.

### Task 6: wiki and full check (independent: false)

- [ ] Step 1: `wiki/entities/*.md` routes → `/company-layer?part=…`; `make log m="english route names: /tuy-chinh-san →
/company-layer, ?phan= → ?part=, /proto/bo-nut-theo-quyen → /proto/permitted-actions — PR"`.
- [ ] Step 2: `make check` and `make e2e` green; `node _acceptance/english-route-names/rang/old-names.mjs --root .`
      (plain, `--self-test`, `--wiki`) green.
- [ ] Step 3: commit `docs: wiki follows the English route names`.
