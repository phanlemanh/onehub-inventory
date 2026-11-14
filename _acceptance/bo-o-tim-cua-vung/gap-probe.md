---
slug: bo-o-tim-cua-vung
at: 2026-11-13T12:40:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---
# Phản biện context sạch — bo-o-tim-cua-vung

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Bảng đối chiếu cũ → mới do người dựng viết, không gì kiểm bảng đủ dòng; hội đồng E15 không có bài kiểm để so | Đổi phép so tập thành so có mặt rồi bỏ dòng ấy khỏi bảng — E14 và E15 vẫn xanh | Thước script đếm dòng bài kiểm bị bỏ có nhắc ô tìm, mỗi dòng phải có hàng; hàng mới trỏ ca có thật; ca phá | fixed: thêm E18 (thước `rang/doi-bai-kiem.mjs`, khoá `doi_bai_kiem` ở config) và đưa bốn tệp bài kiểm vào inputs của E15 |
| P1 | contract, evals | Đã gửi chỉ đo khi hàng 6 đã gộp, eval vẫn xanh trên một mình Bảng hàng | Hàng 6 chưa gộp lúc chấm, AC-1 và AC-8 xanh mà Đã gửi chưa từng đo | E2 in danh sách màn đã chạy, thiếu sent thì đỏ | fixed: E2 đỏ 'sent chua co vung'; Notes của hợp đồng: lượt chấm chờ hàng 6 gộp |
| P1 | design, contract, evals | Bản sao nông: commit gốc ghép trông như thêm mọi tệp và mang ngày của nó | Cặp miễn giả xanh trên CI, đúng chỗ Ngoài-3 muốn đóng | Hai ca phá trên kho nhân bản --depth 1: không rõ ngày luật thì đỏ; commit không có cha thì đỏ khi không lấy được cha | fixed: E16 thêm hai ca; AC-10, thiết kế mục 8 và Hỏi-2 (b) nói rõ lấy cả cha và lịch sử sổ khối |
| P2 | evals | Nhật ký thay đổi và bảng hành vi không eval nào đọc; E11 để bài tự khai luật so | Nhật ký thay đổi thiếu dòng hay bảng hành vi còn câu cũ mà vẫn xanh | Ghim chuỗi cấm trong eval; khẳng định dương ở hai nhật ký; đưa hai tệp vào E12 | fixed: E11 ghim 8 chuỗi × 6 tệp và khẳng định dương 'migration 011'; E12 đọc thêm design/behaviors.md và CHANGELOG.md |
| P2 | evals | Địa chỉ cũ mang chữ tìm không ca nào đo; câu giải thích không khớp không được ghim | Địa chỉ cũ lọc ngầm, dòng biến mất mà không ô nào cho thấy | Ca mở /inventory kèm tham số chữ tìm cũ; ghim nguyên văn câu | fixed: E10 thêm ca 'old address' và ca phá; E6 ghim câu theo dòng ST-inventory-khong-khop |
