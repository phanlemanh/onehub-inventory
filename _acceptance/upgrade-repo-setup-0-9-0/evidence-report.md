---
schema_version: 2
feature_slug: upgrade-repo-setup-0-9-0
verdict: REJECT
failed_evals: [E6]
reason:
verified_by: fresh-context verification subagent (grader, round 1; did not write the code)
enforcement_mode: strict
bypass_used: false
verified_commit: f4280da0543807abbfe4034c414c3818cceeb612
human_signoff:
---

# Evidence Report: upgrade-repo-setup-0-9-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-1 | script | PASS |
| E3 | AC-2 | script | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-4 | script | PASS |
| E6 | AC-5 | script | FAIL |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-10 | script | PASS |
| E12 | AC-2, AC-3, AC-4, AC-6, AC-7, AC-9, AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: upgrade-repo-setup-0-9-0-E1-20261118T150604Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check (make check)
  verified_at: 2026-11-18T15:07:22Z
  output: |
     Test Files  147 passed (147)
          Tests  2464 passed | 2 skipped (2466)
    design-assembly: 19 decisions held by 27 checks, each seen failing on a changed copy
    component manifest: design/component-registry.json is up to date (294 components)
    determinism: 47/67 = 70%
    CODEOWNERS matches governance/autonomy.yaml
    no heavy checks
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E2
  run_id: upgrade-repo-setup-0-9-0-E2-20261118T150738Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.build (npm run build)
  verified_at: 2026-11-18T15:07:45Z
  output: |
    ✓ Compiled successfully in 1109ms
    Route (app)
    ├ ƒ /proto/bo-nut-theo-quyen
    ├ ƒ /sent
    └ ƒ /tuy-chinh-san
    ƒ Proxy (Middleware)
    ○  (Static)   prerendered as static content
    ƒ  (Dynamic)  server-rendered on demand

- eval: E3
  run_id: upgrade-repo-setup-0-9-0-E3-20261118T150752Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_apply_again
  verified_at: 2026-11-18T15:07:59Z
  output: |
    apply-again: repo-setup 0.9.0 has nothing left to do on HEAD (created, updated, merged, marked, conflict all empty; manifest 0.9.0; no marker left); on bd32d73e it exits 1 with 12 marked files and a conflict on mk/derived.mk

- eval: E4
  run_id: upgrade-repo-setup-0-9-0-E4-20261118T150759Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_rules_kept
  verified_at: 2026-11-18T15:08:00Z
  output: |
    rules-kept: autonomy.yaml, ontology_actions.py, boundaries.py and relations.yaml as at 47d52b06; CODEOWNERS differs on line 3 only; settings.json adds the SessionStart hook only; the main ruleset requires check, e2e, gate, strict off

- eval: E5
  run_id: upgrade-repo-setup-0-9-0-E5-20261118T150800Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_ci_shape
  verified_at: 2026-11-18T15:08:01Z
  output: |
    ci-shape: five jobs quick, e2e, e2e-db, check, gate; e2e and e2e-db behind quick, skipped on a draft, one reuse key each; check waits for quick, e2e and runs ci_verdict.py; gate as at 47d52b06; ci_verdict.py: 16 of 16 combinations as written beforehand, 1 exits 0 and 15 exit 1

- eval: E6
  run_id: upgrade-repo-setup-0-9-0-E6-20261118T151048Z
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.rs090_ci_runs
  verified_at: 2026-11-18T15:10:51Z
  output: |
    ci-runs: no run of PR 88 after 2109c27d changes only HEAVY_NOT_INPUTS

