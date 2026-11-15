---
schema_version: 2
feature_slug: don-no-bo-kiem
verdict: REJECT
failed_evals: ["E4"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 7cc78f5155e4809404c33796e4b9f83d4440408f
human_signoff:
---

# Evidence Report: don-no-bo-kiem

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | FAIL |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | judgment | PASS (đề xuất của hội đồng, chờ người chốt) |
| E8b | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-9 | script | PASS |

Lệnh fail không gắn eval nào: không có. Lệnh `make e2e` fail và gắn vào E4 (xem khối E4 bên dưới).

## Evidence

- eval: E1
  run_id: minted-don-no-bo-kiem-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cong_chay
  verified_at: 2026-11-15T18:18:36Z
  output: |
    npx vitest run tests/cong-chay.test.ts --coverage.enabled=false --reporter=verbose
    (hai eval E1 và E2 chạy chung một lệnh, một lượt, đạt)

- eval: E2
  run_id: minted-don-no-bo-kiem-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cong_chay
  verified_at: 2026-11-15T18:18:36Z
  output: |
    npx vitest run tests/cong-chay.test.ts --coverage.enabled=false --reporter=verbose
    (chung lệnh với E1, một lượt, đạt)

- eval: E3
  run_id: minted-don-no-bo-kiem-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cho_tai_pha
  verified_at: 2026-11-15T18:18:36Z
  output: |
    cho-tai-pha: ca pha bat dung 'cho-tai: khung cho khong hien' o 360 va 1440, 0 canh bao, so dang ky bang main

- eval: E4
  run_id: minted-don-no-bo-kiem-E4-r1
  exit_code: 2
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-15T18:18:36Z
  output: |
    ✓  2207 [1440] › tools/e2e_templates/suite.ts:143:5 › cham › vung hieu-chuan › mo lai cung trang khong do lai ham cpu (1.6s)
    ✓  2208 [1440] › tools/e2e_templates/suite.ts:151:5 › cham › vung hieu-chuan › ngoai khuon: bang khong qua vung dung chung thi do (487ms)
    1025 skipped
    1183 passed (10.2m)
    gac-hydration: 3 canh bao, bai: screens/screens.spec.ts › man sent › pha khung axe-sang-toi: chu trang tren nen trang | ho-so-can.spec.ts › E7 · on a phone the record is the whole screen › break: a record three quarters wide is not
    make: *** [e2e] Error 1
  Lý do không đạt: eval đòi dòng ra có 'gac-hydration: 0 canh bao'. Lượt này có 3 cảnh báo, nên phép gác làm lượt đỏ đúng như thiết kế, dù 1183 bài đạt.

- eval: E5
  run_id: r1-l4-1-20261115181836
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gac_hydration_pha
  verified_at: 2026-11-15T18:18:36Z
  output: |
    gac-hydration-pha: luot co bai pha do (gac-hydration: 1 canh bao, bai: gac-hydration-pha.spec.ts › gac-hydration pha | screens/screens.spec.ts › man inventory › vung › vung cho-tai); luot khong bai pha xanh, 0 canh bao; hai cau hinh

- eval: E6
  run_id: minted-don-no-bo-kiem-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.so_quyet_dinh
  verified_at: 2026-11-15T18:18:36Z
  output: |
    src/generated/ontology.ts is up to date (21 entities)

- eval: E7
  run_id: minted-don-no-bo-kiem-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.wiki_so_trung
  verified_at: 2026-11-15T18:18:36Z
  output: |
    npx vitest run tests/wiki-lint-so-trung.test.ts --coverage.enabled=false --reporter=verbose (đạt)

- eval: E8b
  run_id: minted-don-no-bo-kiem-E8b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.release_de_xuat
  verified_at: 2026-11-15T18:18:36Z
  output: |
    release-de-xuat: khoa RELEASE_PLEASE_TOKEN, ba quyen doc-ghi, dong loi khop

- eval: E9
  run_id: minted-don-no-bo-kiem-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ranh_gioi_1u
  verified_at: 2026-11-15T18:18:36Z
  output: |
    ranh-gioi-1u: khong tep cam nao doi

- eval: E10
  run_id: r1-l9-1-20261115181836
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-15T18:18:36Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-don-no-bo-kiem-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-15T18:18:36Z

### Judge panel (đề xuất cho E8)

Đề xuất: PASS. Chủ kho quyết ở Cổng 2.

- domain-correctness: PASS — Dòng lỗi trong release-de-xuat.md trùng từng chữ với dòng ở «Gốc đã tìm» mục 3 của design doc. Khoá `RELEASE_PLEASE_TOKEN` và ba quyền Contents, Pull requests, Issues (đọc-ghi), cộng Metadata đọc tự có, khớp «Nợ 3», và không có quyền nào trên tệp workflow. Bản đề xuất có chỗ đặt (Settings → Secrets and variables → Actions), lối khác, giá của lối khác (PR phát hành vẫn không chạy CI, quyền mở cho mọi việc), nguyên nhân và kết quả mong đợi, nên chủ kho làm theo được mà không cần đọc log.
- operational-feasibility: PASS — Dòng lỗi trong bản đề xuất trùng nguyên văn dòng ở mục «Gốc đã tìm» 3. Tên khoá `RELEASE_PLEASE_TOKEN` và ba quyền Contents, Pull requests, Issues (đọc-ghi, thêm Metadata đọc tự có) khớp mục «Nợ 3», và không có quyền nào trên tệp workflow. Bản đề xuất có đủ chỗ đặt (Settings → Secrets and variables → Actions → New repository secret), lối khác cùng hai điểm giá, và các bước đủ để chủ kho làm theo mà không đọc log.
- spec-alignment: PASS — Dòng lỗi trong release-de-xuat.md trùng từng chữ với dòng ở mục «Gốc đã tìm» 3 của design doc. Khoá `RELEASE_PLEASE_TOKEN` và đúng ba quyền Contents, Pull requests, Issues (đọc-ghi), cộng Metadata read tự có, khớp «Nợ 3», và không có quyền nào trên tệp workflow. Bản đề xuất có chỗ đặt (Settings → Secrets and variables → Actions), lối khác (bật quyền cho Actions mở PR) và giá của lối khác (PR phát hành vẫn không chạy CI, quyền mở cho mọi việc của kho), đủ để chủ kho làm theo mà không đọc log.

human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên HEAD lẫn baseline):
- E10 (`make check`): xanh cả hai phía. Đây là lưới hồi quy có chủ ý, không phải eval hành vi mới.

