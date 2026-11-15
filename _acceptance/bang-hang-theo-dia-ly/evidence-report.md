---
schema_version: 2
feature_slug: bang-hang-theo-dia-ly
verdict: REJECT
failed_evals: ["E4","E7","E8","E9","E11","E12"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 99ef513ec251c08e172313cc9a634ff4e1237146
human_signoff:
---

# Evidence Report: bang-hang-theo-dia-ly

Vòng 5. Lệnh Playwright DB `tests/e2e-db/dia-ly.spec.ts` kết thúc lỗi; lệnh này phủ sáu eval (E4, E7, E8, E9, E11, E12) và không có lệnh fail nào nằm ngoài các eval đó. Kết quả cụ thể: 1 ca đỏ (E11, mở ở 360), 31 ca bị bỏ qua, 12 ca xanh.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS (carry-forward từ round 1) |
| E2 | AC-1 | test | PASS |
| E3 | AC-2 | test | PASS |
| E4 | AC-2 | script | FAIL |
| E5 | AC-3 | test | PASS |
| E6 | AC-4 | test | PASS |
| E7 | AC-4 | script | FAIL |
| E8 | AC-5 | script | FAIL |
| E9 | AC-6 | script | FAIL |
| E10 | AC-7 | test | PASS |
| E11 | AC-8 | script | FAIL |
| E12 | AC-9 | script | FAIL |
| E13 | AC-10 | test | PASS (carry-forward từ round 4) |
| E14 | AC-10 | ui-check | PASS |
| E15 | AC-2 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-bang-hang-theo-dia-ly-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-14T17:19:00Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-bang-hang-theo-dia-ly-E2-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-15T09:30:10Z
  output: |
    npx vitest run src/modules/listings/ui/geo-tree.test.ts tests/dia-ly.test.tsx — xanh

- eval: E3
  run_id: minted-bang-hang-theo-dia-ly-E3-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-15T09:30:10Z
  output: |
    npx vitest run src/modules/listings/ui/geo-tree.test.ts tests/dia-ly.test.tsx — xanh

- eval: E4
  run_id: minted-bang-hang-theo-dia-ly-E4-r5
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-15T09:30:10Z
  output: |
    Lệnh Playwright DB cả file dia-ly.spec.ts: 1 ca đỏ, 31 bỏ qua, 12 xanh. Ca đỏ là E11 ở 360, không phải ca riêng của E4; E4 nằm trong số ca bị bỏ qua nên chưa có bằng chứng xanh.

- eval: E5
  run_id: minted-bang-hang-theo-dia-ly-E5-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-15T09:30:10Z
  output: |
    npx vitest run src/modules/listings/ui/geo-tree.test.ts tests/dia-ly.test.tsx — xanh

- eval: E6
  run_id: minted-bang-hang-theo-dia-ly-E6-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-15T09:30:10Z
  output: |
    npx vitest run src/modules/listings/ui/geo-tree.test.ts tests/dia-ly.test.tsx — xanh

- eval: E7
  run_id: minted-bang-hang-theo-dia-ly-E7-r5
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-15T09:30:10Z
  output: |
    Cùng lệnh Playwright DB: ca của E7 bị bỏ qua sau ca đỏ; chưa có bằng chứng xanh.

- eval: E8
  run_id: minted-bang-hang-theo-dia-ly-E8-r5
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-15T09:30:10Z
  output: |
    Cùng lệnh Playwright DB: ca của E8 bị bỏ qua sau ca đỏ; chưa có bằng chứng xanh.

- eval: E9
  run_id: minted-bang-hang-theo-dia-ly-E9-r5
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-15T09:30:10Z
  output: |
    Cùng lệnh Playwright DB: ca của E9 bị bỏ qua sau ca đỏ; chưa có bằng chứng xanh.

- eval: E10
  run_id: minted-bang-hang-theo-dia-ly-E10-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-15T09:30:10Z
  output: |
    make test — xanh

- eval: E11
  run_id: minted-bang-hang-theo-dia-ly-E11-r5
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-15T09:30:10Z
  output: |
    [360] tests/e2e-db/dia-ly.spec.ts:403 — E11 phone sheet closes on a pick
    Error: expect(locator).toBeVisible() failed
    Locator: [data-slot="data-region"] table[data-slot="data-grid-table"]
    Expected: visible; Timeout: 20000ms; element(s) not found
    tại settled (dia-ly.spec.ts:144) gọi từ signIn (dia-ly.spec.ts:125)
    Máy chủ web ghi nhiều dòng "kết nối rảnh bị đóng: terminating connection due to administrator command" trước khi ca đỏ.

- eval: E12
  run_id: minted-bang-hang-theo-dia-ly-E12-r5
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-15T09:30:10Z
  output: |
    Cùng lệnh Playwright DB: ca của E12 bị bỏ qua sau ca đỏ; chưa có bằng chứng xanh.

- eval: E13
  run_id: minted-bang-hang-theo-dia-ly-E13-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T23:44:13Z
  carried_from_round: 4
  note: carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E14
  run_id: minted-bang-hang-theo-dia-ly-E14-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.ui_check
  verified_at: 2026-11-15T09:30:10Z
  screenshot: evidence/E14-phan-khu-1440-sang.png
  observed: |
    E14-phan-khu-1440-sang.png: light 1440; second column shows 'Theo trạng thái' with 6 status entries, then per-project groups (Vinhomes Ocean Park 1: Tất cả, The Sapphire 1 highlighted as the only lit entry, S1.01/S1.02/S1.03/S1.05 below; Park 2 – The Empire: Tất cả, [MAU] Toà E1; Park 3 – The Crown: Tất cả, [MAU] Toà C1); no counts. Grid footer '36 / 60 dòng'; Toà filter cell 'S1.01, S1.02, S' cut, Dự án cell 'Vinhomes Ocean P' cut (full value held). E14-phan-khu-1440-toi.png: same in dark, The Sapphire 1 lit full name, 36 / 60. E14-ngan-360-sang.png: sheet open, same groups, 'Tất cả hàng' lit, names whole, no counts. E14-toa-360-sang.png: sheet closed, 'Bảng hàng' list '12 / 60 dòng', chips Toà and Dự án, rows of [MAU] Toà E1. E14-sent-1440-sang.png and E14-sent-360-sang.png: second column only group 'Đã gửi' with 'Tất cả link' lit, no tree, identical to before. E14-tuy-chinh-1440-sang.png and E14-tuy-chinh-360-sang.png: second column 'Tuỳ chỉnh của sàn' with 5 entries, 'Nhãn riêng' lit, no tree, same as before shots (only main card differs: empty state vs earlier error card).
  network_observed: clean
  output: |
    PASS /sent: 200, second column = group 'Đã gửi' with 'Tất cả link' lit, no geo-tree (0); 1440 and 360 PNGs byte-identical to the before shots.
    PASS /tuy-chinh-san (route exists): second column visually identical to before at 1440 and 360. 4/4 pairs OK.
    PASS network: only 200 responses to app origin; no failed requests, no console errors.

- eval: E15
  run_id: minted-bang-hang-theo-dia-ly-E15-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-15T09:30:10Z
  output: |
    14 tệp giao diện ngoài bản đồ

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bang-hang-theo-dia-ly-SUITE-make_check-r5
  exit_code: 0
  verified_at: 2026-11-15T09:30:10Z

- cmd: npm run build
  run_id: minted-bang-hang-theo-dia-ly-SUITE-build-r5
  exit_code: 0
  verified_at: 2026-11-15T09:30:10Z

- cmd: make e2e
  run_id: minted-bang-hang-theo-dia-ly-SUITE-make_e2e-r5
  exit_code: 0
  verified_at: 2026-11-15T09:30:10Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 2 — baseline khong do lai round nay

Eval không-phân-biệt (xanh cả trên HEAD lẫn baseline; chứng minh harness chứ không chứng minh feature): E10 (lệnh make test). Cần viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý.

Baseline không đo lại: mọi eval ghi baseline n-a vì evals.yaml không đổi từ lần đo cuối (round 2).

## Variance

none — không eval nào chạy nhiều lần (mọi eval runs 1, deterministic).

## Iterations

Round 5: E4, E7, E8, E9, E11, E12 failed — lệnh Playwright DB của dia-ly.spec.ts có 1 ca đỏ (E11 ở 360: bảng không hiện sau đăng nhập, quá 20 giây) và 31 ca bị bỏ qua; máy chủ web ghi các dòng đóng kết nối rảnh trước ca đỏ. E1 và E13 carry-forward; E2, E3, E5, E6, E10, E14, E15 và ba lệnh suite xanh. Returned to implementation. Chưa có panel judge nào; không có mục cần human_override.
