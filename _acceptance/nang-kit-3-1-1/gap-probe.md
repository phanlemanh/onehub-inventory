---
slug: nang-kit-3-1-1
at: 2026-11-24T12:05:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Phản biện context sạch — nang-kit-3-1-1

Một tác tử tươi đọc đúng bốn tệp (design doc, `contract.md`, `evals.yaml`, `decisions.jsonl`) cộng tệp bài học xuyên hồ sơ
(input 5). Sửa xong artifact không phản biện lại (một lượt).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | design | Dòng sổ d-6 ghi nguồn một-lối để bỏ phép đo cổng hai bản trên mọi hồ sơ, nhưng lý do loại chỉ là tốn thời gian, tức khẩu vị rủi ro của người. | Cổng Phạm vi duyệt mà không biết đã đổi phép đo cổng hai bản lấy phép so cây rẻ hơn. | Đổi thành câu hỏi, hoặc chứng quan hệ ở E5. | fixed: giữ cả hai phép đo — thêm AC-6 và E6 gate-control như nang-kit-3-1; dòng sổ d-10 thay d-6, không còn đánh đổi để hỏi |
| P0 | design | Dòng sổ d-9 trích câu của nang-kit-3-1 để gộp Gate 1.5 vào Cổng Phạm vi; câu ấy chỉ quyết cho vòng ấy. | Kế hoạch T3 được duyệt bằng một câu trên căn cứ không có cho vòng này. | Đổi thành câu hỏi trên thẻ. | fixed: dòng sổ d-11 thay d-9, thành Hỏi-3 trên thẻ (máy khuyên gộp) |
| P1 | contract | AC-3 và AC-7 mặc định Hỏi-1 trả «có»; không có nhánh cho «không». | Chủ kho chọn tự sửa sau gộp, E3 và E7 đỏ dù làm đúng lời người. | Khai sẵn nhánh «không». | fixed: AC-3 ghi «chờ Hỏi-1» và khai nhánh «không» (AC-3 thu về Known limits, E3 not-run, AC-7 chạy kit theo v3.1.0, máy sửa hợp đồng và trình lại) |
| P1 | evals | E5 chỉ đo scripts/ và lib/ giống hệt; câu «bốn lệnh executor đều dưới gốc lõi» không ai đo. | Một lệnh executor trỏ ra ngoài scripts/lib mà E5 vẫn xanh. | Đọc lệnh executor từ config.yaml, đòi mỗi lệnh chạy tệp dưới scripts/ hay lib/ của lõi. | fixed: AC-5 và E5 thêm vế executor có chiều đỏ ghim; quan hệ «cổng không đọc tệp đổi» đo thẳng bằng AC-6 (chạy cổng hai bản) |
| P1 | evals | E7 không đòi số luật chạy lớn hơn 0, và trước chữ ký n = 0 vẫn xanh. | Cổng chạy 0 luật mà AC-7 vẫn xanh. | Ghim r > 0 và n >= 1 trước chữ ký. | fixed: AC-7, E7 và gate-branch.mjs đòi rules ran > 0 và trước chữ ký ít nhất một dòng chặn; hai bài đỏ mới trong two-way |
