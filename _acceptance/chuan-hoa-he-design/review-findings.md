# Review findings: chuan-hoa-he-design (round 1)

Không có finder nào chết; review đầy đủ.

## Trong hợp đồng

- **Shape 4, a negative-only check: on an editable cell checkEnter never requires the editor to open**
  AC: AC-4
  file: `tests/e2e/chuan-hoa-sua-o.spec.ts:62`
  severity: high
  detail: checkEnter only rejects bad outcomes on an editable cell (`editable && !got.editor && got.record` and `editable && got.record`). It never asserts `got.editor === true`. If Enter does nothing on «1101 · Giá chào» (no editor, no record), the outcome passes, though AC-4/E5 promise that Enter opens the editor on the cell. The red test (around line 112) only feeds outcomes that contain `record`, so no red case exercises 'Enter did nothing'. The locked branch has its positive control (`got.record !== cell.row`); the editable branch has none.
  source: measurement
  rationale: AC-4 hứa Enter mở khung sửa trên ô sửa được, mà bài đo không bắt được trường hợp Enter không làm gì.

- **Shape 1, measuring the instruction instead of the output: the 'no editable cell found' guard counts the hand-written case table, not the page**
  AC: AC-6
  file: `tests/e2e/chuan-hoa-sua-o.spec.ts:235`
  severity: high
  detail: `if (can) editable += 1;` increments on `can`, the expected value the author wrote in `cases` (always one `true`, for 1101 · Giá chào). It depends on nothing measured on the page, so `expect(editable, "no editable cell found").toBeGreaterThan(0)` (line 237) is always 1 > 0 and can never go red. E7 in evals.yaml names this as a red direction. The guard should count cells where `pencilOf` actually returned `shown`/editable.
  source: measurement
  rationale: AC-6 yêu cầu bút chì hiện trên ô sửa được và bài đo phải đỏ khi không có ô nào; chốt hiện đếm bảng tự viết nên không bao giờ đỏ.

- **Shape 5, a class sweep with no matrix written in advance: the set of locked cells is filtered by the very attribute under test, and the count only has to be > 1**
  AC: AC-3
  file: `tests/e2e/chuan-hoa-mau.spec.ts:281`
  severity: high
  detail: lockedCells only collects `[data-slot="typed-cell"][title]`, the cells that already have a title. A locked cell of a Closed/Withdrawn row that lost its reason (no title), or that draws a padlock but has no title, drops out of the set and never reaches the 'gives no reason' or 'padlock' checks. The total is only held by `expect(checkLocks(cells)).toBeGreaterThan(1)` (line 308). There is no matrix written in advance of rows × columns (status, price, fee, company column per AC-3/E4). Related: the red case at line 346 removes aria-description on the page, but checkLocks then runs on the `cells` array captured before that change and edited by hand (`described: ""`), so the change to the page is never read back.
  source: measurement
  rationale: AC-3 nêu rõ bốn loại ô khoá của dòng đã bán và ngừng hẳn phải có lý do, mà bài đo lọc theo chính thuộc tính đang kiểm nên bỏ sót ô mất lý do.

- **Shape 3, asserting that a string is present while the promise is a relation: the lock reason is checked only by its prefix, not by naming the row's status**
  AC: AC-3
  file: `tests/e2e/chuan-hoa-mau.spec.ts:297`
  severity: medium
  detail: checkLocks only checks `title.startsWith("Ô đang khoá")` and `described.startsWith("Ô đang khoá")`. typed-cell.tsx builds `${lockedPrefix}: ${lockedReason}`, so an empty reason or the wrong status's reason still passes. E4 expects the reason to start with the grid's lock words and name the status, a relation between the cell text and its row's `data-status`. No assert ties the reason to the status of the row.
  source: measurement
  rationale: AC-3 hứa rê chuột thấy lý do khoá và trình đọc màn hình đọc được; bài đo chỉ kiểm tiền tố nên lý do rỗng hay sai trạng thái vẫn qua.

- **Shape 5, a declared class sweep with one axis element missing: the 'Tuỳ chỉnh của sàn' screen (Enter moves down a row) has no case although E5 says it is measured**
  AC: AC-4
  file: `_acceptance/chuan-hoa-he-design/evals.yaml:46`
  severity: medium
  detail: The contract's screen axis is Bảng hàng | Đã gửi | Tuỳ chỉnh của sàn (AC-4), and E5 `expected` states '/company-layer Enter → ô dưới được chọn'. chuan-hoa-sua-o.spec.ts has cases only for /inventory and /sent. The rendered-region tests in data-region-keys.test.tsx always mount `show(true)` (with a record), never the screen without one. The only coverage is the "grid" row of the pure-rule MATRIX, not what the region does with no record. The eval claims a measure the listed files do not contain.
  source: measurement
  rationale: AC-4 nêu đích danh màn Tuỳ chỉnh của sàn, Enter vẫn đi xuống một dòng, mà bài trình duyệt không có ca nào cho màn này.

