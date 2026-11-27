---
schema_version: 2
feature_slug: khung-luoi-va-ngan-chi-tiet
verdict: BLOCKED
triage_failed: true
failed_evals: [E18]
reason: |
  E6 không chạy được: webServer của config Playwright không khởi động được vì cổng 3613 đã bị tiến trình khác chiếm (listen EADDRINUSE :::3613). Lệnh `bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E6` chạy đúng một lần, không sửa code, không đổi branch, không chạy lại. Cần giải phóng cổng 3613 (hoặc dừng server đang chạy trên đó) rồi chạy lại E6.
  E15 không có kết quả: lệnh `bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E15` — agent bị skip/chết, không được tính là pass.
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f29510740345d6150c1e988322be231279653309
human_signoff:
---

# Evidence Report: khung-luoi-va-ngan-chi-tiet

⚠ phân loại phạm vi KHÔNG chạy được — không lỗi nào được máy tự sửa; danh sách đầy đủ nằm trong review-findings.md và người xem lại toàn bộ trước khi ký.

Round 2. Lệnh fail không gắn eval: `ui-check:E18` (gắn E18, đã tính trong bảng).

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-1 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-2 | script | PASS |
| E5 | AC-3 | script | PASS |
| E6 | AC-4 | script | BLOCKED (cổng 3613 bị chiếm, không chạy được) |
| E7 | AC-5 | script | PASS |
| E8 | AC-6 | script | PASS (carry-forward từ round 1) |
| E9 | AC-7 | script | PASS |
| E10 | AC-8 | script | PASS |
| E11 | AC-9 | script | PASS |
| E12 | AC-10 | script | PASS |
| E13 | AC-11 | script | PASS |
| E14 | AC-11 | script | PASS |
| E15 | AC-11 | script | BLOCKED (agent bị skip/chết, không có kết quả) |
| E16 | AC-11 | script | PASS (carry-forward từ round 1) |
| E17 | AC-11 | script | PASS |
| E18 | AC-1 | ui-check | FAIL |
| E19 | AC-12 | judgment | chờ người (hội đồng đề xuất PASS, human_override còn trống) |
| E20 | AC-1 | script | PASS |
| E21 | AC-3 | script | PASS |
| E22 | AC-3 | script | PASS |

## Evidence

Payload round này không kèm thời điểm chạy cho từng eval chạy lại; không bịa verified_at. Mã chạy nằm trong run-log.jsonl.

- eval: E1
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  output: |
    18 passed (42.3s)

- eval: E2
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  output: |
    8 passed (31.3s)

- eval: E3
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  output: |
    31 passed (1.1m)

- eval: E4
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  output: |
    4 passed (23.2s)

- eval: E5
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  output: |
    6 passed (31.8s)

- eval: E6
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E6-r2
  verdict: BLOCKED
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  output: |
    [WebServer] Failed to start server: listen EADDRINUSE, address already in use, port 3613
    Process from config.webServer was not able to start.
    Không có bài nào chạy; không tính là pass. Cần giải phóng cổng 3613 rồi chạy lại E6.

- eval: E7
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  output: |
    6 passed (28.9s)

- eval: E8
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E8-r1
  exit_code: 0
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T09:13:46Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  output: |
    8 passed (31.0s)

- eval: E10
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  output: |
    4 passed (23.8s)

- eval: E11
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  output: |
    20 passed (32.6s)

- eval: E12
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  output: |
    4 passed (15.3s)

- eval: E13
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E13-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  output: |
    make check passed: upgrade lint typecheck test ignore ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E14
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E14-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  output: |
    Lệnh DATABASE_URL= make e2e kết thúc bình thường; phần cuối nhật ký chỉ ghi "pending", không có dòng tổng số bài.

- eval: E16
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E16-r1
  exit_code: 0
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T09:13:46Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E17
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E17-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  output: |
    design-floor-s4 chạy xong, không thấy màu hex thô.

