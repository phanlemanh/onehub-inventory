## Trong hợp đồng

- **E2's 'PASS but not signed' reason can never match what kit 3.0 prints for this T3 record, so E2 turns red as soon as the report says PASS**
  AC: AC-2
  file: `_acceptance/nang-kit-3-0/rang/matrix.mjs:50`
  severity: high
  source: bugs
  detail: The third LIFECYCLE_REASONS entry (/hạng T3 chưa có chữ ký người — code t3_paths phải có người ký/) is meant to cover 'đạt, chưa ký' (contract AC-2, evals E2). In kit 3.0's pre-merge-check.sh (nk30-kit-v3.0.0/plugins/acceptance-gate/scripts/pre-merge-check.sh) that text is written in only one place, at line 847: `ly="hạng $t chưa có chữ ký người ..."` inside t3_co_ho_so_arm. That place has two limits. (1) It runs only when the tier is not T3 (`[ "$(... tr ...)" != "T3" ]`, line 844). This record's contract says `risk_tier: T3`, so the string 'hạng T3 chưa có chữ ký' is never produced for it. (2) Even for other tiers, the text is appended to T3_HO_SO_LY_DO as an indented line `    <slug>: <ly>` under a `VIOLATION [PR]: ...` line (lines 1949-1953). It never appears as `VIOLATION [nang-kit-3-0]: ...`, which is the prefix judge() in gate-branch.mjs requires. What kit 3.0 actually prints for a T3 record with verdict PASS and no signature is `VIOLATION [nang-kit-3-0]: verdict PASS but human_signoff is empty (Gate 2 pending)` (line 1454). That line matches none of the three patterns: regex 2 needs `verdict=` and REJECT|BLOCKED|PENDING-JUDGMENT. So after this round's report becomes PASS and before the signature, gate-branch.mjs returns 'gate-branch: VIOLATION outside the lifecycle reasons of nang-kit-3-0'. This is the same class of failure that caused the round-2 REJECT (a real lifecycle line was not accepted). The new verbatim test in two-way.mjs passes only because it checks that the `ly=` source string exists somewhere in the script. It does not check that the line can be printed with the record's prefix for a T3 record. The contract text in AC-2 and the E2 expected text describe a lifecycle reason that kit 3.0 never prints for this record.

- **The 'red' half of the new verbatim-source test can never fail**
  AC: AC-10
  file: `_acceptance/nang-kit-3-0/rang/two-way.mjs:192`
  severity: low
  source: bugs
  detail: The new test 'E2 gate-branch: every lifecycle reason is written, verbatim, by kit 3.0's gate' ends with `assert.equal(gate.includes('echo "VIOLATION [$slug]: verdict=$verdict (must be PASS to merge)x"'), false)`. The string is made up, with an `x` appended, so this assertion is always true. It never runs a broken LIFECYCLE_REASONS or a broken copy of the gate through the check. It counts toward E9's 'pass 14' as a two-way test without showing the check can go red. It also does not tie each `re` to its `source`, which is how the T3 entry above can be both present verbatim and impossible to print with the record's prefix.

- **Shape 3: the test asserts the strings are present, but the promise is a relation between each LIFECYCLE_REASONS `re` that judge uses and the kit line it should match**
  AC: AC-10
  file: `_acceptance/nang-kit-3-0/rang/two-way.mjs:190`
  severity: high
  source: measurement
  detail: The new test 'E2 gate-branch: every lifecycle reason is written, verbatim, by kit 3.0's gate' (two-way.mjs:190-191) checks only `gate.includes(source)` for each entry. judge() in gate-branch.mjs:15 never reads `source`. It accepts a VIOLATION line only through `re.test(l.slice(prefix.length))`. The two fields are copied by hand side by side in matrix.mjs:41-53, for example `re: /^verdict=(REJECT|BLOCKED|PENDING-JUDGMENT) \(must be PASS to merge\)$/` next to `source: 'echo "VIOLATION [$slug]: verdict=$verdict (must be PASS to merge)"'`. No assertion fills `$status`, `$verdict` or `$t` into `source` and checks that `re` matches the result, or that `re` rejects anything else. The test stays green if `re` is widened to `/.*/` or drifts from the kit's text, as long as the `source` string is still in pre-merge-check.sh. So the claim in E2 and E10 of evals.yaml that the three reasons judge accepts are 'nguyên văn trong pre-merge-check.sh của kit 3.0' is checked on a side note, not on the matcher the measure actually runs.

