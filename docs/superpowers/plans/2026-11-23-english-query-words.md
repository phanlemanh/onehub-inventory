# English query words — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The inventory screen and the behaviour prototype read and write English query words; old link words still
open the right place through one translation.

**Architecture:** One module-owned table (`src/modules/listings/ui/query-words.ts`) names every query word and the six
old link words. The inventory page translates old words first (before the sign-in redirect), so `next=` carries the
new words and there is exactly one translation hop. Every writer imports its constant from that table; the three dev
switches are renamed with no translation.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Vitest, Playwright, Postgres lanes.

**Spec:** `docs/superpowers/specs/2026-11-23-english-query-words-design.md`, contract
`_acceptance/english-query-words/contract.md` (approved 2026-11-23, Hỏi-1/2/3 as recommended), evals
`_acceptance/english-query-words/evals.yaml`.

## Global Constraints

- New words: `ma`→`unit`, `toa`→`building`, `du-an`→`subdivision`, `ho-so`→`record`, `vung`→`place`,
  `goc-nhin`→`view`, `vai`→`role`, `mau=bien`→`sample=edge`, `quyen=khong`→`permission=denied`.
- Translated (old link words): `ma`, `toa`, `du-an`, `ho-so`, `vung`, `goc-nhin` only. Not translated: `vai`, `mau`,
  `quyen`.
- When an old word and its new word are both present, the new word wins; the old one is dropped.
- Values are kept byte for byte; a repeated `vung` keeps every value in order; other parameters keep their order.
- No migration; no change to look, copy or permissions; no label hard-coded in `src/` (`make check`).
- Test file names and `executors.*` keys stay as they are.
- AGENTS.md: identifiers and comments in English; tests use `[Tên]` and `0900 000 0xx`.

## Review Focus

1. Old link whose value contains `&`, `=` or Vietnamese letters (`?du-an=Khu%20%C4%90%C3%B4ng`) — must survive
   translation unchanged. Test in Task 1 (`dich-bien: gia-tri-ma-hoa`).
2. Old link with the old and the new word for the same thing (`?ho-so=a&record=b`) — new wins, one hop. Task 1.
3. Signed-out visitor with an old link — `next=` carries new words, after sign-in no second hop. Task 6 (E18).
4. `?record=<id>` for a listing no longer on the inventory — the stale-link sentence as before. Task 5.
5. Old dev switch `?quyen=khong` on `/proto/hanh-vi-trong-luoi-khung` — no effect; `?permission=denied` takes «Thêm
   dòng» away. Task 4.

---

### Task 0: Stand on PR #114

`independent: false` · serves: all (prerequisite, decision d-20261123T090449Z-5)

- [ ] **Step 1:** `gh pr view 114 --json state -q .state`. `MERGED` → `git fetch origin && git merge origin/main`.
      `OPEN` → `git fetch origin refactor/english-route-names && git merge FETCH_HEAD` and note it in the PR description.
- [ ] **Step 2:** Verify `src/app/(app)/proto/permitted-actions/page.tsx` exists and
      `src/app/(app)/proto/bo-nut-theo-quyen/` does not. Run `make check` → exit 0.

### Task 1: The query-word table

`independent: false` · serves: E2, E3

**Files:**

- Create: `src/modules/listings/ui/query-words.ts`
- Modify: `src/modules/listings/ui/index.tsx` (export the table), `src/modules/listings/ui/inventory-rows.ts:260-264`
  (`SEARCH_PARAM` values from the table), `src/modules/listings/ui/geo-tree.ts:38` (`GEO_PARAM`),
  `src/modules/listings/ui/saved-view-api.ts:8` (`SAVED_VIEW_PARAM`), `src/components/candidate/record-panel.tsx:33`
  (`RECORD_PARAM` stays a literal `"record"` — candidate may not import a module; the table imports it instead)
- Test: `tests/old-query-words.test.ts`

**Interfaces — Produces:**

