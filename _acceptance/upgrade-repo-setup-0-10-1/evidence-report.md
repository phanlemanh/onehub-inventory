---
schema_version: 2
feature_slug: upgrade-repo-setup-0-10-1
verdict: PASS
failed_evals: []
reason:
verified_by: "fresh-context verification subagent (grader, round 1; did not write the code or the measures)"
enforcement_mode: strict
bypass_used: false
verified_commit: a622aad4194cd89f05b46e39fff367bd01e8ca08
human_signoff: Phan Le Manh 2026-11-20
---

# Evidence Report: upgrade-repo-setup-0-10-1

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: upgrade-repo-setup-0-10-1-E1-20261120T032732Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-20T03:29:21Z
  output: |
     Test Files  148 passed (148)
          Tests  2466 passed | 2 skipped (2468)
    design-assembly: 19 decisions held by 27 checks, each seen failing on a changed copy
    component manifest: design/component-registry.json is up to date (294 components)
    determinism: 47/67 = 70%
    CODEOWNERS matches governance/autonomy.yaml
    no heavy checks
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E2
  run_id: upgrade-repo-setup-0-10-1-E2-20261120T032945Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0101_apply_again
  verified_at: 2026-11-20T03:29:47Z
  output: |
    apply-again: apply.py of repo-setup-v0.10.1 has nothing left to do on HEAD (manifest 0.10.1, no marker); on the base it updates pr-title.yml, merges AGENTS.md and does nothing else; removed is the 8 samples on both, edited grows by AGENTS.md only; applied to a copy of the base it writes HEAD's three files byte for byte

- eval: E3
  run_id: upgrade-repo-setup-0-10-1-E3-20261120T033007Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0101_template_same
  verified_at: 2026-11-20T03:30:08Z
  output: |
    template-same: pr-title.yml is the tag's template byte for byte and has the hash .repo-setup.json records; only the run of step 2 of conventional-commits changed, and it no longer names conventional-pre-commit

- eval: E4
  run_id: upgrade-repo-setup-0-10-1-E4-20261120T033014Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0101_commits_judged
  verified_at: 2026-11-20T03:30:38Z
  output: |
    commits-judged: block 9b34e9f5e8f7 of pr-title.yml, in a clean checkout: 8 hooks run at commit-msg and only commit-message refuses the probe; 238099bb and 10f4e6fb pass, "update stuff" and the kit's signoff and repin subjects are refused; 13 commits of the base since 2026-11-01 would be refused; the base's command finds no hook conventional-pre-commit; no commit-msg hook and an unreadable config each stop with their own message

- eval: E5
  run_id: upgrade-repo-setup-0-10-1-E5-20261120T033114Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0101_agents_tail
  verified_at: 2026-11-20T03:31:14Z
  output: |
    agents-tail: AGENTS.md changes only the two split rules and the closing section "What holds these rules"; secret-scan, conventional-title, conventional-commits, the wiki lint and the module boundaries all exist

- eval: E6
  run_id: upgrade-repo-setup-0-10-1-E6-20261120T033123Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0101_manifest
  verified_at: 2026-11-20T03:31:23Z
  output: |
    manifest: .repo-setup.json goes from 0.9.0 to 0.10.1; every file it records is at 0.10.1 except the 8 deleted samples, which keep 0.4.0; the hash changes for pr-title.yml and AGENTS.md only and wiki/log.head.md is added with the hash of the file

- eval: E7
  run_id: upgrade-repo-setup-0-10-1-E7-20261120T033125Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0101_change_set
  verified_at: 2026-11-20T03:31:25Z
  output: |
    change-set: 238099bb changes pr-title.yml, .repo-setup.json and AGENTS.md; 10f4e6fb one wiki/log file; besides them the pull request changes only this dossier and the files of its round, none a T3 path

- eval: E8
  run_id: upgrade-repo-setup-0-10-1-E8-20261120T033133Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0101_two_way
  verified_at: 2026-11-20T03:32:53Z
  output: |
    ✔ template-same is green on the tree
    ✔ commits-judged is green on the tree
    ✔ agents-tail is green on the tree
    ✔ manifest is green on the tree
    ✔ change-set is green on the tree
    ✔ template-same is red when pr-title.yml is not the template
    ✔ commits-judged is red on the workflow of the base
    ✔ commits-judged is red when judge accepts every message
    ✔ commits-judged is red when the probe no longer stops on a repository that judges nothing
    ✔ agents-tail is red when a line follows the closing section
    ✔ manifest is red on another version
    ✔ change-set is red on a file outside the upgrade, and on a T3 path
    ℹ tests 12 / pass 12 / fail 0 / skipped 0

- eval: E9
  run_id: upgrade-repo-setup-0-10-1-E9-20261120T033306Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0101_ruleset
  verified_at: 2026-11-20T03:33:08Z
  output: |
    ruleset: main requires check, e2e, gate only, no classic protection adds a check, and merge commits or rebase are allowed, so conventional-commits judges the commits without blocking a merge

## Known limits

- Job `conventional-commits` chạy từ nhánh chính (`pull_request_target`), nên mã mới chỉ chạy trên GitHub sau khi gộp; E4 đo khối chấm của nó trong bản checkout sạch trên máy (pre-commit qua `uvx`, không qua `pipx run` như trên runner), E9 đo nhánh nó sẽ đi. Lượt đầu trên runner (dựng môi trường tám hook, gồm `gitleaks`) chỉ quan sát được ở PR kế tiếp sau khi gộp.
- `e2e` và `e2e-db` không chạy trên máy chấm (cần trình duyệt và Postgres); hợp đồng giao chúng cho CI khi PR rời bản nháp.
- Cây tag `repo-setup-v0.10.1` mà E2, E3 đọc lấy từ thư mục đệm `rs0101-repo-setup-v0.10.1` trong thư mục tạm của hệ thống, do phiên trước tải về (lúc 09:44 giờ máy); `lib.mjs` dùng lại thư mục đệm khi nó có `plugins/repo-setup`, nên vòng chấm này không tải lại tag và không đối chiếu thư mục đệm với commit của tag.
- Làn baseline không chạy ở vòng chấm này; mọi eval ghi `baseline: n-a` (xem «Baseline khong do» dưới).
- AC-9 đọc ruleset và cài đặt gộp tại thời điểm chấm (03:33Z); chủ kho đổi ruleset sau đó thì kết luận không còn đúng.

## Ngoài hợp đồng

## Analyst

none measured — baseline lane was not run in this independent grading round.

Baseline khong do: vòng chấm độc lập này không chạy làn baseline trên diffBase; mọi eval ghi `baseline: n-a`. Mặt đỏ của E3, E4, E5, E6, E7 được E8 kiểm trên bảy bản phá (12 ca, đều đạt). E2 và E9 không có ca phá trong `two-way.mjs`; E2 tự so chéo HEAD với nền và với lần chạy thật trên bản sao của nền. E1 là bộ kiểm chung của kho.

## Variance

none — every eval is deterministic and ran once.

## Iterations

Round 1: cả 9 eval đạt trên `a622aad4`. Ghi chú quy trình: một lần gọi bộ chạy của người chấm (lỗi tách từ của zsh) ghi ba dòng hỏng vào `run-log.jsonl` (JSON không hợp lệ, `evalId` dạng `E5 agents-tail`, không mã thoát) mà không lệnh đo nào chạy; ba dòng ấy đã xoá ngay, rồi E5, E6, E7 chạy thật và ghi dòng mới. PASS.
