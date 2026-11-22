## Trong hợp đồng

- **The count pattern "chưa có" is not anchored, so digit changes on other records' lines that contain those words still pass (the round-1 finding t1 class is still open)**
  file: `_acceptance/upgrade-design-assembly-0-33-0/rang/matrix.mjs:117`
  severity: medium
  AC: AC-6
  source: conventions
  detail: The fix keeps normalising digits only inside segments that match DRAWN_COUNTS. But the first pattern, /\d+ việc|chưa có/, is not anchored to the stage-count text. Any segment that contains the everyday words "chưa có" counts as a count, and then change-list.mjs:40 replaces every digit in it with '#'. LO-TRINH.html has many prose segments from other roadmap rows that contain "chưa có" along with row numbers. Example: " hoặc tạo căn tay thành căn chờ khớp của sàn (hàng 7e) khi danh mục chưa có; ... theo hàng 4" (appears twice). Checked in memory with DRAWN_COUNTS and the norm function from change-list.mjs: isCount(segment) = true, and the segment with 'hàng 7e' changed to 'hàng 9e' normalises to exactly the old one, so the removed/added pair cancels and the measure stays green. Other examples: 'Đứng sau 9a ... chưa có chỗ trên lộ trình. Luật SP-3', 'hàng 12 gõ mã để thêm căn'. So E11 now promises 'digits are read as counts only inside DRAWN_COUNTS segments', and AC-6 limits changes to 'lines that name this record, or the per-stage counts', but the measure still accepts a digit changed on another record's line whenever that line happens to contain "chưa có". The two new break cases (hàng 3f→3g, <b>2</b>→<b>4</b>) pick lines without these words, so they never show this gap. Suggested fix: tie the pattern to the shape of the stage-count text (for example the Mermaid node content '<br/>chưa có"]' / '^\d+ việc"\]' after the segment split, or ^(\d+ việc|chưa có)"\]), and add a red case that changes one digit on a segment containing "chưa có" from another row.

- **The two new 'digit only' red cases also change a letter, so they would turn red under the old code and do not show the round-1 fix works**
  file: `_acceptance/upgrade-design-assembly-0-33-0/rang/two-way.mjs:135`
  severity: medium
  AC: AC-6
  source: bugs
  detail: Both new break cases bundle a letter change with the digit change: `.replace("(hàng 3f)", "(hàng 3g)").replace("ở hàng 7 trước", "ở hàng 8 trước")` (line 135) and `.replace("<b>1h</b>", "<b>1i</b>").replace("<b>2</b> — kế hoạch", "<b>4</b> — kế hoạch")` (line 140). The old `norm` (every \d+ becomes #) turns `3f`/`3g` into `#f`/`#g` and `1h`/`1i` into `#h`/`#i`, which still differ. So the old, loose `drawnPageProblems` already goes red on these cases. Tested in a scratch copy using the same word-diff and norm logic. Letter-only edits gave old=2 problems and new=2. Digit-only edits (7→8, 2→4) gave old=0 and new=2. The cases pass under either version, so they cannot catch a fall back to the round-1 bug. That is the failure decisions.jsonl d-22 warns about ('nếu các ca đỏ mới không cắn đúng'). evals.yaml E11 describes them as 'đổi chỉ một chữ số', but they change more than that. Fix: drop the 3f→3g and 1h→1i parts so each case changes only a digit.

- **The unanchored `chưa có` count pattern still lets digit changes on other records' lines pass on LO-TRINH.html and PRODUCT-MAP.md**
  file: `_acceptance/upgrade-design-assembly-0-33-0/rang/matrix.mjs:117`
  severity: medium
  AC: AC-6
  source: bugs
  detail: `DRAWN_COUNTS[0] = /\d+ việc|chưa có/` is tested with `.test()` against a whole word-diff segment. With `--word-diff-regex=[^<>,{}]+`, a segment is a full run of prose between commas or tags. Any other record's prose segment that happens to contain 'chưa có' counts as a 'count segment', and every digit in it is masked. The scratch replay of the new `drawnPageProblems` returns 0 problems (green) for each of these edits to other records' lines on LO-TRINH.html: 'theo hàng 4'→'theo hàng 5', 'Đứng sau 9a'→'Đứng sau 8a', 'hàng 12 gõ mã'→'hàng 13 gõ mã'. It also returns 0 for 'danh mục chưa có; xem'→'danh mục 0 việc; xem'. On PRODUCT-MAP.md line 35 (the `them-can` record), 'danh mục chưa có'→'danh mục 5 việc' passes as well. This is the same class as round-1 finding t1/t3: digits outside a per-stage count are still treated as counts, so AC-6 ('only on the per-stage counts') is still looser than written. Fix: anchor the patterns to the drawn count shape, for example match the whole segment like `^(\d+ việc|chưa có)"?\]?$`, or the mermaid `<br/>` node text, instead of a substring anywhere in prose.

- **Hình dạng 4 (assertion âm tính một mình, không đối chứng, không ghim thông điệp): hai ca đỏ «chỉ đổi một chữ số» thật ra đổi kèm một chữ cái, nên bản chưa sửa cũng đỏ y như vậy**
  file: `_acceptance/upgrade-design-assembly-0-33-0/rang/two-way.mjs:135`
  severity: medium
  AC: AC-6
  source: measurement
  detail: Hai ca này được thêm vào để chứng minh bản sửa phát hiện t1/t3 của vòng 1: chữ số chỉ được đọc là số đếm khi nằm trong đoạn khớp DRAWN_COUNTS. E11 trong evals.yaml mô tả chúng là «bản đồ đổi chỉ một chữ số trên dòng của việc khác» và «trang lộ trình đổi chỉ một chữ số trên hàng khác». Nhưng mỗi ca lại gộp một thay đổi chữ số với một thay đổi chữ cái. Dòng 135 thay `(hàng 3f)`→`(hàng 3g)` cùng với `ở hàng 7 trước`→`ở hàng 8 trước`. Dòng 140 thay `<b>1h</b>`→`<b>1i</b>` cùng với `<b>2</b> — kế hoạch`→`<b>4</b> — kế hoạch`. Chạy lại phép chuẩn hoá cũ `s.replace(/\d+/g, "#")` trên đúng bản word-diff mà change-list.mjs dùng, cho từng thay đổi riêng lẻ. Chỉ đổi chữ cái (3f→3g, 1h→1i): còn 2 đoạn lệch, tức bản CHƯA sửa cũng đỏ. Chỉ đổi chữ số (7→8, 2→4): 0 đoạn lệch, tức bản chưa sửa xanh, và chính chỗ này mới là lỗ hổng cần đo. Lời mong đợi chỉ là một câu chung cho cả tệp, `changes: PRODUCT-MAP.md changed a line that is not this record's` (và câu tương tự cho LO-TRINH.html), không nói đoạn nào lệch. Vì vậy chỉ riêng thay đổi chữ cái đã đủ làm ca đỏ. Nếu ai đó hoàn lại norm về dạng che mọi chữ số, cả hai ca vẫn đạt. Như vậy ca đỏ không phân biệt được bản có sửa với bản không sửa. Muốn đo đúng thì mỗi ca chỉ đổi đúng chữ số. Khi đó bản chưa sửa sẽ xanh và chỉ bản đã sửa mới đỏ.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
