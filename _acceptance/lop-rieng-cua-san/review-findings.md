# Review findings: lop-rieng-cua-san (round 1)

## Trong hợp đồng

- **The isolation case covers only part of the five tables**
  file: db/tests/cach-ly.sql:707
  severity: low
  AC: AC-7
  source: invariants
  detail: AC-7 says the API role cannot delete from any of the five tables and that company A cannot write rows in company B's name. Case 21 tests writing in another company's name only on company_labels and the delete refusal only on company_fields. The break test (pha-thu) also covers only company_fields. Today the migration's loop sets the rules for all five tables, but a later migration could change one table on its own and this suite would not catch it. Fix: loop phai_loi over the five tables for both insert-for-B and delete.

- **Shape 3: the test only checks that the pending unit's unit_key is filled, when it should equal the new unit's key**
  file: tests/db/lop-rieng.db.test.ts:358
  severity: high
  AC: AC-5
  source: measurement
  detail: Eval E5 promises a relation: after a match, the pending unit 'SA5-12.08' gets unit_key equal to the key of the new catalog unit (S1.01-0502, whose original code was added at line 349) and gets matched_at. The test only checks presence: `expect(pending?.unitKey).toBeTruthy()`. A match that writes the wrong key still passes, for example the key of another unit, of the DUP-9 unit, or a key from another source. matched_at is never checked. The expected key is already in the test (`c.units.find(... unitNumber === '0502').unitKey`), so the assertion could be `toBe` that key. The count `{ matched: 2, waiting: 1 }` does not stop this either, because it only counts rows.

- **Shape 5: the four-refusal list is only counted, and three of the four cases do not pin which problem they show**
  file: tests/e2e-db/lop-rieng.spec.ts:242
  severity: medium
  AC: AC-11
  source: measurement
  detail: `const REFUSALS = ["name-taken", "options-count", "field-limit", "value-not-in-set"]` with `expect(REFUSALS).toHaveLength(4)` only checks the length of a constant. The array never drives the cases, so the count does not match the number of real checks (pattern P105). The cases are written one by one. Three of them check only `errorUnder(field, ...).toBeVisible()` (lines 247, 255, 286) and never compare the text with the problem being tested. Line 247 passes with any error under the name field, such as name-empty or name-too-long, not just name-taken. Line 286 passes with any error under the value field. Only field-limit pins its text ('20 cột riêng'). Eval E19 says 'ma trận viết trước 4 lỗi hằng 4'.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **SP-1 signal touched without a named human check at the Evidence Gate**
  Người dùng thấy gì: Một dòng kiểm thử cố ý tắt luật cách ly giữa các sàn chưa được nêu đích danh cho chủ kho xem. Người dùng không bị ảnh hưởng, chỉ là chủ kho có thể bỏ sót dòng này khi duyệt.
  Căn cứ: Dòng này chỉ chạy trên cơ sở dữ liệu thử, không chạm dữ liệu thật của sàn nào, và chủ kho có thể thêm lời nhắc vào ghi chú bất cứ lúc nào.
  file: `db/tests/pha-thu/lop-rieng-khong-ep.sql`
  severity: medium
  Đề xuất: known-limits

- **High-tier tools/ change not named in the items waiting for owner approval**
  Người dùng thấy gì: Một thay đổi ở công cụ kiểm thử thuộc nhóm cần người duyệt chưa có trong danh sách chờ chủ kho. Người dùng cuối không thấy gì khác đi.
  Căn cứ: Không mất dữ liệu và không ảnh hưởng người dùng, chỉ là sổ ghi chép thiếu một dòng, bổ sung lại rất rẻ.
  file: `tools/e2e_templates/settle.ts`
  severity: medium
  Đề xuất: known-limits

- **Business rule in one place: the eight labelable concepts are written three times**
  Người dùng thấy gì: Danh sách tám khái niệm có thể đặt nhãn riêng được viết ở ba nơi. Nếu sau này sửa một nơi mà quên nơi khác, bảng nhãn và tiêu đề cột có thể lệch nhau.
  Căn cứ: Hiện cả ba nơi đang khớp nhau nên người dùng chưa gặp gì; rủi ro chỉ xuất hiện khi có thay đổi sau này và dễ phát hiện khi đó.
  file: `src/modules/company-config/company-layer-http.ts`
  severity: low
  Đề xuất: known-limits

- **Name clash check works in one direction only (label vs custom field)**
  Người dùng thấy gì: Sàn có thể đặt nhãn riêng trùng tên một trường riêng đang dùng, làm Bảng hàng có hai cột cùng tiêu đề. Người dùng sẽ khó phân biệt hai cột đó.
  Căn cứ: Không mất dữ liệu và người dùng tự gỡ được bằng cách đổi nhãn, nhưng là luật mới ngoài hợp đồng nên nên mở việc riêng cho đủ chiều.
  file: `src/modules/company-config/store.ts`
  severity: low
  Đề xuất: new-contract

