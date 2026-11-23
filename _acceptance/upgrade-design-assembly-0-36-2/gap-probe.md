---
slug: upgrade-design-assembly-0-36-2
at: 2026-11-23T08:05:00Z
verdict: findings
p0: 0
p1: 1
p2: 3
---

# Phản biện context sạch

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P1 | design | Dòng sổ «không sửa hồ sơ đã ký, để E7 của nó đỏ vĩnh viễn» ghi căn cứ muc-tieu, trích dòng Ngoài phạm vi của hồ sơ khác (0.33.0, nói về hồ sơ 0.7.1) — tiền lệ, không phải lời chủ kho cho hồ sơ này. Cùng dạng [lui-ban-luc-xoay-mat-khau#F2], [nang-kit-3-1#F1] | Cổng duyệt việc để một hồ sơ đã ký đỏ vĩnh viễn trên căn cứ «chủ kho đã chọn» không có thật; lối ghi dòng fix vào hồ sơ cũ chưa được chứng là chết | Dòng sổ supersedes với căn cứ đúng, hoặc chi-nguoi lên thẻ | fixed: dòng sổ mới thay d-8, căn cứ chi-nguoi, lên thẻ thành Hỏi-3 kèm khuyến nghị và giá của lối khác |
| P2 | design | Dòng «đọc plugin từ kho nguồn ghim commit» ghi mot-loi với lối chết «bản cài chỉ có tới 0.36.1» — lối cài 0.36.2 còn sống; ba AC chỉ chấm được trên máy có kho nguồn | Máy chấm khác hay CI không có ~/dev/design-assembly thì E3/E4, E7/E8, E9/E10 đỏ «cannot read» | Viết lại căn cứ, nêu lối cài bản bị loại; ghi giới hạn máy chấm | fixed: dòng sổ mới thay d-7 — bộ nhớ đệm không ghim commit nên không tái lập, cài là đổi cấu hình plugin cấp người dùng; Notes của contract đã ghi ba AC chỉ chấm được trên máy có kho nguồn |
| P2 | design | Dòng d-3 dùng câu trích chỉ quyết «việc riêng» cho cả phần «chấm sau khi làm, không làm lại» | Cổng duyệt cách chấm sau khi làm như thể chủ kho đã chọn | Tách dòng sổ | fixed: hai dòng mới thay d-3 — «việc riêng» giữ muc-tieu; «chấm sau khi làm» ghi mot-loi (upgrade tất định, AC-2 và AC-4 tái tạo nên làm lại không đổi byte nào) |
| P2 | evals | AC-5 hứa ba vế (0 dòng, không tệp để viết, đúng một câu hỏi) mà chiều đỏ chỉ phá vế «0 dòng» | adopt có thêm câu hỏi mới hay có tệp để viết mà E9 vẫn xanh | Thêm ca phá có đối chứng dương cho hai vế còn lại, ghim thông điệp | fixed: hai-chieu.mjs thêm hai ca trên đầu ra thật của adopt (xanh khi chưa sửa; đỏ với 'adopt asks 2 question(s), not the one font-source question' và 'adopt did not say (nothing): nothing to write'); kê ở expected của E10 |
