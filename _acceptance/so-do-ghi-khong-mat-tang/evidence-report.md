---
schema_version: 2
feature_slug: so-do-ghi-khong-mat-tang
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 224fbe91a06c46b1e3fd10a9ddf560a55bfad7e1
human_signoff:
---

# Evidence Report: so-do-ghi-khong-mat-tang

Verdict tổng REJECT vì một lệnh suite (`make check`) không gắn eval nào đã thoát khác 0 (bước lint). Cả năm eval tính năng E1-E5 đều đạt.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-so-do-ghi-khong-mat-tang-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T04:53:02Z
  output: |
    make test (chạy chung cho E1-E5) kết thúc sạch, bài 'ghi dừng khi bản cũ không đọc được' đạt.

- eval: E2
  run_id: minted-so-do-ghi-khong-mat-tang-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T04:53:02Z
  output: |
    make test (chạy chung cho E1-E5) kết thúc sạch, bài 'ghi dừng khi bản cũ không phải JSON' đạt.

- eval: E3
  run_id: minted-so-do-ghi-khong-mat-tang-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T04:53:02Z
  output: |
    make test (chạy chung cho E1-E5) kết thúc sạch, bài 'ghi dừng khi bản cũ sai hình dạng' đạt.

- eval: E4
  run_id: minted-so-do-ghi-khong-mat-tang-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T04:53:02Z
  output: |
    make test (chạy chung cho E1-E5) kết thúc sạch, bài 'ghi: xoá bản hỏng thì dựng lại' đạt.

- eval: E5
  run_id: minted-so-do-ghi-khong-mat-tang-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T04:53:02Z
  output: |
    make test (chạy chung cho E1-E5) kết thúc sạch, bài 'ghi: bản cũ lành vẫn đi như cũ' đạt.

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-so-do-ghi-khong-mat-tang-SUITE-make_check-r1
  exit_code: 2
  verified_at: 2026-11-11T04:53:02Z
  note: bước lint dừng với 200 vấn đề (189 lỗi, 11 cảnh báo), phần lớn là no-undef ('args', 'log', 'phase' chưa khai báo) trong một tệp dài hơn 2000 dòng; lệnh này không gắn eval nào.

- cmd: npm run build
  run_id: minted-so-do-ghi-khong-mat-tang-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-11T04:53:02Z

- cmd: make e2e
  run_id: minted-so-do-ghi-khong-mat-tang-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-11T04:53:02Z
  note: 183 bài đạt.

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả HEAD lẫn baseline, chứng minh harness chứ không phải tính năng): lệnh `make test` phủ E1, E2, E3, E4, E5. Cần viết lại để khẳng định hành vi mới, hoặc xác nhận là regression-guard có chủ ý.

Lệnh fail không gắn eval: `make check` (bước lint, không thuộc AC nào).

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (cả năm eval chạy một lần, xác định).

## Judge

Không có mục judgment trong hợp đồng này; không có panel nào được chấm.

## Iterations

Round 1: E1-E5 đạt nhưng lệnh suite `make check` thoát khác 0 ở bước lint (no-undef trong một tệp dài). Trả về giai đoạn cài đặt.
