---
schema_version: 2
feature_slug: ho-so-can
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8856d62b5b927f116ee0a15c3c6c4fc23d7f202d
human_signoff:
---

# Evidence Report: ho-so-can

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | ui-check | PASS |
| E11 | AC-10 | judgment | PASS |
| E12 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-ho-so-can-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T10:20:40Z
  output: |
    make test: all unit tests passed (tests/ho-so-can.test.tsx included).

- eval: E5
  run_id: minted-ho-so-can-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T10:20:40Z
  output: |
    make test: all unit tests passed (tests/ho-so-can.test.tsx included).

- eval: E6
  run_id: minted-ho-so-can-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T10:20:40Z
  output: |
    make test: all unit tests passed (tests/ho-so-can.test.tsx included).

- eval: E8
  run_id: minted-ho-so-can-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T10:20:40Z
  output: |
    make test: all unit tests passed (behavior, behavior-guard and grid suites included).

- eval: E2
  run_id: minted-ho-so-can-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T10:20:40Z
  output: |
    make e2e: 679 passed (5.7m)

- eval: E3
  run_id: minted-ho-so-can-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T10:20:40Z
  output: |
    make e2e: 679 passed (5.7m)

- eval: E4
  run_id: minted-ho-so-can-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T10:20:40Z
  output: |
    make e2e: 679 passed (5.7m)

- eval: E7
  run_id: minted-ho-so-can-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T10:20:40Z
  output: |
    make e2e: 679 passed (5.7m)

- eval: E9
  run_id: minted-ho-so-can-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T10:20:40Z
  output: |
    make e2e: 679 passed (5.7m)

- eval: E12
  run_id: minted-ho-so-can-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-12T10:20:40Z
  output: |
    design-floor-s4 finished clean: no raw colour codes in the interface files touched this round.

- eval: E10
  run_id: minted-ho-so-can-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-12T10:20:40Z
  screenshot: evidence/ho-so-1440-sang.png
  observed: |
    1440 light: the panel floats on the right, from just under the top bar to about 8 px above the bottom edge. The App Shell top bar (sun icon, Đăng nhập) and the search box with "60 dòng" are not covered. The header reads "1603 · S1.01" with Trước, Sau and Đóng. The unit card shows "1603" and "4,28 tỷ" on one line, then "S1.01 · Vinhomes Ocean Park 1" with the green badge Đang bán, then three stats (Diện tích 75 m², Phòng ngủ 2, Xác nhận lúc 09:00 05/11/2026). Eight fields follow. No text overlaps.
    1440 dark: same layout. Dark background, white text, green and amber badges readable, links readable.
    1024 light: the panel is narrower (x 615 to 1008, from y 64). The search box is visible, but the "60 dòng" counter and the right-hand columns are hidden behind the panel; the 2 columns to its left are still in view. The top bar is clear. Header, unit card with price on the same line as the code, badge, 3 stats and 8 fields are all present. No overlap.
    1024 dark: same, readable.
    414 light: the record fills the whole screen with no grid behind it. The header is "1603 · S1.01", Trước, Sau, Đóng. The unit card comes first (1603 and 4,28 tỷ, place and badge, 3 stats), then 8 fields. No overlap.
    414 dark: same on a dark background, readable.
    360 light: the record fills the screen. The title wraps to "1603 ·" over "S1.01", and Trước, Sau, Đóng fit beside it. The card, stats and 8 fields are intact and nothing overlaps.
    360 dark: same, readable.
    All 8 frames match Expected.
  network_observed: clean

- eval: E11
  judged_by: judge panel (3 lenses, fresh context)
  verdict: PASS
  rationale: Panel proposes PASS. domain-correctness, operational-feasibility and spec-alignment all vote PASS (see votes below). The panel is a proposal; the human decides.
  votes:
    - domain-correctness: PASS — Ở 1440 và 1024, hồ sơ nổi bên phải từ ngay dưới thanh trên tới đáy màn hình. Thanh trên và ô tìm không bị che, cột #, Căn, Toà còn thấy (1440 còn 5 cột, 1024 còn 3 cột, đúng bảng đo trong design.md). Ở 360, hồ sơ toàn màn, đầu là thẻ căn có mã 1603, giá 4,28 tỷ, nơi S1.01 · Vinhomes Ocean Park 1, huy hiệu Đang bán và ba thông số (diện tích, phòng ngủ, xác nhận lúc). Chữ không chồng chữ, tên hồ sơ dài xuống dòng mà ba nút vẫn ở góc trên phải, và hai ảnh tối đều đọc rõ.
    - operational-feasibility: PASS — Ở 1440 và 1024, hồ sơ nổi bên phải từ ngay dưới thanh trên tới đáy màn hình. Thanh trên, nút Đăng nhập và ô tìm đều thấy, cột #, Căn, Toà vẫn còn, khớp bảng đo trong design.md (5 cột ở 1440, 3 cột ở 1024). Ở 360 hồ sơ chiếm toàn màn, đầu là thẻ căn có mã 1603, giá 4,28 tỷ, nơi, trạng thái «Đang bán» và ba thông số. Không thấy chữ chồng chữ, tên hồ sơ xuống dòng mà ba nút vẫn ở góc trên phải, và các ảnh tối đọc rõ.
    - spec-alignment: PASS — Ở 1440 và 1024 (sáng, và tối ở 1440) hồ sơ nổi bên phải từ ngay dưới thanh trên tới đáy màn hình. Thanh trên và ô tìm còn thấy, cột #, Căn, Toà còn thấy (5 cột ở 1440, 3 cột ở 1024, khớp bảng đo; ở 1024 ngăn che chữ «60 dòng» cạnh ô tìm, design.md ghi điều này là chấp nhận được). Ở 360 hồ sơ toàn màn, đầu là thẻ căn có mã 1603, giá 4,28 tỷ, nơi S1.01 · Vinhomes Ocean Park 1, huy hiệu Đang bán và ba thông số (Diện tích, Phòng ngủ, Xác nhận lúc); ba nút ở góc trên phải, chữ không chồng nhau, ảnh tối đọc rõ.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-ho-so-can-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-12T10:20:40Z

- cmd: npm run build
  run_id: minted-ho-so-can-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-12T10:20:40Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/goofy-chebyshev-a2f603, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»

Baseline khong do:
- make test: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/goofy-chebyshev-a2f603, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- make e2e: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/goofy-chebyshev-a2f603, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- R="${CLAUDE_PLUGIN_ROOT:-$(node tools/kit-root.mjs)}" && node "$R/scripts/design-floor-s4.mjs" --root .: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/goofy-chebyshev-a2f603, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»

Eval khong-phan-biet: none — khong co eval nao duoc liet ke; luu y baseline khong do duoc o round nay nen tinh phan biet cua cac eval feature chua duoc xac nhan.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: REJECT — bo kiem hanh vi (behavior suite) do tu khi ngan ho so chuyen sang noi; da sua o cac commit sau.
Round 2: PASS — moi eval xanh tai commit 8856d62.