- **Product language: field-kind names hard-coded in src/**
  Người dùng thấy gì: Tên năm kiểu trường (Chữ, Số, Ngày, Chọn một, Có/không) đang viết thẳng trong mã thay vì lấy từ bộ nhãn chung. Người dùng vẫn thấy đúng chữ.
  Căn cứ: Màn hình hiển thị bình thường, không mất dữ liệu; chỉ khó đổi chữ đồng loạt sau này, sửa lúc nào cũng được.
  file: `src/modules/company-config/ui/copy.ts`
  severity: low
  Đề xuất: known-limits

- **Company label can take the name of a live custom field, so the inventory shows two columns with the same header and that field can no longer be edited**
  Người dùng thấy gì: Nếu sàn thêm trường riêng trước rồi đặt nhãn riêng trùng tên, Bảng hàng hiện hai cột cùng tiêu đề và trường đó không sửa được nữa trừ khi đổi tên. Người dùng sẽ bối rối vì báo lỗi tên đã dùng dù chỉ sửa lựa chọn.
  Căn cứ: Hậu quả vừa phải: không mất dữ liệu và gỡ được bằng cách đổi tên trường hoặc nhãn, nhưng gặp lỗi khó hiểu; nên làm thành việc riêng vì cần thêm luật chiều ngược.
  file: `src/modules/company-config/store.ts`
  severity: medium
  Đề xuất: new-contract

- **Shape 4: the store-error test only checks that the secret is absent and does not pin the fixed server-error body**
  Người dùng thấy gì: Khi máy chủ gặp lỗi, test chỉ chắc rằng không lộ thông tin nhạy cảm chứ chưa chắc người dùng nhận đúng thông báo lỗi cố định. Người dùng có thể nhận phản hồi trống hoặc khó hiểu.
  Căn cứ: Việc không lộ bí mật, điều nặng nhất, vẫn được kiểm; phần còn lại chỉ là chữ thông báo lỗi hiếm gặp, tải lại hay thử lại được.
  file: `src/modules/company-config/company-layer-http.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 4: the break cases for E1 and E4 do not break the code under test, so the refusal checks have no case that turns red**
  Người dùng thấy gì: Hai ca thử phá được viết sao cho không làm hỏng đoạn mã thật, nên nếu luật từ chối bị gỡ nhầm thì test có thể vẫn xanh. Người dùng có thể nhận nhãn sai khái niệm mà không ai phát hiện sớm.
  Căn cứ: Luật từ chối hiện vẫn có test kiểm riêng và đang đúng; đây là lỗ hổng độ tin cậy của bộ test, bổ sung sau không gây hại.
  file: `tests/db/lop-rieng.db.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 1: the rule that internal data never reaches the customer page (SP-3) is checked by searching source code for names, not by checking the page's output**
  Người dùng thấy gì: Chưa có cách kiểm thực sự rằng nhãn và cột riêng của sàn không lộ ra trang khách; hiện chỉ dò tên trong mã. Lúc trang khách được dựng, cần kiểm lại bằng trang thật.
  Căn cứ: Trang khách còn chưa tồn tại nên chưa có gì để lộ; việc đo đúng chỗ đã được hẹn ở hàng dựng trang khách.
  file: `tests/lop-rieng-cot.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 1: the match test checks that a request is sent, not the message about matched and waiting units**
  Người dùng thấy gì: Test ở mức màn hình chưa kiểm câu báo bao nhiêu căn đã khớp, bao nhiêu còn chờ. Nếu câu này sai, người dùng đọc nhầm kết quả khớp.
  Căn cứ: Test trình duyệt đã kiểm đúng câu này nên rủi ro thấp, chỉ là bản kiểm thứ hai chưa chặt.
  file: `src/modules/company-config/ui/layer-screen.test.tsx`
  severity: low
  Đề xuất: known-limits

- **Shape 5: eval E2 promises four taken-name cases in the database test, but the test has three and does not pin the count**
  Người dùng thấy gì: Test cơ sở dữ liệu chỉ thử ba kiểu tên trùng thay vì bốn, thiếu ca trùng với nhãn riêng của sàn. Luật vẫn chạy nhưng ca này chưa được thử xuyên qua kho dữ liệu.
  Căn cứ: Luật tên trùng nhãn vẫn được kiểm ở tầng khác và chạy đúng, nên người dùng chưa gặp lỗi; thêm ca còn thiếu là việc nhỏ lúc nào cũng làm được.
  file: `tests/db/lop-rieng.db.test.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
