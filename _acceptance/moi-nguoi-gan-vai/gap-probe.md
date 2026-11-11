---
slug: moi-nguoi-gan-vai
at: 2026-11-11T08:55:00Z
verdict: findings
p0: 3
p1: 2
p2: 0
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | ledger | Dòng bốn hàm hẹp của vai danh tính ghi máy quyết, không gọi tên SP-1, trong khi thiết kế nói đó là mở rộng ngoại lệ danh tính | Chủ kho duyệt mà không thấy dòng nào nói luật khó đảo bị nới | Dòng mới nguồn chỉ-người, pham_luat SP-1, khó đảo, có lối khác | human-gate1: dòng thay d-20261111T084129Z-5 thành Hỏi có pham_luat SP-1, kho_dao true |
| P0 | ledger | Tên riêng theo sàn và phản hồi đồng nhất ghi máy quyết bằng câu trích chỉ là tiêu đề SP-1 | Cổng coi cột tên theo sàn là bắt buộc, không ai cân giá | Dòng mới nguồn chỉ-người, nêu lối tên chung | human-gate1: dòng thay d-20261111T084129Z-6 thành Hỏi |
| P0 | ledger | Lý do bỏ design-pass sai (design-pass chạy trên bản đang chạy) và trỏ nhầm E9; E14 thiếu ảnh để chấm | Cổng Bằng chứng không có ảnh bảng và hộp Mời | Sửa lý do, trỏ đúng E13 và E14, ghim tên ảnh | fixed: dòng thay d-20261111T084129Z-12 với lý do đúng (màn cần phiên thật, ba câu hỏi đổi chính màn); E13 thêm tám ảnh ghim tên cho E14. Phần «§6 chốt khuôn IA trong khi câu hỏi khuôn còn chờ» rejected: §6 là khuôn bố cục danh-sách-chi-tiết, câu hỏi chờ là nhóm của bản đồ khuôn để chấm — hai chuyện khác nhau |
| P1 | evals | E4 so hai email khác nhau nên không đo được quan hệ, thiếu đối chứng dương, không so thư | Phản hồi lộ tài khoản đã có mà E4 vẫn xanh | Cùng email trên hai cơ sở nháp, so phản hồi và thư; bản phá có câu ghim | fixed: E4 viết lại theo thước đo, thêm bản phá pha-thu-lo-tai-khoan |
| P1 | evals | Hàm hẹp không có ma trận toàn phần, thiếu bản phá cho member_list và member_roles | Một đường gọi khác quên kiểm quản trị thì lộ email người trong sàn mà mọi eval vẫn xanh | Ma trận 4 hàm × 5 người gọi × 2 đích viết trước, hai bản phá | fixed: ma trận 40 ô ở đầu evals.yaml, ca gọi thẳng hàm dưới vai API, thêm pha-thu-danh-sach-khong-kiem-quan-tri và pha-thu-vai-moi-san |

Hai lỗ ghi chú ngoài trần năm finding: hai quản trị bỏ vai nhau đồng thời — fixed: E6 thêm ca hai giao dịch đồng
thời; lối vận hành mở sàn và quản trị đầu tiên còn chạy sau khi cột vai, tên thành bắt buộc — deferred: ngoài phạm vi,
ghi vào Notes của hợp đồng (lệnh vận hành phải điền vai và tên).
