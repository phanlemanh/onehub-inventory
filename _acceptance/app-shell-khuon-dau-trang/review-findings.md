# Review findings — app-shell-khuon-dau-trang (round 4)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The gate card and evidence page still describe the round-3 account menu (40 characters, small avatar kept), while card-plain.json describes the round-4 menu**
  Người dùng thấy gì: The sign-off page the owner reads still describes the old account menu: it says long emails fit up to about 40 characters and that the small avatar is kept, while the real menu now drops the avatar and fits slightly longer emails. The owner could approve on a description that does not match the product, and the stated email length differs between 43 and 44 in different places.
  Căn cứ: The product itself is unaffected and only the sign-off page text is out of date; the owner can reload the regenerated page in the next round, so the cost of leaving it is a small chance of confusion at sign-off.
  file: `_acceptance/app-shell-khuon-dau-trang/card.html`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình): ⌘B 'không mở dải' không có đối chứng dương (r3)**
  Người dùng thấy gì: Phím tắt đóng mở thanh bên trên máy tính được kiểm bằng một phép thử chỉ xác nhận dải không mở. Nếu phím tắt hỏng hẳn thì phép thử vẫn báo đạt, nên một lỗi về sau có thể lọt qua mà không ai biết.
  Căn cứ: Người dùng hiện không bị ảnh hưởng gì, chỉ là lưới an toàn mỏng hơn cho các lần sửa sau; không mất dữ liệu và bổ sung phép thử sau cũng rẻ.
  file: `tests/e2e/app-shell.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): bài unit đọc chuỗi lớp Tailwind thay cho cách hiển thị và hình học (r3)**
  Người dùng thấy gì: Hai phép thử nhỏ kiểm tên kiểu dáng thay vì kiểm nút và viền có thật sự hiện đúng chỗ. Phần hiển thị thật đã được các phép thử trình duyệt đo riêng, nên người dùng không bị ảnh hưởng.
  Căn cứ: Hậu quả với người dùng gần như bằng không vì phần hiển thị thật đã có phép đo khác; sửa thêm tốn công mà không bắt thêm lỗi nào.
  file: `tests/app-shell.test.tsx`
  severity: low
  Đề xuất: wont-fix

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
