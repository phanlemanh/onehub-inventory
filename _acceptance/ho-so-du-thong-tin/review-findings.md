# Review findings: ho-so-du-thong-tin (round 2)

## Trong hợp đồng

Không có finding nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Unit test stubs scrollIntoView, but the record never calls it**
  Người dùng thấy gì: Không có gì thay đổi với người dùng. Chỉ là một dòng chuẩn bị trong bài kiểm thử không còn tác dụng, gây hiểu nhầm nhẹ cho người đọc mã.
  Căn cứ: Nhẹ: người dùng không thấy gì, không mất hay lộ dữ liệu, và dọn dòng thừa này sau này rất rẻ nên không đáng mở thêm việc.
  file: `tests/ho-so-du-thong-tin.test.tsx`
  severity: low
  Đề xuất: wont-fix

- **Listing record reaches into RecordPanel's inner DOM slot to reset scroll**
  Người dùng thấy gì: Hiện hồ sơ vẫn cuộn về đầu đúng khi chọn lần chào khác. Nhưng nếu sau này khung hồ sơ đổi cách dựng, hồ sơ có thể âm thầm không cuộn về đầu nữa và người dùng phải tự kéo lên.
  Căn cứ: Nhẹ: chưa gây lỗi nào cho người dùng, không mất dữ liệu, nếu xảy ra thì chỉ là phải kéo lên tay và bài kiểm tra trình duyệt hiện vẫn bắt được; ghi lại để lưu ý khi đổi khung hồ sơ.
  file: `src/modules/listings/ui/listing-record-full.tsx`
  severity: low
  Đề xuất: known-limits

- **Hard-coded party label «chủ nhà» (an alt label of Seller/Landlord) in record copy, and it slips past the language check because of case (r1)**
  Người dùng thấy gì: Câu «Chưa xác nhận với chủ nhà» luôn dùng chữ «chủ nhà», kể cả khi căn đang cho thuê hoặc sàn gọi người này bằng tên khác. Người dùng vẫn đọc hiểu được.
  Căn cứ: Hậu quả nhẹ: chỉ là cách gọi người chủ chưa đổi theo sàn hay theo bán/thuê, không mất dữ liệu, và sửa sau không đắt.
  file: `src/modules/listings/ui/record-copy.ts`
  severity: medium
  Đề xuất: known-limits

- **Unit kind words «Studio» / «NPN» are hard-coded in a module rule instead of labels.yaml (r1)**
  Người dùng thấy gì: Các chữ «Studio», «2PN»... nằm cố định trong chương trình, sàn không đổi được cách gọi. Người dùng vẫn thấy đúng loại căn.
  Căn cứ: Hậu quả nhẹ: hiển thị đúng như đã chốt, chỉ thiếu khả năng đổi tên theo sàn, việc này đã thuộc hàng sau.
  file: `src/modules/listings/record.ts`
  severity: medium
  Đề xuất: known-limits

- **The full record's card throws away the row's transaction, so lease listings show sale words (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi có lần chào cho thuê, hồ sơ sẽ hiện chữ của việc bán (trạng thái, giá). Hiện dữ liệu mẫu chưa có lần chào cho thuê nên chưa ai thấy.
  Căn cứ: Chưa ảnh hưởng người dùng vì chưa có dữ liệu cho thuê; không mất dữ liệu, sửa sau rẻ khi lần chào cho thuê xuất hiện.
  file: `src/modules/listings/ui/listing-record-full.tsx`
  severity: medium
  Đề xuất: known-limits

- **The full record opens on the newest listing of the unit, not the row that was clicked (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu một lần chào hiện tại thiếu ngày tạo, hồ sơ có thể mở ra lần chào cũ hơn mà không báo. Với dữ liệu mẫu hiện nay điều này không xảy ra.
  Căn cứ: Chỉ lộ khi dữ liệu thiếu ngày tạo, hiện không có; không mất dữ liệu, người dùng tự chạm về lần mới nhất được, sửa sau rẻ.
  file: `src/modules/listings/ui/listing-record-full.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: ca đối chứng «chuỗi rỗng tính là có» không ghim thông điệp đã hứa; nhánh thông điệp ấy là mã chết (r1)**
  Người dùng thấy gì: Một bài tự kiểm của bộ đo báo lỗi bằng thông điệp khác với điều đã ghi, nhưng vẫn bắt được lỗi. Người dùng không thấy gì.
  Căn cứ: Không ảnh hưởng người dùng; lỗi vẫn bị bắt, chỉ sai lời mô tả, sửa sau rẻ.
  file: `tests/ho-so-du-thong-tin.test.ts`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 5: tên khối lần chào tuyên theo lớp trạng thái (mở / Closed, Withdrawn) nhưng chỉ có hai điểm (r1 · tệp đã đổi)**
  Người dùng thấy gì: Tên khối «Lần chào đang mở» hay «đang xem» mới được thử với hai trong sáu trạng thái. Có thể hiện sai tên ở trạng thái chưa thử.
  Căn cứ: Rủi ro thấp: chỉ là tên một khối và logic chung cho cả lớp trạng thái; sửa hay thêm bài đo sau đều rẻ.
  file: `tests/ho-so-du-thong-tin.test.tsx`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
