# Nhận design-assembly — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Viết bảy kịch bản đo mới của hồ sơ `nhan-design-assembly` và bộ bài hai chiều của chúng; mã sản phẩm trên nhánh đã
xong và không đổi.

**Architecture:** Mỗi kịch bản là một tệp Node (một tệp bash) trong `_acceptance/nhan-design-assembly/rang/`, đọc kho ở
`--root`, nhận thêm cờ trỏ tệp để bộ bài đưa bản phá vào. Hai kịch bản dựng bản tạm dùng chung một hàm dựng thư mục đường
nối. `rang.test.mjs` (node:test) giữ cặp hai chiều: bản lành xanh, bản phá đỏ với thông điệp ghim.

**Tech Stack:** Node 24 (`node:test`, `node:fs`, `node:child_process`), bash, `make`.

**Spec:** `docs/superpowers/specs/2026-11-14-nhan-design-assembly-design.md`, hợp đồng
`_acceptance/nhan-design-assembly/contract.md`, phép kiểm `_acceptance/nhan-design-assembly/evals.yaml` (ma trận đầu tệp là
nguồn của mọi thông điệp ghim dưới đây).

## Global Constraints

- Không sửa tệp nào ngoài `_acceptance/nhan-design-assembly/rang/` và kế hoạch này; mã sản phẩm, `tools/`, `mk/` giữ nguyên.
- Lệnh chạy từng kịch bản là đúng chuỗi đã khai ở `_acceptance/config.yaml` (`lint_chay_lai`, `lint_tat_luat`,
  `so_quyet_dinh_giu`, `so_linh_kien_khop`, `sinh_lai_so`, `loi_dap`, `so_token`, `rang`).
- Kịch bản không ghi vào kho: bản tạm nằm trong `os.tmpdir()`, xoá đường nối trước rồi mới xoá thư mục tạm.
- Thông điệp in và tên bài bằng tiếng Anh như ma trận ghi; đọc gốc kho từ `--root`, không ghim cứng đường dẫn.
- Commit theo Conventional Commits, tiếng Anh.

## Review Focus

- Bản tạm còn sót đường nối khi kịch bản lỗi giữa chừng → kho thật không bị xoá: xoá luôn trong `finally`, đường nối gỡ
  riêng trước (bài «cleanup removes links before the folder» ở Task 1).
- `--rate` của lệnh kiểm có dòng chú thích hay dòng `note:` → bộ đọc chỉ nhận dòng mở đầu `held`/`claimed` (bài ở Task 2).
- Sổ quyết định có dòng chú thích giữa các dòng → so theo khối từ `  - id:` tới khối kế, gồm chú thích bên trong (Task 3).
- `make gen` đổi tệp khác ngoài sổ linh kiện → kịch bản chỉ so sổ linh kiện, nhưng in danh sách tệp khác bị đổi (Task 4).
- Stylesheet khai `--onehub-blue` ở nhiều tệp → đọc mọi tệp `.css` dưới `src/`, lấy giá trị khai ở `:root` (Task 5).

---

### Task 1: Hàm dựng bản tạm, và hai phép đo trên bản tạm (AC-3, AC-6)

`independent: false` (Task 2–5 không dùng nó, nhưng `rang.test.mjs` của Task 6 dùng)

**Files:**

- Create: `_acceptance/nhan-design-assembly/rang/ban-tam.mjs`
- Create: `_acceptance/nhan-design-assembly/rang/lint-tat-luat.mjs`
- Create: `_acceptance/nhan-design-assembly/rang/linh-kien-moi.mjs`

**Interfaces:**

- Produces: `banTam(root: string, thay: Record<string, string>): { dir: string, xoa(): void }` — thư mục tạm, mỗi mục ở gốc
  `root` là một đường nối, trừ các đường trong `thay` (khoá là đường tương đối, giá trị là nội dung tệp ghi thật). Thư mục
  cha của một đường bị thay được dựng thật, các mục anh em vẫn là đường nối. `xoa()` gỡ mọi đường nối rồi mới xoá thư mục.
- Produces: `chayKiem(dir: string): { code: number, out: string }` — chạy `node tools/design-assembly/check.mjs --target dir`
  bằng tệp lệnh kiểm của chính bản tạm.

- [ ] **Step 1:** `lint-tat-luat.mjs --root R`: lượt một bản tạm không thay gì → phải thoát 0; lượt hai thay
      `eslint.config.js` bằng bản của kho cộng một mục cuối `{ rules: { "onehub-ui/no-raw-table": "off" } }` (chèn trước `]);`
      cuối) → phải thoát khác 0 và đầu ra chứa ``raw-table: the repository's lint lets through `<table />` ``. Đủ cả hai thì in
      `lint off: green with the repository's lint, red with no-raw-table off`, thoát 0; lệch thì in lượt nào lệch, thoát 1.
