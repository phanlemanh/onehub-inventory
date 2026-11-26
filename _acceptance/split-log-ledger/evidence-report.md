---
schema_version: 2
feature_slug: split-log-ledger
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 3e04188d41ec880ce8fa6fa8bded988d39eb97e9
human_signoff: Phan Le Manh 2026-11-19
---

# Evidence Report: split-log-ledger

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-1, AC-2, AC-3, AC-4, AC-6, AC-7 | script | PASS |
| E8 | AC-1, AC-2 | script | PASS |
| E9 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-split-log-ledger-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sll_so_log
  verified_at: 2026-11-19T07:50:44Z
  output: |
    so-log: log is fragments, wiki/log.md drawn and out of git, its head the same and the repository's own; the 108 entries of c79189dd (110 lines) each once, word for word, newest first; 1 written since

- eval: E2
  run_id: minted-split-log-ledger-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sll_ve_truoc_test
  verified_at: 2026-11-19T07:50:44Z
  output: |
    ve-truoc-test: a fresh checkout has no wiki/log.md; make check-quick draws it before it runs the tests; tests/khong-o-tim.test.ts passes once it is drawn

- eval: E3
  run_id: minted-split-log-ledger-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sll_ke_thua_e10
  verified_at: 2026-11-19T07:50:44Z
  output: |
    ke-thua-e10: log fragments, index one-file, glossary one-file, gen one-file; make split DRY=1 exits 0 and writes nothing for each; mk/design-role-table.mk is mk/derived.mk of bd32d73e; make -n test runs tools/coverage_matrix/buttons.py

- eval: E4
  run_id: r2-l4-1-20261119075044
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sll_docs_log
  verified_at: 2026-11-19T07:50:44Z
  output: |
    docs-log: the 2 instructions name make log m= and lost their old words; 160 live .md files swept, none writes wiki/log.md by hand

- eval: E6
  run_id: 44481814549
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sll_ci_pr
  verified_at: 2026-11-19T07:50:44Z
  output: |
    ci-pr: run 44481814549 on 3e04188d: quick, e2e, check success; e2e-db success, gate failure

- eval: E7
  run_id: r2-l6-1-20261119075044
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sll_two_way
  verified_at: 2026-11-19T07:50:44Z
  output: |
    node --test: six cases passed (duration_ms 51252.664625)

- eval: E8
  run_id: b7cdtiuon
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-19T07:50:44Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E9
  run_id: r2-l8-1-20261119075044
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sll_ben_doc
  verified_at: 2026-11-19T07:50:44Z
  output: |
    ben-doc: 24 files that are no .md name wiki/log.md, each weighed in READERS; none new

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-split-log-ledger-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-19T07:50:44Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-split-log-ledger-SUITE-DATABASE_URL_make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-19T07:50:44Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline, chứng minh harness chứ không phải feature):
- E8 (make check): hồi quy-guard có chủ ý, xanh cả hai phía.

Baseline không đo:
- node _acceptance/split-log-ledger/rang/so-log.mjs: bo qua baseline: tep _acceptance/split-log-ledger/rang/so-log.mjs co o cay dang kiem nhung chua co o merge-base c79189dd267eb7f29fcc13faf02f3171a4a91227 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/split-log-ledger/rang/ve-truoc-test.mjs: bo qua baseline: tep _acceptance/split-log-ledger/rang/ve-truoc-test.mjs co o cay dang kiem nhung chua co o merge-base c79189dd267eb7f29fcc13faf02f3171a4a91227 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/split-log-ledger/rang/ke-thua-e10.mjs: bo qua baseline: tep _acceptance/split-log-ledger/rang/ke-thua-e10.mjs co o cay dang kiem nhung chua co o merge-base c79189dd267eb7f29fcc13faf02f3171a4a91227 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/split-log-ledger/rang/docs-log.mjs: bo qua baseline: tep _acceptance/split-log-ledger/rang/docs-log.mjs co o cay dang kiem nhung chua co o merge-base c79189dd267eb7f29fcc13faf02f3171a4a91227 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/split-log-ledger/rang/ci-pr.mjs: bo qua baseline: tep _acceptance/split-log-ledger/rang/ci-pr.mjs co o cay dang kiem nhung chua co o merge-base c79189dd267eb7f29fcc13faf02f3171a4a91227 — eval moi, chay tren code cu khong phan biet gi
- node --test _acceptance/split-log-ledger/rang/two-way.mjs: bo qua baseline: tep _acceptance/split-log-ledger/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base c79189dd267eb7f29fcc13faf02f3171a4a91227 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/split-log-ledger/rang/ben-doc.mjs: bo qua baseline: tep _acceptance/split-log-ledger/rang/ben-doc.mjs co o cay dang kiem nhung chua co o merge-base c79189dd267eb7f29fcc13faf02f3171a4a91227 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: ghi nhận ở commit ffdb3edc (round 1 record); nội dung bị thay bằng round này.
Round 2: E1, E2, E3, E4, E6, E7, E8, E9 đều đạt trên 3e04188d; E5 đã bỏ theo Hỏi-2 đổi thành «không». Verdict PASS.
