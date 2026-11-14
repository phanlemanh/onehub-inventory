---
schema_version: 2
feature_slug: ngan-chi-tiet-ghim-thanh-cot
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 56dc1e95215e20741d241372fb5b4cadc3bc1472
human_signoff:
---

# Evidence Report: ngan-chi-tiet-ghim-thanh-cot

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | test | PASS |
| E10 | AC-8 | script | PASS |
| E11 | AC-9 | ui-check | PASS |
| E12 | AC-9 | judgment | PASS (đề xuất của hội đồng, chờ người chốt) |

## Evidence

- eval: E1
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:15:25Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    27 passed (33.3s)

- eval: E2
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:15:25Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    27 passed (33.3s)

- eval: E3
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:15:25Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    27 passed (33.3s)

- eval: E4
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:15:25Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    27 passed (33.3s)

- eval: E5
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:15:25Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    27 passed (33.3s)

- eval: E6
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T04:15:25Z
  output: |
    make test
    (tóm tắt chạy bộ kiểm đơn vị kết thúc thành công)

- eval: E7
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:15:25Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    27 passed (33.3s)

- eval: E8
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:15:25Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    27 passed (33.3s)

- eval: E9
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_man_nut
  verified_at: 2026-11-14T04:15:25Z
  output: |
    npx vitest run tests/vai-man-nut-sinh.test.ts tests/vai-man-dau-nut.test.tsx tests/bo-nut-vai-man.test.ts src/modules/identity/permitted-action.test.tsx
    (bốn tệp kiểm chạy xong thành công)

- eval: E10
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-14T04:15:25Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml

- eval: E11
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-14T04:15:25Z
  screenshot: evidence/ghim-1440-sang.png
  observed: |
    I opened all 5 frames with Read. ghim-1440-sang: the profile (0905 · S1.01) is a column flush to the right edge, directly under the top bar, with a thin divider line and a small grip handle at its left edge (x~919). The table on the left is fully visible and not covered. Row two of the profile header reads: link icon, pinned/unpin icon, Trước, Sau, Đóng. ghim-1440-toi: same layout in dark theme, divider and grip visible, table intact, readable. ghim-1024-sang: same column layout; the table is narrowed (toolbar wraps, columns Căn and Toà visible) but not covered by the profile; the pin icon sits before Trước, Sau, Đóng; the grip is at x~606. ghim-1024-toi: same in dark. ho-so-360-sang: profile is full screen with no table behind it; header row has link icon, Trước, Sau, Đóng and no Ghim button. This matches Expected.
  network_observed: no-app-traffic

- eval: E12
  judged_by: hội đồng ba góc nhìn (fresh context), đề xuất PASS
  verdict: PASS
  rationale: Cả ba góc nhìn thấy cột hồ sơ liền mép phải, vạch chia mảnh có tay cầm, nút Ghim ở dòng hai trước Trước, Sau, Đóng; ảnh 360 toàn màn không có nút Ghim.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-14T04:15:25Z

- cmd: make e2e
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-14T04:15:25Z

## Judge panels (đề xuất)

E12 (AC-9) — đề xuất PASS; human_override để trống cho người chốt ở Cổng 2.

- domain-correctness: PASS — Cả bốn ảnh (ghim-1440-sang, ghim-1440-toi, ghim-1024-sang, ghim-1024-toi) có cùng dáng với cột Details của app-shell-11: cột liền mép phải, không bóng nổi, vạch chia mảnh có tay cầm giữa nội dung và cột (x≈919 ở 1440, x≈605 ở 1024), tay cầm thấy rõ cả nền sáng lẫn tối. Ở ảnh tối tôi chỉ thấy rõ tay cầm, không chắc thấy đường vạch mảnh vì không phóng to được. Nút Ghim nằm ở dòng hai của đầu hồ sơ, sau nút liên kết và trước Trước, Sau, Đóng, đúng AC-1. Ảnh ho-so-360-sang là hồ sơ toàn màn và không có nút Ghim.
- operational-feasibility: PASS — Cả bốn ảnh ghim (1440 và 1024, sáng và tối) cho thấy cột hồ sơ liền mép phải, không bóng nổi. Có vạch chia mảnh với tay cầm nhỏ giữa bảng và cột, nhìn thấy được cả ở nền tối, giống cột Details của app-shell-11. Dòng hai của đầu hồ sơ có nút liên kết, rồi nút Ghim chỉ biểu tượng (đang ở trạng thái «Bỏ ghim»), rồi Trước, Sau, Đóng, đúng chỗ AC-1. Ảnh ho-so-360-sang là hồ sơ toàn màn, không có nút Ghim.
- spec-alignment: PASS — Cả bốn ảnh ghim (1440 sáng/tối, 1024 sáng/tối) cho thấy cột chi tiết liền mép phải, không bóng nổi. Giữa bảng và cột có vạch chia mảnh với tay cầm nhỏ ở giữa, giống cột Details của app-shell-11. Vạch và tay cầm vẫn thấy được ở nền tối, tuy mờ. Dòng hai của đầu hồ sơ có nút link, rồi nút Ghim (biểu tượng ghim gạch chéo, trạng thái "Bỏ ghim"), rồi Trước, Sau, Đóng, đúng chỗ AC-1 đặt. Ảnh ho-so-360-sang là hồ sơ toàn màn, dòng hai chỉ có link, Trước, Sau, Đóng, không có nút Ghim.

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi). Mọi field baseline của eval đều ghi n-a vì round này không đo.

Eval không phân biệt (xanh cả trên HEAD lẫn baseline, theo danh sách máy cung cấp):
- E9 (AC-8): lệnh vitest cho bộ sinh bảng vai × màn × nút. Cần viết lại để khẳng định hành vi mới, hoặc xác nhận đây là regression-guard có chủ ý.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: sửa theo vòng một (bằng chứng đã gửi, nút chỉ đọc, tiêu điểm chỉ cho dòng bị thay) — commit 56dc1e9.
Round 2: mọi lệnh máy xanh và E12 được đề xuất PASS, nhưng phép kiểm xét lại tìm thấy lỗ hổng chứng minh trong hợp đồng (AC-1, AC-2, AC-5, AC-7 — xem review-findings.md). Verdict REJECT, trả về triển khai.
