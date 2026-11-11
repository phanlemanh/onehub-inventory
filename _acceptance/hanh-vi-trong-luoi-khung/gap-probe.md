---
slug: hanh-vi-trong-luoi-khung
at: 2026-11-11T04:43:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ bỏ design-pass dẫn tiền lệ của 1b, tiền lệ ấy chỉ phủ Lưới, không phủ các mặt mới (khung hồ sơ, toàn màn trên điện thoại, hộp xác nhận, toast Hoàn tác) | Cổng Phạm vi duyệt các mặt mới bằng chữ, lệch thị giác chỉ lộ ở Cổng Bằng chứng | Thay dòng sổ, hoặc bật design-pass cho các mặt mới | fixed: dòng sổ mới thay dòng bỏ design-pass, chạy design-pass không đồng bộ trước cổng |
| P0 | contract | Việc thêm dòng check vào sổ quyết định thiết kế chờ giám sát mà sổ không ghi, lối dự phòng do máy chọn không có eval | Không được phép thì E9, E10 đỏ hoặc eval bị sửa mà cổng không thấy | Ghi dòng sổ cho K-4, tách nhánh | fixed: giám sát đã duyệt K-4; dòng sổ ghi duyệt, bỏ lối dự phòng khỏi hợp đồng |
| P1 | evals | E9, E10 chỉ đo có chuỗi decision trong tệp, không đo phá thì đỏ; notification-channel và read-only-cell không có ca phá thử | Tệp mang thẻ mà không đỏ khi phá vẫn làm E9 xanh | Ma trận sáu dòng id → ca phá thử có thông điệp ghim | fixed: E9 thêm ma trận sáu ca phá thử ghim thông điệp, khẳng định đủ 6 |
| P1 | evals | Rào quét danh sách chọn tay, ca phá thử chỉ có Sheet | Màn dựng hộp bằng alert-dialog, drawer hay Base UI Dialog nhập thẳng thì lọt rào | Ma trận đủ nguồn bị cấm, mỗi nguồn một ca | fixed: danh sách viết trước 11 nguồn, mỗi nguồn một ca tệp giả, khẳng định 11 ca |
| P1 | design | Không nói thứ tự sau lọc đến khung hồ sơ từ đâu; E2 đưa id viết tay | Màn đưa danh sách chưa lọc thì «Sau» nhảy sang dòng ẩn | Ca tìm trên Lưới thật rồi đi qua lại | fixed: Lưới tự giữ hồ sơ với thứ tự đang hiện; E2 thêm ca tìm lọc trên DataRegion thật |