Baseline khong do
- npx vitest run tests/cong-chay.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/cong-chay.test.ts co o cay dang kiem nhung chua co o merge-base 9cf7a596f3602e455f4ae61c2442332d93f80871 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/don-no-bo-kiem/rang/cho-tai-pha.sh: bo qua baseline: tep _acceptance/don-no-bo-kiem/rang/cho-tai-pha.sh co o cay dang kiem nhung chua co o merge-base 9cf7a596f3602e455f4ae61c2442332d93f80871 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/don-no-bo-kiem/rang/gac-hydration-pha.mjs: bo qua baseline: tep _acceptance/don-no-bo-kiem/rang/gac-hydration-pha.mjs co o cay dang kiem nhung chua co o merge-base 9cf7a596f3602e455f4ae61c2442332d93f80871 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/don-no-bo-kiem/rang/so-quyet-dinh.mjs --root . && make ontology: bo qua baseline: tep _acceptance/don-no-bo-kiem/rang/so-quyet-dinh.mjs co o cay dang kiem nhung chua co o merge-base 9cf7a596f3602e455f4ae61c2442332d93f80871 — eval moi, chay tren code cu khong phan biet gi
- npx vitest run tests/wiki-lint-so-trung.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/wiki-lint-so-trung.test.ts co o cay dang kiem nhung chua co o merge-base 9cf7a596f3602e455f4ae61c2442332d93f80871 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/don-no-bo-kiem/rang/release-de-xuat.mjs --root .: bo qua baseline: tep _acceptance/don-no-bo-kiem/rang/release-de-xuat.mjs co o cay dang kiem nhung chua co o merge-base 9cf7a596f3602e455f4ae61c2442332d93f80871 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/don-no-bo-kiem/rang/ranh-gioi.mjs --root .: bo qua baseline: tep _acceptance/don-no-bo-kiem/rang/ranh-gioi.mjs co o cay dang kiem nhung chua co o merge-base 9cf7a596f3602e455f4ae61c2442332d93f80871 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval nhiều lượt đều đồng nhất (mọi eval chạy một lượt, xác định).

## Iterations

Round 1: E4 failed — lượt `make e2e` ra 3 cảnh báo hydration (screens.spec.ts › man sent › pha khung axe-sang-toi, ho-so-can.spec.ts › E7 break) nên phép gác đỏ, không đạt điều kiện 'gac-hydration: 0 canh bao'. Returned to implementation.
