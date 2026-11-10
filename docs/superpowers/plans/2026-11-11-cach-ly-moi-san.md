# Cách ly mỗi sàn — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dựng nền cách ly dữ liệu giữa các sàn — lược đồ nền, một cửa truy vấn `withCompany`, và bộ kiểm cách ly 19 ca
chạy trên Postgres của dãy.

**Architecture:** Lược đồ chép nguyên văn từ Quỹ hàng. Cửa là hàm TypeScript không phụ thuộc trình điều khiển, ở mô-đun
identity. Bộ kiểm là tệp SQL chạy qua `psql` trong container Postgres của dãy, bọc bởi một lệnh bash đếm ca và phá thử.

**Tech Stack:** Postgres 16 (container `postgres:16` của `mk/db.mk`), bash, psql, TypeScript, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-11-cach-ly-moi-san-design.md` · hợp đồng `_acceptance/cach-ly-moi-san/contract.md`
· eval `_acceptance/cach-ly-moi-san/evals.yaml`.

## Global Constraints

- Không chạm `package.json`, `package-lock.json`, `.github/workflows/**`, `ontology/**`, `architecture/modules.yaml`.
- `db/migrations/001_nen_cong_ty.sql` là bản sao từng byte của `onehub-quy-hang` commit
  `1729b11f8dc57d0ebe3d8e380cdf8635705aceb8`, đường `packages/db/migrations/001_nen_cong_ty.sql`.
- Tên vai của API: `quy_hang_app`. Hai câu của cửa, nguyên văn:
  `set local role quy_hang_app` và
  `select set_config('app.user_id', $1, true), set_config('app.company_id', $2, true)`.
- Chú thích mã bằng tiếng Anh. Chuỗi in ra đã ghim trong eval đã ký giữ nguyên văn: `ok <ca>`, `HỎNG <ca>: <lý do>`,
  `đã áp <tệp>`, `xong — <n> migration mới`, `cach-ly: 19 ca đạt, vai quy_hang_app`.
- Dữ liệu mẫu: `[Sàn A]`, `[Sàn B]`, `[Tên]`; id sàn `00000000-0000-4000-8000-00000000000a` và `…0b`.
- Mọi đường tệp trong script suy từ vị trí script. Lệnh chỉ tạo và xoá cơ sở nháp tên `cach_ly_*`.
- Postgres của dãy: `make db-up DB_LANE=n DB_PORT=5563` → container `onehub-inventory-db-n`.

## Review Focus

- `DB_LANE` không đặt, có 0 hoặc từ 2 container `onehub-inventory-db-*` → lệnh dừng, nói cần `DB_LANE`, thoát khác 0
  (không chạy nhầm cơ sở của dãy khác). Thử ở Task 1 bước 4.
- `docker exec -i` nuốt đầu vào chuẩn của script gọi nó → mọi lời gọi `psql -c` phải `</dev/null`. Đo được khi nguyên
  lượt chạy đủ 19 ca (dừng giữa chừng là dấu hiệu). Task 4 bước 6.
- Một migration lỗi giữa chừng → giao dịch huỷ, sổ không ghi tệp đó, lệnh thoát khác 0. Thử ở Task 1 bước 4.
- Container chưa chạy → lỗi rõ «container … không chạy — make db-up DB_LANE=<lane>», không bao giờ xanh. Task 1 bước 4.
- Lượt trước bị giết để lại cơ sở nháp → `drop database if exists … with (force)` trước khi tạo. Task 4 bước 6.

---

### Task 1: Lược đồ nền và lệnh áp migration (AC-1 · E1)

`independent: false` — Task 4 cần.

**Files:**

- Create: `db/migrations/001_nen_cong_ty.sql` (chép nguyên văn)
- Create: `db/scripts/psql.sh` (hàm dùng chung: chọn container, gọi psql)
- Create: `db/scripts/migrate.sh`

**Interfaces:**

- Produces: `source db/scripts/psql.sh` cho hàm `pg_sql <db> [psql args…]` (đầu vào chuẩn chuyển thẳng vào psql,
  `-v ON_ERROR_STOP=1 -X -q`) và `pg_cmd <db> <câu>` (một câu, `</dev/null`); biến `PG_CONTAINER`.
  `bash db/scripts/migrate.sh <db>` → in `đã áp <tệp>` mỗi tệp mới, rồi `xong — <n> migration mới`; thoát khác 0 khi
  một tệp lỗi, tệp đó không vào sổ.

- [ ] **Step 1:** `cp` tệp nguồn; `cmp` với `git -C ../onehub-quy-hang show 1729b11f:packages/db/migrations/001_nen_cong_ty.sql` → khớp.
- [ ] **Step 2:** Viết `psql.sh`: `PSQL` đặt thì dùng nguyên; không thì container `onehub-inventory-db-$DB_LANE`, hoặc
      container `onehub-inventory-db-*` duy nhất đang chạy; không/ nhiều → `echo "cần DB_LANE: …" >&2; exit 2`; container
      không chạy → báo `make db-up DB_LANE=<lane>`, thoát 2.
- [ ] **Step 3:** Viết `migrate.sh`: tạo `public.schema_migrations (name text primary key, applied_at timestamptz not null default now())`
      nếu chưa có; mỗi tệp `NNN_*.sql` theo thứ tự chưa có trong sổ → nối tệp + câu ghi sổ, đưa vào `pg_sql <db> -1 -f -`.
- [ ] **Step 4:** Kiểm tay trên cơ sở nháp `cach_ly_thu`: áp hai lần → `đã áp 001_nen_cong_ty.sql`, rồi `xong — 0 migration mới`;
      tệp lỗi giả trong thư mục tạm (biến `MIGRATIONS_DIR`) → thoát khác 0, sổ không có tệp đó; `DB_LANE=khong-co` → thoát 2
      với câu gọi tên `make db-up`.
- [ ] **Step 5:** Commit `feat(db): add the company foundation migration and a psql migration runner`.

### Task 2: Cửa `withCompany` (AC-7 · E7 ca 1–4)

`independent: false` — Task 4 thêm ca vào tệp kiểm của task này.

**Files:**

- Create: `src/modules/identity/with-company.ts`, `src/modules/identity/server.ts`
- Test: `src/modules/identity/with-company.test.ts`

**Interfaces:**

- Produces (từ `with-company.ts`, `server.ts` xuất lại sau `import "server-only"`):
  `export const APP_ROLE = "quy_hang_app"`, `export const SET_ROLE_SQL = "set local role quy_hang_app"`,
  `export const SET_CONTEXT_SQL = "select set_config('app.user_id', $1, true), set_config('app.company_id', $2, true)"`,
  `export interface DbClient { query(text: string, params?: unknown[]): Promise<{ rows: unknown[]; rowCount: number | null }>; release(): void }`,
  `export interface DbPool { connect(): Promise<DbClient> }`,
  `export interface CompanyContext { userId: string; companyId: string | null }`,
  `export async function withCompany<T>(pool: DbPool, ctx: CompanyContext, fn: (client: DbClient) => Promise<T>): Promise<T>`.

- [ ] **Step 1: Viết bài kiểm hỏng** với bể giả ghi `[text, params]`:
  - `runs the work inside one transaction under the app role` → dãy `["begin", SET_ROLE_SQL, SET_CONTEXT_SQL, "select 1", "commit"]`, tham số câu đặt sàn `["u1", "c1"]`, trả kết quả của việc, `release` 1 lần.
  - `rolls back and rethrows when the work fails` → câu cuối `"rollback"`, không có `"commit"`, `rejects.toBe(errGoc)`, `release` 1 lần.
  - `sets an empty company when none is chosen` → tham số `["u1", ""]`.
  - `does not run the work when switching role fails` → việc không gọi, có `"rollback"`, `release` 1 lần, lỗi ném lại.
- [ ] **Step 2:** `npx vitest run src/modules/identity/with-company.test.ts --coverage.enabled=false` → FAIL (chưa có mô-đun).
- [ ] **Step 3:** Viết `with-company.ts` theo `packages/api/src/db.ts` của Quỹ hàng (rollback nuốt lỗi phụ, `finally` release).
- [ ] **Step 4:** Chạy lại → PASS; `make typecheck` và `python3 tools/boundaries.py` xanh.
- [ ] **Step 5:** Commit `feat(identity): add the withCompany query door`.

### Task 3: Bộ quét một cửa (AC-8 · E8)

`independent: true`

**Files:**

- Test: `src/modules/identity/one-door.test.ts`

**Interfaces:**

- Produces (trong tệp kiểm): `scanQueries(dir: string, exempt: ReadonlySet<string>): { file: string; line: number }[]`
  với mẫu `/\b\w*[Pp]ool\.(query|connect)\(|new\s+(?:pg\.)?(?:Pool|Client)\(/`, bỏ dòng mở đầu `//`, quét `.ts`/`.tsx`;
  `EXEMPT = new Set(["modules/identity/with-company.ts", "modules/identity/one-door.test.ts"])`.

- [ ] **Step 1:** Viết bài kiểm: `src has no query outside the door` (quét `src` suy từ `import.meta.url`, kỳ vọng `[]`,
      thông điệp `có truy vấn ngoài cửa withCompany`); `control: clean file passes, broken files are named` (thư mục tạm:
      tệp gọi qua `withCompany` → 0; `appPool.query(` ở dòng 1 và `new Pool(` ở dòng 2 → đúng `{file, line}`; dòng `// pool.query(` không tính);
      `control: a copy of this test outside the exemption is reported` (chép nội dung tệp kiểm sang `x/copy.test.ts` → có vi phạm).
- [ ] **Step 2:** Chạy `npx vitest run src/modules/identity/one-door.test.ts --coverage.enabled=false` → PASS sau khi Task 2 có
      tệp cửa (trước Task 2 tệp cửa chưa có nên ca một vẫn xanh — đối chứng hai chiều nằm ở ca hai, ba).
- [ ] **Step 3:** Phá thử tay: thêm `pool.query(` vào một tệp `src` tạm → ca một đỏ với thông điệp ghim; gỡ.
- [ ] **Step 4:** Commit `test(identity): guard the single query door in source`.

### Task 4: Bộ kiểm cách ly 19 ca (AC-2..AC-6, AC-9 · E2–E6, E9; E7 ca 5)

`independent: false` — cần Task 1, Task 2.

**Files:**

- Create: `db/tests/cach-ly.sql` (14 ca), `db/tests/pha-thu/bo-ep-luat.sql`, `db/tests/pha-thu/luat-them-khong-kiem.sql`,
  `db/tests/pha-thu/luat-doc-mo.sql`, `db/tests/pha-thu/bang-moi-luat-mo.sql`
- Create: `db/scripts/cach-ly.sh`
- Modify: `_acceptance/config.yaml` — thêm đúng một dòng dưới `executors.script`: `cach_ly: "bash db/scripts/cach-ly.sh"`
- Modify: `src/modules/identity/with-company.test.ts` — thêm ca ràng câu

**Interfaces:**

- Consumes: `pg_sql`, `pg_cmd`, `migrate.sh` (Task 1); `SET_ROLE_SQL`, `SET_CONTEXT_SQL` (Task 2).
- `cach-ly.sql` mở bằng `prepare dat_san(text, text) as <SET_CONTEXT_SQL>;`, dựng hàm `pg_temp.dung_hai_san()`; mỗi ca
  `begin; select pg_temp.dung_hai_san(); <SET_ROLE_SQL>; execute dat_san(...); do $$ … raise notice 'ok <ca>' … $$; rollback;`,
  ca hỏng `raise exception 'HỎNG <ca>: <bảng hoặc lý do>'`. Tệp chạy không `ON_ERROR_STOP` để ca sau vẫn chạy.

- [ ] **Step 1: Ca ràng câu hỏng trước** — trong `with-company.test.ts`: `sqlUsesDoorStatements(sql: string): boolean`
      (chứa `SET_ROLE_SQL + ";"` và `"prepare dat_san(text, text) as " + SET_CONTEXT_SQL + ";"`); ca
      `the isolation suite runs the door's own statements` đọc `db/tests/cach-ly.sql` (đường suy từ `import.meta.url`) →
      `true`; đối chứng: chuỗi đổi `app.company_id` thành `app.companyid` → `false`. Chạy → FAIL (chưa có tệp).
- [ ] **Step 2:** Viết 14 ca theo ma trận ở đầu `evals.yaml`, đúng kỳ vọng từng eval (E2: đối chứng vai chủ 2/3, ba trạng
      thái rỗng; E3: so tập dòng; E4: lỗi chứa `violates row-level security policy`; E5: lỗi chứa `permission denied`;
      E6: tập bảng từ `pg_class`/`pg_attribute`, in số bảng, kiểm nội dung luật từ `pg_policies.qual`/`with_check`).
- [ ] **Step 3:** Viết bốn tệp phá thử (a)–(d) như design mục 4; (d) tạo `bang_mau_cach_ly (id uuid primary key default gen_random_uuid(), company_id uuid not null references companies (id))`.
- [ ] **Step 4:** Viết `cach-ly.sh`: hằng `CA_SQL=(14 tên)`, `CA_LENH=(5 tên)`; `chay_bo_kiem <db>` lọc dòng `ok `/`HỎNG ` từ
      đầu ra psql, trả khác 0 khi thiếu/thừa/lặp ca hoặc có `HỎNG`; luồng: `cach_ly_lanh` → migrate hai lần (+ đếm sổ) →
      `ok ap-hai-lan` → bộ kiểm lành; mỗi bản phá trên `cach_ly_pha_<tên>` → bộ kiểm phải khác 0 và chứa dòng ghim → `ok pha-thu-…`;
      cuối cùng đếm 19 dòng ok, in `cach-ly: 19 ca đạt, vai quy_hang_app`; xoá mọi `cach_ly_*` đã tạo (trap).
- [ ] **Step 5:** Thêm dòng `cach_ly` vào `_acceptance/config.yaml`.
- [ ] **Step 6:** `DB_LANE=n bash db/scripts/cach-ly.sh` → 19 dòng ok, dòng tổng, thoát 0; chạy lại lần hai ngay → vẫn xanh
      (không vướng cơ sở nháp cũ). Phá thử bộ đếm: tạm xoá một ca khỏi `cach-ly.sql` → lệnh in tên ca thiếu, thoát khác 0; hoàn lại.
- [ ] **Step 7:** `npx vitest run src/modules/identity --coverage.enabled=false` → PASS.
- [ ] **Step 8:** Commit `test(db): add the company isolation suite with break tests`.

### Task 5: Wiki và kiểm tổng

`independent: false` — cuối cùng.

**Files:**

- Modify: `wiki/entities/company.md` (mục «Where in the code»: cửa, lược đồ, bộ kiểm), `wiki/log.md` (thêm một dòng)

- [ ] **Step 1:** Cập nhật hai trang wiki, chỉ trỏ đường, không dán mã.
- [ ] **Step 2:** `make check` → xanh.
- [ ] **Step 3:** Commit `docs(wiki): record the company isolation foundation`.
