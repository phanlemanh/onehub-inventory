---
schema_version: 2
feature_slug: bang-hang-du-lieu-that
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 4f52b3c662fc14f1ab8b786e72f0233a3e9e3f4c
human_signoff:
---

# Evidence Report: bang-hang-du-lieu-that

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E1b | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E2b | AC-2 | test | PASS |
| E2-ui | AC-2 | ui-check | PASS |
| E3 | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E4b | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E5b | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E6b | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E7b | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E8-ui | AC-8 | ui-check | PASS |
| E9 | AC-9 | test | PASS |
| E9b | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E10b | AC-10 | test | PASS |
| E8-khuon | AC-8 | script | PASS |
| E8-floor | AC-8 | script | PASS |

## Evidence

### Chạy lại ở round 3

- eval: E8
  run_id: minted-bang-hang-du-lieu-that-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T08:15:36Z
  output: |
    27 passed (2.1m)

- eval: E8-ui
  run_id: minted-bang-hang-du-lieu-that-E8-ui-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-16T08:15:36Z
  screenshot: evidence/E8-cho-tai-1440-sang.png
  observed: |
    I opened 8 contact sheets (4 widths per sheet, one sheet per state x colour mode; the 1440 and 1024 frames were halved and cut to the top 700px). I did not open each of the 32 PNGs at full size. cho-tai light and dark: title «Bảng hàng», card «Hàng», button «Lưu góc nhìn», then 5 rows of grey skeleton cells, with no data and no error text. At 414 and 360 the cells are rounded and the top bar is compact. Dark is a near-black page with dark-grey cells, still readable. loi light and dark: same frame shape (card «Hàng», «Lưu góc nhìn»); in the card, bold «Vùng này chưa tải được», «Đã có lỗi khi lấy dữ liệu, phần còn lại của màn vẫn dùng được. Bạn bấm «Thử lại»; nếu vẫn lỗi, tải lại trang sau ít phút.», and a filled blue «Thử lại» button. The text is readable in both modes (the dark button is light blue). trong ([MAU-TRONG], light and dark): «0 dòng», «Lưu góc nhìn», «Chưa có dữ liệu ở đây», «Sàn chưa có căn nào đang chào trên Bảng hàng.», outline button «Tải lại». The sidebar shows «Dự án» and «Góc nhìn của tôi» with their empty-state sentences at 1440 and 1024, and the text reads well in dark. khong-khop (light and dark): «0 / 60 dòng», the toolbar «Nhóm theo Toà / Cột / Toàn màn hình» at wide sizes, the column-filter row with «KHON» in the Căn column. At 414 and 360 a filter badge «1», the chip «Căn ×» and «Xoá lọc» appear; the body shows «Không có dòng nào khớp», «Chữ bạn gõ ở ô lọc đầu cột không có trong dòng nào của vùng này.» and the «Xoá lọc» button. All four states use the same Grid-family frame (page title, «Hàng» card, toolbar) and fit all four widths with no horizontal scroll or overlap. Verdict: every frame has the right state and the Grid-family shape. The only deviation is the wording «Thử lại» against the «Tải lại» in the contract (NOTE 2).
  network_observed: clean

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bang-hang-du-lieu-that-SUITE-make_check-r3
  exit_code: 0
  verified_at: 2026-11-16T08:15:36Z

- cmd: npm run build
  run_id: minted-bang-hang-du-lieu-that-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-16T08:15:36Z

- cmd: make e2e
  run_id: minted-bang-hang-du-lieu-that-SUITE-make_e2e-r3
  exit_code: 0
  verified_at: 2026-11-16T08:15:36Z

### Mang tiếp từ round trước (delta không chạm paths của eval)

