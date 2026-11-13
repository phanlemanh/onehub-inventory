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

## Lần hai — phần gộp bảng nút (2026-11-13)

verdict lần hai: findings · p0 0 · p1 5 · p2 0

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design, AC-11, E14 | Không rõ dấu của khung App Shell so với ô nào | Nút cách xem đã lưu ở cột thứ hai làm Hôm nay đỏ oan, hoặc gộp hết ô thì nút lạc màn vẫn xanh | Luật vùng khung so với mục khung; bản phá nút lạc màn | fixed: AC-11 tách vùng khung và vùng màn; E15 thêm bản phá «nút lưu cách xem trong thân màn Thành viên» |
| P1 | design (đọc theo mô-đun), sổ quyết định | Máy tự chọn gán cả mô-đun cho màn, bảng chủ kho duyệt có thể sai | Hôm nay bị ghi có nút thêm căn | Không gán cả mô-đun; E13 khẳng định Hôm nay không có thao tác căn | fixed: đổi sang đọc đúng tệp được nhập (dòng sổ mới, một lối); E12 khẳng định Hôm nay không có thao tác căn và có đối chứng tệp không ai nhập |
| P1 | E16, nút theo quyền | Lời hứa «không đổi hình» chỉ đo bằng bài không trình duyệt; lớp bọc làm hỏng bộ chọn con trực tiếp | Nhóm nút mất khoảng cách, góc bo mà mọi bài xanh | Đo bố cục, hoặc bỏ lớp bọc | fixed: bỏ lớp bọc — dấu là thuộc tính trên chính nút; E16 so cây DOM có và không qua nút theo quyền chỉ khác đúng một thuộc tính; bài quét buộc một phần tử con |
| P1 | E14, AC-11 | Không có bảng viết sẵn từng cặp; vế «vắng với vai không có ô» không có cặp nào đi qua | Dấu không gắn ở Bảng hàng, mọi bước xanh vì tập rỗng | Bảng 17 dòng viết sẵn; cặp Bảng hàng × Quản trị sàn; bản phá | fixed: E14 bảng 17 dòng, inventory × CompanyAdmin rỗng có ghi; E15 bản phá «cho Quản trị sàn quyền lưu cách xem mà không sinh lại bảng» |
| P1 | E12, AC-9 | Bản phá «mã có thao tác chưa khai» chỉ ở thư mục trang | Thao tác mới trong giao diện mô-đun lọt qua | Hai bản phá ở giao diện mô-đun và thành phần trung gian | fixed: E12 ba bản phá (trang, giao diện mô-đun, thành phần trung gian) và đối chứng tệp không ai nhập |
