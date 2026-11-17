# Chứng minh màn — nhap-excel

Hàng 11 có hai màn trong `screens:`: màn mới `nhap-tep` (họ mới «Luồng nhiều bước», Hỏi-10) và `inventory` (Bảng hàng, họ
Lưới, màn mẫu của họ — hàng này chỉ thêm nút «Nạp tệp» và căn chờ khớp). Mục `inventory` viết đủ khi hợp đồng `implemented`.

## Màn nhap-tep

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/nhap-excel.md | solution-crm-6 (năm bước: tải · ghép cột · xem trước · trùng · tóm tắt), khuôn KhungNhap | khung năm bước ngang, đọc tệp trên trình duyệt, con số từ máy chủ, hoàn tác cả lần nhập | bước «trùng» riêng (gộp vào dấu của ô căn), «tin bổ sung cho căn người khác», AI | bảng năm chỗ ghép của đề xuất 7d thay bước «trùng» bằng bước «giá trị và căn»; AI hoãn (H5) |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| rỗng | họ mới | ba họ của kho (Lưới, Danh sách khung, Đăng nhập) không nhận một luồng nhiều bước; máy khuyên họ mới «Luồng nhiều bước» (`luong-nhieu-buoc`) với màn này là màn mẫu — chủ kho chốt ở Cổng Phạm vi (Hỏi-10) |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | solution-crm-6 | evidence/reui-solution-crm-6.png | |
| màn | onboarding-2 | evidence/reui-onboarding-2.png | |
| màn | wizard-1 | evidence/reui-wizard-1.png | |

### Hướng

| Hướng | Ảnh | Động cơ | Đánh đổi | Chọn |
| --- | --- | --- | --- | --- |
| A — năm bước ngang (solution-crm-6) | evidence/nhap-tep-huong-1.png | lưới xem trước và bảng ghép cột có trọn bề ngang; đúng khối Quỹ hàng đã chạy | thanh bước chiếm một dải ngang; tên bước dài phải ngắn | x |
| B — bước dọc ở cột trái (onboarding-2) | evidence/nhap-tep-huong-2.png | thấy cả năm bước và số câu còn lại mọi lúc | mất khoảng 240 px bề ngang cho lưới xem trước 7–15 cột | |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| Frame | trong-kho | | | | |
| Badge | trong-kho | | | | |
| DataRegion (lưới xem trước) | trong-kho | | | | |
| Khung năm bước (thanh bước + thân + chân bước) | reui | `node tools/reui_catalog/tra.mjs import wizard csv --loai block` | solution-crm-6 | — (được chọn theo Hỏi-3) | chọn khối |
