---
slug: upgrade-design-assembly-0-33-0
at: 2026-11-22T13:26:00Z
verdict: findings
p0: 1
p1: 2
p2: 2
---

# Phản biện context sạch

Người phản biện đọc bản hợp đồng lúc đích còn là 0.33.0/0.33.1; hồ sơ đổi đích thành 0.36.1 trong lúc phản biện chạy
(tin của phiên design-assembly). Phần định đoạt dưới đây xét trên bản đã đổi đích.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | contract | Căn cứ dòng bỏ coverage-scan (d-3) sai: AC-6 và AC-4 không bắt bên đọc ngoài 28 tệp; lợi ích «thôi ghi đè cách nối SSH» không AC nào đo, không hàng Coverage nào | Lỗi ghi đè SSH còn mà AC-5 vẫn xanh vì bản sao lấy qua đường dẫn cục bộ; chủ kho tưởng Ngoài-3, Ngoài-10 đã chứng là đóng | Thay d-3 bằng căn cứ đúng; đo hoặc ghi ngoài phạm vi điều SSH | fixed: d-14 thay d-3 với bốn bên đọc kho thấy (AC-1, AC-2, AC-4, AC-5); design và Coverage ghi lợi ích SSH là của plugin, ngoài phạm vi, không chứng ở đây |
| P1 | evals | Expected của E5 ghim cứng 0.33.0 trong khi hồ sơ hứa nhận bản chạy lại | Bản chạy lại in số bản khác, E5 đỏ, phải sửa evals sau khi ký | Chỗ trống bản đọc từ dấu | fixed: đích cố định là 0.36.1; E4, E5 ghim 0.36.1, ca phá dấu dùng 0.33.0 |
| P1 | contract | Hàng Coverage nói job CodeQL chứng cảnh báo, trong khi job đang đỏ; chưa có lối «chặn gộp tới bản sửa» | Hồ sơ đạt ở Cổng Bằng chứng khi CodeQL còn đỏ, cảnh báo cao vào main không ai ký | Sửa hàng Coverage; dòng sổ về gộp khi cảnh báo còn mở | fixed: hàng Coverage ghi job đang đỏ, chưa có phép đo; Notes ghi Cổng Bằng chứng chỉ trình khi CodeQL xanh trên commit 0.36.1, không gộp khi cảnh báo còn mở (lối thận trọng, không cần hỏi) |
| P2 | contract | AC-6 cho đổi PRODUCT-MAP.md, LO-TRINH.html mà design không nói vì sao | Nhánh sửa sai một hàng lộ trình mà E10 vẫn xanh | Kê lý do hoặc bỏ | fixed: AC-6 cho hai tệp đổi chỉ ở dòng của hồ sơ này và số đếm việc theo nấc (bộ kiểm vẽ lại chúng mỗi lần ký cổng); E11 thêm ca đỏ khi bản đồ đổi dòng của việc khác. Lần sửa đầu (bỏ hai tệp) sai, xem dòng sổ d-18 |
| P2 | evals | Không nói phép đo suy gốc kho từ vị trí tệp; chấm từ bản chép ngoài kho có thể đo nhầm cây | Phép đo ghim cứng gốc kho chính, xanh trên cây khác cây được ký | Gốc suy từ vị trí; dòng xanh in mã HEAD | fixed: design và Notes ghi gốc suy từ vị trí tệp đo, dòng xanh in mã HEAD; ca phá chạy từ đường dẫn khác: rejected — lib của hồ sơ trước đã suy gốc từ vị trí tệp, ca ấy thêm một bản chép kho mà không đo hành vi của công cụ |
