# Review findings: app-shell-khuon-dau-trang (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Ô tìm được căn giữa bằng absolute nên đè lên tên sàn dài ở thanh trên (từ 768 px trở lên)**
  Người dùng thấy gì: Trên máy tính bảng cỡ 768, nếu tên sàn dài (khoảng 25 ký tự trở lên) thì ô tìm che mất một phần tên sàn ở thanh trên, và tên không có dấu «…». Từ 1024 trở lên và trên điện thoại thì hầu như không gặp.
  Căn cứ: Chỉ ảnh hưởng chuyện đọc tên sàn ở một khổ trung gian và với tên rất dài; không mất dữ liệu, mọi chức năng vẫn dùng được, người dùng xoay máy hay phóng rộng cửa sổ là đọc được.
  file: `src/components/templates/app-shell.tsx`
  severity: medium
  Đề xuất: known-limits

- **Tài khoản khi chưa đăng nhập: trigger không có cổng `data-ready`, nên bấm trước khi trang chạy xong thì không mở gì, bài kiểm mới dễ chập chờn**
  Người dùng thấy gì: Nếu người chưa đăng nhập bấm «Tài khoản» ngay khi trang vừa hiện, trước khi trang sẵn sàng, thì chưa có gì mở ra và phải bấm lại sau một lát. Các bài kiểm tự động của phần này cũng có thể thỉnh thoảng đỏ oan trên máy chậm.
  Căn cứ: Chỉ trễ trong khoảnh khắc đầu khi mở trang, bấm lại là được, không mất dữ liệu; bài kiểm chập chờn thì chạy lại là xanh.
  file: `src/app/(app)/account-menu.tsx`
  severity: medium
  Đề xuất: known-limits

- **Nút gập cột thứ hai cố định ở z-30 đè lên mép trái nội dung màn từ 768 đến 1023 px**
  Người dùng thấy gì: Trên máy tính bảng khổ 768 đến 1023, nút gập cột che khoảng 12 px mép trái của nội dung và có thể giành mất cú bấm ở đó, ví dụ lên cột đầu của Bảng hàng.
  Căn cứ: Chỉ ở một dải khổ hẹp, che một lề rất nhỏ và người dùng vẫn thao tác được bằng cách bấm lệch vào trong; không mất dữ liệu.
  file: `src/components/templates/app-shell/second-column.tsx`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (và 3): phép kiểm «câu gợi ý hiện trọn» không bao giờ đỏ được, và không có bài đỏ đối chứng**
  Người dùng thấy gì: Bài kiểm tự động hiện không thể phát hiện nếu câu gợi ý trong ô tìm bị cắt chữ, nên nếu sau này ô bị hẹp lại, lỗi sẽ không bị bắt. Hiện chưa có bằng chứng là người dùng đang thấy chữ bị cắt.
  Căn cứ: Chưa gây hại cho người dùng ngay, chỉ là lưới an toàn yếu; nếu chữ bị cắt về sau thì chỉ xấu mắt, không mất dữ liệu.
  file: `tests/e2e/app-shell.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5: AC-5 hứa cho «mỗi màn nội bộ» nhưng bài chỉ kiểm vài màn chọn tay, không có danh sách màn viết trước**
  Người dùng thấy gì: Đầu trang mảnh chỉ được kiểm tự động trên một số màn, còn Hôm nay và vài phần khác thì không. Nếu một màn đó bị đầu trang to lại thì không có bài nào báo.
  Căn cứ: Chưa thấy màn nào sai thật, chỉ là phủ kiểm chưa đủ; nếu sai thì chỉ là giao diện xấu, không mất dữ liệu, và sửa sau rẻ.
  file: `tests/e2e/app-shell.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1: bài đơn vị đo chuỗi lớp Tailwind thay cho kết quả hiển thị (ẩn trên máy tính, viền chạy hết chiều cao)**
  Người dùng thấy gì: Một vài bài kiểm nhanh chỉ soi tên kiểu giao diện chứ không soi kết quả thật, nên có thể đỏ oan khi đổi cách viết hoặc xanh dù hiển thị sai. Các bài trên trình duyệt thật đã kiểm đúng chỗ này.
  Căn cứ: Người dùng không bị ảnh hưởng gì; bài trình duyệt thật đã che đúng rủi ro này nên sửa thêm không đáng công.
  file: `tests/app-shell.test.tsx`
  severity: low
  Đề xuất: wont-fix

## Chưa adversarial-verify (refuter chết)

Không có mục nào.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
