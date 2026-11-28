---
schema_version: 2
feature_slug: khung-luoi-va-ngan-chi-tiet
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2d814a8e2c6485c90d50ada24b850f92755ba800
human_signoff: Manh Phan 2026-11-28
---

# Evidence Report: khung-luoi-va-ngan-chi-tiet

Vòng 8. E18 chạy thật lại; ba lệnh nền chạy mới; các phép còn lại mang sang. Mỗi khối mang sang được chép nguyên từ báo
cáo của vòng nó chạy thật (vòng 6 e9d9acd8, vòng 5 ed8bec3b, vòng 4 af3fdbb7, vòng 1 603a2961) bằng
`_acceptance/khung-luoi-va-ngan-chi-tiet/rang/dung-lai-mang-sang.mjs`, chỉ thêm `carried_from_round` (G-2811-28/29).

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
| E13 | AC-11 | script | PASS |
| E14 | AC-11 | script | PASS |
| E15 | AC-11 | script | PASS |
| E16 | AC-11 | script | PASS |
| E17 | AC-11 | script | PASS |
| E18 | AC-1 | ui-check | PASS |
| E19 | AC-12 | judgment | PASS |
| E20 | AC-1 | script | PASS |
| E21 | AC-3 | script | PASS |
| E22 | AC-3 | script | PASS |

Vòng 8 chỉ chạy lại E18 và ba lệnh suite. Các eval còn lại mang từ vòng trước, mỗi khối ghi rõ `carried_from_round`.

## Evidence

- eval: E1
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E1-r6
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T21:25:18Z
  output: |
    20 passed (17.6s)
  carried_from_round: 6

- eval: E2
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E2-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    12 passed (50.7s)
  carried_from_round: 5

- eval: E3
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E3-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    31 passed (1.2m)
  carried_from_round: 5

- eval: E4
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E4-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    4 passed (35.5s)
  carried_from_round: 5

- eval: E5
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E5-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    8 passed (44.2s)
  carried_from_round: 5

- eval: E6
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E6-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    20 passed (44.5s)
  carried_from_round: 5

- eval: E7
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E7-r6
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T21:25:18Z
  output: |
    10 passed (11.2s)
  carried_from_round: 6

- eval: E8
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T17:13:33Z
  output: |
    17 passed (41.9s)
  carried_from_round: 4

- eval: E9
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E9-r6
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T21:25:18Z
  output: |
    8 passed (9.6s)
  carried_from_round: 6

- eval: E10
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E10-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    6 passed (44.5s)
  carried_from_round: 5

- eval: E11
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E11-r4
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T17:13:33Z
  output: |
    24 passed (43.3s)
  carried_from_round: 4

- eval: E12
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E12-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    4 passed (11.2s)
  carried_from_round: 5

- eval: E13
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E13-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-27T20:57:08Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance
  carried_from_round: 5

- eval: E14
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E14-r5
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-27T20:57:08Z
  output: |
    gac-hydration: 0 canh bao
  carried_from_round: 5

- eval: E15
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E15-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    729 passed (19.6m)
  carried_from_round: 5

- eval: E16
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E16-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T09:13:46Z
  output: |
    vendor folders untouched
    __EXIT=0
  carried_from_round: 1

- eval: E17
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E17-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-27T20:57:08Z
  output: |
    sàn thiết kế không báo màu hex thô
  carried_from_round: 5

