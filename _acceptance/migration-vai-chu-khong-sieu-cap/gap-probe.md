---
slug: migration-vai-chu-khong-sieu-cap
at: 2026-11-28T03:50:00Z
verdict: findings
p0: 1
p1: 2
p2: 1
claims_input: ok
---

# Phản biện context sạch

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | decisions | Dòng gộp Gate 1.5 ghi nguồn mục-tiêu, câu trích là lời mời của hồ sơ dua-deploy-yml-len-main, chỉ quyết cho vòng ấy (mẫu [nang-kit-3-1-1#F2]) | Chủ kho nói «duyệt» và nghĩ chỉ duyệt phạm vi, kế hoạch của vòng T3 trên db/** bị coi là đã duyệt | Dòng sổ mới supersedes dòng cũ, thành câu hỏi trên thẻ | human-gate1: dòng 7 thay dòng 6, thành Hỏi-1 (khuyên gộp) |
| P1 | contract | AC-3 chỉ so chủ và quyền của bảng, hàm, schema, quyền mặc định; không so thành viên và thuộc tính vai, chuỗi, view, kiểu | Vai chủ giữ thêm thành viên hay một vai migration tạo mang thuộc tính khác bản siêu vai, E3 vẫn xanh | So thêm vai và thành viên, kê đích danh chỗ lệch có chủ ý, thêm bản phá | fixed: AC-3 (b) so vai quy_hang_* và mọi thành viên với một cụm thứ hai chỉ siêu vai chạy; vai chủ giữ đúng mức khai (ADMIN trên vai nó tạo, SET + INHERIT trên vai danh tính); kiểu thêm vào phép so (view, chuỗi đã có); bản phá pha-them-thanh-vien đỏ «vai lệch bản siêu vai»; tự kiểm 5/5 trên 16 và 17 |
| P1 | evals | E5 không nói vai nào ghi dữ liệu mẫu; nếu siêu vai ghi thì không đi qua đường của vai chủ | Trên bản thử vai chủ không ghi được, bộ chỉ đọc đỏ lúc đưa bản lên mà E5 xanh | Ghim vai ghi mẫu là vai chủ | fixed: tệp đo ghi hai sàn mẫu bằng vai chủ giả Supabase; vai đăng nhập do vai chủ tạo qua migration 008; E5 và AC-5 ghi rõ |
| P2 | contract | Coverage chỉ đọc bản thử, không đọc bản thật | Bản thật ở trạng thái khác ba trạng thái đã đo, lần đưa lên dừng giữa chừng | Đọc chỉ đọc sổ migration và vai của bản thật | fixed: đọc 28/11 — Postgres 17.11, vai postgres cùng bốn thuộc tính, chưa có sổ migration, chưa có vai quy_hang_* (trạng thái «cơ sở mới», ca du-migration) |
