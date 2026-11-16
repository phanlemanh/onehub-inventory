---
schema_version: 2
feature_slug: moi-truong-thu-va-ban-that
verdict: REJECT
failed_evals: ["E7"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: baef12958820a94ff110386d94a6494d0e8da072
human_signoff:
---

# Evidence Report: moi-truong-thu-va-ban-that

Vòng 2. Round 2 chạy lại E7, E8, E9, E11, E12 và hai lệnh suite; E1 đến E6 mang từ vòng 1 sang vì thay đổi không chạm đường dẫn của các eval đó.

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
| E10 | AC-9 | judgment | UNCERTAIN |
| E11 | AC-10 | test | PASS |
| E12 | AC-1 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-moi-truong-thu-va-ban-that-E1-r1
  exit_code: 0
  carried_from_round: 1
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T14:33:01Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-moi-truong-thu-va-ban-that-E2-r1
  exit_code: 0
  carried_from_round: 1
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T14:33:01Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-moi-truong-thu-va-ban-that-E3-r1
  exit_code: 0
  carried_from_round: 1
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T14:33:01Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-moi-truong-thu-va-ban-that-E4-r1
  exit_code: 0
  carried_from_round: 1
  baseline: n-a
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-16T14:33:01Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-moi-truong-thu-va-ban-that-E5-r1
  exit_code: 0
  carried_from_round: 1
  baseline: n-a
  verifier: config:executors.test.cau_hinh_ban_that
  verified_at: 2026-11-16T14:33:01Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: r1-l3-1-20261116143301
  exit_code: 0
  carried_from_round: 1
  baseline: n-a
  verifier: config:executors.script.ban_dung_that
  verified_at: 2026-11-16T14:33:01Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-moi-truong-thu-va-ban-that-E7-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.cach_ly_dich
  verified_at: 2026-11-16T14:55:47Z
  output: |
    8 ca đạt, 1 ca đỏ (tests/db/cach-ly-dich.db.test.ts)
    ca đỏ: «cach-ly-dich trên cơ sở lành > mọi ca ok đúng một lần, dòng cuối đếm ca, không đổi cơ sở dữ liệu hay dòng nào»
    AssertionError: expected [ Array(1) ] to deeply equal []
    nhận được: "co so du lieu bi xoa: khoi_phuc_thu_20261116_215603_43256"
    tests/db/cach-ly-dich.db.test.ts:128
    ba ca bản phá (bo_ep, anon, chu) đều đỏ đúng thông điệp ghim; bốn ca của phép đo «không tạo hay xoá cơ sở dữ liệu» đạt

- eval: E8
  run_id: minted-moi-truong-thu-va-ban-that-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.sao_luu_khoi_phuc
  verified_at: 2026-11-16T14:55:47Z
  output: |
    tests/db/sao-luu.db.test.ts: lệnh kết thúc thành công, không ca đỏ

- eval: E9
  run_id: minted-moi-truong-thu-va-ban-that-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.van_hanh
  verified_at: 2026-11-16T14:55:47Z
  output: |
    tests/van-hanh.test.ts: lệnh kết thúc thành công, không ca đỏ

- eval: E11
  run_id: minted-moi-truong-thu-va-ban-that-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoa_bi_mat
  verified_at: 2026-11-16T14:55:47Z
  output: |
    tests/khong-khoa-bi-mat.test.ts: lệnh kết thúc thành công, không ca đỏ

- eval: E12
  run_id: minted-moi-truong-thu-va-ban-that-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-16T14:55:47Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

### Phán đoán (judgment)

- eval: E10
  judged_by: judge-subagent (fresh context)
  verdict: UNCERTAIN
  panel (đề xuất): domain-correctness, operational-feasibility, spec-alignment
  votes:
    - domain-correctness: UNCERTAIN — Bốn quy trình và 13 việc ngoài kho đều có đủ bốn phần (ở đâu, gõ gì, đạt khi, đỏ thì). Thứ tự phụ thuộc của 13 việc khớp nhau, và chỉ có tên biến cùng tiền tố (`re_`, `prj_`), không có giá trị. Tuy vậy `xoay-khoa.md` còn một chỗ mơ hồ có thể làm hỏng bản thật; hai điều còn lại là cách làm phụ thuộc môi trường và chưa kiểm chứng được. Vì thế chưa dám cho PASS.
    - operational-feasibility: PASS — Cả bốn quy trình (dua-ban-len, lui-ban, xoay-khoa, khoi-phuc) đều ghi từng bước theo bốn mục Ở đâu, Gõ hay bấm, Đạt khi và Đỏ thì, mỗi quy trình có bảng đỏ riêng. 13 việc ngoài kho xếp theo thứ tự mỗi việc chỉ cần việc đứng trước, chỉ nêu tên biến, không nêu giá trị. Còn vài chỗ hở nhỏ không chặn người làm: xoay-khoa không có dòng xoay cho `RELEASE_PLEASE_TOKEN` (việc 11 bảo ghi hạn 1 năm vào lịch); lui-ban không tả định dạng tệp biến (khoi-phuc có tả); xoay-khoa không bảo bấm Reject cho việc `production` đang chờ duyệt khi chỉ xoay khoá bản thử.
    - spec-alignment: UNCERTAIN — Bốn quy trình và 13 việc ngoài kho gần như bước nào cũng ghi đủ ở đâu, gõ gì, đạt khi, đỏ thì; thứ tự việc 1 đến 13 đi được; chỉ có tên biến, tiền tố và chỗ giữ chỗ, không có giá trị thật. Chưa cho PASS vì năm tệp không nói tài khoản đăng nhập đầu tiên có từ đâu, và vài chỗ chọn nhánh hay thẻ ở lần đầu còn mơ hồ.
  required_evidence:
    - domain-correctness: Trong `docs/van-hanh/xoay-khoa.md`, bước 2 đặt `VERCEL_TOKEN` vào GitHub cho cả hai môi trường cùng lúc, còn bước 6 («Thu hồi khoá cũ») nằm trong vòng lặp bản thử rồi bản thật. Cần một câu nói rõ với khoá dùng chung (`VERCEL_TOKEN`, và `VERCEL_ORG_ID` nếu có) rằng chỉ thu hồi cái cũ sau khi cả hai môi trường đã đưa lại bản xong, và khoá mới chỉ tạo một lần. Lấy ở `xoay-khoa.md`, mục «Các bước», đầu mục hoặc bước 6.
    - domain-correctness: Biên bản một lượt chạy thử theo đúng năm tệp, ghi bởi người chưa từng làm, trên bản thử, có đủ `make sao-luu`, `make khoi-phuc-thu` (tạo cơ sở nháp `khoi_phuc_thu_…` qua chuỗi Session pooler của Supabase), `drop database … with (force)` trong SQL Editor, và `make rollback ENV=staging`; chứng minh dòng «Đạt khi» khớp đầu ra thực. Lấy ở `docs/van-hanh/nhat-ky-khoi-phuc.md` cùng nhật ký lượt Deploy trên GitHub Actions.
    - domain-correctness: Bằng chứng cho việc 11 và việc 12 của `docs/van-hanh/README.md`: lượt Deploy đầu tiên được khởi động thế nào khi chưa có PR phát hành nào; cần một dòng trong việc 12 nói rõ vào Actions › Deploy › Run workflow, chọn nhánh `main`.
    - spec-alignment: Chỗ năm tệp nói tài khoản đăng nhập đầu tiên của bản thử có từ đâu (migration tạo sẵn, lệnh mồi, hay SQL gõ tay). Lấy ở một việc hay bước thêm vào `docs/van-hanh/README.md` hoặc `docs/van-hanh/dua-ban-len.md`; hiện dua-ban-len.md bước 3, xoay-khoa.md bước 5 và lui-ban.md bước 4 đều đòi đăng nhập được mà không việc ngoài kho nào tạo tài khoản.
    - spec-alignment: Lần đầu ở một môi trường ghi rõ chọn nhánh hay thẻ nào ở ô «Use workflow from» khi chưa có thẻ phát hành (dua-ban-len.md mục «Lần đầu ở một môi trường» bước 2 và việc 12 của README), ví dụ chọn `main`.
    - spec-alignment: Nói chỗ lấy địa chỉ bản sao kho để `git clone`, và dạng tệp biến (mỗi dòng `TÊN=giá trị`) ngay trong lui-ban.md mục «Cần có trước».
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-moi-truong-thu-va-ban-that-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-16T14:55:47Z

- cmd: make e2e
  run_id: minted-moi-truong-thu-va-ban-that-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-16T14:55:47Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval không phân biệt (xanh cả trên bản mới lẫn baseline; chứng minh khung chạy chứ chưa chứng minh tính năng, cần viết lại để khẳng định hành vi mới hoặc xác nhận là lưới hồi quy có chủ ý): E12 (make check).

Lệnh fail không gắn eval: không có. Lệnh fail gắn eval: lệnh của E7 (tests/db/cach-ly-dich.db.test.ts, làn K) đỏ một ca.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E7 failed — bài kiểm cách ly địch đỏ trên làn K. Returned to implementation (sửa đếm cách ly, khôi phục từng bảng, biến, sổ tay).
Round 2: E7 failed — phép đo «không tạo hay xoá cơ sở dữ liệu» thấy một cơ sở nháp `khoi_phuc_thu_…` biến mất giữa lúc chạy trên cụm dùng chung của làn (nhiều khả năng do suite khác dọn cơ sở nháp của nó); E8, E9, E11, E12, build và e2e xanh. Returned to implementation.
