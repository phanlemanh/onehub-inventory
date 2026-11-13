---
slug: hoi-dau-chu-bao-sai
at: 2026-11-13T02:05:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---
## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ d-…-10 (khe footer của khung hồ sơ dùng chung) ghi một-lối trong khi việc chạm tệp còn chờ V-7 và lối «thanh trong thân» còn sống | V-7 bị bác thì AC-1, E1 (thanh ngoài vùng cuộn) đỏ dù không ai sai; khung dùng chung đổi mà không ai duyệt | Dòng mới supersedes trích lời mở tệp của giám sát, hoặc một câu chi-nguoi | fixed: giám sát duyệt V-7 có điều kiện; chỗ đặt thành Hỏi-5 (chi-nguoi, ảnh hai lối); dòng d-…-10 thay bằng dòng mới phụ thuộc Hỏi-5; AC-1 ghi rõ đổi trước khi dựng nếu chủ kho chọn đầu hồ sơ |
| P1 | contract | Hỏi-3 liệt «Khu», còn AC-6, AC-7, E6, E7 dùng «Dự án» | Cổng duyệt một danh sách, máy dựng danh sách khác | Hai phía khớp nhau | fixed: Hỏi-3 thay bằng dòng mới với «Dự án» theo bảng nhãn; design sửa cùng chữ |
| P1 | evals | E7 không ghi thứ tự share trước mọi await, thiếu ca đối chứng | Hộp dùng chung chờ trước share, máy thật từ chối, báo sai không bao giờ mở bảng chia sẻ | Bộ ghi thứ tự như E2, ca đối chứng chèn await | fixed: E7 đo share đồng bộ qua FormDialog thật, thêm ca 'report share called outside the click' |
| P1 | evals | Trạng thái lỗi chép không có ảnh; E3 chỉ đo chữ có mặt; toast lỗi có thể tự tắt | Người không kịp chép tay, tin mất | Ảnh lỗi ở 360 và 1440, toast lỗi ở lại | fixed: E9b thêm ảnh hai trạng thái lỗi; AC-3 và E3 đòi toast lỗi ở lại tới khi người đóng, kèm ca đối chứng |
| P2 | evals | AC-9 hứa bốn khổ nhưng E9 quét hai khổ | 414, 1024 không được quét | Ma trận 16 lượt | fixed: E9 ma trận 4 khổ × 2 màu × 2 bề mặt, in 'axe scans 16' |
