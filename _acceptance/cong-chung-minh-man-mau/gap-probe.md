---
slug: cong-chung-minh-man-mau
at: 2026-11-11T04:44:12Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | design | Triết lý và bộ mặt so của họ Lưới là việc người quyết mà sổ ghi máy quyết; lối khác của bộ mặt so chưa chết | Chủ kho lướt qua ở Cổng Phạm vi, mọi màn Lưới so theo bộ mặt người chưa quyết | Dòng sổ chỉ-người kèm khuyến nghị và lối khác | fixed: triết lý ghi căn cứ trích nguyên câu của 0019 (câu ấy quyết); bộ mặt so thành câu hỏi cho người (dòng mới thay dòng cũ) |
| P0 | design | Câu trích 0019 ở dòng «lối do máy suy» chỉ kể sự cố, không quyết | Cổng không xét lối vòng tự khai | Thay bằng căn cứ một-lối có lối chết thật | fixed: dòng mới nguồn một-lối — tự khai thì vòng khai họ mới để né so |
| P1 | design, contract, evals | Thiếu ca màn chính là màn mẫu; ai lật Màn: chưa có | Sửa Bảng hàng sau khi nó thành màn mẫu thì lưới so màn với chính nó | Ba giá trị của Màn: mỗi giá trị một mã | fixed: lối màn mẫu mới áp cả khi Màn: là chính màn ấy; hồ sơ mở đủ ma trận cũng tính; vòng màn mẫu đầu tự lật tệp họ; AC-6, E6 thêm ca |
| P1 | contract, evals | Không đòi bảng Khối có mặt và có dòng | Xoá mục Khối thì lưới xanh | Mã thieu-bang-khoi kèm đối chứng | fixed: AC-8, E8 thêm thieu-bang-khoi |
| P1 | evals | Bản phát lại không ghim nguồn | Gán nhãn cho khớp số đích | Commit 40 ký tự và mục gốc mỗi mã L | fixed: ghim kho, đường, commit fed33adc… và mục §1–§12 mỗi mã; E5 kiểm |

Ghi chú ngoài đếm (số đo --report chưa có eval): fixed — E1 thêm ca đếm theo lối, lệch, rơi bậc.
