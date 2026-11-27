# Review findings: sua-thong-tin-can (round 4)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Design (review-change step 9): the custom-value rule passes everything when no checker is given**
  Người dùng thấy gì: Người dùng thật không bị ảnh hưởng: máy chủ thật vẫn từ chối giá trị sai của cột riêng. Chỉ có bản mẫu dùng cho thử nghiệm nhận cả giá trị mà máy chủ sẽ từ chối, nên một bài thử có thể báo xanh dù máy chủ thật trả lỗi.
  Căn cứ: Nhẹ, vì không mất hay lộ dữ liệu của người dùng và chỉ làm bài thử có thể báo xanh nhầm. Sửa sau rẻ và có thể làm lúc nào cũng được.
  file: `src/modules/listings/save-door.ts`
  severity: low
  Đề xuất: known-limits

- **Custom/detail cell keeps the unsaved value on a conflict that carries no current listing (404), while the toast says the cell went back (r3)**
  Người dùng thấy gì: Khi căn vừa bị xoá hoặc không còn thuộc sàn, ô vẫn hiện giá trị người dùng vừa gõ dù chưa lưu, trong khi thông báo nói ô đã về giá trị cũ. Tải lại trang là thấy đúng.
  Căn cứ: Chỉ xảy ra khi căn biến mất giữa lúc sửa, hiếm gặp, không mất dữ liệu thật và tải lại trang là hết sai.
  file: `src/modules/listings/ui/use-listing-cell-edit.tsx`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 — đo chỉ dẫn thay vì đầu ra: 'o-rieng-quan-tri-khong-mo' chỉ gọi hàm quyền, không dựng ô cột riêng nào (r3)**
  Người dùng thấy gì: Bài kiểm tra chưa chứng minh được rằng Quản trị sàn không mở được ô cột riêng. Nếu sau này có người sửa lưới làm hở quyền, bài vẫn xanh.
  Căn cứ: Không ảnh hưởng người dùng hiện tại vì quyền đang đúng, chỉ làm lưới an toàn yếu đi; bổ sung bài sau này rẻ.
  file: `tests/sua-thong-tin-can.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 — fixture viết tay đúng khuôn bên đọc: CHECK chép lại customCheckOf thay vì dùng hàm route thật (r3)**
  Người dùng thấy gì: Một số bài kiểm tra về giá trị cột riêng đo bản chép trong bài, không đo đường máy chủ thật. Nếu đường thật lệch đi, các bài này không báo.
  Căn cứ: Người dùng không bị ảnh hưởng ngay; rủi ro chỉ là lỗi tương lai lọt qua, và còn một bài khác phủ một kiểu.
  file: `tests/sua-thong-tin-may-chu.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 — fixture viết tay: 'noi-that-cua-luu' tự viết thân trả lời 401/400 thay vì lấy từ handler thật (r3)**
  Người dùng thấy gì: Một bài kiểm tra màn dùng thân trả lời lỗi viết tay. Nếu máy chủ đổi dạng trả lời, bài này không phát hiện.
  Căn cứ: Không đổi gì cho người dùng hôm nay; bài chính của cửa lưu đã dùng trả lời thật nên rủi ro thấp.
  file: `tests/sua-thong-tin-can.test.tsx`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 + 5 — đối chứng dương trên chuỗi viết tay, và tuyên quét lớp «so status» nhưng chỉ liệt kê ba tên biến (r3)**
  Người dùng thấy gì: Bộ canh giữ để không ai thêm bảng mã lỗi thứ hai còn hở: vài cách viết so mã vẫn lọt. Người dùng có thể gặp thông báo lỗi lệch nhau nếu sau này có người viết như vậy.
  Căn cứ: Hiện chưa có lỗi thật, chỉ là lưới canh chưa kín; hậu quả nhẹ và sửa dần được.
  file: `tests/mot-luat-ghi.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — assertion âm tính một mình: ⌘B «không mở rộng thanh» thiếu đối chứng dương (r3)**
  Người dùng thấy gì: Bài kiểm tra việc bấm ⌘B không mở rộng thanh bên chưa chứng minh phím có tới nơi. Nếu phím hỏng, bài vẫn xanh.
  Căn cứ: Ngoài phạm vi tính năng này, chỉ là bài kiểm tra yếu, người dùng không mất gì.
  file: `tests/e2e/app-shell.spec.ts`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
