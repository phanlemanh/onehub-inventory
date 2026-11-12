---
schema_version: 2
feature_slug: bang-hang-ban-doc
verdict: REJECT
failed_evals: ["E3","E14"]
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 62818c0d0bac72046d3916ad6ad77ea7f0e72779
human_signoff:
---

# Evidence Report: bang-hang-ban-doc

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | script | FAIL |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | ui-check | PASS |
| E11 | AC-10 | judgment | UNCERTAIN |
| E12 | AC-6 | test | PASS |
| E13 | AC-11 | test | PASS |
| E14 | AC-11 | script | FAIL |
| E15 | AC-7 | script | PASS |

Ghi chú về hai eval đỏ: E3 và E14 cùng chạy bằng lệnh `make e2e`, và lệnh này kết thúc đỏ (một ca hỏng, 638 ca xanh, 409 ca bỏ qua). Ca hỏng duy nhất là `tests/e2e/behavior.spec.ts:219` «no serious accessibility violations» ở khổ 1024: trạng thái «light closed» báo luật `scrollable-region-focusable`. Các ca `tests/e2e/screens/screens.spec.ts` ở khổ 1440 trong phần đuôi log đều xanh; lệnh được gán cho cả hai eval nên cả hai bị tính đỏ. Lệnh này không có nội dung nào gán riêng cho từng eval, cần người xem xét khi sửa.

Lệnh fail không gắn eval: không có (mọi lệnh fail đều đã gắn eval: `make e2e` → E3, E14).

## Evidence

- eval: E1
  run_id: minted-bang-hang-ban-doc-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:10:45Z
  output: |
    cmd: make test (1 lần chạy, 1 lần xanh)
    ...
    ================================================================================

- eval: E2
  run_id: minted-bang-hang-ban-doc-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:10:45Z
  output: |
    cmd: make test (1 lần chạy, 1 lần xanh)
    ================================================================================

- eval: E3
  run_id: minted-bang-hang-ban-doc-E3-r1
  exit_code: 2
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T03:10:45Z
  output: |
    cmd: make e2e (1 lần chạy, 0 lần xanh)
    ✓ 1047 [1440] › screens.spec.ts:70:5 › cham › vung hieu-chuan › mo lai cung trang khong do lai ham cpu
    1) [1024] › tests/e2e/behavior.spec.ts:219:3 › behavior › no serious accessibility violations
       Received: "light closed": ["scrollable-region-focusable"]
    1 failed, 409 skipped, 638 passed (5.3m)
    make: *** [e2e] Error 1

- eval: E4
  run_id: minted-bang-hang-ban-doc-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-12T03:10:45Z
  output: |
    cmd: npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose (1 lần chạy, 1 lần xanh)

- eval: E5
  run_id: minted-bang-hang-ban-doc-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-12T03:10:45Z
  output: |
    cmd: npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose (1 lần chạy, 1 lần xanh)

- eval: E6
  run_id: minted-bang-hang-ban-doc-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:10:45Z
  output: |
    cmd: make test (1 lần chạy, 1 lần xanh)

- eval: E7
  run_id: minted-bang-hang-ban-doc-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:10:45Z
  output: |
    cmd: make test (1 lần chạy, 1 lần xanh)

- eval: E8
  run_id: minted-bang-hang-ban-doc-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:10:45Z
  output: |
    cmd: make test (1 lần chạy, 1 lần xanh)

- eval: E9
  run_id: minted-bang-hang-ban-doc-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:10:45Z
  output: |
    cmd: make test (1 lần chạy, 1 lần xanh)

- eval: E10
  run_id: minted-bang-hang-ban-doc-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-12T03:10:45Z
  screenshot: evidence/E10-step2.png   # tám khung E10-step2..E10-step9 (1440, 1024, 414, 360; sáng rồi tối)
  observed: |
    1440 sáng/tối: App Shell (thanh trái, mục Bảng hàng + Theo trạng thái), tiêu đề "Bảng hàng", khung "Hàng", ô tìm có kính lúp "Gõ để tìm" và "60 dòng", cột # rồi tám cột Căn, Toà, Dự án, Trạng thái, Giá chào, Diện tích, Phòng ngủ, Xác nhận lúc đều đọc được, kẻ dọc giữa cột, badge trạng thái màu; không thanh cuộn ngang; chỉ thanh cuộn dọc trong lưới; chân bảng nằm dưới màn chụp. Tối: nền đen, chữ trắng, badge vẫn rõ. 1024 sáng/tối: cùng bố cục, Dự án bị cắt "Vinhomes Ocean Pa…", cột Giá chào bị cắt ở mép phải (lưới cuộn ngang trong vùng), trang không cuộn ngang, không chồng chữ; tối đọc được. 414 và 360 sáng/tối: sidebar thu, tiêu đề "Bảng hàng", khung "Hàng", ô tìm + "60 dòng" xếp dòng riêng, lưới hiện #, Căn, Toà, Dự án (cắt) và cuộn ngang trong khung, chân bảng "60 dòng" thấy rõ, không chữ chồng chữ, trang không cuộn ngang; tối đổi nền/chữ và vẫn đọc được. Khớp Expected.
  network_observed: clean   # raw status trong evidence/E10-network.txt
  output: |
    GET /inventory ở cả 4 khổ đạt; 8 tên cột có trong DOM ở cả 4 khổ; "60 dòng" xuất hiện hai lần (hàng tìm và chân bảng); trang không cuộn ngang ở 1440/1024/414/360; ở 414/360 lưới cuộn ngang trong vùng của nó; nền sáng/tối khác nhau và chữ đọc được; không phản hồi lỗi, không yêu cầu hỏng.
    Chân "60 dòng" nằm dưới màn chụp ở 1440/1024 (xác nhận bằng DOM), thấy rõ ở 414/360. Ở 1024 lưới cuộn ngang trong vùng (Giá chào bị cắt), Expected không đòi.

