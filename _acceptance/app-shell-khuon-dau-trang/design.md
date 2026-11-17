# Thiết kế: App Shell và đầu trang theo mẫu Verve (app-shell-khuon-dau-trang)

## Nguồn

Chủ kho xem bản dev ngày 17/11/2026, so với trang Settings của mẫu Verve CRM (https://verve-crm.reui.io/settings — mẫu
do ReUI dựng), khoanh từng chỗ trên ảnh chụp bản dev. Lời nguyên văn, theo thứ tự:

1. «https://verve-crm.reui.io/settings gắn nhãn các component và so sánh với inventory từ đó đánh giá.»
2. Khoanh nút gập, viền cột thứ hai, ô tìm: «button, thanh khung cột 2, box search. so sánh phần này»
3. Gửi ảnh menu tài khoản của Verve: «reui đưa xuống bên dưới cột 1»
4. Khoanh đường dẫn của Verve: «Thanh trên, đường dẫn khá đồng nhất ở mọi màn, nó giống như một thành phần của shell
   hơn là phần riêng của màn?»
5. Khoanh tiêu đề «Bảng hàng»: «Tiêu đề lớn đang mất một khoảng không lớn và thường trùng với tiêu đề nhỏ»
6. Khoanh nút bật thanh bên ở góc trái thanh trên: «Trùng với thanh gập bên dưới»
7. Khoanh nút giao diện và nút «T»: «Đưa các hạng mục này vào profile»
8. «Phần profile này có vẻ không dùng reui mà tự tạo?»
9. «Chỉ ghi lại», rồi đổi ý: «Tôi nghĩ dựng lại cho tôi xem trước hoàn chỉnh»
10. Sau khi bấm thử bản xem trước ở cổng 3470, về luật kiểm mã chặn bề rộng menu: «Cho nới»

Ghi chép đầy đủ (số đo hai bên): sổ ghi chú của đợt, tệp `dieu-chinh-hang-muc-verve-settings.md`.

## Sáu chỗ (A1–A6) và cách làm

| Mã | Chỗ | Trước | Sau |
|---|---|---|---|
| A1 | Nút gập cột thứ hai | nút vuông 24×24, vạch đứng tĩnh, giữa chiều cao CỘT, chiếm rãnh 24 px riêng | dải bấm trên mép cột, giữa chiều cao CỬA SỔ, không chiếm chỗ; hai nét bẻ thành ‹ (cột đang mở) hay › (đang gập) khi rê chuột hay khi Tab tới; viền cột sáng lên khi rê |
| A2 | Viền cột thứ hai | cao bằng các mục (240 px ở Tuỳ chỉnh của sàn) | chạy hết chiều cao màn hình |
| A3 | Ô tìm | 145 px sát góc phải | giữa thanh trên, 320 px; phím ⌘ và K tách hai ô; không thêm ô chọn phạm vi (Inventory chỉ tìm mã căn) |
| A4 | Menu tài khoản | nút «T» và nút sáng/tối riêng ở góc phải thanh trên; menu hẹp bằng nút (128 px), email bẻ dòng | ảnh đại diện ở đáy dải biểu tượng; menu rộng 320 px (ảnh đại diện nhỏ): tên + email tới khoảng 40 ký tự một dòng, dài hơn thì cắt «…» và hiện đủ khi rê, sàn đang mở, đổi sàn, hàng ba lựa chọn giao diện, đăng xuất; chưa đăng nhập: giao diện + đăng nhập |
| A5 | Đầu trang | tiêu đề lớn 24 px, 88 px từ thanh trên tới khung, trùng tên khung | một hàng mảnh: tên màn (vẫn `h1`) › nơi đang mở ở cột thứ hai, nút chính cuối hàng |
| A6 | Nút bật thanh bên | ở mọi khổ; trên máy tính mở dải biểu tượng thành cột có chữ | chỉ ở điện thoại (mở tấm menu); trên máy tính dải luôn là biểu tượng, ⌘B không mở |

Ngoài sáu chỗ: dấu của bản dev Next.js sang góc phải dưới (góc trái dưới nay là nút tài khoản); luật kiểm mã
`shadcn/no-restyle` cho `DropdownMenuContent` nhận lớp bề rộng (`w-*`, `min-w-*`) — theo lớp thành phần và nhóm lớp,
không phải dòng miễn trừ một chỗ.

Câu 4 (đường dẫn có thuộc shell không): đo trên Verve, đường dẫn «Home › CRM › Dashboard» nằm trong vùng nội dung, cuộn
theo trang, cạnh nút riêng của màn — tức khuôn đầu trang mỗi màn tự dựng, không phải phần của shell. A5 làm đúng như vậy:
hàng mảnh thuộc `PageHeader`, đọc nơi đang mở từ cột thứ hai qua ngữ cảnh App Shell đưa xuống.

Câu 8 (profile tự tạo): đúng một nửa — mảnh ghép là shadcn, cách xếp tự ráp, không qua bậc chọn từ ReUI. A4 xếp theo
menu của Verve (mẫu ReUI); MCP ReUI không vào được trong phiên (thiếu đăng nhập), nên cách xếp đọc từ cấu trúc trang
Verve.

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: mở một màn nội bộ → đầu trang nói «tên màn › nơi đang mở» → chọn nơi khác ở cột thứ hai thì phần sau «›»
  đổi theo → gập cột bằng dải trên mép, mở lại bằng chính dải ấy → đổi giao diện hay đăng xuất từ menu ở đáy dải biểu
  tượng (điểm ra: màn đăng nhập khi đăng xuất)
