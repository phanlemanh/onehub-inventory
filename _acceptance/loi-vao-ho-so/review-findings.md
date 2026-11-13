# Review findings: loi-vao-ho-so (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Product language: never hard-code a label in src/ (AGENTS.md, Product language)**
  Người dùng thấy gì: Dòng mô tả của ô tìm ⌘K luôn viết «toà» và «dự án», nên nếu một sàn đổi tên hai khái niệm này thì dòng mô tả vẫn hiện chữ cũ.
  Căn cứ: Chỉ sai một dòng chữ phụ, không mất dữ liệu và không cản việc tìm; chỉ lộ ra khi sàn đổi tên khái niệm, và sửa sau cũng rẻ.
  file: `src/modules/listings/ui/entry-copy.ts`
  severity: medium
  Đề xuất: known-limits

- **Search suggestions skip Vietnamese mark folding that the grid filter uses, so typing without marks finds no building or project and Enter searches the wrong column**
  Người dùng thấy gì: Gõ tên toà hay dự án không dấu (ví dụ «dong» cho «Đông») thì ô tìm không gợi ý gì, và bấm Enter đưa người dùng tới một bảng rỗng dù bảng có toà khớp.
  Căn cứ: Không mất dữ liệu và người dùng tự gõ lại có dấu được, nhưng người dùng Việt hay gõ không dấu nên dễ gặp; nên làm thành việc riêng.
  file: `src/modules/listings/ui/inventory-rows.ts`
  severity: low
  Đề xuất: new-contract

- **Search that finds one unit adds the record to the address on the server, so a page reload or router.refresh after closing the record opens it again**
  Người dùng thấy gì: Sau khi tìm một căn rồi đóng hồ sơ, nếu tải lại trang hoặc lưu cách xem thì hồ sơ căn đó tự mở lại dù người dùng đã đóng.
  Căn cứ: Không mất dữ liệu và chỉ cần đóng hồ sơ lần nữa là xong; chỉ gây phiền nhẹ trong một đường đi hẹp.
  file: `src/app/(app)/inventory/page.tsx`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4: kiểm tra âm tính đứng một mình, không có ca đối chứng và không ghim thông điệp, ở «Enter khi ô rỗng thì không đi đâu»**
  Người dùng thấy gì: Người dùng không thấy gì sai hôm nay: Enter trên ô rỗng vẫn không đi đâu. Chỉ là phép đo tự động có thể bỏ sót nếu sau này có lỗi làm trang chuyển chậm.
  Căn cứ: Không ảnh hưởng người dùng hiện tại, và ca kiểm đơn vị đã bắt được lỗi này ở tầng khác; sửa lúc nào cũng rẻ.
  file: `tests/e2e/loi-vao-ho-so.spec.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
