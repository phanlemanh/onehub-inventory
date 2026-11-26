---
slug: design-decisions-40-of-40
at: 2026-11-26T07:30:00Z
verdict: findings
p0: 0
p1: 2
p2: 3
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | AC-4 chỉ đo câu xác nhận có trong ghi chú; không tiêu chí nào so phần trả lời của sáu dòng với đề xuất chủ kho đã đồng ý, hồ sơ cũng không chép lại đề xuất ấy | Phần trả lời của một dòng lệch khỏi đề xuất mà ghi chú vẫn mang câu xác nhận, E6 và E7 vẫn xanh; đã có một lần phép kiểm của reference-implementation đổi sau lời đồng ý mà ghi chú không đổi | Chép nguyên văn sáu câu trả lời đã đồng ý vào hồ sơ, đo trường trả lời của từng dòng với bản ấy, thêm ca phá sửa một chữ | deferred: chủ kho chọn ghi Known limits ở Cổng Bằng chứng 2026-11-26 (Notes của hợp đồng) |
| P1 | evals | AC-4 hứa bốn câu màu chưa câu nào được trả lời nhưng không ca phá nào thêm vào sổ một dòng trả lời câu màu | Máy thêm một dòng color-roles-chart vào sổ quyết định; E12 xanh vì tệp nằm trong danh sách, E16 có thể vẫn xanh | Ca phá thêm dòng trả lời color-roles-chart chờ E6 đỏ gọi tên câu; ca phá thêm một dòng lạ chờ E16 đỏ | deferred: chủ kho chọn ghi Known limits ở Cổng Bằng chứng 2026-11-26 (Notes của hợp đồng) |
| P2 | evals | Dòng ghim của E2 chỉ có số đếm, không có trạng thái từng tầng; ca phá của E3 không đụng tới tầng | Một tầng tụt xuống chưa đạt trong khi tổng vẫn 40 trên 40, E2 và E3 vẫn xanh | Ghim dòng kê từng tầng; ca phá làm một tầng tụt | deferred: chủ kho chọn ghi Known limits ở Cổng Bằng chứng 2026-11-26 (Notes của hợp đồng) |
| P2 | contract | Hợp đồng nói bốn bài kiểm được gắn tên nhưng không nói screen-ledger được giữ bằng công cụ chạy trong make check, không cần dòng gắn | Mối nối screen-ledger với công cụ gãy mà E4 vẫn xanh, người duyệt không đối chiếu được bốn với năm | Ghi vào hợp đồng cách screen-ledger được giữ; ca phá cắt mối nối ấy | deferred: chủ kho chọn ghi Known limits ở Cổng Bằng chứng 2026-11-26 (Notes của hợp đồng) |
| P2 | evals | AC-8 cấm màu và tên kho nhưng không có ma trận viết trước các dạng phải bắt; không ca phá cho tên kho | Bộ chữ chứa tên kho viết khác, một màu dạng hsla hay color-mix, hay tên biến màu, mà E14 vẫn xanh | Viết trước ma trận các dạng, quét đủ, thêm ca phá chèn tên kho | deferred: chủ kho chọn ghi Known limits ở Cổng Bằng chứng 2026-11-26 (Notes của hợp đồng) |
