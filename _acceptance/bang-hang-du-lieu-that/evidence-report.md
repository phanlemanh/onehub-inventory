---
schema_version: 2
feature_slug: bang-hang-du-lieu-that
verdict: REJECT
failed_evals: [E8-ui]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: c2a8aae90fa2afa25349975586ca067ab670b672
human_signoff:
---

# Evidence Report: bang-hang-du-lieu-that

Round 1. Một eval thất bại: E8-ui (trạng thái Không đủ quyền trên /inventory không dựng được bằng vai thật). Lệnh suite `make check` cũng đỏ ở bước lint (ghi ở mục Evidence, không gắn eval nào).

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
| E8-ui | AC-8 | ui-check | REJECT |
| E9 | AC-9 | test | PASS |
| E9b | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E10b | AC-10 | test | PASS |
| E8-khuon | AC-8 | script | PASS |
| E8-floor | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-bang-hang-du-lieu-that-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cach_ly_r
  verified_at: 2026-11-16T07:34:59Z
  output: |
    cach-ly: 38 ca đạt, vai quy_hang_app, nối bằng quy_hang_login

- eval: E1b
  run_id: minted-bang-hang-du-lieu-that-E1b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:34:59Z
  output: |
    tests/db/bang-hang-that.db.test.ts đạt (cùng một lần chạy với E2, E4, E5, E6, E7b, E10)

- eval: E2
  run_id: minted-bang-hang-du-lieu-that-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:34:59Z
  output: |
    tests/db/bang-hang-that.db.test.ts đạt (cùng một lần chạy với E1b)

- eval: E4
  run_id: minted-bang-hang-du-lieu-that-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:34:59Z
  output: |
    tests/db/bang-hang-that.db.test.ts đạt (cùng một lần chạy với E1b)

- eval: E5
  run_id: minted-bang-hang-du-lieu-that-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:34:59Z
  output: |
    tests/db/bang-hang-that.db.test.ts đạt (cùng một lần chạy với E1b)

- eval: E6
  run_id: minted-bang-hang-du-lieu-that-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:34:59Z
  output: |
    tests/db/bang-hang-that.db.test.ts đạt (cùng một lần chạy với E1b)

- eval: E7b
  run_id: minted-bang-hang-du-lieu-that-E7b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:34:59Z
  output: |
    tests/db/bang-hang-that.db.test.ts đạt (cùng một lần chạy với E1b)

- eval: E10
  run_id: minted-bang-hang-du-lieu-that-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T07:34:59Z
  output: |
    tests/db/bang-hang-that.db.test.ts đạt (cùng một lần chạy với E1b)

- eval: E2b
  run_id: minted-bang-hang-du-lieu-that-E2b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_unit
  verified_at: 2026-11-16T07:34:59Z
  output: |
    src/modules/listings và tests/bang-hang-that.test.ts đạt (cùng một lần chạy với E3b, E9)

- eval: E3b
  run_id: minted-bang-hang-du-lieu-that-E3b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_unit
  verified_at: 2026-11-16T07:34:59Z
  output: |
    src/modules/listings và tests/bang-hang-that.test.ts đạt (cùng một lần chạy với E2b)

- eval: E9
  run_id: minted-bang-hang-du-lieu-that-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_unit
  verified_at: 2026-11-16T07:34:59Z
  output: |
    src/modules/listings và tests/bang-hang-that.test.ts đạt (cùng một lần chạy với E2b)

- eval: E3
  run_id: minted-bang-hang-du-lieu-that-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:34:59Z
  output: |
    27 passed (2.4m) — tests/e2e-db/bang-hang-that.spec.ts, chung một lần chạy với E4b, E5b, E6b, E7, E8, E9b, E10b

- eval: E4b
  run_id: minted-bang-hang-du-lieu-that-E4b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:34:59Z
  output: |
    27 passed (2.4m) — chung một lần chạy với E3

- eval: E5b
  run_id: minted-bang-hang-du-lieu-that-E5b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:34:59Z
  output: |
    27 passed (2.4m) — chung một lần chạy với E3

- eval: E6b
  run_id: minted-bang-hang-du-lieu-that-E6b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:34:59Z
  output: |
    27 passed (2.4m) — chung một lần chạy với E3

- eval: E7
  run_id: minted-bang-hang-du-lieu-that-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:34:59Z
  output: |
    27 passed (2.4m) — chung một lần chạy với E3

