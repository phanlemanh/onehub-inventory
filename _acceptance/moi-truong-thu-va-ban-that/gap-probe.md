---
slug: moi-truong-thu-va-ban-that
at: 2026-11-16T03:52:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Phản biện ngữ cảnh sạch — hàng 22

Tác tử tươi, chỉ đọc design.md, contract.md, evals.yaml, decisions.jsonl, opportunity.md và bài học của các hồ sơ trước.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design, contract AC-5 | Câu trích «thiếu cấu hình thì không khởi động» không quyết luật tên miền gửi thư; tên miền nào được xác minh ở Resend là việc của chủ kho [kiem-vong-doi-thao-tac#F2] | Chủ kho xác minh một tên miền con riêng cho thư, bản thật không khởi động | Đổi thành câu hỏi cho người, ghi vào ma trận AC-5 và E5 | human-gate1: thành Hỏi-7 (dòng sổ mới thay d-20261116T031557Z-10); địa chỉ bản thật giữ căn cứ 0041 |
| P0 | design | Dòng «một lối» nói lối một dự án Vercel chết trong khi thiết kế viết nó chạy được | Chủ kho dựng hai dự án, hai bộ khoá vì tin không còn đường khác | Ghi lại với lý do thật, trình ở Cổng Phạm vi | human-gate1: thành Hỏi-6 (dòng sổ mới thay d-20261116T031557Z-7), thiết kế ghi lối kia vẫn sống |
| P1 | contract, evals | Phép chặn migration xoá hay đổi tên của Hỏi-4 không có tiêu chí và eval | Chủ kho chọn «có», máy dựng thiếu phép chặn, mọi eval vẫn xanh | Tiêu chí có điều kiện + ca trong E2 kèm đối chứng dương | fixed: thêm vế có điều kiện vào AC-2 và ca vào E2 |
| P1 | contract, evals | Ngưỡng «đường trong thư trỏ đúng địa chỉ mới» không có phép đo | Đường dẫn thư mời trỏ về máy dev hay địa chỉ cũ, mọi eval xanh | Ca đọc thân thư giả với APP_URL bản thử và bản thật, kèm bản phá | fixed: thêm vế vào AC-5 và E5, sửa bảng Đường đo |
| P1 | evals E6 | Lối chọn vai chỉ thử khi chưa đăng nhập; không đối chứng dương; số ca không đối với sổ | Người đã đăng nhập dùng ?vai= đổi được vai trên bản thật mà E6 vẫn xanh | Ca có phiên tự ký, đối chứng dương trên máy dev, đếm ca bằng số mục > 0 | fixed: AC-6 và E6 thêm ba vế ấy |

Ngoài năm mục: AC-3 ghi «tám bước» trong khi mỗi môi trường chạy bảy — fixed: sửa chữ ở AC-3.
