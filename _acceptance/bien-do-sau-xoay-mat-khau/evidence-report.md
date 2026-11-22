---
schema_version: 2
feature_slug: bien-do-sau-xoay-mat-khau
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d79d189195ebe384af1ab742afac4fea26604d16
human_signoff: Manh Phan 2026-11-22
---

# Evidence Report: bien-do-sau-xoay-mat-khau

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | judgment | PASS (đề xuất của hội đồng, chờ người chốt ở Cổng 2) |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-bien-do-sau-xoay-mat-khau-E1-r1
  exit_code: 0
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-22T04:47:14Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-bien-do-sau-xoay-mat-khau-E2-r1
  exit_code: 0
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-22T04:47:14Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-bien-do-sau-xoay-mat-khau-E3-r1
  exit_code: 0
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-22T04:47:14Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-bien-do-sau-xoay-mat-khau-E4-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-22T05:39:05Z
  output: |
    npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose
    runs: 1, passes: 1

- eval: E5
  judged_by: judge panel (fresh context, 3 lens) — đề xuất PASS
  verdict: PASS
  rationale: Ba lens đều thấy mục «Đỏ thì làm gì» chia đúng ba vùng, luật vùng ba phủ cả ca tự lùi bản, mọi hàng bien và vai-dang-nhap dặn không dựng lại trên Vercel, và không câu nào bảo in hay gửi giá trị khoá.
  human_override: Manh Phan 2026-11-22 — Đạt
  panel:
    - domain-correctness: PASS — Mục «Đỏ thì làm gì» của dua-ban-len.md chia đúng ba vùng. Vùng ba là luật theo vị trí («bất kỳ bước nào chạy sau khi `vai-dang-nhap` đạt») và phủ cả `đã lùi về bản trước`, `lùi bản DỪNG`, `lùi bản ĐỎ`. Ca `vai-dang-nhap` đỏ nằm ở vùng hai, không nằm ở vùng «mất kết nối». Cả 5 hàng `bien` và 2 hàng `vai-dang-nhap` đều dặn «Đừng bấm dựng lại trên Vercel trước khi lệnh này chạy xanh». Các hàng `gan-ten-mien` và `kiem-nhanh-ten-mien` đều trừ ca vừa xoay mật khẩu và dặn «đừng lùi về bản cũ… sửa nguyên nhân và chạy lại `make deploy` ngay». Không hàng nào của `cach-ly`, `dung`, `kiem-nhanh` nói bản đang chạy yên. Bước 3 của xoay-khoa.md nói khoảng hở bắt đầu «từ lúc bước `vai-dang-nhap` đạt» và `bien` chạy trước. Trang 0048 có thứ tự mới, lý do, cái giá và khoảng hở còn lại. Không câu nào bảo in, dán hay gửi giá trị khoá ra ngoài lệnh `make dat-khoa`. Còn một điểm phụ, ngoài phạm vi các hàng của bảng. Bước 3 và bước 6 của dua-ban-len.md dặn «lùi bản» theo lui-ban.md mà không nhắc ca xoay mật khẩu. Hai bước đó nằm ngoài mục «Đỏ thì làm gì» và ngoài câu hỏi này.
    - operational-feasibility: PASS — Mục «Đỏ thì làm gì» chia đúng ba vùng. Vùng thứ ba là luật theo vị trí («bất kỳ bước nào chạy sau khi `vai-dang-nhap` đạt») và phủ cả `đã lùi về bản trước`, `lùi bản DỪNG`, `lùi bản ĐỎ`. Ca `vai-dang-nhap` đỏ nằm ở vùng hai («mật khẩu chưa đổi, bản đang chạy không bị đụng»), không bị xếp vào vùng mất kết nối. Năm hàng `bien` và hai hàng `vai-dang-nhap` đều dặn «Đừng bấm dựng lại trên Vercel trước khi lệnh này chạy xanh». Các hàng `cach-ly`, `dung` và `kiem-nhanh` không nói bản đang chạy yên. Hàng `gan-ten-mien` và ba hàng `kiem-nhanh-ten-mien` có câu «Vừa xoay mật khẩu vai đăng nhập: đừng lùi về bản cũ… sửa nguyên nhân và chạy lại `make deploy` ngay». Bước 3 của `xoay-khoa.md` nói khoảng hở bắt đầu «từ lúc bước `vai-dang-nhap` đạt» và «Bước `bien` chạy trước `vai-dang-nhap`, nên lỗi của Vercel ở bước ấy không mở khoảng hở». Trang 0048 có thứ tự mới, lý do, cái giá («Vercel giữ mật khẩu mới trong khi cơ sở dữ liệu còn mật khẩu cũ») và khoảng hở còn lại. Không câu nào bảo in, dán hay gửi giá trị khoá. Mọi chỗ dán chỉ dán vào `make dat-khoa` khi lệnh hỏi.
    - spec-alignment: PASS — Mục «Đỏ thì làm gì» chia đúng ba vùng. Vùng ba là luật theo vị trí («bất kỳ bước nào chạy sau khi `vai-dang-nhap` đạt») và phủ cả `đã lùi về bản trước`, `lùi bản DỪNG` và `lùi bản ĐỎ`. Trong các hàng của bước chạy sau `vai-dang-nhap`, hàng nào nhắc lùi bản đều có câu «Vừa xoay mật khẩu vai đăng nhập: đừng lùi về bản cũ… sửa nguyên nhân và chạy lại `make deploy` ngay», và hàng nào nói bản cũ chạy yên đều đã trừ ca vừa xoay. Cả năm hàng `bien` và cả hai hàng `vai-dang-nhap` đều dặn «Đừng bấm dựng lại trên Vercel trước khi lệnh này chạy xanh». Bước 3 của `xoay-khoa.md` nói khoảng hở bắt đầu khi `vai-dang-nhap` đạt, sau `bien`. Trang 0048 nêu đủ thứ tự mới, lý do, cái giá (Vercel giữ mật khẩu mới khi cơ sở dữ liệu còn mật khẩu cũ) và khoảng hở còn lại. Không câu nào bảo dán hay gửi giá trị khoá ra ngoài. Câu duy nhất nhắc dán là dán vào lời nhắc của `make dat-khoa`, và `xoay-khoa.md` dòng 22 nói giá trị chỉ được dán ở đó.

