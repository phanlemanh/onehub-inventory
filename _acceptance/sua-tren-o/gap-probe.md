---
slug: sua-tren-o
at: 2026-11-13T03:05:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Dòng sổ máy quyết nấc chuyển trích trang Sửa trên ô, nhưng câu trích không quyết Đã bán, Ngừng hẳn là nấc cuối, cũng không quyết khoá giá căn Đã bán [bang-hang-dung-tay-nhu-sheet#F1] | Đầu chủ lỡ chọn Đã bán, không còn đường đưa căn về Đang bán hay sửa giá; chưa ai cân lựa chọn ấy với thói quen sửa nhầm trên Sheet | Dòng sổ mới supersedes, hoặc tách thành câu hỏi người | fixed: dòng nấc chuyển viết lại chỉ giữ phần trang quyết (supersedes); nấc cuối và khoá thành Hỏi-3 (chi-nguoi); AC-5, AC-6 trỏ Hỏi-3 |
| P0 | contract | Hỏi-2 (danh sách lý do) còn chờ, nhưng dòng máy quyết nhãn đã chốt ba lý do; AC-5, AC-10, E10c khoá câu trả lời trước | Chủ kho chọn thêm «Khác», hợp đồng đã ký vẫn đòi ba lý do và bốn nhãn | Dòng mới chỉ giữ cách đặt tên; AC và eval ghi theo Hỏi-2 | fixed: dòng nhãn viết lại chỉ giữ luật đặt tên và trần 17 ký tự (supersedes); AC-5, AC-10, E10c theo câu trả lời Hỏi-2; Notes ghi đổi gì nếu chọn «Khác» |
| P1 | contract | Hỏi-1 còn mở nhưng hợp đồng chỉ khớp lối khuyến nghị; lối cửa API không có AC hay eval | Chọn lối cửa API thì cửa, migration và 403 trên máy chủ được làm mà không eval nào đo | Ghi AC và eval đổi theo từng lối | fixed: Notes ghi AC-11 và eval backend-effect (CompanyAdmin 403, ListAgent 200) khi chọn lối cửa API |
| P1 | evals | «Mất mạng» chỉ đo bằng lỗi tự dựng và nút gây hỏng của trang mẫu, không theo khuôn lỗi của đường ghi thật | Hàng 10 cắm fetch thật, cổng không nhận TypeError hay phản hồi 403, thông báo rơi vào câu chung hay im | Lỗi đúng khuôn fetch, đối chứng dương, ghim thông điệp | fixed: AC-7 và E7 đo ba khuôn (TypeError, navigator.onLine false, phản hồi 403) kèm đối chứng dương; E7-ui đặt trình duyệt ngoại tuyến thật, bỏ nút gây hỏng; sổ thêm dòng cổng lưu không ghi khi mất mạng |
| P1 | contract | Không AC nào nói sáu cột còn lại không mở sửa ở máy tính | Gõ một ký tự trên ô Diện tích ở 1440 thì khung mở và giá trị bị thay, mọi eval vẫn xanh | Ma trận 8 cột, đúng 2 cột mở, ghim thông điệp | fixed: AC-8 thêm câu sáu cột chỉ đọc; E8-e2e thêm ca cot-chi-doc với ma trận 8 cột × ba cách mở |