- `QUERY_WORD: { unit: "unit"; building: "building"; subdivision: "subdivision"; record: "record"; place: "place";
view: "view"; role: "role"; sample: "sample"; permission: "permission" }` (readonly).
- `OLD_LINK_WORD: Readonly<Record<"ma" | "toa" | "du-an" | "ho-so" | "vung" | "goc-nhin", string>>` mapping to the
  new words above. This is the only place in `src/` that names an old word (keep list).
- `englishQuery(query: Record<string, string | string[] | undefined>): URLSearchParams | null` — `null` when no old
  link word is present; otherwise the full parameter list with old words renamed (or dropped when the new word is
  present), order kept.

- [ ] **Step 1: Write the failing test** `tests/old-query-words.test.ts`, describe `dich`, 22 cases named
      `<word>: chi-cu`, `<word>: ca-hai`, `<word>: khong-cu` for the six link words, plus `vung-lap-lai`
      (`vung=a&vung=b` → `place=a&place=b`), `giu-tham-so-khac` (`status=Active&ho-so=r1` → `status=Active&record=r1`),
      `vai: khong-dich` (`englishQuery({vai:"ListAgent"})` is `null`), `mau: khong-dich` — exactly the 22 of E2. Review
      Focus 1 goes in a separate describe `dich-bien`, case `gia-tri-ma-hoa`. Each failing assertion message starts
      `dich: <word> ` (pinned).
- [ ] **Step 2:** `npx vitest run tests/old-query-words.test.ts` → FAIL (module not found).
- [ ] **Step 3:** Implement `query-words.ts`; point the four constants at it.
- [ ] **Step 4:** Run the test → PASS. Break check: drop `ho-so` from `OLD_LINK_WORD` in a scratch copy → the test
      fails with `dich: ho-so khong chuyen`; add `vai` → fails with `dich: vai khong duoc dich`. Restore.
- [ ] **Step 5:** Commit `feat(listings): one table of English query words and the six old link words`.

### Task 2: Inventory page reads new words, translates old links

`independent: false` · serves: E2, E4, E18 · Consumes: Task 1

**Files:** Modify `src/app/(app)/inventory/page.tsx` (lines 125-200: `query.vai`, `query.mau`, `query.ma`,
`query.toa`, `query["du-an"]`, `query["ho-so"]`, `next.set("ho-so", …)` → table constants), `src/modules/listings/
messages.ts:7` (`?record=`), `src/modules/listings/ui/use-geo-place.ts` comment. Test: `tests/old-query-words.test.ts`
(add), `tests/inventory-page.test.tsx`.

- [ ] **Step 1: Failing tests** in `tests/old-query-words.test.ts`: `trang-chuyen` renders the page with
      `{ "ho-so": "r1", status: "Active" }` and expects a redirect to `/inventory?status=Active&record=r1` (control:
      `{ record: "r1" }` → no redirect); `dang-nhap-next` with a signed-out source and `{ "goc-nhin": "v1" }` expects the
      sign-in redirect whose `next` contains `%3Fview%3Dv1`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** At the top of `Page`, before `inventorySource()`: `const english = englishQuery(query); if (english)
redirect(`/inventory?${english}`);` then read every word through `QUERY_WORD`.
- [ ] **Step 4:** `npx vitest run tests/old-query-words.test.ts tests/inventory-page.test.tsx` → PASS.
- [ ] **Step 5:** Commit `feat(inventory): English query words, old links translated once`.

### Task 3: Writers write new words

`independent: false` · serves: E3 · Consumes: Task 1

**Files:** `searchHref` (`inventory-rows.ts:309`), geo-tree links (`geo-tree.ts:144, 206`), `savedViewHref`,
`useRecordAddress` (`record-panel.tsx:64`), single-unit redirect (Task 2), `messages.ts`. Test: `tests/old-query-
words.test.ts` describe `ghi`.

