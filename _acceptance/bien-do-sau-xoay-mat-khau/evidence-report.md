---
schema_version: 2
feature_slug: bien-do-sau-xoay-mat-khau
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 0d255b96805c76938caceeda40f6b72b5e6de92d
human_signoff:
---

# Evidence Report: bien-do-sau-xoay-mat-khau

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | judgment | PENDING-JUDGMENT |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-bien-do-sau-xoay-mat-khau-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-22T04:47:14Z
  output: |
    npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose
    Lệnh chạy một lần, cả bộ tools/deploy xanh (chung với E2, E3, E4).

- eval: E2
  run_id: minted-bien-do-sau-xoay-mat-khau-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-22T04:47:14Z
  output: |
    npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose
    Lệnh chạy một lần, cả bộ tools/deploy xanh (chung với E1, E3, E4).

- eval: E3
  run_id: minted-bien-do-sau-xoay-mat-khau-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-22T04:47:14Z
  output: |
    npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose
    Lệnh chạy một lần, cả bộ tools/deploy xanh (chung với E1, E2, E4).

- eval: E4
  run_id: minted-bien-do-sau-xoay-mat-khau-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-22T04:47:14Z
  output: |
    npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose
    Lệnh chạy một lần, cả bộ tools/deploy xanh (chung với E1, E2, E3).

- eval: E5
  judged_by: judge panel (fresh context) — ba góc nhìn
  verdict: PASS (đề xuất của hội đồng; chưa có người chốt)
  rationale: Cả ba góc nhìn thấy mục «Đỏ thì làm gì» của docs/van-hanh/dua-ban-len.md chia đúng ba vùng, ca vai-dang-nhap đỏ nằm ở vùng bản đang chạy không bị đụng, và các hàng bien, vai-dang-nhap đều dặn không bấm dựng lại trên Vercel trước khi lệnh chạy xanh. Xoay-khoa.md và trang 0048 khớp thứ tự mới, không câu nào bảo in hay dán giá trị khoá.
  votes:
    - domain-correctness: PASS — Mục «Đỏ thì làm gì» (dua-ban-len.md, dòng 86-96) chia đúng ba vùng; vai-dang-nhap đỏ nằm ở vùng «chưa đổi, bản đang chạy không bị đụng, Vercel đã nhận mật khẩu mới». Cả năm hàng bien và hai hàng vai-dang-nhap đều dặn «Đừng bấm dựng lại trên Vercel trước khi lệnh này chạy xanh», thêm đoạn chung (dòng 95-96). Các hàng cach-ly, dung, kiem-nhanh không có câu nào nói bản chạy yên mà thiếu ngoại lệ vì đoạn «Thường thì… Trừ khi lượt này vừa xoay mật khẩu vai đăng nhập» đứng ngay trên bảng. Bước 3 của xoay-khoa.md nói khoảng hở bắt đầu «từ lúc bước vai-dang-nhap đạt» và bien chạy trước. Trang 0048 có đủ thứ tự mới, lý do, cái giá và khoảng hở còn lại. Không câu nào bảo in, dán hay gửi giá trị khoá; xoay-khoa.md dòng 22 cấm dán vào kho, chat, issue hay PR, chỉ cho dán vào `make dat-khoa` khi lệnh hỏi.
    - operational-feasibility: PASS — Mục «Đỏ thì làm gì» (dòng 86-96) chia đúng ba vùng, vai-dang-nhap đỏ nằm ở vùng «bản đang chạy không bị đụng», không nằm ở vùng mất kết nối. Mọi hàng bien (112-116) và vai-dang-nhap (107-108) đều dặn «Đừng bấm dựng lại trên Vercel trước khi lệnh này chạy xanh». Bước 3 của xoay-khoa.md nói khoảng hở bắt đầu khi vai-dang-nhap đạt, trang 0048 đủ thứ tự, lý do, cái giá và khoảng hở còn lại, không có câu nào bảo in hay dán giá trị khoá ngoài lệnh `make dat-khoa`.
    - spec-alignment: PASS — Mục «Đỏ thì làm gì» (dòng 89-93) chia đúng ba vùng; ca `vai-dang-nhap` đỏ được xếp là «mật khẩu chưa đổi, bản đang chạy không bị đụng, Vercel đã nhận mật khẩu mới». Năm hàng `bien` (112-116) và hai hàng `vai-dang-nhap` (107-108) đều dặn «Đừng bấm dựng lại trên Vercel trước khi lệnh này chạy xanh». Các hàng `cach-ly`, `dung`, `kiem-nhanh` không nói bản đang chạy yên, câu chung ở dòng 83 được dòng 86 loại trừ bằng «Trừ khi lượt này vừa xoay mật khẩu vai đăng nhập». Bước 3 của xoay-khoa.md khớp, trang 0048 đủ nội dung, không câu nào bảo in, dán hay gửi giá trị khoá. Điểm nhỏ: câu mở đầu dòng 4 của dua-ban-len.md («một bước đỏ không đổi gì ở bản đang phục vụ người dùng») chưa trừ ca vừa xoay mật khẩu, nhưng nó không nằm trong hàng nào của `cach-ly`, `dung` hay `kiem-nhanh` nên không vi phạm AC-5.
  required_evidence:
    - (judge không nêu bằng-chứng-thiếu)
  human_override:  # chi nguoi ghi

- eval: E6
  run_id: minted-bien-do-sau-xoay-mat-khau-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bdx_ghi_chep
  verified_at: 2026-11-22T04:47:14Z
  output: |
    ghi-chep tu-kiem: 3 bản phá đỏ đúng thông điệp, cây thật đạt

- eval: E7
  run_id: minted-bien-do-sau-xoay-mat-khau-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-22T04:47:14Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-bien-do-sau-xoay-mat-khau-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-22T04:47:14Z

- cmd: DATABASE_URL= make e2e
  run_id: bhnvhorz2
  exit_code: 0
  verified_at: 2026-11-22T04:47:14Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào xanh ở cả hai phía; baseline của mọi eval máy đều không đo được (n-a), nên chưa có eval nào được chứng minh là có phân biệt trên code cũ.

Baseline khong do:
- npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- node _acceptance/bien-do-sau-xoay-mat-khau/rang/ghi-chep.mjs && node _acceptance/bien-do-sau-xoay-mat-khau/rang/ghi-chep.mjs --tu-kiem: bo qua baseline: tep _acceptance/bien-do-sau-xoay-mat-khau/rang/ghi-chep.mjs co o cay dang kiem nhung chua co o merge-base 51b5c712ca40ecd017d20534a2e296b6504283f5 — eval moi, chay tren code cu khong phan biet gi
- make check: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy (E1, E2, E3, E4, E6, E7) và hai lệnh suite đều đạt; E5 (judgment) hội đồng đề xuất đạt nhưng chờ người chốt ở Cổng 2; có một finding trong hợp đồng (AC-5, gan-ten-mien thiếu ở vùng đỏ thứ ba của sổ tay) và một finding ngoài hợp đồng, xem review-findings.md.
