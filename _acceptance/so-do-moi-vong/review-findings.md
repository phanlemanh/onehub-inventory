## Trong hợp đồng

- **Check 2/9 (AC-4 'no exemption list', AC-8): a quoted status value slips past both gates**
  file: `tools/round_metrics/round_metrics.py:108`
  severity: low
  AC: AC-4
  source: invariants
  detail: frontmatter_text() removes the trailing '# comment' but leaves quotes in place. `status: "verified"` comes back as '"verified"' (checked by running the function). That value is not in TRANG_THAI_DOI, so kiem() at line 200 silently skips a UI round that has passed grading and has no measurement record. It is also not in QUA_CONG, so kiem_moc() at line 287 stays green for a baseline taken after 1a has passed the Evidence Gate. la_giao_dien() does strip quotes from `surfaces`, so the parser is inconsistent within itself. The kit template says quotes are tolerated on frontmatter lines (for risk_tier). Separately, a multi-line YAML `surfaces:` list reads as empty, so the round counts as non-UI unless design-pass.md exists. Fix: strip quotes from the value in frontmatter_text(), and add one quoted-status case each to the kiem and kiem-moc tests.
  rationale: AC-4 nói hồ sơ giao diện nào đã qua chấm cũng bị đòi, không có danh sách miễn; trạng thái viết có nháy làm một vòng đã qua chấm thoát khỏi lưới.

- **kiem-moc still passes when the 1a status is quoted, and decision 18 wrongly says the shared reader strips quotes**
  file: `tools/round_metrics/round_metrics.py:108`
  severity: medium
  AC: AC-8
  source: bugs
  detail: The round 2 fix sends the 1a status through frontmatter_text(). That function only strips a trailing `# comment` and whitespace (`value.split("#", 1)[0].strip()`). It does not remove YAML quotes. I reproduced this against HEAD: `status: "signed-off"` reads as '"signed-off"' and `status: 'machine-cleared'   # x` reads as "'machine-cleared'". Neither value is in QUA_CONG, so kiem-moc stays green on a baseline measured after the 1a frame passed the Evidence Gate, which is the case AC-8 forbids. Both forms are valid YAML for the same value. The record written for this fix (_acceptance/so-do-moi-vong/decisions.jsonl, line 18, d-20261110T235859Z-18) states the residual risk as "bộ đọc chung đã bỏ nháy nên rủi ro còn lại là dạng YAML lồng nhau". That statement is false, so the stated limit hides a gap that is still open. No test covers a quoted status, either among the breaking cases or in the green control. Fix: strip matching surrounding quotes in frontmatter_text, or correct the decision record and list quoted statuses as a known limit. Then add a breaking case with a quoted post-gate status.
  rationale: AC-8 đòi kiem-moc đỏ khi hồ sơ khung-va-giao-dien đã qua Cổng Bằng chứng ở commit mốc; trạng thái có nháy làm nó xanh sai.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Check 2 (AC-4 staleness): kiem compares only the number of rounds, so a round that turns REJECT later is never flagged**
  Người dùng thấy gì: Nếu một vòng đang đạt sau đó bị chấm lại thành bị từ chối, bản số đo cũ vẫn được coi là còn mới và lưới không báo thiếu tầng làm lại cho vòng đó.
  Căn cứ: Hậu quả nhẹ: chỉ làm một vòng bị chấm lại thiếu nhãn tầng trong báo cáo, không mất dữ liệu, và người ghi chạy lại lệnh ghi là sửa được.
  file: `tools/round_metrics/round_metrics.py`
  severity: low
  Đề xuất: known-limits

- **Check 5 (personal data, public repo): local home paths in committed files beyond the one already recorded**
  Người dùng thấy gì: Một số tệp công khai của kho còn chứa đường dẫn thư mục trên máy của chủ kho, làm lộ tên tài khoản máy. Không lộ khoá hay mật khẩu.
  Căn cứ: Hậu quả nhẹ: chỉ lộ tên tài khoản máy, không lộ bí mật, nhưng kho đã công khai nên không thu hồi được hẳn; sửa sau rẻ, chỉ thay chuỗi.
  file: `_acceptance/so-do-moi-vong/decisions.jsonl`
  severity: low
  Đề xuất: known-limits