- [ ] **Step 1:** Failing describe `ghi`, six cases with literal expected addresses: `searchHref("unit","S1.0301")` →
      `/inventory?unit=S1.0301`; `searchHref("building","S1.01")` → `/inventory?building=S1.01`;
      `searchHref("subdivision","P")` → `/inventory?subdivision=P`; geo link of a place key `k` → `/inventory?place=k`;
      `savedViewHref("v1")` → `/inventory?view=v1`; the ask-agent message link for id `a` ends `/inventory?record=a`.
      `useRecordAddress` open/close is covered by `tests/loi-vao-ho-so.test.tsx` (Task 5).
- [ ] **Step 2–4:** Run → FAIL; constants already moved in Task 1 → run → PASS (fix any writer still using a literal).
- [ ] **Step 5:** Commit `test(listings): every address writer writes the English words`.

### Task 4: Dev switches

`independent: false` · serves: E8, E9, E11

**Files:** `src/app/(app)/inventory-source.ts:44-55` (param name and comment `?role=`),
`src/modules/listings/ui/inventory-rows.ts:147-171` (`param !== "edge"`; row ids stay `bien-<n>`, out of scope),
`src/app/(app)/proto/[slug]/page.tsx:29,36` (`permission === "denied"`), `behavior-showcase.tsx:88` comment,
`tools/deploy/thu-ban-dung.sh` (lines 4, 356-384: `?role=`, `?sample=`, and add `/proto/hanh-vi-trong-luoi-khung?
permission=denied` to the production 404 list), `src/proxy.test.ts:19`.

- [ ] **Step 1:** Update `tests/e2e/the-dien-thoai.spec.ts` to `?sample=edge`, `?role=`; add case `cong-tac-cu`
      (`?mau=bien&vai=BuyerAgent` renders as with no switch). Update `tests/e2e/behavior.spec.ts` to `?permission=denied`;
      add case `quyen-cu` (`?quyen=khong` keeps «Thêm dòng»).
- [ ] **Step 2:** `npx playwright test tests/e2e/the-dien-thoai.spec.ts tests/e2e/behavior.spec.ts` → FAIL.
- [ ] **Step 3:** Rename the three switches.
- [ ] **Step 4:** Same command → PASS.
- [ ] **Step 5:** Commit `refactor: English dev switches role, sample=edge, permission=denied`.

### Task 5: Every test and fixture on the new words

`independent: false` · serves: E4, E5, E6, E10–E14

**Files:** the test files the scan lists (`grep -rlE '[?&](vai|mau|ma|toa|du-an|ho-so|vung|goc-nhin|quyen)=' tests
tools/e2e_templates src`), including `tests/fixtures/ci-db/co-phien.json`, `khong-phien.json`, `tests/unit-jump.test.tsx`,
`tests/loi-vao-ho-so.test.tsx`, `src/modules/listings/ui/geo-tree.test.ts:155-170`, `src/lib/share/share.test.ts:7`.