- eval: E7
  run_id: upgrade-repo-setup-0-9-0-E7-20261118T150812Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_secret_scan
  verified_at: 2026-11-18T15:08:27Z
  output: |
    secret-scan: no leak over every commit with the allowlist of HEAD; 22 with the one of bd32d73e, all generic-api-key in _acceptance/*/s4-args*.json; a 64-hex value next to keys.test.ts outside _acceptance/ is caught; the secret-scan job of PR 88 succeeded

- eval: E8
  run_id: upgrade-repo-setup-0-9-0-E8-20261118T150827Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_design_assembly_word
  verified_at: 2026-11-18T15:08:34Z
  output: |
    design-assembly-word: check depends on check-quick, check-heavy, design-assembly; the tool holds 19 decisions by 27 checks; without the word on the check line it says checks-in-gate: the Makefile's check target no longer runs CHECK_TARGETS

- eval: E9
  run_id: upgrade-repo-setup-0-9-0-E9-20261118T150842Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_pinned_tests
  verified_at: 2026-11-18T15:09:09Z
  output: |
    pinned-tests: the three tests pass on HEAD; postgres:15, e2e-db added to check, coverage-matrix out of CHECK_TARGETS and a new git log under tools/ each turn one of them red

- eval: E10
  run_id: upgrade-repo-setup-0-9-0-E10-20261118T150909Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_ledgers
  verified_at: 2026-11-18T15:09:11Z
  output: |
    ledgers: log, index, glossary and gen are one-file; make split DRY=1 exits 0 and writes nothing for each; mk/design-role-table.mk is mk/derived.mk of bd32d73e; make -n test runs tools/coverage_matrix/buttons.py

- eval: E11
  run_id: upgrade-repo-setup-0-9-0-E11-20261118T150911Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_change_set
  verified_at: 2026-11-18T15:09:14Z
  output: |
    change-set: the 46 files of bd32d73e..fd53ac96 fall each in one group read from the apply.py report and the hand-edit list: manifest 1, created 14, conflict then created 1, updated 10, merged 6, marked 9, hand 5; four files of the report unchanged; commit 0deb79be changes only .github/workflows/ci.yml and tests/ci-yml-patch.test.ts; against main (47d52b06) the pull request changes besides them only this dossier, _acceptance/config.yaml, PRODUCT-MAP.md and LO-TRINH.html

- eval: E12
  run_id: upgrade-repo-setup-0-9-0-E12-20261118T150922Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_two_way
  verified_at: 2026-11-18T15:10:28Z
  output: |
    ✔ apply-again: green on a sound copy, red on a file still marked
    ✔ rules-kept: green on a sound copy, red when autonomy.yaml changes one line
    ✔ ci-shape: green on a sound copy; red without needs: quick, with a gate byte changed, with a verdict that ignores e2e, and when check waits for e2e-db again
    ✔ secret-scan: green on a sound copy, red without the new allowlist
    ✔ design-assembly-word: green on a sound copy, red when the check line loses the word
    ✔ ledgers: green on a sound copy, red when wiki/log.md carries the drawn stamp
    ✔ change-set: green on a sound copy; red when a file outside the list changes, and when a group's count is off
    ℹ tests 7 / pass 7 / fail 0 / skipped 0

## Known limits

- `e2e` và `e2e-db` không chạy trên máy chấm (cần trình duyệt và Postgres); AC-5 đọc chúng trên CI qua E6, và lượt này E6 đỏ.
- E6 đỏ vì thời điểm, không phải vì CI: phép đo chạy lúc 15:10:48Z, khi lượt CI của PR #88 trên `f4280da0` (commit chỉ đổi `_acceptance/**` so với `2109c27d`) còn đang chạy (`e2e-db` xong lúc 15:10:56Z, lượt xong lúc 15:10:57Z). `ci-runs.mjs` chỉ nhận lượt đã `completed`, nên chưa thấy lượt nào hợp lệ. Đọc tay sau đó (không tính là lượt chấm): trên lượt ấy `quick`, `e2e`, `e2e-db`, `check` đều `success`. Theo lệnh, E6 chạy đúng một lần và không chạy lại; cần một lượt chấm sau để chấm AC-5.
- Trên cả hai lượt CI (`2109c27d` và `f4280da0`), job `gate` thất bại: `pre-merge-check` báo hồ sơ này còn `status=approved` trong commit (cây làm việc có `status: implemented` chưa commit). AC-5 không đo `gate`, nhưng ruleset `main` bắt buộc `gate`.
- `rang/two-way.mjs` không có ca hai chiều cho `ci-runs.mjs` (E6), nên phép đo của AC-5 chưa có mặt đỏ được kiểm.
- Dòng ghim của E3 trong `evals.yaml` thiếu cụm `; no marker left` mà `apply-again.mjs` in; dòng thật là bản ghim cộng thêm đúng ý «không tệp nào còn dấu» của `expected`, nên chấm PASS.

## Ngoài hợp đồng

## Analyst

none measured — baseline lane was not run in this independent grading round.

Baseline khong do: vòng chấm độc lập này không chạy làn baseline trên diffBase; mọi eval ghi `baseline: n-a`. Mặt đỏ của các phép đo E3, E4, E5, E7, E8, E10, E11 được E12 kiểm trên bản phá; E1, E2, E6, E9 không có ca phá trong `two-way.mjs` (E9 tự chạy bốn bản phá trong chính phép đo).

## Variance

none — every eval is deterministic and ran once.

## Iterations

Round 1: E6 failed — lượt CI của PR #88 trên commit chỉ đổi HEAVY_NOT_INPUTS (`f4280da0`) chưa xong lúc phép đo chạy (xong 9 giây sau). Returned to implementation.
