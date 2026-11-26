# Review findings: nang-kit-3-0 (round 5)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Intent / AC-7-AC-8: một lệnh kit cũ đã đổi tên vẫn còn trong tệp kế hoạch đang dùng**
  Người dùng thấy gì: Tệp kế hoạch vẫn bảo người đọc gõ một lệnh nghiệm thu đã bị đổi tên, nên ai làm theo sẽ gặp lệnh không tồn tại. Không mất dữ liệu, chỉ gây khó chịu và mất thời gian tìm lại tên đúng.
  Căn cứ: Hậu quả nhẹ vì người dùng chỉ gặp lệnh báo lỗi rồi gõ lại được tên mới, không mất gì; sửa rẻ nhưng nằm ngoài những gì lần nâng kit này cam kết, nên để thành một việc nhỏ riêng.
  file: `docs/plan/lo-trinh.json`
  severity: medium
  Đề xuất: new-contract

- **Records: số đếm của lưới quét tên cũ ghi lỗi thời ở evals.yaml và leftover.mjs**
  Người dùng thấy gì: Hai ghi chú trong hồ sơ nghiệm thu còn ghi con số cũ về số chỗ sót tên cũ. Người dùng sản phẩm không gặp gì, chỉ người đọc hồ sơ có thể hơi bối rối.
  Căn cứ: Chỉ là chú thích trong giấy tờ nội bộ, không ảnh hưởng người dùng hay việc chạy kiểm tra, nên chấp nhận và ghi vết.
  file: `_acceptance/nang-kit-3-0/evals.yaml`
  severity: low
  Đề xuất: wont-fix

- **Secrets: gitleaks báo 8 generic-api-key trên các tệp s4-args*.json mới**
  Người dùng thấy gì: Công cụ dò bí mật sẽ báo thêm vài cảnh báo giả ở các tệp ghi mã băm, làm nhiễu kết quả quét. Không có khoá thật bị lộ.
  Căn cứ: Không lộ dữ liệu thật, chỉ thêm tiếng ồn khi quét; ghi lại như một hạn chế đã biết là đủ, và việc miễn trừ thuộc về người giữ cấu hình bảo mật.
  file: `_acceptance/nang-kit-3-0/s4-args-r4.json`
  severity: low
  Đề xuất: known-limits

- **Criteria and tests: bài hai chiều E2(b) ghim đầu ra của hồ sơ chưa ký nên sẽ đỏ sau khi ký**
  Người dùng thấy gì: Một bài kiểm của hồ sơ chỉ đúng trước khi chủ kho ký, sau đó chạy lại sẽ báo đỏ dù sản phẩm không sai. Người dùng không bị ảnh hưởng, chỉ gây báo động giả cho người chạy lại.
  Căn cứ: Hậu quả chỉ là báo đỏ giả khi chạy lại sau khi ký, tự nhận ra được và không mất dữ liệu; ghi rõ giới hạn này để người chạy lại biết.
  file: `_acceptance/nang-kit-3-0/rang/two-way.mjs`
  severity: low
  Đề xuất: known-limits

- **CI and agent privileges: CI kéo kit từ kho mới theo thẻ có thể dời, không kiểm commit đã ghim**
  Người dùng thấy gì: Nếu ai đó dời thẻ phiên bản của kit sang bản khác, kiểm tra tự động của mọi PR sẽ âm thầm chạy bản kit khác mà không ai được báo. Quyền truy cập không đổi, nhưng nguồn tin cậy chỉ được giữ bằng tên thẻ.
  Căn cứ: Rủi ro chỉ xảy ra khi kho kit bị dời thẻ, hiếm và có thể phát hiện, không làm mất dữ liệu; kiểu kéo theo thẻ đã có từ trước nên ghi lại như hạn chế đã biết.
  file: `.github/workflows/ci.yml`
  severity: low
  Đề xuất: known-limits

- **Criteria and tests: ca «có cả hai khoá» của AC-5 chưa có trong bộ kiểm đơn vị**
  Người dùng thấy gì: Nếu sau này ai đó sửa nhầm cách chọn bản cài khi sổ có cả bản cũ lẫn mới, bộ kiểm tự động chính sẽ không báo đỏ. Hiện tại hành vi vẫn đúng.
  Căn cứ: Hiện không có lỗi cho người dùng, chỉ thiếu một lớp bảo vệ trước thay đổi tương lai và ca này đã được đo ở chỗ khác; bổ sung sau rất rẻ.
  file: `tests/kit-root.test.ts`
  severity: low
  Đề xuất: known-limits