- eval: E18
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E18-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.ui-check
  screenshot: evidence/E18-step1.png
  observed: |
    sau/ngan-1440-light.png: the record has a white surface like the page and a thin left border, with no visible shadow on the grid (pixels 255 right up to the border). sau/ngan-1440-dark.png: the record is lighter than the page (23 vs 10) with a visible border, so it stands apart. pha/ngan-1440-light-khong-tach.png: no border, no shadow, not apart. pha/ngan-1440-dark-khong-tach.png: border and shadow removed, but the panel is 10 against the grid card's 23, so a faint step remains. 1024 and 360/414 in step1 and step2: the record stands full height with an icon-only head; the 1024 toolbar is icon-only and the grid fills the screen. Light and dark phone frames are readable. This contradicts the Expected for the light shadow and for the dark khong-tach frame.
  network_observed: n-a (driver)
  output: |
    Dev server 127.0.0.1:3470 không chạy; người chấm không tự bật, chấm trên các khung PNG đã lưu (đọc bằng mắt và theo giá trị điểm ảnh).
    Ở 1440, nền sáng, bên "sau": các cột x=890..919 đều là 255, giống lưới, rồi viền 1px (229) ở x=920 — KHÔNG có dải bóng tối dần đổ sang lưới, trái với kỳ vọng.
    Nền tối, bên "sau": ngăn 23 so với trang 10, viền 46 — tách được.
    Chiều đỏ nền sáng "khong-tach": không viền, không bóng — đọc là không tách (đúng).
    Chiều đỏ nền tối "khong-tach": viền và bóng mất nhưng ngăn 10 còn thẻ lưới 23, nên vẫn còn bậc tông 13 mức — chiều đỏ yếu (sát ngưỡng).
    Điện thoại: đầu ngăn một dòng, nút chỉ hình ở góc phải trên. Thanh công cụ, hàng lọc và «Lưu góc nhìn» trên điện thoại chưa kiểm trong các khung ngan-loc-*.
    Kết quả: không đạt vì thiếu bóng ở nền sáng và khung đỏ nền tối còn bậc tông.

- eval: E20
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E20-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  output: |
    4 passed (11.0s)

- eval: E21
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E21-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  output: |
    4 passed (11.0s) — cùng lệnh với E20

- eval: E22
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E22-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  output: |
    2 passed (11.5s)

- eval: E15
  verdict: BLOCKED
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  output: |
    agent bị skip/chết — không có kết quả, không được tính là pass.

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-khung-luoi-va-ngan-chi-tiet-SUITE-build-r2
  exit_code: 0

### Judgment

