---
slug: split-log-ledger
at: 2026-11-19T05:40:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Phản biện context sạch

Một tác tử tươi chỉ đọc design doc, `contract.md`, `evals.yaml` và `decisions.jsonl` (không mã, không hội thoại).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | contract | Sổ không có dòng cho quyết định hai PR của chủ kho; dòng tách bằng make split trích câu «mỗi sổ một PR, PR 2 đến 5» của kế hoạch đã bị thay, và câu ấy không quyết việc không viết mã mới | Cổng Phạm vi duyệt trên một căn cứ đã hết hiệu lực; quyết định gói ba sổ vào PR 2 không có trong sổ | Dòng chi-nguoi cho hai PR; đổi căn cứ dòng make split | fixed: dòng mới chi-nguoi (Hỏi-4 trong hợp đồng); dòng make split thay bằng dòng mot-loi mang supersedes |
| P0 | contract | Lời bỏ coverage-scan nói không gian là danh sách tệp đổi, nhưng hệ quả rơi vào tệp đọc wiki/log.md mà không đổi (đã có ba ca thật) | Một bên đọc ngoài .md (công cụ, bài kiểm, job) xanh trên máy vì tệp đã vẽ sẵn, đỏ trên bản checkout mới hay lượt ghim lại; không AC nào bắt | Quét mọi tệp không phải .md có nhắc wiki/log.md, mỗi tệp phải được xếp loại; ca phá thêm một bên đọc | fixed: AC-7 và E9 (`rang/ben-doc.mjs`, bảng READERS 24 tệp), ca phá ở E7; dòng bỏ coverage-scan thay bằng dòng mới mang supersedes |
| P1 | evals | Ma trận của E4 chỉ có ca phá tiếng Việt, trong khi lời dặn cho AI viết bằng tiếng Anh | Một skill còn câu «Append a line to wiki/log.md» mà E4 vẫn xanh | Ca phá tiếng Anh trong một SKILL.md | fixed: ca phá «Append a line to `wiki/log.md`» trong `.claude/skills/wiki-query/SKILL.md`; AC-4 nói rõ hai thứ tiếng |
| P1 | contract | Dòng Coverage của .repo-setup.json trỏ AC-3 nhưng không AC nào đo nó, và AC-1 không so phần đầu sổ | .repo-setup.json còn giữ wiki/log.head.md, hay đầu sổ đổi khi tách, mà mọi phép đo vẫn xanh | Đo đầu sổ từng chữ, wiki/log.head.md trong git, .repo-setup.json thôi giữ nó; hai ca phá | fixed: thêm vào AC-1 và E1, hai ca phá ở E7; Coverage trỏ AC-1 |
| P1 | evals | Ba khẳng định dương không có ca đỏ: thứ tự mới trước cũ, ngày của mục mới, «DRY=1 không ghi gì» (đo bằng git status không thấy tệp .gitignore che) | Ba kiểm tra hằng-đúng mà không ai biết | Ba ca phá có thông điệp ghim; so nội dung tệp sổ, không chỉ git status | fixed: ca phá vẽ cũ trước mới (sửa tools/ledgers.py trong bản sao), ca mục mới ngày 2026-11-10, ca make split ghi vào wiki/log.md; ke-thua-e10 so băm bốn tệp sổ cộng git status |
