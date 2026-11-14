---
schema_version: 2
feature_slug: bo-o-tim-cua-vung
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 403118b16b7d29ce8b212a5188f339185fbb4330
human_signoff:
---

# Evidence Report: bo-o-tim-cua-vung

Round 2. Mọi eval máy đều xanh; còn hai mục judgment (E12, E15) chờ người chốt ở Cổng 2 nên verdict là PENDING-JUDGMENT.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-1 | script | PASS |
| E3 | AC-1 | ui-check | PASS |
| E4 | AC-2 | script | PASS (carry-forward từ round 1) |
| E5 | AC-2 | test | PASS |
| E6 | AC-3 | test | PASS |
| E7 | AC-4 | test | PASS |
| E8 | AC-5 | script | PASS |
| E9 | AC-6 | test | PASS |
| E10 | AC-6 | script | PASS |
| E11 | AC-7 | test | PASS (carry-forward từ round 1) |
| E12 | AC-7 | judgment | PASS (đề xuất của hội đồng, chờ người chốt) |
| E13 | AC-8 | script | PASS (carry-forward từ round 1) |
| E14 | AC-9 | script | PASS |
| E15 | AC-9 | judgment | PASS (đề xuất của hội đồng, chờ người chốt) |
| E16 | AC-10 | test | PASS (carry-forward từ round 1) |
| E17 | AC-7 | script | PASS (carry-forward từ round 1) |
| E18 | AC-9 | script | PASS |
| E19 | AC-11 | test | PASS |
| E20 | AC-12 | script | PASS |

## Analyst

Eval không phân biệt (xanh trên CẢ code mới lẫn baseline — chứng minh harness, không chứng minh feature; hoặc là regression-guard có chủ ý):
- make test: E1, E5, E6, E7, E9, E19
- make check: E14

Baseline không đo:
- node _acceptance/bo-o-tim-cua-vung/rang/doi-bai-kiem.mjs --root . --self-test: bo qua baseline: tep _acceptance/bo-o-tim-cua-vung/rang/doi-bai-kiem.mjs co o cay dang kiem nhung chua co o merge-base d7c8f5d391a95fe1f7721bc38bb4145024667b37 — eval moi, chay tren code cu khong phan biet gi

Lệnh fail không gắn eval: không có.

## Evidence

- eval: E1
  run_id: minted-bo-o-tim-cua-vung-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T02:18:18Z
  output: |
    make test xanh toàn bộ.

- eval: E5
  run_id: minted-bo-o-tim-cua-vung-E5-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T02:18:18Z
  output: |
    make test xanh toàn bộ.

- eval: E6
  run_id: minted-bo-o-tim-cua-vung-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T02:18:18Z
  output: |
    make test xanh toàn bộ.

- eval: E7
  run_id: minted-bo-o-tim-cua-vung-E7-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T02:18:18Z
  output: |
    make test xanh toàn bộ.

- eval: E9
  run_id: minted-bo-o-tim-cua-vung-E9-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T02:18:18Z
  output: |
    make test xanh toàn bộ.

- eval: E19
  run_id: minted-bo-o-tim-cua-vung-E19-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T02:18:18Z
  output: |
    make test xanh toàn bộ.

- eval: E2
  run_id: minted-bo-o-tim-cua-vung-E2-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-14T02:18:18Z
  output: |
    1063 passed (9.2m)

- eval: E8
  run_id: minted-bo-o-tim-cua-vung-E8-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-14T02:18:18Z
  output: |
    1063 passed (9.2m)

- eval: E20
  run_id: minted-bo-o-tim-cua-vung-E20-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-14T02:18:18Z
  output: |
    1063 passed (9.2m)

- eval: E10
  run_id: minted-bo-o-tim-cua-vung-E10-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.goc_nhin_e2e
  verified_at: 2026-11-14T02:18:18Z
  output: |
    11 passed (1.4m)

- eval: E14
  run_id: minted-bo-o-tim-cua-vung-E14-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-14T02:18:18Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E18
  run_id: minted-bo-o-tim-cua-vung-E18-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.doi_bai_kiem
  verified_at: 2026-11-14T02:18:18Z
  output: |
    ca pha "tro toi dong khong phai ca": do — doi-bai-kiem: ca khong co: // @vitest-environment jsdom