- **Shape 4: the red side of the lifecycle test is a negative-only assertion on a made-up string, and the pinned message is never shown to fire**
  AC: AC-10
  file: `_acceptance/nang-kit-3-0/rang/two-way.mjs:192`
  severity: medium
  source: measurement
  detail: The red half of the new test is `assert.equal(gate.includes('echo "VIOLATION [$slug]: verdict=$verdict (must be PASS to merge)x"'), false)`. That string was made up by adding 'x' to the end and is trivially absent from any file. The line does not run the check loop (lines 190-191) on a copy of pre-merge-check.sh with one reason line removed. It does not show the loop going red, and it does not pin the message. E2 in evals.yaml declares the red as 'gate-branch: lifecycle reason not written by kit 3.0', and E10 promises each red is 'đỏ trên bản phá với đúng thông điệp ghim'. Every other test in the file goes through redWith(r, prefix) on a broken copy. This one has only a negative assertion with no message, so nothing shows that the guard catches a reason that is missing from the gate.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Check 2 — Criteria and tests: AC-2 bị nới thêm lần nữa sau Cổng Phạm vi mà không có người duyệt lại**
  Người dùng thấy gì: Điều kiện nghiệm thu đã được nới hai lần sau khi chủ kho duyệt mà chưa được xác nhận lại. Người ký có thể ký trên một bộ tiêu chí khác bộ họ đã đọc.
  Căn cứ: Không làm mất dữ liệu hay hỏng gì cho người dùng, chỉ là người ký cần biết tiêu chí nào đã đổi; ghi rõ vào thẻ rồi xác nhận lại là xong, rất rẻ.
  file: `_acceptance/nang-kit-3-0/contract.md`
  severity: medium
  Đề xuất: known-limits

- **Check 2 — Criteria and tests: mẫu lý do T3 trong LIFECYCLE_REASONS không neo hai đầu, lỏng hơn hai mẫu còn lại**
  Người dùng thấy gì: Cổng gộp có thể cho qua một dòng cảnh báo lạ chỉ vì nó chứa một câu quen thuộc. Người dùng cuối không bị ảnh hưởng, chỉ là việc kiểm tra bớt chặt.
  Căn cứ: Hậu quả nhẹ, chỉ làm bước kiểm tra nội bộ lỏng hơn một chút, không mất dữ liệu và sửa lại sau không tốn kém.
  file: `_acceptance/nang-kit-3-0/rang/matrix.mjs`
  severity: low
  Đề xuất: known-limits

- **Check 4 — Secrets: gitleaks báo generic-api-key trên băm SHA-256 của tệp s4-args, không allowlist nào che**
  Người dùng thấy gì: Công cụ quét bí mật báo nhầm vài chuỗi băm là khoá. Không có rò rỉ thật, nhưng tiếng ồn có thể che một báo động thật sau này.
  Căn cứ: Không lộ dữ liệu nào và lỗi đã có sẵn từ các hồ sơ trước; chỉ gây nhiễu, thêm danh sách cho qua sau này là rẻ.
  file: `_acceptance/nang-kit-3-0/s4-args.json`
  severity: low
  Đề xuất: known-limits

- **Check 5 — Personal data: hồ sơ trong kho công khai lộ đường tuyệt đối của máy chủ kho**
  Người dùng thấy gì: Hồ sơ trong kho công khai để lộ tên tài khoản máy và cách sắp xếp thư mục của chủ kho. Không lộ mật khẩu hay dữ liệu khách hàng.
  Căn cứ: Mức lộ thấp, chỉ tên máy và thư mục, không gây mất dữ liệu; đã tồn tại ở nhiều hồ sơ trước nên ghi lại và sửa dần là hợp lý.
  file: `_acceptance/nang-kit-3-0/s4-args-r2.json`
  severity: low
  Đề xuất: known-limits

- **Check 8 — CI and agent privileges: kit ghim bằng thẻ đổi được, SHA chỉ kiểm trong phép đo, CI không kiểm**
  Người dùng thấy gì: Nếu ai đó dời thẻ phiên bản của bộ kiểm, cổng gộp có thể đổi hành vi mà CI không báo. Rủi ro chỉ xảy ra khi kho kit bị can thiệp.
  Căn cứ: Hậu quả nặng nhưng xác suất thấp và quyền không rộng thêm so với trước; sửa sau rẻ, một dòng kiểm, nên ghi là hạn chế đã biết.
  file: `.github/workflows/ci.yml`
  severity: low
  Đề xuất: known-limits

- **Check 9 — Design: phép đo để lại thư mục tạm, và tin bản kit tạm cũ chỉ bằng HEAD**
  Người dùng thấy gì: Việc chấm để lại thư mục tạm trên máy người chạy. Một bản kit tạm bị sửa tay có thể vẫn được dùng để chấm.
  Căn cứ: Chỉ tốn chút dung lượng trên máy chấm và gần như không xảy ra sai lệch thật; không ảnh hưởng người dùng, không đáng mở việc riêng.
  file: `_acceptance/nang-kit-3-0/rang/ci-kit.mjs`
  severity: low
  Đề xuất: wont-fix

