---
slug: danh-muc-can-nhu-onehub-invest
at: 2026-11-12T10:40:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Sổ ghi máy tự quyết thêm dạng mã thứ 9 «S1.05-1208» mà invest không có; câu trích không quyết việc thêm; dòng bỏ đường ghi trích sai căn cứ | Chủ kho duyệt vì tin máy quyết theo mục tiêu, rồi hai kho đọc lệch 432 mã gốc mẫu | Dòng sổ mới nguồn chỉ-người thành Hỏi-4; dòng bỏ đường ghi đổi sang một-lối trích luật của hàng 9a | fixed: d-…-13 thay d-…-6 thành Hỏi-4 (khuyên đúng 8 dạng, mã mẫu cũ tra nguyên văn qua bí danh); d-…-14 thay d-…-8 nguồn một-lối; AC-5, E4, E8, thiết kế sửa theo |
| P1 | design, contract | floor thành chữ và buildingKey đổi nghĩa có thể chảy tới Bảng hàng mà hợp đồng chỉ khai api, config | Bảng hàng hiện khoá bld_ hay xếp tầng theo chữ, kiểm tổng vẫn xanh | Đầu ra Bảng hàng mẫu trước và sau bằng nhau, ảnh chụp rút từ commit trước | fixed: đã soát — không màn nào đọc floor hay buildingKey; thêm vế vào AC-6 và E15 so sâu 60 lần chào mẫu trước và sau, rút từ commit trước hàng |
| P1 | contract, evals | Không thước cho vế dương của khoá sàn (cột có giá trị, khoá ngoại đúng loại catalog_source) | Cột agreement_id trống, không khoá ngoại vẫn qua E11 | Ca dưới vai chủ bảng: không trống, nối tới catalog_source, loại khác bị từ chối với tên ràng buộc ghim | fixed: thêm vế vào AC-7 và E16; thiết kế nêu khoá ngoại ghép (agreement_id, agreement_kind) và thoả thuận mẫu dùng khi nạp |
| P1 | design (sổ) | Không dòng sổ nào nói việc chạm SP-1 và trỏ chỗ ngoại lệ đã duyệt; khoá sàn chỉ che bằng quyền theo cột [cach-ly-truoc-du-lieu-that#F2] | Bộ kiểm đóng băng thêm năm ngoại lệ mà cổng không thấy đây là chạm SP-1 | Dòng sổ trích lời duyệt ngoại lệ, gắn pham_luat SP-1 vào Hỏi-1 | fixed: d-…-12 thay Hỏi-1, mang pham_luat SP-1 và kho_dao true; Notes của hợp đồng trích AGENTS.md và danh sách của hàng 9a, «giữ đúng ngoại lệ, không nới thêm» |
| P2 | evals | E8 đòi mọi mã của ma trận khớp đúng một dạng (nuốt cả mã suýt đúng); E4 dùng mã ngoài ma trận | Bài quét viết đúng chữ thì tự đỏ, người dựng nới bài | Quét chỉ trên mã đúng; mã suýt đúng khớp không dạng nào; E4 ghim mã của ma trận | fixed: E8 tách hai vế; E4 ghim Q12A-07-05A → tầng 7 |
