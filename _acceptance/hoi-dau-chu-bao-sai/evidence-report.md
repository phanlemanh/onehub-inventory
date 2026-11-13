---
schema_version: 2
feature_slug: hoi-dau-chu-bao-sai
verdict: REJECT
failed_evals: ["E9b"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e02e9e518801b8718dfa809b5ed4d49d17a3565b
human_signoff:
---

# Evidence Report: hoi-dau-chu-bao-sai

Round 3. Lệnh ui-check:E9b thoát khác 0 (gắn eval E9b); không có lệnh fail nào khác không gắn eval.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | test | PASS |
| E2b | AC-2 | script | PASS |
| E3 | AC-3 | test | PASS (carry-forward từ round 2) |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E5b | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | script | PASS |
| E8b | AC-8 | test | PASS |
| E9 | AC-9 | script | PASS |
| E9b | AC-9 | ui-check | FAIL |
| E9c | AC-9 | judgment | chờ người (hội đồng đề xuất PASS) |
| E10 | AC-9 | script | PASS |
| E11 | AC-9 | script | PASS |
| E12 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-hoi-dau-chu-bao-sai-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T14:06:43Z
  output: |
    21 passed (1.6m)

- eval: E2
  run_id: minted-hoi-dau-chu-bao-sai-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  output: |
    make test xanh (toàn bộ bộ test đơn vị)

- eval: E2b
  run_id: minted-hoi-dau-chu-bao-sai-E2b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T14:06:43Z
  output: |
    21 passed (1.6m)

- eval: E3
  run_id: minted-hoi-dau-chu-bao-sai-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:43:59Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-hoi-dau-chu-bao-sai-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  output: |
    make test xanh

- eval: E5
  run_id: minted-hoi-dau-chu-bao-sai-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  output: |
    make test xanh

- eval: E5b
  run_id: minted-hoi-dau-chu-bao-sai-E5b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T14:06:43Z
  output: |
    21 passed (1.6m)

- eval: E6
  run_id: minted-hoi-dau-chu-bao-sai-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  output: |
    make test xanh

- eval: E7
  run_id: minted-hoi-dau-chu-bao-sai-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  output: |
    make test xanh

- eval: E8
  run_id: minted-hoi-dau-chu-bao-sai-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T14:06:43Z
  output: |
    21 passed (1.6m)

- eval: E8b
  run_id: minted-hoi-dau-chu-bao-sai-E8b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  output: |
    make test xanh

- eval: E9
  run_id: minted-hoi-dau-chu-bao-sai-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T14:06:43Z
  output: |
    21 passed (1.6m)

- eval: E9b
  run_id: minted-hoi-dau-chu-bao-sai-E9b-r3
  exit_code: 1
  baseline: n-a
  verifier: ui-check
  verified_at: 2026-11-13T14:06:43Z
  screenshot: evidence/E9b-hoi-1440-light.png
  network_observed: n-a (driver)
  observed: |
    Frames opened and read. hoi-1440-light, hoi-360-dark, hoi-414-dark, hoi-1024-light: record body, then a bar stuck to the bottom with one blue (or light-blue in dark) button 'Hỏi đầu chủ · [Tên] 03', no overlap with the text above, bar separated by a rule; matches. chua-ai-giu-1440-light and chua-ai-giu-360-light: the bar button is greyed/pale and reads 'Căn chưa có đầu chủ giữ' (matches the expected off-button text). bao-sai-1440-light and bao-sai-1440-dark: dialog 'Báo sai thông tin căn 1101', 'Thuộc tính sai' = Căn, 'Đang hiện: 1101', 'Giá trị đúng' = 72 m², notes box, buttons 'Thôi' and 'Chép và mở bảng chia sẻ'; bao-sai-360-light: same as a sheet over the record, buttons stacked; matches. hoi-loi-1440-light and hoi-loi-360-dark: the ask button stays, red error 'Máy này không chép hay chia sẻ được. Chép tay tin dưới đây rồi gửi.' and a textarea with the whole message 'Hỏi về căn 1101 · S1.01' plus the full URL, wrapped, not cut; matches. bao-sai-loi-1440-dark and bao-sai-loi-360-light/dark: the dialog shows the same notice and a read-only box with all six lines (Báo sai thông tin căn 1101 / Toà / Dự án / Thuộc tính / Đang hiện / Đúng là: 72 m²), none cut; matches. dau-ho-so-360-dark and minh-giu-1440-light (own unit): head on two lines (title, then buttons), no ask bar on one's own unit; matches. DIFFERS from Expected: button texts are not all from the label table and not all <= 17 chars: 'Chép và mở bảng chia sẻ' (23, in bao-sai-* frames at 1440/1024/414/360), 'Hỏi đầu chủ · [Tên] 03' (22, all hoi-* frames) and 'Căn chưa có đầu chủ giữ' (23, chua-ai-giu-* frames). Visual layout, no-overlap, uncut and selectable message are fine.
  output: |
    Step1 (lane V db up): 21 passed, 19 skipped. Step2 ('two lines'): 16 passed. Step3: 35 frames copied to _acceptance/hoi-dau-chu-bao-sai/evidence/ as E9b-*.png (hoi, bao-sai, hoi-loi, bao-sai-loi, chua-ai-giu, minh-giu, dau-ho-so). Opened 16 of them with Read; the rest not individually opened.
    PASS foot bar sticks to the record bottom, no text overlap (1440/1024/414/360, light and dark); PASS unit nobody keeps shows off button 'Căn chưa có đầu chủ giữ' (1440, 360); PASS report dialog at 1440 and 360 with 'Căn' chosen and 'Đang hiện: 1101'; PASS copy-failure frames show the whole message uncut in a selectable read-only textarea.
    FAIL 'every button text from the label table, <= 17 chars': dialog primary 'Chép và mở bảng chia sẻ' = 23 chars, hard-coded in src/modules/listings/ui/ask-copy.ts:32, not in ontology/labels.yaml; 'Hỏi đầu chủ · [Tên] 03' = 22 chars; 'Căn chưa có đầu chủ giữ' = 23 chars. Only the label-table prefs 'Hỏi đầu chủ' (11) and 'Báo sai thông tin' (17) meet the cap. The author's own file chung-minh-man.md already lists 'chữ nút 21 ký tự' as a known gap.

- eval: E10
  run_id: minted-hoi-dau-chu-bao-sai-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-13T14:06:43Z
  output: |
    design-floor-s4 xanh

- eval: E11
  run_id: minted-hoi-dau-chu-bao-sai-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T14:06:43Z
  output: |
    9 tệp giao diện ngoài bản đồ

- eval: E12
  run_id: minted-hoi-dau-chu-bao-sai-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T14:06:43Z
  output: |
    975 passed (10.3m)

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-hoi-dau-chu-bao-sai-SUITE-make_check-r3
  exit_code: 0
  verified_at: 2026-11-13T14:06:43Z

- cmd: npm run build
  run_id: minted-hoi-dau-chu-bao-sai-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-13T14:06:43Z

## Judge (đề xuất, để human_override trống)

- eval: E9c
  proposal: PASS
  panel:
  - domain-correctness: PASS — Trong labels.yaml, AskListAgent có pref "Hỏi đầu chủ" và ReportUnitError có pref "Báo sai thông tin", cả hai kind: action và own: true. Chữ khớp design.md và contract.md AC-1, AC-6; "Báo sai thông tin" đúng 17 ký tự, "Hỏi đầu chủ" ngắn hơn. Hai tên mã là ghép riêng, không trùng tên RESO nào với nghĩa khác.
  - operational-feasibility: PASS — AskListAgent "Hỏi đầu chủ" (11 ký tự) và ReportUnitError "Báo sai thông tin" (17 ký tự) khớp design.md và contract.md (AC-9, giới hạn 17 ký tự). Cả hai có kind: action và own: true; tên không trùng RESO, mang nghĩa hành động riêng của sản phẩm.
  - spec-alignment: PASS — labels.yaml có AskListAgent (11 ký tự) và ReportUnitError (đúng 17 ký tự), kind: action, own: true. Chữ khớp design.md (Hỏi-1) và contract.md AC-6/AC-9; không dùng lại tên RESO cho nghĩa khác.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval không-phân-biệt (pass trên cả HEAD lẫn baseline, ở round 1): E10 (design-floor-s4), E11 (design-floor-khuon). Cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý.

Baseline không đo lại round này (evals.yaml không đổi từ lần đo cuối, round 1); field baseline của từng eval ghi n-a.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: REJECT — hết giờ ở một ca lưới không liên quan; trả về triển khai.
Round 2: REJECT — lỗi chập chờn ở phím tắt ⌘K; đã sửa bằng chờ bộ nghe phím gắn xong (commit e02e9e5).
Round 3: E9b failed — chữ nút không nằm trong bảng nhãn và vượt 17 ký tự: 'Chép và mở bảng chia sẻ' (23, cứng trong src/modules/listings/ui/ask-copy.ts:32), 'Hỏi đầu chủ · [Tên] 03' (22), 'Căn chưa có đầu chủ giữ' (23). Bố cục, không chồng chữ, tin chép đủ và bôi chọn được đều đạt. Các eval máy khác xanh.
