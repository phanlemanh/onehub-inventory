---
schema_version: 2
feature_slug: danh-muc-can-nhu-onehub-invest
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 50f7390ab97502c65234276e56e48ff82f9aeb8b
human_signoff: Manh Phan 2026-11-12
---

# Evidence Report: danh-muc-can-nhu-onehub-invest

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-1 | test | PASS |
| E3 | AC-2 | script | PASS |
| E4 | AC-2 | test | PASS |
| E5 | AC-3 | test | PASS |
| E6 | AC-3 | script | PASS |
| E7 | AC-4 | script | PASS |
| E8 | AC-5 | test | PASS |
| E9 | AC-6 | test | PASS |
| E10 | AC-6 | script | PASS |
| E11 | AC-7 | script | PASS |
| E12 | AC-7 | script | PASS |
| E13 | AC-8 | script | PASS |
| E14 | AC-8 | script | PASS |
| E15 | AC-6 | test | PASS |
| E16 | AC-9 | script | PASS |
| E17 | AC-9 | test | PASS |
| E18 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-danh-muc-can-nhu-onehub-invest-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.danh_muc_db_r
  verified_at: 2026-11-12T12:50:03Z
  output: |
    tests/db/danh-muc.db.test.ts chay xong, ca phan-khu-con-du-an qua
    __EXIT=0

- eval: E2
  run_id: minted-danh-muc-can-nhu-onehub-invest-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.danh_muc
  verified_at: 2026-11-12T12:50:03Z
  output: |
    src/modules/catalog va tests/danh-muc-chuyen-mau.test.ts chay xong
    __EXIT=0

- eval: E3
  run_id: minted-danh-muc-can-nhu-onehub-invest-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.danh_muc_db_r
  verified_at: 2026-11-12T12:50:03Z
  output: |
    tests/db/danh-muc.db.test.ts chay xong, ca tang-dang-chu qua
    __EXIT=0

- eval: E4
  run_id: minted-danh-muc-can-nhu-onehub-invest-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.danh_muc
  verified_at: 2026-11-12T12:50:03Z
  output: |
    src/modules/catalog va tests/danh-muc-chuyen-mau.test.ts chay xong
    __EXIT=0

- eval: E5
  run_id: minted-danh-muc-can-nhu-onehub-invest-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.danh_muc
  verified_at: 2026-11-12T12:50:03Z
  output: |
    src/modules/catalog va tests/danh-muc-chuyen-mau.test.ts chay xong
    __EXIT=0

- eval: E6
  run_id: minted-danh-muc-can-nhu-onehub-invest-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.danh_muc_db_r
  verified_at: 2026-11-12T12:50:03Z
  output: |
    tests/db/danh-muc.db.test.ts chay xong, ca khoa-tien-to qua
    __EXIT=0

- eval: E7
  run_id: minted-danh-muc-can-nhu-onehub-invest-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.danh_muc_db_r
  verified_at: 2026-11-12T12:50:03Z
  output: |
    tests/db/danh-muc.db.test.ts chay xong, ca ma-goc-bi-danh qua
    __EXIT=0

- eval: E8
  run_id: minted-danh-muc-can-nhu-onehub-invest-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.danh_muc
  verified_at: 2026-11-12T12:50:03Z
  output: |
    src/modules/catalog va tests/danh-muc-chuyen-mau.test.ts chay xong
    __EXIT=0

- eval: E9
  run_id: minted-danh-muc-can-nhu-onehub-invest-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.danh_muc
  verified_at: 2026-11-12T12:50:03Z
  output: |
    src/modules/catalog va tests/danh-muc-chuyen-mau.test.ts chay xong
    __EXIT=0

- eval: E10
  run_id: minted-danh-muc-can-nhu-onehub-invest-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.danh_muc_db_r
  verified_at: 2026-11-12T12:50:03Z
  output: |
    tests/db/danh-muc.db.test.ts chay xong, ca nap-mau-du qua
    __EXIT=0

- eval: E11
  run_id: minted-danh-muc-can-nhu-onehub-invest-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.danh_muc_db_r
  verified_at: 2026-11-12T12:50:03Z
  output: |
    tests/db/danh-muc.db.test.ts chay xong, ca danh-muc-chi-doc qua
    __EXIT=0

- eval: E12
  run_id: minted-danh-muc-can-nhu-onehub-invest-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.danh_muc_db_r
  verified_at: 2026-11-12T12:50:03Z
  output: |
    bo kiem cach ly chay trong cung lenh, tests/db/danh-muc.db.test.ts xong
    __EXIT=0

- eval: E13
  run_id: minted-danh-muc-can-nhu-onehub-invest-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.danh_muc_db_r
  verified_at: 2026-11-12T12:50:03Z
  output: |
    tests/db/danh-muc.db.test.ts chay xong, ca cot-khop-ontology qua
    __EXIT=0

- eval: E14
  run_id: minted-danh-muc-can-nhu-onehub-invest-E14-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-12T12:50:03Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml
    __EXIT=0

- eval: E15
  run_id: minted-danh-muc-can-nhu-onehub-invest-E15-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.danh_muc
  verified_at: 2026-11-12T12:50:03Z
  output: |
    src/modules/catalog va tests/danh-muc-chuyen-mau.test.ts chay xong
    __EXIT=0

- eval: E16
  run_id: minted-danh-muc-can-nhu-onehub-invest-E16-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.danh_muc_db_r
  verified_at: 2026-11-12T12:50:03Z
  output: |
    tests/db/danh-muc.db.test.ts chay xong, ca ma-rieng-cua-san qua
    __EXIT=0

- eval: E17
  run_id: minted-danh-muc-can-nhu-onehub-invest-E17-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.danh_muc
  verified_at: 2026-11-12T12:50:03Z
  output: |
    src/modules/catalog va tests/danh-muc-chuyen-mau.test.ts chay xong
    __EXIT=0

- eval: E18
  run_id: minted-danh-muc-can-nhu-onehub-invest-E18-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.bang_quyen_db_r
  verified_at: 2026-11-12T12:50:03Z
  output: |
    tests/db/bang-quyen.db.test.ts chay xong
    __EXIT=0

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-danh-muc-can-nhu-onehub-invest-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-12T12:50:03Z

- cmd: make e2e
  run_id: minted-danh-muc-can-nhu-onehub-invest-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-12T12:50:03Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline):
- E14 (make check): regression-guard có chủ ý, baseline green.
- E18 (bang-quyen.db.test.ts): baseline green; phần 32 ô mới nằm trong cùng bài, cần xác nhận đây là regression-guard có chủ ý hoặc viết lại để assert hành vi mới.

Baseline không đo
- DB_LANE=${DB_LANE:-r} DB_PORT=${DB_PORT:-5565} bash -c 'bash db/scripts/cach-ly.sh && npx vitest run -c vitest.db.config.ts tests/db/danh-muc.db.test.ts --reporter=verbose': bo qua baseline: tep tests/db/danh-muc.db.test.ts co o cay dang kiem nhung chua co o merge-base ed43d2c657eaf855c6cb3825236ba7ca7ab483ef — eval moi, chay tren code cu khong phan biet gi
- npx vitest run src/modules/catalog tests/danh-muc-chuyen-mau.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/danh-muc-chuyen-mau.test.ts co o cay dang kiem nhung chua co o merge-base ed43d2c657eaf855c6cb3825236ba7ca7ab483ef — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: 18 eval máy đều qua, hai lệnh suite (build, e2e) xanh. Verdict PASS.
