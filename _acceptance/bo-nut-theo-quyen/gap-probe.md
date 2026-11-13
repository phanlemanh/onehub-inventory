---
slug: bo-nut-theo-quyen
at: 2026-11-12T11:35:00Z
verdict: findings
p0: 2
p1: 3
p2: 1
---

# Phản biện context sạch — bo-nut-theo-quyen

Tác tử tươi đọc đúng sáu tệp (design, contract, evals, decisions, bài học từ hồ sơ trước, ô cơ hội), không đọc mã.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Ô phạm vi của liên hệ (ai xem, sửa, gộp, xoá dữ liệu cá nhân) là quyết định chỉ người có nhưng sổ không có câu hỏi | Chủ kho duyệt chỗ đặt nút trong khi bộ nút từng vai lấy từ ô máy tự điền; E2, E9, E11 khoá các ô ấy | Câu hỏi chi-nguoi kèm ảnh bộ nút từng vai trên màn Liên hệ; AC-8 trỏ dòng sổ | human-gate1: thêm Hỏi-6 (dòng sổ chi-nguoi) và bốn ảnh lien-he-*.png; AC-8 trỏ Hỏi-1 và Hỏi-6 |
| P0 | design | Căn cứ «Quản trị sàn không có ô» trích câu về hàng, không quyết dòng xoá dữ liệu cá nhân của liên hệ | Sàn không có Trưởng nhóm thì không ai xoá được tên và số theo yêu cầu | Tách dòng: căn giữ muc-tieu, liên hệ thành câu hỏi | fixed: dòng mới thay dòng cũ (supersedes), chỉ còn các dòng của căn; phần liên hệ vào Hỏi-6 |
| P1 | evals | AC-7 vế «đổi ô thì theo ngay» không có ca đo trên thanh bên và màn | Mã so vai bằng cách khác, bảng hôm nay chỉ có Quản trị sàn nên E8 vẫn xanh | Ca trên bản sao bảng thêm TeamLead vào listMembers + phá thử | fixed: E8 thêm ca thanh-ben-theo-o và cặp pha-thu-nav-cung-o-moi; E3 bắt mọi kiểu so tên vai |
| P1 | evals | E3 đo theo cả tệp, lời hứa là theo từng nút | Một nút bọc đúng và một nút trần trong cùng tệp vẫn xanh | Phá thử nút trần cạnh nút bọc, thông điệp có dòng | fixed: E3 đo từng lệnh ghi gắn với nút bọc nó, thêm cặp pha-thu-nut-tran-canh-nut-boc |
| P1 | evals | E13 không tạo được 403, E12 không có luật để so | Người chấm không thấy câu riêng; ảnh sai chỗ vẫn qua | E13 lấy ảnh E7 chụp; E12 ghi kỳ vọng từng ô | fixed: E7 chụp bốn ảnh vào evidence/tu-choi-403, E13 thành hội đồng đọc bốn ảnh; câu hỏi E12 liệt kỳ vọng từng vai × màn; lớp ui-observed vẫn do E12 giữ |
| P2 | evals | Hằng 160 ô viết theo H2 | Chọn H1 thì 144 ô, E2 đỏ oan | Hằng theo lựa chọn Hỏi-1 | fixed: hằng ghi theo Hỏi-1, điền ngay sau cổng trước khi viết mã |
