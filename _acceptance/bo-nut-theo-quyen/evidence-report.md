---
schema_version: 2
feature_slug: bo-nut-theo-quyen
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 50530e063740e63615fdea2569ef9325b1d65890
human_signoff:
---

# Evidence Report: bo-nut-theo-quyen

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | judgment | PENDING-JUDGMENT (đề xuất PASS, chờ người) |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-4 | script | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-10 | script | PASS |
| E12 | AC-10 | ui-check | PASS |
| E13 | AC-6 | judgment | PENDING-JUDGMENT (đề xuất PASS, chờ người) |
| E14 | AC-10 | script | PASS |
| E15 | AC-1 | script | PASS |

## Evidence

- eval: E2
  run_id: minted-bo-nut-theo-quyen-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_nut_unit
  verified_at: 2026-11-12T16:37:40Z
  output: |
    cmd: npx vitest run src/modules/identity/permitted-action.test.tsx src/components/candidate/row-actions.test.tsx src/modules/identity/permissions.test.ts --coverage.enabled=false --reporter=verbose
    __EXIT=0

- eval: E5
  run_id: minted-bo-nut-theo-quyen-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_nut_unit
  verified_at: 2026-11-12T16:37:40Z
  output: |
    cmd: npx vitest run src/modules/identity/permitted-action.test.tsx src/components/candidate/row-actions.test.tsx src/modules/identity/permissions.test.ts --coverage.enabled=false --reporter=verbose
    __EXIT=0

- eval: E6
  run_id: minted-bo-nut-theo-quyen-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_nut_unit
  verified_at: 2026-11-12T16:37:40Z
  output: |
    cmd: npx vitest run src/modules/identity/permitted-action.test.tsx src/components/candidate/row-actions.test.tsx src/modules/identity/permissions.test.ts --coverage.enabled=false --reporter=verbose
    __EXIT=0

- eval: E3
  run_id: minted-bo-nut-theo-quyen-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_nut_kiem
  verified_at: 2026-11-12T16:37:40Z
  output: |
    cmd: npx vitest run tests/bo-nut-kiem.test.ts --coverage.enabled=false --reporter=verbose
    __EXIT=0

- eval: E4
  run_id: minted-bo-nut-theo-quyen-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-12T16:37:40Z
  output: |
    cmd: make check
    CODEOWNERS matches governance/autonomy.yaml
    __EXIT=0

- eval: E7
  run_id: minted-bo-nut-theo-quyen-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_nut_e2e_db
  verified_at: 2026-11-12T16:37:40Z
  output: |
    cmd: DB_LANE=${DB_LANE:-v} DB_PORT=${DB_PORT:-5570} npx playwright test -c playwright.db.config.ts tests/e2e-db/bo-nut-members.spec.ts
    9 passed (29.5s)
    __EXIT=0

- eval: E8
  run_id: minted-bo-nut-theo-quyen-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_nut_e2e_db
  verified_at: 2026-11-12T16:37:40Z
  output: |
    cmd: DB_LANE=${DB_LANE:-v} DB_PORT=${DB_PORT:-5570} npx playwright test -c playwright.db.config.ts tests/e2e-db/bo-nut-members.spec.ts
    9 passed (29.5s)
    __EXIT=0

- eval: E9
  run_id: minted-bo-nut-theo-quyen-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.bang_quyen_unit
  verified_at: 2026-11-12T16:37:40Z
  output: |
    cmd: npx vitest run src/modules/identity/permissions.test.ts src/modules/identity/permission-table.test.ts --coverage.enabled=false --reporter=verbose
    __EXIT=0

- eval: E10
  run_id: minted-bo-nut-theo-quyen-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_nut_vai_man
  verified_at: 2026-11-12T16:37:40Z
  output: |
    cmd: npx vitest run tests/bo-nut-vai-man.test.ts --coverage.enabled=false --reporter=verbose
    __EXIT=0

