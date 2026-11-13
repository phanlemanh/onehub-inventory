# Chứng minh màn — hoi-dau-chu-bao-sai

Lối «theo màn mẫu» (họ Lưới, `design/patterns/luoi.md` ghi `Màn: inventory`). Hàng 3e không thêm màn: nó thêm thanh dính đáy
và hộp báo sai vào hồ sơ căn của Bảng hàng (hàng 3).

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/ho-so-can.md | thân điện thoại product-detail-5 với nút chính dính đáy «Hỏi đầu chủ · <tên>»; hộp «Báo sai thông tin căn» (Dialog, Select, Input, Textarea) trên mục Thuộc tính | thanh dính đáy một nút, nút tắt kèm lý do khi chưa ai giữ, bảng chia sẻ gọi trong lượt bấm, chép khi không có, hộp báo sai năm ô, trần 200/500 | lời gọi mạng đọc tên đầu chủ lúc mở hồ sơ, đường dẫn tới trang tìm, chữ nút 21 ký tự | tên đi cùng dòng Bảng hàng (dữ liệu mẫu tới hàng 10); đường dẫn trỏ thẳng hồ sơ; trần 17 ký tự của kho |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | theo màn mẫu | Hai nút gắn vào hồ sơ mở trong Bảng hàng — chính màn mẫu của họ Lưới; không thêm màn |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| thanh-day | sheet-8 | evidence/reui/sheet-8.png | x |
| thanh-day | product-detail-5 | evidence/reui/product-detail-5.png | |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| sheet-8 | reui | chân dính của ngăn (`tra.mjs sticky footer action bar`) | product-detail-5 | trang sản phẩm cả màn, hộp mua không dính | lấy một vùng (chân dính), bỏ phần biểu mẫu |
| FormDialog | trong-kho | | | | |
| Button | trong-kho | | | | |
