# Review findings: nhap-excel (round 1)

## Trong hợp đồng

- **Authorization and input / Personal data: choosing any target lifts the block on an owner column (AC-6, Hỏi-12)**
  file: src/modules/imports/mark.ts:168
  severity: high
  AC: AC-2
  source: invariants
  detail: In matchColumns, the `if (chosen)` branch (line 168) runs before the OWNER_HEADERS check (line 177). Any column choice the client sends therefore lifts the 'owner-column' block, not only 'skip'. The contract (_acceptance/nhap-excel/contract.md lines 36-37) and the spec say an owner-name or phone column stays blocked until the person drops the column. The wizard (src/modules/imports/ui/import-wizard.tsx around lines 292-336) offers every standard target and 'CustomField: <header>' on that column too. Result: a list agent can map 'SĐT chủ' to a new custom field, and owner phone numbers get written into listings.custom_fields. Every ListAgent and BuyerAgent with viewListings company scope can read them, which goes around viewOwnerPhone (own scope) and the rule that owner phones go on the unit's record (row 11b/13). No test covers a choice on an owner column (tests/nhap-excel-ghep-cot.test.ts only has the case with no choice). Fix: check OWNER_HEADERS before `chosen` (and before the template) and accept only {skip:true} for such a column, on the server. Add a test where a custom or newField choice on 'SĐT' stays 'block'.

- **Intent / Criteria (AC-6, AC-7): a batch is not tied to the import that was opened**
  file: src/modules/imports/store.ts:243
  severity: medium
  AC: AC-7
  source: invariants
  detail: openImport checks the counts (409) and that no cell is blocked, but only on the table sent at open. writeBatch takes headers, rows, choices, batchNo and rowOffset from the client again. It does not compare the header signature with import_runs.signature, does not hold rowOffset+rows within row_count, does not cap batchNo, and does not compare choices with those that passed at open. A client can open a small file, then send batches with other rows, columns or choices, and create more listings than row_count with numbers the person never saw. That goes against AC-6 ('no apply path skips the preview step') and AC-7 ('the numbers differ from what the person saw → 409'). Fix: store a hash of headers and choices (or signature + row_count) at open. In writeBatch, refuse (409) a batch whose signature or choices differ, or whose rowOffset/rows go past row_count.

- **Rows the person chose to skip are applied again at the same position in every later batch, so rows 200+i, 400+i, ... are silently dropped**
  file: src/modules/imports/ui/import-wizard.tsx:603
  severity: high
  AC: AC-7
  source: bugs
  detail: The skip-row button stores global row indices in `choices.skipRows` (lines 463-468, i from the full table). ApplyBatches sends the same `choices` with every batch of 200 rows (lines 600-611). On the server, writeBatch calls `previewImport(c, input, input.choices)`, and markTable (table.ts:68-69) tests `choices.skipRows?.includes(r)` with r being the index inside the batch slice. Neither the client nor writeBatch shifts skipRows by rowOffset. Example: the person skips row 3. Batch 0 skips global row 3 as intended, but batch 1 also skips global row 203, batch 2 skips global row 403, and so on. Those rows get fate 'skipped' and the mark 'keep/row-skipped'. They are never created and never written to `kept`. No error is raised, so a file of more than 200 rows loses data without telling anyone, and the count the person approved in openImport no longer matches what is written.

- **A Team Lead (TeamLead) importing from the screen always fails: the screen never sends listAgentUserId**
  file: src/modules/imports/ui/import-wizard.tsx:164
  severity: high
  AC: AC-7
  source: bugs
  detail: openImport on the client sends headers/rows/choices/fileName/sheetName/expected but no `listAgentUserId`, and the screen has no picker for the list agent (Đầu chủ). No other route exposes app.import_list_agents (migration 016). The server then uses `agent = door.ctx.userId` (imports-http.ts:181). agentName() (store.ts:124-141) only accepts members with the ListAgent role, so a TeamLead without that role gets problem 'bad-agent' and a 400. The screen only shows the generic 'failed' banner. The db test passes because it sends listAgentUserId directly to the API ('TL', e.w.id.LA). The owner's decision that a Team Lead picks the list agent and imports on their behalf (eval E…: 'Trưởng nhóm chọn Đầu chủ X') is not reachable through the UI, even though the import button is shown to TeamLead (importListings=company).

