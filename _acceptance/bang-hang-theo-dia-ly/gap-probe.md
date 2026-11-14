---
slug: bang-hang-theo-dia-ly
at: 2026-11-14T12:52:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | AC-5/AC-1 chưa nói số đếm có bỏ chính lọc Dự án/Toà không, nơi còn 0 sau lọc khác hiện hay ẩn; E8 chỉ đo một nút | Đếm theo cả lọc địa lý: bấm S1.03 thì các nơi khác về 0 rồi biến mất, E8 vẫn xanh | AC-5 ghi rõ; E8 ma trận 10 nút dưới «Đang bán», sau khi bấm các nút khác giữ số, ghim 'nut mat sau khi chon' | fixed: AC-5 (không tính lọc địa lý, nơi 0 vẫn hiện ghi 0), E8 ma trận 10/10, Hỏi-3 trên trang cổng nêu hệ quả |
| P1 | evals | E6 cho chữ gõ tay trùng tên làm sáng nút, mâu thuẫn bất biến AC-4 khi có «Park 1» và «Park 10» | Gõ «… Park 1»: cây sáng Park 1, bảng (chứa chữ) hiện cả Park 10 | Một luật duy nhất; ca Park 1/Park 10 gõ tay; so tập dòng | fixed: AC-4 «sáng khi và chỉ khi tập dòng lọc ra bằng tập dòng của nơi», E6 thêm ca Park 1/Park 10, E7 so tập mã dòng |
| P1 | contract | Vế SP-1 của AC-1 chạm phía máy chủ không gắn (cross-layer); nguồn danh mục toà chưa nêu; E2 phủ định không đối chứng; d-3 trích SP-1 không đủ quyết | Thêm lần đọc ở tệp E2 không quét, E2 vẫn xanh | Gắn (cross-layer), nêu nguồn, E2 có ca phá ghim thông điệp và quét theo import, viết lại d-3 | fixed: AC-1 (cross-layer) nêu nguồn `inventory-sample-rows.ts`; E2 thành bài quét theo import với regex rút từ tệp luật và ca phá 'truy van moi'; dòng sổ mới supersedes d-3 với căn cứ một-lối |
| P1 | contract | Trạng thái ST-inventory-cay-trong không có AC, trục, bài đo | Sàn rỗng: nhóm biến mất hay tiêu đề trống, mọi bài xanh trên 60 dòng | Thêm ca 0 dòng vào AC-1 và bài đo | fixed: AC-1 có câu sàn rỗng; E1 thêm ca rỗng (render câu, đối chứng 60 dòng) |
| P2 | evals | AC-10 đòi 1440 và 360, Tuỳ chỉnh của sàn, ảnh trước/sau; E14 chỉ chụp /sent 1440; E15 không đo cột thứ hai | Cột thứ hai của Đã gửi lệch ở 360 hay Tuỳ chỉnh của sàn mất mục sáng, không bài nào bắt | E14 thêm 4 cặp trước/sau; E15 trỏ tiêu chí nó đo | fixed: E14 trỏ AC-10 với 4/4 cặp ảnh trước/sau (Đã gửi, Tuỳ chỉnh của sàn × 1440, 360); E15 trỏ AC-2 (khuôn Lưới) |
