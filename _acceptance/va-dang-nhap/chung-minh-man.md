# Chứng minh màn — va-dang-nhap

Hàng 1m không dựng màn mới: thêm một trạng thái vào màn đăng nhập và một câu báo cho nút Đăng xuất trên khung (trang
Hôm nay). Hai màn chưa có họ trong bản đồ khuôn nên máy chọn lối họ mới. Ảnh hướng được chọn là khung thật của bản đã
dựng; ảnh hướng còn lại là khung thật của phương án kia (màn đăng nhập: trạng thái «chưa thuộc sàn» có sẵn của hàng 8;
trang Hôm nay: câu báo nằm trong menu, dựng tạm để chụp rồi hoàn lại).

## Màn sign-in

### Hướng

| Hướng                                           | Ảnh                              | Động cơ                                                          | Đánh đổi                                                                          | Chọn |
| ----------------------------------------------- | -------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---- |
| Trạng thái hết sàn khi còn phiên, nút Đăng xuất | evidence/sign-in-huong-1.png     | Lối thoát kết thúc phiên thật, lần mở màn kế không kẹt lại       | Thêm một trạng thái và một câu vào màn đăng nhập                                  | x    |
| Dùng lại trạng thái chưa thuộc sàn của hàng 8   | evidence/sign-in-huong-2.png     | Không thêm câu mới, nút «Dùng email khác» có sẵn                 | Không xoá phiên: tải lại trang là người về đúng chỗ kẹt                           |      |

### Khối

| Khối   | Bậc       | Đã tra | Ứng viên gần nhất | Vì sao không dùng |
| ------ | --------- | ------ | ----------------- | ----------------- |
| Frame  | trong-kho |        |                   |                   |
| Button | trong-kho |        |                   |                   |

## Màn today

### Hướng

| Hướng                                         | Ảnh                        | Động cơ                                                                    | Đánh đổi                                                                   | Chọn |
| --------------------------------------------- | -------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---- |
| Toast qua kênh thông báo kết quả của khung    | evidence/today-huong-1.png | Đúng luật kênh thông báo: kết quả thao tác báo bằng toast; menu đóng như thường | Toast tự tắt sau vài giây; người phải bấm mở menu lại để thử                |  x   |
| Câu báo nằm trong menu tài khoản, menu giữ mở | evidence/today-huong-2.png | Câu báo đứng ngay cạnh nút Đăng xuất                                       | Màn tự dựng câu báo trong menu, trái luật kênh thông báo và bài rào hành vi |      |

### Khối

| Khối         | Bậc       | Đã tra | Ứng viên gần nhất | Vì sao không dùng |
| ------------ | --------- | ------ | ----------------- | ----------------- |
| Toaster      | trong-kho |        |                   |                   |
| DropdownMenu | trong-kho |        |                   |                   |
