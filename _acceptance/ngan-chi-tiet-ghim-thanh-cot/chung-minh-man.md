# Chứng minh màn — ngan-chi-tiet-ghim-thanh-cot

Hàng 3a thêm dáng ghim cho khung hồ sơ chung (`RecordPanel`): mọi màn Lưới có hồ sơ tự có nút Ghim. Không thêm màn. Bảng
hàng là màn mẫu của họ Lưới (lối «màn mẫu mới», ma trận trạng thái); Đã gửi theo màn mẫu (ảnh cạnh nhau, mặt so).

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/ho-so-can.md | cạnh bảng là cột kéo chia app-shell-11, mặc định 38%, kéo 28–50%; ngăn nổi đè bảng thì che Lọc, Nhóm, Cột | cột kéo chia app-shell-11; không che thanh công cụ | cột luôn ở dáng chia (hồ sơ kho này mặc định nổi, chủ kho chọn «B có ghim»); khoảng 28–50% | hàng 3 chọn ngăn nổi (0024), ghim là dáng thứ hai; khoảng kéo 320 px tới 60% để giữ sàn 320 px của ngăn nổi |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Ghim là dáng của khung hồ sơ trong Bảng hàng, màn mẫu của họ Lưới (mặt so «Mở chi tiết cạnh bảng») |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | app-shell-11 | evidence/reui/app-shell-11.png | x |
| màn | ai-chat-2 | evidence/reui/ai-chat-2.png | |
| app-shell-11 | app-shell-11 | evidence/reui/app-shell-11.png | x |
| app-shell-11 | ai-chat-2 | evidence/reui/ai-chat-2.png | |

Dáng ghim theo lời chủ kho ở Cổng Phạm vi hàng 3 («ngăn thành cột, kéo đổi rộng»); ai-chat-2 rộng cố định nên rút. Trang
Cổng Phạm vi: `chon-ghim.html`.

### Ma trận trạng thái

| Trạng thái       | Kết quả  | Căn cứ                                                                                                   |
| ---------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| Chờ tải          | đạt      | tests/e2e/screens/screens.spec.ts (công thức cho-tai); chưa có dòng thì không có hồ sơ để ghim           |
| Trống            | đạt      | tests/e2e/screens/screens.spec.ts (công thức trong)                                                      |
| Tìm không ra     | đạt      | tests/e2e/screens/screens.spec.ts (công thức tim-khong-ra)                                               |
| Lỗi              | đạt      | tests/e2e/screens/screens.spec.ts (công thức loi)                                                        |
| Một phần hỏng    | đạt      | tests/e2e/screens/screens.spec.ts (công thức mot-phan-hong)                                              |
| Chữ dài          | đạt      | tests/e2e/ho-so-can.spec.ts (nội dung rộng hơn hồ sơ không cuộn ngang); tests/e2e/ghim-ngan.spec.ts (E2) |
| Không đủ quyền   | không áp | Nút Ghim không theo quyền: mọi vai mở được hồ sơ thì có nút (hợp đồng, Vai × Màn)                        |
| Xung đột khi lưu | không áp | Ghim là lựa chọn giao diện trên trình duyệt, không ghi gì của sàn                                        |
| Phiên hết hạn    | không áp | Của khung (App Shell), không của vùng                                                                    |
| Mất mạng khi lưu | không áp | Ghim lưu bằng cookie trên trình duyệt, không qua mạng                                                    |
| Link hết hạn     | không áp | Trạng thái của trang khách; Bảng hàng là màn nội bộ                                                      |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| app-shell-11 | reui | dáng chi tiết cạnh nội dung ghim được (app-shell-11, ai-chat-2, sheet-9) | ai-chat-2 | cột ghim rộng cố định, không kéo đổi rộng được (lời chủ kho hàng 3) | ghép từ thành phần |
| DataRegion | trong-kho | | | | |
| Button | trong-kho | | | | |
| Frame | trong-kho | | | | |

### Vùng

| Khối | Vùng | Xử lý | Lý do |
| --- | --- | --- | --- |
| app-shell-11 | cột Details cạnh nội dung, vạch chia mảnh kéo được | lấy | hồ sơ ghim thành cột, kéo đổi rộng (AC-2, AC-5) |
| app-shell-11 | thẻ Details, Comments ở đầu cột | bỏ | hồ sơ có đầu hai dòng của hàng 3e; thẻ AI là hàng sau |
| app-shell-11 | thanh nút bật tắt bốn vùng | bỏ | chỉ một cột cần ghim; nút Ghim ở đầu hồ sơ |
| app-shell-11 | bàn làm việc đáy và lịch bên phải | bỏ | không thuộc việc của Bảng hàng |
| app-shell-11 | nút Ghim ở đầu hồ sơ, nhớ ghim bằng cookie | thêm | bật tắt dáng cột tại chỗ việc trên cả bản ghi (AC-1, AC-6) |

