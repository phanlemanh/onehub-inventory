---
schema_version: 2
feature_slug: upgrade-repo-setup-0-10-3
verdict: PASS
failed_evals: []
reason:
verified_by: "fresh-context verification subagent (grader, round 1; did not write the code, the measures or the evals)"
enforcement_mode: strict
bypass_used: false
verified_commit: 0b3578810e145cd1e637b6f891db117164ede60a
human_signoff: Phan Le Manh 2026-11-21
---

# Evidence Report: upgrade-repo-setup-0-10-3

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
  run_id: upgrade-repo-setup-0-10-3-E1-20261121T054212Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-21T05:43:46Z
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
  run_id: upgrade-repo-setup-0-10-3-E2-20261121T054405Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0103_apply_again
  verified_at: 2026-11-21T05:44:12Z
  output: |
    apply-again: apply.py of repo-setup-v0.10.3 has nothing left to do on HEAD (no marker, the 8 deleted samples not made again); on the base it creates the five sdlc tools, updates autonomy.py, github_setup.py and sdlc_metrics.py, merges AGENTS.md and marks the policy file, nothing else; applied to a copy of the base it writes HEAD's other ten files byte for byte and leaves markers in the policy file only

- eval: E3
  run_id: upgrade-repo-setup-0-10-3-E3-20261121T054419Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0103_template_same
  verified_at: 2026-11-21T05:44:27Z
  output: |
    template-same: the eight tool files are the tag's templates byte for byte with the hashes .repo-setup.json records; the manifest goes from 0.10.2 to 0.10.3 for 90 files, the 8 deleted samples keep 0.4.0, and it gains the five new tools; AGENTS.md loses only "The gate sees both and raises the tier."

- eval: E4
  run_id: upgrade-repo-setup-0-10-3-E4-20261121T054434Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0103_resolution
  verified_at: 2026-11-21T05:44:38Z
  output: |
    resolution: governance/autonomy.yaml is the marked file of apply.py with the block on the side of repo-setup 0.10.3 and one line changed, merge_method: squash to merge; as YAML it is the base's policy plus proof with an empty check, an empty required_checks and merge_method: merge, nothing else

- eval: E5
  run_id: upgrade-repo-setup-0-10-3-E5-20261121T054445Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0103_policy_same
  verified_at: 2026-11-21T05:44:53Z
  output: |
    policy-same: in the base, HEAD and the minimal resolution the tier of every tracked file, of a deleted test and of a bot update, the proof (none), the CODEOWNERS block (the committed one) and every step but the merge step (environments, ruleset, required checks) are the same and the policy has no problem; with no option the base would set squash-only merges, HEAD and the minimal resolution merge commits only

- eval: E6
  run_id: upgrade-repo-setup-0-10-3-E6-20261121T054500Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0103_merge_method
  verified_at: 2026-11-21T05:45:04Z
  output: |
    merge-method: github_setup.py reads merge_method: merge (no option or --merge-method merge: merge commits only); --merge-method squash is refused with exit 2, saying where the choice is made; merge_method: rebase turns the codeowners check red and stops github_setup.py, no tier changes; without the key the merge settings are left as they are, and the option sets them for one run

- eval: E7
  run_id: upgrade-repo-setup-0-10-3-E7-20261121T054519Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0103_real_run
  verified_at: 2026-11-21T05:45:24Z
  output: |
    real-run: the dry run of github_setup.py on phanlemanh/onehub-inventory exits 0 and would set merge commits only and require check, secret-scan, conventional-title, conventional-commits; --merge-method squash exits 2; main requires check, e2e, gate today from its one ruleset "main" (not "repo-setup: protect default branch", so --apply would add a second ruleset) with no code owner review required: left to the owner

- eval: E8
  run_id: upgrade-repo-setup-0-10-3-E8-20261121T054532Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0103_flow
  verified_at: 2026-11-21T05:45:41Z
  output: |
    flow: the flow measure names no _acceptance file and opens none; in four forms it exits 0 with a number over its threshold as without one and shows that line only when it is over; it writes nothing without --write, and with it only the week's page and the wiki index; nothing runs it by itself

