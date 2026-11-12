---
loai: chu-de
ma: [N2, N3]
nguon: [raw/2026-11-12-so-boi-canh-quy-hang-2/chi-muc.md]
cap_nhat: 2026-11-12
---
# Thư gửi đi và cấu hình bản thật

Quy ước nguồn như [trang Sản phẩm](../nen/san-pham.md): `qh:` là Quỹ hàng ở commit `1729b11f`. Đường mở đầu
`nhánh chore/nen-lo-trinh-lop-sheet-va-no:` chưa gộp vào `main`, số dòng có thể đổi.

## Vì sao có

- Ba việc cần chỗ chạy thật: gửi mã đăng nhập bằng email thật, đo trên tên miền thật, và hai tuần thử với đội.
  `qh:docs/adr/0009-moi-truong-that.md:10-12`
- Bản thật thiếu bộ gửi email thì không khởi động, không bao giờ rơi về bộ gửi dev in mã ra nhật ký.
  `qh:docs/adr/0005-dang-nhap-theo-san.md:31`

## Ai dùng và làm việc gì

- Nhân viên sàn nhận mã đăng nhập qua thư; người xin mã luôn nhận câu trả lời thành công, kể cả khi thư hỏng, để không lộ ai
  có tài khoản. `qh:docs/adr/0009-moi-truong-that.md:60`
- Ở kho này người được mời nhận một thư mời. `wiki/decisions/0022-moi-nguoi-gan-vai.md:33-34`
- Chủ kho giữ khoá và đổi biến ở nơi chạy; không ai phải cầm chuỗi kết nối để đổi chế độ. `qh:docs/adr/0009-moi-truong-that.md:43-44,89-95`

## Thói quen phải giữ

- Đầu chủ đọc email trên điện thoại, nên thư mang mã gõ được, không mang link. `qh:docs/adr/0005-dang-nhap-theo-san.md:15-17`
- Thói quen người dùng với thư mời (mở trên máy nào, có tìm trong thư rác không): chưa xác nhận.

## Quỹ hàng đã chọn gì

- Một tên miền cố định cho bản thật; gửi thư qua một nhà cung cấp, từ một địa chỉ không nhận thư trả lời; khoá gửi chỉ ở nơi
  chạy. `qh:docs/adr/0009-moi-truong-that.md:32-33,39-40`
- Mọi bí mật chỉ ở nơi chạy (loại không đọc lại được) và bí mật của CI; không ở kho, không ở tin nhắn. Khoá mã hoá số chủ nhà
  giữ chỗ sẵn tên, sinh khi dựng bảng chủ nhà. `qh:docs/adr/0009-moi-truong-that.md:41-44`
- Địa chỉ gốc của ứng dụng là một biến cấu hình; bản xem trước dùng địa chỉ gốc của tên miền chính nên chưa đăng nhập được.
  `qh:.env.example:7` · `qh:docs/adr/0009-moi-truong-that.md:66`
- Áp migration trước, mã sau: sau khi gộp, CI chờ các bài kiểm xanh, áp migration, kiểm nhanh chỉ đọc, rồi mới triển khai.
  `qh:docs/adr/0009-moi-truong-that.md:34-38,109-111`

## Lỗi đã gặp

- Thư mã đăng nhập bị nhà cung cấp từ chối tới khi tên miền gửi được xác minh; lỗi chỉ thấy trong nhật ký.
  `qh:docs/adr/0009-moi-truong-that.md:60`
- Sự cố 06/11: bể kết nối cạn trần 15, đọc phiên hỏng, người đã đăng nhập bị đưa ra; sửa bằng chế độ giao dịch, công tắc cổng
  là biến thường. `qh:docs/adr/0009-moi-truong-that.md:72-75,77-91`
- Bản xem trước dùng chung cơ sở dữ liệu thật; phải tách hoặc tắt trước khi có dữ liệu thật. `qh:docs/adr/0009-moi-truong-that.md:61-62`

## MVP này giữ gì, bỏ gì

- Kho này: bản thật từ chối khởi động nếu thiếu bốn biến đăng nhập (khoá băm mã, khoá gửi thư, địa chỉ gửi, cơ sở dữ liệu).
  `.env.example:6,12-17`
- Thư mời gửi đúng một lần trong cùng giao dịch: thư hỏng thì không ai được thêm. `wiki/decisions/0022-moi-nguoi-gan-vai.md:33-34`
- Hiện thư mời lấy địa chỉ trang đăng nhập từ yêu cầu gửi tới; hàng 9d đổi sang lấy từ cấu hình, vì có cách triển khai trỏ
  được đường trong thư sang trang khác. `src/modules/identity/members-http.ts:93` ·
  `nhánh chore/nen-lo-trinh-lop-sheet-va-no:docs/plan/lo-trinh.json:645-649`
- Tên biến địa chỉ gốc ở kho này: chưa xác nhận (chưa có trong `.env.example`).
