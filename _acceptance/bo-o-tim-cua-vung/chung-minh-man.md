# Chứng minh màn — bo-o-tim-cua-vung

Hàng 2e bỏ ô tìm của vùng ở lưới dùng chung, nên hai màn họ Lưới đang có vùng cùng đổi: Bảng hàng (`inventory`, màn mẫu
của họ) và Đã gửi (`sent`, theo mẫu). Ma trận trạng thái của Bảng hàng điền ở đợt B (tên trạng thái mới «Không có dòng nào khớp»); ảnh cạnh màn mẫu và mặt so của
Đã gửi điền cùng ảnh bằng chứng, trước lượt chấm.

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| ----- | --------------------- | --- | --- | ------ |
| docs/tri-thuc/wiki/chu-de/bang-hang.md | Bảng hàng lọc theo ô đầu cột như Sheet, ô tìm của vùng («tầng 18, trục 08» gõ nhanh hơn tìm) | lọc bằng ô dưới tiêu đề cột, chồng nhiều cột | ô tìm của vùng | chủ kho chốt 2026-11-13 lối A: một chỗ để gõ lọc; tìm chuyển lên ô ⌘K của thanh trên (hàng 3f) |

### Họ

| Họ đề xuất | Lối | Vì sao |
| ---------- | --- | ------ |
| grid | màn mẫu mới | `design/patterns/luoi.md` ghi `Màn: inventory`: hàng này sửa chính màn mẫu (bỏ ô tìm, hàng ô lọc luôn hiện, trạng thái «Không có dòng nào khớp»), nên ma trận trạng thái của nó đo lại |

### Ứng viên ReUI

Ba lưới của ReUI có lọc theo cột hay bộ lọc, để so với lối lọc đầu cột; không chọn ứng viên nào — vùng giữ khối Lưới trong
kho (`DataRegion`), chỉ bớt ô tìm và cho hàng ô lọc luôn hiện (Hỏi-1, chủ kho duyệt 2026-11-13).

| Cho | Ứng viên | Ảnh | Chọn |
| --- | -------- | --- | ---- |
| màn | data-grid-grouping-1 | evidence/reui-data-grid-grouping-1.png | |
| màn | data-grid-filtering-3 | evidence/reui-data-grid-filtering-3.png | |
| màn | data-grid-columns-1 | evidence/reui-data-grid-columns-1.png | |

Bản bấm được của hai lối Hỏi-1 (sau nút «Lọc» · luôn hiện): ảnh bốn khổ sáng tối ở `figures/proto/`.

### Ma trận trạng thái

| Trạng thái             | Kết quả  | Căn cứ                                                                                                                     |
| ---------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| Chờ tải                | đạt      | tests/e2e/screens/screens.spec.ts (công thức cho-tai, o-tim-vang); tests/grid.test.tsx (no search box in any region state) |
| Trống                  | đạt      | tests/e2e/screens/screens.spec.ts (công thức trong); tests/grid.test.tsx (no search box in any region state)               |
| Không có dòng nào khớp | đạt      | tests/e2e/screens/screens.spec.ts (công thức khong-khop); tests/grid-sheet.test.tsx (column filters instead of a search box) |
| Lỗi                    | đạt      | tests/e2e/screens/screens.spec.ts (công thức loi)                                                                          |
| Một phần hỏng          | đạt      | tests/e2e/screens/screens.spec.ts (công thức mot-phan-hong)                                                                |
| Chữ dài                | đạt      | tests/e2e/screens/screens.spec.ts (công thức chu-dai)                                                                      |
| Không đủ quyền         | đạt      | tests/e2e/screens/screens.spec.ts (công thức khong-du-quyen: không số dòng, không ô tìm)                                   |
| Xung đột khi lưu       | đạt      | src/components/candidate/use-change.test.tsx; src/modules/listings/save-door.test.ts — hàng này không đổi đường ghi         |
| Phiên hết hạn          | không áp | Của khung (App Shell), không của vùng                                                                                      |
| Mất mạng khi lưu       | đạt      | src/components/candidate/use-change.test.tsx — hàng này không đổi đường ghi                                                |
| Link hết hạn           | không áp | Trạng thái của trang khách; Bảng hàng là màn nội bộ                                                                        |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| DataRegion | trong-kho | | | | |
| Input | trong-kho | | | | |
| Button | trong-kho | | | | |

