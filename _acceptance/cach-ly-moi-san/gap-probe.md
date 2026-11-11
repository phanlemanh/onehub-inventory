---
slug: cach-ly-moi-san
at: 2026-11-10T23:04:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract, evals | Ca quét chỉ kiểm luật có mặt; luật đọc không ai soi; E9 không có bản phá luật đọc; chiều đỏ của E2 không có thật [go-hoi-khi-gop#F3] | Hàng sau thêm bảng có luật using (true) hay with check (true), bộ kiểm vẫn xanh trong khi sàn A đọc dữ liệu sàn B | Kiểm nội dung luật, thêm bản phá luật đọc mở và bảng mới luật mở, thêm đối chứng dương cho E2 | fixed: AC-6 kiểm nội dung từng luật (gọi sàn của phiên, nhắc cột sàn); AC-9 thêm bản phá (c) luật đọc mở, (d) bảng mới luật mở; E2 thêm ca doi-chung-vai-chu-thay-du, chiều đỏ của E2 trỏ bản (c) |
| P0 | design, sổ | Căn cứ muc-tieu của lựa chọn quét danh mục chỉ liên quan, không quyết; phạm vi quét không tường minh | Cổng 1 không soi lựa chọn, lỗ ở dòng trên đi qua | Ghi lại dòng sổ với căn cứ đúng và phạm vi tường minh | fixed: dòng sổ mới d-20261110T225708Z-10 mang supersedes d-20261110T225209Z-9, nguồn mot-loi, phạm vi schema public + cột company_id + companies; design mục 4 nêu phạm vi |
| P1 | design, evals | Không ca nào đo sàn chuỗi rỗng và kết nối đã dùng; câu đặt sàn của bộ kiểm không ràng với câu của cửa | Hàm sàn của phiên lỗi khi chuỗi rỗng, hay cửa đổi câu mà bộ kiểm giữ câu cũ, cả hai vẫn xanh | Thêm hai ca SQL và một bài kiểm đơn vị ràng câu | fixed: AC-2 thêm hai trạng thái (san-rong-khong-thay-gi, ket-noi-da-dung-khong-thay-gi); AC-7 và E7 ca (5) đọc cach-ly.sql, đòi nguyên văn hai hằng câu của cửa, có đối chứng chuỗi lệch |
| P1 | evals | Dòng tổng ghim 15 ca mà chỉ kê 14 tên; không ma trận viết trước [go-hoi-khi-gop#F4] | Cài đặt đúng thì đỏ, hoặc ca bị bỏ được bù bằng ca không khai | Kê đủ ma trận, mỗi ok đúng một lần, n bằng độ dài danh sách | fixed: ma trận 19 ca viết đầu evals.yaml và design mục 4; E9 đòi mỗi ok đúng một lần, không HỎNG ở bản lành, tổng bằng 19 |
| P1 | evals, contract | Bộ quét sẽ báo chính tệp bài kiểm; Notes chỉ khai một chỗ chạm dấu hiệu SP-1 | E8 đỏ dù làm đúng, hoặc tệp mẫu bị băm để né khuôn | Khai tập miễn tường minh, thêm ca tệp ngoài tập miễn bị báo, kê mọi chỗ chạm SP-1 | fixed: AC-8 và E8 khai tập miễn hai tệp và ca tệp chép nội dung bài kiểm ra ngoài tập miễn thì bị báo; Notes kê ba chỗ chạm SP-1 có chủ đích |
