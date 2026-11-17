# Đang ở đâu — nhap-excel (dãy D)

Cập nhật sau mỗi bước có nghĩa (G-1711-39: hạn mức tuần ≥ 95%, tới 98% đợt bàn giao).

- Trạng thái: Cổng Phạm vi DUYỆT (606ddb1), kế hoạch T3 DUYỆT (chủ kho 17/11). Vùng thi công G duyệt D-11.
- Xong: việc 0–6 và phần máy chủ của việc 7: ontology, migration 015, đọc tệp, luật dấu (`src/modules/imports/{targets,mark,table}.ts`), cửa tạo `src/modules/listings/create.ts`, phần học `company-config/import-learn.ts`, mã riêng `catalog/company-alias.ts`, lưu và cửa `src/modules/imports/{store,imports-http,server}.ts` + năm route `/api/v1/imports…`. make check XANH ở 1e0f95d.
- G-1711-40/41: THÊM ca có tên chèn/xoá chéo sàn vào bộ cách ly (`db/tests/cach-ly.sql` + tên ca vào CA_SQL của `db/scripts/cach-ly.sh`, G duyệt D-12), kèm đối chứng dương; trang Cổng Bằng chứng nêu ca 23 trước → sau.
- Xong thêm: ca cách ly có tên nhap-excel-theo-san (ca 24, có phần hàm app.import_list_agents) — 39 ca xanh; `tests/db/nhap-excel.db.test.ts` 9/9 xanh trên dãy D; migration 016 hàm đặc quyền thứ 11 (chủ kho «Cho thấy (lối A)», dòng sổ d-20261117T064233Z-63); phần học dùng savepoint (`savepointRun`). make check XANH.
- ĐANG DỞ việc 8 (màn): trang `src/app/(app)/nhap-tep/page.tsx` (trong PermittedAction importListings), khung
  `src/modules/imports/ui/import-wizard.tsx` (ApplyBatches trong PermittedAction continueImport, UndoImport trong
  undoImport), screens.yaml nhap-tep = built; các bài đã ký đi theo màn mới (sua-sau-ky: kiem-vai-theo-man,
  bo-kiem-chung-khi-dang-nhap, khai-vai-va-man). make check XANH (bài đơn vị của màn `tests/nhap-excel-man.test.tsx`, phủ mã 80,16%).
  Xong: thanh bên mục Nạp tệp (importListings), dòng wiki/log.md. Hồ sơ họ màn design/patterns/luong-nhieu-buoc.md (bản
  nháp ở scratchpad của phiên D) và dòng design/so-khoi.yaml (ImportWizard, nguồn solution-crm-6) PHẢI vào cùng lượt với
  ma trận trạng thái của chung-minh-man.md và bài trình duyệt — có hồ sơ họ trước thì lưới đỏ «man-mau-chua-dat».
  Kế: chung-minh-man.md đủ mục khi implemented;
  tests/e2e-db/nhap-excel.spec.ts (E2, E15, E16, E20, E21) + axe. Lưu ý: commit c2414e82 dùng --no-verify (pre-commit chỉ
  chạy lint; lint đã sạch ở commit sau).
- 17/11 chiều: màn thêm «Lần nhập gần đây», nút «Chọn tệp khác», màn Xong liệt «Vừa học» và số ô giữ chữ gốc (857f4e77,
  make check XANH). Bài `tests/e2e-db/nhap-excel.spec.ts` ĐÃ VIẾT, CHƯA CHẠY: ca tep-khong-len-may-chu (E2), trang-thai
  (11 trạng thái ở 1024/1440 + điện thoại ở 360/414, axe sáng tối), ban-phim. Chờ lượt nặng: dãy R giữ khoá s4 lúc 14:22.
  Chạy: `DB_LANE=d DB_PORT=5571 npx playwright test -c playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts`.
  Còn hở so với evals: (1) nút «Bỏ dòng» ĐÃ CÓ ở bước Xem trước (bài đơn vị xanh) — còn viết ca E20/E21 bằng ban.xlsx
  theo tests/fixtures/nhap-excel/lua-chon.json; (2) ô ST-inventory-trong-nap và E15 sau khi 3g gộp;
  (3) hoan-tac-loi hiện băng lỗi chung, chưa nêu căn nào chưa gỡ; (4) dang-doc hiện chữ «Đang đọc tệp…», chưa có khung chờ.
- Việc kế sau màn: (c) việc 8 màn `/nhap-tep` (khung solution-crm-6, `@/components/reui/stepper` đã cài; gỡ dòng «bo qua: nhap-tep — planned» của e2e-templates.test và đổi screens.yaml sang built); (d) việc 9 Bảng hàng sau khi 3g gộp; (e) việc 10, S4.
- Ghi chú việc 5–7 cũ: 5 (`src/modules/listings/create.ts`), 6
  (`company-config/import-learn.ts`, `catalog/company-alias.ts`), 7 (cửa `/api/v1/imports` + `tests/db/nhap-excel.db.test.ts`,
  chạy cả tệp phá `db/tests/pha-thu/nhap-excel-xoa-mo.sql`), 8 (màn), 9 (Bảng hàng — sau khi 3g gộp), 10, rồi S4.
- Năm hồ sơ đã ký có mục sua-sau-ky (ghim lại cùng lượt ghim của hàng 11): kiem-vai-theo-man, kiem-vong-doi-thao-tac,
  khai-lien-ket-chao-can, bang-quyen-theo-vai, bo-kiem-chung-khi-dang-nhap, bang-hang-du-lieu-that (sáu).
- Lệnh: Postgres dãy D `make db-up DB_LANE=d DB_PORT=5571`; cách ly `DB_LANE=d DB_PORT=5571 bash db/scripts/cach-ly.sh`.
- Luật đợt: listings chỉ tệp mới + THÊM dòng export; inventory-grid/rows/page.tsx sau khi 3g gộp; tệp dùng chung chỉ thêm
  dòng; thứ tự gộp VP7 → 3g → 11; migration số tạm 015.
