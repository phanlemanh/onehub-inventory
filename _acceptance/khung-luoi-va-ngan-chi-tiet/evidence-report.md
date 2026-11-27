---
schema_version: 2
feature_slug: khung-luoi-va-ngan-chi-tiet
verdict: REJECT
failed_evals: ["E1","E7","E9","E18"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a1aa19c602ee35dfcad59d9fcd20ed89ace03eb0
human_signoff:
---

# Evidence Report: khung-luoi-va-ngan-chi-tiet

Vòng 5. Bốn eval đỏ: E1, E7, E9 (cả ba hết thời gian ở một khổ trên bộ bài trình duyệt) và E18 (phép nhìn nền tối). Mọi lệnh đỏ đều gắn với một eval, không có lệnh đỏ rời.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | FAIL |
| E2 | AC-1 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-2 | script | PASS |
| E5 | AC-3 | script | PASS |
| E6 | AC-4 | script | PASS |
| E7 | AC-5 | script | FAIL |
| E8 | AC-6 | script | PASS (mang từ vòng 4) |
| E9 | AC-7 | script | FAIL |
| E10 | AC-8 | script | PASS |
| E11 | AC-9 | script | PASS (mang từ vòng 4) |
| E12 | AC-10 | script | PASS |
| E13 | AC-11 | script | PASS |
| E14 | AC-11 | script | PASS |
| E15 | AC-11 | script | PASS |
| E16 | AC-11 | script | PASS (mang từ vòng 1) |
| E17 | AC-11 | script | PASS |
| E18 | AC-1 | ui-check | FAIL |
| E19 | AC-12 | judgment | PASS (hội đồng đề xuất, chờ người chốt) |
| E20 | AC-1 | script | PASS |
| E21 | AC-3 | script | PASS |
| E22 | AC-3 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E1-r5
  exit_code: 1
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    ho-so-can.spec.ts «E2 · the record floats beside the grid» — 19 passed, 20 skipped, 1 failed.
    Đỏ: [1024] «runs the whole height when the top bar is hidden» (21.4s): hết 5000ms chờ điều kiện ở dòng 422 (toBeLessThanOrEqual(2)).
    Các bài còn lại của E1 (cuộn giữ chỗ, nút bấm được, chiều đỏ) xanh ở 1024 và 1440.

- eval: E2
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E2-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    12 passed (50.7s)

- eval: E3
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E3-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    31 passed (1.2m)

- eval: E4
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E4-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    4 passed (35.5s)

- eval: E5
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E5-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    8 passed (44.2s)

- eval: E6
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E6-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    20 passed (44.5s)

- eval: E7
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E7-r5
  exit_code: 1
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    «44 px to press on a phone» — 9 passed, 6 skipped, 1 failed.
    Đỏ: [414] «every head, section head and foot button fits the size of its screen» (31.0s): hết 30000ms ở locator.count trong openFifth (ho-so-can.spec.ts dòng 70), trước khi đo nút.
    360, 1024 và 1440 xanh; các chiều đỏ ở 360 và 414 bắt được lỗi như mong đợi.

- eval: E8
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E8-r4
  exit_code: 0
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T17:13:33Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E9-r5
  exit_code: 1
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    khung-luoi-nut.spec.ts «L2 · the × of a dialog or sheet reads «Đóng»» — 7 passed, 1 failed.
    Đỏ: [414] «the filter sheet on a phone, the save-view dialog on a computer» (30.0s): hết 30000ms ở locator.click của phone-filter-button (dòng 47); nút đã tìm thấy nhưng chờ mãi «visible, enabled and stable».
    360, 1024 và 1440 xanh; bài chiều đỏ «Close» xanh ở cả bốn khổ.

- eval: E10
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E10-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    6 passed (44.5s)

- eval: E11
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E11-r4
  exit_code: 0
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T17:13:33Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E12-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    4 passed (11.2s)

- eval: E13
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E13-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-27T20:57:08Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E14
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E14-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-27T20:57:08Z
  output: |
    gac-hydration: 0 canh bao

- eval: E15
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E15-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    729 passed (19.6m)

- eval: E16
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E16-r1
  exit_code: 0
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T09:13:46Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E17
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E17-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-27T20:57:08Z
  output: |
    sàn thiết kế không báo màu hex thô

- eval: E18
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E18-r5
  exit_code: 1
  baseline: n-a
  verifier: ui-check:E18
  verified_at: 2026-11-27T20:57:08Z
  screenshot: evidence/E18-step1.png
  observed: |
    1440 sang sau: ngan tu thanh tren toi day, vien trai mong thay duoc + dai bong dan do sang cot cuoi cua luoi, nen ngan trang; khung khong-tach sang: ngan va luoi cung trang, khong vien khong bong -> khong tach (dung). 1440 toi sau: ngan nen 23 cung mau o luoi 23, ngan thay duoc chu yeu nho dong vien 1px; khong thay ngan sang hon luoi. 1440 toi khong-tach: ngan nen 10 toi hon luoi 23, nhin ra khoi tach ro, mau thuan yeu cau phai doc la khong tach. Truoc (main): ngan la the noi bo goc, dau ngan hai dong (Truoc/Sau/Dong), toolbar co chu 'Nhom theo Toa/Cot/Toan man hinh/Luu goc nhin', day khong cham nen nay thanh nut chi icon va ngan lap day chieu cao. 360 sau: toolbar 'Loc' co chu, 'Luu goc nhin' hien thang, khong con nut ba cham; ngan-loc 360: ngan duoi chua ma Loc; ngan 360 toi: dau mot dong, doc duoc. 1024 sang/toi: ngan phai tu top bar toi day, thanh cong cu dung truoc ngan, nut chi icon.
  network_observed: n-a (driver)
  output: |
    Đỏ ở hai phép đo nền tối. Nền sáng đạt: viền trái và dải bóng thấy được, khung khong-tach đọc là không tách. Nền tối sau: nền ngăn bằng nền lưới, chỉ còn viền và bóng rất nhẹ. Nền tối khong-tach: nền ngăn tối hơn lưới nên đọc là tách, ngược yêu cầu. Điện thoại và 1024 đạt.

- eval: E20
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E20-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    6 passed (13.1s)

- eval: E21
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E21-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    cùng lệnh với E20: 6 passed (13.1s)

- eval: E22
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E22-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    3 passed (14.1s)

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-khung-luoi-va-ngan-chi-tiet-SUITE-build-r5
  exit_code: 0
  verified_at: 2026-11-27T20:57:08Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên cả HEAD lẫn baseline):
