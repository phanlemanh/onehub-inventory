---
slug: upgrade-design-assembly-0-7-1
at: 2026-11-17T22:45:00Z
verdict: findings
p0: 2
p1: 2
p2: 1
---

# Phản biện context sạch

Một tác tử mới đọc design doc, hợp đồng, evals, sổ quyết định và bài học của các hồ sơ trước; không đọc mã.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | design (sổ S1) | Ba dòng d-3, d-6, d-10 ghi nguồn mục tiêu nhưng câu trích chỉ là tiền lệ của hồ sơ 0.7.0, không quyết lựa chọn của vòng này ([upgrade-design-assembly-tool#F1]) | Người duyệt tưởng ba lựa chọn có căn cứ trong kho, trong khi đó là chép thói quen | Viết lại thành một-lối với lối chết của vòng này | fixed: ba dòng mới mang supersedes, nguồn một-lối, lối chết nêu tiêu chí và tệp của vòng này |
| P0 | design (sổ S1 d-11) | Để phép đo của hồ sơ 0.7.0 đỏ khi ghim lại và chỉ canh cây công cụ ở lượt chấm là đánh đổi của chủ kho, mà sổ ghi máy quyết ([upgrade-design-assembly-tool#F2]) | Chủ kho ký mà không biết mình nhận hai điều ấy | Dòng chỉ-người kèm khuyến nghị và lối khác, lên thẻ | fixed: dòng chỉ-người thay d-11 (Hỏi-2); Notes của hợp đồng ghi cả hai điều |
| P1 | design, evals (E2–E7) | Bản sao lấy main từ nhánh main trên máy, không ghim rằng gốc so là 8925e8ff | main trên máy cũ hơn chỗ rời nhánh, hai hàng so với gốc sai mà phép đo vẫn xanh hay đỏ vì lý do khác | Kiểm chỗ rời nhánh trong bản sao, có ca phá main cũ | fixed: origin là kho trung gian có main ghim ở 8925e8ff (main trên máy thật sự ở ea774a0f, chậm 16 commit); AC-2, AC-3 kiểm chỗ rời; E5 thêm ca main cũ |
| P1 | contract (Out of scope) | Hứa báo lời debt: cho plugin mà không dòng sổ, không chỗ ghi ([upgrade-design-assembly-tool#F2]) | Không ai báo, các lần lên đời sau vẫn in sai | Dòng sổ trỏ tới chỗ đã ghi | fixed: ghi ở tệp 0.7.1-inventory-plugin-findings.md của thư mục ghi chú chung, dòng sổ cuối S1, Out of scope trỏ tới đó |
| P2 | contract (AC-8), evals (E2, E13) | AC-8 nói tệp hồ sơ mà không đường dẫn; dòng ghim của E2 thiếu dòng 294 | Glob rộng cho tệp lạ dưới wiki/ qua; thiếu dòng manifest mà E2 vẫn xanh | Kê đường dẫn, ca phá wiki, ghim dòng 294 | fixed: AC-8 và ma trận kê từng tệp; E18 thêm ca wiki; E2 ghim dòng 294 và E3 có ca phá của nó |