- **Cleanup hook no longer sees temp worktrees from gateControl.recheck in this run (E3)**
  Người dùng thấy gì: Khâu dọn dẹp của bài kiểm có thể bỏ sót một thư mục tạm còn sót lại từ một bước kiểm, và lời ghi trong sổ quyết định nói rộng hơn thực tế. Người dùng sản phẩm không bị ảnh hưởng, chỉ có thể thừa vài thư mục tạm trên máy người chạy kiểm.
  Căn cứ: Hậu quả chỉ là có thể sót thư mục tạm trên máy người chạy kiểm, xoá tay được và không chạm dữ liệu thật; ghi lại để người chạy biết giới hạn của khâu dọn.
  file: `_acceptance/nang-kit-3-0/rang/two-way.mjs`
  severity: medium
  Đề xuất: known-limits

- **The new `mine.size > 0` assertion fails any filtered run that makes no worktree**
  Người dùng thấy gì: Khi chạy riêng một vài bài kiểm, khâu dọn dẹp có thể báo đỏ giả dù các bài đều đạt. Chỉ ảnh hưởng người đang gỡ lỗi, không ảnh hưởng người dùng.
  Căn cứ: Báo đỏ giả chỉ gặp khi chạy lọc thủ công, tự hiểu ra ngay và chạy lại đầy đủ là hết, nên chi phí sửa không đáng; chấp nhận và ghi vết.
  file: `_acceptance/nang-kit-3-0/rang/two-way.mjs`
  severity: low
  Đề xuất: wont-fix

- **Assertion âm-tính-một-mình (hình dạng 4): hook dọn worktree không có đối chứng dương rằng bộ so khớp bắt được một worktree còn sống**
  Người dùng thấy gì: Khâu dọn dẹp của bài kiểm hiện chạy đúng, nhưng nếu máy hay phiên bản công cụ khác đi thì nó có thể im lặng không bắt được thư mục tạm sót lại. Người dùng sản phẩm không gặp gì.
  Căn cứ: Hiện đã kiểm trên máy này và đúng, nếu hỏng cũng chỉ là sót thư mục tạm không ảnh hưởng người dùng; chi phí thêm đối chứng vượt hậu quả nên chấp nhận và ghi vết.
  file: `_acceptance/nang-kit-3-0/rang/two-way.mjs`
  severity: low
  Đề xuất: wont-fix

- **Check 1 Intent / Check 2 Criteria: a renamed kit command is left in a living doc and neither sweep catches it (r4)**
  Người dùng thấy gì: A note in the roadmap still tells the owner to use a command that the new kit no longer has. Someone following it would get an unknown-command error and have to find the new name.
  Căn cứ: Impact is light: it is one note in a document, nothing is lost, and the owner sees the error at once and can look up the new name.
  file: `docs/plan/lo-trinh.json`
  severity: medium
  Đề xuất: known-limits

- **Check 8 CI and agent privileges: the kit is fetched from a new repo by a movable tag and the commit is not checked (r4)**
  Người dùng thấy gì: If the kit's version tag were ever moved, the automatic merge check could silently run different code than the one that was approved. Nothing breaks visibly in that case.
  Căn cứ: Impact is low and needs someone to tamper with a tag in a repo the owner controls; it is not a loss of data, and the same pattern was already accepted before.
  file: `.github/workflows/ci.yml`
  severity: low
  Đề xuất: known-limits