- **A row whose pending unit cannot be created is skipped with `continue`: not created, not kept, no error**
  file: src/modules/imports/store.ts:320
  severity: medium
  AC: AC-7
  source: bugs
  detail: In writeBatch, when the unit code is not in the catalog (newPending), the code calls learnFromImport → addPendingUnit. addPendingUnit returns fail('code-too-long') when the code is over 80 characters (company-config/store.ts:396) or a refusal (23505/23503). learnFromImport then returns an empty pendingUnits list and writeBatch runs `if (!made) continue;`. The row is not created, and its unit-code cell is not in `kept` either, because kept leaves out ask cells of the unitCode column. markUnit does not check the code length, so the preview counts the row as 'create' and openImport passes the counts check. The listing just disappears and `created` comes out smaller than promised, with no message.

- **A new field the store refuses makes the whole column's values disappear without a word**
  file: src/modules/imports/store.ts:472
  severity: medium
  AC: AC-2
  source: bugs
  detail: The wizard creates a newField named after the column header (import-wizard.tsx:311/329). matchColumns accepts the choice without checking it against checkFieldDraft (no check for field-limit, name-empty or name-taken). In learnAtEnd, if addField refuses (for example the company already has 20 fields, FIELD_LIMIT, or the header is empty, which happens when a column has data but no header), newCodes has no code for it, and the loop over allNewFieldCells hits `if (!code) continue;`. Every value of that column is dropped. The column's cells were marked keep/fixed, not ask, so they are not in `kept` either, and the template is not saved. The person sees no error.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Design: a new dependency between modules has no decision page**
  Người dùng thấy gì: Không người dùng nào thấy ảnh hưởng. Chỉ là thiếu một trang ghi lại vì sao hai phần của hệ thống được cho phép dùng nhau.
  Căn cứ: Không ảnh hưởng dữ liệu hay màn hình; thiếu tài liệu, viết bù lúc nào cũng được và rẻ.
  file: `architecture/modules.yaml`
  severity: medium
  Đề xuất: known-limits

- **Personal data: ImportRun.kept stores raw cell text without a pii marking**
  Người dùng thấy gì: Những ô người nhập chọn giữ nguyên chữ có thể chứa số điện thoại chủ nhà ghi dưới một tên cột lạ, và được lưu lại không có hạn, nhân viên cùng sàn có quyền xem lần nhập có thể đọc được về sau.
  Căn cứ: Có thể lộ số chủ nhà trong phạm vi cùng sàn nhưng hiện màn hình chưa hiển thị phần này; sửa được sau mà không mất dữ liệu.
  file: `ontology/entities/ImportRun.yaml`
  severity: low
  Đề xuất: known-limits

- **Domain: the ontology does not match the schema for ListingPendingUnit and Listing.importRunId**
  Người dùng thấy gì: Mô tả nghiệp vụ lệch nhẹ so với cơ sở dữ liệu thật ở vài trường. Người dùng không thấy gì, nhưng người sửa sau có thể hiểu nhầm.
  Căn cứ: Không mất dữ liệu và không ảnh hưởng người dùng; chỉ là tài liệu mô hình chưa khớp, chỉnh lại rẻ.
  file: `ontology/entities/ListingPendingUnit.yaml`
  severity: low
  Đề xuất: known-limits

- **Authorization: insert on the unit-link tables only asks 'createListing is not null', without the listing's owner**
  Người dùng thấy gì: Ở tầng cơ sở dữ liệu, một Đầu chủ về lý thuyết có thể gắn mã căn vào tin rao của người khác trong cùng sàn. Hiện không có đường nào trên màn hình làm được việc này.
  Căn cứ: Chưa có đường khai thác thật và chỉ trong cùng sàn; hậu quả nhẹ, sửa sau không động đến dữ liệu hiện có.
  file: `db/migrations/015_nhap_excel.sql`
  severity: low
  Đề xuất: known-limits

- **Tier: high — a code owner must review**
  Người dùng thấy gì: Thay đổi này chạm vùng được bảo vệ nên phải có chủ kho xem và duyệt trước khi gộp. Người dùng cuối không thấy gì.
  Căn cứ: Không phải lỗi sản phẩm mà là bước duyệt bắt buộc, người ký sẽ tự thấy khi mở yêu cầu gộp.
  file: `governance/autonomy.yaml`
  severity: low
  Đề xuất: known-limits