- eval: E18
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E18-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-27T22:54:38Z
  screenshot: evidence/E18-step1.png
  observed: |
    I opened each saved frame, and for the pixel claims I also read the pixel values.

    - sau/ngan-1440-light.png: the record sits flush against the right edge from under the top bar to the bottom. The head is one line, "1603 · S.01", with icon buttons at the top right. A shadow gradient (252 down to 219) falls on the grid just left of it, then a 229 border, then a white record. The toolbar is icon-only and stops before the record. The record is clearly apart.
    - pha/ngan-1440-light-khong-tach.png: the same screen with the record flat white and no border or shadow. It merges into the page and does NOT read as apart.
    - sau/ngan-1440-dark.png: the record surface is 23 and the grid card is 24 (the same surface), brighter than the page at 10. A thin left line (46) is visible and the shadow is hardly there. It is apart by the line alone.
    - pha/ngan-1440-dark-khong-tach.png: the surface is still 23, but the line is gone, so it does NOT read as apart.
    - truoc/ngan-1440-{light,dark}.png: a floating rounded card with a two-row head and text buttons "Trước/Sau/Đóng". It differs from sau as intended.
    - 360 and 414 (E18-step2/3): the filter sheet looks the same truoc and sau, and the record gets the one-line head with icons.
    - Phone grid (E18-step6): sau shows "Lọc" with text and "Lưu góc nhìn" shown directly, where truoc had an icon and a "..." menu.
    - 1024 (E18-step4/5): the record is flush to the right with its left border visible in both themes. In light the shadow is visible; in dark only the line.
    - Grid 1440 and 1024 (E18-step7/8): the layout is unchanged beyond the intended differences. The sau frame shows more rows because the toolbar and header are slightly shorter, and the filter inputs are aligned.
  network_observed: n-a (driver)

- eval: E19
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  rationale: Cả ba góc nhìn cùng chấm PASS (xem mục Judge panel bên dưới). Bảng «Từng chỗ và cách làm», sổ hành vi và trang 0051 khớp lời đã duyệt; các câu (a)–(f) không nằm trong phần đã làm.
  human_override:  # chi nguoi ghi

- eval: E20
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E20-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    6 passed (13.1s)
  carried_from_round: 5

- eval: E21
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E21-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    cùng lệnh với E20: 6 passed (13.1s)
  carried_from_round: 5

- eval: E22
  run_id: minted-khung-luoi-va-ngan-chi-tiet-E22-r5
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh
  verified_at: 2026-11-27T20:57:08Z
  output: |
    3 passed (14.1s)
  carried_from_round: 5

### Judge panel E19

Đề xuất panel: PASS. `human_override` để trống cho người quyết ở Cổng 2.

- domain-correctness: PASS — (1) Bảng «Từng chỗ và cách làm» có dòng cho Q1, Q2, Q3, Q4, A5, B3, L1–L6. Một dòng chung «B1, B2, «…»» ghi luật vào sổ hành vi và hoãn phần dựng sang hàng 3h, đúng phạm vi đã tách ở decisions d-10. Cột «Sau» không thêm việc ngoài lời chủ kho. (2) behaviors.md có luật «…» ba điểm (dòng 62–67) và chuẩn nút ba câu (dòng 55–61) khớp từng điểm của đoạn nguyên văn. Mỗi khối ghi «chủ kho 2026-11-27» cùng câu duyệt. Dòng «Mở hồ sơ cạnh bảng» (dòng 12) chỉ còn nhắc cách cũ ở dạng «thay …», không còn «đứng dưới thanh công cụ» hay «đầu hồ sơ hai dòng». (3) design.md ghi rõ (a)–(f) không nằm trong phần đã làm. Trang 0051 và behaviors.md không dựng (a)–(f). Các câu chi-nguoi còn lại (Hỏi-7…10) chủ kho đã nhận ở d-29, và những câu chưa dựng được xếp sang lát 2.
- operational-feasibility: PASS — (1) Bảng «Từng chỗ và cách làm» có dòng cho Q1–Q4, A5, B3, L1–L6. B1, B2 và luật «…» chung một dòng ghi vào sổ hành vi, cột «Sau» chỉ làm đúng điều đã duyệt. (2) behaviors.md có luật «…» ba điểm (dòng 62–67) và chuẩn nút ba câu (dòng 55–61). Mỗi khối kèm lời duyệt và ngày 2026-11-27. Dòng «Mở hồ sơ cạnh bảng» (dòng 94) không còn «đứng dưới thanh công cụ» hay «đầu hồ sơ hai dòng». (3) Các câu (a)–(f) chỉ nằm ở mục «Chưa quyết» của design.md, nơi ghi «Không câu nào nằm trong phần đã làm». Chúng không xuất hiện trong phần đã làm của design.md, trong behaviors.md hay trong trang 0051.
- spec-alignment: PASS — Bảng «Từng chỗ và cách làm» có một dòng cho mỗi điều đã chốt (Q1–Q4, A5, B3, B1/B2/«…», L1–L6), và cột «Sau» khớp lời nguyên văn. Mục «Bộ nút theo quyền» của behaviors.md có luật «…» ba điểm và chuẩn nút ba câu đúng nghĩa đoạn nguyên văn, mỗi khối kèm lời duyệt và ngày 2026-11-27. Dòng «Mở hồ sơ cạnh bảng» chỉ còn «khung RecordPanel», không còn «đứng dưới thanh công cụ» hay «hai dòng». Các câu (a)–(f) và các câu chi-nguoi không có trong phần đã làm của design.md, behaviors.md hay trang 0051. Có hai lệch nhỏ, không đổi kết luận. Dòng Q4 chỉ ghi «khi ngăn nổi», trong khi Hỏi-7 (ghim cũng chỉ hình, chủ kho đã duyệt ở d-29) nằm ở bảng trạng thái và trang 0051. Câu 3 chuẩn nút trong behaviors.md thêm mốc «dưới 768 px».

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-khung-luoi-va-ngan-chi-tiet-SUITE-make_check-r8
  exit_code: 0
  verified_at: 2026-11-27T22:54:38Z

