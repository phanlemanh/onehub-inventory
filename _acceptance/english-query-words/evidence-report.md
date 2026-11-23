---
schema_version: 2
feature_slug: english-query-words
verdict: REJECT
failed_evals: ["E12","E18"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ee053b89bd6de5dbaafe91842f2d83b759e46600
human_signoff:
---

# Evidence Report: english-query-words

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-7 | script | PASS |
| E1-pha | AC-7 | script | PASS |
| E2 | AC-4 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-1 | test | PASS |
| E5 | AC-2 | script | PASS |
| E6 | AC-2 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-5 | script | PASS |
| E9 | AC-5 | script | PASS |
| E10 | AC-8 | script | PASS |
| E11 | AC-8 | script | PASS |
| E12 | AC-8 | script | FAIL |
| E13 | AC-8 | script | PASS |
| E14 | AC-8 | script | PASS |
| E15 | AC-8 | script | PASS |
| E16 | AC-8 | script | PASS |
| E17-ui | AC-4 | ui-check | PASS |
| E18 | AC-4 | script | FAIL |

Lệnh fail không gắn eval riêng: lệnh Playwright của `tests/e2e-db/bang-hang-that.spec.ts` (dãy R) gắn chung cho E12 và E18. Ca fail duy nhất là `lien-ket-cu: an old link goes through sign-in once translated and opens the unit` ở khổ 1440: số bước dịch nhận được là một danh sách rỗng, trong khi eval hứa đúng một bước (dòng 676 của spec). 28 ca đạt, 35 ca bỏ qua.

## Evidence

- eval: E1
  run_id: minted-english-query-words-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-query-words/rang/query-words.mjs
  verified_at: 2026-11-23T10:23:51Z
  output: |
    quet: 9 tu x 11 ngu canh x 5 vung · cham: 0 · giu: 14

- eval: E1-pha
  run_id: minted-english-query-words-E1-pha-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-query-words/rang/query-words.mjs
  verified_at: 2026-11-23T10:23:51Z
  output: |
    self-test: 100/100 do dung cho

- eval: E2
  run_id: minted-english-query-words-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-query-words/rang/chay.sh
  verified_at: 2026-11-23T10:23:51Z
  output: |
    (lệnh không in dòng tóm tắt; kết thúc thành công)

- eval: E3
  run_id: minted-english-query-words-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-query-words/rang/chay.sh
  verified_at: 2026-11-23T10:23:51Z
  output: |
    (lệnh không in dòng tóm tắt; kết thúc thành công)

- eval: E4
  run_id: minted-english-query-words-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-query-words/rang/chay.sh
  verified_at: 2026-11-23T10:23:51Z
  output: |
    (lệnh không in dòng tóm tắt; kết thúc thành công)

- eval: E5
  run_id: minted-english-query-words-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-23T10:23:51Z
  output: |
    vitest src/modules/listings/ui/geo-tree.test.ts tests/dia-ly.test.tsx: xanh

- eval: E6
  run_id: minted-english-query-words-E6-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.goc_nhin_e2e
  verified_at: 2026-11-23T10:23:51Z
  output: |
    gac-hydration: 0 canh bao

- eval: E7
  run_id: minted-english-query-words-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-query-words/rang/chay.sh
  verified_at: 2026-11-23T10:23:51Z
  output: |
    (lệnh không in dòng tóm tắt; kết thúc thành công)

- eval: E8
  run_id: minted-english-query-words-E8-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.the_dien_thoai_e2e
  verified_at: 2026-11-23T10:23:51Z
  output: |
    gac-hydration: 0 canh bao

- eval: E9
  run_id: minted-english-query-words-E9-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ban_dung_that
  verified_at: 2026-11-23T10:23:51Z
  output: |
    ban-dung-that: 37 phép kiểm đạt

- eval: E10
  run_id: minted-english-query-words-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-23T10:23:51Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E11
  run_id: minted-english-query-words-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-23T10:23:51Z
  output: |
    gac-hydration: 0 canh bao

- eval: E12
  run_id: minted-english-query-words-E12-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-23T10:23:51Z
  output: |
    ✘  61 [1440] › tests/e2e-db/bang-hang-that.spec.ts:649:1 › lien-ket-cu: an old link goes through sign-in once translated and opens the unit
    Error: lien-ket-cu: so buoc dich
    Expected length: 1
    Received length: 0
    > 676 |   expect(translations, "lien-ket-cu: so buoc dich").toHaveLength(1);
    1 failed, 35 skipped, 28 passed (3.1m)

- eval: E13
  run_id: minted-english-query-words-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-23T10:23:51Z
  output: |
    gac-hydration: 0 canh bao

- eval: E14
  run_id: minted-english-query-words-E14-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-23T10:23:51Z
  output: |
    gac-hydration: 0 canh bao

- eval: E15
  run_id: minted-english-query-words-E15-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-query-words/rang/query-words.mjs
  verified_at: 2026-11-23T10:23:51Z
  output: |
    wiki: 0 trang thuc the tro tu cu · behaviors: 0 tu cu · nhat ky: 1 dong english-query-words

- eval: E16
  run_id: minted-english-query-words-E16-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-23T10:23:51Z
  output: |
    21 tệp giao diện ngoài bản đồ

- eval: E17-ui
  run_id: minted-english-query-words-E17-ui-r1
  exit_code: 0
  baseline: n-a
  verifier: tests/e2e-db/bang-hang-that.spec.ts
  verified_at: 2026-11-23T10:23:51Z
  screenshot: evidence/E17-ui-step1.png
  observed: |
    Frame old-link-1440.png (read directly): Bảng hàng at 1440. The record drawer is open on the right with heading "0905 · S1.01", Vinhomes Ocean Park 1 · S1.01 · Căn hộ, status Đang giao dịch, 5,71 tỷ, full details (Mã căn 0905, Toà S1.01). The sidebar has the place "Vinhomes Ocean Park 1" with "Tất cả" highlighted, and the table lists 36/60 rows with row 1 = 0905 · S1.01 · Vinhomes Ocean Park. This matches Expected: drawer open, place lit, address carries only the new words (record, place).
  network_observed: n-a (driver)

- eval: E18
  run_id: minted-english-query-words-E18-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-23T10:23:51Z
  output: |
    ✘  61 [1440] › tests/e2e-db/bang-hang-that.spec.ts:649:1 › lien-ket-cu: an old link goes through sign-in once translated and opens the unit
    Received length: 0 (expected 1 translation step)
    ✓  62 [1440] › tests/e2e-db/bang-hang-that.spec.ts:679:1 › lien-ket-cu: đối chứng — the same link in English takes no translation step

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-english-query-words-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-23T10:23:51Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả code mới lẫn baseline):
- E5: xanh ở cả hai phía, là bài đo giữ chuẩn có chủ ý hay cần viết lại để khẳng định hành vi mới thì cần người xem lại.
- E10: xanh ở cả hai phía, là cổng hồi quy bình thường nhưng nó không chứng minh được tính năng.

