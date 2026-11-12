---
slug: thu-moi-dia-chi-tu-cau-hinh
at: 2026-11-12T02:20:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Không eval nào kiểm bộ xử lý mời người ở bản thật nhận đúng bộ gửi do cấu hình dựng (runtime.ts) | runtime.ts tự dựng bộ gửi khác, mọi eval vẫn xanh vì gọi thẳng bộ gửi của cấu hình | Ca nối runtime, hoặc đưa runtime.ts vào inputs của E8 | fixed: E8 đọc thêm runtime.ts và members.ts, hỏi ba câu (nối bộ gửi · gọi deps.invite · không đường lấy origin) |
| P1 | contract | Câu Hỏi https/http còn mở mà AC-4, E4 và thiết kế đã viết sẵn đáp án https | Chủ kho chọn nhận cả http, hợp đồng đã duyệt tự mâu thuẫn | Ghi rõ vế https phụ thuộc câu trả lời | fixed: AC-4 đánh dấu «chờ Hỏi-1», E4 nói giá trị http chuyển phía theo câu trả lời, thiết kế ghi «khuyến nghị» |
| P1 | evals | E2 và E6 chỉ quét subject và text, bỏ html và trường khác | Thư thêm phần html dựng từ gốc yêu cầu, eval vẫn xanh | Quét toàn bộ payload gửi Resend | fixed: E2, E6 chuỗi hoá trọn payload (E6 trừ trường from), giữ đối chứng dương |
| P2 | evals | «Không in giá trị» chỉ so nguyên chuỗi, bỏ phần bí mật và lỗi gốc | Thông điệp in 'u:p@app.example.test' hay cause mang giá trị | So cả message và cause, phần sau :// và 'u:p' | fixed: E4 thành 6 × 3 assert trên message và cause |
| P2 | evals | Dòng chú thích của .env.example không ghim chữ; quét địa chỉ bỏ http:// | Chú thích sai nghĩa hay địa chỉ thật dạng http lọt | Ghim cụm cố định, quét http và https | fixed: E7 ghim «bắt buộc ở bản thật», quét /https?:\/\// |
