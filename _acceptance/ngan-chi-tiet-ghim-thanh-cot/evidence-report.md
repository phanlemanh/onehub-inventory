---
schema_version: 2
feature_slug: ngan-chi-tiet-ghim-thanh-cot
verdict: REJECT
failed_evals: ["E11"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 69c380e76fc3ea42359f2225767b6ffc95c7d935
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
| E11 | AC-9 | ui-check | FAIL |
| E12 | AC-9 | judgment | đề xuất PASS, chờ người chốt (xem mục Judgment) |

## Evidence

- eval: E1
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T05:11:47Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    31 passed (48.5s)
    __EXIT=0

- eval: E2
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T05:11:47Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    31 passed (48.5s)
    __EXIT=0

- eval: E3
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T05:11:47Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    31 passed (48.5s)
    __EXIT=0

- eval: E4
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E4-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T05:11:47Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    31 passed (48.5s)
    __EXIT=0

- eval: E5
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E5-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T05:11:47Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    31 passed (48.5s)
    __EXIT=0

- eval: E6
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E6-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T05:11:47Z
  output: |
    make test
    __EXIT=0

- eval: E7
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T05:11:47Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    31 passed (48.5s)
    __EXIT=0

- eval: E8
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T05:11:47Z
  output: |
    npx playwright test tests/e2e/ghim-ngan.spec.ts
    31 passed (48.5s)
    __EXIT=0

- eval: E9
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E9-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.vai_man_nut
  verified_at: 2026-11-14T05:11:47Z
  output: |
    npx vitest run tests/vai-man-nut-sinh.test.ts tests/vai-man-dau-nut.test.tsx tests/bo-nut-vai-man.test.ts src/modules/identity/permitted-action.test.tsx
    __EXIT=0

- eval: E10
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E10-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-14T05:11:47Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml
    __EXIT=0

- eval: E11
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E11-r4
  exit_code: 1
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-14T05:11:47Z
  screenshot: evidence/ghim-1440-sang.png
  observed: |
    ghim-1440-sang.png: after pinning, the record is a column flush with the right edge under the top bar, with a thin divider and a small handle at its left edge (around x=920, y=470). The grid on the left is narrowed, not covered. The record header has a title line (0905 · S1.01) and a second line with link icon, pin (unpin) icon, Trước, Sau, Đóng; the pin icon sits before Trước/Sau/Đóng. Matches Expected.
    ghim-1440-toi.png: same layout in dark theme, readable contrast, thin divider and handle visible. Matches Expected.
    ghim-1024-sang.png: the record is a rounded floating card laid over the right part of the grid; it covers the grid columns from Dự án onward. It is not a flush column, there is no left-edge handle, and the second row holds link, Trước, Sau, Đóng with NO pin button. Contradicts Expected.
    ghim-1024-toi.png: same as light, floating card over the grid, no pin button. Contradicts Expected.
    ho-so-360-sang.png: full-screen record (0905 · S1.01), link, Trước, Sau, Đóng, no Ghim button. Matches Expected.
    Overall: 1440 and 360 meet AC-9; 1024 does not (no pin button, floating card covers the table), so E11 fails.
  network_observed: clean
  output: |
    Driver: Playwright script (Chromium), dev server started on a spare port and stopped afterwards. Frames: ghim-1440-sang, ghim-1440-toi, ghim-1024-sang, ghim-1024-toi, ho-so-360-sang, plus E11-network.txt.
    Assertions: 1440 sáng và tối đạt (nút Ghim có, bấm xong thấy Bỏ ghim, Trước, Sau, Đóng). 1024 sáng và tối KHÔNG đạt: không có nút "Ghim thành cột", hồ sơ là thẻ nổi bo góc phủ lên bảng, chờ bấm quá thời hạn. 360 đạt: hồ sơ toàn màn, không có nút Ghim.
    Mạng: không có request lỗi, không có lỗi console.

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-SUITE-build-r4
  exit_code: 0
  verified_at: 2026-11-14T05:11:47Z

- cmd: make e2e
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-SUITE-make_e2e-r4
  exit_code: 0
  verified_at: 2026-11-14T05:11:47Z

### Judgment

- eval: E12
  judged_by: judge panel (3 lens, fresh context) — đề xuất, chưa phải quyết định
  proposal: PASS
  votes:
  - domain-correctness: PASS — Bốn ảnh ghim (1440 và 1024, sáng và tối): cột liền mép phải, không bóng nổi, vạch chia mảnh có tay cầm giống cột Details của app-shell-11; tay cầm nhìn thấy được cả ở nền tối. Nút Ghim ở dòng hai, sau nút liên kết và trước Trước, Sau, Đóng, khớp AC-1. Ảnh ho-so-360-sang là hồ sơ toàn màn, không có nút Ghim. Lưu ý: chỉ xem ảnh chụp, không phóng to; vạch chia nền tối ở 1440 khá mờ, chỉ tay cầm là rõ.
  - operational-feasibility: PASS — Cả bốn ảnh ghim đều có cột hồ sơ liền mép phải vùng nội dung, không bóng nổi, giữa bảng và cột có vạch mảnh kèm tay cầm nhỏ ở giữa, giống cột Details của app-shell-11. Vạch và tay cầm vẫn nhận ra được ở nền tối, dù mờ hơn ở 1440 tối. Dòng hai đầu hồ sơ theo thứ tự nút liên kết, nút Ghim (đang đã ghim), Trước, Sau, Đóng. Ảnh ho-so-360-sang là hồ sơ toàn màn, không có nút Ghim.
  - spec-alignment: PASS — Cả bốn ảnh ghim cho thấy cột chi tiết liền mép phải, không bóng nổi, có vạch chia mảnh với tay cầm nhỏ, giống cột Details của app-shell-11. Nút Ghim (hiện ở trạng thái «Bỏ ghim») đứng ở dòng hai, sau nút liên kết và trước Trước, Sau, Đóng, đúng AC-1. Ảnh ho-so-360-sang là hồ sơ toàn màn, không có nút Ghim.
  lưu ý cho người: phiếu của hội đồng mô tả ảnh 1024 như có cột ghim liền mép, trái với bước đo máy của E11 (ảnh 1024 là thẻ nổi, không có nút Ghim). Hai nguồn mâu thuẫn; người đối chiếu trực tiếp ảnh ghim-1024-sang.png và ghim-1024-toi.png ở Cổng 2.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline, chứng minh harness chứ không phải tính năng; viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- make test (E6)
- npx vitest run tests/vai-man-nut-sinh.test.ts tests/vai-man-dau-nut.test.tsx tests/bo-nut-vai-man.test.ts src/modules/identity/permitted-action.test.tsx --coverage.enabled=false --reporter=verbose (E9)
- make check (E10)

Baseline không đo:
- npx playwright test tests/e2e/ghim-ngan.spec.ts: bo qua baseline: tep tests/e2e/ghim-ngan.spec.ts co o cay dang kiem nhung chua co o merge-base 66e5a8df42fe0b0d470c8c92b5f88bc3fcd140d9 — eval moi, chay tren code cu khong phan biet gi

Lệnh fail không gắn eval: không có. Lệnh ui-check:E11 gắn eval E11 (lần chạy thất bại, được liệt kê ở trên).

Nhận xét về E11: lỗi nằm ở khổ 1024. E1 (đã xanh) lại khẳng định rằng ở 1024 với cột thứ hai App Shell mở thì vùng dữ liệu dưới 800 px, không có nút ghim và hồ sơ là thẻ nổi. Có khả năng bước chụp của E11 ở 1024 để cột thứ hai mở nên không khớp lời hứa của E11 («ảnh 1024: cột liền mép phải, có nút Ghim»). Người quyết ở Cổng 2: sửa mô tả E11 (chụp 1024 với cột thứ hai gập) hoặc xác nhận AC-9 chỉ áp dụng khi vùng đủ rộng.

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (không eval nào chạy hơn một lần).

## Iterations

Round 2: sửa Esc trong ô đang sửa, ca đối chứng đi qua kiểm tra thật, sàn 480 px cho bảng. Quay lại cài đặt.
Round 3: PASS — bằng chứng, nhật ký chạy, định tuyến máy được ghi.
Round 4: E11 không đạt — ảnh 1024 sáng và tối là thẻ nổi phủ bảng, không có nút Ghim; 1440 và 360 đạt. Trả về cho người quyết (REJECT).
