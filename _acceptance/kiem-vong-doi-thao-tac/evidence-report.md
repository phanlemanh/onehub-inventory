---
schema_version: 2
feature_slug: kiem-vong-doi-thao-tac
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a33a05fa05921f31a1bc04f2991a13ec4c08efba
human_signoff:
---

# Evidence Report: kiem-vong-doi-thao-tac

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E6b | AC-6 | script | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-kiem-vong-doi-thao-tac-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T06:25:08Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    chay 1 lan, 1/1 lan xanh, khong dao dong; tat ca ca cua tep bai xanh

- eval: E2
  run_id: minted-kiem-vong-doi-thao-tac-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T06:25:08Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    chay 1 lan, 1/1 lan xanh, khong dao dong; tat ca ca cua tep bai xanh

- eval: E3
  run_id: minted-kiem-vong-doi-thao-tac-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T06:25:08Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    chay 1 lan, 1/1 lan xanh, khong dao dong; tat ca ca cua tep bai xanh

- eval: E4
  run_id: minted-kiem-vong-doi-thao-tac-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T06:25:08Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    chay 1 lan, 1/1 lan xanh, khong dao dong; tat ca ca cua tep bai xanh

- eval: E5
  run_id: minted-kiem-vong-doi-thao-tac-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T06:25:08Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    chay 1 lan, 1/1 lan xanh, khong dao dong; tat ca ca cua tep bai xanh

- eval: E6
  run_id: minted-kiem-vong-doi-thao-tac-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T06:25:08Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    chay 1 lan, 1/1 lan xanh, khong dao dong; tat ca ca cua tep bai xanh
    (ca don-thu-muc-tam co mat o a33a05f, duoc chay trong vong nay)

- eval: E6b
  run_id: minted-kiem-vong-doi-thao-tac-E6b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-15T06:25:08Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml

- eval: E7
  run_id: minted-kiem-vong-doi-thao-tac-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T06:25:08Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    chay 1 lan, 1/1 lan xanh, khong dao dong; tat ca ca cua tep bai xanh

- eval: E8
  run_id: minted-kiem-vong-doi-thao-tac-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T06:25:08Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    chay 1 lan, 1/1 lan xanh, khong dao dong; tat ca ca cua tep bai xanh

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-kiem-vong-doi-thao-tac-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-15T06:25:08Z

- cmd: make e2e
  run_id: minted-kiem-vong-doi-thao-tac-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-15T06:25:08Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval khong-phan-biet (green tren ca code moi lan baseline): E6b (make check) — la regression-guard, can xac nhan day la y dinh hay viet lai de assert hanh vi moi.

Baseline khong do: moi eval round nay ghi n-a (evals.yaml khong doi tu lan baseline cuoi o round 1).

## Variance

none — moi eval chay 1 lan, deterministic, khong dao dong.

## Iterations

Round 1: moi eval xanh tren e0798d7; review nêu ca don-thu-muc-tam chi do mot thu muc rieng. Tep bai doi sau do (a33a05f).
Round 2: cham lai tren a33a05f — E1-E8 va E6b xanh, build va make e2e (1151 passed) xanh.
