# Chứng minh màn — ho-so-du-thong-tin

Lối «màn mẫu mới» (họ Lưới, `design/patterns/luoi.md` ghi `Màn: inventory`, chính màn này). Hàng 3b thêm khối vào thân hồ sơ
căn của Bảng hàng; khung hồ sơ, đầu và đáy hồ sơ không đổi. Bảy trạng thái vùng vẫn do bộ bài sinh từ sổ màn đo như hàng 2, 3.

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/ho-so-can.md | ruột hồ sơ solution-crm-4; thuộc tính căn, phần lần rao, các lần rao, mức đủ thông tin, xác nhận N ngày | khối tiêu đề nhỏ in hoa, nhãn và giá trị, thanh mức đủ, dòng «Lần N», cả hồ sơ đổi khi chạm lần cũ, ba câu xác nhận | địa chỉ riêng cho lần cũ, Ảnh thật và bao phí trong mức đủ, «điền ở Bảng hàng», đếm ngày theo UTC | chủ kho chốt Hỏi-3; ảnh là hàng 15, bao phí hàng 19; hồ sơ chưa có chỗ điền; giờ Việt Nam đúng ngày với xác nhận buổi sáng |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Hồ sơ căn mở trong Bảng hàng, không thêm màn; Bảng hàng là màn mẫu của họ Lưới |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | app-shell-11 | evidence/reui/app-shell-11.png | |
| màn | sheet-9 | evidence/reui/sheet-9.png | x |
| màn | solution-crm-9 | evidence/reui/solution-crm-9.png | |
| solution-crm-4 | solution-crm-4 | evidence/reui/solution-crm-4.png | x |
| solution-crm-4 | sheet-9 | evidence/reui/sheet-9.png | |
| solution-crm-4 | sheet-22 | evidence/reui/sheet-22.png | |

### Ma trận trạng thái

| Trạng thái       | Kết quả  | Căn cứ                                                                                         |
| ---------------- | -------- | ---------------------------------------------------------------------------------------------- |
| Chờ tải          | đạt      | tests/e2e/screens/screens.spec.ts (công thức cho-tai; không có mã căn nên không mở được hồ sơ) |
| Trống            | đạt      | tests/e2e/screens/screens.spec.ts (công thức trong)                                            |
| Tìm không ra     | đạt      | tests/e2e/screens/screens.spec.ts (công thức tim-khong-ra)                                     |
| Lỗi              | đạt      | tests/e2e/screens/screens.spec.ts (công thức loi)                                              |
| Một phần hỏng    | đạt      | tests/e2e/screens/screens.spec.ts (công thức mot-phan-hong)                                    |
| Chữ dài          | đạt      | tests/e2e/screens/screens.spec.ts (công thức chu-dai)                                          |
| Không đủ quyền   | đạt      | tests/e2e/screens/screens.spec.ts (công thức khong-du-quyen)                                   |
| Xung đột khi lưu | không áp | Hồ sơ chỉ đọc; sửa là hàng 4, 3d                                                               |
| Phiên hết hạn    | không áp | Của khung (App Shell), không của vùng                                                          |
| Mất mạng khi lưu | không áp | Hồ sơ không lưu gì                                                                             |
| Link hết hạn     | không áp | Trạng thái của trang khách; Bảng hàng là màn nội bộ                                            |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| solution-crm-4 | reui | ruột hồ sơ có khối và thanh tiến độ (solution-crm-*, sheet-*) | sheet-9 | sửa từng dòng tại chỗ; hồ sơ chỉ đọc và cần khối có tiêu đề | ghép từ thành phần |
| ListingCard | trong-kho | | | | |
| RecordPanel | trong-kho | | | | |
| Button | trong-kho | | | | |
| Badge | trong-kho | | | | |
| TypedCell | trong-kho | | | | |

### Vùng

| Khối | Vùng | Xử lý | Lý do |
| --- | --- | --- | --- |
| solution-crm-4 | khối có tiêu đề chữ nhỏ in hoa | lấy | chia hồ sơ thành Căn, Lần chào, Các lần chào |
| solution-crm-4 | danh sách trường có nhãn | lấy | tám thuộc tính căn và bốn thông tin lần chào |
| solution-crm-4 | thanh tiến độ dưới số tiền | lấy | thanh mức đủ thông tin, số phần có trên năm |
| solution-crm-4 | chọn giai đoạn tại chỗ | bỏ | hồ sơ chỉ đọc |
| solution-crm-4 | nút Thắng, Thua | bỏ | không có khái niệm này |
| solution-crm-4 | đội phụ trách | bỏ | người giữ căn là hàng sau |
| solution-crm-4 | việc kế | bỏ | Hôm nay là màn khác |
| solution-crm-4 | danh sách các lần chào bấm được | thêm | xem lại một lần chào cũ của căn |
| solution-crm-4 | câu xác nhận đếm ngày | thêm | đầu chủ biết lần cuối gọi chủ nhà cách đây bao lâu |
