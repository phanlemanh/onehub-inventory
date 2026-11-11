---
schema_version: 2
feature_slug: so-do-moi-vong
verdict: REJECT
failed_evals: ["E1","E2","E3","E4","E5","E6","E7","E8"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a60b0a0ebada0ced680c23bb661ccfb8635ee374
human_signoff:
---

# Evidence Report: so-do-moi-vong

Vòng 5. Lệnh `make test` thoát khác 0 vì đúng một bài hết giờ: bài `kiem-moc: mốc thật xanh và sáu lần phá` (thuộc E8) chạy quá 5000ms. Cả 318 bài còn lại đạt (27 tệp xanh, 1 tệp đỏ). Tám eval E1-E8 cùng gắn vào lệnh này nên cùng bị ghi là rớt theo kết quả của lệnh. E9 là mục phán xét: hội đồng đề xuất FAIL, chưa có người quyết.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | FAIL |
| E2 | AC-2 | test | FAIL |
| E3 | AC-3 | test | FAIL |
| E4 | AC-4 | test | FAIL |
| E5 | AC-5 | test | FAIL |
| E6 | AC-6 | test | FAIL |
| E7 | AC-7 | test | FAIL |
| E8 | AC-8 | test | FAIL |
| E9 | AC-9 | judgment | đề xuất FAIL, chờ người quyết ở Cổng 2 |

## Evidence

- eval: E1
  run_id: minted-so-do-moi-vong-E1-r5
  exit_code: 2
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T03:00:32Z
  output: |
    Test Files  1 failed | 27 passed (28)
    Tests  1 failed | 318 passed (319)
    Lệnh dùng chung make test dừng vì bài kiem-moc hết giờ; không có bài ghi nào báo lỗi.

- eval: E2
  run_id: minted-so-do-moi-vong-E2-r5
  exit_code: 2
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T03:00:32Z
  output: |
    Test Files  1 failed | 27 passed (28)
    Tests  1 failed | 318 passed (319)
    Lệnh dùng chung make test dừng vì bài kiem-moc hết giờ.

- eval: E3
  run_id: minted-so-do-moi-vong-E3-r5
  exit_code: 2
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T03:00:32Z
  output: |
    Test Files  1 failed | 27 passed (28)
    Tests  1 failed | 318 passed (319)
    Lệnh dùng chung make test dừng vì bài kiem-moc hết giờ.

- eval: E4
  run_id: minted-so-do-moi-vong-E4-r5
  exit_code: 2
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T03:00:32Z
  output: |
    Test Files  1 failed | 27 passed (28)
    Tests  1 failed | 318 passed (319)
    Lệnh dùng chung make test dừng vì bài kiem-moc hết giờ.

- eval: E5
  run_id: minted-so-do-moi-vong-E5-r5
  exit_code: 2
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T03:00:32Z
  output: |
    Test Files  1 failed | 27 passed (28)
    Tests  1 failed | 318 passed (319)
    Lệnh dùng chung make test dừng vì bài kiem-moc hết giờ.

- eval: E6
  run_id: minted-so-do-moi-vong-E6-r5
  exit_code: 2
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T03:00:32Z
  output: |
    Test Files  1 failed | 27 passed (28)
    Tests  1 failed | 318 passed (319)
    Lệnh dùng chung make test dừng vì bài kiem-moc hết giờ.

- eval: E7
  run_id: minted-so-do-moi-vong-E7-r5
  exit_code: 2
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T03:00:32Z
  output: |
    Test Files  1 failed | 27 passed (28)
    Tests  1 failed | 318 passed (319)
    Lệnh dùng chung make test dừng vì bài kiem-moc hết giờ.

- eval: E8
  run_id: minted-so-do-moi-vong-E8-r5
  exit_code: 2
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T03:00:32Z
  output: |
    FAIL  tools/round_metrics/round-metrics.test.ts > kiem-moc > kiem-moc: mốc thật xanh và sáu lần phá
    Error: Test timed out in 5000ms.
    tools/round_metrics/round-metrics.test.ts (18 tests | 1 failed) 10304ms
    Tests  1 failed | 318 passed (319)

### Judgment

- eval: E9
  judged_by: hội đồng ba góc nhìn (fresh context)
  proposal: FAIL (đề xuất, chưa có người quyết)
  panel:
    - domain-correctness: FAIL — Mục (1) khớp: ba tệp agent chép đúng câu giao. Mục (3) khớp: bảng có 11 Giống, 10 Lệch ở 21 dòng bắt buộc và 23 Giống, 29 Lệch toàn bảng, đúng với moc.json. Mục (2) có lệch: dòng 20 (ghi chú «luật 3 bỏ» trái với luật 3 còn nguyên trong de-bai), dòng 23 (Giống dù Agent 2 bỏ FramePanel p-0 và «không Card», trong khi dòng 49 xếp Lệch cho cùng kiểu bỏ sót), và dòng 1, 6 (Giống dù có phần chỉ một hoặc hai agent nêu).
    - operational-feasibility: FAIL — Phần (1) và (3) khớp: câu giao trong ba tệp agent trùng đề bài, số đếm 11/0/10 và 23/0/29 khớp các dòng bảng và moc.json. Phần (2) có chỗ lệch: dòng 23 xếp Giống dù Agent 2 bỏ một phần mà hai agent kia nêu, trái luật 1 của de-bai-ba-agent.md và không nhất quán với dòng 49.
    - spec-alignment: UNCERTAIN — (1) Câu giao trong ba tệp agent trùng nguyên văn với de-bai-ba-agent.md. (3) Các số khớp: 21 dòng bắt buộc có 11 Giống và 10 Lệch, toàn bảng 52 dòng có 23 Giống, 29 Lệch và 0 mang lỗi. (2) Dòng 20 (điện thoại) ghi Giống dù Agent 2 ghim cột Họ tên mà hai agent kia không ghim, lý do ghi là «luật 3 bỏ»; cách hiểu «luật 3» trong so-sanh.md mâu thuẫn với de-bai-ba-agent.md nên không xác định được dòng 20 đúng hay sai.
  required_evidence:
    - Một dòng bổ sung trong de-bai-ba-agent.md (hoặc phần mở đầu so-sanh.md) nêu rõ chủ kho cho phép dòng 1, 6, 23 ghi Giống dù có phần chỉ một số agent nêu, thống nhất với việc dòng 49 vẫn ghi Lệch vì «không nêu»; nếu không có thì dòng 23 phải đổi thành Lệch.
    - Sửa ghi chú dòng 20 và đoạn đầu so-sanh.md cho khớp với luật 3 hiện có trong de-bai-ba-agent.md (luật 3 là «không tính lại ở dòng khác», vẫn còn hiệu lực), hoặc sửa luật trong de-bai-ba-agent.md nếu thật sự đổi luật.
    - Nếu dòng 23 chuyển thành Lệch thì toàn bảng thành 22 Giống, 30 Lệch; cập nhật so-sanh.md (mục «Đếm kết quả», «Điều thấy được») và moc.json (ket_qua.toan_bang) cho khớp.
    - Phán quyết cho dòng 20 theo luật đã thống nhất; nếu luật «không tính lại» đã bỏ thì dòng 20 là Lệch, kéo 11/10 thành 10/11 và 23/29 thành 22/30, đồng thời xét lại dòng 1.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-so-do-moi-vong-SUITE-make_check-r5
  exit_code: 0
  verified_at: 2026-11-11T03:00:32Z

- cmd: npm run build
  run_id: minted-so-do-moi-vong-SUITE-build-r5
  exit_code: 0
  verified_at: 2026-11-11T03:00:32Z

- cmd: make e2e
  run_id: minted-so-do-moi-vong-SUITE-make_e2e-r5
  exit_code: 0
  verified_at: 2026-11-11T03:00:32Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval không phân biệt (pass trên cả HEAD lẫn baseline, chứng minh harness chứ không phải feature): lệnh `make test` gắn với E1, E2, E3, E4, E5, E6, E7, E8. Nên viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 5: E1-E8 failed — lệnh make test dừng vì bài kiem-moc (E8) hết giờ 5000ms; 318 bài còn lại đạt; E9 hội đồng đề xuất FAIL về dòng 20, 23, 1, 6 của bảng so lệch. Returned to implementation.
Các round trước: xem run-log.jsonl.
