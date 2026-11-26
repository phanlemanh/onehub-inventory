---
slug: dat-khoa-mot-lenh
at: 2026-11-21T23:40:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Phản biện context sạch — dat-khoa-mot-lenh

Một tác tử mới đọc đúng năm tệp, không đọc mã, không chạy lệnh:
- ghi chú thiết kế;
- hợp đồng;
- kế hoạch đo;
- sổ quyết định;
- bài học từ các hồ sơ trước.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | design + sổ d-20261121T232621Z-3 | Căn cứ «khoá phải tới Vercel qua máy có khoá, tức CI» không giết lối «make dat-khoa đẩy thẳng sang Vercel». | Cổng Phạm vi ký trên một căn cứ sai; chủ kho không biết còn lối kia. | Thay dòng sổ bằng dòng supersedes gọi đúng lối kia và lý do thật. | fixed: dòng d-20261121T232926Z-12 thay d-3. Lối kia chết vì đổi APP_URL hay MAIL_FROM lại cần chủ kho chạy lệnh, và --xoay tách mật khẩu vai khỏi lượt đặt nó vào Postgres. Bảng căn cứ của thiết kế đã sửa theo |
| P0 | design + AC-9 + E9 | Quyền đứng cho máy «đặt người duyệt» ở cả production, trái sổ hàng 22 d-20261116T031557Z-13. | Máy được phép thay hay bỏ người duyệt bản thật mà không phạm câu chữ nào. | Khoá người duyệt production; E9 hỏi danh sách được làm có mâu thuẫn danh sách cấm không. | fixed: thiết kế ghi máy đặt người duyệt production đúng một lần, là chủ kho, không bao giờ đổi; điều cấm thứ hai thêm «đổi người duyệt của production». AC-9 và câu (4) của E9 hỏi mâu thuẫn. Dòng Hỏi-2 mới d-20261121T232926Z-13 thay d-8 |
| P1 | contract | Hỏi-1, Hỏi-2 không có trong hợp đồng; không AC đo câu trả lời. | Chủ kho ký mà không thấy hai câu hỏi; máy tự viết quyền đứng cho chính mình. Cùng dạng [roadmap-merge-driver#F1]. | Thêm hai câu vào hợp đồng; AC đo câu trả lời. | fixed: mục «Câu hỏi cho chủ kho» trong hợp đồng; AC-9 đòi quyền đứng khớp Hỏi-2. Hỏi-1 thành hai biến GitHub máy đặt sau khi gộp, không vào kho (luật hàng 22), nên không đo trong vòng này |
| P1 | evals E7 | Ma trận bước đỏ không viết trước; không ô bắt «vai chưa có» hay giá trị trong dòng lỗi; «không đổi tên miền» không có cách đo. | Lỗi chung chung đếm đủ chín ca; psql in mật khẩu chủ vào CI mà E7 vẫn xanh. | Ma trận ở đầu evals.yaml, ô psql in giá trị, 0 lần promote. | fixed: ma trận ô mới ở đầu evals.yaml, có ô vai chưa có và ô psql in hai giá trị ra stderr. Mọi ô trước gan-ten-mien đòi 0 lần «vercel promote» (bài sẵn có đã đo) |
| P1 | design | Cổng của DATABASE_URL (Session pooler 5432) là một lựa chọn không có căn cứ. | Lặng lẽ chuyển ứng dụng sang Session pooler; khi có tải, hết chỗ nối. | Đọc sổ hàng 22, ghi một dòng S1 có căn cứ. | fixed: sổ tay hàng 22 việc 4 đã chốt «máy chủ và cổng giữ nguyên» (5432). Dòng d-20261121T232926Z-14 trỏ câu ấy; đổi sang 6543 để một hàng sau |