- **Check 2 — Criteria and tests: phép đo settings cho xanh khi cả KIT_TAG lẫn ref cùng vắng**
  Người dùng thấy gì: Phép kiểm cấu hình có thể báo đạt khi cả hai thông tin phiên bản đều biến mất. Hiện tại cả hai vẫn có mặt nên không ảnh hưởng ai.
  Căn cứ: Chỉ xảy ra nếu ai đó xoá cả hai khai báo, và khi đó các phép đo khác cũng đỏ; không mất dữ liệu, sửa rẻ.
  file: `_acceptance/nang-kit-3-0/rang/settings.mjs`
  severity: low
  Đề xuất: known-limits

- **Check 1 — Intent: phép quét tên cũ phân biệt hoa thường, sót các dòng «Acceptance Gate Kit» ở tài liệu sống**
  Người dùng thấy gì: Vài tài liệu hướng dẫn vẫn nhắc tên bộ kiểm cũ, nên người đọc có thể bị dẫn tới công cụ cũ. Không ảnh hưởng chức năng chạy.
  Căn cứ: Chỉ gây nhầm lẫn khi đọc tài liệu, người dùng tự nhận ra và tra lại được; sửa chữ rẻ, một tệp do chủ kho giữ.
  file: `_acceptance/nang-kit-3-0/rang/matrix.mjs`
  severity: low
  Đề xuất: known-limits

- **Secrets (check 4): gitleaks reports 2 generic-api-key hits that no allowlist covers (r2)**
  Người dùng thấy gì: A scan of the history shows two false alarms that look like leaked keys but are not. Nothing is exposed, but a real leak could be overlooked among them.
  Căn cứ: Low consequence: no data is lost or exposed, and the alarms can be silenced later at low cost without affecting users.
  file: `_acceptance/nang-kit-3-0/s4-args.json`
  severity: low
  Đề xuất: known-limits

- **CI and agent privileges (check 8): the kit is pinned by a mutable tag, and the commit SHA is checked only in the measure, not in CI or the session (r2)**
  Người dùng thấy gì: If the kit's version label were moved to different content, the merge check could silently run a different version. Permissions are not widened and this is the same as before.
  Căn cứ: Low consequence and unlikely: no user data is at risk, the pattern is unchanged from the previous kit, and it can be hardened later at low cost.
  file: `.github/workflows/ci.yml`
  severity: low
  Đề xuất: known-limits

- **Records (check 11): the S4 args file of the record has local absolute paths and kit 2.38.1 paths (r2)**
  Người dùng thấy gì: A record in the public repo reveals the owner's computer username and folder layout, and round 1 was graded with older templates than the ones being adopted.
  Căn cứ: Low consequence: no customer data is involved, nothing is lost, and the note or paths can be corrected in the next round at low cost.
  file: `_acceptance/nang-kit-3-0/s4-args.json`
  severity: low
  Đề xuất: known-limits

