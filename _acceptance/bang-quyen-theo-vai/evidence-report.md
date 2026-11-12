---
schema_version: 2
feature_slug: bang-quyen-theo-vai
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b8968ecdb386b1d43531056512d35d50e532813d
human_signoff: Manh Phan 2026-11-12
---

# Evidence Report: bang-quyen-theo-vai

Round 2. Mười ba eval máy E1 đến E13 được mang sang từ round 1 vì delta không chạm paths của chúng. Round này chạy lại ba lệnh suite. E14 là mục judgment, chờ người chốt ở Cổng 2.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS (carry-forward từ round 1) |
| E2 | AC-2 | script | PASS (carry-forward từ round 1) |
| E3 | AC-3 | script | PASS (carry-forward từ round 1) |
| E4 | AC-4 | script | PASS (carry-forward từ round 1) |
| E5 | AC-5 | script | PASS (carry-forward từ round 1) |
| E6 | AC-5 | script | PASS (carry-forward từ round 1) |
| E7 | AC-6 | script | PASS (carry-forward từ round 1) |
| E8 | AC-6 | script | PASS (carry-forward từ round 1) |
| E9 | AC-6 | script | PASS (carry-forward từ round 1) |
| E10 | AC-7 | script | PASS (carry-forward từ round 1) |
| E11 | AC-8 | script | PASS (carry-forward từ round 1) |
| E12 | AC-9 | script | PASS (carry-forward từ round 1) |
| E13 | AC-9 | script | PASS (carry-forward từ round 1) |
| E14 | AC-9 | judgment | đề xuất PASS của hội đồng, chờ người chốt |

## Evidence

- eval: E1
  run_id: minted-bang-quyen-theo-vai-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bang_quyen_unit
  verified_at: 2026-11-12T09:21:39Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-bang-quyen-theo-vai-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bang_quyen_unit
  verified_at: 2026-11-12T09:21:39Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-bang-quyen-theo-vai-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bang_quyen_db
  verified_at: 2026-11-12T09:21:39Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-bang-quyen-theo-vai-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bang_quyen_db
  verified_at: 2026-11-12T09:21:39Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-bang-quyen-theo-vai-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bang_quyen_unit
  verified_at: 2026-11-12T09:21:39Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-bang-quyen-theo-vai-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bang_quyen_db
  verified_at: 2026-11-12T09:21:39Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-bang-quyen-theo-vai-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bang_quyen_db
  verified_at: 2026-11-12T09:21:39Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-bang-quyen-theo-vai-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_db_9a
  verified_at: 2026-11-12T09:21:39Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-bang-quyen-theo-vai-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_e2e
  verified_at: 2026-11-12T09:21:39Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-bang-quyen-theo-vai-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bang_quyen_db
  verified_at: 2026-11-12T09:21:39Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-bang-quyen-theo-vai-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bang_quyen_db
  verified_at: 2026-11-12T09:21:39Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-bang-quyen-theo-vai-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly_n
  verified_at: 2026-11-12T09:21:39Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-bang-quyen-theo-vai-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bang_quyen_db
  verified_at: 2026-11-12T09:21:39Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

### Judgment

Đề xuất hội đồng cho E14 (chưa phải quyết định). Mỗi judge ghi một phiếu, người chốt ở Cổng 2.

- eval: E14
  judged_by: hội đồng judge (ngữ cảnh mới), ba góc nhìn
  proposal: PASS
  votes:
    - domain-correctness: PASS — Glossary có hai dòng `Action` (Thao tác) và `Scope` (Phạm vi). Dòng Action nói «việc đọc hay ghi có tên trong bảng quyền (ontology/actions.yaml)». Dòng Scope nói «Toàn sàn (company), Của tôi (own), hay không được». Cả hai khớp cách actions.yaml dùng: mỗi dòng là một thao tác, và `scope` có company, own hoặc không có ô. Cột «Không nhầm với» tách rõ hai thuật ngữ này khỏi Company, vai và các thuật ngữ khác, nên không trùng nghĩa. wiki/log.md có dòng ngày 2026-11-12 «Hàng 9a dựng bảng quyền theo vai».
    - operational-feasibility: PASS — ontology/glossary.md có hai dòng `Action` (Thao tác) và `Scope` (Phạm vi), đều ghi "Riêng của ta". `Action` là việc có tên trong bảng quyền `ontology/actions.yaml`. `Scope` là Toàn sàn (`company`), Của tôi (`own`) hoặc không được. Cách hiểu này khớp với actions.yaml, nơi mỗi thao tác là một dòng và mỗi vai có một ô `company` hoặc `own`, vai không có ô thì không được chạy. Hai dòng còn nêu rõ các thuật ngữ cần tránh nhầm (Company, vai, trạng thái bản ghi), và tra "Action|Scope" trong glossary chỉ ra hai dòng này nên không có mục trùng. wiki/log.md có dòng 2026-11-12 nói hàng 9a dựng bảng quyền theo vai.
    - spec-alignment: PASS — Bảng thuật ngữ có hai mục `Action` (Thao tác) và `Scope` (Phạm vi), đều đánh dấu «Riêng của ta». Nghĩa khớp actions.yaml: thao tác là một dòng của bảng quyền, mỗi vai một ô; phạm vi là `company` (Toàn sàn), `own` (Của tôi) hoặc không có ô, tức không được. Cột «không nhầm với» tách hai mục khỏi `Company`, vai và trạng thái bản ghi. wiki/log.md có dòng 2026-11-12 «Hàng 9a dựng bảng quyền theo vai».
  human_override: Manh Phan 2026-11-12 — Đạt

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bang-quyen-theo-vai-SUITE-make_check-r2
  exit_code: 0
  baseline: n-a
  verified_at: 2026-11-12T09:37:43Z

- cmd: npm run build
  run_id: minted-bang-quyen-theo-vai-SUITE-build-r2
  exit_code: 0
  baseline: n-a
  verified_at: 2026-11-12T09:37:43Z

- cmd: make e2e
  run_id: minted-bang-quyen-theo-vai-SUITE-make_e2e-r2
  exit_code: 0
  baseline: n-a
  verified_at: 2026-11-12T09:37:43Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1 đến E13 chạy và ghi vào nhật ký; lệnh make check hết thời gian ngoài thay đổi nên chấm lại trên cùng cây (commit b8968ec).
Round 2: ba lệnh suite xanh trên cây b8968ec (make check, npm run build, make e2e với 639 ca qua); E1 đến E13 mang sang từ round 1; E14 chờ người chốt.
