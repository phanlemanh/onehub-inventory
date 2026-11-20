---
schema_version: 2
feature_slug: commit-msg-kit-subjects
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context grader, round 2 (Phase 3 VERIFY); did not write the code, the measures or the evals
enforcement_mode: strict
bypass_used: false
verified_commit: c910cdeb176f61e369e9ca89c632434f92aa8a6b
human_signoff:
---

# Evidence Report: commit-msg-kit-subjects

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

## Evidence

- eval: E1
  run_id: commit-msg-kit-subjects-E1-20261120T072324Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cmks_kit_subjects
  verified_at: 2026-11-20T07:23:24Z
  output: |
    kit-subjects: the 7 subjects the kit v3.0.0 writes (found word for word in its files; 4 scripts commit into the repository, 1 into a scratch repository, no other; its markdown tells to commit no other subject) pass tools/commit_msg.py, alone and with a body

- eval: E2
  run_id: commit-msg-kit-subjects-E2-20261120T072402Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cmks_near_miss
  verified_at: 2026-11-20T07:24:02Z
  output: |
    near-miss: the 32 near misses are refused, the two probes of the job among them

- eval: E3
  run_id: commit-msg-kit-subjects-E3-20261120T072409Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cmks_history
  verified_at: 2026-11-20T07:24:09Z
  output: |
    history: over the 1393 non-merge commits of 499ee2cf the tree accepts 12 more (7 Gate 2 signoff, 5 repin), refuses none the base accepts, and still refuses 1: wip(dan-tu-excel): paste path from the clickable preview

- eval: E4
  run_id: commit-msg-kit-subjects-E4-20261120T072429Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cmks_commits_judged
  verified_at: 2026-11-20T07:24:29Z
  output: |
    commits-judged: block 9b34e9f5e8f7 of pr-title.yml, with pre-commit 4.7.0 from uvx in a clean checkout of HEAD: 8 hooks run at commit-msg and only commit-message refuses the probe; the 7 kit subjects pass, "update stuff" and "wip(dan-tu-excel)" are refused

