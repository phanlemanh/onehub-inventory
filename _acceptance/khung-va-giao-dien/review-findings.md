# Review findings: khung-va-giao-dien (round 1)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Retrying from the save-failed banner skips what the caller does after a save, and online failures are silently lost**
  Người dùng thấy gì: Sau khi mất mạng rồi bấm «Thử lại» và lưu được, người dùng không thấy thông báo thành công và không có nút «Hoàn tác». Nếu lần thử lại gặp lỗi khác thì băng báo mất mạng vẫn nằm đó dù mạng đã có lại.
  Căn cứ: Không mất dữ liệu đã nhập, người dùng tự tải lại hoặc lưu lại được; lỗi nằm ở màn mẫu chưa có màn nghiệp vụ thật nào dùng, sửa sau không đắt.
  file: `src/components/templates/screen-banner.tsx`
  severity: high
  Đề xuất: known-limits

- **formatByKind shows the raw English code for status fields (and boolean/select/person)**
  Người dùng thấy gì: Nếu một ô trạng thái hay ô đúng/sai đi qua bộ định dạng chung, người dùng sẽ thấy mã tiếng Anh như «Active» hoặc «true» thay vì chữ tiếng Việt.
  Căn cứ: Hiện chưa có màn nào đưa các trường này qua bộ định dạng, nên chưa ai nhìn thấy; hàng Lưới sẽ xử lý các kiểu này nên ghi lại để hàng đó nhớ.
  file: `src/lib/format/index.ts`
  severity: medium
  Đề xuất: known-limits

- **SaveDemo does not handle errors that saveWithBanner rethrows; non-offline save failures give no feedback**
  Người dùng thấy gì: Trên trang mẫu chỉ có ở bản phát triển, nếu lưu hỏng khi vẫn có mạng thì người dùng không thấy báo gì và không biết là chưa lưu.
  Căn cứ: Chỉ ảnh hưởng trang mẫu của người phát triển, không tới nhân viên sàn; nhưng màn thật sao chép theo thì cần lưu ý nên ghi vào hạn chế đã biết.
  file: `src/app/(app)/proto/[slug]/frame-showcase.tsx`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình: nửa 'không có nhãn nội bộ' của trang không tìm thấy không có đối chứng dương, thông điệp chỉ ghim phần đầu**
  Người dùng thấy gì: Bài kiểm tra có thể vẫn xanh dù trang không tìm thấy lộ nhãn nội bộ, nên một lỗi lộ nhãn sau này có thể lọt qua mà không ai biết.
  Căn cứ: Sản phẩm hiện đúng, chỉ phần kiểm tra yếu hơn lời hứa; sửa bài kiểm tra rẻ nhưng không ảnh hưởng người dùng ngay.
  file: `tests/e2e/frame.spec.ts`
  severity: high
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình: 'không có khung chờ trước 1 giây' dùng toBeHidden tự thử lại, không phải phép đo tại 500 ms, và không có đối chứng**
  Người dùng thấy gì: Bài kiểm tra không chứng minh chắc rằng khung chờ chỉ hiện sau 1 giây, nên nếu sau này nó hiện sớm hoặc muộn thì có thể không bị phát hiện.
  Căn cứ: Hành vi thật đang đúng, rủi ro chỉ là hỏng âm thầm về sau; người dùng tối đa thấy khung chờ chớp sớm, không mất dữ liệu.
  file: `tests/e2e/frame.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Tuyên quét LỚP nhưng một ô trùng: ở khổ máy tính, màn thứ 9 'sidebar expanded' trùng màn /inventory, nên 18 lượt chỉ là 8 trạng thái khác nhau**
  Người dùng thấy gì: Bài quét trên máy tính đếm 18 lượt nhưng thực chất chỉ có 8 trạng thái khác nhau, nên độ phủ nhìn lớn hơn thật một chút.
  Căn cứ: Chỉ là số đếm hơi đẹp hơn thực tế, không ảnh hưởng người dùng; sửa không đáng công.
  file: `tests/e2e/frame.spec.ts`
  severity: low
  Đề xuất: wont-fix

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