- eval: E6
  run_id: minted-bien-do-sau-xoay-mat-khau-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bdx_ghi_chep
  verified_at: 2026-11-22T05:39:05Z
  output: |
    ghi-chep tu-kiem: 3 bản phá đỏ đúng thông điệp, cây thật đạt

- eval: E7
  run_id: minted-bien-do-sau-xoay-mat-khau-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-22T05:39:05Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-bien-do-sau-xoay-mat-khau-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-22T05:39:05Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-bien-do-sau-xoay-mat-khau-SUITE-DATABASE_URL_make_e2e-r3
  exit_code: 0
  verified_at: 2026-11-22T05:39:05Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh cả ở HEAD lẫn baseline):

- E4 (`npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose`): xanh cả hai phía, nên chứng minh harness chứ chưa chứng minh feature. Cần viết lại để khẳng định hành vi mới, hoặc xác nhận đây là regression-guard có chủ ý.

Baseline khong do

- node _acceptance/bien-do-sau-xoay-mat-khau/rang/ghi-chep.mjs && node _acceptance/bien-do-sau-xoay-mat-khau/rang/ghi-chep.mjs --tu-kiem: bo qua baseline: tep _acceptance/bien-do-sau-xoay-mat-khau/rang/ghi-chep.mjs co o cay dang kiem nhung chua co o merge-base 51b5c712ca40ecd017d20534a2e296b6504283f5 — eval moi, chay tren code cu khong phan biet gi
- make check: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (mọi eval chỉ chạy một lần, xác định).

## Iterations

Round 1: E1, E2, E3 xanh lần đầu (thứ tự khai, đường đỏ, ma trận bước đỏ); các round sau mang tiếp, không chạy lại.
Round 2: bằng chứng ghi nhận finding cùng loại với round 1 (dừng vá chắp vá); quay lại thực thi.
Round 3: mở lại phạm vi để vùng sự cố thành một luật, phủ cả các dòng lùi bản; E4, E6, E7 chạy lại và xanh, E5 có đề xuất PASS của hội đồng chờ người chốt.