- [ ] **Step 2:** `linh-kien-moi.mjs --root R`: lượt một không thay gì → thoát 0; lượt hai thêm
      `src/components/candidate/changed-probe.tsx` với `export function ChangedProbe() {\n  return <div />;\n}\n` → thoát khác 0 và
      đầu ra chứa `ChangedProbe is not in the file`. Đủ thì in `new component: green as committed, red with ChangedProbe added`.
- [ ] **Step 3:** Chạy `node _acceptance/nhan-design-assembly/rang/lint-tat-luat.mjs --root .` và
      `node _acceptance/nhan-design-assembly/rang/linh-kien-moi.mjs --root .`. Expected: hai dòng kết ở trên, mã 0, và
      `git status --short` không đổi.
- [ ] **Step 4:** Commit `test(nhan-design-assembly): measure the tool red on a linked copy with a rule off or a new component`.

### Task 2: Chín quyết định lint và 18 quyết định được giữ (AC-2)

`independent: true`

**Files:**

- Create: `_acceptance/nhan-design-assembly/rang/lint-chay-lai.mjs`

**Interfaces:**

- Produces: CLI `--root R [--rate-file F] [--theme F] [--ledger F]`; vắng `--rate-file` thì chạy
  `node tools/design-assembly/check.mjs --rate --target R`. Ma trận 18 id và chín cặp id=luật chép từ đầu `evals.yaml`.

- [ ] **Step 1:** Đọc dòng `--rate` mở đầu `held`; tập id được giữ phải bằng đúng 18 id. In `held: 18 — <id …>`; thiếu →
      `held: <n>, missing <id>`; thừa → `held: <n>, extra <id>`.
- [ ] **Step 2:** Với chín id lint: dòng `--rate` phải mang `(eslint:<luật>, re-run here)`; `theme.json` có đúng chín phép
      `kind: "lint"`, `rule` bằng luật sau `eslint:` của dòng sổ. In `lint re-run: 9 — <id>=<luật> …`; thiếu →
      `lint re-run: <n>, missing <id>`; lệch luật → `lint re-run: <id> checks <luật dữ liệu>, the row names <luật sổ>`.
- [ ] **Step 3:** Chạy lệnh `lint_chay_lai` của cấu hình. Expected: hai dòng xanh, mã 0.
- [ ] **Step 4:** Commit `test(nhan-design-assembly): read which decisions the tool holds, and the nine lint rules`.

### Task 3: Sổ quyết định cũ còn nguyên (AC-4)

`independent: true`

**Files:**

- Create: `_acceptance/nhan-design-assembly/rang/so-quyet-dinh-giu.mjs`

**Interfaces:**

- Produces: CLI `--root R [--old F] [--new F]`; vắng thì `git -C R show 1226ec5:design/decisions.yaml` và
  `R/design/decisions.yaml`.

- [ ] **Step 1:** Tách cả hai bản thành khối, mỗi khối từ dòng `  - id: <id>` tới trước khối kế (bỏ phần đầu trước khối
      đầu). Mỗi khối cũ phải có y nguyên ở bản mới, trừ `component-level`, mà khác đúng dòng `check:` từ
      `"tool:tools/design_registry.mjs"` sang `"tool:tools/design-assembly/components.mjs"`.
- [ ] **Step 2:** In `rows kept: <k> of <n>; changed: component-level` rồi
      `component-level: tool:tools/design_registry.mjs -> tool:tools/design-assembly/components.mjs`; lệch →
      `row changed: <id>` hoặc `row missing: <id>`, mã 1.
- [ ] **Step 3:** Chạy lệnh `so_quyet_dinh_giu`. Expected: k = n − 1, mã 0.
- [ ] **Step 4:** Commit `test(nhan-design-assembly): every ledger row of 1226ec5 kept, but the component-level pointer`.

### Task 4: Sinh lại sổ bằng công cụ mới (AC-7)

`independent: true`

**Files:**

- Create: `_acceptance/nhan-design-assembly/rang/sinh-lai-so.sh`

**Interfaces:**

