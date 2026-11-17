
- 2026-11-17 — hàng 11 «Nhập Excel» (`_acceptance/nhap-excel/`, dãy D): sổ màn có màn mới `nhap-tep` (planned) nên
  `tests/vai-man-nut-sinh.test.ts` thêm `nhap-tep` vào danh sách màn của ca giu-moi-man và đếm 11 mục thay 10 ở ca
  bang-du-muc; `design/vai-man-nut.md` sinh lại bằng `tools/coverage_matrix/buttons.py`. Không đổi luật đo, ca phá giữ
  nguyên. Như hàng 7e đã thêm `tuy-chinh-san`. Hồ sơ này ghim lại cùng lượt ghim của hàng 11.
- 2026-11-17 — hàng 11 (cùng lượt): `createListing` chuyển `live` (chủ kho duyệt Hỏi-1), nên ca phá «màn built trỏ thao
  tác planned» của `tests/vai-man-so-man.test.ts` dùng `removeListing` (vẫn planned, hàng 18b) thay `createListing`; màn
  `nhap-tep` (planned) vào danh sách màn ngoài cặp của ca tap-cap-bang-tich. Luật đo không đổi.