- eval: E5
  run_id: commit-msg-kit-subjects-E5-20261120T072440Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-20T07:24:40Z
  output: |
     Test Files  148 passed (148)
          Tests  2476 passed | 2 skipped (2478)
    ...
    design-assembly: 19 decisions held by 27 checks, each seen failing on a changed copy
    component manifest: design/component-registry.json is up to date (294 components)
    determinism: 47/67 = 70%
    CODEOWNERS matches governance/autonomy.yaml
    no heavy checks
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E6
  run_id: commit-msg-kit-subjects-E6-20261120T072605Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cmks_change_set
  verified_at: 2026-11-20T07:26:05Z
  output: |
    change-set: the pull request changes tools/commit_msg.py and tests/commit-msg.test.ts, wiki/log/**, this dossier and the files of its round; none of .pre-commit-config.yaml, .github/**, governance/**; every commit of the pull request passes the base's rule

- eval: E7
  run_id: commit-msg-kit-subjects-E7-20261120T072612Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cmks_two_way
  verified_at: 2026-11-20T07:26:12Z
  output: |
    ✔ near-miss and history are red when wip takes any scope (16716.527292ms)
    ✔ history is red when an old prefix is dropped (15803.89675ms)
    ✔ commits-judged is red when tools/commit_msg.py accepts every message (2578.909417ms)
    ✔ change-set is red on a file outside the change, and on the hook's wiring (529.494417ms)
    ✔ change-set is red on a commit of the pull request that only the new rule accepts (123.07575ms)
    ✔ test-cases is red when an old case of the test file is dropped (1065.337166ms)
    ℹ tests 18
    ℹ pass 18
    ℹ fail 0
    ℹ duration_ms 62223.039041

- eval: E8
  run_id: commit-msg-kit-subjects-E8-20261120T072721Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cmks_test_cases
  verified_at: 2026-11-20T07:27:21Z
  output: |
    test-cases: tests/commit-msg.test.ts keeps every case of the base and adds 4 accepted and 6 refused cases, no other

## Known limits

- E4 chạy khối dò và chấm của job với pre-commit 4.7.0 lấy qua `uvx`, trong một checkout sạch của HEAD trên máy cục bộ. Trên runner, job gọi `pipx run pre-commit`, có thể là phiên bản khác: lượt chấm này chưa đo trên runner.
- Làn nền (baseline A/B trên `499ee2cf`) không chạy ở lượt này: mọi eval ghi `baseline: n-a`. Tính phân biệt của các phép đo dựa trên E7 (mười ba bản phá, mỗi bản đỏ đúng điều nó canh), không dựa trên làn nền.
- E1 đọc kit delivery-loop v3.0.0 từ bản cài cục bộ (`~/.claude/plugins/cache/delivery-loop/`, tìm qua `tools/kit-root.mjs`). Một bản cài khác phiên bản, hoặc kit được cập nhật sau lượt này, có thể cho kết quả khác.
- E5: `make check` thoát 0, nhưng trong đầu ra có bốn dòng «Not implemented: navigation to another Document» của jsdom; đây là cảnh báo của môi trường kiểm, không làm bài nào trượt.
- Ghi chú của hợp đồng về `release-please` không được đo ở lượt này (hợp đồng cũng nói hồ sơ không đo riêng).
- `run-log.jsonl` có hai dòng E2 của vòng 2. Dòng đầu (`commit-msg-kit-subjects-E2-20261120T072340Z`) ghi một lần gọi hỏng của người chấm: zsh không tách chữ của biến chứa lệnh, nên shell báo không tìm thấy tệp mang tên cả câu lệnh, và phép đo `near-miss.mjs` không hề chạy. Dòng ấy không phải kết quả của phép đo. Người chấm muốn xoá dòng đó nhưng bị chặn, nên dòng vẫn nằm trong nhật ký để giữ dấu vết. E2 được chạy lại đúng cách ngay sau đó, và báo cáo này dùng run_id của lần chạy lại (`…T072402Z`).

## Ngoài hợp đồng

## Analyst

Baseline khong do: làn nền không chạy ở lượt chấm này (người điều phối không giao làn nền; lượt chấm chạy độc lập theo đường VERIFY của skill `acceptance`). Các tệp đo dưới `rang/` cũng không có trên `499ee2cf`, nên chạy chúng trên cây nền không chứng minh gì. Bằng chứng phân biệt thay thế: E7 cho thấy mỗi phép đo đỏ trên bản phá tương ứng (18/18 bài đạt, trong đó 13 bản phá).

Không có eval nào được xác định là xanh-cả-hai-phía, vì không có số liệu nền.

Thay đổi từ vòng 1 sang vòng 2 chỉ nằm trong thước đo: `rang/lib.mjs` ép `shell: false` sau tuỳ chọn của bên gọi trong `run`, và `rang/two-way.mjs` thoát đủ ký tự đặc biệt của biểu thức chính quy (kể cả gạch chéo ngược) khi dựng mẫu từ tên tệp. Người chấm đọc diff `caff11b2..c910cdeb`: không tệp nào ngoài `_acceptance/commit-msg-kit-subjects/` đổi, và hai chỗ sửa không đổi điều phép đo canh. Bài `change-set is red on a file outside the change, and on the hook's wiring` (bài dùng hàm thoát mới) vẫn đạt trong E7.

## Variance

none — every eval is deterministic and ran once (1/1).

## Iterations

Round 1: E1–E8 passed on caff11b2a56abac7a1c7b5d171b9e14d45ab611b; no eval returned to implementation.
Round 2: chấm lại cả tám eval trên c910cdeb176f61e369e9ca89c632434f92aa8a6b, sau khi sửa hai cảnh báo CodeQL trong thước đo (`rang/lib.mjs` ép `shell: false`; `rang/two-way.mjs` thoát mọi ký tự đặc biệt khi dựng mẫu từ tên tệp; xem dòng `d-20261120T072211Z-7` của `decisions.jsonl`). E1–E8 passed; không eval nào phải quay lại phần cài đặt.
