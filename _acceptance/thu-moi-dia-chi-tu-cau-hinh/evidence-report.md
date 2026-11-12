---
schema_version: 2
feature_slug: thu-moi-dia-chi-tu-cau-hinh
verdict: REJECT
failed_evals: ["E1","E2","E3","E4","E5","E6","E7"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 244f42c3baa4ffd0a2b952f52bb6e75bce365e48
human_signoff:
---

# Evidence Report: thu-moi-dia-chi-tu-cau-hinh

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | FAIL |
| E2 | AC-2 | test | FAIL |
| E3 | AC-3 | test | FAIL |
| E4 | AC-4 | test | FAIL |
| E5 | AC-5 | test | FAIL |
| E6 | AC-6 | test | FAIL |
| E7 | AC-7 | test | FAIL |
| E8 | AC-2 | judgment | PASS (đề xuất của hội đồng, chờ người chốt ở Cổng 2) |

Nguyên nhân chung của E1-E7: lệnh `make test` (chạy bộ test đơn vị mà cả bảy eval dùng) thoát khác 0. Bộ test `tests/language.test.ts`, ca "does not hard-code labels or old spellings", báo `src/modules/identity/config.test.ts: Sàn: expected true to be false`, tức tệp test mới chứa từ nhãn «Sàn» bị luật ngôn ngữ cấm. Kết quả: 1 test đỏ, 1044 test xanh, 1 tệp đỏ trong 49 tệp. Lệnh được tính cho cả bảy eval nên cả bảy bị tính đỏ.

## Evidence

- eval: E1
  run_id: minted-thu-moi-dia-chi-tu-cau-hinh-E1-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T02:13:32Z
  output: |
    FAIL  tests/language.test.ts > source code > does not hard-code labels or old spellings
    AssertionError: src/modules/identity/config.test.ts: Sàn: expected true to be false
    Test Files  1 failed | 48 passed (49)
    Tests  1 failed | 1044 passed (1045)
    make: *** [test] Error 1

- eval: E2
  run_id: minted-thu-moi-dia-chi-tu-cau-hinh-E2-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T02:13:32Z
  output: |
    FAIL  tests/language.test.ts > source code > does not hard-code labels or old spellings
    AssertionError: src/modules/identity/config.test.ts: Sàn: expected true to be false
    Test Files  1 failed | 48 passed (49)
    Tests  1 failed | 1044 passed (1045)
    make: *** [test] Error 1

- eval: E3
  run_id: minted-thu-moi-dia-chi-tu-cau-hinh-E3-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T02:13:32Z
  output: |
    FAIL  tests/language.test.ts > source code > does not hard-code labels or old spellings
    AssertionError: src/modules/identity/config.test.ts: Sàn: expected true to be false
    Test Files  1 failed | 48 passed (49)
    Tests  1 failed | 1044 passed (1045)
    make: *** [test] Error 1

- eval: E4
  run_id: minted-thu-moi-dia-chi-tu-cau-hinh-E4-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T02:13:32Z
  output: |
    FAIL  tests/language.test.ts > source code > does not hard-code labels or old spellings
    AssertionError: src/modules/identity/config.test.ts: Sàn: expected true to be false
    Test Files  1 failed | 48 passed (49)
    Tests  1 failed | 1044 passed (1045)
    make: *** [test] Error 1

- eval: E5
  run_id: minted-thu-moi-dia-chi-tu-cau-hinh-E5-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T02:13:32Z
  output: |
    FAIL  tests/language.test.ts > source code > does not hard-code labels or old spellings
    AssertionError: src/modules/identity/config.test.ts: Sàn: expected true to be false
    Test Files  1 failed | 48 passed (49)
    Tests  1 failed | 1044 passed (1045)
    make: *** [test] Error 1

- eval: E6
  run_id: minted-thu-moi-dia-chi-tu-cau-hinh-E6-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T02:13:32Z
  output: |
    FAIL  tests/language.test.ts > source code > does not hard-code labels or old spellings
    AssertionError: src/modules/identity/config.test.ts: Sàn: expected true to be false
    Test Files  1 failed | 48 passed (49)
    Tests  1 failed | 1044 passed (1045)
    make: *** [test] Error 1

- eval: E7
  run_id: minted-thu-moi-dia-chi-tu-cau-hinh-E7-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T02:13:32Z
  output: |
    FAIL  tests/language.test.ts > source code > does not hard-code labels or old spellings
    AssertionError: src/modules/identity/config.test.ts: Sàn: expected true to be false
    Test Files  1 failed | 48 passed (49)
    Tests  1 failed | 1044 passed (1045)
    make: *** [test] Error 1

### Judgment

- eval: E8
  judged_by: hội đồng ba góc nhìn (fresh context), đề xuất PASS, chỉ mang tính tham khảo (hợp đồng T3 đòi người chốt trực tiếp)
  rationale: Cả ba góc nhìn thấy cùng một chuỗi. Ở bản thật, readAuthConfig dựng bộ gửi Resend có địa chỉ cấu hình. runtime.ts nối nó vào deps.invite. inviteMember chỉ gửi qua deps.invite. Hàm dựng thân thư dùng địa chỉ cấu hình khi có.
  votes:
    - domain-correctness: PASS — (a) Có. Ở production, readAuthConfig (config.ts) dựng inviteSender bằng resendInviteSender({apiKey, from, appUrl}); liveDeps (runtime.ts) chỉ chép config.inviteSender vào trường invite, không tự dựng bộ gửi khác. (b) Có. inviteMember (members.ts) chỉ gửi qua deps.invite(...). (c) Không có đường nào ở production: readAuthConfig đã kiểm APP_URL bằng parseAppUrl(..., true) (trả chuỗi không rỗng), resendInviteSender truyền nó vào inviteEmail, và `appUrl ?? mail.origin` không rơi về origin khi appUrl đã có giá trị. Chỉ nhánh dev không có APP_URL (devInviteSender) và captureInviteSender của test mới dùng mail.origin.
    - operational-feasibility: PASS — (a) Có: liveDeps trong runtime.ts đặt invite: config.inviteSender lấy từ readAuthConfig(process.env), không tự dựng bộ gửi khác; ở production bộ đó là resendInviteSender với appUrl đã qua parseAppUrl và assertProductionConfig. (b) Có: inviteMember trong members.ts chỉ gửi qua deps.invite({... origin}), kiểu InviteSender. (c) Không, ở production: inviteEmail dùng (appUrl ?? mail.origin) và bộ gửi production luôn truyền appUrl nên origin không bao giờ được đọc; chỉ devInviteSender không có APP_URL và captureInviteSender (dùng trong test) mới rơi về origin, và cả hai chỉ được dựng ngoài nhánh production.
    - spec-alignment: PASS — (a) Trong bản thật, readAuthConfig (config.ts) dựng inviteSender bằng resendInviteSender có appUrl, và liveDeps (runtime.ts) chuyển đúng config.inviteSender vào deps.invite, không dựng bộ gửi khác. (b) inviteMember (members.ts) chỉ gửi thư qua deps.invite. (c) Trong production, resendInviteSender luôn truyền appUrl khác rỗng nên `appUrl ?? mail.origin` trong inviteEmail không bao giờ lấy origin. Chỉ devInviteSender không có APP_URL và captureInviteSender (test) mới dùng origin, và cả hai không dựng được khi NODE_ENV=production.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-thu-moi-dia-chi-tu-cau-hinh-SUITE-make_check-r1
  exit_code: 2
  verified_at: 2026-11-12T02:13:32Z
  note: lệnh đỏ, không gắn eval nào; cùng một nguyên nhân với E1-E7 (ca language.test.ts báo «Sàn» trong src/modules/identity/config.test.ts). 1 test đỏ, 1044 test xanh.

- cmd: npm run build
  run_id: minted-thu-moi-dia-chi-tu-cau-hinh-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-12T02:13:32Z

- cmd: make e2e
  run_id: minted-thu-moi-dia-chi-tu-cau-hinh-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-12T02:13:32Z
  note: 512 ca xanh.

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1, E2, E3, E4, E5, E6, E7 failed — bộ test đơn vị đỏ vì tests/language.test.ts bắt từ «Sàn» cứng trong src/modules/identity/config.test.ts (một test đỏ, 1044 test xanh). Returned to implementation.
