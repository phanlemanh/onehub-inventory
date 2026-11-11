## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Security / Design (review-change check 4, 9): forbidden-text scan no longer sees object keys in pin and counts**
  Người dùng thấy gì: Một mã khoá bản quyền hay chuỗi bí mật nếu bị viết làm tên trường trong phần ghim hoặc phần đếm thì lệnh kiểm vẫn báo xanh, trong khi trước đây còn bắt được. Lỗ hổng này chỉ xảy ra khi có người sửa tay tệp danh mục theo cách hiếm.
  Căn cứ: Hậu quả có thể lọt một mã bí mật vào kho mà không ai biết, nhưng cần sửa tay đúng chỗ hiếm; không mất dữ liệu người dùng, và sửa sau rẻ nên nên mở việc riêng.
  file: `tools/reui_catalog/catalog.mjs`
  severity: medium
  Đề xuất: new-contract

- **Domain: one rule in one place (check 3/9), and the README's fix steps are incomplete**
  Người dùng thấy gì: Hướng dẫn sửa lỗi trong tài liệu chưa nêu đủ chỗ cần đổi khi ReUI đổi tên mục thành phần gốc, nên người sửa có thể sửa thiếu và phải làm lại.
  Căn cứ: Chỉ làm người bảo trì mất thêm một lượt sửa khi nguồn đổi tiêu đề, người dùng cuối không bị ảnh hưởng, và ghi chú vào giới hạn đã biết là đủ.
  file: `tools/reui_catalog/catalog.mjs`
  severity: low
  Đề xuất: known-limits

- **The 'ReUI Primitives' entry in REQUIRED_SECTIONS has no effect on reading, and the guard that caught this was removed**
  Người dùng thấy gì: Nếu ai đó làm theo hướng dẫn và chỉ đổi tên mục thành phần gốc ở một chỗ, lệnh ghim lại có thể báo thành công nhưng làm mất cả 27 thành phần gốc khỏi danh mục, chỉ để lại các dòng báo đã bỏ.
  Căn cứ: Đây đúng là kiểu mất im lặng mà tính năng muốn ngăn, nhưng chỉ xảy ra sau một thao tác sai theo hướng dẫn và có dòng báo bỏ mục để nhận ra, người bảo trì khôi phục được bằng cách ghim lại; sửa rẻ nên nên làm ở việc riêng.
  file: `tools/reui_catalog/catalog.mjs`
  severity: medium
  Đề xuất: new-contract

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
