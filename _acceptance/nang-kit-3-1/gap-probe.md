---
slug: nang-kit-3-1
at: 2026-11-22T13:58:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Gap probe — nang-kit-3-1

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | design | Dòng sổ d-20261122T131918Z-8 ghi căn cứ mục tiêu nhưng câu trích (luật riêng điểm 15) không quyết việc cắt bật mặc-ký, sửa autonomy.yaml, ghim lại hồ sơ cũ — cùng dạng [lui-ban-luc-xoay-mat-khau#F2] | Người duyệt ký trên một căn cứ không tồn tại | Thay d-8 bằng dòng mới có căn cứ đúng, mang supersedes | fixed: dòng mới căn cứ một-lối (trùng PR #108, governance/ của người), supersedes d-8 |
| P0 | contract | Bỏ quét độ phủ với lý do một chiều, trong khi kit 3.1 đổi cả gói điều phối mà móc của nó đọc thư mục đợt; luật riêng điểm 15 không AC nào canh | Đợt chạy lại, móc 3.1 đọc sổ đợt khác 3.0, hoặc nâng kit giữa lượt S4, không AC nào đỏ | Thêm dòng Coverage và AC cho bên đọc của gói điều phối và điểm 15 | fixed: AC-9 + E10 (dot.mjs) — hooks.json không đổi, hai tệp đổi trong bao đóng móc đọc thư mục đợt và gốc kho như 3.0, không khoá s4; dòng sổ coverage mới supersedes d-6 |
| P1 | evals | E6 không ghim số hồ sơ OK, hai tập rỗng vẫn bằng nhau | Gốc kit sai thì E6 xanh trên hai lượt rỗng | Ràng k bằng số hồ sơ có contract đếm độc lập, chiều đỏ cho 0 hồ sơ | fixed: k = số contract.md ở merge-base đếm bằng git ls-tree; chiều đỏ «OK 0 records, want k» |
| P1 | design | AC-5 chỉ đo hồ sơ do 3.0 viết, không đo hồ sơ do phiên 3.1 viết | Trong khoảng CI ở 3.0, hồ sơ phiên 3.1 viết bị cổng CI xử khác | Chạy cả hai kit trên HEAD, so từng dòng; nói phần chênh trong Hỏi-1 | fixed: AC-5 thêm lượt trên HEAD (gồm hồ sơ này), hai kit in cùng dòng OK/VIOLATION; Known limit (3) nói kiểm chỉ 3.1 có chạy trong phiên, không ở CI |
| P1 | contract | Known limit (1) — phiên thật nạp 3.1 sau gộp — là lựa chọn của chủ kho mà sổ không ghi | Chợ không làm mới, mọi bên tưởng mặc-ký đã chạy | Dòng sổ chỉ-người, hoặc bước đo sau gộp | fixed: Hỏi-3 (dòng sổ chỉ-người) + bước kiểm bộ nhớ đệm ở phiên mới đầu tiên sau gộp ghi trong Known limit (1) |
