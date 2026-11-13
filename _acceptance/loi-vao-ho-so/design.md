# Thiết kế: Lối vào hồ sơ (hàng 3f)

Ngày 2026-11-13 · dãy R của đợt «nen» · hạng T2 · dựng trên hàng 3 (Hồ sơ căn) và hàng 9e (bộ nút theo quyền — nút ở đầu
hồ sơ dùng khe `actions` của 9e), cả hai đã gộp.

## Việc của hàng

Đầu chủ đang xem một căn cạnh Bảng hàng muốn gửi căn ấy cho đồng nghiệp, hoặc đang nghe điện thoại và biết mã căn mà không
muốn dò bảng. Hàng này mở hai lối vào cùng một hồ sơ căn của hàng 3, **giữ nguyên cách xem hiện nay** — hồ sơ nổi cạnh Bảng
hàng, toàn màn trên điện thoại (chủ kho chọn ở Cổng Phạm vi: «Tôi muốn lối Lối khác, đơn giản hơn, vì giữ đúng ux hiện
nay.»):

1. **«Chép đường dẫn»** ở đầu hồ sơ → chép địa chỉ `/inventory?ho-so=<id lần chào>` mà hàng 3 đã có; đồng nghiệp cùng sàn
   mở là thấy Bảng hàng với hồ sơ đúng căn, đúng lần chào bật sẵn.
2. **«Gõ mã căn»** ở thanh trên của App Shell → về Bảng hàng: một căn khớp thì hồ sơ bật sẵn; nhiều toà thì Bảng hàng chỉ
   còn các dòng của mã ấy để chọn; không khớp thì trạng thái «không dòng nào khớp» sẵn có.

Không màn mới, không hồ sơ mới, không trạng thái trang mới: mọi thứ người dùng thấy đã có ở hàng 2 và hàng 3, hàng này chỉ
thêm một nút, một hộp gõ mã, một phép tìm theo mã và một báo.

## Ranh giới với hàng 12

Hàng 12 «Thêm căn» cũng có ô gõ mã căn, nhưng để **thêm** một căn mới vào Bảng hàng. Ô của hàng này chỉ **tìm** căn đã có
trong Bảng hàng; mã không có thì không mở gì, không gợi ý thêm căn. Hai ô ở hai chỗ khác nhau (ô này ở thanh trên, ô của
hàng 12 trong hộp thêm căn) và không dùng chung phép xử lý mã.

## Từ Quỹ hàng

Đã đọc (chỉ đọc, `onehub-quy-hang` nhánh chính): `apps/web/src/app/(app)/units/[code]/page.tsx`,
`units/ho-so/ho-so-toan-man.tsx`, `units/ho-so/than-cot.tsx` (`NutToanMan`, `KhongNhieu`), `units/ho-so/ho-so.ts`
(`timCan`, `docCot`), `components/shell/unit-jump.tsx`; trang tri thức `docs/tri-thuc/wiki/chu-de/ho-so-can.md`; bảng so
«Chi tiết căn Quỹ hàng ↔ Inventory» mục 4, 5, 6, 40.

| Quỹ hàng làm | Hàng này | Vì sao |
|---|---|---|
| Trang riêng `/units/<mã>` và nút «Mở toàn màn» | **Bỏ** | Chủ kho chọn giữ hồ sơ nổi cạnh Bảng hàng |
| Chép đường dẫn trên trang riêng | **Đổi**: nút «Chép đường dẫn» ở đầu hồ sơ, chép địa chỉ Bảng hàng có id lần chào | Không có trang riêng; địa chỉ của hàng 3 đã mở đúng căn |
| «Nhiều căn» + một nút cho từng toà | **Đổi**: Bảng hàng lọc theo mã, mỗi toà một dòng, kèm một câu | Chọn bằng chính các dòng Bảng hàng — không trạng thái mới |
| «Không có căn này trong Bảng hàng» | **Đổi**: trạng thái «không dòng nào khớp» sẵn có của Bảng hàng | Người đã quen trạng thái ấy khi gõ tìm |
| Ô «Gõ mã căn» là bảng lệnh ⌘K (cmdk), gõ tên nhà cũng nhảy | **Đổi** (Hỏi-1): hộp biểu mẫu sẵn của kho, chỉ mã căn | Kho chưa có bảng lệnh; nhảy theo tên màn đã có ở thanh bên |
| Phím ⌘K, «/», chỉ vai có Bảng hàng thấy ô | **Giữ** | Cùng thói quen |

