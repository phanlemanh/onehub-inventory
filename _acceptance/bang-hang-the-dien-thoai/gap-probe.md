---
slug: bang-hang-the-dien-thoai
at: 2026-11-14T14:30:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---
## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ giữ Nhóm theo Toà dùng nguồn mục tiêu mà câu trích chỉ nói tới thẻ, không quyết việc nhóm | Chủ kho tưởng việc nhóm trên thẻ đã có căn cứ; AC-6 khoá lựa chọn mà không ai quyết | Dòng sổ mới thay dòng cũ, nguồn một lối với lối chết nêu được, hoặc thành câu hỏi | fixed: dòng sổ mới (supersedes d-20261114T125116Z-6), nguồn một lối — thẻ là thân của cùng vùng giữ nút Nhóm theo Toà; bỏ nhóm thì nút bật mà danh sách không đổi, đổi khổ mất nhóm |
| P1 | contract | Ngưỡng SỐNG của ô cơ hội không có mục Đường đo; vế «ứng viên ReUI kèm ảnh» không có chỗ đo | Phép đo ngưỡng bị coi là chưa đo dù mã đã xanh | Mục Đường đo nối từng vế với eval | fixed: thêm mục «Đường đo» vào hợp đồng; vế ứng viên ReUI đo ở trang cổng (A cạnh B, L1 cạnh L2 ở 360, ảnh khối gốc dưới từng lối) và lưới chứng minh màn |
| P1 | contract | Eval chỉ đo lối khuyến nghị của Hỏi-1, Hỏi-2; không nói AC hay eval nào đổi khi chọn lối kia | Chọn L2: E9 đỏ vì không có ô lọc trong hàng; chọn A: thẻ thiếu thông số mà E1 vẫn xanh | Bảng chọn lối → đổi; E1, E4, E9 viết theo lối | fixed: bảng «chọn lối X thì đổi gì» ở Notes của hợp đồng; E1 đo nơi và ba thông số theo lối, E4 đo «Lọc (n)» và ngăn đáy ở L2, E9 điểm bắt đầu Tab theo lối |
| P1 | evals | Cửa dữ liệu kiểm ?mau=bien và cửa đổi vai ?vai= không có eval nào đo production bỏ qua | Căn giả hiện trên Bảng hàng thật, hoặc người tự nâng vai | Dòng sổ cho cửa phát triển và eval ma trận ở production | fixed: dòng sổ cho ?mau=bien (khuôn inventoryStateFrom); E13 đo hàm thuần trả rỗng ở production, có ca phá. ?vai= là cửa có sẵn của hàng 4 (chỉ khi không phiên đăng nhập, ngoài production), hàng này không đổi — rejected cho vế ?vai= |
| P2 | evals | E10 không đọc trang thực thể nên không chấm được vế wiki của AC-10 | Trang thực thể không cập nhật mà E10 vẫn PASS | Thêm trang thực thể vào inputs và câu hỏi (5) | fixed: E10 thêm wiki/entities/listing.md và câu (5); AC-10 nêu đích danh trang |
