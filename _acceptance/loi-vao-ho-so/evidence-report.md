---
schema_version: 2
feature_slug: loi-vao-ho-so
verdict: REJECT
failed_evals: ["E9"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f688e7c7d031a8f82eb37985f6a7be52556d0c43
human_signoff:
---

# Evidence Report: loi-vao-ho-so

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-8 | ui-check | FAIL |
| E10 | AC-8 | script | PASS |

Lệnh fail không gắn eval: `ui-check:E9` (thuộc E9, đã tính ở trên). Không có lệnh fail nào ngoài các eval đã khai.

## Evidence

- eval: E1
  run_id: minted-loi-vao-ho-so-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T06:33:15Z
  output: |
    make e2e: 886 passed (6.9m)

- eval: E2
  run_id: minted-loi-vao-ho-so-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T06:33:15Z
  output: |
    make e2e: 886 passed (6.9m)

- eval: E3
  run_id: minted-loi-vao-ho-so-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T06:33:15Z
  output: |
    make e2e: 886 passed (6.9m)

- eval: E4
  run_id: minted-loi-vao-ho-so-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T06:33:15Z
  output: |
    make e2e: 886 passed (6.9m)

- eval: E5
  run_id: minted-loi-vao-ho-so-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T06:33:15Z
  output: |
    make e2e: 886 passed (6.9m)

- eval: E7
  run_id: minted-loi-vao-ho-so-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T06:33:15Z
  output: |
    make e2e: 886 passed (6.9m)

- eval: E8
  run_id: minted-loi-vao-ho-so-E8-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T06:33:15Z
  output: |
    make e2e: 886 passed (6.9m)

- eval: E6
  run_id: minted-loi-vao-ho-so-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T06:33:15Z
  output: |
    make test: all tests passed

- eval: E10
  run_id: minted-loi-vao-ho-so-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T06:33:15Z
  output: |
    design-floor-khuon --kiem: 11 tệp giao diện ngoài bản đồ

- eval: E9
  run_id: minted-loi-vao-ho-so-E9-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-13T06:33:15Z
  screenshot: evidence/ho-so-1440-sang.png
  observed: |
    I opened 10 of the 19 frames; the other 9 are covered only by DOM assertions.
    ho-so-1440-sang: the record panel is on the right. The header reads "1603 · S1.01" with the buttons "Chép đường dẫn" (label shown), "< Trước", "Sau >", "x Đóng" on one line. Below it are the price 4,28 tỷ, the status badge "Đang bán" and the details. The text is readable and nothing overlaps.
    ho-so-360-toi: the dark panel fills the width. The header shows the icon-only copy button, Trước, Sau and Đóng on one row with the title "1603 · S1.01" wrapping to two lines on the left. Nothing is pushed down, there is no horizontal scroll, and the text is readable.
    da-chep-1440: the toast "Đã chép đường dẫn" is fully legible at the bottom right.
    da-chep-360 (dark): the toast spans the bottom of the screen, but the dev "N" badge covers its left edge, so "Đã" is hidden and the text reads "chép đường dẫn". This does not meet "thấy rõ".
    go-ma-1440-sang: the box shows "16" with 5 rows. Each row starts with the type "Căn" followed by "1603 · S1.01, [MAU] Toà C1", "1604 · S1.01" and so on. The text is readable.
    go-ma-360-toi: the dark box shows the same 5 rows with the type "Căn" on each. It sits inside the screen with no edge clipping.
    ma-la-360-sang: the grid is empty, with "0 / 60 dòng", "Lọc (1)" and "Không có dòng nào khớp / Xoá lọc". "Z-99.99" is at the head of the Căn column filter. No overlap.
    ma-la-1440-toi: the same empty state with "Z-99.99" in the Căn header. The text is readable.
    duong-dan-cu-1440: the normal Bảng hàng with 60 rows, plus the toast "Căn trong đường dẫn không còn trong Bảng hàng."
  network_observed: clean

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-loi-vao-ho-so-SUITE-make_check-r1
  exit_code: 0
  verified_at: 2026-11-13T06:33:15Z

- cmd: npm run build
  run_id: minted-loi-vao-ho-so-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-13T06:33:15Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả code mới lẫn baseline, chứng minh harness chứ không chứng minh feature; cần viết lại để khẳng định hành vi mới, hoặc xác nhận là regression-guard có chủ ý):
- make test, eval E6 — baseline green.
- design-floor-khuon --kiem, eval E10 — baseline green.

Baseline không đo: E9 (ui-check, baseline n-a).

Judge panels: không có judgment item nào trong hợp đồng này.

## Variance

none — mọi eval chạy một lần (deterministic), không eval nào có pass_rate lẫn.

## Iterations

Round 1: E9 failed — khung da-chep-360 (tối): huy hiệu "N" của chế độ dev Next che mép trái thông báo nên chữ "Đã" bị ẩn, thông báo đọc thành "chép đường dẫn", không đạt "thấy rõ". Nguyên nhân là lớp phủ chỉ có ở dev; cần chụp lại trên bản build production hoặc tắt chỉ báo dev. Returned to implementation.