## Màn sent

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/ho-so-can.md | cạnh bảng là cột kéo chia app-shell-11, mặc định 38%, kéo 28–50%; ngăn nổi đè bảng thì che Lọc, Nhóm, Cột | cột kéo chia app-shell-11; không che thanh công cụ | cột luôn ở dáng chia (hồ sơ kho này mặc định nổi, chủ kho chọn «B có ghim»); khoảng 28–50% | hàng 3 chọn ngăn nổi (0024), ghim là dáng thứ hai; khoảng kéo 320 px tới 60% để giữ sàn 320 px của ngăn nổi |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | theo mẫu | Đã gửi dùng cùng khung hồ sơ chung với Bảng hàng |

### Ảnh cạnh màn mẫu

| Khổ | Màn này | Màn mẫu | Dữ liệu |
| --- | --- | --- | --- |
| 360 | evidence/sent-360.png | evidence/inventory-360.png | mẫu Ocean Park hàng 1 và 14 link mẫu, hồ sơ dòng đầu mở |
| 414 | evidence/sent-414.png | evidence/inventory-414.png | mẫu Ocean Park hàng 1 và 14 link mẫu, hồ sơ dòng đầu mở |
| 1024 | evidence/sent-1024.png | evidence/inventory-1024.png | mẫu Ocean Park hàng 1 và 14 link mẫu, hồ sơ dòng đầu ghim |
| 1440 | evidence/sent-1440.png | evidence/inventory-1440.png | mẫu Ocean Park hàng 1 và 14 link mẫu, hồ sơ dòng đầu ghim |

### Mặt so

| Mặt | Kết quả | Căn cứ |
| --- | --- | --- |
| Khung và bố cục | giống | ảnh 1440: hồ sơ ghim thành cột sát mép phải, vùng dữ liệu nhường đúng bề rộng cột |
| Cột chính và góc nhìn | khác — có lý do | `src/modules/sharing/ui/sent-rows.ts`: cột đầu là Người nhận (hàng 6) |
| Thanh công cụ, lọc, tìm, sắp xếp | giống | ảnh 1440: thanh công cụ không bị hồ sơ che ở cả hai dáng |
| Bảng | giống | ảnh 1440: bảng co lại, không cột nào bị giấu |
| Mở chi tiết cạnh bảng | giống | ảnh 1440: cùng nút Ghim ở dòng hai đầu hồ sơ, trước Trước, Sau, Đóng |
| Trạng thái tải, trống, lỗi | khác — có lý do | `src/modules/sharing/ui/sent-grid.tsx`: lời mời ở trạng thái trống là «Mở Bảng hàng» (hàng 6) |
| Ghi và báo đã lưu | khác — có lý do | `_acceptance/da-gui-tren-luoi/contract.md`: màn chỉ đọc |
| Phím tắt | giống | ảnh 1440: vạch chia nhận mũi tên trái, phải như mọi màn dùng khung |
| Điện thoại | giống | ảnh 360: hồ sơ toàn màn, không có nút Ghim |
| Tốc độ mở màn | giống | ảnh 1024: cùng khung, không tải thêm gì khi ghim |
| Chữ và nhãn | giống | ảnh 1440: nhãn Ghim, Bỏ ghim, Đổi rộng hồ sơ ở `src/components/candidate/grid-copy.ts` |
| Quyền theo vai | giống | ảnh 1440: nút Ghim không theo quyền, như ở Bảng hàng |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| DataRegion | trong-kho | | | | |
| app-shell-11 | reui | dáng chi tiết cạnh nội dung ghim được (app-shell-11, ai-chat-2, sheet-9) | ai-chat-2 | cột ghim rộng cố định, không kéo đổi rộng được | ghép từ thành phần |

### Vùng

| Khối | Vùng | Xử lý | Lý do |
| --- | --- | --- | --- |
| app-shell-11 | cột Details cạnh nội dung, vạch chia kéo được | lấy | cùng khung hồ sơ với Bảng hàng |
| app-shell-11 | thẻ, bàn làm việc đáy, lịch bên phải | bỏ | không thuộc việc của Đã gửi |
| app-shell-11 | nút Ghim ở đầu hồ sơ | thêm | cùng nút của khung chung (AC-1) |
