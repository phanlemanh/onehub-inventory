# 2b · Sửa sau chữ ký

Chủ kho ký Cổng Bằng chứng của hàng 2b; hàng đã gộp vào nhánh chính (PR #63, `c53b35d`). Dãy K đo ở khổ 360 (nhánh 2d,
`evidence/loe-360.txt`): Bảng hàng hiện BẢNG 3–4 khung hình (20–70 ms) rồi mới đổi sang thẻ căn lúc 160–180 ms. Giám sát
giao việc phụ VP4 cho dãy D (G-1511-30) và duyệt lối sửa cùng bốn tệp (XONG D-1511-11).

## Gốc

Vùng dữ liệu chọn bảng hay thẻ bằng một hàm đo bề rộng trả «không phải điện thoại» ở máy chủ và ở lần vẽ đầu của trình
duyệt, chỉ đổi sau khi trang chạy JS. HTML máy chủ vì thế luôn là bảng.

## Đã đổi, giám sát cho

| Chỗ | Người dùng thấy khác gì | Phép |
| --- | --- | --- |
| Khi chưa biết bề rộng (máy chủ và lần vẽ đầu), vùng dữ liệu vẽ cả thẻ lẫn bảng; luật 768 px của bảng kiểu ẩn cái không hợp từ khung đầu; đo xong thì chỉ vẽ một cái như trước (`src/components/candidate/data-region.tsx`, `src/components/candidate/use-phone-layout.ts` mới) | Có: ở điện thoại hết thấy bảng loé trước thẻ; ở máy tính không loé thẻ. Ngoài ra không đổi | XONG D-1511-11 |
| Bài trình duyệt mới `tests/e2e/bang-loe.spec.ts`: ghi từng khung hình từ khung đầu (CPU chậm 6 lần) ở 360, 414, 1440; khung vẽ đôi có cây trợ năng một (không id lặp, không id trỏ khoảng trống, tên vùng đọc một lần); không cảnh báo Hydration; ba ca phá | Không | XONG D-1511-11 |

Chứng ngược: chạy bài mới trên mã cũ của nhánh chính → đỏ «360: bang hien o khung 1» và «414: bang hien o khung 1».
Bài cũ không đổi cách tìm: `tests/e2e/the-dien-thoai.spec.ts` 32/32 xanh ở 360, bài đơn vị và thành phần 1045/1045 xanh.
Hàm đo bề rộng dùng chung (`src/hooks/use-mobile.ts`, thanh bên và hồ sơ căn) không đổi.
