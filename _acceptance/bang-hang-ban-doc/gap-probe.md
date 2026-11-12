---
slug: bang-hang-ban-doc
at: 2026-11-11T10:08:00Z
verdict: findings
p0: 1
p1: 2
p2: 2
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ bỏ design-pass ghi nguồn «một lối» mà lối kia chưa chết: design-pass chạy trên bản thử, trước cổng | Chủ kho lướt qua vì tin máy quyết, duyệt tám cột và chữ đầu cột chỉ bằng chữ | Ghi dòng mới thay dòng cũ, nguồn «chỉ người» | fixed: dòng sổ d-20261111T100755Z-12 thay d-20261111T100538Z-9, thành câu hỏi ở Cổng Phạm vi |
| P1 | design | Thiết kế ghi «Dự án», «Tòa»; hợp đồng và nhãn kho là «Khu», «Toà»; E2 chỉ so với nhãn sinh | Chữ người dùng đọc đi qua cổng khác với chữ đã duyệt | Chốt một chữ; E2 ghim chuỗi đã duyệt | fixed: thiết kế đổi sang Khu, Toà; E2 thêm tám chuỗi viết sẵn |
| P1 | evals | AC-6 hứa ở lối vào trang mà E6 chỉ đo bộ đọc thuần | Trang đọc thẳng tham số, bản thật vẫn hiện lỗi giả | Eval gọi chính trang trong hai môi trường | fixed: AC-6 gắn (cross-layer), thêm E12 gọi chính hàm trang, 10 ô, ca đối chứng ghim thông điệp |
| P2 | evals | Không eval nào đo phép ghép căn với lần chào ở trang | Trang ghép theo chỉ số mảng, diện tích mang số căn khác | Một dòng cố định khớp căn liên kết | fixed: E12 kiểm dòng của lần chào biết trước tra từ dữ liệu nguồn |
| P2 | evals | E11 hỏi điều ảnh tĩnh không thấy, thiếu ảnh tối, E10 không ghim tên ảnh | Giám khảo đoán hay thiếu đầu vào | Ghim tên ảnh, thêm ảnh tối, thu câu hỏi | fixed: E10 ghim tám tên ảnh, E11 bốn ảnh sáng tối và câu hỏi chỉ điều ảnh thấy |
