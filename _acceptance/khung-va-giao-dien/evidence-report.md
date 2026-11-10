---
schema_version: 2
feature_slug: khung-va-giao-dien
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d3fad5a6ea2f4f8e3cc27ed9f28b03c02d656b50
human_signoff:
---

# Evidence Report: khung-va-giao-dien

Vòng 1. Verdict tổng REJECT vì lệnh suite `make check` (không gắn eval nào) dừng ở bước lint với 189 lỗi và 11 cảnh báo. Mọi eval gắn AC đều đạt trên máy; E16 (judgment) chưa có người quyết, panel đề xuất FAIL.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-10 | script | PASS |
| E12 | AC-11 | test | PASS |
| E13 | AC-11 | script | PASS |
| E14 | AC-12 | script | PASS |
| E15 | AC-12 | ui-check | PASS |
| E16 | AC-6 | judgment | Chờ người quyết (panel đề xuất FAIL) |
| E17 | AC-12 | script | PASS |

Lệnh fail không gắn eval: `make check` (lint dừng, xem khối suite bên dưới). Không có eval nào bị tính vào failed_evals vì lệnh này không thuộc eval nào.

## Evidence

- eval: E1
  run_id: minted-khung-va-giao-dien-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-10T23:19:16Z
  output: |
    106 passed (27.0s)
    __EXIT=0

- eval: E2
  run_id: minted-khung-va-giao-dien-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-10T23:19:16Z
  output: |
    106 passed (27.0s)
    __EXIT=0

- eval: E5
  run_id: minted-khung-va-giao-dien-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-10T23:19:16Z
  output: |
    106 passed (27.0s)
    __EXIT=0

- eval: E6
  run_id: minted-khung-va-giao-dien-E6-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-10T23:19:16Z
  output: |
    106 passed (27.0s)
    __EXIT=0

- eval: E7
  run_id: minted-khung-va-giao-dien-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-10T23:19:16Z
  output: |
    106 passed (27.0s)
    __EXIT=0

- eval: E8
  run_id: minted-khung-va-giao-dien-E8-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-10T23:19:16Z
  output: |
    106 passed (27.0s)
    __EXIT=0

- eval: E11
  run_id: minted-khung-va-giao-dien-E11-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-10T23:19:16Z
  output: |
    106 passed (27.0s)
    __EXIT=0

- eval: E13
  run_id: minted-khung-va-giao-dien-E13-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-10T23:19:16Z
  output: |
    106 passed (27.0s)
    __EXIT=0

- eval: E14
  run_id: minted-khung-va-giao-dien-E14-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-10T23:19:16Z
  output: |
    106 passed (27.0s)
    __EXIT=0

- eval: E3
  run_id: minted-khung-va-giao-dien-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:19:16Z
  output: |
    ================================================================================
    __EXIT=0

- eval: E4
  run_id: minted-khung-va-giao-dien-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:19:16Z
  output: |
    ================================================================================
    __EXIT=0

- eval: E9
  run_id: minted-khung-va-giao-dien-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:19:16Z
  output: |
    ================================================================================
    __EXIT=0

- eval: E10
  run_id: minted-khung-va-giao-dien-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:19:16Z
  output: |
    ================================================================================
    __EXIT=0

- eval: E12
  run_id: minted-khung-va-giao-dien-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:19:16Z
  output: |
    ================================================================================
    __EXIT=0

- eval: E17
  run_id: minted-khung-va-giao-dien-E17-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-10T23:19:16Z
  output: |
    __EXIT=0

- eval: E15
  run_id: minted-khung-va-giao-dien-E15-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-10T23:19:16Z
  screenshot: evidence/E15-step1.png
  observed: |
    step1: light, 1440x900. Sidebar with the OneHub logo and three items (Hôm nay, Bảng hàng, Đã gửi); Bảng hàng has a blue highlight. The header has a sidebar toggle and a theme icon. The page has an h1 "Bảng hàng". Matches expected.
    step2: dark. The background is near black and the text is white. The sidebar highlight is a dark grey and the label is readable. The logo wordmark "Hub" is dark on dark (low contrast), a minor point. The expected "đổi nền và chữ, đọc được" holds.
    step3: /proto/khung-va-giao-dien at 1440. h1 "Bản mẫu khung" with sections Định dạng (a table of nine rows), Màu trạng thái (two rows of six badges in amber, green, blue, blue, amber, red), Kênh thông báo (input and Lưu thử button), and Trạng thái toàn trang (links). No nav item is highlighted, which is fine. Matches expected.
    step4: 360x800. Header with toggle and theme icon. Centered title "Màn này chưa hiện được", a three-part paragraph, a blue "Thử lại" button. No horizontal scroll. Matches expected.
    step5: 360x800. The sidebar sheet is open over about 75 percent of the width, with the logo, three items and "Bảng hàng" highlighted; the right side is dimmed. Matches expected.
    step6: /no-such-page at 1440. Centered "Không tìm thấy trang", an explanation and a "Về trang đầu" button on a plain white page with no sidebar. Matches expected.
  network_observed: clean
  output: |
    step6 (404): h1 "Không tìm thấy trang", no sidebar (nav=false), "Về trang đầu" button.
    Network: every app-origin request returned 200 except the intended 404 for /no-such-page. There were no failed requests. The only console errors were the deliberate "prototype screen broken on purpose" error caught by the error boundary (step4) and the 404 resource log (step6). Both are expected.
    Note: a Next dev-overlay "1 Issue" badge shows in step4 (dev mode only, from the deliberate error). It does not obscure the content.

