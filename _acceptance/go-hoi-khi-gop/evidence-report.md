---
schema_version: 2
feature_slug: go-hoi-khi-gop
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: cf03bf15f46c5a74ce5ad89311d180b697fb276a
human_signoff:
---

# Evidence Report: go-hoi-khi-gop

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-go-hoi-khi-gop-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.quyen_kho
  verified_at: 2026-11-10T13:47:00Z
  output: |
    Lệnh chạy bộ kiểm tests/permissions.test.ts với coverage tắt; lệnh chỉ đạt khi dòng tổng kết khớp mẫu "Tests 47 passed (47)".
    Duration  153ms (import 36%, tests 32%, worker 16%, transform 15%, environment 1%)

- eval: E2
  run_id: minted-go-hoi-khi-gop-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.quyen_kho
  verified_at: 2026-11-10T13:47:00Z
  output: |
    Cùng lần chạy bộ kiểm tests/permissions.test.ts; lệnh chỉ đạt khi dòng tổng kết khớp mẫu "Tests 47 passed (47)".
    Duration  153ms (import 36%, tests 32%, worker 16%, transform 15%, environment 1%)

- eval: E3
  run_id: minted-go-hoi-khi-gop-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.quyen_kho
  verified_at: 2026-11-10T13:47:00Z
  output: |
    Cùng lần chạy bộ kiểm tests/permissions.test.ts; lệnh chỉ đạt khi dòng tổng kết khớp mẫu "Tests 47 passed (47)".
    Duration  153ms (import 36%, tests 32%, worker 16%, transform 15%, environment 1%)

- eval: E4
  run_id: minted-go-hoi-khi-gop-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.quyen_kho_ban_goc
  verified_at: 2026-11-10T13:47:00Z
  output: |
    deny and allow identical to 84a2d597

- eval: E5
  run_id: minted-go-hoi-khi-gop-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.quyen_kho
  verified_at: 2026-11-10T13:47:00Z
  output: |
    Cùng lần chạy bộ kiểm tests/permissions.test.ts; lệnh chỉ đạt khi dòng tổng kết khớp mẫu "Tests 47 passed (47)".
    Duration  153ms (import 36%, tests 32%, worker 16%, transform 15%, environment 1%)

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-go-hoi-khi-gop-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-10T13:47:00Z

- cmd: npm run build
  run_id: minted-go-hoi-khi-gop-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-10T13:47:00Z

- cmd: make e2e
  run_id: minted-go-hoi-khi-gop-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-10T13:47:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

Carried từ round 1 — baseline không đo lại round này (evals.yaml không đổi từ lần baseline cuối, round 1). Trường baseline của từng eval ghi n-a.

Eval không phân biệt (xanh trên cả HEAD lẫn baseline):
- E4 — so danh sách cấm và cho phép của tệp hiện tại với bản ở commit 84a2d597. Đây là chốt hồi quy có chủ ý: nó chứng minh hai danh sách không đổi, nên xanh trên code cũ là đúng bản chất. Chiều đỏ của nó được ghim bằng các ca phá bản sao trong E5.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: lịch sử round đầu nằm ở bản đánh giá của round đó, không nạp lại trong lần này.
Round 2: E1, E2, E3, E4, E5 và ba lệnh suite đều đạt; verdict PASS.
