# Chứng minh màn — hoi-dau-chu-bao-sai

Lối «màn mẫu mới» (họ Lưới, `design/patterns/luoi.md` ghi `Màn: inventory`, chính màn này). Hàng 3e không thêm màn: nó thêm
thanh dính đáy và hộp báo sai vào hồ sơ căn của Bảng hàng (hàng 3), và đổi đầu hồ sơ thành hai dòng. Trạng thái vùng của Bảng
hàng không đổi; bộ bài sinh từ sổ màn vẫn đo chúng như hàng 2, hàng 3.

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/ho-so-can.md | thân điện thoại product-detail-5 với nút chính dính đáy «Hỏi đầu chủ · <tên>»; hộp «Báo sai thông tin căn» (Dialog, Select, Input, Textarea) trên mục Thuộc tính | thanh dính đáy một nút, nút tắt kèm lý do khi chưa ai giữ, bảng chia sẻ gọi trong lượt bấm, chép khi không có, hộp báo sai năm ô, trần 200/500 | lời gọi mạng đọc tên đầu chủ lúc mở hồ sơ, đường dẫn tới trang tìm, chữ nút 21 ký tự | tên đi cùng dòng Bảng hàng (dữ liệu mẫu tới hàng 10); đường dẫn trỏ thẳng hồ sơ; trần 17 ký tự của kho |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Hai nút gắn vào hồ sơ mở trong Bảng hàng — chính màn mẫu của họ Lưới; không thêm màn |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | sheet-9 | evidence/reui/sheet-9.png | x |
| màn | app-shell-11 | evidence/reui/app-shell-11.png | |
| màn | solution-crm-4 | evidence/reui/solution-crm-4.png | |
| sheet-8 | sheet-8 | evidence/reui/sheet-8.png | x |
| sheet-8 | product-detail-5 | evidence/reui/product-detail-5.png | |

### Ma trận trạng thái

| Trạng thái       | Kết quả  | Căn cứ                                                                                             |
| ---------------- | -------- | -------------------------------------------------------------------------------------------------- |
| Chờ tải          | đạt      | tests/e2e/screens/screens.spec.ts (công thức cho-tai; không có mã căn nên không mở được hồ sơ)     |
| Trống            | đạt      | tests/e2e/screens/screens.spec.ts (công thức trong)                                                |
| Tìm không ra     | đạt      | tests/e2e/screens/screens.spec.ts (công thức tim-khong-ra)                                         |
| Lỗi              | đạt      | tests/e2e/screens/screens.spec.ts (công thức loi); chép và chia sẻ hỏng: tests/hoi-dau-chu-bao-sai.test.tsx |
| Một phần hỏng    | đạt      | tests/e2e/screens/screens.spec.ts (công thức mot-phan-hong)                                        |
| Chữ dài          | đạt      | tests/e2e/screens/screens.spec.ts (công thức chu-dai); tên căn một dòng: tests/e2e/ho-so-can.spec.ts |
| Không đủ quyền   | đạt      | tests/e2e/screens/screens.spec.ts (công thức khong-du-quyen); nút theo vai: tests/hoi-dau-chu-bao-sai.test.tsx |
| Xung đột khi lưu | không áp | Hàng này không lưu gì                                                                              |
| Phiên hết hạn    | không áp | Của khung (App Shell), không của vùng                                                              |
| Mất mạng khi lưu | không áp | Hàng này không lưu gì và không gọi mạng; tin đi qua bảng chia sẻ của máy                           |
| Link hết hạn     | không áp | Trạng thái của trang khách; Bảng hàng là màn nội bộ                                                |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| sheet-8 | reui | chân dính của ngăn (`tra.mjs sticky footer action bar`) | product-detail-5 | trang sản phẩm cả màn, hộp mua không dính | ghép từ thành phần |
| RecordPanel | trong-kho | | | | |
| FormDialog | trong-kho | | | | |
| Button | trong-kho | | | | |
| Select | trong-kho | | | | |

### Vùng

| Khối | Vùng | Xử lý | Lý do |
| --- | --- | --- | --- |
| sheet-8 | chân dính có vạch trên | lấy | nút bước kế luôn trong tầm tay khi thân hồ sơ cuộn |
| sheet-8 | biểu mẫu hai phần của ngăn | bỏ | hồ sơ căn đã có thân riêng (hàng 3) |
| sheet-8 | hai nút Reset và Save | bỏ | luật chỗ đặt D: thanh chỉ chứa một nút |
