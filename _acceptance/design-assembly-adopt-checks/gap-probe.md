---
slug: design-assembly-adopt-checks
at: 2026-11-23T02:05:00Z
verdict: findings
p0: 1
p1: 2
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | contract | Ba phần cắt khỏi vòng (nguồn phông Inter, 16 loại phần tử chưa đo cỡ chạm, ba luật lint) chỉ nằm ở Out of scope, sổ không có dòng nào | Người duyệt chỉ thấy Hỏi-1, ký PR mà không thấy giá của ba phần cắt | Mỗi phần cắt một dòng sổ, có giá nếu sai | fixed: ba dòng sổ descope (d-20261123T014845Z-8, -9, -10), mỗi dòng nêu vì sao máy không làm được trong vòng và giá nếu sai; phông Inter không thành câu hỏi vì chỉ còn một lối sống (giấy phép là lời người, công cụ không viết dòng phông nạp từ ngoài), và dòng font-loaded không đổi gì về nguồn hay giấy phép so với trước PR |
| P1 | evals | Ma trận AC-4 không tính tài liệu thiết kế của hồ sơ, phải commit vì hợp đồng trỏ tới nó | Commit hồ sơ xong E6 đỏ vì gặp tệp thứ năm | Loại trừ đúng tệp design_doc, có ca đỏ cho tệp khác trong docs/ | fixed: DESIGN_DOC vào ma trận, dòng ghim thành «files changed: 5», thêm ca đỏ «tệp khác trong docs/» |
| P1 | contract | Không tiêu chí nào đo trang luật cho tác tử, dù tác tử dựng màn đọc nó | Trang sai thêm chỗ khác mà Cổng 1 tin chỉ một dòng sai | Đo quan hệ trang với dữ liệu kiểm tra, ca đỏ trên bản sửa một dòng | fixed: thêm AC-5 và E7 (đủ sáu mục, Controls và Type khớp design/theme.json, đúng một dòng sai đã biết), bốn ca đỏ. Không sinh lại trang để so vì bộ sinh chỉ có trong plugin, ngoài kho |
| P2 | evals | Nhãn decision là chuỗi trong tệp; không đo bài mang nhãn có thật sự chạy | Bài độ dày bảng bị skip mà pointers vẫn xanh | Lấy danh sách bài từ trình chạy, đỏ khi bài bị skip | rejected: nhãn ở kho này là nhãn cấp tệp, không gắn từng bài; các test.skip hiện có trong grid.spec.ts và frame.spec.ts là bỏ theo cỡ màn có chủ ý (điện thoại hay màn rộng), và E5 chạy đủ bốn cỡ nên mỗi bài chạy ở cỡ của nó |
| P2 | evals | BASE ghim cứng, gộp main vào nhánh sẽ làm E6 đỏ | Gộp main trước khi trình cổng thì E6 đỏ, phải ghim lại ma trận | Tính merge-base lúc chạy | fixed: E6 tính merge-base với origin/main mỗi lần chạy, mã ghim chỉ là đường lùi khi không đọc được origin/main |
