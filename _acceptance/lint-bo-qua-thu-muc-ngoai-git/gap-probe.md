---
slug: lint-bo-qua-thu-muc-ngoai-git
at: 2026-11-21T13:20:00Z
verdict: findings
p0: 1
p1: 1
p2: 3
---

# Phản biện context sạch — lint-bo-qua-thu-muc-ngoai-git

Một tác tử tươi đọc đúng năm tệp: design doc, hợp đồng, kế hoạch đo, sổ quyết định và bài học từ hồ sơ trước. Không đọc mã, không chạy lệnh.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | contract + sổ d-20261121T130646Z-4 | Căn cứ bỏ coverage-scan («npm run lint chỉ gọi hai công cụ») không giết lối quét: lời hứa là cả make check, mà các bước khác của make check chưa được đo với hai thư mục. Cùng dạng [split-log-ledger#F2]. | Gộp xong, ở kho chính make check qua lint rồi đỏ ở bước test vì worktree lồng là bản chép trọn kho. | Thêm AC và eval cấy tệp cho từng bước rồi chạy make check; hoặc thu lời hứa về npm run lint. | fixed: đo xác nhận Vitest gom 476 tệp bài kiểm ở kho chính và make check với tệp cấy đỏ ở bước test; thêm hai mục vào test.exclude của vitest.config.ts, thêm AC-7 và E7 (make check với tệp cấy cho mọi bước, thoát 0), dòng sổ mới d-20261121T131928Z-7 và d-20261121T131928Z-8 thay hai dòng d-20261121T130646Z-3 và d-20261121T130646Z-4 |
| P1 | evals E4, E6 | Nửa Prettier của phép chạy thật không có đối chứng dương; tệp cấy không ghim là sai định dạng Prettier. | Tệp cấy đúng định dạng thì prettier --check không bao giờ nêu nó dù dòng .prettierignore có hay không. | Chứng tệp cấy sai cả hai công cụ; thêm chiều đỏ cho Prettier. | fixed: chay-that.mjs chứng tệp cấy là lỗi ESLint và chưa đúng định dạng Prettier trước khi đo (không thì exit 2); thêm chiều đỏ (b) Prettier chỉ với .gitignore nêu tệp cấy ở .claude/worktrees/ |
| P2 | design + AC-2 + E2 | Dòng .acceptance-runs/ của .prettierignore không eval nào phân biệt được, vì .gitignore đã phủ. | Quên dòng ấy thì mọi eval vẫn xanh. | Hỏi với .prettierignore một mình. | fixed: E2 hỏi thêm với .prettierignore một mình, một đường mỗi thư mục; chiều đỏ ghim «.prettierignore alone does not ignore: …» |
| P2 | evals E6 | E6 không ghim số ca. | Bỏ một ca đỏ mà E6 vẫn đạt. | Ghim tổng số ca. | fixed: E6 ghim tests 13 · pass 13 · fail 0 và liệt kê từng ca |
| P2 | evals E1–E4 + design | Không ghim gốc cây; worktree nằm lồng trong kho chính có cấu hình chưa sửa. | Bên chấm đứng ở kho chính thì E1–E3 hỏi cấu hình cũ, E4 cấy tệp vào worktree thật của các dãy. | Suy gốc từ vị trí script và in nó. | fixed: mọi phép đo suy gốc lên ba cấp từ rang/ và in «<tên>: root <gốc>»; mọi ca của E6 đòi gốc ấy trùng cây đang chấm |
