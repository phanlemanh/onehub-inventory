---
schema_version: 2
feature_slug: moi-truong-thu-va-ban-that
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 15ff7089afd8a6755d7a477f79d05db56245e9a6
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
  run_id: minted-moi-truong-thu-va-ban-that-E1-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T16:03:38Z
  output: |
    npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose
    (chạy chung với E2, E3, E4 trong một lệnh; kết thúc thành công)

- eval: E2
  run_id: minted-moi-truong-thu-va-ban-that-E2-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T16:03:38Z
  output: |
    npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose
    (cùng lệnh với E1; kết thúc thành công)

- eval: E3
  run_id: minted-moi-truong-thu-va-ban-that-E3-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T16:03:38Z
  output: |
    npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose
    (cùng lệnh với E1; kết thúc thành công)

- eval: E4
  run_id: minted-moi-truong-thu-va-ban-that-E4-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T16:03:38Z
  output: |
    npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose
    (cùng lệnh với E1; kết thúc thành công)

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
  run_id: minted-moi-truong-thu-va-ban-that-E6-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ban_dung_that
  verified_at: 2026-11-16T16:03:38Z
  output: |
    ban-dung-that: 33 phép kiểm đạt

- eval: E7
  run_id: minted-moi-truong-thu-va-ban-that-E7-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly_dich
  verified_at: 2026-11-16T16:03:38Z
  output: |
    npx vitest run -c vitest.db.config.ts tests/db/cach-ly-dich.db.test.ts --reporter=verbose
    (Postgres làn K; kết thúc thành công)

- eval: E8
  run_id: minted-moi-truong-thu-va-ban-that-E8-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sao_luu_khoi_phuc
  verified_at: 2026-11-16T16:03:38Z
  output: |
    npx vitest run -c vitest.db.config.ts tests/db/sao-luu.db.test.ts --reporter=verbose
    (Postgres làn K; kết thúc thành công)

- eval: E9
  run_id: minted-moi-truong-thu-va-ban-that-E9-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.van_hanh
  verified_at: 2026-11-16T16:03:38Z
  output: |
    npx vitest run tests/van-hanh.test.ts --coverage.enabled=false --reporter=verbose
    (kết thúc thành công)

- eval: E11
  run_id: minted-moi-truong-thu-va-ban-that-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoa_bi_mat
  verified_at: 2026-11-16T15:18:36Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-moi-truong-thu-va-ban-that-E12-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-16T16:03:38Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-moi-truong-thu-va-ban-that-SUITE-build-r5
  exit_code: 0
  verified_at: 2026-11-16T16:03:38Z

- cmd: make e2e
  run_id: minted-moi-truong-thu-va-ban-that-SUITE-make_e2e-r5
  exit_code: 0
  verified_at: 2026-11-16T16:03:38Z

### Judgment

