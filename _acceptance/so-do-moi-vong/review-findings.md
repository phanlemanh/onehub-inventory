## Trong hợp đồng

- **Check 2/9 (AC-8 invariant): the 'measured after 1a merged' check misses a status line that carries a trailing comment**
  file: `tools/round_metrics/round_metrics.py:284`
  severity: medium
  AC: AC-8
  source: invariants
  detail: Fix commit 58ea817 changed the regex from `^status:\s*(signed-off|machine-cleared)\b` to `^status:\s*(machine-cleared|signed-off|da-cham-boi-thuc-te)\s*$`. The `\s*$` anchor fails on the kit's own contract template form, `status: {status}            # draft | approved | ...` (contract-template.md:43 of acceptance-gate 2.38.1). Reproduced: `status: signed-off   # draft | approved` gives False with the new regex and True with the old one. So kiem-moc stays green for a baseline measured after the 1a frame has passed the Evidence Gate, which is exactly what AC-8 forbids. The file's own `frontmatter()` already strips `#` comments; kiem_moc does not reuse it. No test covers a status line with a comment. Fix: parse the frontmatter of the `git show` output with `frontmatter()`, or use `(\s|#|$)` after the group, and add a test case with a trailing comment.
  rationale: AC-8 requires kiem-moc to go red when the 1a record has already passed the Evidence Gate at the baseline commit; a status line with a trailing comment lets that case stay green.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Check 2 (AC-4 'no exemption list'): the 'mobile' surface is not counted as UI**
  Người dùng thấy gì: A round for a mobile screen that has no design-pass file could pass grading without leaving a rework measurement, so that round would be missing from the rework report.
  Căn cứ: The harm is a gap in the statistics, not lost data or a broken screen. The repository has no mobile rounds today, and it can be fixed cheaply later once such a round appears.
  file: `tools/round_metrics/round_metrics.py`
  severity: low
  Đề xuất: known-limits

- **Check 11 / measurement integrity: the baseline's scoring rule was changed after the results were seen, with no human decision**
  Người dùng thấy gì: The first baseline's same-versus-different count (10 vs 11) comes from rules written after the results were seen, so a reader may trust the baseline less than a version fixed in advance. The owner has not yet chosen between this version and the grader's smaller correction (12 vs 9).
  Căn cứ: No user data is affected, but the baseline is the reference all later rounds are compared against. Recording the open choice for the owner is cheap and keeps the comparison honest.
  file: `docs/plan/do-he-design/de-bai-ba-agent.md`
  severity: medium
  Đề xuất: known-limits

- **Check 5 (repo is public): machine-local session paths committed in baseline plans**
  Người dùng thấy gì: Two baseline plan files cite folders on the owner's own computer that no outside reader of the public repository can open. They also reveal a local home folder name.
  Căn cứ: The impact is mild: no secrets leak, only a local folder name and dead references. It can be tidied at any time with a small edit.
  file: `docs/plan/do-he-design/moc-2026-11-11/agent-1.md`
  severity: low
  Đề xuất: known-limits

- **Check 6 (input at boundary): --slug not validated before writing so-do-vong.json**
  Người dùng thấy gì: If someone types an odd folder name into the record command, the measurement file could be written outside the acceptance folder. Only the repo owner runs this command on their own machine.
  Căn cứ: There is no exposure to end users, and a stray file is easy to see and delete. The command is internal and run by hand, and the issue was already accepted as a known limit.
  file: `tools/round_metrics/round_metrics.py`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét LỚP nhưng chỉ có điểm-case): bài kiểm 'đo sau khi 1a gộp' thiếu trạng thái machine-cleared trong ba trạng thái sau Cổng**
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
