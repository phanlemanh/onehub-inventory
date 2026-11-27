# Sửa sau chữ ký

Chủ kho đã ký Cổng Bằng chứng của hồ sơ này. Việc phụ VP10 lát 1 «Khung lưới, ngăn chi tiết và nút» đổi bài sau chữ
ký, theo luật đợt «đổi mã hay bài của hồ sơ đã ký thì ghi ở đây và ghim lại cùng lượt». Căn cứ: chủ kho quyết ở phiên xem trước «BH · Điều chỉnh UX Bảng hàng» ngày 2026-11-27, ghi lại và dựng ở hồ sơ `_acceptance/khung-luoi-va-ngan-chi-tiet/` (Cổng Phạm vi duyệt 2026-11-27, vòng 4 PASS trên `26a399d8`); giám sát G-2711-12…14, G-2711-19.

## VP10 lát 1, 2026-11-27

| Chỗ | Người dùng thấy khác gì | Phép |
| --- | --- | --- |
| `tests/e2e/sheet.spec.ts` «header buttons in view»: không còn nút «Bỏ ghim Toà» trên tiêu đề (phân xử K-1411-7); trình đơn của Toà đánh dấu «Ghim bên trái», bấm thì Toà thôi ghim; cột ghim cuối đổ bóng lên cột cuộn | Có: tiêu đề Toà bớt một nút, ghim nằm trong trình đơn | «Duyệt cả sáu điểm» (L4) |
| `tests/e2e/ho-so-can.spec.ts` ngăn nổi từ dưới thanh trên, thanh công cụ dừng trước ngăn | Có: ngăn cao hơn, không đè thanh công cụ | Q1, Q4 |
| `_acceptance/bo-o-tim-cua-vung/doi-bai-kiem.md` hai hàng 56–57: tên ca mới «stands under the top bar, clears the toolbar, leaves search and account usable, keeps the grid live» (ca cũ đổi tên vì nay kiểm thêm thanh công cụ dừng trước ngăn); hai dòng lọc cột Căn trong ca giữ nguyên | Không | Q4; làn ghim lại 2026-11-27 đỏ E18 «ca khong co» vì tên cũ |
| `_acceptance/bo-o-tim-cua-vung/rang/doi-bai-kiem.mjs` thêm `--head`; lệnh `doi_bai_kiem` ở `_acceptance/config.yaml` ghim mốc cố định `--base 1226ec5b --head 15aff913` (đoạn đổi của chính hàng 2e) thay cho merge-base với main. Lý do: thước dựa vào merge-base nên vô nghĩa từ khi 2e gộp — mọi nhánh sau thấy 0 dòng bị bỏ, ca phá «xoá một hàng» không thể đỏ, `--self-test` exit 1. Lỗi có từ lúc gộp, không do VP10. Không bỏ, không nới phép nào: vẫn kiểm đủ hàng cho mọi dòng bị bỏ và mọi hàng «mới» trỏ ca có thật trong cây hiện tại. Sau sửa: 46 dòng bỏ có hàng, ba ca phá đỏ đúng thông điệp, exit 0 (commit `ec70d782`, một commit riêng để hàng 11 lấy đúng bản này) | Không | Giám sát G-2711-36 |
