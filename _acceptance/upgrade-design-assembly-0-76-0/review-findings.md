# Review findings: upgrade-design-assembly-0-76-0 (round 2)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tier / Records: the PR's 'people must decide' section hides the high tier**
  Người dùng thấy gì: Mô tả PR nói không có gì chặn, nên người duyệt có thể không biết bản nâng cấp này cần chủ mã duyệt. Việc gộp vẫn bị cổng chặn, nên chỉ có nguy cơ hiểu nhầm và chậm.
  Căn cứ: Hậu quả nhẹ: không mất hay lộ dữ liệu, cổng vẫn chặn gộp sai, và người viết sửa lại mô tả PR rất rẻ.
  file: `tools/design-assembly/check.mjs`
  severity: medium
  Đề xuất: known-limits

- **Records: the PR evidence leaves out the failed round**
  Người dùng thấy gì: Người đọc PR không thấy vòng chấm trước bị từ chối vì một bài kiểm trình duyệt đỏ, nên có thể tưởng mọi thứ đã xanh từ đầu. Người duyệt cũng không biết nhánh còn chở thêm các tệp hồ sơ và bản đồ sản phẩm.
  Căn cứ: Hậu quả nhẹ với người dùng cuối: chỉ làm hồ sơ thiếu trung thực một chút, người duyệt tự xem lại được, và bổ sung vào mô tả PR rất rẻ.
  file: `_acceptance/upgrade-design-assembly-0-76-0/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **Records: the wiki log entry has no link to the PR or contract**
  Người dùng thấy gì: Mục nhật ký không dẫn tới PR hay hợp đồng, nên người đọc sau này khó lần ra vì sao nâng cấp. Không ảnh hưởng gì đến người dùng sản phẩm.
  Căn cứ: Hậu quả rất nhẹ: chỉ khó tra cứu về sau, không mất dữ liệu, và thêm một liên kết vào mục nhật ký là việc rẻ.
  file: `wiki/log/2026-11-26-06-n-ng-plugin-design-assembly-0-69-0-0-76.md`
  severity: low
  Đề xuất: known-limits

- **Design / portability: a measure reads from a fixed path on the author's machine**
  Người dùng thấy gì: Trên máy khác hoặc trong hệ thống kiểm tự động, phép đo công cụ có thể báo đỏ giả nếu không đặt biến trỏ tới plugin. Người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Hậu quả nhẹ: chỉ gây đỏ giả ở khâu chấm, không đụng dữ liệu người dùng, và hợp đồng đã ghi cách khắc phục bằng biến môi trường.
  file: `_acceptance/upgrade-design-assembly-0-76-0/rang/lib.mjs`
  severity: low
  Đề xuất: known-limits

- **Round-1 fix decision calls the e2e failure a load timeout, but the log shows a hidden empty-string fallback**
  Người dùng thấy gì: Sổ ghi nguyên nhân bài kiểm đỏ là chạy chậm, trong khi thực ra có thể là lỗi hiếm do thời điểm tải trang. Vòng chấm sau có thể đỏ hoặc xanh ngẫu nhiên, và người đọc sau này bị dẫn đi sai hướng.
  Căn cứ: Hậu quả nhẹ với người dùng: chỉ là bài kiểm thỉnh thoảng đỏ giả, tải lại là qua, không mất dữ liệu; sửa nằm ở bài kiểm của nhánh chính nên đáng tách việc riêng.
  file: `_acceptance/upgrade-design-assembly-0-76-0/decisions.jsonl`
  severity: low
  Đề xuất: known-limits

- **The owner-choice gate rejects a mark when the owner names the first (recommended) candidate by name and the logo row names no candidate (r1)**
  Người dùng thấy gì: Khi chủ kho chọn ứng viên logo đầu tiên bằng cách gõ tên nó, công cụ có thể báo chưa hợp lệ dù luật ghi là chấp nhận. Hiện kho chưa có dòng logo nên chưa ai gặp.
  Căn cứ: Lỗi nằm ở công cụ của nhà phát hành, kho chưa dùng đến nó, và gặp phải thì chỉ bị báo đỏ chứ không mất dữ liệu, chủ kho đổi cách trả lời là qua; sửa đúng chỗ là ở bản sau của công cụ.
  file: `tools/design-assembly/owner-calls.mjs`
  severity: medium
  Đề xuất: known-limits

- **audit.mjs and book.mjs ignore a failed component-manifest write (r1)**
  Người dùng thấy gì: Nếu bước chuẩn bị sổ linh kiện hỏng giữa chừng, kết quả đỏ của phép đo có thể chỉ sai chỗ, người chấm mất thêm thời gian tìm nguyên nhân. Không ảnh hưởng người dùng sản phẩm.
  Căn cứ: Chỉ làm chậm người chấm khi có sự cố hiếm, kết quả vẫn đỏ chứ không giả xanh, và chạy lại là thấy; sửa không đáng công.
  file: `_acceptance/upgrade-design-assembly-0-76-0/rang/audit.mjs`
  severity: low
  Đề xuất: wont-fix

- **Shape 5: the class sweep has point cases only. The language rule list has 7 entries but only 6 red cases, and the oklch/rgb/hsl colour rule has none (r1)**
  Người dùng thấy gì: Bộ kiểm tra chữ tiếng Việt chưa thử hết các cách viết màu và dấu thanh kiểu cũ. Nếu có ai sửa hỏng luật đó, có thể chưa bị phát hiện ngay.
  Căn cứ: 13 câu chữ hiện đã đúng và đã được người đọc, nên người dùng không thấy gì sai; thêm ca thử sau này rẻ và không mất dữ liệu.
  file: `_acceptance/upgrade-design-assembly-0-76-0/rang/matrix.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 3: string presence where the promise is a relation. Six of the 13 brand keys are checked only for being somewhere on the brand page, not for being in their place (r1)**
  Người dùng thấy gì: Với sáu trong 13 câu của trang logo, bài kiểm chỉ xác nhận câu có mặt trên trang, chưa xác nhận nó hiện đúng lúc, ví dụ câu báo chưa có cỡ biểu tượng. Người xem trang có thể gặp câu hiện sai lúc mà bài kiểm không bắt.
  Căn cứ: Trang logo chưa có dữ liệu nào trong kho nên chưa ai nhìn thấy, chữ lệch lúc cũng chỉ là lỗi hiển thị tự khỏi khi tải lại, và việc siết phép đo có thể làm sau.
  file: `_acceptance/upgrade-design-assembly-0-76-0/rang/book.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 2: a hand-written fixture in the reader's shape. The brand sample rows are written by hand, carry no licence and no proposed, and do not come from the ledger writer (r1)**
  Người dùng thấy gì: Trang logo chỉ được thử trên dòng mẫu viết tay, chưa thử trên dòng do công cụ ghi thật ra, nên cách trang vẽ dòng thật có thể khác mà chưa ai kiểm.
  Căn cứ: Kho chưa có dòng logo nào, nên người dùng chưa gặp trang này; khi chủ kho ghi dòng thật, trang sẽ được xem lại, và lỗi vẽ chỉ là lỗi hiển thị, không mất dữ liệu.
  file: `_acceptance/upgrade-design-assembly-0-76-0/rang/matrix.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 6: a hardcoded path. The 'installed plugin' is read from the author's own checkout (r1)**
  Người dùng thấy gì: Phép đo chỉ chạy đúng trên máy của chủ kho, hoặc trên máy khác nếu có chỉ đường tới công cụ. Máy khác không chỉ đường sẽ báo đỏ dù nhánh không có lỗi.
  Căn cứ: Hợp đồng đã ghi rõ giới hạn này và cách vượt qua, kết quả sai chỉ là đỏ giả chứ không xanh giả, nên không gây hại cho người dùng sản phẩm.
  file: `_acceptance/upgrade-design-assembly-0-76-0/rang/matrix.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