- **Check 11 Records: the old sweep count (15 lines / 6 files) is still in the record (r4)**
  Người dùng thấy gì: The acceptance record quotes an out-of-date number of leftover old-name lines in two places. It can confuse a reader but does not change any result.
  Căn cứ: Impact is cosmetic: only a reader of the record is misled, nothing is lost, and the fix is a two-number edit at any time.
  file: `_acceptance/nang-kit-3-0/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Check 9 Design: the ci-kit measure leaves temp folders behind, and fetchKit trusts a shared temp kit by HEAD alone (r4)**
  Người dùng thấy gì: Running the checks leaves small leftover folders on the machine. In a rare case a hand-modified cached kit copy could be trusted when it should not be.
  Căn cứ: Impact is light and local to the checker's machine: no user data is exposed, and the leftover folders can be deleted by hand at any time.
  file: `_acceptance/nang-kit-3-0/rang/ci-kit.mjs`
  severity: low
  Đề xuất: known-limits

- **Check 5 Personal data / Records: committed S4 args files carry absolute paths from the owner's machine in a public repo (r4)**
  Người dùng thấy gì: Some saved grading files in the public repo show the owner's computer username and folder layout. This is not a password or customer data.
  Căn cứ: Impact is low: it exposes only a local username and folder names, the same exposure already exists in older records, and removing it from history would cost far more than it protects.
  file: `_acceptance/nang-kit-3-0/s4-args-r2.json`
  severity: low
  Đề xuất: wont-fix

- **Check 2 — Criteria and tests: AC-2 bị nới thêm lần nữa sau Cổng Phạm vi mà không có người duyệt lại (r3)**
  Người dùng thấy gì: Điều kiện nghiệm thu đã được nới hai lần sau khi chủ kho duyệt mà chưa được xác nhận lại. Người ký có thể ký trên một bộ tiêu chí khác bộ họ đã đọc.
  Căn cứ: Không làm mất dữ liệu hay hỏng gì cho người dùng, chỉ là người ký cần biết tiêu chí nào đã đổi; ghi rõ vào thẻ rồi xác nhận lại là xong, rất rẻ.
  file: `_acceptance/nang-kit-3-0/contract.md`
  severity: medium
  Đề xuất: known-limits

- **Check 2 — Criteria and tests: mẫu lý do T3 trong LIFECYCLE_REASONS không neo hai đầu, lỏng hơn hai mẫu còn lại (r3)**
  Người dùng thấy gì: Cổng gộp có thể cho qua một dòng cảnh báo lạ chỉ vì nó chứa một câu quen thuộc. Người dùng cuối không bị ảnh hưởng, chỉ là việc kiểm tra bớt chặt.
  Căn cứ: Hậu quả nhẹ, chỉ làm bước kiểm tra nội bộ lỏng hơn một chút, không mất dữ liệu và sửa lại sau không tốn kém.
  file: `_acceptance/nang-kit-3-0/rang/matrix.mjs`
  severity: low
  Đề xuất: known-limits

- **Check 4 — Secrets: gitleaks báo generic-api-key trên băm SHA-256 của tệp s4-args, không allowlist nào che (r3)**
  Người dùng thấy gì: Công cụ quét bí mật báo nhầm vài chuỗi băm là khoá. Không có rò rỉ thật, nhưng tiếng ồn có thể che một báo động thật sau này.
  Căn cứ: Không lộ dữ liệu nào và lỗi đã có sẵn từ các hồ sơ trước; chỉ gây nhiễu, thêm danh sách cho qua sau này là rẻ.
  file: `_acceptance/nang-kit-3-0/s4-args.json`
  severity: low
  Đề xuất: known-limits

- **Check 5 — Personal data: hồ sơ trong kho công khai lộ đường tuyệt đối của máy chủ kho (r3)**
  Người dùng thấy gì: Hồ sơ trong kho công khai để lộ tên tài khoản máy và cách sắp xếp thư mục của chủ kho. Không lộ mật khẩu hay dữ liệu khách hàng.
  Căn cứ: Mức lộ thấp, chỉ tên máy và thư mục, không gây mất dữ liệu; đã tồn tại ở nhiều hồ sơ trước nên ghi lại và sửa dần là hợp lý.
  file: `_acceptance/nang-kit-3-0/s4-args-r2.json`
  severity: low
  Đề xuất: known-limits

- **Check 8 — CI and agent privileges: kit ghim bằng thẻ đổi được, SHA chỉ kiểm trong phép đo, CI không kiểm (r3)**
  Người dùng thấy gì: Nếu ai đó dời thẻ phiên bản của bộ kiểm, cổng gộp có thể đổi hành vi mà CI không báo. Rủi ro chỉ xảy ra khi kho kit bị can thiệp.
  Căn cứ: Hậu quả nặng nhưng xác suất thấp và quyền không rộng thêm so với trước; sửa sau rẻ, một dòng kiểm, nên ghi là hạn chế đã biết.
  file: `.github/workflows/ci.yml`
  severity: low
  Đề xuất: known-limits

- **Check 9 — Design: phép đo để lại thư mục tạm, và tin bản kit tạm cũ chỉ bằng HEAD (r3)**
  Người dùng thấy gì: Việc chấm để lại thư mục tạm trên máy người chạy. Một bản kit tạm bị sửa tay có thể vẫn được dùng để chấm.
  Căn cứ: Chỉ tốn chút dung lượng trên máy chấm và gần như không xảy ra sai lệch thật; không ảnh hưởng người dùng, không đáng mở việc riêng.
  file: `_acceptance/nang-kit-3-0/rang/ci-kit.mjs`
  severity: low
  Đề xuất: wont-fix

- **Check 2 — Criteria and tests: phép đo settings cho xanh khi cả KIT_TAG lẫn ref cùng vắng (r3)**
  Người dùng thấy gì: Phép kiểm cấu hình có thể báo đạt khi cả hai thông tin phiên bản đều biến mất. Hiện tại cả hai vẫn có mặt nên không ảnh hưởng ai.
  Căn cứ: Chỉ xảy ra nếu ai đó xoá cả hai khai báo, và khi đó các phép đo khác cũng đỏ; không mất dữ liệu, sửa rẻ.
  file: `_acceptance/nang-kit-3-0/rang/settings.mjs`
  severity: low
  Đề xuất: known-limits

- **Check 1 — Intent: phép quét tên cũ phân biệt hoa thường, sót các dòng «Acceptance Gate Kit» ở tài liệu sống (r3)**
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

- **Gate 2 card says an eval failed and that the machine is fixing code, while no eval failed (r2 · tệp đã đổi)**
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

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
