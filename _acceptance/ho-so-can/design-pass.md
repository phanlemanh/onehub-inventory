---
slug: ho-so-can
at: 2026-11-12T06:33:43Z
route: http://127.0.0.1:3483/inventory
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: _acceptance/ho-so-can/evidence/reui/ (ảnh tám khối ReUI) và evidence/ban-bam/loi-b-*.png (lối ngăn nổi trên dữ liệu thật)
divergence: opened
ds_skill: inventory-ui
states: [ho-so-dong, ho-so-mo]
breakpoints: [mobile-360, mobile-414, desktop-1024, desktop-1440]
themes: [light, dark]
patched: 4
deferred: 1
---
# design-pass — ho-so-can

Bản bấm được là chính trang Bảng hàng trong App Shell thật, 60 căn mẫu, hồ sơ mở bằng bấm mã căn thứ năm (1603 · S1.01).
Dựng ở cổng của dãy D (3483).

## Ma trận capture

| state | breakpoint | theme | file |
|---|---|---|---|
| ho-so-mo | 1024 | light | evidence/ban-bam/ho-so-mo-1024-sang.png |
| ho-so-mo | 1024 | dark | evidence/ban-bam/ho-so-mo-1024-toi.png |
| ho-so-mo | 1440 | light | evidence/ban-bam/ho-so-mo-1440-sang.png |
| ho-so-mo | 1440 | dark | evidence/ban-bam/ho-so-mo-1440-toi.png |
| ho-so-mo | 360 | light | evidence/ban-bam/ho-so-mo-360-sang.png |
| ho-so-mo | 360 | dark | evidence/ban-bam/ho-so-mo-360-toi.png |
| ho-so-mo | 414 | light | evidence/ban-bam/ho-so-mo-414-sang.png |
| ho-so-mo | 414 | dark | evidence/ban-bam/ho-so-mo-414-toi.png |
| inventory-dong | 1024 | light | evidence/ban-bam/inventory-dong-1024-sang.png |
| inventory-dong | 1440 | light | evidence/ban-bam/inventory-dong-1440-sang.png |
| inventory-dong | 360 | light | evidence/ban-bam/inventory-dong-360-sang.png |
| inventory-dong | 414 | light | evidence/ban-bam/inventory-dong-414-sang.png |
| loi-b | 1024 | light | evidence/ban-bam/loi-b-1024-sang.png |
| loi-b | 1440 | light | evidence/ban-bam/loi-b-1440-sang.png |

## Findings

- Đã vá: thông số của thẻ và giá trị của danh sách trường canh phải như cột số của bảng, đọc lệch trong một dòng chữ → hiện
  cùng cách định dạng của ô nhưng canh trái.
- Đã vá: lối B (ngăn nổi) trên dữ liệu thật che ô tìm, số dòng và nút ở thanh trên ở 1024 → khuyến nghị lối A, chụp lối B
  để chủ kho so.
- Chủ kho chốt «Lấy B có ghim»: ngăn nổi đặt trong vùng các dòng, dưới thanh công cụ; đã vá lớp của ngăn để tiêu đề cột đang
  đứng yên không đè lên đầu ngăn; ngày ở «Xác nhận lúc» không còn tràn ở 1024 (ba thông số xuống dòng khi ngăn hẹp).
- Để lại: khi hồ sơ mở, bên trái ngăn còn 5 cột ở 1440 và 3 cột ở 1024, cột Giá chào khuất sau ngăn; giá luôn ở đầu hồ sơ.
  Nút ghim (ngăn thành cột) là hàng sau.
