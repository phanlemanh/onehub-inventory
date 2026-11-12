---
slug: luu-goc-nhin-cot-hai
at: 2026-11-12T14:10:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ d-20261112T135429Z-11 cho máy tự quyết khe `SecondColumnSlot` với căn cứ «một lối», nhưng lối chết chỉ loại cấu hình tĩnh; lối layout đọc góc nhìn theo người xem còn sống, lý do thật là giới hạn vùng | Cổng Phạm vi duyệt một cửa mới trên App Shell mà không biết có lối khác; khe phía trình duyệt nháy khi đổi trang hoặc thiếu mục ở ngăn trượt | Thay dòng sổ, nêu lối chết chứng được hoặc đưa lên cổng | fixed: chọn lối layout đọc góc nhìn trên máy chủ (mục có ngay lần vẽ đầu, ngăn trượt dùng chung cấu hình); dòng mới supersedes -11; design, plan đổi theo; xin G chạm layout và nav.ts |
| P1 | contract | AC-7 và E8 thiếu việc lưu thay đổi cách xem của người khác qua PATCH | B cùng sàn ghi đè cách xem của A mà E8 vẫn xanh | AC-7 thêm lưu thay đổi; E8 thành 3 × 5 = 15 ô kèm ca phá ghim thông điệp | fixed: AC-7 và E8 thêm việc lưu thay đổi, ma trận 15 ô, ca phá 'saved view overwritten by another member' |
| P1 | evals | AC-3 «đầu màn mang tên góc nhìn» và «bấm lại mục thì về đúng cách xem đã lưu» không eval nào đo | Bấm lại cùng địa chỉ không làm gì, lưới giữ thay đổi, mọi eval vẫn xanh | Thêm ca 'reselect discards changes' vào E5 | fixed: E5 thêm ca bấm lại, khẳng định mã căn, dấu đã đổi mất, đầu màn mang tên; ca phá ghim thông điệp |
| P1 | contract | Quyền mâu thuẫn: thiết kế nói bốn vai, bảng Vai × Màn chặn Quản trị sàn; không dòng sổ, không eval vai bị từ chối ở API | Quản trị sàn tạo được góc nhìn qua POST mà mọi eval xanh | Sửa cho khớp, thêm dòng sổ, ma trận 4 vai × 3 thao tác | fixed: ba vai đọc Bảng hàng (căn cứ Vai × Màn của 2a), dòng sổ muc-tieu, E8 thêm ma trận 12 ô với 403 cho Quản trị sàn |
| P2 | evals | E15 hỏi lựa chọn nằm ngoài tệp của nó; Coverage trỏ trục khổ sai eval; ngăn trượt điện thoại chỉ có phán xét bằng mắt | Người chấm đoán lựa chọn; mục góc nhìn thiếu ở 360 mà không bài script nào đỏ | Ghi lựa chọn vào câu E15, sửa trỏ, thêm ca 360 vào E2 | fixed: E15 nhận design.md làm input và máy ghi lối đã chốt sau cổng; Coverage trỏ E2, E13, E15; E2 thêm ca 'phone sheet' ở 360 |
