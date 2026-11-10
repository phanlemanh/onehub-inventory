---
schema_version: 2
feature_slug: go-hoi-khi-gop
verdict: REJECT
failed_evals: ["E1","E2","E3","E5"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: fac150ad59afdeaa0f38615c232b71e63c8039f0
human_signoff:
---

# Evidence Report: go-hoi-khi-gop

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | FAIL |
| E2 | AC-2 | script | FAIL |
| E3 | AC-3 | script | FAIL |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | FAIL |

Ghi chú: bốn eval E1, E2, E3, E5 dùng chung một lệnh đo (khóa quyen_kho). Lệnh in đúng "Tests 47 passed (47)" nhưng vitest tính độ phủ 0% trên src/** và vi phạm ngưỡng toàn cục (80/80/70/80), nên vế kiểm mã thoát trong lệnh luôn sai. Lỗi nằm ở lệnh đo, không nằm ở cấu hình quyền; chi tiết ở review-findings.md.

## Evidence

- eval: E1
  run_id: minted-go-hoi-khi-gop-E1-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.quyen_kho
  verified_at: 2026-11-10T13:41:39Z
  output: |
    Test Files  1 passed (1)
    Tests  47 passed (47)
    Coverage for lines (0%) does not meet global threshold (80%)
    Coverage for functions (0%) does not meet global threshold (80%)

- eval: E2
  run_id: minted-go-hoi-khi-gop-E2-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.quyen_kho
  verified_at: 2026-11-10T13:41:39Z
  output: |
    Test Files  1 passed (1)
    Tests  47 passed (47)
    Coverage for statements (0%) does not meet global threshold (80%)
    Coverage for branches (0%) does not meet global threshold (70%)

- eval: E3
  run_id: minted-go-hoi-khi-gop-E3-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.quyen_kho
  verified_at: 2026-11-10T13:41:39Z
  output: |
    Test Files  1 passed (1)
    Tests  47 passed (47)
    Coverage for lines (0%) does not meet global threshold (80%)

- eval: E4
  run_id: minted-go-hoi-khi-gop-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.quyen_kho_ban_goc
  verified_at: 2026-11-10T13:41:39Z
  output: |
    deny and allow identical to 84a2d597

- eval: E5
  run_id: minted-go-hoi-khi-gop-E5-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.quyen_kho
  verified_at: 2026-11-10T13:41:39Z
  output: |
    Test Files  1 passed (1)
    Tests  47 passed (47)
    Coverage for lines (0%) does not meet global threshold (80%)

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-go-hoi-khi-gop-SUITE-make_check-r1
  exit_code: 0
  verified_at: 2026-11-10T13:41:39Z

- cmd: npm run build
  run_id: minted-go-hoi-khi-gop-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-10T13:41:39Z

- cmd: make e2e
  run_id: minted-go-hoi-khi-gop-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-10T13:41:39Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả HEAD lẫn baseline): E4. Eval này chứng minh danh sách cấm và cho phép không đổi so với 84a2d597, nên xanh ở cả hai phía là chủ ý (bảo vệ hồi quy), nhưng nó không chứng minh tính năng mới.

Baseline không đo
- bash -c 'out=$(npx vitest run tests/permissions.test.ts 2>&1); rc=$?; printf "%s\n" "$out"; [ $rc -eq 0 ] && printf "%s" "$out" | grep -qE "Tests +47 passed \(47\)"': bỏ qua baseline: tệp tests/permissions.test.ts có ở cây đang kiểm nhưng chưa có ở merge-base 84a2d597b21ad84f2546f12d36fd3508b64eb3d8 — eval mới, chạy trên code cũ không phân biệt gì

Không có hội đồng chấm judgment nào cho vòng này (cả năm eval đều là eval máy).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1, E2, E3, E5 failed — lệnh đo quyen_kho bị ngưỡng độ phủ toàn cục của vitest làm thất bại dù 47 ca đều đạt. Returned to implementation.
