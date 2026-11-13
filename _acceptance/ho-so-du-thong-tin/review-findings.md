# Review findings: ho-so-du-thong-tin (round 1)

## Trong hợp đồng

- **Hình dạng 3: «Lần 3, Lần 2, Lần 1» chỉ kiểm chữ có mặt theo thứ tự, trong khi lời hứa là xếp theo ngày tạo giảm dần**
  file: `tests/e2e/ho-so-du-thong-tin.spec.ts:62`
  severity: high
  AC: AC-7
  source: measurement
  detail: E7 hứa ba dòng xếp «theo thứ tự ngày tạo giảm dần». listedErrors chỉ so dãy chữ với `Lần ${n - i}`. Nhưng số «Lần» tính theo vị trí: listingsOfUnit (src/modules/listings/record.ts:73) gán `number: sorted.length - i`. Vì vậy dãy chữ luôn là Lần 3, 2, 1 dù sắp xếp đúng hay ngược chiều. Ca đối chứng chỉ đảo các nút li trong DOM, không làm sai chiều sắp xếp. Bài trong máy cũng không đóng được lỗ này. tests/ho-so-du-thong-tin.test.ts:233-240 lấy listed[0] làm lần mới nhất và listed[2] làm Lần 1, rồi chỉ assert `not.toBe` hai chiều, nên đảo chiều vẫn qua. tests/ho-so-du-thong-tin.test.tsx:740 so với data.listings[2], mà data lấy từ sampleRecords, cũng dựng bằng chính listingsOfUnit (vòng tròn). Không assert nào nối số «Lần k» hay dòng aria-current với originalEntryTimestamp. Nếu sắp xếp lật sang tăng dần thì mọi bài vẫn xanh, còn hồ sơ mở ra ở lần chào cũ nhất.
  rationale: AC-7 buộc liệt các lần chào mới trước; bài đo không phân biệt được chiều sắp xếp ngược nên AC chưa được chứng minh.

- **Hình dạng 3/4: giá sau khi chạm «Lần 1» chỉ kiểm khác lần mới nhất, không so với giá của Lần 1; ca đối chứng tự dựng thông điệp**
  file: `tests/e2e/ho-so-du-thong-tin.spec.ts:91`
  severity: high
  AC: AC-7
  source: measurement
  detail: E7 hứa giá ở thẻ căn «đổi sang giá trị của lần ấy (so với dữ liệu mẫu)». Đây là quan hệ bằng nhau với giá của first = data.listings[2]. Dòng 91 `if (priceNow === newestPrice) throw new Error("old listing price not shown")` chỉ là assert âm tính: hiện giá của Lần 2, hay bất kỳ giá nào khác, vẫn qua. Biến `first` có tính ra nhưng chỉ dùng cho trạng thái, không dùng cho giá. Ca đối chứng ở dòng 150-164 không chạy lại phép kiểm thật. Nó tự viết lại biểu thức `priceNow === newestPrice ? "old listing price not shown" : ""` rồi ghim chính chuỗi nó vừa dựng, nên chỉ chứng minh bản chép tay của phép so chứ không chứng minh bài dương bắt được lỗi.
  rationale: AC-7 buộc giá đổi sang giá của lần cũ được chạm; bài chỉ kiểm khác lần mới nhất nên không chứng minh được điều đó.

