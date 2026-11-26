---
schema_version: 2
feature_slug: design-decisions-40-of-40
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent (fresh grader, verify round 1)
enforcement_mode: strict
bypass_used: false
verified_commit: 5c60522d79adda3bb4e01f291f860ac838fab7a7
human_signoff: Manh Phan 2026-11-26
---

# Evidence Report: design-decisions-40-of-40

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-2 | script | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-3 | script | PASS |
| E6 | AC-4 | script | PASS |
| E7 | AC-4 | script | PASS |
| E8 | AC-5 | script | PASS |
| E9 | AC-5 | script | PASS |
| E10 | AC-6 | script | PASS |
| E11 | AC-6 | script | PASS |
| E12 | AC-7 | script | PASS |
| E13 | AC-7 | script | PASS |
| E14 | AC-8 | script | PASS |
| E15 | AC-8 | script | PASS |
| E16 | AC-9 | script | PASS |
| E17 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: design-decisions-40-of-40-E1-20261126T062542Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-26T06:27:38Z
  output: |
    Test Files  154 passed (154)
         Tests  2663 passed | 2 skipped (2665)
    coverage-matrix: ok (4 roles, 9 screens, 8 pages, 35 contracts touching screens)
    design-assembly: 22 decisions held by 33 checks, each seen failing on a changed copy
    component manifest: design/component-registry.json is up to date (294 components)
    determinism: 62/73 = 85%
    no heavy checks
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E2
  run_id: design-decisions-40-of-40-E2-20261126T062747Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/do.mjs muc
  verified_at: 2026-11-26T06:27:49Z
  output: |
    muc: 40 of 40 core decisions answered, 11 held, 22 claimed, 7 recorded; 6 tiers reached or claimed (HEAD 5c60522d)

- eval: E3
  run_id: design-decisions-40-of-40-E3-20261126T062749Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/hai-chieu.mjs --only muc
  verified_at: 2026-11-26T06:27:56Z
  output: |
    ok muc-untag: green before, red after breaking: muc: the audit says 39 of 40, 11 held, 21 claimed, 7 recorded, not 40 of 40, 11 held, 22 claimed, 7 recorded
    hai-chieu: all 1 case(s) green before and red after

- eval: E4
  run_id: design-decisions-40-of-40-E4-20261126T062756Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/do.mjs sau-dong
  verified_at: 2026-11-26T06:27:58Z
  output: |
    sau-dong: error-copy recorded; terms, test-screen-sizes, reference-implementation, screen-ledger, screen-actions claimed by their checks (HEAD 5c60522d)

- eval: E5
  run_id: design-decisions-40-of-40-E5-20261126T062758Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/hai-chieu.mjs --only sau-dong
  verified_at: 2026-11-26T06:28:11Z
  output: |
    ok sau-dong-untag: green before, red after breaking: sau-dong: terms is failing by test:tests/language.test.ts: the file does not name decision:terms, not claimed by test:tests/language.test.ts
    ok sau-dong-repoint: green before, red after breaking: sau-dong: screen-actions is failing by test:tests/vai-man-so-man.test.ts: the file does not name decision:screen-actions, not claimed by test:tests/bo-nut-vai-man.test.ts
    hai-chieu: all 2 case(s) green before and red after

- eval: E6
  run_id: design-decisions-40-of-40-E6-20261126T062816Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/do.mjs loi-chu
  verified_at: 2026-11-26T06:28:19Z
  output: |
    loi-chu: the six rows are confirmed by Manh Phan on 2026-11-26; the four colour questions still wait (HEAD 5c60522d)

- eval: E7
  run_id: design-decisions-40-of-40-E7-20261126T062819Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/hai-chieu.mjs --only loi-chu
  verified_at: 2026-11-26T06:28:23Z
  output: |
    ok loi-chu-unconfirmed: green before, red after breaking: loi-chu: no confirmation by Manh Phan on 2026-11-26 in the note of screen-ledger
    hai-chieu: all 1 case(s) green before and red after

