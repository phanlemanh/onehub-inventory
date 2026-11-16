---
schema_version: 2
feature_slug: moi-truong-thu-va-ban-that
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f1a6fc2c158835cd05ec0b5acbd5c1e1336ecb7c
human_signoff:
---

# Evidence Report: moi-truong-thu-va-ban-that

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-9 | judgment | UNCERTAIN |
| E11 | AC-10 | test | PASS |
| E12 | AC-1 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-moi-truong-thu-va-ban-that-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T15:18:36Z
  output: |
    npx vitest run tools/deploy: toàn bộ ca của tệp deploy đạt (lệnh chung với E2, E3, E4)

- eval: E2
  run_id: minted-moi-truong-thu-va-ban-that-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T15:18:36Z
  output: |
    npx vitest run tools/deploy: toàn bộ ca của tệp deploy đạt (lệnh chung với E1, E3, E4)

- eval: E3
  run_id: minted-moi-truong-thu-va-ban-that-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T15:18:36Z
  output: |
    npx vitest run tools/deploy: toàn bộ ca của tệp deploy đạt (lệnh chung với E1, E2, E4)

- eval: E4
  run_id: minted-moi-truong-thu-va-ban-that-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T15:18:36Z
  output: |
    npx vitest run tools/deploy: toàn bộ ca của tệp deploy đạt (lệnh chung với E1, E2, E3)

- eval: E5
  run_id: minted-moi-truong-thu-va-ban-that-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cau_hinh_ban_that
  verified_at: 2026-11-16T14:33:01Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-moi-truong-thu-va-ban-that-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ban_dung_that
  verified_at: 2026-11-16T15:18:36Z
  output: |
    ban-dung-that: 33 phép kiểm đạt

- eval: E7
  run_id: minted-moi-truong-thu-va-ban-that-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly_dich
  verified_at: 2026-11-16T15:18:36Z
  output: |
    tests/db/cach-ly-dich.db.test.ts trên Postgres làn K: mọi ca đạt

- eval: E8
  run_id: minted-moi-truong-thu-va-ban-that-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sao_luu_khoi_phuc
  verified_at: 2026-11-16T15:18:36Z
  output: |
    tests/db/sao-luu.db.test.ts trên Postgres làn K: mọi ca đạt

- eval: E9
  run_id: minted-moi-truong-thu-va-ban-that-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.van_hanh
  verified_at: 2026-11-16T15:18:36Z
  output: |
    tests/van-hanh.test.ts: mọi ca đạt

- eval: E11
  run_id: minted-moi-truong-thu-va-ban-that-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoa_bi_mat
  verified_at: 2026-11-16T15:18:36Z
  output: |
    tests/khong-khoa-bi-mat.test.ts: mọi ca đạt

- eval: E12
  run_id: minted-moi-truong-thu-va-ban-that-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-16T15:18:36Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

### Judgment

Panel đề xuất cho E10 (UNCERTAIN), rationale từng judge:

- domain-correctness: FAIL — Bốn quy trình phần lớn đủ làm ở đâu, gõ gì, đạt khi, đỏ thì. Danh sách việc ngoài kho đúng thứ tự phụ thuộc và chỉ ghi tên biến. Còn hai chỗ hở khiến người chưa từng làm bị kẹt. Một: xoay-khoa.md không nói mật khẩu cơ sở dữ liệu mới phải chỉ có chữ và số, trong khi README việc 4 nói ký tự như `@ : / #` làm hỏng chuỗi nối; mục «Đỏ thì» bước 3 của xoay-khoa chỉ nhắc dấu nháy đơn. Hai: khoi-phuc.md thiếu phần chuẩn bị so với lui-ban.md.
- operational-feasibility: UNCERTAIN — Bốn quy trình đều ghi đủ «Ở đâu / Gõ hay bấm / Đạt khi / Đỏ thì». Danh sách 14 việc ngoài kho xếp theo thứ tự làm được và chỉ ghi tên biến. Chưa đủ căn cứ: mục «Cần có trước» của khoi-phuc.md không nói cách sao kho, cài Node 24, chạy make setup, hay cài psql, pg_dump, pg_restore đúng bản chính và kiểm bằng lệnh nào, trong khi lui-ban.md có các chỉ dẫn đó. Judge không đọc Makefile nên không biết ba lệnh make của khôi phục có cần Node hay make setup hay không.
- spec-alignment: PASS — Cả bốn quy trình (dua-ban-len, lui-ban, xoay-khoa, khoi-phuc) đều ghi mỗi bước theo bốn mục: Ở đâu, Gõ hay bấm, Đạt khi, Đỏ thì. Các dòng đỏ có bảng tra riêng, sổ tay chỉ nêu tên biến, không có giá trị nào. Mười bốn việc ngoài kho trong README đi đúng thứ tự phụ thuộc. Chỗ hở còn lại nhỏ: lệnh Docker cho `PSQL_DICH`, `PG_DUMP_CMD`, `PG_RESTORE_CMD` không có ví dụ, và nhật ký khôi phục nằm ở tệp thứ sáu, không thuộc năm tệp được giao.