- **Hình dạng 3: «tám đầu cột như hàng 2» đo bằng arrayContaining, tức chỉ kiểm có mặt**
  file: `tests/e2e/ho-so-du-thong-tin.spec.ts:205`
  severity: medium
  AC: AC-8
  source: measurement
  detail: E8 hứa bảng có đúng tám đầu cột như hàng 2. Đây là quan hệ: đúng tập, đúng thứ tự, đúng số lượng. Bài dùng `expect.arrayContaining([...8 nhãn])`, nên thêm cột lạ hay đổi thứ tự cột vẫn qua. «60 dòng» cũng chỉ là `toContainText("60 dòng")` trên chữ chân bảng, không đếm số tr thật.
  rationale: AC-8 buộc Bảng hàng giữ đúng tám cột và 60 dòng; bài chỉ kiểm có mặt, không bắt được cột thừa hay sai thứ tự, không đếm dòng thật.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hard-coded party label «chủ nhà» (an alt label of Seller/Landlord) in record copy, and it slips past the language check because of case**
  Người dùng thấy gì: Câu «Chưa xác nhận với chủ nhà» luôn dùng chữ «chủ nhà», kể cả khi căn đang cho thuê hoặc sàn gọi người này bằng tên khác. Người dùng vẫn đọc hiểu được.
  Căn cứ: Hậu quả nhẹ: chỉ là cách gọi người chủ chưa đổi theo sàn hay theo bán/thuê, không mất dữ liệu, và sửa sau không đắt.
  file: `src/modules/listings/ui/record-copy.ts`
  severity: medium
  Đề xuất: known-limits

- **Unit kind words «Studio» / «NPN» are hard-coded in a module rule instead of labels.yaml**
  Người dùng thấy gì: Các chữ «Studio», «2PN»... nằm cố định trong chương trình, sàn không đổi được cách gọi. Người dùng vẫn thấy đúng loại căn.
  Căn cứ: Hậu quả nhẹ: hiển thị đúng như đã chốt, chỉ thiếu khả năng đổi tên theo sàn, việc này đã thuộc hàng sau.
  file: `src/modules/listings/record.ts`
  severity: medium
  Đề xuất: known-limits

- **The full record's card throws away the row's transaction, so lease listings show sale words**
  Người dùng thấy gì: Khi có lần chào cho thuê, hồ sơ sẽ hiện chữ của việc bán (trạng thái, giá). Hiện dữ liệu mẫu chưa có lần chào cho thuê nên chưa ai thấy.
  Căn cứ: Chưa ảnh hưởng người dùng vì chưa có dữ liệu cho thuê; không mất dữ liệu, sửa sau rẻ khi lần chào cho thuê xuất hiện.
  file: `src/modules/listings/ui/listing-record-full.tsx`
  severity: medium
  Đề xuất: known-limits

- **The full record opens on the newest listing of the unit, not the row that was clicked**
  Người dùng thấy gì: Nếu một lần chào hiện tại thiếu ngày tạo, hồ sơ có thể mở ra lần chào cũ hơn mà không báo. Với dữ liệu mẫu hiện nay điều này không xảy ra.
  Căn cứ: Chỉ lộ khi dữ liệu thiếu ngày tạo, hiện không có; không mất dữ liệu, người dùng tự chạm về lần mới nhất được, sửa sau rẻ.
  file: `src/modules/listings/ui/listing-record-full.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: ca đối chứng «chuỗi rỗng tính là có» không ghim thông điệp đã hứa; nhánh thông điệp ấy là mã chết**
  Người dùng thấy gì: Một bài tự kiểm của bộ đo báo lỗi bằng thông điệp khác với điều đã ghi, nhưng vẫn bắt được lỗi. Người dùng không thấy gì.
  Căn cứ: Không ảnh hưởng người dùng; lỗi vẫn bị bắt, chỉ sai lời mô tả, sửa sau rẻ.
  file: `tests/ho-so-du-thong-tin.test.ts`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 5: tên khối lần chào tuyên theo lớp trạng thái (mở / Closed, Withdrawn) nhưng chỉ có hai điểm**
  Người dùng thấy gì: Tên khối «Lần chào đang mở» hay «đang xem» mới được thử với hai trong sáu trạng thái. Có thể hiện sai tên ở trạng thái chưa thử.
  Căn cứ: Rủi ro thấp: chỉ là tên một khối và logic chung cho cả lớp trạng thái; sửa hay thêm bài đo sau đều rẻ.
  file: `tests/ho-so-du-thong-tin.test.tsx`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
