---
schema_version: 2
feature_slug: roadmap-merge-driver
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 7b9efe493c26250e82e457781e1981f39afda568
human_signoff:
---

# Evidence Report: roadmap-merge-driver

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: r1-l1-1-20261121080350
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rmd_attr
  verified_at: 2026-11-21T08:03:50Z
  output: |
    attr: LO-TRINH.html merge=generated-file follows PRODUCT-MAP.md; check-attr gives generated-file for both, union for wiki/log.md, unspecified for README.md and package.json; every line of the base is kept in order, 1 comment line reworded,

- eval: E2
  run_id: r1-l2-1-20261121080350
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rmd_merge
  verified_at: 2026-11-21T08:03:50Z
  output: |
    merge: 9 of 9 cases as expected (5 clean, 4 conflict)

- eval: E3
  run_id: r1-l3-1-20261121080350
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rmd_redraw
  verified_at: 2026-11-21T08:03:50Z
  output: |
    redraw: on a copy of HEAD product-map --check passes; with the page of the base it fails naming LO-TRINH.html; after product-map --root it passes and the page equals HEAD

- eval: E4
  run_id: r1-l4-1-20261121080350
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rmd_docs
  verified_at: 2026-11-21T08:03:50Z
  output: |
    docs: the section names the setup command, the driver command of package.json, the check command, the redraw command of the repository, the 2 files .gitattributes marks, the GitHub limit and the limit for branches opened before the line

- eval: E5
  run_id: r1-l5-1-20261121080350
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rmd_decision
  verified_at: 2026-11-21T08:03:50Z
  output: |
    decision: page 0046 has the four sections, Accepted, 2026-11-21, the owner's sentence and the milestone definition; tiers 0.9.0 T3, 0.10.1 T2, 0.10.2 T3, 0.10.3 T3 equal risk_tier of 4 contracts in the tree (none absent); risk_tiers said un

- eval: E6
  run_id: r1-l6-1-20261121080350
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rmd_codeql
  verified_at: 2026-11-21T08:03:50Z
  output: |
    codeql: the init step ignores exactly _acceptance/**/rang/**; against the base the workflow adds the 4 lines of the patch and removes none; the pattern covers 152 tracked files under _acceptance/<record>/rang/, the 4 alert files among them,

- eval: E7
  run_id: r1-l7-1-20261121080350
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rmd_change_set
  verified_at: 2026-11-21T08:03:50Z
  output: |
    change-set: the branch changes only the files of the round (39 files); _acceptance/config.yaml only adds 8 rmd_ commands and risk_tiers equals the base; nothing under governance/, .claude/, tools/, mk/, no Makefile, no package.json, and of

- eval: E8
  run_id: r1-l8-1-20261121080350
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rmd_two_way
  verified_at: 2026-11-21T08:03:50Z
  output: |
    ℹ duration_ms 23442.070209

- eval: E9
  run_id: r1-l9-1-20261121080350
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-21T08:03:50Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-roadmap-merge-driver-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-21T08:03:50Z

- cmd: DATABASE_URL= make e2e
  run_id: bxz05jam1
  exit_code: 0
  verified_at: 2026-11-21T08:03:50Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên HEAD lẫn baseline): E9 (`make check`). Đây là regression-guard có chủ ý của vòng: vòng không được làm đỏ bộ kiểm của kho, nên xanh ở hai phía là đúng kỳ vọng. Tám eval E1-E8 là eval mới của vòng, không có baseline để so.

Baseline khong do

- node _acceptance/roadmap-merge-driver/rang/attr.mjs: bo qua baseline: tep _acceptance/roadmap-merge-driver/rang/attr.mjs co o cay dang kiem nhung chua co o merge-base d37f3ea5a12fc13e8de0249c1864f491d62f4424 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/roadmap-merge-driver/rang/merge.mjs: bo qua baseline: tep _acceptance/roadmap-merge-driver/rang/merge.mjs co o cay dang kiem nhung chua co o merge-base d37f3ea5a12fc13e8de0249c1864f491d62f4424 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/roadmap-merge-driver/rang/redraw.mjs: bo qua baseline: tep _acceptance/roadmap-merge-driver/rang/redraw.mjs co o cay dang kiem nhung chua co o merge-base d37f3ea5a12fc13e8de0249c1864f491d62f4424 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/roadmap-merge-driver/rang/docs.mjs: bo qua baseline: tep _acceptance/roadmap-merge-driver/rang/docs.mjs co o cay dang kiem nhung chua co o merge-base d37f3ea5a12fc13e8de0249c1864f491d62f4424 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/roadmap-merge-driver/rang/decision.mjs: bo qua baseline: tep _acceptance/roadmap-merge-driver/rang/decision.mjs co o cay dang kiem nhung chua co o merge-base d37f3ea5a12fc13e8de0249c1864f491d62f4424 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/roadmap-merge-driver/rang/codeql.mjs: bo qua baseline: tep _acceptance/roadmap-merge-driver/rang/codeql.mjs co o cay dang kiem nhung chua co o merge-base d37f3ea5a12fc13e8de0249c1864f491d62f4424 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/roadmap-merge-driver/rang/change-set.mjs: bo qua baseline: tep _acceptance/roadmap-merge-driver/rang/change-set.mjs co o cay dang kiem nhung chua co o merge-base d37f3ea5a12fc13e8de0249c1864f491d62f4424 — eval moi, chay tren code cu khong phan biet gi
- node --test _acceptance/roadmap-merge-driver/rang/two-way.mjs: bo qua baseline: tep _acceptance/roadmap-merge-driver/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base d37f3ea5a12fc13e8de0249c1864f491d62f4424 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1-E9 đều đạt trên HEAD 7b9efe49; không eval nào đỏ, không có mục cần người phán xét.
