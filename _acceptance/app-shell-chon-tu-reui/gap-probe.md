---
slug: app-shell-chon-tu-reui
at: 2026-11-11T11:58:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Máy tự bỏ bảy phần của khối trong khi chủ kho giữ quyền quyết phần còn lại trên bản bấm được; câu trích của dòng bỏ không quyết việc bỏ | Chủ kho duyệt năm câu hỏi mà không thấy bảy phần đã bị cắt sẵn | Bày phần bỏ trên bản bấm được kèm ảnh khối gốc, hoặc trích câu thật sự quyết | fixed: dòng sổ mới trích câu «vùng nào phục vụ việc… không thì bỏ» của 0023; trang ảnh có mục «Khối gốc và phần máy đã bỏ» cạnh ảnh app-shell-8 gốc để chủ kho gạch phần muốn giữ; human-gate1 |
| P1 | contract | Số đếm cạnh lối tắt là dữ liệu từng sàn, AC-3 không nói có số hay bấm ra gì | Bản thật đếm sai hay lẫn sàn mà bài kiểm vẫn xanh | Chốt có số hay không, đo bấm lối tắt | fixed: AC-3 ghi chưa có số, bấm mở Bảng hàng; số và lọc thuộc hàng 2; E3 đo không mục nào mang số và URL sau khi bấm |
| P1 | evals | Đổi sàn ở thanh trên chỉ kiểm có danh sách, không kiểm phiên đổi | Tên đổi mà phiên vẫn ở sàn cũ | Đo phiên và dữ liệu sau khi đổi, gắn cờ hai lớp | fixed: AC-4 gắn (cross-layer); thêm E11 trên Postgres của dãy, ca đối chứng ghim thông điệp |
| P1 | design | Phần đếm lấy 8 bỏ 7 không theo từng phương án; E8 không hỏi | Câu 4 chọn khác thì quá nửa bị bỏ mà vẫn gọi là khối làm điểm xuất phát | Đếm theo từng phương án, E8 hỏi số | fixed: design.md đếm theo từng phương án và nói rõ khi nào thành «ghép từ thành phần»; câu hỏi E8 thêm phần đếm; dòng nhập kho nằm trong design.md tới khi 1n gộp |
| P2 | contract | Ô cơ hội có ngưỡng mà ghi chú nói không có, không có Đường đo | Ngưỡng của ô bị bỏ mà không ai biết | Thêm Đường đo hoặc dòng bỏ có tên | fixed: thêm mục Đường đo trỏ AC-2, AC-7, AC-8; ngưỡng «hai đến ba App Shell» bỏ bằng dòng sổ descope vì chủ kho đã chốt app-shell-8 |