- eval: E12
  run_id: minted-bang-hang-ban-doc-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:10:45Z
  output: |
    cmd: make test (1 lần chạy, 1 lần xanh)

- eval: E13
  run_id: minted-bang-hang-ban-doc-E13-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:10:45Z
  output: |
    cmd: make test (1 lần chạy, 1 lần xanh)

- eval: E14
  run_id: minted-bang-hang-ban-doc-E14-r1
  exit_code: 2
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T03:10:45Z
  output: |
    cmd: make e2e (1 lần chạy, 0 lần xanh; cùng lần chạy với E3)
    1 failed, 409 skipped, 638 passed (5.3m)
    make: *** [e2e] Error 1

- eval: E15
  run_id: minted-bang-hang-ban-doc-E15-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-12T03:10:45Z
  output: |
    node design-floor-khuon.mjs --kiem --root .
    10 tệp giao diện ngoài bản đồ

### Judgment (đề xuất, chờ người)

- eval: E11
  judged_by: panel đề xuất 3 judge (fresh context)
  verdict: UNCERTAIN
  rationale: Ba judge đều UNCERTAIN. Bốn ảnh có đầu màn «Bảng hàng», đầu cột đọc được, chữ không chồng nhau, ảnh tối đủ tương phản, nhưng không ảnh nào cho thấy tên khu dài bị cắt bằng dấu chấm lửng.
  votes:
    - domain-correctness: UNCERTAIN — Ở 1440 chỉ có «Vinhomes Ocean Park 1» hiện đủ chữ, còn ở 360 «Vinhomes (» bị cạnh vùng cuộn cắt cụt, không có «…».
    - operational-feasibility: UNCERTAIN — Ở 1440 chỉ hiện 26 dòng đầu, toàn «Vinhomes Ocean Park 1» đọc đủ. Ở 360 «Vinhomes C» bị mép khung cuộn cắt cứng, không có «…», và cột Dự án chưa hiện hết.
    - spec-alignment: UNCERTAIN — Ở 360 chỉ thấy #, Căn, Toà, Dự án (phần còn lại do cuộn ngang); «Vinhomes C» bị cắt cụt ở mép khung cuộn chứ không phải trong ô, không có «…», nên không có căn cứ xác nhận trạng thái chữ dài.
  required_evidence:
    - Ảnh 1440 (sáng hoặc tối) của /inventory đã cuộn tới hoặc tìm ra dòng «Vinhomes Ocean Park 2 – The Empire», cho thấy ô «Dự án» bị cắt bằng dấu chấm lửng và không chồng sang cột «Trạng thái». Lấy từ bước ui-check chụp lại trong _acceptance/bang-hang-ban-doc/evidence/.
    - Ảnh 360 cùng kiểu, có dòng khu dài đó trong khung và đầu cột «Dự án» đọc được, chụp sau khi cuộn ngang tới cột này. Nếu không chụp được thì design.md phải ghi rõ ảnh tĩnh ở 360 không chứng được dấu chấm lửng.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bang-hang-ban-doc-SUITE-make_check-r1
  exit_code: 0
  verified_at: 2026-11-12T03:10:45Z

- cmd: npm run build
  run_id: minted-bang-hang-ban-doc-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-12T03:10:45Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline, chứng minh harness chứ chưa chứng minh feature; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- `make test`: E1, E2, E6, E7, E8, E9, E12, E13
- `npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose`: E4, E5
- `design-floor-khuon.mjs --kiem --root .`: E15

Eval E10 (ui-check): baseline n-a. Eval E3, E14: baseline red (phân biệt được).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E3, E14 failed — `make e2e` đỏ ở một ca trợ năng `behavior.spec.ts:219` khổ 1024 (luật scrollable-region-focusable, trạng thái «light closed»); E11 còn UNCERTAIN chờ người (thiếu ảnh chữ dài bị cắt bằng «…»). Returned to implementation.
