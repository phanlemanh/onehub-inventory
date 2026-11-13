---
schema_version: 2
feature_slug: ho-so-du-thong-tin
verdict: REJECT
failed_evals: ["E2","E3","E4","E5","E6"]
reason: "hạ tầng — make test đứt qua mốc máy ngủ 12:02Z–12:49Z (Failed to start forks worker, 2917 giây); chạy lại cùng commit xanh; G xác nhận (G-1311-96)"
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ff33c0a96c403acf962fc73e9f1cbeea81ac9015
human_signoff:
---

# Evidence Report: ho-so-du-thong-tin

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | test | FAIL |
| E3 | AC-3 | test | FAIL |
| E4 | AC-4 | test | FAIL |
| E5 | AC-5 | test | FAIL |
| E6 | AC-6 | test | FAIL |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | ui-check | PASS |
| E11 | AC-8 | script | PASS |
| E12 | AC-10 | script | PASS |

Lệnh fail không gắn eval riêng: `make test` phủ E2, E3, E4, E5, E6 (một lệnh chung, mã thoát 2). Cả năm eval này đỏ cùng nhau vì lệnh này đỏ.

## Evidence

- eval: E1
  run_id: b984ked9y
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-13T11:57:48Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E2
  run_id: minted-ho-so-du-thong-tin-E2-r2
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:57:48Z
  output: |
    Test Files  14 failed | 63 passed (77)
    Tests  35 failed | 1333 passed (1368)
    Errors  3 errors
    Failed to start forks worker for test files (tests/ho-so-du-thong-tin.test.tsx, tests/label.test.ts): Timeout waiting for worker to respond
    Duration  2916.77s

- eval: E3
  run_id: minted-ho-so-du-thong-tin-E3-r2
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:57:48Z
  output: |
    Test Files  14 failed | 63 passed (77)
    Tests  35 failed | 1333 passed (1368)
    Errors  3 errors
    Failed to start forks worker for tests/ho-so-du-thong-tin.test.tsx: Timeout waiting for worker to respond

- eval: E4
  run_id: minted-ho-so-du-thong-tin-E4-r2
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:57:48Z
  output: |
    Test Files  14 failed | 63 passed (77)
    Tests  35 failed | 1333 passed (1368)
    Errors  3 errors
    Failed to start forks worker for tests/ho-so-du-thong-tin.test.tsx: Timeout waiting for worker to respond

- eval: E5
  run_id: minted-ho-so-du-thong-tin-E5-r2
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:57:48Z
  output: |
    Test Files  14 failed | 63 passed (77)
    Tests  35 failed | 1333 passed (1368)
    Errors  3 errors
    Failed to start forks worker for tests/ho-so-du-thong-tin.test.tsx: Timeout waiting for worker to respond

- eval: E6
  run_id: minted-ho-so-du-thong-tin-E6-r2
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:57:48Z
  output: |
    Test Files  14 failed | 63 passed (77)
    Tests  35 failed | 1333 passed (1368)
    Errors  3 errors
    Failed to start forks worker for tests/ho-so-du-thong-tin.test.tsx: Timeout waiting for worker to respond

- eval: E7
  run_id: minted-ho-so-du-thong-tin-E7-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T11:57:48Z
  output: |
    988 passed (8.7m)

- eval: E8
  run_id: minted-ho-so-du-thong-tin-E8-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T11:57:48Z
  output: |
    988 passed (8.7m)

- eval: E9
  run_id: minted-ho-so-du-thong-tin-E9-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T11:57:48Z
  output: |
    988 passed (8.7m)

