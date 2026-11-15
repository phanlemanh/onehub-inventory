---
schema_version: 2
feature_slug: kiem-vong-doi-thao-tac
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e0798d77979779d0d08410de03cef318b0784d9e
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
  run_id: minted-kiem-vong-doi-thao-tac-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T06:08:53Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    ca man-khai-hien xanh tren kho that; hai ca pha do dung cau ghim; doi chung xanh

- eval: E2
  run_id: minted-kiem-vong-doi-thao-tac-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T06:08:53Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    ca may-thay-man-hien xanh: tap suy ra khop bang viet truoc cho tam man; ba ca pha do dung cau

- eval: E3
  run_id: minted-kiem-vong-doi-thao-tac-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T06:08:53Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    ca du-bon-o xanh tren kho that; bon ca pha do dung cau; doi chung xanh

- eval: E4
  run_id: minted-kiem-vong-doi-thao-tac-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T06:08:53Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    ca o-co-tro-nut-that xanh; nam ca pha do dung cau; doi chung xanh

- eval: E5
  run_id: minted-kiem-vong-doi-thao-tac-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T06:08:53Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    ca o-hang-va-khong-co-can-cu xanh; cac ca pha do dung cau; dong so hong khong lam do

- eval: E6
  run_id: minted-kiem-vong-doi-thao-tac-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T06:08:53Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    ca chay-tren-ban-sao-nong, khong-goi-git, don-thu-muc-tam xanh

- eval: E6b
  run_id: minted-kiem-vong-doi-thao-tac-E6b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-15T06:08:53Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml

- eval: E7
  run_id: minted-kiem-vong-doi-thao-tac-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T06:08:53Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    ca bang-da-duyet xanh: moi o khop bang Hoi-3; bay cho thieu that cua RS2 duoc khang dinh tung cho

- eval: E8
  run_id: minted-kiem-vong-doi-thao-tac-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T06:08:53Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    ca xem-theo-vai va bao-cao-theo-vai xanh; hai ca pha do dung cau

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-kiem-vong-doi-thao-tac-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-15T06:08:53Z

- cmd: make e2e
  run_id: minted-kiem-vong-doi-thao-tac-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-15T06:08:53Z

## Known limits

## Ngoài hợp đồng

## Analyst

Non-discriminating evals (xanh ca tren nhanh lan baseline):

- E6b (make check): regression-guard co chu y, chay xanh tren ca code cu lan code moi.

Baseline khong do:

- npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/vong-doi-thao-tac.test.ts co o cay dang kiem nhung chua co o merge-base 0861fdcb6906a3d86d6c88df830c9ac40447d263 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: moi eval xanh, verdict PASS.
