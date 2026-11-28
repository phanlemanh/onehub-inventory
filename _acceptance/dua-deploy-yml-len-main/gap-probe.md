---
slug: dua-deploy-yml-len-main
at: 2026-11-27T18:24:52Z
verdict: findings
p0: 1
p1: 1
p2: 3
claims_input: ok
---

# Phản biện context sạch

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | contract | Trục «bản thật không người duyệt» ghi AC-2 nhưng AC-2 chỉ đo dòng environment: production, không đo môi trường có người duyệt | Môi trường production không có người duyệt; Deploy chạy lên bản thật không ai duyệt mà mọi eval vẫn xanh | Eval chỉ đọc gh api môi trường production, đỏ khi thiếu required_reviewers gồm chủ kho | fixed: thêm AC-6 (cross-layer) + E7 đọc gh api, ca đỏ «production không có người duyệt bắt buộc»; đo ngày 28/11: có, người duyệt phanlemanh |
| P1 | evals | E2 có chiều đỏ cho 5/8 vế của AC-2 | Khối nới quyền hay sai ENV mà hàm đo không xét vẫn in E2 ok | Mỗi vế một ca đỏ ghim | fixed: thêm 5 ca đỏ (quyền, cò, staging sai môi trường, bước cuối sai ENV, release gọi 2 lần); tự kiểm 27/27 |
| P2 | evals | E3 không đo khoá đặt ở đúng môi trường của việc đọc nó | Việc production đọc khoá chỉ có ở staging, E3 xanh, lần chạy đỏ | So theo từng việc với cột Đặt ở đâu | fixed: E3 đo theo từng việc, ca đỏ «STAGING_APP_URL không đặt ở môi trường staging» |
| P2 | contract | AC-1 so với sổ tay ở HEAD, không so với khối lúc ký | Sổ tay đổi sau ngày ký, AC-1 vẫn xanh | Ghim khối tại commit ký | fixed: E1 so thêm với khối tại 182ca5b3 (commit ký dat-khoa-mot-lenh), ca đỏ «khối sổ tay đã đổi sau khi ký» |
| P2 | decisions | Câu trích AGENTS.md chỉ cấm máy gộp, không quyết việc bỏ secrets: inherit | Gate 1 tưởng không còn lối khác | Dòng sổ mới nguồn mot-loi | fixed: dòng sổ mới supersedes d-20261127T182153Z-3, nguồn mot-loi; sửa câu trong ghi chú thiết kế |
