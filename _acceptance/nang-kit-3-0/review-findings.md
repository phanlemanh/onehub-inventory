# Review findings: nang-kit-3-0 (round 2)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Secrets (check 4): gitleaks reports 2 generic-api-key hits that no allowlist covers**
  Người dùng thấy gì: A scan of the history shows two false alarms that look like leaked keys but are not. Nothing is exposed, but a real leak could be overlooked among them.
  Căn cứ: Low consequence: no data is lost or exposed, and the alarms can be silenced later at low cost without affecting users.
  file: `_acceptance/nang-kit-3-0/s4-args.json`
  severity: low
  Đề xuất: known-limits

- **CI and agent privileges (check 8): the kit is pinned by a mutable tag, and the commit SHA is checked only in the measure, not in CI or the session**
  Người dùng thấy gì: If the kit's version label were moved to different content, the merge check could silently run a different version. Permissions are not widened and this is the same as before.
  Căn cứ: Low consequence and unlikely: no user data is at risk, the pattern is unchanged from the previous kit, and it can be hardened later at low cost.
  file: `.github/workflows/ci.yml`
  severity: low
  Đề xuất: known-limits

- **Records (check 11): the S4 args file of the record has local absolute paths and kit 2.38.1 paths**
  Người dùng thấy gì: A record in the public repo reveals the owner's computer username and folder layout, and round 1 was graded with older templates than the ones being adopted.
  Căn cứ: Low consequence: no customer data is involved, nothing is lost, and the note or paths can be corrected in the next round at low cost.
  file: `_acceptance/nang-kit-3-0/s4-args.json`
  severity: low
  Đề xuất: known-limits

- **Round 1 verdict is REJECT only because of a make e2e failure that was already red at baseline and that the owner accepted at Gate 1**
  Người dùng thấy gì: The change was sent back for rework only because a browser test suite that was already broken on this machine failed again, so the rework has nothing real to fix and could loop.
  Căn cứ: No user impact and nothing is lost; the owner can settle it at the gate by recording the accepted waiver, which is cheap.
  file: `_acceptance/nang-kit-3-0/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **Gate 2 card says an eval failed and that the machine is fixing code, while no eval failed**
  Người dùng thấy gì: The decision card tells the owner a check failed and that nothing is needed from them, while in fact all checks passed and a decision about the broken browser suite is what is needed.
  Căn cứ: Medium-low consequence: it misleads only the reviewer, not end users, and it is easily fixed by regenerating the card.
  file: `_acceptance/nang-kit-3-0/card.html`
  severity: medium
  Đề xuất: known-limits

- **Every eval and suite run is stamped at the invocation time, which is before the runs started**
  Người dùng thấy gì: The records show every check as done at the moment grading was launched, so they do not show when each result was actually seen.
  Căn cứ: Very low consequence: only the audit trail's timing is imprecise, results are unaffected, and fixing it costs more than it is worth.
  file: `_acceptance/nang-kit-3-0/run-log.jsonl`
  severity: low
  Đề xuất: wont-fix

- **E5 and E11 are marked PASS without the test runner's result in the evidence**
  Người dùng thấy gì: Two checks are marked as passed based only on the command finishing, so the record cannot prove the tests actually ran rather than being skipped.
  Căn cứ: Low consequence: no evidence that anything is broken, users are unaffected, and rerunning with fuller output is cheap.
  file: `_acceptance/nang-kit-3-0/evidence-report.md`
  severity: low
  Đề xuất: known-limits

- **Criteria and tests: AC-2 and AC-8 loosened after Gate 1 with no new owner approval recorded (r1)**
  Người dùng thấy gì: Hai tiêu chí được nới sau khi chủ kho đã duyệt, và tấm thẻ chủ kho xem vẫn ghi con số cũ. Sản phẩm chạy không đổi, chỉ là chủ kho chưa xác nhận bản nới.
  Căn cứ: Không ảnh hưởng người dùng cuối và không mất dữ liệu; chỉ cần chủ kho xác nhận lại ở cổng bằng chứng, tốn rất ít công.
  file: `_acceptance/nang-kit-3-0/contract.md`
  severity: medium
  Đề xuất: known-limits

- **Records: the record still states the old sweep count (15 lines / 6 files) in places (r1)**
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

- **The pre-written matrix in evals.yaml and the leftover.mjs header pin 15 lines in 6 files, while the measure and E9 pin 14 in 5 (r1)**
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
