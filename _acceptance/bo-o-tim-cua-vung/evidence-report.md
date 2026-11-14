---
schema_version: 2
feature_slug: bo-o-tim-cua-vung
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 140380f2b9079cbf9d74cb30604cfc4649766193
human_signoff: Manh Phan 2026-11-14
---

# Evidence Report: bo-o-tim-cua-vung

Round 3. Mọi eval máy đều đạt; còn hai mục judgment (E12, E15) chờ người chốt ở Cổng 2.

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
| E11 | AC-7 | test | PASS |
| E12 | AC-7 | judgment | PASS (đề xuất của hội đồng, chờ người chốt) |
| E13 | AC-8 | script | PASS (carry-forward từ round 1) |
| E14 | AC-9 | script | PASS |
| E15 | AC-9 | judgment | PASS (đề xuất của hội đồng, chờ người chốt) |
| E16 | AC-10 | test | PASS |
| E17 | AC-7 | script | PASS |
| E18 | AC-9 | script | PASS |
| E19 | AC-11 | test | PASS |
| E20 | AC-12 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-bo-o-tim-cua-vung-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T06:40:52Z
  output: |
    make test: toàn bộ bài đơn vị đạt, lệnh kết thúc thành công.

- eval: E2
  run_id: minted-bo-o-tim-cua-vung-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-14T06:40:52Z
  output: |
    make e2e: 1092 passed (9.3m)

- eval: E3
  run_id: minted-bo-o-tim-cua-vung-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.ui_check
  verified_at: 2026-11-14T06:40:52Z
  screenshot: evidence/E3-inventory-1440-sang.png
  observed: |
    1) inventory-1440-sang: no search box in the toolbar. It shows '60 dòng', 'Nhóm theo Toà', 'Cột' and 'Toàn màn hình'. Under the headers there is a filter row (Chứa..., S1.01, Chọn, Tỳ <=5, <=5, 2-5, Ngày >14), and a '60 dòng' footer. Light theme. Matches expected.
    2) inventory-1440-toi: same layout in dark theme and readable. Matches.
    3) inventory-360-sang: toolbar shows '60 dòng', 'Nhóm theo Toà' and 'Cột', with no search box. 'Toàn màn hình' is hidden by design. The filter row under the Căn and Toà headers is visible, and the table scrolls sideways. Matches.
    4) inventory-360-toi: same as 3 in dark theme. Matches.
    5) sent-1440-sang: toolbar shows '14 dòng', 'Cột' and 'Toàn màn hình', with no search box and no 'Nhóm theo' (correct, that only applies to Bảng hàng). The filter row sits under the headers (Chứa..., <=5 2-5, Ngày >14). Matches.
    6) sent-1440-toi: same in dark theme. Matches.
    7) sent-360-sang: toolbar shows '14 dòng' and 'Cột', with the filter row under 'Người nhận' and 'Lượt mở'. Matches.
    8) sent-360-toi: same in dark theme. Matches.
    9) khong-khop-1440-sang: the Căn filter box holds the typed text, and the count reads '0 / 60 dòng'. The body shows the state 'Không có dòng nào khớp' with the line 'Chữ bạn gõ ở ô lọc đầu cột không có trong dòng nào của vùng này.' and a 'Xoá lọc' button. Matches.
    10) khong-khop-360-toi: same empty state in dark theme at 360 ('0 / 60 dòng', 'Không có dòng nào khớp', 'Xoá lọc'). Matches.
  network_observed: clean
  output: |
    - Text 'Không có dòng nào khớp' appears (count 1) at 1440 light and 360 dark after typing khong-co-dong-nao.
    - No app-origin 4xx/5xx, no failed requests, and no console errors (E3-network.txt has an empty NET section). Pages did make app-origin requests, so networkObserved is clean.
    Note: 'Toàn màn hình' is absent at 360. This is intended, not a defect: data-region.tsx hides it below 768px ('hidden md:contents', row 2b).

- eval: E4
  run_id: minted-bo-o-tim-cua-vung-E4-r1
  exit_code: 0
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-14T01:34:10Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-bo-o-tim-cua-vung-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T06:40:52Z
  output: |
    make test: toàn bộ bài đơn vị đạt, lệnh kết thúc thành công.

- eval: E6
  run_id: minted-bo-o-tim-cua-vung-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T06:40:52Z
  output: |
    make test: toàn bộ bài đơn vị đạt, lệnh kết thúc thành công.

- eval: E7
  run_id: minted-bo-o-tim-cua-vung-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T06:40:52Z
  output: |
    make test: toàn bộ bài đơn vị đạt, lệnh kết thúc thành công.

