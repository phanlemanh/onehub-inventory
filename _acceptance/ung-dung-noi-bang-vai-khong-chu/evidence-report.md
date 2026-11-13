---
schema_version: 2
feature_slug: ung-dung-noi-bang-vai-khong-chu
verdict: REJECT
failed_evals: ["E1","E2","E3","E4","E5","E6","E7","E8"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ba7d2e651eecbb1e06028695823c391fc04d4423
human_signoff:
---

# Evidence Report: ung-dung-noi-bang-vai-khong-chu

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | FAIL |
| E2 | AC-2 | script | FAIL |
| E3 | AC-3 | script | FAIL |
| E4 | AC-4 | script | FAIL |
| E5 | AC-5 | script | FAIL |
| E6 | AC-6 | script | FAIL |
| E6b | AC-6 | test | PASS |
| E7 | AC-7 | script | FAIL |
| E8 | AC-8 | script | FAIL |
| E8b | AC-8 | script | PASS |
| E8c | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E9b | AC-9 | script | PASS |

Round 1 (vong dau): E1 den E7 dung chung mot lenh (bo chay cach-ly cong hai tep vitest) va E8 chay ca thu muc tests/db. Ca hai lenh do mot bai duy nhat tests/db/cach-ly.db.test.ts, "a deleted, two harmless and an unparsable break file are each named" (E9b trong ten bai la nhan noi bo cua tep test, khong phai eval E9b), vuot han 60 giay cua vitest (chay 81 giay) nen lenh thoat khac 0. 24 ca con lai trong lenh dau va 104 ca trong lenh sau deu dat, gom ca E5, E6, E7 trong tep vai-dang-nhap.db.test.ts. Khong co eval nao co dau hieu UI nen khong co khoi screenshot.

Lenh fail khong gan eval: khong co (ca hai lenh fail deu da gan eval o tren).

## Evidence

- eval: E1
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E1-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.vai_dang_nhap_c
  verified_at: 2026-11-13T03:57:27Z
  output: |
    Test Files  1 failed | 1 passed (2)
    Tests  1 failed | 24 passed (25)
    FAIL tests/db/cach-ly.db.test.ts > isolation runner names every broken break file (E9b) > a deleted, two harmless and an unparsable break file are each named
    Error: Test timed out in 60000ms.

- eval: E2
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E2-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.vai_dang_nhap_c
  verified_at: 2026-11-13T03:57:27Z
  output: |
    Cung lenh voi E1: 24 ca dat, 1 ca het gio 60 giay (bai "a deleted, two harmless and an unparsable break file").
    Bai "login-role session file (E2, E3)" dat.

- eval: E3
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E3-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.vai_dang_nhap_c
  verified_at: 2026-11-13T03:57:27Z
  output: |
    Cung lenh voi E1: lenh thoat do ca het gio; bai "the session file switches role and company with the door's exact statements" dat.

- eval: E4
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E4-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.vai_dang_nhap_c
  verified_at: 2026-11-13T03:57:27Z
  output: |
    Cung lenh voi E1: lenh thoat do ca het gio 60 giay trong tests/db/cach-ly.db.test.ts.

- eval: E5
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E5-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.vai_dang_nhap_c
  verified_at: 2026-11-13T03:57:27Z
  output: |
    Bai "reads the runner at 83d1764: 31 cases, 24 break files" dat; bai "the current runner keeps every case and pinned line of it, and adds the four login-role cases" dat.
    Lenh chung van thoat do ca het gio.

- eval: E6
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E6-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.vai_dang_nhap_c
  verified_at: 2026-11-13T03:57:27Z
  output: |
    4 bai cua "the door refuses a connection that can reach the owner (E6)" dat trong tests/db/vai-dang-nhap.db.test.ts.
    Lenh chung van thoat do ca het gio o tep cach-ly.

- eval: E6b
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E6b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_dang_nhap_unit
  verified_at: 2026-11-13T03:57:27Z
  output: |
    npx vitest run src/modules/identity/with-company.test.ts tests/vai-dang-nhap-nguon.test.ts: xanh

- eval: E7
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E7-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.vai_dang_nhap_c
  verified_at: 2026-11-13T03:57:27Z
  output: |
    4 bai cua "code inside the door cannot get back to the owner (E7)" dat (ba lenh bi tu choi, doi chung vai chu di qua).
    Lenh chung van thoat do ca het gio o tep cach-ly.

- eval: E8
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E8-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.cach_ly_7b_db_c
  verified_at: 2026-11-13T03:57:27Z
  output: |
    Test Files  1 failed | 6 passed (7)
    Tests  1 failed | 104 passed (105)
    FAIL tests/db/cach-ly.db.test.ts > isolation runner names every broken break file (E9b) > a deleted, two harmless and an unparsable break file are each named
    Error: Test timed out in 60000ms.

- eval: E8b
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E8b-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.vai_dang_nhap_e2e_c
  verified_at: 2026-11-13T03:57:27Z
  output: |
    350 passed (7.4m)

- eval: E8c
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E8c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_dang_nhap_unit
  verified_at: 2026-11-13T03:57:27Z
  output: |
    npx vitest run src/modules/identity/with-company.test.ts tests/vai-dang-nhap-nguon.test.ts: xanh

- eval: E9
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_dang_nhap_unit
  verified_at: 2026-11-13T03:57:27Z
  output: |
    npx vitest run src/modules/identity/with-company.test.ts tests/vai-dang-nhap-nguon.test.ts: xanh

- eval: E9b
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-E9b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-13T03:57:27Z
  output: |
    make check ket thuc xanh; dong cuoi: CODEOWNERS matches governance/autonomy.yaml

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-13T03:57:27Z

- cmd: make e2e
  run_id: minted-ung-dung-noi-bang-vai-khong-chu-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-13T03:57:27Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval khong-phan-biet (xanh tren ca HEAD lan baseline):
- E9b (lenh make check): xanh tren ca hai phia; la regression-guard, can xac nhan co chu y hoac viet lai de assert hanh vi moi.

Baseline khong do:
- DB_LANE=${DB_LANE:-c} DB_PORT=${DB_PORT:-5569} bash -c 'bash db/scripts/cach-ly.sh && npx vitest run -c vitest.db.config.ts tests/db/cach-ly.db.test.ts tests/db/vai-dang-nhap.db.test.ts --reporter=verbose': bo qua baseline: tep tests/db/vai-dang-nhap.db.test.ts co o cay dang kiem nhung chua co o merge-base f458f6d3dbbb80bfa0c1512fe202559cf45dddef — eval moi, chay tren code cu khong phan biet gi
- npx vitest run src/modules/identity/with-company.test.ts tests/vai-dang-nhap-nguon.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/vai-dang-nhap-nguon.test.ts co o cay dang kiem nhung chua co o merge-base f458f6d3dbbb80bfa0c1512fe202559cf45dddef — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-c} DB_PORT=${DB_PORT:-5569} npx vitest run -c vitest.db.config.ts tests/db --reporter=verbose: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu

## Judge panels

Khong co eval judgment trong hop dong nay nen khong co panel de xuat va khong co muc human_override can dien.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1, E2, E3, E4, E5, E6, E7, E8 failed — bai "a deleted, two harmless and an unparsable break file are each named" trong tests/db/cach-ly.db.test.ts het gio 60 giay (chay 81 giay); cac bai con lai cua hai lenh deu dat. Returned to implementation.
