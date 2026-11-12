---
schema_version: 2
feature_slug: cach-ly-dang-xem-chi-ghi
verdict: REJECT
failed_evals: ["E1","E2","E3","E4","E5","E6","E7"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a8383ef609e96581c7c7a886165bed14447bdad8
human_signoff:
---

# Evidence Report: cach-ly-dang-xem-chi-ghi

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | FAIL |
| E2 | AC-2 | script | FAIL |
| E3 | AC-3 | script | FAIL |
| E4 | AC-4 | script | FAIL |
| E5 | AC-5 | script | FAIL |
| E6 | AC-6 | script | FAIL |
| E7 | AC-7 | script | FAIL |
| E8 | AC-7 | script | PASS |

E1 đến E5 cùng chạy trong một lệnh (bộ chạy cach-ly.sh rồi tests/db/cach-ly.db.test.ts); lệnh này thoát khác 0 với 2 ca đỏ trên 12 ca. E6 và E7 cùng chạy trong một lệnh (toàn bộ tests/db); lệnh này thoát khác 0 với 1 ca đỏ trên 92 ca. Hai lệnh fail không gắn eval riêng nào ngoài các eval đã nêu.

## Evidence

- eval: E1
  run_id: minted-cach-ly-dang-xem-chi-ghi-E1-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.cach_ly_c
  verified_at: 2026-11-12T15:04:05Z
  output: |
    Lệnh chung E1-E5: DB_LANE=${DB_LANE:-c} DB_PORT=${DB_PORT:-5569} bash -c 'bash db/scripts/cach-ly.sh && npx vitest run -c vitest.db.config.ts tests/db/cach-ly.db.test.ts --reporter=verbose'
    FAIL tests/db/cach-ly.db.test.ts > isolation runner (31 ca đạt, vai quy_hang_app)
    expect(r.code, r.out).toBe(0)  (tests/db/cach-ly.db.test.ts:307)
    Test Files  1 failed (1)
    Tests  2 failed | 10 passed (12)

- eval: E2
  run_id: minted-cach-ly-dang-xem-chi-ghi-E2-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.cach_ly_c
  verified_at: 2026-11-12T15:04:05Z
  output: |
    FAIL tests/db/cach-ly.db.test.ts > isolation runner names every broken break file (E9b)
    AssertionError: expected [ …(2) ] to deeply equal [ …(4) ]
    HỎNG pha-thu-dang-xem-vuot: dang-xem-vat-chat: không dựng được bản phá
    Test Files  1 failed (1)

- eval: E3
  run_id: minted-cach-ly-dang-xem-chi-ghi-E3-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.cach_ly_c
  verified_at: 2026-11-12T15:04:05Z
  output: |
    Cùng lệnh chung E1-E5; kết quả lệnh là đỏ (2 ca đỏ trên 12).
     Ca E3 không được tách riêng trong phần đuôi kết quả máy; lệnh chứa nó thoát khác 0 nên eval ghi đỏ.

- eval: E4
  run_id: minted-cach-ly-dang-xem-chi-ghi-E4-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.cach_ly_c
  verified_at: 2026-11-12T15:04:05Z
  output: |
    Mong đợi 'HỎNG pha-thu-dang-xem-chi-ghi: dang-xem-chi-xoa: bộ kiểm vẫn xanh trên bản phá' trong danh sách HỎNG.
    Thực nhận: chỉ 2 dòng HỎNG (thiếu dòng trên, thiếu dòng ham-trigger-dac-quyen);
    HỎNG pha-thu-dang-xem-vuot: dang-xem-vat-chat: không dựng được bản phá
    Tests  2 failed | 10 passed (12)

- eval: E5
  run_id: minted-cach-ly-dang-xem-chi-ghi-E5-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.cach_ly_c
  verified_at: 2026-11-12T15:04:05Z
  output: |
    Cùng lệnh chung E1-E5; lệnh thoát khác 0 nên eval ghi đỏ.
    Ca E5 không được tách riêng trong phần đuôi kết quả máy.
    Test Files  1 failed (1)

- eval: E6
  run_id: minted-cach-ly-dang-xem-chi-ghi-E6-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.cach_ly_7b_db_c
  verified_at: 2026-11-12T15:04:05Z
  output: |
    Lệnh chung E6-E7: DB_LANE=${DB_LANE:-c} DB_PORT=${DB_PORT:-5569} npx vitest run -c vitest.db.config.ts tests/db --reporter=verbose
    Lệnh thoát khác 0 (1 ca đỏ trên 92), nên eval ghi đỏ; ca pha-thu-moi-khong-kiem-quan-tri không được tách riêng trong phần đuôi.
    Test Files  1 failed | 5 passed (6)

- eval: E7
  run_id: minted-cach-ly-dang-xem-chi-ghi-E7-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.cach_ly_7b_db_c
  verified_at: 2026-11-12T15:04:05Z
  output: |
    ERROR:  database "cach_ly_pha_dang_xem_vat_chat" does not exist
    FAIL tests/db/cach-ly.db.test.ts (expected 2 to be +0)
    Test Files  1 failed | 5 passed (6)
    Tests  1 failed | 91 passed (92)

- eval: E8
  run_id: minted-cach-ly-dang-xem-chi-ghi-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-12T15:04:05Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-cach-ly-dang-xem-chi-ghi-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-12T15:04:05Z

- cmd: make e2e
  run_id: minted-cach-ly-dang-xem-chi-ghi-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-12T15:04:05Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline): E8 (make check). Đây chỉ là bằng chứng hạ tầng/hồi quy, không chứng minh hành vi mới; chấp nhận như lưới hồi quy có chủ ý.

Baseline không đo:
- DB_LANE=${DB_LANE:-c} DB_PORT=${DB_PORT:-5569} npx vitest run -c vitest.db.config.ts tests/db --reporter=verbose: baseline vuột trần 180 giây/lệnh — đã dừng cả cây tiến trình; BLOCKED hạ tầng, không phải kết quả của code cũ

Ghi chú: tên cơ sở nháp 'cach_ly_pha_dang_xem_vat_chat' không tồn tại là triệu chứng ở bước dựng bản phá (xem E2, E7), cần điều tra ở vòng sau. Mục «Ngoài hợp đồng» và «Known limits» giữ trống; các phát hiện ngoài hợp đồng nằm ở review-findings.md.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1, E2, E3, E4, E5, E6, E7 failed — bộ chạy cach-ly không dựng được bản phá dang-xem-vat-chat (cơ sở nháp không tồn tại), nên ca chạy-bộ-chạy và ca đặt tên bản phá đỏ; các eval gắn hai lệnh này cùng đỏ. Returned to implementation.
