---
slug: commit-msg-kit-subjects
at: 2026-11-20T06:55:00Z
verdict: findings
p0: 0
p1: 5
p2: 4
---

# Phản biện context sạch

Một tác tử mới (vai chỉ đọc) đã đọc hợp đồng, evals, ma trận `rang/matrix.mjs`, luật và bài kiểm hiện có, cách job
`conventional-commits` gọi hook, cùng các tệp của kit v3.0.0 viết tiêu đề commit. Nó không chạy lệnh. Cột «Xử lý» ghi
việc hồ sơ đã làm sau phản biện, trước Cổng 1.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P1 | contract (Out of scope), AC-6 | Không phép đo nào kiểm rằng commit của chính PR này qua luật của nền. Job chấm PR bằng luật của nhánh chính. | Người ký làm theo lệnh kit, commit `Gate 2 signoff: …`: hook cục bộ mới nhận, job trên PR này đỏ, mọi AC xanh | Chấm mọi commit `nền..HEAD` bằng `tools/commit_msg.py` của nền | Đã sửa: AC-6 và `change-set.mjs` chấm từng commit của PR bằng luật của nền; AC-7 có ca phá (một tin chỉ luật mới nhận) |
| P1 | AC-1, quét script | Phép quét chỉ bắt `'-m'` theo sau là template; bỏ sót `-qm`, `-am`, nháy đơn, `-F`, `--message` | Kit bản sau thêm `'commit', '-qm', 'seal: …'`, AC-1 vẫn xanh | Nới phép quét, loại kho tạm bằng danh sách có tên | Đã sửa: phép quét bắt mọi dạng trên mọi plugin; `kiem-ban-cai.mjs` vào `KIT_SCRATCH` có lý do; AC-7 phá bằng `-qm` |
| P1 | AC-1, quét `.md` | Không quét lệnh và skill `.md`, nơi ba khuôn sống | Kit thêm `git commit -m "Gate 1: …"` vào một lệnh, AC-1 vẫn xanh | Quét `git commit -m "…"` và commit `` `…` `` trong mọi `.md` | Đã sửa: AC-1 so tập khuôn `.md` với ma trận (cộng mục `index.md` là tên tệp); AC-7 có ca phá |
| P1 | AC-2 | Mọi ca đều một dòng | Luật đọc mọi dòng nhận `update stuff` + dòng kit ở thân | Thêm ca nhiều dòng và một bản phá | Đã sửa: ba ca nhiều dòng; AC-7 phá bằng luật đọc mọi dòng |
| P1 | AC-5, E5 | `make check` không đếm «nền cộng 10», không giữ ca cũ | Bỏ một ca cũ hoặc chỉ thêm 2 ca, E5 vẫn xanh | So ca của tệp bài kiểm giữa nền và cây | Đã sửa: AC-5 ghim số bài của nền và của cây; AC-8 (`test-cases.mjs`) so từng ca, có ca phá |
| P2 | Notes (luật), AC-2 | Luật rộng hơn khuôn kit (không đòi ` — `, slug bất kỳ); thiếu ca khoảng trắng lạ | `Veto: lol` được nhận | Thêm ca, hoặc siết luật | Đã sửa: luật bám khuôn (`[a-z0-9-]+ — \S`); thêm 9 ca (không dấu cách, NBSP, cách đầu, thiếu tên, slug lạ) |
| P2 | AC-2, chữ hợp đồng | Đếm «20 cùng hai tin dò» không khớp ma trận | Người đọc hiểu 22 ca | Sửa chữ | Đã sửa: AC-2 ghi 32 tin, liệt nhóm |
| P2 | AC-3, AC-4 | Con số 1393 ghim trong khi nền theo `origin/main`; `uvx` và `pipx` có thể khác bản | `main` tiến lên, E3 đỏ giả | Tính từ nền cố định; in phiên bản pre-commit | Đã sửa: `history` đọc `499ee2cf` cố định; `commits-judged` in phiên bản; khác biệt với runner ghi ở Notes |
| P2 | Notes | PR đang mở không tự chấm lại; câu về release-please chưa đo | Chủ kho tưởng PR đỏ tự xanh | Ghi rõ | Đã sửa: Out of scope ghi PR đang mở cần sự kiện mới; Notes ghi câu release-please đọc từ lần chạy, không đo riêng |
