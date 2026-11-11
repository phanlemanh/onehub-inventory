---
slug: bo-bai-kiem-tu-so-man
at: 2026-11-11T07:43:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ «màn Lưới chưa có vùng thì bỏ qua có tên» ghi một lối, nhưng lối danh sách cố định trong vùng của hàng vẫn sống | Một màn Lưới mới built mà quên dựng vùng chỉ hiện bài bỏ qua, cả lượt xanh | Danh sách cố định kèm lý do; màn ngoài danh sách chưa có vùng đỏ; màn trong danh sách đã có vùng đỏ «gỡ khỏi danh sách» | fixed: chọn lối danh sách (sổ dòng 12 thay dòng 5), AC-6 và E6 thêm ba ca |
| P0 | design | Dòng sổ «ca phá chỉ ở 1440» trích một câu không quyết lựa chọn ấy | Hàm kiểm tiêu đề bắt nhầm phần tử ở khổ điện thoại mà vẫn xanh, ca phá không chạy ở khổ ấy | Ca phá chạy ở bốn khổ, đếm theo ma trận viết trước | fixed: ca phá chạy ở bốn khổ (sổ dòng 13 thay dòng 8, trích câu bốn khổ của sổ trạng thái); E4 đếm 64 ca phá khung |
| P1 | evals | E9 chứng hãm CPU bằng một dòng tự in; vế «chờ màn sẵn sàng» không có eval | Hãm chỉ gắn trang đầu, bài chạy tốc độ thường mà dòng in vẫn có | Đo vòng tính cố định trong mỗi trang, tỉ lệ ≥ 2,5; bài cấu trúc chứng công thức không tự mở trang | fixed: AC-9 và E9 viết lại theo thước ấy |
| P1 | evals | Ma trận E1 đếm từ chính sổ qua cùng bộ lọc với bộ sinh, luôn đúng | Một màn built mang audience gõ sai bị cả hai cùng loại, rơi khỏi bộ không ai biết | Danh sách id viết trước, tập tên bài so đúng; mọi màn built có bộ hoặc dòng bỏ qua | fixed: E1 viết trước 4 màn × 4 bài × 4 khổ = 64 tên, thêm khẳng định phủ mọi màn built |
| P1 | evals | Ca chính của công thức tìm có thể chỉ khớp một dòng trên một trang | Ô tìm chỉ lọc trang đang xem, ca chính vẫn xanh | Điều kiện trước: ít nhất 2 dòng khớp trên ít nhất 2 trang; ca phá chỉ còn trang đầu | fixed: AC-8 và E8 thêm điều kiện trước và ca phá khoá sang trang |
