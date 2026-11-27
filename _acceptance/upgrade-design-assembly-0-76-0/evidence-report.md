---
schema_version: 2
feature_slug: upgrade-design-assembly-0-76-0
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e3b2f2d0bb254d64fbc9491050018c0bb1974a21
human_signoff:
---

# Evidence Report: upgrade-design-assembly-0-76-0

Vòng 1 bị REJECT không phải vì một eval hỏng. Cả 15 eval máy đều xanh. Lệnh suite `DATABASE_URL= make e2e` không gắn eval nào và đỏ ở một bài: `tests/e2e/screens/open-cell-truncate.spec.ts:79`, chiều 1440. Bài đó hết 30 giây khi chờ `thead th[data-col-id=""]`. Kết quả của suite này là 1304 bài qua, 1 bài đỏ, 1163 bài bỏ qua. Lệnh đó đỏ nên cả vòng bị từ chối.

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
| E16 | AC-9 | judgment | PASS (hội đồng đề xuất, chờ người chốt) |

## Evidence

- eval: E1
  run_id: minted-upgrade-design-assembly-0-76-0-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-27T02:34:09Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E2
  run_id: r1-l2-1-20261127023409
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-76-0/rang/gate-lines.mjs
  verified_at: 2026-11-27T02:34:09Z
  output: |
    gate: the gate holds 25 decisions by 36 checks; determinism rate 62/73, 25 held and 37 claimed (at e3b2f2d0bb25)

- eval: E3
  run_id: minted-upgrade-design-assembly-0-76-0-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs
  verified_at: 2026-11-27T02:34:09Z
  output: |
    held: gate-lines without one check of color-contrast (red)

- eval: E4
  run_id: minted-upgrade-design-assembly-0-76-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-76-0/rang/tool-tree.mjs
  verified_at: 2026-11-27T02:34:09Z
  output: |
    tool: tools/design-assembly is the plugin's version 0.76.0, 51 files, tree 80ed15e5d52b; the stamp says the same; mk/design-assembly.mk is the template's; the installed plugin is 0.76.0, names that tree in its release ledger and its templat

- eval: E5
  run_id: r1-l5-1-20261127023409
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs
  verified_at: 2026-11-27T02:34:09Z
  output: |
    held: tool-tree without the plugin folder (red)

- eval: E6
  run_id: minted-upgrade-design-assembly-0-76-0-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-76-0/rang/decision-states.mjs
  verified_at: 2026-11-27T02:34:09Z
  output: |
    states: the 0.76.0 tool and the 0.69.0 tool, on the ledger at HEAD, give each of the 73 decisions the same state; both say 62/73 (at e3b2f2d0bb25)

- eval: E7
  run_id: minted-upgrade-design-assembly-0-76-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs
  verified_at: 2026-11-27T02:34:09Z
  output: |
    held: decision-states with raw-table unchecked on the 0.69.0 side (red)

- eval: E8
  run_id: minted-upgrade-design-assembly-0-76-0-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-76-0/rang/audit.mjs
  verified_at: 2026-11-27T02:34:09Z
  output: |
    audit: coverage: 40 of 40 core decisions answered (14 held and re-run here, 19 claimed and not re-run, 7 recorded) (at e3b2f2d0bb25)

- eval: E9
  run_id: minted-upgrade-design-assembly-0-76-0-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs
  verified_at: 2026-11-27T02:34:09Z
  output: |
    held: audit without the row error-copy (red)

- eval: E10
  run_id: minted-upgrade-design-assembly-0-76-0-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-76-0/rang/words.mjs
  verified_at: 2026-11-27T02:34:09Z
  output: |
    words: design/book-words.json has the template's 145 keys and the six questions; the 13 brand keys are Vietnamese, NFC, and hold nothing design/language.md rules out; the table matches (at e3b2f2d0bb25)

- eval: E11
  run_id: minted-upgrade-design-assembly-0-76-0-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs
  verified_at: 2026-11-27T02:34:09Z
  output: |
    held: words with a stale table (red)

- eval: E12
  run_id: r1-l12-1-20261127023409
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-76-0/rang/book.mjs
  verified_at: 2026-11-27T02:34:09Z
  output: |
    book: the book draws from the tree as it is (40 of 40, no brand page); on clones with an icon set, a bare icon set and a logo row it shows all 13 brand words in Vietnamese and none in the template's English (at e3b2f2d0bb25)

- eval: E13
  run_id: minted-upgrade-design-assembly-0-76-0-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs
  verified_at: 2026-11-27T02:34:09Z
  output: |
    held: book with brandFloorText in English (red)

- eval: E14
  run_id: minted-upgrade-design-assembly-0-76-0-E14-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-76-0/rang/change-list.mjs
  verified_at: 2026-11-27T02:34:09Z
  output: |
    changes: the upgrade commit changes its 14 files; the branch changes nothing beyond the upgrade and this record (at e3b2f2d0bb25)

- eval: E15
  run_id: minted-upgrade-design-assembly-0-76-0-E15-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs
  verified_at: 2026-11-27T02:34:09Z
  output: |
    held: change-list once merged (green)

