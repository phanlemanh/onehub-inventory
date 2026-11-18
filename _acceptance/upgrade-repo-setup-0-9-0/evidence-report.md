---
schema_version: 2
feature_slug: upgrade-repo-setup-0-9-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent (grader, round 2; did not write the code, not the round 1 grader)
enforcement_mode: strict
bypass_used: false
verified_commit: 6695053545508da0188695caa9b260c8d03c2d99
human_signoff: Phan Le Manh 2026-11-19
---

# Evidence Report: upgrade-repo-setup-0-9-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-1 | script | PASS |
| E3 | AC-2 | script | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-4 | script | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-10 | script | PASS |
| E12 | AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: upgrade-repo-setup-0-9-0-E1-20261118T151809Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-18T15:19:29Z
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
  run_id: upgrade-repo-setup-0-9-0-E2-20261118T151940Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.build
  verified_at: 2026-11-18T15:19:44Z
  output: |
    ├ ƒ /proto/bo-nut-theo-quyen
    ├ ƒ /sent
    └ ƒ /tuy-chinh-san
    ƒ Proxy (Middleware)
    ○  (Static)   prerendered as static content
    ƒ  (Dynamic)  server-rendered on demand

- eval: E3
  run_id: upgrade-repo-setup-0-9-0-E3-20261118T151950Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_apply_again
  verified_at: 2026-11-18T15:19:52Z
  output: |
    apply-again: repo-setup 0.9.0 has nothing left to do on HEAD (created, updated, merged, marked, conflict all empty; manifest 0.9.0; no marker left); on bd32d73e it exits 1 with 12 marked files and a conflict on mk/derived.mk

- eval: E4
  run_id: upgrade-repo-setup-0-9-0-E4-20261118T151952Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_rules_kept
  verified_at: 2026-11-18T15:19:54Z
  output: |
    rules-kept: autonomy.yaml, ontology_actions.py, boundaries.py and relations.yaml as at 47d52b06; CODEOWNERS differs on line 3 only; settings.json adds the SessionStart hook only; the main ruleset requires check, e2e, gate, strict off

- eval: E5
  run_id: upgrade-repo-setup-0-9-0-E5-20261118T151954Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_ci_shape
  verified_at: 2026-11-18T15:19:54Z
  output: |
    ci-shape: five jobs quick, e2e, e2e-db, check, gate; e2e and e2e-db behind quick, skipped on a draft, one reuse key each; check waits for quick, e2e and runs ci_verdict.py; gate as at 47d52b06; ci_verdict.py: 16 of 16 combinations as written beforehand, 1 exits 0 and 15 exit 1

- eval: E6
  run_id: upgrade-repo-setup-0-9-0-E6-20261118T152002Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_ci_runs
  verified_at: 2026-11-18T15:20:07Z
  output: |
    ci-runs: on 2109c27d quick, e2e and check succeeded (e2e-db: success); on f4280da0, the newest run whose commit differs from 2109c27d only in HEAVY_NOT_INPUTS, e2e succeeded without running again (same inputs as run 44331309154)

