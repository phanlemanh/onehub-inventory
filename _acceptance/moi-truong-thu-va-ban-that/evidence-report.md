---
schema_version: 2
feature_slug: moi-truong-thu-va-ban-that
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ae4dc7c24b0a933fa5f82c69fe68504e4c664198
human_signoff:
---

# Evidence Report: moi-truong-thu-va-ban-that

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS (carry-forward tu round 5) |
| E2 | AC-2 | test | PASS (carry-forward tu round 5) |
| E3 | AC-3 | test | PASS (carry-forward tu round 5) |
| E4 | AC-4 | test | PASS (carry-forward tu round 5) |
| E5 | AC-5 | test | PASS (carry-forward tu round 1) |
| E6 | AC-6 | script | PASS (carry-forward tu round 5) |
| E7 | AC-7 | script | PASS (carry-forward tu round 5) |
| E8 | AC-8 | script | PASS (carry-forward tu round 7) |
| E9 | AC-9 | test | PASS |
| E10 | AC-9 | judgment | chờ người chốt (hội đồng đề xuất PASS) |
| E11 | AC-10 | test | PASS (carry-forward tu round 3) |
| E12 | AC-1 | script | PASS |

## Evidence

- eval: E9
  run_id: minted-moi-truong-thu-va-ban-that-E9-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.van_hanh
  verified_at: 2026-11-16T19:43:30Z
  output: |
    npx vitest run tests/van-hanh.test.ts --coverage.enabled=false --reporter=verbose
    (không có dòng đỏ; bộ kiểm sổ tay vận hành xanh)

- eval: E12
  run_id: minted-moi-truong-thu-va-ban-that-E12-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-16T19:43:30Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml

- eval: E1
  run_id: minted-moi-truong-thu-va-ban-that-E1-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T16:03:38Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-moi-truong-thu-va-ban-that-E2-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T16:03:38Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-moi-truong-thu-va-ban-that-E3-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T16:03:38Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-moi-truong-thu-va-ban-that-E4-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T16:03:38Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

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
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-moi-truong-thu-va-ban-that-E7-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly_dich
  verified_at: 2026-11-16T16:03:38Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-moi-truong-thu-va-ban-that-E8-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sao_luu_khoi_phuc
  verified_at: 2026-11-16T18:58:13Z
  carried_from_round: 7
  output: |
    carry-forward tu round 7 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-moi-truong-thu-va-ban-that-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoa_bi_mat
  verified_at: 2026-11-16T15:18:36Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-moi-truong-thu-va-ban-that-SUITE-build-r9
  exit_code: 0
  verified_at: 2026-11-16T19:43:30Z

- cmd: make e2e
  run_id: minted-moi-truong-thu-va-ban-that-SUITE-make_e2e-r9
  exit_code: 0
  verified_at: 2026-11-16T19:43:30Z

### Phán đoán (E10) — hội đồng đề xuất PASS, để human_override TRỐNG

- eval: E10
  judged_by: judge-subagent (fresh context)
  proposal: PASS
  panel: domain-correctness, operational-feasibility, spec-alignment
  votes:
    - domain-correctness: PASS — Cả bốn quy trình (đưa bản lên, lùi bản, xoay khoá, khôi phục) đều ghi đủ làm ở đâu, gõ hay bấm gì, thấy gì là đạt, đỏ thì làm gì. 14 việc ngoài kho đi theo thứ tự làm được, mỗi việc chỉ dựa vào việc đứng trước nó, và chỉ ghi tên biến cùng chỗ giữ chỗ, không có giá trị thật. Chỉ đọc năm tệp được giao nên không đối chiếu được với mã.
    - operational-feasibility: PASS — Bốn quy trình đều có từng bước đủ ở đâu, gõ hay bấm gì, đạt khi, đỏ thì, kèm bảng dòng đỏ cho từng lệnh. 14 việc ngoài kho đi theo thứ tự phụ thuộc làm được, mỗi việc có «Đạt khi» và «Đỏ thì», không ghi giá trị thật. Còn vài chỗ hở nhỏ (tên miền `onehub.center` phải có sẵn trong Vercel, «thẻ phát hành đang chạy» sau khi lùi bản, mật khẩu vai đăng nhập sau Supabase Restore) nhưng không chặn người vận hành làm đúng quy trình.
    - spec-alignment: PASS — Bốn quy trình đều ghi từng bước theo bốn mục «Ở đâu / Gõ hay bấm / Đạt khi / Đỏ thì», kèm bảng «Đỏ thì làm gì» tra theo dòng đỏ. 14 việc ngoài kho đi theo thứ tự làm được. Còn chỗ lỏng: bước 1 của «Khôi phục thật» ghi «Ở đâu: chủ kho», và mục «Đưa bản lên từ máy chủ kho» không nhắc `make setup`; không kiểm được `make deploy` chạy tay có cần `make setup` hay không.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi).

Baseline khong do: mọi eval ghi baseline n-a vì round này không đo lại.

Eval không phân biệt (xanh cả trên HEAD lẫn baseline): E12 (make check) — regression-guard có chủ ý, kiểm ranh giới mô-đun, nhãn và ontology; không phải eval của tính năng.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: các eval xanh lần đầu, người chốt chưa ký; chuyển sang vòng sửa.
Round 5: bộ eval deploy và bản dựng thật xanh; mốc carry-forward cho E1-E4, E6, E7.
Round 6: bước e2e có lần đỏ rồi xanh lại sau sửa.
Round 7: E8 (sao lưu, khôi phục) chạy lại xanh; sổ tay có thêm cách xử lý cho dòng dừng.
Round 8: E9 và E12 chạy lại trên HEAD, xanh; E10 chờ người chốt; còn một lỗi trong hợp đồng (sổ tay khôi phục cho hai cách xử lý trái nhau khi lệch bản) ghi ở review-findings.md.
Round 9: E9 và E12 chạy lại trên ae4dc7c, xanh; build và e2e xanh; E10 chờ người chốt (hội đồng đề xuất PASS); bốn lỗi ngoài hợp đồng (lời nhắc «sao lưu lại» còn trong khoi-phuc-thu.sh mâu thuẫn với sổ tay; bộ kiểm chỉ phủ một trong hai mục sổ tay đã đổi) chờ người quyết ở Cổng 2.
