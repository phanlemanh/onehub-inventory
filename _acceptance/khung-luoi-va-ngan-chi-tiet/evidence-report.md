---
schema_version: 2
feature_slug: khung-luoi-va-ngan-chi-tiet
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e9d9acd8a540391c31e93bb5fd9fc0a2880e709a
human_signoff:
---

# Evidence Report: khung-luoi-va-ngan-chi-tiet

Vòng 7. Ba lệnh suite chạy mới ở vòng này đều xanh. Các eval còn lại mang từ vòng trước vì delta không chạm paths của chúng.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS (mang từ vòng 6) |
| E2 | AC-1 | script | PASS (mang từ vòng 5) |
| E3 | AC-3 | script | PASS (mang từ vòng 5) |
| E4 | AC-2 | script | PASS (mang từ vòng 5) |
| E5 | AC-3 | script | PASS (mang từ vòng 5) |
| E6 | AC-4 | script | PASS (mang từ vòng 5) |
| E7 | AC-5 | script | PASS (mang từ vòng 6) |
| E8 | AC-6 | script | PASS (mang từ vòng 4) |
| E9 | AC-7 | script | PASS (mang từ vòng 6) |
| E10 | AC-8 | script | PASS (mang từ vòng 5) |
| E11 | AC-9 | script | PASS (mang từ vòng 4) |
| E12 | AC-10 | script | PASS (mang từ vòng 5) |
| E13 | AC-11 | script | PASS (mang từ vòng 5) |
| E14 | AC-11 | script | PASS (mang từ vòng 5) |
| E15 | AC-11 | script | PASS (mang từ vòng 5) |
| E16 | AC-11 | script | PASS (mang từ vòng 1) |
| E17 | AC-11 | script | PASS (mang từ vòng 5) |
| E18 | AC-1 | ui-check | PASS (mang từ vòng 6) |
| E19 | AC-12 | judgment | PASS |
| E20 | AC-1 | script | PASS (mang từ vòng 5) |
| E21 | AC-3 | script | PASS (mang từ vòng 5) |
| E22 | AC-3 | script | PASS (mang từ vòng 5) |

## Evidence

- eval: E1
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E1-r6
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T21:25:18Z
  carried_from_round: 6
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E2-r5
  exit_code: 0
  baseline: n-a
  verifier: tests/e2e/khung-luoi-nut.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E3-r5
  exit_code: 0
  baseline: n-a
  verifier: tests/e2e/ghim-ngan.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E4-r5
  exit_code: 0
  baseline: n-a
  verifier: tests/e2e/khung-luoi-nut.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E5-r5
  exit_code: 0
  baseline: n-a
  verifier: tests/e2e/ho-so-can.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E6-r5
  exit_code: 0
  baseline: n-a
  verifier: tests/e2e/ho-so-can.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E7-r6
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T21:25:18Z
  carried_from_round: 6
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: tests/e2e/the-dien-thoai.spec.ts
  verified_at: 2026-11-27T17:13:33Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E9-r6
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T21:25:18Z
  carried_from_round: 6
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E10-r5
  exit_code: 0
  baseline: n-a
  verifier: tests/e2e/khung-luoi-nut.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E11-r4
  exit_code: 0
  baseline: n-a
  verifier: tests/e2e/sheet.spec.ts
  verified_at: 2026-11-27T17:13:33Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E12-r5
  exit_code: 0
  baseline: n-a
  verifier: tests/e2e/khung-luoi-nut.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E13-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E14
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E14-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E15
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E15-r5
  exit_code: 0
  baseline: n-a
  verifier: playwright.db.config.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E16
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E16-r1
  exit_code: 0
  baseline: n-a
  verifier: git diff merge-base origin/main..HEAD -- src/components/ui src/components/reui
  verified_at: 2026-11-27T09:13:46Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E17
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E17-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E18
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E18-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check.driver
  verified_at: 2026-11-27T21:25:18Z
  carried_from_round: 6
  screenshot: evidence/E18-step1.png
  observed: |
    1440 light sau: record from top bar to bottom, white, with visible left edge and a grey gradient shadow on the grid side; truoc was a floating rounded card with a two-row head and text buttons. khong-tach light: no edge, no shadow, no tint - record merges into page, reads as not apart. 1440 dark sau: record flush top to bottom, surface equal to grid card (23) and lighter than page (10), a faint but visible left line, no visible shadow; stands apart by the line alone. khong-tach dark: same surface, no line - reads as not apart. Toolbar buttons icon-only and stop before the record; record head single line with link, pin, prev, next, close at right; no Bo ghim on the head. 1024 light/dark same. Phone 360/414: Loc with text, Luu goc nhin visible and larger, filter fields in the Loc sheet aligned; record head one line. Dark readable. Rest of the screens unchanged.
  network_observed: n-a (driver)
  note: carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E20
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E20-r5
  exit_code: 0
  baseline: n-a
  verifier: tests/e2e/khung-luoi-nut.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E21
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E21-r5
  exit_code: 0
  baseline: n-a
  verifier: tests/e2e/khung-luoi-nut.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E22
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E22-r5
  exit_code: 0
  baseline: n-a
  verifier: tests/e2e/khung-luoi-nut.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

