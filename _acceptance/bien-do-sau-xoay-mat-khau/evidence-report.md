---
schema_version: 2
feature_slug: bien-do-sau-xoay-mat-khau
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a27ebd1a1c1f477f9f9a0e29805c56195c8548a4
human_signoff:
---

# Evidence Report: bien-do-sau-xoay-mat-khau

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS (carry-forward từ round 1) |
| E2 | AC-2 | test | PASS (carry-forward từ round 1) |
| E3 | AC-3 | test | PASS (carry-forward từ round 1) |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | judgment | PASS (đề xuất của hội đồng, chờ người chốt) |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-bien-do-sau-xoay-mat-khau-E1-r1
  exit_code: 0
  carried_from_round: 1
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-22T04:47:14Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-bien-do-sau-xoay-mat-khau-E2-r1
  exit_code: 0
  carried_from_round: 1
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-22T04:47:14Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-bien-do-sau-xoay-mat-khau-E3-r1
  exit_code: 0
  carried_from_round: 1
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-22T04:47:14Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-bien-do-sau-xoay-mat-khau-E4-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-22T05:06:24Z
  output: |
    npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose
    toàn bộ ca của tools/deploy đạt

- eval: E6
  run_id: minted-bien-do-sau-xoay-mat-khau-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bdx_ghi_chep
  verified_at: 2026-11-22T05:06:24Z
  output: |
    ghi-chep tu-kiem: 3 bản phá đỏ đúng thông điệp, cây thật đạt

- eval: E7
  run_id: minted-bien-do-sau-xoay-mat-khau-E7-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-22T05:06:24Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-bien-do-sau-xoay-mat-khau-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-22T05:06:24Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-bien-do-sau-xoay-mat-khau-SUITE-DATABASE_URL_make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-22T05:06:24Z

### Judgment

Panel đề xuất cho E5 (AC-5), human_override để trống cho người chốt ở Cổng 2.

- eval: E5
  judged_by: judge-subagent (fresh context)
  proposal: PASS
  votes:
    - domain-correctness: PASS — Mục «Đỏ thì làm gì» chia đúng ba vùng (dua-ban-len.md dòng 89-93). Ca `vai-dang-nhap` đỏ nằm ở vùng «chưa đổi, bản đang chạy không bị đụng», không nằm ở vùng «mất kết nối». Cả năm hàng `bien` và cả hai hàng `vai-dang-nhap` đều dặn «Đừng bấm dựng lại trên Vercel trước khi lệnh này chạy xanh». Các hàng `cach-ly`, `dung`, `kiem-nhanh` không nói bản đang chạy yên. Bước 3 của xoay-khoa.md nói khoảng hở bắt đầu từ lúc `vai-dang-nhap` đạt. Trang 0048 có đủ thứ tự mới, lý do, cái giá và khoảng hở còn lại. Không câu nào bảo in, dán hay gửi giá trị khoá.
    - operational-feasibility: PASS — Mục «Đỏ thì làm gì» (dòng 86–93) chia đúng ba vùng. Đỏ ở `vai-dang-nhap` nằm ở vùng «mật khẩu chưa đổi, bản đang chạy không bị đụng». Mọi hàng `bien` (dòng 112–116) và `vai-dang-nhap` (dòng 107–108) đều dặn đừng bấm dựng lại trên Vercel trước khi lệnh chạy xanh. Các hàng `cach-ly`, `dung`, `kiem-nhanh` không nói bản đang chạy yên. Bước 3 của xoay-khoa.md nói khoảng hở bắt đầu khi `vai-dang-nhap` đạt, sau `bien`. Trang 0048 nêu đủ thứ tự mới, lý do, cái giá và khoảng hở còn lại. Không câu nào bảo in hay dán giá trị khoá. Lưu ý phụ: đoạn mở đầu dua-ban-len.md (dòng 3–4) nói bước đỏ «không đổi gì ở bản đang phục vụ» mà không kèm ngoại lệ; câu này nằm ngoài các hàng AC-5 xét, và dòng 86 đã nêu ngoại lệ.
    - spec-alignment: PASS — Mục «Đỏ thì làm gì» chia đúng ba vùng (dòng 89, 90, 92). Ca vai-dang-nhap đỏ nằm ở vùng «mật khẩu chưa đổi, bản đang chạy không bị đụng», còn «mất kết nối» chỉ dành cho cach-ly, dung, kiem-nhanh, gan-ten-mien. Cả năm hàng bien và hai hàng vai-dang-nhap đều dặn «Đừng bấm dựng lại trên Vercel trước khi lệnh này chạy xanh». Không hàng cach-ly, dung, kiem-nhanh nào nói bản đang chạy yên, và dòng 86 trừ ca vừa xoay mật khẩu. Bước 3 của xoay-khoa.md nói khoảng hở bắt đầu «từ lúc bước vai-dang-nhap đạt» và bien chạy trước. Trang 0048 có đủ thứ tự mới, lý do, cái giá và khoảng hở còn lại. Không câu nào bảo in hay dán giá trị khoá ra ngoài lệnh make dat-khoa.
  required_evidence:
    - (judge không nêu bằng-chứng-thiếu)
  human_override:  # chi nguoi ghi

Lưu ý cho người chốt: round 2 còn hai finding trong hợp đồng (AC-5) về bước kiem-nhanh-ten-mien chưa nằm trong vùng đỏ thứ ba, xem review-findings.md. Các judge ở trên chấm trên mục đã sửa ở round 1 và không nêu bước này.

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả HEAD lẫn baseline), cần xác nhận là regression-guard có chủ ý hoặc viết lại để assert hành vi mới:
- E4: `npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose`
- E7: `make check`

Baseline không đo:
- node _acceptance/bien-do-sau-xoay-mat-khau/rang/ghi-chep.mjs && node _acceptance/bien-do-sau-xoay-mat-khau/rang/ghi-chep.mjs --tu-kiem: bo qua baseline: tep _acceptance/bien-do-sau-xoay-mat-khau/rang/ghi-chep.mjs co o cay dang kiem nhung chua co o merge-base 51b5c712ca40ecd017d20534a2e296b6504283f5 — eval moi, chay tren code cu khong phan biet gi

Lệnh fail không gắn eval: không có.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: S4 round 1 có một finding trong hợp đồng (vùng đỏ thứ ba thiếu gan-ten-mien). Đã sửa trong tài liệu vận hành.
Round 2: E4, E6, E7 và hai lệnh suite chạy lại, đều đạt; E1, E2, E3 carry-forward từ round 1 vì delta không chạm paths của chúng; E5 chờ người chốt. Hai finding trong hợp đồng (AC-5) về kiem-nhanh-ten-mien chưa được sửa, verdict PENDING-JUDGMENT.