- E17 (design-floor-s4.mjs): xanh trên cả hai phía, là chốt chặn hồi quy có chủ ý, không chứng minh hành vi mới.

Baseline khong do
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E1: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E2: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E3: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E4: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E5: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E6: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E7: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E9: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E10: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E12: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- make check: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E15: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E20: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E22: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi

## Judgment

Panel đề xuất cho E19 (AC-12): PASS. Để trống human_override cho người chốt ở Cổng 2.

- eval: E19
  judged_by: judge panel (fresh context, 3 lens)
  proposal: PASS
  votes:
    - domain-correctness: PASS — (1) Bảng «Từng chỗ và cách làm» có một dòng cho mỗi điều đã quyết: Q1, Q2, Q3, Q4, A5, B3, L1 đến L6. B1, B2 và luật «…» chung một dòng, cột «Sau» ghi «Ghi vào sổ hành vi», nên không thêm việc nào ngoài lời chủ kho. (2) Mục «Bộ nút theo quyền» của behaviors.md chép luật «…» ba điểm và chuẩn nút ba câu đúng nghĩa đoạn nguyên văn, mỗi khối kèm lời duyệt và ngày 2026-11-27. Dòng «Mở hồ sơ cạnh bảng» chỉ nhắc «dưới thanh công cụ» và «hai dòng» để nói đó là cách cũ bị thay. (3) Các câu (a)–(f) và các câu chi-nguoi của decisions.jsonl nằm ở phần «Chưa quyết» hoặc «Chỗ chưa phủ» của design.md và ở mục Later của contract, không lọt vào bảng trước/sau, behaviors.md hay trang 0051; những gì thêm vào đó (Hỏi-7, Hỏi-10) là điều chủ kho đã duyệt ở Cổng Phạm vi (d-29).
    - operational-feasibility: PASS — (1) Bảng có một dòng cho mỗi điều đã quyết (Q1–Q4, A5, B3, L1–L6); B1, B2 và luật «…» chung một dòng ghi vào sổ hành vi, cột «Sau» khớp lời nguyên văn. Dòng Q4 chỉ ghi «khi ngăn nổi» trong khi trang 0051 đã mở rộng sang ngăn ghim theo Hỏi-7; đó là lệch nhỏ và Hỏi-7 là câu chủ kho đã nhận ở Cổng Phạm vi. (2) Mục «Bộ nút theo quyền» của behaviors.md có luật «…» ba điểm và chuẩn nút ba câu đúng nghĩa đoạn nguyên văn, mỗi khối ghi lời duyệt và ngày 2026-11-27; dòng «Mở hồ sơ cạnh bảng» (dòng 94) không còn hai cụm cũ, chúng chỉ còn ở dòng 12 và dòng 52 của behaviors.md trong vế «thay …» nói về cách cũ. (3) Các câu (a)–(f) và các câu chi-nguoi của decisions.jsonl không nằm trong phần đã làm của design.md, behaviors.md hay 0051; design.md ghi rõ «Không câu nào trong số này nằm trong phần đã làm», còn Cột Căn và hai nút lưu nằm ở mục «chưa phủ».
    - spec-alignment: PASS — Bảng «Từng chỗ và cách làm» có một dòng cho mỗi điều đã quyết: Q1–Q4, A5, B3, «B1, B2, «…»» chung một dòng, và L1–L6. Cột «Sau» làm đúng lời nguyên văn và không thêm việc mới. Mục «Bộ nút theo quyền» của behaviors.md có luật «…» ba điểm và chuẩn nút ba câu, đúng nghĩa từng điểm, mỗi khối kèm lời duyệt và ngày 2026-11-27. Dòng «Mở hồ sơ cạnh bảng» (dòng 12) không còn «đứng dưới thanh công cụ» hay «đầu hồ sơ hai dòng»; hai cụm «thay cách hàng 3a đặt ngăn dưới thanh công cụ» và «thay hai dòng của hàng 3e» chỉ ghi điều bị thay. Các câu (a)–(f) chỉ nằm ở mục «Chưa quyết» và mục «Chỗ chưa phủ» của design.md, không có trong phần đã làm của design.md, behaviors.md hay trang 0051.
  human_override:  # chi nguoi ghi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E13 không có kết quả (agent bị bỏ qua) — chi tiết trong run-log. Returned to implementation.
Round 2: chạy lại make check và baseline — chi tiết trong run-log. Returned to implementation.
Round 3: REJECT — E13 lỗi kiểu, E14 và E15 đỏ khi máy tải nặng. Returned to implementation.
Round 4: toàn bộ eval chạy lại xanh trên máy rảnh (e2e 1374 passed, e2e-db 729 passed); E1, E3, E5, E6, E7, E16, E17, E18 mang sang từ vòng cũ.
Round 5: REJECT — E1 đỏ ở 1024 (ngăn không chạy hết chiều cao khi ẩn thanh trên, hết 5 giây), E7 và E9 đỏ ở 414 (hết 30 giây trước khi đo nút), E18 đỏ ở phép nhìn nền tối (nền ngăn bằng nền lưới; khung khong-tach tối đọc là tách). E8, E11, E16 mang sang. Returned to implementation.
