# Review findings: bang-hang-du-lieu-that (round 1)

## Trong hợp đồng

- **Hình dạng 3 (chỉ thấy chuỗi có mặt, trong khi lời hứa là một quan hệ): cuon-nam-nghin đạt ngay khi bất kỳ dòng «L-» nào hiện ra, không cần tới dòng cuối**
  file: `tests/e2e-db/bang-hang-that.spec.ts:625`
  severity: high
  AC: AC-10
  source: measurement
  detail: Lời hứa của phép thử (E10b) là bảng 5.000 căn cuộn được tới dòng cuối. Nhưng phép chờ kiểm `(await shownCodes(page)).includes("L-5000") || (await shownCodes(page)).some((c) => c.startsWith("L-"))`. Mọi căn của sàn này đều có mã «L-<n>», nên vế sau đúng ngay từ lần vẽ đầu tiên, khi trang còn ở đầu bảng. Vì vậy phép thử vẫn xanh dù lệnh cuộn (`scrollTo`) không làm gì, hoặc vùng chỉ vẽ ảo hoá tới dòng ~30. Lời hứa thật là một quan hệ: dòng cuối thứ tự = L-5000, hoặc mã dòng đang hiện là mã lớn nhất. Phép đo chỉ thấy một tiền tố có mặt, tức kiểm «chuỗi có mặt» thay cho quan hệ.

- **Hình dạng 4 (chỉ kiểm âm tính, không có đối chứng dương): bài kiểm luật dữ liệu nuốt mọi lỗi và không ghim ràng buộc nào đã từ chối**
  file: `tests/db/bang-hang-that.db.test.ts:424`
  severity: medium
  AC: AC-1
  source: measurement
  detail: Hàm `dataRules` ghi là đạt ở mọi lệnh ghi ném lỗi: `catch { // refused, as it should be }`. Nó không đọc mã lỗi hay tên ràng buộc. Phép phá `pha-thu-bo-check-da-ban` mới đối chứng được luật Closed. Hai ca «Withdrawn thiếu lý do» và «căn thứ hai đang mở» thì không có đối chứng dương: nếu lệnh insert hỏng vì lý do khác (thiếu cột bắt buộc, sai khoá ngoại, vi phạm RLS...), ca vẫn xanh. Phép tương đương ở cuối db/tests/cach-ly.sql có ghim tên ràng buộc qua `phai_loi(..., 'listings_withdrawn_needs_reason')` / `'listing_units_one_open'`. Bản TS này thì không.

- **Hình dạng 4 (chỉ kiểm âm tính, không ghim kết quả mong đợi): chuot-giua-the-moi chỉ kiểm thẻ mới có URL khác trang cũ**
  file: `tests/e2e-db/bang-hang-that.spec.ts:311`
  severity: medium
  AC: AC-3
  source: measurement
  detail: Câu `expect(tab.url()).not.toBe(before)` là phép đo duy nhất cho thẻ mới. Một thẻ about:blank hay một trang lỗi bất kỳ cũng làm câu này đúng. Lời hứa là bấm chuột giữa thì mở địa chỉ của mục cây (toà `building`) ở thẻ mới, nhưng phép thử không ghim đường dẫn hay nội dung của mục đó.

- **Hình dạng 3 (chỉ thấy chuỗi có mặt, trong khi lời hứa là một quan hệ): doc-dung-san nói «đọc đúng như đã lưu» nhưng chỉ kiểm có ít nhất một dòng mang giá trị**
  file: `tests/db/bang-hang-that.db.test.ts:164`
  severity: medium
  AC: AC-2
  source: measurement
  detail: Chú thích ghi «Custom fields and the fee inclusion are read as stored». Thế nhưng phép kiểm chỉ là `ofA.current.some((l) => l.feeInclusion === "Excluded")` và `ofA.current.some((l) => customFields["huong_view"])`. Lời hứa là quan hệ theo từng căn: giá trị đọc ra bằng giá trị trong `sampleInventoryData()` cho cùng `idOf(sampleId)`. Phép đo lại chỉ thấy giá trị có mặt ở đâu đó. Nếu bộ đọc tráo giá trị giữa các căn, hoặc gán cố định một phần, phép thử vẫn xanh.

