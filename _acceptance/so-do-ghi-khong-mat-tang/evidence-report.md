---
schema_version: 2
feature_slug: so-do-ghi-khong-mat-tang
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f14b2fb4f7a6910c19313f9647085c36b123f6e6
human_signoff: Manh Phan 2026-11-11
---

# Evidence Report: so-do-ghi-khong-mat-tang

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-so-do-ghi-khong-mat-tang-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T04:59:29Z
  output: |
    make test hoàn tất, bài 'ghi dừng khi bản cũ không đọc được' trong tools/round_metrics/round-metrics.test.ts đạt
    (đối chứng dương, ca thư mục, ca chmod 000 khi không chạy dưới root).

- eval: E2
  run_id: minted-so-do-ghi-khong-mat-tang-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T04:59:29Z
  output: |
    make test hoàn tất, bài 'ghi dừng khi bản cũ không phải JSON' đạt (ma trận 3 nội dung x 2 cách gọi, 6 ô).

- eval: E3
  run_id: minted-so-do-ghi-khong-mat-tang-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T04:59:29Z
  output: |
    make test hoàn tất, bài 'ghi dừng khi bản cũ sai hình dạng' đạt (ma trận 9 dạng x 2 cách gọi, 18 ô).

- eval: E4
  run_id: minted-so-do-ghi-khong-mat-tang-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T04:59:29Z
  output: |
    make test hoàn tất, bài 'ghi: xoá bản hỏng thì dựng lại' đạt.

- eval: E5
  run_id: minted-so-do-ghi-khong-mat-tang-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T04:59:29Z
  output: |
    make test hoàn tất, bài 'ghi: bản cũ lành vẫn đi như cũ' đạt (ma trận 3 trạng thái x 2 cách gọi, 6 ô).

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-so-do-ghi-khong-mat-tang-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-11T04:59:29Z

- cmd: npm run build
  run_id: minted-so-do-ghi-khong-mat-tang-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-11T04:59:29Z

- cmd: make e2e
  run_id: minted-so-do-ghi-khong-mat-tang-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-11T04:59:29Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tư round 1 — baseline không đo lại round này (evals.yaml không đổi từ lần baseline cuối).

Eval không phân biệt (pass trên cả HEAD lẫn baseline; chứng minh harness chứ chưa chứng minh feature, cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- make test, phủ E1, E2, E3, E4, E5

Baseline không đo: round này không đo lại, field baseline của từng eval ghi n-a.

## Variance

none — không eval nào chạy nhiều lần; mọi eval deterministic và đồng nhất.

## Iterations

Round 1: kết quả ghi ở commit f14b2fb (chore: record S4 round 1).
Round 2: E1, E2, E3, E4, E5 và ba lệnh suite (make check, npm run build, make e2e) đều đạt; verdict PASS.
