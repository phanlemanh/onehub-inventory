---
schema_version: 2
feature_slug: design-decisions-40-of-40
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent (fresh grader, verify round 3)
enforcement_mode: strict
bypass_used: false
verified_commit: 6aa92a272b6ab1e7cd76fea9f2fa881a3d5144e0
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
  run_id: design-decisions-40-of-40-E1-r3-20261126T154712Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-26T15:49:09Z
  output: |
     Test Files  154 passed (154)
          Tests  2698 passed | 2 skipped (2700)
    coverage-matrix: ok (4 roles, 9 screens, 8 pages, 36 contracts touching screens)
    design-assembly: 25 decisions held by 36 checks, each seen failing on a changed copy
    component manifest: design/component-registry.json is up to date (297 components)
    determinism: 62/73 = 85%
    no heavy checks
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E2
  run_id: design-decisions-40-of-40-E2-r3-20261126T154916Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/do.mjs muc
  verified_at: 2026-11-26T15:49:16Z
  output: |
    muc: 40 of 40 core decisions answered, 14 held, 19 claimed, 7 recorded; 6 tiers reached or claimed (HEAD 6aa92a27)

- eval: E3
  run_id: design-decisions-40-of-40-E3-r3-20261126T154932Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/hai-chieu.mjs --only muc
  verified_at: 2026-11-26T15:49:32Z
  output: |
    ok muc-untag: green before, red after breaking: muc: the audit says 39 of 40, 14 held, 18 claimed, 7 recorded, not 40 of 40, 14 held, 19 claimed, 7 recorded
    hai-chieu: all 1 case(s) green before and red after

- eval: E4
  run_id: design-decisions-40-of-40-E4-r3-20261126T154919Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/do.mjs sau-dong
  verified_at: 2026-11-26T15:49:19Z
  output: |
    sau-dong: error-copy recorded; terms, test-screen-sizes, reference-implementation, screen-ledger, screen-actions claimed by their checks (HEAD 6aa92a27)

- eval: E5
  run_id: design-decisions-40-of-40-E5-r3-20261126T154939Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/hai-chieu.mjs --only sau-dong
  verified_at: 2026-11-26T15:49:39Z
  output: |
    ok sau-dong-untag: green before, red after breaking: sau-dong: terms is failing by test:tests/language.test.ts: the file does not name decision:terms, not claimed by test:tests/language.test.ts
    ok sau-dong-repoint: green before, red after breaking: sau-dong: screen-actions is failing by test:tests/vai-man-so-man.test.ts: the file does not name decision:screen-actions, not claimed by test:tests/bo-nut-vai-man.test.ts
    hai-chieu: all 2 case(s) green before and red after

- eval: E6
  run_id: design-decisions-40-of-40-E6-r3-20261126T154922Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/do.mjs loi-chu
  verified_at: 2026-11-26T15:49:22Z
  output: |
    loi-chu: the six rows are confirmed by Manh Phan on 2026-11-26; the four colour questions still wait (HEAD 6aa92a27)

- eval: E7
  run_id: design-decisions-40-of-40-E7-r3-20261126T154954Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/hai-chieu.mjs --only loi-chu
  verified_at: 2026-11-26T15:49:54Z
  output: |
    ok loi-chu-unconfirmed: green before, red after breaking: loi-chu: no confirmation by Manh Phan on 2026-11-26 in the note of screen-ledger
    hai-chieu: all 1 case(s) green before and red after

- eval: E8
  run_id: design-decisions-40-of-40-E8-r3-20261126T154925Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/do.mjs kho-man
  verified_at: 2026-11-26T15:49:25Z
  output: |
    kho-man: the ledger row, the browser projects and design/states.md all say 360,414,1024,1440 (HEAD 6aa92a27)

- eval: E9
  run_id: design-decisions-40-of-40-E9-r3-20261126T155002Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/hai-chieu.mjs --only kho-man
  verified_at: 2026-11-26T15:50:02Z
  output: |
    ok kho-man-project: green before, red after breaking: kho-man: the browser projects are 375,414,1024,1440, not 360,414,1024,1440
    ok kho-man-row: green before, red after breaking: kho-man: the ledger row says 390,414,1024,1440, not 360,414,1024,1440
    hai-chieu: all 2 case(s) green before and red after

- eval: E10
  run_id: design-decisions-40-of-40-E10-r3-20261126T154925Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/do.mjs dong-gan
  verified_at: 2026-11-26T15:49:25Z
  output: |
    dong-gan: four tests gained one first line each, tools/proof_gate/proof-gate.test.ts untouched since f1be1ca8 (HEAD 6aa92a27)

