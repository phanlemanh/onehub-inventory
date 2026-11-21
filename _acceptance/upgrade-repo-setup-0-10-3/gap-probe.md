---
slug: upgrade-repo-setup-0-10-3
at: 2026-11-21T04:30:00Z
verdict: findings
p0: 0
p1: 2
p2: 9
---

# Phản biện context sạch

Một tác tử mới (vai chỉ đọc) đã đọc hợp đồng, evals, sổ quyết định, ma trận `rang/matrix.mjs` và mọi phép đo. Nó đọc thêm các
tệp của lần lên đời ở HEAD và ở nền, tệp mà công cụ để lại khi đánh dấu, bản mẫu của chính sách, ghi chú phát hành 0.10.3,
`_acceptance/config.yaml`, `Makefile` và `ci.yml`. Nó không chạy lệnh nào. Cột «Xử lý» ghi việc hồ sơ đã làm sau phản biện,
trước Cổng 1.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P1 | `flow.mjs`, AC-8 | Bản trang luôn có câu cố định chứa chữ «over», nên «báo cáo nói over» luôn đúng; lần chạy không vượt ngưỡng không được kiểm là vắng chữ ấy | Bỏ cột kết luận hay thôi vẽ bảng ngưỡng mà AC-8 vẫn xanh | Tìm đúng dòng bảng, hay `"verdict": "over"`; đòi lần không vượt không có | Đã sửa: bản trang tìm đúng dòng `9 of 20 (45%) … over`, bản JSON tìm `"verdict": "over"`, và lần không vượt ngưỡng phải vắng cả hai |
| P1 | `flow.mjs`, bài phá của flow | Chỉ chạy bản trang và `--json`; nhánh `--split` và `--write` không chạy mà kết luận vẫn khẳng định về `--write` | Một hồi quy đổi mã thoát trong nhánh split, hay `--write` ghi ra ngoài `wiki/`, lọt qua | Chạy thêm `--split` và `--write` | Đã sửa: bốn dạng (trang, `--json`, `--split`, `--split --json`); `--write` chạy trên bản sao tạm, chỉ được ghi trang của tuần và `wiki/index.md`; bài phá mới cho nhánh split |
| P2 | `flow.mjs`, audit hook | Hook gắn sau khi nạp công cụ; cờ của `os.open` không được đọc; cửa sổ GitHub rỗng; danh sách tệp có thể gọi công cụ quá hẹp | «Không mở tệp hồ sơ nào» chỉ đúng cho cửa sổ rỗng | Gắn hook trước, đọc cờ, mở rộng danh sách | Đã sửa: hook gắn trước khi nạp, đọc cờ ghi của `os.open`, Python chạy `-B`; quét thêm `package.json`, cấu hình pre-commit, `.claude/settings.json`. Cửa sổ rỗng ghi thành giới hạn trong AC-8 |
| P2 | `POLICY_VIEW`, `policy-same.mjs`, AC-5 | Chỉ so hạng với tệp sửa; không so hạng chung, các nhánh nâng hạng khác, nhãn, môi trường | Câu «không gì chính sách quyết định đổi» rộng hơn điều đo | So thêm các nhánh và toàn bộ bước | Đã sửa: so hạng chung, hạng của một tệp bài kiểm bị xoá và của một lần bot nâng phụ thuộc, và mọi bước của `github_setup.py` trừ bước gộp. Nhánh có đường ống tác tử không xét: kho không có nó |
| P2 | `merge-method.mjs`, `real-run.mjs` | `gh` giả không ghi lệnh; «dừng trước mọi thay đổi» chỉ là suy ra; real-run chỉ kiểm mã thoát 2, mà argparse cũng thoát 2 | Bỏ tuỳ chọn khỏi argparse mà AC-7 vẫn qua | Ghi lại lệnh `gh`; so lời từ chối | Đã sửa: `gh` giả ghi mọi lệnh, với `rebase` chỉ được có `repo view`; hạng so trên mọi tệp git theo dõi; real-run so đúng lời từ chối |
| P2 | `real-run.mjs`, Notes | Không đọc ruleset theo tên, không nói `--apply` làm gì trước khi tới ruleset; chữ «lần chạy đầu» không có bằng chứng | Chủ kho tin `--apply` an toàn vì «nó dừng» | Đọc ruleset theo tên; viết lại Notes | Đã sửa: real-run đọc tên ruleset («main», không phải tên `github_setup.py` tìm) và `require_code_owner_review` (false). Notes ghi thứ tự của `--apply`: đặt cách gộp, ghi hai môi trường, rồi tạo thêm ruleset thứ hai. Bỏ chữ «đầu» |
| P2 | Hỏi-1, sổ quyết định | Lý do «lần lên đời sau không đánh dấu lại» nói tuyệt đối mà không đo; Hỏi-1 không nói chú thích mới nhắc đường ống tác tử kho không có, và `required_checks: []` tường minh trong khi `main` đòi `e2e`, `gate` | Chủ kho chọn trên một lợi ích chưa đo | Viết lại cho cân | Đã sửa: Hỏi-1 nêu cả ba điểm và nói hồ sơ không đo được cách nào ít bị đánh dấu hơn; máy vẫn khuyên giữ, ghi rõ là lý do yếu; một dòng sổ mới thay dòng cũ |
| P2 | `two-way.mjs` | Không có bản phá cho lối thoát sớm khi giá trị lạ, đường không khoá, phép kiểm codeowners đọc `merge_method`, khối CODEOWNERS | Chưa có bằng chứng các nhánh ấy đỏ đúng lời | Thêm bản phá | Đã sửa: thêm bốn bài phá (giá trị lạ không dừng, không khoá thì squash, phép kiểm codeowners thôi đọc `merge_method`, CODEOWNERS lệch); bản xem chính sách báo lỗi chạy thay vì sập |
| P2 | `change-set.mjs`, AC-9 | Đo khi hồ sơ chưa commit; không so với `main` hôm nay | Một commit sau lượt đo lọt qua | Chạy lại trên đầu cuối; thêm merge-tree | Đã sửa: hồ sơ đã commit trước khi đo; thêm `git merge-tree` với `origin/main`. Lượt chấm chạy E9 trên đầu cuối của PR và ghi sha |
| P2 | Notes, hạng `high` | Câu «hạng high, code owner gộp» không có phép đo; ruleset không đòi code owner | PR T3 gộp được mà không có code owner | Chạy `autonomy.py --base`; đọc luật pull request | Đã sửa: AC-9 chạy `autonomy.py --base <nền> --head HEAD` và đòi `high`; AC-7 đọc `require_code_owner_review` (false); Notes nói GitHub không bắt buộc code owner |
| P2 | `apply-again.mjs`, `template-same.mjs` | Không có `git status` của bản sao sau lần chạy thật; mã băm của `AGENTS.md` và tệp chính sách chỉ kiểm là «có đổi» | Công cụ ghi lặng lẽ một tệp khác mà AC-2 vẫn qua | `git status` đúng mười một tệp; ghim hai mã băm | Đã sửa: `git status` của bản sao phải nêu đúng mười một tệp. Hai mã băm được ghim qua việc manifest mà bản sao ghi giống từng byte manifest ở HEAD |
