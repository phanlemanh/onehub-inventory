## Trong hợp đồng

Không có finding nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Module door: database code exported from the catalog's browser-safe index.ts**
  Người dùng thấy gì: Không có gì hỏng với người dùng: hàm tra mã nằm ở chỗ dành cho phần chạy trên trình duyệt nhưng hiện chưa làm lộ gì ra ngoài. Đây chỉ là vấn đề tổ chức mã để sau này không vô tình đưa phần chạy trên máy chủ sang trình duyệt.
  Căn cứ: Hậu quả với người dùng hiện bằng không, không mất hay lộ dữ liệu; sửa sau cũng rẻ và không vội.
  file: `src/modules/catalog/index.ts`
  severity: low
  Đề xuất: known-limits

- **One rule, one place: the labelable concepts are written three times**
  Người dùng thấy gì: Hiện cả ba danh sách khớp nhau nên sàn dùng bình thường. Nếu sau này ai đó đổi một danh sách mà quên hai danh sách kia, sàn có thể đặt nhãn cho một cột không hiện, hoặc đặt tên trường riêng trùng tên một cột chuẩn.
  Căn cứ: Chưa gây lỗi nào cho người dùng và chỉ có thể xảy ra khi có người sửa danh sách; nếu xảy ra, người dùng tự đổi lại tên được và không mất dữ liệu.
  file: `src/modules/company-config/company-layer-http.ts`
  severity: low
  Đề xuất: known-limits

- **Domain: addCompanyLayer description does not match its doors**
  Người dùng thấy gì: Người dùng không thấy khác biệt nào: quyền thêm căn chờ khớp và mẫu nhập vẫn đúng như đã duyệt. Chỉ có câu mô tả cho người rà soát nói thiếu hai việc này nên dễ làm người đọc hiểu thiếu.
  Căn cứ: Chỉ là chữ mô tả, không ảnh hưởng dữ liệu hay quyền của ai; sửa sau chỉ là một dòng chữ.
  file: `ontology/actions.yaml`
  severity: low
  Đề xuất: known-limits

- **SP-1 signal touched without a named human check at the Evidence Gate (r1)**
  Người dùng thấy gì: Một dòng kiểm thử cố ý tắt luật cách ly giữa các sàn chưa được nêu đích danh cho chủ kho xem. Người dùng không bị ảnh hưởng, chỉ là chủ kho có thể bỏ sót dòng này khi duyệt.
  Căn cứ: Dòng này chỉ chạy trên cơ sở dữ liệu thử, không chạm dữ liệu thật của sàn nào, và chủ kho có thể thêm lời nhắc vào ghi chú bất cứ lúc nào.
  file: `db/tests/pha-thu/lop-rieng-khong-ep.sql`
  severity: medium
  Đề xuất: known-limits

- **High-tier tools/ change not named in the items waiting for owner approval (r1)**
  Người dùng thấy gì: Một thay đổi ở công cụ kiểm thử thuộc nhóm cần người duyệt chưa có trong danh sách chờ chủ kho. Người dùng cuối không thấy gì khác đi.
  Căn cứ: Không mất dữ liệu và không ảnh hưởng người dùng, chỉ là sổ ghi chép thiếu một dòng, bổ sung lại rất rẻ.
  file: `tools/e2e_templates/settle.ts`
  severity: medium
  Đề xuất: known-limits

- **Business rule in one place: the eight labelable concepts are written three times (r1)**
  Người dùng thấy gì: Danh sách tám khái niệm có thể đặt nhãn riêng được viết ở ba nơi. Nếu sau này sửa một nơi mà quên nơi khác, bảng nhãn và tiêu đề cột có thể lệch nhau.
  Căn cứ: Hiện cả ba nơi đang khớp nhau nên người dùng chưa gặp gì; rủi ro chỉ xuất hiện khi có thay đổi sau này và dễ phát hiện khi đó.
  file: `src/modules/company-config/company-layer-http.ts`
  severity: low
  Đề xuất: known-limits

- **Name clash check works in one direction only (label vs custom field) (r1)**
  Người dùng thấy gì: Sàn có thể đặt nhãn riêng trùng tên một trường riêng đang dùng, làm Bảng hàng có hai cột cùng tiêu đề. Người dùng sẽ khó phân biệt hai cột đó.
  Căn cứ: Không mất dữ liệu và người dùng tự gỡ được bằng cách đổi nhãn, nhưng là luật mới ngoài hợp đồng nên nên mở việc riêng cho đủ chiều.
  file: `src/modules/company-config/store.ts`
  severity: low
  Đề xuất: new-contract

- **Product language: field-kind names hard-coded in src/ (r1)**
  Người dùng thấy gì: Tên năm kiểu trường (Chữ, Số, Ngày, Chọn một, Có/không) đang viết thẳng trong mã thay vì lấy từ bộ nhãn chung. Người dùng vẫn thấy đúng chữ.
  Căn cứ: Màn hình hiển thị bình thường, không mất dữ liệu; chỉ khó đổi chữ đồng loạt sau này, sửa lúc nào cũng được.
  file: `src/modules/company-config/ui/copy.ts`
  severity: low
  Đề xuất: known-limits

