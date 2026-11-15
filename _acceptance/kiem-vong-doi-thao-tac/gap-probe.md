---
slug: kiem-vong-doi-thao-tac
at: 2026-11-15T03:08:00Z
verdict: findings
p0: 3
p1: 2
p2: 0
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Câu tính năng nói «theo từng vai» mà Out of scope bỏ kiểm theo vai do máy quyết, AC-8 chỉ in báo cáo | Đầu chủ thấy căn mà bị chặn sửa, ô sửa vẫn xanh vì vai khác sửa được; chủ kho ký tưởng vai đã được giữ | AC đỏ theo vai kèm ma trận viết trước, hoặc câu hỏi ở cổng | human-gate1: thành Hỏi-4 (d-…-12) — khuyến nghị đỏ theo vai ở ô xem (vai mở được màn phải xem được thứ màn hiện, kê «chan» nếu không), thêm/sửa/gỡ theo vai giữ ở bảng quyền và in báo cáo; AC-8 và E8 sửa thành phép đỏ có ca phá; Out of scope ghi «chủ kho, ở Hỏi-4» |
| P0 | design | Dòng d-…-5 trích câu bật làm căn cứ cho cả bốn luật chặt mà câu chỉ quyết ba dạng ô | Chủ kho tưởng luật chặt đã nằm trong câu bật nên không soi | Viết lại dòng sổ; luật chặt có căn cứ riêng hoặc thành câu hỏi | fixed: d-…-11 thay d-…-5, chỉ giữ ba dạng; bốn luật chặt và luật vai gom vào Hỏi-4 (d-…-12) |
| P0 | design | Dòng d-…-6 «một lối» bỏ qua lối trang quyết định wiki; chỉ đòi decided_by thì máy tự ghi được | Ô «không» trỏ dòng máy tự ghi decided_by, phép kiểm xanh | Đòi dòng cổng, ca phá có câu ghim | fixed: d-…-13 thay d-…-6 — dòng được trỏ phải có decided_by VÀ stage là cổng (gate1, gate2); E5 thêm ca phá «khong phai dong cong»; kẽ còn lại (máy ghi giả một dòng cổng) và lối wiki ghi thẳng trong dòng sổ |
| P1 | evals | AC-3 «đúng một dạng» mâu thuẫn ô «co dự kiến kèm hàng» và ca phá E3 | Một trong E3, E4 tất đỏ | Ghi luật co+hang; ca đối chứng | fixed: AC-3, AC-4 nói rõ co kèm hàng chỉ khi dự kiến, đang chạy kèm hàng đỏ «dang chay, bo hang»; ca phá E3 đổi thành co cùng khong, thêm đối chứng createListing kèm hàng 12; E4 thêm ca inviteMember kèm hàng |
| P1 | evals | E7 đòi Listing.sua hàng 3g trong khi bảng ghi co updateListing | E7 đỏ hoặc lệch bảng duyệt | Một ô riêng máy đọc được cho phần ngoài giá | fixed: ô riêng Listing.rieng.sua_ngoai_gia hàng 3g trong bảng Hỏi-3 và E7 |
