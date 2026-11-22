---
slug: lui-ban-luc-xoay-mat-khau
at: 2026-11-22T08:18:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Gap probe: lui-ban-luc-xoay-mat-khau

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | contract | Dòng «không đổi lệnh» (d-20261122T074926Z-10) là lựa chọn khẩu vị rủi ro với bản thật mà sổ ghi máy quyết; câu trích chỉ chọn chỗ viết sổ tay, không quyết việc chấp nhận để lệnh tự lùi làm bản thật mất kết nối [bien-do-sau-xoay-mat-khau#F1] | Cổng Phạm vi ký phạm vi «chỉ sổ tay» mà chủ kho không được hỏi; lượt xoay thật đầu tiên có kiem-nhanh-ten-mien đỏ vì lý do khác đưa tên miền về bản chết | Dòng chỉ-người thay dòng cũ, Hỏi-1 trong hợp đồng và thiết kế, nêu đủ cái giá | human-gate1: dòng d-20261122T075530Z-14 (chỉ-người, supersedes d-10) và Hỏi-1 của hợp đồng; khuyến nghị giữ vòng sổ tay và mở hàng T3 cho lệnh |
| P0 | contract | Hai dòng mục-tiêu trích câu chỉ liên quan chứ không quyết: tệp kiểm thường trực (d-5) trích tiền lệ của hàng trước; không sửa Ngoài-5 (d-11) trích tên mục Ngoài-5 mà không trích lời chủ kho chọn [roadmap-merge-driver#F1] | Người duyệt tưởng chủ kho đã quyết điều máy tự chọn | d-5 đổi sang một-lối; d-11 trích câu chủ kho chọn ở Cổng Bằng chứng | fixed: d-20261122T075530Z-12 (một-lối, supersedes d-5); d-20261122T075530Z-13 trích dòng «Known limits — chọn ở Cổng Bằng chứng 2026-11-22» (supersedes d-11) |
| P1 | evals | E2 đo chuỗi có mặt ở bất kỳ đâu trong mục thay vì quan hệ «mỗi dòng một hàng bảng»; ma trận dòng chưa viết trước; kiem-nhanh khớp như chuỗi con | Bảng bỏ hàng kiem-nhanh mà còn kiem-nhanh-ten-mien vẫn xanh; một dòng chỉ ở phần Luật cũng qua | Ghim đủ chín chuỗi phân biệt; chỉ hàng bảng; tên bước trong backtick; chiều đỏ cho kiem-nhanh và cho dòng chỉ ở phần Luật | fixed: evals.yaml E2 — ma trận chín chuỗi ở đầu tệp, chỉ hàng bảng, hai chiều đỏ mới; thiết kế mục Thước |
| P1 | evals | E4 không có đối chứng phủ lẫn chiều đỏ cho lối thử bản khác của sổ lùi bản, bước 3 và «Đỏ thì làm gì» của sổ xoay khoá, hàng make rollback của README | Bộ khớp lối thử thành mã chết (hoa thường, NFC/NFD), bước 4 sổ lùi bản vẫn bảo thử bản cũ hơn mà E4 xanh | Phủ đủ chỗ thêm các đoạn ấy; chiều đỏ cho hàng Instant Rollback; chuẩn NFC | fixed: evals.yaml E4 — mười bốn chỗ phải xét, chiều đỏ hàng Instant Rollback; AC-3 kể đủ chỗ; thiết kế chuẩn NFC |
| P1 | evals | E1, E3, E6 hỏi điều không có trong inputs: health.ts cho E3; chỗ tìm giờ lượt xoay (mk/deploy.mk, deploy.yml) cho E1; thứ tự STEPS cho E6 | Hội đồng không kiểm chứng được nên chấm theo hợp đồng hoặc chấm UNCERTAIN | Thêm tệp vào inputs hoặc rút câu hỏi | fixed: E1 thêm mk/deploy.mk, .github/workflows/deploy.yml và câu (5); E3 thêm health.ts; E6 thêm len-ban.mjs, câu (3) hỏi theo STEPS |
