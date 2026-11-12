---
slug: bo-kiem-chung-khi-dang-nhap
at: 2026-11-12T02:24:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Bài của hai hàm chờ nằm hai chỗ: thiết kế đặt dưới tools/e2e_templates, E6 và E7 đặt dưới tests/e2e. | Tệp đặt dưới tools/ không được make e2e chạy; bốn ca hai chiều không chạy mà lệnh vẫn xanh, hoặc người chấm không thấy tệp. | Một đường dẫn duy nhất; E6, E7 khẳng định số bài của tệp có trong báo cáo, 0 bị bỏ. | fixed: thiết kế, E6, E7, E9 cùng trỏ tests/e2e/settle.spec.ts; E6, E7 đòi đúng số bài passed, 0 skipped |
| P1 | evals | AC-9 hứa lượt có phiên xanh nhưng không eval nào chạy trọn cấu hình có cơ sở dữ liệu, trong khi khâu chuẩn bị chung và members.spec bị sửa. | Người thử bốn vai làm lệch một bài cũ của hàng 8 hay 9; mọi eval vẫn xanh, hồi quy lọt cổng. | Eval chạy trọn playwright.db.config.ts, số bài cũ bằng nhánh chính. | fixed: AC-9 thêm vế toàn bộ lượt có cơ sở dữ liệu; thêm E14 (kiem_chung_db_tron), số bài từng tệp so với a97c71d rút bằng máy |
| P1 | evals | Tập bài @cho do người làm tự gắn, không có danh sách viết trước. | Quên gắn thẻ cho bài axe 18 lượt — đúng bài làm 1o trượt — E9 vẫn xanh trên tập nhỏ hơn. | Danh sách tên viết trước, chiều đỏ khi gỡ thẻ. | fixed: thêm CHO_TESTS trong thiết kế và E15 (danh sách viết trước, gỡ thẻ trên bản sao thì đỏ gọi tên bài) |
| P1 | contract | Khuyến nghị Hỏi-1 chỉ an toàn nếu có hàng «CI có Postgres» trước hàng 10; Out of scope ghi sẵn câu trả lời. | Không ai thêm hàng; sau hàng 10 CI xanh mà gần như không đo màn nào. Hoặc chủ kho chọn lối khác mà hợp đồng không có tiêu chí cho CI. | Out of scope viết theo hai nhánh; nhánh khuyến nghị có bước gửi yêu cầu hàng mới. | human-gate1: chủ kho trả lời Hỏi-1; fixed: Out of scope viết theo hai nhánh — khuyến nghị thì máy gửi yêu cầu hàng mới cho giám sát ngay sau Cổng Phạm vi, lối khác thì thêm tiêu chí cho CI |
| P2 | design | Việc thay ca kiểm «bỏ qua có điều kiện» của hàng 9 còn treo, sổ không có dòng. | Duyệt AC-3, E4 khi chưa có câu trả lời; giám sát từ chối thì phải mở lại phạm vi. | Dòng sổ có nguồn, hoặc thành Hỏi. | fixed: giám sát cho thay (H-1211-6), dòng sổ d-20261112T022113Z-11, mục «Hàng này thay một quyết định của chủ kho ở hàng 9» trong thiết kế và câu trong Context của hợp đồng |
