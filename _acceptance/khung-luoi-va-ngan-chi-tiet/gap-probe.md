---
slug: khung-luoi-va-ngan-chi-tiet
at: 2026-11-27T08:16:17Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

# Phản biện context sạch — khung-luoi-va-ngan-chi-tiet

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | -------- | -------- | ------------- | -------- | ----- |
| P1 | design | Ngăn ghim giữ chữ được ghi máy quyết dù lời duyệt có hai cách hiểu (ngăn nổi / ngăn mở); lời khuyên cột Căn trái Out of scope | Chủ kho ký mà không biết máy hiểu hẹp lời ông; cột Căn được khuyên dựng mà không AC nào đo | Đổi thành câu hỏi có khuyến nghị; khuyên cho khớp phạm vi | fixed: d-…-22 và d-…-23 thay d-20, d-19 thành câu hỏi; cột Căn khuyên dựng ở lát 2 |
| P1 | evals | Panel E19 không có văn bản gốc của chuẩn nút, luật «…», câu (a)–(f) | Sổ hành vi chép sai luật mà panel vẫn chấm qua | Đưa nguyên văn vào inputs | fixed: chép nguyên văn vào mục Nguồn của design.md, thêm decisions.jsonl vào inputs E19 |
| P1 | contract | Đã gửi gần như không được đo (chỉ ngăn ghim) | Thanh công cụ Đã gửi bị ngăn che mà mọi eval xanh | Mở rộng AC-1, AC-3 sang /sent, bài chung hàm, ảnh Đã gửi | fixed: bài «Đã gửi · the same frame as Bảng hàng» có chiều đỏ, E20, E21; ảnh Đã gửi trên trang cổng |
| P1 | evals | E8 không đo chiều cao hàng; trạng thái hai nút lưu chưa có; người không quyền chỉ kiểm «không có Thêm» | Hàng vỡ hai dòng hay «Lưu góc nhìn» lọt cho người không quyền mà bài xanh | Đo ≤ 60 px có chiều đỏ; kiểm vắng «Lưu góc nhìn»; câu hỏi cho trạng thái hai nút | fixed: đo chiều cao + chiều đỏ 'toolbar wraps', kiểm vắng «Lưu góc nhìn»; trạng thái hai nút thành câu hỏi d-…-24 (dựng ở lát 2) |
| P2 | evals | E3 không khai chiều đỏ; E11 đo chuỗi bóng chỉ trên th; E12 chiều đỏ không ghim thông điệp | Bóng chỉ ở tiêu đề hay chỗ cuộn mất khi ghim mà bài xanh | Chiều đỏ có tên cho từng eval; bóng trên th và td của cột ghim cuối | fixed: E3 chạy cả tệp ghim-ngan với chiều đỏ 'record remounted on pin: scroll 0'; assertPinnedEdge (th, td, cột ghim khác không bóng) với hai chiều đỏ; E12 ghim 'fold handle not shown on the edge' |
