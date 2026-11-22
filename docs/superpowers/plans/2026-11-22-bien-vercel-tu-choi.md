# Bước bien đọc câu trả lời của Vercel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps
> use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `make deploy` stops at the `bien` step, before the build and with the domain unchanged, when Vercel's reply to
the variable write refuses a variable or does not confirm all six, or when the variable listing has no `envs` array —
naming variables (and Vercel's error code), never values.

**Architecture:** All code changes sit in `stepVercelVars` of `tools/deploy/len-ban.mjs`, through two small pure helpers.
The fake Vercel API in `tools/deploy/deploy.test.ts` learns per-call replies; new cases carry eval ids as prefixes.

**Tech Stack:** Node 24 ESM (`.mjs`), Vitest, TypeScript tests.

**Spec:** `docs/superpowers/specs/2026-11-22-bien-vercel-tu-choi-design.md`; contract
`_acceptance/bien-vercel-tu-choi/contract.md` (approved 2026-11-22: Hỏi-1 = gộp, Hỏi-2 = đủ sáu); measurement plan
`_acceptance/bien-vercel-tu-choi/evals.yaml`.

## Global Constraints

- Red reasons, verbatim (each printed as `deploy <ENV>: bien ĐỎ — <reason>`):
  - `Vercel từ chối ghi biến <mục>, <mục>` — item = name, or name + ` (<code>)`, or `không rõ tên`; order of `failed`;
    a name already listed is not listed again.
  - `Vercel không xác nhận đã ghi biến <tên>, <tên>` — names in `VERCEL_VARS` order.
  - `Vercel trả danh sách biến không đúng khuôn`.
- Name accepted only if it matches `^[A-Z][A-Z0-9_]*$` (from `error.key`, else `error.envVarKey`). Code printed only if
  it matches `^[A-Za-z0-9_-]+$`.
- Never read `error.message` or `error.value` into any printed line.
- `vercelApi` unchanged (non-2xx → `Vercel trả <mã>`; non-JSON body → `null`).
- No real personal data in fixtures; secret markers stay `moc-bi-mat-<NAME>`.
- Code, comments, test names' structure in English except the Vietnamese product lines; commit messages Conventional
  Commits.
- Never delete or weaken an existing test.

## Review Focus

- `created` as a single object (Vercel's documented example form) holding one key → must name the five others (covered:
  E3 cell «object without key» plus Task 2 unit test of `confirmedKeys` on a one-key object).
- `failed` present but not an array (e.g. an object) → must not crash; treated as no refusals, so the `created` check
  decides (Task 2 unit test).
- A `failed` item that is not an object (string, null) → `không rõ tên`, no crash (Task 2 unit test).
- A GET body with `envs: []` (empty, valid) → passes on to the forbidden check and the write (E5 positive control
  already uses a list; Task 3 adds an `envs: []` unit case).
- The refusal line must not grow unbounded with junk: duplicate `không rõ tên` items collapse to one (Task 2 unit test).

---

### Task 1: Fake Vercel API answers per call, in the documented shape

**Files:**
- Modify: `tools/deploy/deploy.test.ts` (Ctx interface ~164-185, `fresh` ~308-352, E6 positive control ~1408)

**Interfaces:**
- Produces: `ctx.vercelReply: { get?: Reply; post?: Reply }` where `type Reply = { status: number; body: unknown }`
  (`body` string = sent raw, else JSON-encoded); `ctx.served: { method: string; text: string }[]` (every body the fake
  sent); default replies: GET 200 `{ envs: ctx.vercelEnvs.map(key => ({ key })) }`, POST 201
  `{ created: posted.map(({key,type,value,target}) => ({key,type,value,target})), failed: [] }`. `ctx.apiStatus` kept:
  when ≠ 200 it still wins with the 403 body.
- Serves: E5. independent: false (Tasks 2–4 use it).

- [ ] **Step 1:** Implement the Ctx fields and the server branch above; rename the E6 positive-control title to say 201.
- [ ] **Step 2:** Add case `E5 · <env>: Vercel trả đúng khuôn tài liệu (201, created đủ sáu, failed rỗng) → bien đạt, chín bước xanh`
  for both envs: `expectGreen`, and assert `ctx.served` POST text parses to `failed: []` and six `created` keys.
- [ ] **Step 3:** Run `npx vitest run tools/deploy --coverage.enabled=false` → all pass (code still ignores the reply).
- [ ] **Step 4:** Commit `test(bien-vercel-tu-choi): fake Vercel API answers in the documented shape`.

### Task 2: Read the write reply — refused or unconfirmed variables go red

**Files:**
- Modify: `tools/deploy/len-ban.mjs` (`stepVercelVars` ~317-338; two exported helpers next to it)
- Modify: `tools/deploy/deploy.test.ts` (new describes E1, E2, E3; `expectNoMarker` → `markerLeak`)

**Interfaces:**
- Consumes: Task 1 `ctx.vercelReply`, `ctx.served`.
- Produces (exported from `len-ban.mjs`): `refusedItems(reply: unknown): string[]` — the printed items of `failed`, in
  order, deduped (empty when `failed` is absent or not an array); `confirmedKeys(reply: unknown): Set<string>` — keys
  of `created` (array → each element's `key`; object → its `key`; else empty).
- Produces (test file): `markerLeak(text: string): string | null` → `giá trị của <NAME> lộ ra` for the first
  `moc-bi-mat-<NAME>` or LOGIN_PW found, else null; `expectNoMarker` asserts `markerLeak(...)` is null.
- Serves: E1, E2, E3. independent: false.

- [ ] **Step 1: Failing tests.** Describe `E1 · Vercel từ chối ghi biến` — for each env × cells E1-a…E1-e of the
  evals.yaml matrix (created = six, only `failed` changes): exact line `deploy <env>: bien ĐỎ — <reason>`, last line
  `deploy <env>: DỪNG ở bien — tên miền không đổi`, code ≠ 0, `ctx.api` methods `["GET","POST"]`, `r.vercel` `[]`,
  `domainId(ctx)` `dpl_cu`, `expectNoMarker`.
  Describe `E2 · không lộ giá trị` — both envs: failed for AUTH_SECRET, RESEND_API_KEY, DATABASE_URL with
  `error.value` = the posted value and `error.message` = `` `value ${v} is invalid` ``; assert served POST text contains
  `moc-bi-mat-AUTH_SECRET` twice (source control), line `… Vercel từ chối ghi biến AUTH_SECRET, RESEND_API_KEY, DATABASE_URL`,
  `markerLeak(stdout+stderr+calls)` null; plus `E2 · chiều đỏ`: same output with `moc-bi-mat-AUTH_SECRET` appended →
  `markerLeak` returns `giá trị của AUTH_SECRET lộ ra`.
  Describe `E3 · Vercel không xác nhận` — both envs × five cells (missing DATABASE_URL+APP_ENV; `created: []`; no
  `created`; `created: {}`; raw body `not json`), reasons per the matrix.
  Unit cases (Review Focus): `confirmedKeys({created:{key:"APP_URL"}})` → `{APP_URL}`; `refusedItems({failed:{}})` → `[]`;
  `refusedItems({failed:["x", null, {error:{}}]})` → `["không rõ tên"]`.
- [ ] **Step 2:** Run `npx vitest run tools/deploy/deploy.test.ts --coverage.enabled=false -t "E1|E2|E3"` → FAIL (bien đạt).
- [ ] **Step 3:** Implement the helpers and, after the POST in `stepVercelVars`: `refusedItems` non-empty →
  `throw new Red("Vercel từ chối ghi biến " + items.join(", "))`; else missing = `VERCEL_VARS` keys not in
  `confirmedKeys` → `throw new Red("Vercel không xác nhận đã ghi biến " + missing.join(", "))`.
- [ ] **Step 4:** Re-run → PASS; then the whole folder `npx vitest run tools/deploy --coverage.enabled=false` → PASS.
- [ ] **Step 5: Break test.** In a scratch copy of `len-ban.mjs` with each new `throw` removed in turn (swap in place,
  run, restore with `git checkout -- tools/deploy/len-ban.mjs`): E1/E2 fail with «bien đạt» when the refusal throw is gone; E3 fail when
  the confirm throw is gone. Record the two runs in the commit body.
- [ ] **Step 6:** Commit `fix(deploy): bien goes red when Vercel refuses or does not confirm a variable`.

### Task 3: Read the listing reply — a listing without `envs` goes red

**Files:**
- Modify: `tools/deploy/len-ban.mjs` (`stepVercelVars` after the GET)
- Modify: `tools/deploy/deploy.test.ts` (describe E4)

**Interfaces:**
- Consumes: Task 1 `ctx.vercelReply.get`.
- Serves: E4. independent: false.

- [ ] **Step 1: Failing tests.** `E4 · danh sách biến lạ khuôn` — both envs × three GET bodies: `{key:"APP_URL",type:"plain",value:"x"}`,
  `{envs:{}}`, raw `not json`: line `deploy <env>: bien ĐỎ — Vercel trả danh sách biến không đúng khuôn`, last line DỪNG,
  `ctx.api` methods `["GET"]` (0 POST), `r.vercel` `[]`, domain `dpl_cu`. Unit-level: GET `{envs: []}` → bien đạt.
- [ ] **Step 2:** Run with `-t "E4"` → FAIL.
- [ ] **Step 3:** In `stepVercelVars`: `if (!Array.isArray(listing?.envs)) throw new Red("Vercel trả danh sách biến không đúng khuôn")`
  before building `keys`; build keys from `listing.envs`.
- [ ] **Step 4:** Re-run `-t "E4"` and the whole folder → PASS. Break test: remove the throw → E4 fails with «bien đạt».
- [ ] **Step 5:** Commit `fix(deploy): bien goes red when Vercel's variable listing has no envs array`.

### Task 4: Runbook rows and their check

**Files:**
- Modify: `docs/van-hanh/dua-ban-len.md` (table «Đỏ thì làm gì», after the two `bien` rows ~100-101)
- Modify: `tools/deploy/deploy.test.ts` (describe E6)

**Interfaces:**
- Produces (test file): `soTayFindings(md: string): string[]` — for each of the three reasons
  (`Vercel từ chối ghi biến <tên>`, `Vercel không xác nhận đã ghi biến <tên>`, `Vercel trả danh sách biến không đúng khuôn`),
  `sổ tay thiếu hàng bien: <reason>` unless a line starting `` | `bien` `` contains it.
- Serves: E6, E6b. independent: false (same test file).

- [ ] **Step 1: Failing test.** `E6 · sổ tay có hàng cho mỗi lý do đỏ của bien`: `soTayFindings(real file)` → `[]`;
  `E6 · chiều đỏ`: the real text minus the `Vercel từ chối ghi biến` row →
  `["sổ tay thiếu hàng bien: Vercel từ chối ghi biến <tên>"]`.
- [ ] **Step 2:** Run → FAIL (rows absent).
- [ ] **Step 3:** Add three rows, column 2 the reason in backticks, column 3 per the design doc «Sổ tay»: each says the
  build did not run and the domain did not change; refused → do not delete or edit the variable on Vercel, send the whole
  red line (with Vercel's code) to the code keeper; not confirmed / listing → run again once, still red → send the line
  to the code keeper. No value, no JSON field names. Keep the table's column padding.
- [ ] **Step 4:** Re-run → PASS. Commit `docs(van-hanh): runbook rows for the new bien red lines`.

### Task 5: Whole-repo check and wiki log

**Files:**
- Create: one file under `wiki/log/` via `make log`

- Serves: E7. independent: false.

- [ ] **Step 1:** `make log m="bien step reads Vercel's reply: refused, unconfirmed or envs-less replies stop the deploy before the build — bien-vercel-tu-choi"`.
- [ ] **Step 2:** `make check` → exit 0.
- [ ] **Step 3:** Commit `docs(wiki): log bien-vercel-tu-choi`.
