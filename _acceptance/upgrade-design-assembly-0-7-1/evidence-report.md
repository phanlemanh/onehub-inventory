---
schema_version: 2
feature_slug: upgrade-design-assembly-0-7-1
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5d2765aa995235e1b5164de36283ab363402d728
human_signoff: Phan Le Manh 2026-11-18
---

# Evidence Report: upgrade-design-assembly-0-7-1

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-2 | script | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-3 | script | PASS |
| E6 | AC-4 | script | PASS |
| E7 | AC-4 | script | PASS |
| E8 | AC-5 | script | PASS |
| E9 | AC-5 | script | PASS |
| E10 | AC-6 | script | PASS |
| E11 | AC-7 | test | PASS |
| E12 | AC-7 | script | PASS |
| E13 | AC-8 | script | PASS |
| E14 | AC-9 | script | PASS |
| E15 | AC-5 | script | PASS |
| E16 | AC-6 | script | PASS |
| E17 | AC-7 | script | PASS |
| E18 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-upgrade-design-assembly-0-7-1-E1-r1
  exit_code: 0
  verifier: config:executors.script.check
  verified_at: 2026-11-18T01:21:51Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-upgrade-design-assembly-0-7-1-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_shallow_check
  verified_at: 2026-11-18T04:13:48Z
  output: |
    shallow, the manifest said: component manifest: design/component-registry.json is up to date (294 components)

- eval: E3
  run_id: minted-upgrade-design-assembly-0-7-1-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_shallow_two_way
  verified_at: 2026-11-18T04:13:48Z
  output: |
    node --test shallow-two-way.mjs: duration_ms 445808.884958

- eval: E4
  run_id: minted-upgrade-design-assembly-0-7-1-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_shallow_alone
  verified_at: 2026-11-18T04:13:48Z
  output: |
    alone: make design-assembly green on a fresh depth-1 clone of 5912e32c with origin main at 8925e8ff; decision-sheet and owner-calls each said main was fetched from origin; the clone left main at 8925e8ff

- eval: E5
  run_id: minted-upgrade-design-assembly-0-7-1-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_shallow_two_way
  verified_at: 2026-11-18T04:13:48Z
  output: |
    node --test shallow-two-way.mjs: duration_ms 445808.884958

- eval: E6
  run_id: minted-upgrade-design-assembly-0-7-1-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_shallow_bite
  verified_at: 2026-11-18T04:13:48Z
  output: |
    bite: on fresh depth-1 clones of 5912e32c, the untouched copy is green; a new page stops owner-calls, an untold tag stops decision-sheet, and the fixtures of 8925e8ff stop decision-sheet by name

- eval: E7
  run_id: minted-upgrade-design-assembly-0-7-1-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_shallow_two_way
  verified_at: 2026-11-18T04:13:48Z
  output: |
    node --test shallow-two-way.mjs: duration_ms 445808.884958

- eval: E8
  run_id: minted-upgrade-design-assembly-0-7-1-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_tool_tree
  verified_at: 2026-11-18T04:13:48Z
  output: |
    tool: tools/design-assembly is the plugin's version 0.7.1, 34 files, tree 2da4cc56de55; the stamp says the same; mk/design-assembly.mk is the template's

- eval: E9
  run_id: minted-upgrade-design-assembly-0-7-1-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_release_ledger
  verified_at: 2026-11-18T04:13:48Z
  output: |
    release ledger: version 0.7.1 at ba3af6b names tool tree 2da4cc56de55, the one pinned here; its templates have that tree and the gate step

- eval: E10
  run_id: minted-upgrade-design-assembly-0-7-1-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_rows_mirror
  verified_at: 2026-11-18T04:13:48Z
  output: |
    rows: decision-sheet and owner-calls are the plugin's rows at ba3af6b field for field; their checks are the plugin's but for blueprint, which this repository has no file for; nothing else changed in the two files since 8925e8ff

- eval: E11
  run_id: minted-upgrade-design-assembly-0-7-1-E11-r1
  exit_code: 0
  verifier: config:executors.test.da071_two_tests
  verified_at: 2026-11-18T01:21:51Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-upgrade-design-assembly-0-7-1-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_fixture_tags
  verified_at: 2026-11-18T04:13:48Z
  output: |
    fixtures: tests/design-check.test.ts holds no string the tagged-test reader takes for a tag; at 8925e8ff it held decision:a, decision:other, decision:a-b

