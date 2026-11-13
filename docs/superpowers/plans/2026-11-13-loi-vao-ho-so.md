# Kế hoạch thi công — Lối vào hồ sơ (hàng 3f)

Hồ sơ: `_acceptance/loi-vao-ho-so/` (Cổng Phạm vi duyệt 2026-11-13, Manh Phan). Hạng T2. Hợp đồng tám tiêu chí, bộ đo E1–E9.

Mục tiêu: nút «Chép đường dẫn» ở đầu hồ sơ căn; ô tìm ⌘K ở thanh trên App Shell (bảng lệnh có gợi ý — mã căn, toà, dự án)
dẫn về Bảng hàng với lọc đầu cột điền sẵn; báo khi đường dẫn trỏ lần chào đã rút.

Điều kiện ngoài hàng:

- Hàng 2c (cách xem ban đầu, sửa Ngoài-4 «lọc ra rỗng thì hàng lọc biến mất») chưa vào nhánh chính. Lọc ban đầu theo cột đã
  có sẵn ở lưới (`InventoryGrid.filters`, lối tắt trạng thái dùng nó) nên T3, T4 không chờ 2c. Riêng E7 (mã lạ thấy ở đầu cột)
  chỉ xanh khi bản sửa Ngoài-4 của 2c ở nhánh chính: chấm S4 sau khi gộp 2c; trước đó E7 đỏ là đúng.
- Gói cmdk (thành phần Command của shadcn) là phụ thuộc mới — chủ kho đã nhận giá ở Hỏi-1; `package.json`,
  `package-lock.json`, `src/components/ui/command.tsx` ngoài vùng — xin G `cham-tep` trước T5.

## Tóm tắt

| Người dùng thấy gì khác                                             | Đụng đâu                                                                                                      | Phục vụ tiêu chí                                             |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Đầu hồ sơ có nút «Chép đường dẫn», chép đúng đường dẫn của lần chào | `src/modules/listings/ui/`                                                                                    | AC-1 (nút ở đầu hồ sơ), AC-2 (chép đúng), AC-3 (mở đúng căn) |
| Mở đường dẫn tới lần chào đã rút thì có báo ngắn                    | `src/modules/listings/ui/inventory-grid.tsx`                                                                  | AC-4 (đường dẫn cũ)                                          |
| Bảng hàng mở với mã điền sẵn ở đầu cột Căn, một dòng thì hồ sơ bật  | `src/modules/listings/ui/inventory-rows.ts`, `src/app/(app)/inventory/page.tsx`                               | AC-5, AC-6 (một và nhiều toà), AC-7 (mã lạ)                  |
| Ô tìm ⌘K ở thanh trên, có gợi ý ghi loại                            | `src/modules/listings/ui/unit-jump.tsx`, `src/components/templates/app-shell.tsx`, `src/app/(app)/layout.tsx` | AC-5 (ô ⌘K)                                                  |
| Đọc được ở bốn khổ, sáng tối, không lỗi trợ năng nặng               | `tests/e2e/loi-vao-ho-so.spec.ts`                                                                             | AC-8 (bốn khổ)                                               |

## Việc

### T1 — Nút «Chép đường dẫn» (independent: false)

- Files: `src/modules/listings/ui/copy-link.tsx` (mới, client), `src/modules/listings/ui/listing-record.tsx` (trả `actions`),
  `src/modules/listings/ui/entry-copy.ts` (mới: chữ khung của hàng, danh từ qua `label()`).
- Đầu hồ sơ dùng khe `RecordView.actions` của 9e. Trên điện thoại chữ của nút `max-sm:sr-only`, tên đọc được qua
  `aria-label`; tên căn xuống dòng riêng dưới `sm` (lớp trên phần tử bọc, không sửa thành phần nhà cung cấp — nếu cần chạm
  đầu ngăn dùng chung `record-panel.tsx` thì xin G).
