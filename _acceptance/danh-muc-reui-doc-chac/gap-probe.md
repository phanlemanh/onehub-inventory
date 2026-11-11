---
slug: danh-muc-reui-doc-chac
at: 2026-11-11T04:05:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | E1 chỉ đòi stderr chứa tiêu đề nhóm, không ghim cả dòng lỗi mới | Nhóm ReUI Primitives đã thoát 1 với câu cũ nên 7/21 ca xanh khi chưa sửa; lỗi khác có tên nhóm cũng lọt | Mỗi ca khẳng định đúng dòng section missing của nhóm và không có count mismatch | fixed: E1 và AC-1 ghim dòng đầy đủ và cấm count mismatch; thiết kế quét tiêu đề trước khi đọc mục để mọi dạng ra cùng lỗi |
| P1 | evals | E5 trục chỗ chỉ là tên trường, pin neo chữ cứng, chèn chỉ ở nhóm và mục đầu | Hàm quét chỉ duyệt nhóm đầu hoặc bỏ một khoá gốc mà 100 ca vẫn xanh | Neo khoá gốc vào ALLOWED_FIELDS.top, chèn ở cả ba loại | fixed: 27 chỗ gồm counts và ba loại, neo vào ALLOWED_FIELDS.top, KINDS; lộ thêm lỗ counts không được quét, đưa vào phạm vi |
| P1 | design | Không chứng tệp kiểm mới không làm đỏ eval của hồ sơ đã ký danh-muc-reui | Eval cũ so tổng số ca thì hồ sơ cũ đỏ ở lần chấm lại | Chấm lại eval cũ hoặc kê chuỗi hồ sơ cũ đếm | fixed: design và Notes kê chuỗi hồ sơ cũ đếm (tên E<n> và 33 ca theo tệp, không tổng thư mục); E10 thêm điều kiện không tên ca mới nào khớp E<n> |
| P2 | evals | E4 chỉ có ca chữ hoa, thiếu ca bỏ số khai và đối chứng đổi tên | Gợi ý chỉ chuẩn hoá hoa thường hay trỏ bừa mà E4 xanh | Thêm ca bỏ số khai và ca đổi tên không có gợi ý | fixed: DC4 thành 3 ca |
| P2 | evals | E5, E8 chưa ghim thông điệp cho chỗ category và name, E8 chưa kê cặp | Thông điệp gọi sai tên mà ca vẫn xanh | Viết sẵn chuỗi mong đợi, kê 10 cặp | fixed: E5 ghim chuỗi cho từng lớp chỗ, E8 kê 10 cặp |
