# Chứng minh màn — sua-tren-o

Lối «màn mẫu mới» (họ Lưới, `design/patterns/luoi.md` ghi `Màn: inventory`, chính màn này). Hàng 4 mở sửa Giá chào và
Trạng thái trên ô của Bảng hàng; không thêm màn. Ma trận trạng thái, bảng Khối và Vùng điền trước lượt chấm (từ
`implemented`).

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/sua-tren-o-va-dan-excel.md | @reui/data-grid sửa tại ô; trình sửa giá «Hiểu là», hỏi lại khi lệch quá 20%, trạng thái chỉ nấc hợp lệ | gõ là thay, F2, Esc huỷ, Tab sang ô kế; đọc giá theo cách nói của nghề; ngưỡng 20%; Đã bán hỏi giá chốt và ngày; Ngừng hẳn hỏi lý do; hoàn tác trên thông báo | cột Phí và điều kiện phí; Enter để sửa (Enter vẫn mở hồ sơ, luật 2a, 3); Ctrl/Cmd+Z; báo hai người cùng sửa | thực thể chưa có trường phí; Enter đã là lối mở hồ sơ; hoàn tác bằng phím và xung đột thật cần đường ghi của hàng 10 |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Sửa trên ô diễn ra trong Bảng hàng, màn mẫu của họ Lưới (mặt so «Ghi và báo đã lưu», «Phím tắt», «Quyền theo vai») |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | data-grid-editing-6 | evidence/reui/data-grid-editing-6.png | x |
| màn | data-grid-columns-3 | evidence/reui/data-grid-columns-3.png | |
| màn | data-grid-virtualization-1 | evidence/reui/data-grid-virtualization-1.png | |
| data-grid-editing-2 | data-grid-editing-2 | evidence/reui/data-grid-editing-2.png | x |
| data-grid-editing-2 | data-grid-editing-5 | evidence/reui/data-grid-editing-5.png | |
| data-grid-editing-2 | data-grid-editing-6 | evidence/reui/data-grid-editing-6.png | |

Khung sửa trên ô (Hỏi-4, chủ kho chọn 2026-11-13): ô nhập nằm trong ô theo data-grid-editing-2, thêm một dòng ngay dưới
ô cho «Hiểu là…», lời báo chưa hiểu và câu hỏi lại; Đã bán, Ngừng hẳn hỏi trong hộp giữa màn. Ảnh hai ứng viên chụp trên
Bảng hàng thật (tình huống gõ sai, khổ 1440); trang so sánh đủ: `chon-khung-sua.html`.
