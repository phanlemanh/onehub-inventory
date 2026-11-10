# Gỡ bước hỏi khi gộp PR thường

## Vấn đề

Chủ kho đã giao quyền gộp cho máy ngày 10/11/2026 và quyết định chỉ xuất hiện ở các cổng. Cấu hình quyền của kho vẫn có luật buộc mọi lệnh gộp phải hỏi người. Luật "hỏi" ở kho thắng luật "cho phép" ở cấp máy, nên mỗi lần gộp đều hiện hộp xin phép.

## Hướng làm

Thay luật hỏi cho mọi lệnh gộp bằng bốn luật hỏi cho đúng bốn kiểu gộp trái nếp của kho. Bảng dưới kê đủ các cờ chọn kiểu gộp trong `gh pr merge --help`:

| Kiểu gộp                                                 | Trước | Sau                       |
| -------------------------------------------------------- | ----- | ------------------------- |
| Gộp thường, tạo merge commit (`--merge`, `-m`, không cờ) | Hỏi   | Không hỏi                 |
| Gộp tự động khi đủ điều kiện (`--auto`)                  | Hỏi   | Hỏi                       |
| Gộp vượt luật bảo vệ (`--admin`)                         | Hỏi   | Hỏi                       |
| Gộp ép một commit (`--squash`)                           | Hỏi   | Hỏi                       |
| Gộp đè lịch commit (`--rebase`)                          | Hỏi   | Hỏi                       |
| Viết tắt `-s`, `-r`                                      | Hỏi   | Không khớp mẫu, xem Hỏi-1 |

Giữ nguyên luật hỏi khi duyệt PR và khi tạo bản phát hành, cùng toàn bộ danh sách cấm và danh sách cho phép.

Một bộ kiểm mới đọc đúng tệp cấu hình quyền của kho và giữ các điều trên. Bộ kiểm chạy theo cả hai chiều: tệp thật phải xanh, bản sao bị phá phải đỏ và gọi tên điều bị phá.

## Vì sao giữ lại bốn kiểu

Luật hỏi cũ vô tình che cả bốn kiểu này. Gỡ thẳng thì máy gộp được cả bốn mà không ai thấy, trong khi nếp của kho là luôn tạo merge commit và không gộp tự động. Gộp thường không khớp bốn luật này, nên chủ kho không bị gọi thêm lần nào.

## Giới hạn

- Luật quyền so theo mẫu chữ, không phải rào bảo mật. Dạng viết tắt `-s`, `-r` không khớp mẫu. Chốt chặn thật của nhánh chính vẫn là luật bảo vệ trên GitHub.
- Phép cho phép gộp đang nằm ở cấu hình cấp máy của chủ kho. Máy khác chưa có phép đó thì lệnh gộp vẫn xin phép theo mặc định.
- Bộ kiểm chỉ đọc nội dung tệp. Hộp xin phép có thật sự hết hay không chỉ thấy ở lần gộp thật đầu tiên sau khi vòng này vào `main`.

## Đặc tả UX

Vòng này không chạm giao diện, xem dòng bỏ trong sổ quyết định.
