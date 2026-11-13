---
slug: da-gui-tren-luoi
at: 2026-11-13T02:00:00Z
route: http://localhost:3483/sent
material: real-components
context: host-embedded
context_scenes: []
reaction: nac-1 (anh-gui-kem-the)
options: evidence/reui-wishlist-4.png, evidence/reui-wishlist-1.png, evidence/reui-list-6.png (lối thẻ của Quỹ hàng, bày cạnh Lưới)
divergence: closed
ds_skill: inventory-ui
states: [co-du-lieu, ngan-chi-tiet, trong, loi, mot-phan-hong]
breakpoints: [mobile-360, mobile-414, desktop-1024, desktop-1440]
themes: [light, dark]
patched: 1
deferred: 1
---
# design-pass — da-gui-tren-luoi

Bản bấm được là chính màn `/sent` trong App Shell thật, chỉ bản dev, dữ liệu mẫu 14 link dựng trên 60 lần chào mẫu của
hàng 1; khuôn Lưới và ngăn nổi dùng nguyên của kho. `?state=empty|error|partial|loading|forbidden` mở từng trạng thái,
`?ho-so=<id link>` mở ngăn chi tiết. Dãy D chạy ở cổng 3483. Hướng đã khép (`divergence: closed`) vì bản phạm vi K4 chốt
Lưới; ba ứng viên ReUI bày để chủ kho thấy lối thẻ Quỹ hàng đã dùng.

## Ma trận capture

Trong `evidence/`, mỗi ảnh một bản sáng và một bản tối (`-toi`):

| Trạng thái | 360 | 414 | 1024 | 1440 |
|---|---|---|---|---|
| Có dữ liệu (`sent-<khổ>`) | có | có | có | có |
| Màn mẫu Bảng hàng, cùng dữ liệu (`inventory-<khổ>`) | có | có | có | có |
| Ngăn chi tiết link 5, 30 căn (`sent-ho-so-<khổ>`) | có | | | có |
| Trống (`sent-trong-<khổ>`) | có | | | có |
| Lỗi (`sent-loi-<khổ>`) | có | | | có |
| Một phần hỏng (`sent-mot-phan-<khổ>`) | có | | | có |

## Findings

1. Đã vá trong phiên: ở 360 chỉ cột Người nhận và cột kế nằm trong màn; thứ tự cột đưa Lượt mở, Quan tâm lên ngay sau
   tên để thấy phản ứng của khách không cần cuộn (Hỏi-2 chờ chủ kho).
2. Hoãn có tên: tên người nhận dài ở cột đầu đè sang các ô bên (ảnh 1440, dòng 3). Lỗi của Lưới dùng chung (cột mở hồ
   sơ không cắt chữ), giám sát duyệt sửa sau khi hàng 2c gộp (D-1311-4); AC-9 đo.
3. Ghi nhận: cột Người nhận rộng theo tên dài nhất (luật bề rộng cột chữ của Lưới), nên ở 360 chiếm gần hết bề ngang;
   không đổi luật Lưới ở hàng này.