- eval: E11
  run_id: design-decisions-40-of-40-E11-r3-20261126T155005Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/hai-chieu.mjs --only dong-gan
  verified_at: 2026-11-26T15:50:05Z
  output: |
    ok dong-gan-extra: green before, red after breaking: dong-gan: tests/bo-nut-vai-man.test.ts is not its f1be1ca8 text with one first line // decision:screen-actions
    ok dong-gan-locked: green before, red after breaking: dong-gan: tools/proof_gate/proof-gate.test.ts changed since f1be1ca8
    hai-chieu: all 2 case(s) green before and red after

- eval: E12
  run_id: design-decisions-40-of-40-E12-r3-20261126T154925Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/do.mjs tep-nhanh
  verified_at: 2026-11-26T15:49:25Z
  output: |
    tep-nhanh: 20 files changed since f1be1ca8, all on the list (HEAD 6aa92a27)

- eval: E13
  run_id: design-decisions-40-of-40-E13-r3-20261126T155009Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/hai-chieu.mjs --only tep-nhanh
  verified_at: 2026-11-26T15:50:09Z
  output: |
    ok tep-nhanh-extra: green before, red after breaking: tep-nhanh: changed outside the list: src/lib/probe.ts
    ok tep-nhanh-map: green before, red after breaking: tep-nhanh: LO-TRINH.html, PRODUCT-MAP.md differ from the kit's drawing: LO-TRINH.html khớp tệp ý định và hồ sơ.
    hai-chieu: all 2 case(s) green before and red after

- eval: E14
  run_id: design-decisions-40-of-40-E14-r3-20261126T154925Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/do.mjs bo-chu
  verified_at: 2026-11-26T15:49:25Z
  output: |
    bo-chu: design/book-words.json has the template's 132 keys and the six questions, and no colour or name (HEAD 6aa92a27)

- eval: E15
  run_id: design-decisions-40-of-40-E15-r3-20261126T155014Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/hai-chieu.mjs --only bo-chu
  verified_at: 2026-11-26T15:50:14Z
  output: |
    ok bo-chu-key: green before, red after breaking: bo-chu: keys differ from the template: extra extra; missing none
    ok bo-chu-colour: green before, red after breaking: bo-chu: a value of the repository in design/book-words.json: /#[0-9a-f]{3,8}\b/i
    ok bo-chu-question: green before, red after breaking: bo-chu: questions are error-copy,reference-implementation,screen-actions,screen-ledger,test-screen-sizes, not the six
    hai-chieu: all 3 case(s) green before and red after

- eval: E16
  run_id: design-decisions-40-of-40-E16-r3-20261126T154928Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/do.mjs dong-khac
  verified_at: 2026-11-26T15:49:28Z
  output: |
    dong-khac: 67 other rows as at f1be1ca8; the six rows present (HEAD 6aa92a27)

- eval: E17
  run_id: design-decisions-40-of-40-E17-r3-20261126T155034Z
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-decisions-40-of-40/rang/hai-chieu.mjs --only dong-khac
  verified_at: 2026-11-26T15:50:34Z
  output: |
    ok dong-khac-row: green before, red after breaking: dong-khac: rows other than the six changed: color-role
    hai-chieu: all 1 case(s) green before and red after

## Known limits

