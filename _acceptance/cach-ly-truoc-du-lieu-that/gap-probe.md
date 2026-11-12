---
slug: cach-ly-truoc-du-lieu-that
at: 2026-11-12T03:55:00Z
verdict: findings
p0: 2
p1: 1
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ về Ngoài-5 ghi máy tự quyết hoãn cách đóng tận gốc (vai đăng nhập), câu trích chỉ liên quan; bảng phủ không nói là đóng một phần | Cổng Phạm vi hiểu Ngoài-5 đã đóng hẳn; hàng đổi vai đăng nhập không vào lộ trình; hàng 10 nối dữ liệu thật khi ứng dụng vẫn nối bằng vai chủ | Dòng sổ mới trích đúng lựa chọn của chủ kho; bảng phủ ghi «đóng một phần»; hàng đổi vai đăng nhập có trong lộ trình trước hàng 10 | fixed: dòng sổ thay d-…-7 trích «Ngoài-5: mở hợp đồng mới» và giới hạn đúng phạm vi mục ấy; bảng phủ ghi «đóng một phần»; gửi giám sát yêu cầu hàng mới C-3 (vai đăng nhập không phải chủ, trước hàng 10) — chủ kho quyết ở Cổng Đáng của hàng ấy |
| P0 | design | Danh sách 10 hàm đặc quyền ghi máy quyết, không trỏ chữ chủ kho đã duyệt ngoại lệ, thiếu pham_luat SP-1 | Bộ kiểm đóng băng 10 lối vượt luật mà không ai biết phạm vi ngoại lệ đã duyệt ở đâu; hàm thứ 11 chỉ cần một dòng | Dòng sổ trích hai dòng đã duyệt; mỗi hàm trong ca ghi mã dòng sổ | fixed: dòng sổ thay d-…-6 trích moi-nguoi-gan-vai#d-20261111T084753Z-14 và dang-nhap-ma-email#d-20261111T052230Z-14, ghi rõ «giữ đúng ngoại lệ đã duyệt, không nới thêm» (không gắn pham_luat: lựa chọn không mở lối vượt luật mới); ca SQL ghi mã dòng sổ cạnh từng hàm |
| P1 | evals | AC-9 hứa bộ chạy bắt tệp phá hỏng, không eval nào đo; ca hai tệp không chứng từng tệp | Một tệp phá đỏ vì lý do khác hay không làm đỏ gì mà bộ chạy vẫn in ok | Ma trận ba chỗ hỏng chạy trên bản sao thư mục kiểm | fixed: E9 thêm ma trận (a) xoá tệp, (b) tệp không còn làm đỏ, (c) lỗi cú pháp; eval E9b chạy nó trong bài kiểm cơ sở dữ liệu kèm đối chứng dương |
| P2 | evals | Ca dạng xem không có đối chứng dương, không in số đã quét | Câu kiểm đọc sai tuỳ chọn security_invoker mà bản lành vẫn xanh | Dạng xem đối chứng security_invoker trong giao dịch, ca in số | fixed: E4 thêm đối chứng dương trong cùng ca và in «— N dạng xem» |
