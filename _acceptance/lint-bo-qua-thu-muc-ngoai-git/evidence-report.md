---
schema_version: 2
feature_slug: lint-bo-qua-thu-muc-ngoai-git
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 34b6c912cd6a9f2dd138907439cf827561d1a009
human_signoff:
---

# Evidence Report: lint-bo-qua-thu-muc-ngoai-git

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lnt_eslint
  verified_at: 2026-11-21T14:09:52Z
  output: |
    eslint: 3 of 3 out-of-git paths ignored (.acceptance-runs/x/a.mjs, .claude/worktrees/w/src/app/page.tsx, .claude/worktrees/w/.next/chunk.js)

- eval: E2
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lnt_prettier
  verified_at: 2026-11-21T14:09:52Z
  output: |
    prettier: 3 of 3 out-of-git paths ignored; .prettierignore alone ignores both folders

- eval: E3
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lnt_doi_chung
  verified_at: 2026-11-21T14:09:52Z
  output: |
    doi-chung: 18 of 18 in-tree paths keep their state (eslint 14 linted, 4 ignored; prettier 12 checked, 6 ignored)

- eval: E4
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lnt_chay_that
  verified_at: 2026-11-21T14:09:52Z
  output: |
    chay-that: npm run lint passed with a broken .mjs planted in 3 out-of-git places; none named in the output; planted folders removed

- eval: E5
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E5-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-21T14:09:52Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E6
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lnt_two_way
  verified_at: 2026-11-21T14:09:52Z
  output: |
    node --test finished: duration_ms 73708.420333

- eval: E7
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lnt_kiem_tron
  verified_at: 2026-11-21T14:09:52Z
  output: |
    kiem-tron: make check passed with 3 planted files in each of 2 out-of-git folders; none named in the output; the type checker lists none (tsconfig.json, tsconfig.strict.json); planted folders removed

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-21T14:09:52Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-SUITE-DATABASE_URL_make_e2e-r3
  exit_code: 0
  verified_at: 2026-11-21T14:09:52Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh ở cả HEAD lẫn baseline):

- E5 (make check): xanh trên cả hai phía, là regression-guard có chủ ý của kho, không chứng minh hành vi mới.

Baseline khong do:

- node _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/bo-qua.mjs --eslint: bo qua baseline: tep _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/bo-qua.mjs co o cay dang kiem nhung chua co o merge-base 799ae9dc7f60f542e466f0656ddcde60bfffa2c8 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/bo-qua.mjs --prettier: bo qua baseline: tep _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/bo-qua.mjs co o cay dang kiem nhung chua co o merge-base 799ae9dc7f60f542e466f0656ddcde60bfffa2c8 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/bo-qua.mjs --doi-chung: bo qua baseline: tep _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/bo-qua.mjs co o cay dang kiem nhung chua co o merge-base 799ae9dc7f60f542e466f0656ddcde60bfffa2c8 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/chay-that.mjs: bo qua baseline: tep _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/chay-that.mjs co o cay dang kiem nhung chua co o merge-base 799ae9dc7f60f542e466f0656ddcde60bfffa2c8 — eval moi, chay tren code cu khong phan biet gi
- node --test _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/two-way.mjs: bo qua baseline: tep _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 799ae9dc7f60f542e466f0656ddcde60bfffa2c8 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/kiem-tron.mjs: bo qua baseline: tep _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/kiem-tron.mjs co o cay dang kiem nhung chua co o merge-base 799ae9dc7f60f542e466f0656ddcde60bfffa2c8 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E6 chạy đỏ và có một phát hiện về E7 (chỉ kiểm phía âm). Returned to implementation.
Round 2: E7 không chạy xong trong thời lượng khai (BLOCKED). Returned to implementation.
Round 3: E1 đến E7 và hai lệnh suite đều xanh trên cây 34b6c912cd6a9f2dd138907439cf827561d1a009; verdict PASS.