- eval: E19
  judged_by: hội đồng 3 lăng kính (fresh context) — đề xuất
  verdict: PASS
  rationale: Cả ba lăng kính cùng đề xuất PASS; có hai chỗ lệch nhỏ ngoài phạm vi câu hỏi (dòng 28 của behaviors.md còn ghi «…» chứa việc của vùng; ghi chú «khi ngăn nổi» / «Chỗ chưa phủ» chưa theo Hỏi-7). Mỗi phiếu dưới đây giữ đủ lý do.
  votes:
    - domain-correctness: PASS — (1) Bảng «Từng chỗ và cách làm» có một dòng cho mỗi điều đã quyết (Q1–Q4, A5, B3, B1/B2/«…», L1–L6), và cột «Sau» không thêm việc ngoài lời chủ kho. (2) Mục «Bộ nút theo quyền» của behaviors.md có chuẩn nút ba câu và luật «…» ba điểm, đúng nghĩa đoạn nguyên văn, mỗi khối ghi lời duyệt và ngày 2026-11-27. Dòng «Mở hồ sơ cạnh bảng» không còn «đứng dưới thanh công cụ» hay «hai dòng» như hiện trạng. (3) Các câu (a)–(f) và các câu chi-nguoi của decisions.jsonl chỉ nằm ở mục «Chưa quyết» hoặc «Chỗ chưa phủ», và đều ghi là dựng ở lát 2. Chúng không có trong phần đã làm của design.md, behaviors.md hay 0051. Có hai chỗ lệch nhỏ ngoài phạm vi câu hỏi. Dòng 28 của behaviors.md còn nói «…» chứa việc của vùng, trái với L1. Dòng Q4 của design.md ghi «khi ngăn nổi», trong khi Hỏi-7 đã mở rộng sang cả khi ghim.
    - operational-feasibility: PASS — (1) Bảng «Từng chỗ và cách làm» có một dòng cho mỗi điều: Q1, Q2, Q3, Q4, A5, B3, một dòng gộp B1/B2/«…» và L1–L6. Cột «Sau» khớp lời nguyên văn. Hỏi-7 (chỉ hình cả khi ghim) là điều chủ kho đã duyệt ở cổng. Nó nằm ở trạng thái ghim của bảng trạng thái và ở 0051, nên không tính là việc thêm. (2) Mục «Bộ nút theo quyền» có chuẩn nút ba câu và luật «…» ba điểm, đúng nghĩa từng điểm của đoạn nguyên văn. Mỗi khối ghi «chủ kho 2026-11-27» kèm lời duyệt. Dòng «Mở hồ sơ cạnh bảng» không còn cụm «đứng dưới thanh công cụ» hay «đầu hồ sơ hai dòng» như trạng thái hiện hành, chỉ nhắc lại trong cụm «thay …». (3) Các câu (a)–(f) chỉ nằm ở mục «Chưa quyết» và ở decisions.jsonl dưới dạng chi-nguoi. Chúng không có trong bảng «Sau», trong sổ hành vi hay trong 0051.
    - spec-alignment: PASS — Bảng «Từng chỗ và cách làm» có một dòng cho mỗi điều đã quyết (Q1–Q4, A5, B3, L1–L6). B1, B2 và luật «…» gộp chung một dòng nhưng vẫn đúng một chỗ, và cột «Sau» khớp lời chủ kho, không thêm việc. Mục «Bộ nút theo quyền» trong behaviors.md có luật «…» ba điểm và chuẩn nút ba câu, đúng nghĩa đoạn nguyên văn, mỗi khối ghi «chủ kho 2026-11-27» kèm lời duyệt. Dòng «Mở hồ sơ cạnh bảng» (dòng 12) không còn «đứng dưới thanh công cụ» hay «đầu hồ sơ hai dòng»; chữ «hai dòng» chỉ còn ở dạng nhắc việc thay thế hàng 3e. Các câu (a)–(f) và câu chi-nguoi chỉ nằm ở mục «Chưa quyết» hoặc «Chỗ chưa phủ» của design.md, không có trong behaviors.md hay 0051. Có hai chỗ lệch nhỏ, không đổi phán quyết: mục «Chỗ chưa phủ» còn ghi ngăn ghim giữ chữ dù Hỏi-7 đã được duyệt, và dòng 28 của behaviors.md còn ghi «…» chứa việc của vùng.
  required_evidence:
    - (judge không nêu bằng-chứng-thiếu)
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên cả bản đang kiểm lẫn baseline; chứng minh harness chứ không phải feature — viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý):
- E13 (`make check`): baseline green.
- E17 (`design-floor-s4`): baseline green.

Baseline không đo:
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E1: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E2: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E3: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E4: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E5: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E6: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E7: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E9: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E10: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E11: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E12: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E15: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E20: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E22: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (không eval nào có runs lớn hơn 1).

## Iterations

Round 1: E8 và E16 xanh và được giữ lại (carry-forward); phần còn lại của round 1 nằm trong sổ ledger của hàng, không có trong payload round này.
Round 2: E18 không đạt — nền sáng thiếu dải bóng đổ sang lưới và khung đỏ nền tối còn bậc tông; E6 bị chặn vì cổng 3613 đã bị chiếm; E15 không có kết quả vì agent bị skip/chết; phân loại phạm vi không chạy được nên không lỗi nào được máy tự sửa. Trả về cho người quyết.