- eval: E8
  run_id: minted-bo-o-tim-cua-vung-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-14T06:40:52Z
  output: |
    make e2e: 1092 passed (9.3m)

- eval: E9
  run_id: minted-bo-o-tim-cua-vung-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T06:40:52Z
  output: |
    make test: toàn bộ bài đơn vị đạt, lệnh kết thúc thành công.

- eval: E10
  run_id: minted-bo-o-tim-cua-vung-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goc_nhin_e2e
  verified_at: 2026-11-14T06:40:52Z
  output: |
    tests/e2e-db/goc-nhin.spec.ts trên Postgres dãy K: 11 passed (1.4m)

- eval: E11
  run_id: minted-bo-o-tim-cua-vung-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T06:40:52Z
  output: |
    make test: toàn bộ bài đơn vị đạt, lệnh kết thúc thành công.

- eval: E13
  run_id: minted-bo-o-tim-cua-vung-E13-r1
  exit_code: 0
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-14T01:34:10Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E14
  run_id: minted-bo-o-tim-cua-vung-E14-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-14T06:40:52Z
  output: |
    make check: CODEOWNERS matches governance/autonomy.yaml

- eval: E16
  run_id: minted-bo-o-tim-cua-vung-E16-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T06:40:52Z
  output: |
    vitest tools/proof_gate (verbose): toàn bộ ca đạt, lệnh kết thúc thành công.

- eval: E17
  run_id: minted-bo-o-tim-cua-vung-E17-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T06:40:52Z
  output: |
    design-floor-khuon --kiem: 10 tệp giao diện ngoài bản đồ; không có dòng lệch cho nhóm luoi.

- eval: E18
  run_id: minted-bo-o-tim-cua-vung-E18-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.doi_bai_kiem
  verified_at: 2026-11-14T06:40:52Z
  output: |
    doi-bai-kiem --self-test: ca phá "tro toi dong khong phai ca" đỏ đúng thông điệp — doi-bai-kiem: ca khong co: // @vitest-environment jsdom

- eval: E19
  run_id: minted-bo-o-tim-cua-vung-E19-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T06:40:52Z
  output: |
    make test: toàn bộ bài đơn vị đạt, lệnh kết thúc thành công.

- eval: E20
  run_id: minted-bo-o-tim-cua-vung-E20-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-14T06:40:52Z
  output: |
    make e2e: 1092 passed (9.3m)

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-bo-o-tim-cua-vung-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-14T06:40:52Z

### Judgment (đề xuất của hội đồng — người chốt ở Cổng 2)

- eval: E12
  judged_by: hội đồng 3 judge (fresh context)
  proposal: PASS
  rationale: Cả ba góc nhìn đề xuất đạt; xem phiếu từng judge ở mục dưới.
  human_override: "Đạt — Manh Phan 2026-11-14"

- eval: E15
  judged_by: hội đồng 3 judge (fresh context)
  proposal: PASS
  rationale: Cả ba góc nhìn đề xuất đạt; xem phiếu từng judge ở mục dưới.
  human_override: "Đạt — Manh Phan 2026-11-14"

#### Phiếu E12 (đề xuất: PASS)

- domain-correctness: PASS — (1) states.md dòng 9 có «Không có dòng nào khớp» bắt buộc «Xoá lọc». (2) luoi.md dòng 26-27 và states.md dòng 21 nói lọc ở ô dưới tiêu đề cột, tìm ở ô ⌘K, vùng không có chỗ gõ tìm riêng. (3) SavedView.yaml chỉ nói góc nhìn không giữ chữ tìm. (4) wiki/log.md dòng 19 và (5) CHANGELOG.md dòng 9 ghi chủ kho chốt 2026-11-13 và migration 011 bỏ chữ tìm khỏi góc nhìn cũ. (6) behaviors.md không còn từ nào về tìm.
- operational-feasibility: PASS — (1) design/states.md dòng 9 gọi trạng thái là «Không có dòng nào khớp» và bắt buộc «Xoá lọc». (2) design/patterns/luoi.md dòng 26-27 nói lọc bằng ô dưới tiêu đề cột, tìm ở ô ⌘K của thanh trên App Shell, vùng không có chỗ gõ tìm riêng. (3) SavedView.yaml chỉ nói góc nhìn không giữ chữ tìm («nothing typed to search», migration 011 đã bỏ) và không có câu nào nói góc nhìn giữ chữ tìm. (4) wiki/log.md dòng 19 ghi góc nhìn thôi giữ chữ tìm theo lời chốt 2026-11-13 và migration 011 bỏ chữ tìm khỏi góc nhìn cũ. (5) CHANGELOG.md dòng 9 có dòng tương tự. (6) design/behaviors.md không có từ nào về tìm, search hay ô tìm.
- spec-alignment: PASS — (1) states.md dòng 9 gọi trạng thái «Không có dòng nào khớp» và bắt buộc lối thoát «Xoá lọc». (2) luoi.md nói lọc bằng ô dưới tiêu đề cột và tìm ở ô ⌘K của thanh trên, «vùng không có chỗ gõ tìm riêng». (3) SavedView.yaml chỉ nói góc nhìn không còn giữ chữ tìm, không có câu nào nói còn giữ. (4) wiki/log.md dòng 2026-11-13 ghi góc nhìn thôi giữ chữ tìm theo lời chốt chủ kho và migration 011 bỏ chữ tìm khỏi góc nhìn cũ. (5) CHANGELOG.md dòng 9 ghi tương tự. (6) behaviors.md không có chữ «tìm» hay «search», chỉ có mục lọc từng cột.

