# Nhập Excel (hàng 11) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Đầu chủ nạp tệp `.xlsx`/`.csv`, máy ghép năm chỗ (cột, tên cột, giá trị, căn, dạng tệp) với bốn dấu mỗi ô, xem trước, áp theo gói 200 dòng thành lần chào trên Bảng hàng (kể cả căn chờ khớp), sàn học lựa chọn, lần sau cùng dạng không hỏi lại, hoàn tác cả lần nhập.

**Architecture:** Mô-đun `imports` làm chủ luật dấu (hàm thuần, chạy cả trình duyệt lẫn máy chủ), bảng `import_runs` và cửa `/api/v1/imports`. Ghi lần chào qua hàm mới ở cửa server của `listings`; ghi phần học qua hàm mới của `company-config` và `catalog`. Tệp đọc trên trình duyệt; máy chủ chỉ nhận bảng chữ.

**Tech Stack:** TypeScript, Next.js 16 route handlers, Postgres (RLS, `withCompany`), zod, Vitest, Playwright, `read-excel-file@9.3.14` (ghim, ≥ 14 ngày tuổi), ReUI `solution-crm-6` (stepper, use-file-upload).

**Spec:** `docs/superpowers/specs/2026-11-17-nhap-excel-design.md` · hợp đồng `_acceptance/nhap-excel/contract.md` (đã duyệt 606ddb1) · bộ chấm `_acceptance/nhap-excel/evals.yaml`.

## Global Constraints

- Không AI: không import mô-đun `llm` trong `src/modules/imports/**` và `src/app/api/v1/imports/**` (E9).
- Tệp không lên máy chủ: chỉ JSON `{headers, rows}`; trần 10 MB, 5.000 dòng; `.xlsx` trang đầu có dữ liệu; `.csv` UTF-8 có/không BOM, phẩy hoặc chấm phẩy.
- Gói ghi: 200 dòng; mỗi gói một giao dịch `withCompany`; gửi lại cùng `(runId, batchNo)` không ghi trùng.
- Bốn dấu đúng tên: `keep` (Giữ nguyên) · `fixed` (Máy sửa) · `ask` (Cần người) · `block` (Chặn).
- Một luật một chỗ: dấu ô từ `markCell`; giá từ `readPrice`; trạng thái qua `canMove("Incomplete", to)`; giá trị trường riêng từ `checkCustomValue`; gấp chữ từ `fold`.
- Không chữ cứng trong `src/`: nhãn từ `ontology/labels.yaml` (≤ 17 ký tự mỗi nhãn mới) hay tệp chữ của mô-đun.
- Migration số 015 (chốt theo thứ tự gộp); không sửa migration đã commit.
- Không dữ liệu thật: `[Tên]`, `0900 000 0xx`.
- Không chạm `src/modules/listings/**` ngoài `create.ts`, dòng export ở `server.ts`/`index.ts`, `inventory-read.ts` cho tới khi 3g gộp (G-1711-17); `ui/inventory-grid.tsx`, `ui/inventory-rows.ts`, `inventory/page.tsx` chỉ sửa sau khi 3g gộp và kéo main.
- Bài đếm sau khi mở trang chờ `regionReady`; đổi trang qua `pageReady`; thư mục tạm qua `tempDir()`.

## Review Focus

- Tệp có dòng trống xen giữa và cột tiêu đề trùng tên («Giá», «Giá») — tiêu đề trùng phải thành hai cột riêng, dòng trống bỏ qua không đếm (Task 3).
- Ô số trong `.xlsx` là số thật (4650000000) chứ không phải chữ — `readPrice` nhận số nguyên đồng (Task 4).
- Hai người cùng sàn nạp cùng lúc học cùng một cách viết — lần ghi thứ hai không lỗi, không ghi trùng (Task 6, ca «học trùng»).
- Đứt mạng giữa gói 2 rồi đóng màn — lần nhập dở hiện ở «Lần nhập gần đây» với «Tiếp tục» hay «Hoàn tác» (Task 7, Task 8).
- Căn chờ khớp do lần nhập tạo đã được khớp vào danh mục trước khi hoàn tác — hoàn tác gỡ lần chào, không ngừng dùng căn đã khớp (Task 7, ca «hoàn tác sau khớp»).

