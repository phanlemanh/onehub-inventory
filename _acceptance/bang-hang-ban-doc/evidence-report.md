---
schema_version: 2
feature_slug: bang-hang-ban-doc
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 917bc8c98251a38d63aa559ebc72cce7e70606c1
human_signoff:
---

# Evidence Report: bang-hang-ban-doc

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS (carry-forward tu round 1) |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS (carry-forward tu round 1) |
| E5 | AC-5 | script | PASS (carry-forward tu round 1) |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS (carry-forward tu round 1) |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS (carry-forward tu round 1) |
| E10 | AC-10 | ui-check | PASS |
| E11 | AC-10 | judgment | UNCERTAIN |
| E12 | AC-6 | test | PASS |
| E13 | AC-11 | test | PASS (carry-forward tu round 1) |
| E14 | AC-11 | script | PASS |
| E15 | AC-7 | script | PASS |

## Analyst

Eval khong-phan-biet (pass tren CA code moi lan baseline, chung minh harness chu khong phai feature; viet lai de assert hanh vi moi hoac xac nhan la regression-guard co chu y):

- E2, E6, E8, E12 (lenh `make test`): baseline green.
- E15 (lenh design-floor-khuon): baseline green.

Eval phan biet (red tren baseline): E3, E14 (lenh `make e2e`).

Baseline khong do: E10 (ui-check, baseline n-a: khong chay duoc tren code cu). Cac eval carry-forward (E1, E4, E5, E7, E9, E13) khong chay lai o round nay nen khong do baseline.

## Evidence

- eval: E2
  run_id: minted-bang-hang-ban-doc-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:24:46Z
  output: |
    Lenh: make test (cover E2, E6, E8, E12), chay 1 lan, 1 lan dat.
    ================================================================================
    __EXIT=0

- eval: E6
  run_id: minted-bang-hang-ban-doc-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:24:46Z
  output: |
    Lenh: make test (cung lan chay voi E2).
    ================================================================================
    __EXIT=0

- eval: E8
  run_id: minted-bang-hang-ban-doc-E8-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:24:46Z
  output: |
    Lenh: make test (cung lan chay voi E2).
    ================================================================================
    __EXIT=0

- eval: E12
  run_id: minted-bang-hang-ban-doc-E12-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:24:46Z
  output: |
    Lenh: make test (cung lan chay voi E2).
    ================================================================================
    __EXIT=0

- eval: E3
  run_id: minted-bang-hang-ban-doc-E3-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T03:24:46Z
  output: |
    Lenh: make e2e (cover E3, E14), chay 1 lan, 1 lan dat.
    639 passed (5.1m)
    __EXIT=0

- eval: E14
  run_id: minted-bang-hang-ban-doc-E14-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T03:24:46Z
  output: |
    Lenh: make e2e (cung lan chay voi E3).
    639 passed (5.1m)
    __EXIT=0

- eval: E15
  run_id: minted-bang-hang-ban-doc-E15-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-12T03:24:46Z
  output: |
    Lenh: design-floor-khuon.mjs --kiem --root .
    10 tệp giao diện ngoài bản đồ
    __EXIT=0

- eval: E10
  run_id: minted-bang-hang-ban-doc-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-12T03:24:46Z
  screenshot: evidence/inventory-1440-sang.png   # chin khung: inventory-1440/1024/414/360 x sang/toi + inventory-1440-chu-dai.png; ban sao E10-step1..E10-step10.png
  observed: |
    I opened 6 of the 9 frames with Read: 1440 sang, 1440 toi, 1024 sang, 414 toi, 360 sang, 1440 chu-dai. The other 3 (1024 toi, 414 sang, 360 toi) were not opened; I checked them only through the DOM metrics.
    1440 sang: App Shell with sidebar (Bảng hàng / Tất cả hàng, Theo trạng thái). Title 'Bảng hàng'. Frame titled 'Hàng'. Search box with a magnifier icon and placeholder 'Gõ để tìm', then '60 dòng'. Columns #, Căn, Toà, Dự án, Trạng thái, Giá chào, Diện tích, Phòng ngủ, Xác nhận lúc, all eight readable with no horizontal scrollbar. Vertical rules between columns. Status badges coloured, numbers right-aligned, no overlapping text. The footer is below the fold.
    1440 toi: same layout on a dark background with light text; badges and column rules still readable, no overlap.
    1024 sang: sidebar still shown; the grid scrolls inside its frame, with the Giá chào column cut at the edge, and 'Vinhomes Ocean Pa...' truncated. The page itself does not scroll horizontally.
    414 toi: sidebar collapsed, dark. Search box and '60 dòng' stacked; grid shows #, Căn, Toà, Dự án (cut off), scrolls horizontally inside the frame, footer '60 dòng' visible at the bottom, no overlapping text.
    360 sang: same as 414 in light mode; grid cut off at Dự án and scrolls in its frame, footer '60 dòng' visible, page does not scroll horizontally.
    1440 chu-dai: search 'Empire' with a clear (x) button, counter '12 / 60 dòng', 12 rows, Dự án column 'Vinhomes Ocean Park...' ending in an ellipsis; layout intact.
    This matches Expected, with one exception: the footer '60 dòng' is not visible in the 1440/1024 viewport frames because it is below the fold.
  network_observed: unscoped-partial