- eval: E11
  run_id: minted-bo-nut-theo-quyen-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_nut_e2e
  verified_at: 2026-11-12T16:37:40Z
  output: |
    cmd: npx playwright test tests/e2e/bo-nut.spec.ts
    21 passed (15.0s)
    __EXIT=0

- eval: E14
  run_id: minted-bo-nut-theo-quyen-E14-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-12T16:37:40Z
  output: |
    cmd: design-floor-khuon.mjs --kiem --root .
    22 tệp giao diện ngoài bản đồ
    __EXIT=0

- eval: E15
  run_id: minted-bo-nut-theo-quyen-E15-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-12T16:37:40Z
  output: |
    cmd: design-floor-s4.mjs --root .
    __EXIT=0

- eval: E12
  run_id: minted-bo-nut-theo-quyen-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-12T16:37:40Z
  screenshot: evidence/E12-listings-ListAgent-360-sang.png
  observed: |
    Opened 20 of the 74 frames and read them. They match the expectation: 1440 light listings ListAgent menu on a Tôi row (frame E12-listings-ListAgent-1440-sang-menu-toi, first batch, mid-fade: the menu was partly transparent, so retaken) — the retaken TeamLead 1440 dark listings frame on a [Tên] 03 row shows "Thêm căn" at the top right beside the title "Bảng hàng · Trưởng nhóm", «…» at the end of each row, open menu Sửa + separator + red "Xoá căn". 360 dark listings ListAgent frame: "Thêm căn" under the title, «…» in the last column of every row, the owner column clipped by grid scroll. 360 light contacts TeamLead on a [Tên] 02 row: menu Sửa, Gộp với liên hệ khác…, separator, red Xoá liên hệ, Xoá tên và số theo yêu cầu. 360 light listings BuyerAgent on a Tôi row: menu has only Sửa. 360 dark contacts ListAgent on a Tôi row: Sửa, separator, red Xoá liên hệ; rows 2, 5, 8 (creator not Tôi) show no «…». 1440 dark contacts BuyerAgent: "Thêm liên hệ", «…» only on rows 1, 3, 4, 6, 7 (creator Tôi), none on rows 2, 5, 8. 360 dark listings CompanyAdmin and 1440 light contacts CompanyAdmin: title with "Quản trị sàn", box "Bạn chưa có quyền xem vùng này" with explanation, no add button, no rows, no «…». The other frames were checked through DOM assertions (item lists, button counts) identical across modes and widths; no cell differs from the per-role rules.
  network_observed: clean
  output: |
    Placement: add button beside the title at the top of the screen in all frames read; «…» in the last column of the row at 1440 and 360 PASS.
    Network/console: 0 failed requests, 0 console errors/warnings over all 32 page loads (E12-network.txt).
    Differing cells: none. Note only: at 360 the grid is a horizontally scrolled table with the «…» column at the row end, not separate cards; the owner column is partly clipped at 360 by grid scroll, not counted as a finding.

### Judgment

- eval: E1
  judged_by: judge panel (3 lens, fresh context)
  proposal: PASS
  votes:
    - domain-correctness: PASS — Mục «Bộ nút theo quyền» có đủ bảng bốn chỗ đặt (đầu màn, đầu vùng, dòng, hồ sơ) cho máy tính và điện thoại, nói thứ tự trong «…» và cách xử nút không có quyền. Khớp các dòng gate1 không bị lật (d-18, d-17, d-5, d-6, d-7) và hai chỉnh sửa sau cổng d-23, d-26.
    - operational-feasibility: PASS — Mục (behaviors.md dòng 34-59) nói đủ chỗ đặt và thứ tự trong «…», khớp d-18/d-23, d-17, S1 d-5, d-26, O1 d-6, X1 d-7. Hai chỗ lệch nhẹ: không nhắc «Ngừng bán» là đổi trạng thái qua Sửa như d-17, và chỗ đặt trong hồ sơ không có dòng sổ chốt riêng; không có điều nào mâu thuẫn.
    - spec-alignment: PASS — Mục nói đủ chỗ đặt của bốn loại nút cho hai khổ, thứ tự trong «…» và cách xử nút không có quyền. Khớp Hỏi-1 (H1: «Xoá căn», «Xoá liên hệ», 0016 được sửa), Hỏi-2 (C), và R1, O1, X1, cùng d-23 và d-26.
  human_override:  # chi nguoi ghi