- **Shape 3, the promise 'light unchanged from before this round' is replaced by a property inside the current page**
  AC: AC-11
  file: `tests/e2e/chuan-hoa-mau.spec.ts:437`
  severity: medium
  detail: AC-11 and E19 promise that in light mode every such colour is unchanged and the three values are the same as before this round, which compares against a baseline. The test only asserts `|light.panel - light.grid| < 2` and `light.hover - light.menu < -2`, two relations inside the current page. It does not pin page, grid or panel greys to the pre-round values, so a light grey that moves with the grid (both shifted together) still passes. `g.page` is measured but appears in no check.
  source: measurement
  rationale: AC-11 hứa ở nền sáng mọi màu không đổi so với trước vòng, mà bài đo chỉ so quan hệ trong trang hiện tại, không so với giá trị cũ.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Rule: file names and routes are English, and the owner's english-route-names ruling of 23/11**
  Người dùng thấy gì: Màn nhập tệp có địa chỉ tiếng Việt trong khi các màn khác đã đổi sang tiếng Anh. Người dùng vẫn vào và dùng bình thường, chỉ là địa chỉ không đồng nhất.
  Căn cứ: Chỉ là tên địa chỉ, không mất dữ liệu và không cản trở thao tác; đổi sau rẻ hơn nếu làm cùng hàng nhập tệp.
  file: `src/app/(app)/nhap-tep/page.tsx`
  severity: medium
  Đề xuất: new-contract

- **Tier: the PR's stated tier does not match tools/autonomy.py**
  Người dùng thấy gì: Mô tả của bản thay đổi ghi mức duyệt thấp hơn thực tế, nên người gộp có thể không biết cần chủ mã duyệt. Người dùng cuối không thấy gì.
  Căn cứ: Chỉ sai nhãn, không ảnh hưởng người dùng; người gộp sửa được bằng một dòng ghi chú hoặc gộp lại main sau khi bản dưới vào.
  file: `governance/autonomy.yaml`
  severity: medium
  Đề xuất: known-limits

- **Evidence: the required acceptance gate is red on HEAD**
  Người dùng thấy gì: Bản này chưa gộp được vì hồ sơ nghiệm thu chưa đủ và nhiều hồ sơ đã ký đang cũ. Người dùng cuối chưa bị ảnh hưởng vì chưa phát hành.
  Căn cứ: Việc này là bước thủ tục đã được lên kế hoạch trước khi gộp, làm được lúc nào cũng được và không gây mất dữ liệu.
  file: `_acceptance/chuan-hoa-he-design/contract.md`
  severity: medium
  Đề xuất: known-limits

- **Design (AC-1, one colour per status): the import's 'fixed' mark now uses the same colour as the 'Đã bán' status**
  Người dùng thấy gì: Dấu 'đã sửa' ở màn nhập có cùng màu với nhãn «Đã bán», nên có thể nhìn nhầm là một trạng thái. Chỉ gây hiểu nhầm thoáng qua.
  Căn cứ: Chỉ là màu ở màn nhập, không mất dữ liệu; người dùng đọc chữ trên dấu là phân biệt được, đổi màu sau rất rẻ.
  file: `src/modules/imports/ui/import-wizard.tsx`
  severity: low
  Đề xuất: known-limits

- **A value the person chose for a cell of a new single-choice field is silently not written**
  Người dùng thấy gì: Khi nhập tệp và tạo cột lựa chọn mới, giá trị người dùng đã chọn cho một số ô có thể không được ghi lại mà không báo lỗi. Người dùng tưởng đã nhập đủ nhưng căn thiếu giá trị.
  Căn cứ: Mất dữ liệu âm thầm nên nặng, nhưng chỉ xảy ra ở một đường nhập và thuộc hàng khác nên cần sửa ở hồ sơ nhập tệp trước khi hàng đó ký.
  file: `src/modules/imports/store.ts`
  severity: high
  Đề xuất: new-contract

- **Close price and close date columns are accepted but their values are dropped with no trace**
  Người dùng thấy gì: Cột giá bán và ngày bán trong tệp nhập được báo là đã hiểu nhưng giá trị không được lưu và cũng không được giữ lại. Người dùng tưởng đã có mà thực tế mất.
  Căn cứ: Mất dữ liệu âm thầm nhưng chỉ với hai cột ít gặp khi nhập căn đang rao; người dùng còn tệp gốc để nhập lại sau khi sửa.
  file: `src/modules/imports/store.ts`
  severity: medium
  Đề xuất: new-contract

- **Shape 1, measuring the instruction instead of the output: ImportRun columns are read by regex over migration SQL, not from the table in Postgres**
  Người dùng thấy gì: Các bài kiểm tra bảng lưu lượt nhập đọc văn bản lệnh tạo bảng chứ không đọc bảng thật, nên có thể bỏ sót sai lệch giữa hai bên. Người dùng chưa thấy gì trừ khi sai lệch thật xảy ra.
  Căn cứ: Là điểm yếu của bài kiểm tra chứ chưa phải lỗi người dùng gặp, và đã có bài khác đo bảng thật ở chỗ khác.
  file: `tests/nhap-excel-ontology.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 2, fixtures written by hand to fit the reader: the .xlsx files are XML written in tao.mjs, not files saved by Excel or Sheets**
  Người dùng thấy gì: Các tệp Excel mẫu do công cụ tự tạo nên có thể không giống tệp thật từ Excel hay Google Sheets. Một số tệp thật có thể nhập lỗi mà bài kiểm tra không báo trước.
  Căn cứ: Hạn chế đã được ghi rõ, người dùng gặp lỗi thì thử lại với tệp khác được, và thử bằng tệp thật có thể làm sau ở hàng nhập tệp.
  file: `tests/fixtures/nhap-excel/tao.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
