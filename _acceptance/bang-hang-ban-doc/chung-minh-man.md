# Chứng minh màn — bang-hang-ban-doc

Lối «màn mẫu mới» (họ Lưới, `design/patterns/luoi.md` còn ghi chưa có màn mẫu). Bảy trạng thái vùng chạy bằng bộ bài sinh
từ sổ màn trên chính Bảng hàng, ở bốn khổ, cả bản máy hãm CPU; mỗi trạng thái có ca phá đỏ đúng thông điệp.

## Màn inventory

### Ma trận trạng thái

| Trạng thái       | Kết quả  | Căn cứ                                                                                                       |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| Chờ tải          | đạt      | tests/e2e/screens/screens.spec.ts (công thức cho-tai)                     |
| Trống            | đạt      | tests/e2e/screens/screens.spec.ts (công thức trong, bước tiếp «Tải lại»)                                     |
| Tìm không ra     | đạt      | tests/e2e/screens/screens.spec.ts (công thức tim-khong-ra, lối thoát «Xoá lọc»)                              |
| Lỗi              | đạt      | tests/e2e/screens/screens.spec.ts (công thức loi, «Thử lại»)                                                 |
| Một phần hỏng    | đạt      | tests/e2e/screens/screens.spec.ts (công thức mot-phan-hong)                                                  |
| Chữ dài          | đạt      | tests/e2e/screens/screens.spec.ts (công thức chu-dai, tên khu dài cắt gọn, đọc đủ khi focus)                 |
| Không đủ quyền   | đạt      | tests/e2e/screens/screens.spec.ts (công thức khong-du-quyen)                                                 |
| Xung đột khi lưu | không áp | Bảng hàng bản đọc không lưu gì; sửa trên ô là hàng 4, trạng thái này đi cùng hàng ấy                         |
| Phiên hết hạn    | không áp | Của khung (App Shell), không của vùng; Bảng hàng chưa bắt đăng nhập (hàng 8 để màn đọc dữ liệu thật bắt)     |
| Mất mạng khi lưu | không áp | Bảng hàng bản đọc không lưu gì; không có lần lưu nào để mất mạng                                             |
| Link hết hạn     | không áp | Trạng thái của trang khách; Bảng hàng là màn nội bộ                                                          |

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/bang-hang.md | data-grid-editing-6 (nhóm theo data-grid-grouping-2; điện thoại product-grid-4 + filter-sidebar-5) | lưới dữ liệu ReUI cuộn liền như Sheet, giá «x,xx tỷ», nhãn trạng thái màu, tìm mã căn, đủ trạng thái màn | lọc từng cột, nhóm theo toà, dòng tổng, góc nhìn lưu, sửa trên ô, hồ sơ căn cạnh bảng, đọc trên máy, bảng thẻ điện thoại | hàng 2 là bản đọc trên 60 căn mẫu; phần bỏ là hàng sau của lộ trình hoặc bị luật kho chặn trước MVP |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Bảng hàng là màn mẫu của họ Lưới (chốt ở hàng 1c) |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | data-grid-editing-6 | evidence/reui/data-grid-editing-6.png | x |
| màn | data-grid-grouping-2 | evidence/reui/data-grid-grouping-2.png | |
| màn | data-grid-base-5 | evidence/reui/data-grid-base-5.png | |
| data-grid-editing-6 | data-grid-editing-6 | evidence/reui/data-grid-editing-6.png | x |
| data-grid-editing-6 | data-grid-editing-5 | evidence/reui/data-grid-editing-5.png | |
| data-grid-editing-6 | data-grid-base-6 | evidence/reui/data-grid-base-6.png | |
| PageHeader | app-shell-30 | evidence/reui/app-shell-30.png | |
| PageHeader | product-card-9 | evidence/reui/product-card-9.png | |
| TypedCell | data-grid-advanced-16 | evidence/reui/data-grid-advanced-16.png | |
| TypedCell | data-grid-editing-5 | evidence/reui/data-grid-editing-5.png | |
| TruncatedText | c-tooltip-1 | evidence/reui/c-tooltip-1.png | |
| TruncatedText | c-tooltip-2 | evidence/reui/c-tooltip-2.png | |

### Vùng

| Khối | Vùng | Xử lý | Lý do |
| --- | --- | --- | --- |
| data-grid-editing-6 | khung viền và kẻ dọc giữa cột | lấy | đọc như Sheet |
| data-grid-editing-6 | thanh công cụ có ô tìm và số dòng | lấy | tìm căn |
| data-grid-editing-6 | chân bảng | lấy | ghi số dòng |
| data-grid-editing-6 | cuộn liền trên bảng cuộn ảo | lấy | đọc như Sheet, không chia trang |
| data-grid-editing-6 | cột số dòng | lấy | thói quen Sheet (phán quyết 13:50Z) |
| data-grid-editing-6 | tiêu đề và cột đầu đứng yên | lấy | đọc như Sheet khi cuộn |
| data-grid-editing-6 | sửa trên ô | bỏ | hàng 2 chỉ đọc; sửa ở hàng 4, 5 |
| data-grid-editing-6 | hoàn tác, làm lại | bỏ | không sửa nên không có gì để hoàn tác |
| data-grid-editing-6 | ô chọn dòng | bỏ | chưa có thao tác trên nhiều dòng |
| data-grid-editing-6 | chữ cái tên cột | bỏ | không có công thức tham chiếu ô |
| data-grid-editing-6 | hàng lọc theo cột | bỏ | lọc từng cột là hàng «dùng tay như Sheet» sau hàng 2 |
| data-grid-editing-6 | nút Lọc, Cột, Cài đặt, Xuất | bỏ | chưa có chức năng nào sau các nút ấy |
| data-grid-editing-6 | dòng tổng ở chân | bỏ | bản đọc chưa có cột cần cộng |
| data-grid-editing-6 | dòng tóm tắt dưới tên vùng | bỏ | chưa có số tóm tắt ngoài số dòng |
| data-grid-editing-6 | thanh gợi ý chọn ô | bỏ | không chọn ô |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| data-grid-editing-6 | reui | lưới kiểu Sheet (data-grid-*) | data-grid-grouping-2 | nhóm theo toà chưa vào MVP | ghép từ thành phần |
| PageHeader | ve-tay | «page header title» trong danh mục ReUI tại máy | app-shell-30 | đầu trang của khối gắn liền một App Shell có thanh tab; kho chỉ cần tên màn (tạo ở hàng 1a) | |
| TypedCell | ve-tay | «cell format number currency date» trong danh mục ReUI tại máy | data-grid-advanced-16 | khối định dạng ô riêng cho một màn KPI; kho cần một luật ô theo kiểu dữ liệu dùng chung (tạo ở hàng 1b) | |
| TruncatedText | ve-tay | «truncate tooltip text overflow» trong danh mục ReUI tại máy | c-tooltip-1 | chú thích nổi chỉ hiện khi rê chuột, không đọc đủ được bằng phím như sổ trạng thái đòi (tạo ở hàng 1b) | |
| Frame | trong-kho | | | | |
| DataGrid | trong-kho | | | | |
| DataGridScrollArea | trong-kho | | | | |
| DataGridTableVirtual | trong-kho | | | | |
| InputGroup | trong-kho | | | | |
| Badge | trong-kho | | | | |
| Button | trong-kho | | | | |