- eval: E10
  run_id: minted-ho-so-du-thong-tin-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-13T11:57:48Z
  screenshot: evidence/E10-step1-1440-light.png   # các khung: E10-step1-1440-light.png, E10-step2-1440-dark.png, E10-step2-1024-light.png, E10-step2-1024-dark.png, E10-step2-414-light.png, E10-step2-414-dark.png, E10-step2-360-light.png, E10-step2-360-dark.png, E10-step3-1440-light.png, E10-step3-1024-light.png, E10-step3-414-light.png, E10-step3-360-light.png, E10-step4-1440-light.png
  observed: |
    I opened each frame with Read.

    1440 light, top (E10-step1-1440-light.png): the panel on the right shows the card with 0905, 5,71 tỷ, 'Vinhomes Ocean Park 1 · S1.01 · Căn hộ', the 'Đang giao dịch' badge, and the three figures Diện tích 96,8 m² · Phòng ngủ 3 · Hướng Nam. Below come 'Xác nhận 12 ngày trước', 'Mức đủ thông tin 5/5' with a progress bar and 'Đủ thông tin', the CĂN block and the LẦN CHÀO ĐANG MỞ block, and the heading 'CÁC LẦN CHÀO CỦA CĂN · 3' just cut off at the bottom. No text overlaps and nothing overflows sideways.

    1440 light, scrolled to the end (E10-step3-1440-light.png): the last part of the card, the confirmation line, Mức đủ, CĂN and LẦN CHÀO ĐANG MỞ stay in the same order. At the bottom is 'CÁC LẦN CHÀO CỦA CĂN · 3' with Lần 3 (Đang giao dịch, 5,71 tỷ · 01/10/2026), Lần 2 (Ngừng hẳn, 5,51 tỷ · 14/06/2026) and Lần 1 (Đã bán, 5,11 tỷ · 02/03/2025). Lần 3 is highlighted as current. Read together with the top frame, the order is correct.

    1440 light after tapping Lần 1 (E10-step4-1440-light.png): the card at the top is back in view with the price 5,11 tỷ and the 'Đã bán' badge. The banner 'Đang xem lần chào cũ · Lần 1' has a 'Về lần mới nhất' link. The block is titled 'LẦN CHÀO ĐANG XEM', Mức đủ is 4/5 with 'Còn thiếu: Tài chính', and the 'Chưa có' cell in Tài chính is italic and clearly lighter grey than the real values (Hợp đồng mua bán, Không nội thất).

    1440 dark (E10-step2-1440-dark.png): same layout, dark background, all text, badges and the bar readable.

    1024 light and dark: the panel is narrower and the title wraps to two lines ('0905 · / S1.01'). The status badge drops under the address line. The card order is the same and the three figures show. In the light frame the content after Hiện trạng is cut off at the bottom. The scrolled light frame (E10-step3-1024-light.png) ends with the three Lần lines clearly readable. The dark frame is readable.

    414 light and dark: the panel fills the whole screen. The card is at the top with 0905, 5,71 tỷ, the badge, and Diện tích · Phòng ngủ · Hướng. Then come the confirmation line, Mức đủ, CĂN, LẦN CHÀO ĐANG MỞ and CÁC LẦN CHÀO CỦA CĂN · 3 with three lines at the bottom. The scrolled frame (E10-step3-414-light.png) is almost the same, moved by about 5px. There is no sideways overflow and the dark frame is readable. The dev 'N' button covers the left edge of the Lần 2 and Lần 1 labels.

    360 light and dark: the title wraps to two lines and the status badge sits under the address. The card is at the top with the three figures Diện tích · Phòng ngủ · Hướng. The dark frame ends at the heading with Lần 3 and Lần 2 cut off by the bottom edge and the dev 'N' button. The scrolled light frame (E10-step3-360-light.png) shows all three Lần lines. Text is readable with no overlap and no sideways overflow.

    Against Expected: the top and last frames join up to read from the top as confirmation line, Mức đủ, Căn, Lần chào, Các lần chào. There is no overlapping text and no horizontal overflow. 'Chưa có' is lighter than real values. Dark frames are readable. At 414 and 360 the card is first, with the three figures.
  network_observed: no-app-traffic

- eval: E11
  run_id: minted-ho-so-du-thong-tin-E11-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T11:57:48Z
  output: |
    6 tệp giao diện ngoài bản đồ

- eval: E12
  run_id: minted-ho-so-du-thong-tin-E12-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-13T11:57:48Z
  output: |
    (sàn thiết kế không in dòng nào)

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-ho-so-du-thong-tin-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-13T11:57:48Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả bản đầu lẫn bản cũ, chứng minh harness chứ không phải tính năng; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E1 (make check)
- E11 (design-floor-khuon)
- E12 (design-floor-s4)

Baseline không đo: E10 (n-a, eval nhìn bằng ảnh, không chạy được trên mã cũ).

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (mọi eval chạy 1 lần, không eval nào có phương sai)

## Iterations

Round 1: eval về thứ tự lần chào, giá so với dữ liệu mẫu, giá và ngày trên một dòng, đầu hồ sơ cuộn về tầm nhìn đỏ. Returned to implementation (commit 472bab8).
Round 2: E2, E3, E4, E5, E6 failed — `make test` không hoàn tất: 14 tệp test lỗi, 35 test lỗi, 3 lỗi chưa xử lý; vitest không khởi động được worker cho tests/ho-so-du-thong-tin.test.tsx và tests/label.test.ts (hết thời gian chờ). E1, E7, E8, E9, E10, E11, E12 và npm run build xanh. Returned to implementation.
