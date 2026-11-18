---
schema_version: 2
feature_slug: upgrade-design-assembly-0-7-1
verdict: REJECT
failed_evals: ["E3","E5","E7","E14"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: de1c7fb3847cec3d4747df12ee304f04009bcd9c
human_signoff:
---

# Evidence Report: upgrade-design-assembly-0-7-1

Round 2. Hai lenh that bai: lenh do shallow-two-way (E3, E5, E7) va ci-thu.sh (E14). Cac lenh con lai xanh. Lenh that bai khong gan eval nao ngoai hai lenh tren: khong co.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS (carry-forward tu round 1) |
| E2 | AC-2 | script | PASS |
| E3 | AC-2 | script | FAIL |
| E4 | AC-3 | script | PASS |
| E5 | AC-3 | script | FAIL |
| E6 | AC-4 | script | PASS |
| E7 | AC-4 | script | FAIL |
| E8 | AC-5 | script | PASS |
| E9 | AC-5 | script | PASS |
| E10 | AC-6 | script | PASS |
| E11 | AC-7 | test | PASS (carry-forward tu round 1) |
| E12 | AC-7 | script | PASS |
| E13 | AC-8 | script | PASS |
| E14 | AC-9 | script | FAIL |
| E15 | AC-5 | script | PASS |
| E16 | AC-6 | script | PASS |
| E17 | AC-7 | script | PASS |
| E18 | AC-8 | script | PASS |

## Evidence

Moc thoi gian round 2 (verified_at) lay tu ma chay cua phep do E15-E18 (r2-l11-1-20261118022522); run-log chua co dong round 2 luc soan bao cao, main loop se append truoc khi ghi file.

- eval: E2
  run_id: minted-upgrade-design-assembly-0-7-1-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_shallow_check
  verified_at: 2026-11-18T02:25:22Z
  output: |
    shallow, the manifest said: component manifest: design/component-registry.json is up to date (294 components)

- eval: E3
  run_id: minted-upgrade-design-assembly-0-7-1-E3-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.da071_shallow_two_way
  verified_at: 2026-11-18T02:25:22Z
  output: |
    node --test: 5 bai, 4 dat, 1 hong.
    Bai hong: "shallow-check: red on 8925e8ff, and red when it looks for 295 components or 2461 tests" (228647 ms).
    AssertionError: clones left behind: upgrade-0-7-1-shallow-C3G6dY upgrade-0-7-1-shallow-Lma2u6 upgrade-0-7-1-shallow-gHFozd
    (redWith, shallow-two-way.mjs dong 26: mong danh sach ban sao con lai rong, thuc te con 3 thu muc tam)

- eval: E4
  run_id: minted-upgrade-design-assembly-0-7-1-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_shallow_alone
  verified_at: 2026-11-18T02:25:22Z
  output: |
    alone: make design-assembly green on a fresh depth-1 clone of de1c7fb3 with origin main at 8925e8ff; decision-sheet and owner-calls each said main was fetched from origin; the clone left main at 8925e8ff

- eval: E5
  run_id: minted-upgrade-design-assembly-0-7-1-E5-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.da071_shallow_two_way
  verified_at: 2026-11-18T02:25:22Z
  output: |
    Cung lenh node --test voi E3 va E7: lenh that bai o muc tep do (1 bai hong, bai do la bai cua E3).
    Duoi day khong in dong nao cua bai shallow-alone, nen bai E5 khong duoc xac nhan trong dau ra da luu; eval bi tinh hong theo ket qua lenh.

- eval: E6
  run_id: minted-upgrade-design-assembly-0-7-1-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_shallow_bite
  verified_at: 2026-11-18T02:25:22Z
  output: |
    bite: on fresh depth-1 clones of de1c7fb3, the untouched copy is green; a new page stops owner-calls, an untold tag stops decision-sheet, and the fixtures of 8925e8ff stop decision-sheet by name

- eval: E7
  run_id: minted-upgrade-design-assembly-0-7-1-E7-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.da071_shallow_two_way
  verified_at: 2026-11-18T02:25:22Z
  output: |
    Cung lenh node --test voi E3 va E5. Dau ra co dong "shallow-bite: red without the two checks" (114260 ms) va "shallow-bite: red when the gate prints the lines but exits 0" (91450 ms) o trang thai dat.
    Lenh van that bai o muc tep do vi bai cua E3 hong, nen E7 bi tinh hong theo ket qua lenh.

- eval: E8
  run_id: minted-upgrade-design-assembly-0-7-1-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_tool_tree
  verified_at: 2026-11-18T02:25:22Z
  output: |
    tool: tools/design-assembly is the plugin's version 0.7.1, 34 files, tree 2da4cc56de55; the stamp says the same; mk/design-assembly.mk is the template's

- eval: E9
  run_id: minted-upgrade-design-assembly-0-7-1-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_release_ledger
  verified_at: 2026-11-18T02:25:22Z
  output: |
    release ledger: version 0.7.1 at ba3af6b names tool tree 2da4cc56de55, the one pinned here; its templates have that tree and the gate step

- eval: E10
  run_id: minted-upgrade-design-assembly-0-7-1-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_rows_mirror
  verified_at: 2026-11-18T02:25:22Z
  output: |
    rows: decision-sheet and owner-calls are the plugin's rows at ba3af6b field for field; their checks are the plugin's but for blueprint, which this repository has no file for; nothing else changed in the two files since 8925e8ff

- eval: E12
  run_id: minted-upgrade-design-assembly-0-7-1-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_fixture_tags
  verified_at: 2026-11-18T02:25:22Z
  output: |
    fixtures: tests/design-check.test.ts holds no string the tagged-test reader takes for a tag; at 8925e8ff it held decision:a, decision:other, decision:a-b

- eval: E13
  run_id: minted-upgrade-design-assembly-0-7-1-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_change_list
  verified_at: 2026-11-18T02:25:22Z
  output: |
    changes: the upgrade commit changes its 6 files; the branch changes nothing beyond them and this record

- eval: E14
  run_id: minted-upgrade-design-assembly-0-7-1-E14-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.ci_db_thu
  verified_at: 2026-11-18T02:25:22Z
  output: |
    ci-thu: make check trong ban sao nong: check xanh
    pha bo-phien: co-phien HONG (753 giay), khong-phien dat (114 giay); roi 360 man members
    pha vai-chu: cac pha-thu bo-ep-luat va goc-nhin-bo-ep-luat deu do nhu mong doi
    pha may-chu-chu: may chu dev noi bang vai postgres, khong phai quy_hang_login
    ci-thu: DO — vuot 2/3 tran
    ci-thu: xanh? khong · 26.7 phut · check xanh · pha bo-phien do · pha vai-chu do · pha may-chu-chu do

- eval: E15
  run_id: r2-l11-1-20261118022522
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_two_way
  verified_at: 2026-11-18T02:25:22Z
  output: |
    node --test measures-two-way.mjs: dat (cung lenh voi E16, E17, E18)

- eval: E16
  run_id: r2-l11-1-20261118022522
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_two_way
  verified_at: 2026-11-18T02:25:22Z
  output: |
    node --test measures-two-way.mjs: dat (cung lenh voi E15, E17, E18)

- eval: E17
  run_id: r2-l11-1-20261118022522
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_two_way
  verified_at: 2026-11-18T02:25:22Z
  output: |
    node --test measures-two-way.mjs: dat (cung lenh voi E15, E16, E18)

- eval: E18
  run_id: r2-l11-1-20261118022522
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da071_two_way
  verified_at: 2026-11-18T02:25:22Z
  output: |
    node --test measures-two-way.mjs: dat (cung lenh voi E15, E16, E17)

### Carry-forward (khong chay lai round nay)

- eval: E1
  run_id: minted-upgrade-design-assembly-0-7-1-E1-r1
  exit_code: 0
  verifier: config:executors.script.check
  verified_at: 2026-11-18T01:21:51Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-upgrade-design-assembly-0-7-1-E11-r1
  exit_code: 0
  verifier: config:executors.test.da071_two_tests
  verified_at: 2026-11-18T01:21:51Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-upgrade-design-assembly-0-7-1-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-18T02:25:22Z

- cmd: npm run build
  run_id: minted-upgrade-design-assembly-0-7-1-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-18T02:25:22Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-upgrade-design-assembly-0-7-1-SUITE-DATABASE_URL_make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-18T02:25:22Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Luu y trung thuc: moi eval moi deu co baseline n-a (xem muc ben duoi), nen khong co eval nao thuc su do duoc o diffBase; dong tren theo dung danh sach khong-phan-biet may tra ve (rong).

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

Round 1: E14 khong chay duoc (vuot thoi luong khai bao), tong ket BLOCKED; cac phat hien trong hop dong cua phep do AC-1, AC-2, AC-4, AC-6 duoc sua o commit de1c7fb3. Returned to implementation.
Round 2: E3, E5, E7 failed — lenh node --test shallow-two-way.mjs that bai vi bai "shallow-check: red on 8925e8ff" de lai 3 ban sao tam (upgrade-0-7-1-shallow-*), phep do khong don dep. E14 failed — ci-thu.sh bao "vuot 2/3 tran" va "xanh? khong" sau 26.7 phut. Returned to implementation.
