---
schema_version: 2
feature_slug: khung-luoi-va-ngan-chi-tiet
verdict: REJECT
failed_evals: ["E13","E14","E15"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 3ab4277edd1f3b741ff1293efdb6204ae2b3d80b
human_signoff:
---

# Evidence Report: khung-luoi-va-ngan-chi-tiet

Round 3. Ba eval đỏ: E13 (make check), E14 (make e2e), E15 (bài trình duyệt có đăng nhập trên Postgres). Các eval tính năng E1–E12, E17, E18, E20–E22 xanh. E16 mang từ round 1.

Lệnh fail không gắn eval ngoài ba eval trên: không có. Ba lệnh fail đều đã gắn eval: `make check` gắn E13, `DATABASE_URL= make e2e` gắn E14, `bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E15` gắn E15.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-1 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-2 | script | PASS |
| E5 | AC-3 | script | PASS |
| E6 | AC-4 | script | PASS |
| E7 | AC-5 | script | PASS |
| E8 | AC-6 | script | PASS |
| E9 | AC-7 | script | PASS |
| E10 | AC-8 | script | PASS |
| E11 | AC-9 | script | PASS |
| E12 | AC-10 | script | PASS |
| E13 | AC-11 | script | FAIL |
| E14 | AC-11 | script | FAIL |
| E15 | AC-11 | script | FAIL |
| E16 | AC-11 | script | PASS (carry-forward từ round 1) |
| E17 | AC-11 | script | PASS |
| E18 | AC-1 | ui-check | PASS |
| E19 | AC-12 | judgment | PASS (đề xuất, chờ người chốt) |
| E20 | AC-1 | script | PASS |
| E21 | AC-3 | script | PASS |
| E22 | AC-3 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: scripts/script (bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E1)
  verified_at: 2026-11-27T15:47:35Z
  output: |
    18 passed (45.3s)

- eval: E2
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: scripts/script (bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E2)
  verified_at: 2026-11-27T15:47:35Z
  output: |
    8 passed (39.6s)

- eval: E3
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: scripts/script (bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E3)
  verified_at: 2026-11-27T15:47:35Z
  output: |
    31 passed (1.2m)

- eval: E4
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: scripts/script (bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E4)
  verified_at: 2026-11-27T15:47:35Z
  output: |
    4 passed (25.0s)

- eval: E5
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: scripts/script (bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E5)
  verified_at: 2026-11-27T15:47:35Z
  output: |
    6 passed (32.1s)

- eval: E6
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: scripts/script (bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E6)
  verified_at: 2026-11-27T15:47:35Z
  output: |
    20 passed (42.0s)

- eval: E7
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: scripts/script (bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E7)
  verified_at: 2026-11-27T15:47:35Z
  output: |
    6 passed (33.7s)

- eval: E8
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: scripts/script (bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E8)
  verified_at: 2026-11-27T15:47:35Z
  output: |
    17 passed (41.9s)

- eval: E9
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: scripts/script (bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E9)
  verified_at: 2026-11-27T15:47:35Z
  output: |
    8 passed (34.0s)

- eval: E10
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: scripts/script (bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E10)
  verified_at: 2026-11-27T15:47:35Z
  output: |
    4 passed (16.1s)

- eval: E11
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: scripts/script (bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E11)
  verified_at: 2026-11-27T15:47:35Z
  output: |
    20 passed (18.9s)

- eval: E12
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: scripts/script (bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E12)
  verified_at: 2026-11-27T15:47:35Z
  output: |
    4 passed (14.1s)

- eval: E13
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E13-r3
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-27T15:47:35Z
  output: |
    lint: 0 errors, 6 warnings
    node tools/typecheck_own.mjs
    tests/e2e/do-diem-anh.ts(29,9): error TS2532: Object is possibly 'undefined'.
    make: *** [typecheck] Error 1

- eval: E14
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E14-r3
  exit_code: 2
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-27T15:47:35Z
  output: |
    Error: region not hydrated (vung chua nhan trang): shown 1, hydrated 0
      at phone-list.ts:34 (regionReady) via ghim-ngan.spec.ts:64
    12 failed (settle, sheet, behavior, dan-tu-excel, frame, ghim-ngan, tools/e2e_templates/suite.ts)
    1202 skipped, 5 did not run, 1349 passed (16.7m)

- eval: E15
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E15-r3
  exit_code: 1
  baseline: n-a
  verifier: scripts/script (bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E15)
  verified_at: 2026-11-27T15:47:35Z
  output: |
    error: duplicate key value violates unique constraint "users_email_key"
      at tests/e2e-db/thue-phi.spec.ts:48 (owner), makeCompanies :67
    4 failed (thue phi › dat-muc-roi-bang-hang-doi, ở 360, 414, 1024, 1440)
    179 skipped, 40 did not run, 711 passed (23.6m)

- eval: E16
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E16-r1
  exit_code: 0
  verifier: scripts/script (git diff từ merge-base với origin/main không đổi tệp dưới src/components/ui và src/components/reui)
  verified_at: 2026-11-27T09:13:46Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E17
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E17-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-27T15:47:35Z
  output: |
    design-floor-s4: không thấy màu hex thô

- eval: E18
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E18-r3
  exit_code: 0
  baseline: n-a
  verifier: scripts/ui-check (cmd ui-check:E18)
  verified_at: 2026-11-27T15:47:35Z
  screenshot: evidence/E18-step1.png
  observed: |
    1440 light sau: the record runs from the top bar to the bottom, a visible left edge line plus a soft shadow falling onto the grid on its left. khong-tach light: none of that, the record merges into the grid. 1440 dark sau: the record is lighter than the page behind it with a visible hairline left edge. The shadow is barely perceptible in dark. khong-tach dark: record equals the page colour, no edge, merges. Truoc at 1024 and phone: the record was a floating card with Truoc/Sau/Dong text buttons and a wrapped second row; sau shows a single-row head (1603 · S1.01, link, previous, next, close icons), full-height record, and the pin icon on desktop. Phone toolbar truoc had icons only; sau shows "Loc" with text and "Luu goc nhin" visible. The phone filter sheet in sau has aligned inputs with larger text. Screens otherwise unchanged in shape.
  network_observed: n-a (driver)

- eval: E20
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E20-r3
  exit_code: 0
  baseline: n-a
  verifier: scripts/script (bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E20)
  verified_at: 2026-11-27T15:47:35Z
  output: |
    4 passed (12.4s)

- eval: E21
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E21-r3
  exit_code: 0
  baseline: n-a
  verifier: scripts/script (bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E20)
  verified_at: 2026-11-27T15:47:35Z
  output: |
    cùng lệnh với E20 (4 passed)

- eval: E22
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E22-r3
  exit_code: 0
  baseline: n-a
  verifier: scripts/script (bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E22)
  verified_at: 2026-11-27T15:47:35Z
  output: |
    2 passed (12.4s)

### Judgment

- eval: E19
  panel đề xuất: PASS (domain-correctness, operational-feasibility, spec-alignment)
  - domain-correctness: PASS — Bảng «Từng chỗ và cách làm» có một dòng cho mỗi Q1–Q4, A5, B3, L1–L6; B1, B2 và luật «…» chung một dòng ghi vào sổ hành vi. design/behaviors.md có luật «…» ba điểm và chuẩn nút ba câu, mỗi khối ghi lời duyệt ngày 2026-11-27. Các câu (a)–(f) chỉ nằm ở «Chưa quyết» và «Chỗ chưa phủ», không có trong behaviors.md hay trang 0051.
  - operational-feasibility: PASS — Cột «Sau» khớp lời nguyên văn và không thêm việc ngoài lời ông; việc chỉ còn hình cả khi ghim là Hỏi-7, ông đã nhận ở Cổng Phạm vi (decisions.jsonl d-29). Các chữ «hai dòng» và «dưới thanh công cụ» còn lại chỉ nằm trong cụm «thay …». (a)–(f) không nằm trong phần đã làm.
  - spec-alignment: PASS — Mỗi mã Q1–Q4, A5, B3, L1–L6 có một dòng với cột «Sau» khớp lời chủ kho; B1, B2 và «…» chung một dòng nên «đúng một dòng» chỉ đúng theo nghĩa rộng. Dòng «Mở hồ sơ cạnh bảng» đã ghi «từ ngay dưới thanh trên … tới đáy» và «đầu hồ sơ một dòng». (a)–(f) chỉ nằm ở «Chưa quyết».
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-khung-luoi-va-ngan-chi-tiet-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-27T15:47:35Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline):
- E17 (lệnh design-floor-s4.mjs): xanh cả hai phía; là sàn hồi quy, không chứng minh tính năng mới. Xác nhận là regression-guard có chủ ý hoặc viết lại để assert hành vi mới.

Baseline khong do
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E1: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E2: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E3: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E4: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E5: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E6: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E7: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E8: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E9: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E10: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E11: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E12: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- make check: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E15: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E20: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh E22: bo qua baseline: tep _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 142c8e7aede628e0ccddad5a83342074baac35ab — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval nhiều lần chạy đều đồng đều (mọi eval chạy một lần, xác định).

## Iterations

Round 1: ledger đã ghi — đổi kỳ vọng E18, cắt bớt lập luận chấm, lỗi mạng; trả về cho phần làm.
Round 2: BLOCKED — bóng của ngăn hồ sơ vẫn bị cắt; sửa ở 82aa18d7 (hộp cột hồ sơ để bóng đổ lên lưới), đo thêm ở 3ab4277e.
Round 3: E13, E14, E15 failed — E13 lỗi typecheck ở tests/e2e/do-diem-anh.ts (Object is possibly undefined); E14 12 bài trình duyệt đỏ (vùng chưa nhận trang, ghim-ngan, sheet, frame, dan-tu-excel, settle, behavior, suite mẫu); E15 bài thue-phi trùng khoá users_email_key ở bốn khổ. Trả về phần làm.