- eval: E8
  run_id: minted-bang-hang-du-lieu-that-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:34:59Z
  output: |
    27 passed (2.4m) — chung một lần chạy với E3

- eval: E9b
  run_id: minted-bang-hang-du-lieu-that-E9b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:34:59Z
  output: |
    27 passed (2.4m) — chung một lần chạy với E3

- eval: E10b
  run_id: minted-bang-hang-du-lieu-that-E10b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T07:34:59Z
  output: |
    27 passed (2.4m) — chung một lần chạy với E3

- eval: E8-khuon
  run_id: minted-bang-hang-du-lieu-that-E8-khuon-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-16T07:34:59Z
  output: |
    14 tệp giao diện ngoài bản đồ

- eval: E8-floor
  run_id: minted-bang-hang-du-lieu-that-E8-floor-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-16T07:34:59Z
  output: |
    không hex thô trên tệp giao diện vòng chạm

- eval: E2-ui
  run_id: E2-ui-20261116
  exit_code: 0
  baseline: n-a
  verifier: ui-check (Playwright có đăng nhập, lane R)
  verified_at: 2026-11-16T07:34:59Z
  screenshot: evidence/E2-mau-1440.png
  observed: |
    Frame 1 (E2-mau-1440.png, 1440 wide, company [MAU]): the top bar names [MAU]. The Bảng hàng table shows "60 dòng" in the toolbar and footer, with rows 0905, 1101, 1202, 1303, 1603, 1604 (S1.01) and 0601 through 1505 (S1.02). The tree has Vinhomes Ocean Park 1 (The Sapphire 1 with S1.01, S1.02, S1.03, S1.05), Park 2 (toà "[MAU] Toà E1") and Park 3 (toà "[MAU] Toà C1"). Frame 2 (E2-mau2-1440.png, after switching to [MAU-2] through the company menu): the top bar names [MAU-2] and the "Đổi sàn" menu is still open with a tick on [MAU-2]. The table shows "3 dòng" with only 0905, 1101 and 1202 (all S1.01, Vinhomes Ocean Park 1). The tree has only The Sapphire 1 with S1.01. [MAU] Toà E1, [MAU] Toà C1, S1.02, S1.03 and S1.05 are absent, and no row carries a unit of the [MAU]-only buildings. The two frames differ clearly (60 rows vs 3, different trees) and nothing from [MAU] leaks into [MAU-2]. Notes, not failures: the footer shows "N dòng", not the "n / N căn" the question mentions; the 3 codes of [MAU-2] are the first 3 sample units that [MAU] also has, which matches the seed (a 3-listing subset with its own listing ids), and the company switch is the only difference between the frames.
  network_observed: clean

