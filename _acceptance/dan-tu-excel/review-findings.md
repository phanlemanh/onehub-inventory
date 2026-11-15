# Review findings: dan-tu-excel (round 5)

# Review findings — dan-tu-excel (round 5)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 2 — fixture viết tay đúng khuôn bên đọc: phép lấp dòng ngắn của lưới được chép lại thay vì gọi hàm thật của lưới**
  Người dùng thấy gì: Bài kiểm tra cho việc dán một khối nhỏ vào vùng chọn lớn tự giả lập cách bảng lặp ô, nên nếu bảng thật đổi cách lặp thì bài kiểm tra này vẫn xanh. Người dùng chưa thấy lỗi nào hôm nay; rủi ro là một lỗi dán sai ô sau này lọt qua không bị báo.
  Căn cứ: Hôm nay dán vẫn đúng và không mất dữ liệu, chỉ là lưới an toàn của bài kiểm tra này yếu hơn vẻ ngoài; ghi lại để người sau biết, còn việc dán khối lặp đã có ca kiểm riêng ở màn hình.
  file: `src/components/candidate/paste-block.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên quét cả lớp nhưng chỉ có các ca điểm; phép đếm chỉ đếm chính danh sách ca**
  Người dùng thấy gì: Bài kiểm tra tự nhận là phủ mọi cách sắp cột nhưng chỉ thử từng cách riêng lẻ, chưa thử kết hợp như ghim hai bên cùng lúc hay ẩn cột kèm ghim. Người dùng sắp xếp cột theo kiểu kết hợp có thể gặp dán sai ô mà không bài kiểm tra nào bắt trước.
  Căn cứ: Hậu quả nhẹ vì cách sắp cột kết hợp ít gặp và người dùng xem trước ô sẽ đổi trước khi áp, nên lỡ sai vẫn thấy và hoàn tác được; bổ sung ca kiểm sau rẻ nhưng không gấp.
  file: `src/components/candidate/paste-block.test.ts`
  severity: low
  Đề xuất: known-limits

- **Short-row blanking maps block columns in the configured column order, not the order shown on screen, so a person who pins a column can lose real pasted values (r4 · tệp đã đổi)**
  Người dùng thấy gì: Neu nguoi dung ghim mot cot roi dan mot vung co dong ngan hon cac dong khac, ban xem truoc co the lang le bo mat mot gia hoac trang thai that, hoac giu lai mot chu khong dang co o do. Nguoi dung khong thay thong bao nao.
  Căn cứ: Chi xay ra khi dong thoi ghim cot va dan vung co dong ngan; ban xem truoc hien truoc khi ap nen nguoi dung con co the thay thieu o va dan lai, nhung loi im lang nen de bi bo sot, vi vay can ghi ro la han che da biet.
  file: `src/components/candidate/data-region.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên quét LỚP «on any column» nhưng chỉ có ba điểm-case, không có ma trận cột viết trước (r4)**
  Người dùng thấy gì: Nguoi dung khong gap loi nao ngay bay gio. Chi la ten bai thu hua rong hon so truong hop no that su kiem, nen sau nay mot thay doi co the lam o trong bi xu ly sai ma bai thu van xanh.
  Căn cứ: Khong anh huong nguoi dung hom nay va khong mat du lieu; neu sau nay co loi thi no se hien ra o cac bai thu khac hoac khi dung thu, nen chap nhan va ghi vet la du.
  file: `src/modules/listings/ui/listing-paste.test.ts`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 (assertion âm tính một mình): «Xác nhận lúc» chỉ được kiểm là khác giá trị cũ (r3)**
  Người dùng thấy gì: Khi một căn có một ô lưu được và một ô hỏng, bài thử chỉ chắc rằng thời điểm xác nhận không còn là giá trị cũ, chứ chưa chắc nó là đúng thời điểm mới. Nếu có lỗi làm ghi sai thời điểm, bài thử vẫn báo xanh và người dùng có thể thấy mốc xác nhận lệch.
  Căn cứ: Chỉ là bài thử còn lỏng ở một tình huống hiếm, chưa thấy dữ liệu nào sai thật và không mất dữ liệu; siết lại sau rẻ và an toàn, nên ghi lại là han chế đã biết.
  file: `src/modules/listings/ui/listing-paste.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình): kiểm 'bảng chưa đổi' bằng not.toContain trên ô đầu, không có đối chứng dương (r3)**
  Người dùng thấy gì: Bài thử xác nhận bảng chưa đổi trước khi bấm Áp chỉ nhìn ô giá đầu tiên và chỉ chắc nó không hiện giá mới. Nếu ô ở dòng khác bị đổi sớm thì bài thử có thể không phát hiện, nên người dùng có thể thấy giá đổi trước khi bấm Áp.
  Căn cứ: Rủi ro thấp: chỉ là bài thử kiểm chưa đủ rộng, không có dữ liệu bị mất và các bài thử khác cùng chặn việc ghi trước khi áp; ghi lại là hạn chế đã biết.
  file: `src/components/candidate/data-region-paste.test.tsx`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
