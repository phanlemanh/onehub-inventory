---
schema_version: 2
feature_slug: bo-o-tim-cua-vung
verdict: REJECT
failed_evals: ["E2","E8","E20"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b6bd97c76c1f6efa293510033518aab8ffe89d0a
human_signoff:
---

# Evidence Report: bo-o-tim-cua-vung

Round 1. Nội dung thay toàn bộ round cũ; lịch sử round nằm ở mục Iterations.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-1 | script | FAIL |
| E3 | AC-1 | ui-check | PASS |
| E4 | AC-2 | script | PASS |
| E5 | AC-2 | test | PASS |
| E6 | AC-3 | test | PASS |
| E7 | AC-4 | test | PASS |
| E8 | AC-5 | script | FAIL |
| E9 | AC-6 | test | PASS |
| E10 | AC-6 | script | PASS |
| E11 | AC-7 | test | PASS |
| E12 | AC-7 | judgment | PASS (đề xuất của panel, chờ người chốt) |
| E13 | AC-8 | script | PASS |
| E14 | AC-9 | script | PASS |
| E15 | AC-9 | judgment | PASS (đề xuất của panel, chờ người chốt) |
| E16 | AC-10 | test | PASS |
| E17 | AC-7 | script | PASS |
| E18 | AC-9 | script | PASS |
| E19 | AC-11 | test | PASS |
| E20 | AC-12 | script | FAIL |

Lệnh fail không gắn riêng một eval: `make e2e` (gắn chung E2, E8, E20, kết thúc bằng mã lỗi của make). Năm bài đỏ trong lần chạy này, 1058 bài xanh, 597 bài bỏ qua:

- [360] tests/e2e/screens/open-cell-truncate.spec.ts:73 (E13 · inventory: a unit code in a narrowed column fits its cell and is cut)
- [1024] tests/e2e/frame.spec.ts:373 (no serious accessibility violations on every frame screen)
- [1440] tests/e2e/loi-vao-ho-so.spec.ts:336 (E5 · the top-bar ⌘K box)
- [1440] tests/e2e/screens/inventory-width.spec.ts:43 (at 1440 all eight columns fit, no sideways scroll)
- [1440] tests/e2e/screens/open-cell-truncate.spec.ts:73 (cùng bài như ở khổ 360)

Máy không tách được bài đỏ nào thuộc eval nào trong ba eval E2, E8, E20; cả ba bị tính đỏ vì lệnh chung đỏ.

## Evidence

- eval: E1
  run_id: minted-bo-o-tim-cua-vung-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T01:34:10Z
  output: |
    make test: toàn bộ xanh.

- eval: E2
  run_id: minted-bo-o-tim-cua-vung-E2-r1
  exit_code: 2
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-14T01:34:10Z
  output: |
    make e2e: 5 bài đỏ (xem danh sách ở trên), 1058 xanh, 597 bỏ qua.
    inventory-width.spec.ts:47 expect(() => check(m)).not.toThrow() ném lỗi ở khổ 1440.

- eval: E3
  run_id: minted-bo-o-tim-cua-vung-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.ui_check
  verified_at: 2026-11-14T01:34:10Z
  screenshot: evidence/E3-inventory-1440-sang.png
  observed: |
    I opened all 10 frames.
    - inventory-1440-sang and inventory-1440-toi: title "Bảng hàng". Toolbar shows "60 dòng", "Nhóm theo Toà", "Cột", "Toàn màn hình", with no search box. A filter row sits under the headers (Chứa..., Chọn, Tỷ <=5, <=5, 2-5, Ngày >14). Footer says "60 dòng". Dark mode renders properly.
    - inventory-360-sang and inventory-360-toi: toolbar shows "60 dòng", "Nhóm theo Toà", "Cột", with no "Toàn màn hình" (hidden below 768px by design). The filter row under the headers (Chứa...) scrolls sideways with the table. No search box. Dark mode is fine.
    - sent-1440-sang and sent-1440-toi: title "Đã gửi". Toolbar shows "14 dòng", "Cột", "Toàn màn hình", with no search box and no "Nhóm theo Toà" (not expected on this page). Filter row sits under the headers (Chứa..., <=5, 2-5, Ngày >14).
    - sent-360-sang and sent-360-toi: toolbar shows "14 dòng" and "Cột". Filter row (Chứa..., <=5, 2-...) is under the headers. No search box.
    - inventory-khong-khop-1440-sang: the Căn filter holds the typed text, the toolbar reads "0 / 60 dòng", and the empty state shows "Không có dòng nào khớp", the line "Chữ bạn gõ ở ô lọc đầu cột không có trong dòng nào của vùng này." and a "Xoá lọc" button.
    - inventory-khong-khop-360-toi: same empty state in dark at 360, with "0 / 60 dòng" and "Xoá lọc".
    All frames match Expected, taking the 768px rule for "Toàn màn hình" into account.
  network_observed: clean

- eval: E4
  run_id: minted-bo-o-tim-cua-vung-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-14T01:34:10Z
  output: |
    npx vitest run tools/e2e_templates: xanh.

- eval: E5
  run_id: minted-bo-o-tim-cua-vung-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T01:34:10Z
  output: |
    make test: toàn bộ xanh.

- eval: E6
  run_id: minted-bo-o-tim-cua-vung-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T01:34:10Z
  output: |
    make test: toàn bộ xanh.

- eval: E7
  run_id: minted-bo-o-tim-cua-vung-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T01:34:10Z
  output: |
    make test: toàn bộ xanh.

- eval: E8
  run_id: minted-bo-o-tim-cua-vung-E8-r1
  exit_code: 2
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-14T01:34:10Z
  output: |
    make e2e: 5 bài đỏ (xem danh sách ở trên), 1058 xanh, 597 bỏ qua.

- eval: E9
  run_id: minted-bo-o-tim-cua-vung-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T01:34:10Z
  output: |
    make test: toàn bộ xanh.

- eval: E10
  run_id: minted-bo-o-tim-cua-vung-E10-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.goc_nhin_e2e
  verified_at: 2026-11-14T01:34:10Z
  output: |
    11 passed (1.5m) trên Postgres dãy K.

- eval: E11
  run_id: minted-bo-o-tim-cua-vung-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T01:34:10Z
  output: |
    make test: toàn bộ xanh.

- eval: E13
  run_id: minted-bo-o-tim-cua-vung-E13-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-14T01:34:10Z
  output: |
    npx vitest run tools/e2e_templates: xanh.

- eval: E14
  run_id: minted-bo-o-tim-cua-vung-E14-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-14T01:34:10Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E16
  run_id: minted-bo-o-tim-cua-vung-E16-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T01:34:10Z
  output: |
    npx vitest run tools/proof_gate: xanh.

- eval: E17
  run_id: minted-bo-o-tim-cua-vung-E17-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T01:34:10Z
  output: |
    10 tệp giao diện ngoài bản đồ

- eval: E18
  run_id: minted-bo-o-tim-cua-vung-E18-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.doi_bai_kiem
  verified_at: 2026-11-14T01:34:10Z
  output: |
    ca phá "trỏ tới ca không có": đỏ — doi-bai-kiem: ca khong co: ca-khong-co-zzz

- eval: E19
  run_id: minted-bo-o-tim-cua-vung-E19-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T01:34:10Z
  output: |
    make test: toàn bộ xanh.

- eval: E20
  run_id: minted-bo-o-tim-cua-vung-E20-r1
  exit_code: 2
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-14T01:34:10Z
  output: |
    make e2e: 5 bài đỏ (xem danh sách ở trên), gồm open-cell-truncate.spec.ts:73 ở khổ 360 và 1440.

### Judgment

- eval: E12
  judged_by: judge-panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  rationale: Đề xuất của panel. Hai lens xác nhận cả sáu điểm khớp (states.md, luoi.md, SavedView.yaml, wiki/log.md, CHANGELOG.md, behaviors.md). Một lens chưa chắc ở điểm (2) vì luoi.md dòng 46 và 59 còn chữ «tìm».
  votes:
    - domain-correctness: PASS — Cả sáu điểm đều khớp. states.md dòng 9 gọi trạng thái là «Không có dòng nào khớp», bắt buộc «Xoá lọc», và dòng 21 nói vùng không có chỗ gõ tìm riêng. luoi.md dòng 26-27 nói lọc bằng ô dưới tiêu đề cột, tìm ở ô ⌘K của thanh trên App Shell. SavedView.yaml chỉ nói góc nhìn không giữ chữ tìm. wiki/log.md dòng 16 và CHANGELOG.md dòng 9 đều ghi chủ kho chốt 2026-11-13 và migration 011 bỏ chữ tìm khỏi góc nhìn cũ. behaviors.md không có chữ «tìm», «search» hay «⌘»; chỉ có dòng lọc từng cột, không nói ô tìm.
    - operational-feasibility: UNCERTAIN — Các điểm (1), (3), (4), (5), (6) đạt. Điểm (2) chưa rõ: luoi.md dòng 26-28 nói đúng, nhưng dòng 46 «Thanh công cụ, lọc, tìm, sắp xếp» (mặt so của vùng) và dòng 59 «xem, lọc, tìm và sửa từng ô» vẫn có thể bị đọc là vùng có chỗ tìm.
    - spec-alignment: PASS — (1) states.md dòng 9 gọi trạng thái là «Không có dòng nào khớp» và bắt buộc lối thoát «Xoá lọc»; (2) luoi.md dòng 26-27 nói lọc bằng ô dưới tiêu đề cột, tìm ở ô ⌘K của thanh trên App Shell, và vùng không có chỗ gõ tìm riêng; (4) wiki/log.md dòng 16 ghi góc nhìn thôi giữ chữ tìm theo chủ kho chốt 2026-11-13 và migration 011 đã bỏ chữ tìm khỏi góc nhìn cũ; (5) CHANGELOG.md dòng 9 ghi tương tự. (3) SavedView.yaml chỉ nói góc nhìn không giữ chữ tìm, và (6) behaviors.md không có chữ «tìm» hay ⌘K nào.
  required_evidence:
    - Sửa design/patterns/luoi.md dòng 46 (mặt «Thanh công cụ, lọc, tìm, sắp xếp») để không còn gợi ý thanh công cụ của vùng có tìm, ví dụ «Thanh công cụ, lọc đầu cột, sắp xếp»; hoặc thêm chú giải ngay tại đó rằng «tìm» là ô ⌘K của App Shell.
    - Hoặc chủ kho xác nhận bằng văn bản (tin trong sổ đợt hoặc _acceptance/bo-o-tim-cua-vung/contract.md) rằng «tìm» ở luoi.md dòng 46 và 59 chỉ chỉ ô ⌘K của App Shell.
  human_override:  # chi nguoi ghi

- eval: E15
  judged_by: judge-panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  rationale: Đề xuất của panel, cả ba lens cùng PASS. Các hàng trỏ tới bốn tệp được đối chiếu đều khớp ca thật; các hàng trỏ sang tệp ngoài danh sách panel không đối chiếu được.
  votes:
    - domain-correctness: PASS — Các hàng trỏ tới grid.test.tsx, grid-sheet.test.tsx, grid-saved-view.test.tsx và recipes.ts đều khớp ca thật. Ví dụ: gõ vào ô lọc Mã và Toà nhà, kiểm 7 trạng thái không có ô tìm kèm ca phá, giữ nguyên phần tử và focus của ô lọc Căn, và «sameView blind to filter text». Không hàng nào ghi xoá hay bỏ qua mà thiếu khẳng định thay, và không hàng nào yếu hơn bản cũ. Ma trận «chỉ tìm» còn 5 cách, nhưng bảng đã ghi rõ và ca đó được thay bằng khẳng định không có ô tìm ở mọi cách mở. Các hàng trỏ sang tệp ngoài danh sách (behavior, e2e, e2e-db, ho-so-can, second-column-views, e2e-templates.test) tôi không đối chiếu được; câu hỏi cũng chỉ đòi đối chiếu bốn tệp.
    - operational-feasibility: PASS — Không dòng nào ghi xoá hay bỏ qua mà thiếu khẳng định thay. Các khẳng định mới nhìn trên bảng đều đo cùng điều trên ô lọc đầu cột (cùng tập dòng, cùng số, cùng thông điệp lỗi) hoặc thành khẳng định không có ô tìm, và vẫn giữ ca phá. Các dòng trỏ tới bốn tệp (recipes.ts, grid.test.tsx, grid-sheet.test.tsx, grid-saved-view.test.tsx) đều khớp ca thật: tên ca, dòng mã, số «1 / 2 dòng» và «30 / 60 dòng», thông điệp «filter box remounted on no match», «sameView blind to filter text», «view carries search text», «khong-khop: …». Các dòng trỏ tới tệp ngoài bốn tệp này không nằm trong đầu vào nên tôi chỉ xét chữ trên bảng, không đối chiếu được ca thật.
    - spec-alignment: PASS — Các dòng bảng trỏ tới grid.test.tsx, grid-sheet.test.tsx, grid-saved-view.test.tsx và recipes.ts đều có ca mới thật, khớp câu khẳng định mới. Ca phá giữ nguyên (widths, codeBox "filter box remounted on no match", sameView mù chữ lọc, "khong-khop: thieu loi thoat Xoa loc"). Ca «chỉ tìm» bỏ đi được thay bằng khẳng định không có ô tìm ở cả 5 cách mở cùng chữ ô lọc Căn, nên không dòng nào yếu hơn hay bị xoá không thay. Hai dòng trỏ tới tệp ngoài danh sách (e2e-templates.test.ts, suite.ts) không nằm trong phạm vi chấm này.
  required_evidence:
    - (judge không nêu bằng-chứng-thiếu)
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-bo-o-tim-cua-vung-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-14T01:34:10Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên cả bản đang kiểm lẫn bản cũ, chứng minh harness chứ không chứng minh feature; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- `make test`: E1, E5, E6, E7, E9, E11, E19
- `npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose`: E4, E13
- `make check`: E14
- `npx vitest run tools/proof_gate --coverage.enabled=false --reporter=verbose`: E16
- `R="${CLAUDE_PLUGIN_ROOT:-$(node tools/kit-root.mjs)}" && node "$R/scripts/design-floor-khuon.mjs" --kiem --root .`: E17

Baseline không đo:

- node _acceptance/bo-o-tim-cua-vung/rang/doi-bai-kiem.mjs --root . --self-test: bo qua baseline: tep _acceptance/bo-o-tim-cua-vung/rang/doi-bai-kiem.mjs co o cay dang kiem nhung chua co o merge-base d7c8f5d391a95fe1f7721bc38bb4145024667b37 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (không eval nào có runs lớn hơn 1).

## Iterations

Round 1: E2, E8, E20 failed — `make e2e` đỏ năm bài (inventory-width ở 1440, open-cell-truncate ở 360 và 1440, ⌘K ở 1440, trợ năng ở 1024); các eval còn lại xanh. Returned to implementation.
