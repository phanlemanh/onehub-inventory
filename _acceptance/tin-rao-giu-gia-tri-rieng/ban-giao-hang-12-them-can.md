# Bàn giao cho hàng 12 `them-can`: nút «Gắn sang căn khác»

Chủ kho quyết ngày 28/11/2026, trả lời câu hỏi của giám sát (G-2811-70), nguyên văn: «Hoãn sang hàng 12».

Câu hỏi khi ấy: «Hàng 3h: lệnh «Gắn sang căn khác» trong hồ sơ căn — phần máy chủ đã xong, phần nút cần ô tìm mã căn mà
thiết kế đã ký nói dùng lại của hàng 12 (chưa làm). Hoãn phần nút sang hàng 12 (khuyến nghị), hay để 3h tự dựng ô tìm?»

## Hàng 3h để lại gì

- Cửa ghi phía máy chủ đã có, và bài E10 của 3h đã đo đủ: chuyển liên kết của tin sang căn khác, giữ giá trị riêng, đọc lại
  các thuộc tính sàn không gõ theo căn mới; căn đã có tin đang mở thì bị từ chối với câu nêu mã căn, không gì thay đổi.
  Lệnh gửi `{ field: "unit", upi }` qua `PATCH /api/v1/listings/<id>` (`src/modules/listings/listings-http.ts`, `moveUnit`).
- Tin đang trỏ một căn chờ bị từ chối (d-…-32 của sổ 3h): chuyển tin của căn chờ là việc của hàng 12.
- Lưới không có lệnh này (luật của AC-10, đo ở E10).

## Hàng 12 nhận

- Nút «Gắn sang căn khác» nằm trong «…» của đầu hồ sơ căn (luật «…» đã duyệt; d-…-26 của sổ 3h).
- Nút dùng ô tìm mã căn của chính hàng 12, không có ô tìm thứ hai (`design.md` của 3h, mục khối, dòng «Ô tìm mã căn»).
- Phép đo sau đây, chép nguyên văn từ E10b của hồ sơ 3h để Cổng Phạm vi của hàng 12 chép vào hợp đồng của nó:

> "exit 0; ở 1440 và 360 trong hồ sơ căn: 'Gắn sang căn khác' mở ô tìm mã căn của hàng 12, chọn căn Y → hồ sơ hiện mã căn Y, Diện tích riêng còn, dấu tính theo Y; chọn căn đã có tin mở → câu lỗi nêu mã căn, hồ sơ không đổi; ảnh evidence/E10b-1440.png, E10b-360.png"

- Bài trình duyệt của 3h đặt tên ca theo mẫu `gan-sang-can-khac-tren-man`, 1440 và 360, trên Postgres có đăng nhập.
