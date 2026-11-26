# Bước bien trước vai-dang-nhap — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps
> use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `make deploy` runs `bien` before `vai-dang-nhap`, so a Vercel failure while rotating the login password never
changes the database password; the runbooks say exactly when production has lost its database connection.

**Architecture:** One reorder of the exported `STEPS` in `tools/deploy/len-ban.mjs`; no step function changes. Tests
import `STEPS` instead of copying it. Runbooks, the README and a new decision page follow; a small script under the
dossier checks the written order.

**Tech Stack:** Node 24 ESM, Vitest, Markdown.

**Spec:** `docs/superpowers/specs/2026-11-22-bien-do-sau-xoay-mat-khau-design.md`; contract
`_acceptance/bien-do-sau-xoay-mat-khau/contract.md` (approved 2026-11-22, Hỏi-1 = đổi thứ tự); measurement plan
`_acceptance/bien-do-sau-xoay-mat-khau/evals.yaml`.

## Global Constraints

- New order, verbatim:
  - staging: `cau-hinh, migration, bien, vai-dang-nhap, cach-ly, dung, kiem-nhanh, gan-ten-mien, kiem-nhanh-ten-mien`
  - production: `cau-hinh, ban-thu-truoc, migration, bien, vai-dang-nhap, dung, kiem-nhanh, gan-ten-mien,
kiem-nhanh-ten-mien`
- No step function changes; no new red line text in code.
- Pinned messages of the E6 script: `ghi-chep: 3 chỗ đạt`, `ghi-chep: chú thích len-ban.mjs lệch STEPS`,
  `ghi-chep: README việc 10 lệch STEPS`, `ghi-chep: thiếu wiki/decisions/0048-*.md`. E4 finding:
  `sổ tay bước <2|5>: thứ tự lệch STEPS.<staging|production>`.
- Never weaken an existing test: each red-matrix rule keeps its strength, re-anchored on the new positions.
- No key value in any runbook line; docs in Vietnamese, code and commits in English (Conventional Commits).

## Review Focus

- A red step at `cau-hinh`/`ban-thu-truoc`/`migration` must still write nothing to Vercel and set no password (red
  matrix rules, Task 1).
- `cach-ly` (staging only) still runs after `vai-dang-nhap`: it signs in with the login role (Task 1 order case).
- `vai-dang-nhap` red after `bien`: exactly one POST then exactly one `psql vai`, no `vercel` command (Task 1, E3).
- Runbook lines that list nine steps in prose (bước 2, bước 5) drift silently — pinned by E4 (Task 3).
- The README sentence names only some steps; its relative order must still match (E6 compares the subsequence, Task 4).

---

### Task 1: Reorder the steps; tests read the order from the code

**Files:**

- Modify: `tools/deploy/len-ban.mjs` (`STEPS` ~47-70, header comment lines 7-12)
- Modify: `tools/deploy/deploy.test.ts` (local `STEPS` ~33-55 → import; `expectGreen` ~541-552; red matrix ~836-850;
  new describes E1, E3)

**Interfaces:**

- Consumes: exported `STEPS` from `len-ban.mjs` (already exported).
- Produces: test helper `vaiCalls(r: Run): number` = count of `psql vai` in `r.calls`.
- Serves: E1, E3. independent: false.

- [ ] **Step 1: Failing tests.** Replace the local `STEPS` with `import { STEPS } from "./len-ban.mjs"` (typed
      `Record<Env, string[]>`). Add `E1 · thứ tự khai`: `STEPS.staging` and `STEPS.production` equal the two lists of Global
      Constraints. In `expectGreen`: `apply < POST < vai < firstVercel`, and `vaiCalls(r) === 1`. In the red matrix, three
      rules by position in `STEPS[appEnv]`: `at < indexOf("bien")` → no POST; `at < indexOf("dung")` → `r.vercel` empty;
      `at < indexOf("vai-dang-nhap")` → `vaiCalls(r) === 0`. Add `E3 · <env> · vai-dang-nhap đỏ sau khi ghi biến` (fake
      marker `vai-chua-co`): one POST, one `psql vai`, POST index < `psql vai` index, red line at `vai-dang-nhap`, last line
      `DỪNG ở vai-dang-nhap — tên miền không đổi`, `r.vercel` `[]`, domain `dpl_cu`.
- [ ] **Step 2:** `npx vitest run tools/deploy --coverage.enabled=false` → `E1 · thứ tự khai`, the green cases and E3
      fail.
- [ ] **Step 3:** Reorder `STEPS` and the header comment in `len-ban.mjs`.
- [ ] **Step 4:** Re-run the folder → all pass.
- [ ] **Step 5: Break test.** Swap `bien` and `vai-dang-nhap` back in `STEPS`, run, record the failing count, restore
      with `git checkout -- tools/deploy/len-ban.mjs`.
- [ ] **Step 6:** Commit `fix(deploy): push the app variables to Vercel before setting the login role's password`.

### Task 2: A red bien step never sets the password

