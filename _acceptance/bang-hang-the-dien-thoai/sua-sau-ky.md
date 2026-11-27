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

## Lượt 2 — CI đỏ trên PR #70 (`a049714`)

CI chạy trên máy chậm, trình duyệt nhận trang muộn. Trước lúc ấy vùng còn chứa cả hai bố cục, một cái bị ẩn. 19 bài cũ
đếm phần tử (kể cả phần ẩn) ngay khi dòng hiện, nên thấy «bảng 1, thẻ 60» hoặc hai chỗ đếm dòng. Không phải mất mạng hay
máy ngủ: lỗi lặp y nguyên, 0 lần thử lại. Chứng: giữ các tệp script 6 giây ở máy → cách chờ cũ ra đúng «table 1, cards
60», cách chờ mới ra «table 0, cards 60».

| Chỗ | Người dùng thấy khác gì | Phép |
| --- | --- | --- |
| Vùng gắn dấu `data-hydrated` khi trình duyệt đã nhận trang và chỉ còn một bố cục (`src/components/candidate/data-region.tsx`) | Không | XONG D-1511-13 |
| `tests/e2e/phone-list.ts`: `regionReady` chờ đúng một vùng đang hiện mang dấu ấy, trần 20 giây, hết trần thì đỏ «region not hydrated (vung chua nhan trang): shown N, hydrated M»; `rowsShown` chờ nó trước khi đếm — đổi LÚC đo, không đổi cách tìm | Không | XONG D-1511-13 |
| `tests/e2e/the-dien-thoai.spec.ts`: `openAt()` chờ `regionReady` thay vì chờ phần tử vùng đầu tiên (bài :92 đỏ chập chờn trên PR #66 vì trúng hai vùng đang ẩn) | Không | G-1511-47 |
| `tests/e2e/bang-loe.spec.ts`: sau khi nhận trang, trang chỉ còn một nhánh (bảng 0 ở 360/414, thẻ 0 ở 1440, đếm cả phần ẩn); ba ca phá: bảng ẩn còn sót, mất dấu, hai vùng hiện | Không | XONG D-1511-13 |

Bài đổi lúc đo (qua `rowsShown`, cách tìm giữ nguyên), 360 và 414:
`screens/inventory-width.spec.ts:66`, `screens/open-cell-truncate.spec.ts:75`, `sheet.spec.ts:125`, `sheet.spec.ts:285`,
`sheet.spec.ts:620`, `sheet.spec.ts:1085`, `sheet.spec.ts:1145`, `sua-tren-o.spec.ts:235`; qua `openAt()`:
`the-dien-thoai.spec.ts:51` (768, 1024, 1440) và `the-dien-thoai.spec.ts:92`.

Thêm theo XONG D-1511-14, mỗi hàm một dòng `await regionReady(page)`, cách tìm giữ nguyên:
`loi-vao-ho-so.spec.ts` qua `openInventory` (`:196`, `:215`, `:490`, hai chỗ «Không có dòng nào khớp») và
`e2e-db/goc-nhin.spec.ts` qua `settled` (`:445`, `:672`, hai chỗ đếm dòng).

Lượt CI trên `7c45689` (XONG D-1511-15): `goc-nhin.spec.ts` bài `remove` đọc «60 dòng» ngay sau `page.goto`, không qua
`settled` — thêm một dòng `regionReady` trước chỗ đọc. Rà cả `tests/e2e` và `tests/e2e-db` tìm chỗ đọc số dòng hay đếm
thẻ ngay sau `page.goto` mà không chờ trang nhận xong: còn `screens/inventory-width.spec.ts` hàm `measure`, thêm một dòng
như trên. Các chỗ khác đã chờ dấu nhận trang của bảng (`tabindex="0"`) hoặc một hàm chờ chung. `bang-loe.spec.ts` (tệp
của lượt này): ba bài ghi khung hết giờ ở CI vì chờ mạng yên khi CPU chậm 6 lần — nay chờ dấu nhận trang (trần 60 giây),
thời hạn bài gấp ba.

Lớp «vẽ chân vùng và trạng thái rỗng một lần» không làm (G cho bỏ, XONG D-1511-14): hai chỗ ấy nằm ở hai vị trí khác
nhau trên màn (thanh trên của thẻ, chân bảng), gộp lại là đổi điều người dùng thấy.

## VP10 lát 1, 2026-11-27

| Chỗ | Người dùng thấy khác gì | Phép |
| --- | --- | --- |
| `tests/e2e/the-dien-thoai.spec.ts` «vung-cham»: nút hàng công cụ tự cao 44 px (nút chỉ hình rộng 44), «Lọc» có chữ, «Lưu góc nhìn» đứng thẳng trên hàng, không còn «…» tên «Thêm», hàng không xuống dòng (≤ 60 px); thay phân xử G-1411-130 (nút 36 px trong vùng chạm 44); ca phá đổi theo | Có: nút to hơn, «Lọc» có chữ, «Lưu góc nhìn» hiện thẳng | «Duyệt cả sáu điểm» (L1, L5), luật «…» |
| `tests/e2e/sheet.spec.ts` «sheet tab stops» trên điện thoại: bỏ điểm dừng «Thêm» | Có: bớt một điểm dừng Tab | L1 |
| `tests/e2e/screens/open-cell-truncate.spec.ts` «inventory: a unit code in a narrowed column fits its cell and is cut»: nút mở lấy trong ô bảng (`td [data-record-open]`), mã căn và mã cột đọc trong một lần, chờ ô mang mã cột (không chờ theo giờ); điều đo không đổi. Lý do: ngay sau khi vùng sẵn sàng, ô có thể còn vẽ lại, lần đọc thứ hai rơi vào nút vừa rời bảng nên mã cột rỗng — đỏ hai lần trên main `1f4e7d36`, dựng lại trên Linux 1/6; sau sửa 72/72 (12 lần × 1440, 360). Commit `2fcd4039` | Không | Giám sát G-2811-6 |
