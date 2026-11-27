# Sửa sau chữ ký — bo-nut-theo-quyen

- 2026-11-17 — hàng 11 «Nhập Excel» (`_acceptance/nhap-excel/`, dãy D): bảng quyền thêm bốn dòng `importListings`,
  `viewImports`, `continueImport`, `undoImport` (chủ kho duyệt Cổng Phạm vi hàng 11), nên `CELLS_WRITTEN_BEFORE` của
  `src/modules/identity/permitted-action.test.tsx` là 4 × 37 × 2 = 296 thay 264. Luật đo không đổi. Hồ sơ này ghim lại
  cùng lượt ghim của hàng 11.
