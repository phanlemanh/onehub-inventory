# Refresh the design-assembly tool — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sổ linh kiện của kho thôi ghi một linh kiện hai lần, nhờ chép lại bộ công cụ design-assembly từ plugin.

**Architecture:** Thư mục `tools/design-assembly/` được chép nguyên từ plugin ở commit `feea58d`; sổ linh kiện sinh lại bằng
công cụ mới. Phép đo của hồ sơ nằm ngoài vùng công cụ, ở `_acceptance/refresh-design-assembly-tool/rang/`, và chạy qua lệnh
khai trong `_acceptance/config.yaml`.

**Tech Stack:** Node (ESM), git, `node --test`, Make.

**Spec:** `docs/superpowers/specs/2026-11-15-refresh-design-assembly-tool-design.md`; hợp đồng
`_acceptance/refresh-design-assembly-tool/contract.md`.

## Global Constraints

- Hợp đồng đã duyệt ngày 2026-11-15; kế hoạch này mô tả việc đã làm trên nhánh để lượt chấm chấm đúng nó.
- Không đổi `design/theme.json`, `design/decisions.yaml`, `design/screens.yaml`, `design/tokens.json`.
- Không thêm tệp nào vào `tools/`: thư mục công cụ phải giữ mã cây `357987f790b1a0b52630f683780290933800fc3f`.
- Mã chỉ đổi khi lượt chấm tìm ra lỗi nằm trong hợp đồng.
- Tên tệp, định danh, chú thích, thông điệp commit: tiếng Anh. Nội dung tài liệu: tiếng Việt.

## Review Focus

- Phép đo «khớp plugin» so với mã do git của plugin sinh ra, không so với chính bản chép: E3, chiều đỏ E8.
- Phép so «không mất tên» phải thấy công cụ cũ ghi trùng thật, nếu không nó rỗng nghĩa: ca «the old tool did not list
  twice» trong E7.
- Mỗi thông điệp lỗi của phép đo đều được thấy đỏ: chín ca cho chín thông điệp trong `measures-two-way.mjs`.
- Lệnh kiểm với công cụ mới vẫn đỏ khi sổ lệch mã: E10 và ca sổ thiếu mục trong E7.
- Phép đo `only-register-changed` đọc phần nhánh tự đổi, không đỏ oan khi `main` đổi sổ khác: nó so từ chỗ nhánh rời `main`.

---

### Task 1: Chép bộ công cụ và sinh lại sổ linh kiện (đã làm, commit `c0fed73`)

`independent: false`

**Files:**

- Modify: `tools/design-assembly/check.mjs`, `components.mjs`, `contract.mjs`, `screen-ledger.mjs`
- Create: `tools/design-assembly/screen-actions.mjs`
- Modify: `design/component-registry.json`, `wiki/log.md`

**Phục vụ:** E1, E3, E5, E6, E10.

- [x] **Step 1:** Chép năm tệp từ `plugins/design-assembly/templates/tools/design-assembly/` của plugin ở `feea58d`.
- [x] **Step 2:** `node tools/design-assembly/components.mjs --write`. Expected: `wrote design/component-registry.json from
src/components (289 components)`.
- [x] **Step 3:** `make check`. Expected: thoát 0, `design-assembly: 17 decisions held by 20 checks`.
- [x] **Step 4:** Commit `chore(design): refresh the design-assembly tool from the plugin`.

### Task 2: Ba phép đo của hồ sơ và bộ bài hai chiều (đã làm, commit `6d94ede`)

`independent: false` — đọc kết quả của Task 1.

**Files:**

- Create: `_acceptance/refresh-design-assembly-tool/rang/matrix.mjs`, `linked-copy.mjs`, `register-names-once.mjs`,
  `tool-tree.mjs`, `only-register-changed.mjs`, `measures-two-way.mjs`
- Modify: `_acceptance/config.yaml` (bốn lệnh: `register_names_once`, `tool_matches_plugin`, `only_register_changed`,
  `refresh_measures_two_way`)

**Interfaces:**

- `register-names-once.mjs --root R [--registry F] [--old-tool F]` — phục vụ E2.
- `tool-tree.mjs --root R` — phục vụ E3.
- `only-register-changed.mjs --root R [--changed F] [--theme F]` — phục vụ E4.
- `measures-two-way.mjs` (`node --test`) — phục vụ E7, E8, E9.

- [x] **Step 1:** Viết ma trận trước: commit gốc `0861fdc`, chín tên và tệp định nghĩa, mã cây của plugin.
- [x] **Step 2:** Viết ba phép đo; mỗi phép in một dòng kết khi đạt và một dòng gọi tên chỗ lệch khi không đạt.
- [x] **Step 3:** Viết bốn bài hai chiều với chín ca phá, mỗi ca ghim một thông điệp.
- [x] **Step 4:** `node --test _acceptance/refresh-design-assembly-tool/rang/measures-two-way.mjs`. Expected: 4 đạt, 0 hỏng.

### Task 3: Đóng bước viết mã

`independent: false`

- [ ] **Step 1:** Chạy bước sàn thiết kế cuối S3 của vòng. Expected: không tệp nào đổi.
- [ ] **Step 2:** Đặt hợp đồng `status: implemented`, commit, rồi chạy lượt chấm.