- **Round 1 verdict is REJECT only because of a make e2e failure that was already red at baseline and that the owner accepted at Gate 1 (r2 · tệp đã đổi)**
  Người dùng thấy gì: The change was sent back for rework only because a browser test suite that was already broken on this machine failed again, so the rework has nothing real to fix and could loop.
  Căn cứ: No user impact and nothing is lost; the owner can settle it at the gate by recording the accepted waiver, which is cheap.
  file: `_acceptance/nang-kit-3-0/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **Gate 2 card says an eval failed and that the machine is fixing code, while no eval failed (r2)**
  Người dùng thấy gì: The decision card tells the owner a check failed and that nothing is needed from them, while in fact all checks passed and a decision about the broken browser suite is what is needed.
  Căn cứ: Medium-low consequence: it misleads only the reviewer, not end users, and it is easily fixed by regenerating the card.
  file: `_acceptance/nang-kit-3-0/card.html`
  severity: medium
  Đề xuất: known-limits

- **Every eval and suite run is stamped at the invocation time, which is before the runs started (r2 · tệp đã đổi)**
  Người dùng thấy gì: The records show every check as done at the moment grading was launched, so they do not show when each result was actually seen.
  Căn cứ: Very low consequence: only the audit trail's timing is imprecise, results are unaffected, and fixing it costs more than it is worth.
  file: `_acceptance/nang-kit-3-0/run-log.jsonl`
  severity: low
  Đề xuất: wont-fix

- **E5 and E11 are marked PASS without the test runner's result in the evidence (r2 · tệp đã đổi)**
  Người dùng thấy gì: Two checks are marked as passed based only on the command finishing, so the record cannot prove the tests actually ran rather than being skipped.
  Căn cứ: Low consequence: no evidence that anything is broken, users are unaffected, and rerunning with fuller output is cheap.
  file: `_acceptance/nang-kit-3-0/evidence-report.md`
  severity: low
  Đề xuất: known-limits

- **Criteria and tests: AC-2 and AC-8 loosened after Gate 1 with no new owner approval recorded (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hai tiêu chí được nới sau khi chủ kho đã duyệt, và tấm thẻ chủ kho xem vẫn ghi con số cũ. Sản phẩm chạy không đổi, chỉ là chủ kho chưa xác nhận bản nới.
  Căn cứ: Không ảnh hưởng người dùng cuối và không mất dữ liệu; chỉ cần chủ kho xác nhận lại ở cổng bằng chứng, tốn rất ít công.
  file: `_acceptance/nang-kit-3-0/contract.md`
  severity: medium
  Đề xuất: known-limits

- **Records: the record still states the old sweep count (15 lines / 6 files) in places (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phần ghi chú đầu hồ sơ còn con số quét cũ, người đọc có thể thấy hai con số khác nhau. Việc chạy thật không bị ảnh hưởng.
  Căn cứ: Chỉ gây nhầm lẫn khi đọc tài liệu, không mất dữ liệu, người đọc tự đối chiếu được; sửa rẻ nhưng không cần chặn việc giao.
  file: `_acceptance/nang-kit-3-0/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **CI and agent privileges: the CI gate fetches the kit from a new repo by a movable tag and does not check the commit (r1)**
  Người dùng thấy gì: Nếu thẻ phiên bản của kit bị dời, máy chủ kiểm tra và máy cá nhân có thể âm thầm chạy hai bản khác nhau. Hiện tại chưa xảy ra.
  Căn cứ: Rủi ro chỉ xuất hiện khi chủ kho dời thẻ, chưa mất dữ liệu và bắt được khi so lại; cách làm này vốn có từ trước đợt nâng.
  file: `.github/workflows/ci.yml`
  severity: low
  Đề xuất: known-limits

- **settings measure passes the ref-pin check when both the CI tag and the settings ref are missing (r1)**
  Người dùng thấy gì: Phép kiểm tra cấu hình có thể báo xanh nhầm nếu cả thẻ trong CI lẫn phiên bản ghim trong cấu hình cùng bị xoá. Cấu hình thật hiện đúng.
  Căn cứ: Chỉ xảy ra khi hai chỗ cùng hỏng, cấu hình hiện tại đúng nên không ảnh hưởng ai; sửa rẻ nhưng chưa có hậu quả thật.
  file: `_acceptance/nang-kit-3-0/rang/settings.mjs`
  severity: low
  Đề xuất: known-limits

- **The pre-written matrix in evals.yaml and the leftover.mjs header pin 15 lines in 6 files, while the measure and E9 pin 14 in 5 (r1 · tệp đã đổi)**
  Người dùng thấy gì: Ghi chú trong hồ sơ nói 15 dòng ở 6 tệp trong khi phép đo thật dùng 14 dòng ở 5 tệp, người chấm có thể bị nhầm.
  Căn cứ: Chỉ là chú thích lệch số, không ảnh hưởng người dùng hay dữ liệu, tự đối chiếu được và sửa rất rẻ.
  file: `_acceptance/nang-kit-3-0/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Hinh dang 5 — tuyen quet LOP (moi lenh tai lieu song nhac) nhung chi do 3 tep chon tay; mot lenh da mat trong kit 3.0 lot qua (r1)**
  Người dùng thấy gì: Một tài liệu lộ trình vẫn nhắc một lệnh đã bị đổi tên trong kit mới, nên ai làm theo sẽ gõ lệnh không còn tồn tại. Phép kiểm tra báo xanh dù còn sót.
  Căn cứ: Hậu quả vừa phải: người làm theo tài liệu gặp lệnh không chạy nhưng không mất dữ liệu và tự đổi tên được; cần mở rộng phạm vi quét nên nên làm thành việc riêng.
  file: `_acceptance/nang-kit-3-0/rang/doc-commands.mjs`
  severity: high
  Đề xuất: new-contract

- **Hinh dang 2 — fixture so cai viet tay dung khuon ben doc; khoa plugin khong rut tu ben viet (marketplace.json cua kit) (r1)**
  Người dùng thấy gì: Dữ liệu thử cho việc tìm bản cài kit được viết tay giống hệt code đọc, nên nếu kit đổi tên chợ thì bài kiểm tra vẫn xanh trong khi máy thật không tìm thấy kit.
  Căn cứ: Hiện tên chợ đúng nên chưa có lỗi, và nếu xảy ra thì chỉ là không tìm thấy kit, sửa lại được; chỉ rủi ro khi kit đổi tên về sau.
  file: `_acceptance/nang-kit-3-0/rang/kit-root-cli.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
