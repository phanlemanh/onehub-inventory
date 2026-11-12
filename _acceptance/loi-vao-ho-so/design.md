# Thiết kế: Lối vào hồ sơ (hàng 3f)

Ngày 2026-11-13 · dãy R của đợt «nen» · hạng T2 · dựng trên hàng 3 (Hồ sơ căn, đã gộp) và hàng 9e (bộ nút theo quyền,
chưa gộp — nút ở đầu hồ sơ dùng khe `actions` của 9e).

## Việc của hàng

Đầu chủ đang xem một căn cạnh Bảng hàng muốn gửi căn ấy cho đồng nghiệp, hoặc đang nghe điện thoại và biết mã căn mà không
muốn dò bảng. Hàng này mở ba lối vào cùng một hồ sơ căn của hàng 3:

1. **«Mở toàn màn»** ở đầu hồ sơ → trang riêng của căn, có địa chỉ riêng.
2. **«Chép đường dẫn»** trên trang riêng → đồng nghiệp cùng sàn mở là thấy đúng căn, đúng lần chào.
3. **«Gõ mã căn»** ở thanh trên của App Shell → tới thẳng trang riêng của căn; mã có ở nhiều toà thì chọn toà trước.

Trang riêng **không dựng hồ sơ mới**: thân là `ListingRecordBody` của hàng 3 (khung hồ sơ dùng chung của Lưới, quyết định
0023). Hàng này chỉ thêm khung trang quanh thân ấy, phép tìm căn theo mã và hai nút.

## Ranh giới với hàng 12

Hàng 12 «Thêm căn» cũng có ô gõ mã căn, nhưng để **thêm** một căn mới vào Bảng hàng. Ô của hàng này chỉ **tìm** căn đã có
trong Bảng hàng; mã không có thì nói rõ là không có và không mở gì, không gợi ý thêm căn. Hai ô ở hai chỗ khác nhau (ô này ở
thanh trên, ô của hàng 12 trong hộp thêm căn) và không dùng chung phép xử lý mã.

## Từ Quỹ hàng

Đã đọc (chỉ đọc, `onehub-quy-hang` nhánh chính): `apps/web/src/app/(app)/units/[code]/page.tsx`,
`units/ho-so/ho-so-toan-man.tsx`, `units/ho-so/than-cot.tsx` (`NutToanMan`, `KhongNhieu`), `units/ho-so/ho-so.ts`
(`timCan`, `docCot`), `components/shell/unit-jump.tsx`; trang tri thức `docs/tri-thuc/wiki/chu-de/ho-so-can.md`; bảng so
«Chi tiết căn Quỹ hàng ↔ Inventory» mục 4, 5, 6, 40.

| Quỹ hàng làm | Hàng này | Vì sao |
|---|---|---|
| Trang `/units/<mã>?toa=&lan=` dùng lại chính cột hồ sơ | **Giữ**: `/inventory/units/<mã>?toa=&ho-so=` dùng lại thân hồ sơ hàng 3 | Đường dẫn đọc được bằng mắt; `ho-so` là chữ hàng 3 đã dùng cho id lần chào |
| Nút biểu tượng «Mở toàn màn» (Maximize) ở đầu cột | **Giữ**, đặt trong khe nút đầu hồ sơ của 9e, trước «Trước», «Sau», «Đóng» | Cùng chỗ người đã quen |
| «Không có căn này trong Bảng hàng» | **Giữ** chữ; thêm lối «Về Bảng hàng» ở mọi khổ (Quỹ hàng chỉ có ở điện thoại) | Trang riêng không có bảng bên cạnh để quay lại |
| «Nhiều căn» + một nút cho từng toà | **Giữ** | Đúng ý định của hàng |
| Ô «Gõ mã căn» là bảng lệnh ⌘K (cmdk), gõ tên nhà cũng nhảy | **Đổi** (Hỏi-1): hộp ghép từ kho, chỉ mã căn | Kho chưa có bảng lệnh; nhảy theo tên màn đã có ở thanh bên |
| Lần chào chọn trong trang (`lan`) | **Bỏ cho MVP**: trang hiện một lần chào; danh sách các lần chào là của hàng 3b | Hàng 3b «Hồ sơ đủ thông tin» giữ phần này |

## Lựa chọn của máy (ghi ở sổ quyết định)

- Địa chỉ trang riêng `/inventory/units/<mã căn>?toa=<toà>&ho-so=<id lần chào>`; mọi lối vào đều về đây.
- Tìm căn theo mã: bỏ khoảng trắng hai đầu, không phân biệt hoa thường, chỉ trong các dòng Bảng hàng người ấy thấy (cùng
  nguồn với Bảng hàng — không mở đường đọc dữ liệu mới, không chạm SP-1).
