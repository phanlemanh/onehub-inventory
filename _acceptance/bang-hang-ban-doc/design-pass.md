---
slug: bang-hang-ban-doc
at: 2026-11-11T10:23:39Z
route: http://localhost:3481/inventory
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options:
divergence: skipped — màn đi theo khuôn Lưới đã duyệt ở hàng 1b; các lựa chọn còn mở (cỡ trang, nhãn, cột) đã là câu hỏi Hỏi-1, Hỏi-2, Hỏi-3 trên thẻ
ds_skill: inventory-ui
states: [co-du-lieu, cho-tai, trong, tim-khong-ra, loi]
breakpoints: [mobile-360, mobile-414, desktop-1024, desktop-1440]
themes: [light, dark]
patched: 0
deferred: 3
---
# design-pass — bang-hang-ban-doc

Bản bấm được là chính trang Bảng hàng trong khung thật của sản phẩm, dữ liệu mẫu của hàng 1, năm chữ đầu cột tạm đặt ở
trang cho tới khi chủ kho duyệt nhãn (Hỏi-2). Trang ảnh tự chứa (ảnh nhúng, mở ở máy khác vẫn xem được) gửi kèm thẻ, không commit vì quá cỡ tệp của kho; ảnh gốc ở `evidence/design-pass/`.

## Ma trận capture

| state | breakpoint | theme | file |
|---|---|---|---|
| co-du-lieu | 360 | light | evidence/design-pass/co-du-lieu--360--sang.png |
| co-du-lieu | 414 | light | evidence/design-pass/co-du-lieu--414--sang.png |
| co-du-lieu | 1024 | light | evidence/design-pass/co-du-lieu--1024--sang.png |
| co-du-lieu | 1440 | light | evidence/design-pass/co-du-lieu--1440--sang.png |
| co-du-lieu | 360 | dark | evidence/design-pass/co-du-lieu--360--toi.png |
| co-du-lieu | 414 | dark | evidence/design-pass/co-du-lieu--414--toi.png |
| co-du-lieu | 1024 | dark | evidence/design-pass/co-du-lieu--1024--toi.png |
| co-du-lieu | 1440 | dark | evidence/design-pass/co-du-lieu--1440--toi.png |
| cho-tai | 360 | light | evidence/design-pass/cho-tai--360--sang.png |
| cho-tai | 414 | light | evidence/design-pass/cho-tai--414--sang.png |
| cho-tai | 1024 | light | evidence/design-pass/cho-tai--1024--sang.png |
| cho-tai | 1440 | light | evidence/design-pass/cho-tai--1440--sang.png |
| cho-tai | 360 | dark | evidence/design-pass/cho-tai--360--toi.png |
| cho-tai | 414 | dark | evidence/design-pass/cho-tai--414--toi.png |
| cho-tai | 1024 | dark | evidence/design-pass/cho-tai--1024--toi.png |
| cho-tai | 1440 | dark | evidence/design-pass/cho-tai--1440--toi.png |
| trong | 360 | light | evidence/design-pass/trong--360--sang.png |
| trong | 414 | light | evidence/design-pass/trong--414--sang.png |
| trong | 1024 | light | evidence/design-pass/trong--1024--sang.png |
| trong | 1440 | light | evidence/design-pass/trong--1440--sang.png |
| trong | 360 | dark | evidence/design-pass/trong--360--toi.png |
| trong | 414 | dark | evidence/design-pass/trong--414--toi.png |
| trong | 1024 | dark | evidence/design-pass/trong--1024--toi.png |
| trong | 1440 | dark | evidence/design-pass/trong--1440--toi.png |
| tim-khong-ra | 360 | light | evidence/design-pass/tim-khong-ra--360--sang.png |
| tim-khong-ra | 414 | light | evidence/design-pass/tim-khong-ra--414--sang.png |
| tim-khong-ra | 1024 | light | evidence/design-pass/tim-khong-ra--1024--sang.png |
| tim-khong-ra | 1440 | light | evidence/design-pass/tim-khong-ra--1440--sang.png |
| tim-khong-ra | 360 | dark | evidence/design-pass/tim-khong-ra--360--toi.png |
| tim-khong-ra | 414 | dark | evidence/design-pass/tim-khong-ra--414--toi.png |
| tim-khong-ra | 1024 | dark | evidence/design-pass/tim-khong-ra--1024--toi.png |
| tim-khong-ra | 1440 | dark | evidence/design-pass/tim-khong-ra--1440--toi.png |
| loi | 360 | light | evidence/design-pass/loi--360--sang.png |
| loi | 414 | light | evidence/design-pass/loi--414--sang.png |
| loi | 1024 | light | evidence/design-pass/loi--1024--sang.png |
| loi | 1440 | light | evidence/design-pass/loi--1440--sang.png |
| loi | 360 | dark | evidence/design-pass/loi--360--toi.png |
| loi | 414 | dark | evidence/design-pass/loi--414--toi.png |
| loi | 1024 | dark | evidence/design-pass/loi--1024--toi.png |
| loi | 1440 | dark | evidence/design-pass/loi--1440--toi.png |

## Cảnh ngữ-cảnh

- Không cần cảnh riêng: bản bấm được nhúng trong khung thật (thanh bên «Bảng hàng», đầu màn, nút sáng tối, đăng nhập) — mọi ảnh đã cho thấy người vào màn từ đâu.

## Findings

### Nhóm 1 — vá-được-trong-từ-vựng-token (đã vá tại chỗ)

- Không có: khuôn Lưới hiện đúng năm trạng thái ở bốn khổ, sáng và tối; phiên không sửa gì.

### Nhóm 2 — đòi-đổi-DS/component (chờ Gate 1)

- Ở 1440, cột thứ tám «Xác nhận lúc» bị khuất sau cuộn ngang trong vùng (thanh bên chiếm chỗ; bề rộng cột theo luật kiểu của khuôn) — đề xuất: chấp nhận như luật khuôn, hoặc thu cột ở hàng sau khi có đo sử dụng.
- Trạng thái trống chỉ nói vì sao, chưa có việc làm tiếp vì chưa có lối nhập hàng — đề xuất: ghi giới hạn đã biết, nút nhập đến cùng hàng nhập.
- Ở trạng thái trống đầu vùng vẫn hiện «0 dòng» và ô tìm (hành vi của khuôn Lưới) — đề xuất: giữ, đổi thì đổi ở khuôn cho mọi màn.
