# Thiết kế: khung, định dạng và thông báo (hàng 1a)

Ngày 11/11/2026 · dãy K của đợt nen · hạng T2 · nguồn: hàng 1a của `docs/plan/lo-trinh.json`, mã F1–F5 của `docs/plan/pham-vi-mvp-dot-1.md`.

## Mục tiêu

Nhân viên sàn mở ứng dụng ở giao diện sáng hoặc tối, luôn biết mình đang ở màn nào và được báo đúng chỗ khi có sự cố. Hàng này dựng phần mọi màn sau đứng trên: khung, trạng thái toàn trang, bộ định dạng, luật kênh thông báo, hai giao diện. Chưa có màn nghiệp vụ nào; Hôm nay, Bảng hàng, Đã gửi vẫn là màn trống có khung.

## Hướng đã chọn

**Khung nằm ở một nhóm route có layout riêng.** `src/app/(app)/layout.tsx` dựng `AppShell` một lần. Trang lỗi, chờ tải và «không tìm thấy» của nhóm nằm trong khung, nên người vẫn thấy thanh bên khi có sự cố, và thanh bên không dựng lại khi chuyển màn. Lớp gốc `src/app/layout.tsx` chỉ giữ `html`, giao diện, toast và mẫu tiêu đề tab, nên trang khách sau này (`src/app/s/…`) không mang khung nội bộ (SP-4).

Lối khác đã loại: mỗi trang tự dựng `AppShell` như hiện nay. Lối ấy buộc trang lỗi và chờ tải tự dựng lại khung, và thanh bên mất trạng thái mỗi lần chuyển màn.

**Tiêu đề màn nằm trong trang.** Thanh trên của khung giữ nút thanh bên và nút đổi giao diện. Mỗi màn đặt `PageHeader` với `h1` và nút chính của màn, và khai `metadata.title`; lớp gốc ghép thành «<tên màn> · OneHub».

**URL không có thật** rơi vào `src/app/not-found.tsx` ở lớp gốc, không có khung và không có nhãn nội bộ, vì Next đưa mọi URL lạ về đó, kể cả URL gõ nhầm dưới trang khách. `notFound()` gọi trong một màn nội bộ thì dùng `(app)/not-found.tsx`, có khung.

**Bộ định dạng** ở `src/lib/format/`: hàm thuần, `Intl` với `vi-VN`, một hàm cho mỗi kiểu `display` (`money`, `area`, `count`, `date`, `datetime`, `phone`) và `formatByKind`. Giá: từ 1 tỷ viết «4,85 tỷ» (tối đa hai chữ số lẻ), từ 1 triệu viết «320 triệu» (tối đa một chữ số lẻ), dưới 1 triệu viết theo tiền tệ của `Intl` «999.999 ₫». Làm tròn theo mặc định của `Intl` (nửa lên). Đơn vị chọn SAU khi làm tròn, nên 999.999.999 viết «1 tỷ», không viết «1.000 triệu». Giá âm hay ô trống viết «—». Diện tích tối đa hai chữ số lẻ kèm «m²». Ngày «05/11/2026», ngày giờ «14:30 05/11/2026», theo giờ Việt Nam. Số điện thoại di động mười số viết «0900 000 001», dạng «+84» đổi về «0»; chuỗi không đủ mười số giữ nguyên.

**Câu chữ của khung** nằm trong một tệp `src/components/templates/frame-copy.ts`: câu lỗi ba phần, câu không tìm thấy, câu hết phiên, câu của hai băng, nút «Thử lại», «Hoàn tác», «Đăng nhập lại», lối nhảy, tên ba giao diện, đường đăng nhập. Các tệp route và template chỉ đọc từ đó. Câu chữ này không phải khái niệm nghiệp vụ nên không vào `ontology/labels.yaml`; `design/language.md` để nút và câu lỗi cho người soát, nên một tệp duy nhất là chỗ người soát đọc. Tên màn vẫn đi qua `label()`. Template không được nhập mô-đun (luật ESLint của kho), nên tên màn và mục điều hướng đến từ `src/app` qua props, và bản mẫu khung nằm ở `src/app/(app)/proto/[slug]/`.