- **The kept-cell count the screen promises includes unit codes the server never stores in kept**
  Người dùng thấy gì: Màn xem trước nói sẽ giữ một số ô chữ, nhưng với các dòng căn đã có tin rao hay căn còn chưa trả lời thì mã căn không được lưu lại trong bản ghi lần nhập. Con số người thấy lớn hơn số thật được giữ.
  Căn cứ: Không mất tin rao nào đã tạo, chỉ lệch ở bản ghi phụ để tra cứu; nhập lại tệp là bù được.
  file: `src/modules/imports/store.ts`
  severity: medium
  Đề xuất: known-limits

- **The last batch learns spellings and unit codes using only that batch's rows, so it stores the folded key instead of the original text**
  Người dùng thấy gì: Với tệp nhiều dòng, cách viết hay mã căn được nhớ có thể hiện bằng chữ thường không dấu thay vì đúng như trong tệp.
  Căn cứ: Chỉ sai cách hiển thị, giá trị vẫn khớp lần sau và người dùng sửa được; hậu quả nhẹ.
  file: `src/modules/imports/store.ts`
  severity: low
  Đề xuất: known-limits

- **Shape 3 (relation measured by a tautology): E13 'sàn B không câu nào được trả lời sẵn'**
  Người dùng thấy gì: Bài kiểm tra việc sàn B không thấy gì sàn A đã học không thật sự đo được, nên nếu sau này hai sàn lộ dữ liệu cho nhau thì bài kiểm tra vẫn xanh.
  Căn cứ: Hiện chưa có dấu hiệu rò dữ liệu thật; rủi ro nằm ở việc lỗi sau này khó bị phát hiện, và viết lại bài kiểm tra thì rẻ.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: high
  Đề xuất: known-limits

- **Shape 4 (negative-only, break never triggered): 'learned items survived failed apply'**
  Người dùng thấy gì: Bài kiểm tra việc lần nhập hỏng thì không ghi nhớ gì chưa thật sự chạy tình huống hỏng, nên chưa chứng minh được điều đó.
  Căn cứ: Hành vi sản phẩm chưa bị chứng minh sai; chỉ là bằng chứng yếu, bổ sung bài kiểm tra sau không mất dữ liệu của ai.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: high
  Đề xuất: known-limits

- **Shape 3 (status code in place of a relation): E9 'who imports for whom'**
  Người dùng thấy gì: Bài kiểm tra việc Trưởng nhóm nhập thay cho Đầu chủ chỉ xem mã trả lời, không xem tin rao có đúng người phụ trách hay không.
  Căn cứ: Chưa có lỗi thật được chỉ ra, chỉ là kiểm tra mỏng; bổ sung sau rẻ.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (a declared matrix that is only point cases): E9 permission table 4 roles × 2 actions, and E9 status table 5 cases**
  Người dùng thấy gì: Bảng quyền theo vai và bảng trạng thái căn mới được thử một phần, nên một vai hay trạng thái chưa thử có thể sai mà không ai biết.
  Căn cứ: Chưa thấy lỗi thật, chỉ thiếu ca thử; bổ sung sau rẻ và không ảnh hưởng người dùng.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (a declared 9-code matrix with only 5 point cases): E6 'can'**
  Người dùng thấy gì: Thứ tự tra mã căn mới được thử trên một phần số ca đã hứa, nên một thứ tự tra sai có thể lọt qua.
  Căn cứ: Chưa có hành vi sai thật được chỉ ra; thêm ca thử sau là rẻ.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (sweep of 3 files × 2 runs, only 4 runs): E7 'không mất ô'**
  Người dùng thấy gì: Phép thử rằng không ô nào bị mất mới chạy 4 trong 6 lượt đã hứa, nên một số trường hợp mất ô có thể chưa bị bắt.
  Căn cứ: Không có ô nào bị chứng minh là mất, chỉ là phép thử chưa đủ; bổ sung rẻ.
  file: `tests/nhap-excel-khong-mat-o.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (a declared 30-cell matrix, 11 cells pinned): E16 'trang thai'**
  Người dùng thấy gì: Một số trạng thái của màn Nạp tệp ở một số khổ màn hình chưa được kiểm tra tự động, nên lỗi hiển thị hay lỗi truy cập có thể lọt.
  Căn cứ: Chưa thấy lỗi hiển thị thật; người dùng tải lại được và thêm ca kiểm tra sau là rẻ.
  file: `tests/e2e-db/nhap-excel.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (a declared class with zero asserts): E11 points at a test file that does not exist**
  Người dùng thấy gì: Bài kiểm tra khớp mô hình nghiệp vụ với cơ sở dữ liệu được hứa nhưng chưa tồn tại, nên tiêu chí này xanh mà không đo gì.
  Căn cứ: Không phải lỗi người dùng gặp nhưng làm mất một lớp bảo vệ; viết bài kiểm tra sau là việc nhỏ.
  file: `_acceptance/nhap-excel/evals.yaml`
  severity: high
  Đề xuất: known-limits