- eval: E13
  judged_by: judge panel (3 lens, fresh context)
  proposal: PASS
  votes:
    - domain-correctness: PASS — Cả bốn ảnh (hộp mời 360 sáng, hộp mời 1440 tối, hộp đổi vai 360 tối, hộp đổi vai 1440 sáng) hiện đúng câu «Không đủ quyền làm việc này. Tải lại trang để thấy đúng các nút.» bằng chữ đỏ ngay trên chân hộp, đọc rõ ở cả hai nền, không lẫn câu lỗi chung.
    - operational-feasibility: PASS — Cả bốn ảnh đều hiện đúng câu riêng bằng chữ đỏ trong hộp thoại, đọc rõ ở nền sáng lẫn tối, không kèm câu lỗi chung.
    - spec-alignment: PASS — Cả bốn ảnh hiện nguyên câu «Không đủ quyền làm việc này. Tải lại trang để thấy đúng các nút.» bằng chữ đỏ, tách riêng phía trên nút «Thôi». Tương phản đủ đọc ở cả hai chế độ; đây là câu riêng cho lỗi 403.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-bo-nut-theo-quyen-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-12T16:37:40Z

- cmd: make e2e
  run_id: minted-bo-nut-theo-quyen-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-12T16:37:40Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline; chứng minh harness chứ không phải feature, cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- E4 (make check)
- E9 (npx vitest run src/modules/identity/permissions.test.ts src/modules/identity/permission-table.test.ts --coverage.enabled=false --reporter=verbose)
- E14 (design-floor-khuon.mjs --kiem --root .)
- E15 (design-floor-s4.mjs --root .)

Baseline khong do:

- npx vitest run src/modules/identity/permitted-action.test.tsx src/components/candidate/row-actions.test.tsx src/modules/identity/permissions.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep src/modules/identity/permitted-action.test.tsx co o cay dang kiem nhung chua co o merge-base fc18cb2e66d3a9c0bebd250b8f3362578b9212ff — eval moi, chay tren code cu khong phan biet gi
- npx vitest run tests/bo-nut-kiem.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/bo-nut-kiem.test.ts co o cay dang kiem nhung chua co o merge-base fc18cb2e66d3a9c0bebd250b8f3362578b9212ff — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-v} DB_PORT=${DB_PORT:-5570} npx playwright test -c playwright.db.config.ts tests/e2e-db/bo-nut-members.spec.ts: bo qua baseline: tep tests/e2e-db/bo-nut-members.spec.ts co o cay dang kiem nhung chua co o merge-base fc18cb2e66d3a9c0bebd250b8f3362578b9212ff — eval moi, chay tren code cu khong phan biet gi
- npx vitest run tests/bo-nut-vai-man.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/bo-nut-vai-man.test.ts co o cay dang kiem nhung chua co o merge-base fc18cb2e66d3a9c0bebd250b8f3362578b9212ff — eval moi, chay tren code cu khong phan biet gi
- npx playwright test tests/e2e/bo-nut.spec.ts: bo qua baseline: tep tests/e2e/bo-nut.spec.ts co o cay dang kiem nhung chua co o merge-base fc18cb2e66d3a9c0bebd250b8f3362578b9212ff — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: no machine eval failed; verdict PENDING-JUDGMENT because the judgment items E1 and E13 await a human decision at Gate 2 (judge panels proposed PASS, human_override left blank).
