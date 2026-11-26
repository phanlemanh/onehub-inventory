---
slug: tat-plugin-cho-cu
at: 2026-11-18T14:52:00Z
verdict: findings
p0: 3
p1: 2
p2: 0
---

# Gap-probe — tat-plugin-cho-cu

Phản biện context sạch: một tác tử tươi đọc design doc, `contract.md`, `evals.yaml`, `decisions.jsonl` và tệp bài học
(claim-scan). Không đọc code, không chạy lệnh.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | design | Dòng d-…143848Z-3 ghi `mot-loi`; lối «áp khoá tắt vào cây rồi mở phiên mới ở worktree» vẫn sống. | Cổng Phạm vi ký như thể chỉ có một lối; vòng dẫn bằng văn bản 2.38.1 mà người ký không biết đã chọn. | Thay bằng dòng `supersedes`, chuyển thành câu chỉ-người. | human-gate1: dòng d-…144336Z-8 thay d-…-3, thành Hỏi-2 trên thẻ. |
| P0 | design | Dòng d-…143848Z-4 trích `tools/kit-root.mjs`; câu trích không quyết việc tắt sáu hay ba. | Người duyệt tưởng lựa chọn có căn cứ trong kho. | Đổi nguồn sang `mot-loi` với lối chết nêu được. | fixed: dòng d-…144336Z-9 thay d-…-4, `mot-loi` — ba tên chợ cũ khác tên bản mới nên khoá @delivery-loop không đè được. |
| P0 | design | Dòng d-…143848Z-5 nói một trục; design doc nêu trục thứ hai (trạng thái cài của máy) không có AC phủ. | Máy chỉ bật road-map chợ cũ: phép đếm tên không bắt, Coverage xanh sai. | Thay dòng hoặc thêm hàng Coverage cho trục ấy. | fixed: dòng d-…144336Z-10 thay d-…-5; Coverage thêm hàng trục trạng thái cài trỏ AC-2, AC-3, ca phá (e) của E3. |
| P1 | evals | E3 không có ca phá cho «không source nào kết thúc @acceptance-gate-kit» với plugin khác tên bản mới. | Thước viết nhầm chỉ đếm tên trùng; E7 vẫn pass. | Thêm ca (e) road-map@acceptance-gate-kit, ghim thông điệp; E7 pass 11. | fixed: E3 thêm ca (e) với thông điệp ghim; E7 đổi thành pass 11. |
| P1 | evals | E4 chưa nói phạm vi quét chừa gì, và dòng wiki/log.md bắt buộc có thể nhắc tên chợ cũ. | S4 đỏ vì dòng log hay design doc dù khoá đúng; phải nới tiêu chí sau Cổng 1. | Kê phạm vi quét, luật viết dòng log; E4 đo trên commit đủ hồ sơ. | fixed: design doc thêm đoạn phạm vi quét và luật viết; AC-4 và E4 ghi đo trên commit đủ hồ sơ, design doc, plan, dòng log. |
