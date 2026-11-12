# Chứng minh màn — ho-so-can

Lối «màn mẫu mới» (họ Lưới, `design/patterns/luoi.md` ghi `Màn: inventory`, chính màn này). Hàng 3 thêm hồ sơ căn vào Bảng
hàng; bảy trạng thái vùng vẫn do bộ bài sinh từ sổ màn đo trên chính Bảng hàng như hàng 2.

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/ho-so-can.md | app-shell-11 cột kéo chia cạnh bảng, ruột solution-crm-4, thân điện thoại product-detail-5, thẻ product-grid-4 | cột đứng cạnh bảng ngoài khung bảng, bảng co và vẫn bấm được; đầu hồ sơ, giá nổi bật, danh sách trường; thẻ một dòng mã và giá, ba thông số; một mô hình cho hai dạng xem; điện thoại toàn màn | kéo đổi rộng, ảnh, hướng, giá kèm phí, chủ nhà, Sẵn sàng bán, cuộc gọi, lớp phủ quyền, trang riêng /units | hàng 3 chỉ đọc B2, B3; ảnh, chủ nhà, Sẵn sàng bán là hàng sau; kéo chia cần gói mới (Hỏi-2) |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Hồ sơ căn mở trong Bảng hàng, không thêm màn; Bảng hàng là màn mẫu của họ Lưới (mặt so «Mở chi tiết cạnh bảng») |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | app-shell-11 | evidence/reui/app-shell-11.png | x |
| màn | sheet-9 | evidence/reui/sheet-9.png | |
| màn | solution-crm-9 | evidence/reui/solution-crm-9.png | |
| RecordPanel | app-shell-11 | evidence/reui/app-shell-11.png | x |
| RecordPanel | sheet-9 | evidence/reui/sheet-9.png | |
| RecordPanel | solution-crm-3 | evidence/reui/solution-crm-3.png | |
| ListingRecordBody | solution-crm-4 | evidence/reui/solution-crm-4.png | x |
| ListingRecordBody | sheet-9 | evidence/reui/sheet-9.png | |
| ListingRecordBody | sheet-22 | evidence/reui/sheet-22.png | |
| ListingCard | product-grid-4 | evidence/reui/product-grid-4.png | x |
| ListingCard | product-detail-5 | evidence/reui/product-detail-5.png | |
| ListingCard | solution-crm-4 | evidence/reui/solution-crm-4.png | |

### Ma trận trạng thái

| Trạng thái       | Kết quả  | Căn cứ                                                                                                  |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| Chờ tải          | đạt      | tests/e2e/screens/screens.spec.ts (công thức cho-tai; không có mã căn nên không mở được hồ sơ)          |
| Trống            | đạt      | tests/e2e/screens/screens.spec.ts (công thức trong)                                                     |
| Tìm không ra     | đạt      | tests/e2e/screens/screens.spec.ts (công thức tim-khong-ra); hồ sơ khi dòng bị lọc: tests/ho-so-can.test.tsx |
| Lỗi              | đạt      | tests/e2e/screens/screens.spec.ts (công thức loi)                                                       |
| Một phần hỏng    | đạt      | tests/e2e/screens/screens.spec.ts (công thức mot-phan-hong)                                             |
| Chữ dài          | đạt      | tests/e2e/screens/screens.spec.ts (công thức chu-dai)                                                   |
| Không đủ quyền   | đạt      | tests/e2e/screens/screens.spec.ts (công thức khong-du-quyen)                                            |
| Xung đột khi lưu | không áp | Hồ sơ hàng này chỉ đọc; sửa là hàng 4, 5                                                                |
| Phiên hết hạn    | không áp | Của khung (App Shell), không của vùng                                                                   |
| Mất mạng khi lưu | không áp | Hồ sơ hàng này không lưu gì                                                                             |
| Link hết hạn     | không áp | Trạng thái của trang khách; Bảng hàng là màn nội bộ                                                     |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| RecordPanel | reui | ngăn chi tiết cạnh bảng (app-shell-*, sheet-*, solution-crm-*) | sheet-9 | ngăn nổi đè bảng che ô tìm, số dòng và thanh trên; còn ba cột ở 1024 | ghép từ thành phần |
| ListingRecordBody | reui | ruột hồ sơ một bản ghi (solution-crm-*, sheet-*) | sheet-9 | sửa từng dòng tại chỗ; hồ sơ hàng này chỉ đọc | ghép từ thành phần |
| ListingCard | reui | thẻ sản phẩm có giá và thông số (product-grid-*, product-detail-*, product-card-*) | product-detail-5 | trang sản phẩm cả màn với ảnh lớn và nút mua; thẻ căn cần gọn | ghép từ thành phần |
| Frame | trong-kho | | | | |
| Button | trong-kho | | | | |
| Badge | trong-kho | | | | |
| DataRegion | trong-kho | | | | |
| TypedCell | trong-kho | | | | |

### Vùng

| Khối | Vùng | Xử lý | Lý do |
| --- | --- | --- | --- |
| app-shell-11 | cột chi tiết đứng cạnh thân, cao hết vùng | lấy | đầu chủ làm lâu cạnh bảng, bảng vẫn dùng được |
| app-shell-11 | thanh tên và nút của cột chi tiết | lấy | tên căn, Trước, Sau, Đóng |
| app-shell-11 | kéo chia đổi rộng | bỏ | cần gói kéo chia mới (Hỏi-2) |
| app-shell-11 | thanh điều hướng bên trái | bỏ | App Shell của kho đã có (app-shell-8) |
| app-shell-11 | thanh tab Tổng quan, Hoạt động | bỏ | hồ sơ hàng này một phần |
| app-shell-11 | bàn làm việc dưới đáy | bỏ | không có việc dưới bảng |
| app-shell-11 | cột lịch và việc kế bên phải | bỏ | không thuộc Bảng hàng |
| solution-crm-4 | đầu: mã và huy hiệu giai đoạn | lấy | mã căn và trạng thái |
| solution-crm-4 | số tiền lớn | lấy | giá chào luôn thấy dù bảng khuất cột giá |
| solution-crm-4 | danh sách trường có nhãn | lấy | tám trường của căn |
| solution-crm-4 | chọn giai đoạn tại chỗ | bỏ | hồ sơ chỉ đọc |
| solution-crm-4 | thanh xác suất thắng | bỏ | không có khái niệm này |
| solution-crm-4 | đội phụ trách | bỏ | đầu chủ của căn là hàng sau |
| solution-crm-4 | việc kế | bỏ | Hôm nay là màn khác |
| solution-crm-4 | tài chính | bỏ | giá kèm phí là C1 |
| solution-crm-4 | nút Thắng, Thua | bỏ | không có khái niệm này |
| product-grid-4 | tên và giá một dòng | lấy | đọc mã căn và giá trong một lần nhìn |
| product-grid-4 | ba thông số cạnh nhau | lấy | Diện tích, Phòng ngủ, Xác nhận lúc |
| product-grid-4 | dòng mô tả | bỏ | căn chưa có mô tả |
| product-grid-4 | ảnh vuông bên trái | bỏ | ảnh là G4 |
| product-grid-4 | số thứ tự và nhóm chương | bỏ | thẻ đứng một mình ở đầu hồ sơ |
| product-grid-4 | nơi và huy hiệu trạng thái | thêm | đầu chủ cần biết căn ở toà nào và còn bán không |
