# Chứng minh màn — bang-hang-the-dien-thoai

Hàng 2b đổi thân vùng Lưới của Bảng hàng dưới 768 px thành danh sách thẻ căn; từ 768 bảng không đổi. Bảng hàng là màn mẫu
của họ Lưới, nên ma trận trạng thái của nó đo lại ở khổ điện thoại (điền trước lượt chấm).

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| ----- | --------------------- | --- | --- | ------ |
| docs/tri-thuc/wiki/chu-de/bang-hang.md | Bảng hàng thẻ điện thoại (hàng 32 của Quỹ hàng): product-grid-4 + ngăn lọc filter-sidebar-5 thành ngăn đáy, dưới md | thẻ một căn: mã căn + giá một dòng, ba thông số trên vạch mảnh; dòng nhóm toà; cùng địa chỉ /inventory | ảnh căn (kho chưa có ảnh), câu chuyện, chọn nhiều khi giữ lâu, cuộn ảo, chỉ hai trạng thái | mười việc trên điện thoại chỉ là tra, xem giá, mở hồ sơ (trang bối cảnh); ngăn lọc là Hỏi-2 vì chủ kho đã chốt ô lọc luôn hiện ở 2e |

### Họ

| Họ đề xuất | Lối | Vì sao |
| ---------- | --- | ------ |
| grid | màn mẫu mới | `design/patterns/luoi.md` ghi `Màn: inventory`: hàng này sửa chính màn mẫu ở khổ điện thoại, nên ma trận trạng thái của nó đo lại |

### Ứng viên ReUI

Ảnh khối gốc chụp ở 360 từ trang xem trước công khai của ReUI trước khi dựng. Chọn theo Hỏi-1 ở Cổng Phạm vi.

| Cho | Ứng viên | Ảnh | Chọn |
| --- | -------- | --- | ---- |
| màn | product-grid-4 | evidence/reui-product-grid-4.png | |
| màn | list-5 | evidence/reui-list-5.png | |
| màn | data-grid-columns-3 | evidence/reui-data-grid-columns-3.png | |

data-grid-columns-3 (bảng ↔ thẻ) không đưa thành lối: ở 360 mỗi thẻ cao gần một màn, đầu thẻ mang nút sửa, xoá thuộc 3d
và 9e. Ngăn lọc filter-sidebar-5 (`evidence/reui-filter-sidebar-5.png`) là lối L2 của Hỏi-2.

### Ma trận trạng thái

Điền trước lượt chấm.

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| DataRegion | trong-kho | | | | |
| ListingCard | trong-kho | | | | |
