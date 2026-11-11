# Mẫu hành vi

Câu trả lời đóng cho các việc lặp lại, để không phải đoán mỗi lần dựng. Mỗi mục có nguồn trong `decisions.yaml`.

| Việc                  | Quy tắc                                                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Phản hồi theo độ trễ  | Dưới 1 giây không chỉ báo; 1–10 giây có chỉ báo; trên 10 giây có tiến độ và nút huỷ                                                      |
| Lưu                   | Đảo được thì làm ngay và cho hoàn tác; không đảo được hoặc ra ngoài sàn thì xác nhận                                                     |
| Gửi ra ngoài          | Người luôn là người bấm gửi                                                                                                              |
| Sửa dữ liệu           | Kiểu `money`, `count`, `text`, `select`, `boolean`, `date` sửa trên ô; còn lại mở hồ sơ cạnh bảng                                        |
| Canh cột              | `money`, `area`, `count` canh phải; còn lại canh trái                                                                                    |
| Bề rộng cột           | `max(độ dài nhãn, độ dài mẫu của kiểu) × 1ch + đệm hai bên`                                                                              |
| Mật độ bảng           | Tổng bề rộng tối thiểu vượt vùng nội dung thì dày (`h-10`, `text-sm`), không thì thường (`h-12`, `text-base`)                            |
| Mở hồ sơ cạnh bảng    | Có địa chỉ riêng; Esc đóng và trả tiêu điểm về dòng cũ; trên điện thoại mở toàn màn                                                      |
| Chia trang            | Chốt ở lát cắt Bảng hàng, ghi lại vào đây trước khi dựng                                                                                 |
| Tiêu điểm             | Hàng và cột dính không che ô đang chọn                                                                                                   |
| Đăng nhập             | Dán được mã, cho trình quản lý mật khẩu điền                                                                                             |
| Kênh thông báo        | Lỗi của một ô hay trường báo tại chỗ; kết quả thao tác báo bằng toast, đảo được thì có hoàn tác; sự cố của cả màn báo bằng băng trên màn |
| Giao diện             | Có sáng và tối, mặc định theo thiết bị, người dùng đổi được; cả hai phải đạt kiểm tương phản                                             |
| Điều hướng điện thoại | Thanh bên thu gọn; chưa có thanh dưới                                                                                                    |
| Ô không sửa được      | Không có quyền thì hiện như chữ thường; tạm khoá thì nói lý do                                                                           |
| Hành động nguy hiểm   | Câu xác nhận nói rõ việc sẽ xảy ra, nút mang đúng động từ đó                                                                             |

## Dựng ở đâu

Mỗi hành vi trên chỉ có một chỗ dựng; màn chỉ khai mình cần gì. Tệp màn (`src/app/**`, `src/modules/*/ui/**`) không nhập thẳng khung hồ sơ, hộp thoại, khung chờ, khối trạng thái, vòng xoay hay toast — `tests/behavior-guard.test.ts` đỏ nếu có.

| Việc                         | Thành phần dùng chung                             | Màn khai                                              |
| ---------------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| Mở hồ sơ cạnh bảng           | `DataRegion` với `record` (khung `RecordPanel`)   | cách dựng tên và nội dung của một dòng                |
| Phản hồi theo độ trễ khi tải | `DataRegion` với `status="loading"`               | `onCancel` khi huỷ được                               |
| Lỗi, một phần hỏng           | `DataRegion` với `status="error"` hay `"partial"` | `onRetry` khi tải lại được; không có thì không có nút |
| Nút làm việc của vùng        | `DataRegion` với `action={{ node, allowed }}`     | người xem có quyền làm việc ấy không                  |
| Sửa dữ liệu                  | `DataRegion` với `editable`, luật `editModeFor`   | vùng có sửa được không                                |
| Lưu và hoàn tác              | `useChange`                                       | động từ, việc sẽ xảy ra, đảo được, ra ngoài sàn       |
