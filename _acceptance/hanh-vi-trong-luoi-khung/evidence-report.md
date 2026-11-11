---
schema_version: 2
feature_slug: hanh-vi-trong-luoi-khung
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9b1d97a36624f02154a26cb48747ac11ca9bed12
human_signoff: Manh Phan 2026-11-11
---

# Evidence Report: hanh-vi-trong-luoi-khung

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-1 | script | PASS |
| E12 | AC-4 | script | PASS |
| E13 | AC-10 | script | PASS |
| E14 | AC-10 | ui-check | PASS |
| E15 | AC-5 | judgment | PASS |
| E16 | AC-10 | script | PASS |

## Evidence

Round 4 chạy lại E9 và E10 (delta chạm tệp của hai eval này). Các eval còn lại là carry-forward từ round 3.

- eval: E9
  run_id: minted-hanh-vi-trong-luoi-khung-E9-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T07:02:47Z
  output: |
    make test chạy xong, toàn bộ bộ kiểm xanh, gồm tests/behavior-guard.test.ts
    (câu nhập được đọc bằng cây cú pháp TypeScript).

- eval: E10
  run_id: minted-hanh-vi-trong-luoi-khung-E10-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-11T07:02:47Z
  output: |
    make check xanh, kết thúc bằng dòng:
    CODEOWNERS matches governance/autonomy.yaml

- eval: E1
  run_id: minted-hanh-vi-trong-luoi-khung-E1-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T06:20:47Z
  carried_from_round: 3
  note: carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-hanh-vi-trong-luoi-khung-E2-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T06:20:47Z
  carried_from_round: 3
  note: carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-hanh-vi-trong-luoi-khung-E3-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T06:20:47Z
  carried_from_round: 3
  note: carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-hanh-vi-trong-luoi-khung-E4-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T06:20:47Z
  carried_from_round: 3
  note: carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-hanh-vi-trong-luoi-khung-E5-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T06:20:47Z
  carried_from_round: 3
  note: carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-hanh-vi-trong-luoi-khung-E6-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T06:20:47Z
  carried_from_round: 3
  note: carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-hanh-vi-trong-luoi-khung-E7-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T06:20:47Z
  carried_from_round: 3
  note: carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-hanh-vi-trong-luoi-khung-E8-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T06:20:47Z
  carried_from_round: 3
  note: carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-hanh-vi-trong-luoi-khung-E11-r3
  exit_code: 0
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T06:20:47Z
  carried_from_round: 3
  note: carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-hanh-vi-trong-luoi-khung-E12-r3
  exit_code: 0
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T06:20:47Z
  carried_from_round: 3
  note: carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-hanh-vi-trong-luoi-khung-E13-r3
  exit_code: 0
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T06:20:47Z
  carried_from_round: 3
  note: carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E14
  run_id: minted-hanh-vi-trong-luoi-khung-E14-r3
  exit_code: 0
  verifier: config:capture.ui
  verified_at: 2026-11-11T06:20:47Z
  carried_from_round: 3
  note: carry-forward tu round 3 — delta khong cham paths cua eval (khung cua luot goc)
  screenshot: evidence/E14-step1.png
  observed: |
    step1: light 1440 - table of listings on left, record panel docked right (x 992-1440) headed 'S2.02-0302' with Truoc, Sau, Dong; fields Can, Trang thai (Dang giao dich), Gia 1,94 ty, Dien tich, Phong ngu, Toa, Xac nhan lan cuoi. Matches. step2: Luoi nguoi active, 'Nguoi mau 8 dong' table, panel in the identical right-hand frame headed '[Ten] 01' with Truoc (disabled), Sau, Dong; fields Ho ten, So dien thoai 0900 000 001, Loai 1. Matches. step3: 360x800 dark - panel fills the whole screen, title S1.01-0201, Truoc/Sau/Dong row, fields legible (light text on dark bg), green 'Dang ban' badge. Matches. step4: error state - under 'Can mau' only 'Vung nay chua tai duoc', the three-part sentence (what happened, rest still works, press Thu lai / reload later) and one 'Thu lai' button; no raw error. Matches. step5: blurred page with dialog 'Ban chac muon go can?', description of consequence (S1.01-0201 removed, cannot be restored), buttons 'Thoi' and 'Go can'. Matches.
  network_observed: clean

- eval: E16
  run_id: minted-hanh-vi-trong-luoi-khung-E16-r3
  exit_code: 0
  verifier: config:executors.design.floor
  verified_at: 2026-11-11T06:20:47Z
  carried_from_round: 3
  note: carry-forward tu round 3 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-hanh-vi-trong-luoi-khung-SUITE-build-r4
  exit_code: 0
  verified_at: 2026-11-11T07:02:47Z

- cmd: make e2e
  run_id: minted-hanh-vi-trong-luoi-khung-SUITE-make_e2e-r4
  exit_code: 0
  verified_at: 2026-11-11T07:02:47Z

### Judgment

- eval: E15
  judged_by: judge panel (giữ nguyên từ round 2 — inputs không đổi, không chấm lại; rationale xem round 2)
  verdict: PASS
  votes:
    - domain-correctness: PASS (r2)
    - operational-feasibility: PASS (r2)
    - spec-alignment: PASS (r2)
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên cả HEAD lẫn baseline, chứng minh harness chứ không phải feature; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- make test, phủ E9 (baseline green)
- make check, phủ E10 (baseline green)

## Variance

none — mọi eval chạy một lần, kết quả đồng nhất (runs: 1, không eval ngẫu nhiên).

## Iterations

Round 1-2: chạy đủ bộ eval, ghi vào sổ chạy; các lỗi tìm được đã sửa ở các commit sau.
Round 3: E1-E8, E11-E14, E16 chạy lại và xanh (sẽ được carry-forward ở round 4).
Round 4: sửa đọc đường nhập bằng cây cú pháp TypeScript (9b1d97a); chạy lại E9, E10 và hai lệnh suite, tất cả xanh; các eval còn lại carry-forward từ round 3.
