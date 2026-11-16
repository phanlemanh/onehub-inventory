---
slug: dan-tu-excel
at: 2026-11-15T04:10:00Z
verdict: findings
p0: 1
p1: 4
p2: 0
claims_input: ok
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ d-20261115T030831Z-5 ghi «một lối» cho việc giá lệch quá 20% chỉ cần bấm Áp, trong khi đây là mức chặn chống ghi sai giá của hàng 4 và còn hai lối sống (hỏi gom một lần; bỏ chọn sẵn) — việc chỉ người quyết mà sổ ghi máy quyết. Cùng dạng [sua-tren-o#F1]. | Cột giá lệch một dòng trong Excel, dán 30 căn, một cú Áp ghi 30 giá sai; chủ kho duyệt vì tưởng không còn lối khác. | Thay bằng dòng «chỉ người» có supersedes, thành Hỏi-6 với ba lối; Notes nói AC-4 đổi theo từng lối. | human-gate1: thành Hỏi-6 (d-20261115T033412Z-16, supersedes -5), khuyên bỏ chọn sẵn dòng lệch lớn; AC-4 và Notes đã sửa |
| P1 | evals | E2b hỏi về cửa lưu và đường ghi thứ hai nhưng không đưa tệp cửa lưu, use-change, tệp lưới; một tệp ghi sai tên. | Lối ghi lách cửa lưu nằm ở tệp hội đồng không đọc, hội đồng vẫn PASS. | Thêm đủ tệp, sửa tên. | fixed: E2b đọc save-door, use-change, inventory-grid, use-listing-cell-edit, listing-paste; câu hỏi giới hạn trong tệp đã cho |
| P1 | contract | Trục C «dòng ẩn vì lọc», trục D «một ô cả vùng» và «lặp», trục E «mất mạng từ đầu» không có AC hay eval. | Đang lọc, dán ghi tràn vào dòng ẩn; một ô lên bốn ô chỉ đổi ô đầu; bộ đo vẫn xanh. | AC mới với bốn ca e2e đếm lần ghi. | fixed: AC-10 + E12 (bốn ca viết trước, đối chứng dương cho dòng hiện) |
| P1 | evals | AC-4 «không hộp hỏi lại nào mở sau Áp» chỉ đo bằng bài luật thuần. | Áp đi qua trình sửa trên ô, hộp hỏi lại mở N lần, E4 vẫn xanh. | Ca e2e đếm hộp thoại sau Áp. | fixed: E4-e2e «gia-lech-lon-bo-chon-san» đếm 0 hộp thoại sau Áp, đối chứng dương dòng thường chọn sẵn |
| P1 | evals | Hai ô cùng căn ghi nối phiên bản không được đo; AC-6 ba nguyên nhân hỏng chỉ đo câu có mặt, e2e chỉ ca ngoại tuyến. | Đường ghi thật: ô thứ hai gửi phiên bản cũ, luôn xung đột; 403 giữa chừng mà báo «mất mạng». | Ca phiên bản nối có chiều đỏ; ma trận ba nguyên nhân ghim câu và số ô. | fixed: AC-5 thêm vế phiên bản nối, E5b ca «noi-phien-ban» trên cửa mẫu thật; AC-6 và E6 thành ma trận ba nguyên nhân, hằng 3 ghim |
