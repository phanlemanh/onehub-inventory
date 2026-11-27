# Sửa sau chữ ký

Chủ kho đã ký Cổng Bằng chứng của hồ sơ này. Việc phụ VP10 lát 1 «Khung lưới, ngăn chi tiết và nút» đổi bài sau chữ
ký, theo luật đợt «đổi mã hay bài của hồ sơ đã ký thì ghi ở đây và ghim lại cùng lượt». Căn cứ: chủ kho quyết ở phiên xem trước «BH · Điều chỉnh UX Bảng hàng» ngày 2026-11-27, ghi lại và dựng ở hồ sơ `_acceptance/khung-luoi-va-ngan-chi-tiet/` (Cổng Phạm vi duyệt 2026-11-27, vòng 4 PASS trên `26a399d8`); giám sát G-2711-12…14, G-2711-19.

## VP10 lát 1, 2026-11-27

| Chỗ | Người dùng thấy khác gì | Phép |
| --- | --- | --- |
| `tests/e2e/sheet.spec.ts` «sheet tab stops» ở 360 và 414: điểm dừng là «Lọc»/«Lọc (1)», «Nhóm theo Toà», rồi thẻ; không còn «Thêm»; người không được lưu góc nhìn không có «Lưu góc nhìn» | Có: bớt một điểm dừng Tab trên điện thoại | «Duyệt cả sáu điểm» (L1), luật «…» |
| `tests/e2e/sheet.spec.ts` «header buttons in view»: không tiêu đề nào có nút «Bỏ ghim …»; ghim và thôi ghim từ trình đơn cột; cột ghim cuối đổ bóng, đo trên điểm ảnh ở ô thân và ô tiêu đề | Có: tiêu đề cột bớt nút, ghim nằm trong trình đơn | «Duyệt cả sáu điểm» (L4) |
