---
slug: du-lieu-mau
at: 2026-11-10T23:20:00Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Hai loại liên kết không có mã, mã sàn hay chiều đỏ cho nhãn và sàn; số bản ghi mỗi loại không viết trước | Hàm kiểm bỏ qua liên kết mà E4, E8 vẫn xanh; liên kết chủ thiếu mã sàn chạm SP-1 khi nạp | Chốt hình dạng liên kết; bản phá cho từng loại liên kết; số bản ghi so hằng viết trước | fixed: liên kết có id và companyId trong design; AC-4 kê 6 loại kèm số viết trước; E4 sáu bản phá, E8 phá sàn ở liên hệ và hai loại liên kết |
| P1 | design | Không nói nhiều số nằm trong một chuỗi phones ra sao; E9 dò chuỗi con | Hai số ghép sai dấu thì E5 đỏ trên vật lành; kiểu riêng string[] qua mặt AC-9 | Ghi dấu phân cách; dữ liệu satisfies kiểu sinh; E9 ghim nguyên dòng; đếm đúng 53 số | fixed: dấu phân cách ", " và phoneList trong design; AC-5 đếm 53 số; E9 ghim nguyên dòng và satisfies readonly Contact[] |
| P2 | evals | E5 chỉ phá ở liên hệ, số toàn khổ không nói vị trí | Số thật toàn khổ trong chuỗi của căn lọt qua | Mở paths ra ba mô-đun; bản phá ghim vị trí và mã | fixed: E5 paths ba mô-đun; số toàn khổ đặt trong tên toà của một căn, báo kèm upi |
| P2 | evals | Tất định chỉ đo trong một múi giờ | Hàm giờ địa phương làm băm lệch giữa máy +7 và CI UTC | Dựng dưới TZ=UTC và Asia/Ho_Chi_Minh, cùng băm ghim | fixed: AC-1 và E1 dựng dưới hai múi giờ |
| P2 | design | Sổ ghi nhãn MAU là lối duy nhất trong khi lối chỉ dùng mã sàn mẫu còn sống | Cổng Phạm vi duyệt quy ước tiền tố vì tưởng chỉ một đường | Đổi nguồn căn cứ thành chỉ-người, kê lối khác | fixed: dòng sổ mới supersedes dòng nhãn cũ, thành Hỏi-3 |
