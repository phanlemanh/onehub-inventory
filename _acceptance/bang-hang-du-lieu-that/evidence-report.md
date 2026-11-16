---
schema_version: 2
feature_slug: bang-hang-du-lieu-that
verdict: REJECT
failed_evals: ["E8-ui"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: be8cd0ce3f784bba220aef279b3da8184a11c009
human_signoff:
---

# Evidence Report: bang-hang-du-lieu-that

Vòng 2. Một eval giao diện không đạt (E8-ui). Lệnh `make check` cũng đỏ nhưng không gắn eval nào (xem mục Lệnh suite).

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
| E8-ui | AC-8 | ui-check | FAIL |
| E9 | AC-9 | test | PASS |
| E9b | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E10b | AC-10 | test | PASS |
| E8-khuon | AC-8 | script | PASS (mang tu vong 1) |
| E8-floor | AC-8 | script | PASS (mang tu vong 1) |

## Evidence

- eval: E1
  run_id: minted-bang-hang-du-lieu-that-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly_r
  verified_at: 2026-11-16T07:55:48Z
  output: |
    cach-ly: 38 ca đạt, vai quy_hang_app, nối bằng quy_hang_login

- eval: E1b
  run_id: minted-bang-hang-du-lieu-that-E1b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:55:48Z
  output: |
    tests/db/bang-hang-that.db.test.ts: toàn bộ ca đạt (một lần chạy, phủ E1b, E2, E4, E5, E6, E7b, E10)

- eval: E2
  run_id: minted-bang-hang-du-lieu-that-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:55:48Z
  output: |
    cùng lần chạy với E1b, toàn bộ ca đạt

- eval: E2b
  run_id: minted-bang-hang-du-lieu-that-E2b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_unit
  verified_at: 2026-11-16T07:55:48Z
  output: |
    src/modules/listings, tests/bang-hang-that.test.ts, tests/mot-lan-doc.test.tsx: toàn bộ ca đạt (phủ E2b, E3b, E9)

- eval: E2-ui
  run_id: minted-bang-hang-du-lieu-that-E2-ui-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-16T07:55:48Z
  screenshot: evidence/E2-ui-step1.png
  observed: |
    I opened the frames with Read. Frame 1 (E2-mau-1440.png, same image as E2-ui-step1.png): App Shell with the company name [MAU] in the top bar and the page "Bảng hàng". The grid shows "60 dòng" at top and bottom. Visible rows are 0905, 1101, 1202, 1303, 1603, 1604, 0601, 0602, 0606, 0701, 0801, 1201, 1204 and more, all in S1.01 or S1.02, project Vinhomes Ocean Pa…, with statuses and prices. The sidebar tree lists Vinhomes Ocean Park 1 (The Sapphire 1: S1.01, S1.02, S1.03, S1.05), Vinhomes Ocean Park 2 – The Empire ([MAU] Toà E1) and Vinhomes Ocean Park 3 – The Crown ([MAU] Toà C1).
    Frame 2 (E2-mau2-1440.png, same image as E2-ui-step2.png): top bar shows [MAU-2]. The grid shows "3 dòng" with only 0905, 1101 and 1202, all S1.01. The sidebar tree has only Vinhomes Ocean Park 1 with The Sapphire 1 and S1.01. The [MAU] Toà E1, [MAU] Toà C1, S1.02, S1.03 and S1.05 and the other 57 rows are absent.
    Against Expected: the two frames have clearly different sets (60 vs 3), and nothing from [MAU] beyond the three shared-code rows shows in [MAU-2]. The expected result holds. The total line is "N dòng", not "n / N căn", as noted in outputTail.
  network_observed: clean

- eval: E3
  run_id: minted-bang-hang-du-lieu-that-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:55:48Z
  output: |
    27 passed (2.4m), một lần chạy phủ E3, E4b, E5b, E6b, E7, E8, E9b, E10b

- eval: E3b
  run_id: minted-bang-hang-du-lieu-that-E3b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_unit
  verified_at: 2026-11-16T07:55:48Z
  output: |
    cùng lần chạy với E2b, toàn bộ ca đạt

- eval: E4
  run_id: minted-bang-hang-du-lieu-that-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:55:48Z
  output: |
    cùng lần chạy với E1b, toàn bộ ca đạt

- eval: E4b
  run_id: minted-bang-hang-du-lieu-that-E4b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:55:48Z
  output: |
    27 passed (2.4m)

- eval: E5
  run_id: minted-bang-hang-du-lieu-that-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:55:48Z
  output: |
    cùng lần chạy với E1b, toàn bộ ca đạt

- eval: E5b
  run_id: minted-bang-hang-du-lieu-that-E5b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:55:48Z
  output: |
    27 passed (2.4m)

- eval: E6
  run_id: minted-bang-hang-du-lieu-that-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:55:48Z
  output: |
    cùng lần chạy với E1b, toàn bộ ca đạt

- eval: E6b
  run_id: minted-bang-hang-du-lieu-that-E6b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:55:48Z
  output: |
    27 passed (2.4m)

- eval: E7
  run_id: minted-bang-hang-du-lieu-that-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:55:48Z
  output: |
    27 passed (2.4m)

- eval: E7b
  run_id: minted-bang-hang-du-lieu-that-E7b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:55:48Z
  output: |
    cùng lần chạy với E1b, toàn bộ ca đạt

- eval: E8
  run_id: minted-bang-hang-du-lieu-that-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:55:48Z
  output: |
    27 passed (2.4m)

- eval: E8-ui
  run_id: minted-bang-hang-du-lieu-that-E8-ui-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-16T07:55:48Z
  screenshot: evidence/E8-ui-step1.png
  observed: |
    I opened frames with Read in 4 sizes (1440, 1024, 414, 360) and both light and dark. Not every one of the 40 files was opened. I did open: cho-tai 1440-sang and 360-toi; loi 1440-sang and 414-toi; trong 1024-toi and 360-sang; khong-khop 1440-sang and 414-toi; khong-du-quyen 1440-sang; and the proxy members 360-toi. The remaining frames I checked through the per-frame DOM log (selector present and visible, background colour, no horizontal scroll, page text).
    - cho-tai (?state=loading, [MAU] ListAgent): 1440-sang shows the App Shell (sidebar, top bar), the title "Bảng hàng", the "Hàng" region frame and the "Lưu góc nhìn" button. The body is a 5x10 grid of grey skeleton cells, with no data and no row count. 360-toi shows the same skeleton on a dark background, single column, no sidebar, and is readable. Selector region-loading is visible in all 8 frames. This is the right state and the right Grid-family shape.
    - loi (?state=error): 1440-sang shows the heading "Vùng này chưa tải được", the sentence "Đã có lỗi khi lấy dữ liệu, phần còn lại của màn vẫn dùng được...", and a blue "Thử lại" button inside the Hàng region. The App Shell stays usable. 414-toi has the same block with a light-blue button readable on the dark background. Selector region-state error is visible in all 8 frames.
    - trong (company [MAU-TRONG]): 1024-toi shows "0 dòng", the heading "Chưa có dữ liệu ở đây", the sentence "Sàn chưa có căn nào đang chào trên Bảng hàng." and a "Tải lại" button, with the sidebar saying "Chưa có căn nào trên Bảng hàng". 360-sang shows the same in light mode. The selector for kind=empty is visible in all 8 frames. This is the right state and shape.
    - khong-khop (?ma=KHONG-CO-CAN-NAY): 1440-sang shows the grid header and column filters with "KHON" typed in the Căn filter, the count "0 / 60 dòng", the heading "Không có dòng nào khớp", the sentence "Chữ bạn gõ ở ô lọc đầu cột không có trong dòng nào của vùng này." and a "Xoá lọc" button. 414-toi shows the phone layout with the "Căn" chip, "Xoá lọc", the same heading and a "Xoá lọc" button. The selector for kind=no-match is visible in all 8 frames. This is the right state and shape.
    - khong-du-quyen (/inventory as ListAgent): 1440-sang shows the full grid with 60 rows of data (S1.01 0905 ... prices and statuses). It does not show the "Không đủ quyền" block. The log shows selector page-state forbidden = 0 / visible=false in all 8 frames. This contradicts Expected for this state.
      Cause, from the probe I ran: all four roles (ListAgent, BuyerAgent, TeamLead, CompanyAdmin) hold viewListings (src/generated/ontology.ts viewListings.roles), and the DB constraint requires at least one role per member. So no signed-in role without viewListings exists on this database, and the forbidden block of /inventory cannot be reached by signing in. Logging in as BuyerAgent, TeamLead and CompanyAdmin at /inventory also gave forbidden=0.
    - Extra proxy frames E8-proxy-members-khong-du-quyen-*.png (8 files). These are not part of the 40 but show the same shared PageState block on /members as ListAgent. 360-toi shows the heading "Không đủ quyền", the sentence "Vai của bạn ở sàn này không mở được màn này...", and a blue "Về trang đầu" button. The selector is visible in all 8 frames. This block is correct, but the page is not the screen the step names.
    In all 40 frames hscroll=false and the background matches the colour mode: rgb(255,255,255) for light and lab(2.75 0 0) for dark.
  network_observed: clean
  output: |
    32 of 40 literal frames are correct. The 8 khong-du-quyen frames fail because the screen can't reach that state with any real role (no role without viewListings exists in this product). The /members proxy shows the forbidden block 8/8 but is a different screen. No horizontal scroll in 40/40 frames; background matches colour mode 40/40. Raw network log: evidence/E8-ui-network.txt.

- eval: E9
  run_id: minted-bang-hang-du-lieu-that-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_unit
  verified_at: 2026-11-16T07:55:48Z
  output: |
    cùng lần chạy với E2b, toàn bộ ca đạt

- eval: E9b
  run_id: minted-bang-hang-du-lieu-that-E9b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:55:48Z
  output: |
    27 passed (2.4m)

- eval: E10
  run_id: minted-bang-hang-du-lieu-that-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:55:48Z
  output: |
    cùng lần chạy với E1b, toàn bộ ca đạt

- eval: E10b
  run_id: minted-bang-hang-du-lieu-that-E10b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:55:48Z
  output: |
    27 passed (2.4m)

- eval: E8-khuon
  run_id: minted-bang-hang-du-lieu-that-E8-khuon-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-16T07:34:59Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8-floor
  run_id: minted-bang-hang-du-lieu-that-E8-floor-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-16T07:34:59Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bang-hang-du-lieu-that-SUITE-make_check-r2
  exit_code: 2
  verified_at: 2026-11-16T07:55:48Z
  output: |
    Không gắn eval nào, đỏ. Test Files 2 failed | 134 passed (136); Tests 2 failed | 2245 passed (2247).
    Hai ca đỏ: tools/proof_gate/proof-gate-0023.test.ts dòng 1193 và tools/proof_gate/proof-gate.test.ts dòng 809, cùng một dạng: bản sao kho chạy cổng chứng minh trả trạng thái 1 trong khi ca chờ 0.

- cmd: npm run build
  run_id: minted-bang-hang-du-lieu-that-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-16T07:55:48Z

- cmd: make e2e
  run_id: minted-bang-hang-du-lieu-that-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-16T07:55:48Z
  output: |
    1245 passed (9.1m)

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval không-phân-biệt (pass cả trên HEAD lẫn baseline), cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý:
- E8-khuon (lệnh: design-floor-khuon.mjs --kiem --root .)
- E8-floor (lệnh: design-floor-s4.mjs --root .)

Baseline không đo: mọi eval vòng này ghi n-a (round này không đo lại).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: REJECT — bằng chứng và run log đã ghi, trả về cho bước làm.
Round 2: E8-ui không đạt — trạng thái «Không đủ quyền» của /inventory không thể đạt được bằng đăng nhập thật (cả bốn vai đều có quyền xem hàng), 8 khung khong-du-quyen hiện lưới 60 dòng. Thêm: make check đỏ ở hai ca proof-gate, không gắn eval. Trả về bước làm.
