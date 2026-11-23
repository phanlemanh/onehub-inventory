## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Shape 3 (asserts a string is present when the promise is a relation): the pointers measure takes a file-wide comment label as proof that the check exists (r1)**
  Người dùng thấy gì: Một quyết định thiết kế có thể được tính là đã có kiểm tra chỉ vì tệp kiểm thử còn dòng ghi chú mang tên nó, dù chưa chắc có bài kiểm thử nào thật sự giữ quyết định đó. Người dùng cuối không thấy gì khác ngay, nhưng sau này một quyết định có thể mất kiểm tra mà bộ kiểm không báo.
  Căn cứ: Rủi ro nhẹ và chỉ ảnh hưởng độ chắc của lưới kiểm tra nội bộ, không làm mất dữ liệu; sửa sau được rẻ khi cần nên ghi là hạn chế đã biết.
  file: `_acceptance/design-assembly-adopt-checks/rang/kiem.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 3 (asserts a string is present when the promise is a relation): the shape measure prints '8 rows gained a check' as a fixed line and accepts a row whose check was changed rather than added (r1)**
  Người dùng thấy gì: Phép đo có thể báo đúng tám dòng được thêm kiểm tra trong khi một dòng thật ra chỉ bị đổi kiểm tra cũ. Với nhánh này điều đó không xảy ra, nên người dùng không bị ảnh hưởng.
  Căn cứ: Chỉ là kẽ hở trong công cụ chấm ở một tình huống chưa xảy ra, không ảnh hưởng người dùng hay dữ liệu; sửa sau rẻ nếu cần.
  file: `_acceptance/design-assembly-adopt-checks/rang/kiem.mjs`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