**Thanh bên nhận vai.** `AppShell` nhận `role` tuỳ chọn và truyền cho thanh bên; thanh bên lọc mục có `roles`. Hiện chưa có đăng nhập nên layout chưa truyền vai và chưa mục nào giới hạn vai; bảng thật đến từ hàng 1d. Trạng thái hết phiên dựng xong và có đường quay về, nhưng chưa nối với mã 401 vì kho chưa có lời gọi `/api/v1` nào. Màu sáu trạng thái lấy từ Quỹ hàng (`apps/web/src/lib/mau-trang-thai.ts` ở commit `e89c6ab8`) và là biến thể `-light` của huy hiệu ReUI.

**Kênh thông báo** theo `design/behaviors.md`: lỗi một trường báo tại chỗ, kết quả thao tác báo bằng toast (đảo được thì có «Hoàn tác»), sự cố cả màn báo bằng băng trên màn. Luật là một hàm `channelFor`. Băng trên màn có một kho trạng thái nhỏ trong `src/components/templates/`; mất mạng tự hiện băng, lưu hỏng khi mất mạng hiện băng có «Thử lại», giữ nguyên phần đang nhập vì băng không đụng tới biểu mẫu.

**Giao diện sáng và tối** bằng `next-themes` (đã có trong kho), lớp `dark`, mặc định theo thiết bị. Nút đổi trên thanh trên mở ba lựa chọn: Sáng, Tối, Theo thiết bị. Token tối đã có trong `globals.css`.

## Đặc tả UX

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: mở ứng dụng → khung hiện, mục của màn hiện tại được đánh dấu, tab ghi tên màn → chọn mục khác trên thanh bên → màn mới, mục mới được đánh dấu (điểm ra: màn được chọn).
- Biên: điện thoại 360 và 414: thanh bên ẩn, nút ở thanh trên mở thanh bên dạng tấm phủ, chọn mục thì tấm đóng. Vai không có quyền vào một mục thì mục ấy không hiện.
- Lỗi & quay lại: màn hỏng khi dựng → khung vẫn còn, vùng chính nói chuyện gì xảy ra, vì sao, làm gì tiếp, có «Thử lại». URL không có → trang «Không tìm thấy trang» có lối về trang đầu. Phiên hết hạn → mời đăng nhập lại, kèm địa chỉ để quay về đúng chỗ. Mất mạng → băng trên màn nói thay đổi chưa lưu được, có «Thử lại».

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Khung (mọi màn nội bộ) | Cho biết đang ở đâu và đi tới màn khác | mọi màn nội bộ / mục trên thanh bên |
| Lỗi màn | Nói màn hỏng và cho thử lại | màn hỏng khi dựng / chính màn đó |
| Không tìm thấy trang | Nói địa chỉ không có và chỉ lối về | URL lạ / trang đầu |
| Phiên hết hạn | Mời đăng nhập lại rồi về đúng chỗ | màn đặt trạng thái hết phiên (nối mã 401 đi cùng lời gọi API đầu tiên) / trang đăng nhập |
| Bản mẫu khung `/proto/khung-va-giao-dien` | Bày bộ định dạng, màu trạng thái, ba kênh thông báo, các trạng thái toàn trang | chỉ ở bản phát triển |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-khung-dang-o | Khung | mục của màn có `aria-current="page"`, một `h1` tên màn, tab «<tên màn> · OneHub» | chọn mục khác |
| ST-khung-cho-tai | Khung | dưới 1 giây không gì; từ 1 giây khung chờ đúng bố cục màn | chờ |
| ST-khung-loi | Lỗi màn | «Màn này chưa hiện được.» + vì sao + làm gì tiếp, nút «Thử lại» | thử lại / chọn màn khác |
| ST-khung-khong-thay | Không tìm thấy trang | «Không tìm thấy trang» + địa chỉ có thể đã đổi + nút về trang đầu | về trang đầu |
| ST-khung-het-phien | Phiên hết hạn | «Phiên đăng nhập đã hết hạn» + nút «Đăng nhập lại» mang địa chỉ quay về | đăng nhập lại |
| ST-khung-mat-mang | Khung | băng trên màn: mất kết nối, thay đổi chưa lưu được | chờ có mạng / «Thử lại» |
| ST-khung-luu-hong | Khung | băng trên màn: chưa lưu được vì mất mạng, phần đang nhập vẫn còn, «Thử lại» | thử lại |
| ST-khung-dien-thoai | Khung | thanh bên ẩn, nút mở ở thanh trên | mở thanh bên |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Phím Tab đầu tiên trên mọi màn dừng ở «Bỏ qua tới nội dung chính»; bấm thì tiêu điểm vào vùng chính.
- Khổ dưới 768 px: thanh bên thành tấm phủ, chọn mục thì đóng; không cuộn ngang ở 360, 414, 1024, 1440.
- Chờ tải: dưới 1 giây không chỉ báo, từ 1 giây khung chờ (`design/behaviors.md`, phản hồi theo độ trễ).
- Giao diện: mặc định theo thiết bị, lựa chọn của người được nhớ qua lần tải lại.

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| Sidebar, SidebarTrigger | dùng | shadcn đã có chế độ tấm phủ trên điện thoại |
| AppShell | mở rộng | thêm mục đang chọn, lối nhảy, thanh trên, băng trên màn |
| PageHeader | tạo | chỗ duy nhất cho `h1` và nút chính của màn |
| PageState | ghép | ghép `Empty` cho lỗi, không tìm thấy, hết phiên |
| PageSkeleton | ghép | ghép `Skeleton`, hiện sau 1 giây |
| ThemeSwitch | ghép | ghép `DropdownMenu` với `next-themes` |
| ScreenBanner | tạo | kho có Toast nhưng chưa có băng trên màn |
| Badge (ReUI) | dùng | biến thể `-light` cho sáu trạng thái |
| Toaster (sonner) | dùng | kênh kết quả thao tác |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: trung-tâm-toả-nhánh (hub-and-spoke)
Căn cứ: khung có một thanh bên dẫn tới ba màn ngang hàng (Hôm nay, Bảng hàng, Đã gửi), người quay về khung giữa các việc; khuôn hiển nhiên nên không tra mẫu ngoài.

