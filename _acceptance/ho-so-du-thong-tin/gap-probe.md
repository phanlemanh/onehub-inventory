---
slug: ho-so-du-thong-tin
at: 2026-11-12T23:40:00Z
verdict: findings
p0: 3
p1: 2
p2: 0
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Tập trạng thái «đang mở» của luật một lần chào mở trên một căn là lựa chọn nghiệp vụ mà sổ không ghi | Chủ kho duyệt mô hình không biết Tạm ngừng và Đang giao dịch bị tính là mở; hàng 10 chặn mở lần mới khi lần cũ còn Tạm ngừng | Hỏi chỉ-người; ma trận sáu trạng thái trong E2 | human-gate1: Hỏi-5 (dòng sổ mới); E2 thêm ma trận 6/6 |
| P0 | design | Dòng một-lối về ngày tạo lần chào bỏ sót lối ListingContractDate | Hàng 11 thấy Sheet chỉ có ngày ký với chủ nhà, phải đổi trường | Hỏi chỉ-người có lối khác | human-gate1: Hỏi-6 thay dòng cũ |
| P0 | design | Dòng mục-tiêu về tập riêng cho lần chào cũ trích câu chỉ liên quan, lối gộp vẫn sống | Hàng 10 dựng một bảng duy nhất, phải viết lại cách đọc lần cũ | Hỏi chỉ-người có lối khác | human-gate1: Hỏi-7 thay dòng cũ |
| P1 | evals | E1 không đo kiểu giá trị của bốn trường và nhãn của các giá trị cố định | Bản dựng để cả bốn là chữ mà E1 vẫn xanh | Bảng kiểu viết trước, ca phá đổi kiểu | fixed: E1 so kiểu 5/5, kiểm nhãn giá trị cố định, ca phá 'listing field type: furnished' |
| P1 | evals | Dữ liệu mẫu không bảo đảm căn ba lần chào khác nhau ở giá, mức đủ, xác nhận; E7 có thể đúng rỗng | Lần cũ trùng giá trị, hồ sơ không đổi mà E7 xanh | E2 khẳng định căn ba lần khác nhau; ca phá giữ giá | fixed: E2 thêm khẳng định, E7 thêm ca phá 'old listing price not shown' |