- Phản biện-1 (chủ kho chọn ở Cổng Bằng chứng 2026-11-26): phép đo chỉ thấy lời xác nhận của chủ kho trong ghi chú, không so nội dung sáu câu trả lời với đề xuất chủ kho đã đồng ý.
- Phản biện-2 (chủ kho chọn): chưa có ca phá chứng rằng phép đo đỏ khi máy tự trả lời một câu về màu.
- Phản biện-3 (chủ kho chọn): phép đo đỏ khi một tầng tụt, nhưng chưa có ca phá chứng điều đó.
- Phản biện-4 (chủ kho chọn): hợp đồng không nói «sổ màn» được giữ bằng công cụ chạy trong kiểm toàn kho thay vì dòng gắn tên, và chưa có ca phá cắt mối nối ấy.
- Phản biện-5 (chủ kho chọn): phép dò bộ chữ chỉ bắt mã màu hex, rgb, hsl, oklch và một cách viết tên kho.
- Mang từ vòng 1, vẫn đúng ở vòng 3 — AC-3, AC-5: quyết định `test-screen-sizes` chỉ được đo là «có phép kiểm gắn tên» (`tests/e2e/frame.spec.ts`), không eval nào chạy bài trình duyệt ấy; `make check` không chạy bài trình duyệt. Bài ấy có hỏng thì 17 eval vẫn xanh.
- Mang từ vòng 1 — AC-5 (E8): phép đo `kho-man` đọc tên dự án trình duyệt, không đọc bề rộng; một dự án tên «360» mà rộng 375 vẫn xanh.
- Mang từ vòng 1 — AC-9 (E16): phép đo chỉ so các dòng sổ; phần đầu tệp `design/decisions.yaml` đổi thì không phép đo nào bắt.
- Mới ở vòng 2 — AC-2..AC-4, AC-7: phép đo đọc hai plugin ở thư mục chủ kho cài mà không tự kiểm số bản: design-assembly (vòng 3 chạy với `$DA_PLUGIN` trỏ vào bản trích 0.69.0, commit `d52453d`, vì máy chủ kho đã lên 0.76.0; với 0.76.0 thì E14 đỏ vì khuôn chữ có thêm 13 khoá về logo) và, mới ở vòng 2, bộ vẽ trang của kit acceptance-gate (vòng 3: 3.1.1, hợp đồng không ghim bản). Một trong hai đổi bản thì kết quả có thể đổi mà hồ sơ không báo.
- Mới ở vòng 2 — AC-7 (E12, E13): hai trang `PRODUCT-MAP.md` và `LO-TRINH.html` được nhận khi đúng bằng bản kit vẽ từ hồ sơ hiện tại. Bản vẽ ấy theo trạng thái hồ sơ (trang đang ghi việc này ở mục «Đang làm»), nên khi trạng thái hồ sơ đổi lúc ký mà trang chưa vẽ lại thì E12 sẽ đỏ; xanh của E12 chỉ đúng cho trạng thái hồ sơ lúc chấm. Thêm nữa, khi đỏ, câu báo gọi tên mọi trang kit nhánh đã đổi chứ không riêng trang lệch, và trích dòng đầu của bộ vẽ, có thể là dòng nói trang kia khớp (ca phá `tep-nhanh-map` sửa tay `PRODUCT-MAP.md` mà câu báo trích dòng của `LO-TRINH.html`). Phép đo vẫn đỏ đúng chỗ; chỉ câu báo kém chính xác.

## Ngoài hợp đồng

- `make check` vẫn in hai cảnh báo có từ trước, không tiêu chí nào chạm: `wiki/index.md` dài 97 dòng (nên dưới 80; vòng 1 là 96), và thực thể `Member` chưa có module sở hữu trong `architecture/modules.yaml`.

## Analyst

Non-discriminating evals: không đo được ở vòng này. Vòng chấm độc lập không chạy làn baseline trên chỗ rời `main`. Tám eval hai chiều (E3, E5, E7, E9, E11, E13, E15, E17) tự làm phần phân biệt: mỗi ca xanh trên bản sao không đổi của HEAD và đỏ sau khi phá, với đúng chữ hợp đồng ghim.

Baseline khong do: mọi eval ghi `baseline: n-a` vì vòng chấm độc lập này không chạy làn baseline. Thêm nữa, tệp đo `rang/do.mjs` và `rang/hai-chieu.mjs` chưa có ở chỗ rời `f1be1ca8`, nên chạy E2..E17 trên mã cũ không chứng minh được gì.

## Variance

none — mọi eval là tất định, mỗi eval chạy một lần.

## Iterations

Round 1: cả 17 eval đạt trên HEAD 5c60522d, trước khi gộp `main` (chỗ rời 50314af6); chủ kho đã ký. Sau đó gộp `main` có PR #123 (7e08ffd1) làm đổi số ghim, hợp đồng và evals cập nhật theo dòng sổ `fix`; chữ ký vòng 1 không áp cho vòng này.
Round 2: cả 17 eval đạt trên HEAD 69173dd4 (chỗ rời 7e08ffd1): make check xanh với đúng bốn dòng ghim mới (25 quyết định / 36 phép kiểm, 294 thành phần, 62/73, 2688 bài); tám phép đo xanh; mười bốn ca phá trong tám lệnh hai chiều đều xanh trước và đỏ sau, đúng chữ ghim. Thêm hai giới hạn mới ở Known limits; chờ chủ kho ký lại.
Round 3: gộp `main` có PR #83 (c68aeac2) rồi PR #127 (f1be1ca8) làm đổi hai số ghim của AC-1 (297 thành phần, 2698 bài), hợp đồng và evals cập nhật theo dòng sổ `fix`. Lần chấm độc lập đầu trên b785f7c8 đạt 15/17: E12, E13 đỏ vì hai trang bản đồ của kit chưa vẽ lại sau khi ghim số; vẽ lại ở 6aa92a27. Lần chấm độc lập thứ hai trên HEAD 6aa92a27 (chỗ rời f1be1ca8): cả 17 eval đạt; make check xanh với đúng bốn dòng ghim; tám phép đo xanh; mười bốn ca phá đều xanh trước và đỏ sau, đúng chữ ghim. Chữ ký vòng 2 không áp cho vòng này; chờ chủ kho ký lại.
