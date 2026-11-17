---
slug: app-shell-khuon-dau-trang
at: 2026-11-17T00:20:00Z
verdict: findings
p0: 1
p1: 2
p2: 2
---

# Phản biện context sạch — app-shell-khuon-dau-trang

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals | Không eval nào đo menu tài khoản khi đã đăng nhập: tên và email một dòng, sàn đang mở, ba giao diện, đường phím mũi tên, người một sàn không có Đổi sàn | Email dài vẫn bẻ dòng hay hàng Giao diện không hiện khi đã đăng nhập mà E4, E5, E12 vẫn xanh | Bài có đăng nhập ở bốn khổ: menu ≥ 256 px, tên và email trọn một dòng, sàn đang mở, ba giao diện, mũi tên qua Đổi sàn (hai sàn) hay thẳng tới giao diện (một sàn) rồi Đăng xuất; cặp đỏ cho email bị cắt hay bẻ dòng | fixed: thêm tests/e2e-db/app-shell-verve.spec.ts (ba bài kèm một bài đỏ ghim «text does not show whole on one line»), eval E15; E12 thêm khung menu khi đã đăng nhập |
| P1 | evals | Đầu trang mảnh và viền cột chỉ đo trên màn không cần đăng nhập; Thành viên, Tuỳ chỉnh của sàn chưa đo; vị trí nút chính chưa đo | Ở Tuỳ chỉnh của sàn nút chính rớt xuống hàng hai hay viền dừng ở 240 px mà E2, E6 xanh | Đo trong bộ có đăng nhập ở 1024, 1440: h1 ≤ 14 px, nút chính ở cuối hàng ≤ 40 px, viền ≥ chiều cao cửa sổ trừ 80 px; cặp đỏ cho nút rớt hàng | fixed: bài «members and company layer» trong tests/e2e-db/app-shell-verve.spec.ts kèm bài đỏ ghim «primary action is not at the end of the thin head», eval E16 |
| P1 | design | Chưa có dòng sổ cho cách xếp menu tài khoản khi không bày được ứng viên ReUI Pro | Chủ kho ký A4 tưởng đã lấy khối ReUI; vòng sau khối ReUI khác dáng, dựng lại | Dòng sổ chi-nguoi kèm lối khác và giá | human-gate1: dòng sổ mới (nguồn chi-nguoi) lên thẻ thành một câu hỏi |
| P2 | evals | E1 chỉ đo Tab, chưa đo rê chuột và vị trí dải khi gập; E3 chưa đo nút tìm điện thoại ở cuối thanh | Rê chuột không bẻ mũi tên, dải sai chỗ khi gập, nút tìm điện thoại mất mà E1, E3 vẫn xanh | Rê thì xoay ±40deg (chưa chạm 0); gập thì dải trên mép trái vùng màn giữa cửa sổ; điện thoại nút tìm cách mép phải thanh ≤ 12 px | fixed: tests/e2e/app-shell.spec.ts thêm bài rê chuột, vị trí dải khi gập, vị trí nút tìm điện thoại; E1, E3 cập nhật |
| P2 | design | Dòng bỏ design-pass không ghi khổ chủ kho đã xem | Phần điện thoại duyệt bằng chữ | Ghi khổ đã xem, đính ảnh điện thoại ở cổng | fixed: dòng sổ mới thay dòng cũ (supersedes); thẻ cổng đính ảnh điện thoại 375 px (danh sách và tấm menu), ảnh 360 và 414 ở Cổng Bằng chứng |
