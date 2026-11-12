---
slug: danh-muc-can-nhu-onehub-invest
at: 2026-11-12T10:40:00Z
verdict: findings
p0: 1
p1: 6
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Sổ ghi máy tự quyết thêm dạng mã thứ 9 «S1.05-1208» mà invest không có; câu trích không quyết việc thêm; dòng bỏ đường ghi trích sai căn cứ | Chủ kho duyệt vì tin máy quyết theo mục tiêu, rồi hai kho đọc lệch 432 mã gốc mẫu | Dòng sổ mới nguồn chỉ-người thành Hỏi-4; dòng bỏ đường ghi đổi sang một-lối trích luật của hàng 9a | fixed: d-…-13 thay d-…-6 thành Hỏi-4 (khuyên đúng 8 dạng, mã mẫu cũ tra nguyên văn qua bí danh); d-…-14 thay d-…-8 nguồn một-lối; AC-5, E4, E8, thiết kế sửa theo |
| P1 | design, contract | floor thành chữ và buildingKey đổi nghĩa có thể chảy tới Bảng hàng mà hợp đồng chỉ khai api, config | Bảng hàng hiện khoá bld_ hay xếp tầng theo chữ, kiểm tổng vẫn xanh | Đầu ra Bảng hàng mẫu trước và sau bằng nhau, ảnh chụp rút từ commit trước | fixed: đã soát — không màn nào đọc floor hay buildingKey; thêm vế vào AC-6 và E15 so sâu 60 lần chào mẫu trước và sau, rút từ commit trước hàng |
| P1 | contract, evals | Không thước cho vế dương của khoá sàn (cột có giá trị, khoá ngoại đúng loại catalog_source) | Cột agreement_id trống, không khoá ngoại vẫn qua E11 | Ca dưới vai chủ bảng: không trống, nối tới catalog_source, loại khác bị từ chối với tên ràng buộc ghim | fixed rồi thay: sau lời chủ kho 12/11, danh mục chung bỏ cột dấu sàn; khoá sàn thành lớp mã riêng của sàn (AC-9, E16, E17) |
| P1 | design (sổ) | Không dòng sổ nào nói việc chạm SP-1 và trỏ chỗ ngoại lệ đã duyệt; khoá sàn chỉ che bằng quyền theo cột [cach-ly-truoc-du-lieu-that#F2] | Bộ kiểm đóng băng thêm năm ngoại lệ mà cổng không thấy đây là chạm SP-1 | Dòng sổ trích lời duyệt ngoại lệ, gắn pham_luat SP-1 vào Hỏi-1 | fixed rồi thay: Hỏi-1 mới không còn chạm SP-1 qua quyền theo cột (danh mục chung không có cột của sàn); Notes của hợp đồng trích AGENTS.md và danh sách của hàng 9a, «giữ đúng ngoại lệ, không nới thêm» |
| P2 | evals | E8 đòi mọi mã của ma trận khớp đúng một dạng (nuốt cả mã suýt đúng); E4 dùng mã ngoài ma trận | Bài quét viết đúng chữ thì tự đỏ, người dựng nới bài | Quét chỉ trên mã đúng; mã suýt đúng khớp không dạng nào; E4 ghim mã của ma trận | fixed: E8 tách hai vế; E4 ghim Q12A-07-05A → tầng 7 |
| P1 | evals, contract | E13 còn chữ bỏ agreement_id, chỉ đo năm bảng chung; AC-8 và E14 thiếu nhãn Mã riêng | Cột dấu sàn quay lại mà E13 vẫn xanh; bảng mã riêng lệch ontology mà vẫn qua | Mở E13 ra sáu bảng, ca đỏ cho cột lạ; thêm Mã riêng vào AC-8, E14, thuật ngữ | fixed: E13 sáu bảng kèm hai ca đỏ (thuộc tính không cột, cột agreement_id lạ); AC-8, E14, thiết kế thêm Mã riêng |
| P1 | evals | E16 chỉ ghim dòng ok chung của bộ cách ly, không chiều đỏ cho bảng mã riêng, không ca phiên chưa chọn sàn | Bảng mã riêng mang luật đọc mở mà bộ kiểm vẫn in ok | Tệp phá luật đọc mở với dòng HỎNG viết sẵn; ca phiên chưa chọn sàn | fixed: tệp phá ma-rieng-doc-mo với dòng ghim nguyên văn; ca phiên chưa chọn sàn thấy 0 dòng |
| P1 | design | Đề xuất mở hàng 7e lật phạm vi MVP đã ký nhưng thiết kế chỉ trình bốn câu | Lời lật phạm vi đi qua cổng như một ý ngoài phạm vi | Thêm Hỏi-5 vào thiết kế và thẻ | fixed: Hỏi-5 trong sổ và mục Lựa chọn của thiết kế, máy khuyên mở, lối khác giữ hoãn |
| P2 | evals | E17 không ghim lý do, bộ dữ liệu mã riêng không viết trước, mã riêng trỏ khoá không tồn tại | Đối tượng ma được tra ra trước mã gốc | Ghim lý do, đưa bộ dữ liệu vào ma trận, khoá ngoại | fixed: lý do khong-tim-thay; bộ dữ liệu ở ma trận đầu evals.yaml; bảng mã riêng trỏ toà hay căn bằng khoá ngoại, ca đỏ ở E16 |
