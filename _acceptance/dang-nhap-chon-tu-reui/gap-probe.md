---
slug: dang-nhap-chon-tu-reui
at: 2026-11-14T02:15:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | AC-7 trả lời trước câu hỏi tạo họ «dang-nhap» (dòng sổ chi-nguoi còn chờ) | chủ kho chọn để ngoài bản đồ mà hợp đồng đã ký vẫn đòi gắn họ | AC-7 hai nhánh theo Hỏi-2 | fixed: AC-7 viết hai nhánh theo câu trả lời Hỏi-2 |
| P1 | evals | Phép đo chỉ viết cho lối A; lối B đảo ngược cặp phá thử «khung bọc biểu mẫu» | chủ kho chọn B, bộ đo đã duyệt bắt màn đúng phải đỏ | ghi bản đo cho B và C | fixed: mục «Lối khác» trong evals.yaml và hợp đồng nêu E1, E1b, E4 và cặp phá thử của B, C; chữ ký cổng cho lối ấy là chữ ký cho các dòng đó |
| P1 | evals | E4 nhờ mắt xác nhận «chữ y như trước»; thiếu hai trạng thái xin mã quá nhiều và phiên không còn sàn | máy sửa một câu khi ghép khối, ảnh không lộ | ca máy so câu copy.ts với 42a231f + hai ảnh thiếu | fixed: thêm E4b ca 'giu-cau-copy' có phá thử; AC-4 và E4 thêm hai trạng thái |
| P1 | evals | AC-5 thiếu ca «nút trong khung nhìn đầu» và axe ở bốn khổ (account.spec bị khoá không đổi) | khổ 360 đẩy nút khỏi màn đầu mà E5 vẫn xanh | hai ca mới trong dang-nhap-khoi.spec.ts | fixed: ca 'nut-trong-man-dau' và 'axe-dang-nhap' bốn khổ sáng tối, mỗi ca có phá thử |
| P2 | contract | Đường đo gán ngưỡng «trang cổng có 2–3 khối kèm ảnh» cho AC-7, mà AC-7 không đo trang cổng | trang cổng thiếu ảnh khối gốc mà không eval nào đỏ | đếm trên trang cổng hoặc sửa Đường đo | fixed: Đường đo ghi đúng — người soi ở Cổng Phạm vi và giám sát soi ảnh; nhóm Ứng viên ReUI của chứng minh màn (ba khối, mỗi khối một ảnh) do lưới đọc |