- [ ] **Step 1:** Rename words in every listed file (values unchanged).
- [ ] **Step 2:** Add to `tests/loi-vao-ho-so.test.tsx`: `?record=<id>` opens that unit's panel; `?record=<removed
id>` shows the stale-link sentence (control: a live id shows none). Add to `tests/unit-jump.test.tsx` case
      `tu-cu-khong-loc`: the filter function given `{ toa: "S1.01" }` (no translation) filters nothing.
- [ ] **Step 3:** `make test` → exit 0; `make e2e` → exit 0.
- [ ] **Step 4:** Commit `test: inventory tests use the English query words`.

### Task 6: Old links in the real browser (E17-ui, E18)

`independent: false` · serves: E17-ui, E18 · Consumes: Tasks 2, 5

**Files:** `tests/e2e-db/bang-hang-that.spec.ts`.

- [ ] **Step 1:** Case `lien-ket-cu`: signed out, open `/inventory?ho-so=<listing id from the lane seed>&vung=<place
key>&goc-nhin=<saved view id>`; record every `response.status()` in 300-399 via `page.on("response")`. Assert the
      sign-in URL's `next` holds `record=`, `place=`, `view=` and no old word; after sign-in, `page.url()` has the new
      words, the record panel of that listing is open, and exactly one translation redirect was seen. Control: the same
      link in new words sees zero translation redirects.
- [ ] **Step 2:** Case `old link images` (runs only with `URL_ANH=1`): signed in, open the old link at 1440, save
      `.acceptance-runs/english-query-words/old-link-1440.png`, print three lines: the old link, the unit code and place
      name it points at, the final address.
- [ ] **Step 3:** `make db-up DB_LANE=r DB_PORT=5565` then the `bang_hang_that_e2e` executor → exit 0.
- [ ] **Step 4:** Commit `test(inventory): an old link opens the right unit after sign-in, one hop`.

### Task 7: The record's measuring tools

`independent: true` · serves: E1, E1-pha, E7, E15 · Consumes: Task 1 (file name of the table)

**Files:** Create `_acceptance/english-query-words/rang/query-words.mjs`, `rang/giu.txt`, `rang/chay.sh`.

- [ ] **Step 1:** `query-words.mjs --root <dir>`: the 9 words × 11 contexts of the design doc, as regexes, over
      `src/ tests/ tools/deploy/ tools/e2e_templates/ design/`; reads `giu.txt` (`file : text : reason`), compares it to a
      pinned array in the script (differ → `giu: lech danh sach ghim`, exit 1); prints `quet: 9 tu x 11 ngu canh x 5 vung
· cham: <n> · giu: <m>`; any hit outside the keep list prints `chu-cu: <word> <context> <file>:<line>` and exits 1.
      Root derived from `--root`, never hard-coded.
- [ ] **Step 2:** `--self-test`: copy the tree to a temp dir per cell (99 cells, zones round-robin), plant the cell,
      expect exit 1 with `chu-cu: <word> <context>`; plus the keep-list drift case; print `self-test: 100/100 do dung cho`.
      The real tree must be green in the same run.
- [ ] **Step 3:** `--luu-tru`: `git diff --name-only --diff-filter=A <merge-base> -- db/migrations` empty, and the
      five keys read from `db/migrations/009_goc_nhin.sql`; print the E7 line. `--wiki`: no old word in
      `wiki/entities/*.md` and `design/behaviors.md`, exactly one `wiki/log/` file naming `english-query-words`.
- [ ] **Step 4:** `chay.sh E2|E3|E4|E7` runs the vitest cases each eval names (`-t` filters), from the repo root found
      from the script's own path. E7 also runs a `khu-hoi-goc-nhin` case added to `tests/old-query-words.test.ts`:
      `storedView` → `gridView` with filters on `Listing.subdivisionName`, `Listing.buildingName`,
      `Listing.standardStatus`; the stored object holds none of the 18 old or new words as key or value. Break check: a
      copy where `storedView` adds `place` fails with `khu-hoi: tu truy van trong vat luu`.
- [ ] **Step 5:** Run E1, E1-pha, E7 → green. Commit `chore(english-query-words): scan, self-test and runner`.

### Task 8: Docs

`independent: true` · serves: E15

**Files:** `design/behaviors.md:30` (`?place=`), `wiki/entities/listing.md`, `wiki/entities/saved-view.md`,
`make log m="Inventory query words in English; old links translated once — english-query-words"`.

- [ ] **Step 1:** Edit the three pages; run the log command.
- [ ] **Step 2:** `make ontology` → exit 0. Commit `docs: inventory query words in English`.

### Task 9: Close the build

`independent: false` · serves: E10, E16

- [ ] **Step 1:** Design floor at the end of S3 (feature-loop block `DESIGN-FLOOR-S3`).
- [ ] **Step 2:** `make check` → exit 0; `make e2e` → exit 0; E1 → `cham: 0`.
- [ ] **Step 3:** Contract `status: implemented`; grading runs from an outside clone (Hỏi-2).
