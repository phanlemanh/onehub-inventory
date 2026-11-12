# Review findings: cach-ly-dang-xem-chi-ghi (round 2)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **SP-1 / Records: case 20 passes a security_invoker view that carries a DO INSTEAD rule, and the wiki and suite say nothing about this gap**
  Người dùng thấy gì: Bộ kiểm báo xanh cho một dạng xem có luật viết lại câu, nhưng qua luật đó một sàn vẫn có thể xoá dữ liệu của sàn khác. Người đọc hồ sơ sau này sẽ tưởng việc cách ly đã phủ mọi dạng xem ghi được.
  Căn cứ: Hợp đồng đã chủ động để ngoài phạm vi, và chỗ cần sửa chỉ là một câu ghi chú nên rẻ; ghi vào han chế đã biết là đủ để không ai hiểu nhầm.
  file: `db/tests/cach-ly.sql`
  severity: low
  Đề xuất: known-limits

- **E5 wording in evals.yaml gives the wrong number of pinned lines in the old runner**
  Người dùng thấy gì: Mô tả trong bản đánh giá nêu sai số dòng ghim của bộ chạy cũ, nên người đối chiếu từng chữ sẽ thấy lệch. Hành vi của sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ là lỗi chữ trong tài liệu, không mất hay lộ dữ liệu, người dùng không gặp; sửa rẻ nhưng không cấp bách, ghi lại là đủ.
  file: `_acceptance/cach-ly-dang-xem-chi-ghi/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (đo có mặt thay vì quan hệ): đối chứng dương của ca 20 đếm số tên dạng xem, không đếm từng quyền**
  Người dùng thấy gì: Phép đối chứng chỉ xác nhận dạng xem mẫu có xuất hiện, chưa chứng minh bộ kiểm nhận ra đủ cả ba quyền thêm, sửa, xoá. Nếu một nhánh nhận quyền hỏng thì vẫn có thể không bị phát hiện ở bước này.
  Căn cứ: Rủi ro nhỏ vì ba tệp phá thử đã đỡ từng quyền trên dạng xem thường, và không có dữ liệu thật nào bị lộ; chỉ là mức bảo đảm yếu hơn lời mô tả.
  file: `db/tests/cach-ly.sql`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét cả lớp nhưng chỉ có vài ca lẻ): đường cấp quyền qua vai cha không có tệp phá**
  Người dùng thấy gì: Trường hợp quyền ghi được cấp qua vai cha chưa có phép thử riêng; hiện được phủ nhờ cách hệ quản trị dữ liệu tự tính quyền thừa kế. Nếu cách tính đó đổi, lỗ hổng có thể lọt mà không ai biết.
  Căn cứ: Hợp đồng đã nêu thẳng điều này là chưa kiểm chứng và đường tương tự đã được chứng ở phần khác, nên rủi ro thấp; thêm ca thử sau cũng rẻ.
  file: `db/tests/cach-ly.sql`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
