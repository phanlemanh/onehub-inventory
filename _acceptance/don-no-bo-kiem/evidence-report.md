---
schema_version: 2
feature_slug: don-no-bo-kiem
verdict: REJECT
failed_evals: ["E4"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 183ae848b600c7fc641baa83f4045dc16ac6304f
human_signoff:
---

# Evidence Report: don-no-bo-kiem

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS (carry-forward round 1) |
| E2 | AC-2 | test | PASS (carry-forward round 1) |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | FAIL |
| E5 | AC-5 | script | PASS (carry-forward round 1) |
| E6 | AC-6 | script | PASS (carry-forward round 1) |
| E7 | AC-7 | test | PASS (carry-forward round 1) |
| E8 | AC-8 | judgment | đề xuất PASS, chờ người chốt ở Cổng 2 |
| E8b | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS (carry-forward round 1) |
| E10 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-don-no-bo-kiem-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cong_chay
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-don-no-bo-kiem-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cong_chay
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: bxkxoakj9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cho_tai_pha
  verified_at: 2026-11-15T19:47:23Z
  output: |
    cho-tai-pha: ca pha bat dung 'cho-tai: khung cho khong hien' o 360 va 1440, 0 canh bao, so dang ky bang main

- eval: E4
  run_id: minted-don-no-bo-kiem-E4-r3
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-15T19:47:23Z
  output: |
    Lệnh make e2e đỏ: 1151 bài đạt, 1025 bỏ qua, các bài đỏ ở tools/e2e_templates/suite.ts:272
    (và :267 ở 1440) thuộc ba màn (inventory, sent, vung hieu-chuan) ở bốn cỡ 360, 414, 1024, 1440:
    - pha vung khong-khop: go nut Xoa loc
    - pha vung chu-dai: go tabindex
    - cham: vung khong-khop, vung chu-dai (chỉ ở 1440)
    gac-hydration: 0 canh bao
    make: *** [e2e] Error 1

- eval: E5
  run_id: r1-l4-1-20261115181836
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gac_hydration_pha
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-don-no-bo-kiem-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.so_quyet_dinh
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-don-no-bo-kiem-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.wiki_so_trung
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8b
  run_id: minted-don-no-bo-kiem-E8b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.release_de_xuat
  verified_at: 2026-11-15T19:47:23Z
  output: |
    release-de-xuat: khoa RELEASE_PLEASE_TOKEN, ba quyen doc-ghi, dong loi khop

- eval: E9
  run_id: minted-don-no-bo-kiem-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ranh_gioi_1u
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: bfr9865tk
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-15T19:47:23Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-don-no-bo-kiem-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-15T19:47:23Z

### Judgment

- eval: E8
  judged_by: judge-subagent (fresh context), đề xuất PASS
  Phiếu của các hội đồng:
  - domain-correctness: PASS — dòng lỗi ở release-de-xuat.md dòng 12 trùng nguyên văn dòng ở design doc «Gốc đã tìm» mục 3. Khoá RELEASE_PLEASE_TOKEN cùng ba quyền Contents, Pull requests, Issues (đọc-ghi) khớp «Nợ 3»; Metadata chỉ là quyền đọc tự có, không có quyền nào trên tệp workflow. Bản đề xuất có đủ chỗ đặt (Settings → Secrets and variables → Actions), lối khác (bật quyền cho Actions mở PR) cùng giá của nó, nên chủ kho làm theo được mà không cần đọc log.
  - operational-feasibility: PASS — dòng lỗi trùng nguyên văn mục «Gốc đã tìm» 3; khoá và ba quyền khớp «Nợ 3», không có quyền nào trên tệp workflow; có chỗ đặt và lối khác cùng giá hai mặt; các bước đủ để chủ kho làm theo mà không phải đọc log.
  - spec-alignment: PASS — dòng lỗi «release-please failed: GitHub Actions is not permitted to create or approve pull requests.» trùng nguyên văn mục «Gốc đã tìm» 3; khoá và đúng ba quyền khớp «Nợ 3», không có quyền nào trên tệp workflow; có chỗ đặt, lối khác và giá hai điểm của lối khác.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval không-phân-biệt (xanh cả trên HEAD lẫn baseline): E10 (make check) — chạy cả hai phía đều xanh, là lưới hồi quy có chủ ý, không chứng minh hành vi mới.

Lệnh fail không gắn eval: make e2e gắn E4 (đã ghi ở trên).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1, E2, E5, E6, E7, E9 và các eval khác được đo lần đầu; kết quả gốc của các eval mang nhãn carried_from_round: 1.
Round 2: browser suite đỏ vì cảnh báo hydration do các bài chạm trang sớm. Returned to implementation (xem commit 607c713, 19f0b6f).
Round 3: E4 vẫn đỏ — make e2e còn các bài phá vùng (go nut Xoa loc, go tabindex) và bài chậm ở 1440 đỏ trên ba màn, dù phép gác hydration báo 0 cảnh báo. Returned to implementation.
