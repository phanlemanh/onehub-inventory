---
slug: lop-rieng-cua-san
at: 2026-11-13T10:26:22Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | E8 so quyền với chính actions.yaml vòng này viết; E12 không có ca dương cho vai được ghi | actions.yaml khai thiếu Đầu chủ thì E8 vẫn xanh, hàng 11 hỏng | Bảng 8 ô viết sẵn theo Hỏi-1; Đầu chủ POST nhận 200; mỗi vai được ghi đếm nút > 0 | fixed: E8 dùng bảng viết sẵn trong bài, E12 thêm ca dương ba vai |
| P1 | evals | Trần của E2 chỉ có ca phủ định; trần 30 lựa chọn ở cơ sở dữ liệu không đo | Trigger đếm cả trường đã ngừng thì sàn kẹt ở 20 mà E2 vẫn xanh | Ca 1 và 30 lựa chọn nhận; ngừng rồi tạo mới nhận; 31 lựa chọn chèn thẳng bị từ chối có lỗi ghim | fixed: E2 thêm ba ca, AC-2 nói trường đã ngừng không tính trần |
| P1 | design, contract | Không có luật khi ngừng trường mà mẫu nhập, từ điển còn trỏ vào | Mẫu cũ ghi cột vào trường đã ngừng, ô bị loại ở hàng 11 | Sau khi ngừng: từ điển không tra ra, mẫu đánh dấu cột | fixed: AC-4, AC-6, lõi thiết kế, E4, E6 thêm vế; sổ dòng supersede |
| P1 | design (sổ) | Dòng cắt trạng thái riêng mang căn cứ không quyết việc ấy | Chủ kho tin máy có căn cứ, sau đó sàn có trạng thái riêng bị ép | Đổi thành câu hỏi cho chủ kho | fixed: thành Hỏi-6 (supersedes dòng 5) |
| P2 | design, contract | Không luật cấm tên trùng giữa trường riêng, nhãn riêng, nhãn chuẩn | Bảng hàng hiện hai cột cùng tên, màn nhập ghép nhầm | Luật trùng sau gấp chữ; ca từ chối ở E2, ca giao diện ở E12 | fixed: AC-2, lõi, E2 (4 ca), E12 |