- **Company label can take the name of a live custom field, so the inventory shows two columns with the same header and that field can no longer be edited (r1)**
  Người dùng thấy gì: Nếu sàn thêm trường riêng trước rồi đặt nhãn riêng trùng tên, Bảng hàng hiện hai cột cùng tiêu đề và trường đó không sửa được nữa trừ khi đổi tên. Người dùng sẽ bối rối vì báo lỗi tên đã dùng dù chỉ sửa lựa chọn.
  Căn cứ: Hậu quả vừa phải: không mất dữ liệu và gỡ được bằng cách đổi tên trường hoặc nhãn, nhưng gặp lỗi khó hiểu; nên làm thành việc riêng vì cần thêm luật chiều ngược.
  file: `src/modules/company-config/store.ts`
  severity: medium
  Đề xuất: new-contract

- **Shape 4: the store-error test only checks that the secret is absent and does not pin the fixed server-error body (r1)**
  Người dùng thấy gì: Khi máy chủ gặp lỗi, test chỉ chắc rằng không lộ thông tin nhạy cảm chứ chưa chắc người dùng nhận đúng thông báo lỗi cố định. Người dùng có thể nhận phản hồi trống hoặc khó hiểu.
  Căn cứ: Việc không lộ bí mật, điều nặng nhất, vẫn được kiểm; phần còn lại chỉ là chữ thông báo lỗi hiếm gặp, tải lại hay thử lại được.
  file: `src/modules/company-config/company-layer-http.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 4: the break cases for E1 and E4 do not break the code under test, so the refusal checks have no case that turns red (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hai ca thử phá được viết sao cho không làm hỏng đoạn mã thật, nên nếu luật từ chối bị gỡ nhầm thì test có thể vẫn xanh. Người dùng có thể nhận nhãn sai khái niệm mà không ai phát hiện sớm.
  Căn cứ: Luật từ chối hiện vẫn có test kiểm riêng và đang đúng; đây là lỗ hổng độ tin cậy của bộ test, bổ sung sau không gây hại.
  file: `tests/db/lop-rieng.db.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 1: the rule that internal data never reaches the customer page (SP-3) is checked by searching source code for names, not by checking the page's output (r1)**
  Người dùng thấy gì: Chưa có cách kiểm thực sự rằng nhãn và cột riêng của sàn không lộ ra trang khách; hiện chỉ dò tên trong mã. Lúc trang khách được dựng, cần kiểm lại bằng trang thật.
  Căn cứ: Trang khách còn chưa tồn tại nên chưa có gì để lộ; việc đo đúng chỗ đã được hẹn ở hàng dựng trang khách.
  file: `tests/lop-rieng-cot.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 1: the match test checks that a request is sent, not the message about matched and waiting units (r1)**
  Người dùng thấy gì: Test ở mức màn hình chưa kiểm câu báo bao nhiêu căn đã khớp, bao nhiêu còn chờ. Nếu câu này sai, người dùng đọc nhầm kết quả khớp.
  Căn cứ: Test trình duyệt đã kiểm đúng câu này nên rủi ro thấp, chỉ là bản kiểm thứ hai chưa chặt.
  file: `src/modules/company-config/ui/layer-screen.test.tsx`
  severity: low
  Đề xuất: known-limits

- **Shape 5: eval E2 promises four taken-name cases in the database test, but the test has three and does not pin the count (r1 · tệp đã đổi)**
  Người dùng thấy gì: Test cơ sở dữ liệu chỉ thử ba kiểu tên trùng thay vì bốn, thiếu ca trùng với nhãn riêng của sàn. Luật vẫn chạy nhưng ca này chưa được thử xuyên qua kho dữ liệu.
  Căn cứ: Luật tên trùng nhãn vẫn được kiểm ở tầng khác và chạy đúng, nên người dùng chưa gặp lỗi; thêm ca còn thiếu là việc nhỏ lúc nào cũng làm được.
  file: `tests/db/lop-rieng.db.test.ts`
  severity: low
  Đề xuất: known-limits

- **Inventory «Căn» column cut to «0…» at 1440, also for a company with only the eight standard columns**
  Người dùng thấy gì: Ở Bảng hàng khổ 1440, cột Căn bị cắt còn «0…» nên không đọc được mã căn; sàn không có cột riêng nào (chỉ tám cột chuẩn) cũng bị, nên lỗi có từ trước 7e, không do cột riêng gây ra.
  Căn cứ: Giám sát đã ghi thành nợ của kho (D-1411-2) và sẽ mở một hàng riêng có Cổng Phạm vi (G-1411-3); 7e không sửa để không chạm điều đã ký của hàng lưới.
  file: `src/components/candidate/column-kind.ts`
  severity: medium
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