---

### Task 0: Nền — kéo main, thư viện, khối ReUI, lệnh chấm

**Files:** Modify `package.json`, `package-lock.json`, `_acceptance/config.yaml`; Create (CLI) `src/components/reui/stepper.tsx`, `src/hooks/use-file-upload.ts` (đường CLI quyết).
**Phục vụ:** mọi eval (lệnh chấm). **independent: false** (mọi task sau cần).

- [ ] Kéo `origin/main` (ea774a0, VP6 migration 014) vào nhánh; `make gen`.
- [ ] `npm install read-excel-file@9.3.14 --save-exact`.
- [ ] `npx shadcn@latest add @reui/stepper @reui/use-file-upload` (khoá `REUI_LICENSE_KEY` từ môi trường); `make design-components`.
- [ ] Thêm bốn lệnh vào `_acceptance/config.yaml` đúng như đầu `evals.yaml` (`executors.test.nhap_excel_unit`, `executors.script.nhap_excel_db`, `executors.script.nhap_excel_e2e`, `executors.script.cach_ly_d`).
- [ ] Verify: `make check` xanh. Commit `chore(nhap-excel): pin read-excel-file, add ReUI stepper and grading commands`.

### Task 1: Ontology — Lần nhập, lần chào trỏ căn chờ khớp, hai thao tác

**Files:** Create `ontology/entities/ImportRun.yaml`, `wiki/entities/import-run.md`; Modify `ontology/entities/ListingUnit.yaml` (hay thực thể giữ `upi`), `ontology/relations.yaml`, `ontology/actions.yaml`, `ontology/labels.yaml`, `ontology/glossary.md`, `architecture/modules.yaml`; Generated `src/generated/**`; Test `tests/nhap-excel-ontology.test.ts`.
**Phục vụ:** E11. **independent: false**.

**Interfaces — Produces:** kiểu sinh `ImportRun { id: string; companyId: string; importedBy: string; listAgentUserId: string; fileName: string; sheetName: string | null; signature: string[]; rowCount: number; createdCount: number; learned: ImportLearned; kept: KeptCell[]; status: "open" | "done" | "undone"; createdAt: string; undoneAt: string | null }`; thao tác `importListings` (command, `{ ListAgent: own, TeamLead: company }`, live), `createListing` → live, scope `{ ListAgent: own, TeamLead: company }`.

- [ ] Chạy `/ontology-add` cho ImportRun và quan hệ ListingUnit → PendingUnit (đúng một trong `upi`, `pendingUnitId`). Nhãn mới: `ImportRun` «Lần nhập», `ImportFile` «Nạp tệp».
- [ ] `modules.yaml`: `imports` owns `[ImportRun]`, depends_on `[identity, catalog, company-config, listings]`.
- [ ] Viết `tests/nhap-excel-ontology.test.ts` đúng `expected` của E11 (so tập thuộc tính ImportRun với cột `import_runs` đọc từ tệp migration 015; ca phá ghim `'ontology property without column: ImportRun.fileName'`). Chạy: đỏ vì chưa có migration.
- [ ] `make gen && make ontology`. Commit `feat(ontology): ImportRun and listing on a pending unit (row 11)`.

### Task 2: Migration 015 và bộ kiểm cách ly

**Files:** Create `db/migrations/015_nhap_excel.sql` (qua `/new-migration`), `db/tests/pha-thu/nhap-excel-xoa-mo.sql`; Modify `db/tests/cach-ly.sql`.
**Phục vụ:** E10, E11. **independent: false** (sau Task 1).

