---
schema_version: 2
feature_slug: upgrade-repo-setup-0-10-2
verdict: PASS
failed_evals: []
reason:
verified_by: "fresh-context verification subagent (grader, round 1; did not write the code, the measures or the evals)"
enforcement_mode: strict
bypass_used: false
verified_commit: f6b6b7ad43c761429b2f41599a58cc08c72006e9
human_signoff: Phan Le Manh 2026-11-20
---

# Evidence Report: upgrade-repo-setup-0-10-2

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
| E10 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: upgrade-repo-setup-0-10-2-E1-20261120T100813Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-20T10:09:37Z
  output: |
     Test Files  148 passed (148)
          Tests  2476 passed | 2 skipped (2478)
    design-assembly: 19 decisions held by 27 checks, each seen failing on a changed copy
    component manifest: design/component-registry.json is up to date (294 components)
    determinism: 47/67 = 70%
    CODEOWNERS matches governance/autonomy.yaml
    no heavy checks
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E2
  run_id: upgrade-repo-setup-0-10-2-E2-20261120T100959Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0102_apply_again
  verified_at: 2026-11-20T10:10:05Z
  output: |
    apply-again: apply.py of repo-setup-v0.10.2 has nothing left to do on HEAD (no marker, 32 edited files left alone, the 8 deleted samples not made again); on the base it updates pr-title.yml, autonomy.py and github_setup.py and does nothing else; applied to a copy of the base it writes HEAD's four files byte for byte, and a second run has nothing to do

- eval: E3
  run_id: upgrade-repo-setup-0-10-2-E3-20261120T101017Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0102_template_same
  verified_at: 2026-11-20T10:10:20Z
  output: |
    template-same: pr-title.yml, tools/autonomy.py and tools/github_setup.py are the tag's templates byte for byte with the hashes .repo-setup.json records; the manifest goes from 0.10.1 to 0.10.2 for every file but the 8 deleted samples (0.4.0), and only those three hashes change; in pr-title.yml only the checkout of conventional-commits (persist-credentials: false) and the run of its judging step changed

- eval: E4
  run_id: upgrade-repo-setup-0-10-2-E4-20261120T101033Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0102_fence
  verified_at: 2026-11-20T10:10:38Z
  output: |
    fence: the hook output of each refused commit is fenced by a new 32-hex token and the planted commands stay inside; outside, the runner reads only one ::error:: line per commit, its subject without control characters and with % escaped; on the could-not-run path the author's text is fenced and quoted too; with no random token the step prints nothing of the output and is red

- eval: E5
  run_id: upgrade-repo-setup-0-10-2-E5-20261120T101049Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0102_judged
  verified_at: 2026-11-20T10:11:06Z
  output: |
    judged: with pre-commit 4.7.0 the step of HEAD and the step of the base give the same answer on each of the 6 messages (the upgrade commit and a Gate 2 signoff pass; "update stuff", wip(dan-tu-excel) and a refusal that looks like an error of pre-commit are refused); both pass where the repository squashes, and both stop with their own message on no commit-msg hook and on a config they cannot read, HEAD's output fenced