- cmd: npm run build
  run_id: minted-khung-luoi-va-ngan-chi-tiet-SUITE-build-r8
  exit_code: 0
  verified_at: 2026-11-27T22:54:38Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-khung-luoi-va-ngan-chi-tiet-SUITE-DATABASE_URL_make_e2e-r8
  exit_code: 0
  verified_at: 2026-11-27T22:54:38Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 6 — baseline khong do lai round nay

Baseline khong do: evals.yaml khong doi tu lan baseline cuoi (round 6); moi eval ghi baseline n-a.

Non-discriminating evals: none

## Variance

none — every multi-run eval is uniform

## Iterations

Round 5: E18 (nền tối), E1, E7, E9 failed — E18 ở nền tối, và mỗi eval kia một lần quá giờ. Returned to implementation.
Round 6: một bài trong bộ trình duyệt chung quá giờ; E18 đạt. Returned to implementation.
Round 7: PASS; ký lại chín bản ghi đã ký.
Round 8: chỉ đổi lời câu đầu thẻ (card-plain.json); chạy lại E18 và ba lệnh suite, tất cả đạt; các eval khác mang từ vòng trước.

### Re-pin lần 1 — 2026-11-28, do gộp main c55415fe (PR #133) vào nhánh VP10; thước E4 hồ sơ deploy (2efc5370); bài 3g chụp ra thư mục chạy (1cb3073b) — G-2811-45/51
run_id: repin-20261128T015659Z-62110
sha: 808af8c561772a5926a525f82fd346a9b9200303 · suites: 3 lệnh exit 0 · evals: 20/20 eval máy đạt kỳ vọng · ngoài làn máy: E18, E19 (E19 không khai paths) · AC không có chốt máy: AC-12

### Re-pin lần 2 — 2026-11-28, do hàng 11 nhap-excel trước Cổng Bằng chứng, sau vòng chấm 12: 22 hồ sơ cổng nêu (gồm 11 hồ sơ có dòng sửa-sau-ký của PR #130) và nhap-excel (G-2811-62)
run_id: repin-20261128T091000Z-36001
sha: 2d814a8e2c6485c90d50ada24b850f92755ba800 · suites: 3 lệnh exit 0 · evals: 20/20 eval máy đạt kỳ vọng · ngoài làn máy: E18, E19 (E19 không khai paths) · diff chạm vật đo ngoài làn máy: E18 — chưa chứng lại, đi vòng S4 delta · AC không có chốt máy: AC-12