- [ ] `/new-migration`: bảng `import_runs` (cột như ImportRun, `learned jsonb`, `kept jsonb`, `batches_done int[]`), RLS ép buộc, quyền `select, insert, update` cho vai ứng dụng, không `delete`; `listings.import_run_id bigint null references import_runs`; `listing_units.upi` bỏ `not null`, thêm `pending_unit_id` trỏ `company_pending_units`, check `num_nonnulls(upi, pending_unit_id) = 1`, index duy nhất lần chào mở theo `(company_id, pending_unit_id) where open`; cấp `insert` trên `listings`, `listing_units`; luật `delete` trên `listings`: `import_run_id is not null and version = 1 and` lần nhập chưa hoàn tác `and app.allowed('importListings') is not null`; dòng `app.permissions` cho `importListings` và `createListing` (ListAgent own, TeamLead company).
- [ ] Ca cách ly cho `import_runs` và luật chèn, xoá lần chào; tệp phá nới luật xoá thành theo sàn → bộ kiểm đỏ với dòng ghim `'listings delete not limited to import'`.
- [ ] Verify: `DB_LANE=d DB_PORT=5571 make db-up` rồi `executors.script.cach_ly_d` xanh; chạy tệp phá: đỏ có dòng ghim. Commit `feat(db): 015 import runs, listings on pending units, limited delete (row 11)`.

### Task 3: Đọc tệp trên trình duyệt + bộ tệp thử có đáp án

**Files:** Create `src/modules/imports/read-file.ts`, `src/modules/imports/csv.ts`, `src/modules/imports/copy.ts`; `tests/fixtures/nhap-excel/{gon.xlsx, ban.xlsx, ban-2.xlsx, sheet.csv, excel-vn.csv, khoa.xlsx, hong.xlsx, NGUON.md, dap-an.json, lua-chon.json}`, `tests/fixtures/nhap-excel/tao.mjs` (bộ ghi, thư viện khác bộ đọc); Test `tests/nhap-excel-doc-tep.test.ts`.
**Phục vụ:** E1. **independent: true** (chỉ cần Task 0).

**Interfaces — Produces:** `readTable(file: File | Blob, name: string): Promise<ReadTable>`; `type ReadTable = { ok: true; sheet: string | null; otherSheets: string[]; headers: string[]; rows: string[][] } | { ok: false; problem: ReadProblem }`; `ReadProblem = "wrong-type" | "too-big" | "too-many-rows" | "empty" | "header-only" | "broken" | "locked"`; `readCsv(text: string): string[][]`; hằng `FILE_LIMIT_BYTES = 10 * 1024 * 1024`, `ROW_LIMIT = 5000`.

- [ ] Viết `tao.mjs` sinh các tệp bằng `exceljs` (devDependency đã có hay npx tạm — không vào gói chạy); ghi `NGUON.md` (ai ghi, khuôn Google Sheet «Tải xuống» cho `sheet.csv`, khuôn Excel bản Việt cho `excel-vn.csv`, ô ngày dạng số, chuỗi dùng chung). Dữ liệu `[Tên]`, `0900 000 0xx`.
- [ ] Bài E1 đúng `expected` (6 tệp đọc đúng, 7 lỗi, ca phá `'row limit not enforced: 5001'`); thêm ca Review Focus: tiêu đề trùng thành hai cột, dòng trống bỏ.
- [ ] Hiện thực: ô xlsx là số/ngày thì trả chữ chuẩn (số nguyên không dấu phân cách, ngày `YYYY-MM-DD`); csv theo RFC 4180, đoán phân cách theo dòng tiêu đề.
- [ ] Verify `npx vitest run tests/nhap-excel-doc-tep.test.ts`. Commit `feat(imports): read xlsx and csv in the browser (row 11)`.

### Task 4: Luật dấu thuần — cột, giá trị, căn, bảng, câu hỏi

**Files:** Create `src/modules/imports/{headers.ts, columns.ts, values.ts, units.ts, mark.ts, questions.ts}`, export ở `src/modules/imports/index.ts`; Test `tests/nhap-excel-ghep-cot.test.ts`, `tests/nhap-excel-gia-tri.test.ts`, `tests/nhap-excel-khong-mat-o.test.ts`.
**Phục vụ:** E3, E5, E7. **independent: true**.

