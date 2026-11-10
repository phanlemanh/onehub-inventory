---
schema_version: 2
feature_slug: khung-va-giao-dien
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5463021943e1a8a9fbf0fd2b8d8566cc7e441598
human_signoff:
---

# Evidence Report: khung-va-giao-dien

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-10 | script | PASS |
| E12 | AC-11 | test | PASS |
| E13 | AC-11 | script | PASS |
| E14 | AC-12 | script | PASS |
| E15 | AC-12 | ui-check | PASS |
| E16 | AC-6 | judgment | PASS |
| E17 | AC-12 | script | PASS |

## Evidence

### Round 2 (chạy lại ở vòng này)

- eval: E1
  run_id: minted-khung-va-giao-dien-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-10T23:30:19Z
  output: |
    make e2e (cover E1, E2, E5): 106 passed (25.6s)

- eval: E2
  run_id: minted-khung-va-giao-dien-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-10T23:30:19Z
  output: |
    make e2e (cover E1, E2, E5): 106 passed (25.6s)

- eval: E5
  run_id: minted-khung-va-giao-dien-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-10T23:30:19Z
  output: |
    make e2e (cover E1, E2, E5): 106 passed (25.6s)

- eval: E17
  run_id: minted-khung-va-giao-dien-E17-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-10T23:30:19Z
  output: |
    design-floor-s4.mjs --root . chạy xong, không in dòng nào; sàn thiết kế bậc M1 không báo hex thô.

- eval: E15
  run_id: minted-khung-va-giao-dien-E15-r2
  exit_code: 0
  baseline: n-a
  verifier: config:capture.ui
  verified_at: 2026-11-10T23:30:19Z
  screenshot: evidence/E15-step1.png
  observed: |
    step1 (1440 light): the sidebar on the left has the OneHub logo and the items Hôm nay, Bảng hàng (highlighted with a light-blue background) and Đã gửi. The header has a sidebar toggle and a theme icon. The page has a large h1 "Bảng hàng". Matches Expected.
    step2 (dark): the page background is near black, the sidebar is dark grey, the h1 and menu text are white, and "Bảng hàng" has a lighter highlight. Readable. The logo text "OneHub" is dark on the dark sidebar and low contrast, which Expected does not cover.
    step3 (proto): the h1 is "Bản mẫu khung", with the sidebar present. The "Định dạng" section shows labels and values: 4,85 tỷ, 320 triệu, 999.999 ₫, 75,5 m², 2.418, 05/11/2026, 14:30 05/11/2026, 0900 000 001 and —. "Màu trạng thái" shows two rows of six coloured badges (orange, green, blue, blue, amber, red). There is also a notification-channel form with a "Lưu thử" button and four links under "Trạng thái toàn trang". Matches Expected.
    step4 (360 error): no sidebar, the toggle is in the top bar. The centred title "Màn này chưa hiện được" is followed by a three-part message: what happened, that saved data is unaffected, and what to do next. A blue "Thử lại" button sits below it. Nothing overflows horizontally. Matches Expected.
    step5 (360 sheet): the sidebar sheet is open over about 75 percent of the width, showing the logo and Hôm nay, Bảng hàng (highlighted) and Đã gửi. The page behind it is dimmed. Matches Expected.
    step6 (404): a centred "Không tìm thấy trang" with a two-sentence explanation and a "Về trang đầu" button. No sidebar and no header. Matches Expected.
  network_observed: clean

### Carry-forward từ round 1 (delta không chạm paths của eval — không chạy lại)

