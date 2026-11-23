---
schema_version: 2
feature_slug: english-query-words
verdict: REJECT
failed_evals: [E10]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: eac7de4c30c03a54add2332b518502b808c61fea
human_signoff:
---

# Evidence Report: english-query-words

Round 2. Nội dung thay toàn bộ round cũ; lịch sử nằm ở mục Iterations.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-7 | script | PASS |
| E1-pha | AC-7 | script | PASS (carry-forward r1) |
| E2 | AC-4 | test | PASS (carry-forward r1) |
| E3 | AC-3 | test | PASS |
| E4 | AC-1 | test | PASS (carry-forward r1) |
| E5 | AC-2 | script | PASS (carry-forward r1) |
| E6 | AC-2 | script | PASS (carry-forward r1) |
| E7 | AC-6 | script | PASS (carry-forward r1) |
| E8 | AC-5 | script | PASS (carry-forward r1) |
| E9 | AC-5 | script | PASS (carry-forward r1) |
| E10 | AC-8 | script | FAIL |
| E11 | AC-8 | script | PASS (carry-forward r1) |
| E12 | AC-8 | script | PASS |
| E13 | AC-8 | script | PASS (carry-forward r1) |
| E14 | AC-8 | script | PASS (carry-forward r1) |
| E15 | AC-8 | script | PASS (carry-forward r1) |
| E16 | AC-8 | script | PASS (carry-forward r1) |
| E17-ui | AC-4 | ui-check | PASS (carry-forward r1) |
| E18 | AC-4 | script | PASS |

Lệnh fail không gắn eval: `DATABASE_URL= make e2e` (xem khối suite bên dưới). `make check` fail gắn với E10.

## Evidence

- eval: E1
  run_id: minted-english-query-words-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-query-words/rang/query-words.mjs
  output: |
    quet: 9 tu x 11 ngu canh x 5 vung · cham: 0 · giu: 14

- eval: E3
  run_id: minted-english-query-words-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-query-words/rang/chay.sh
  output: |
    (lệnh chạy xong, không có dòng lỗi)

- eval: E10
  run_id: minted-english-query-words-E10-r2
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.check
  output: |
    upgrade: no conflict markers
    ✖ 6 problems (0 errors, 6 warnings)
    node tools/typecheck_own.mjs
    tests/e2e-db/bang-hang-that.spec.ts(636,65): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
    make: *** [typecheck] Error 1

- eval: E12
  run_id: minted-english-query-words-E12-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.test.bang_hang_that_e2e
  output: |
    gac-hydration: 0 canh bao

- eval: E18
  run_id: minted-english-query-words-E18-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.test.bang_hang_that_e2e
  output: |
    gac-hydration: 0 canh bao

### Carry-forward (delta không chạm paths của eval, round này không chạy lại)

- eval: E1-pha
  run_id: minted-english-query-words-E1-pha-r1
  exit_code: 0
  verifier: _acceptance/english-query-words/rang/ (script, không khai ref)
  verified_at: 2026-11-23T10:23:51Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-english-query-words-E2-r1
  exit_code: 0
  verifier: test (không khai ref)
  verified_at: 2026-11-23T10:23:51Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-english-query-words-E4-r1
  exit_code: 0
  verifier: test (không khai ref)
  verified_at: 2026-11-23T10:23:51Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-english-query-words-E5-r1
  exit_code: 0
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-23T10:23:51Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-english-query-words-E6-r1
  exit_code: 0
  verifier: config:executors.script.goc_nhin_e2e
  verified_at: 2026-11-23T10:23:51Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-english-query-words-E7-r1
  exit_code: 0
  verifier: script (không khai ref)
  verified_at: 2026-11-23T10:23:51Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-english-query-words-E8-r1
  exit_code: 0
  verifier: config:executors.script.the_dien_thoai_e2e
  verified_at: 2026-11-23T10:23:51Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-english-query-words-E9-r1
  exit_code: 0
  verifier: config:executors.script.ban_dung_that
  verified_at: 2026-11-23T10:23:51Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-english-query-words-E11-r1
  exit_code: 0
  verifier: config:executors.script.e2e
  verified_at: 2026-11-23T10:23:51Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-english-query-words-E13-r1
  exit_code: 0
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-23T10:23:51Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E14
  run_id: minted-english-query-words-E14-r1
  exit_code: 0
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-23T10:23:51Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E15
  run_id: minted-english-query-words-E15-r1
  exit_code: 0
  verifier: script (không khai ref)
  verified_at: 2026-11-23T10:23:51Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E16
  run_id: minted-english-query-words-E16-r1
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-23T10:23:51Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E17-ui
  run_id: minted-english-query-words-E17-ui-r1
  exit_code: 0
  verifier: ui-check (không khai ref)
  verified_at: 2026-11-23T10:23:51Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval
  screenshot: evidence/E17-ui-step1.png
  observed: |
    Frame old-link-1440.png (read directly): Bảng hàng at 1440. The record drawer is open on the right with heading "0905 · S1.01", Vinhomes Ocean Park 1 · S1.01 · Căn hộ, status Đang giao dịch, 5,71 tỷ, full details (Mã căn 0905, Toà S1.01). The sidebar has the place "Vinhomes Ocean Park 1" with "Tất cả" highlighted, and the table lists 36/60 rows with row 1 = 0905 · S1.01 · Vinhomes Ocean Park. This matches Expected: drawer open, place lit, address carries only the new words (record, place).
  network_observed: n-a (driver)

- eval: E18
  note: khối chạy mới của round 2 nằm ở phần trên; không carry.

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-english-query-words-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-23T10:41:51Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-english-query-words-SUITE-DATABASE_URL_make_e2e-r2
  exit_code: 2
  verified_at: 2026-11-23T10:41:51Z
  output: |
    1218 passed, 1132 skipped, còn một nhóm ca đỏ ở các khổ 414, 1024 và 1440
    (ví dụ tests/e2e/sheet.spec.ts, grid.spec.ts, sua-tren-o.spec.ts, dan-tu-excel.spec.ts, ho-so-can.spec.ts)
    gac-hydration: 0 canh bao

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt) hoặc là eval mới không đo được baseline (xem dưới).

Baseline khong do
- node _acceptance/english-query-words/rang/query-words.mjs --root .: bo qua baseline: tep _acceptance/english-query-words/rang/query-words.mjs co o cay dang kiem nhung chua co o merge-base 25f847090057f37bbd5d9ac35a16f6b272878fda — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/english-query-words/rang/chay.sh E3: bo qua baseline: tep _acceptance/english-query-words/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 25f847090057f37bbd5d9ac35a16f6b272878fda — eval moi, chay tren code cu khong phan biet gi
- make check: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu

## Variance

none — mọi eval chạy một lần, không có eval nhiều lần.

## Iterations

Round 1: các eval E1-pha, E2, E4–E9, E11, E13–E17-ui chạy và đạt (verified 2026-11-23T10:23:51Z).
Round 2: E10 fail — `make check` dừng ở typecheck: tests/e2e-db/bang-hang-that.spec.ts dòng 636 cột 65 truyền `string | undefined` vào tham số `string` (TS2345). `DATABASE_URL= make e2e` cũng fail ở một nhóm ca (không gắn eval). E1, E3, E12, E18 đạt. Quay lại implementation.