**Interfaces — Consumes:** `fold`, `checkCustomValue`, `checkFieldDraft`, `valueSetOf`, `templateSignature` (company-config index); `readPrice`, `canMove` (listings index); `LayerTemplate`, `LayerLabel`, `LayerAlias`, `LayerField` (types).
**Produces:**

- `type Mark = "keep" | "fixed" | "ask" | "block"`; `type Target = { standard: string } | { custom: string } | { newField: { name: string; kind: FieldKind; options: string[] } } | { skip: true }`.
- `matchColumns(headers: string[], layer: LayerView, choices: ColumnChoices): ColumnMatch[]` với `ColumnMatch = { index: number; header: string; target: Target | null; mark: Mark; why: ColumnWhy; learnLabel: boolean | null }`; `ColumnWhy = "template" | "company-label" | "standard-label" | "header-dictionary" | "unknown" | "same-target" | "no-unit-column" | "owner-column" | "chosen"`.
- `markValue(target: Target, raw: string, ctx: ValueContext): CellMark` với `CellMark = { mark: Mark; value: string | number | boolean | null; why: string }`.
- `markUnit(raw: string, found: UnitFound, ctx: UnitContext): CellMark` với `UnitFound = { kind: "catalog"; via: "company" | "catalog" | "reader"; unitKeys: string[] } | { kind: "pending"; pendingUnitId: string } | { kind: "none" }` (tra mã thật ở máy chủ, Task 7).
- `markTable(table: { headers: string[]; rows: string[][] }, layer: LayerView, choices: Choices, units: Map<string, UnitFound>, listed: Set<string>): MarkedTable` với `MarkedTable = { columns: ColumnMatch[]; cells: CellMark[][]; counts: Record<Mark, number>; createCount: number; keptCount: number; canApply: boolean; questions: Question[] }`.
- `groupQuestions(...)`: một câu cho mỗi `(cột, fold(raw))`, mỗi mã căn ra nhiều căn, mỗi nhóm mã không ra.

- [ ] Ba bài đúng `expected` E3 (24 ca), E5 (47 ca), E7 (sáu lượt so đáp án, in `o dung k/n`), mỗi bài một ca phá ghim thông điệp như trong evals.yaml. Từ điển tiêu đề trong `headers.ts` gồm ít nhất các cách viết của E3 và «Ngày check», «Cập nhật» → `Listing.lastConfirmedAt`.
- [ ] Hiện thực; trạng thái: `canMove("Incomplete", to)` sai → `ask` (Hỏi-5); ngày xác nhận sau hôm nay (giờ Việt Nam) → `ask` (Hỏi-13).
- [ ] Verify `executors.test.nhap_excel_unit` xanh. Commit `feat(imports): deterministic marks for columns, values and units (row 11)`.

### Task 5: Cửa tạo lần chào ở mô-đun listings

**Files:** Create `src/modules/listings/create.ts`; Modify `src/modules/listings/server.ts` (thêm dòng export); Test `src/modules/listings/create.test.ts` (đơn vị), ca DB ở Task 7.
**Phục vụ:** E9, E14. **independent: false** (sau Task 2).

**Interfaces — Produces:** `createListings(c: DbClient, items: NewListing[], importRunId: string): Promise<{ created: string[] }>` với `NewListing = { unit: { upi: string } | { pendingUnitId: string }; listAgentUserId: string; standardStatus: ListingStandardStatus; listPrice: number | null; feeInclusion: ... | null; furnished; occupantType; legalStatus; financing; customFields: Record<string, unknown>; lastConfirmedAt: string | null }`; `removeImportListings(c: DbClient, importRunId: string): Promise<{ removed: string[]; kept: string[] }>` (chỉ `version = 1`).

