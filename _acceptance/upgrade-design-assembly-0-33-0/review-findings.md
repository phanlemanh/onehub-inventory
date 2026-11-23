# Review findings: upgrade-design-assembly-0-33-0 (round 3)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The redraw check reads the working tree, but the measure says it checks the records at HEAD**
  Người dùng thấy gì: Khi chấm trên chính kho này, phép kiểm hai trang bản đồ sản phẩm và lộ trình có thể đọc bản đang nằm trên máy thay vì bản đã commit. Một chỉnh sửa tay đã commit có thể lọt qua nếu bản trên máy đã được vẽ lại mà chưa commit.
  Căn cứ: Chỉ ảnh hưởng độ chặt của phép chấm, không làm hỏng sản phẩm, và người ký vẫn thấy lỗi này khi chấm trên bản chép sạch; ghi lại để biết là đủ rẻ và không mất dữ liệu.
  file: `_acceptance/upgrade-design-assembly-0-33-0/rang/change-list.mjs`
  severity: medium
  Đề xuất: known-limits

- **The drawn-page check compares the pages on disk, not the pages at HEAD**
  Người dùng thấy gì: Phép kiểm không dừng lại khi cây làm việc còn tệp chưa commit, nên kết quả có thể phản ánh bản trên máy thay vì bản sẽ gộp. Tệp chưa theo dõi trong thư mục hồ sơ cũng có thể làm đổi kết quả.
  Căn cứ: Hậu quả nhẹ và tự gỡ được bằng cách chấm lại trên bản chép sạch; không mất dữ liệu, không ảnh hưởng người dùng cuối.
  file: `_acceptance/upgrade-design-assembly-0-33-0/rang/change-list.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6 (đo checkout của tác giả thay vì cây đang kiểm): phép so trang vẽ đọc các tệp trên đĩa trong khi lời hứa và danh sách tệp nói về HEAD đã commit**
  Người dùng thấy gì: Hai vế của cùng một phép đo đọc hai bản khác nhau: danh sách tệp theo commit, còn trang vẽ theo tệp trên máy. Nếu commit mang trang cũ hay sửa tay mà máy đã vẽ lại, phép đo vẫn xanh.
  Căn cứ: Khả năng gặp thấp vì chỉ xảy ra khi có sửa tay rồi vẽ lại mà không commit, và gặp thì chấm lại trên bản sạch là gỡ được; sửa sau cũng rẻ.
  file: `_acceptance/upgrade-design-assembly-0-33-0/rang/change-list.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
