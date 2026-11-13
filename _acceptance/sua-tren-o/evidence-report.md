---
schema_version: 2
feature_slug: sua-tren-o
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 7fa8253b80ea5947e231e620a60bb2661c911d50
human_signoff: Manh Phan 2026-11-14
---

# Evidence Report: sua-tren-o

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E1b | AC-1 | judgment | PASS (đề xuất, chờ người) |
| E2 | AC-2 | test | PASS |
| E2-ui | AC-2 | ui-check | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E4-e2e | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E5-e2e | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E7-ui | AC-7 | ui-check | PASS |
| E8 | AC-8 | test | PASS |
| E8-e2e | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E10b | AC-10 | script | PASS |
| E10c | AC-10 | judgment | PASS (đề xuất, chờ người) |
| E11 | AC-2 | test | PASS |
| E12 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-sua-tren-o-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T14:36:01Z
  output: |
    npx vitest run src/modules/listings/edit-rules.test.ts src/modules/listings/save-door.test.ts src/components/candidate/use-change.test.tsx src/components/candidate/data-region-cell-edit.test.tsx
    lệnh gộp xanh (1 lần chạy, 1 lần đạt)

- eval: E4
  run_id: minted-sua-tren-o-E4-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T14:36:01Z
  output: |
    cùng lệnh gộp với E1, xanh

- eval: E5
  run_id: minted-sua-tren-o-E5-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T14:36:01Z
  output: |
    cùng lệnh gộp với E1, xanh

- eval: E7
  run_id: minted-sua-tren-o-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T14:36:01Z
  output: |
    cùng lệnh gộp với E1, xanh

- eval: E8
  run_id: minted-sua-tren-o-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T14:36:01Z
  output: |
    cùng lệnh gộp với E1, xanh

- eval: E2
  run_id: minted-sua-tren-o-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T14:36:01Z
  output: |
    npx playwright test tests/e2e/sua-tren-o.spec.ts tests/e2e/sheet.spec.ts tests/e2e/ho-so-can.spec.ts
    164 passed (1.5m)

- eval: E3
  run_id: minted-sua-tren-o-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T14:36:01Z
  output: |
    cùng lệnh playwright với E2, 164 passed (1.5m)

- eval: E4-e2e
  run_id: minted-sua-tren-o-E4-e2e-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T14:36:01Z
  output: |
    cùng lệnh playwright với E2, 164 passed (1.5m)

- eval: E5-e2e
  run_id: minted-sua-tren-o-E5-e2e-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T14:36:01Z
  output: |
    cùng lệnh playwright với E2, 164 passed (1.5m)

- eval: E6
  run_id: minted-sua-tren-o-E6-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T14:36:01Z
  output: |
    cùng lệnh playwright với E2, 164 passed (1.5m)

- eval: E8-e2e
  run_id: minted-sua-tren-o-E8-e2e-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T14:36:01Z
  output: |
    cùng lệnh playwright với E2, 164 passed (1.5m)

- eval: E9
  run_id: minted-sua-tren-o-E9-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T14:36:01Z
  output: |
    cùng lệnh playwright với E2, 164 passed (1.5m)

- eval: E11
  run_id: minted-sua-tren-o-E11-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T14:36:01Z
  output: |
    cùng lệnh playwright với E2, 164 passed (1.5m)

- eval: E10
  run_id: minted-sua-tren-o-E10-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_rao
  verified_at: 2026-11-13T14:36:01Z
  output: |
    npx vitest run tests/behavior-guard.test.ts, xanh

- eval: E10b
  run_id: minted-sua-tren-o-E10b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-13T14:36:01Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml

- eval: E12
  run_id: minted-sua-tren-o-E12-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T14:36:01Z
  output: |
    bước chấm khuôn: 12 tệp giao diện ngoài bản đồ

- eval: E2-ui
  run_id: minted-sua-tren-o-E2-ui-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.ui_check
  verified_at: 2026-11-13T14:36:01Z
  screenshot: evidence/E2-ui-step1.png
  observed: |
    Đã mở từng khung bằng Read. Ở 1440 sáng, ô Giá chào của căn 11.. (Đang bán) ở chế độ sửa, viền xanh, hiện «2,8 tỷ», thẻ ngay dưới ghi «Hiểu là: 2.800.000.000 ₫ (2,8 tỷ)» và «Enter ghi · Esc huỷ», thẻ che các ô hàng 3 và 4 chứ không che ô đang sửa.
    Sau Enter: ô hiện «2,8 tỷ», hết chế độ sửa, Xác nhận lúc đổi thành 21:36 13/11/2026, thông báo «Đã đổi Giá chào căn 1101: 2,8 tỷ.» có «Hoàn tác». Khung tối cùng bố cục, dễ đọc. Ở 1024 ô sửa và thẻ nằm gọn trong khung, cột Xác nhận lúc nằm ngoài màn hình (cuộn ngang) nên không thấy, đây chỉ là ghi chú. Cả 8 khung khớp nhau, ô đang sửa không bị che.
  network_observed: clean

