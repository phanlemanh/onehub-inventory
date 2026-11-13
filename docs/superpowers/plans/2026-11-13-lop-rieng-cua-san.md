# Lớp riêng của sàn (row 7e) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Each company keeps its own labels, custom fields, value dictionary, pending units and import templates on top
of the standard core; the inventory reads them, and the screen «Tuỳ chỉnh của sàn» lists, adds, edits and retires them
with the row 9e button set.

**Architecture:** Five company tables in migration 010 owned by the `company-config` module (forced RLS, one door
`withCompany`, no delete grant). Pure rules in `company-config/index.ts`; storage and the four-source code lookup in
`company-config/server.ts` (depends on `identity` for the doors and `catalog` for matching); writes only through
`/api/v1/company-layer/*`. The inventory page reads the signed-in company's labels and live fields; custom columns come
after the eight standard columns. The new screen is shape A: five parts in the App Shell's second column, one
`DataRegion` per part.

**Tech Stack:** TypeScript, Next.js 16 app router, PostgreSQL 16 (lane R, port 5565), zod, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-13-lop-rieng-cua-san-design.md`, contract
`_acceptance/lop-rieng-cua-san/contract.md` (AC-1…AC-11), evals `_acceptance/lop-rieng-cua-san/evals.yaml` (E1…E19),
button table `_acceptance/lop-rieng-cua-san/thao-tac-nhap.yaml`, scope answers in `decisions.jsonl` (seal 2026-11-13).

## Global Constraints

- Migration number is exactly `010` (`db/migrations/010_lop_rieng_cua_san.sql`); one migration, never edited after commit.
- Decision page is exactly `wiki/decisions/0029-cau-hinh-san-dua-vao-danh-tinh-va-danh-muc.md`.
- Every company table has `company_id`, `enable` + `force row level security`, policies on `app.current_company_id()`;
  `quy_hang_app` gets `select, insert, update` only — never `delete`/`truncate` (SP-1).
- Writes only through `/api/v1`; every handler opens `actionDoor(req, <action>)` before touching data.
- Five actions, names exact: `readCompanyLayer` (ListAgent, BuyerAgent, TeamLead, CompanyAdmin), `addCompanyLayer`,
  `editCompanyLayer`, `retireCompanyLayer`, `matchPendingUnits` (ListAgent, TeamLead, CompanyAdmin); scope `company`.
- Field kinds closed set: `text | number | date | single_select | boolean`. Caps: 20 live fields per company, 1–30
  options, names 1–40 chars trimmed, label words 1–40, raw text 1–40, pending code 1–80, template name 1–60, text value
  ≤ 500. Field code `^[a-z][a-z0-9_]{0,31}$`, never changed, never reused.
- Field names unique after folding against live custom fields, company labels and the standard inventory headers.
- Folding: NFD, drop combining marks, `đ→d`, lower case, collapse inner whitespace, trim.
- No hard delete anywhere: retire sets `retired_at`. A field's kind never changes on edit.
- User-facing words in `ontology/labels.yaml` (screen «Tuỳ chỉnh của sàn», parts Nhãn riêng · Trường riêng · Từ điển giá
  trị · Căn chờ khớp · Mẫu nhập, buttons from `thao-tac-nhap.yaml`); pick the dictionary add label per
  `design/language.md` (it adds ONE pairing, not a dictionary — supervisor note G-1311-100).
- The shared catalog never changes from this row; no write path into `catalog_*`.
- The customer page never reads company labels or fields (SP-4).
- No real personal data: `[Tên]`, `0900 000 0xx`, `[Sàn …]`.
- Load rule (G, 13/11): outside a grading turn run only this row's test files; never two heavy test commands at once.

## Chỗ cần chủ kho cho phép riêng

Task 1 sửa công cụ sinh mã từ mô hình nghiệp vụ (`tools/ontology_codegen.py`, tầng cao — chỉ chủ kho cho phép; giám sát
trả lời R-11): thêm kiểu «đối tượng» để lựa chọn của trường riêng và giá trị cột riêng trên một căn có kiểu thật. Chữ
«duyệt kế hoạch» của chủ kho là phép cho đúng chỗ sửa ấy và không gì khác trong `tools/`. Lối vòng nếu chủ kho không cho
(«duyệt kế hoạch, lối vòng»): không đụng công cụ; hai thuộc tính ấy khai kiểu chữ trong mô hình, mô-đun cấu hình sàn tự
đọc và kiểm chữ ấy ở mép (zod), hàng 10 nhận lại đúng cách làm đó. Không sửa tệp công cụ trước chữ của chủ kho.

## Review Focus

1. Two requests add the 20th and 21st field at the same moment — the database cap must hold (row lock in the trigger),
   not only the API count. Test in Task 2 (two transactions, one fails with `company_fields_limit`).
2. Folding Vietnamese «Đ»/«đ»: «ĐN» and «dn» must fold to the same key; `normalize('NFD')` alone leaves `đ`. Test in Task 3.
3. Editing a single_select field's options removes an option that dictionary entries still point to — those entries must
   stop resolving (not resolve to a missing option). Test in Task 4.
4. A pending unit whose code later matches a company code (7d alias) — lookup order still returns the company code
   first. Test in Task 4 (four-source order matrix).
5. A label override for a concept shown on the customer page — the customer page keeps the standard label. Test in
   Task 6 (`label()` call sites under `src/app/s/**` and `src/modules/sharing/ui/**` never receive overrides).

---

### Task 1: Business model — five entities, five actions, labels, module edges

**independent: false** (every later task reads the generated types) · serves E15, E16 (part), E8 (action names)

**Files:**

- Create: `ontology/entities/{CompanyLabel,CustomField,CompanyValueAlias,PendingUnit,ImportTemplate}.yaml`
- Modify: `tools/ontology_codegen.py` (new property type `json` → TS `Record<string, unknown>`, Python `dict`; the
  generator has no object type today — touches `tools/**`, ask G for the file before starting),
  `ontology/entities/Listing.yaml` (property `customFields: { type: json, display: none }`),
  `ontology/actions.yaml` (five rows from `thao-tac-nhap.yaml`, `status: live`), `ontology/labels.yaml`,
  `ontology/glossary.md`, `ontology/relations.yaml`, `architecture/modules.yaml` (company-config owns the five,
  `depends_on: [identity, catalog]`)
- Create: `wiki/decisions/0029-cau-hinh-san-dua-vao-danh-tinh-va-danh-muc.md`, `wiki/entities/{company-label,custom-field,company-value-alias,pending-unit,import-template}.md`
- Test: `tests/lop-rieng-ontology.test.ts` (ontology half; the migration half lands in Task 2)

**Interfaces:**

- Produces: generated `CompanyLabel`, `CustomField`, `CompanyValueAlias`, `PendingUnit`, `ImportTemplate`,
  `Listing.customFields?: Record<string, unknown>`; `ActionName` gains the five actions; label codes
  `CompanyLayer`, `CompanyLabels`, `CustomFields`, `ValueDictionary`, `PendingUnits`, `ImportTemplates`,
  `AddCompanyLabel`, `AddCustomField`, `AddValuePairing`, `MatchPendingUnits`, `RetireItem`, `RenameTemplate`.

- [ ] **Step 1:** Write `tests/lop-rieng-ontology.test.ts` → `describe("ontology")`: the five files exist (constant 5),
      each `reso: "none (our own)"`, no entity name equals a RESO name in `labels.yaml`; `CustomField.kind.values` equals
      `["text","number","date","single_select","boolean"]`; break case asserts message
      `field kinds differ from ontology: formula` when a copy adds `formula`.
- [ ] **Step 2:** Run `npx vitest run tests/lop-rieng-ontology.test.ts` → FAIL (files missing).
- [ ] **Step 3:** Write the YAML files, labels, actions, glossary, relations, modules edge; run `make gen`.
- [ ] **Step 4:** Run the test → PASS; `python3 tools/boundaries.py` → 0 errors; `make ontology` → green.
- [ ] **Step 5:** Write decision 0029 and the five entity pages (format `ontology/page-types.yaml`); commit
      `feat(company-config): model the company layer`.

### Task 2: Migration 010 and the isolation suite

**independent: true** (after Task 1) · serves E7, E16, E2 (database cap), E8 (database half)

**Files:**

- Create: `db/migrations/010_lop_rieng_cua_san.sql`, `db/tests/pha-thu/lop-rieng-khong-ep.sql`
- Modify: `db/tests/cach-ly.sql` (five tables), `tests/lop-rieng-ontology.test.ts` (migration half)

**Interfaces:**

- Produces tables `company_labels(id, company_id, concept, label, created_at, retired_at)`,
  `company_fields(company_id, code, name, kind, options jsonb, position, created_at, retired_at; pk (company_id, code))`,
  `company_value_aliases(id, company_id, field, raw, raw_fold, value, created_at, retired_at)`,
  `company_pending_units(id uuid, company_id, raw_code, building_text, unit_text, unit_key → catalog_units, matched_at,
created_at, retired_at)`, `company_import_templates(id uuid, company_id, name, signature text[], columns jsonb,
created_at, retired_at)`; partial unique indexes «one live row» per (company, concept) / (company, field, raw_fold) /
  (company, signature); trigger `company_fields_limit` (locks the company's rows, counts live fields, raises when > 20);
  check `company_fields_options` (single_select: 1–30 array; others: empty); permission rows and restrictive policies
  per action.

- [ ] **Step 1:** Extend the isolation suite with the five tables (company B and no-company sessions count 0 rows of A;
      no delete/truncate grant; foreign `company_id` insert refused) and add the break file that drops `force row level
security` on `company_fields`.
- [ ] **Step 2:** Run `DB_LANE=r DB_PORT=5565 bash db/scripts/cach-ly.sh` → FAIL (tables missing).
- [ ] **Step 3:** Write migration 010 (pattern of 007 §6–7 and 009); the suite's scratch databases apply every
      migration in `db/migrations/` themselves.
- [ ] **Step 4:** Suite → PASS; break file → red with the line naming `company_fields`; ontology test migration half
      (columns = properties, kinds check = ontology set, no `delete` grant, no table named `*rule*|*workflow*|*formula*`) → PASS.
- [ ] **Step 5:** Commit `feat(db): company layer tables (migration 010)`.

### Task 3: Pure rules

**independent: true** (after Task 1) · serves E3, E10 (kind map), parts of E2, E4, E6

**Files:**

- Create: `src/modules/company-config/rules.ts`, `src/modules/company-config/custom-value.test.ts`,
  `src/modules/company-config/rules.test.ts`
- Modify: `src/modules/company-config/index.ts` (re-export)

**Interfaces:**

- Produces: `fold(text: string): string`; `checkCustomValue(field: Pick<CustomField,"kind"|"options"|"retiredAt">,
value: unknown): { ok: true } | { ok: false; reason: "wrong-kind" | "too-long" | "not-an-option" | "bad-date" |
"field-retired" }`; `checkFieldDraft(draft, existing: { liveFields; labels; standardHeaders }): FieldProblem[]`
  where `FieldProblem = "kind-unknown" | "name-empty" | "name-too-long" | "name-taken" | "options-count" |
"options-duplicate" | "options-not-allowed" | "field-limit"`; `columnKindOf(kind: CustomField["kind"]): DisplayKind`
  (text→text, number→count, date→date, single_select→select, boolean→boolean); `templateSignature(headers: string[]):
string[]` (folded, order kept); `FIELD_LIMIT = 20`, `OPTION_LIMIT = 30`.

- [ ] **Step 1:** Write `custom-value.test.ts` with the 25-case matrix of E3 (constant 25) and the break case
      `invalid date accepted: 2026-02-30`; write `rules.test.ts`: fold matrix «ĐN», «dn», « Đn », «CÒN», «con», «BIỂN»
      (constant 6, all equal pairwise per pair), kind map (constant 5), name-taken matrix of E2 (constant 4).
- [ ] **Step 2:** Run `npx vitest run src/modules/company-config` → FAIL.
- [ ] **Step 3:** Implement `rules.ts` (dates by `YYYY-MM-DD` regex plus UTC round-trip, never `Date.parse` alone).
- [ ] **Step 4:** Run → PASS. Commit `feat(company-config): rules of the company layer`.

### Task 4: Storage, lookup and match

**independent: false** (needs Tasks 2, 3) · serves E1, E2, E4, E5, E6

**Files:**

- Create: `src/modules/company-config/store.ts`, `src/modules/company-config/server.ts`,
  `tests/db/lop-rieng.db.test.ts` (blocks `labels`, `fields`, `value aliases`, `pending units`, `import templates`)

**Interfaces:**

- Consumes: `withCompany`, `RunAs` pattern of `listings/saved-views.ts`; pure `lookupCode(code, { companyAliases,
catalogAliases })` of `@/modules/catalog` (7d, `lookup.ts`) — the store reads the two alias lists, then tries the
  company's pending units when it returns `source: null`.
- Produces (all take `run: RunAs`): `readLayer(run): Promise<CompanyLayer>` (five lists, live rows only, fields by
  position); `addLabel / editLabel / retireLabel`, `addField / editField (name, options; kind fixed) / retireField`,
  `addAlias / editAlias / retireAlias`, `addPendingUnit / retirePendingUnit`, `saveTemplate / renameTemplate /
retireTemplate`, `findTemplate(run, headers): Promise<{ template; retiredColumns: number[] } | null>`,
  `lookupInCompany(run, code): Promise<{ source: "company" | "catalog" | "reader" | "pending"; ... } | null>`,
  `matchPendingUnits(run): Promise<{ matched: number; waiting: number }>`; each write returns
  `{ ok: true; id } | { ok: false; problem: FieldProblem | "concept-unknown" | "value-not-in-set" | "taken" |
"target-unknown" }`.

- [ ] **Step 1:** Write the five db-test blocks with E1, E2, E4, E5, E6 expectations as written in `evals.yaml`, plus
      Review Focus 1 (concurrent 21st field), 3 (option removed → alias stops resolving) and 4 (lookup order).
- [ ] **Step 2:** Run `DB_LANE=r DB_PORT=5565 npx vitest run -c vitest.db.config.ts tests/db/lop-rieng.db.test.ts` → FAIL.
- [ ] **Step 3:** Implement `store.ts` and `server.ts` (`import "server-only"`); match hashes nothing in `catalog_*`.
- [ ] **Step 4:** Run → PASS. Commit `feat(company-config): store, lookup and match of the company layer`.

### Task 5: `/api/v1/company-layer`

**independent: false** (needs Task 4) · serves E1, E2, E4, E5, E6, E8 (API half)

**Files:**

- Create: `src/modules/company-config/company-layer-http.ts`, `src/app/api/v1/company-layer/route.ts` (GET layer),
  `src/app/api/v1/company-layer/[part]/route.ts` (POST add), `src/app/api/v1/company-layer/[part]/[id]/route.ts`
  (PATCH edit, POST `?ngung=1` retire), `src/app/api/v1/company-layer/pending-units/match/route.ts`
- Modify: `tests/db/lop-rieng.db.test.ts` (route-level calls; block `permissions` with the 20-cell table written in the
  test, not read from `actions.yaml`)

**Interfaces:**

- Produces `createCompanyLayerHandlers(deps: { door; withCompany }): { read; add(req, part); edit(req, part, id);
retire(req, part, id); match(req) }`; error codes: door errors + `bad-request`, the problems of Task 4; status 400 for
  problems, 403 forbidden, 404 not-found. `part ∈ "labels" | "fields" | "aliases" | "pending-units" | "templates"`.

- [ ] **Step 1:** Write route-level tests (E8 matrix constant 20; ListAgent POST label 200, BuyerAgent 403; break case
      `insert allowed without addCompanyLayer`).
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement (pattern of `saved-views-http.ts`). **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat(api): company layer endpoints`.

### Task 6: Inventory reads the company's words

**independent: false** (needs Task 4) · serves E9, E10, E11, E17

**Files:**

- Modify: `src/components/candidate/column-kind.ts` (`customColumn(spec: { code: string; header: string; kind:
DisplayKind }): TypedColumn`, field key `custom.<code>`), `src/modules/listings/ui/inventory-rows.ts`
  (`inventoryColumns(headers, customFields?)`, rows carry `custom.<code>` from `Listing.customFields`),
  `src/app/(app)/inventory/page.tsx` (read layer through `company-config/server`, pass overrides to `label()`),
  `src/modules/listings/sample.ts` (sample `customFields` for codes `huong_view`, `ghi_chu`)
- Create: `src/components/candidate/column-kind.test.ts`, `tests/e2e-db/lop-rieng.spec.ts` (case
  `company words on inventory`)

**Interfaces:**

- Consumes `readLayer`, `columnKindOf`.

- [ ] **Step 1:** Unit test of E10 (kind map, custom after standard, break `custom column before standard columns`);
      browser case of E9 (10 headers in order, retired field absent, company B sees 8 standard with «Toà»); Review Focus 5
      as a source scan in `column-kind.test.ts`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run unit + `DB_LANE=r DB_PORT=5565 npx playwright test
-c playwright.db.config.ts tests/e2e-db/lop-rieng.spec.ts -g "company words"` → PASS.
- [ ] **Step 5:** Commit `feat(inventory): company labels and custom columns`.

### Task 7: Screen «Tuỳ chỉnh của sàn» with the button set

**independent: false** (needs Tasks 5, 6) · serves E12, E13, E14, E18, E19

**Files:**

- Create: `src/app/(app)/tuy-chinh-san/page.tsx`, `src/modules/company-config/ui/{index.ts,layer-part.tsx,
add-dialogs.tsx,copy.ts}`
- Modify: `src/app/(app)/nav.ts` (real entry `/tuy-chinh-san`, `action: "readCompanyLayer"`, five `?phan=` items;
  remove `PROTO_NAV`), `design/screens.yaml` (`tuy-chinh-san`, family `grid`), `_acceptance/lop-rieng-cua-san/chung-minh-man.md`,
  `tests/e2e/axe` list, `tests/e2e-db/lop-rieng.spec.ts` (cases `review screen`, `add and edit on screen`)
- Delete: `src/app/(app)/proto/lop-rieng-cua-san/`

**Interfaces:**

- Consumes the handlers of Task 5 through `fetch('/api/v1/company-layer/…')`; `PermittedAction`, `RowActions`,
  `FormDialog`, `DataRegion`; the button table of `thao-tac-nhap.yaml`.

- [ ] **Step 1:** Browser cases of E12 (5 parts × buttons constant 5; 4 roles × 5 parts constant 20; no item with
      «Xoá»; edit, retire, match round trips; 403 notice; axe light and dark) and E19 (four errors constant 4 under the
      field; kind locked on edit; retire keeps the row).
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement shape A (second column, one `DataRegion` per part, head buttons and
      «…» through `PermittedAction`). **Step 4:** Run → PASS; `python3 tools/proof_gate/check.py --root .` → green.
- [ ] **Step 5:** Commit `feat(company-config): review screen with the row 9e button set`.

### Task 8: Records and the whole check

**independent: false** (last) · serves E15, E17, E18

**Files:** `wiki/log.md`, `wiki/entities/listing.md` (custom fields), `design/so-khoi.yaml` (only if a block entered the
store), `design/vai-man-nut.md` (regenerated), `docs/plan/lo-trinh.json` (row 7e state via the kit only).

- [ ] **Step 1:** `python3 tools/coverage_matrix/buttons.py` (new screen appears), `make gen`, `make check` (outside a
      grading turn: the unit part only, per the load rule) → green.
- [ ] **Step 2:** Commit `docs(lop-rieng-cua-san): records of row 7e`.
