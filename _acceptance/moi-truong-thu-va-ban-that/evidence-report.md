---
schema_version: 2
feature_slug: moi-truong-thu-va-ban-that
verdict: REJECT
failed_evals: ["E7"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ed2e36fe1434b65f62dce53d85da1c91b677b2c7
human_signoff:
---

# Evidence Report: moi-truong-thu-va-ban-that

Vòng 1. Một eval đỏ: E7 (AC-7). Lệnh đỏ duy nhất là lệnh của E7, không có lệnh đỏ nào ngoài eval.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | FAIL |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-9 | judgment | đề xuất FAIL, chờ người quyết ở Cổng 2 |
| E11 | AC-10 | test | PASS |
| E12 | AC-1 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-moi-truong-thu-va-ban-that-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T14:33:01Z
  output: |
    (lệnh `npx vitest run tools/deploy ...` kết thúc thành công, không có dòng tóm tắt riêng)

- eval: E2
  run_id: minted-moi-truong-thu-va-ban-that-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T14:33:01Z
  output: |
    (cùng lệnh với E1, kết thúc thành công)

- eval: E3
  run_id: minted-moi-truong-thu-va-ban-that-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T14:33:01Z
  output: |
    (cùng lệnh với E1, kết thúc thành công)

- eval: E4
  run_id: minted-moi-truong-thu-va-ban-that-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T14:33:01Z
  output: |
    (cùng lệnh với E1, kết thúc thành công)

- eval: E5
  run_id: minted-moi-truong-thu-va-ban-that-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.cau_hinh_ban_that
  verified_at: 2026-11-16T14:33:01Z
  output: |
    (config.test.ts và config-ban-that.test.ts kết thúc thành công)

- eval: E6
  run_id: r1-l3-1-20261116143301
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ban_dung_that
  verified_at: 2026-11-16T14:33:01Z
  output: |
    ban-dung-that: 33 phép kiểm đạt

- eval: E7
  run_id: minted-moi-truong-thu-va-ban-that-E7-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.cach_ly_dich
  verified_at: 2026-11-16T14:33:01Z
  output: |
    4 ca đạt, 1 ca đỏ (Tests 1 failed | 4 passed).
    Đỏ: cach-ly-dich trên cơ sở lành > mọi ca ok đúng một lần, dòng cuối đếm ca, không đổi cơ sở dữ liệu hay dòng nào
    AssertionError tại tests/db/cach-ly-dich.db.test.ts:94: expect(after).toEqual(before)
    số cơ sở dữ liệu trước = 6, sau = 7 (các bảng còn lại giữ nguyên số dòng)
    Ba bản phá đều đỏ đúng thông điệp ghim: bo_ep, anon, chu.

- eval: E8
  run_id: minted-moi-truong-thu-va-ban-that-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sao_luu_khoi_phuc
  verified_at: 2026-11-16T14:33:01Z
  output: |
    (tests/db/sao-luu.db.test.ts kết thúc thành công)

- eval: E9
  run_id: minted-moi-truong-thu-va-ban-that-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.van_hanh
  verified_at: 2026-11-16T14:33:01Z
  output: |
    (tests/van-hanh.test.ts kết thúc thành công)

- eval: E11
  run_id: minted-moi-truong-thu-va-ban-that-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoa_bi_mat
  verified_at: 2026-11-16T14:33:01Z
  output: |
    (tests/khong-khoa-bi-mat.test.ts kết thúc thành công)

- eval: E12
  run_id: minted-moi-truong-thu-va-ban-that-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-16T14:33:01Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

### Mục judgment

- eval: E10
  judged_by: hội đồng ba góc nhìn (fresh context)
  proposal: FAIL
  rationale: Cả ba góc nhìn cùng đề xuất FAIL. Bốn quy trình có đủ bốn điều và không tệp nào ghi giá trị khoá, nhưng việc 11 của README gửi người đọc sang tệp ngoài năm tệp đầu vào và là điều kiện của lần đưa bản đầu.
  votes:
    - domain-correctness: FAIL — Việc 11 bắt chép `deploy.yml` và sửa lỗi Release từ hai tệp `_acceptance/...` ngoài năm tệp, gọi tên «hàng 22», không ghi thấy gì là đạt hay đỏ thì làm gì. Các việc 1 đến 13 chưa có «đạt khi» và «đỏ thì» từng việc. Hỏi-2, Hỏi-3, Hỏi-4 không được giải nghĩa. Bước 4 của «Khôi phục thật» thiếu cách nạp tệp biến của bản thật (cần LOGIN_DATABASE_URL).
    - operational-feasibility: FAIL — Người chỉ có năm tệp không làm được việc 11, mà việc 12 (lần đưa bản đầu) phụ thuộc vào nó. Lệnh cài vercel chỉ dẫn sang tệp ngoài và không ghi số bản. Thiếu định nghĩa «người dựng» và các mốc Hỏi-2, Hỏi-3, Hỏi-4.
    - spec-alignment: FAIL — Việc 11 gửi tới `_acceptance/moi-truong-thu-va-ban-that/workflows-de-xuat.md` và `_acceptance/don-no-bo-kiem/release-de-xuat.md`; `lui-ban.md` buộc đọc tệp tự động triển khai để biết phiên bản vercel (hiện chỉ ghi `vercel@…` và «bản ghi trong .nvmrc»).
  required_evidence:
    - Việc 11 của README tự đủ: nội dung `deploy.yml` (hoặc lệnh cp từ một đường dẫn có trong kho sau khi gộp) và các bước đặt RELEASE_PLEASE_TOKEN, kèm «đạt khi» và «đỏ thì»; grep `docs/van-hanh/` không còn `_acceptance/` như bước bắt buộc.
    - README các việc 1 đến 13: mỗi việc có «thấy gì là đạt» và «đỏ thì làm gì».
    - Lệnh cài vercel có số bản cụ thể và phiên bản Node ghi thẳng trong `lui-ban.md` và `dua-ban-len.md`.
    - Hỏi-2, Hỏi-3, Hỏi-4 giải nghĩa một dòng tại chỗ hoặc bỏ đi; có dòng định nghĩa «người dựng».
    - `khoi-phuc.md`, «Khôi phục thật», bước 4: ghi cách nạp tệp biến của bản thật.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-moi-truong-thu-va-ban-that-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-16T14:33:01Z

- cmd: make e2e
  run_id: minted-moi-truong-thu-va-ban-that-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-16T14:33:01Z

## Known limits

## Ngoài hợp đồng

## Analyst

E12 (`make check`): xanh trên cả HEAD lẫn baseline, không phân biệt. Đây là regression-guard có chủ ý của hàng (ranh giới mô-đun, nhãn, ontology), không phải eval kiểm hành vi mới.

Baseline khong do
- npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tools/deploy co o cay dang kiem nhung chua co o merge-base c8c745ac1ab6bfaaf7802a129bf9f5df5382c1b1 — eval moi, chay tren code cu khong phan biet gi
- npx vitest run src/modules/identity/config.test.ts src/modules/identity/config-ban-that.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep src/modules/identity/config-ban-that.test.ts co o cay dang kiem nhung chua co o merge-base c8c745ac1ab6bfaaf7802a129bf9f5df5382c1b1 — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} bash tools/deploy/thu-ban-dung.sh: bo qua baseline: tep tools/deploy/thu-ban-dung.sh co o cay dang kiem nhung chua co o merge-base c8c745ac1ab6bfaaf7802a129bf9f5df5382c1b1 — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} npx vitest run -c vitest.db.config.ts tests/db/cach-ly-dich.db.test.ts --reporter=verbose: bo qua baseline: tep tests/db/cach-ly-dich.db.test.ts co o cay dang kiem nhung chua co o merge-base c8c745ac1ab6bfaaf7802a129bf9f5df5382c1b1 — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} npx vitest run -c vitest.db.config.ts tests/db/sao-luu.db.test.ts --reporter=verbose: bo qua baseline: tep tests/db/sao-luu.db.test.ts co o cay dang kiem nhung chua co o merge-base c8c745ac1ab6bfaaf7802a129bf9f5df5382c1b1 — eval moi, chay tren code cu khong phan biet gi
- npx vitest run tests/van-hanh.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/van-hanh.test.ts co o cay dang kiem nhung chua co o merge-base c8c745ac1ab6bfaaf7802a129bf9f5df5382c1b1 — eval moi, chay tren code cu khong phan biet gi
- npx vitest run tests/khong-khoa-bi-mat.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/khong-khoa-bi-mat.test.ts co o cay dang kiem nhung chua co o merge-base c8c745ac1ab6bfaaf7802a129bf9f5df5382c1b1 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E7 failed — số cơ sở dữ liệu sau khi chạy cach-ly-dich là 7, trước là 6, nên phép «không đổi cơ sở dữ liệu» đỏ; E10 đề xuất FAIL (README việc 11 phụ thuộc tệp ngoài năm tệp). Returned to implementation.
