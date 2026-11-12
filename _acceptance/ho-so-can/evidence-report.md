---
schema_version: 2
feature_slug: ho-so-can
verdict: REJECT
failed_evals: ["E2","E3","E4","E7","E9"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 7a7c3f05cf63aa48c668bfd6ee96dcfcca0827af
human_signoff:
---

# Evidence Report: ho-so-can

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | script | FAIL |
| E3 | AC-3 | script | FAIL |
| E4 | AC-4 | script | FAIL |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | script | FAIL |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | script | FAIL |
| E10 | AC-10 | ui-check | PASS |
| E11 | AC-10 | judgment | UNCERTAIN |
| E12 | AC-8 | script | PASS |

Ghi chú về các eval đỏ: E2, E3, E4, E7, E9 cùng chạy bằng một lệnh `make e2e`, và lệnh này kết thúc lỗi (675 bài qua, 4 bài rơi, 441 bài bỏ qua trong 5,7 phút). Bốn bài rơi đều nằm trong tests/e2e/behavior.spec.ts, ở hai khổ 1024 và 1440: "record panel opens beside the grid and closes with Escape" (mép phải ngăn bằng 1424, kỳ vọng 1440) và "accessibility check fails on unreadable text in the record panel" (kỳ vọng axe báo color-contrast nhưng mảng trả về rỗng). Đuôi kết quả máy không tách riêng từng eval theo tên bài, nên cả năm eval dùng chung lệnh này đều bị ghi đỏ; người đọc cần mở tests/e2e/ho-so-can.spec.ts và behavior.spec.ts để biết bài nào của eval nào rơi.

## Evidence

- eval: E1
  run_id: minted-ho-so-can-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T08:54:56Z
  output: |
    make test (chung cho E1, E5, E6, E8): hoàn tất, thoát sạch.

- eval: E2
  run_id: minted-ho-so-can-E2-r1
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T08:54:56Z
  output: |
    make e2e (chung cho E2, E3, E4, E7, E9): 4 failed, 441 skipped, 675 passed (5.7m)
    [1024] và [1440] behavior.spec.ts:89 record panel opens beside the grid and closes with Escape
      Expected: 1440
      Received: 1424
      > 100 | expect(Math.round(box!.x + box!.width)).toBe(width);
    [1024] và [1440] behavior.spec.ts:256 accessibility check fails on unreadable text in the record panel
      Expected value: "color-contrast"
      Received array: []
      > 268 | expect(await seriousViolations(page)).toContain("color-contrast");

- eval: E3
  run_id: minted-ho-so-can-E3-r1
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T08:54:56Z
  output: |
    Cùng lệnh make e2e như E2: 4 failed, 441 skipped, 675 passed (5.7m).
    Bốn bài rơi ghi ở khối E2.

- eval: E4
  run_id: minted-ho-so-can-E4-r1
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T08:54:56Z
  output: |
    Cùng lệnh make e2e như E2: 4 failed, 441 skipped, 675 passed (5.7m).
    Bốn bài rơi ghi ở khối E2.

- eval: E5
  run_id: minted-ho-so-can-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T08:54:56Z
  output: |
    make test (chung với E1, E6, E8): hoàn tất, thoát sạch.

- eval: E6
  run_id: minted-ho-so-can-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T08:54:56Z
  output: |
    make test (chung với E1, E5, E8): hoàn tất, thoát sạch.

- eval: E7
  run_id: minted-ho-so-can-E7-r1
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T08:54:56Z
  output: |
    Cùng lệnh make e2e như E2: 4 failed, 441 skipped, 675 passed (5.7m).
    Bốn bài rơi ghi ở khối E2.

- eval: E8
  run_id: minted-ho-so-can-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T08:54:56Z
  output: |
    make test (chung với E1, E5, E6): hoàn tất, thoát sạch.
    Lệnh python3 tools/proof_gate/check.py không nằm trong lệnh đã chạy ở vòng này; make test là bằng chứng máy duy nhất cho eval này.

- eval: E9
  run_id: minted-ho-so-can-E9-r1
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T08:54:56Z
  output: |
    Cùng lệnh make e2e như E2: 4 failed, 441 skipped, 675 passed (5.7m).
    Bốn bài rơi ghi ở khối E2; bài axe color-contrast ở behavior.spec.ts:256 là một trong số đó.

- eval: E10
  run_id: minted-ho-so-can-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: ui-check
  verified_at: 2026-11-12T08:54:56Z
  screenshot: evidence/E10-step2.png
  observed: |
    I opened each of the 8 frames with Read.
    - 1440 light and dark: the record floats on the right, starting just under the App Shell top bar (about y=56) and reaching the bottom edge. The top bar (sidebar toggle, theme icon, Đăng nhập) and the search box ("Gõ để tìm", "60 dòng") are fully visible and not covered. Title "1603 · S1.01"; Trước, Sau and Đóng sit in one row at the top right. Below that is the listing card: "1603" and "4,28 tỷ" on one line, "S1.01 · Vinhomes Ocean Park 1" with the green Đang bán badge, then 3 facts (Diện tích 75 m², Phòng ngủ 2, Xác nhận lúc 09:00 05/11/2026), then 8 fields. The table row 5 (1603) is highlighted and the Căn, Toà, Dự án and Trạng thái columns are still visible beside the panel. No overlapping text. Dark mode is fully readable, with light text on a dark background and a legible green badge.
    - 1024 light and dark: same layout. The panel is about 40% wide, from under the top bar to the bottom. The top bar and search box are not covered. Header, card and 8 fields are all present with no overlap. The table behind keeps # and Căn and Toà visible. Dark is readable.
    - 414 light and dark: the record covers the whole screen. Header row "1603 · S1.01" with Trước, Sau and Đóng on one line. The listing card comes first (1603 and 4,28 tỷ on one line, place and badge, 3 facts), then the 8 fields. No overlap. Dark is readable.
    - 360 light and dark: full screen. The title wraps onto two lines ("1603 ·" / "S1.01"), but nothing overlaps; the buttons stay at the top right. The card and 8 fields are intact and the page does not scroll sideways. Dark is readable.
    Only extra element: the Next.js dev badge, a round "N" at the bottom left, which comes from the dev server. This matches Expected in all 8 frames.
  network_observed: clean

- eval: E11
  judged_by: judge-subagent (fresh context)
  verdict: UNCERTAIN
  rationale: Panel đề xuất UNCERTAIN, ba thấu kính (domain-correctness, operational-feasibility, spec-alignment) cùng báo không đọc được năm ảnh trong danh sách Input của eval (ho-so-1440-sang.png, ho-so-1440-toi.png, ho-so-1024-sang.png, ho-so-360-sang.png, ho-so-360-toi.png) vì đường dẫn báo không tồn tại, nên chỉ có design.md để đối chiếu. Ghi chú của người soạn: ở thời điểm soạn báo cáo, thư mục evidence/ đã có các ảnh cùng tên (ho-so-*.png) và tám khung E10, nên người quyết cần kiểm lại xem ảnh đã có mặt khi hội đồng chấm hay chưa.
  required_evidence:
    - domain-correctness: Năm ảnh đúng tên tại /Users/manhphan/dev/onehub-inventory/.claude/worktrees/goofy-chebyshev-a2f603/_acceptance/ho-so-can/evidence/ (ho-so-1440-sang.png, ho-so-1440-toi.png, ho-so-1024-sang.png, ho-so-360-sang.png, ho-so-360-toi.png), chụp khi hồ sơ một căn đang mở; có ảnh thì chấm được ngăn nổi từ dưới thanh trên tới đáy, ô tìm và thanh trên không bị che, cột Căn và Toà còn thấy, thẻ căn đầu hồ sơ ở 360, ảnh tối đọc được.
    - operational-feasibility: Cả năm ảnh trên phải nằm trong thư mục evidence/ của hồ sơ, vì là bằng chứng duy nhất cho câu hỏi này.
    - spec-alignment: ho-so-1440-sang.png, ho-so-1440-toi.png, ho-so-1024-sang.png, ho-so-360-sang.png và ho-so-360-toi.png cùng thư mục evidence/, để đối chiếu «Đặc tả UX» và «Sống chung với hàng 2a»; nếu ảnh thật nằm ở evidence/ban-bam/ với tên ho-so-mo-*.png thì sửa danh sách Input của E11 trỏ tới các tên đó.
  human_override:  # chi nguoi ghi

- eval: E12
  run_id: minted-ho-so-can-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-12T08:54:56Z
  output: |
    design-floor-s4: không mã màu thô trên các tệp giao diện vòng này chạm.

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-ho-so-can-SUITE-make_check-r1
  exit_code: 0
  verified_at: 2026-11-12T08:54:56Z

- cmd: npm run build
  run_id: minted-ho-so-can-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-12T08:54:56Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/goofy-chebyshev-a2f603, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»

Danh sách eval không-phân-biệt không đo được ở round này (mọi field baseline đều là n-a).

Baseline khong do:
- make test: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/goofy-chebyshev-a2f603, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- make e2e: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/goofy-chebyshev-a2f603, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- R="${CLAUDE_PLUGIN_ROOT:-$(node tools/kit-root.mjs)}" && node "$R/scripts/design-floor-s4.mjs" --root .: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/goofy-chebyshev-a2f603, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»

Lệnh fail không gắn eval: không có. Lệnh `make e2e` kết thúc lỗi nhưng đã gắn với E2, E3, E4, E7, E9.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E2, E3, E4, E7, E9 failed — make e2e rơi 4 bài ở tests/e2e/behavior.spec.ts (ngăn hồ sơ lệch mép phải 1424 so với 1440; bài axe color-contrast không bắt được lỗi) ở 1024 và 1440. Returned to implementation.