- **Hình dạng 3 (chỉ thấy giá trị đổi, trong khi lời hứa là một quan hệ): dieu-kien-phi-tren-o chỉ kiểm tiền về tay chủ nhà «khác trước»**
  file: `tests/e2e-db/bang-hang-that.spec.ts:481`
  severity: low
  AC: AC-7
  source: measurement
  detail: Phép kiểm là `expect.poll(... net.innerText()).not.toBe(netBefore)`. Lời hứa «the net to seller changes» đúng nghĩa là một quan hệ: giá trị mới phải bằng giá trừ (hoặc không trừ) phí theo điều kiện «Không bao phí». Một ô chuyển sang «—», sang trạng thái đang tải, hay tính sai chiều cũng làm câu này đúng.

- **Hình dạng 1 (đo văn bản mã thay vì đầu ra): «một lần đọc mỗi lượt vẽ» được đếm bằng regex trên mã nguồn, không đếm lần đọc thật**
  file: `tests/bang-hang-that.test.ts:115`
  severity: medium
  AC: AC-3
  source: measurement
  detail: `readsPerRender` không vẽ trang và không đếm lần gọi bộ đọc. Nó suy ra số lần đọc từ văn bản: `/\bmyInventory\(/` trong layout/page, cộng `/export const inventorySource = cache\(/.test(source) ? 1 : 2`. Lời hứa E3b (App Shell và trang dùng chung một lần đọc mỗi lượt vẽ) là hành vi lúc chạy. Có những đường gọi mà regex không thấy nên vẫn xanh: gọi bộ đọc qua một hàm trung gian trong tệp khác, `cache` được khai báo nhưng khoá theo tham số khác nhau giữa shell và trang, hay một component con gọi `inventorySource` theo cách khác. Hai phép phá (pha-thu) cũng chỉ sửa chuỗi, nên chúng chỉ chứng minh regex bắt được đúng chuỗi đó.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The real save door reimplements the shared write-failure rule instead of using writeFetch/writeFailure**
  Người dùng thấy gì: Quy tắc báo lỗi khi lưu đang có hai bản, một ở Bảng hàng và một ở các màn khác. Hiện người dùng chưa thấy khác biệt, nhưng nếu sau này sửa một bản thì hai nơi có thể báo lỗi không giống nhau.
  Căn cứ: Hiện chưa làm người dùng mất dữ liệu hay thấy sai gì, chỉ có nguy cơ lệch về sau, và gộp lại sau này vẫn rẻ.
  file: `src/modules/listings/ui/http-save-door.ts`
  severity: medium
  Đề xuất: known-limits

- **The real save door reports server errors (500), an expired session (401) and an unreadable success body as 'refused', so a server fault looks like a missing permission**
  Người dùng thấy gì: Khi máy chủ gặp lỗi hoặc phiên đăng nhập hết hạn lúc sửa giá, người dùng bị báo là không có quyền thay vì lỗi hệ thống. Trong một trường hợp hiếm, thay đổi đã lưu nhưng ô lại quay về giá cũ, nên lần sửa kế tiếp của căn đó sẽ báo xung đột.
  Căn cứ: Thông báo sai gây hiểu nhầm nhưng không làm mất dữ liệu, và người dùng tải lại trang hoặc đăng nhập lại là gỡ được.
  file: `src/modules/listings/ui/http-save-door.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (chỉ kiểm âm tính, không có đối chứng dương): ca «vai không được sửa thì không mở ô phí» đo ô giá và kiểm toHaveCount(0) ngay sau F2**
  Người dùng thấy gì: Bài kiểm tra tự động cho việc vai chỉ được xem không mở được ô Điều kiện phí hơi lỏng: nó thử nhầm ô giá và không có ca đối chứng. Nếu sau này có người lỡ mở quyền sửa phí cho vai chỉ xem thì bài kiểm tra này có thể không báo. Người dùng hiện chưa gặp lỗi nào.
  Căn cứ: Đây chỉ là chỗ bài kiểm tra chưa chặt, không làm mất hay lộ dữ liệu của người dùng, và có thể bổ sung sau với chi phí thấp mà không ảnh hưởng ai.
  file: `tests/e2e-db/bang-hang-that.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (dữ liệu mẫu viết tay theo khuôn bên đọc): httpSaveDoor được thử bằng thân trả lời viết tay, không lấy từ createListingsHandlers**
  Người dùng thấy gì: Nếu phía máy chủ đổi hình dạng câu trả lời mà phía trình duyệt không đổi theo, các bài thử nhỏ vẫn xanh nên lỗi có thể lọt đến lúc người dùng thật sửa giá và gặp xung đột.
  Căn cứ: Rủi ro thấp vì có bài thử trình duyệt đầy đủ bắt phần lớn trường hợp, và sửa sau không tốn kém.
  file: `src/modules/listings/listings-http.test.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