- eval: E13
  run_id: minted-upgrade-design-assembly-0-7-1-E13-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_change_list
  verified_at: 2026-11-18T04:13:48Z
  output: |
    changes: the upgrade commit changes its 6 files; the branch changes nothing beyond them and this record

- eval: E14
  run_id: r3-l10-1-20261118041348
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ci_db_thu
  verified_at: 2026-11-18T04:13:48Z
  output: |
    ci-thu: xanh 22.7 phút · check xanh · pha bo-phien do · pha vai-chu do · pha may-chu-chu do
  note: lenh chay 22.7 phut va ket thuc sach. Dong tong ket ghi ba pha o trang thai do, dung chieu do ma eval khai (ba ban pha cua ci-thu.sh phai do). Verifier co ghi them rang chi tiet cac pha (pha bo-phien co-phien, pha vai-chu bo-ep-luat, pha may-chu-chu vai ket noi) khong khop voi cach doc nay; verifier khong tu quyet, nguoi doc o Cong 2 nen mo log cua lenh de doi chieu.

- eval: E15
  run_id: bijsg4339
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_two_way
  verified_at: 2026-11-18T04:13:48Z
  output: |
    node --test measures-two-way.mjs: duration_ms 1917.285333

- eval: E16
  run_id: bijsg4339
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_two_way
  verified_at: 2026-11-18T04:13:48Z
  output: |
    node --test measures-two-way.mjs: duration_ms 1917.285333

- eval: E17
  run_id: bijsg4339
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_two_way
  verified_at: 2026-11-18T04:13:48Z
  output: |
    node --test measures-two-way.mjs: duration_ms 1917.285333

- eval: E18
  run_id: bijsg4339
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_two_way
  verified_at: 2026-11-18T04:13:48Z
  output: |
    node --test measures-two-way.mjs: duration_ms 1917.285333

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-upgrade-design-assembly-0-7-1-SUITE-make_check-r3
  exit_code: 0
  verified_at: 2026-11-18T04:13:48Z

- cmd: npm run build
  run_id: minted-upgrade-design-assembly-0-7-1-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-18T04:13:48Z

- cmd: DATABASE_URL= make e2e
  run_id: bywe47ee4
  exit_code: 0
  verified_at: 2026-11-18T04:13:48Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Baseline khong do
- node _acceptance/upgrade-design-assembly-0-7-1/rang/shallow-check.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-1/rang/shallow-check.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node --test _acceptance/upgrade-design-assembly-0-7-1/rang/shallow-two-way.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-1/rang/shallow-two-way.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-1/rang/shallow-alone.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-1/rang/shallow-alone.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-1/rang/shallow-bite.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-1/rang/shallow-bite.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-1/rang/tool-tree.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-1/rang/tool-tree.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-1/rang/release-ledger.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-1/rang/release-ledger.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- python3 _acceptance/upgrade-design-assembly-0-7-1/rang/rows-mirror.py: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-1/rang/rows-mirror.py co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-1/rang/fixture-tags.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-1/rang/fixture-tags.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-1/rang/change-list.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-1/rang/change-list.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- bash db/scripts/ci-thu.sh: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- node --test _acceptance/upgrade-design-assembly-0-7-1/rang/measures-two-way.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-1/rang/measures-two-way.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: ban ghi dau va cac sua cho phat hien cua no (commit de1c7fb3). Returned to implementation.
Round 2: ban ghi vong 2, E14 chay rieng, moi ca nong co thu muc tam rieng (commit 5912e32c). Returned to implementation.
Round 3: moi eval may xanh tren 5912e32c; E1 va E11 mang tu round 1 vi delta khong cham paths cua chung.

### Re-pin lần 1 — 2026-11-18, do gộp main (PR #85, make db-sample) vào nhánh để gỡ xung đột ở wiki/log.md
run_id: repin-20261118T085041Z-30924
sha: 5d2765aa995235e1b5164de36283ab363402d728 · suites: 3 lệnh exit 0 · evals: 18/18 eval máy đạt kỳ vọng