- Chép `new URL('/inventory?ho-so=' + id, origin)`; báo bằng `notifyResult`.
- Verify: `npx vitest run tests/loi-vao-ho-so.test.tsx` · phục vụ E1, E2, E3.

### T2 — Báo đường dẫn cũ (independent: true)

- Files: `src/modules/listings/ui/inventory-grid.tsx`.
- Lúc mở, địa chỉ có `ho-so` mà không có dòng nào mang id ấy → `notifyResult` một lần với
  «<Căn> trong đường dẫn không còn trong <Bảng hàng>.»; id có thật hay không có `ho-so` → không báo.
- Verify: bài đơn vị trên `InventoryGrid` dựng với địa chỉ giả · phục vụ E4.

### T3 — Phép tìm theo mã và cách mở Bảng hàng (independent: true)

- Files: `src/modules/listings/ui/inventory-rows.ts` (hàm thuần `findByCode`, `inventoryOpeningFor`), `index.tsx` (xuất).
- `findByCode(rows, text)` → `mot | nhieu | khong`, so trọn mã, bỏ khoảng trắng, không phân biệt hoa thường.
  `inventoryOpeningFor(rows, { ma, toa, du_an })` → `{ filters, recordId }`: một dòng → lọc cột Căn + id; nhiều → lọc, không id;
  không → lọc bằng chữ đã gõ, không id. Toà, dự án → lọc cột tương ứng, không id.
- Verify: `npx vitest run tests/loi-vao-ho-so.test.tsx` (ma trận dòng dựng tay viết trước, ca đối chứng) · phục vụ E6.

### T4 — Bảng hàng nhận `?ma=`, `?toa=`, `?du-an=` (independent: false, sau T3)

- Files: `src/app/(app)/inventory/page.tsx`.
- Đọc tham số, dựng `filters` qua `inventoryOpeningFor`; một dòng mà địa chỉ chưa có `ho-so` → `redirect` sang cùng địa chỉ
  kèm `ho-so=<id>` để hồ sơ bật bằng đúng lối của hàng 3. Gộp với lọc trạng thái sẵn có.
- Verify: bài trình duyệt E5, E6 trên bản dựng · phục vụ E5, E6, E7.

### T5 — Ô tìm ⌘K ở thanh trên (independent: false, sau T3 và sau khi G duyệt chạm tệp)

- Files: `src/components/ui/command.tsx` (cài bằng lệnh shadcn), `package.json`, `package-lock.json`,
  `src/modules/listings/ui/unit-jump.tsx` (mới, client), `src/components/templates/app-shell.tsx` (khe `search`),
  `src/app/(app)/layout.tsx` (đặt ô vào khe khi vai mở Bảng hàng).
- Gợi ý từ các dòng Bảng hàng đã đọc (cùng nguồn với trang Bảng hàng, không đường đọc mới); nhãn loại bằng `label()`;
  ⌘K / Ctrl+K mở; «/» mở khi tiêu điểm không ở ô nhập; chọn hay Enter → `router.push('/inventory?ma=…')` (hay `toa`, `du-an`).
- Verify: bài đơn vị khe theo vai; bài trình duyệt E5 · phục vụ E5, E8.

### T6 — Bài kiểm và axe (independent: false, cuối)

- Files: `tests/loi-vao-ho-so.test.tsx`, `tests/e2e/loi-vao-ho-so.spec.ts` (mới); thêm màn vào bài axe sáng tối.
- Mỗi phép đo mới có cặp hai chiều trên cùng chỗ dựng, thông điệp ghim như `evals.yaml`.
- Verify: `make check`, `make e2e` · phục vụ E1–E9.

## Thứ tự

T3 → T4 → T1 → T2 → (G duyệt chạm tệp) T5 → T6 → S4. Gỡ bản mẫu `/proto/loi-vao-ho-so` khi trang thật đủ (giữ ảnh ở hồ sơ).