- `ho-so` còn trong Bảng hàng → id thắng mã và toà: mở đúng lần chào ấy, viết lại địa chỉ theo mã, toà hiện tại (đường dẫn
  đã gửi không hỏng khi căn đổi mã hay toà đổi tên).
- `toa` vắng và mã có ở một toà → mở luôn; ở nhiều toà → «Nhiều căn — chọn toà»; `toa` không khớp toà nào có mã ấy → xử như
  `toa` vắng.
- `ho-so` vắng → lần chào hiện tại của căn theo thứ tự Bảng hàng; `ho-so` không còn trong Bảng hàng → như vậy kèm một dòng
  báo (Hỏi-4).
- Trang riêng là trang nội bộ trong App Shell, đi qua đúng cửa của Bảng hàng (hôm nay dữ liệu mẫu, chưa bắt đăng nhập; khi
  Bảng hàng đọc dữ liệu thật theo sàn thì trang theo cùng cửa); không phải trang khách (không chạm SP-4).
- Chép đường dẫn bằng bộ nhớ chép của trình duyệt, không mở ứng dụng gửi nào (SP-3: người tự dán và tự bấm gửi).
- Dữ liệu mẫu (60 lần chào) không có mã nào ở hai toà và không căn nào có hai lần chào; ca «Nhiều căn» đo bằng bài kiểm trên
  dòng dựng tay và bằng bản mẫu, chưa thấy được trên Bảng hàng thật tới khi có dữ liệu thật (hàng 10). Đổi bộ mẫu không
  được: băm của bộ mẫu đã ghim.

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ (chia sẻ): Bảng hàng → bấm mã căn → hồ sơ cạnh bảng → «Mở toàn màn» → trang riêng → «Chép đường dẫn» → báo «Đã
  chép đường dẫn» (điểm ra: người dán vào Zalo và tự gửi).
- Suôn sẻ (gõ mã): mọi màn có App Shell → «Gõ mã căn…» (hoặc ⌘K / Ctrl+K, hoặc «/») → gõ mã → Enter → trang riêng của căn.
- Biên: mã ở nhiều toà → «Nhiều căn — chọn toà» → bấm toà → trang riêng; đồng nghiệp mở đường dẫn → đúng căn, đúng lần chào.
- Lỗi & quay lại: mã lạ hay toà sai → «Không có căn này trong Bảng hàng» → «Về Bảng hàng»; Enter khi ô rỗng → câu báo dưới
  ô, hộp không đóng; chép không được → câu bảo chép ở ô địa chỉ; nút lùi trên trang riêng → về đúng chỗ trước đó.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Trang riêng của căn (`unit`) | Xem và gửi hồ sơ một căn | Từ «Mở toàn màn», «Gõ mã căn», đường dẫn được gửi / về Bảng hàng |
| Hộp «Gõ mã căn» (trên mọi màn) | Gõ một mã để tới căn | Từ thanh trên / tới trang riêng |
| Hồ sơ cạnh Bảng hàng (`inventory`, hàng 3) | Thêm nút «Mở toàn màn» | — / tới trang riêng |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-unit-co | Trang riêng | Lối «Bảng hàng», tên «<mã> · <toà>», nút «Chép đường dẫn», thân hồ sơ hàng 3 | Chép đường dẫn, quay lại |
| ST-unit-nhieu | Trang riêng | «Nhiều căn — chọn toà»; «Mã «0905» có ở 2 toà. Bạn chọn toà để mở đúng hồ sơ.»; một nút cho mỗi toà | Bấm một toà |
| ST-unit-khong | Trang riêng | «Không có căn này trong Bảng hàng»; câu vì sao kèm mã đã gõ; nút «Về Bảng hàng» | Về Bảng hàng |
| ST-unit-khong-quyen | Trang riêng | Trạng thái trang «không đủ quyền» của kho (vai không có Bảng hàng) | Về trang đầu |
| ST-unit-lan-chao-cu | Trang riêng | Thân hồ sơ lần chào hiện tại, trên đầu một dòng báo «Lần chào trong đường dẫn không còn trong Bảng hàng — đang hiện lần chào hiện tại của căn.» | Đọc, chép đường dẫn mới |
| ST-unit-da-chep | Trang riêng | Báo «Đã chép đường dẫn» | Dán vào nơi gửi |
| ST-unit-chep-loi | Trang riêng | Báo «Chưa chép được. Bạn chép đường dẫn trong ô địa chỉ của trình duyệt.» | Chép tay |
| ST-jump-mo | Hộp gõ mã | Tên hộp, câu hướng dẫn, ô gõ có tiêu điểm, nút «Mở» | Gõ, Enter |
| ST-jump-rong | Hộp gõ mã | Câu «Bạn gõ mã căn trước đã.» dưới ô | Gõ mã |
<!-- UX-STATE-TABLE>>> -->