- eval: E10
  judged_by: judge-subagent (fresh context)
  verdict: UNCERTAIN
  rationale: Đề xuất của hội đồng là PASS nhưng một góc nhìn (spec-alignment) phản đối; mọi ý kiến được giữ nguyên bên dưới để người quyết ở Cổng 2.
  votes:
    - domain-correctness: PASS — Ba quy trình đưa bản lên, lùi bản và khôi phục dữ liệu đều đánh số từng bước với đủ bốn ý: Ở đâu, Gõ hay bấm, Đạt khi, Đỏ thì. Quy trình xoay khoá cũng theo khung đó, kèm bảng chỗ đặt cho từng khoá. Lệnh, chuỗi cần thấy và bảng «Đỏ thì làm gì» đều ghi sẵn trong năm tệp nên người vận hành không phải đọc mã. 14 việc ngoài kho của README đi đúng thứ tự phụ thuộc (Supabase, chuỗi nối, mật khẩu vai, Vercel, khoá, bảo vệ bản mới, Resend, tên miền và biến, môi trường GitHub, Release và deploy.yml, lần đưa bản đầu, tài khoản đầu, thử khôi phục). Mỗi việc có «Đạt khi» và «Đỏ thì», và toàn bộ chỉ ghi tên biến, giá trị chỉ là chỗ giữ như `[Tên]`, `<mật khẩu …>` hay `quan-tri@example.test`. Chỗ lệch nhỏ nhất: ở xoay-khoa.md, «Đạt khi» của bước 1 nói khoá cũ còn hiệu lực, không đúng với mật khẩu vai chủ; nhưng cùng bước đã chỉ sang bước 3 cho hai mật khẩu cơ sở dữ liệu nên không chặn được người làm theo.
    - operational-feasibility: PASS — Cả bốn quy trình (dua-ban-len, lui-ban, xoay-khoa, khoi-phuc) đều ghi từng bước đủ bốn điều: làm ở đâu, gõ hay bấm gì, dòng nào là đạt, đỏ thì làm gì. Mục «Cần có trước» nói rõ cách cài công cụ và nạp biến từ tệp ngoài kho. 14 việc ngoài kho trong README đi theo thứ tự làm được: mỗi việc chỉ dựa vào việc đứng trước, và việc 11, 13 nói rõ chúng chờ gì. Chỉ có tên biến và chỗ giữ chỗ như `<mật khẩu chỉ chữ và số>`, không có giá trị thật. Có vài chỗ chưa gọn: việc 8 không nói cách thêm `onehub.center` vào Vercel, và bước 1 của xoay-khoa hơi mơ hồ về mật khẩu vai chủ. Cả hai đều có «Đỏ thì» hoặc bước 3 đỡ lại, nên không đủ để làm người mới kẹt.
    - spec-alignment: FAIL — Phần lớn năm tệp làm theo được. Mỗi bước của đưa bản lên, lùi bản, xoay khoá và thử khôi phục đều có đủ ở đâu, gõ gì, đạt khi, đỏ thì. 14 việc ngoài kho đi đúng thứ tự phụ thuộc và chỉ ghi tên biến. Nhưng chưa đạt tiêu chí «mỗi bước đủ bốn điều» mà README dòng 24 tự cam kết. Ở «Khôi phục thật», bước 5 «Ghi lại» (khoi-phuc.md dòng 113-114) không có «Đạt khi» hay «Đỏ thì», và không nói cách viết trang sự cố trong `wiki/incidents/`. Bước 1 ghi «Ở đâu: chủ kho», là một người chứ không phải một chỗ. Dòng cuối của xoay-khoa.md (dòng 126, ghi `wiki/log.md`) nằm trong mục «Đỏ thì làm gì» và cũng thiếu đủ bốn điều.
  required_evidence:
    - Bản sửa khoi-phuc.md, mục «Khôi phục thật» bước 5 (dòng 113-114): có Ở đâu, Gõ hay bấm, Đạt khi, Đỏ thì, và nói rõ cách viết trang sự cố trong wiki/incidents/ (tệp mẫu hoặc các dòng cần có) để người chưa từng làm không phải mở mã hay ontology/page-types.yaml. Lấy ở khoi-phuc.md sau khi sửa.
    - Bản sửa khoi-phuc.md, mục «Khôi phục thật» bước 1 (dòng 96): ô «Ở đâu» ghi một chỗ cụ thể (ví dụ trang Backups của Supabase để xem các ngày có sao lưu, hay chỗ ghi thời điểm đã chọn), không ghi «chủ kho». Lấy ở khoi-phuc.md sau khi sửa.
    - Bản sửa xoay-khoa.md dòng 126: việc ghi một dòng vào wiki/log.md thành một bước có đủ ở đâu, gõ gì, đạt khi, đỏ thì (hoặc ghi rõ đây là việc của người giữ kho mã). Lấy ở xoay-khoa.md sau khi sửa.
  human_override:  # chi nguoi ghi

Đề xuất panel: PASS (hai góc nhìn PASS, một góc nhìn phản đối); human_override để TRỐNG cho người quyết ở Cổng 2.

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Baseline round này không đo lại (evals.yaml không đổi từ lần đo cuối, round 1); field baseline của từng eval ghi n-a.

Eval không-phân-biệt (xanh ở cả HEAD lẫn baseline): E12 (make check) — lệnh hồi quy có chủ ý, cần xác nhận hoặc viết lại để khẳng định hành vi mới.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 3: machine evals green, one in-contract finding fixed in round 4.
Round 4: machine evals green, runbook PASS (judgment pending).
Round 5: machine evals green on 15ff708 (E5, E11 carried); E10 judgment awaits human at Gate 2 (one dissent on spec-alignment).
