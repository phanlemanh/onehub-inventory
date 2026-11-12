---
slug: thang-chon-khoi-vao-cong
at: 2026-11-11T16:00:00Z
verdict: findings
p0: 2
p1: 2
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | design | Dòng sổ danh sách chuyển tiếp trích câu chỉ liên quan, không quyết tầm miễn; tầm miễn trọn để lọt App Shell khỏi sổ khối | 1o nhập App Shell theo luật 1c, tới implemented không bị đòi dòng sổ; hàng sau ghi App Shell trong-kho thì đỏ mà không tự sửa được | Trích lời giao và phán quyết; cân miễn từng phần | fixed: dòng sổ mới d-20261111T150549Z-10 thay d-20261111T150220Z-6, căn cứ một-lối (lời giao + tin G-1111-20: miễn từng phần làm đỏ 1o ở implemented); lỗ App Shell giám sát nhắc dãy H ghi dòng sổ tay, và hàng sau thấy đỏ trong-kho-chua-nhap chứ không lọt im (thiết kế mục 3) |
| P0 | design | Khoá khuon_boc tự khai mở lối né cả bảy điều | Hàng 1p hay 9c khai khuon_boc để thôi bị đòi chứng minh màn, lưới vẫn xanh | Danh sách id do người giữ; ca khuon-boc-la | fixed: tools/proof_gate/khuon-boc.yaml (mở bằng app-shell), id lạ đỏ khuon-boc-la; AC-8, E8 thêm ca; dòng sổ d-20261111T150549Z-11 thay d-20261111T150220Z-9 |
| P1 | evals | Lời hứa bài 1c không sửa lời không đo được bằng lượt chạy | Một vòng nới ca phá của 1c, lượt chạy vẫn xanh | Tệp bài riêng; ghim băm tệp bài 1c | fixed: bài mới ở proof-gate-0023.test.ts; bài ghim băm git 0f59c79f… của proof-gate.test.ts; luật 0023 chỉ bật khi kho có design/so-khoi.yaml nên kho mẫu của 1c chạy y nguyên (AC-1, E1) |
| P1 | evals | Ranh trạng thái của từng mục chưa ghim | Khuôn bọc qua Cổng Phạm vi không ứng viên; Bảng hàng đỏ sớm ở approved; khuôn điền ở approved không qua luật khối | Ma trận trạng thái × mục viết trước | fixed: E1 thêm ma trận 2 trạng thái × 8 mục (16 ô ghim); E3 nêu trạng thái mỗi ca và đối chứng approved; E8 thêm ca approved; E9 điền khuôn ở implemented kèm dòng sổ |
| P2 | contract | Đường đo hứa trọn ngưỡng «cùng một nhu cầu» mà máy chỉ đo cùng khoá | Hai khoá khác cùng một nhu cầu, lưới xanh, chủ kho tưởng máy đã bảo đảm | Tách dòng thước | fixed: Đường đo ghi «cùng khoá nhu_cau» và thêm dòng «khác khoá cùng nhu cầu — người soi, không số» |
