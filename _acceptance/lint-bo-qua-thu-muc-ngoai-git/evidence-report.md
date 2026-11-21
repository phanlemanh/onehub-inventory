---
schema_version: 2
feature_slug: lint-bo-qua-thu-muc-ngoai-git
verdict: REJECT
failed_evals: [E6]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f78a97bbbc7a2b3139dfd5791cb369651a9cee8c
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
| E6 | AC-6 | script | FAIL |
| E7 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lnt_eslint
  verified_at: 2026-11-21T13:28:50Z
  output: |
    eslint: 3 of 3 out-of-git paths ignored (.acceptance-runs/x/a.mjs, .claude/worktrees/w/src/app/page.tsx, .claude/worktrees/w/.next/chunk.js)

- eval: E2
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lnt_prettier
  verified_at: 2026-11-21T13:28:50Z
  output: |
    prettier: 3 of 3 out-of-git paths ignored; .prettierignore alone ignores both folders

- eval: E3
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lnt_doi_chung
  verified_at: 2026-11-21T13:28:50Z
  output: |
    doi-chung: 18 of 18 in-tree paths keep their state (eslint 14 linted, 4 ignored; prettier 12 checked, 6 ignored)

- eval: E4
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lnt_chay_that
  verified_at: 2026-11-21T13:28:50Z
  output: |
    chay-that: npm run lint passed with a broken .mjs planted in 3 out-of-git places; none named in the output; planted folders removed

- eval: E5
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-21T13:28:50Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E6
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E6-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.lnt_two_way
  verified_at: 2026-11-21T13:28:50Z
  output: |
    not ok: "E4 red (a): without the two new patterns lint names a planted file, and the plants are still removed" (25.7 s)
    AssertionError: .acceptance-runs keeps a planted folder
    actual 1, expected 0 (strictEqual), at noPlanted (two-way.mjs:25), called from two-way.mjs:110 and again from two-way.mjs:118

- eval: E7
  run_id: r1-l7-1-20261121132850
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lnt_kiem_tron
  verified_at: 2026-11-21T13:28:50Z
  output: |
    kiem-tron: make check passed with 5 planted files in each of 2 out-of-git folders; none named in the output; planted folders removed

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-21T13:28:50Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-SUITE-DATABASE_URL_make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-21T13:28:50Z

Lệnh fail không gắn eval nào: không có. Lệnh duy nhất fail là `node --test _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/two-way.mjs`, gắn với E6.

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên cả HEAD lẫn baseline): E5 (`make check`). Đây là regression-guard có chủ ý, không chứng minh tính năng mới.

Baseline không đo:
- node _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/bo-qua.mjs --eslint: bo qua baseline: tep _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/bo-qua.mjs co o cay dang kiem nhung chua co o merge-base 799ae9dc7f60f542e466f0656ddcde60bfffa2c8 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/bo-qua.mjs --prettier: bo qua baseline: tep _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/bo-qua.mjs co o cay dang kiem nhung chua co o merge-base 799ae9dc7f60f542e466f0656ddcde60bfffa2c8 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/bo-qua.mjs --doi-chung: bo qua baseline: tep _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/bo-qua.mjs co o cay dang kiem nhung chua co o merge-base 799ae9dc7f60f542e466f0656ddcde60bfffa2c8 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/chay-that.mjs: bo qua baseline: tep _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/chay-that.mjs co o cay dang kiem nhung chua co o merge-base 799ae9dc7f60f542e466f0656ddcde60bfffa2c8 — eval moi, chay tren code cu khong phan biet gi
- node --test _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/two-way.mjs: bo qua baseline: tep _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 799ae9dc7f60f542e466f0656ddcde60bfffa2c8 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/kiem-tron.mjs: bo qua baseline: tep _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/kiem-tron.mjs co o cay dang kiem nhung chua co o merge-base 799ae9dc7f60f542e466f0656ddcde60bfffa2c8 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy một lần (deterministic), không eval nào có pass_rate lẫn lộn.

## Iterations

Round 1: E6 failed — ca đỏ "E4 red (a)" trong two-way.mjs đòi thư mục tạm `.acceptance-runs` không còn sau lần chạy đỏ, nhưng sau lần chạy vẫn còn một thư mục cấy (xác nhận ở hai lệnh gọi, dòng 110 và dòng 118). Returned to implementation.
