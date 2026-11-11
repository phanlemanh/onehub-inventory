---
schema_version: 2
feature_slug: app-shell-chon-tu-reui
verdict: REJECT
failed_evals: ["E1","E3","E4","E5","E7"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ca651dee26dbcf88425a763a1484aa453c305fc9
human_signoff:
---

# Evidence Report: app-shell-chon-tu-reui

Round 4. Lệnh `make e2e` thoát lỗi: 1 bài đỏ, 537 bài xanh, 498 bị bỏ qua. Bài đỏ là `[1024] tests/e2e/frame.spec.ts:368 frame no serious accessibility violations on every frame screen`: sau khi cho trình duyệt mất mạng, không thấy `[data-slot="screen-banner"]` trong 5000ms. Lệnh này phủ năm eval E1, E3, E4, E5, E7 nên cả năm ghi đỏ; máy không tách được bài đỏ thuộc eval nào trong năm.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | FAIL |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | script | FAIL |
| E4 | AC-4 | script | FAIL |
| E5 | AC-5 | script | FAIL |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | script | FAIL |
| E8 | AC-8 | judgment | UNCERTAIN |
| E9 | AC-8 | script | PASS |
| E10 | AC-1 | ui-check | PASS |
| E11 | AC-4 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-app-shell-chon-tu-reui-E1-r4
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.e2e
  output: |
    (lệnh chung `make e2e`, phủ E1 E3 E4 E5 E7; cùng một kết quả cho cả năm)
    1) [1024] tests/e2e/frame.spec.ts:368:3 frame no serious accessibility violations on every frame screen
    Expected: visible; Locator: [data-slot="screen-banner"]; Error: element(s) not found (timeout 5000ms)
    1 failed; 498 skipped; 537 passed (3.9m)

- eval: E3
  run_id: minted-app-shell-chon-tu-reui-E3-r4
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.e2e
  output: |
    (lệnh chung `make e2e`; xem khối E1)
    1 failed; 498 skipped; 537 passed (3.9m)

- eval: E4
  run_id: minted-app-shell-chon-tu-reui-E4-r4
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.e2e
  output: |
    (lệnh chung `make e2e`; xem khối E1)
    1 failed; 498 skipped; 537 passed (3.9m)

- eval: E5
  run_id: minted-app-shell-chon-tu-reui-E5-r4
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.e2e
  output: |
    (lệnh chung `make e2e`; xem khối E1)
    1 failed; 498 skipped; 537 passed (3.9m)

- eval: E7
  run_id: minted-app-shell-chon-tu-reui-E7-r4
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.e2e
  output: |
    (lệnh chung `make e2e`; xem khối E1)
    Các bài tests/e2e/screens/screens.spec.ts ở 1440 đều xanh; bài đỏ duy nhất nằm ở frame.spec.ts 1024.
    1 failed; 498 skipped; 537 passed (3.9m)

- eval: E11
  run_id: minted-app-shell-chon-tu-reui-E11-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_e2e
  output: |
    64 passed (2.3m)

- eval: E10
  run_id: minted-app-shell-chon-tu-reui-E10-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  screenshot: evidence/E10-inventory-1440-light.png
  observed: |
    E10-inventory-1440-light.png: narrow left icon rail with OneHub flower mark on top, three screen icons (calendar-check, grid highlighted as current, paper plane) and a dark round avatar at the bottom; second column with heading "Bảng hàng", item "Tất cả hàng" highlighted (no number), group "Theo trạng thái" with six items without counts (Chưa đủ để rao, Đang bán, Đang giao dịch, Đã bán, Tạm ngừng, Ngừng hẳn); top bar has sidebar-toggle at left, sun theme button and "Đăng nhập" at right; content card with rounded corners, h1 "Bảng hàng". Same arrangement as approved prototype inventory-1440-light.jpg (rail + second column + top bar with theme and account), minus the prototype's workspace picker and counts. E10-inventory-1440-dark.png: same layout on near-black background, white text, moon icon, highlighted item has dark-grey pill; clearly readable. E10-inventory-360-light.png: single column, only top bar (toggle, sun, Đăng nhập) and h1 "Bảng hàng"; no rail or second column occupying the screen; no sideways overflow. E10-inventory-360-dark.png: same on dark background with white text, readable; matches prototype inventory-360-dark.jpg structure. E10-sheet-360-light.png: open slide-over sheet about 270px wide containing both the icon rail (logo + three icons + avatar) and the second column ("Bảng hàng", Tất cả hàng highlighted, six states, no numbers), page dimmed behind; matches q5-a.jpg sheet arrangement.
  network_observed: n-a (driver)

- eval: E2
  run_id: minted-app-shell-chon-tu-reui-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T17:59:43Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-app-shell-chon-tu-reui-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T17:45:03Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-app-shell-chon-tu-reui-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-11T17:59:43Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

### Judgment

- eval: E8
  judged_by: hội đồng judge (panel giữ nguyên từ round 3 — inputs không đổi, không chấm lại; rationale xem round đó)
  verdict: UNCERTAIN
  votes:
    - domain-correctness: FAIL (r3)
    - operational-feasibility: UNCERTAIN (r3)
    - spec-alignment: PASS (r3)
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-app-shell-chon-tu-reui-SUITE-make_check-r4
  exit_code: 0

- cmd: npm run build
  run_id: minted-app-shell-chon-tu-reui-SUITE-build-r4
  exit_code: 0

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay.

Eval không phân biệt (xanh cả trên code cũ lẫn code mới), cần viết lại cho đo hành vi mới hoặc xác nhận là lưới hồi quy có chủ ý: lệnh `make test` (E2, E6).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1-3: xem run-log.jsonl (E6 xanh ở round 1; E2, E9 xanh ở round 2; hội đồng E8 chấm ở round 3).
Round 4: E1, E3, E4, E5, E7 failed — `make e2e` đỏ một bài ở frame.spec.ts:368 (1024, kiểm axe mọi màn khung): băng báo mất mạng `screen-banner` không hiện sau khi cho trình duyệt offline. Returned to implementation.