### Judgment

- eval: E16
  judged_by: judge panel (3 lens, fresh context)
  panel_proposal: FAIL
  rationale: Bốn nhóm câu (lỗi, không tìm thấy, hết phiên, băng lưu hỏng) đủ ba phần. Băng mất mạng `offline` chỉ có tiêu đề «Mất kết nối mạng» và «Thay đổi mới chưa lưu được cho tới khi có mạng lại.», nêu hậu quả nhưng không có bước làm tiếp. Không chuỗi nào trùng nhãn pref, lease hay alt trong labels.yaml.
  votes:
    - domain-correctness: FAIL — (a), (b), (c) đủ ba phần trong title, why, next. (d) không đạt: băng `offline` chỉ nói chuyện gì xảy ra và hậu quả, không có câu bảo người dùng làm gì tiếp; `saveFailedOffline` thì đủ ba phần. Cả bốn nhóm dùng «bạn» hoặc không xưng hô, không có dấu chấm than.
    - operational-feasibility: FAIL — (a), (b), (c) đủ ba phần. (d) chưa đủ: câu của băng `offline` nêu hậu quả, không nêu một việc người dùng nên làm. `saveFailedOffline` đủ ba phần. Không có dấu chấm than, không trùng nhãn pref, lease, alt.
    - spec-alignment: UNCERTAIN — (a), (b), (c) đủ ba phần; (d) băng lưu hỏng đủ, băng mất mạng chỉ có title và detail nêu hậu quả. Tiêu chí chưa nói rõ như vậy có tính là «làm gì tiếp» hay không.
  required_evidence:
    - Trong src/components/templates/frame-copy.ts, `FRAME_COPY.offline.detail` có một bước làm tiếp rõ ràng cho người dùng (ví dụ «Bạn cứ giữ màn này; khi có mạng lại, bạn bấm «Thử lại»»), hoặc có thêm trường `next` cho `offline`.
    - Hoặc một quyết định trong design/language.md (mục 5) hay design/states.md rằng băng `offline` là thông báo trạng thái, được miễn quy tắc ba phần của «Câu lỗi».
    - Hoặc chủ sản phẩm ghi trong design/language.md mục 5 hay hợp đồng AC-6 rằng băng mất mạng chỉ cần cả cụm title và detail nói được ba ý.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-khung-va-giao-dien-SUITE-make_check-r1
  exit_code: 2
  verified_at: 2026-11-10T23:19:16Z
  output: |
    2167:3    error    'log' is not defined    no-undef
    ✖ 200 problems (189 errors, 11 warnings)
    make: *** [lint] Error 1
    __EXIT=2

- cmd: npm run build
  run_id: minted-khung-va-giao-dien-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-10T23:19:16Z
  output: |
    __EXIT=0

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả code mới lẫn baseline, chứng minh khung kiểm chứ chưa chứng minh tính năng): E3, E4, E9, E10, E12 (lệnh `make test`) và E17 (sàn thiết kế bản S4). Cần viết lại để khẳng định hành vi mới, hoặc xác nhận đó là regression-guard có chủ ý.

Baseline không đo: E15 (ui-check, không chạy được trên baseline) ghi n-a. E16 là judgment nên không có baseline.

## Variance

none — mọi eval chạy một lần, không có eval nào ngẫu nhiên hay flaky.

## Iterations

Round 1: lệnh suite `make check` dừng ở lint (189 lỗi, 11 cảnh báo), không gắn eval nào; E16 chờ người quyết, panel đề xuất FAIL vì băng mất mạng thiếu bước làm tiếp. Trả về khâu cài đặt.