### Judgment

- eval: E19
  judged_by: hội đồng ba góc nhìn (panel giữ nguyên từ round 6 — inputs không đổi, không chấm lại; rationale xem round đó)
  verdict: PASS
  rationale: Đề xuất PASS của hội đồng; một góc nhìn bất đồng, hiển thị đầy đủ dưới đây.
  votes:
    - domain-correctness: PASS (r6)
    - operational-feasibility: FAIL (r6)
    - spec-alignment: PASS (r6)
  dissent_operational-feasibility:
    - Dòng Q4 ở bảng «Từng chỗ và cách làm» của design.md (mục «Từng chỗ và cách làm») sửa «Khi ngăn nổi» thành «Khi ngăn mở cạnh lưới, nổi hay ghim», khớp lời «ngăn mở» ở bảng Nguồn, 0051 và behaviors.md. Có dòng này thì ý (1) hết chênh về Q4.
    - Bảng «Từng chỗ và cách làm» của design.md có dòng riêng cho B1, B2 và luật «…», mỗi dòng có cột «Sau» nói đúng điều ấy, thay cho dòng gộp «B1, B2, «…»». Cột «Sau» hiện chỉ ghi «Ghi vào sổ hành vi; dựng trong ngăn ở hàng 3h». Có các dòng này thì ý (1) đạt về «đúng một dòng».
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-khung-luoi-va-ngan-chi-tiet-SUITE-make_check-r7
  exit_code: 0
  verified_at: 2026-11-27T21:45:09Z

- cmd: npm run build
  run_id: minted-khung-luoi-va-ngan-chi-tiet-SUITE-build-r7
  exit_code: 0
  verified_at: 2026-11-27T21:45:09Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-khung-luoi-va-ngan-chi-tiet-SUITE-DATABASE_URL_make_e2e-r7
  exit_code: 0
  verified_at: 2026-11-27T21:45:09Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 6 — baseline khong do lai round nay

Baseline khong do: round này không đo lại baseline (evals.yaml không đổi từ lần đo cuối, round 6); mọi block eval ghi baseline n-a.

Eval không phân biệt: none

## Variance

none — every multi-run eval is uniform

## Iterations

Round 5: REJECT — nền tối của E18 chưa đạt; E1, E7, E9 mỗi bài một lần quá giờ. Trả về triển khai.
Round 6: REJECT — mọi eval đạt, E18 gồm; một ca bài chung bị quá giờ. Trả về triển khai.
Round 7: PASS — make check, npm run build, make e2e xanh trên bản e9d9acd8; các eval còn lại mang từ vòng trước.
