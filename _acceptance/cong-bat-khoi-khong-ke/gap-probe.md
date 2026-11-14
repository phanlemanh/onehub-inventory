---
slug: cong-bat-khoi-khong-ke
at: 2026-11-14T13:20:00Z
verdict: findings
p0: 1
p1: 2
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Kê theo tệp bỏ lọt thành phần mới thêm vào một tệp đã kê; sổ ghi đây là việc máy quyết mà lối kê theo tên chưa chết và chạm câu ngưỡng của ô | Sau PR #58, thêm RegionBadge vào region-header.tsx (tệp có trước): sổ thành phần có mục mới, cổng im | Đưa thành câu hỏi cho chủ kho, hay luật đỏ khi tệp đã kê có tên ngoài tập đã ghi | human-gate1: thành Hỏi-2 (thiết kế §7b, sổ d-…-10 thay d-…-4), bản nháp theo lối A; hợp đồng Notes nêu kẽ |
| P1 | evals | E3 dựng tay hình sổ của PR #58, không lấy đầu ra thật của bộ sinh | PR #58 đặt trường khác bản dựng tay, cổng đọc lỗi sau khi PR ấy gộp | Bản sao từng byte sổ trên đầu PR #58 kèm băm, và ca đọc sổ thật của kho | fixed: AC-3/E3 dùng tools/proof_gate/fixtures/so-thanh-phan-pr58.json (a7e2c81, băm ghim) và sổ thật |
| P1 | contract | Lời hứa chạy lưới trên đầu các nhánh mở và báo G trước khi gộp không có tiêu chí | CI của một nhánh mở đỏ sau gộp mà G không được báo | AC kiểu script kê từng nhánh | deferred: bước gộp của kế hoạch (đầu nhánh đổi tới phút gộp, bằng chứng là tin BÁO G); đã đo lúc thiết kế: 7e và PR #58 không thêm tệp nào |
| P2 | evals | E6 không đo rằng số đếm tệp, không đếm mục | Một tệp hai thành phần cho số 2 sau PR #58 | Ca một tệp hai thành phần = 1, hai tệp = 2 | fixed: AC-6/E6 ba ca 1, 2, 0 |
| P2 | evals | Ca nhà cung cấp không có đối chứng trên cùng kho, không ca đường lồng | Lọc theo tên tệp làm miễn oan tệp lồng | Ca nhà cung cấp trên kho đỏ, ca templates/x/khoi-long.tsx | fixed: AC-1/E1 |