- [ ] Bài đơn vị: dựng câu chèn đúng cột, căn chờ khớp đi `pending_unit_id`, `last_confirmed_at` null khi không có ngày.
- [ ] Hiện thực trong giao dịch người gọi đưa vào; không mở kết nối riêng.
- [ ] Commit `feat(listings): create door for imported listings (row 11)`.

### Task 6: Ghi phần học — company-config và catalog

**Files:** Create `src/modules/company-config/import-learn.ts`, `src/modules/catalog/company-alias.ts`; Modify hai `server.ts` (export); Test ca DB ở Task 7.
**Phục vụ:** E4, E12, E14. **independent: false** (sau Task 2).

**Interfaces — Produces:** `learnFromImport(run: RunAs, learned: LearnInput): Promise<LearnedIds>` với `LearnInput = { template: { name; headers; columns: TemplateTarget[] } | null; labels: { concept; label }[]; fields: FieldDraft[]; aliases: { field; raw; value }[]; pendingUnits: { rawCode; buildingText; unitText }[] }`, `LearnedIds = { templateId?; labelIds: string[]; fieldCodes: string[]; aliasIds: string[]; pendingUnitIds: string[] }` — mục đã có (taken) bỏ qua, không lỗi; `retireLearned(run: RunAs, ids: LearnedIds): Promise<void>` qua `retireItem`; `addCompanyUnitCode(c: DbClient, code: string, unitKey: string): Promise<string | null>` (null khi đã có).

- [ ] Hiện thực bằng các hàm có sẵn (`addLabel`, `addField`, `addAlias`, `addPendingUnit`, `saveTemplate`, `retireItem`); không SQL mới trên bảng 7e.
- [ ] Commit `feat(company-config): learn and retire what one import taught (row 11)`.

### Task 7: Mô-đun imports phía máy chủ và cửa /api/v1/imports

**Files:** Create `src/modules/imports/{store.ts, imports-http.ts, server.ts}`, `src/app/api/v1/imports/route.ts` (POST mở lần nhập; GET lần nhập gần đây), `src/app/api/v1/imports/preview/route.ts`, `src/app/api/v1/imports/[id]/batches/route.ts`, `src/app/api/v1/imports/[id]/undo/route.ts`; Test `tests/db/nhap-excel.db.test.ts`.
**Phục vụ:** E4, E6, E8, E9, E12, E13, E14. **independent: false** (sau 2, 4, 5, 6).

**Interfaces — Produces (HTTP):**

- `POST /api/v1/imports/preview` `{ headers, rows, choices, listAgentUserId? }` → `200 MarkedTable` (không ghi).
- `POST /api/v1/imports` `{ fileName, sheetName, headers, rowCount, choices, listAgentUserId?, expectedCounts }` → `201 { id }`; 400 `blocked-cells`; 409 `counts-changed`; 403.
- `POST /api/v1/imports/[id]/batches` `{ batchNo, rows }` (≤ 200) → `200 { created, done: boolean, learned?: LearnedSummary }`; gửi lại `batchNo` đã ghi → `200 { created: 0 }`.
- `POST /api/v1/imports/[id]/undo` → `200 { removed, kept, retired }`; 409 `already-undone`; 403.
- `GET /api/v1/imports` → 10 lần nhập mới nhất của sàn.

- [ ] Viết `tests/db/nhap-excel.db.test.ts` theo khối của E4, E6, E8, E9, E12, E13, E14 (gọi route handler thật, vai quản trị của bài để đọc lại), cộng ca Review Focus «học trùng» và «hoàn tác sau khớp». Chạy: đỏ.
- [ ] Hiện thực: mỗi handler mở `actionDoor("importListings")` trước khi chạm dữ liệu; tra mã căn bằng `lookupInCompany`; tính lại `markTable` ở mỗi gói; đầu chủ: Đầu chủ = chính mình (mã người khác → 403), Trưởng nhóm chọn thành viên có vai ListAgent cùng sàn (khác sàn → 400); gói cuối xong mới `learnFromImport`; undo: `removeImportListings` + `retireLearned` + ngừng căn chờ khớp không còn lần chào.
- [ ] Verify `executors.script.nhap_excel_db` xanh. Commit `feat(imports): preview, batched apply, learn and undo over /api/v1 (row 11)`.