## Lựa chọn (ghi ở sổ quyết định)

- Đường dẫn của một căn là `/inventory?ho-so=<id lần chào>` (hàng 3 đã có); id bền nên căn đổi mã hay toà đổi tên vẫn mở
  đúng.
- Gõ mã đi tới `/inventory?ma=<mã>`; Bảng hàng tìm mã trong chính các dòng nó đã đọc (bỏ khoảng trắng hai đầu, không phân
  biệt hoa thường, khớp trọn mã — không khớp tiền tố): một dòng → hồ sơ bật như `?ho-so=<id>`; nhiều dòng → mã vào ô tìm,
  bảng chỉ còn các dòng ấy, kèm một câu; không dòng nào → mã vào ô tìm, trạng thái không dòng nào khớp. Không đường đọc dữ liệu mới (SP-1).
- Đường dẫn mang id đã không còn → Bảng hàng bình thường kèm một báo (câu hỏi về đường dẫn cũ).
- Chép đường dẫn bằng bộ nhớ chép của trình duyệt, báo qua kênh báo kết quả của kho; không mở ứng dụng gửi nào (SP-3).
- Dữ liệu mẫu (60 lần chào) không có mã nào ở hai toà; ca nhiều toà đo bằng bài kiểm trên dòng dựng tay và bằng bản mẫu,
  chưa thấy được trên Bảng hàng thật tới khi có dữ liệu thật (hàng 10). Bộ mẫu đã ghim băm nên không đổi được.

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ (chia sẻ): Bảng hàng → bấm mã căn → hồ sơ → «Chép đường dẫn» → báo «Đã chép đường dẫn» (điểm ra: người dán vào
  Zalo và tự gửi) → đồng nghiệp mở → Bảng hàng với hồ sơ ấy bật sẵn.
- Suôn sẻ (gõ mã): mọi màn có App Shell → «Gõ mã căn…» (hoặc ⌘K / Ctrl+K, hoặc «/») → gõ mã → Enter → Bảng hàng với hồ sơ
  của căn bật sẵn.
- Biên: mã ở nhiều toà → Bảng hàng chỉ còn các dòng của mã ấy kèm câu → bấm mã căn ở dòng của toà cần → hồ sơ.
- Lỗi & quay lại: mã lạ → trạng thái không dòng nào khớp → xoá lọc là thấy lại cả bảng; Enter khi ô rỗng → câu báo, hộp không
  đóng; chép không được → câu bảo chép ở ô địa chỉ; đường dẫn cũ → Bảng hàng kèm báo.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Bảng hàng (`inventory`, hàng 2 và 3) | Thêm nút «Chép đường dẫn» ở đầu hồ sơ, nhận `?ma=` | Từ hộp gõ mã, đường dẫn được gửi |
| Hộp «Gõ mã căn» (trên mọi màn) | Gõ một mã để tới căn | Từ thanh trên / tới Bảng hàng |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-inventory-chep | Bảng hàng | Đầu hồ sơ có nút «Chép đường dẫn» trước «Trước», «Sau», «Đóng» | Chép |
| ST-inventory-da-chep | Bảng hàng | Báo «Đã chép đường dẫn» | Dán vào nơi gửi |
| ST-inventory-chep-loi | Bảng hàng | Báo «Chưa chép được. Bạn chép đường dẫn trong ô địa chỉ của trình duyệt.» | Chép tay |
| ST-inventory-nhieu-toa | Bảng hàng | Chỉ các dòng của mã ấy; câu «Mã «0905» có ở 2 toà — bấm mã căn ở dòng của toà cần mở.» | Bấm mã căn một dòng |
| ST-inventory-ma-la | Bảng hàng | Trạng thái không dòng nào khớp sẵn có, chữ đã gõ ở ô lọc | Xoá lọc |
| ST-inventory-duong-dan-cu | Bảng hàng | Bảng bình thường, báo «Căn trong đường dẫn không còn trong Bảng hàng.» | Tìm lại căn |
| ST-jump-mo | Hộp gõ mã | Tên hộp, câu hướng dẫn, ô gõ có tiêu điểm, «Mở», «Thôi» | Gõ, Enter |
| ST-jump-rong | Hộp gõ mã | Câu «Bạn gõ mã căn trước đã.» | Gõ mã |
<!-- UX-STATE-TABLE>>> -->