Baseline khong do
- node _acceptance/english-query-words/rang/query-words.mjs --root .: bo qua baseline: tep _acceptance/english-query-words/rang/query-words.mjs co o cay dang kiem nhung chua co o merge-base 25f847090057f37bbd5d9ac35a16f6b272878fda — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/english-query-words/rang/query-words.mjs --root . --self-test: bo qua baseline: tep _acceptance/english-query-words/rang/query-words.mjs co o cay dang kiem nhung chua co o merge-base 25f847090057f37bbd5d9ac35a16f6b272878fda — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/english-query-words/rang/chay.sh E2: bo qua baseline: tep _acceptance/english-query-words/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 25f847090057f37bbd5d9ac35a16f6b272878fda — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/english-query-words/rang/chay.sh E3: bo qua baseline: tep _acceptance/english-query-words/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 25f847090057f37bbd5d9ac35a16f6b272878fda — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/english-query-words/rang/chay.sh E4: bo qua baseline: tep _acceptance/english-query-words/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 25f847090057f37bbd5d9ac35a16f6b272878fda — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/english-query-words/rang/chay.sh E7: bo qua baseline: tep _acceptance/english-query-words/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 25f847090057f37bbd5d9ac35a16f6b272878fda — eval moi, chay tren code cu khong phan biet gi
- DATABASE_URL= make e2e: baseline vuot tran 53 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- DB_LANE=${DB_LANE:-r} DB_PORT=${DB_PORT:-5565} npx playwright test -c playwright.db.config.ts tests/e2e-db/bang-hang-that.spec.ts: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} npx playwright test -c playwright.db.config.ts tests/e2e-db/dia-ly.spec.ts: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- DB_LANE=${DB_LANE:-v} DB_PORT=${DB_PORT:-5570} npx playwright test -c playwright.db.config.ts tests/e2e-db/hoi-dau-chu-bao-sai.spec.ts: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node _acceptance/english-query-words/rang/query-words.mjs --root . --wiki: bo qua baseline: tep _acceptance/english-query-words/rang/query-words.mjs co o cay dang kiem nhung chua co o merge-base 25f847090057f37bbd5d9ac35a16f6b272878fda — eval moi, chay tren code cu khong phan biet gi
- R="${CLAUDE_PLUGIN_ROOT:-$(node tools/kit-root.mjs)}" && node "$R/scripts/design-floor-khuon.mjs" --kiem --root .: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E12, E18 failed — ca `lien-ket-cu` trên Postgres dãy R ở khổ 1440 không thấy bước dịch nào trong danh sách phản hồi chuyển hướng (nhận 0, hợp đồng hứa đúng 1), dù ca đối chứng bằng từ mới xanh. Returned to implementation.