### Task 8: Màn Nạp tệp

**Files:** Create `src/app/(app)/nhap-tep/page.tsx`, `src/modules/imports/ui/{import-wizard.tsx, step-file.tsx, step-columns.tsx, step-values.tsx, step-preview.tsx, step-done.tsx, use-import.ts, index.ts}`, `design/patterns/luong-nhieu-buoc.md`, `tests/e2e-db/nhap-excel.spec.ts` (ca màn); Modify `design/screens.yaml` (màn `nhap-tep`, họ `luong-nhieu-buoc`, `vao: importListings`), `design/so-khoi.yaml` (khối khung năm bước từ solution-crm-6), `src/app/(app)/nav.ts`, `ontology/labels.yaml`, `tests/e2e/` axe; Delete `src/modules/imports/ui/import-wizard-proto.tsx`, `proto-copy.ts` và nhánh proto.
**Phục vụ:** E2, E16, E17, E18, E20. **independent: false** (sau 3, 4, 7).

- [ ] Ca trình duyệt của E2, E16 (bảng 30 ô trạng thái × khổ, 60 lần axe), E20 (số trên màn bằng thân trả lời), mỗi ca một ca phá ghim. Chạy: đỏ.
- [ ] Dựng theo khối solution-crm-6 (lối A, Hỏi-3): Frame + Stepper năm bước; bước Xem trước dùng `DataRegion`, cột tối thiểu `w-40` cuộn ngang; nhãn «Còn N chỗ chặn» đưa về cột/câu đầu cần gỡ; dưới 768 px trạng thái «Nạp tệp dùng trên máy tính»; đầu trang theo khuôn đang có (theo khuôn mới khi VP7 gộp).
- [ ] Chứng minh màn `chung-minh-man.md` mục `nhap-tep` lối họ mới đủ (`### Khối`, `### Vùng`, dòng sổ khối `ho_so: nhap-excel`); `python3 tools/proof_gate/check.py --root .` xanh.
- [ ] Verify `executors.script.nhap_excel_e2e` (ca màn) và `make check` xanh. Commit `feat(imports): the Nạp tệp screen (row 11)`.

### Task 9: Bảng hàng — nút Nạp tệp và căn chờ khớp (sau khi 3g gộp)

**Files:** Modify `src/modules/listings/inventory-read.ts`, `src/modules/listings/ui/inventory-rows.ts`, `src/app/(app)/inventory/page.tsx` (xin G sau khi 3g gộp); Test ca E15, E21 trong `tests/e2e-db/nhap-excel.spec.ts`.
**Phục vụ:** E15, E19, E21. **independent: false**.

- [ ] Kéo main sau khi 3g gộp; gửi G danh sách tệp listings sẽ chạm.
- [ ] Đường đọc: `left join company_pending_units` — cột Căn là `raw_code`, Toà là `building_text`, thuộc tính căn trống.
- [ ] Trạng thái trống: câu có MỘT liên kết «Nạp tệp» (không nút); đầu màn nút viền «Nạp tệp» qua `PermittedAction` với `importListings`.
- [ ] Verify E15, E21 xanh. Commit `feat(inventory): Nạp tệp entry and pending units on the inventory (row 11)`.

### Task 10: Đóng vòng — wiki, kiểm toàn bộ

**Files:** `wiki/log.md`, `wiki/entities/import-run.md`, `wiki/entities/listing.md`, `docs/tri-thuc/wiki/chu-de/nhap-excel.md` (dòng «MVP này giữ gì»), quyết định mới nếu có (số do G cấp).
**independent: false**.

- [ ] `make check`, `npm run build`, `make e2e`, cách ly dãy D xanh; `.claude/launch.json` trả về như main.
- [ ] Đặt hợp đồng `implemented`; S4.
