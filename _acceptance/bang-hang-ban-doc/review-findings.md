# Review findings: bang-hang-ban-doc (round 1)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **label("StandardStatus") reused for a different meaning (region/page states)**
  Người dùng thấy gì: Trên trang mẫu nội bộ, tiêu đề phần trạng thái toàn trang dùng chữ của trạng thái căn. Nếu sàn đổi tên trạng thái căn thì tiêu đề này đổi theo dù không liên quan.
  Căn cứ: Chỉ ảnh hưởng một trang mẫu nội bộ, khách hàng và đầu chủ không thấy, không mất dữ liệu, sửa lúc nào cũng rẻ.
  file: `src/app/(app)/proto/[slug]/frame-showcase.tsx`
  severity: medium
  Đề xuất: known-limits

- **The Bảng hàng empty-state sentence hard-codes the Unit label «căn»**
  Người dùng thấy gì: Khi sàn chưa có căn nào, câu báo trống viết sẵn chữ «căn». Nếu sàn đổi tên gọi này thì câu đó lệch với phần còn lại của màn.
  Căn cứ: Nhẹ: chỉ lệch chữ ở một câu hiếm gặp, không mất dữ liệu, và việc sàn đổi tên gọi này chưa xảy ra.
  file: `src/app/(app)/inventory/page.tsx`
  severity: medium
  Đề xuất: known-limits

- **The row-count rule is split into two places with different conditions; showCount is documented but never used**
  Người dùng thấy gì: Số dòng hiện hai lần, cạnh ô tìm và ở chân bảng. Khi tìm mà vẫn giữ đủ dòng thì hai nơi ghi hơi khác nhau.
  Căn cứ: Chỉ là trùng lặp và lệch cách ghi, người dùng vẫn đọc đúng số dòng, không mất dữ liệu, sửa nhỏ sau cũng được.
  file: `src/components/candidate/data-region.tsx`
  severity: low
  Đề xuất: known-limits

- **Showcases still hard-code headers for concepts that now have labels (ListPrice, LastConfirmedAt)**
  Người dùng thấy gì: Trên trang mẫu Lưới, hai cột còn mang tên cũ khác với Bảng hàng thật. Cùng một thông tin mà hai màn gọi hai tên.
  Căn cứ: Chỉ lệch tên ở trang mẫu nội bộ, không mất dữ liệu, không ảnh hưởng đầu chủ, đổi lại rẻ khi dọn trang mẫu.
  file: `src/app/(app)/proto/[slug]/grid-showcase.tsx`
  severity: low
  Đề xuất: known-limits

- **Row count appears twice: the toolbar's showCount switch is never used**
  Người dùng thấy gì: Số «60 dòng» hiện cạnh ô tìm và lặp lại ở chân bảng. Hơi thừa nhưng không sai.
  Căn cứ: Chỉ thừa một con số, không sai thông tin, không mất dữ liệu, và gỡ đi còn kéo theo chỉnh bài kiểm tìm nên để sau.
  file: `src/components/candidate/data-region.tsx`
  severity: low
  Đề xuất: known-limits

- **Shape 3: the test checks that a status badge exists, but the promise is that each badge matches its row's status**
  Người dùng thấy gì: Bài kiểm chỉ xác nhận có huy hiệu trạng thái, chưa kiểm huy hiệu khớp đúng trạng thái của từng dòng. Nếu sau này huy hiệu hiện sai dòng thì bài kiểm vẫn xanh.
  Căn cứ: Màn hôm nay hiển thị đúng, rủi ro chỉ là bỏ sót lỗi tương lai, người dùng chưa gặp gì, và bổ sung kiểm chứng sau rất rẻ.
  file: `tests/inventory.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Shape 4: the 'widths stay the same' check stands alone, with no proof the search actually filtered**
  Người dùng thấy gì: Bài kiểm bề rộng cột khi gõ tìm không chứng minh ô tìm thật sự đã lọc dòng. Nếu ô tìm hỏng thì bài này vẫn xanh.
  Căn cứ: Người dùng không gặp lỗi nào hôm nay, các bài tìm khác đã phủ việc lọc, và thêm một dòng kiểm chứng sau là rẻ.
  file: `tests/grid.test.tsx`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/7 lỗi rơi vào file không bộ đo nào phủ (src/app/(app)/proto/[slug]/frame-showcase.tsx, src/app/(app)/proto/[slug]/grid-showcase.tsx) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
