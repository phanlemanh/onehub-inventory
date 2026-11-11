---
slug: va-dang-nhap
at: 2026-11-11T09:30:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ «đăng xuất lỗi thì giữ phiên và cookie» ghi máy quyết theo câu giao, nhưng câu giao chỉ đòi báo rõ; giữ hay xoá cookie là cân an toàn máy chung với nói đúng sự thật — việc người quyết | Người dùng máy chung bấm Đăng xuất lúc mạng chập chờn, thấy toast rồi bỏ đi; người sau vào thẳng tài khoản; chủ kho duyệt mà không biết có lối kia | Thay bằng dòng chỉ-người có hai lối, khuyến nghị và giá | human-gate1: dòng sổ mới thay dòng cũ, lên thẻ thành một Hỏi |
| P1 | evals | Ca máy chủ lỗi giả 500 ở trình duyệt nên lệnh xoá không tới máy chủ; đếm phiên còn 1 là đúng sẵn | Máy chủ xoá cookie rồi mới lỗi, màn nói chưa thoát mà sự thật khác, bài vẫn xanh | Lỗi máy chủ thật, khẳng định 500, không Set-Cookie xoá, cookie còn, phiên còn; kèm bản phá | fixed: E4, E5, E9, E16 dùng lỗi máy chủ thật (thu quyền chạy hàm xoá phiên trong ca), thêm chiều đỏ có thông điệp ghim |
| P1 | contract | Ô bước chọn sàn của trục chỗ đọc đường trở về không có bài đo trên trình duyệt | Bước chọn sàn tự đọc next không qua hàm kiểm, người hai sàn bị đưa sang trang lạ, ma trận đơn vị vẫn xanh | Ca next-lach-chon-san với người hai sàn | fixed: thêm ca next-lach-chon-san vào E2, AC-2 nêu bước chọn sàn |
| P1 | contract | AC-6 đi qua máy chủ mà thiếu nhãn cross-layer, chỉ có eval lớp ui và chỉ đo nhánh cắt mạng | Hết sàn gặp 500 thì vẫn chuyển bước hay trắng màn, cổng duyệt xanh khi nửa lời hứa chưa đo | Nhãn cross-layer, ca het-san-may-chu-loi, eval backend-effect riêng | fixed: AC-6 mang (cross-layer), thêm ca het-san-may-chu-loi vào E9 và eval E16 backend-effect |
| P2 | design | Ví dụ đường lách phía máy chủ bắt đầu bằng tab, bản cũ vốn đã chặn nên không có chiều đỏ | Ca máy chủ chuyển hướng xanh ngay trên bản cũ, chỗ đọc phía máy chủ coi như không đo | Dùng dạng L6, ghi chiều đỏ | fixed: design và E2 dùng %2F%09%2Fexample.com, chiều đỏ ghi ở đầu tệp kiểm |