- eval: E16
  judged_by: judge panel (fresh context): domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS
  rationale: Hội đồng đề xuất PASS. Ba góc nhìn đều thấy 13 câu tiếng Việt cùng nghĩa với khuôn tiếng Anh của dòng đó, viết hoa đúng chỗ và không phạm design/language.md. Đây chỉ là đề xuất của máy, người chốt ở Cổng 2.
  votes:
    - domain-correctness: PASS — Cả 13 dòng đều cùng nghĩa với khuôn tiếng Anh của dòng đó. Chữ hoa đúng: câu đứng riêng viết hoa, còn «dòng», «ghim», «cỡ», «nét» và «chưa ghi cỡ nào» viết thường như bản tiếng Anh. Bảng không có chữ «sàn», dấu chấm than, emoji hay dấu thanh kiểu cũ. Hai chỗ lệch nhẹ không đổi ý: «từ đúng tệp» và «không tự vẽ». «floor» dịch là «mức tối thiểu», nhưng judge không có định nghĩa «floor» trong các file được giao để đối chiếu thêm.
    - operational-feasibility: PASS — Cả 13 dòng đều có câu tiếng Việt nói đúng điều câu tiếng Anh cùng dòng nói, không thêm, bớt hay lấy ý dòng khác. Viết hoa đúng: câu đứng riêng viết hoa chữ đầu, còn «dòng», «ghim», «cỡ», «chưa ghi cỡ nào», «nét», «không đọc được tệp» viết thường. Không có «sàn», dấu chấm than, emoji hay dấu thanh kiểu cũ. Danh sách `avoid` nằm trong `ontology/labels.yaml`, không có trong input, nên chỉ đối chiếu được các chữ bị tránh mà `design/language.md` nêu.
    - spec-alignment: PASS — Trong 13 dòng, câu tiếng Việt nói cùng điều với câu tiếng Anh của cùng dòng. Chỉ có vài chữ đệm tự nhiên («tự», «đúng», «chưa») mà không đổi ý, và không có ý nào lấy từ dòng khác. Viết hoa đúng: câu đứng riêng viết hoa chữ đầu, còn mảnh ghép «dòng», «ghim», «cỡ», «nét» và hai cụm «chưa ghi cỡ nào», «không đọc được tệp» viết thường. Theo mục 2, 3, 5 của language.md, bảng không có chữ «sàn» (chữ «floor» được dịch thành «mức tối thiểu»), không có chữ bị tránh, dấu chấm than, emoji hay dấu thanh kiểu cũ.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-upgrade-design-assembly-0-76-0-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-27T02:34:09Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-upgrade-design-assembly-0-76-0-SUITE-DATABASE_URL_make_e2e-r1
  exit_code: 2
  verified_at: 2026-11-27T02:34:09Z
  note: Lệnh đỏ và không gắn eval nào. 1304 bài qua, 1 bài đỏ, 1163 bài bỏ qua. Bài đỏ là `tests/e2e/screens/open-cell-truncate.spec.ts:79`, chiều 1440, «E13 · the open cell is cut inside its cell › inventory: a unit code in a narrowed column fits its cell and is cut». Nó hết 30 giây khi chờ `thead th[data-col-id=""]`. Lệnh chạy với `DATABASE_URL` để trống.

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều chưa có kết quả trên baseline nên không có eval nào được xếp vào nhóm không phân biệt. Xem mục «Baseline khong do» bên dưới.

Baseline khong do

- make check: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- node _acceptance/upgrade-design-assembly-0-76-0/rang/gate-lines.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-76-0/rang/gate-lines.mjs co o cay dang kiem nhung chua co o merge-base 8694a455cc9a247c1b4af92343cba0e2dc3c4582 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs --only gate-lines: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 8694a455cc9a247c1b4af92343cba0e2dc3c4582 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-76-0/rang/tool-tree.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-76-0/rang/tool-tree.mjs co o cay dang kiem nhung chua co o merge-base 8694a455cc9a247c1b4af92343cba0e2dc3c4582 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs --only tool-tree: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 8694a455cc9a247c1b4af92343cba0e2dc3c4582 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-76-0/rang/decision-states.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-76-0/rang/decision-states.mjs co o cay dang kiem nhung chua co o merge-base 8694a455cc9a247c1b4af92343cba0e2dc3c4582 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs --only decision-states: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 8694a455cc9a247c1b4af92343cba0e2dc3c4582 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-76-0/rang/audit.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-76-0/rang/audit.mjs co o cay dang kiem nhung chua co o merge-base 8694a455cc9a247c1b4af92343cba0e2dc3c4582 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs --only audit: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 8694a455cc9a247c1b4af92343cba0e2dc3c4582 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-76-0/rang/words.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-76-0/rang/words.mjs co o cay dang kiem nhung chua co o merge-base 8694a455cc9a247c1b4af92343cba0e2dc3c4582 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs --only words: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 8694a455cc9a247c1b4af92343cba0e2dc3c4582 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-76-0/rang/book.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-76-0/rang/book.mjs co o cay dang kiem nhung chua co o merge-base 8694a455cc9a247c1b4af92343cba0e2dc3c4582 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs --only book: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 8694a455cc9a247c1b4af92343cba0e2dc3c4582 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-76-0/rang/change-list.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-76-0/rang/change-list.mjs co o cay dang kiem nhung chua co o merge-base 8694a455cc9a247c1b4af92343cba0e2dc3c4582 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs --only change-list: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-76-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 8694a455cc9a247c1b4af92343cba0e2dc3c4582 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval nhiều lần chạy đều đồng đều (không eval nào có runs lớn hơn 1).

## Iterations

Round 1: lệnh suite `DATABASE_URL= make e2e` đỏ ở bài `open-cell-truncate.spec.ts:79` (chiều 1440), không gắn eval nào; 15 eval máy đều xanh, E16 do hội đồng đề xuất PASS. Trả về cho khâu cài đặt.
