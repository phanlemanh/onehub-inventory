---
schema_version: 2
feature_slug: loi-vao-ho-so
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: c7be718fd5f594c60970622c9c4bd61f931c0b7a
human_signoff: Manh Phan 2026-11-13
---

# Evidence Report: loi-vao-ho-so

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-8 | ui-check | PASS |
| E10 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-loi-vao-ho-so-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T06:33:15Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-loi-vao-ho-so-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T06:33:15Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-loi-vao-ho-so-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T06:33:15Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-loi-vao-ho-so-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T06:33:15Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-loi-vao-ho-so-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T06:33:15Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-loi-vao-ho-so-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T06:33:15Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-loi-vao-ho-so-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T06:33:15Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-loi-vao-ho-so-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T06:33:15Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-loi-vao-ho-so-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:capture.ui
  verified_at: 2026-11-13T06:43:32Z
  screenshot: evidence/E9-step1.png
  observed: |
    I opened step1, 2, 4, 10, 12, 17, 18 and 19; the other frames passed the DOM and geometry assertions only.

    - E9-step1 (ho-so-1440-sang): Record panel open on the right for 1603 · S1.01. The head shows the «Chép đường dẫn» button with the text and a link icon, then «Trước», «Sau», «Đóng», all on one line. No overlapping text.
    - E9-step2 (da-chep-1440): Same view with the toast «Đã chép đường dẫn» clearly visible at the bottom of the panel.
    - E9-step4 (ho-so-1024-sang): The copy button shrinks to the link icon only. «Trước», «Sau», «Đóng» stay on the same line as the title. No horizontal scroll.
    - E9-step10 (da-chep-360, dark): Head shows the icon button, «Trước», «Sau», «Đóng» on one line. The toast «Đã chép đường dẫn» is clear at the bottom, with readable light text on a dark background.
    - E9-step17 (go-ma-360-toi): The palette has the input "16" and 5 suggestions. Each row has a «Căn» kind label on the left, then the code and building. It sits fully inside the screen (16px margins) and is not covered by any edge. Text is legible in dark.
    - E9-step12 (ma-la-1440-sang): Bảng hàng shows the familiar empty state «Không có dòng nào khớp» with «Chữ bạn gõ không có trong dòng nào của vùng này.» and a «Xoá lọc» button. Z-99.99 is visible at the head of the Căn column filter, and the count reads "0 / 60 dòng".
    - E9-step18 (ma-la-360-toi): The same empty state at phone width. The Căn filter box shows Z-99.99, slightly clipped by the box edge but still readable. No horizontal page scroll.
    - E9-step19 (duong-dan-cu-1440): Normal Bảng hàng with all rows, plus a toast «Căn trong đường dẫn không còn trong Bảng hàng.».

    Every frame I opened matches the Expected.
  network_observed: clean

- eval: E10
  run_id: minted-loi-vao-ho-so-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T06:33:15Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-loi-vao-ho-so-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-13T06:43:32Z

- cmd: npm run build
  run_id: minted-loi-vao-ho-so-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-13T06:43:32Z

- cmd: make e2e
  run_id: minted-loi-vao-ho-so-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-13T06:43:32Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: grading round recorded; the dev-only badge was hidden in the screenshot steps and E9 was to be re-captured.
Round 2: E9 re-captured (frames 1-19) and the three suite commands re-run; E1-E8 and E10 carried from round 1 because the delta does not touch their paths.

### Re-pin lần 1 — 2026-11-13, do gộp nhánh chính (vai đăng nhập, hàng 1s) vào nhánh trước khi gộp PR #46
run_id: repin-20261113T090923Z-56995
sha: c7be718fd5f594c60970622c9c4bd61f931c0b7a · suites: 3 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng · ngoài làn máy: E9
