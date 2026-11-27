---
schema_version: 2
feature_slug: khung-luoi-va-ngan-chi-tiet
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 03fa73bb763a24fb303086fe9242f610794242b0
human_signoff:
---

# Evidence Report: khung-luoi-va-ngan-chi-tiet

Vòng 6. Bốn eval chạy lại (E1, E7, E9, E18) đều đạt. Verdict vẫn là REJECT vì một lệnh suite không gắn eval nào đã đỏ: `DATABASE_URL= make e2e`. Một bài trình duyệt ở khổ 1440 («pha vùng loc-dau-cot: chỉ còn khung đầu») quá hạn 90 giây, nên bộ bài chung ở bốn khổ không xanh. Chi tiết ở mục Evidence, khối lệnh suite.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-1 | script | PASS (mang từ vòng 5) |
| E3 | AC-3 | script | PASS (mang từ vòng 5) |
| E4 | AC-2 | script | PASS (mang từ vòng 5) |
| E5 | AC-3 | script | PASS (mang từ vòng 5) |
| E6 | AC-4 | script | PASS (mang từ vòng 5) |
| E7 | AC-5 | script | PASS |
| E8 | AC-6 | script | PASS (mang từ vòng 4) |
| E9 | AC-7 | script | PASS |
| E10 | AC-8 | script | PASS (mang từ vòng 5) |
| E11 | AC-9 | script | PASS (mang từ vòng 4) |
| E12 | AC-10 | script | PASS (mang từ vòng 5) |
| E13 | AC-11 | script | PASS (mang từ vòng 5) |
| E14 | AC-11 | script | PASS (mang từ vòng 5; xem ghi chú ở mục Analyst) |
| E15 | AC-11 | script | PASS (mang từ vòng 5) |
| E16 | AC-11 | script | PASS (mang từ vòng 1) |
| E17 | AC-11 | script | PASS (mang từ vòng 5) |
| E18 | AC-1 | ui-check | PASS |
| E19 | AC-12 | judgment | PASS (đề xuất của hội đồng, có một phiếu phản đối; chờ người) |
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
  output: |
    20 passed (17.6s)

- eval: E7
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E7-r6
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T21:25:18Z
  output: |
    10 passed (11.2s)

- eval: E9
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E9-r6
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T21:25:18Z
  output: |
    8 passed (9.6s)

- eval: E18
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E18-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check.driver
  verified_at: 2026-11-27T21:25:18Z
  screenshot: evidence/E18-step1.png
  observed: |
    1440 light sau: record from top bar to bottom, white, with visible left edge and a grey gradient shadow on the grid side; truoc was a floating rounded card with a two-row head and text buttons. khong-tach light: no edge, no shadow, no tint - record merges into page, reads as not apart. 1440 dark sau: record flush top to bottom, surface equal to grid card (23) and lighter than page (10), a faint but visible left line, no visible shadow; stands apart by the line alone. khong-tach dark: same surface, no line - reads as not apart. Toolbar buttons icon-only and stop before the record; record head single line with link, pin, prev, next, close at right; no Bo ghim on the head. 1024 light/dark same. Phone 360/414: Loc with text, Luu goc nhin visible and larger, filter fields in the Loc sheet aligned; record head one line. Dark readable. Rest of the screens unchanged.
  network_observed: n-a (driver)
  output: |
    - Filter inputs aligned in same row (1440 sau). PASS
    - Dark readable at all sizes. PASS
    Caveat: dark left line is low contrast (46 vs 23); by eye it is a faint but present line.

