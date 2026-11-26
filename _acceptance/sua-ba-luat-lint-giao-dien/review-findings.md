# Review findings: sua-ba-luat-lint-giao-dien

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **no-partial-class flags whole classes joined with a choice in brackets (false positive)**
  Người dùng thấy gì: Một màn viết tên lớp theo kiểu cộng với một lựa chọn trong ngoặc có thể bị báo lỗi oan, và người viết phải thêm ngoại lệ có lý do. Mã hiện tại chưa viết kiểu này nên chưa ai gặp.
  Căn cứ: Chỉ gây báo lỗi oan lúc viết mã, không làm mất hay lộ dữ liệu, người viết tự tránh được bằng cách viết khác, và mã hiện có không dính.
  file: `tools/eslint-ui/rules/no-partial-class.mjs`
  severity: low
  Đề xuất: known-limits

- **no-partial-class misses a template-literal piece inside a + chain**
  Người dùng thấy gì: Một tên lớp ghép bằng dấu cộng nhưng viết bằng dấu huyền có thể lọt qua kiểm tra và không bị chặn. Giao diện vẫn chạy bình thường, chỉ là quy tắc viết liền tên lớp bị hở ở ca này.
  Căn cứ: Là kẽ hở của lớp kiểm tra chứ không làm hỏng sản phẩm đang chạy, không ảnh hưởng dữ liệu, và có thể bổ sung ở đợt sau với chi phí thấp.
  file: `tools/eslint-ui/rules/no-partial-class.mjs`
  severity: low
  Đề xuất: known-limits

- **Comment edited in this change is still Vietnamese in test code**
  Người dùng thấy gì: Một dòng chú thích trong tệp kiểm thử viết bằng tiếng Việt trong khi quy ước kho là tiếng Anh. Người dùng cuối không thấy và sản phẩm không đổi.
  Căn cứ: Chỉ là chuyện trình bày nội bộ, không ảnh hưởng người dùng hay dữ liệu, và sửa lúc nào cũng được nên không đáng mở việc riêng.
  file: `tests/eslint-ui/require-disable-reason.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **no-partial-class misses a '+' join when one side is a template literal, and when the join is wrapped in `as`**
  Người dùng thấy gì: Một số cách viết tên lớp ghép dở, như kèm chuỗi dấu huyền hoặc bọc khai báo kiểu, vẫn lọt qua kiểm tra. Giao diện không hỏng, nhưng quy tắc giữ tên lớp liền chưa chặn hết mọi cách viết.
  Căn cứ: Là hạn chế của lớp kiểm tra, không làm mất hay lộ dữ liệu, các ca đã khai trong hợp đồng đều được chặn, và có thể mở rộng sau khi thấy cách viết đó thật sự xuất hiện.
  file: `tools/eslint-ui/rules/no-partial-class.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính không ghim lý do): chiều đỏ của E5 ghim một tiền tố cũng khớp khi công cụ thiết kế sập**
  Người dùng thấy gì: Phép thử xác nhận luật khoảng cách có thể báo đỏ vì một lý do khác với lý do đã định, ví dụ công cụ kiểm tra bị sập. Khi đó người đọc kết quả có thể tin nhầm là luật đang làm đúng việc.
  Căn cứ: Chỉ làm bộ thử kém chặt trong tình huống hiếm là công cụ sập, không đụng người dùng hay dữ liệu, và sập như vậy thường lộ ra ở các bước khác.
  file: `_acceptance/sua-ba-luat-lint-giao-dien/rang/two-way.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (chỉ xét chuỗi có mặt thay cho lời hứa): E10 chỉ tìm mã dòng sổ, không xét trang có ghi quy ước**
  Người dùng thấy gì: Phép thử chỉ xác nhận có một trang nhắc đến mã dòng sổ, chưa xác nhận trang đó thật sự ghi quy ước ngoại lệ lint có lý do. Một trang không liên quan nhắc mã ấy vẫn được tính là đạt.
  Căn cứ: Chỉ làm phép thử tài liệu lỏng hơn lời hứa, trang thật hiện có đã ghi quy ước, không ảnh hưởng người dùng, và người đọc tài liệu tự phát hiện được.
  file: `_acceptance/sua-ba-luat-lint-giao-dien/rang/wiki.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
