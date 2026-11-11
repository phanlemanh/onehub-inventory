---
slug: luoi-va-o-theo-kieu
at: 2026-11-11T01:52:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ về cách khai cột dẫn câu trích quyết «Lưới nhận tên trường», trong khi thiết kế cho màn tự đưa kiểu | Hàng 2 gán kiểu money cho một cột chữ để nó canh phải; Lưới canh lệch đúng kiểu lỗi hàng này sinh ra để chặn mà các eval vẫn xanh | Cột khai bằng tên trường, kiểu tra từ bảng sinh; ca kiểm kiểu chặn khai kind | fixed: thiết kế, AC-2 và E2 đổi sang khai bằng tên trường, có ca @ts-expect-error trong make typecheck; dòng sổ mới thay dòng cũ (supersedes) |
| P0 | contract | Dòng sổ hoãn ba trạng thái dùng lối chết không có thật | Cổng Phạm vi duyệt bỏ Một phần hỏng và Không đủ quyền vì tin là không thể, hàng 2 phải mở lại Lưới chung | Làm hai trạng thái dựng được, chỉ hoãn trạng thái thật sự cần thao tác lưu | fixed: AC-8 thêm một phần hỏng và không đủ quyền, E8 và E10 thêm ca; chỉ còn hoãn Xung đột khi lưu, dòng sổ mới thay dòng cũ |
| P1 | evals | Mật độ chỉ đo hàm thuần, không đo Lưới thật | Lưới truyền hằng nên ở 360 vẫn dòng cao, eval vẫn xanh | Đo chiều cao dòng và cỡ chữ trên lưới thật ở hai khổ, có đối chứng | fixed: thêm E14 đo 40px/14px ở 360 và 414, 48px/16px ở 1440, đối chứng 'density not applied' |
| P1 | evals | Ma trận E1 và E3 tự đo chính nó, thiếu giá trị falsy và mẫu viết trước | Mẫu money ngắn làm giá lớn bị cắt; count 0 hiện «—» mà eval vẫn xanh | Bảng mẫu nguyên văn, kiểm đầu ra biên không vượt mẫu, thêm falsy | fixed: E3 ghi nguyên văn 11 mẫu và kiểm giá trị biên; E1 thành 24 ô có count 0 và false, đối chứng 'falsy rendered as empty' |
| P1 | evals | Vế «dưới 1 giây không chỉ báo» không có đối chứng dương | Lớp trễ bị bỏ, khung chờ nháy ngay mà ca 500 ms vẫn xanh | Đo visibility tính được ở 500 ms và đối chứng gỡ lớp trễ | fixed: E8 đo visibility hidden trên phần tử có mặt ở 500 ms, đối chứng 'skeleton shown before 1s' |