- eval: E8
  run_id: design-decisions-40-of-40-E8-20261126T062823Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/do.mjs kho-man
  verified_at: 2026-11-26T06:28:23Z
  output: |
    kho-man: the ledger row, the browser projects and design/states.md all say 360,414,1024,1440 (HEAD 5c60522d)

- eval: E9
  run_id: design-decisions-40-of-40-E9-20261126T062823Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/hai-chieu.mjs --only kho-man
  verified_at: 2026-11-26T06:28:27Z
  output: |
    ok kho-man-project: green before, red after breaking: kho-man: the browser projects are 375,414,1024,1440, not 360,414,1024,1440
    ok kho-man-row: green before, red after breaking: kho-man: the ledger row says 390,414,1024,1440, not 360,414,1024,1440
    hai-chieu: all 2 case(s) green before and red after

- eval: E10
  run_id: design-decisions-40-of-40-E10-20261126T062827Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/do.mjs dong-gan
  verified_at: 2026-11-26T06:28:27Z
  output: |
    dong-gan: four tests gained one first line each, tools/proof_gate/proof-gate.test.ts untouched since 50314af6 (HEAD 5c60522d)

- eval: E11
  run_id: design-decisions-40-of-40-E11-20261126T062827Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/hai-chieu.mjs --only dong-gan
  verified_at: 2026-11-26T06:28:31Z
  output: |
    ok dong-gan-extra: green before, red after breaking: dong-gan: tests/bo-nut-vai-man.test.ts is not its 50314af6 text with one first line // decision:screen-actions
    ok dong-gan-locked: green before, red after breaking: dong-gan: tools/proof_gate/proof-gate.test.ts changed since 50314af6
    hai-chieu: all 2 case(s) green before and red after

- eval: E12
  run_id: design-decisions-40-of-40-E12-20261126T062836Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/do.mjs tep-nhanh
  verified_at: 2026-11-26T06:28:36Z
  output: |
    tep-nhanh: 12 files changed since 50314af6, all on the list (HEAD 5c60522d)

- eval: E13
  run_id: design-decisions-40-of-40-E13-20261126T062836Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/hai-chieu.mjs --only tep-nhanh
  verified_at: 2026-11-26T06:28:37Z
  output: |
    ok tep-nhanh-extra: green before, red after breaking: tep-nhanh: changed outside the list: src/lib/probe.ts
    hai-chieu: all 1 case(s) green before and red after

- eval: E14
  run_id: design-decisions-40-of-40-E14-20261126T062837Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/do.mjs bo-chu
  verified_at: 2026-11-26T06:28:40Z
  output: |
    bo-chu: design/book-words.json has the template's 132 keys and the six questions, and no colour or name (HEAD 5c60522d)

- eval: E15
  run_id: design-decisions-40-of-40-E15-20261126T062840Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/hai-chieu.mjs --only bo-chu
  verified_at: 2026-11-26T06:28:59Z
  output: |
    ok bo-chu-key: green before, red after breaking: bo-chu: keys differ from the template: extra extra; missing none
    ok bo-chu-colour: green before, red after breaking: bo-chu: a value of the repository in design/book-words.json: /#[0-9a-f]{3,8}\b/i
    ok bo-chu-question: green before, red after breaking: bo-chu: questions are error-copy,reference-implementation,screen-actions,screen-ledger,test-screen-sizes, not the six
    hai-chieu: all 3 case(s) green before and red after

- eval: E16
  run_id: design-decisions-40-of-40-E16-20261126T062859Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/do.mjs dong-khac
  verified_at: 2026-11-26T06:28:59Z
  output: |
    dong-khac: 67 other rows as at 50314af6; the six rows present (HEAD 5c60522d)

