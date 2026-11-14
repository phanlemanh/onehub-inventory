---
schema_version: 2
feature_slug: ngan-chi-tiet-ghim-thanh-cot
verdict: REJECT
failed_evals: ["E6","E10"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 02d01e1c4a6dfa9321b06e3d9afeb18428c60032
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
| E6 | AC-6 | test | FAIL |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | test | PASS |
| E10 | AC-8 | script | FAIL |
| E11 | AC-9 | ui-check | PASS |
| E12 | AC-9 | judgment | PASS (de xuat cua hoi dong, cho nguoi chot) |

## Evidence

- eval: E1
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:01:04Z
  output: |
    cmd: npx playwright test tests/e2e/ghim-ngan.spec.ts
    27 passed (34.4s)

- eval: E2
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:01:04Z
  output: |
    cmd: npx playwright test tests/e2e/ghim-ngan.spec.ts
    27 passed (34.4s)

- eval: E3
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:01:04Z
  output: |
    cmd: npx playwright test tests/e2e/ghim-ngan.spec.ts
    27 passed (34.4s)

- eval: E4
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:01:04Z
  output: |
    cmd: npx playwright test tests/e2e/ghim-ngan.spec.ts
    27 passed (34.4s)

- eval: E5
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:01:04Z
  output: |
    cmd: npx playwright test tests/e2e/ghim-ngan.spec.ts
    27 passed (34.4s)

- eval: E6
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E6-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T04:01:04Z
  output: |
    cmd: make test
    proof-gate: 1 loi, mau tep chung minh tools/proof_gate/khuon-chung-minh.md
    FAIL tools/proof_gate/proof-gate.test.ts > kho that > luoi xanh tren chinh kho (stderr khong rong)
    FAIL tools/proof_gate/proof-gate.test.ts > kho that > them vong implemented khai Bang hang ma thieu chung minh thi do
    Test Files  3 failed | 94 passed (97)
    Tests  7 failed | 1684 passed (1691)

- eval: E7
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:01:04Z
  output: |
    cmd: npx playwright test tests/e2e/ghim-ngan.spec.ts
    27 passed (34.4s)

- eval: E8
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T04:01:04Z
  output: |
    cmd: npx playwright test tests/e2e/ghim-ngan.spec.ts
    27 passed (34.4s)

- eval: E9
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.vai_man_nut
  verified_at: 2026-11-14T04:01:04Z
  output: |
    cmd: npx vitest run tests/vai-man-nut-sinh.test.ts tests/vai-man-dau-nut.test.tsx tests/bo-nut-vai-man.test.ts src/modules/identity/permitted-action.test.tsx
    cac tep kiem xanh

- eval: E10
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E10-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-14T04:01:04Z
  output: |
    cmd: make check
    proof-gate: 1 loi, mau tep chung minh tools/proof_gate/khuon-chung-minh.md
    FAIL tools/proof_gate/proof-gate.test.ts > kho that > luoi xanh tren chinh kho
    FAIL tools/proof_gate/proof-gate.test.ts > kho that > them vong implemented khai Bang hang ma thieu chung minh thi do
    Test Files  3 failed | 94 passed (97)
    Tests  7 failed | 1684 passed (1691)

- eval: E11
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check.browser
  verified_at: 2026-11-14T04:01:04Z
  screenshot: evidence/E11-step1.png
  observed: |
    E11-step1 (1440 sang): ho so 0905 · S1.01 la cot lien mep phai duoi thanh tren, co vach chia manh va tay cam o mep trai cot; bang ben trai khong bi che; dong hai dau ho so co lien ket, nut bo ghim, Truoc, Sau, Dong.
    E11-step2 (1440 toi) va E11-step3, E11-step4 (1024 sang, toi): cung dang cot, vach chia va tay cam thay ro, bang khong bi che. E11-step5 (360 sang): ho so toan man, dong nut chi co lien ket, Truoc, Sau, Dong, khong nut ghim, khong vach chia. Nam khung khop expected.
  network_observed: no-app-traffic

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-14T04:01:04Z

- cmd: make e2e
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-SUITE-make_e2e-r1
  exit_code: 2
  verified_at: 2026-11-14T04:01:04Z
  output: |
    1035 passed, 679 skipped, 2 failed (7.4m), ca hai o khổ 1440
    [1440] tests/e2e/behavior.spec.ts:117 behavior > focus check fails when focus is left elsewhere
    [1440] tests/e2e/ho-so-du-thong-tin.spec.ts:227 E8 the record only reads: bao "unexpected button: Ghim thành cột" (nut Ghim moi bi coi la nut la o ho so chi doc)

Lệnh fail không gắn eval nào: make e2e (khong gan eval). Hai lenh khac that bai deu da gan eval: make test (E6), make check (E10).

### Judgment

- eval: E12
  judged_by: hoi dong de xuat (3 lens), cho nguoi chot
  proposal: PASS
  - domain-correctness: PASS — Bốn ảnh ghim (1440 sáng/tối, 1024 sáng/tối) đều có cột liền mép phải, không bóng nổi, có vạch chia mảnh với tay cầm giống app-shell-11, và nút Bỏ ghim nằm ở dòng hai ngay trước Trước/Sau/Đóng đúng AC-1. Ảnh ho-so-360-sang là hồ sơ toàn màn, không có nút Ghim. Vạch chia ở nền tối mảnh và mờ nhưng vẫn thấy, ngang mức vạch trong ảnh tham chiếu.
  - operational-feasibility: PASS — Cả bốn ảnh ghim (1440 và 1024, sáng và tối) có cột hồ sơ liền mép phải, không bóng nổi, và vạch chia mảnh có tay cầm giữa bảng và cột. Dáng này giống cột Details của app-shell-11. Tay cầm vẫn thấy được ở nền tối, tuy mờ hơn. Nút Ghim (biểu tượng bỏ ghim) nằm ở dòng hai, sau nút liên kết của bản ghi và ngay trước Trước, Sau, Đóng, đúng chỗ AC-1. Ảnh ho-so-360-sang là hồ sơ toàn màn, không có nút Ghim.
  - spec-alignment: PASS — Bốn ảnh 1440 và 1024, sáng và tối, đều cho thấy cột chi tiết liền mép phải, không bóng nổi, có vạch mảnh kèm tay cầm giữa bảng và cột như cột Details của app-shell-11. Tay cầm thấy rõ ở nền tối (1024 tối hơi mờ nhưng vẫn nhìn ra). Nút Ghim đứng sau nút liên kết và ngay trước Trước, Sau, Đóng ở dòng hai, đúng AC-1. Ảnh ho-so-360-sang là hồ sơ toàn màn, không có nút Ghim.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả bản mới lẫn bản cũ): E9 (npx vitest run tests/vai-man-nut-sinh.test.ts tests/vai-man-dau-nut.test.tsx tests/bo-nut-vai-man.test.ts src/modules/identity/permitted-action.test.tsx). Cần viết lại để khẳng định hành vi mới, hoặc xác nhận là lưới hồi quy có chủ ý.

Baseline không đo:
- npx playwright test tests/e2e/ghim-ngan.spec.ts: bo qua baseline: tep tests/e2e/ghim-ngan.spec.ts co o cay dang kiem nhung chua co o merge-base 66e5a8df42fe0b0d470c8c92b5f88bc3fcd140d9 — eval moi, chay tren code cu khong phan biet gi

Nhận định: E6 và E10 xanh trên bản cũ (baseline green) nhưng đỏ trên bản mới, nên là hồi quy do thay đổi này: cổng chứng minh (proof-gate) báo lỗi ở mẫu tệp chứng minh tools/proof_gate/khuon-chung-minh.md. make e2e cũng có hai ca đỏ ở khổ 1440: nút Ghim thành cột mới bị bài kiểm "hồ sơ chỉ đọc" coi là nút lạ (ho-so-du-thong-tin.spec.ts:227), và ca kiểm tiêu điểm behavior.spec.ts:117.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E6, E10 failed — cổng proof-gate đỏ trên chính kho (mẫu tệp chứng minh), kéo theo make test và make check; make e2e còn hai ca đỏ ở 1440 (nút Ghim bị bài kiểm hồ sơ chỉ đọc coi là nút lạ, và ca tiêu điểm). Returned to implementation.
