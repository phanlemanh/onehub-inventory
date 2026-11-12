# Chứng minh màn — bang-hang-dung-tay-nhu-sheet

Lối «màn mẫu mới»: Bảng hàng là màn mẫu của họ Lưới (`design/patterns/luoi.md` ghi `Màn: inventory`), hàng này thêm thói
quen dùng tay như Sheet vào chính màn mẫu. Bảy trạng thái vùng vẫn chạy bằng bộ bài sinh từ sổ màn trên Bảng hàng; trạng
thái «Tìm không ra» nay gặp cả khi lọc từng cột ra rỗng.

## Màn inventory

### Ma trận trạng thái

| Trạng thái       | Kết quả  | Căn cứ                                                                                               |
| ---------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| Chờ tải          | đạt      | tests/e2e/screens/screens.spec.ts (công thức cho-tai)                                                |
| Trống            | đạt      | tests/e2e/screens/screens.spec.ts (công thức trong, bước tiếp «Tải lại»)                             |
| Tìm không ra     | đạt      | tests/grid-sheet.test.tsx (lọc ra rỗng, lối thoát «Xoá lọc»)                                         |
| Lỗi              | đạt      | tests/e2e/screens/screens.spec.ts (công thức loi, «Thử lại»)                                         |
| Một phần hỏng    | đạt      | tests/e2e/screens/screens.spec.ts (công thức mot-phan-hong)                                          |
| Chữ dài          | đạt      | tests/e2e/screens/screens.spec.ts (công thức chu-dai)                                                |
| Không đủ quyền   | đạt      | tests/e2e/screens/screens.spec.ts (công thức khong-du-quyen)                                         |
| Xung đột khi lưu | không áp | Bảng hàng vẫn chỉ đọc; lọc, sắp, nhóm, cột là cách xem, không lưu gì (sửa trên ô là hàng 4)          |
| Phiên hết hạn    | không áp | Của khung (App Shell), không của vùng                                                                |
| Mất mạng khi lưu | không áp | Không có lần lưu nào: cách xem chỉ sống trong phiên                                                  |
| Link hết hạn     | không áp | Trạng thái của trang khách; Bảng hàng là màn nội bộ                                                  |

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/bang-hang.md | data-grid-editing-6, nhóm theo data-grid-grouping-2 | phím của lưới ReUI, chép chữ đang hiện tách tab, sắp một cột ô trống cuối, lọc từng cột đúng kiểu (giá theo tỷ, số theo luật), nhóm theo toà đếm liền, ẩn hiện cột | nhóm Toà → Loại căn, góc nhìn lưu, chọn một giá trị ở ô lọc, ghim khoá cứng | dữ liệu mẫu chưa có loại căn; góc nhìn lưu là hàng 2c; chọn nhiều là bộ lọc có sẵn của kho; Quỹ hàng gặp lỗi ghim không tác dụng |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Bảng hàng là màn mẫu của họ Lưới; hàng này mở rộng chính khuôn Lưới |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | data-grid-editing-6 | evidence/reui/data-grid-editing-6.png | x |
| màn | data-grid-columns-3 | evidence/reui/data-grid-columns-3.png | |
| màn | data-grid-virtualization-1 | evidence/reui/data-grid-virtualization-1.png | |
| data-grid-grouping-2 | data-grid-grouping-2 | evidence/reui/data-grid-grouping-2.png | x |
| data-grid-grouping-2 | data-grid-grouping-1 | evidence/reui/data-grid-grouping-1.png | |
| ShellFocus | data-grid-columns-3 | evidence/reui/data-grid-columns-3.png | |
| ShellFocus | data-grid-virtualization-1 | evidence/reui/data-grid-virtualization-1.png | |

### Vùng

| Khối | Vùng | Xử lý | Lý do |
| --- | --- | --- | --- |
| data-grid-grouping-2 | dòng nhóm có nút gập, tên, số đếm | lấy | nhóm theo toà như Sheet chia theo toà |
| data-grid-grouping-2 | nút nhóm trên thanh công cụ | lấy | bật tắt nhóm theo toà |
| data-grid-grouping-2 | số dòng đếm liền qua nhóm | thêm | thói quen cột số dòng của Sheet (thành phần của kho) |
| data-grid-grouping-2 | tổng tiền mỗi nhóm | bỏ | câu giao không có tổng; chưa có số tổng cho căn |
| data-grid-grouping-2 | dòng tổng ở chân | bỏ | như trên |
| data-grid-grouping-2 | nút Xuất | bỏ | chủ kho chọn bỏ ở Hỏi-4 |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| DataRegion | trong-kho | | | | |
| data-grid-grouping-2 | reui | nhóm dòng (data-grid-grouping-*) | data-grid-grouping-1 | dải nhóm cần chữ mô tả mỗi toà mà dữ liệu chưa có | ghép từ thành phần |
| ShellFocus | ve-tay | «fullscreen expand maximize data grid» trong danh mục ReUI | data-grid-columns-3 | ReUI không có chế độ toàn màn; khối gần nhất chỉ có bảng chọn hiển thị, không ẩn khung ứng dụng | |
| DataGrid | trong-kho | | | | |
| DataGridCellSelection | trong-kho | | | | |
| DataGridColumnHeader | trong-kho | | | | |
| DataGridColumnFilter | trong-kho | | | | |
| DataGridColumnVisibility | trong-kho | | | | |
| DataGridTableRowExpand | trong-kho | | | | |
| Input | trong-kho | | | | |
| Button | trong-kho | | | | |
| Badge | trong-kho | | | | |
