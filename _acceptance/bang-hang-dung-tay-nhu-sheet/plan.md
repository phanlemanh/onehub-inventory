# Bảng hàng dùng tay như Sheet — kế hoạch thi công

> For agentic workers: thực thi tuần tự trong phiên (superpowers:executing-plans). Bước dùng `- [ ]`.

**Goal:** Đưa bản bấm được (đã có trên nhánh: `grid-view.ts`, `column-filter-cell.tsx`, `data-region.tsx`, `shell-focus.tsx`,
lối tắt ở `nav.ts`) tới đủ bằng chứng của 18 eval, cộng tài liệu và sổ khối.

**Architecture:** Luật thuần ở `src/components/candidate/grid-view.ts`; hành vi trong `DataRegion`; App Shell có chế độ tập
trung (`shell-focus.tsx`). Bài kiểm đơn vị trong `tests/` (vitest + RTL), bài trình duyệt ở `tests/e2e/sheet.spec.ts`.

**Tech Stack:** Next.js 16, React 19, TanStack Table v9 qua lưới ReUI, Vitest, Playwright.

**Spec:** `_acceptance/bang-hang-dung-tay-nhu-sheet/design.md`, `contract.md`, `evals.yaml`.

## Global Constraints

- Không sửa `src/components/ui`, `src/components/reui`; nhãn từ `label()`; chữ của lưới ở `grid-copy.ts`.
- Mỗi phép đo mới có cặp hai chiều trên cùng dữ liệu: ca chính xanh, ca phá đỏ với thông điệp ghim đúng chữ trong `evals.yaml`.
- `grid.spec.ts`, `frame.spec.ts`, `app-shell.spec.ts`: chỉ thêm ca ở cuối, không nới ca nào (điều kiện K-14, K-15).
- `design/behaviors.md`, `wiki/log.md`, `design/so-khoi.yaml`: chỉ thêm dòng.
- Dữ liệu mẫu: chỉ dữ liệu hàng 1 (`buildSampleListings`, `sampleUnits`), không dữ liệu thật.

## Review Focus

- Lọc rồi nhóm rồi sắp cùng lúc: số dòng vẫn liền 1..n (Task 2 ca «filter + group + sort»).
- Ô lọc số gõ dở (`>`, `2-`) không làm mất dòng nào (Task 1 ca «partial rule»).
- Ẩn cột đang được sắp xếp: bảng giữ thứ tự, không lỗi (Task 2 ca «hide sorted column»).
- Lối tắt với tham số lặp `?status=Active&status=Pending` (mảng): không vỡ trang, dùng giá trị đầu (Task 3).
- Thoát toàn màn hình bằng Esc khi đang có menu mở: App Shell trở lại (Task 4 ca toàn màn).

---

### Task 1: Luật thuần của lưới (E3, E4, E5, E7 phần thuần)

**Files:** Test: `tests/grid-view.test.ts` · Sửa nếu đỏ: `src/components/candidate/grid-view.ts`

**Interfaces:** `cellText(kind, value, transaction?)`, `parseNumberRule(rule)`, `filterRows(rows, columns, filters, query?, now?)`,
`filterIsInvalid(column, filter)`, `sortRows(rows, columns, sort)`, `groupRows(rows, column)`, `rowNumbers(ordered)`,
`daysSince(value, now)`, `STATUS_ORDER`.

- [ ] Dựng 60 dòng bằng `inventoryRows(buildSampleListings(...))` như `tests/inventory.test.tsx`; cột bằng `inventoryColumns`.
- [ ] Khối `cellText`: ma trận 7 kiểu (hằng 7) + ca phá «cellText money: raw number».
- [ ] Khối `sortRows`: 12 ô (6 kiểu × 2 chiều, hằng 12), kiểm từng cặp kề nhau bằng hàm so riêng trong bài; ca phá
  «status sorted by label», «empty cell not last: desc»; «Toà 2» trước «Toà 10».
- [ ] Khối `filterRows on the 60 sample rows`: 9 ô (hằng 9), tập mong đợi tính từ trường thô; ba ca phá ghim thông điệp
  'text filter not accent-folded', 'money rule not in billions', 'filters do not stack'; ca «partial rule» (`>`, `2-` không lọc).
- [ ] Khối `groupRows + rowNumbers` có và không lọc Active; sắp + nhóm 2 ô; ca phá 'row numbers restart in group',
  'sort lost inside group'.
- [ ] `npx vitest run tests/grid-view.test.ts` xanh; commit.

