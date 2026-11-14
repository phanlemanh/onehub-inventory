# Chứng minh màn — dang-nhap-chon-tu-reui

## Màn sign-in

### Từ Quỹ hàng

Trang sổ bối cảnh: `docs/tri-thuc/wiki/chu-de/dang-nhap.md`.

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| ----- | --------------------- | --- | -- | ------ |
| docs/tri-thuc/wiki/chu-de/dang-nhap.md | auth-15 chuyển thể (một cột hẹp giữa trang) | một cột hẹp giữa trang, logo trên, chân trang, lỗi dưới đúng ô | nút Google, Apple, GitHub; câu điều khoản | kho chỉ đăng nhập bằng mã email; kho chưa có trang điều khoản |

### Họ

| Họ đề xuất | Lối | Vì sao |
| ---------- | --- | ------ |
| rỗng | họ mới | màn đăng nhập đứng ngoài App Shell, chưa họ nào nhận; chủ kho quyết tạo họ «dang-nhap» ở Cổng Phạm vi |

### Hướng

| Hướng | Ảnh | Chọn |
| ----- | --- | ---- |
| A — cột hẹp giữa trang, không khung (auth-15) | evidence/pham-vi/a-auth-15-1440-sang.png | chọn |
| B — thanh trên + khung giữa (auth-19) | evidence/pham-vi/b-auth-19-1440-sang.png | |
| C — nửa màn là ảnh lớn (auth-13) | evidence/pham-vi/c-auth-13-1440-sang.png | |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | -------- | --- | ---- |
| màn | auth-15 | evidence/pham-vi/goc-auth-15-1440-sang.png | chọn |
| màn | auth-19 | evidence/pham-vi/goc-auth-19-1440-sang.png | |
| màn | auth-13 | evidence/pham-vi/goc-auth-13-1440-sang.png | |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| ---- | --- | ------ | ----------------- | ----------------- | ---- |
| auth-15 | reui | design/reui-catalog.json nhóm auth (20 khối) | auth-19 | | chọn khối |
| Field, InputGroup, Button | trong-kho | | | | |

### Vùng

| Khối | Vùng | Xử lý | Lý do |
| ---- | ---- | ----- | ----- |
| auth-15 | logo trên cùng | lấy | nhận diện sàn; dấu hình + chữ theo màu chủ đề |
| auth-15 | tiêu đề + câu dẫn | lấy | nói màn để làm gì |
| auth-15 | ô email + nút gửi | lấy | việc chính của màn, mang biểu mẫu thật của hàng 8 |
| auth-15 | nút Google, Apple, GitHub và dải phân cách | bỏ | kho chỉ đăng nhập bằng mã email |
| auth-15 | chân trang | lấy | chỉ giữ dòng ©; bỏ câu điều khoản và liên kết vì chưa có trang |
