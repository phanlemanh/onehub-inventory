---
slug: so-do-ghi-khong-mat-tang
at: 2026-11-11T04:52:00Z
verdict: findings
p0: 1
p1: 2
p2: 2
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | design | Ba dòng sổ ghi căn cứ sai loại: «không thêm cờ ghi đè» ghi một-lối dù cờ người gõ không còn là lặng lẽ; «phá thử bằng thư mục» coi chmod 000 là chết dù bỏ qua được dưới root; «bỏ ui-observed» trích câu của hồ sơ khác [khai-vai-va-man#F1] | Chủ kho đọc «không có lối khác» nên không cân nhắc cờ ghi đè; người có bản hỏng chỉ còn đường tự xoá tệp mà chủ kho chưa từng chọn | Dòng mới thay dòng cũ; cờ ghi đè thành câu hỏi cho người | human-gate1: dòng 11 thay dòng 4 thành Hỏi-1 (khuyên không thêm cờ); dòng 12 thay dòng 7 — phủ cả thư mục lẫn chmod 000 khi không phải root; dòng 13 thay dòng 9 — một-lối, surfaces chỉ là cli |
| P1 | evals | E3 đo chuỗi có mặt; 'vong' nằm sẵn trong tên tệp, 'tang' trong câu đường gỡ; mẫu dựng tay | Bản cài in một câu chung không kèm chỗ sai vẫn qua ở hai dạng | Ghim nguyên dòng 'sai hinh dang: <nhãn>', cấm nhãn của dạng khác, mẫu gốc từ đầu ra ghi thật, đếm 18 ô | fixed: E3 viết lại đúng như thước đo; nhãn chỗ khai ở design.md |
| P1 | evals | Chỉ E4 kiểm đường gỡ, và chỉ với chuỗi rác | Nhánh thư mục hay sai hình dạng dừng mà không chỉ đường; mọi eval vẫn xanh | Mọi ô dừng khẳng định 'khong ghi de', 'git', '--phan'; E4 dựng lại cho mỗi nhóm | fixed: E1, E2, E3 thêm ba chuỗi ở mọi ô; E4 chạy cho thư mục, chuỗi rác, gốc là mảng; AC-4 nói «ở bất kỳ nhóm hỏng nào» |
| P2 | design | Không nói về khoá vắng mặt (thiếu luot, vong, tang) | Mục thiếu vong qua kiểm, tầng bị bỏ không lời — đúng lỗi đang sửa | Khoá vắng là sai hình dạng; E3 thêm ba ca thiếu khoá | fixed: design và AC-3 thành chín dạng; sổ dòng 14 |
| P2 | evals | E5 chỉ viết rõ một ô lành; không ô nào chứng «--phan thắng tầng cũ» | Hàm đọc mới làm --phan thôi thắng mà E5 vẫn xanh | Ma trận 3 trạng thái × 2 cách gọi, đếm 6 ô, mẫu từ ghi thật | fixed: AC-5 và E5 viết lại đúng như thước đo |
