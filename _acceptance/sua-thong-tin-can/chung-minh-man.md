# Chứng minh màn — sua-thong-tin-can

Lối «màn mẫu mới» (họ Lưới, `design/patterns/luoi.md` ghi `Màn: inventory`, chính màn này). Hàng 3g thêm việc sửa vào hồ
sơ căn và ô cột riêng của Bảng hàng; không thêm màn. Ma trận trạng thái, bảng Khối điền trước lượt chấm (từ
`implemented`).

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/bang-hang.md | pháp lý, tài chính là chữ tự do; nội thất, tình trạng chọn giá trị cố định | chữ tự do cho pháp lý, tài chính (Hỏi-1 hàng 3b) | sửa cả bản ghi trong một trang riêng | hồ sơ căn đã là chỗ đọc bốn trường; sửa tại mục theo bảng chỗ đặt nút của kho |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Bảng hàng là màn mẫu của họ Lưới; hàng 3g thêm hộp sửa của kho vào hồ sơ và bộ sửa ô theo kiểu, cùng khung sửa trên ô của hàng 4 |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | data-grid-editing-6 | evidence/reui/data-grid-editing-6.png | x |
| màn | data-grid-columns-3 | evidence/reui/data-grid-columns-3.png | |
| màn | data-grid-virtualization-1 | evidence/reui/data-grid-virtualization-1.png | |

Không chọn lại: ba ứng viên và lựa chọn là của hàng 4 (ảnh chép từ `_acceptance/sua-tren-o/evidence/reui/`); hàng 3g
không đổi khối nào của màn, chỉ dùng `FormDialog` của kho trong hồ sơ.
