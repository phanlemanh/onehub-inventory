---
slug: thue-phi
at: 2026-11-14T12:47:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

# Gap-probe — thue-phi

Phản biện ngữ cảnh sạch: một tác tử tươi chỉ đọc thiết kế, hợp đồng, evals, sổ quyết định, ô cơ hội và tệp bài học (input 5).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P1 | design | Không nói ba vai đọc vào màn Tuỳ chỉnh của sàn bằng cách nào | Màn 7e chỉ cho Quản trị thì Trưởng nhóm bị chặn, AC-4 đỏ oan; mở màn cho ba vai là đổi quyền chưa duyệt | Thiết kế nêu cửa vào; E4-ui chụp cột thứ hai | fixed: thiết kế ghi màn 7e mở theo readCompanyLayer, vốn cho cả bốn vai — không đổi quyền; E4-ui hỏi thêm cột thứ hai |
| P1 | evals | Không ca nào gõ số thập phân kiểu Việt đúng | «1,5» đọc thành NaN hay 15 mà E3 vẫn xanh | Ca dương «1,5» → 150 phần vạn, cặp phá thử parseFloat | fixed: AC-3 thêm «1,5»; E3-unit ca doc-so-kieu-viet và pha-thu-doc-so; E3-ui gõ «1,5» |
| P1 | design | Dòng sổ máy quyết bước 0,1 và mặc định 1% mà câu trích không quyết | Chủ kho duyệt tưởng số có căn cứ; các số ghim 2,895 tỷ khoá sai | Viết lại dòng, số không nguồn thành Hỏi | fixed: d-…-16 thay d-…-13 chỉ giữ phần trích quyết; Hỏi-5 (d-…-17) cho mặc định và bước; Notes ghi AC đổi theo |
| P1 | contract | Trục C thiếu bán hay cho thuê | Hàng cho thuê gắn Bao phí hiện Về tay = giá thuê × 0,965 | Thêm vế, chốt luật cho thuê | fixed: mô hình hôm nay chưa có loại giao dịch (mọi hàng là bán); luật «cho thuê thì Về tay trống» ghi ở thiết kế, Coverage, Out of scope và d-…-18 |
| P2 | contract | AC-5 không ghim hai hàng mẫu mà AC-6 dùng | E5 xanh mà E6 đỏ vì thiếu hàng 3 tỷ hay hàng thiếu giá | Ghim hàng 3 tỷ và hàng thiếu giá, cặp phá thử | fixed: AC-5 và E5 thêm hai loại, năm assert, phá thử bỏ hàng 3 tỷ |

Hai lỗ nhỏ ngoài trần năm dòng: (1) AC-8 báo trang tri thức qua `viec-phu` mà không eval đo — deferred: yêu cầu ấy có mã
trong sổ đợt, Cổng Bằng chứng nêu mã; (2) trạng thái «không tải được» và «máy chủ lỗi» không có AC — deferred: dùng khung
trạng thái chung của 7e (DataRegion, PageState), đã có bài của khung. Câu hỏi của tác tử về lệnh của E6: đã kiểm,
`thue_phi_ontology` gồm `tests/thue-phi-cot.test.ts`.
