---
slug: ung-dung-noi-bang-vai-khong-chu
at: 2026-11-13T00:40:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design, evals | Ca danh mục chỉ xét quyền cấp đích danh, bỏ sót quyền của mọi người và quyền mặc định của hàm | Một hàm chạy bằng quyền chủ còn để mọi người chạy; mã trong cửa trả vai rồi gọi hàm ấy, mọi ca vẫn xanh | Quyền hiệu lực của vai đăng nhập không gồm bảng nào, hàm chỉ gồm tập vai API chạy được; bản phá thứ bảy | fixed: AC-1 thêm điều quyền hiệu lực (⊆ tập của vai API, tập ấy do ca hàng 7a duyệt), AC-4 thêm bản phá quyen-ham-thang với dòng ghim riêng |
| P1 | design, evals | Vai dùng chung cả cụm; chưa nói migration và việc đặt mật khẩu xử ra sao khi chạy song song | Cơ sở nháp thứ hai áp 008 lỗi vai đã có, hoặc hai bài cùng đặt mật khẩu thì lỗi sửa đồng thời; lượt chấm đỏ giả | Migration chỉ tạo khi chưa có, không đụng mật khẩu; bộ trợ giúp thử nối trước, chỉ đặt khi cần, thử lại khi sửa đồng thời | fixed: design mục «Vai dùng chung cả cụm», Notes của hợp đồng; đo bằng lượt chấm (E1, E8, E8b chạy song song trên cùng dãy) |
| P1 | contract | AC-9 giữ dòng chuỗi nối cũ của tệp mẫu mà cửa từ chối vai chủ | Người cài mới chép tệp mẫu, ứng dụng nạp chuỗi nối vai chủ, mọi yêu cầu bị từ chối | Nạp tệp mẫu bằng bộ nạp của ứng dụng thì chuỗi nối dùng vai đăng nhập | rejected: dòng `DATABASE_URL` cũ của `.env.example` là dòng ghi chú (mở đầu `#`), ứng dụng không nạp tệp mẫu; dòng mới cũng là ghi chú, nên không có chuỗi nối nào có hiệu lực từ tệp mẫu |
| P1 | contract | Chưa nói thứ tự: việc ngoài kho phải xong trước khi triển khai | Bản gộp rồi triển khai, bản thật từ chối mọi yêu cầu | Điều kiện chặn trước triển khai, hoặc ghi rõ chưa có bản thật | fixed: Notes ghi chưa có bản thật (quyết định 0010) và thứ tự ở hàng 10: đặt mật khẩu, đổi chuỗi nối trước lần triển khai đầu; nêu ở mục Ra khỏi kho của PR |
| P2 | evals | Chiều đỏ của bài cửa đo bằng tham số thử, thành lối vượt bước kiểm | Mã sau này gọi cửa kèm tham số ấy và nối bằng vai chủ mà không bị chặn | Chiều đỏ bằng cửa giả trong tệp bài; chữ ký công khai không có tham số tắt bước kiểm | fixed: E6b đổi chiều đỏ sang cửa giả trong tệp bài, thêm điều chữ ký công khai không có tham số tắt kiểm |
