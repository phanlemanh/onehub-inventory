---
slug: ho-so-du-thong-tin
at: 2026-11-12T23:50:00Z
route: http://127.0.0.1:3485/inventory?ho-so=4d415500-0001-4000-8000-000000000001
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: ứng viên ReUI ở mục «Ứng viên» dưới (ảnh trên reui.io); bản bấm được ở evidence/ban-bam/
divergence: opened
ds_skill: inventory-ui
states: [ho-so-du-moi-nhat, ho-so-du-lan-cu]
breakpoints: [mobile-360, mobile-414, desktop-1024, desktop-1440]
themes: [light, dark]
patched: 1
deferred: 2
---
# design-pass — ho-so-du-thong-tin

Bản bấm được là chính hồ sơ căn trên Bảng hàng trong App Shell thật (60 căn mẫu), căn 0905 · S1.01 có ba lần chào. Dữ liệu
của bốn trường mới và các lần chào cũ là dữ liệu thử đặt trong trang (bản thử nằm ngoài nhánh, giữ ở tệp vá `3b-ban-bam-duoc.patch` trong thư mục ghi chú chung của nhóm phiên;
không phải mã sản phẩm). Dựng ở cổng của dãy N (3485).

## Ứng viên

- A (khuyên) — khối theo `solution-crm-4`, Quỹ hàng đã chọn cho hồ sơ căn: https://reui.io/thumbnails/blocks/solution-crm-4-light.webp
  (xem sống: https://reui.io/preview/base/solution-crm-4). Bản bấm được dựng theo lối này, ghép từ khung và thẻ căn của hàng 3.
- B — `sheet-11`: số lớn và thanh tiến độ to ở đầu: https://reui.io/thumbnails/blocks/sheet-11-light.webp
- C — giữ danh sách phẳng của hàng 3, nối thêm dòng (không ảnh — là hồ sơ hàng 3 hiện tại).

## Ma trận capture

| state | breakpoint | theme | file |
|---|---|---|---|
| ho-so-du-moi-nhat | 1440 | light | evidence/ban-bam/ho-so-du-1440-sang.png |
| ho-so-du-moi-nhat | 1440 | dark | evidence/ban-bam/ho-so-du-1440-toi.png |
| ho-so-du-moi-nhat | 1024 | light | evidence/ban-bam/ho-so-du-1024-sang.png |
| ho-so-du-moi-nhat | 1024 | dark | evidence/ban-bam/ho-so-du-1024-toi.png |
| ho-so-du-moi-nhat | 414 | light | evidence/ban-bam/ho-so-du-414-sang.png, ho-so-du-414-sang-duoi.png |
| ho-so-du-moi-nhat | 414 | dark | evidence/ban-bam/ho-so-du-414-toi.png, ho-so-du-414-toi-duoi.png |
| ho-so-du-moi-nhat | 360 | light | evidence/ban-bam/ho-so-du-360-sang.png, ho-so-du-360-sang-duoi.png |
| ho-so-du-moi-nhat | 360 | dark | evidence/ban-bam/ho-so-du-360-toi.png, ho-so-du-360-toi-duoi.png |
| ho-so-du-lan-cu | 1440 | light | evidence/ban-bam/lan-cu-1440-sang.png |
| ho-so-du-lan-cu | 1440 | dark | evidence/ban-bam/lan-cu-1440-toi.png |
| ho-so-du-lan-cu | 360 | light | evidence/ban-bam/lan-cu-360-sang.png |
| ho-so-du-lan-cu | 360 | dark | evidence/ban-bam/lan-cu-360-toi.png |

## Findings

- Đã vá: nút «Về lần mới nhất» tự dựng bằng thẻ nút trần → dùng `Button` của kho. Dòng của «Các lần chào» trong bản thử là
  `Button` được chỉnh kiểu, luật giao diện của kho cấm; bản dựng dùng phần tử danh sách (`item` của shadcn, cài bằng CLI).
- Để lại cho bản dựng (đã có trong AC-7): bản thử đổi khối dưới khi xem lần cũ nhưng thẻ căn ở đầu vẫn hiện giá và trạng
  thái của lần mới nhất; bản dựng đổi cả thẻ.
- Để lại: ở 360 dòng «Lần N» xuống hai dòng (giá · ngày ở dòng dưới) — đọc được, không tràn ngang; chủ kho xem ảnh
  `lan-cu-360-*.png`.
