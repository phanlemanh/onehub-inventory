# Review findings: dat-khoa-mot-lenh (round 1)

## Trong hợp đồng

Không có finding nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The list of variables banned from a production build and the login role name are now kept in a second place, and no test keeps the two in step**
  Người dùng thấy gì: Hôm nay bản đưa lên chạy đúng. Nhưng nếu sau này thêm một biến bị cấm ở một chỗ mà quên chỗ kia, bản đưa lên vẫn chạy xong rồi ứng dụng mới từ chối khởi động.
  Căn cứ: Chưa gây hại cho người dùng lúc này, chỉ có nguy cơ khi có người sửa danh sách sau này, và lỗi hiện ra rõ ngay sau khi đưa bản lên nên tự gỡ được.
  file: `tools/deploy/len-ban.mjs`
  severity: medium
  Đề xuất: known-limits

- **The check for banned variables on Vercel passes silently when the Vercel reply is not the expected shape**
  Người dùng thấy gì: Nếu Vercel trả về một câu trả lời lạ nhưng vẫn báo thành công, bước kiểm biến cấm bỏ qua mà không báo gì, rồi vẫn đẩy biến lên.
  Căn cứ: Tình huống hiếm vì Vercel thường trả đúng khuôn, và nếu xảy ra thì biến cấm chỉ làm ứng dụng không khởi động, chủ kho gỡ được bằng cách xoá biến rồi đưa bản lên lại.
  file: `tools/deploy/len-ban.mjs`
  severity: low
  Đề xuất: known-limits

- **Answers are trimmed when typed but not when piped, so a trailing space can be stored in a secret**
  Người dùng thấy gì: Khi dán khoá qua đường ống thay vì gõ tay, một khoảng trắng thừa ở cuối có thể bị lưu vào khoá của Resend hay khoá bỏ qua của Vercel, làm khoá đó không dùng được.
  Căn cứ: Chủ kho thường gõ tay nên ít gặp, và nếu gặp thì chỉ cần chạy lại lệnh đặt khoá, không mất dữ liệu.
  file: `tools/deploy/dat-khoa.mjs`
  severity: low
  Đề xuất: known-limits

- **The step that pushes variables to Vercel ignores the API's reply, so a variable Vercel refused to write still counts as done**
  Người dùng thấy gì: Nếu Vercel từ chối ghi một biến nhưng vẫn trả thành công, lệnh vẫn báo đạt và đưa bản lên với giá trị cũ hoặc thiếu, nên khoá mới có thể chưa có hiệu lực khi xoay khoá.
  Căn cứ: Hậu quả khá nặng vì khoá cũ có thể lặng lẽ còn dùng sau khi xoay, nhưng cần Vercel từ chối đúng kiểu hiếm và sửa rẻ, đáng làm thành việc riêng.
  file: `tools/deploy/len-ban.mjs`
  severity: medium
  Đề xuất: new-contract

- **Shape 2: hand-written fixtures in the reader's format; nothing round-trips the secrets make dat-khoa writes through make deploy, which reads them**
  Người dùng thấy gì: Không có bài kiểm nào cho thấy khoá do lệnh đặt khoá sinh ra được lệnh đưa bản lên chấp nhận. Nếu sau này đổi khuôn khoá ở một bên, bên kia có thể từ chối mà không ai biết trước.
  Căn cứ: Hôm nay hai bên khớp nhau, rủi ro chỉ xuất hiện khi có người đổi khuôn, và lỗi hiện ra ngay ở bước cấu hình của lần đưa bản lên nên không mất dữ liệu.
  file: `tools/deploy/deploy.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 4: the old-manual-steps check only ever asserts it found nothing, with no positive control**
  Người dùng thấy gì: Bài kiểm sổ tay chỉ chứng minh hôm nay không còn việc tay cũ, chưa chứng minh nó sẽ bắt được nếu việc cũ quay lại bằng chữ hoa hay chữ thường khác.
  Căn cứ: Sổ tay hôm nay đúng, và nếu việc cũ quay lại thì chỉ là một dòng hướng dẫn thừa, không gây mất dữ liệu và sửa lại rất rẻ.
  file: `tools/deploy/so-tay-khop.test.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
