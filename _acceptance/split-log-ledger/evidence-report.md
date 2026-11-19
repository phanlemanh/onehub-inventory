---
schema_version: 2
feature_slug: split-log-ledger
verdict: REJECT
failed_evals: [E6]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: c5ae6f4d9aaa83163e6cac286fce5022e5b00c39
human_signoff:
---

# Evidence Report: split-log-ledger

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5, AC-3 | script | PASS |
| E6 | AC-6 | script | FAIL |
| E7 | AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7 | script | PASS |
| E8 | AC-1, AC-2 | script | PASS |
| E9 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-split-log-ledger-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sll_so_log
  verified_at: 2026-11-19T05:43:41Z
  output: |
    so-log: log is fragments, wiki/log.md drawn and out of git, its head the same and the repository's own; the 108 entries of c79189dd (110 lines) each once, word for word, newest first; 1 written since

- eval: E2
  run_id: minted-split-log-ledger-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sll_ve_truoc_test
  verified_at: 2026-11-19T05:43:41Z
  output: |
    ve-truoc-test: a fresh checkout has no wiki/log.md; make check-quick draws it before it runs the tests; tests/khong-o-tim.test.ts passes once it is drawn

- eval: E3
  run_id: minted-split-log-ledger-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sll_ke_thua_e10
  verified_at: 2026-11-19T05:43:41Z
  output: |
    ke-thua-e10: log fragments, index one-file, glossary one-file, gen one-file; make split DRY=1 exits 0 and writes nothing for each; mk/design-role-table.mk is mk/derived.mk of bd32d73e; make -n test runs tools/coverage_matrix/buttons.py

- eval: E4
  run_id: r1-l4-1-20261119054341
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sll_docs_log
  verified_at: 2026-11-19T05:43:41Z
  output: |
    docs-log: the 2 instructions name make log m= and lost their old words; 160 live .md files swept, none writes wiki/log.md by hand

- eval: E5
  run_id: minted-split-log-ledger-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sll_do_cu
  verified_at: 2026-11-19T05:43:41Z
  output: |
    do-cu: so-quyet-dinh exits 0; two-way «E4 red» of tat-plugin-cho-cu and «ledgers» of upgrade-repo-setup-0-9-0 pass; E10 declares not-run, superseded_by split-log-ledger#AC-3; three sua-sau-ky.md sections

- eval: E6
  run_id: minted-split-log-ledger-E6-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.sll_ci_pr
  verified_at: 2026-11-19T05:43:41Z
  output: |
    ci-pr: job quick is in_progress
    ci-pr: job e2e is not in the run
    ci-pr: job check is not in the run
    Cause: the PR's CI run had not finished when the measure ran, so jobs e2e and check were absent.

- eval: E7
  run_id: r1-l7-1-20261119054341
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sll_two_way
  verified_at: 2026-11-19T05:43:41Z
  output: |
    node --test, seven cases: each measure green on the sound copy and red with its pinned message on the broken copy
    duration_ms 100010.292417

- eval: E8
  run_id: minted-split-log-ledger-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-19T05:43:41Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E9
  run_id: minted-split-log-ledger-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sll_ben_doc
  verified_at: 2026-11-19T05:43:41Z
  output: |
    ben-doc: 24 files that are no .md name wiki/log.md, each weighed in READERS; none new

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-split-log-ledger-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-19T05:43:41Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-split-log-ledger-SUITE-DATABASE_URL_make_e2e-r1
  exit_code: 2
  verified_at: 2026-11-19T05:43:41Z
  output: |
    1244 passed, 1127 skipped, 1 failed (9.4m)
    failed: tests/e2e/frame.spec.ts:376 "no serious accessibility violations on every frame screen" at the "dark sidebar sheet" screen, rule color-contrast
    gac-hydration: 0 warnings

## Known limits

## Ngoài hợp đồng

## Analyst

Non-discriminating evals (green on both HEAD and baseline):
- E8 (make check): green on the old code too. It is a regression guard on the whole repo, not a measure of the new behaviour. AC-1 and AC-2 are carried by E1, E2 and E7.

Baseline không đo:
- node _acceptance/split-log-ledger/rang/so-log.mjs: bo qua baseline: tep _acceptance/split-log-ledger/rang/so-log.mjs co o cay dang kiem nhung chua co o merge-base c79189dd267eb7f29fcc13faf02f3171a4a91227 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/split-log-ledger/rang/ve-truoc-test.mjs: bo qua baseline: tep _acceptance/split-log-ledger/rang/ve-truoc-test.mjs co o cay dang kiem nhung chua co o merge-base c79189dd267eb7f29fcc13faf02f3171a4a91227 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/split-log-ledger/rang/ke-thua-e10.mjs: bo qua baseline: tep _acceptance/split-log-ledger/rang/ke-thua-e10.mjs co o cay dang kiem nhung chua co o merge-base c79189dd267eb7f29fcc13faf02f3171a4a91227 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/split-log-ledger/rang/docs-log.mjs: bo qua baseline: tep _acceptance/split-log-ledger/rang/docs-log.mjs co o cay dang kiem nhung chua co o merge-base c79189dd267eb7f29fcc13faf02f3171a4a91227 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/split-log-ledger/rang/do-cu.mjs: bo qua baseline: tep _acceptance/split-log-ledger/rang/do-cu.mjs co o cay dang kiem nhung chua co o merge-base c79189dd267eb7f29fcc13faf02f3171a4a91227 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/split-log-ledger/rang/ci-pr.mjs: bo qua baseline: tep _acceptance/split-log-ledger/rang/ci-pr.mjs co o cay dang kiem nhung chua co o merge-base c79189dd267eb7f29fcc13faf02f3171a4a91227 — eval moi, chay tren code cu khong phan biet gi
- node --test _acceptance/split-log-ledger/rang/two-way.mjs: bo qua baseline: tep _acceptance/split-log-ledger/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base c79189dd267eb7f29fcc13faf02f3171a4a91227 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/split-log-ledger/rang/ben-doc.mjs: bo qua baseline: tep _acceptance/split-log-ledger/rang/ben-doc.mjs co o cay dang kiem nhung chua co o merge-base c79189dd267eb7f29fcc13faf02f3171a4a91227 — eval moi, chay tren code cu khong phan biet gi

Lệnh fail không gắn eval:
- DATABASE_URL= make e2e (exit 2, no eval attached): one accessibility failure, color-contrast on the "dark sidebar sheet" screen in tests/e2e/frame.spec.ts:376. It sits outside the contract's evals and is listed here so a person decides at Gate 2.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E6 failed — the PR's CI run was still in progress when ci-pr measured it (job quick in_progress, jobs e2e and check not yet in the run). Re-run E6 once CI finishes. Separately, the suite command make e2e failed on one color-contrast violation in the "dark sidebar sheet" screen, tied to no eval. Returned to implementation.