- eval: E3
  run_id: minted-khung-va-giao-dien-E3-r1
  exit_code: 0
  carried_from_round: 1
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:19:16Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-khung-va-giao-dien-E4-r1
  exit_code: 0
  carried_from_round: 1
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:19:16Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-khung-va-giao-dien-E6-r1
  exit_code: 0
  carried_from_round: 1
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-10T23:19:16Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-khung-va-giao-dien-E7-r1
  exit_code: 0
  carried_from_round: 1
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-10T23:19:16Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-khung-va-giao-dien-E8-r1
  exit_code: 0
  carried_from_round: 1
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-10T23:19:16Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-khung-va-giao-dien-E9-r1
  exit_code: 0
  carried_from_round: 1
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:19:16Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-khung-va-giao-dien-E10-r1
  exit_code: 0
  carried_from_round: 1
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:19:16Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-khung-va-giao-dien-E11-r1
  exit_code: 0
  carried_from_round: 1
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-10T23:19:16Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-khung-va-giao-dien-E12-r1
  exit_code: 0
  carried_from_round: 1
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:19:16Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-khung-va-giao-dien-E13-r1
  exit_code: 0
  carried_from_round: 1
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-10T23:19:16Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E14
  run_id: minted-khung-va-giao-dien-E14-r1
  exit_code: 0
  carried_from_round: 1
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-10T23:19:16Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Judgment

Đề xuất panel: PASS. Hội đồng chấm trên nội dung frame-copy.ts. human_override để trống cho người điền ở Cổng 2.

- eval: E16
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment) — fresh context
  verdict: PASS
  rationale: Cả ba góc nhìn đều thấy các nhóm câu error, notFound, sessionExpired, băng mất mạng và băng lưu hỏng có đủ chuyện gì xảy ra, vì sao, làm gì tiếp; xưng «bạn», không dấu chấm than, không trùng nhãn pref, lease, alt trong labels.yaml.
  votes:
    - domain-correctness: PASS — Cả bốn nhóm câu trong frame-copy.ts đều có đủ chuyện gì xảy ra, vì sao, làm gì tiếp. Trang lỗi, trang không tìm thấy và trang hết phiên có title, why và next. Băng mất mạng nêu việc mất mạng, lý do và cách xử lý. Băng lưu hỏng nêu title có lý do, rồi detail có «Thử lại». Chuỗi nào có xưng hô đều dùng «bạn», không chuỗi nào có dấu chấm than, và không chuỗi nào trùng pref, lease hay alt trong labels.yaml. Điểm yếu nhỏ: ở trang lỗi, "vì sao" chỉ nói chung là có lỗi khi dựng màn, nhưng vẫn đủ ba phần.
    - operational-feasibility: PASS — Cả bốn nhóm câu trong frame-copy.ts đều có đủ chuyện gì xảy ra, vì sao, làm gì tiếp. Với băng mất mạng (offline) và băng lưu hỏng (saveFailedOffline), "vì sao" nằm ngay trong tiêu đề và "làm gì" nằm ở detail. Các câu đều gọi người dùng là «bạn» theo language.md, không có dấu chấm than, và không chuỗi nào trùng chính xác một nhãn pref, lease hay alt trong labels.yaml.
    - spec-alignment: PASS — Các nhóm error, notFound, sessionExpired đều có title (chuyện gì), why (vì sao), next (làm gì tiếp). Băng offline có title, lý do "không có mạng" và hướng dẫn kiểm tra wifi. Băng saveFailedOffline có lý do ngay trong title ("vì mất kết nối mạng") và bước tiếp trong detail ("bấm «Thử lại»"). Chuỗi nào cần xưng hô đều dùng «bạn», không có dấu chấm than, và không chuỗi nào trùng đúng pref, lease hay alt nào trong labels.yaml.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-khung-va-giao-dien-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-10T23:30:19Z

- cmd: npm run build
  run_id: minted-khung-va-giao-dien-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-10T23:30:19Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval không-phân-biệt (pass trên cả HEAD lẫn baseline, chứng minh harness chứ không phải feature; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- make test: E3, E4, E9, E10, E12
- design-floor-s4.mjs --root .: E17

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: lệnh suite make check đỏ ở vòng đầu; trả về triển khai.
Round 2: chạy lại E1, E2, E5, E15, E17 và hai lệnh suite, tất cả xanh; các eval còn lại carry-forward từ round 1.
