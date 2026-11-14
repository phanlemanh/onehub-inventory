# Chứng minh màn — thue-phi

Hàng 19 thêm phần «Thuế phí» vào màn «Tuỳ chỉnh của sàn» (hàng 7e), dựng bằng khối chung `FramedList` của họ danh sách
khung (hàng 9c), và thêm cột «Về tay» cùng cột ẩn sẵn «Điều kiện phí» vào Bảng hàng. Ảnh bản mẫu ở `cong/`, trang cổng
`cong-pham-vi.html`; ảnh của bản dựng vào `evidence/` trước lượt chấm.

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/cai-dat-san.md | cột «Về tay» tính từ Giá chào và thuế phí của sàn, cờ «Phí CN» / «BP» trên từng hàng | cột tiền tính sẵn đứng sau Giá chào, cờ bao phí của từng hàng thành Điều kiện phí | dấu định nghĩa lúc tính trên từng giá; nhập cờ từ Sheet | giá thật chưa vào cơ sở dữ liệu (hàng 10); nhập Sheet là hàng 11 |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Bảng hàng là màn mẫu của họ Lưới; hàng này thêm hai cột, không đổi khuôn |

### Ứng viên ReUI

Không chọn khối nào: hai cột mới dựng bằng cột có kiểu khai sẵn của lưới trong kho (khối `DataRegion`), như cột riêng của
hàng 7e.

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | data-grid-columns-5 | evidence/reui/data-grid-columns-5.png | |
| màn | data-grid-columns-4 | evidence/reui/data-grid-columns-4.png | |

## Màn tuy-chinh-san

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/cai-dat-san.md | mục «Thuế phí» của màn Cài đặt sàn: thuế TNCN, lệ phí trước bạ, phí môi giới, mỗi khoản bật hay tắt khỏi giá bao phí | ba khoản mặc định, công tắc bao phí, tỉ lệ môi giới sàn tự đặt | khối biểu mẫu `settings-3`, màn Cài đặt sàn riêng | chủ kho chọn Hỏi-2 A (phần của Tuỳ chỉnh của sàn) và Hỏi-7 B (khung danh sách, sàn thêm khoản riêng) ở Cổng Phạm vi |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | theo mẫu | Màn Tuỳ chỉnh của sàn giữ họ của hàng 7e; riêng phần Thuế phí ghép từ khối `FramedList` của họ danh sách khung (design/patterns/danh-sach-khung.md) như màn Thành viên |
