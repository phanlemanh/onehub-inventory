---
schema_version: 2
feature_slug: ung-dung-noi-bang-vai-khong-chu
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d45297372416f6094cbc5639a69781417ffb12b6
human_signoff:
---

# Evidence Report: ung-dung-noi-bang-vai-khong-chu

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E6b | AC-6 | test | PASS (carried from round 1) |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E8b | AC-8 | script | PASS (carried from round 1) |
| E8c | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS (carried from round 1) |
| E9b | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_dang_nhap_c
  verified_at: 2026-11-13T04:11:03Z
  output: |
    cach-ly.sh va tests/db/cach-ly.db.test.ts, tests/db/vai-dang-nhap.db.test.ts chay xanh tren lane C

- eval: E2
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_dang_nhap_c
  verified_at: 2026-11-13T04:11:03Z
  output: |
    cung lenh voi E1, xanh

- eval: E3
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_dang_nhap_c
  verified_at: 2026-11-13T04:11:03Z
  output: |
    cung lenh voi E1, xanh

- eval: E4
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_dang_nhap_c
  verified_at: 2026-11-13T04:11:03Z
  output: |
    cung lenh voi E1, xanh

- eval: E5
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_dang_nhap_c
  verified_at: 2026-11-13T04:11:03Z
  output: |
    cung lenh voi E1, xanh

- eval: E6
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_dang_nhap_c
  verified_at: 2026-11-13T04:11:03Z
  output: |
    cung lenh voi E1, xanh

- eval: E6b
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E6b-r1
  exit_code: 0
  verifier: config:executors.test.vai_dang_nhap_unit
  verified_at: 2026-11-13T03:57:27Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_dang_nhap_c
  verified_at: 2026-11-13T04:11:03Z
  output: |
    cung lenh voi E1, xanh

- eval: E8
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly_7b_db_c
  verified_at: 2026-11-13T04:11:03Z
  output: |
    vitest chay moi tep tests/db, xanh

- eval: E8b
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E8b-r1
  exit_code: 0
  verifier: config:executors.script.vai_dang_nhap_e2e_c
  verified_at: 2026-11-13T03:57:27Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8c
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E8c-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_dang_nhap_unit
  verified_at: 2026-11-13T04:11:03Z
  output: |
    with-company.test.ts va tests/vai-dang-nhap-nguon.test.ts xanh

- eval: E9
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E9-r1
  exit_code: 0
  verifier: config:executors.test.vai_dang_nhap_unit
  verified_at: 2026-11-13T03:57:27Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9b
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E9b-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-13T04:11:03Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-13T04:11:03Z

- cmd: make e2e
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-13T04:11:03Z

## Known limits

## Ngoài hợp đồng

## Analyst

- E9b (make check): xanh ca tren HEAD lan baseline, la regression-guard co chu y, khong phan biet feature.

Baseline khong do:
- DB_LANE=${DB_LANE:-c} DB_PORT=${DB_PORT:-5569} bash -c 'bash db/scripts/cach-ly.sh && npx vitest run -c vitest.db.config.ts tests/db/cach-ly.db.test.ts tests/db/vai-dang-nhap.db.test.ts --reporter=verbose': bo qua baseline: tep tests/db/vai-dang-nhap.db.test.ts co o cay dang kiem nhung chua co o merge-base f458f6d3dbbb80bfa0c1512fe202559cf45dddef — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-c} DB_PORT=${DB_PORT:-5569} npx vitest run -c vitest.db.config.ts tests/db --reporter=verbose: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- npx vitest run src/modules/identity/with-company.test.ts tests/vai-dang-nhap-nguon.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/vai-dang-nhap-nguon.test.ts co o cay dang kiem nhung chua co o merge-base f458f6d3dbbb80bfa0c1512fe202559cf45dddef — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: bo chay toan bo bai bi tu choi — bai chay ca bo cua cach-ly het gio khi may tai nang. Tra ve cho buoc trien khai; da cho hai bai chay ca bo 300 giay.
Round 2: moi eval chay lai xanh; E6b, E8b, E9 giu tu round 1 vi delta khong cham paths cua chung.
