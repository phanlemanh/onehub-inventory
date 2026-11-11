# Review findings: app-shell-chon-tu-reui (round 1)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **nav.ts keeps a second copy of the listing status list, in a different order from the listings module**
  Người dùng thấy gì: Danh sách trạng thái hàng ở cột thứ hai có thể xếp khác thứ tự so với màn Bảng hàng. Nhân viên thấy hai thứ tự khác nhau, nhưng mọi trạng thái vẫn đủ và bấm vẫn đúng.
  Căn cứ: Hậu quả nhẹ: chỉ lệch thứ tự hiển thị, không mất hay sai dữ liệu; sửa sau rẻ và nên làm cùng hàng Bảng hàng khi có bộ lọc trạng thái thật.
  file: `src/app/(app)/nav.ts`
  severity: medium
  Đề xuất: known-limits

- **Company switch locks up and fails silently when the request errors**
  Người dùng thấy gì: Nếu mất mạng hoặc phiên hết hạn đúng lúc đổi sàn, nút đổi sàn có thể bị khoá và không báo lỗi gì. Người dùng phải tải lại trang mới đổi được.
  Căn cứ: Hậu quả vừa nhưng không mất dữ liệu và người dùng tự gỡ được bằng cách tải lại trang; tình huống hiếm và lỗi này đã có sẵn từ menu tài khoản cũ.
  file: `src/app/(app)/company-switch.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3: assert 'chuỗi có mặt' (tên không rỗng) trong khi lời hứa là quan hệ tên mục = nhãn màn**
  Người dùng thấy gì: Bài kiểm chưa bắt được trường hợp hai biểu tượng bị tráo tên cho nhau. Người dùng chỉ gặp điều này nếu sau này ai đó vô tình đảo nhãn.
  Căn cứ: Sản phẩm hiện không sai; đây là lưới an toàn hơi lỏng, nếu có lỗi thì người dùng thấy ngay trên màn và sửa rất rẻ.
  file: `tests/e2e/app-shell.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: assertion âm tính đứng một mình, không có đối chứng dương. Ô «Gõ mã căn» được tìm theo vai button nên bài không bao giờ bắt được nó**
  Người dùng thấy gì: Bài kiểm có thể không phát hiện nếu ô gõ mã căn vô tình xuất hiện trên thanh trên khi chưa có hồ sơ căn. Hiện tại ô này không được làm nên người dùng không bị ảnh hưởng.
  Căn cứ: Hiện chưa có hậu quả cho người dùng vì ô ấy không tồn tại; chỉ là lưới kiểm bỏ sót, sửa sau rẻ khi hàng có hồ sơ căn mở.
  file: `tests/e2e/app-shell.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3: assert 'chuỗi có mặt' bị thoả sẵn, không đo được tiêu đề nhóm của cột thứ hai**
  Người dùng thấy gì: Nếu tiêu đề nhóm ở cột thứ hai biến mất, bài kiểm vẫn xanh. Người dùng chỉ mất một dòng chữ phân nhóm, các lối tắt vẫn dùng được.
  Căn cứ: Hậu quả rất nhẹ, chỉ ảnh hưởng nhãn phân nhóm và không mất chức năng hay dữ liệu; sửa sau rẻ.
  file: `tests/app-shell.test.tsx`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
