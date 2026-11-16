---
schema_version: 2
feature_slug: moi-truong-thu-va-ban-that
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 44385ef8b0e5e75f83cee028400d248041f4a35e
human_signoff:
---

# Evidence Report: moi-truong-thu-va-ban-that

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS (carry-forward từ round 5) |
| E2 | AC-2 | test | PASS (carry-forward từ round 5) |
| E3 | AC-3 | test | PASS (carry-forward từ round 5) |
| E4 | AC-4 | test | PASS (carry-forward từ round 5) |
| E5 | AC-5 | test | PASS (carry-forward từ round 1) |
| E6 | AC-6 | script | PASS (carry-forward từ round 5) |
| E7 | AC-7 | script | PASS (carry-forward từ round 5) |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-9 | judgment | PENDING-JUDGMENT (đề xuất PASS, chờ người chốt) |
| E11 | AC-10 | test | PASS (carry-forward từ round 3) |
| E12 | AC-1 | script | PASS |

## Evidence

- eval: E8
  run_id: minted-moi-truong-thu-va-ban-that-E8-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sao_luu_khoi_phuc
  verified_at: 2026-11-16T18:58:13Z
  output: |
    DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} npx vitest run -c vitest.db.config.ts tests/db/sao-luu.db.test.ts --reporter=verbose
    chạy 1 lần, đạt 1 lần, không phương sai

- eval: E9
  run_id: minted-moi-truong-thu-va-ban-that-E9-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.van_hanh
  verified_at: 2026-11-16T18:58:13Z
  output: |
    npx vitest run tests/van-hanh.test.ts --coverage.enabled=false --reporter=verbose
    chạy 1 lần, đạt 1 lần, không phương sai

- eval: E12
  run_id: minted-moi-truong-thu-va-ban-that-E12-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-16T18:58:13Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml

### Carry-forward (delta không chạm paths của eval — round này không chạy lại)

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
  run_id: minted-moi-truong-thu-va-ban-that-SUITE-build-r7
  exit_code: 0
  verified_at: 2026-11-16T18:58:13Z

- cmd: make e2e
  run_id: minted-moi-truong-thu-va-ban-that-SUITE-make_e2e-r7
  exit_code: 0
  verified_at: 2026-11-16T18:58:13Z

### Judgment

- eval: E10
  judged_by: hội đồng ba góc nhìn (fresh context), đề xuất PASS
  rationale: Cả ba góc nhìn đề xuất PASS; chưa có người chốt nên mục này chờ Cổng 2.
  panel: đề xuất domain-correctness, operational-feasibility, spec-alignment
  - domain-correctness: PASS — Bốn quy trình (đưa bản lên, lùi bản, xoay khoá, khôi phục) đều có từng bước ghi làm ở đâu, gõ hay bấm gì, thấy gì là đạt, đỏ thì làm gì, kèm bảng dòng đỏ và lệnh thay thế. Mười bốn việc ngoài kho theo đúng thứ tự phụ thuộc, mỗi việc có «Đạt khi» và «Đỏ thì», chỉ ghi tên biến, chỗ cần giá trị để chỗ trống như `[Tên]` hay `<mật khẩu …>`. Hai chỗ nhỏ chưa mượt (việc 12 lặp mật khẩu đã đặt ở việc 9; chưa hướng dẫn cài `make`), không chặn người làm lần đầu.
  - operational-feasibility: PASS — Cả bốn quy trình đủ bốn điều kèm bảng «Đỏ thì làm gì» theo từng dòng đỏ. Mười bốn việc ngoài kho đi theo thứ tự làm được, chỗ phụ thuộc việc 12/13 được nói rõ, mỗi việc có «Đạt khi» và «Đỏ thì». Chỉ ghi tên biến và chỗ giữ chỗ.
  - spec-alignment: PASS — Bốn quy trình chia bước với bốn ý Ở đâu / Gõ hay bấm / Đạt khi / Đỏ thì, mỗi bước có lệnh hoặc nút cụ thể, dòng cần thấy và cách xử lý khi đỏ. Mười bốn việc ngoài kho đúng thứ tự phụ thuộc. Thiếu sót nhỏ: việc 9 không nói cách sinh `AUTH_SECRET` (lệnh nằm ở xoay-khoa.md), và `nhat-ky-khoi-phuc.md` nằm ngoài năm tệp nên không đọc được; cả hai không làm hỏng khả năng làm theo.
  required_evidence:
    - (judge không nêu bằng-chứng-thiếu)
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Baseline khong do: mọi eval ghi `baseline: n-a` (round này không đo lại, evals.yaml không đổi từ lần đo cuối ở round 1).

Eval không-phân-biệt (xanh cả trên mã cũ lẫn mã mới, chứng minh harness chứ không phải tính năng; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E12 (`make check`) — regression-guard có chủ ý.

## Variance

none — every multi-run eval is uniform (mọi eval chạy 1 lần, xác định)

## Iterations

Round 1: eval đầu tiên chạy trên mã gốc; E8, E9, E12 và hai lệnh suite xanh, baseline đo một lần.
Round 2-4: chạy lại theo thay đổi mã; E5 giữ từ round 1, E11 giữ từ round 3.
Round 5: E1-E4, E6, E7 chạy lại và xanh.
Round 6: chạy lại bộ eval và suite trên cùng mã; một ca trình duyệt đỏ rồi xanh khi chạy lại.
Round 7: mã đổi ở sao lưu và khôi phục (commit 44385ef); E8, E9, E12 và hai lệnh suite chạy lại và xanh; E1-E7 và E11 carry-forward; E10 chờ người chốt.