#### Phiếu E15 (đề xuất: PASS)

- domain-correctness: PASS — Tôi đã đọc các ca mới trong recipes.ts, grid.test.tsx, grid-sheet.test.tsx và grid-saved-view.test.tsx. Mọi dòng bảng trỏ tới các tệp này (21–39, 47–53) đều khớp ca thật: tên ca, câu khẳng định, dòng mới, số ca (5 cách mở, 4 ô, 10 cặp, 3 cách không khớp) và thông điệp lỗi như «filter box remounted on no match», «sameView blind to filter text», «khong-khop: thieu loi thoat Xoa loc». Không dòng nào xoá hay bỏ qua mà không có khẳng định thay, và các ca phá vẫn còn nguyên; ca «chỉ tìm» thành khẳng định «không có ô tìm» cùng bài kiểm «bỏ chữ tìm cũ».
- operational-feasibility: PASS — Mọi dòng trong bảng đều có khẳng định thay, không có dòng nào chỉ ghi xoá hay bỏ qua, và không dòng nào yếu hơn. Các dòng chuyển từ ô tìm sang ô lọc cột Căn, Mã, Toà nhà hoặc ô lọc cột đầu vẫn giữ cùng tập dòng, cùng số đếm và cùng thông điệp lỗi, ví dụ «1 / 2 dòng», «30 / 60 dòng», «filter box remounted on no match» và «sameView blind to filter text». Các dòng chuyển thành «không có ô tìm» được thay bằng ma trận 7 trạng thái có ca phá và có ca đối chứng dương. Các ca mới nêu trong bảng đều có thật trong grid.test.tsx, grid-sheet.test.tsx, grid-saved-view.test.tsx và recipes.ts, và khớp với câu khẳng định bảng ghi. Các dòng trỏ tới tệp ngoài danh sách đầu vào (e2e-templates.test.ts, các tệp e2e) không nằm trong phạm vi chấm này.
- spec-alignment: PASS — Trong bảng đối chiếu không có dòng nào ghi «xoá» hay «bỏ qua» mà thiếu khẳng định thay. Các dòng trỏ tới grid.test.tsx, grid-sheet.test.tsx, grid-saved-view.test.tsx và recipes.ts đều khớp với ca thật: ca lọc cột giữ cùng tập dòng, cùng số «x / TOTAL dòng» và cùng thông điệp lỗi, hoặc thành khẳng định «không có ô tìm» có ca phá kèm theo. Chỉ có ma trận «search only» bị bỏ (6 cách thành 5), nhưng đã có khẳng định thay và được ghi rõ theo E9. Các dòng trỏ tới tệp ngoài danh sách input (e2e, behavior, ho-so-can) không được xét ở đây.

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 2 — baseline khong do lai round nay (field baseline của từng eval ghi n-a vì round này không đo).

Eval không phân biệt (xanh cả trên HEAD lẫn baseline — chứng minh harness chứ chưa chứng minh feature; cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- make test: E1, E5, E6, E7, E9, E19
- make check: E14

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E4 và E13 đạt, được carry-forward sang các round sau vì delta không chạm paths của chúng.
Round 2: baseline được đo; evals.yaml không đổi từ lần đo này.
Round 3: mọi eval máy đạt (E4, E13 carry-forward); E12 và E15 chờ người chốt ở Cổng 2 — verdict PENDING-JUDGMENT.