### 7. Thẻ việc

| Trường | Giá trị |
|---|---|
| Ai dùng | Nhân viên sàn ở bốn vai: Đầu chủ, Đầu khách, Trưởng nhóm, Quản trị sàn |
| Việc chính | Biết mình đang ở màn nào, đi tới màn khác, và biết khi có sự cố |
| Tần suất | mỗi ngày nhiều lần |
| Số bản ghi | một |
| Thiết bị | cả hai |
<!-- UX-SPEC-TEMPLATE>>> -->

## Tệp chạm

- `src/app/layout.tsx`: giao diện, toast, mẫu tiêu đề tab.
- `src/app/(app)/`: `layout.tsx` (khung), `page.tsx` (Hôm nay, chuyển từ `src/app/page.tsx`), `nav.ts` (chuyển từ `src/app/nav.ts`), `error.tsx`, `loading.tsx`, `not-found.tsx`, `proto/[slug]/page.tsx` (chuyển từ `src/app/proto/`).
- `src/app/not-found.tsx`, `src/app/global-error.tsx`.
- `src/app/(app)/proto/[slug]/frame-showcase.tsx`: bản mẫu khung.
- `src/components/templates/`: `app-shell.tsx`, `nav-menu.tsx`, `page-header.tsx`, `page-state.tsx`, `page-skeleton.tsx`, `theme.tsx`, `screen-banner.tsx`, `notify.ts`, `frame-copy.ts`.
- `src/lib/format/index.ts`.
- `tests/format.test.ts`, `tests/frame.test.tsx`, `tests/e2e/frame.spec.ts`, `tests/e2e/shell.spec.ts`.

Không chạm `ontology/`, `design/decisions.yaml`, `_acceptance/config.yaml`, gói phụ thuộc. Câu chữ của khung không phải khái niệm nghiệp vụ nên không vào `labels.yaml`; tên màn vẫn đi qua `label()`.

## Đo

- Vitest: ma trận định dạng viết trước, luật kênh, lọc mục theo vai, dựng `PageHeader`, `PageState`, đường đăng nhập lại.
- Playwright ở bốn khổ: mục đang chọn và tiêu đề tab, lối nhảy, thanh bên trên điện thoại, trang lỗi trong khung, không tìm thấy, chờ tải trễ, mất mạng, giao diện tối nhớ qua lần tải lại, axe ở sáng và tối trên mọi màn khung.
- Mỗi bài có chiều đỏ: bản phá thử trong cùng tệp kiểm chứng minh bài đỏ khi vật hỏng.
