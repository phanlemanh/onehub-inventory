---
slug: app-shell-chon-tu-reui
at: 2026-11-11T11:55:00Z
route: http://127.0.0.1:3487/proto/app-shell
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: [cot2: trang-thai|cho, tim: chua|co, chuong: chua|co, ten: tren|menu, dt: thanh-ben|tab]
divergence: năm câu hỏi của chủ kho, mỗi câu hai phương án có ảnh; phần đã chốt (app-shell-8, hai cột) không bày lại
ds_skill: inventory-ui
states: [today, inventory, sent, cot-gap, dau-chu]
breakpoints: [mobile-360, mobile-414, tablet-1024, desktop-1440]
themes: [light, dark]
patched: 2
deferred: 1
---
# design-pass — app-shell-chon-tu-reui

Bản bấm được phủ lên App Shell cũ của nhóm `(app)` (chỉ ở máy làm), dựng bằng thành phần thật của kho và các phần
kho đã có (menu tài khoản, đổi giao diện, băng báo, lối nhảy tới nội dung, bảng mẫu của Bảng hàng). Trang ảnh tự chứa:
`evidence/design-pass/anh-ban-bam.html` (ảnh rời trong `anh/`; bản tự chứa gửi kèm thẻ nằm ở thư mục trình của đợt, vì kho chặn tệp trên 500 KB).

## Ma trận capture

24 khung: ba màn (Hôm nay, Bảng hàng, Đã gửi) × bốn khổ (360, 414, 1024, 1440) × sáng, tối — theo phương án máy khuyên.
Không khung nào cuộn ngang (đo `scrollWidth` lúc chụp). Thêm 10 ảnh cho năm câu hỏi (A và B mỗi câu), một ảnh cột thứ
hai đã gập và một ảnh người chỉ giữ vai Đầu chủ.

## Findings

- Đã sửa: khối gốc đặt lớp sửa kiểu lên `Sidebar`, `SidebarInset`, `Button`, `ScrollArea`…; lint của kho cấm. Bỏ hết,
  bố cục đặt ở thẻ bọc. Hệ quả nhìn thấy: khung bên phải không có viền mảnh như bản xem trước của ReUI.
- Đã sửa: App Shell cao theo nội dung nên bốn tab dưới bị đẩy khỏi màn và bảng dài không cuộn trong vùng màn; giới hạn
  chiều cao App Shell bằng chiều cao màn hình.
- Hoãn: chuyển động gập cột thứ hai của khối dùng giá trị tuỳ ý mà lint cấm; bản bấm được gập tức thì. Bản thật dùng
  chuyển động của thành phần hoặc không có.
