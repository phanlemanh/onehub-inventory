# Đang ở đâu — nhap-excel (dãy D)

Cập nhật sau mỗi bước có nghĩa (G-1711-39: hạn mức tuần ≥ 95%, tới 98% đợt bàn giao).

- Trạng thái: Cổng Phạm vi DUYỆT (606ddb1), kế hoạch T3 DUYỆT (chủ kho 17/11). Vùng thi công G duyệt D-11.
- Xong: việc 0 (thư viện, stepper ReUI, lệnh chấm), 1 (ontology: ImportRun, ListingPendingUnit, bốn thao tác import,
  createListing live), 2 (migration 015, bộ cách ly xanh 38 ca trên dãy D) — đầu nhánh c6335f2.
- make check hiện đỏ đúng ba bài cửa `/api/v1/imports` của `src/modules/identity/permissions.test.ts` (cửa khai trước,
  route ở việc 7) — dự kiến, không phải lỗi.
- Việc kế: việc 3 (đọc tệp + bộ tệp thử có đáp án), 4 (luật dấu thuần), 5 (`src/modules/listings/create.ts`), 6
  (`company-config/import-learn.ts`, `catalog/company-alias.ts`), 7 (cửa `/api/v1/imports` + `tests/db/nhap-excel.db.test.ts`,
  chạy cả tệp phá `db/tests/pha-thu/nhap-excel-xoa-mo.sql`), 8 (màn), 9 (Bảng hàng — sau khi 3g gộp), 10, rồi S4.
- Năm hồ sơ đã ký có mục sua-sau-ky (ghim lại cùng lượt ghim của hàng 11): kiem-vai-theo-man, kiem-vong-doi-thao-tac,
  khai-lien-ket-chao-can, bang-quyen-theo-vai, bo-kiem-chung-khi-dang-nhap, bang-hang-du-lieu-that (sáu).
- Lệnh: Postgres dãy D `make db-up DB_LANE=d DB_PORT=5571`; cách ly `DB_LANE=d DB_PORT=5571 bash db/scripts/cach-ly.sh`.
- Luật đợt: listings chỉ tệp mới + THÊM dòng export; inventory-grid/rows/page.tsx sau khi 3g gộp; tệp dùng chung chỉ thêm
  dòng; thứ tự gộp VP7 → 3g → 11; migration số tạm 015.
