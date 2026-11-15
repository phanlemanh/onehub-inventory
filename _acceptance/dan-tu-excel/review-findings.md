# Review findings: dan-tu-excel (round 3)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 4 (assertion âm tính một mình): «Xác nhận lúc» chỉ được kiểm là khác giá trị cũ**
  Người dùng thấy gì: Khi một căn có một ô lưu được và một ô hỏng, bài thử chỉ chắc rằng thời điểm xác nhận không còn là giá trị cũ, chứ chưa chắc nó là đúng thời điểm mới. Nếu có lỗi làm ghi sai thời điểm, bài thử vẫn báo xanh và người dùng có thể thấy mốc xác nhận lệch.
  Căn cứ: Chỉ là bài thử còn lỏng ở một tình huống hiếm, chưa thấy dữ liệu nào sai thật và không mất dữ liệu; siết lại sau rẻ và an toàn, nên ghi lại là han chế đã biết.
  file: `src/modules/listings/ui/listing-paste.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình): kiểm 'bảng chưa đổi' bằng not.toContain trên ô đầu, không có đối chứng dương**
  Người dùng thấy gì: Bài thử xác nhận bảng chưa đổi trước khi bấm Áp chỉ nhìn ô giá đầu tiên và chỉ chắc nó không hiện giá mới. Nếu ô ở dòng khác bị đổi sớm thì bài thử có thể không phát hiện, nên người dùng có thể thấy giá đổi trước khi bấm Áp.
  Căn cứ: Rủi ro thấp: chỉ là bài thử kiểm chưa đủ rộng, không có dữ liệu bị mất và các bài thử khác cùng chặn việc ghi trước khi áp; ghi lại là hạn chế đã biết.
  file: `src/components/candidate/data-region-paste.test.tsx`
  severity: low
  Đề xuất: known-limits

- **Dòng Excel ít cột hơn: lưới lặp chữ của dòng ấy vào cột thiếu (thấy khi chụp ảnh trang cổng, chưa qua lượt chấm)**
  Người dùng thấy gì: Dán bốn dòng mà dòng thứ ba chỉ có hai ô thì ô thứ ba của dòng ấy hiện trong ngăn «Bị bỏ» với chữ của ô đầu (ví dụ căn 1303 · Diện tích «Đã bán» — thuộc tính căn). Không ô nào bị ghi sai: ô ấy luôn bị bỏ, và ô chữ lặp vào cột Giá chào hay Trạng thái vẫn qua đúng luật đọc. Chỉ có câu trong bản xem trước dễ gây hiểu nhầm.
  Căn cứ: Cách lấp dòng thiếu là của lưới ReUI (tệp nhà cung cấp, không sửa); muốn bỏ phải đối chiếu từng ô với khối đã dán. Không mất hay ghi sai dữ liệu; hiếm khi bảng Excel có dòng ngắn giữa vùng chép.
  file: `src/components/candidate/data-region.tsx`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
