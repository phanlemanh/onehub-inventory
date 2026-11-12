---
slug: bang-hang-dung-tay-nhu-sheet
at: 2026-11-12T06:43:00Z
verdict: findings
p0: 1
p1: 4
p2: 0
---
## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ bỏ vùng của khối và dòng sổ chọn nhiều ở ô lọc giá trị mang căn cứ chỉ liên quan, không quyết lựa chọn; bỏ Xuất chưa chết (lặp [app-shell-chon-tu-reui#F1], [bang-hang-ban-doc#F1]) | Chủ kho tin việc cắt Xuất và đổi sang chọn nhiều đã có căn cứ máy nên duyệt mà không cân | Câu trích quyết đúng việc, hoặc thành Hỏi | fixed: dòng bỏ vùng nay trích luật lấy-bỏ vùng của 0023 (d-…-21); bỏ Xuất thành Hỏi-4; chọn nhiều thành căn cứ một-lối (thành phần lọc của kho là chọn nhiều, dựng ô chọn một là bậc 3) |
| P1 | design | Dòng thay thế trỏ nhầm dòng thứ tự trạng thái | Thẻ mất quyết định thứ tự trạng thái, lối tắt hiện hai lần | Sửa supersedes | fixed: dòng thứ tự trạng thái ghi lại với căn cứ một-lối, thay dòng nhầm (d-…-20) |
| P1 | evals | E14 tự mâu thuẫn AC-9 về điểm dừng Tab | Hoặc đỏ oan, hoặc ô lọc bị rút khỏi thứ tự Tab mà không ai biết | Danh sách điểm dừng viết trước, thân bảng một điểm dừng | fixed: AC-9 và E14 viết lại theo danh sách điểm dừng, thêm ca phá 'tab stop missing' |
| P1 | evals | E2 không chép cột giá, trạng thái; không Meta+C; ca ẩn cột không so cả chuỗi | Lưới chép giá trị thô mà vẫn xanh; Cmd+C trên Mac không chép | So BẰNG cả chuỗi cho tiền, trạng thái, hai phím | fixed: E2 thêm vùng Trạng thái + Giá chào, hai phím, so bằng cả chuỗi, ca phá giá trị thô |
| P1 | evals | Không đo sắp trong nhóm và lối tắt + lọc thêm | Gom nhóm làm mất thứ tự sắp, lối tắt bị thay khi lọc thêm, mà vẫn xanh | Ca sắp + nhóm, ca lối tắt + lọc giá | fixed: AC-5/E7 thêm sắp trong nhóm với ca phá 'sort lost inside group'; AC-7/E11 thêm lối tắt + '<=5' |

Ghi chú của người phản biện (ngoài trần 5): ghim đổi được chưa có phép đo — fixed: AC-6/E8 đo «Bỏ ghim» Toà; luật «hoặc», «và» chưa đo — fixed: AC-4/E5 thêm hai ô.
