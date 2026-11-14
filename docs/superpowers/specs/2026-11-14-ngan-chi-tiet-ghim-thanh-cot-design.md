# Ngăn chi tiết ghim thành cột — thiết kế (hàng 3a)

Hồ sơ: `_acceptance/ngan-chi-tiet-ghim-thanh-cot/`. Ô Cổng Đáng: «build» (chủ kho, 2026-11-12).

## Bài toán

Hàng 3 dựng hồ sơ căn là ngăn nổi bên phải (quyết định 0024, chủ kho «Lấy B có ghim»). Ngăn nổi che phần phải của bảng.
Khi đầu chủ làm lâu trên một căn — đi Trước, Sau, sửa giá ở bảng, đối chiếu với các dòng khác — ngăn nổi che đúng những
cột họ cần nhìn. Lời chủ kho ở Cổng Phạm vi hàng 3 (sổ `ho-so-can#d-20261112T072108Z-16`): «Nút ghim (ngăn thành cột,
kéo đổi rộng) … làm ở hàng sau». Hàng này là hàng sau ấy.

## Lối đã chọn

**Ghim biến ngăn nổi thành một cột đứng cạnh bảng; vạch chia giữa bảng và cột kéo được để đổi rộng.** Dáng theo khối
ReUI `app-shell-11` (nội dung | cột Chi tiết, vạch chia mảnh kéo được) và thành phần `Resizable` của ReUI/shadcn
(gói `react-resizable-panels`). Ảnh khối gốc chụp trước khi dựng: `_acceptance/<slug>/evidence/reui/`.

Ứng viên đã xét (tra `tools/reui_catalog` và trang ReUI, máy chủ ReUI MCP lỗi đăng nhập):

| Ứng viên                                  | Dáng                                           | Kết                                                                    |
| ----------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------- |
| `app-shell-11` + `Resizable`              | cột chi tiết cạnh nội dung, vạch chia kéo được | **chọn** — đúng lời chủ kho «kéo đổi rộng»                             |
| `ai-chat-2` (ngăn trợ lý ghim cạnh trang) | cột ghim rộng cố định, nút bật tắt ở góc       | rút — không kéo đổi rộng được                                          |
| Khối `Sheet` (sheet-9…)                   | ngăn trượt nổi                                 | là dáng ngăn nổi hôm nay; ReUI ghi rõ «không kéo đổi rộng», không ghim |

Kho chưa có cơ chế kéo đổi rộng nào: cột thứ hai của App Shell chỉ đóng mở và nhớ bằng cookie
(`src/components/templates/app-shell/column-cookie.ts`), không kéo. Nên không có hai cách kéo sống song song; khung
chia của hàng này là cách kéo đầu tiên, vào sổ khối.

## Hành vi

- Nút **Ghim** (chỉ biểu tượng, tên đọc «Ghim thành cột» / «Bỏ ghim», `aria-pressed`) nằm ở dòng hai đầu hồ sơ, sau các
  nút của bản ghi (Chép đường dẫn, «…»), trước Trước, Sau, Đóng — đúng chỗ giám sát chốt cho hàng 3e (đầu hồ sơ hai dòng ở
  mọi khổ). Nút thuộc khung `RecordPanel`, nên mọi màn dùng khung chung có nó: hôm nay Bảng hàng và Đã gửi.
- Ghim: ngăn rời khỏi dáng nổi (bỏ bóng, bỏ lề), thành cột sát mép phải vùng làm việc, từ ngay dưới thanh trên tới đáy.
  Vùng dữ liệu co lại đúng bằng bề rộng cột: không dòng nào bị che, không cột nào bị tự giấu — cột nào không vừa thì
  bảng cuộn ngang như mọi khi.
- Bỏ ghim: cột thành ngăn nổi lại, cùng bản ghi; bảng về đủ rộng.
- Kéo vạch chia đổi rộng cột: hẹp nhất 320 px, rộng nhất ba phần năm vùng làm việc; mặc định hai phần năm như ngăn nổi.
  Vạch chia nhận phím mũi tên trái, phải khi có tiêu điểm.
- Trạng thái ghim và độ rộng giữ khi đi Trước, Sau, bấm căn khác, đóng rồi mở lại, tải lại trang, sang màn khác dùng
  khung chung. Đóng khi đang ghim thì cột biến mất và bảng về đủ rộng; lần mở sau, hồ sơ mở thành cột.
- Lưu ở đâu: một cookie lựa chọn giao diện của riêng người dùng (`ho_so_ghim`, giá trị dạng `1:520`), cùng cách cột thứ
  hai của App Shell nhớ đóng mở. Không mang mã căn, mã sàn hay dữ liệu nào của sàn — đúng luật «không giữ dữ liệu sàn trên
  máy».
- Esc khi tiêu điểm trong hồ sơ thì đóng hồ sơ ở cả hai dáng, như hôm nay; Esc ở bảng (kể cả ô đang sửa) không đóng hồ sơ
  ghim. Đổi dáng giữ tiêu điểm ở nút Ghim và vị trí cuộn của thân hồ sơ. Ngăn ghim không khoá bảng.
- Nút Ghim chỉ hiện khi vùng làm việc rộng từ 800 px (cột 320 px + bảng 480 px); ở 768 với cột hai App Shell mở thì hồ
  sơ chỉ nổi. Vùng ở Toàn màn hình: cột vẫn đứng cạnh.
- Điện thoại (dưới 768 px): hồ sơ vẫn mở toàn màn, không có nút ghim (Hỏi-1).

## Gói mới

`react-resizable-panels` (MIT, của bvaughn), cài cùng thành phần `resizable` bằng lệnh shadcn. Giám sát cho chạm ba tệp
ngoài vùng (tin D-1311-31) với năm điều kiện; trang quyết định 0031 ghi tên gói, giấy phép, cỡ, vì sao. Bản bấm được ở
Cổng Phạm vi dựng theo hình, chưa cài gói.