- **Check 9 Design: tests leave temporary repos and copies behind**
  Người dùng thấy gì: Mỗi lần chạy bài kiểm để lại khoảng ba chục thư mục tạm trên máy, dần dần chiếm dung lượng ổ đĩa.
  Căn cứ: Hậu quả nhẹ: chỉ tốn dung lượng tạm, hệ điều hành dọn định kỳ, không ảnh hưởng dữ liệu hay kết quả kiểm.
  file: `tools/round_metrics/round-metrics.test.ts`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): dòng chú thích status được gán là 'của khuôn hợp đồng kit' nhưng thực ra gõ tay, và đã lệch khỏi khuôn**
  Người dùng thấy gì: Dữ liệu mẫu của bài kiểm do người gõ tay chứ không lấy từ khuôn của bộ công cụ, nên nếu khuôn đổi cách viết, bài vẫn xanh trong khi đọc hồ sơ thật có thể sai.
  Căn cứ: Hậu quả nhẹ và chưa xảy ra: hiện kết quả vẫn đúng, chỉ là mối nguy về sau khi khuôn đổi, và khi đó sửa lại bài kiểm rẻ.
  file: `tools/round_metrics/round-metrics.test.ts`
  severity: low
  Đề xuất: known-limits

- **Check 2 (AC-4 'no exemption list'): the 'mobile' surface is not counted as UI (r2 · tệp đã đổi)**
  Người dùng thấy gì: A round for a mobile screen that has no design-pass file could pass grading without leaving a rework measurement, so that round would be missing from the rework report.
  Căn cứ: The harm is a gap in the statistics, not lost data or a broken screen. The repository has no mobile rounds today, and it can be fixed cheaply later once such a round appears.
  file: `tools/round_metrics/round_metrics.py`
  severity: low
  Đề xuất: known-limits

- **Check 11 / measurement integrity: the baseline's scoring rule was changed after the results were seen, with no human decision (r2)**
  Người dùng thấy gì: The first baseline's same-versus-different count (10 vs 11) comes from rules written after the results were seen, so a reader may trust the baseline less than a version fixed in advance. The owner has not yet chosen between this version and the grader's smaller correction (12 vs 9).
  Căn cứ: No user data is affected, but the baseline is the reference all later rounds are compared against. Recording the open choice for the owner is cheap and keeps the comparison honest.
  file: `docs/plan/do-he-design/de-bai-ba-agent.md`
  severity: medium
  Đề xuất: known-limits

- **Check 5 (repo is public): machine-local session paths committed in baseline plans (r2)**
  Người dùng thấy gì: Two baseline plan files cite folders on the owner's own computer that no outside reader of the public repository can open. They also reveal a local home folder name.
  Căn cứ: The impact is mild: no secrets leak, only a local folder name and dead references. It can be tidied at any time with a small edit.
  file: `docs/plan/do-he-design/moc-2026-11-11/agent-1.md`
  severity: low
  Đề xuất: known-limits

