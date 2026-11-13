---
slug: kiem-vai-theo-man
at: 2026-11-13T11:25:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

# Phản biện context sạch — kiem-vai-theo-man

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design (sổ quyết định d-20261113T111054Z-12) | Chỗ đặt luật vào màn ghi là máy quyết theo N11, nhưng câu N11 chỉ đòi sổ màn cho máy đọc, không quyết chỗ đặt; sau hàng này luật Thành viên có ba chỗ khai, AGENTS.md đòi mỗi luật một chỗ và quan hệ mới vào ontology qua người duyệt [danh-muc-can-nhu-onehub-invest#F1] | Chủ kho duyệt vì tin máy đã quyết; hàng 10 phải dời luật và bộ kiểm đổi nguồn kỳ vọng | Đổi thành câu hỏi cho chủ kho, nêu lối ontology và lối thanh bên | human-gate1: thành Hỏi-2 trên thẻ (dòng sổ mới supersedes d-…-12), design.md có mục Hỏi-2 ba lối, contract Notes nói AC nào đổi nếu chọn lối khác |
| P1 | evals (E5, E6) | E5 cố định 17 bước ở 1440, không rẽ theo Hỏi-1; E6 đặt bước được vào của lối A dưới AC-5 | Chủ kho chọn lối A mà bài chỉ đi 1440, E5 vẫn xanh | Ma trận viết trước theo từng lối; E6 chỉ cặp bị chặn | fixed: E5 kê 17 bước (B) hay 68 bước (A); E6 chỉ 12 bước bị chặn ở cả hai lối |
| P1 | evals (E7) | Đường ghi phản hồi mạng không có đối chứng dương | Lắng nghe gắn muộn, tập ghi rỗng, vế mạng xanh mà không đo | Cùng đường ghi phải bắt được người chứng ở cặp Quản trị sàn; tập rỗng ở cặp bị chặn thì đỏ ghim | fixed: E7 và AC-6 thêm hai vế ấy, thông điệp 'khong ghi duoc phan hoi' |
| P1 | evals (E2, E5) | Không bước nào buộc bài trình duyệt dùng chính hàm sinh cặp; E5 chỉ đo dòng chữ in ra | Bài chạy danh sách gõ tay, hàng 10 thêm màn mà không thêm cặp | So tập bước đã chạy từ báo cáo JSON với hàm sinh cặp; tệp bài phải nhập hàm sinh cặp | fixed: lệnh vai_man_e2e thêm bước đối chiếu báo cáo JSON (E5, AC-2); E3 đỏ khi tệp bài có id màn viết tay |
| P2 | evals (E8) | Thanh bên chỉ đo ở 1440, ngăn điều hướng khổ nhỏ không đo | Ngăn điều hướng ở 360 vẫn hiện Thành viên cho Đầu chủ mà mọi eval xanh | Thêm bước thanh bên ở 360 | fixed: E8 và AC-7 đo 4 vai × {1440, 360} = 8 bước viết trước |
