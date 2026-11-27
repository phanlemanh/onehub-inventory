# Chứng minh màn — tin-rao-giu-gia-tri-rieng

Lối «màn mẫu mới» (họ Lưới, `design/patterns/luoi.md` ghi `Màn: inventory`, chính màn này). Hàng 3h thêm giá trị riêng
cho năm thuộc tính căn, dấu khác danh mục và dòng khoá trong hồ sơ căn; không thêm màn. Ma trận trạng thái, bảng Khối,
nhóm ứng viên của khối dấu và mục Vùng điền trước lượt chấm (từ `implemented`).

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/bang-hang.md | danh mục chung mọi sàn khoá lại; năm thuộc tính căn chỉ đọc từ danh mục | danh mục chung không ai trong sàn sửa được | thuộc tính căn chỉ đọc từ danh mục | chủ kho chốt hướng 27/11: tin rao giữ giá trị riêng, danh mục chỉ điền chỗ trống |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Bảng hàng là màn mẫu của họ Lưới; hàng 3h thêm hai ô sửa được theo khung sửa trên ô của kho và một dấu nhỏ trong ô |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | data-grid-editing-6 | evidence/reui/data-grid-editing-6.png | x |
| màn | data-grid-columns-3 | evidence/reui/data-grid-columns-3.png | |
| màn | data-grid-virtualization-1 | evidence/reui/data-grid-virtualization-1.png | |

Không chọn lại khối của màn: ba ứng viên và lựa chọn là của hàng 4 (ảnh chép từ `_acceptance/sua-tren-o/evidence/reui/`).
Dấu khác danh mục: chủ kho chọn «chấm» ở Cổng Phạm vi 27/11 (Hỏi-6) trên ba ứng viên có ảnh ở `ung-vien/` (c-badge-16,
c-badge-22, c-tooltip-3); nhóm ứng viên của khối ấy ghi ở đây khi hợp đồng lên `implemented`.
