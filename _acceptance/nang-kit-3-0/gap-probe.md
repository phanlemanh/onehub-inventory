---
slug: nang-kit-3-0
at: 2026-11-18T05:00:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Gap probe — nang-kit-3-0

Một tác tử tươi đọc design doc, `contract.md`, `evals.yaml`, `decisions.jsonl` và tệp bài học từ hồ sơ trước; không đọc mã.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | design | Cách A thống nhất tên chợ chứ không thống nhất phiên bản: chợ trong settings không ghim ref, CI ghim v3.0.0; chọn ghim hay theo nhánh chính là việc của người mà sổ không có dòng | Chủ kho cài chợ từ nhánh chính khi nó đã qua 3.0.0; máy chạy 3.0.x/3.1, CI chạy 3.0.0; E7 vẫn xanh | Dòng chi-nguoi + Hỏi trên thẻ; nếu ghim thì AC-6 đo ref bằng KIT_TAG và E7 đỏ khi bỏ ref | human-gate1: Hỏi-3 (dòng d-20261118T045034Z-12), soạn nháp theo khuyến nghị ghim `ref: v3.0.0`; AC-6 và E7 đo ref bằng KIT_TAG, thêm chiều đỏ «marketplace not pinned to v3.0.0» |
| P0 | design | Dòng «kit-root không đọc lùi» ghi một-lối, nhưng lối «đọc lùi có cảnh báo to» không chết vì ràng buộc nào máy nêu được; căn cứ thật là lời giao của chủ kho [upgrade-design-assembly-0-7-0#F2] | Cổng Phạm vi ký như lối duy nhất; không ai trình chủ kho cái giá gãy executor của vòng khác | Viết lại thành dòng chi-nguoi có khuyên và lối khác | human-gate1: dòng d-20261118T044932Z-10 thay d-20261118T044124Z-4 và d-20261118T044124Z-6, gộp với câu thứ tự cài và gộp thành Hỏi-2 |
| P1 | contract | Coverage gán bốn lệnh executor nối script sau gốc kit cho AC-5, nhưng AC-5 chỉ đo kit-root in gì; quét AC-8 không bắt dạng `/road-map/` giữa đường | Script mà executor gọi đổi chỗ ở 3.0, mọi vòng sau gãy, E1–E11 vẫn xanh | AC + eval: mọi script executor gọi có thật dưới gốc 3.0, chiều đỏ trên config trỏ script không có | fixed: AC-4 và E4 thêm vế bốn lệnh executor (dòng `executor-scripts: …`, chiều đỏ `scripts/khong-co.mjs`); AC-8 thêm mẫu `/road-map/`, `/dieu-phoi/` (0 dòng trên `8925e8ff`, đếm không đổi) |
| P1 | evals | E2 đo «gọi tên hồ sơ» thay vì loại luật; phần sau chữ ký không có thước | Kit 3.0 bắt một lỗi schema trên chính hồ sơ này, E2 vẫn xanh, CI của PR đỏ sau chữ ký | E2 ghim lý do của luật chữ ký T3, đỏ với mọi loại khác; một lượt sau ký đòi 0 VIOLATION | fixed: AC-2 và E2 ghim lý do `hạng T3 chưa có chữ ký người — code t3_paths phải có người ký`, chiều đỏ thứ hai là hồ sơ này với lỗi schema gài; lượt sau ký là `nk30_gate_branch --signed` ở S5 (Known limit 2). rejected phần «eval id riêng»: S4 chạy trước chữ ký nên một eval sau ký không chạy được trong lượt chấm |
| P1 | evals | Mốc so sánh gõ cứng `8925e8ff`/15 dòng trong khi sẽ gộp main; hồ sơ vào main sau mốc không được chấm lại bằng 3.0; loại trừ «tài liệu của chính vòng» mơ hồ | Gộp main xong E9 đỏ vì merge-base lệch, hồ sơ 0-7-1 không được đối chứng engine | E3 chạy trên cả `8925e8ff` và merge-base lúc chấm; E9 cố định mốc; danh sách loại trừ là đường cụ thể | fixed: AC-3/E3 chạy hai worktree, k không ghim; AC-8/E9 đếm 15 dòng ở mốc cố định `8925e8ff`; danh sách loại trừ kê đủ năm đường; dòng `wiki/log.md` của vòng viết không có tên kit cũ nên không cần loại |
