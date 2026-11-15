---
schema_version: 2
feature_slug: don-no-bo-kiem
verdict: REJECT
failed_evals: ["E4"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 19f0b6f5136db917250b871b8c9d7eb36f9a3344
human_signoff:
---

# Evidence Report: don-no-bo-kiem

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS (carried, round 1) |
| E2 | AC-2 | test | PASS (carried, round 1) |
| E3 | AC-3 | script | PASS (carried, round 1) |
| E4 | AC-4 | script | FAIL |
| E5 | AC-5 | script | PASS (carried, round 1) |
| E6 | AC-6 | script | PASS (carried, round 1) |
| E7 | AC-7 | test | PASS (carried, round 1) |
| E8 | AC-8 | judgment | PASS (de xuat cua hoi dong, cho nguoi chot) |
| E8b | AC-8 | script | PASS (carried, round 1) |
| E9 | AC-9 | script | PASS (carried, round 1) |
| E10 | AC-9 | script | PASS |

## Evidence

- eval: E4
  run_id: r2-l1-1-20261115183641
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-15T18:36:41Z
  output: |
    1183 passed (8.7m), 1025 skipped
    gac-hydration: 1 canh bao, bai: settle.spec.ts › cho ngan › ngan khong mo | screens/screens.spec.ts › man sent › vung › pha vung cho-tai: khung cho khong bao gio hien | frame.spec.ts › frame › skeleton check fails on a screen
    make: *** [e2e] Error 1
  note: expected la 'gac-hydration: 0 canh bao'; lenh in 1 canh bao nen AC-4 khong dat. Lenh `make e2e` la lenh gan eval E4 (khong co lenh fail nao khong gan eval).

- eval: E10
  run_id: r2-l2-1-20261115183641
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-15T18:36:41Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E1
  run_id: minted-don-no-bo-kiem-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cong_chay
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-don-no-bo-kiem-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cong_chay
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-don-no-bo-kiem-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cho_tai_pha
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: r1-l4-1-20261115181836
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gac_hydration_pha
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-don-no-bo-kiem-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.so_quyet_dinh
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-don-no-bo-kiem-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.wiki_so_trung
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8b
  run_id: minted-don-no-bo-kiem-E8b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.release_de_xuat
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-don-no-bo-kiem-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ranh_gioi_1u
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

### Hoi dong cham (E8, judgment) — de xuat, cho nguoi chot o Cong 2

De xuat: PASS. Panel gom ba goc nhin; moi phieu ghi day du duoi day.

- domain-correctness: PASS — Dòng lỗi trong bản đề xuất trùng nguyên văn dòng ở mục «Gốc đã tìm» 3 của design doc. Khoá `RELEASE_PLEASE_TOKEN` cùng đúng ba quyền Contents, Pull requests, Issues (đọc-ghi) khớp mục «Nợ 3», Metadata chỉ đọc là mặc định, và không có quyền nào trên tệp workflow. Bản đề xuất có chỗ đặt (Settings → Secrets and variables → Actions), lối khác và giá của nó (PR phát hành không chạy CI, quyền mở cho mọi việc), nên chủ kho làm theo được mà không cần đọc log.
- operational-feasibility: PASS — Dòng lỗi trong release-de-xuat.md trùng nguyên văn dòng ở mục «Gốc đã tìm» 3 của design doc. Khoá `RELEASE_PLEASE_TOKEN` và đúng ba quyền Contents, Pull requests, Issues (đọc-ghi), cộng Metadata đọc tự có, khớp mục «Nợ 3», không có quyền nào trên tệp workflow. Bản đề xuất có chỗ đặt (Settings → Secrets and variables → Actions), lối khác (bật quyền cho Actions mở PR) cùng hai điều bất lợi của lối đó, và nêu nguyên nhân bằng ngôn ngữ chủ kho, nên chủ kho làm theo được mà không cần đọc log.
- spec-alignment: PASS — Dòng lỗi «release-please failed: GitHub Actions is not permitted to create or approve pull requests.» trùng nguyên văn dòng ở mục «Gốc đã tìm» 3. Khoá `RELEASE_PLEASE_TOKEN` và đúng ba quyền Contents, Pull requests, Issues (đọc-ghi, kèm Metadata: Read tự có) khớp mục «Nợ 3», không có quyền nào trên tệp workflow. Bản đề xuất có chỗ đặt (Settings → Secrets and variables → Actions), lối khác (bật quyền cho Actions mở PR) và giá của lối khác (PR phát hành vẫn không chạy CI, quyền mở cho mọi việc của kho), đủ để chủ kho làm theo mà không đọc log.

- eval: E8
  judged_by: judge panel (fresh context), de xuat PASS
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-don-no-bo-kiem-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-15T18:36:41Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval khong phan biet (xanh tren ca HEAD lan baseline): E10 (`make check`).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: cac eval E1, E2, E3, E5, E6, E7, E8b, E9 dat va duoc mang sang round 2.
Round 2: E4 failed — `make e2e` ket thuc voi loi; phep gac hydration in 1 canh bao thay vi 0 (cac bai nen vung cho-tai, ngan khong mo va skeleton), trong khi 1183 bai dat. Returned to implementation.
