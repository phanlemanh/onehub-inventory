---
slug: sua-thong-tin-can
at: 2026-11-17T01:29:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | design | Chỗ sửa bốn trường (trong hồ sơ hay trên lưới) là câu ô cơ hội để chủ kho chốt, sổ lại ghi máy chọn | Chủ kho ký mà không biết đã bỏ lối sửa trên lưới | Thêm Hỏi-3 lên thẻ, dòng sổ chỉ-người thay dòng cũ | fixed: Hỏi-3 trong hợp đồng và sổ (supersedes dòng 3), thẻ cổng hỏi |
| P0 | contract | Trần 200 ký tự chặn cả trường dài sẵn từ lần nhập tệp mà người không đổi | Căn có pháp lý 350 ký tự không đổi được nội thất | Chỉ kiểm trường có đổi; ca hop-truong-cu-dai | fixed: hộp chỉ kiểm trường vừa đổi, AC-3 thêm vế, E3 thêm ca, Coverage ghi [GIẢ ĐỊNH] |
| P1 | contract | Câu Hỏi-1 (Xác nhận lúc) không có tiêu chí và bài đo | Chủ kho chọn khác khuyến nghị mà mã vẫn đặt Xác nhận lúc, mọi bài xanh | AC mới theo câu đã chốt, eval lớp máy chủ | fixed: AC-10 và E12 |
| P1 | evals | Ma trận 15 ô của cột riêng dồn vào bài máy chủ; thiếu ca Quản trị sàn ở ô và ca PATCH cột riêng 403 | Ô ngày mở ra ô chữ mà E6 vẫn xanh | Tách 5 ô lớp màn và 10 ô lớp máy chủ, thêm ca vai | fixed: E6 (máy chủ) và E6b (màn), thêm o-rieng-quan-tri-khong-mo và custom-quan-tri-403 |
| P1 | evals | AC-4 thiếu bài lớp máy chủ và ca bản mới sau 409; AC-3 thiếu ca để trống là xoá | Hộp báo đúng câu mà hồ sơ giữ bản cũ | Ca 409 từ handler thật, ca để trống là xoá | fixed: E4b, E3 thêm hop-de-trong-la-xoa và custom-xoa-khi-trong, AC-3 gắn cross-layer |
