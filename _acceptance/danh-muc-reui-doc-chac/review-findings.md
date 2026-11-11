## Trong hợp đồng

Không có finding nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Records: the product-rule touch record does not cover the final code**
  Người dùng thấy gì: Không ảnh hưởng gì tới người dùng cuối: tính năng chạy đúng như cũ. Chỉ là biên bản kiểm tra việc có chạm luật sản phẩm hay không được ghi tới một mốc cũ hơn bản mã cuối cùng, dù kết luận vẫn đúng.
  Căn cứ: Hậu quả nhẹ, không mất hay lộ dữ liệu, kết luận trong biên bản vẫn đúng, và vòng kiểm tiếp theo tính lại biên bản này rất rẻ nên chỉ cần ghi lại là hạn chế đã biết.
  file: `_acceptance/danh-muc-reui-doc-chac/luat-cham.json`
  severity: low
  Đề xuất: known-limits

- **Design: business rule in one place / README fix path (ReUI Primitives label still hard-coded in parseIndex) (r2 · tệp đã đổi)**
  Người dùng thấy gì: Nếu sau này ReUI đổi cách ghi tiêu đề nhóm thành phần gốc và người ghim lại chỉ sửa theo hướng dẫn trong tệp mô tả, lệnh ghim lại có thể lại lặng lẽ bỏ cả nhóm này mà vẫn báo thành công.
  Căn cứ: Hậu quả nặng nếu xảy ra (mất cả nhóm mà không báo) nhưng chỉ xuất hiện khi nguồn đổi lần nữa và người sửa làm đúng một nửa; lỗi lộ ra ở lần so sánh danh mục sau đó nên người dùng tự phát hiện và sửa được, chi phí sửa sau rẻ.
  file: `tools/reui_catalog/catalog.mjs`
  severity: medium
  Đề xuất: known-limits

- **Records honesty: AC-7 is listed under wont_do on the card (r2 · tệp đã đổi)**
  Người dùng thấy gì: Thẻ tóm tắt cho người duyệt xếp một tiêu chí phải đạt vào nhóm việc không làm, nên người đọc thẻ có thể hiểu nhầm tiêu chí ấy nằm ngoài phạm vi.
  Căn cứ: Chỉ gây hiểu nhầm khi đọc thẻ, không mất hay lộ dữ liệu, hợp đồng gốc vẫn ghi đúng nên người duyệt đối chiếu được, và sửa lại sau rất rẻ.
  file: `_acceptance/danh-muc-reui-doc-chac/card-plain.json`
  severity: low
  Đề xuất: known-limits

- **Security / Design (review-change check 4, 9): forbidden-text scan no longer sees object keys in pin and counts (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một mã khoá bản quyền hay chuỗi bí mật nếu bị viết làm tên trường trong phần ghim hoặc phần đếm thì lệnh kiểm vẫn báo xanh, trong khi trước đây còn bắt được. Lỗ hổng này chỉ xảy ra khi có người sửa tay tệp danh mục theo cách hiếm.
  Căn cứ: Hậu quả có thể lọt một mã bí mật vào kho mà không ai biết, nhưng cần sửa tay đúng chỗ hiếm; không mất dữ liệu người dùng, và sửa sau rẻ nên nên mở việc riêng.
  file: `tools/reui_catalog/catalog.mjs`
  severity: medium
  Đề xuất: new-contract

- **Domain: one rule in one place (check 3/9), and the README's fix steps are incomplete (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hướng dẫn sửa lỗi trong tài liệu chưa nêu đủ chỗ cần đổi khi ReUI đổi tên mục thành phần gốc, nên người sửa có thể sửa thiếu và phải làm lại.
  Căn cứ: Chỉ làm người bảo trì mất thêm một lượt sửa khi nguồn đổi tiêu đề, người dùng cuối không bị ảnh hưởng, và ghi chú vào giới hạn đã biết là đủ.
  file: `tools/reui_catalog/catalog.mjs`
  severity: low
  Đề xuất: known-limits

- **The 'ReUI Primitives' entry in REQUIRED_SECTIONS has no effect on reading, and the guard that caught this was removed (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu ai đó làm theo hướng dẫn và chỉ đổi tên mục thành phần gốc ở một chỗ, lệnh ghim lại có thể báo thành công nhưng làm mất cả 27 thành phần gốc khỏi danh mục, chỉ để lại các dòng báo đã bỏ.
  Căn cứ: Đây đúng là kiểu mất im lặng mà tính năng muốn ngăn, nhưng chỉ xảy ra sau một thao tác sai theo hướng dẫn và có dòng báo bỏ mục để nhận ra, người bảo trì khôi phục được bằng cách ghim lại; sửa rẻ nên nên làm ở việc riêng.
  file: `tools/reui_catalog/catalog.mjs`
  severity: medium
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
