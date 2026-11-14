---
schema_version: 2
feature_slug: cong-bat-khoi-khong-ke
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 432bc6d3294e05156fd55c12dc7c15451bd2105b
human_signoff:
---

# Evidence Report: cong-bat-khoi-khong-ke

Round 1. Cả bảy eval của tính năng đạt, nhưng lệnh suite `make check` không gắn eval nào bị đỏ ở bước lint nên verdict là REJECT. Hồ sơ này không có eval nào trượt (`failed_evals` để rỗng); lý do REJECT là lệnh suite hồi quy đỏ.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-cong-bat-khoi-khong-ke-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T15:17:37Z
  output: |
    npx vitest run tools/proof_gate --coverage.enabled=false --reporter=verbose
    bảy eval của tính năng cùng nằm trong một lượt chạy, lượt này đạt

- eval: E2
  run_id: minted-cong-bat-khoi-khong-ke-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T15:17:37Z
  output: |
    npx vitest run tools/proof_gate --coverage.enabled=false --reporter=verbose
    bảy eval của tính năng cùng nằm trong một lượt chạy, lượt này đạt

- eval: E3
  run_id: minted-cong-bat-khoi-khong-ke-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T15:17:37Z
  output: |
    npx vitest run tools/proof_gate --coverage.enabled=false --reporter=verbose
    bảy eval của tính năng cùng nằm trong một lượt chạy, lượt này đạt

- eval: E4
  run_id: minted-cong-bat-khoi-khong-ke-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T15:17:37Z
  output: |
    npx vitest run tools/proof_gate --coverage.enabled=false --reporter=verbose
    bảy eval của tính năng cùng nằm trong một lượt chạy, lượt này đạt

- eval: E5
  run_id: minted-cong-bat-khoi-khong-ke-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T15:17:37Z
  output: |
    npx vitest run tools/proof_gate --coverage.enabled=false --reporter=verbose
    bảy eval của tính năng cùng nằm trong một lượt chạy, lượt này đạt

- eval: E6
  run_id: minted-cong-bat-khoi-khong-ke-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T15:17:37Z
  output: |
    npx vitest run tools/proof_gate --coverage.enabled=false --reporter=verbose
    bảy eval của tính năng cùng nằm trong một lượt chạy, lượt này đạt

- eval: E7
  run_id: minted-cong-bat-khoi-khong-ke-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T15:17:37Z
  output: |
    npx vitest run tools/proof_gate --coverage.enabled=false --reporter=verbose
    bảy eval của tính năng cùng nằm trong một lượt chạy, lượt này đạt

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-cong-bat-khoi-khong-ke-SUITE-make_check-r1
  exit_code: 2
  verified_at: 2026-11-14T15:17:37Z

- cmd: npm run build
  run_id: minted-cong-bat-khoi-khong-ke-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-14T15:17:37Z

- cmd: make e2e
  run_id: minted-cong-bat-khoi-khong-ke-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-14T15:17:37Z

## Known limits

## Ngoài hợp đồng

## Analyst

Lệnh fail không gắn eval: `make check` (không thuộc eval nào) dừng ở bước lint với 189 lỗi và 15 cảnh báo, chủ yếu là lỗi `no-undef` cho `args`, `log`, `phase` ở một tệp kịch bản dài hơn 2000 dòng (phần đuôi đầu ra không hiện tên tệp đó). Ngoài ra có cảnh báo biến không dùng ở `src/app/(app)/account-menu.tsx`, `src/modules/identity/config.test.ts`, `tests/e2e-db/bo-nut-members.spec.ts` và `tests/e2e/sheet.spec.ts`. Cần người xác định tệp kịch bản đó có thuộc phạm vi thay đổi của tính năng hay không; máy không kết luận từ phần đuôi. `npm run build` và `make e2e` (1151 bài đạt) đều xanh.

Eval không phân biệt (đạt trên cả bản hiện tại lẫn bản nền, nghĩa là bài chưa chứng minh được tính năng, cần viết lại để khẳng định hành vi mới hoặc xác nhận là lưới hồi quy có chủ ý): E1, E2, E3, E4, E5, E6, E7 (cùng một lệnh `npx vitest run tools/proof_gate --coverage.enabled=false --reporter=verbose`, baseline green).

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (cả bảy eval chạy một lần, tất định).

## Iterations

Round 1: bảy eval E1-E7 đạt, nhưng lệnh suite `make check` đỏ ở bước lint (lỗi không gắn eval nào). Trả về để triển khai xử lý.
