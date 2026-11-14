---
slug: thanh-vien-chon-tu-reui
at: 2026-11-14T13:35:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | design | Dòng sổ bỏ bảy vùng của solution-users-8 dẫn câu của khuôn Lưới, câu ấy chỉ quyết ô tìm | Chủ kho tưởng cả bảy vùng bỏ có lời mục tiêu làm căn cứ, thật ra sáu vùng máy tự quyết theo khuôn của lối A | Tách dòng sổ: ô tìm trỏ quyết định 0028; Alerts, chỗ ngồi, CSV, Guests, Invites là một-lối theo luật mời hàng 9; nút xoá người là một-lối theo bảng quyền giữ nguyên | fixed: ba dòng sổ mới thay dòng cũ, ô tìm trỏ wiki/decisions/0028 |
| P1 | contract | Ngưỡng ẩn cột người mời ở 1024 lệch giữa thiết kế và AC-2 | Dựng theo một bên thì phép đo hay ảnh chấm bên kia đỏ | Một ngưỡng theo bề rộng khung, ghi cùng lời ở thiết kế, AC-2, E2, có ca biên | fixed: ngưỡng 896 px và 672 px theo bề rộng khung danh sách, E2 có ca 895 và 896 |
| P1 | evals | E8 chỉ quét axe, ma trận đặt ở tệp bị khoá | Trạng thái hiện sai nội dung mà axe sạch vẫn xanh; thêm trạng thái vào tệp hàng 9 làm E3 đỏ | Ma trận chín trạng thái ở tệp bài mới, kiểm nội dung từng trạng thái, có ca đối chứng | fixed: E8 đặt ma trận ở tests/e2e-db/thanh-vien.spec.ts, kiểm nội dung và ca đối chứng ghim câu |
| P1 | evals | Lời hứa bài hàng 9 không đổi lời không có lệnh đo | Thợ sửa chuỗi expect cho xanh mà E3 vẫn đạt | Lệnh so diff ba tệp với nhánh chính, chỉ nhận đổi bộ tìm dòng, có ca đối chứng | fixed: E13 tests/thanh-vien-khoa-bai.test.ts trong thanh_vien_unit |
| P2 | contract | Chọn A không nêu đủ phép đo phải viết lại; AC-3, AC-4 đi qua máy chủ thiếu nhãn xuyên lớp | Chủ kho chọn A mà phép đo đã duyệt vẫn đo lối B | Notes liệt đủ việc đổi khi chọn A; gắn (cross-layer) và phép đo lớp máy chủ | fixed: Notes và thiết kế mục «Nếu chủ kho chọn A»; AC-3, AC-4 gắn (cross-layer), E4 và E14 layer backend-effect |
