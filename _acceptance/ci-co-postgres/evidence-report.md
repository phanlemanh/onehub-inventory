---
schema_version: 2
feature_slug: ci-co-postgres
verdict: REJECT
failed_evals: ["E1","E2","E5","E6","E8b","E10"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6ae164b6b1ecc7d875abc055a46b604fa0715d42
human_signoff:
---

# Evidence Report: ci-co-postgres

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | FAIL |
| E2 | AC-2 | script | FAIL |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | script | FAIL |
| E6 | AC-6 | script | FAIL |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E8b | AC-8 | script | FAIL |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | script | FAIL |

## Evidence

Các lệnh ci-thu và ci-that thất bại được ghi trung thực bên dưới. Lệnh `bash db/scripts/ci-thu.sh` (E1, E2, E5, E6, E8b) thoát khác 0: lượt xanh trong bản sao nóng đạt 6/6 bước và make check xanh, nhưng ba pha phá đều không ra kết quả mong đợi. Lệnh `node db/scripts/ci-that.mjs --cho 60` (E10) thoát khác 0 vì chưa có lượt CI nào trên đầu nhánh 6ae164b.

- eval: E1
  run_id: minted-ci-co-postgres-E1-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.ci_db_thu
  verified_at: 2026-11-13T13:02:00Z
  output: |
    tep: tests/e2e-db/vai-noi.spec.ts dat 1
    giao: 32 · nhan: 32 · roi: 0 · do nham: 0
    ci-db: dem đạt (mã 0, 0 giây)
    ci-db: 6/6 bước đạt
    ci-thu: xanh? khong · 13.6 phut · check xanh · pha bo-phien do · pha vai-chu do · pha may-chu-chu XANH

- eval: E2
  run_id: minted-ci-co-postgres-E2-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.ci_db_thu
  verified_at: 2026-11-13T13:02:00Z
  output: |
    [pha vai-chu] ci-db: ── cach-ly
    [pha vai-chu]   [pha-thu bo-ep-luat] HỎNG moi-bang-cong-ty-ep-luat-theo-dong: agreements chưa bật và ép luật theo dòng
    [pha vai-chu]   [pha-thu goc-nhin-bo-ep-luat] HỎNG vai-api-chi-cham-bang-co-luat: public.saved_view — vai chạm được mà không bật và ép luật theo dòng
    pha may-chu-chu: thieu dong 'may chu dev noi bang vai khac quy_hang_login: postgres'
    ci-thu: DO — pha may-chu-chu khong do dung

- eval: E3
  run_id: minted-ci-co-postgres-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ci_db_kiem
  verified_at: 2026-11-13T13:02:00Z
  output: |
    tests/ci-db.test.ts xanh trong lượt vitest chung năm tệp (ma trận bước đỏ đạt).

- eval: E4
  run_id: minted-ci-co-postgres-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ci_db_kiem
  verified_at: 2026-11-13T13:02:00Z
  output: |
    tests/dem-giao-nhan.test.ts xanh trong lượt vitest chung năm tệp.

- eval: E5
  run_id: minted-ci-co-postgres-E5-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.ci_db_thu
  verified_at: 2026-11-13T13:02:00Z
  output: |
    duoi 2/3 tran: 13.6 / 30
    ci-thu: ── make check trong ban sao nong
    check xanh
    ci-thu: xanh? khong · 13.6 phut · check xanh · pha bo-phien do · pha vai-chu do · pha may-chu-chu XANH

- eval: E6
  run_id: minted-ci-co-postgres-E6-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.ci_db_thu
  verified_at: 2026-11-13T13:02:00Z
  output: |
    [pha bo-phien] ci-db: co-phien HỎNG (mã 1, 472 giây)
    [pha bo-phien] ci-db: khong-phien đạt (mã 0, 101 giây)
    [pha bo-phien] roi: 360 man members › khung tieu-de
    ci-thu: DO — pha may-chu-chu khong do dung

- eval: E7
  run_id: minted-ci-co-postgres-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ci_db_kiem
  verified_at: 2026-11-13T13:02:00Z
  output: |
    tests/ci-ban-sao-nong.test.ts xanh trong lượt vitest chung năm tệp.

- eval: E8
  run_id: minted-ci-co-postgres-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ci_db_kiem
  verified_at: 2026-11-13T13:02:00Z
  output: |
    tests/don-dung-tam.test.ts xanh trong lượt vitest chung năm tệp.

- eval: E8b
  run_id: minted-ci-co-postgres-E8b-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.ci_db_thu
  verified_at: 2026-11-13T13:02:00Z
  output: |
    thu muc dung tam con lai: 0
    ci-thu: xanh? khong · 13.6 phut · check xanh · pha bo-phien do · pha vai-chu do · pha may-chu-chu XANH

- eval: E9
  run_id: minted-ci-co-postgres-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ci_db_kiem
  verified_at: 2026-11-13T13:02:00Z
  output: |
    tests/ci-yml-patch.test.ts xanh trong lượt vitest chung năm tệp.

- eval: E10
  run_id: minted-ci-co-postgres-E10-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.ci_db_that
  verified_at: 2026-11-13T13:02:00Z
  output: |
    ci-that: chua co luot CI tren dau nhanh 6ae164b

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-ci-co-postgres-SUITE-make_check-r1
  exit_code: 0
  verified_at: 2026-11-13T13:02:00Z

- cmd: npm run build
  run_id: minted-ci-co-postgres-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-13T13:02:00Z

- cmd: make e2e
  run_id: minted-ci-co-postgres-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-13T13:02:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không có eval nào xanh trên cả HEAD lẫn baseline; mọi eval có field baseline là n-a (xem mục dưới), nên chưa chứng minh được chiều đỏ trên code cũ.

### Baseline khong do

- bash db/scripts/ci-thu.sh: bo qua baseline: tep db/scripts/ci-thu.sh co o cay dang kiem nhung chua co o merge-base ab97dffab8a4d8dfe3a5b8951b13f2a9287cb902 — eval moi, chay tren code cu khong phan biet gi
- npx vitest run tests/ci-db.test.ts tests/dem-giao-nhan.test.ts tests/don-dung-tam.test.ts tests/ci-ban-sao-nong.test.ts tests/ci-yml-patch.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/ci-db.test.ts co o cay dang kiem nhung chua co o merge-base ab97dffab8a4d8dfe3a5b8951b13f2a9287cb902 — eval moi, chay tren code cu khong phan biet gi
- node db/scripts/ci-that.mjs --cho 60: bo qua baseline: tep db/scripts/ci-that.mjs co o cay dang kiem nhung chua co o merge-base ab97dffab8a4d8dfe3a5b8951b13f2a9287cb902 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1, E2, E5, E6, E8b, E10 failed — ci-thu.sh: lượt xanh trong bản sao nóng đạt 6/6 nhưng pha bo-phien, pha vai-chu và pha may-chu-chu đều không cho kết quả mong đợi (pha vai-chu thiếu dòng HỎNG dang-nhap-khong-ve-vai-chu, pha may-chu-chu thiếu dòng vai khác quy_hang_login, tổng 13.6 phút); ci-that: chưa có lượt CI trên đầu nhánh 6ae164b. Returned to implementation.
