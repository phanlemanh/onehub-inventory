---
schema_version: 2
feature_slug: nang-kit-3-0
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b96854f32fd4dd29348670fbe9f61251520b76db
human_signoff:
---

# Evidence Report: nang-kit-3-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | test | PASS (carry-forward từ round 1) |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-10 | script | PASS |

Mọi eval máy đều xanh ở round 3. Verdict tổng là REJECT vì vòng rà soát còn các phát hiện trong hợp đồng mức cao (AC-2 và AC-10), xem review-findings.md. Không eval nào đỏ nên `failed_evals` để trống.

## Evidence

- eval: E1
  run_id: minted-nang-kit-3-0-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_ci_kit
  verified_at: 2026-11-18T09:10:13Z
  output: |
    ci-kit: gate fetches phanlemanh/delivery-loop v3.0.0 at c16d25db; CLAUDE_PLUGIN_ROOT=<kit>/plugins/acceptance-gate has scripts/pre-merge-check.sh and scripts/product-map.mjs; the gate job differs from origin/main in 3 lines

- eval: E2
  run_id: minted-nang-kit-3-0-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_gate_branch
  verified_at: 2026-11-18T09:10:13Z
  output: |
    gate-branch: kit v3.0.0 ran its rules on HEAD against origin/main; 1 VIOLATION lines, each a lifecycle reason of nang-kit-3-0 (not graded yet, graded but not PASS, or T3 not signed yet)

- eval: E3
  run_id: minted-nang-kit-3-0-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_gate_control
  verified_at: 2026-11-18T09:10:13Z
  output: |
    gate-control: on 8925e8ff --recheck-all, kit v2.38.1 and v3.0.0 both 0 VIOLATION, 57 OK each, same records (merge-base is 8925e8ff)

- eval: E4
  run_id: minted-nang-kit-3-0-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_product_map
  verified_at: 2026-11-18T09:10:13Z
  output: |
    executor-scripts: 4 executor commands under the kit root (script.product_map, design.floor, design.khuon, design.ui_check), 4 scripts, all present in kit v3.0.0 plugins/acceptance-gate

- eval: E5
  run_id: minted-nang-kit-3-0-E5-r1
  exit_code: 0
  verifier: config:executors.test.nk30_kit_root
  verified_at: 2026-11-18T08:00:21Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-nang-kit-3-0-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_kit_root_cli
  verified_at: 2026-11-18T09:10:13Z
  output: |
    kit-root cli: old-only -> empty; new-only -> new; both -> new; project beats user

- eval: E7
  run_id: minted-nang-kit-3-0-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_settings
  verified_at: 2026-11-18T09:10:13Z
  output: |
    settings: marketplace delivery-loop (phanlemanh/delivery-loop) at ref v3.0.0 = KIT_TAG of ci.yml; 6 plugins on, equal to the kit marketplace; no @acceptance-gate-kit key; superpowers, permissions and hooks as on origin/main

- eval: E8
  run_id: minted-nang-kit-3-0-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_doc_commands
  verified_at: 2026-11-18T09:10:13Z
  output: |
    doc-commands: 4 command mentions (3 distinct) and 1 kit path in 3 files, all found in kit v3.0.0

- eval: E9
  run_id: minted-nang-kit-3-0-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_leftover
  verified_at: 2026-11-18T09:10:13Z
  output: |
    leftover: 0 lines at HEAD; 14 lines in 5 files at 8925e8ff

- eval: E10
  run_id: r3-l9-1-20261118091013
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-18T09:10:13Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E11
  run_id: r3-l10-1-20261118091013
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_two_way
  verified_at: 2026-11-18T09:10:13Z
  output: |
    ℹ duration_ms 141179.952375

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-nang-kit-3-0-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-18T09:10:13Z

- cmd: make e2e
  run_id: minted-nang-kit-3-0-SUITE-make_e2e-r3
  exit_code: 0
  verified_at: 2026-11-18T09:10:13Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline):
- E10 (`make check`): xanh ở cả hai phía, chứng minh bộ kiểm chung chứ không chứng minh tính năng. Đây là regression-guard có chủ ý.

Baseline không đo:
- node _acceptance/nang-kit-3-0/rang/ci-kit.mjs: bo qua baseline: tep _acceptance/nang-kit-3-0/rang/ci-kit.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-0/rang/gate-branch.mjs: bo qua baseline: tep _acceptance/nang-kit-3-0/rang/gate-branch.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-0/rang/gate-control.mjs: bo qua baseline: tep _acceptance/nang-kit-3-0/rang/gate-control.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-0/rang/product-map.mjs: bo qua baseline: tep _acceptance/nang-kit-3-0/rang/product-map.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-0/rang/kit-root-cli.mjs: bo qua baseline: tep _acceptance/nang-kit-3-0/rang/kit-root-cli.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-0/rang/settings.mjs: bo qua baseline: tep _acceptance/nang-kit-3-0/rang/settings.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-0/rang/doc-commands.mjs: bo qua baseline: tep _acceptance/nang-kit-3-0/rang/doc-commands.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-0/rang/leftover.mjs: bo qua baseline: tep _acceptance/nang-kit-3-0/rang/leftover.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node --test _acceptance/nang-kit-3-0/rang/two-way.mjs: bo qua baseline: tep _acceptance/nang-kit-3-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval nhiều lần chạy đều đồng đều (mọi eval đều chạy một lần, deterministic).

## Iterations

Round 1: 11/11 eval xanh, `make e2e` đỏ trên máy này như ở baseline. Trả về triển khai.
Round 2: phép đo cổng chưa nhận lý do vòng đời «đã chấm nhưng không PASS», sửa để đọc theo đúng lời của kit 3.0. Trả về triển khai.
Round 3: mọi eval và hai lệnh suite xanh; vòng rà soát còn phát hiện trong hợp đồng mức cao (lý do «đạt, chưa ký» của AC-2 không khớp dòng kit 3.0 in cho hồ sơ T3, và phép thử AC-10 chưa chứng minh được chiều đỏ). Verdict REJECT, trả về triển khai.
