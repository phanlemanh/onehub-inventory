---
slug: da-gui-tren-luoi
at: 2026-11-13T02:05:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---
## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Dòng sổ bỏ bộ quét độ phủ trích hợp đồng của Bảng hàng, câu ấy không quyết gì cho hàng 6 [bang-hang-dung-tay-nhu-sheet#F1] | Chủ kho duyệt vì tưởng bỏ quét có căn cứ; trục riêng của link (đã mở mà không quan tâm, số đếm lớn) bị sót | Dòng sổ mới thay dòng cũ; hoặc chạy quét | fixed: chạy bộ quét entity-feature (coverage-scan.md), Coverage dựng lại bốn trục, AC-1 thêm link đã mở mà không quan tâm, dòng sổ mới thay dòng bỏ quét |
| P0 | design | Lý do «lối chết» của việc đặt luật đọc ?state= lên lưới dùng chung không còn đúng khi chính hàng này sửa lưới sau khi 2c gộp | Hai bản cùng luật lệch nhau, trái luật một chỗ của AGENTS.md | Thay dòng sổ; thêm ca so hai bộ đọc | fixed: dòng sổ mới nêu lối chết thật (lời duyệt D-1311-4 chỉ mở data-region.tsx, chuyển luật cần sửa listings ui và thêm tệp candidate), E5 thêm ca chạy 12 ô trên cả hai hàm và đỏ khi lệch, revisit gộp sau 2c |
| P1 | contract | Bảng Vai × Màn tự điền ai thấy tên người nhận (dữ liệu cá nhân) [bo-nut-theo-quyen#F1] | Hàng 18 lấy bảng ý định làm lời duyệt | Câu hỏi cho chủ kho hoặc bỏ bảng | deferred: bảng Vai × Màn bắt buộc theo quyết định 0017 nên giữ ý định như Bảng hàng; ghi Notes của hợp đồng và dòng sổ revisit «hàng 18 quyết bằng bảng quyền» |
| P1 | evals | Không eval đo cờ dữ liệu cá nhân của người nhận và companyId bắt buộc | ShareLink.yaml quên cờ mà make check vẫn xanh | Assert đọc YAML, ca đối chứng bỏ từng cờ | fixed: E11 thêm khối 'ShareLink model' đọc YAML, hai thông điệp ghim và ca đối chứng |
| P1 | evals | Ảnh judgment không chắc có dòng tên dài; ngăn chi tiết chỉ chụp sáng 1440, 360 | Hội đồng chấm đạt mà không thấy chữ cắt hay ngăn tối | Ghim vị trí dòng tên dài; thêm ảnh ngăn chi tiết | fixed: E1 ghim link tên dài trong năm dòng đầu; E14 thêm sent-360-ten-dai, ngăn chi tiết tối 1440 và 360, khổ 1024 và 414; E15 nhận các ảnh ấy |
