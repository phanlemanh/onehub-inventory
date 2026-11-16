---
slug: don-no-bo-kiem
at: 2026-11-15T09:52:45Z
verdict: findings
p0: 2
p1: 2
p2: 1
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | design | Dòng sổ «một lối» cho ca phá cho-tai bỏ sót lối khác; lối đã chọn (ẩn khung bằng bảng kiểu) làm mất ca phá riêng của thông điệp «khung cho khong hien», trái lời «không nới bài kiểm nào». | Sau khi gộp, có người làm hỏng nhánh bắt trang thiếu khung của phép cho-tai; không ca phá nào đỏ, màn thiếu khung chờ cứ xanh. | Giữ ca phá cho thông điệp cũ; E3 khẳng định sổ đăng ký ca phá không đổi. | fixed: đổi lối — ca phá sửa HTML máy chủ và chặn mã trình duyệt (không có bước gắn, không lệch), giữ nguyên tên, thông điệp và dòng đăng ký; dòng sổ mới thay dòng cũ, ghi ba lối đã loại; AC-3 và E3 khẳng định sổ đăng ký bằng main. Không cần hỏi chủ kho vì không còn mất ca phá nào. |
| P0 | contract | Căn cứ của dòng bỏ quét độ phủ chỉ trích một nợ; bảng Coverage không kê bên đọc nào. | Một chỗ khác trong kho tự tính cổng bằng công thức cũ, vẫn gọi 3659 trong khi cấu hình đã nhảy cổng; hàng khác đỏ oan, E1 E2 vẫn xanh. | Dò toàn kho ba thứ, thêm cột «Bên đọc»; E2 quét kho chỉ tệp hàm chung chứa phép tính khoảng cổng. | fixed: đã dò (design doc mục «Bên đọc đã dò»: công thức cổng chỉ ở hai cấu hình, thông điệp ca phá ở recipes, sổ đăng ký và một hồ sơ đã ký giữ lời, đường dẫn cũ chỉ ở wiki/log.md); bảng Coverage có cột Bên đọc; AC-2 và E2 thêm quét kho; dòng sổ mới thay dòng cũ với căn cứ một lối. |
| P1 | evals | E2 đọc chữ trong mã nguồn thay vì đo quan hệ «biến đè thắng hàm». | Biến được đọc mà không dùng làm cổng, hoặc máy dev và địa chỉ gốc lấy hai giá trị; E2 xanh, dãy đặt biến chạy sai cổng. | Nạp từng cấu hình có và không có biến, so cổng máy dev và địa chỉ gốc; ca phá hàm thắng biến. | fixed: AC-2 viết lại thành quan hệ; E2 bốn ca nạp cấu hình (ma trận viết trước ở đầu evals) và hai ca phá. |
| P1 | evals | E5 chỉ chạy bài phá ở một cấu hình; E4 chỉ khẳng định vắng chuỗi, không đối chứng dương; mẫu chữ phép gác chưa viết trước. | Cấu hình có cơ sở dữ liệu gắn sai bộ báo cáo hoặc máy dev không chuyển dòng ra; phép gác mù, E4 xanh hiển nhiên. | E4 thấy «gac-hydration: 0 canh bao»; E5 cả hai cấu hình, nhiều luồng; mẫu chữ viết trước. | fixed một phần: E4 đòi dòng «0 canh bao»; mẫu chữ viết trước ở đầu evals; E5 chạy bài phá cùng hai bài khác ba luồng và khẳng định tên bài; cấu hình có cơ sở dữ liệu đo bằng có mặt bộ báo cáo kèm ca phá bỏ nó. deferred: lượt bài phá thật ở cấu hình ấy cần Postgres của dãy — ghi ở Notes của contract. |
| P2 | evals | E8 hỏi dòng lỗi nguyên văn và quyền tối thiểu nhưng inputs không có nguồn để đối chiếu. | Bản đề xuất chép sai dòng lỗi hoặc kê dư quyền; người chấm thấy đủ sáu mục nên cho PASS. | Thêm design doc vào inputs, đổi câu hỏi thành đối chiếu. | fixed: E8 thêm design doc vào inputs; câu hỏi đối chiếu dòng lỗi và «chỉ đúng các quyền» với design doc mục «Nợ 3». |
