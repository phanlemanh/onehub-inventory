---
slug: tin-rao-giu-gia-tri-rieng
at: 2026-11-27T03:10:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ «chỉ giữ giá trị đang thắng» ghi máy quyết theo mục tiêu, nhưng câu trích không quyết «lấy lại» về đâu khi tin từng có giá trị tệp | Tin nhập Diện tích 72, đầu chủ gõ đè 75 rồi lấy lại: ô về 70 của danh mục, chủ kho tưởng đã chọn theo mục tiêu | Thành câu hỏi chủ kho, thêm ca vào E5 | human-gate1: Hỏi-7 thay dòng d-20261127T020104Z-5; AC-5 và E5 có ca theo câu trả lời |
| P0 | contract | Ngưỡng ô cơ hội có vế «mức đủ thông tin hiện giá trị của sàn» mà sổ cắt lặng; vế «giá và trạng thái giữ luật» không có đường đo | UAT đọc vế ấy là CHẾT dù mọi bài xanh | Gạch có tên hoặc đo; thêm bài cho vế giá và trạng thái | human-gate1: Hỏi-8 thay dòng d-20261127T020104Z-7, Đường đo ghi vế bị đề nghị gạch; fixed: thêm E13 (bộ bài hàng 4 + ô không mở sửa dưới 768 px) |
| P1 | evals | AC-4, AC-5, E4, E5 ghim chữ «Danh bạ» trong khi Hỏi-4 khuyên «danh mục» | Chủ kho nhận Hỏi-4, E4 và E5 đỏ | Chữ đọc từ bảng nhãn | fixed: AC-4, AC-5 «chữ theo Hỏi-4»; E4, E5 đọc labels.yaml, ca đối chứng chữ cứng |
| P1 | evals | Lọc ở máy chủ và hai người cùng sửa không có bài đo | Lọc Phòng ngủ đọc cột danh mục; người sau đè người trước không báo | Bài lọc trên Postgres; ca 409 | fixed: AC-1 thành xuyên lớp, thêm E1b; AC-2 và E2 có ca phiên bản cũ |
| P1 | evals | E7 dựng lần nhập cũ bằng tay đúng hình bộ đọc | Bản ghi thật khác hình, bước đọc lại ra 0 trên dữ liệu thật | Đi vòng từ bộ ghi thật | fixed: E7 dựng bằng đường ghi thật của hàng 11, đếm số tin bằng số dòng đọc được, ca đối chứng sai hình |
