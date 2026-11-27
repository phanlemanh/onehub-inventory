---
slug: upgrade-design-assembly-0-76-0
at: 2026-11-26T16:44:00Z
verdict: findings
p0: 0
p1: 1
p2: 4
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P1 | design | Dòng sổ d-20261126T164121Z-3 chọn bộ phép đo với nguồn muc-tieu, nhưng câu trích là dòng khuôn đo của hồ sơ 0-69-0 (nói về khuôn 0-33-0 và hai chỗ sửa kho), không quyết được việc bỏ hay thêm phép đo nào ở vòng này [upgrade-design-assembly-0-69-0#F1] | Cổng Phạm vi duyệt việc bỏ ba phép đo (bản sao nông, tầm luật lint, choose-first) vì tin một câu mục tiêu đã chốt nó | Một dòng sổ thay d-3, nguồn mot-loi, nêu lý do riêng cho từng phép đo bị bỏ và cho ba phép đo thêm | fixed: dòng d-20261126T164456Z-14 thay d-3 (supersedes), nguồn mot-loi — ba phép đo bỏ đo vật commit không chạm, AC-8 đỏ nếu commit chạm chúng |
| P2 | evals | AC-6 hứa đỏ khi có emoji, AC-8 hứa LO-TRINH.html chỉ đổi khi đúng bản vẽ, nhưng E11 không có ca emoji và E15 chỉ phá PRODUCT-MAP.md | Phép đo chữ bỏ sót emoji, hay danh sách tệp không so LO-TRINH.html, mà vẫn xanh | Thêm ca emoji vào words và ca LO-TRINH.html vào change-list | fixed: ca «words with an emoji» ghim «words: brandMark holds an emoji»; ca «change-list with one digit changed on the roadmap page» ghim «LO-TRINH.html is not what the records at HEAD draw»; cả hai giữ |
| P2 | contract | AC-7 nhận lệnh vẽ thoát 1 mà không ghim thông điệp; vế «đúng chỗ» chỉ đo chữ có mặt | Lệnh vẽ hỏng vì lỗi khác vẫn thoát 1 mà phép đo đạt; hai khoá tráo chữ vẫn xanh | Đòi thông điệp thiếu hình khi thoát 1; ca tráo khoá hoặc để AC-9 gánh nghĩa | fixed: thoát 1 chỉ nhận khi đầu ra có «note: the components are not drawn», thư mục ra mới tạo mỗi lần (không có book.html cũ); chỗ đứng đo bằng khung chữ quanh mỗi từ. Tráo khoá: phép vẽ không phân biệt được (sổ luôn đặt chữ của khoá vào chỗ của khoá, đã thử — ca tráo xanh), nên AC-7 nói rõ và AC-9/E16 hỏi «câu cột tiếng Việt nói đúng ý câu tiếng Anh CỦA CÙNG DÒNG» |
| P2 | evals | E16 hỏi hội đồng chữ «Logo» có phải lời thường — đó là Hỏi-3 của người; AC-9 đòi viết hoa theo chỗ trên trang mà hội đồng không thấy trang | Chủ kho ký Hỏi-3 dựa trên phán quyết máy; vế viết hoa bị chấm khác điều AC-9 nói | Bỏ câu «Logo» khỏi E16; sửa AC-9 thành viết hoa như câu tiếng Anh | fixed: E16 nói rõ không chấm việc chọn «Logo»; AC-9 đổi thành «viết hoa chữ đầu như câu tiếng Anh của khuôn» và ghi chọn chữ cho «the mark» là Hỏi-3 |
| P2 | contract | Hai dòng Coverage (job e2e, bản sao nông và e2e-db) không trỏ AC hay eval nào | Cổng Bằng chứng trình khi e2e còn chờ hay đỏ trên commit khác | Eval đọc trạng thái job CI trên đúng HEAD, hoặc nêu chốt máy | fixed: Coverage nêu chốt máy — kho bật gop_theo_loi_ky, lệnh gộp theo lời ký chỉ gộp khi CI xanh trên đầu nhánh; lưới trước-gộp đòi hồ sơ đã ký trên cùng PR |
