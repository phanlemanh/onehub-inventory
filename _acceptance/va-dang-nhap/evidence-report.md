---
schema_version: 2
feature_slug: va-dang-nhap
verdict: REJECT
failed_evals: ["E2","E3","E4","E5","E6","E7","E8","E9","E13","E14","E16","E12","E15"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: cc14b44e17c9e3b217600d5c146658eee2bca01b
human_signoff:
---

# Evidence Report: va-dang-nhap

Round 1. Nội dung này thay toàn bộ round cũ; lịch sử round nằm ở mục Iterations.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | script | FAIL |
| E3 | AC-2 | script | FAIL |
| E4 | AC-3 | script | FAIL |
| E5 | AC-3 | script | FAIL |
| E6 | AC-4 | script | FAIL |
| E7 | AC-5 | script | FAIL |
| E8 | AC-5 | script | FAIL |
| E9 | AC-6 | script | FAIL |
| E10 | AC-7 | script | PASS |
| E11 | AC-7 | script | PASS |
| E12 | AC-7 | script | FAIL |
| E13 | AC-7 | script | FAIL |
| E14 | AC-8 | script | FAIL |
| E15 | AC-8 | ui-check | FAIL |
| E16 | AC-6 | script | FAIL |

Các eval E2 đến E9, E13, E14, E16 dùng chung một lệnh `DB_LANE=r DB_PORT=5565 npx playwright test -c playwright.db.config.ts`. Lệnh đó kết thúc đỏ (1 lượt, 0 đạt, bản ghi cuối báo 7 đạt) và các ca của login.spec.ts và va-dang-nhap.spec.ts ở khổ 1024 và 1440 nằm trong danh sách bản ghi cuối của lệnh.

Lệnh fail không gắn eval: `npm run build` (lỗi ENOTEMPTY khi xoá thư mục `.next/e2e-db-1267/dev/logs`, lệnh chạy chồng với thư mục tạm của lượt e2e). Ba lệnh fail còn lại đều gắn eval: lệnh playwright gắn E2 đến E9, E13, E14, E16; `make check` gắn E12; `ui-check:E15` gắn E15.

## Evidence

- eval: E1
  run_id: minted-va-dang-nhap-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T09:32:12Z
  output: |
    make test chạy xong, kết thúc xanh.

- eval: E2
  run_id: minted-va-dang-nhap-E2-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T09:32:12Z
  output: |
    Lệnh playwright dùng chung kết thúc đỏ; bản ghi cuối: 7 passed (20.6m).
    Các ca đỏ/không xanh có mặt trong danh sách: next-lach-may-chu, next-lach-sau-go-ma, next-lach-chon-san (khổ 1024 và 1440).

- eval: E3
  run_id: minted-va-dang-nhap-E3-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T09:32:12Z
  output: |
    Cùng lệnh playwright dùng chung; ca next-lach-sau-go-ma và next-lach-may-chu nằm trong danh sách không xanh.

- eval: E4
  run_id: minted-va-dang-nhap-E4-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T09:32:12Z
  output: |
    Cùng lệnh playwright dùng chung; ca dang-xuat-mang-dut và dang-xuat-may-chu-loi nằm trong danh sách không xanh.

- eval: E5
  run_id: minted-va-dang-nhap-E5-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T09:32:12Z
  output: |
    Cùng lệnh playwright dùng chung; ca dang-xuat-mang-dut và dang-xuat-may-chu-loi nằm trong danh sách không xanh.

- eval: E6
  run_id: minted-va-dang-nhap-E6-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T09:32:12Z
  output: |
    Cùng lệnh playwright dùng chung; ca dang-xuat-duoc và dang-xuat (hàng 8) nằm trong danh sách không xanh.

- eval: E7
  run_id: minted-va-dang-nhap-E7-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T09:32:12Z
  output: |
    Cùng lệnh playwright dùng chung; ca het-san-co-loi-thoat nằm trong danh sách không xanh.

- eval: E8
  run_id: minted-va-dang-nhap-E8-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T09:32:12Z
  output: |
    Cùng lệnh playwright dùng chung; ca het-san-co-loi-thoat nằm trong danh sách không xanh.

- eval: E9
  run_id: minted-va-dang-nhap-E9-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T09:32:12Z
  output: |
    Cùng lệnh playwright dùng chung; ca het-san-dang-xuat-loi và het-san-may-chu-loi nằm trong danh sách không xanh.

- eval: E13
  run_id: minted-va-dang-nhap-E13-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T09:32:12Z
  output: |
    Cùng lệnh playwright dùng chung; tám ca của login.spec.ts (mot-san-vao-thang đến axe-sang-toi) nằm trong danh sách không xanh ở khổ 1024 và 1440.

- eval: E14
  run_id: minted-va-dang-nhap-E14-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T09:32:12Z
  output: |
    Cùng lệnh playwright dùng chung; ca axe-sang-toi-1m nằm trong danh sách không xanh ở khổ 1024 và 1440.

- eval: E16
  run_id: minted-va-dang-nhap-E16-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T09:32:12Z
  output: |
    Cùng lệnh playwright dùng chung; ca het-san-dang-xuat-loi và het-san-may-chu-loi nằm trong danh sách không xanh.

- eval: E10
  run_id: minted-va-dang-nhap-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.va_dang_nhap_db
  verified_at: 2026-11-11T09:32:12Z
  output: |
    vitest -c vitest.db.config.ts kết thúc xanh trên Postgres dãy R.

- eval: E11
  run_id: minted-va-dang-nhap-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.va_dang_nhap_cach_ly
  verified_at: 2026-11-11T09:32:12Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E12
  run_id: minted-va-dang-nhap-E12-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-11T09:32:12Z
  output: |
    make check dừng ở bước lint: 200 problems (189 errors, 11 warnings), phần lớn là 'args' / 'log' / 'phase' is not defined (no-undef).
    make: *** [lint] Error 1

- eval: E15
  run_id: minted-va-dang-nhap-E15-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-11T09:32:12Z
  screenshot: evidence/E15-step1.png
  observed: |
    step1 (360 sáng): thẻ "Đăng nhập" giữa màn với câu "Tài khoản của bạn không còn thuộc sàn nào. Nhờ quản trị sàn mời lại, hoặc đăng xuất để dùng email khác." và nút "Đăng xuất" full-width; không có danh sách sàn, không cuộn ngang. Khớp Expected. step2 (1440 tối): cùng thẻ, nền gần đen chữ trắng, đọc được. Khớp.
    step3 (414 sáng, đăng xuất lỗi ở trạng thái hết sàn): thẻ còn nguyên và người vẫn ở trang, nhưng câu "Chưa đăng xuất được. Bạn vẫn đang đăng nhập trên…" chỉ hiện là một dải xám nhạt bị cắt ở mép dưới khung (khoảng y 890 trên 896), chỉ thấy nửa trên dòng đầu, không đọc được. Trái với Expected nên khung này FAIL.
    step4 (1440 sáng, lỗi từ menu tài khoản): trang "Hôm nay" còn mở; toast trắng góc dưới phải đọc rõ, nằm trên nội dung, không che nút. Khớp. step5 (360 tối): trang Hôm nay còn mở, nền và chữ đổi, không cuộn ngang; chữ toast bị huy hiệu Next dev che một phần ("Đăng xu…t»") — ghi chú, lớp phủ chỉ có ở dev.
  network_observed: n-a (driver)

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-va-dang-nhap-SUITE-build-r1
  exit_code: 1
  verified_at: 2026-11-11T09:32:12Z

- cmd: make e2e
  run_id: minted-va-dang-nhap-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-11T09:32:12Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả code mới lẫn baseline, chứng minh harness chứ không chứng minh feature; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- E1 (`make test`): baseline green.
- E10 (`vitest -c vitest.db.config.ts`): baseline green.
- E11 (`db/scripts/cach-ly.sh`): baseline green.

Cả ba là bộ kiểm hồi quy của hàng 8 và hàng 7 nên có thể là guard có chủ ý; cần chủ kho xác nhận. Các eval E2 đến E9, E13, E14, E16 đều red trên baseline (có phân biệt). E12 xanh trên baseline nhưng đỏ ở code hiện tại.

Không có mục judgment nào trong hợp đồng này nên không có hội đồng chấm.

## Variance

none — mọi eval chạy một lần (runs 1), không có pass_rate.

## Iterations

Round 1: E2, E3, E4, E5, E6, E7, E8, E9, E13, E14, E16 không xanh (lệnh playwright dùng chung kết thúc đỏ); E12 đỏ ở bước lint của make check; E15 đỏ vì khung step3 không đọc được câu báo đăng xuất lỗi. Returned to implementation.
