# Sửa sau chữ ký — bang-quyen-theo-vai

- 2026-11-17 — hàng 11 «Nhập Excel» (`_acceptance/nhap-excel/`, dãy D; chủ kho duyệt Cổng Phạm vi và kế hoạch cùng ngày,
  Hỏi-1, Hỏi-7): `createListing` chuyển `live` (Đầu chủ của tôi, Trưởng nhóm toàn sàn) và thêm bốn dòng sống
  `importListings`, `viewImports`, `continueImport`, `undoImport`. Theo đó `src/modules/identity/permissions.test.ts` thêm
  năm dòng vào ma trận viết tay và năm cửa `/api/v1/imports…` vào danh sách cửa; `permission-table.test.ts` đếm 29 dòng
  sống thay 24, ca phá «dòng nháp có cửa» dùng `removeListing` (vẫn nháp) thay `createListing`. Luật đo không đổi. Hồ sơ
  này ghim lại cùng lượt ghim của hàng 11.