- Produces: `bash sinh-lai-so.sh <root>`; kiểm theo thứ tự, dừng ở lỗi đầu: `tools/design_registry.mjs` còn →
  `old tool still there`; `mk/design.mk` thiếu dòng `node tools/design-assembly/components.mjs --write` →
  `make gen does not write the register with the design-assembly tool`; thiếu dòng `node tools/design-assembly/components.mjs`
  ở target `design` → `make check does not check the register with the design-assembly tool`; rồi `make -C <root> gen` và
  `git -C <root> diff --exit-code -- design/component-registry.json` → lệch thì `register differs after make gen`.

- [ ] **Step 1:** Viết kịch bản; sau `make gen` in thêm `git status --short` của các tệp khác bị đổi, nếu có.
- [ ] **Step 2:** Chạy lệnh `sinh_lai_so`. Expected: `registry regenerated by the design-assembly tool, identical to commit`,
      mã 0, cây không đổi.
- [ ] **Step 3:** Commit `test(nhan-design-assembly): make gen writes the register with the design-assembly tool`.

### Task 5: Ba lời đáp và sổ màu (AC-10, AC-11)

`independent: true`

**Files:**

- Create: `_acceptance/nhan-design-assembly/rang/loi-dap.mjs`
- Create: `_acceptance/nhan-design-assembly/rang/so-token.mjs`

**Interfaces:**

- Produces: `loi-dap.mjs --root R [--theme F]`: `inputs.conformanceLevel` = `AA`, `inputs.productType` = `application`; sổ có
  ba dòng `conformance-level`, `source-color`, `product-type` với `kind: judgment`; `checks["color-contrast"]` là bốn phép
  `kind: "contrast"`, `min: 4.5`; giá trị `--onehub-blue` ở `:root` của stylesheet dưới `src/` là `#0246ff`. In
  `answers: AA application; rows conformance-level source-color product-type judgment; contrast 4 pairs at 4.5; --onehub-blue #0246ff`;
  lệch → `answers: <khoá> <giá trị thấy>` (ví dụ `answers: conformanceLevel AAA`), mã 1.
- Produces: `so-token.mjs --root R [--tokens F]`: tìm khoá `primary` trong cây `design/tokens.json`, `$value` phải là
  `#0246ff`; in `primary #0246ff`; lệch → `primary <giá trị>`, mã 1.

- [ ] **Step 1:** Viết hai kịch bản.
- [ ] **Step 2:** Chạy lệnh `loi_dap` và `so_token`. Expected: dòng xanh như trên, mã 0.
- [ ] **Step 3:** Commit `test(nhan-design-assembly): the owner's three answers and the primary colour as recorded`.

### Task 6: Bộ bài hai chiều (E10)

`independent: false` (cần Task 1–5)

**Files:**

- Create: `_acceptance/nhan-design-assembly/rang/rang.test.mjs`

**Interfaces:**

- Consumes: CLI của Task 2–5 với cờ trỏ tệp; mỗi bản phá là tệp trong `os.tmpdir()` dựng từ tệp thật của kho.

- [ ] **Step 1:** Mỗi kịch bản một cặp trên cùng bản: bản lành mã 0; bản phá mã 1 với thông điệp ghim:
  - `lint-chay-lai`: tệp `--rate` thật bỏ dòng `raw-table` → `held: 17, missing raw-table`; `theme.json` thật đổi luật của
    `raw-table` thành `other/rule` → `lint re-run: raw-table checks other/rule, the row names onehub-ui/no-raw-table`;
  - `so-quyet-dinh-giu`: sổ thật đổi `source:` của `radius` → `row changed: radius`; bỏ khối `wcag-aa` →
    `row missing: wcag-aa`;
  - `sinh-lai-so`: bản tạm (Task 1) thêm `tools/design_registry.mjs` → `old tool still there`; thay `mk/design.mk` bằng bản có
    `node tools/design_registry.mjs` ở `gen-design` → `make gen does not write the register with the design-assembly tool`;
  - `loi-dap`: `theme.json` thật đổi `conformanceLevel` thành `AAA` → `answers: conformanceLevel AAA`;
  - `so-token`: `tokens.json` thật đổi màu `primary` thành `#000000` → `primary #000000`.
- [ ] **Step 2:** Chạy lệnh `rang`. Expected: mọi bài đạt; rồi tạm sửa một thông điệp ghim trong một kịch bản cho thấy đúng
      bài đó đỏ, hoàn lại.
- [ ] **Step 3:** Commit `test(nhan-design-assembly): each new measure green on a sound copy, red with its pinned message`.

### Task 7: Đóng S3

`independent: false`

- [ ] **Step 1:** Chạy bước sàn thiết kế cuối S3 (`design-floor-s3.mjs --root . --slug nhan-design-assembly`).
- [ ] **Step 2:** `make check` xanh; đặt hợp đồng `status: implemented`; commit.
