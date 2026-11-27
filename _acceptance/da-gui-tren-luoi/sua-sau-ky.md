# Sửa sau chữ ký

Chủ kho đã ký Cổng Bằng chứng của hồ sơ này. Hàng 3g «Sửa thông tin căn» (`_acceptance/sua-thong-tin-can/`) đổi bài
sau chữ ký, theo luật đợt «đổi mã hay bài của hồ sơ đã ký thì ghi ở đây và ghim lại cùng lượt». Căn cứ: chủ kho chọn
Hỏi-3 lối C ở Cổng Phạm vi 3g ngày 2026-11-17 (bốn cột chi tiết hiện sẵn trên Bảng hàng, lật dòng tám cột của Hỏi-2 hàng
2); giám sát G-1711-24.

## Hàng 3g, 2026-11-17

| Chỗ | Người dùng thấy khác gì | Phép |
| --- | --- | --- |
| `tests/e2e/screens/open-cell-truncate.spec.ts`: mở trang rồi chờ vùng nhận trang (luật VP4) trước khi đo ô mở hồ sơ — Bảng hàng rộng hơn làm lộ cuộc đua sẵn có: nút mở đầu tiên đôi khi là của thẻ điện thoại còn ẩn | Không | Cổng Phạm vi 3g «Lấy lối C», G-1711-24 |

## VP10 lát 1, 2026-11-27

| Chỗ | Người dùng thấy khác gì | Phép |
| --- | --- | --- |
| `tests/e2e/screens/open-cell-truncate.spec.ts` «inventory: a unit code in a narrowed column fits its cell and is cut»: nút mở lấy trong ô bảng (`td [data-record-open]`), mã căn và mã cột đọc trong một lần, chờ ô mang mã cột (không chờ theo giờ); điều đo không đổi. Lý do: ngay sau khi vùng sẵn sàng, ô có thể còn vẽ lại, lần đọc thứ hai rơi vào nút vừa rời bảng nên mã cột rỗng — đỏ hai lần trên main `1f4e7d36`, dựng lại trên Linux 1/6; sau sửa 72/72 (12 lần × 1440, 360). Commit `2fcd4039` | Không | Giám sát G-2811-6 |