- eval: E1
  run_id: minted-bang-hang-ban-doc-E1-r1
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:10:45Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-bang-hang-ban-doc-E4-r1
  exit_code: 0
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-12T03:10:45Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-bang-hang-ban-doc-E5-r1
  exit_code: 0
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-12T03:10:45Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-bang-hang-ban-doc-E7-r1
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:10:45Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-bang-hang-ban-doc-E9-r1
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:10:45Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-bang-hang-ban-doc-E13-r1
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:10:45Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Judgment (E11)

Panel de xuat cho E11 (AC-10): ba loi nhin, de xuat UNCERTAIN. Moi y kien duoc ghi day du. Cac phieu nay duoc cham khi tep inventory-1440-chu-dai.png chua co tren dia; tep nay nay da co trong thu muc evidence (xem E10), nguoi quyet nen mo xem truc tiep.

- eval: E11
  judged_by: judge-subagent panel (fresh context)
  verdict: UNCERTAIN
  rationale: Bon anh 360/1440 sang va toi cho thay dau man «Bảng hàng» ro, dau cot doc duoc, chu khong chong nhau, anh toi du tuong phan. Nhung khong anh nao trong bon anh cho thay ten khu dai bi cat bang dau cham lung: o 1440 chi co «Vinhomes Ocean Park 1» day du, o 360 chu bi cat boi mep vung cuon ngang chu khong phai boi dau cham lung.
  votes:
    - domain-correctness: UNCERTAIN — khong anh nao co ten khu dai bi cat co dau cham lung; anh inventory-1440-chu-dai.png nam trong danh sach input nhung luc cham chua ton tai tren dia.
    - operational-feasibility: UNCERTAIN — cac dong hien ra chi co «Vinhomes Ocean Park 1»; o 360 chu «Vinhomes C» bi cat boi khung cuon ngang, khong co dau «…»; anh chu-dai luc cham chua co.
    - spec-alignment: UNCERTAIN — o 1440 «Vinhomes Ocean Park 1» hien du chu; o 360 chu bi cat boi mep khung cuon; anh chu-dai luc cham chua co.
  required_evidence:
    - Anh `_acceptance/bang-hang-ban-doc/evidence/inventory-1440-chu-dai.png`, chup o 1440, co dong «Vinhomes Ocean Park 2 – The Empire» trong cot Du an, hien dau cham lung va khong chong chu len cot ke ben. Co anh nay va dat thi mục cham lung duoc cham, verdict co the thanh PASS.
    - Hoac mot anh Bang hang 1440 sang/toi cuon toi cac dong Ocean Park 2 de thay ten khu dai bi cat co dau cham lung, chup bang buoc ui-check cua hang nay va luu trong thu muc evidence/.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bang-hang-ban-doc-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-12T03:24:46Z

- cmd: npm run build
  run_id: minted-bang-hang-ban-doc-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-12T03:24:46Z

## Known limits

## Ngoài hợp đồng

## Variance

none — every multi-run eval is uniform (moi eval chay 1 lan, deterministic, khong co pass_rate hon hop).

## Iterations

Round 1: E3, E14 failed (bước `make e2e` đỏ: một lượt quét trợ năng ở khổ 1024, ghi ở commit 12ab062) — returned to implementation.
Round 2: moi eval may xanh (E2, E3, E6, E8, E10, E12, E14, E15 chay lai; E1, E4, E5, E7, E9, E13 carry-forward tu round 1); E11 van UNCERTAIN, cho nguoi quyet o Cong 2.