- eval: E2
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E2-r5
  exit_code: 0
  verifier: tests/e2e/khung-luoi-nut.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E3-r5
  exit_code: 0
  verifier: tests/e2e/ghim-ngan.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E4-r5
  exit_code: 0
  verifier: tests/e2e/khung-luoi-nut.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E5-r5
  exit_code: 0
  verifier: tests/e2e/ho-so-can.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E6-r5
  exit_code: 0
  verifier: tests/e2e/ho-so-can.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E8-r4
  exit_code: 0
  verifier: tests/e2e/the-dien-thoai.spec.ts
  verified_at: 2026-11-27T17:13:33Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E10-r5
  exit_code: 0
  verifier: tests/e2e/khung-luoi-nut.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E11-r4
  exit_code: 0
  verifier: tests/e2e/sheet.spec.ts
  verified_at: 2026-11-27T17:13:33Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E12-r5
  exit_code: 0
  verifier: tests/e2e/khung-luoi-nut.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E13-r5
  exit_code: 0
  verifier: config:executors.script.check
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E14
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E14-r5
  exit_code: 0
  verifier: config:executors.script.e2e
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E15
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E15-r5
  exit_code: 0
  verifier: playwright.db.config.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E16
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E16-r1
  exit_code: 0
  verifier: git diff merge-base origin/main..HEAD -- src/components/ui src/components/reui
  verified_at: 2026-11-27T09:13:46Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E17
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E17-r5
  exit_code: 0
  verifier: config:executors.design.floor
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E20
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E20-r5
  exit_code: 0
  verifier: tests/e2e/khung-luoi-nut.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E21
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E21-r5
  exit_code: 0
  verifier: tests/e2e/khung-luoi-nut.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E22
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E22-r5
  exit_code: 0
  verifier: tests/e2e/khung-luoi-nut.spec.ts
  verified_at: 2026-11-27T20:57:08Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

### Judgment

- eval: E19
  judged_by: hội đồng ba góc nhìn (fresh context). Đề xuất của hội đồng: PASS. Có một phiếu phản đối, ghi đầy đủ dưới đây.
  votes:
    - domain-correctness: PASS — Bảng «Từng chỗ và cách làm» có các dòng Q1–Q4, A5, B3, L1–L6. Một dòng gộp B1, B2 và «…» sang sổ hành vi, và cột «Sau» của mỗi dòng khớp lời chủ kho, không thêm việc. Mục «Bộ nút theo quyền» của behaviors.md có luật «…» ba điểm và chuẩn nút ba câu, mỗi khối kèm «Duyệt…» và 2026-11-27. Dòng «Mở hồ sơ cạnh bảng» không còn cụm «đứng dưới thanh công cụ» hay «đầu hồ sơ hai dòng»; hai ý ấy chỉ còn dưới dạng «thay cách hàng 3a…» và «thay hai dòng của hàng 3e». Các câu (a)–(f) và các câu chi-nguoi chỉ nằm ở phần «Chưa quyết» hoặc «chưa phủ». Trang 0051 và phần đã làm không đụng tới chúng.
    - operational-feasibility: FAIL — Ý (2) và (3) đạt: behaviors.md có luật «…» ba điểm và chuẩn nút ba câu, mỗi khối kèm lời duyệt và ngày 2026-11-27, dòng «Mở hồ sơ cạnh bảng» đã sạch hai cụm cũ, và (a)–(f) không nằm trong phần đã làm. Ý (1) trượt: dòng Q4 của design.md ghi «Khi ngăn nổi» trong khi lời chủ kho ở bảng Nguồn là «khi ngăn mở» (0051 và behaviors.md ghi «nổi hay ghim»). Ngoài ra B1, B2 và luật «…» dồn chung một dòng, luật «…» không có dòng riêng.
    - spec-alignment: PASS — (1) Bảng «Từng chỗ và cách làm» có hàng cho Q1, Q2, Q3, Q4, A5, B3, L1–L6. B1, B2 và luật «…» gộp chung một hàng, và hàng đó nói rõ hai câu này ghi vào sổ hành vi rồi dựng ở hàng 3h. Cột «Sau» khớp lời chủ kho và không thêm việc nào ông không bảo. (2) Mục «Bộ nút theo quyền» của behaviors.md có luật «…» ba điểm và chuẩn nút ba câu, đúng nghĩa đoạn nguyên văn, mỗi khối ghi lời duyệt và ngày 2026-11-27. Dòng «Mở hồ sơ cạnh bảng» chỉ nhắc «đặt ngăn dưới thanh công cụ» và «hai dòng» như điều bị thay, không còn là luật hiện hành. (3) Các câu (a)–(f) và các câu chi-nguoi chỉ nằm ở mục «Chưa quyết» và «Chỗ chưa phủ» của design.md, không nằm ở phần đã làm của design.md, behaviors.md hay 0051. Lưu ý nhỏ: decisions.jsonl d-29 cho thấy chủ kho đã nhận các khuyến nghị Hỏi-1…10 ở Cổng Phạm vi, nên chữ «chưa quyết» trong design.md đã cũ. Điều này không làm các câu ấy lọt vào phần đã làm.
  required_evidence:
    - Dòng Q4 ở bảng «Từng chỗ và cách làm» của design.md (mục «Từng chỗ và cách làm») sửa «Khi ngăn nổi» thành «Khi ngăn mở cạnh lưới, nổi hay ghim», khớp lời «ngăn mở» ở bảng Nguồn, 0051 và behaviors.md. Có dòng này thì ý (1) hết chênh về Q4.
    - Bảng «Từng chỗ và cách làm» của design.md có dòng riêng cho B1, B2 và luật «…», mỗi dòng có cột «Sau» nói đúng điều ấy, thay cho dòng gộp «B1, B2, «…»». Cột «Sau» hiện chỉ ghi «Ghi vào sổ hành vi; dựng trong ngăn ở hàng 3h». Có các dòng này thì ý (1) đạt về «đúng một dòng».
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-khung-luoi-va-ngan-chi-tiet-SUITE-make_check-r6
  exit_code: 0
  verified_at: 2026-11-27T21:25:18Z

