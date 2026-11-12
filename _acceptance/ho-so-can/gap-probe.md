---
slug: ho-so-can
at: 2026-11-12T06:36:19Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Phần bỏ của solution-crm-4 và product-detail-5 (nút Hỏi đầu chủ, nút chính dính đáy, giá kèm phí, vùng bán hàng) không có dòng sổ [app-shell-chon-tu-reui#F1] | Chủ kho duyệt mà không biết thân điện thoại mất nút chính | Dòng sổ cho từng phần bỏ, phần không có căn cứ thành câu hỏi | fixed: ba dòng sổ — G1, G4, G5, C1 có căn cứ bản phạm vi; vùng bán hàng của crm-4 một lối; nút chính dính đáy thành Hỏi-4 |
| P0 | design | Dòng sổ «sống chung với 2a» gói năm lựa chọn dưới một lối, lối «bấm dòng mở hồ sơ» vẫn sống | Đầu chủ bấm dòng mà hồ sơ không mở, chưa ai cân với thói quen Quỹ hàng | Tách dòng, phần bấm ô thành câu hỏi | fixed: dòng mới supersedes dòng cũ (ghim cột, không tự ẩn, Esc); bấm ô chọn ô thành Hỏi-5 |
| P1 | evals | E6 đo Tab vào bảng bằng thuộc tính trong jsdom | Bẫy tiêu điểm còn mà E6 vẫn xanh | Bước Playwright Tab rời hồ sơ, đối chứng bẫy tiêu điểm | fixed: thêm vào E2 kèm thông điệp 'grid not reachable by Tab' |
| P1 | evals | E3 chỉ in số cột, đo đầu cột có mặt thay cho thấy được | Còn 2 cột ở 1024 mà E3 vẫn xanh; cột display none vẫn được đếm | Ngưỡng 5 và 3, cuộn tới từng cột, đối chứng ẩn cột | fixed: E3 thêm ngưỡng, kiểm từng cột, đối chứng 'column hidden: Diện tích' |
| P1 | evals | Địa chỉ mang id thật khi vùng không có dòng chưa được đo | Vùng không đủ quyền mà hồ sơ vẫn hiện giá | Ca trạng thái vùng kèm địa chỉ, đối chứng dương | fixed: E5 thêm bốn trạng thái kèm đối chứng dương và 'record opened in a region without rows' |
