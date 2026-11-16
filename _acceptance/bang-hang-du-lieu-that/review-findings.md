# Review findings: bang-hang-du-lieu-that (round 4)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 4 (một kiểm tra âm tính không có đối chứng dương): kiểm tra «lộ mã căn» và «vẫn có vùng hàng» trong khong-du-quyen-tren-man**
  Người dùng thấy gì: Bài kiểm tra tự động cho màn «Không đủ quyền» chưa chứng minh được là nó sẽ báo lỗi nếu màn này lỡ lộ mã căn hoặc vẫn hiện bảng hàng. Màn hiện tại vẫn đúng, nhưng nếu sau này có người làm hỏng thì bài kiểm tra có thể không bắt được.
  Căn cứ: Người dùng không gặp lỗi nào hôm nay, chỉ là lưới an toàn cho lần sửa sau yếu hơn mức mong muốn, và có thể bổ sung sau với chi phí rẻ.
  file: `tests/bang-hang-khong-du-quyen.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **The AC-8 matrix in the header still promises 40 frames after E8-ui dropped to 32 (r3 · tệp đã đổi)**
  Người dùng thấy gì: Ghi chú đầu bảng nghiệm thu vẫn nói chụp 40 khung trong khi thực tế chụp 32. Người chấm có thể tưởng thiếu ảnh, nhưng người dùng cuối không bị ảnh hưởng gì.
  Căn cứ: Chỉ là số liệu ghi chú lệch, không ảnh hưởng người dùng, sửa sau rất rẻ và không mất dữ liệu.
  file: `_acceptance/bang-hang-du-lieu-that/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **The matrix comment at the top still promises 40 AC-8 frames while E8-ui now takes 32 (r3 · tệp đã đổi)**
  Người dùng thấy gì: Ghi chú đầu bảng nghiệm thu nói 40 khung ảnh nhưng chỉ có 32, nên người chấm có thể tưởng thiếu ảnh. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ lệch số ghi chú, không ảnh hưởng người dùng, sửa sau rất rẻ.
  file: `_acceptance/bang-hang-du-lieu-that/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 — đo bước trung gian thay vì đầu ra: khung «Không đủ quyền» được giao cho một bài máy chỉ kiểm giá trị trả về, không kiểm thứ hiện lên màn (r3 · tệp đã đổi)**
  Người dùng thấy gì: Không có phép đo nào xác nhận người dùng thật sự thấy dòng «Không đủ quyền» trên màn. Nhưng hiện không vai thật nào gặp được màn này.
  Căn cứ: Chủ kho đã chọn đo bằng máy; không vai thật nào gặp trạng thái này nên rủi ro cho người dùng thấp, và người dùng tự tải lại được.
  file: `_acceptance/bang-hang-du-lieu-that/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **The real save door reimplements the shared write-failure rule instead of using writeFetch/writeFailure (r1)**
  Người dùng thấy gì: Quy tắc báo lỗi khi lưu đang có hai bản, một ở Bảng hàng và một ở các màn khác. Hiện người dùng chưa thấy khác biệt, nhưng nếu sau này sửa một bản thì hai nơi có thể báo lỗi không giống nhau.
  Căn cứ: Hiện chưa làm người dùng mất dữ liệu hay thấy sai gì, chỉ có nguy cơ lệch về sau, và gộp lại sau này vẫn rẻ.
  file: `src/modules/listings/ui/http-save-door.ts`
  severity: medium
  Đề xuất: known-limits

- **The real save door reports server errors (500), an expired session (401) and an unreadable success body as 'refused', so a server fault looks like a missing permission (r1)**
  Người dùng thấy gì: Khi máy chủ gặp lỗi hoặc phiên đăng nhập hết hạn lúc sửa giá, người dùng bị báo là không có quyền thay vì lỗi hệ thống. Trong một trường hợp hiếm, thay đổi đã lưu nhưng ô lại quay về giá cũ, nên lần sửa kế tiếp của căn đó sẽ báo xung đột.
  Căn cứ: Thông báo sai gây hiểu nhầm nhưng không làm mất dữ liệu, và người dùng tải lại trang hoặc đăng nhập lại là gỡ được.
  file: `src/modules/listings/ui/http-save-door.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (chỉ kiểm âm tính, không có đối chứng dương): ca «vai không được sửa thì không mở ô phí» đo ô giá và kiểm toHaveCount(0) ngay sau F2 (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm tra tự động cho việc vai chỉ được xem không mở được ô Điều kiện phí hơi lỏng: nó thử nhầm ô giá và không có ca đối chứng. Nếu sau này có người lỡ mở quyền sửa phí cho vai chỉ xem thì bài kiểm tra này có thể không báo. Người dùng hiện chưa gặp lỗi nào.
  Căn cứ: Đây chỉ là chỗ bài kiểm tra chưa chặt, không làm mất hay lộ dữ liệu của người dùng, và có thể bổ sung sau với chi phí thấp mà không ảnh hưởng ai.
  file: `tests/e2e-db/bang-hang-that.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (dữ liệu mẫu viết tay theo khuôn bên đọc): httpSaveDoor được thử bằng thân trả lời viết tay, không lấy từ createListingsHandlers (r1)**
  Người dùng thấy gì: Nếu phía máy chủ đổi hình dạng câu trả lời mà phía trình duyệt không đổi theo, các bài thử nhỏ vẫn xanh nên lỗi có thể lọt đến lúc người dùng thật sửa giá và gặp xung đột.
  Căn cứ: Rủi ro thấp vì có bài thử trình duyệt đầy đủ bắt phần lớn trường hợp, và sửa sau không tốn kém.
  file: `src/modules/listings/listings-http.test.ts`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
