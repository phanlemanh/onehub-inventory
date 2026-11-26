---
schema_version: 2
feature_slug: english-query-words
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9f090aab680886a9c3a1ad48e452ea57423ec998
human_signoff: Manh Phan 2026-11-23
---

# Evidence Report: english-query-words

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
| E10 | AC-8 | script | PASS |
| E11 | AC-8 | script | PASS (carry-forward r1) |
| E12 | AC-8 | script | PASS |
| E13 | AC-8 | script | PASS (carry-forward r1) |
| E14 | AC-8 | script | PASS (carry-forward r1) |
| E15 | AC-8 | script | PASS (carry-forward r1) |
| E16 | AC-8 | script | PASS (carry-forward r1) |
| E17-ui | AC-4 | ui-check | PASS (carry-forward r1) |
| E18 | AC-4 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-english-query-words-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-query-words/rang/query-words.mjs
  verified_at: 2026-11-23T11:27:01Z
  output: |
    quet: 9 tu x 11 ngu canh x 5 vung · cham: 0 · giu: 14

- eval: E3
  run_id: minted-english-query-words-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-query-words/rang/chay.sh
  verified_at: 2026-11-23T11:27:01Z
  output: |
    (lệnh hoàn tất, bộ chạy không in dòng tóm tắt riêng)

- eval: E10
  run_id: minted-english-query-words-E10-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-23T11:27:01Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E12
  run_id: minted-english-query-words-E12-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-23T11:27:01Z
  output: |
    gac-hydration: 0 canh bao

- eval: E18
  run_id: minted-english-query-words-E18-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-23T11:27:01Z
  output: |
    gac-hydration: 0 canh bao

- eval: E1-pha
  run_id: minted-english-query-words-E1-pha-r1
  exit_code: 0
  verifier: _acceptance/english-query-words/rang/query-words.mjs
  verified_at: 2026-11-23T10:23:51Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-english-query-words-E2-r1
  exit_code: 0
  verifier: _acceptance/english-query-words/rang/chay.sh
  verified_at: 2026-11-23T10:23:51Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-english-query-words-E4-r1
  exit_code: 0
  verifier: _acceptance/english-query-words/rang/chay.sh
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
  verifier: _acceptance/english-query-words/rang/chay.sh
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
  verifier: _acceptance/english-query-words/rang/chay.sh
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
  verifier: _acceptance/english-query-words/rang/chay.sh
  verified_at: 2026-11-23T10:23:51Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval (khung cua luot goc)
  screenshot: evidence/E17-ui-step1.png
  observed: |
    Frame old-link-1440.png (read directly): Bảng hàng at 1440. The record drawer is open on the right with heading "0905 · S1.01", Vinhomes Ocean Park 1 · S1.01 · Căn hộ, status Đang giao dịch, 5,71 tỷ, full details (Mã căn 0905, Toà S1.01). The sidebar has the place "Vinhomes Ocean Park 1" with "Tất cả" highlighted, and the table lists 36/60 rows with row 1 = 0905 · S1.01 · Vinhomes Ocean Park. This matches Expected: drawer open, place lit, address carries only the new words (record, place).
  network_observed: n-a (driver)

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-english-query-words-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-23T11:27:01Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-english-query-words-SUITE-DATABASE_URL_make_e2e-r3
  exit_code: 0
  verified_at: 2026-11-23T11:27:01Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên cả HEAD lẫn baseline):
- E10 (`make check`): regression-guard có chủ ý, xanh ở cả hai phía.

Baseline không đo:
- node _acceptance/english-query-words/rang/query-words.mjs --root .: bo qua baseline: tep _acceptance/english-query-words/rang/query-words.mjs co o cay dang kiem nhung chua co o merge-base 25f847090057f37bbd5d9ac35a16f6b272878fda — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/english-query-words/rang/chay.sh E3: bo qua baseline: tep _acceptance/english-query-words/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 25f847090057f37bbd5d9ac35a16f6b272878fda — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy một lần, kết quả đồng nhất.

## Iterations

Round 1: lượt đầu chạy các eval E1-pha, E2, E4-E9, E11, E13-E16, E17-ui, các kết quả này được mang sang round 3.
Round 2: không có dữ liệu chi tiết trong payload của round 3.
Round 3: chạy lại E1, E3, E10, E12, E18 cùng hai lệnh suite (build, e2e); tất cả xanh, các eval còn lại mang từ round 1 vì delta không chạm paths của chúng.