## Màn sent

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| ----- | --------------------- | --- | --- | ------ |
| docs/tri-thuc/wiki/chu-de/da-gui-va-trang-khach.md | danh sách link đã gửi trên cùng Lưới với Bảng hàng (hàng 6) | lọc link bằng ô dưới tiêu đề cột | ô tìm của vùng | cùng lưới dùng chung với Bảng hàng; lời chốt 2026-11-13 áp cho mọi màn họ Lưới |

### Họ

| Họ đề xuất | Lối | Vì sao |
| ---------- | --- | ------ |
| grid | theo mẫu | `design/screens.yaml` khai sent thuộc họ grid; `design/patterns/luoi.md` ghi màn mẫu là inventory, nên Đã gửi so cạnh Bảng hàng |

### Ảnh cạnh màn mẫu

| Khổ | Màn này | Màn mẫu | Dữ liệu |
| --- | --- | --- | --- |
| 360 | evidence/sent-360.png | evidence/inventory-360.png | mẫu Ocean Park hàng 1 (60 lần chào) và 14 link mẫu dựng trên chúng |
| 414 | evidence/sent-414.png | evidence/inventory-414.png | mẫu Ocean Park hàng 1 (60 lần chào) và 14 link mẫu dựng trên chúng |
| 1024 | evidence/sent-1024.png | evidence/inventory-1024.png | mẫu Ocean Park hàng 1 (60 lần chào) và 14 link mẫu dựng trên chúng |
| 1440 | evidence/sent-1440.png | evidence/inventory-1440.png | mẫu Ocean Park hàng 1 (60 lần chào) và 14 link mẫu dựng trên chúng |

### Mặt so

| Mặt | Kết quả | Căn cứ |
| --- | --- | --- |
| Khung và bố cục | giống | ảnh 1440: App Shell, đầu màn, khung vùng có tên, thanh công cụ, lưới, chân bảng ở cùng chỗ như Bảng hàng |
| Cột chính và góc nhìn | khác — có lý do | `_acceptance/da-gui-tren-luoi/chung-minh-man.md`: cột đầu là Người nhận, không nhóm theo toà; hàng này không đổi cột |
| Thanh công cụ, lọc, tìm, sắp xếp | giống | ảnh 1440: số dòng, Cột, Toàn màn hình, không ô tìm; hàng ô lọc dưới tiêu đề luôn hiện như Bảng hàng; tìm ở ô ⌘K của thanh trên |
| Bảng | giống | ảnh 1440: cột số dòng ghim, kẻ dọc giữa cột, số canh phải, mật độ dòng như Bảng hàng |
| Mở chi tiết cạnh bảng | giống | ảnh 1440: chữ cột đầu là nút mở như Bảng hàng; ngăn nổi theo `wiki/decisions/0024-ngan-noi-xem-chi-tiet.md`; hàng này không đổi |
| Trạng thái tải, trống, lỗi | giống | ảnh 1440 (evidence/sent-khong-khop-1440-sang.png): «Không có dòng nào khớp» với «Xoá lọc» như Bảng hàng; bộ bài sinh từ sổ màn chạy đủ ca vùng trên Đã gửi |
| Ghi và báo đã lưu | khác — có lý do | `_acceptance/da-gui-tren-luoi/contract.md`: màn chỉ đọc, không ô nào sửa được |
| Phím tắt | giống | ảnh 1440: cùng lưới nên cùng phím của `design/behaviors.md` |
| Điện thoại | giống | ảnh 360: hàng ô lọc dưới tiêu đề, lưới cuộn ngang trong vùng, trang không cuộn ngang |
| Tốc độ mở màn | giống | ảnh 1024: trang dựng ở máy chủ từ dữ liệu mẫu như Bảng hàng; 14 dòng |
| Chữ và nhãn | giống | ảnh 1440: đầu cột và tên vùng lấy từ `ontology/labels.yaml`; câu trạng thái không khớp từ `src/components/candidate/grid-copy.ts` |
| Quyền theo vai | khác — có lý do | `_acceptance/da-gui-tren-luoi/contract.md`: vai thật nối ở hàng 18; hàng này không đổi quyền |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| DataRegion | trong-kho | | | | |
| RecordPanel | trong-kho | | | | |
| PageHeader | trong-kho | | | | |
