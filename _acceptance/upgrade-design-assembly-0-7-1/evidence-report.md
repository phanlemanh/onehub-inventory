---
schema_version: 2
feature_slug: upgrade-design-assembly-0-7-1
verdict: BLOCKED
failed_evals: []
reason: [{"cmd":"bash db/scripts/ci-thu.sh","reason":"vuot thoi luong khai (long_running) — lenh cho tra __QUA_HAN, chua co dong __EXIT="}]
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 0d51453ce6f1d28fd8b87a3e7fe3df8c15dbed97
human_signoff:
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
| E14 | AC-9 | script | BLOCKED |
| E15 | AC-5 | script | PASS |
| E16 | AC-6 | script | PASS |
| E17 | AC-7 | script | PASS |
| E18 | AC-8 | script | PASS |

E14 khong cho ket qua: lenh vuot thoi luong khai (long_running), chi co dau hieu qua han, khong co dong ket thuc. Day la BLOCKED ha tang, khong phai loi code; cach xu ly la chay lai voi thoi gian cho dai hon.

## Evidence

- eval: E1
  run_id: minted-upgrade-design-assembly-0-7-1-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-18T01:21:51Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E2
  run_id: minted-upgrade-design-assembly-0-7-1-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_shallow_check
  verified_at: 2026-11-18T01:21:51Z
  output: |
    shallow: make check green on a depth-1 clone of 0d51453c with origin main at 8925e8ff; 2460 tests passed; the gate held 19 decisions by 27 checks; the component manifest is up to date (294 components); the clone left main at 8925e8ff

- eval: E3
  run_id: minted-upgrade-design-assembly-0-7-1-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_shallow_two_way
  verified_at: 2026-11-18T01:21:51Z
  output: |
    duration_ms 460968.203791 (bai hai chieu cua shallow-two-way.mjs dat)

- eval: E4
  run_id: minted-upgrade-design-assembly-0-7-1-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_shallow_alone
  verified_at: 2026-11-18T01:21:51Z
  output: |
    alone: make design-assembly green on a fresh depth-1 clone of 0d51453c with origin main at 8925e8ff; decision-sheet and owner-calls each said main was fetched from origin; the clone left main at 8925e8ff

- eval: E5
  run_id: minted-upgrade-design-assembly-0-7-1-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_shallow_two_way
  verified_at: 2026-11-18T01:21:51Z
  output: |
    duration_ms 460968.203791 (cung lenh voi E3 va E7, bai hai chieu dat)

- eval: E6
  run_id: minted-upgrade-design-assembly-0-7-1-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_shallow_bite
  verified_at: 2026-11-18T01:21:51Z
  output: |
    bite: on fresh depth-1 clones of 0d51453c, the untouched copy is green; a new page stops owner-calls, an untold tag stops decision-sheet, and the fixtures of 8925e8ff stop decision-sheet by name

- eval: E7
  run_id: minted-upgrade-design-assembly-0-7-1-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_shallow_two_way
  verified_at: 2026-11-18T01:21:51Z
  output: |
    duration_ms 460968.203791 (cung lenh voi E3 va E5, bai hai chieu dat)

- eval: E8
  run_id: minted-upgrade-design-assembly-0-7-1-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_tool_tree
  verified_at: 2026-11-18T01:21:51Z
  output: |
    tool: tools/design-assembly is the plugin's version 0.7.1, 34 files, tree 2da4cc56de55; the stamp says the same; mk/design-assembly.mk is the template's

- eval: E9
  run_id: minted-upgrade-design-assembly-0-7-1-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_release_ledger
  verified_at: 2026-11-18T01:21:51Z
  output: |
    release ledger: version 0.7.1 at ba3af6b names tool tree 2da4cc56de55, the one pinned here; its templates have that tree and the gate step

- eval: E10
  run_id: minted-upgrade-design-assembly-0-7-1-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_rows_mirror
  verified_at: 2026-11-18T01:21:51Z
  output: |
    rows: decision-sheet and owner-calls are the plugin's rows at ba3af6b field for field; their checks are the plugin's but for blueprint, which this repository has no file for; nothing else changed in the two files since 8925e8ff

- eval: E11
  run_id: minted-upgrade-design-assembly-0-7-1-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.da071_two_tests
  verified_at: 2026-11-18T01:21:51Z
  output: |
    tests/ci-ban-sao-nong.test.ts va tests/design-check.test.ts: moi bai dat, khong bai nao bo qua

- eval: E12
  run_id: minted-upgrade-design-assembly-0-7-1-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_fixture_tags
  verified_at: 2026-11-18T01:21:51Z
  output: |
    fixtures: tests/design-check.test.ts holds no string the tagged-test reader takes for a tag; at 8925e8ff it held decision:a, decision:other, decision:a-b

- eval: E13
  run_id: minted-upgrade-design-assembly-0-7-1-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_change_list
  verified_at: 2026-11-18T01:21:51Z
  output: |
    changes: the upgrade commit changes its 6 files; the branch changes nothing beyond them and this record

- eval: E14
  run_id: minted-upgrade-design-assembly-0-7-1-E14-r1
  baseline: n-a
  verifier: config:executors.script.ci_db_thu
  verified_at: 2026-11-18T01:21:51Z
  output: |
    BLOCKED: lenh vuot thoi luong khai (long_running), tra dau hieu qua han, chua co dong ket thuc.

- eval: E15
  run_id: minted-upgrade-design-assembly-0-7-1-E15-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_two_way
  verified_at: 2026-11-18T01:21:51Z
  output: |
    duration_ms 1904.048834 (bai tool-tree va release-ledger dat o cac ca do)

- eval: E16
  run_id: minted-upgrade-design-assembly-0-7-1-E16-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_two_way
  verified_at: 2026-11-18T01:21:51Z
  output: |
    duration_ms 1904.048834 (bai rows-mirror dat o cac ca do)

- eval: E17
  run_id: minted-upgrade-design-assembly-0-7-1-E17-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_two_way
  verified_at: 2026-11-18T01:21:51Z
  output: |
    duration_ms 1904.048834 (bai fixture-tags dat o ca do)

- eval: E18
  run_id: minted-upgrade-design-assembly-0-7-1-E18-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_two_way
  verified_at: 2026-11-18T01:21:51Z
  output: |
    duration_ms 1904.048834 (bai change-list dat o cac ca do)

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-upgrade-design-assembly-0-7-1-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-18T01:21:51Z

- cmd: DATABASE_URL= make e2e
  run_id: b3ez32xe9
  exit_code: 0
  verified_at: 2026-11-18T01:21:51Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval khong phan biet (xanh ca tren HEAD lan baseline):
- E1 (make check): regression-guard co chu y; chieu do duoc E3 va E7 phu.
- E11 (tests/ci-ban-sao-nong.test.ts, tests/design-check.test.ts): regression-guard co chu y; chieu do duoc E12, E17 va ca fixtures cua E6 phu.

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

Round 1: E14 BLOCKED — bash db/scripts/ci-thu.sh vuot thoi luong khai (long_running), chua co dong ket thuc; cac eval con lai deu dat. Can chay lai E14 voi thoi gian cho dai hon; khong phai loi code.