Các trạng thái chờ tải, lỗi, một phần hỏng, không đủ quyền của Bảng hàng giữ nguyên như hàng 2.

### 4. Hành vi

- «Chép đường dẫn» có ở mọi khổ; trên điện thoại (414, 360) nút chỉ hiện biểu tượng — đầu hồ sơ không chứa đủ bốn nút có chữ
  (bản mẫu: «Đóng» bị đẩy ra ngoài khung).
- Mã đã gõ đi vào ô tìm của Bảng hàng (thấy ở mọi khổ), không vào hàng lọc cột (bị ẩn trên điện thoại); cần cho lưới nhận
  chữ tìm ban đầu như nó đã nhận lọc ban đầu.
- Phím: ⌘K / Ctrl+K mở hộp ở mọi lúc; «/» mở hộp khi không đứng trong ô nhập; Esc đóng hộp và trả tiêu điểm về nút.
- Trên điện thoại thanh trên chỉ hiện biểu tượng kính lúp (tên «Gõ mã căn»).
- Chỉ vai có Bảng hàng thấy nút gõ mã và phím tắt của nó.

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| Hồ sơ cạnh Bảng hàng và thân hồ sơ (kho, hàng 3) | dùng | Giữ nguyên cách xem hiện nay |
| Khe nút đầu hồ sơ `RecordView.actions` (kho, hàng 9e) | dùng | Chỗ chung cho nút ở đầu hồ sơ |
| Trạng thái không dòng nào khớp, lọc cột của Bảng hàng (kho, hàng 2, 2a) | dùng | Mã lạ và nhiều toà không cần trạng thái mới |
| `FormDialog` (kho, hàng 9) + `InputGroup` | dùng | Hộp gõ mã (Hỏi-1); bộ rào của kho cấm màn tự dựng hộp thoại |
| Báo kết quả `notifyResult` (kho) | dùng | Báo đã chép, báo đường dẫn cũ, theo luật kênh của `design/behaviors.md` |
| Khe ô gõ mã trên thanh trên App Shell | mở rộng | App Shell hàng 1o chưa có khe này; app-shell-8 gốc có ô tìm ở thanh trên |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: Giữ đúng khuôn hàng 2, hàng 3 đã chốt — chi tiết nổi cạnh danh sách; chủ kho chọn không tách chi tiết ra trang riêng.

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

Bản bấm được: `/proto/loi-vao-ho-so` (bốn cảnh: hồ sơ có «Chép đường dẫn», gõ mã căn, mã ở hai toà, mã lạ). Ảnh bốn khổ sáng
tối: `_acceptance/loi-vao-ho-so/design-pass/`. Ứng viên ReUI cho ô gõ mã (ảnh trong `design-pass/ung-vien/`): **navbar-4**
(thanh trên có ô «Search or jump to…» ⌘K mở bảng lệnh) · **app-shell-2** (ô tìm ⌘K ở đầu thanh bên). Bản đề xuất: nút dáng ô
tìm ở phải thanh trên, mở hộp biểu mẫu sẵn của kho (Hỏi-1).

## Vùng mã sẽ chạm

`src/modules/listings/ui/` (nút chép, phép tìm theo mã, hộp gõ mã, chữ của hàng) · `src/app/(app)/inventory/page.tsx`
(nhận `?ma=`, báo đường dẫn cũ) · `src/components/templates/app-shell.tsx` (khe ô gõ mã) · `src/app/(app)/layout.tsx` (đặt
hộp gõ mã vào khe theo vai) · `src/components/candidate/data-region.tsx` (lưới nhận chữ tìm ban đầu) · `tests/` (tệp mới).