- Biên: màn không có nơi con (Hôm nay, Thành viên) → đầu trang chỉ có tên màn; nơi trùng tên màn → không lặp; chưa đăng
  nhập → menu chỉ có giao diện và «Đăng nhập»; người thuộc một sàn → không có «Đổi sàn»
- Lỗi & quay lại: màn lỗi, không tìm thấy, hết phiên giữ nguyên trạng thái toàn trang của kho; App Shell (dải, cột hai,
  menu) vẫn đứng quanh để đi tiếp

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| App Shell (mọi màn nội bộ) | đưa người tới màn và nơi họ cần, cho biết đang đứng ở đâu | đăng nhập / mọi màn nội bộ |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-shell-cot-mo | App Shell | cột hai mở, viền hết chiều cao, dải gập giữa cửa sổ, rê thì hiện ‹ | gập cột hay chọn nơi |
| ST-shell-cot-gap | App Shell | cột hai rộng 0, dải trên mép trái vùng nội dung, rê thì hiện › | mở lại cột |
| ST-shell-menu-dang-nhap | App Shell | menu: tên, email một dòng, sàn đang mở, đổi sàn (nếu nhiều sàn), ba giao diện, đăng xuất | đổi giao diện, đổi sàn, đăng xuất |
| ST-shell-menu-chua-dang-nhap | App Shell | menu: ba giao diện, «Đăng nhập» | đăng nhập |
| ST-shell-dien-thoai | App Shell | thanh trên: nút mở tấm menu, tên sàn, ô tìm dạng biểu tượng; tấm menu có dải, cột hai, menu tài khoản ở đáy | chọn màn hay nơi |
| ST-dau-trang-co-noi | mọi màn có cột hai | «Tên màn › Nơi» một hàng, nút chính cuối hàng | làm việc chính |
| ST-dau-trang-khong-noi | Hôm nay, Thành viên | chỉ tên màn | làm việc chính |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Dải gập: Tab tới được, tên đọc «Gập cột thứ hai» / «Mở cột thứ hai», `aria-expanded`; lựa chọn nhớ qua tải lại (cookie
  cũ của hàng 1o)
- Menu tài khoản: phím mũi tên đi qua Đổi sàn, ba lựa chọn giao diện, Đăng xuất; chọn giao diện không đóng menu
- Khổ: từ 768 px là máy tính (dải, cột hai, ô tìm giữa); dưới 768 là điện thoại (tấm menu)

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| Sidebar, SidebarFooter (shadcn) | dùng | dải biểu tượng và chân dải có sẵn |
| DropdownMenu, Avatar (shadcn) | ghép | menu tài khoản theo cách xếp của Verve |
| Menu.RadioGroup / RadioItem (Base UI, dưới DropdownMenu) | ghép | ba giao diện là mục của menu để phím mũi tên tới |
| Button (shadcn) | dùng | dải gập, nút ô tìm |
| PageHeader (kho) | mở rộng | hàng mảnh thay tiêu đề lớn |
| PlaceCrumb, ShellNavProvider, RailProvider (kho) | tạo | đọc nơi đang mở cho đầu trang; giữ dải không mở rộng |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: trung-tâm-toả-nhánh (hub-and-spoke)
Căn cứ: giữ khuôn của hàng 1o (dải màn → cột nơi → vùng màn); vòng này chỉ đổi cách bày, đối chiếu trực tiếp trang
Settings, Team, Billing, Dashboard của Verve trong khung trình duyệt.

### 7. Thẻ việc

| Trường | Giá trị |
|---|---|
| Ai dùng | mọi nhân viên sàn (Đầu chủ, Đầu khách, Trưởng nhóm, Quản trị sàn) |
| Việc chính | biết mình đang ở màn nào, nơi nào, và đi sang màn hay nơi khác |
| Tần suất | mỗi ngày nhiều lần |
| Số bản ghi | vài chục mục ở cột hai |
| Thiết bị | cả hai |
<!-- UX-SPEC-TEMPLATE>>> -->

## Kế hoạch (đã dựng trước khi mở hồ sơ — commit bfcb647)

| Việc | Tệp | Phục vụ |
|---|---|---|
| Dải gập trên mép, viền hết chiều cao | `src/components/templates/app-shell/second-column.tsx` | AC-1, AC-2 |
| Ô tìm giữa thanh trên | `src/components/templates/app-shell.tsx`, `src/modules/listings/ui/unit-jump.tsx` | AC-3 |
| Menu tài khoản ở chân dải, ba giao diện trong menu | `src/app/(app)/account-menu.tsx`, `src/components/templates/theme.tsx`, `app-shell.tsx`, `frame-copy.ts`, `eslint.config.js`, `next.config.ts` | AC-4 |
| Đầu trang một hàng mảnh, nơi đang mở | `src/components/templates/page-header.tsx`, `app-shell/place-crumb.tsx`, `shell-focus.tsx` | AC-5 |
| Dải không mở rộng, nút thanh bên chỉ ở điện thoại | `app-shell/rail-provider.tsx`, `app-shell.tsx` | AC-6 |
| Bài kiểm | `tests/app-shell.test.tsx`, `tests/e2e/app-shell.spec.ts`, `tests/e2e/frame.spec.ts`, `tests/e2e/grid.spec.ts`, `tools/e2e_templates/settle.ts` | AC-1..AC-8 |