- eval: E6
  run_id: upgrade-repo-setup-0-10-2-E6-20261120T101124Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0102_credentials
  verified_at: 2026-11-20T10:11:24Z
  output: |
    credentials: the checkout of conventional-commits keeps no token in .git/config (persist-credentials: false, the action's default at the base); the script of the judging step writes no git command and gets the token for gh from its env; no other job of pr-title.yml checks out

- eval: E7
  run_id: upgrade-repo-setup-0-10-2-E7-20261120T101136Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0102_runner
  verified_at: 2026-11-20T10:11:39Z
  output: |
    runner: run 44709236514 of PR 95 (pull_request_target, the upgrade commit) checked out main with the token kept and ran the base's unfenced script: the job of 0.10.2 has not run on a runner yet, and runs first on a pull request event after the merge

- eval: E8
  run_id: upgrade-repo-setup-0-10-2-E8-20261120T101151Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0102_policy
  verified_at: 2026-11-20T10:11:52Z
  output: |
    policy: on a copy, the policy may name gate under required_checks or as proof.check: the codeowners check passes, the classification reports the proof, and the ruleset github_setup.py main would write requires gate once, also when named in both places; with .github/workflows/pr-pipeline.yml both are refused again, check and secret-scan stay refused, and the tools of the base refuse gate; the real policy is unchanged

- eval: E9
  run_id: upgrade-repo-setup-0-10-2-E9-20261120T101204Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0102_change_set
  verified_at: 2026-11-20T10:12:04Z
  output: |
    change-set: dbe08dca is unchanged on the base and changes the four files of the upgrade; besides them the pull request changes only this dossier and the files of its round, not the policy, the hook or its wiring; the config only gains the commands rs0102_*; tools/** makes it T3 by the base's tiers; every commit of the pull request passes the base's rule

- eval: E10
  run_id: upgrade-repo-setup-0-10-2-E10-20261120T101215Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0102_two_way
  verified_at: 2026-11-20T10:14:09Z
  output: |
    ✔ judged is red when the step of HEAD accepts every message
    ✔ credentials is red when the checkout keeps the token, and when the step runs git
    ✔ runner is red on a run that is not the pull_request_target job
    ✔ policy is red when gate stays one of the setup's checks without the agent pipeline
    ✔ policy is red when github_setup.py main reads the checks without the repository's own list
    ✔ change-set is red when the config changes more than the round's commands
    ✔ change-set is red on the policy, and on a commit only a looser rule accepts
    ℹ tests 24 / pass 24 / fail 0 / cancelled 0 / skipped 0 / todo 0

## Known limits

- Hỏi-1 vẫn mở: job `conventional-commits` chạy theo `pull_request_target`, nên job có rào của 0.10.2 chưa từng chạy trên runner GitHub (E7 xác nhận lượt của PR 95 là job của nền). Việc đo trên runner thật chỉ làm được sau khi gộp, bằng PR thử mà hợp đồng khuyên; hồ sơ ký trước khi gộp nên không có bằng chứng ấy.
- E4 và E5 chạy trên macOS với các bản thay thế, không trên runner Ubuntu: bước chấm chạy bằng `bash --noprofile --norc -eo pipefail` với `gh` giả, pre-commit 4.7.0 qua `uvx` (không qua `pipx run`), `od` và `head` bản BSD (runner dùng bản GNU). Cách runner đọc `::stop-commands::` không đo được ở đây. Hook in lại tin của E4 là hook giả; hook thật của kho không in lại tin.
- E5 đo sáu tin của `ANSWERS` trong `rang/matrix.mjs`. Dòng tổng kết chỉ gọi tên năm tin; tin thứ sáu (tin đúng khuôn có thân cài `::warning::`, phải được nhận) nằm trong ma trận và lệnh vẫn thoát 0, nhưng dòng tổng kết không nhắc nó.
- E7 đọc một lượt chạy GitHub đã ghim (`44709236514`, job `136196394717`) qua `gh` tại thời điểm chấm; nó không thấy lượt nào chạy sau đó.
- E2, E3 đọc cây của repo-setup ở sha `2f8f1415` từ thư mục đệm `rs0102-repo-setup-2f8f1415…` trong thư mục tạm của hệ thống, có dấu `.fetched-commit` ghi lúc 09:49Z, trước vòng chấm. `lib.mjs` vẫn hỏi lại tag trỏ về sha ấy trước khi dùng thư mục đệm, và dấu phải mang đúng sha.
- `e2e` và `e2e-db` không chạy trên máy chấm. Hợp đồng giao chúng cho CI khi PR rời bản nháp.
- Làn baseline không chạy ở vòng chấm này; mọi eval ghi `baseline: n-a` (xem «Baseline khong do» dưới).
- Giới hạn có từ nền, AC-6 ghi lại, không đổi ở đây: `GH_TOKEN` nằm trong `env` của cả bước chấm, nên pre-commit và mọi hook đều thừa hưởng nó.

## Ngoài hợp đồng

## Analyst

none measured — baseline lane was not run in this independent grading round.

Baseline khong do: vòng chấm độc lập này không chạy làn baseline trên diffBase; mọi eval ghi `baseline: n-a`. Mặt đỏ của E2 đến E9 được E10 kiểm bằng 17 bài phá (24 ca, đều đạt): `template-same`, `apply-again`, bảy bài `fence`, hai bài `judged`, `credentials`, `runner`, hai bài `policy`, hai bài `change-set`. E4, E5 và E8 còn tự đo bản của nền bên trong phép đo (bước của nền để dòng cài lọt rào; công cụ của nền từ chối `gate`). E1 là bộ kiểm chung của kho.

## Variance

none — every eval is deterministic and ran once.

## Iterations

Round 1: cả 10 eval đạt trên `f6b6b7ad`. Mỗi lệnh chạy một lần, từ gốc kho, mỗi lần một lời gọi Bash với trần 600000 ms; không lệnh nào bị công cụ giết hay chuyển sang nền. `make check` mất khoảng 84 giây, `two-way.mjs` khoảng 114 giây. PASS.
