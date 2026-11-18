---
schema_version: 2
feature_slug: nang-kit-3-0
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 013448682e03791612b3c2616e81c9e6b30defe5
human_signoff:
---

# Evidence Report: nang-kit-3-0

Cả 11 eval đều xanh, nhưng lệnh suite `make e2e` đỏ và không gắn eval nào (xem mục "Lệnh suite (hồi quy)"), nên verdict là REJECT. `failed_evals` để trống vì không eval nào đỏ.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-nang-kit-3-0-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_ci_kit
  verified_at: 2026-11-18T08:00:21Z
  output: |
    ci-kit: gate fetches phanlemanh/delivery-loop v3.0.0 at c16d25db; CLAUDE_PLUGIN_ROOT=<kit>/plugins/acceptance-gate has scripts/pre-merge-check.sh and scripts/product-map.mjs; the gate job differs from origin/main in 3 lines

- eval: E2
  run_id: minted-nang-kit-3-0-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_gate_branch
  verified_at: 2026-11-18T08:00:21Z
  output: |
    gate-branch: kit v3.0.0 ran its rules on HEAD against origin/main; 1 VIOLATION lines, each a lifecycle reason of nang-kit-3-0 (no evidence report yet, or T3 not signed yet)

- eval: E3
  run_id: minted-nang-kit-3-0-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_gate_control
  verified_at: 2026-11-18T08:00:21Z
  output: |
    gate-control: on 8925e8ff --recheck-all, kit v2.38.1 and v3.0.0 both 0 VIOLATION, 57 OK each, same records (merge-base is 8925e8ff)

- eval: E4
  run_id: minted-nang-kit-3-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_product_map
  verified_at: 2026-11-18T08:00:21Z
  output: |
    executor-scripts: 4 executor commands under the kit root (script.product_map, design.floor, design.khuon, design.ui_check), 4 scripts, all present in kit v3.0.0 plugins/acceptance-gate

- eval: E5
  run_id: minted-nang-kit-3-0-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.nk30_kit_root
  verified_at: 2026-11-18T08:00:21Z
  output: |
    vitest tests/kit-root.test.ts: lệnh kết thúc thành công (bản ghi máy không giữ dòng tóm tắt cuối)

- eval: E6
  run_id: minted-nang-kit-3-0-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_kit_root_cli
  verified_at: 2026-11-18T08:00:21Z
  output: |
    kit-root cli: old-only -> empty; new-only -> new; both -> new; project beats user

- eval: E7
  run_id: minted-nang-kit-3-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_settings
  verified_at: 2026-11-18T08:00:21Z
  output: |
    settings: marketplace delivery-loop (phanlemanh/delivery-loop) at ref v3.0.0 = KIT_TAG of ci.yml; 6 plugins on, equal to the kit marketplace; no @acceptance-gate-kit key; superpowers, permissions and hooks as on origin/main

- eval: E8
  run_id: minted-nang-kit-3-0-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_doc_commands
  verified_at: 2026-11-18T08:00:21Z
  output: |
    doc-commands: 4 command mentions (3 distinct) and 1 kit path in 3 files, all found in kit v3.0.0

- eval: E9
  run_id: minted-nang-kit-3-0-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_leftover
  verified_at: 2026-11-18T08:00:21Z
  output: |
    leftover: 0 lines at HEAD; 14 lines in 5 files at 8925e8ff

- eval: E10
  run_id: b1eukup5h
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-18T08:00:21Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E11
  run_id: minted-nang-kit-3-0-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_two_way
  verified_at: 2026-11-18T08:00:21Z
  output: |
    node --test _acceptance/nang-kit-3-0/rang/two-way.mjs: hoàn tất sau khoảng 151 giây

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-nang-kit-3-0-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-18T08:00:21Z

- cmd: make e2e
  run_id: minted-nang-kit-3-0-SUITE-make_e2e-r1
  exit_code: 2
  verified_at: 2026-11-18T08:00:21Z
  note: lệnh này không gắn eval nào. Đuôi đầu ra ghi 662 passed, 1272 skipped, gac-hydration 0 cảnh báo, rồi make báo lỗi ở bước e2e. Đuôi liệt kê các ca ở màn 1440 (sheet.spec.ts, sua-tren-o.spec.ts) nằm trong danh sách đỏ. Đây là lý do verdict là REJECT.

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline, chứng minh harness chứ không phải tính năng; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- E5: `npx vitest run tests/kit-root.test.ts --coverage.enabled=false --reporter=verbose`
- E10: `make check`

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

## Judge

Không có judgment item: cả 11 eval đều là máy (script hoặc test), không eval nào có hội đồng chấm. Không có mục nào chờ human_override.

## Variance

none — mọi eval chạy nhiều lần đều đồng nhất (mọi eval chạy một lần, tất định)

## Iterations

Round 1: lệnh suite make e2e đỏ và không gắn eval nào, 11 eval còn lại xanh. Verdict REJECT, trả lại bước triển khai để xem nguyên nhân của e2e.
