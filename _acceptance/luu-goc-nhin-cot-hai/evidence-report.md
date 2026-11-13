---
schema_version: 2
feature_slug: luu-goc-nhin-cot-hai
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 360a005d0fa127ac09108547e7df3f7d5492f98c
human_signoff:
---

# Evidence Report: luu-goc-nhin-cot-hai

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-2 | test | PASS |
| E4 | AC-3 | test | PASS |
| E5 | AC-4 | script | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-7 | script | PASS |
| E10 | AC-8 | test | PASS |
| E11 | AC-8 | script | PASS |
| E12 | AC-9 | test | PASS |
| E13 | AC-9 | script | PASS |
| E14 | AC-10 | script | PASS |
| E15 | AC-3 | ui-check | PASS |
| E16 | AC-6 | script | PASS |
| E17 | AC-1 | script | PASS |
| E18 | AC-3 | script | PASS |
| E19 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-luu-goc-nhin-cot-hai-E1-r1
  exit_code: 0
  verifier: config:executors.script.goc_nhin_db
  verified_at: 2026-11-13T02:34:48Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-luu-goc-nhin-cot-hai-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goc_nhin_e2e
  verified_at: 2026-11-13T03:09:22Z
  output: |
    10 passed (1.6m)

- eval: E3
  run_id: minted-luu-goc-nhin-cot-hai-E3-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T03:09:22Z
  output: |
    make test hoan tat, khong test nao do

- eval: E4
  run_id: minted-luu-goc-nhin-cot-hai-E4-r1
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T02:34:48Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-luu-goc-nhin-cot-hai-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goc_nhin_e2e
  verified_at: 2026-11-13T03:09:22Z
  output: |
    10 passed (1.6m)

- eval: E6
  run_id: minted-luu-goc-nhin-cot-hai-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goc_nhin_e2e
  verified_at: 2026-11-13T03:09:22Z
  output: |
    10 passed (1.6m)

- eval: E7
  run_id: minted-luu-goc-nhin-cot-hai-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goc_nhin_e2e
  verified_at: 2026-11-13T03:09:22Z
  output: |
    10 passed (1.6m)

- eval: E8
  run_id: minted-luu-goc-nhin-cot-hai-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goc_nhin_db
  verified_at: 2026-11-13T03:09:22Z
  output: |
    tests/db/goc-nhin.db.test.ts chay het, khong ca nao do

- eval: E9
  run_id: minted-luu-goc-nhin-cot-hai-E9-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cach_ly_k
  verified_at: 2026-11-13T03:09:22Z
  output: |
    cach-ly: 31 ca đạt, vai quy_hang_app

