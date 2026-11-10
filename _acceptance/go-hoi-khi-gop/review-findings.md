# Review findings: go-hoi-khi-gop (round 2)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Gộp thường hết hỏi cho mọi mức rủi ro, trái chính sách 'máy chỉ đề xuất, người duyệt', và GitHub không chặn thay**
  Người dùng thấy gì: Máy có thể gộp thay đổi ở mức rủi ro cao mà không có người nào bấm duyệt, dù chính sách của kho ghi là người phải duyệt. GitHub hiện cũng không đòi người duyệt nên không có chốt nào đỡ.
  Căn cứ: Chủ kho đã chủ ý gỡ bước hỏi và việc siết lại thuộc quyền sửa chính sách của người, nên ghi rõ hạn chế này rồi giao hàng như hiện tại là hợp lý.
  file: `.claude/settings.json`
  severity: high
  Đề xuất: known-limits

- **Coi squash là 'trái nếp của kho' trong khi tài liệu và công cụ của kho quy định squash-merge**
  Người dùng thấy gì: Kiểu gộp mà tài liệu của kho quy định thì vẫn bị hỏi, còn kiểu tài liệu không dùng thì được đi thẳng. Tài liệu và thực tế đang nói khác nhau nên người đọc có thể hiểu sai nếp làm việc.
  Căn cứ: Không mất dữ liệu và chỉ gây thêm hoặc bớt một lần hỏi, nhưng cần chủ kho quyết nếp nào là đúng rồi sửa tài liệu cho khớp, nên đáng làm thành việc riêng.
  file: `tests/permissions.test.ts`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 5 - Tuyên quét LỚP nhưng chỉ có điểm-case: luật duyệt PR được viết lại cho mọi vị trí cờ, nhưng chỉ đo một dạng lệnh**
  Người dùng thấy gì: Một số cách viết lệnh duyệt PR có thể không còn bị hỏi, và bộ kiểm sẽ không phát hiện nếu sau này luật bị thu hẹp. Máy thường viết cờ đầy đủ nên khả năng gặp thấp.
  Căn cứ: Chỉ có thể thêm hoặc bớt một lần hỏi chứ không làm mất dữ liệu, và bổ sung ca đo sau này rất rẻ nên ghi hạn chế là đủ.
  file: `tests/permissions.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 - Fixture VIẾT TAY đúng khuôn bên đọc: mọi AC-1/2/3 đi qua bộ so khớp tự viết, bảng đối chứng cũng viết tay theo chính bộ so khớp đó**
  Người dùng thấy gì: Bộ kiểm chỉ chứng minh luật khớp theo cách hiểu của người viết, chưa chứng minh công cụ thật áp đúng như vậy. Chỉ lần gộp thật đầu tiên mới xác nhận được.
  Căn cứ: Chưa thấy ca nào sai và hợp đồng đã nói trước giới hạn này, nếu lệch thì người dùng chỉ thấy thêm một hộp xin phép và tự xử lý được.
  file: `tests/permissions.test.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
