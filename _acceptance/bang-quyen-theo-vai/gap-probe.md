---
slug: bang-quyen-theo-vai
at: 2026-11-12T02:20:00Z
verdict: findings
p0: 2
p1: 2
p2: 1
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Hàm tra quyền dự kiến là security definer mới, đứng sau mọi luật theo dòng, mà sổ không gọi tên SP-1 [moi-nguoi-gan-vai#F1] | Lỗi trong hàm ấy mở dữ liệu sàn này cho sàn khác mà chưa ai cân giá | Dòng sổ gọi tên SP-1 hoặc bỏ hàm vượt luật mới | fixed: app.allowed chạy bằng quyền người gọi, lấy vai qua app.member_roles() đã duyệt ở hàng 9; E13 assert không thêm hàm security definer nào; sổ dòng 18 |
| P0 | evals | Không fixture người thuộc hai sàn với hai vai khác nhau | app.allowed gom vai theo người không lọc sàn, Quản trị ở B thành quản trị ở A mà mọi bài vẫn xanh | Người X Quản trị ở B, Đầu chủ ở A; phá thử bỏ lọc sàn | fixed: người X vào E3, E4, E10, E11; cặp pha-thu-allowed-moi-san; AC-3, AC-4 nói rõ vai ở sàn của phiên |
| P1 | evals | Tập miễn ở hai lớp chưa viết trước và chưa ghim ở cơ sở dữ liệu | Thêm một hàm ghi vào danh sách miễn kèm lý do bất kỳ thì bài quét vẫn xanh | Tập miễn viết trước cả hai lớp, assert bằng đúng tập, phá thử thêm mục miễn | fixed: tập miễn ở đầu evals.yaml và design; E5, E6 assert bằng đúng tập; cặp pha-thu-mien-them |
| P1 | design | Ai ghi thoả thuận kết nối là lựa chọn của người nhưng sổ ghi máy quyết với câu trích chỉ liên quan | Máy tự khoá quyền mở kết nối mà chủ kho chưa cân | Đổi thành câu hỏi | fixed: gộp vào Hỏi-1 (đọc và ghi thoả thuận), sổ dòng 16, 17 thay dòng 8, 11 |
| P2 | evals | E7 chỉ đọc ba hàm và chỉ kiểm chuỗi | Một hàm khác còn kiểm vai tự viết, luật nằm hai chỗ | Quét mọi hàm vai API gọi được, in số hàm, gọi thật | fixed: E7 quét mọi hàm của app và identity mà vai API gọi được, in số hàm, và gọi thật ba hàm với hai vai |
