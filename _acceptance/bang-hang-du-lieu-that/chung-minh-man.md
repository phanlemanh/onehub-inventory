# Chứng minh màn — bang-hang-du-lieu-that

Lối «màn mẫu mới» (họ Lưới, `design/patterns/luoi.md` ghi `Màn: inventory`, chính màn này). Hàng 10 thay nguồn dữ liệu của
Bảng hàng từ bộ mẫu trong bộ nhớ sang bảng căn chào của sàn; không thêm màn, không thêm khối giao diện. Ma trận trạng
thái, bảng Khối và Vùng điền trước lượt chấm (từ `implemented`).

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/bang-hang.md | @reui/data-grid đọc toàn sàn, cuộn ảo, bài thử 5.000 dòng (ADR-0004) | đọc một lần toàn sàn, cuộn liền, đo 5.000 căn; bảng quyền 05/11 làm khởi điểm | bảng thẻ điện thoại gắn ẩn trên máy tính (lỗi sập React #185) | màn này đã có thẻ điện thoại của 2b chỉ dựng ở khổ nhỏ; giữ phép đo 5.000 căn để không lặp lỗi |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Bảng hàng là màn mẫu của họ Lưới; hàng 10 chỉ đổi nguồn dữ liệu và nối năm trạng thái của vùng với kết quả đọc thật |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | data-grid-editing-6 | evidence/reui/data-grid-editing-6.png | x |
| màn | data-grid-columns-3 | evidence/reui/data-grid-columns-3.png | |
| màn | data-grid-virtualization-1 | evidence/reui/data-grid-virtualization-1.png | |

Không chọn lại: ba ứng viên và lựa chọn là của hàng 4 (ảnh chép từ `_acceptance/sua-tren-o/evidence/reui/`); hàng 10
không đổi khối nào của màn.