**Files:**

- Modify: `tools/deploy/deploy.test.ts` (describe E2)

- Consumes: Task 1 `vaiCalls`; existing `ctx.vercelReply`, `ctx.vercelEnvs`, `ctx.apiStatus`, `expectBienRed`-style
  assertions.
- Serves: E2. independent: false.

- [ ] **Step 1:** `E2 · <env> · <ô>` for the five cells of the evals.yaml matrix (forbidden `MIGRATE_DATABASE_URL`; 403;
      refused `AUTH_SECRET`; `created: []`; listing without `envs`), both envs: exact red line, last line DỪNG ở bien,
      `vaiCalls(r) === 0`, no `vai.sql` in the fake dir, `r.vercel` `[]`, domain `dpl_cu`, `expectNoMarker`.
- [ ] **Step 2:** Run `-t "E2 · "` → pass (Task 1 already reordered). Break test: old order → the ten E2 cases fail on
      `vaiCalls`. Restore.
- [ ] **Step 3:** Commit `test(deploy): a red bien step leaves the login role's password alone`.

### Task 3: Runbooks follow the order and say the three zones

**Files:**

- Modify: `docs/van-hanh/dua-ban-len.md` (bước 2 and bước 5 «Đạt khi»; opening of «Đỏ thì làm gì»; every `bien` row
  and the two `vai-dang-nhap` rows; the `cach-ly`/`dung`/`kiem-nhanh` rows only if they imply production is fine; «Lần
  đầu ở một môi trường»)
- Modify: `docs/van-hanh/xoay-khoa.md` (bước 3 «Đỏ thì»; bước 4 «Đạt khi» step list)
- Modify: `tools/deploy/deploy.test.ts` (describe E4)

**Interfaces:**

- Produces (test file): `thuTuSoTay(md: string): string[]` — for bước 2 and bước 5, take the «Đạt khi» bullet up to the
  next bullet, list the step names of `STEPS` in order of first appearance as `` `<step> đạt` ``, compare to
  `STEPS.staging` / `STEPS.production`; return findings with the pinned text.
- Serves: E4, E5. independent: false.

- [ ] **Step 1: Failing test.** `E4 · sổ tay kể đúng thứ tự bước`: `thuTuSoTay(real file)` → `[]`; `E4 · chiều đỏ`: real
      text with `vai-dang-nhap đạt` and `bien đạt` swapped in bước 2 → `["sổ tay bước 2: thứ tự lệch STEPS.staging"]`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Edit the runbooks per the design doc «Sổ tay» section and contract AC-5 (three zones; «đừng bấm dựng lại
      trên Vercel trước khi lệnh chạy xanh» on every `bien` row and the `vai-dang-nhap` rows). Run `npx prettier --write` on
      both files.
- [ ] **Step 4:** Re-run → PASS. Commit `docs(van-hanh): new step order and the three red zones while rotating the login
password`.

### Task 4: Decision page, README, order check script, wiki log

**Files:**

- Create: `wiki/decisions/0048-bien-truoc-vai-dang-nhap.md` (front matter `type: decision`, `title`, `links`, `sources`;
  headings as 0047: Status, Context, Decision, Consequences; states the order, why, the cost, the gap left)
- Modify: `docs/van-hanh/README.md` (việc 10 sentence)
- Create: `_acceptance/bien-do-sau-xoay-mat-khau/rang/ghi-chep.mjs`
- Create: one `wiki/log/` file via `make log`

**Interfaces:**

- `ghi-chep.mjs [--root <dir>] [--tu-kiem]`: imports `STEPS` from the repo's own `tools/deploy/len-ban.mjs` (path
  derived from the script's location, never from `--root`), and reads the three places under `--root` (default: the
  repo root derived from the script's location). Order extraction: step names in order of first appearance; the
  README sentence must be a subsequence of `STEPS.staging`. Exit 0 with `ghi-chep: 3 chỗ đạt`, else exit 1 with the
  first pinned message. `--tu-kiem`: build three broken copies in a temp dir (header comment in the old order; README
  with `dung` and `cach-ly` swapped; no 0048 page), run itself on each, require exit 1 and the pinned message, then
  check the real tree passes.
- Serves: E6, E5. independent: false.

- [ ] **Step 1:** Write `ghi-chep.mjs`; run it → red (no 0048 yet).
- [ ] **Step 2:** Write 0048 and the README sentence; run → `ghi-chep: 3 chỗ đạt`; run `--tu-kiem` → exit 0.
- [ ] **Step 3:** `make log m="make deploy pushes Vercel variables before setting the login password: a Vercel failure while rotating no longer takes production off its database — bien-do-sau-xoay-mat-khau"`.
- [ ] **Step 4:** Commit `docs(wiki): decision 0048, bien before vai-dang-nhap`.

### Task 5: Whole-repo check

- Serves: E7. independent: false.

- [ ] **Step 1:** `make check` → exit 0 (format the new markdown first if lint asks).
- [ ] **Step 2:** Commit any formatting.
