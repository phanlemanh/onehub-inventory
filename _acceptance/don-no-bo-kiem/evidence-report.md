---
schema_version: 2
feature_slug: don-no-bo-kiem
verdict: REJECT
failed_evals: ["E4","E9"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 714652559e44aa9153ade572771158520040e189
human_signoff:
---

# Evidence Report: don-no-bo-kiem

Round 4. Nội dung thay toàn bộ round cũ; lịch sử nằm ở mục Iterations.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS (carry-forward round 1) |
| E2 | AC-2 | test | PASS (carry-forward round 1) |
| E3 | AC-3 | script | PASS (carry-forward round 3) |
| E4 | AC-4 | script | FAIL |
| E5 | AC-5 | script | PASS (carry-forward round 1) |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | judgment | PASS (đề xuất của hội đồng, chờ người ở Cổng 2) |
| E8b | AC-8 | script | PASS (carry-forward round 1) |
| E9 | AC-9 | script | FAIL |
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
  run_id: minted-don-no-bo-kiem-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cho_tai_pha
  verified_at: 2026-11-15T20:07:04Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E4
  run_id: r4-l1-1-20261115225911
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-15T22:59:11Z
  output: |
    Lệnh: make e2e. Kết quả: 1214 passed, 1070 skipped (9.0m); make báo lỗi.
    gac-hydration: 3 canh bao, bai: settle.spec.ts › cho ngan › ngan khong mo | behavior.spec.ts › behavior › no serious accessibility violations | screens/screens.spec.ts › man inventory › vung › pha vung chu-dai: go tabindex | ...
    Hợp đồng đòi 'gac-hydration: 0 canh bao'; phép gác thấy 3 cảnh báo nên lượt đỏ.

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
  run_id: minted-don-no-bo-kiem-E6-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.so_quyet_dinh
  output: |
    node _acceptance/don-no-bo-kiem/rang/so-quyet-dinh.mjs --root . && make ontology
    Hoàn tất, không lỗi.

- eval: E7
  run_id: minted-don-no-bo-kiem-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.wiki_so_trung
  output: |
    npx vitest run tests/wiki-lint-so-trung.test.ts --coverage.enabled=false --reporter=verbose
    Hoàn tất, không lỗi.

- eval: E8
  judged_by: hội đồng ba góc nhìn (fresh context)
  proposal: PASS
  human_override:  # chi nguoi ghi

- eval: E8b
  run_id: minted-don-no-bo-kiem-E8b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.release_de_xuat
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-don-no-bo-kiem-E9-r4
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.ranh_gioi_1u
  output: |
    ranh-gioi-1u: doi tep cam tests/e2e-db/lop-rieng.spec.ts
    ranh-gioi-1u: doi tep cam tools/e2e_templates/suite.ts
    Hợp đồng đòi 'ranh-gioi-1u: khong tep cam nao doi'; có hai tệp cấm bị đổi.

- eval: E10
  run_id: bbm81levp
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  output: |
    CODEOWNERS matches governance/autonomy.yaml
    make check hoàn tất, không lỗi.

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-don-no-bo-kiem-SUITE-build-r4
  exit_code: 0
  verified_at: 2026-11-15T22:59:11Z

### Judge panel E8 (đề xuất, chờ người)

Đề xuất panel: PASS. human_override để trống cho người điền ở Cổng 2.

- domain-correctness: PASS — Dòng lỗi «release-please failed: GitHub Actions is not permitted to create or approve pull requests.» trùng nguyên văn dòng ở «Gốc đã tìm» 3. Khoá `RELEASE_PLEASE_TOKEN` có đúng ba quyền đọc-ghi (Contents, Pull requests, Issues) cùng Metadata Read tự có, như «Nợ 3», không có quyền nào trên tệp workflow. Bản đề xuất có chỗ đặt (Settings → Secrets and variables → Actions), lối khác (bật «Allow GitHub Actions to create and approve pull requests») và giá của lối ấy (PR phát hành vẫn không có CI, quyền mở cho mọi việc của kho), nên chủ kho làm theo được mà không cần đọc log.
- operational-feasibility: PASS — Dòng lỗi trùng nguyên văn «Gốc đã tìm» 3. Khoá `RELEASE_PLEASE_TOKEN` và đúng ba quyền Contents, Pull requests, Issues khớp design doc, không có quyền nào trên tệp workflow. Có chỗ đặt, lối khác và giá của nó. Lưu ý nhỏ, không đổi kết luận: nếu chọn GitHub App thì token cài đặt hết hạn nhanh, khó đặt thành secret tĩnh. Judge không thấy `release.yml` vì nó ngoài danh sách input.
- spec-alignment: PASS — Dòng lỗi trong release-de-xuat.md trùng từng chữ với «Gốc đã tìm» 3. Khoá chỉ có đúng ba quyền đọc-ghi cộng Metadata read tự có, đúng mục «Nợ 3», không có quyền nào trên tệp workflow. Có chỗ đặt, lối khác kèm hai điểm giá, đủ nguyên nhân và các bước để chủ kho làm mà không phải đọc log.

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval không-phân-biệt (xanh cả hai phía, chỉ chứng minh harness): E10 (`make check`) là regression-guard có chủ ý, không đo lại baseline round này.

Baseline không đo: mọi eval round này ghi n-a vì evals.yaml không đổi từ lần đo cuối ở round 1.

Lệnh fail không gắn eval: không có. Hai lệnh fail đều gắn eval: `make e2e` gắn E4 và `node _acceptance/don-no-bo-kiem/rang/ranh-gioi.mjs --root .` gắn E9.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 4: E4, E9 failed — E4: phép gác hydration thấy 3 cảnh báo trong lượt e2e đầy đủ thay vì 0; E9: hai tệp cấm bị đổi (tests/e2e-db/lop-rieng.spec.ts, tools/e2e_templates/suite.ts). Returned to implementation. Chi tiết các round 1-3 nằm trong run-log.jsonl.