- **Shape 1 (measures the rule function, not the import path's output): 'a new custom field from a column goes through row 7e's rules'**
  Người dùng thấy gì: Bài kiểm tra chưa chứng minh được đường nhập thật sự đi qua luật tạo trường riêng, nên nếu bước đó bị gỡ thì bài vẫn xanh.
  Căn cứ: Hành vi sai thật đã được ghi ở một mục khác; riêng bài kiểm tra yếu thì bổ sung sau rẻ.
  file: `tests/nhap-excel-ghep-cot.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (negative-only, no positive control in the same case): 'B sees none of A's imports' and 'B's team lead sees only B's'**
  Người dùng thấy gì: Bài kiểm tra cách ly giữa các sàn chỉ xem sàn B không thấy dữ liệu sàn A, chưa xem sàn B có thấy dữ liệu của chính mình, nên một lỗi làm ẩn hết cũng qua được.
  Căn cứ: Không có dữ liệu bị lộ hay mất; chỉ là bằng chứng chưa đầy đủ và bổ sung rẻ.
  file: `db/tests/cach-ly.sql`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (negative-only, no proof the screen reached the step with the button): BuyerAgent sees no Áp**
  Người dùng thấy gì: Bài kiểm tra việc Đầu khách không thấy nút Áp chưa chắc đã đến bước có nút, nên có thể xanh vì lý do khác.
  Căn cứ: Quyền này còn được chặn ở máy chủ, nên hậu quả nhẹ; không đáng mở việc riêng.
  file: `tests/nhap-excel-man.test.tsx`
  severity: low
  Đề xuất: wont-fix

- **Shape 2 (fixture made to the reader's check): khoa.xlsx is 12 bytes of magic**
  Người dùng thấy gì: Tệp thử khoá mật khẩu và tệp hỏng là tệp tự dựng chứ không phải từ Excel thật, nên tệp thật lạ có thể bị đọc sai mà chưa ai biết.
  Căn cứ: Hợp đồng đã ghi nhận thiếu tệp Excel thật; người dùng gặp tệp lạ sẽ thấy báo lỗi và thử lại được.
  file: `tests/fixtures/nhap-excel/tao.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 6 (hardcoded author path): the plugin measured is the owner's checkout**
  Người dùng thấy gì: Phép chấm của một việc khác phụ thuộc vào thư mục riêng trên máy của chủ kho, nên chạy ở máy khác có thể cho kết quả khác. Không ảnh hưởng người dùng sản phẩm.
  Căn cứ: Chỉ ảnh hưởng độ tin cậy của phép chấm trên máy khác, không đụng dữ liệu; sửa sau rẻ.
  file: `_acceptance/bring-out-claude-design/rang/matrix.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 6 (hardcoded author path): the 0.76.0 plugin measured from the owner's checkout**
  Người dùng thấy gì: Phép chấm việc nâng cấp công cụ thiết kế đọc bản làm việc đang mở của chủ kho nên kết quả đổi khi bản đó đổi. Không ảnh hưởng người dùng sản phẩm.
  Căn cứ: Chỉ làm kết quả chấm kém ổn định, không mất dữ liệu; có thể chấp nhận hoặc ghim bản sau.
  file: `_acceptance/upgrade-design-assembly-0-76-0/rang/matrix.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 5/27 lỗi rơi vào file không bộ đo nào phủ (governance/autonomy.yaml, _acceptance/nhap-excel/evals.yaml, tests/nhap-excel-man.test.tsx, _acceptance/bring-out-claude-design/rang/matrix.mjs, _acceptance/upgrade-design-assembly-0-76-0/rang/matrix.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