- eval: E10
  run_id: minted-luu-goc-nhin-cot-hai-E10-r1
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T02:34:48Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-luu-goc-nhin-cot-hai-E11-r1
  exit_code: 0
  verifier: config:executors.script.goc_nhin_db
  verified_at: 2026-11-13T02:34:48Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-luu-goc-nhin-cot-hai-E12-r1
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T02:34:48Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-luu-goc-nhin-cot-hai-E13-r1
  exit_code: 0
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T02:34:48Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E14
  run_id: minted-luu-goc-nhin-cot-hai-E14-r1
  exit_code: 0
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T02:34:48Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E15
  run_id: minted-luu-goc-nhin-cot-hai-E15-r2
  exit_code: 0
  baseline: n-a
  verifier: config:capture.ui
  verified_at: 2026-11-13T03:09:22Z
  screenshot: evidence/E15-1440-sang-thanh-cong-cu.png
  observed: |
    1440 light and dark: the second column shows "Bảng hàng", "Theo trạng thái" (6 items) and "Góc nhìn của tôi" with two items, indented under a vertical rule like the status group. The first item "[MAU]..." is highlighted with an amber "đã đổi" badge and a "…" button. The second item "[MAU] Hai phò..." is not highlighted. There are no counts. The toolbar row has "Lưu thay đổi" (primary) and "Lưu thành mới" under the Hàng toolbar. The menu shows "Đổi tên", a rule, and "Xoá góc nhìn" in red. The delete dialog reads "Bạn chắc muốn xoá góc nhìn?" with the view name and the buttons "Thôi" and "Xoá góc nhìn". The naming dialog reads "Lưu thành mới" with a Tên field and the buttons "Thôi" and "Lưu". Both dialogs fit. Dark theme contrast is fine, and the red delete item stays legible. 1024 light and dark: the same sidebar structure. The toolbar wraps, and both save buttons sit at the right of the third row, fully visible. Menu and dialogs are the same as at 1440. 414 light and dark: the toolbar frame shows both save buttons on their own row, with the sheet closed. The sheet frames show the full second column in the slide-in panel, with the same group, badge, and a single highlighted item. The menu opens beside the "…". The delete dialog and naming dialog are bottom-anchored cards with stacked full-width buttons, and nothing overflows. 360 light and dark: the same as 414. The toolbar shows both buttons. The second-column item names truncate with an ellipsis, "đã đổi" and "…" are still visible, and the menu and both dialogs wrap their text within the viewport with no horizontal overflow. Seen but outside the five points: a toast "Đã lưu góc nhìn «[MAU] Hai phòng ngủ»." in the corner of the wider frames, and a floating N button overlapping the grid footer at 360 and 414.
  network_observed: n-a (driver)

- eval: E16
  run_id: minted-luu-goc-nhin-cot-hai-E16-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goc_nhin_e2e
  verified_at: 2026-11-13T03:09:22Z
  output: |
    10 passed (1.6m)

- eval: E17
  run_id: minted-luu-goc-nhin-cot-hai-E17-r1
  exit_code: 0
  verifier: config:executors.design.floor
  verified_at: 2026-11-13T02:34:48Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E18
  run_id: minted-luu-goc-nhin-cot-hai-E18-r1
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T02:34:48Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E19
  run_id: minted-luu-goc-nhin-cot-hai-E19-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-13T03:09:22Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-luu-goc-nhin-cot-hai-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-13T03:09:22Z

- cmd: make e2e
  run_id: minted-luu-goc-nhin-cot-hai-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-13T03:09:22Z

## Known limits

## Ngoài hợp đồng

## Analyst

- E19 (make check): xanh ca tren HEAD lan baseline — regression-guard co chu y, khong phan biet tinh nang.

Baseline khong do:
- DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} npx playwright test -c playwright.db.config.ts tests/e2e-db/goc-nhin.spec.ts: bo qua baseline: tep tests/e2e-db/goc-nhin.spec.ts co o cay dang kiem nhung chua co o merge-base f458f6d3dbbb80bfa0c1512fe202559cf45dddef — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} npx vitest run -c vitest.db.config.ts tests/db/goc-nhin.db.test.ts --reporter=verbose: bo qua baseline: tep tests/db/goc-nhin.db.test.ts co o cay dang kiem nhung chua co o merge-base f458f6d3dbbb80bfa0c1512fe202559cf45dddef — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: 19 eval chay lan dau; E15 can khung thanh cong cu truoc khi ngan dien thoai che (S4 round 1). Returned to implementation.
Round 2: E2, E3, E5, E6, E7, E8, E9, E15, E16, E19 chay lai tren commit 8f04f8e, tat ca dat; E1, E4, E10-E14, E17, E18 giu nguyen tu round 1 (delta khong cham paths cua eval).

### Re-pin lần 1 — 2026-11-13, do sửa cảnh báo CodeQL ở bài trình duyệt và ghi số đo vòng sau khi verified
run_id: repin-20261113T034533Z-23967
sha: 360a005d0fa127ac09108547e7df3f7d5492f98c · suites: 3 lệnh exit 0 · evals: 18/18 eval máy đạt kỳ vọng · ngoài làn máy: E15
