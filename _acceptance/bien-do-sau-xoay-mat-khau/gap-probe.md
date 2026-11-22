---
slug: bien-do-sau-xoay-mat-khau
at: 2026-11-22T04:11:58Z
verdict: findings
p0: 1
p1: 1
p2: 2
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | design | Thứ tự mới sinh trạng thái lẫn trên Vercel (Vercel giữ mật khẩu mới, cơ sở dữ liệu còn mật khẩu cũ) ngay cả khi bien đỏ giữa chừng, không riêng ca vai-dang-nhap đỏ; Hỏi-1 (d-3) chỉ nêu phần lợi, sổ không có dòng cho cái giá; câu trích của d-6 không quyết lời dặn «đừng bấm dựng lại». Cùng dạng với [bien-vercel-tu-choi#F1]. | Đang xoay khoá, bien đỏ vì Vercel từ chối AUTH_SECRET; sổ tay nói bản đang chạy yên; có người bấm Redeploy trên Vercel; bản mới dựng bằng mật khẩu chưa có trong cơ sở dữ liệu, bản thật mất kết nối; Cổng Phạm vi duyệt mà không ai gọi tên cái giá. | Dòng sổ nêu cái giá và Hỏi-1 nêu nó; AC-5 đòi lời dặn ở mọi hàng bien có ghi một phần; E5 hỏi điều đó. | fixed: d-20261122T041252Z-9 thay d-3, Hỏi-1 nêu cái giá cho chủ kho; d-10 thay d-6 với căn cứ một-lối; AC-5 đòi lời dặn «không bấm dựng lại trên Vercel trước khi lệnh chạy xanh» ở mọi hàng bien và hàng vai-dang-nhap; E5 câu (2); thiết kế mục «Cái giá». |
| P1 | design | Thiết kế tự mâu thuẫn ở ca vai-dang-nhap đỏ (một chỗ nói bản đang chạy yên, chỗ khác nói «đỏ từ vai-dang-nhap trở đi thì đã mất kết nối»); AC-5 và E5 không chốt ca ấy; E3 không ghim số lần gửi câu đặt mật khẩu. | Sổ tay viết theo thiết kế, xếp vai-dang-nhap đỏ vào vùng mất kết nối trong khi hàng vai-dang-nhap ngụ ý cơ sở dữ liệu còn mật khẩu cũ; E5 vẫn đạt; người vận hành chẩn đoán sai. | E3 ghim số «psql vai» khi vai-dang-nhap đỏ; AC-5 chốt ba vùng; E5 hỏi riêng ca vai-dang-nhap đỏ. | fixed: AC-5 chia ba vùng (tới bien · vai-dang-nhap đỏ — mật khẩu chưa đổi · sau khi vai-dang-nhap đạt); thiết kế sửa theo; AC-3 và E3 ghim đúng một POST trước đúng một «psql vai»; E5 câu (1) hỏi có câu nào xếp vai-dang-nhap đỏ vào vùng mất kết nối. |
| P2 | evals | E6 chỉ kiểm sự có mặt của chữ (một cặp bien/vai-dang-nhap ở README, hai chữ ở trang 0048) trong khi lời hứa là cả danh sách thứ tự; nội dung trang 0048 không eval nào đọc. | README đặt cach-ly trước vai-dang-nhap hay bỏ sót một bước, E6 vẫn đạt; trang 0048 chỉ một câu, AC-6 vẫn qua. | E6 so cả danh sách với STEPS, ca đỏ cho cặp khác; đưa trang 0048 vào inputs của E5. | fixed: E6 import STEPS, rút tên bước theo thứ tự ở ba chỗ và so cả danh sách; --tu-kiem chạy ba bản phá (chú thích thứ tự cũ, README hoán dung với cach-ly, thiếu 0048) với ba thông điệp ghim; trang 0048 vào inputs của E5, câu (5) hỏi thứ tự, vì sao, cái giá, khoảng hở còn lại. |
| P2 | evals | E5 không hỏi các hàng cach-ly, dung, kiem-nhanh có ngụ ý bản đang chạy yên mà không trừ ca vừa xoay khoá. | Đang xoay khoá, dung đỏ; người vận hành tra hàng dung, thấy câu kiểu «tên miền không đổi», tưởng bản thật yên; E5 vẫn đạt. | E5 thêm câu hỏi về các hàng ấy kèm câu trích làm bằng. | fixed: AC-5 đòi điều này; E5 câu (3) hỏi và đòi trích câu làm bằng. |
