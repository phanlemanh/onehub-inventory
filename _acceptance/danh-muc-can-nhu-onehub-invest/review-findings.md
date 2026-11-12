# Review findings: danh-muc-can-nhu-onehub-invest (round 1)

## Trong hợp đồng

(không có finding nào map vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **A unit's complex is not kept in step with its tower's complex**
  Người dùng thấy gì: Một căn có thể bị lưu không thuộc phân khu dù toà của nó thuộc phân khu, nên bảng hàng có thể hiện căn thiếu phân khu. Hiện chỉ có danh mục mẫu và chưa ai ghi được danh mục, nên chưa gặp.
  Căn cứ: Hậu quả nhẹ và chưa xảy ra vì chưa có đường ghi danh mục, không mất dữ liệu; sửa sau bằng một bước nâng cấp riêng khi mở đường ghi.
  file: `db/migrations/007_danh_muc_nhu_invest.sql`
  severity: medium
  Đề xuất: known-limits

- **Catalog aliases can point to a tower, stack or unit that does not exist**
  Người dùng thấy gì: Một mã gốc có thể trỏ tới toà hay căn không có thật, khi đó tra mã trả về kết quả không khớp đối tượng nào. Danh mục chỉ do hệ thống nạp, chưa có người nhập tay.
  Căn cứ: Chỉ xảy ra nếu nạp dữ liệu sai, người dùng chưa chạm tới, và đường ghi danh mục chưa mở; sửa sau khi mở đường ghi vẫn rẻ.
  file: `db/migrations/007_danh_muc_nhu_invest.sql`
  severity: low
  Đề xuất: known-limits

- **lookupCode trims the typed code for the company-code check but not when it builds the '<project>/<code>' candidate**
  Người dùng thấy gì: Nếu người dùng gõ mã có dấu cách ở đầu, mã riêng của sàn vẫn tra được nhưng mã gốc của danh mục thì báo không tìm thấy.
  Căn cứ: Hậu quả nhẹ: chỉ không tìm thấy, người dùng xoá dấu cách và gõ lại là xong, không mất dữ liệu.
  file: `src/modules/catalog/lookup.ts`
  severity: low
  Đề xuất: known-limits

- **The composite foreign key does not stop a unit with no complex inside a tower that has one**
  Người dùng thấy gì: Một căn có thể được lưu không thuộc phân khu dù toà của nó có phân khu, làm bảng hàng hiện thiếu thông tin phân khu cho căn đó.
  Căn cứ: Chưa ai ghi được danh mục nên chưa xảy ra, không mất dữ liệu; sửa sau bằng một bước nâng cấp riêng khi mở đường ghi.
  file: `db/migrations/007_danh_muc_nhu_invest.sql`
  severity: low
  Đề xuất: known-limits

- **Shape 3, presence instead of relation: E7 checks only that the code finds some unt_ key, not the unit S1.05-1206**
  Người dùng thấy gì: Bài kiểm tra tra mã căn chỉ xác nhận có một đối tượng, chưa xác nhận đúng căn cần tìm, nên nếu mã gốc trỏ nhầm căn thì bài kiểm tra vẫn xanh.
  Căn cứ: Không ảnh hưởng người dùng trực tiếp, chỉ làm lưới an toàn lỏng hơn; bổ sung kiểm tra sau rất rẻ.
  file: `tests/db/danh-muc.db.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 4, loose message pin: failsWith uses toContain, and the name 'catalog_nodes_parent' also matches 'catalog_nodes_parent_is_project'**
  Người dùng thấy gì: Bài kiểm tra có thể xanh dù việc từ chối đến từ luật khác với luật định kiểm, nên khó biết đúng luật nào đang chặn phân khu sai cha.
  Căn cứ: Việc chặn vẫn xảy ra nên người dùng không bị ảnh hưởng; chỉ làm kiểm tra kém chính xác, sửa sau rẻ.
  file: `tests/db/danh-muc.db.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 2, the snapshot provenance check passes silently when git history is missing**
  Người dùng thấy gì: Khi máy kiểm tra không có lịch sử mã nguồn, bước xác nhận ảnh chụp danh mục cũ đúng nguồn bị bỏ qua mà vẫn báo xanh.
  Căn cứ: Không ảnh hưởng người dùng, chỉ làm một bước kiểm tra nguồn gốc dữ liệu mẫu có thể lặng lẽ không chạy; dữ liệu mẫu vẫn được so khớp.
  file: `tests/danh-muc-chuyen-mau.test.ts`
  severity: low
  Đề xuất: known-limits

- **Shape 3, the E15 red case pins the injected tower name, not the affected unit's upi**
  Người dùng thấy gì: Bài kiểm tra ca đỏ chỉ xác nhận tên toà bị cài vào xuất hiện lại, chưa chứng minh thông báo chỉ đúng căn bị đổi.
  Căn cứ: Không ảnh hưởng người dùng, chỉ làm lưới kiểm tra lỏng hơn một chút; sửa sau rẻ.
  file: `tests/danh-muc-chuyen-mau.test.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