- **Check 6 (input at boundary): --slug not validated before writing so-do-vong.json (r2 · tệp đã đổi)**
  Người dùng thấy gì: If someone types an odd folder name into the record command, the measurement file could be written outside the acceptance folder. Only the repo owner runs this command on their own machine.
  Căn cứ: There is no exposure to end users, and a stray file is easy to see and delete. The command is internal and run by hand, and the issue was already accepted as a known limit.
  file: `tools/round_metrics/round_metrics.py`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét LỚP nhưng chỉ có điểm-case): bài kiểm 'đo sau khi 1a gộp' thiếu trạng thái machine-cleared trong ba trạng thái sau Cổng (r2 · tệp đã đổi)**
  Người dùng thấy gì: The automated tests do not cover one of the three statuses that mean the screen frame was already merged. If the check were later broken for that status, a baseline measured too late could pass unnoticed.
  Căn cứ: The check works for that status today; only the safety net around it is thinner. It would take a deliberate future code change to expose the gap, and adding the test case is cheap when someone touches that code.
  file: `tools/round_metrics/round-metrics.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Check 6, input validated at the boundary (path traversal): `--slug` is not checked before the file is written (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu ai đó gõ nhầm hoặc cố ý gõ tên hồ sơ có dấu đi lên thư mục cha, tệp số đo có thể bị ghi ra ngoài thư mục hồ sơ nghiệm thu.
  Căn cứ: Chỉ chủ kho hoặc agent chạy lệnh này trên máy mình, không có người dùng ngoài chạm tới; hậu quả nhẹ, chỉ một tệp nằm sai chỗ và xoá đi là xong.
  file: `tools/round_metrics/round_metrics.py`
  severity: low
  Đề xuất: known-limits

- **The Gate 1 card puts AC-1, the main recording criterion, under 'Sẽ KHÔNG làm' (r1)**
  Người dùng thấy gì: Thẻ chủ kho đọc để duyệt kế hoạch ghi việc ghi số đo chính ở mục Sẽ KHÔNG làm, nên bản duyệt có thể bị hiểu sai về phạm vi.
  Căn cứ: Không mất dữ liệu và sản phẩm chạy đúng hợp đồng; chủ kho đã duyệt và có thể đọc lại hợp đồng, nên chỉ cần ghi lại chỗ trình bày sai.
  file: `_acceptance/so-do-moi-vong/card-plain.json`
  severity: medium
  Đề xuất: known-limits

- **ghi silently drops every layer already declared when the existing so-do-vong.json cannot be read, then overwrites it (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu bản số đo cũ bị hỏng, chạy lại lệnh ghi sẽ lặng lẽ mất các tầng đã khai trước đó và trông như chưa từng khai.
  Căn cứ: Chỉ xảy ra khi tệp đã hỏng, hiếm; mất khai báo nhưng khai lại được từ sổ chạy và tệp nằm trong git nên lấy lại được.
  file: `tools/round_metrics/round_metrics.py`
  severity: low
  Đề xuất: known-limits

- **gop silently skips unreadable so-do-vong.json files, so the report undercounts with no warning (r1 · tệp đã đổi)**
  Người dùng thấy gì: Báo cáo gộp có thể bỏ qua một bản số đo hỏng mà không báo, làm số vòng và tỉ lệ làm lại thấp hơn thực tế.
  Căn cứ: Chỉ lệch số khi có tệp hỏng và lệnh kiểm vẫn bắt hỏng ở các hồ sơ đã qua chấm; tính lại được sau khi sửa tệp.
  file: `tools/round_metrics/round_metrics.py`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3: lời hứa 'lấy từ dòng cuối của từng loại' là quan hệ giữa nhiều dòng, nhưng bài chỉ so một giá trị với dòng duy nhất (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm chưa chứng minh được số vật, thước, nhát, giờ máy lấy từ dòng cuối, nên nếu sau này lấy nhầm dòng đầu thì có thể không ai biết.
  Căn cứ: Hiện chưa có số sai thật, chỉ là lưới bắt lỗi còn thưa; bổ sung bài kiểm sau rẻ và không ảnh hưởng người dùng ngay.
  file: `tools/round_metrics/round-metrics.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3: bản chữ của gop chỉ được kiểm là có tên tầng, không kiểm quan hệ 'mang cùng số' với bản --json (r1 · tệp đã đổi)**
  Người dùng thấy gì: Báo cáo dạng chữ có thể in lệch cột hoặc sai số so với bản máy đọc mà bài kiểm vẫn xanh.
  Căn cứ: Chưa thấy số sai thật; nếu sai thì người đọc báo cáo có thể thấy lệch và đối chiếu với bản JSON, sửa không mất dữ liệu.
  file: `tools/round_metrics/round-metrics.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: phép kiểm 'đo sau khi 1a gộp' chỉ có ca đỏ, thiếu đối chứng dương khi khung có mặt nhưng chưa qua Cổng (r1 · tệp đã đổi)**
  Người dùng thấy gì: Chưa có bài kiểm cho trường hợp khung có mặt nhưng chưa qua cổng, nên lưới có thể chặn nhầm mốc hợp lệ mà không ai thấy.
  Căn cứ: Chưa gây lỗi thật; nếu chặn nhầm thì lệnh báo đỏ ngay và người dùng thấy được, nên hậu quả nhẹ và bổ sung ca sau rẻ.
  file: `tools/round_metrics/round-metrics.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5: trục 'giao diện theo surfaces' chỉ có điểm-case 'ui', thiếu các phần tử web và web-ui của lớp (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hồ sơ khai kiểu giao diện web hoặc web-ui có thể bị bỏ sót khỏi lưới mà bài kiểm không phát hiện.
  Căn cứ: Chỉ rủi ro nếu ai đó sửa bỏ các giá trị này; hậu quả nhẹ là sót đòi số đo và thêm ca kiểm sau rẻ.
  file: `tools/round_metrics/round-metrics.test.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