- eval: E7-ui
  run_id: minted-sua-tren-o-E7-ui-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.ui_check
  verified_at: 2026-11-13T14:36:01Z
  screenshot: evidence/E7-ui-step1.png
  observed: |
    Đã mở 4 khung (1440 sáng, 1440 sáng sau 10 giây, 1024 tối, 1024 tối sau 10 giây). Dải cam báo mất mạng ở trên cùng, ô Giá chào của căn 1101 hiện «2,8 tỷ», thông báo góc dưới phải «Chưa hoàn tác được vì mất kết nối mạng. Căn 1101 vẫn là 2,8 tỷ; có mạng lại thì bấm «Thử lại».» kèm nút «Thử lại».
    Sau 10 giây thông báo vẫn còn và ô vẫn là 2,8 tỷ. Bốn khung còn lại (1440 tối, 1024 sáng) không mở riêng, chỉ đối chiếu qua các khẳng định văn bản DOM giống hệt. Khớp với Expected: thông báo đứng yên, nêu đúng căn và giá, có Thử lại, ô khớp lời báo.
  network_observed: clean

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-sua-tren-o-SUITE-build-r4
  exit_code: 0
  verified_at: 2026-11-13T14:36:01Z

- cmd: make e2e
  run_id: minted-sua-tren-o-SUITE-make_e2e-r4
  exit_code: 0
  verified_at: 2026-11-13T14:36:01Z

### Judgment (đề xuất của hội đồng, người quyết ở Cổng 2)

- eval: E1b
  judged_by: judge panel (fresh context), đề xuất PASS
  votes:
    - domain-correctness: PASS — edit-rules.ts chứa đủ luật (readPrice, PRICE_SWING_ASK và priceAsksAgain, STATUS_NEXT cùng canMove/nextStatuses/statusUndoable, statusNeeds, priceLocked/statusLocked), index.ts xuất lại; listing-cell-edit.tsx chỉ gọi. Lưu ý nhỏ: danh sách lý do rút lấy từ WITHDRAWN_REASON_ORDER trong cell-edit-copy, nằm ngoài input nên chưa kiểm được; đó không phải nấc hay ngưỡng nên không đổi kết luận.
    - operational-feasibility: PASS — mọi luật ở edit-rules.ts, giao diện chỉ gọi; hai chỗ còn lại (Math.round hiển thị ở dòng 136, needs.length > 0) chỉ là trình bày. Hai tệp candidate chung chung chỉ đọc row.locked.
    - spec-alignment: PASS — giao diện không viết luật nào; dòng 136 chỉ làm tròn để hiển thị, nhánh dòng 328-351 chạy theo statusNeeds. WITHDRAWN_REASON_ORDER ở cell-edit-copy nằm ngoài input, chưa kiểm.
  human_override: "Đạt — Manh Phan 2026-11-14"

- eval: E10c
  judged_by: judge panel (fresh context), đề xuất PASS
  votes:
    - domain-correctness: PASS — không có dòng gate1 trả lời Hỏi-2 nên theo khuyến nghị: ba lý do, không «Khác». labels.yaml đủ nhãn, không nhãn nào quá 17 ký tự; glossary ghi WithdrawnReason là khái niệm riêng, RESO DD 2.1 không có trường này.
    - operational-feasibility: PASS — cùng căn cứ: đủ WithdrawnReason, WithdrawnSoldElsewhere (16, biến thể thuê 17), WithdrawnOwnerChangedMind (9), WithdrawnUnreachable (12); glossary có dòng WithdrawnReason là khái niệm riêng.
    - spec-alignment: PASS — đủ nhãn theo Hỏi-2 theo khuyến nghị dòng 13, không nhãn nào quá 17 ký tự, glossary ghi khái niệm riêng.
  human_override: "Đạt — Manh Phan 2026-11-14"

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Baseline khong do: evals.yaml không đổi từ lần đo baseline cuối (round 1); mọi block eval ghi baseline n-a.

Eval không phân biệt (pass trên cả HEAD lẫn baseline, chứng minh harness chứ không phải tính năng), nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý:

- E10: npx vitest run tests/behavior-guard.test.ts --coverage.enabled=false --reporter=verbose
- E12: bước chấm khuôn design-floor-khuon.mjs --kiem --root .

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: carried, lịch sử chi tiết nằm trong các vòng trước.
Round 2: carried.
Round 3: cap of 3 rounds reached, báo cáo và thẻ cổng bằng chứng đã lập.
Round 4: mọi eval máy xanh (164 e2e, 989 trong make e2e, make check, build); E1b và E10c chờ người, verdict PENDING-JUDGMENT.

### Re-pin lần 1 — 2026-11-13, do gộp nhánh chính có hàng 9b trước khi gộp PR 52
run_id: repin-20261113T231140Z-15817
sha: 7fa8253b80ea5947e231e620a60bb2661c911d50 · suites: 3 lệnh exit 0 · evals: 16/16 eval máy đạt kỳ vọng · ngoài làn máy: E1b (E1b không khai paths), E2-ui, E7-ui, E10c (E10c không khai paths)