- eval: E1
  run_id: minted-bang-hang-du-lieu-that-E1-r2
  exit_code: 0
  verifier: config:executors.script.cach_ly_r
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E1b
  run_id: minted-bang-hang-du-lieu-that-E1b-r2
  exit_code: 0
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-bang-hang-du-lieu-that-E2-r2
  exit_code: 0
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E2b
  run_id: minted-bang-hang-du-lieu-that-E2b-r2
  exit_code: 0
  verifier: config:executors.test.bang_hang_that_unit
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E2-ui
  run_id: minted-bang-hang-du-lieu-that-E2-ui-r2
  exit_code: 0
  verifier: config:executors.ui-check
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval
  screenshot: evidence/E2-ui-step1.png
  observed: |
    I opened the frames with Read. Frame 1 (E2-mau-1440.png, same image as E2-ui-step1.png): App Shell with the company name [MAU] in the top bar and the page "Bảng hàng". The grid shows "60 dòng" at top and bottom. Visible rows are 0905, 1101, 1202, 1303, 1603, 1604, 0601, 0602, 0606, 0701, 0801, 1201, 1204 and more, all in S1.01 or S1.02, project Vinhomes Ocean Pa…, with statuses and prices. The sidebar tree lists Vinhomes Ocean Park 1 (The Sapphire 1: S1.01, S1.02, S1.03, S1.05), Vinhomes Ocean Park 2 – The Empire ([MAU] Toà E1) and Vinhomes Ocean Park 3 – The Crown ([MAU] Toà C1).
    Frame 2 (E2-mau2-1440.png, same image as E2-ui-step2.png): top bar shows [MAU-2]. The grid shows "3 dòng" with only 0905, 1101 and 1202, all S1.01. The sidebar tree has only Vinhomes Ocean Park 1 with The Sapphire 1 and S1.01. The [MAU] Toà E1, [MAU] Toà C1, S1.02, S1.03 and S1.05 and the other 57 rows are absent.
    Against Expected: the two frames have clearly different sets (60 vs 3), and nothing from [MAU] beyond the three shared-code rows shows in [MAU-2]. The expected result holds. The total line is "N dòng", not "n / N căn", as noted in outputTail.
  network_observed: clean

- eval: E3
  run_id: minted-bang-hang-du-lieu-that-E3-r2
  exit_code: 0
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E3b
  run_id: minted-bang-hang-du-lieu-that-E3b-r2
  exit_code: 0
  verifier: config:executors.test.bang_hang_that_unit
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-bang-hang-du-lieu-that-E4-r2
  exit_code: 0
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E4b
  run_id: minted-bang-hang-du-lieu-that-E4b-r2
  exit_code: 0
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-bang-hang-du-lieu-that-E5-r2
  exit_code: 0
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E5b
  run_id: minted-bang-hang-du-lieu-that-E5b-r2
  exit_code: 0
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-bang-hang-du-lieu-that-E6-r2
  exit_code: 0
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E6b
  run_id: minted-bang-hang-du-lieu-that-E6b-r2
  exit_code: 0
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-bang-hang-du-lieu-that-E7-r2
  exit_code: 0
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E7b
  run_id: minted-bang-hang-du-lieu-that-E7b-r2
  exit_code: 0
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-bang-hang-du-lieu-that-E9-r2
  exit_code: 0
  verifier: config:executors.test.bang_hang_that_unit
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E9b
  run_id: minted-bang-hang-du-lieu-that-E9b-r2
  exit_code: 0
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-bang-hang-du-lieu-that-E10-r2
  exit_code: 0
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E10b
  run_id: minted-bang-hang-du-lieu-that-E10b-r2
  exit_code: 0
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:55:48Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E8-khuon
  run_id: minted-bang-hang-du-lieu-that-E8-khuon-r1
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-16T07:34:59Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8-floor
  run_id: minted-bang-hang-du-lieu-that-E8-floor-r1
  exit_code: 0
  verifier: config:executors.design.floor
  verified_at: 2026-11-16T07:34:59Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Baseline khong do
- DB_LANE=${DB_LANE:-r} DB_PORT=${DB_PORT:-5565} npx playwright test -c playwright.db.config.ts tests/e2e-db/bang-hang-that.spec.ts: bo qua baseline: tep tests/e2e-db/bang-hang-that.spec.ts co o cay dang kiem nhung chua co o merge-base 7ea2f5350d4c8f2f0fe7e2397724978e14477db5 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: REJECT — chấm vòng một chưa đạt; đã sửa tại c2a8aae và 0fc812b (bằng chứng và sổ chạy ghi lại).
Round 2: REJECT — khung «Không đủ quyền» không đạt tới được để chụp; ma trận chứng minh được chỉnh sang bài mà bản sao có.
Round 3: PASS — chủ kho chọn đo khung «Không đủ quyền» chỉ bằng máy (giới hạn đã biết của AC-8); E8 và E8-ui chạy lại ở bốn trạng thái và 32 khung, các eval còn lại mang tiếp từ round trước.
