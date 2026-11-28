---
schema_version: 2
feature_slug: dua-deploy-yml-len-main
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 808af8c561772a5926a525f82fd346a9b9200303
human_signoff: Manh Phan 2026-11-28
---

# Evidence Report: dua-deploy-yml-len-main

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E3b | AC-3 | test | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-1 | script | PASS |
| E7 | AC-6 | script | PASS |
| E6 | AC-5 | script | PASS |
| E6b | AC-5 | script | PASS |
| E6c | AC-5 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-dua-deploy-yml-len-main-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dua-deploy-yml-len-main/rang/kiem.py
  verified_at: 2026-11-27T18:53:57Z
  output: |
    E1 ok: khối sổ tay ở HEAD bằng khối lúc ký dat-khoa-mot-lenh (182ca5b3)

- eval: E2
  run_id: minted-dua-deploy-yml-len-main-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dua-deploy-yml-len-main/rang/kiem.py
  verified_at: 2026-11-27T18:53:57Z
  output: |
    E2 ok: hai việc staging → production, chặn bằng DEPLOY_ENABLED, release.yml gọi một lần

- eval: E3
  run_id: minted-dua-deploy-yml-len-main-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dua-deploy-yml-len-main/rang/kiem.py
  verified_at: 2026-11-27T18:53:57Z
  output: |
    E3 ok: 12 tên đều có trong bảng biến, mỗi tên đặt ở đúng môi trường của việc đọc nó

- eval: E3b
  run_id: minted-dua-deploy-yml-len-main-E3b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dk_so_tay
  verified_at: 2026-11-27T18:53:57Z
  output: |
    Bài kiểm sổ tay hồ sơ dat-khoa-mot-lenh (tools/deploy/so-tay-khop.test.ts): các ca «E8 ·» đều pass.

- eval: E4
  run_id: minted-dua-deploy-yml-len-main-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dua-deploy-yml-len-main/rang/kiem.py
  verified_at: 2026-11-27T18:53:57Z
  output: |
    E4 ok: ngoài hồ sơ chỉ đổi deploy.yml (17 tệp)

- eval: E5
  run_id: minted-dua-deploy-yml-len-main-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dua-deploy-yml-len-main/rang/kiem.py
  verified_at: 2026-11-27T18:53:57Z
  output: |
    tu-kiem: 27/27 ca đúng

- eval: E7
  run_id: minted-dua-deploy-yml-len-main-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dua-deploy-yml-len-main/rang/kiem.py
  verified_at: 2026-11-27T18:53:57Z
  output: |
    E7 ok: môi trường production có người duyệt bắt buộc (phanlemanh)

- eval: E6
  run_id: minted-dua-deploy-yml-len-main-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-27T18:53:57Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E6b
  run_id: minted-dua-deploy-yml-len-main-E6b-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.build
  verified_at: 2026-11-27T18:53:57Z
  output: |
    npm run build hoàn tất, không lỗi.

- eval: E6c
  run_id: minted-dua-deploy-yml-len-main-E6c-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-27T18:53:57Z
  output: |
    make e2e hoàn tất, không lỗi.

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh cả trên HEAD lẫn baseline):

- E3b (npx vitest run tools/deploy/so-tay-khop.test.ts --coverage.enabled=false --reporter=verbose): xanh cả hai phía, là regression-guard của bài kiểm sổ tay hồ sơ trước đó, không chứng minh hành vi mới.

Baseline khong do:

- python3 _acceptance/dua-deploy-yml-len-main/rang/kiem.py E1: bo qua baseline: tep _acceptance/dua-deploy-yml-len-main/rang/kiem.py co o cay dang kiem nhung chua co o merge-base 1f4e7d368335a569760cbb9029c2b722987e5094 — eval moi, chay tren code cu khong phan biet gi
- python3 _acceptance/dua-deploy-yml-len-main/rang/kiem.py E2: bo qua baseline: tep _acceptance/dua-deploy-yml-len-main/rang/kiem.py co o cay dang kiem nhung chua co o merge-base 1f4e7d368335a569760cbb9029c2b722987e5094 — eval moi, chay tren code cu khong phan biet gi
- python3 _acceptance/dua-deploy-yml-len-main/rang/kiem.py E3: bo qua baseline: tep _acceptance/dua-deploy-yml-len-main/rang/kiem.py co o cay dang kiem nhung chua co o merge-base 1f4e7d368335a569760cbb9029c2b722987e5094 — eval moi, chay tren code cu khong phan biet gi
- python3 _acceptance/dua-deploy-yml-len-main/rang/kiem.py E4: bo qua baseline: tep _acceptance/dua-deploy-yml-len-main/rang/kiem.py co o cay dang kiem nhung chua co o merge-base 1f4e7d368335a569760cbb9029c2b722987e5094 — eval moi, chay tren code cu khong phan biet gi
- python3 _acceptance/dua-deploy-yml-len-main/rang/kiem.py --tu-kiem: bo qua baseline: tep _acceptance/dua-deploy-yml-len-main/rang/kiem.py co o cay dang kiem nhung chua co o merge-base 1f4e7d368335a569760cbb9029c2b722987e5094 — eval moi, chay tren code cu khong phan biet gi
- python3 _acceptance/dua-deploy-yml-len-main/rang/kiem.py E7: bo qua baseline: tep _acceptance/dua-deploy-yml-len-main/rang/kiem.py co o cay dang kiem nhung chua co o merge-base 1f4e7d368335a569760cbb9029c2b722987e5094 — eval moi, chay tren code cu khong phan biet gi
- make check: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval (E1, E2, E3, E3b, E4, E5, E7, E6, E6b, E6c) đều xanh; không có mục cần người phán xét.

### Re-pin lần 1 — 2026-11-28, do gộp main c55415fe (PR #133) vào nhánh VP10; thước E4 hồ sơ deploy (2efc5370); bài 3g chụp ra thư mục chạy (1cb3073b) — G-2811-45/51
run_id: repin-20261128T015659Z-62110
sha: 808af8c561772a5926a525f82fd346a9b9200303 · suites: 3 lệnh exit 0 · evals: 10/10 eval máy đạt kỳ vọng