- eval: E10
  judged_by: judge-subagent (fresh context)
  verdict: UNCERTAIN
  rationale: Hai trong ba judge nêu chỗ hở ở docs/van-hanh (mật khẩu chỉ chữ và số ở xoay-khoa, phần «Cần có trước» của khoi-phuc), một judge chấm đạt; hội đồng không thống nhất nên người quyết ở Cổng 2.
  required_evidence:
    - Bản sửa /Users/manhphan/dev/onehub-inventory/.claude/worktrees/festive-cartwright-cda527/docs/van-hanh/xoay-khoa.md: bước 1 (hoặc bước 3) ghi hai mật khẩu cơ sở dữ liệu mới chỉ gồm chữ và số, có dòng «Đỏ thì» cho trường hợp mật khẩu có ký tự đặc biệt làm hỏng chuỗi nối. Đặc biệt với «Reset database password» của Supabase, nơi bộ sinh mật khẩu có thể ra ký tự đặc biệt.
    - Bản sửa khoi-phuc.md, mục «Cần có trước»: có cách sao kho (`git clone`), `make setup`, Node 24, cách cài `psql`/`pg_dump`/`pg_restore`, và lệnh kiểm bản (ví dụ `pg_dump --version`) với dòng «Đạt khi» và «Đỏ thì». Nếu `make sao-luu` và `make cach-ly-dich` không cần Node hay `make setup`, một câu nói rõ điều đó cũng đủ.
    - Bản sửa README.md, việc 12: nói rõ lần đưa bản đầu của bản thật cũng dừng ở `kiem-nhanh`, phải đặt mật khẩu vai `quy_hang_login` trong SQL Editor của dự án bản thật rồi chạy lại. Ghi rõ lượt chạy lại sẽ chạy lại bản thử và đòi duyệt `production` lần nữa.
    - Hoặc một câu xác nhận trong khoi-phuc.md (hay đoạn đọc được từ mk/) rằng make sao-luu, make khoi-phuc-thu và make cach-ly-dich chỉ cần psql, pg_dump, pg_restore, không cần Node hay make setup.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-moi-truong-thu-va-ban-that-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-16T15:18:36Z

- cmd: make e2e
  run_id: minted-moi-truong-thu-va-ban-that-SUITE-make_e2e-r3
  exit_code: 0
  verified_at: 2026-11-16T15:18:36Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi).

Baseline khong do: round nay không đo lại baseline, mọi eval ghi baseline n-a.

Non-discriminating (xanh ở cả HEAD lẫn baseline, chứng minh harness chứ không phải feature; viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- E12 (`make check`) — green ở cả hai phía; là regression-guard của ranh giới mô-đun, nhãn và ontology.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: findings về số cô lập, khôi phục từng bảng, biến, quy trình vận hành. Returned to implementation (fix baef129).
Round 2: E7 REJECT — cụm riêng cho E7, rollback gọi tên đích, runbook. Returned to implementation (fix f1a6fc2).
Round 3: mọi eval máy đạt (E5 carry-forward từ round 1); E10 UNCERTAIN chờ người quyết ở Cổng 2, verdict PENDING-JUDGMENT.
