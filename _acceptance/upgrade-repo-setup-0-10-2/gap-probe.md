---
slug: upgrade-repo-setup-0-10-2
at: 2026-11-20T09:50:00Z
verdict: findings
p0: 0
p1: 5
p2: 5
---

# Phản biện context sạch

Một tác tử mới (vai chỉ đọc) đã đọc hợp đồng, evals, ma trận `rang/matrix.mjs` và mọi phép đo. Nó đọc thêm bốn tệp của lần
lên đời ở HEAD và ở nền (cùng diff), `governance/autonomy.yaml`, `.pre-commit-config.yaml`, `tools/commit_msg.py`, job
`gate` của `ci.yml` và `_acceptance/config.yaml`. Nó không chạy lệnh nào. Cột «Xử lý» ghi việc hồ sơ đã làm sau phản biện,
trước Cổng 1.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P1 | `pr-title.yml` (`could_not_run`), `fence.mjs`, AC-4 | Nhánh «could not run» chưa bao giờ chạy với lời do người viết PR điều khiển. Câu «chỉ in ở một chỗ» chỉ đếm `cat`, trong khi dòng lỗi vẫn trích `grep -A1` của đầu ra hook | Bỏ `quoted` khỏi dòng lỗi «could not run», 18 bài vẫn xanh; thân tin `An error has occurred: FatalError: x\r::add-mask::y` lọt ra ngoài rào | Thêm commit ấy với hook giả `cat`; thêm bản phá bỏ `quoted` | Đã sửa: `fence.mjs` có ca «could not run» (một rào đã đóng, dòng lỗi không còn ký tự điều khiển, không đoạn nào sau `\r` là lệnh); `two-way.mjs` có bản phá; AC-4 ghi «nguyên đầu ra (`cat`) ở một chỗ» và thêm gạch cho nhánh này |
| P1 | `github_setup.py` (`main`), `policy.mjs` | Phép đo tự tính `own` rồi gọi `plan`, nên cách `main` nối `own_checks` không được đo. Ca «`gate` ở cả hai chỗ» cũng chưa đo | `main` về lại `proof_check(policy), required_checks(policy)`, ruleset thật bỏ `gate`, `policy` vẫn xanh | Chạy qua `main` với `gh` giả; thêm ca hai chỗ; thêm bản phá `main` | Đã sửa: `policy.mjs` gọi `github_setup.main([])` với `gh` và hai hàm đọc GitHub giả, rồi bắt các đối số `main` đưa cho `plan`; có ca «cả hai chỗ»; `two-way.mjs` phá `main` và thấy `gate` 0 lần |
| P1 | `pr-title.yml` (env của bước), `credentials.mjs`, AC-6 | `GH_TOKEN` ở `env` của cả bước, nên pre-commit và mọi hook thừa hưởng token. `persist-credentials: false` chỉ gỡ token khỏi `.git/config` | Một hook đọc `$GH_TOKEN` thì AC-6 vẫn xanh (tác động thấp: `contents: read`, hook lấy từ nhánh nền) | Đo token tới hook, hoặc ghi giới hạn và sửa câu | Đã ghi: AC-6 sửa câu («không còn trong `.git/config`») và thêm giới hạn đã biết; Notes ghi gửi về repo-setup. Không đo, vì đây là điều có từ nền và lần lên đời không đổi nó |
| P1 | `change-set.mjs`, AC-9 | AC-9 nói config «chỉ thêm lệnh `rs0102_*`» nhưng phép đo chỉ kiểm tên tệp. Hạng T3 đọc `t3_paths` từ config của PR | PR sửa `risk_tiers` hay `signoff` mà change-set vẫn xanh, kể cả kiểm T3 | So config nền với HEAD; đọc `t3_paths` từ nền; thêm bản phá | Đã sửa: mọi dòng thêm phải là `    rs0102_<tên>: …`, không dòng nào bị bỏ; `t3_paths` đọc từ config của nền; `two-way.mjs` thêm một dòng lạ vào config và thấy đỏ |
| P1 | `lib.mjs` (`pluginTree`), AC-2, AC-3 | Không có gì ghim cây mẫu: biến môi trường hay cache được nhận không kiểm; tarball lấy theo tên tag; `PLUGIN_COMMIT` không ai đọc | Cache cũ hay tag trỏ lại thì `template-same` lẫn `apply-again` so HEAD với cùng một cây sai | Bóc tag, đòi bằng `PLUGIN_COMMIT`, tải theo sha | Đã sửa: `tagCommit()` bóc tag qua đối tượng tag và đòi bằng `2f8f1415`; tarball tải theo sha; cache chỉ dùng khi có dấu của sha; bỏ biến `REPO_SETUP_TREE` |
| P2 | `lib.mjs` (`fences`), `fence.mjs`, `two-way.mjs` | Runner trim đầu dòng trước khi tìm `::`; danh sách lệnh ngoài rào không tách `\r`; không bản phá cho mã cố định hay dòng đóng lệch mã; ca không có dấu xuống dòng ở cuối không xảy ra | Mã hằng hay dòng đóng lệch vẫn xanh; `  ::warning::x` ngoài rào không bị đếm | Trim và tách `\r`; thêm hai bản phá | Đã sửa: `fences()` trim trước khi tìm rào; phép đo tìm lệnh trên từng đoạn đã trim và tách `\r`; hai bản phá mới (mã cố định, dòng đóng lệch). Ca không xuống dòng ở cuối ghi ở Notes |
| P2 | `two-way.mjs`, `matrix.mjs` (`ANSWERS[4]`), AC-5 | Bản phá «luôn trả 0» đỏ nhờ phép dò, không nhờ so câu trả lời; `ANSWERS[4]` không đo điều nó mang tên | `exit "$failed"` thành `exit 0` không bài nào chứng minh là bị bắt | Thêm bản phá ấy; nói rõ `ANSWERS[4]` | Đã sửa: bản phá `exit 0` thấy «answers 0 on update stuff, not 1»; tên `ANSWERS[4]` và AC-5 nói ca ấy không đi nhánh «could not run», nhánh ấy đo ở AC-4 |
| P2 | Hỏi-1 | PR thử như mô tả không phân biệt được job cũ với job mới | Rào hỏng trên runner vẫn qua phép thử | Đòi thấy chú thích `Commit <sha> …` sau rào, mã 32 hex, `%` hiện đúng | Đã sửa: Hỏi-1 ghi ba điều phải thấy, và nói rõ phép thử không cho thấy được dòng cài không lọt ra |
| P2 | AC-6, `credentials.mjs` | «Không gọi lệnh git nào» và «kho công khai nên checkout không cần token» nói quá | Lời lẽ | Sửa câu; bỏ phép kiểm visibility | Đã sửa: AC-6 nói «script không viết lệnh `git` nào cần token đã lưu; git của pre-commit chạy cục bộ»; bỏ phép kiểm visibility |
| P2 | Notes, AC-7, AC-1, AC-9 | Vài lời khẳng định không có phép đo đỡ: hạng `high`, ruleset, «lượt đầu», số bài, E9 chỉ đọc commit đã có | Một câu trong Notes sai mà không bài nào đỏ | Đo, hoặc ghi nguồn | Đã sửa: `runner.mjs` đòi lượt ghim là lượt sớm nhất, lần thử 1; Notes ghi nguồn của từng câu không đo; Notes ghi E9 chạy trên đầu cuối của PR ở lượt chấm, commit sau đó do lưới trước-gộp canh. Số bài của AC-1 do E1 chạy trên cây |
