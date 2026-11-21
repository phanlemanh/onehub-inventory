---
schema_version: 2
feature_slug: lint-bo-qua-thu-muc-ngoai-git
verdict: BLOCKED
failed_evals: []
reason: [{"cmd":"node _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/kiem-tron.mjs","reason":"vuot thoi luong khai (long_running) — lenh cho tra __QUA_HAN, chua co dong __EXIT="}]
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 08d6dcb9c60a81ddc6c0ef130822b164054cb63a
human_signoff:
---

# Evidence Report: lint-bo-qua-thu-muc-ngoai-git

Vòng 2. Lệnh của E7 (`kiem-tron.mjs`) vượt thời lượng đã khai nên báo cáo ở trạng thái BLOCKED, không phải lỗi mã. Cách xử lý là chạy lại với thời hạn của công cụ dài hơn. Không eval nào fail.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | BLOCKED |

## Evidence

- eval: E1
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lnt_eslint
  verified_at: 2026-11-21T13:50:02Z
  output: |
    eslint: 3 of 3 out-of-git paths ignored (.acceptance-runs/x/a.mjs, .claude/worktrees/w/src/app/page.tsx, .claude/worktrees/w/.next/chunk.js)

- eval: E2
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lnt_prettier
  verified_at: 2026-11-21T13:50:02Z
  output: |
    prettier: 3 of 3 out-of-git paths ignored; .prettierignore alone ignores both folders

- eval: E3
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lnt_doi_chung
  verified_at: 2026-11-21T13:50:02Z
  output: |
    doi-chung: 18 of 18 in-tree paths keep their state (eslint 14 linted, 4 ignored; prettier 12 checked, 6 ignored)

- eval: E4
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lnt_chay_that
  verified_at: 2026-11-21T13:50:02Z
  output: |
    chay-that: npm run lint exit 0 with a broken .mjs planted in 3 out-of-git places; none named in the output; planted folders removed

- eval: E5
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E5-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-21T13:50:02Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E6
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lnt_two_way
  verified_at: 2026-11-21T13:50:02Z
  output: |
    node --test hoàn tất, không ca nào fail
    duration_ms 78699.240584

- eval: E7
  run_id: bm4r6h69e
  baseline: n-a
  verifier: config:executors.script.lnt_kiem_tron
  verified_at: 2026-11-21T13:50:02Z
  ket_qua: BLOCKED, lệnh vượt thời lượng khai (long_running), chờ trả __QUA_HAN và chưa có dòng kết thúc __EXIT
  output: |
    kiem-tron: root /Users/manhphan/dev/onehub-inventory-cham-102
    kiem-tron: plants lnt-82015-1795269076983
    __QUA_HAN

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-21T13:50:02Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-lint-bo-qua-thu-muc-ngoai-git-SUITE-DATABASE_URL_make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-21T13:50:02Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên HEAD lẫn baseline): E5 (`make check`). Đây là regression-guard có chủ ý, nó chứng minh bộ máy chứ không chứng minh tính năng.

Baseline không đo:
- node _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/bo-qua.mjs --eslint: bo qua baseline: tep _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/bo-qua.mjs co o cay dang kiem nhung chua co o merge-base 799ae9dc7f60f542e466f0656ddcde60bfffa2c8 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/bo-qua.mjs --prettier: bo qua baseline: tep _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/bo-qua.mjs co o cay dang kiem nhung chua co o merge-base 799ae9dc7f60f542e466f0656ddcde60bfffa2c8 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/bo-qua.mjs --doi-chung: bo qua baseline: tep _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/bo-qua.mjs co o cay dang kiem nhung chua co o merge-base 799ae9dc7f60f542e466f0656ddcde60bfffa2c8 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/chay-that.mjs: bo qua baseline: tep _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/chay-that.mjs co o cay dang kiem nhung chua co o merge-base 799ae9dc7f60f542e466f0656ddcde60bfffa2c8 — eval moi, chay tren code cu khong phan biet gi
- node --test _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/two-way.mjs: bo qua baseline: tep _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 799ae9dc7f60f542e466f0656ddcde60bfffa2c8 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/kiem-tron.mjs: bo qua baseline: tep _acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/kiem-tron.mjs co o cay dang kiem nhung chua co o merge-base 799ae9dc7f60f542e466f0656ddcde60bfffa2c8 — eval moi, chay tren code cu khong phan biet gi

Panel giám khảo: không có panel nào được đề xuất cho vòng này, nên không có mục judgment chờ người.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E6 failed, E7 bị một finding mức cao về thiếu đối chứng dương cho từng tệp cấy. Returned to implementation.
Round 2: E1 đến E6 và hai lệnh suite xanh; E7 BLOCKED vì `kiem-tron.mjs` vượt thời lượng khai, cần chạy lại với thời hạn công cụ dài hơn.