- eval: E17
  run_id: design-decisions-40-of-40-E17-20261126T062859Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/hai-chieu.mjs --only dong-khac
  verified_at: 2026-11-26T06:29:00Z
  output: |
    ok dong-khac-row: green before, red after breaking: dong-khac: rows other than the six changed: color-role
    hai-chieu: all 1 case(s) green before and red after

## Known limits

- AC-3, AC-5: quyết định `test-screen-sizes` chỉ được đo là «có phép kiểm gắn tên» (`tests/e2e/frame.spec.ts`), không eval nào chạy bài ấy. `make check` không chạy bài trình duyệt (`make e2e` mới chạy), và kiểm tra của plugin chỉ xem dòng gắn tên chứ không chạy lại bài. Bài trình duyệt có hỏng thì cả 17 eval vẫn xanh. Ba bài kiểm gắn tên còn lại (`language`, `proof-matrix-self`, `bo-nut-vai-man`) và `coverage_matrix/check.py` thì có chạy trong `make check`.
- AC-5 (E8): phép đo `kho-man` chỉ đọc tên dự án trình duyệt (`name: "360"`), không đọc bề rộng. Một dự án tên «360» mà rộng 375 vẫn xanh; ca phá ở E9 đổi cả tên lẫn bề rộng nên không bắt được trường hợp này. Phép đo cũng chỉ đọc câu «ở bốn khổ» đầu tiên của `design/states.md`.
- AC-8 (E14): «không chứa tên kho» chỉ được dò bằng chữ `onehub`; tên khác của kho (như «Quỹ hàng», «inventory») hay tên người lọt vào vẫn xanh. Dò màu cũng không bắt `hsla(`, `color-mix(`, tên màu, hay `var(--...)`. Phép đo chỉ đối khoá, không đối kiểu hay giá trị: khoá đủ mà giá trị rỗng vẫn xanh.
- AC-9 (E16): phép đo `dong-khac` chỉ so các dòng sổ (khối `  - id:`). Phần đầu tệp (lời chú thích, `version: 1`) đổi thì không phép đo nào bắt, vì AC-7 cho phép đổi cả tệp `design/decisions.yaml`.
- AC-2, AC-3, AC-4: phép đo đọc plugin ở thư mục chủ kho cài mà không tự kiểm số bản. Lần chấm này thư mục ấy đúng bản 0.69.0; plugin ở đó đổi bản thì kết quả có thể đổi mà hồ sơ không báo.

## Ngoài hợp đồng

- `make check` in hai cảnh báo có từ trước, nhánh này không đụng tới: `wiki/index.md` dài 96 dòng (nên dưới 80), và thực thể `Member` chưa có module sở hữu trong `architecture/modules.yaml`. Không ảnh hưởng tới tiêu chí nào.

## Analyst

Non-discriminating evals: không đo được ở vòng này. Vòng chấm độc lập không chạy làn baseline trên chỗ rời `main`. Tám eval hai chiều (E3, E5, E7, E9, E11, E13, E15, E17) tự làm phần phân biệt: mỗi ca xanh trên bản sao không đổi của HEAD và đỏ sau khi phá, với đúng chữ hợp đồng ghim.

Baseline khong do: mọi eval ghi `baseline: n-a` vì vòng chấm độc lập này không chạy làn baseline. Thêm nữa, tệp đo `rang/do.mjs` và `rang/hai-chieu.mjs` chưa có ở chỗ rời `50314af6`, nên chạy E2..E17 trên mã cũ không chứng minh được gì.

## Variance

none — mọi eval là tất định, mỗi eval chạy một lần.

## Iterations

Round 1: cả 17 eval đạt trên HEAD 5c60522d (make check xanh với đúng bốn dòng hợp đồng ghim; tám phép đo xanh; mười ba ca phá trong tám lệnh hai chiều đều xanh trước và đỏ sau, đúng chữ ghim). Còn năm giới hạn phép đo, ghi ở Known limits.
