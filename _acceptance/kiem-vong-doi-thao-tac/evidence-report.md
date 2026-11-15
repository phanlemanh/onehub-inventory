---
schema_version: 2
feature_slug: kiem-vong-doi-thao-tac
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 18fb5660b6e05d155adb2571b6a9aa0380d14aac
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
  run_id: minted-kiem-vong-doi-thao-tac-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T07:09:55Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    ca man-khai-hien xanh tren kho that; hai ca pha do dung cau ghim; doi chung xanh.

- eval: E2
  run_id: minted-kiem-vong-doi-thao-tac-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T07:09:55Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    ca may-thay-man-hien xanh; ba ca pha do dung cau ghim.

- eval: E3
  run_id: minted-kiem-vong-doi-thao-tac-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T07:09:55Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    ca du-bon-o xanh; cac ca pha do dung cau ghim; doi chung xanh.

- eval: E4
  run_id: minted-kiem-vong-doi-thao-tac-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T07:09:55Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    ca o-co-tro-nut-that xanh; nam ca pha do dung cau ghim; doi chung xanh.

- eval: E5
  run_id: minted-kiem-vong-doi-thao-tac-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T07:09:55Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    ca o-hang-va-khong-co-can-cu xanh; cac ca pha do dung cau ghim.

- eval: E6
  run_id: minted-kiem-vong-doi-thao-tac-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T07:09:55Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    ca chay-tren-ban-sao-nong, khong-goi-git, don-thu-muc-tam xanh.

- eval: E6b
  run_id: minted-kiem-vong-doi-thao-tac-E6b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-15T07:09:55Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml

- eval: E7
  run_id: minted-kiem-vong-doi-thao-tac-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T07:09:55Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    ca bang-da-duyet xanh; bay cho thieu that cua RS2 duoc khang dinh tung cho.

- eval: E8
  run_id: minted-kiem-vong-doi-thao-tac-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vong_doi
  verified_at: 2026-11-15T07:09:55Z
  output: |
    npx vitest run tests/vong-doi-thao-tac.test.ts --coverage.enabled=false --reporter=verbose
    ca xem-theo-vai va bao-cao-theo-vai xanh.

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-kiem-vong-doi-thao-tac-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-15T07:09:55Z

- cmd: make e2e
  run_id: minted-kiem-vong-doi-thao-tac-SUITE-make_e2e-r3
  exit_code: 0
  verified_at: 2026-11-15T07:09:55Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay.

Baseline khong do: moi eval round nay ghi baseline n-a (evals.yaml khong doi tu lan baseline cuoi).

Eval khong-phan-biet (green tren ca HEAD lan baseline): E6b (make check) — regression-guard co chu y, bai vong-doi-thao-tac nam trong make test.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: moi eval xanh tren e0798d7; review nêu ca don-thu-muc-tam chi do mot thu muc rieng. Tep bai doi sau do (a33a05f).
Round 2: cham lai tren a33a05f — E1-E8 va E6b xanh, build va make e2e (1151 passed) xanh.
Round 3: cham lai tren 18fb566 — E1-E8 va E6b xanh, build va make e2e xanh; khong eval nao do; khong judgment item.
