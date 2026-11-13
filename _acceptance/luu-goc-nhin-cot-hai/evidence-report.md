---
schema_version: 2
feature_slug: luu-goc-nhin-cot-hai
verdict: REJECT
failed_evals: ["E15"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b5df759e5116cebd1eff215820aaa8a0b6fd5344
human_signoff:
---

# Evidence Report: luu-goc-nhin-cot-hai

Round 1. Lệnh fail không gắn eval: ui-check:E15 (gắn với E15, đã ghi ở khối E15 bên dưới).

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-2 | test | PASS |
| E4 | AC-3 | test | PASS |
| E5 | AC-4 | script | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-7 | script | PASS |
| E10 | AC-8 | test | PASS |
| E11 | AC-8 | script | PASS |
| E12 | AC-9 | test | PASS |
| E13 | AC-9 | script | PASS |
| E14 | AC-10 | script | PASS |
| E15 | AC-3 | ui-check | FAIL |
| E16 | AC-6 | script | PASS |
| E17 | AC-1 | script | PASS |
| E18 | AC-3 | script | PASS |
| E19 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-luu-goc-nhin-cot-hai-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goc_nhin_db
  verified_at: 2026-11-13T02:34:48Z
  output: |
    tests/db/goc-nhin.db.test.ts chạy trên Postgres dãy K, kết thúc đạt.

- eval: E2
  run_id: minted-luu-goc-nhin-cot-hai-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goc_nhin_e2e
  verified_at: 2026-11-13T02:34:48Z
  output: |
    10 passed (1.7m)

- eval: E3
  run_id: minted-luu-goc-nhin-cot-hai-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T02:34:48Z
  output: |
    make test kết thúc đạt.

- eval: E4
  run_id: minted-luu-goc-nhin-cot-hai-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T02:34:48Z
  output: |
    make test kết thúc đạt.

- eval: E5
  run_id: minted-luu-goc-nhin-cot-hai-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goc_nhin_e2e
  verified_at: 2026-11-13T02:34:48Z
  output: |
    10 passed (1.7m)

- eval: E6
  run_id: minted-luu-goc-nhin-cot-hai-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goc_nhin_e2e
  verified_at: 2026-11-13T02:34:48Z
  output: |
    10 passed (1.7m)

- eval: E7
  run_id: minted-luu-goc-nhin-cot-hai-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goc_nhin_e2e
  verified_at: 2026-11-13T02:34:48Z
  output: |
    10 passed (1.7m)

- eval: E8
  run_id: minted-luu-goc-nhin-cot-hai-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goc_nhin_db
  verified_at: 2026-11-13T02:34:48Z
  output: |
    tests/db/goc-nhin.db.test.ts chạy trên Postgres dãy K, kết thúc đạt.

- eval: E9
  run_id: minted-luu-goc-nhin-cot-hai-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.cach_ly_k
  verified_at: 2026-11-13T02:34:48Z
  output: |
    cach-ly: 31 ca đạt, vai quy_hang_app

- eval: E10
  run_id: minted-luu-goc-nhin-cot-hai-E10-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T02:34:48Z
  output: |
    make test kết thúc đạt.

- eval: E11
  run_id: minted-luu-goc-nhin-cot-hai-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goc_nhin_db
  verified_at: 2026-11-13T02:34:48Z
  output: |
    tests/db/goc-nhin.db.test.ts chạy trên Postgres dãy K, kết thúc đạt.

- eval: E12
  run_id: minted-luu-goc-nhin-cot-hai-E12-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T02:34:48Z
  output: |
    make test kết thúc đạt.

- eval: E13
  run_id: minted-luu-goc-nhin-cot-hai-E13-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T02:34:48Z
  output: |
    830 passed (8.1m)

- eval: E14
  run_id: minted-luu-goc-nhin-cot-hai-E14-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T02:34:48Z
  output: |
    830 passed (8.1m)

- eval: E15
  run_id: minted-luu-goc-nhin-cot-hai-E15-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-13T02:34:48Z
  screenshot: evidence/E15-1440-sang-cot-thu-hai.png
  observed: |
    1440 sáng và tối, cot-thu-hai: second column has "Bảng hàng", "Theo trạng thái" and a "Góc nhìn của tôi" group with two items, "[MAU]... [đã đổi] …" (lit) and "[MAU] Hai phò..." (not lit), no counts. The toolbar shows "Lưu thay đổi" (blue) and "Lưu thành mới". The title is "[MAU] Toà S1.01 đang bán". The Phòng ngủ filter is 2 and the grid shows 7/60 rows.
    1440 menu: Đổi tên, divider, Xoá góc nhìn in red, in both themes.
    1440 xac-nhan-xoa: "Bạn chắc muốn xoá góc nhìn?" with the view name, and buttons Thôi and Xoá góc nhìn (blue). The page behind is blurred.
    1440 hop-dat-ten: "Lưu thành mới", a "Tên" field with focus ring, and buttons Thôi and Lưu.
    1024: same as 1440, with the toolbar wrapping to two rows and both save buttons still visible; the menu, confirm and naming dialogs are readable in both themes.
    414 and 360, cot-thu-hai: the phone sheet shows the same groups, the lit item with "đã đổi" and "…", and the name truncated to "[MAU] Toà ..." (at 360 "[MAU]..."). The toolbar is hidden behind the sheet. The menu is correct in both themes. The confirm and naming dialogs are bottom-anchored and full width, buttons stacked, no horizontal overflow at 360, light and dark. The blurred background shows no save buttons.
  network_observed: n-a (driver)
  output: |
    32 ảnh (4 khổ x 2 chủ đề x 4 trạng thái) đã lưu trong evidence/ và đã mở đủ. Điểm 2 (nút lưu trên thanh công cụ Bảng hàng) không hiện ở 414 và 360, cả sáng và tối, cả bốn trạng thái: ngăn điện thoại và hộp thoại che thanh công cụ; nền mờ chỉ thấy chip Lọc, Xoá lọc, Nhóm theo Toà, Cột. Kỳ vọng "năm điểm đúng ở cả tám khung" chưa đạt. Phụ: ở 1440 và 1024 hai tên góc nhìn đều bị cắt thành "[MAU]..." nên khó phân biệt. Điểm 1, 3, 4, 5 đạt ở mọi khung.

- eval: E16
  run_id: minted-luu-goc-nhin-cot-hai-E16-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goc_nhin_e2e
  verified_at: 2026-11-13T02:34:48Z
  output: |
    10 passed (1.7m)

- eval: E17
  run_id: minted-luu-goc-nhin-cot-hai-E17-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-13T02:34:48Z
  output: |
    design-floor-s4 không báo lỗi nào.

- eval: E18
  run_id: minted-luu-goc-nhin-cot-hai-E18-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T02:34:48Z
  output: |
    20 tệp giao diện ngoài bản đồ

- eval: E19
  run_id: minted-luu-goc-nhin-cot-hai-E19-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-13T02:34:48Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-luu-goc-nhin-cot-hai-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-13T02:34:48Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên nhánh lẫn baseline; chứng minh harness chứ chưa chứng minh feature, cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E9 (bash db/scripts/cach-ly.sh)
- E17 (design-floor-s4.mjs)
- E18 (design-floor-khuon.mjs --kiem)
- E19 (make check)

Baseline khong do:
- DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} npx vitest run -c vitest.db.config.ts tests/db/goc-nhin.db.test.ts --reporter=verbose: bo qua baseline: tep tests/db/goc-nhin.db.test.ts co o cay dang kiem nhung chua co o merge-base f458f6d3dbbb80bfa0c1512fe202559cf45dddef — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} npx playwright test -c playwright.db.config.ts tests/e2e-db/goc-nhin.spec.ts: bo qua baseline: tep tests/e2e-db/goc-nhin.spec.ts co o cay dang kiem nhung chua co o merge-base f458f6d3dbbb80bfa0c1512fe202559cf45dddef — eval moi, chay tren code cu khong phan biet gi

Hội đồng chấm (judge): không có mục judgment nào trong vòng này.

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (mọi eval chạy một lần, xác định).

## Iterations

Round 1: E15 chưa đạt — nút "Lưu thay đổi" và "Lưu thành mới" không hiện trong khung ở khổ 414 và 360 (ngăn điện thoại và hộp thoại che thanh công cụ), nên kỳ vọng năm điểm đúng ở cả tám khung không đạt. Trả về triển khai.
