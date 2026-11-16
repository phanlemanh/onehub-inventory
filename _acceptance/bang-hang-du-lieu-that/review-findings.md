# Review findings: bang-hang-du-lieu-that (round 2)

## Trong hợp đồng

(không có finding)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

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

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
