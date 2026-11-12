---
schema_version: 2
feature_slug: ho-so-can
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 93811d83daa960c887ebd4e0946880039b525892
human_signoff: Manh Phan 2026-11-12
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
  run_id: minted-ho-so-can-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T14:19:08Z
  output: |
    make test chạy xanh (gồm tests/ho-so-can.test.tsx); lệnh kết thúc sạch.

- eval: E5
  run_id: minted-ho-so-can-E5-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T14:19:08Z
  output: |
    make test chạy xanh (gồm tests/ho-so-can.test.tsx); lệnh kết thúc sạch.

- eval: E6
  run_id: minted-ho-so-can-E6-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T14:19:08Z
  output: |
    make test chạy xanh (gồm tests/ho-so-can.test.tsx); lệnh kết thúc sạch.

- eval: E8
  run_id: minted-ho-so-can-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T14:19:08Z
  output: |
    make test chạy xanh (gồm behavior, behavior-guard, grid); lệnh kết thúc sạch.

- eval: E2
  run_id: minted-ho-so-can-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T14:19:08Z
  output: |
    779 passed (6.4m)

- eval: E3
  run_id: minted-ho-so-can-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T14:19:08Z
  output: |
    779 passed (6.4m)

- eval: E4
  run_id: minted-ho-so-can-E4-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T14:19:08Z
  output: |
    779 passed (6.4m)

- eval: E7
  run_id: minted-ho-so-can-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T14:19:08Z
  output: |
    779 passed (6.4m)

- eval: E9
  run_id: minted-ho-so-can-E9-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T14:19:08Z
  output: |
    779 passed (6.4m)

- eval: E12
  run_id: minted-ho-so-can-E12-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-12T14:19:08Z
  output: |
    design-floor-s4 chạy sạch, không mã màu thô trên các tệp giao diện vòng này chạm.

- eval: E10
  run_id: minted-ho-so-can-E10-r4
  exit_code: 0
  baseline: n-a
  verifier: config:capture.ui
  verified_at: 2026-11-12T14:19:08Z
  screenshot: evidence/ho-so-1440-sang.png
  observed: |
    1440 sáng/tối: hồ sơ nổi bên phải, bắt đầu ngay dưới thanh trên (thanh trên với nút giao diện và Đăng nhập, ô «Gõ để tìm» vẫn thấy rõ, không bị che), cao tới gần đáy màn hình (chừa khoảng nhỏ). Tên «1603 · S1.01», nút Trước, Sau, Đóng; thẻ căn: 1603 và 4,28 tỷ cùng một dòng, «S1.01 · Vinhomes Ocean Park 1» cùng huy hiệu Đang bán, ba thông số (75 m², 2, 09:00 05/11/2026); rồi tám trường. Dòng 1603 được chọn trong bảng. Không chữ chồng chữ. Ảnh tối đọc rõ, huy hiệu và chữ tương phản tốt. 1024 sáng/tối: cùng bố cục, hồ sơ hẹp hơn (393px), thanh trên và ô tìm không bị che, đủ thẻ căn và tám trường. 414 sáng/tối: hồ sơ phủ toàn màn, đầu là tên + Trước/Sau/Đóng, rồi thẻ căn, rồi tám trường, không chồng chữ. 360 sáng/tối: phủ toàn màn, tên «1603 · S1.01» xuống hai dòng ('1603 ·' / 'S1.01') nhưng không chồng lên nút; thẻ căn và tám trường đầy đủ, đọc được; ảnh tối đọc được. Khớp Expected.
  network_observed: no-app-traffic

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-ho-so-can-SUITE-make_check-r4
  exit_code: 0
  verified_at: 2026-11-12T14:19:08Z

- cmd: npm run build
  run_id: minted-ho-so-can-SUITE-build-r4
  exit_code: 0
  verified_at: 2026-11-12T14:19:08Z

### Judgment

Đề xuất panel cho E11 (ba lens, đều PASS); human_override để trống cho người quyết ở Cổng 2.

- domain-correctness: PASS — Ở 1440 và 1024, hồ sơ nổi bên phải từ ngay dưới thanh trên tới đáy màn hình; thanh trên và ô tìm không bị che, các cột #, Căn, Toà còn thấy, số cột khớp bảng đo (1440 thấy 5, 1024 thấy 3). Ở 360 hồ sơ toàn màn, đầu là thẻ căn 1603, giá 4,28 tỷ, nơi, huy hiệu Đang bán, ba thông số, dưới là tám trường; ba nút ở góc trên phải; tên xuống dòng không chồng chữ; ảnh tối đọc được.
- operational-feasibility: PASS — Ngăn nổi bắt đầu ngay dưới thanh trên và chạy tới đáy; ô tìm vẫn thấy; cột #, Căn, Toà vẫn thấy (1440 còn 5 cột, 1024 còn 3 cột, đúng bảng đo của design.md). Ở 1024 ngăn che chữ «60 dòng» cạnh ô tìm, đúng như design.md ghi. Ở 360 hồ sơ toàn màn, tên xuống dòng, ba nút vẫn ở góc trên phải, không chữ chồng chữ, ảnh tối đọc rõ.
- spec-alignment: PASS — Ngăn nổi từ ngay dưới thanh trên tới đáy, thanh trên và ô tìm vẫn thấy, cột #, Căn, Toà còn trọn. Ở 360 hồ sơ toàn màn, đầu là thẻ căn có mã 1603, giá 4,28 tỷ, nơi, huy hiệu «Đang bán» và ba thông số; tên xuống dòng và ba nút vẫn ở góc trên phải, đúng như design.md cho phép; hai ảnh tối đọc rõ.

- eval: E11
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: Cả ba lens (domain-correctness, operational-feasibility, spec-alignment) đều chấm PASS trên tám ảnh E10.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/goofy-chebyshev-a2f603, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»

Eval không-phân-biệt: không đo được ở round này (baseline BLOCKED hạ tầng), nên không có căn cứ liệt kê eval nào.

Baseline khong do:
- make test: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/goofy-chebyshev-a2f603, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- make e2e: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/goofy-chebyshev-a2f603, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- R="${CLAUDE_PLUGIN_ROOT:-$(node tools/kit-root.mjs)}" && node "$R/scripts/design-floor-s4.mjs" --root .: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/goofy-chebyshev-a2f603, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»

## Variance

none — mọi eval chạy một lần, xác định; không có eval nhiều lượt.

## Iterations

Round 4: mọi eval máy xanh, E10 có tám ảnh đã đối chiếu, E11 ba lens đề xuất PASS chờ người ở Cổng 2; lịch sử các round trước xem run-log.jsonl.