Trang riêng không có trạng thái chờ tải hay lỗi tải riêng: nó đọc cùng nguồn với Bảng hàng ở máy chủ, lỗi trang dùng trạng
thái trang chung của App Shell.

### 4. Hành vi

- «Mở toàn màn» là nút biểu tượng có tên đọc được và chú thích khi rê chuột; có ở mọi khổ (trên điện thoại hồ sơ đã phủ màn,
  nút vẫn là lối tới trang có đường dẫn để chép).
- Phím: ⌘K / Ctrl+K mở hộp ở mọi lúc; «/» mở hộp khi không đứng trong ô nhập; Esc đóng hộp và trả tiêu điểm về nút.
- Trên điện thoại thanh trên chỉ hiện biểu tượng kính lúp (tên «Gõ mã căn»); hộp nổi sát mép trên để bàn phím không che.
- Chỉ vai có Bảng hàng thấy nút gõ mã và phím tắt của nó.
- Đổi lần chào hay đổi căn trên trang riêng không có ở hàng này (không «Trước», «Sau»).

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| `ListingRecordBody` (kho, hàng 3) | dùng | Thân hồ sơ một căn đã duyệt; không dựng lại |
| Khe nút đầu hồ sơ `RecordView.actions` (hàng 9e) | dùng | Chỗ chung cho nút ở đầu hồ sơ |
| `PageHeader` (kho) | dùng | Đầu trang: tên và việc chính «Chép đường dẫn» |
| `PageState` (kho) | mở rộng | Thêm chữ riêng cho «không có căn» và «nhiều căn» thay vì dựng trạng thái trang thứ hai |
| `Dialog`, `InputGroup`, `Button`, `Tooltip` (nhà cung cấp) | ghép | Hộp gõ mã (Hỏi-1) |
| Thông báo kết quả `notifyResult` (kho) | dùng | Báo đã chép theo luật kênh của `design/behaviors.md` |
| Khe ô tìm trên thanh trên App Shell | mở rộng | App Shell hàng 1o chưa có khe này; app-shell-8 gốc có ô tìm ở thanh trên |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: Trang riêng là «chi tiết» tách khỏi «danh sách» Bảng hàng, cùng một hồ sơ; Quỹ hàng chọn đúng khuôn này
(`units/[code]/page.tsx`). Luồng hiển nhiên, không tra thêm mẫu thị trường.

### 7. Thẻ việc

| Trường | Giá trị |
|---|---|
| Ai dùng | Đầu chủ (cả Đầu khách, Trưởng nhóm cùng sàn khi nhận đường dẫn) |
| Việc chính | Tới đúng một căn thật nhanh, và gửi căn ấy cho đồng nghiệp |
| Tần suất | mỗi ngày nhiều lần |
| Số bản ghi | một |
| Thiết bị | cả hai |
<!-- UX-SPEC-TEMPLATE>>> -->

## Ứng viên ReUI và bản mẫu (bước thiết kế trên bản đang chạy)

Bản bấm được: `/proto/loi-vao-ho-so` (năm cảnh: hồ sơ cạnh bảng, trang riêng, mã có ở hai toà, mã lạ, gõ mã căn). Ảnh bốn
khổ sáng tối: `_acceptance/loi-vao-ho-so/design-pass/`. Ứng viên ReUI (ảnh trong `design-pass/ung-vien/`):

- Ô gõ mã: **navbar-4** (thanh trên có ô «Search or jump to…» ⌘K mở bảng lệnh) · **app-shell-2** (ô tìm ⌘K ở đầu thanh
  bên). Bản đề xuất: nút dáng ô tìm ở phải thanh trên, mở hộp ghép từ kho (Hỏi-1).
- Trang riêng: **product-detail-1** (trang chi tiết có đường vụn, ảnh, khối mua) · **solution-crm-4** (ngăn chi tiết, gốc
  của thân hồ sơ hàng 3). Bản đề xuất: đầu trang của kho + thân hồ sơ hàng 3 trong một Frame (Hỏi-2).

## Vùng mã sẽ chạm

`src/app/(app)/inventory/units/[code]/page.tsx` (mới) · `src/modules/listings/ui/` (phép tìm căn, nút «Mở toàn màn», hộp gõ
mã, chữ của hàng) · `src/components/templates/app-shell.tsx` (khe ô tìm) · `src/app/(app)/layout.tsx` (đặt hộp gõ mã vào
khe theo vai) · `src/components/templates/page-state.tsx` (chữ riêng) · `design/screens.yaml`, `design/patterns/` (màn và
họ mới) · `tests/` (tệp mới).