- cmd: npm run build
  run_id: minted-khung-luoi-va-ngan-chi-tiet-SUITE-build-r6
  exit_code: 0
  verified_at: 2026-11-27T21:25:18Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-khung-luoi-va-ngan-chi-tiet-SUITE-DATABASE_URL_make_e2e-r6
  exit_code: 2
  verified_at: 2026-11-27T21:25:18Z
  output: |
    1 failed, 1219 skipped, 1384 passed (12.3m).
    Bài hỏng: [1440] tools/e2e_templates/suite.ts:272 · cham · man inventory · vung · pha vung loc-dau-cot: chi con khung dau.
    Test timeout of 90000ms exceeded; thông điệp nhận được «mouse.wheel: Test timeout of 90000ms exceeded.» thay cho mẫu «loc-dau-cot: bo sot dong khop — ».
    gac-hydration: 0 canh bao.

## Known limits

## Ngoài hợp đồng

## Analyst

Không có eval nào được xác nhận là xanh ở cả code mới lẫn baseline: ba eval chạy lại ở vòng này (E1, E7, E9) không đo được baseline, nên chưa kết luận gì về tính phân biệt.

Eval không phân biệt (xanh cả hai phía): none — không eval nào có baseline green.

Baseline khong do
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E1: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E7: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E9: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi

Lệnh fail không gắn eval: `DATABASE_URL= make e2e` (mã thoát 2, không eval nào gắn). Đây là lý do của REJECT. Lưu ý mâu thuẫn cần người nhìn: E14 («make e2e», AC-11) đang mang PASS từ vòng 5, nhưng lần chạy `make e2e` thật của vòng 6 đỏ ở một bài timeout. Carry-forward của E14 dựa trên «delta không chạm paths», trong khi chính lệnh đó đã đổi kết quả. Bài hỏng là bài đo trên khổ 1440 chạm vùng lọc đầu cột, có dấu hiệu quá hạn do tải chứ chưa chứng minh là lỗi sản phẩm; cần chạy lại bài riêng lẻ để phân biệt flaky với lỗi thật.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: các eval đầu tiên chạy, E16 đạt và còn mang tới nay; các lỗi vòng đầu quay lại thi công.
Round 2 đến 4: sửa dần các eval khung lưới, ngăn nổi, nút và điện thoại; E8 và E11 đạt từ vòng 4. Lịch sử chi tiết xem run-log.jsonl.
Round 5: REJECT — E18 (giao diện tối), E1, E7, E9 mỗi eval một lần quá hạn. Quay lại thi công.
Round 6: REJECT — E1, E7, E9, E18 đạt; `make e2e` đỏ ở một bài quá hạn tại khổ 1440 (bài «pha vùng loc-dau-cot»). Đã vượt trần ba vòng (đã chấm sáu lượt): chuyển cho chủ kho quyết ở Cổng 2, gồm chạy lại bài hỏng riêng lẻ để xem có phải quá hạn do tải.
