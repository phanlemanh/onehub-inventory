---
loai: chu-de
ma: [N3, N7, N8, N10]
nguon: [raw/2026-11-11-so-boi-canh-quy-hang/chi-muc.md]
cap_nhat: 2026-11-11
---
# Người dùng và vai

Quy ước nguồn như [trang Sản phẩm](../nen/san-pham.md): `qh:` là Quỹ hàng ở commit `1729b11f`. Đường mở đầu
`nhánh chore/nen-chon-truoc-tao-sau:` chưa gộp vào `main`, số dòng có thể đổi.

## Vì sao có

- Màn Người dùng để quản trị sàn tự quản người; trước đó chỉ đội vận hành gắn được người. Vai và khu là nền quyền cho mọi màn
  sau. `qh:docs/adr/0006-vai-khu-va-loi-moi.md:11-12`
- Một người giữ được nhiều vai (đầu chủ kiêm đầu khách là thường). `qh:docs/product/tham-chieu.md:35`
- Ở Quỹ hàng mỗi mô-đun tự kiểm quyền nên ai đọc được hàng thì sửa được giá; kho này đặt một bảng quyền từ đầu.
  `wiki/decisions/0016-permission-model.md:28,35`

## Ai dùng và làm việc gì

- Chỉ Quản trị sàn xem và sửa người; Quản trị sàn làm trên máy tính. `qh:docs/adr/0006-vai-khu-va-loi-moi.md:23-24` ·
  `qh:docs/product/tham-chieu.md:26-33`
- Trưởng nhóm chia việc, xử lý ngoại lệ, bàn giao khi có người nghỉ. `qh:docs/product/tham-chieu.md:31` ·
  `qh:docs/product/ghi-chep/2026-10-29-kien-truc-thong-tin.md:51`

## Thói quen phải giữ

- Mỗi toà hay phân khu một người phụ trách, cả đội xem; khu là tên sàn tự đặt. `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:139` ·
  `qh:docs/adr/0006-vai-khu-va-loi-moi.md:21-22`
- Sheet là «một link cho cả đội»: ai có link là thấy chung. `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:47`
- Mời là vào sàn ngay, không có bước nhận lời, vì lúc ấy chưa có email thật để gửi lời mời; quản trị tự báo người được
  mời. `qh:docs/adr/0006-vai-khu-va-loi-moi.md:18`
- Chủ sàn mở sàn là muốn làm việc ngay, không đi tìm cách tự thêm vai cho mình. `qh:docs/plan/audit-san-moi-day-0.md:140-149`

## Quỹ hàng đã chọn gì

- ADR-0006: năm vai cố định, sàn không tự thêm vai; câu trả lời khi mời giống hệt nhau dù email đã có tài khoản hay chưa;
  sàn luôn còn ít nhất một quản trị. `qh:docs/adr/0006-vai-khu-va-loi-moi.md:16-20,25`
- Đích của màn Người dùng là khối Pro `solution-users-8`. `qh:docs/design/vo-va-ia.md:133`
- Đổi 06/11: trao Quản trị sàn là trao luôn bốn vai làm việc; Trưởng nhóm kéo theo Đầu chủ và Đầu khách.
  `qh:docs/product/tham-chieu.md:420,424`

## Lỗi đã gặp

- Ngõ cụt ngày đầu: người mở sàn chỉ có vai Quản trị, không thấy hàng, không biết làm gì tiếp. `qh:docs/plan/audit-san-moi-day-0.md:140-149`
- Lời mời bị từ chối vẫn tạo tài khoản mới; mã khu sai dạng thành lỗi 500 thay vì báo khu không hợp lệ.
  `qh:_acceptance/moi-nguoi-vai-khu/review-findings.md:23,30`
- Màn Người dùng vào App Shell mà vẫn tự dựng khung toàn màn (vùng chính lồng nhau, thanh cuộn thừa).
  `qh:_acceptance/vo-ung-dung/review-findings.md:14-19`

## MVP này giữ gì, bỏ gì

- Giữ N3 mời và gán bốn vai, N7 một bảng quyền, N8 khoá người nghỉ và bàn giao, N10 trang quyền và nhật ký.
  `docs/plan/pham-vi-mvp-dot-1.md:26-30`
- Bàn giao ở Quỹ hàng nằm trong nhà Đội, chưa phác, để sau, nên N8 không có bản cũ. Trang quyền của N10: Quỹ hàng có hay
  chưa, chưa xác nhận. `qh:docs/product/tham-chieu.md:277`
- Bỏ vai Telesales (L2), nên bốn vai thay vì năm. `docs/plan/pham-vi-mvp-dot-1.md:63`
- **Ngược với Quỹ hàng:** kho này cho Quản trị sàn không tự thấy hàng hay số chủ, muốn thấy thì nhận thêm vai Trưởng nhóm.
  Quỹ hàng từng vấp ngõ cụt ngày đầu vì chính chỗ này. `wiki/decisions/0016-permission-model.md:36`
- Màn Thành viên chọn lại ở hàng 9c: ứng viên là khuôn Lưới của kho, `solution-users-8`, hộp mời `dialog-2`.
  `nhánh chore/nen-chon-truoc-tao-sau:docs/plan/lo-trinh.json:569-581`