- eval: E3
  run_id: minted-bo-o-tim-cua-vung-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.ui_check
  verified_at: 2026-11-14T02:18:18Z
  screenshot: evidence/E3-inventory-1440-sang.png
  observed: |
    I opened all 10 frames with Read.
    - inventory-1440-sang: the page title is "Bảng hàng". The toolbar reads "60 dòng", "Nhóm theo Toà", "Cột", "Toàn màn hình", with no search box in the toolbar. The only search is the global "Gõ mã căn... ⌘K" in the app header. Under the headers there is a filter row (Chứa..., Chọn, Tỷ <=5, <=5, 2-5, Ngày >14) and the grid shows 60 rows. The footer reads "60 dòng".
    - inventory-1440-toi: the same layout on a dark theme with readable contrast.
    - inventory-360-sang and inventory-360-toi: the toolbar reads "60 dòng", "Nhóm theo Toà", "Cột", without "Toàn màn hình". The filter row (Chứa...) sits under the Căn, Toà and Dự án headers and scrolls sideways. There is no horizontal overflow of the page itself. The dark frame is legible.
    - sent-1440-sang and sent-1440-toi: the title is "Đã gửi". The toolbar reads "14 dòng", "Cột", "Toàn màn hình", with no "Nhóm theo Toà" and no search box. The filter row sits under the headers (Chứa..., <=5, 2-5, Ngày >14). Both themes are fine.
    - sent-360-sang and sent-360-toi: the toolbar reads "14 dòng", "Cột". The filter row (Chứa..., <=5, 2-) sits under the headers. There is no search box and both themes render fine.
    - inventory-khong-khop-1440-sang: the Căn filter box holds the typed text. The toolbar counter reads "0 / 60 dòng". The empty state shows "Không có dòng nào khớp", the explanation "Chữ bạn gõ ở ô lọc đầu cột không có trong dòng nào của vùng này." and a "Xoá lọc" button. The footer reads "0 / 60 dòng".
    - inventory-khong-khop-360-toi: the same empty state on a dark theme at 360. The Căn filter box is highlighted with the typed text, the counter reads "0 / 60 dòng", and the text is legible.
    All frames match Expected.
  network_observed: clean

### Eval carry-forward (delta không chạm paths của eval — round này không chạy lại)

- eval: E4
  run_id: minted-bo-o-tim-cua-vung-E4-r1
  exit_code: 0
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-14T01:34:10Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-bo-o-tim-cua-vung-E11-r1
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T01:34:10Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-bo-o-tim-cua-vung-E13-r1
  exit_code: 0
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-14T01:34:10Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E16
  run_id: minted-bo-o-tim-cua-vung-E16-r1
  exit_code: 0
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T01:34:10Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E17
  run_id: minted-bo-o-tim-cua-vung-E17-r1
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T01:34:10Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-bo-o-tim-cua-vung-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-14T02:18:18Z

### Judgment (đề xuất của hội đồng — người chốt ở Cổng 2)

- eval: E12
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment), fresh context
  verdict: PASS
  rationale: Cả ba góc nhìn đều đối chiếu sáu điểm với tệp thật và thấy khớp. states.md hàng 9 gọi trạng thái là «Không có dòng nào khớp» và bắt buộc lối «Xoá lọc». luoi.md nói lọc ở ô dưới tiêu đề cột, tìm ở ô ⌘K của App Shell. SavedView.yaml chỉ nhắc chữ tìm để nói nó không được giữ. wiki/log.md và CHANGELOG.md ghi lời chốt 2026-11-13 và migration 011. behaviors.md không còn từ tìm, search hay ⌘K.
  votes:
    - domain-correctness: PASS
    - operational-feasibility: PASS
    - spec-alignment: PASS
  human_override:  # chi nguoi ghi

- eval: E15
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment), fresh context
  verdict: PASS
  rationale: Các dòng bảng trỏ tới recipes.ts, grid.test.tsx, grid-sheet.test.tsx và grid-saved-view.test.tsx khớp ca thật, kèm ca phá được giữ hoặc thêm. Không dòng nào ghi xoá hay bỏ qua mà thiếu khẳng định thay. Lưu ý của hai góc nhìn: các dòng trỏ tới tệp ngoài danh sách đầu vào (e2e, behavior, ho-so-can, second-column-views, e2e-templates.test, goc-nhin) chỉ được đọc qua chữ của bảng, chưa đối chiếu với ca thật.
  votes:
    - domain-correctness: PASS
    - operational-feasibility: PASS
    - spec-alignment: PASS
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Variance

none — mọi eval đều chạy một lần, không có eval ngẫu nhiên và không có eval chập chờn.

## Iterations

Round 1: E2, E8, E20 đỏ (make e2e không đạt); các eval còn lại xanh. Trả về bước thực thi.
Round 2: sau commit 403118b (cột đầu luôn ghim bỏ nút Bỏ ghim ẩn, tám cột lại vừa) mọi eval máy xanh; E4, E11, E13, E16, E17 carry-forward từ round 1; E12 và E15 chờ người chốt.