### Task 2: DataRegion dùng tay (E4 phần màn, E6, E7, E8, E12)

**Files:** Test: `tests/grid-sheet.test.tsx` · Sửa nếu đỏ: `src/components/candidate/data-region.tsx`, `column-filter-cell.tsx`

**Interfaces:** `DataRegion({..., initialFilters?: ColumnFilters, groupBy?: FieldKey, record?})`; slot `filter-toggle`,
`group-toggle`, `columns-toggle`, `full-screen-toggle`, `group-label`, `group-count`, `region-footer-count`, `row-number`.

- [ ] Menu tiêu đề Giá chào → Tăng dần: cột tăng, số dòng 1..60 (E4).
- [ ] Lọc: 8 ô lọc, `<=5`, `5 tỷ` mang `aria-invalid`, rỗng → «Không có dòng nào khớp» → «Xoá lọc» về «60 dòng»; ca phá
  'invalid rule not marked' (E6).
- [ ] Nhóm: số dòng nhóm, «k dòng», số dòng liền, gập nhóm đầu; ca «filter + group + sort» (E7).
- [ ] Cột: bảy mục, ẩn/hiện Dự án đúng chỗ, ẩn Toà khi nhóm → nhãn ở Căn, «Bỏ ghim» Toà; ca «hide sorted column»; ca phá
  'first column can be hidden' (E8).
- [ ] Khuôn: cột của trang mẫu, không prop thói quen nào → có Lọc, Cột, role grid; Enter có/không `record`; ca phá
  'enter opened another row' (E12).
- [ ] Vitest xanh; commit.

### Task 3: Lối tắt trạng thái (E10)

**Files:** Test: `tests/app-shell-status-shortcuts.test.tsx`, thêm khối vào `tests/inventory-page.test.tsx`

- [ ] Sáu href theo `STATUS_ORDER`; thứ tự bằng khoá `Status*` đọc thẳng `ontology/labels.yaml`; bằng thứ tự lựa chọn của ô
  lọc Trạng thái; `aria-current` ở «Đang giao dịch» khi địa chỉ `/inventory?status=Pending`; ca phá 'status order differs:
  sidebar'.
- [ ] Trang với `status` = mỗi trạng thái + một lạ (hằng 7) → bộ lọc đưa vào `InventoryGrid`; mảng tham số dùng giá trị đầu;
  ca phá 'page drops status: Active'.
- [ ] Vitest xanh; commit.

### Task 4: Bài trình duyệt (E1, E2, E9, E11, E14, E18)

**Files:** Create: `tests/e2e/sheet.spec.ts` (chạy trong `make e2e`, bốn khổ theo cấu hình Playwright của kho)

- [ ] 'sheet keys' (9 phím, hằng 9, ô trong khung, ca phá 'focused cell out of view: End').
- [ ] 'sheet copy' (Control+C và Meta+C; ba vùng; so bằng cả chuỗi; ca phá 'copied text differs from the selected cells').
- [ ] 'sheet frozen columns' ở 360 (ca phá 'frozen column moved: Căn').
- [ ] 'status shortcuts' ở 1440 và 360, + `<=5` (ca phá 'shortcut opens wrong status: <X>').
- [ ] 'sheet axe' 24 ô và 'sheet tab stops' 8 ô (hai ca phá).
- [ ] 'sheet full screen' 1440 và 1024, menu Cột trên cùng, thoát trở lại; không nút ở 414, 360 (hai ca phá).
- [ ] `npx playwright test tests/e2e/sheet.spec.ts` xanh; commit.

### Task 5: Tài liệu, sổ khối, bằng chứng màn

**Files:** `design/behaviors.md` (thêm dòng: Phím trong lưới, Chép vùng, Lọc từng cột, Nhóm dòng, Ẩn hiện cột, Toàn màn hình,
Lối tắt trạng thái), `design/patterns/luoi.md` (Mặt so «Thanh công cụ, lọc, tìm, sắp xếp» và «Phím tắt» trỏ hành vi mới),
`design/so-khoi.yaml` (hai dòng: dòng nhóm `data-grid-grouping-2`, chế độ tập trung App Shell `tao-tay`; `ho_so` hàng này,
`duyet` 2026-11-12), `_acceptance/bang-hang-dung-tay-nhu-sheet/chung-minh-man.md` theo `tools/proof_gate/khuon-chung-minh.md`,
`wiki/log.md` một dòng.

- [ ] `python3 tools/proof_gate/check.py --root .` xanh; `make check` xanh; commit.