- eval: E8-ui
  run_id: minted-bang-hang-du-lieu-that-E8-ui-r1
  exit_code: 1
  baseline: n-a
  verifier: ui-check (Playwright có đăng nhập, lane R)
  verified_at: 2026-11-16T07:34:59Z
  screenshot: evidence/E8-ui-step1.png
  observed: |
    cho-tai (8 khung): Tieu de Bang hang, the Hang co nut Luu goc nhin va luoi o xam skeleton (5 hang), khong co chu loi; 1440/1024 co App Shell day du (sidebar), 414/360 chi top bar va the; sang nen trang, toi nen den, o skeleton thay duoc o ca hai. loi (8): the Hang hien khoi Vung nay chua tai duoc, cau Da co loi khi lay du lieu..., nut xanh Thu lai, dung dang khoi trang thai cua ho Luoi o moi kho; chu doc ro ca sang va toi (nut Thu lai xanh nhat o toi). trong (8): san [MAU-TRONG], 0 dong + Luu goc nhin, khoi Chua co du lieu o day, cau San chua co can nao dang chao tren Bang hang, nut Tai lai; sidebar ghi Chua co can nao tren Bang hang; chu doc duoc ca hai che do, 414/360 xuong dong dung. khong-khop (8): [MAU] loc ma KHONG-CO-CAN-NAY, 0 / 60 dong, o loc dau cot con luu chu, khoi Khong co dong nao khop, cau Chu ban go o o loc dau cot khong co trong dong nao cua vung nay, nut Xoa loc; 414/360 dung thanh loc rut gon voi chip Can va Xoa loc; doc ro sang/toi. khong-du-quyen (8, thay the o /members, khong phai /inventory): khoi Khong du quyen, cau Vai cua ban o san nay khong mo duoc man nay..., nut xanh Ve trang dau, dung o ca 4 kho va 2 che do, chu doc ro; nhung day la man khac, khong chung minh trang thai tren /inventory. Ket luan: 32 khung dung trang thai va dung dang ho Luoi; trang thai Khong du quyen tren /inventory khong the tao ra voi vai that nao nen buoc nay khong dat theo dung chu cua step (can chu kho quyet: bo khung nay hoac duyet khung /members thay the).
  network_observed: clean
  output: |
    Server dùng chung lane R trên cổng 3482; đăng nhập thật bằng mã email qua outbox lane R, người [MAU] ListAgent.
    Đã lưu 40 khung E8-<trạng thái>-<khổ>-<sáng|tối>.png trong thư mục evidence.
    ASSERT PASS 32/40 (cho-tai, loi, trong, khong-khop).
    ASSERT FAIL 8/40 (khong-du-quyen): không vai nào thiếu viewListings (bảng quyền cho cả 4 vai ListAgent, BuyerAgent, TeamLead, CompanyAdmin đều có), ràng buộc cơ sở dữ liệu bắt vai tối thiểu 1 nên không dựng được thành viên không vai. Thử /inventory với ListAgent: hiện lưới 60 dòng bình thường. 8 khung thay thế chụp ở /members, không phải màn /inventory.
    Network: app traffic đều OK; một yêu cầu bị huỷ ở /brand/logo-mark.svg (tài nguyên tĩnh); console không lỗi hay cảnh báo.

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bang-hang-du-lieu-that-SUITE-make_check-r1
  exit_code: 2
  verified_at: 2026-11-16T07:34:59Z
  # lint đỏ: prettier --check báo .claude/launch.json chưa theo định dạng; eslint 0 lỗi, 4 cảnh báo. Lệnh này không gắn eval nào.

- cmd: npm run build
  run_id: minted-bang-hang-du-lieu-that-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-16T07:34:59Z

- cmd: make e2e
  run_id: minted-bang-hang-du-lieu-that-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-16T07:34:59Z
  # 1245 passed (9.4m)

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả bản hiện tại lẫn baseline): E8-khuon, E8-floor. Cả hai là bước chấm khuôn và sàn thiết kế chạy trên toàn cây, nên chứng minh bộ máy chứ không riêng tính năng này. Coi là regression-guard có chủ ý, hoặc viết lại để khẳng định hành vi mới.

Baseline không đo:
- DB_LANE=${DB_LANE:-r} DB_PORT=${DB_PORT:-5565} npx vitest run -c vitest.db.config.ts tests/db/bang-hang-that.db.test.ts --reporter=verbose: bo qua baseline: tep tests/db/bang-hang-that.db.test.ts co o cay dang kiem nhung chua co o merge-base 7ea2f5350d4c8f2f0fe7e2397724978e14477db5 — eval moi, chay tren code cu khong phan biet gi
- npx vitest run src/modules/listings tests/bang-hang-that.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/bang-hang-that.test.ts co o cay dang kiem nhung chua co o merge-base 7ea2f5350d4c8f2f0fe7e2397724978e14477db5 — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-r} DB_PORT=${DB_PORT:-5565} npx playwright test -c playwright.db.config.ts tests/e2e-db/bang-hang-that.spec.ts: bo qua baseline: tep tests/e2e-db/bang-hang-that.spec.ts co o cay dang kiem nhung chua co o merge-base 7ea2f5350d4c8f2f0fe7e2397724978e14477db5 — eval moi, chay tren code cu khong phan biet gi

Lệnh thất bại không gắn eval: make check (đỏ ở bước lint do định dạng của .claude/launch.json, một tệp đã sửa chưa commit); ui-check:E8-ui đã tính vào E8-ui.

Judge panels: không có eval judgment nào trong round này, không có phiếu bầu.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E8-ui failed — khung Không đủ quyền trên /inventory không dựng được vì cả bốn vai đều có quyền xem, 8 khung phải chụp thay ở /members; chủ kho cần quyết bỏ khung hoặc duyệt khung thay thế. Lệnh make check cũng đỏ ở bước lint. Returned to implementation.