<!-- <<<UX-SPEC-TEMPLATE -->

## Đặc tả UX

### 1. Luồng

- Suôn sẻ: Bảng hàng → bấm mã căn → hồ sơ nổi → bấm Ghim → hồ sơ thành cột, bảng co lại → Sau, Sau… (cột giữ) → kéo vạch
  chia rộng thêm → Bỏ ghim (điểm ra: ngăn nổi lại) hoặc Đóng (bảng đủ rộng, lần sau mở thành cột).
- Biên: màn hẹp 768 — cột 320 px, bảng còn phần còn lại và cuộn ngang; vùng ở chế độ Toàn màn hình — cột vẫn đứng cạnh.
- Lỗi & quay lại: cookie hỏng hay rộng ngoài giới hạn → đọc như chưa ghim, độ rộng mặc định; không có lỗi người thấy.

### 2. Kiểm kê màn

| Màn                     | MỘT việc của màn                                 | Vào từ / ra tới           |
| ----------------------- | ------------------------------------------------ | ------------------------- |
| Bảng hàng (`inventory`) | xem và sửa hàng, hồ sơ căn đứng cạnh khi làm lâu | thanh bên, ⌘K / hồ sơ căn |
| Đã gửi (`sent`)         | xem các lần gửi, chi tiết một lần gửi đứng cạnh  | thanh bên / ngăn chi tiết |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->

| Trạng thái              | Màn       | Hiển thị gì                                                | Người làm gì tiếp         |
| ----------------------- | --------- | ---------------------------------------------------------- | ------------------------- |
| ST-inventory-noi        | Bảng hàng | ngăn nổi như hàng 3, nút Ghim chưa bấm                     | Ghim, Trước, Sau, Đóng    |
| ST-inventory-ghim       | Bảng hàng | cột hồ sơ cạnh bảng, vạch chia kéo được, nút Ghim đang bấm | kéo vạch, Bỏ ghim, Đóng   |
| ST-inventory-ghim-dong  | Bảng hàng | bảng đủ rộng, chưa mở căn nào (đã ghim từ trước)           | bấm mã căn → mở thành cột |
| ST-inventory-dien-thoai | Bảng hàng | hồ sơ toàn màn, không có nút Ghim                          | Trước, Sau, Đóng          |
| ST-sent-ghim            | Đã gửi    | cột chi tiết lần gửi cạnh bảng                             | như Bảng hàng             |

<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Vạch chia: `role="separator"`, có tên, `aria-valuenow` theo phần trăm; mũi tên trái, phải đổi 5%.
- Nút Ghim: chỉ biểu tượng ghim; khi đang ghim là biểu tượng bỏ ghim và `aria-pressed="true"`.
- Từ 768 px trở lên mới có nút; dưới 768 px không có.

### 5. Xuất xứ component

| Component                                      | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng)                                               |
| ---------------------------------------------- | --------------------------------- | ------------------------------------------------------------- |
| `RecordPanel` (candidate)                      | mở rộng                           | khung hồ sơ chung có thêm dáng cột; mọi màn dùng nó tự có nút |
| `Resizable` (shadcn, ReUI)                     | dùng                              | vạch chia kéo được theo khối app-shell-11                     |
| `Button` + biểu tượng `Pin`, `PinOff` (lucide) | dùng                              | nút chỉ biểu tượng như «Chép đường dẫn»                       |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: luồng hiển nhiên — bảng là danh sách, hồ sơ là chi tiết; hàng 3 đã chọn chi tiết cạnh danh sách, hàng này chỉ
thêm dáng ghim của chi tiết.

### 7. Thẻ việc

| Trường     | Giá trị                                           |
| ---------- | ------------------------------------------------- |
| Ai dùng    | Đầu chủ (ListAgent), Đầu khách, Trưởng nhóm       |
| Việc chính | làm lâu trên một căn mà vẫn nhìn và sửa được bảng |
| Tần suất   | mỗi ngày nhiều lần                                |
| Số bản ghi | hàng trăm trở lên                                 |
| Thiết bị   | máy tính                                          |

<!-- UX-SPEC-TEMPLATE>>> -->

## Câu cho chủ kho ở Cổng Phạm vi

- **Hỏi-1 · Trên điện thoại, «ghim» nghĩa là gì?** Khuyến nghị: không có nút ghim; hồ sơ vẫn mở toàn màn như hôm nay —
  màn 360 không đủ chỗ cho bảng và cột cùng lúc. Lối khác: ghim = hồ sơ thành trang riêng có địa chỉ riêng — trái lời chủ
  kho ở Cổng Phạm vi 3f «Không làm trang riêng cho một căn».

- **Hỏi-2 · Ở màn hẹp (1024), ghim khi cột thứ hai của App Shell đang mở thì sao?** Khuyến nghị: A — giữ nguyên cột thứ
  hai; bảng còn trọn hai cột dữ liệu (Căn, Toà), người dùng tự gập cột thứ hai bằng một cú bấm nếu cần. Lối khác: B — bấm
  Ghim thì cột thứ hai tự gập, bỏ ghim thì trở lại; bảng thêm khoảng 300 px nhưng đổi hành vi App Shell (chủ kho chốt giữ
  hai cột ngày 11/11) ở riêng tình huống này.

## Ngoài phạm vi

- Lớp trò chuyện với AI trong ngăn (thẻ thứ hai của cùng ngăn) — hàng sau, chưa có ô.
- Ghim nhiều hồ sơ cùng lúc, hay ghim bên trái.
- Lưu trạng thái ghim lên máy chủ để theo người qua thiết bị khác.
