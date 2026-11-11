---
slug: thanh-ben-nhieu-vai
at: 2026-11-11T03:48:00Z
verdict: findings
p0: 1
p1: 2
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ «dùng kiểu vai sinh từ bản khai» trích câu chỉ nói một người giữ được nhiều vai, không quyết giữa kiểu sinh sẵn và khai lại vai tại chỗ [khai-vai-va-man#F1] | Cổng Phạm vi tin căn cứ đã quyết, không ai thấy lối khai lại vẫn sống | Dòng mới trích luật kho «Use the generated domain types» | fixed: dòng sổ mới thay dòng cũ, căn cứ là câu của AGENTS.md |
| P1 | evals | E4 không đo quan hệ «kiểu vai là kiểu sinh từ bản khai» | Thợ khai tay bốn vai trong thanh bên, E4 vẫn xanh, thêm vai thứ năm thì hai danh sách lệch | So kiểu vai của mục bằng kiểu sinh | fixed: E4 thêm so kiểu bằng Role nhập từ tệp sinh, kiểu khai tay thiếu hay thừa vai thì đỏ |
| P1 | evals | E2 không chứng bảng một vai của hàng 1a không bị sửa | Thợ sửa một ô bảng cũ cho khớp luật mới, bài vẫn xanh | Đo lại luật một vai độc lập | fixed: E2 đo lại 4 tổ hợp một vai trong ma trận viết trước của tệp kiểm mới, viết từ AC-4 của hàng 1a |
| P2 | evals | Mục mẫu không xen kẽ nên thứ tự khai trùng thứ tự «mục chung trước» | Cách dồn mục chung lên đầu vẫn xanh | Mục mẫu xen kẽ và ca đối chứng thứ tự | fixed: năm mục xen kẽ, ca đối chứng ghim 'navigation order changed' |
| P2 | evals | Đếm 80 ô không chứng đủ 16 tổ hợp khác nhau | Ma trận lặp một tổ hợp và thiếu một tổ hợp vẫn đủ 80 ô | So tập khoá với tập tổ hợp con sinh từ bốn vai | fixed: E1 so tập khoá bằng 16 tổ hợp con, mỗi khoá đủ 5 ô |
