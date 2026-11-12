---
schema_version: 2
feature_slug: app-shell-chon-tu-reui
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 636c5028d0dc6951680d13178897a80a5f1f45d5
human_signoff: Manh Phan 2026-11-12
---

# Evidence Report: app-shell-chon-tu-reui

Round 5. Mọi eval máy đều xanh; còn một mục judgment (E8) chờ người quyết ở Cổng 2.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | test | PASS (carry-forward từ round 2) |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS (carry-forward từ round 1) |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | judgment | UNCERTAIN |
| E9 | AC-8 | script | PASS (carry-forward từ round 2) |
| E10 | AC-1 | ui-check | PASS (carry-forward từ round 4) |
| E11 | AC-4 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-app-shell-chon-tu-reui-E1-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T01:27:42Z
  output: |
    make e2e: 538 passed (3.6m)

- eval: E3
  run_id: minted-app-shell-chon-tu-reui-E3-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T01:27:42Z
  output: |
    make e2e: 538 passed (3.6m)

- eval: E4
  run_id: minted-app-shell-chon-tu-reui-E4-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T01:27:42Z
  output: |
    make e2e: 538 passed (3.6m)

- eval: E5
  run_id: minted-app-shell-chon-tu-reui-E5-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T01:27:42Z
  output: |
    make e2e: 538 passed (3.6m)

- eval: E7
  run_id: minted-app-shell-chon-tu-reui-E7-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T01:27:42Z
  output: |
    make e2e: 538 passed (3.6m)

- eval: E11
  run_id: minted-app-shell-chon-tu-reui-E11-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_e2e
  verified_at: 2026-11-12T01:27:42Z
  output: |
    playwright.db.config.ts: 64 passed (2.1m)

- eval: E2
  run_id: minted-app-shell-chon-tu-reui-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T17:59:43Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-app-shell-chon-tu-reui-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T17:45:03Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-app-shell-chon-tu-reui-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-11T17:59:43Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-app-shell-chon-tu-reui-E10-r4
  exit_code: 0
  baseline: n-a
  verifier: config:capture.ui
  verified_at: 2026-11-11T23:48:10Z
  carried_from_round: 4
  # carry-forward tu round 4 — delta khong cham paths cua eval
  screenshot: evidence/E10-inventory-1440-light.png
  observed: |
    E10-inventory-1440-light.png: narrow left icon rail with OneHub flower mark on top, three screen icons (calendar-check, grid highlighted as current, paper plane) and a dark round avatar at the bottom; second column with heading "Bảng hàng", item "Tất cả hàng" highlighted (no number), group "Theo trạng thái" with six items without counts (Chưa đủ để rao, Đang bán, Đang giao dịch, Đã bán, Tạm ngừng, Ngừng hẳn); top bar has sidebar-toggle at left, sun theme button and "Đăng nhập" at right; content card with rounded corners, h1 "Bảng hàng". Same arrangement as approved prototype inventory-1440-light.jpg (rail + second column + top bar with theme and account), minus the prototype's workspace picker and counts. E10-inventory-1440-dark.png: same layout on near-black background, white text, moon icon, highlighted item has dark-grey pill; clearly readable. E10-inventory-360-light.png: single column, only top bar (toggle, sun, Đăng nhập) and h1 "Bảng hàng"; no rail or second column occupying the screen; no sideways overflow. E10-inventory-360-dark.png: same on dark background with white text, readable; matches prototype inventory-360-dark.jpg structure. E10-sheet-360-light.png: open slide-over sheet about 270px wide containing both the icon rail (logo + three icons + avatar) and the second column ("Bảng hàng", Tất cả hàng highlighted, six states, no numbers), page dimmed behind; matches q5-a.jpg sheet arrangement.
  network_observed: n-a (driver)

### Judgment

- eval: E8
  judged_by: judge panel đề xuất (3 lens, giữ nguyên từ round 3)
  verdict: UNCERTAIN
  rationale: Panel giữ nguyên từ round 3 — inputs không đổi, không chấm lại; rationale xem round 3. Hai lens không đồng thuận, nên đề xuất là chưa chắc; người quyết ở Cổng 2.
  votes:
    - domain-correctness: FAIL (r3)
    - operational-feasibility: UNCERTAIN (r3)
    - spec-alignment: PASS (r3)
  required_evidence:
    - Sửa cột «Vì sao» của dòng «Đổi sáng tối trong menu người dùng» trong _acceptance/app-shell-chon-tu-reui/design.md để nêu việc của người dùng, ví dụ nhân viên đổi sáng tối ở đâu và vì sao cần ở đó. Đọc lại dòng này ở bảng «Vùng của khối → lấy, bỏ, thêm» thì kết quả đổi.
    - Sửa lý do của dòng «Chuông và ngăn thông báo» và dòng «Thẻ chân cột thứ hai» cùng tệp trên để trỏ vào việc của nhân viên sàn, thay cho «dữ liệu mẫu» và «không phục vụ việc». Đọc lại hai dòng này thì kết quả đổi.
    - Chủ kho hoặc người giữ hợp đồng xác nhận trong hợp đồng AC-8 rằng lý do kiểu «kho đã có lời giải» (theo thang quyết định 0023, wiki/decisions/0023-chon-truoc-tao-sau.md) được tính là trỏ vào việc của người dùng. Hoặc sửa hai dòng «Đổi sáng tối» và «Menu người dùng» trong design.md để nêu việc người dùng, ví dụ «nhân viên đổi sáng tối/đăng xuất/đổi sàn ở một chỗ quen».
    - Dòng «Thẻ chân cột thứ hai» trong design.md nêu rõ cả thẻ inner-sidebar-security (hoặc ghi chú rằng nó thuộc nhóm «…»). Khi đó vùng nguồn liệt kê đủ cả 20 tệp.
  human_override: Manh Phan 2026-11-12 — Đạt

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-app-shell-chon-tu-reui-SUITE-make_check-r5
  exit_code: 0
  verified_at: 2026-11-12T01:27:42Z

- cmd: npm run build
  run_id: minted-app-shell-chon-tu-reui-SUITE-build-r5
  exit_code: 0
  verified_at: 2026-11-12T01:27:42Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval xanh ở cả code cũ lẫn code mới (không phân biệt được, chứng minh harness chứ không phải feature; viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- make test: E2, E6

Lệnh suite xanh cả hai phía là regression-guard bình thường, không liệt kê.

Lệnh fail không gắn eval: không có.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: REJECT — E9 (lint giao diện của make check) và E10 (ảnh ui-check) không đạt. Returned to implementation.
Round 2: E10 khung ngăn trượt trùng byte với khung ngăn đóng nên chưa chứng minh ngăn mở. Returned to implementation.
Round 3: panel E8 được chấm (domain-correctness FAIL, operational-feasibility UNCERTAIN, spec-alignment PASS); chi tiết xem run-log và review-findings.
Round 4: REJECT — bài kiểm khung chung (accessibility) hết giờ một lần. Returned to implementation.
Round 5: mọi eval máy xanh (E1, E3, E4, E5, E7, E11 chạy lại; E2, E6, E9, E10 carry-forward); E8 chờ người quyết. PENDING-JUDGMENT.

### Re-pin lần 1 — 2026-11-12, do gộp nhánh chính sau chữ ký (hàng 1m sửa đăng xuất trong menu tài khoản)
run_id: repin-20261112T014121Z-81972
sha: 636c5028d0dc6951680d13178897a80a5f1f45d5 · suites: 3 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng · ngoài làn máy: E8 (E8 không khai paths), E10
