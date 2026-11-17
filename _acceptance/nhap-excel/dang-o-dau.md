# Đang ở đâu — nhap-excel (dãy D)

Cập nhật sau mỗi bước có nghĩa (G-1711-39: hạn mức tuần ≥ 95%, tới 98% đợt bàn giao).

- Trạng thái: Cổng Phạm vi DUYỆT (606ddb1), kế hoạch T3 DUYỆT (chủ kho 17/11). Vùng thi công G duyệt D-11.
- Xong: việc 0–6 và phần máy chủ của việc 7: ontology, migration 015, đọc tệp, luật dấu (`src/modules/imports/{targets,mark,table}.ts`), cửa tạo `src/modules/listings/create.ts`, phần học `company-config/import-learn.ts`, mã riêng `catalog/company-alias.ts`, lưu và cửa `src/modules/imports/{store,imports-http,server}.ts` + năm route `/api/v1/imports…`. make check XANH ở 1e0f95d.
- G-1711-40/41: THÊM ca có tên chèn/xoá chéo sàn vào bộ cách ly (`db/tests/cach-ly.sql` + tên ca vào CA_SQL của `db/scripts/cach-ly.sh`, G duyệt D-12), kèm đối chứng dương; trang Cổng Bằng chứng nêu ca 23 trước → sau.
- Xong thêm: ca cách ly có tên nhap-excel-theo-san (ca 24, có phần hàm app.import_list_agents) — 39 ca xanh; `tests/db/nhap-excel.db.test.ts` 9/9 xanh trên dãy D; migration 016 hàm đặc quyền thứ 11 (chủ kho «Cho thấy (lối A)», dòng sổ d-20261117T064233Z-63); phần học dùng savepoint (`savepointRun`). make check XANH.
- Việc kế ngay: (c) việc 8 màn `/nhap-tep` (khung solution-crm-6, `@/components/reui/stepper` đã cài; gỡ dòng «bo qua: nhap-tep — planned» của e2e-templates.test và đổi screens.yaml sang built); (d) việc 9 Bảng hàng sau khi 3g gộp; (e) việc 10, S4.
- Ghi chú việc 5–7 cũ: 5 (`src/modules/listings/create.ts`), 6
  (`company-config/import-learn.ts`, `catalog/company-alias.ts`), 7 (cửa `/api/v1/imports` + `tests/db/nhap-excel.db.test.ts`,
  chạy cả tệp phá `db/tests/pha-thu/nhap-excel-xoa-mo.sql`), 8 (màn), 9 (Bảng hàng — sau khi 3g gộp), 10, rồi S4.
- Năm hồ sơ đã ký có mục sua-sau-ky (ghim lại cùng lượt ghim của hàng 11): kiem-vai-theo-man, kiem-vong-doi-thao-tac,
  khai-lien-ket-chao-can, bang-quyen-theo-vai, bo-kiem-chung-khi-dang-nhap, bang-hang-du-lieu-that (sáu).
- Lệnh: Postgres dãy D `make db-up DB_LANE=d DB_PORT=5571`; cách ly `DB_LANE=d DB_PORT=5571 bash db/scripts/cach-ly.sh`.
- Luật đợt: listings chỉ tệp mới + THÊM dòng export; inventory-grid/rows/page.tsx sau khi 3g gộp; tệp dùng chung chỉ thêm
  dòng; thứ tự gộp VP7 → 3g → 11; migration số tạm 015.