- eval: E9
  run_id: upgrade-repo-setup-0-10-3-E9-20261121T054549Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0103_change_set
  verified_at: 2026-11-21T05:45:49Z
  output: |
    change-set: 871afebb is unchanged on the base and changes the eleven files of the upgrade; besides them the pull request changes only this dossier and the files of its round, not CI, the hook or its wiring, and of governance/ only the policy file; the config only gains the commands rs0103_*; tools/** and governance/** make it T3 by the base's tiers and autonomy.py ranks it high; it merges into origin/main without a conflict; every commit of the pull request passes the base's rule

- eval: E10
  run_id: upgrade-repo-setup-0-10-3-E10-20261121T054556Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rs0103_two_way
  verified_at: 2026-11-21T05:47:59Z
  output: |
    ✔ flow is red when a split report over its threshold changes the exit code
    ✔ flow is red when a number over its threshold changes the exit code
    ✔ flow is red when a tool names the dossiers
    ✔ change-set is red on another governance file, a commit off the rule, and a config line
    ℹ tests 19
    ℹ pass 19
    ℹ fail 0
    ℹ cancelled 0
    ℹ skipped 0
    ℹ todo 0

## Known limits

- E5, E6 và E8 chạy `github_setup.py main` và thước đo luồng với GitHub giả (`gh` giả), không với GitHub thật. Chúng đo công cụ sẽ làm gì, không đo GitHub nhận lời gọi ra sao.
- E7 đọc kho thật `phanlemanh/onehub-inventory` trên GitHub lúc chấm (khoảng 05:45Z ngày 2026-11-21), và chỉ ở chế độ dry run: phép đo chỉ gọi `python3 tools/github_setup.py` không tuỳ chọn và với `--merge-method squash`, không lần nào có `--apply` (người chấm đã đọc `rang/real-run.mjs` trước khi chạy). `--apply` chưa bao giờ chạy, nên chưa có bằng chứng về lần đặt cài đặt gộp thật trên GitHub. Ruleset của `main` có thể đổi sau lúc chấm.
- Chỗ lệch E7 ghi lại vẫn còn, và PR không sửa nó (hợp đồng, mục Notes). `main` hôm nay đòi `check`, `e2e`, `gate` qua một ruleset tên «main», và luật pull request của ruleset ấy không đòi code owner duyệt. Vì vậy, dù `autonomy.py` xếp PR ở hạng `high` (E9), GitHub không bắt buộc code owner duyệt PR này. Một lần `--apply` hôm nay sẽ tạo ruleset thứ hai, đòi `check, secret-scan, conventional-title, conventional-commits`.
- E8: cửa sổ GitHub giả là rỗng, nên phần đọc PR và lượt chạy của thước đo luồng chạy trên danh sách rỗng. Việc chúng không đọc hồ sơ dựa vào việc không tệp công cụ nào nhắc `_acceptance` (AC-8, Giới hạn). Thước đo luồng chưa chạy trên dữ liệu GitHub thật.
- E2 và E3 đọc cây repo-setup ở sha `c5581ff1` từ thư mục đệm `rs0103-repo-setup-c5581ff1…` trong thư mục tạm của hệ thống. Dấu `.fetched-commit` của thư mục ấy ghi lúc 04:19Z, trước vòng chấm. `lib.mjs` hỏi lại tag `repo-setup-v0.10.3` có còn trỏ về sha ấy không trước khi dùng thư mục đệm, và dấu phải mang đúng sha.
- Hỏi-1 (giữ cách gộp tay của PR hay đổi sang cách tối thiểu) là quyết định của chủ kho. E5 cho thấy hai cách cho cùng kết quả trên mọi thứ hồ sơ đo; E4 chỉ đo cách của PR.
- `e2e` và `e2e-db` không chạy trên máy chấm; hợp đồng giao chúng cho CI khi PR rời bản nháp.
- Làn baseline không chạy ở vòng chấm này; mọi eval ghi `baseline: n-a` (xem «Baseline khong do» dưới).

## Ngoài hợp đồng

## Analyst

none measured — baseline lane was not run in this independent grading round.

Baseline khong do: vòng chấm độc lập này không chạy làn baseline trên diffBase (`8e0a91c9`); mọi eval ghi `baseline: n-a`. Mặt đỏ của E2 đến E9 do E10 kiểm, bằng mười ba bài phá (đều đạt, mỗi bài đỏ đúng lời của nó): `template-same`, `apply-again`, `resolution`, hai bài `policy-same`, bốn bài `merge-method`, ba bài `flow`, `change-set`. E5 còn tự đo nền bên trong phép đo (nền sẽ đặt squash-only merges, HEAD đặt merge commits only). E1 là bộ kiểm chung của kho. E7 đọc kho thật nên không có bản phá.

## Variance

none — every eval is deterministic and ran once.

## Iterations

Round 1: cả 10 eval đạt trên `0b357881`. Mỗi lệnh chạy một lần, từ gốc kho, mỗi lần một lời gọi Bash với trần 600000 ms; không lệnh nào bị công cụ giết hay chuyển sang nền. `make check` mất khoảng 94 giây, `two-way.mjs` khoảng 123 giây. PASS.