- eval: E7
  run_id: upgrade-repo-setup-0-9-0-E7-20261118T152014Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_secret_scan
  verified_at: 2026-11-18T15:20:22Z
  output: |
    secret-scan: no leak over every commit with the allowlist of HEAD; 22 with the one of bd32d73e, all generic-api-key in _acceptance/*/s4-args*.json; a 64-hex value next to keys.test.ts outside _acceptance/ is caught; the secret-scan job of PR 88 succeeded

- eval: E8
  run_id: upgrade-repo-setup-0-9-0-E8-20261118T152022Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_design_assembly_word
  verified_at: 2026-11-18T15:20:26Z
  output: |
    design-assembly-word: check depends on check-quick, check-heavy, design-assembly; the tool holds 19 decisions by 27 checks; without the word on the check line it says checks-in-gate: the Makefile's check target no longer runs CHECK_TARGETS

- eval: E9
  run_id: upgrade-repo-setup-0-9-0-E9-20261118T152033Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_pinned_tests
  verified_at: 2026-11-18T15:20:48Z
  output: |
    pinned-tests: the three tests pass on HEAD; postgres:15, e2e-db added to check, coverage-matrix out of CHECK_TARGETS and a new git log under tools/ each turn one of them red

- eval: E10
  run_id: upgrade-repo-setup-0-9-0-E10-20261118T152048Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_ledgers
  verified_at: 2026-11-18T15:20:49Z
  output: |
    ledgers: log, index, glossary and gen are one-file; make split DRY=1 exits 0 and writes nothing for each; mk/design-role-table.mk is mk/derived.mk of bd32d73e; make -n test runs tools/coverage_matrix/buttons.py

- eval: E11
  run_id: upgrade-repo-setup-0-9-0-E11-20261118T152049Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_change_set
  verified_at: 2026-11-18T15:20:52Z
  output: |
    change-set: the 46 files of bd32d73e..fd53ac96 fall each in one group read from the apply.py report and the hand-edit list: manifest 1, created 14, conflict then created 1, updated 10, merged 6, marked 9, hand 5; four files of the report unchanged; commit 0deb79be changes only .github/workflows/ci.yml and tests/ci-yml-patch.test.ts; against main (47d52b06) the pull request changes besides them only this dossier, _acceptance/config.yaml, PRODUCT-MAP.md and LO-TRINH.html

- eval: E12
  run_id: upgrade-repo-setup-0-9-0-E12-20261118T152100Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs090_two_way
  verified_at: 2026-11-18T15:21:56Z
  output: |
    ✔ apply-again: green on a sound copy, red on a file still marked
    ✔ rules-kept: green on a sound copy, red when autonomy.yaml changes one line
    ✔ ci-shape: green on a sound copy; red without needs: quick, with a gate byte changed, with a verdict that ignores e2e, and when check waits for e2e-db again
    ✔ secret-scan: green on a sound copy, red without the new allowlist
    ✔ design-assembly-word: green on a sound copy, red when the check line loses the word
    ✔ ledgers: green on a sound copy, red when wiki/log.md carries the drawn stamp
    ✔ change-set: green on a sound copy; red when a file outside the list changes, and when a group's count is off
    ✔ ci-runs: green on the decided run, red on the run of fd53ac96 where check failed
    ℹ tests 8 / pass 8 / fail 0 / skipped 0

## Known limits

- `e2e` và `e2e-db` không chạy trên máy chấm (cần trình duyệt và Postgres); AC-5 đọc chúng trên CI qua E6, không chạy tại chỗ.
- E6 đo lượt CI trên `f4280da0`, không phải trên HEAD `66950535`: lúc E6 chạy (15:20:02Z), lượt CI của HEAD (cũng chỉ đổi `_acceptance/**`) còn đang chạy (`quick` chưa xong), và `ci-runs.mjs` chỉ nhận lượt đã xong. Bằng chứng «dùng lại mà không chạy lại» của AC-5 vì thế đến từ `f4280da0`.
- Job `gate` trên lượt CI của HEAD `66950535` thất bại vì hồ sơ này, ở commit đó, còn mang báo cáo vòng 1 (`pre-merge-check` báo hồ sơ chưa PASS). AC-5 không đo `gate`, nhưng ruleset `main` bắt buộc `gate`: cần commit báo cáo này, chữ ký Gate 2, rồi một lượt CI mới để `gate` xanh.
- Làn baseline không chạy ở vòng chấm độc lập này; mọi eval ghi `baseline: n-a` (xem «Baseline khong do» dưới).
- Lệch chữ nhỏ trong tệp kê, không đổi phép chấm: chú thích đầu `evals.yaml` và chú thích của `rs090_secret_scan`/`rs090_ci_runs` trong `_acceptance/config.yaml` còn ghi số và lượt cũ (12 phát hiện, lượt `fd53ac96` xanh), trong khi `expected` của E7, AC-6 và đầu ra đều là 22, và E6 đọc lượt `2109c27d`.

## Ngoài hợp đồng

## Analyst

none measured — baseline lane was not run in this independent grading round.

Baseline khong do: vòng chấm độc lập này không chạy làn baseline trên diffBase; mọi eval ghi `baseline: n-a`. Mặt đỏ của các phép đo E3, E4, E5, E6, E7, E8, E10, E11 được E12 kiểm trên bản phá (vòng này có thêm ca `ci-runs`); E1, E2, E9 không có ca phá trong `two-way.mjs` (E9 tự chạy bốn bản phá trong chính phép đo).

## Variance

none — every eval is deterministic and ran once.

## Iterations

Round 1: E6 failed — lượt CI của PR #88 trên commit chỉ đổi HEAVY_NOT_INPUTS (`f4280da0`) chưa xong lúc phép đo chạy (xong 9 giây sau). Returned to implementation.
Round 2: không đổi mã; hồ sơ thêm ca đỏ cho `ci-runs` trong `rang/two-way.mjs` và dòng ghim E3 nêu «no marker left». Cả 12 eval đạt trên `66950535`, E6 đọc lượt đã xong của `f4280da0`. PASS.
