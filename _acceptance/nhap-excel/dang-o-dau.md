# Đang ở đâu — nhap-excel (dãy D)

Cập nhật sau mỗi bước có nghĩa (G-1711-39: hạn mức tuần ≥ 95%, tới 98% đợt bàn giao).

- Trạng thái: Cổng Phạm vi DUYỆT (606ddb1), kế hoạch T3 DUYỆT (chủ kho 17/11). Vùng thi công G duyệt D-11.
- Xong: việc 0–6 và phần máy chủ của việc 7: ontology, migration 015, đọc tệp, luật dấu (`src/modules/imports/{targets,mark,table}.ts`), cửa tạo `src/modules/listings/create.ts`, phần học `company-config/import-learn.ts`, mã riêng `catalog/company-alias.ts`, lưu và cửa `src/modules/imports/{store,imports-http,server}.ts` + năm route `/api/v1/imports…`. make check XANH ở 1e0f95d.
- G-1711-40/41: THÊM ca có tên chèn/xoá chéo sàn vào bộ cách ly (`db/tests/cach-ly.sql` + tên ca vào CA_SQL của `db/scripts/cach-ly.sh`, G duyệt D-12), kèm đối chứng dương; trang Cổng Bằng chứng nêu ca 23 trước → sau.
- Xong thêm: ca cách ly có tên nhap-excel-theo-san (ca 24, có phần hàm app.import_list_agents) — 39 ca xanh; `tests/db/nhap-excel.db.test.ts` 9/9 xanh trên dãy D; migration 016 hàm đặc quyền thứ 11 (chủ kho «Cho thấy (lối A)», dòng sổ d-20261117T064233Z-63); phần học dùng savepoint (`savepointRun`). make check XANH.
- ĐANG DỞ việc 8 (màn): `src/app/(app)/nhap-tep/page.tsx`, `src/modules/imports/ui/{import-wizard.tsx,copy.ts,index.ts}`
  đã viết (khung solution-crm-6 + @reui/stepper, năm bước, gọi /api/v1/imports, ghi theo gói 200 dòng), screens.yaml
  nhap-tep = built, bỏ dòng «bo qua: nhap-tep — planned» ở e2e-templates.test. make check còn ĐỎ đúng ba bài:
  (1) tests/bo-nut-kiem.test.ts «ghi-khong-qua-cua: import-wizard.tsx:74 — POST ?»: lệnh ghi phải viết URL chữ thật (không
  qua hàm post(url) chung) và nút Áp/Hoàn tác đi qua PermittedAction của mô-đun identity (khuôn hàng 9e);
  (2) tests/bo-nut-vai-man.test.ts: sinh lại design/vai-man-nut.md bằng `python3 tools/coverage_matrix/buttons.py` sau khi
  nút có PermittedAction; (3) tests/coverage-matrix.test.ts dòng ~187 liệt cứng các trang — thêm "/nhap-tep" + mục
  sua-sau-ky ở hồ sơ của hàng 1d (khai-vai-va-man) như các mục khác.
  Sau đó: thanh bên (src/app/(app)/nav.ts) mục Nạp tệp theo importListings; design/patterns/luong-nhieu-buoc.md (màn mẫu
  nhap-tep); design/so-khoi.yaml dòng khối khung năm bước (ho_so: nhap-excel); chung-minh-man.md đủ mục khi implemented
  (Ma trận trạng thái, Vùng, Khối); tests/e2e-db/nhap-excel.spec.ts (E2, E15, E16, E20, E21) + axe.
- Việc kế sau màn: (c) việc 8 màn `/nhap-tep` (khung solution-crm-6, `@/components/reui/stepper` đã cài; gỡ dòng «bo qua: nhap-tep — planned» của e2e-templates.test và đổi screens.yaml sang built); (d) việc 9 Bảng hàng sau khi 3g gộp; (e) việc 10, S4.
- Ghi chú việc 5–7 cũ: 5 (`src/modules/listings/create.ts`), 6
  (`company-config/import-learn.ts`, `catalog/company-alias.ts`), 7 (cửa `/api/v1/imports` + `tests/db/nhap-excel.db.test.ts`,
  chạy cả tệp phá `db/tests/pha-thu/nhap-excel-xoa-mo.sql`), 8 (màn), 9 (Bảng hàng — sau khi 3g gộp), 10, rồi S4.
- Năm hồ sơ đã ký có mục sua-sau-ky (ghim lại cùng lượt ghim của hàng 11): kiem-vai-theo-man, kiem-vong-doi-thao-tac,
  khai-lien-ket-chao-can, bang-quyen-theo-vai, bo-kiem-chung-khi-dang-nhap, bang-hang-du-lieu-that (sáu).
- Lệnh: Postgres dãy D `make db-up DB_LANE=d DB_PORT=5571`; cách ly `DB_LANE=d DB_PORT=5571 bash db/scripts/cach-ly.sh`.
- Luật đợt: listings chỉ tệp mới + THÊM dòng export; inventory-grid/rows/page.tsx sau khi 3g gộp; tệp dùng chung chỉ thêm
  dòng; thứ tự gộp VP7 → 3g → 11; migration số tạm 015.
