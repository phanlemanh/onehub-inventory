---
slug: upgrade-repo-setup-0-10-1
at: 2026-11-20T09:40:00Z
verdict: findings
p0: 0
p1: 5
p2: 5
---

# Phản biện context sạch

Một tác tử mới (vai chỉ đọc) đọc hợp đồng, evals, ma trận `rang/matrix.mjs`, diff của PR #93 và phản biện của hồ sơ
`upgrade-repo-setup-0-9-0`; không đọc phép đo, không chạy lệnh. Cột «Xử lý» ghi việc hồ sơ đã làm sau phản biện, trước
Cổng 1.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P1 | contract (AC-4) | AC-4 chạy trên máy có `node_modules`; không ghim hook nào thật sự chạy ở stage commit-msg (hook không khai `stages` chạy ở mọi stage); `pipx` hỏng mà không in dòng lỗi thì bị hiểu là «từ chối» | Một hook khác đỏ trên runner, phép dò thấy «có hook từ chối», mọi commit bị đổ lỗi; trên máy AC-4 vẫn xanh | Chạy trong bản sao sạch; ghim danh sách hook; phép dò phải trượt đúng ở hook của `tools/commit_msg.py` | Đã sửa: AC-4 chạy trong worktree sạch, ghim tám hook chạy ở commit-msg và chỉ `commit-message` trượt với tin một dấu chấm. Ca `pipx` hỏng và lượt đầu trên runner ghi ở Notes như rủi ro chưa đo |
| P1 | contract (Hỏi-2) / evals E4 | Hỏi-2 nói `tools/commit_msg.py` từ chối tiêu đề kit và đếm 13 commit, không tiêu chí nào đo | Chủ kho chấp nhận Hỏi-2 dựa trên con số không ai đo | Thêm ca `Gate 2 signoff: …`, `repin(…)`; phép đếm lặp lại được trên nền | Đã sửa: AC-4 có hai tiêu đề kit (bị từ chối) và phép đếm trên nền từ 2026-11-01, ghim 7 + 5 + 1 |
| P1 | contract (Hỏi-2) | «Job không bắt buộc» chưa được đo | Job thật ra nằm trong check bắt buộc, sau gộp mọi PR có chữ ký kit bị chặn | Đọc ruleset và bảo vệ nhánh của `main` | Đã sửa: thêm AC-9 (E9) đọc ruleset, bảo vệ nhánh kiểu cũ và cài đặt gộp |
| P1 | evals E4 / E8 | Không ca đỏ nào phá kịch bản của job; hợp đồng không nói E4 trích khối từ tệp hay tự viết lại | `judge` luôn trả 0 hoặc bỏ phép dò mà E4 vẫn xanh | Trích đúng khối, in sha256; thêm ca hai chiều phá kịch bản | Đã sửa: AC-4 nói rõ trích nguyên văn và in sha256 của khối; AC-8 thêm hai ca (`return 0`, phép dò không dừng), 12 bài |
| P1 | rang/matrix.mjs (AC-5) | Dòng thêm của `AGENTS.md` chép từ diff, không có nguồn ngoài cây | `apply.py` gộp sai rồi được commit, AC-5 và AC-2 vẫn xanh | Chạy tag thật trên bản sao của nền, so ba tệp với HEAD từng byte | Đã sửa: AC-2 thêm lần chạy thật trên bản sao tạm của nền, so `pr-title.yml`, `AGENTS.md`, `.repo-setup.json` từng byte (chờ Hỏi-1) |
| P2 | contract (AC-1) | Con số đọc từ chính nhánh; dùng `check-quick` trong khi `AGENTS.md` đòi `make check` | Một bài bị bỏ qua từ trước lọt qua; phần chỉ `make check` có không được chạy | Chạy trên nền và so; hoặc chạy `make check` | Đã sửa một phần: AC-1 nay chạy `make check`. Không so với nền bằng lượt riêng (PR không đổi mã hay bài kiểm, AC-7 đo); ghi ở Notes |
| P2 | contract (Coverage) | Không ai nói job đi nhánh nào trên kho này theo cài đặt gộp | Kho chỉ squash: job xanh mà không chấm gì | Đọc cài đặt gộp | Đã sửa: AC-9 đo merge commit hoặc rebase đang bật |
| P2 | contract (AC-6) | `wiki/log.head.md` thành tệp của công cụ, không nói hệ quả | Sửa tay sau này bị coi là xung đột | Tag có bản mẫu không | Ghi ở Notes: tag có `presets/_core/starter/wiki/log.head.md.tmpl`, tệp đi đường gộp ba chiều |
| P2 | contract (AC-5) | Mục mới nói «không máy nào canh luật khác» trong khi có máy canh nhãn; mục nối sau khối `next dev` tự viết | Tác tử đọc hai câu mâu thuẫn; `next dev` chèn lại khối, phép đo đỏ ở lượt ghim lại | Liệt kê luật có máy canh; đọc chỗ `next dev` chèn | Ghi ở Notes để gửi repo-setup; sửa ngoài phạm vi |
| P2 | pr-title.yml (job mới) | Job `pull_request_target` in nguyên đầu ra hook; dòng `::…::` trong tin commit đi vào luồng lệnh nếu hook in lại tin | Một tin commit điều khiển runner | Ca thử với dòng giống lỗi pre-commit | Đã thêm ca: tin có dòng `An error has occurred: …` vẫn bị từ chối, không ra «could not run». Rủi ro lệnh workflow ghi ở Notes để gửi repo-setup |
