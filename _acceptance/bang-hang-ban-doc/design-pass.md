---
slug: bang-hang-ban-doc
at: 2026-11-11T10:23:39Z
route: http://localhost:3481/inventory
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: _acceptance/bang-hang-ban-doc/evidence/reui/ (ảnh ba khối Data Grid của ReUI, tra bằng tools/reui_catalog)
divergence: opened
ds_skill: inventory-ui
states: [co-du-lieu, cho-tai, trong, tim-khong-ra, loi]
breakpoints: [mobile-360, mobile-414, desktop-1024, desktop-1440]
themes: [light, dark]
patched: 5
deferred: 2
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

## Bước phân kỳ

- Hướng «Khuôn Lưới đang có» — trục: dùng lại khuôn đã ký · động cơ: đủ trạng thái vùng và bộ bài kiểm chung · đánh đổi: không lọc, không thẻ trạng thái.
- Hướng «Hàng chờ hỗ trợ» (data-grid-base-5) — trục: thanh công cụ dày · động cơ: lọc và ẩn hiện cột ngay trên bảng · đánh đổi: bỏ ô chọn, thao tác hàng loạt, dựng lại trạng thái vùng.
- Hướng «Thẻ trạng thái» (data-grid-filtering-2) — trục: lọc theo trạng thái là cửa vào · động cơ: thấy ngay bao nhiêu căn mỗi trạng thái · đánh đổi: cần lọc, ngoài phạm vi hàng 2.
- Hướng «Danh sách tối giản» (data-grid-base-6) — trục: gần khuôn nhất · động cơ: đổi ít · đánh đổi: thêm nút lọc chưa có việc.
- Chủ kho đã chọn («Đúng ý.»): giữ khuôn Lưới, xếp khung theo data-grid-editing-6, chưa thêm chức năng; thẻ điện thoại là hàng riêng sau hàng 3.

## Cảnh ngữ-cảnh

- Không cần cảnh riêng: bản bấm được nhúng trong khung thật (thanh bên «Bảng hàng», đầu màn, nút sáng tối, đăng nhập) — mọi ảnh đã cho thấy người vào màn từ đâu.

## Findings

### Nhóm 1 — vá-được-trong-từ-vựng-token (đã vá tại chỗ)

- Đọc như Sheet (việc G-1111-16, lời chủ kho): cuộn liền bằng bảng cuộn ảo ReUI, cột số dòng, tiêu đề và số dòng · Căn · Toà đứng yên, chân bảng ghi số dòng; trạng thái trống thêm «Tải lại».
- Khi cột tràn, lưới dày dùng chữ nhỏ và bề rộng cột tính theo cỡ chữ ấy (cột số dòng vào phép tính tràn): 1440 lại đủ tám cột.
- Khung vùng xếp theo data-grid-editing-6 bằng Frame của ReUI: dải tên, thanh công cụ ô tìm + số dòng, chân bảng chia trang (việc G-1111-14, Hỏi-4 chủ kho «Đúng ý.»).
- Chỗ thừa của bảng chia cho cột đang cắt chữ trước; bề rộng cột làm tròn xuống để 1440 không cuộn 1px.
- Cột chữ rộng theo nội dung thật của vùng (tối đa độ dài đọc, cộng 1ch dư): ở 1440 đủ tám cột, không cuộn; mã căn không còn chiếm chỗ của tên khu (việc G-1111-10).

### Nhóm 2 — đòi-đổi-DS/component (chờ Gate 1)

- Trạng thái trống chỉ nói vì sao, chưa có việc làm tiếp vì chưa có lối nhập hàng — đề xuất: ghi giới hạn đã biết, nút nhập đến cùng hàng nhập.
- Ở trạng thái trống đầu vùng vẫn hiện «0 dòng» và ô tìm (hành vi của khuôn Lưới) — đề xuất: giữ, đổi thì đổi ở khuôn cho mọi màn.
