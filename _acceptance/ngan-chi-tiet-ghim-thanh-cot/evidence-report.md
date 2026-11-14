---
schema_version: 2
feature_slug: ngan-chi-tiet-ghim-thanh-cot
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 142f3fe68c1e1d3a002c3a4a16a61655b404f687
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
| E12 | AC-9 | judgment | PASS (đề xuất của hội đồng, chờ người chốt ở Cổng 2) |

## Evidence

- eval: E1
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:30:35Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    30 passed (42.7s)

- eval: E2
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:30:35Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    30 passed (42.7s)

- eval: E3
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:30:35Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    30 passed (42.7s)

- eval: E4
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:30:35Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    30 passed (42.7s)

- eval: E5
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:30:35Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    30 passed (42.7s)

- eval: E6
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E6-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T04:30:35Z
  output: |
    make test
    hoàn tất, không có ca thất bại

- eval: E7
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:30:35Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    30 passed (42.7s)

- eval: E8
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:30:35Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    30 passed (42.7s)

- eval: E9
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E9-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.vai_man_nut
  verified_at: 2026-11-14T04:30:35Z
  output: |
    npx vitest run tests/vai-man-nut-sinh.test.ts tests/vai-man-dau-nut.test.tsx tests/bo-nut-vai-man.test.ts src/modules/identity/permitted-action.test.tsx
    các bộ kiểm đều qua

- eval: E10
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E10-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-14T04:30:35Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml

- eval: E11
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ui_check
  verified_at: 2026-11-14T04:30:35Z
  screenshot: evidence/ghim-1440-sang.png
  observed: |
    1440 sáng (ghim-1440-sang.png): hồ sơ "0905 · S1.01" là cột liền mép phải, ngay dưới thanh trên; vạch chia mảnh có tay cầm nhỏ ở mép trái cột (khoảng x=919); bảng "Bảng hàng" bên trái hiện đủ, không bị che. Dòng hai có nút liên kết, nút bỏ ghim (đang bấm), "Trước" (mờ), "Sau", "Đóng". Khớp Expected.
    1440 tối (ghim-1440-toi.png): cùng bố cục ở nền tối, vạch chia, tay cầm, bảng và thứ tự nút như ảnh sáng. Khớp.
    1024 sáng và tối (ghim-1024-sang.png, ghim-1024-toi.png): cột vẫn liền mép phải dưới thanh trên, vạch chia và tay cầm ở mép trái (khoảng x=606); bảng bị ép về bên trái (thấy cột Căn và Toà) nhưng không bị che; dòng hai: liên kết, bỏ ghim (đang bấm), Trước, Sau, Đóng. Khớp.
    360 sáng (ho-so-360-sang.png): hồ sơ phủ toàn màn với tiêu đề "0905 · S1.01"; dòng hai có liên kết, Trước, Sau, Đóng; không có nút Ghim. Khớp.
    Không ảnh nào mâu thuẫn Expected. Ghi chú nhỏ: sau khi bấm ở 1440 và 1024, tên nút đổi sang biểu tượng bỏ ghim, đó là trạng thái đang bấm, không phải lỗi.
  network_observed: no-app-traffic

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-14T04:30:35Z

- cmd: make e2e
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-SUITE-make_e2e-r3
  exit_code: 0
  verified_at: 2026-11-14T04:30:35Z

### Hội đồng chấm E12 (đề xuất — chờ người chốt)

- eval: E12
  proposal: PASS
  judged_by: judge panel (fresh context)
  - domain-correctness: PASS — Cả bốn ảnh ghim 1440 và 1024, sáng và tối, có cột chi tiết liền mép phải, vạch chia mảnh có tay cầm giữa nội dung và cột, không bóng nổi; vạch vẫn thấy ở nền tối. Nút Ghim ở dòng hai, sau nút liên kết và ngay trước Trước, Sau, Đóng, đúng AC-1. Ảnh 360 là hồ sơ toàn màn, không có nút Ghim. Chỉ xem ảnh nên không kiểm được tên nút hay aria-pressed.
  - operational-feasibility: PASS — Cột chi tiết liền mép phải, không bóng nổi, có vạch chia mảnh với tay cầm thấy được, cùng dáng cột Details của app-shell-11. Ở nền tối tay cầm vẫn rõ, đường vạch mờ nhưng cùng mức khối mẫu. Nút Ghim (dạng bỏ ghim) ở dòng hai trước Trước, Sau, Đóng. Ảnh 360 không có nút Ghim.
  - spec-alignment: PASS — Bốn ảnh ghim có cột chi tiết liền mép phải, vạch chia mảnh có tay cầm, không bóng nổi, giống cột Details của app-shell-11; vạch vẫn thấy ở nền tối dù tương phản thấp. Nút Ghim ở dòng hai, sau nút liên kết và trước Trước, Sau, Đóng. Ảnh 360 là hồ sơ toàn màn, không có nút Ghim.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả mã hiện tại lẫn baseline), là hộ vệ hồi quy hoặc cần viết lại để khẳng định hành vi mới:
- make test: E6
- npx vitest run tests/vai-man-nut-sinh.test.ts tests/vai-man-dau-nut.test.tsx tests/bo-nut-vai-man.test.ts src/modules/identity/permitted-action.test.tsx --coverage.enabled=false --reporter=verbose: E9
- make check: E10

Baseline khong do
- npx playwright test tests/e2e/ghim-ngan.spec.ts: bo qua baseline: tep tests/e2e/ghim-ngan.spec.ts co o cay dang kiem nhung chua co o merge-base 66e5a8df42fe0b0d470c8c92b5f88bc3fcd140d9 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy một lần, xác định, không có phương sai.

## Iterations

Round 1: bản dựng đầu, trả về triển khai để sửa theo bằng chứng bằng chứng gửi, nút chỉ đọc và tiêu điểm chỉ cho dòng được thay (commit 56dc1e9).
Round 2: sửa Esc trong ô đang sửa, ca phá chạy qua các phép kiểm thật, sàn 480 px cho lưới (commit 142f3fe).
Round 3: toàn bộ eval máy xanh trên cây 142f3fe; ba eval hồi quy (E6, E9, E10) xanh cả trên baseline; chờ người chốt E12 và ký ở Cổng 2.
