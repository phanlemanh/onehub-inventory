# Chứng minh màn — lop-rieng-cua-san

Hàng 7e đổi Bảng hàng (nhãn riêng thay nhãn chuẩn ở tiêu đề cột, trường riêng sau tám cột chuẩn) và thêm màn «Tuỳ chỉnh
của sàn» (bảng xem lại tối giản của lớp riêng). Bản mẫu: `/proto/lop-rieng-cua-san`, ảnh ở `design-pass/`. Các mục đòi từ
`implemented` (Ma trận trạng thái, Ảnh cạnh màn mẫu, Mặt so, Khối, Vùng) điền khi dựng.

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/bang-hang.md | cột `custom:<mã>` dựng từ định nghĩa trường riêng, tiêu đề đọc từ vốn từ của sàn (`truong-rieng.ts`, `doc-tu-vung.ts`) | cột trường riêng sau cột chuẩn, kiểu cột theo kiểu trường, nhãn riêng thay nhãn chuẩn | đọc qua `/company/labels` riêng | kho này đọc qua cửa `withCompany` ở máy chủ, cùng lượt đọc của trang |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Bảng hàng là màn mẫu của họ Lưới; hàng này thêm cột, không đổi khuôn |

## Màn tuy-chinh-san

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/cai-dat-san.md | màn Cài đặt sàn bố cục Đọc, khối `settings-3`, chỉ Quản trị sàn mở | ý «màn hiếm dùng, máy tính là chính» | khối `settings-3` dạng biểu mẫu cài đặt | bảng xem lại là danh sách năm phần, không phải biểu mẫu; màn Cài đặt đầy đủ là H4 |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | theo mẫu | Mỗi phần là một danh sách nhiều dòng với «…» cuối dòng; so cạnh Bảng hàng (Hỏi-3 lối A) |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | settings-4 | evidence/reui/settings-4.png | |
| màn | settings-11 | evidence/reui/settings-11.png | |
| màn | settings-9 | evidence/reui/settings-9.png | |
