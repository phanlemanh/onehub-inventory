# Đề xuất chuẩn hoá thiết kế — lấy onehub-inventory làm ca thật

Trạng thái: **Đề xuất**, 09/11/2026. Chặng 0 đã dựng, các chặng sau chưa dựng. Đầu vào: phiên «Design system audit», `docs/plan/kien-truc-he-design-da-repo.md`
và `docs/plan/ma-tran-kiem-ke-design-claude-code.md` của Quỹ hàng, Acceptance Gate Kit v2.38.0, bộ OneHub Platform DS (10/2026). Đã qua một vòng phản biện độc lập và một vòng rà điều kiện kỹ thuật.

**Chưa xác minh:** toàn bộ lợi ích dưới đây là dự kiến. Số gốc đo trên một màn giả định, ở mức lập phương án. Ngưỡng ở mục 7 là đề
xuất, chưa có cơ sở thống kê. Nghị định 356/2025 chỉ đọc qua bản tóm tắt. Next.js chưa chạy thử với bộ công cụ của kho mới (ESLint 10, TypeScript 6; Quỹ hàng dùng ESLint 9, TypeScript 5). Brand guideline PDF mới đọc phần chữ, chưa xem hình ảnh trong 45 trang. Bảng cắt gọn MVP là đề xuất để chủ kho gạch.

## 1. Trả lời ngắn

Audit cho thấy hệ của Quỹ hàng **khoá ở hai đầu, hở ở giữa**: lint giữ atoms, bản đồ khuôn giữ templates, còn molecules và organisms
không có gì giữ. Vì vậy máy báo 0 lệch mà Bảng hàng và Liên hệ khác nhau 43 chỗ.

Đề xuất gồm năm phần, theo nguyên tắc: đã có chuẩn thì dùng, không có thì công thức hoá, và phải đo được:

1. **Ba trục độc lập:** kích cỡ (Atomic), sở hữu (core, recipe), và nghĩa (ontology).
2. **Khoá phần giữa trước:** ô theo kiểu, bộ định dạng, đầu vùng, mẫu hành vi, rồi Lưới có API đóng.
3. **Nghĩa quyết định hình dạng:** khai một lần trong ontology là tiền thì cột tự canh và tự định dạng.
4. **Màn mẫu chuẩn là bằng chứng:** Bảng hàng dựng lại sạch trong kho mới và đạt đủ ma trận trạng thái.
5. **Có đối chứng rồi mới đóng gói:** kho mới sạch nên dễ đạt sẵn. Phải đo thêm ở Quỹ hàng và ở một kiểu màn chưa có mẫu.

## Nguyên tắc: đưa bất định về tất định

Mọi quyết định đi theo đúng thứ tự, dừng ở bậc đầu tiên đứng được:

1. **Chuẩn có sẵn** thì dùng nguyên, không đặt lại.
2. Không có chuẩn thì lập **công thức**: cùng đầu vào ra cùng kết quả.
3. Không có công thức thì dùng **danh sách đóng**.
4. Còn lại là **phán đoán của người**, ghi rõ và đo bằng người dùng.

Mỗi quyết định là một dòng trong `design/decisions.yaml`: mã, tầng, loại, nguồn, lệnh kiểm. Đi lệch chuẩn phải có một dòng ngoại lệ kèm lý do.

**Chỉ số chính: tỉ lệ tất định = số quyết định có lệnh kiểm tự động ÷ tổng số quyết định.** Gốc ở Quỹ hàng theo ma trận kiểm kê: 17/49, tức 35 %; số này chỉ để tham khảo vì mẫu số khác. Một lệnh kiểm chỉ được tính khi nó đỏ được, theo quyết định 0015.

| Quyết định                                                         | Dùng chuẩn                                     | Ghi chú                                                        |
| ------------------------------------------------------------------ | ---------------------------------------------- | -------------------------------------------------------------- |
| Cỡ chữ, khoảng cách, breakpoint, bóng, thời lượng, easing, z-index | Tailwind 4 mặc định                            | Không đặt thang riêng                                          |
| Bo góc, chiều cao control, màu theo vai trò                        | Biến và kích cỡ của shadcn                     | Giữ `--radius` mặc định 0,625rem                               |
| Xám và màu trạng thái                                              | Tailwind `neutral`, `green`, `amber`, `red`    | Qua biến shadcn, ReUI                                          |
| Định dạng số, tiền, ngày                                           | `Intl` với `vi-VN`                             | Đã thử: 4,85 tỷ · 320 triệu · 2.418                            |
| Trường và giá trị BĐS                                              | RESO DD 2.1                                    |                                                                |
| Điện thoại, ngày giờ, tiền tệ                                      | E.164, ISO 8601, ISO 4217                      |                                                                |
| Lưới dữ liệu                                                       | TanStack Table qua `data-grid` của ReUI        | Hàm dựng `ColumnDef` theo kiểu, không viết thành phần lưới mới |
| Truy cập, một vùng chính, một `h1`                                 | WCAG 2.2 AA qua axe; mẫu tương tác của Base UI | Dùng luật có sẵn của axe                                       |
| Hiệu năng                                                          | Core Web Vitals, cộng ngưỡng lưới đã đo        |                                                                |
| Kiểm trên màn chạy, so ảnh                                         | Playwright                                     |                                                                |
| API và lỗi API                                                     | OpenAPI 3.1, RFC 9457                          |                                                                |
| Chất lượng giao hàng                                               | DORA qua `tools/sdlc_metrics.py`               | Đã có sẵn trong kho                                            |

| Việc không có chuẩn          | Công thức                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Cấp của thành phần           | Độ sâu import, máy tính, không khai tay                                                                       |
| Canh cột                     | `money`, `area`, `count` canh phải; còn lại canh trái                                                         |
| Bề rộng cột                  | `max(độ dài nhãn, độ dài mẫu của kiểu) × 1ch + đệm hai bên`                                                   |
| Mật độ bảng                  | Tổng bề rộng tối thiểu vượt vùng nội dung thì dày (`h-10`, `text-sm`), không thì thường (`h-12`, `text-base`) |
| Màu chữ trên nền             | Bậc đầu tiên đạt 4,5:1, máy kiểm                                                                              |
| Sắc nhạt của màu thương hiệu | `color-mix` trong OKLCH từ màu gốc                                                                            |

**Danh sách đóng** gồm 11 kiểu `display`, bảy bố cục, sáu trạng thái chuẩn, ma trận trạng thái. **Phán đoán:** việc chính của màn, thứ tự thông tin, nội dung chữ.

## Phạm vi: chỉ mang phần đã hiệu quả

«Refactor» ở đây nghĩa là **chọn lọc**, không phải chuyển toàn bộ. **Kho mới thay Quỹ hàng để ra MVP**, với tính năng lõi đơn giản hơn và kiến trúc chuẩn cho về sau. Không đặt mục tiêu ngang bằng tính năng.

**Giới hạn của chữ «hiệu quả»:** Quỹ hàng chưa có số dùng thật. Chưa phiên nghiệm thu nào mở được, và số liệu sống chưa đọc được (`docs/plan/mvp-mo-dan.md`). Vì vậy việc chọn dưới đây dựa trên ba căn cứ gián tiếp: thuộc đợt 1 của MVP hay giữ bất biến, có bằng chứng kiểm được, và độ ổn định của mã. Tỉ lệ vá tính theo tiêu đề commit, chỉ để định hướng.

| Quyết định               | Gồm                                                                                                                                                                                  | Căn cứ                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| **Mang nguyên**          | Luật nghiệp vụ thuần của các nhóm đợt 1; ba bất biến, bộ kiểm cách ly, bộ kiểm rò rỉ, một cửa truy vấn; 10 luật lint đã chuyển; từ vựng và ADR còn hiệu lực; kết luận của ba bài thử | `packages/core`: 139 tệp, không tệp nào phụ thuộc web hay cơ sở dữ liệu, 114 tệp test |
| **Viết lại theo chuẩn**  | Bảng hàng, Hồ sơ căn, Hôm nay, luồng Gửi, trang khách, Đã gửi; API đưa vào `server.ts` của mô-đun; nhập Excel không AI                                                               | Audit: hở ở giữa. Tỉ lệ vá cao: nhập 47 %, hồ sơ căn 37 %, bảng hàng 29 %             |
| **Để sau, theo đợt MVP** | Cửa lead và nhà Liên hệ (đợt 2); phát rộng, sàn tự cấu hình trừ Người dùng và Thuế phí, nhập có AI (đợt 3); thấp tầng; xác nhận danh mục                                             | `mvp-mo-dan.md`; cửa lead là đoạn yếu nhất                                            |
| **Không mang**           | Đội, Lịch xem (mới là trang giữ chỗ); 168 hồ sơ nghiệm thu; lộ trình và bản đồ cũ; mã bài thử; cơ chế ghim lại                                                                       | 13 % commit chỉ để ghim và vẽ lại                                                     |

**Hệ quả:**

- Mô-đun `leads`, `exports`, `notifications` rút khỏi bản đồ tới khi tới đợt của chúng; `sync` (chế độ ngoại tuyến) chỉ quay lại sau MVP; còn lại chín mô-đun.
- Mỗi phần mang sang ghi commit nguồn. Sao chép một chiều nên **không cần đóng băng** Quỹ hàng.
- Chỉ chuyển test của phần được mang, và test phải đỏ được khi phá.
- **Dữ liệu:** dùng lược đồ mới, gọn theo phạm vi, thay vì chép 47 migration. Quỹ hàng mới có khoảng 3 sàn nên chuyển dữ liệu bằng lệnh một lần còn rẻ, và là lúc sửa tên chồng nghĩa (Lead, Cơ hội) cùng các chỗ lệch RESO. Số chủ nhà đang mã hoá ở Quỹ hàng được giải mã trong lệnh chuyển và lưu dạng rõ ở MVP, theo quyết định 0014.
- **Quỹ hàng dừng thêm tính năng từ 09/11/2026, chỉ vá lỗi** (chủ kho đã xác nhận), rồi được thay khi kho mới ra MVP. Số dùng thật của đợt đầu là bằng chứng còn thiếu để xác nhận hay sửa bảng trên.

## Cắt gọn cho MVP

Đề xuất để chủ kho gạch một lần. Đích là đợt «bỏ Sheet, gửi link» của `mvp-mo-dan.md`: một sàn, một khu căn hộ.

| Nhóm             | Giữ                                                        | Cắt hoặc để sau                                                                                              |
| ---------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Đăng nhập        | Mã qua email, mời người                                    | Mật khẩu, mật khẩu tạm                                                                                       |
| Vai              | Đầu chủ, Đầu khách, Trưởng nhóm, Quản trị sàn              | Telesales                                                                                                    |
| Dữ liệu trên máy | Không có, mọi màn đọc từ máy chủ                           | Toàn bộ chế độ ngoại tuyến, chỉ làm sau MVP: bản đọc trên máy, ghi khi mất mạng, thay đổi chờ gửi, «Cần xem» |
| Giao diện        | Sáng và tối; điện thoại dùng thanh bên thu gọn             | Đổi sàn trong ứng dụng, thanh dưới trên điện thoại                                                           |
| Đưa hàng vào     | Excel có xem trước và hoàn tác, gõ mã căn, tạo căn tay     | Nhớ mẫu, nhập có AI, thấp tầng                                                                               |
| Bảng hàng        | Bảng, sửa ô, dán từ Excel, hồ sơ cạnh bảng, thẻ điện thoại | Góc nhìn lưu, sửa hàng loạt, đổi đầu chủ hàng loạt                                                           |
| Giữ tươi         | Hôm nay một danh sách việc, kết quả gọi, Sẵn sàng bán, ảnh | Gọi điều chỉnh giá, ba màn Hôm nay riêng theo vai                                                            |
| Phát cho khách   | Gửi, trang khách, Đã gửi, lưu khách                        | Xuất bảng, nhóm môi giới, mẫu bài                                                                            |
| Cấu hình sàn     | Người dùng, Thuế phí; còn lại là hằng số trong mã          | Cách gọi, trạng thái riêng, trường riêng, từ điển                                                            |
| Thoả thuận       | Chỉ nguồn danh mục                                         | Các loại kết nối khác                                                                                        |
| Mở dần           | Không cần cờ: phần chưa làm không có trong mã              | Ba cờ, trang `/ops` đầy đủ; giữ một lệnh đọc số đo                                                           |

Kiến trúc vẫn giữ chỗ cho phần bị cắt: ba bất biến, cách ly theo sàn, API một cửa, ranh giới mô-đun và khoá `display` đều có từ đầu.

## Nhận diện: OneHub DS kết hợp ReUI Pro và shadcn

**Đánh giá bộ DS.** Giá trị nằm ở nhận diện và luật: 207 token, màu, chữ, giọng văn, định dạng số, và tệp mô tả cho từng thành phần. Phần mã thì **không dùng trực tiếp được**: 78 tệp React 18 với 849 chỗ style nội tuyến và 0 `className`, hover bằng `useState`, tải icon qua CDN, tổng 51 thuộc tính `aria-`, và README tự ghi còn thiếu chuẩn bàn phím, focus trap. Vì vậy **dùng DS làm đặc tả, không chép mã**.

| Việc                                                  | Nguồn có thẩm quyền                     |
| ----------------------------------------------------- | --------------------------------------- |
| Logo, màu, chữ, bo góc, bóng, giọng văn, định dạng số | OneHub DS                               |
| Hành vi, bàn phím, truy cập của control               | shadcn trên Base UI                     |
| Khối dày: lưới dữ liệu, bộ lọc, khung màn             | ReUI Pro, mặc áo OneHub                 |
| Thành phần riêng BĐS: thẻ căn, thư viện ảnh           | Tự dựng theo mô tả của DS, thành recipe |
| Bất biến, thứ tự thẩm quyền khi xung đột              | Luật của kho                            |

**Cách ghép: chuẩn trước, chỉ giữ cái thật sự là nhận diện.** Đo token DS so với Tailwind 4.3:

| Nhóm            | Kết quả đo                                                               | Quyết định                                                            |
| --------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Khoảng cách     | Theo bậc 4 px, trùng Tailwind                                            | Dùng Tailwind                                                         |
| Cỡ chữ          | 6/11 trùng; 15, 22, 28, 34, 38 không có                                  | Về bậc gần nhất: 14, 24, 30, 36, 36                                   |
| Xám             | 11/13 lệch độ sáng dưới 0,02 so với `neutral`                            | Dùng `neutral`; `gray-600` đổi sang `neutral-600`, tương phản tốt hơn |
| Màu trạng thái  | 10/12 lệch dưới 0,04 so với Tailwind                                     | Dùng Tailwind                                                         |
| Bo góc          | Mặc định shadcn trùng 6, 8, 10; thẻ 14 so với 12, hộp thoại 14 so với 16 | Giữ mặc định, chấp nhận lệch 2 px                                     |
| Màu thương hiệu | `#0246FF` cách màu Tailwind gần nhất 0,0385, nhìn thấy được              | **Giữ nguyên**                                                        |

**Sổ ngoại lệ thương hiệu, chỉ gồm:** `#0246FF`, `#02D8FF`, bốn màu điểm xuyết, Inter và JetBrains Mono, logo, luật giọng văn. Từ 207 token còn khoảng 12 biến trong một tệp `src/styles/onehub.css`, ánh xạ vào `--primary`, `--ring`, `--accent`, nên không sửa mã nhà cung cấp và không cần tệp ghi đè. Icon để nét mặc định của Lucide, vì chính DS ghi lựa chọn nét 1.5 còn chờ xác nhận. Inter qua `next/font` với `latin` và `vietnamese`. Chỉ light mode cho MVP. Logo dùng `assets/`.

**Xung đột cần xử lý**

| Điểm          | DS nói                                         | Thực tế                                                          | Đề xuất                                                                                |
| ------------- | ---------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Mật độ bảng   | Dòng 48 px, chữ 16 px                          | Bảng hàng 15 cột trên 1440 px chỉ còn khoảng 74 px mỗi cột       | Công thức mật độ tự chọn dày hay thường                                                |
| `MaskedValue` | Nhận cả `value` thật ở phía trình duyệt        | Trái bất biến 2                                                  | Chỉ nhận bản che; bấm hiện mới gọi máy chủ và ghi nhật ký                              |
| `DataTable`   | Mở `align`, `render`, `style`                  | Trái Lưới đóng                                                   | Lấy hình thức; cột dựng từ kiểu `display`                                              |
| Điều hướng    | 360 Feed, Trao đổi, Trợ lý AI của nền tảng lớn | MVP chỉ có Hôm nay, Bảng hàng, Gửi, Đã gửi                       | Lấy vỏ 264/56 px, giữ cấu trúc nhà của sản phẩm                                        |
| Thuật ngữ     | Nguồn hàng, Khách hàng, vai `l1/l2`            | Hàng, Liên hệ, bốn vai                                           | Theo mục Thuật ngữ                                                                     |
| Màu chính     | README: Bright Blue `#0246FF`                  | Brand guideline ghi Node Blue `#0047FF`; không thấy mã `#0246FF` | Tạm giữ `#0246FF`, đội thương hiệu xác nhận; đổi một dòng                              |
| Font          | Inter, ghi là quyết định chính thức            | Brand guideline quy định Circular Std và FK Grotesk              | Giữ Inter theo bộ DS; cần người xác nhận quyết định đó                                 |
| Khổ màn       | Chưa định nghĩa; đề xuất 1024, 1280, 1440      | ADR-0024 có 1440, 1024, 375                                      | Breakpoint mặc định của Tailwind; khổ điện thoại lấy theo công thức ở mục Chuẩn hoá UX |
| Màu nhấn      | Celeste, Apricot, Cyan                         | Tương phản với trắng 1,4–1,7                                     | Đúng luật DS: chỉ tô nền, chữ dùng mức 700                                             |

**Dùng ngay cho MVP:** Button, Input, Select, Tag, Badge, Avatar, Tabs, Breadcrumb, Sidebar, Dialog, Toast, EmptyState, SystemState, Skeleton, ConnectionBanner, FilterBar, ColumnMenu, StatusSummary, ActivityTimeline, ListingCard, Gallery, PriceInput cùng bộ định dạng số. **Để sau:** nhóm AI, Workspace, Kanban, biểu đồ, lịch, bản đồ.

Góp ngược về DS qua `ds-changes.md` theo đúng quy trình của bộ DS: hàng bảng dày, `MaskedValue` an toàn, ba khổ màn.

## Chuẩn hoá UX

Khảo sát tháng 11/2026, áp cùng nguyên tắc chuẩn trước, công thức sau, phải đo được.

| Phát hiện                                                                                                   | Nguồn                                      | Hệ quả cho kho này                                                              |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------- |
| 2026 là năm mệt mỏi vì AI; niềm tin là bài toán thiết kế chính                                              | NN/g State of UX 2026                      | MVP không AI là đúng hướng; khi thêm AI theo luật AI không tự ghi của OneHub DS |
| Giao diện khá ngày càng rẻ; khác biệt nằm ở hiểu người dùng và tác động kinh doanh                          | NN/g                                       | Nhóm U là bắt buộc, không phải trang trí                                        |
| Agent cũng là người dùng; HTML ngữ nghĩa và nhãn rõ giúp cả agent                                           | NN/g, 04/2026                              | Truy cập là khoản đầu tư kép                                                    |
| WCAG 3.0 vẫn là bản nháp (10/09/2026)                                                                       | W3C                                        | Giữ đích WCAG 2.2 AA                                                            |
| Ngưỡng Core Web Vitals không đổi                                                                            | web.dev                                    | Giữ ngưỡng; trang sau đăng nhập phải tự đo bằng `web-vitals`                    |
| Khổ điện thoại phổ biến ở Việt Nam 10/2026: 414×896 (21 %), 360×800 (10 %); 375 không nằm trong sáu khổ đầu | StatCounter                                | Bỏ 375                                                                          |
| Zalo đứng đầu về mức dùng (98 % trong một khảo sát mẫu)                                                     | Q&Me 2026                                  | Trang khách phải chạy tốt trong trình duyệt của Zalo                            |
| Luật 91/2025/QH15 có hiệu lực 01/01/2026, kèm Nghị định 356/2025                                            | Văn bản luật, bản tóm tắt của công ty luật | Có chỗ ghi căn cứ xử lý và đường xử lý yêu cầu rút đồng ý; người pháp lý chốt   |
| Bảng dữ liệu: ghim cột, cho chỉnh mật độ, sửa trên ô chỉ cho việc đơn giản                                  | Chủ yếu blog hãng, bằng chứng yếu          | Dùng làm giả thuyết, đo lại                                                     |

**Quy tắc đưa vào `design/decisions.yaml`**

| Quyết định                           | Loại                              | Quy tắc                                                                                                              | Kiểm bằng              |
| ------------------------------------ | --------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| Phản hồi theo độ trễ                 | Chuẩn: giới hạn 0,1 / 1 / 10 giây | Dưới 1 giây không chỉ báo; 1–10 giây có chỉ báo, khung chờ khi biết trước bố cục; trên 10 giây có tiến độ và nút huỷ | Playwright giả lập trễ |
| Vùng bấm                             | Chuẩn: WCAG 2.5.8                 | Tối thiểu 24 px; điện thoại 44 px theo DS                                                                            | axe                    |
| Tiêu điểm không bị che               | Chuẩn: WCAG 2.4.11                | Hàng và cột dính của Lưới không che ô đang chọn                                                                      | Playwright             |
| Đăng nhập                            | Chuẩn: WCAG 3.3.8                 | Dán được mã, cho trình quản lý mật khẩu điền                                                                         | Playwright             |
| Không bắt nhập lại                   | Chuẩn: WCAG 3.3.7                 | Giá trị đã nhập trong cùng luồng tự điền                                                                             | Bài kiểm luồng         |
| Báo trạng thái                       | Chuẩn: WCAG 4.1.3                 | Toast và kết quả lọc có `role` trạng thái                                                                            | axe, Testing Library   |
| Khổ để kiểm                          | Công thức                         | Trong sáu khổ đầu của StatCounter: khổ hẹp nhất và khổ phổ biến nhất, tính lại mỗi quý; hiện là 360 và 414           | Lệnh đọc số liệu       |
| Sửa trên ô hay ở hồ sơ               | Công thức                         | Kiểu `money`, `count`, `text`, `select`, `boolean`, `date` sửa trên ô; còn lại mở hồ sơ cạnh bảng                    | Kiểu dữ liệu           |
| Hoàn tác hay xác nhận                | Công thức                         | Đảo được thì làm ngay và cho hoàn tác; không đảo được hoặc ra ngoài sàn thì xác nhận                                 | Bài kiểm luồng         |
| Câu lỗi                              | Danh sách đóng                    | Ba phần: chuyện gì xảy ra, vì sao, làm gì tiếp                                                                       | Lint chuỗi, người soát |
| Mật độ bảng                          | Công thức, chưa có nút chọn       | Theo công thức ở trên; nút chọn chỉ thêm nếu buổi thử cho thấy cần                                                   | Nhóm U                 |
| Thứ tự thông tin, việc chính của màn | Phán đoán                         | Người quyết, kiểm bằng buổi thử                                                                                      | Nhóm U                 |

**Đo trải nghiệm** theo ba mặt của ISO 9241-11: hiệu quả, hiệu suất, hài lòng. Năm việc cốt lõi của đợt «bỏ Sheet»: nhập một file Excel; tìm căn và sửa giá; ghi kết quả gọi; gửi link cho khách; khách mở trang trên điện thoại. Mỗi việc đo tỉ lệ hoàn thành, thời gian, và SEQ; cuối buổi đo SUS. Khi chạy thật, theo dõi bằng HEART với các số đã có ở `mvp-mo-dan.md`.

## Thuật ngữ: từ RESO đến ngôn ngữ chuẩn hoá

**Vấn đề.** «Seller side», «Đầu chủ», «Bên bán» đang gộp ba khái niệm khác nhau: phía giao dịch, người môi giới, và chủ thể mua bán. Tách ba thứ này ra thì hết tranh cãi vùng miền.

**RESO DD 2.1 nói gì (đã đọc từng trường):**

- RESO không có trường «side». Phía giao dịch thể hiện bằng tiền tố `List*` và `Buyer*`: `ListAgent`, `ListOffice`, `ListTeam`, `CoListAgent` và `BuyerAgent`, `BuyerOffice`, `BuyerTeam`, `CoBuyerAgent`. Khoá trỏ về tài nguyên `Member` và `Office`.
- `Seller`, `Buyer`, `Landlord`, `Tenant` trong `ContactType` là **chủ thể giao dịch** («owner or principal»), không phải môi giới.
- RESO dùng `BuyerAgent`, không dùng «Selling Agent». Ở Mỹ, «selling agent» vẫn gây hiểu lầm vì thực chất là môi giới của người mua. «Bên bán» ở Việt Nam mắc đúng lỗi này.

**Pháp lý Việt Nam (Luật 29/2023/QH15, đã đếm toàn văn):** «bên bán» 15 lần, «bên mua» 62, «bên cho thuê» 27, «bên thuê» 30, đều chỉ **chủ thể hợp đồng**. «Đầu chủ», «đầu khách» 0 lần: đây là tiếng thị trường.

**Công thức chọn nhãn chuẩn cho một khái niệm**, thay cho chọn theo thói quen miền nào:

| Nhãn cho người môi giới    | Không trùng nghĩa pháp lý | Phủ cả bán và cho thuê | Tối đa 8 ký tự | Hai miền hiểu đúng |
| -------------------------- | ------------------------- | ---------------------- | -------------- | ------------------ |
| **Đầu chủ / Đầu khách**    | Đạt                       | Đạt                    | Đạt            | Chưa đo            |
| Bên bán / Bên mua          | Trượt                     | Trượt                  | Đạt            | Chưa đo            |
| Môi giới bên bán / bên mua | Đạt                       | Trượt                  | Trượt          | Chưa đo            |

**Đã chốt 09/11:** «Đầu chủ», «Đầu khách». Nguyên tắc này áp cho toàn ứng dụng tại `design/language.md`, từ điển ở `ontology/labels.yaml`, có bài kiểm trong `make check`. Kiểm theo công thức còn phát hiện: «Đang bán», «Đã bán» phải đổi theo loại giao dịch; «Sàn» là ngoại lệ có ghi lý do vì trùng «sàn giao dịch» trong luật.

**Bảng khái niệm**

| Mã                   | Gốc RESO                      | Nhãn chuẩn   | Biến thể (tìm được, sàn đổi được) | Tiếng Anh                 | Không dùng                  |
| -------------------- | ----------------------------- | ------------ | --------------------------------- | ------------------------- | --------------------------- |
| `ListSide` (của ta)  | Tiền tố `List*`               | Phía chủ     | Bên bán                           | Listing side, Seller side |                             |
| `BuyerSide` (của ta) | Tiền tố `Buyer*`              | Phía khách   | Bên mua                           | Buyer side                |                             |
| `list_agent`         | `ListAgent`, `listAgentKey`   | Đầu chủ      | Môi giới bên bán                  | Listing agent             | Selling agent               |
| `buyer_agent`        | `BuyerAgent`, `buyerAgentKey` | Đầu khách    | Môi giới bên mua                  | Buyer's agent             | Selling agent               |
| `Seller`             | `ContactType`                 | Chủ bán      | Chủ nhà                           | Seller                    | «Bên bán» trên màn vận hành |
| `Landlord`           | `ContactType`                 | Chủ cho thuê | Chủ nhà                           | Landlord                  |                             |
| `Buyer`              | `ContactType`                 | Người mua    | Khách mua                         | Buyer                     | «Bên mua» trên màn vận hành |
| `Tenant`             | `ContactType`                 | Người thuê   | Khách thuê                        | Tenant                    |                             |

Đổi `listing_agent` của Quỹ hàng thành `list_agent` trong lược đồ mới, cho đúng RESO. `CoListAgent`, `CoBuyerAgent`, `ListOffice`, `BuyerOffice` giữ tên để dành cho hợp tác giữa các sàn, chưa làm ở MVP.

**Quy tắc theo ngữ cảnh**

- Màn vận hành nội bộ: nhãn chuẩn.
- Trang khách: không dùng tiếng nội bộ; nhãn đề xuất là «Người tư vấn».
- Hợp đồng và văn bản pháp lý: đúng chữ của luật, «Bên bán», «Bên mua», «Bên cho thuê», «Bên thuê».

**Cơ chế.** Mô hình theo SKOS của W3C: mỗi khái niệm một nhãn ưu tiên, nhiều nhãn thay thế.

- Khai ở `ontology/labels.yaml`; khi có lớp web sinh ra hàm `label(concept)`. `nhãn = nhãn riêng của sàn ?? nhãn chuẩn`.
- Biến thể theo **sàn**, không theo locale: `vi-VN` không phân biệt được Bắc và Nam, và một sàn thường hoạt động theo vùng.
- MVP chưa có màn «Cách gọi», nhưng có sẵn hàm tra và đặt được nhãn riêng bằng lệnh, nên sàn miền Nam dùng được ngay.
- Tìm kiếm khớp cả nhãn thay thế.
- Lint cấm viết cứng các nhãn này ngoài từ điển. Quỹ hàng đang có 67 tệp nhắc đến chúng.
- Đổi tệp này là đổi ontology, cần người duyệt.

**Đo:** 100 % nhãn đi qua từ điển, do lint giữ. Thử hiểu từ với khoảng 5 người mỗi miền, đích từ 80 % hiểu đúng (đề xuất). Nếu miền Nam hiểu kém «Đầu chủ» thì đổi nhãn riêng của sàn, không đổi mã.

## 2. Ca thật này kiểm chứng điều gì

| Giả thuyết                                 | Số gốc ở Quỹ hàng                                                                | Đo lại thế nào                              |
| ------------------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------- |
| Khoá phần giữa thì máy thôi đoán           | Mỗi tác tử tự đoán 17–22 mục, 70 % đáng ra hệ phải trả lời                       | Ba tác tử lập phương án một màn chưa có mẫu |
| Màn mẫu sạch thì lỗi thôi nhân bản         | 6 trong 16 điểm giống nhau là chép lỗi                                           | Đối chứng cùng kho ở Quỹ hàng               |
| Danh mục máy đọc giảm chi phí nạp ngữ cảnh | 26–38 tệp, 180–196 nghìn token mỗi phương án                                     | Cùng phép đo                                |
| Bộ mẫu bài kiểm giảm làm lại               | 110 trong 199 đơn vị làm lại nằm ở bài kiểm và hạ tầng, trung bình 2,2 vòng chấm | Hồ sơ nghiệm thu, tính theo hồ sơ           |

Giao diện không phải nguồn làm lại lớn nhất: khối đóng sẵn ước tính chỉ phòng được khoảng 19 %. Nên bộ mẫu bài kiểm phải đi cùng, không làm sau.

## 3. Mô hình ba trục

**Kích cỡ** trả lời «to bao nhiêu», **sở hữu** trả lời «của ai», **nghĩa** trả lời «đây là gì». Token nằm dưới cả năm cấp; mẫu hành vi và
luật chữ gắn vào molecules và organisms, không phải một cấp riêng.

| Cấp       | Chung                                                          | Riêng sản phẩm                                                    | Máy giữ bằng                          |
| --------- | -------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------- |
| Atoms     | `src/components/ui`, `reui` của nhà cung cấp                   | Không có                                                          | Lint cấm control trần, màu thô, cỡ lạ |
| Molecules | `src/components/candidate`: ô theo kiểu, đầu vùng, trường nhập | Trong mô-đun                                                      | Kiểu đóng, không nhận `className`     |
| Organisms | `src/components/candidate`: Lưới, thanh lưu, khối lỗi vùng     | `src/modules/<tên>/ui/`: Bảng hàng 15 cột                         | Prop bắt buộc theo năng lực           |
| Templates | `src/components/templates`, khai ở `design/patterns/`          | Không có                                                          | Danh sách đóng, bản đồ khuôn          |
| Pages     | Không có                                                       | `src/app/**/page.tsx`, giữ mỏng; một màn mỗi kiểu khai là màn mẫu | Đo trên màn chạy                      |

Không tạo thư mục `atoms/molecules/organisms`. Nhà cung cấp không chia được theo cấp, và 107 trong 158 thành phần tự viết của Quỹ hàng (đo 09/11) chỉ có tối đa một nơi dùng.
Cấp của thành phần không khai tay: máy tính từ độ sâu import và ghi vào danh mục.

**Đường nâng hạng.** Thành phần bắt đầu ở mô-đun. Khi mô-đun thứ hai cần, hoặc khi nó là mảnh của Lưới, thì ở `candidate`: API đã đóng nhưng còn được đổi.
Lên `core` theo điều kiện của bản kiến trúc: dùng ở hai kho hoặc hai màn khác loại, có bài kiểm trạng thái, có hướng dẫn chuyển.
Đợt này `core` để trống; Bảng hàng và Đã gửi cùng là danh sách nên chưa đủ điều kiện.

**Trục nghĩa.** Đây là phần audit chỉ ra còn thiếu: chưa có nguồn máy đọc được nối từ nghĩa của trường sang cách hiển thị. Kho này đã có ontology
nên bổ sung được một khoá:

```yaml
listPrice: { type: integer, min: 1, display: money, reso: ListPrice }
closeDate: { type: date, display: date }
fullName: { type: string, pii: true, display: person }
```

- `display` là danh sách đóng: `money`, `area`, `count`, `date`, `datetime`, `person`, `phone`, `status`, `text`, `boolean`, `select`.
- Bộ sinh riêng xuất bảng `Entity.field` sang kiểu; Lưới nhận tên trường và tự canh, tự định dạng. Không có prop canh cột.
- Cột suy ra khai trong recipe, chọn kiểu trong cùng danh sách đóng.
- Trường riêng của sàn (ADR-0018 quyết định 8, hiện có `bool` và `single_select`) ánh xạ vào danh sách này. Sàn đổi được **nhãn** của trường lõi, không đổi được **kiểu**.
- **`display` không mở dữ liệu.** Bất biến 2 vẫn do `server.ts` của mô-đun giữ: Lưới chỉ vẽ thứ máy chủ đã che.
- Thêm trường là đổi ontology nên cần người duyệt. `Listing` chưa có diện tích và các trường hiển thị của Bảng hàng, phải bổ sung ở chặng 1.

## 4. Nguồn sự thật và cấu trúc

```text
design/
  component-registry.json   sinh từ mã: tên, cấp, prop, biến thể, mặc định
  patterns/<nhom>.md        sổ template và phần tử, kit đọc được
  recipes/<ten>.md          recipe, ứng viên nâng hạng
  decisions.yaml            sổ tất định: mỗi quyết định một dòng, có lệnh kiểm
  behaviors.md              mẫu hành vi có câu trả lời đóng
  states.md                 ma trận trạng thái
  content.md                luật chữ: lấy từ mục nội dung của OneHub DS, thêm nhãn nút và câu lỗi
  escapes.md                lỗi lọt qua và tầng đáng ra phải chặn
ontology/                   nghĩa và kiểu hiển thị
```

Chưa làm `design/tokens.json`. Audit đo được 0 đơn vị làm lại vì token. Token là thang mặc định của Tailwind và shadcn, cộng sổ ngoại lệ thương hiệu ở `src/styles/onehub.css`.

- **Thang dùng lại đổi thứ tự:** màn mẫu và recipe → candidate, core → khối ReUI → tự viết. Đây là thay đổi so với ADR-0002 và ADR-0019 của Quỹ hàng, cần một bản ghi quyết định.
- **Chọn khối phải đúng cấp:** `dashboard-6` có vùng chính và tiêu đề cấp một, tức cỡ template, nhưng từng bị đặt vào một ô. Đó là gốc lỗi hai vùng chính ở màn Hôm nay.
- **Ma trận trạng thái bắt buộc:** chờ tải, trống, tìm không ra, lỗi, một phần hỏng, chữ dài, không đủ quyền, xung đột khi lưu; ở cả bốn khổ 1440, 1024, 414, 360.
- **Mẫu hành vi chốt trước khi dựng Lưới:** chia trang và nạp thêm, bề rộng cột theo kiểu, mở hồ sơ cạnh bảng có địa chỉ riêng, phím Esc, bản điện thoại. Đây là các chỗ ba tác tử lệch nhau.
- **Lớp nạp cho Claude Code:** một luật theo đường dẫn và một skill giao diện ngắn của kho, trỏ vào danh mục và màn mẫu thay vì bắt đọc tài liệu dài. Khai `design_pass.ds_skill`, `feature_loop.ui_standards_skill`, `design.surface_globs`.
- **Vòng phản hồi:** mỗi lỗi audit tìm ra ghi vào `escapes.md` và trả lời «tầng nào đáng ra phải chặn», rồi sinh luật hoặc hàng việc. Ở Quỹ hàng sổ này đang 0 dòng dù đã nhiều audit.

## 5. Khoá từng quyết định

| Quyết định                                   | Đích                      | Cách đạt                                                                                        |
| -------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------- |
| Màu, cỡ, bố cục trang                        | Lint                      | Chuyển 14 luật `ui-lint`, kèm trần nợ 0                                                         |
| Canh cột, bề rộng, định dạng tiền và ngày    | Không viết sai được       | Công thức theo kiểu `display`, `Intl` qua một hàm chung, lint cấm gọi thẳng                     |
| Chiều cao dòng, đường kẻ                     | Không viết sai được       | Lưới không mở prop                                                                              |
| Tìm không ra có lối thoát                    | Không biên dịch nếu thiếu | Prop bắt buộc                                                                                   |
| Đầu vùng, vai trò tiêu đề                    | Không viết sai được       | Thành phần theo vai trò                                                                         |
| Chữ bị cấm                                   | Lint                      | Đọc từ cấm trong glossary                                                                       |
| Chiều phụ thuộc giữa các cấp                 | Lint                      | `no-restricted-imports` của ESLint: `templates` không nhập mô-đun, `candidate` không nhập `app` |
| Một vùng chính, một `h1`, tương phản, nhãn ô | Đo trên màn chạy          | Luật có sẵn của axe qua Playwright, ở màn mẫu trước                                             |
| Hiệu năng Lưới                               | Đo trên màn chạy          | Giữ ngưỡng đã có: 5.000 dòng × 20 cột, p95 khung hình ≤ 33,4 ms, CPU giảm tốc 4×                |
| Việc chính của màn, thứ tự thông tin         | Phán đoán                 | Thử với người dùng, máy không chấm                                                              |

**Công cụ.** Mô-đun cần cửa công khai thứ ba là `ui`, vì `index.ts` phải giữ thuần. `tools/boundaries.py` chỉ vá để có cửa này; chiều phụ thuộc trong `src/components` dùng ESLint, không viết thêm công cụ.
Kiểu hiển thị dùng một bộ sinh mới, không sửa `tools/ontology_codegen.py`. Đây là tệp rủi ro cao, cần người ký; bản vá chung đi về repo-standards.

## 6. Lộ trình

**Điều kiện trước, cần người làm:** tạo kho GitHub và gộp nhánh khởi tạo; thêm job cổng vào CI; ánh xạ T1/T2/T3 vào `governance/autonomy.yaml`; đặt `REUI_LICENSE_KEY`; rà pháp lý theo Luật 91/2025/QH15 và Nghị định 356/2025 trước khi có dữ liệu chủ nhà thật. Không có các việc này thì chưa mở được PR nào qua cổng.

Khác bản kiến trúc: kho mới chưa có màn nào để chép lỗi, nên ở đây màn mẫu là **kết quả** của lát cắt đầu. Đối chứng chạy trên commit Quỹ hàng đã ghim, nên không chặn MVP và làm được bất cứ lúc nào trước khi đóng gói.

| Chặng                    | Nơi                     | Việc                                                                                                                                                                                                           | Xong khi                                                                             |
| ------------------------ | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| A. Khoá thước đo         | Cả hai                  | Khôi phục câu giao gốc của phép đo; chốt bảng 21 quyết định, danh sách lỗi, cách phân loại; chọn kiểu màn chưa có mẫu                                                                                          | Được ký, không sửa sau đó                                                            |
| B. Đối chứng             | Commit Quỹ hàng đã ghim | Làm sạch Liên hệ (hàng `hai-bang-mot-nep`, cộng `h1` và câu lỗi), đo lại ba tác tử. Trước chặng 6                                                                                                              | Có số đối chứng cùng kho                                                             |
| 0. Nền và nhận diện      | Kho mới                 | Next.js, Tailwind, ReUI, Playwright, axe, Testing Library; `onehub.css`, Inter, logo, vỏ ứng dụng; loại `ui`, `reui` khỏi Prettier, ESLint, độ phủ test; lint giao diện, cửa `ui`, sổ `decisions.yaml`, bậc M1 | `make check` xanh trên trang trống có vỏ OneHub, in tỉ lệ tất định, và có ca đỏ thật |
| 1. Lát cắt Bảng hàng     | Kho mới                 | Bản đọc: khoá `display`, ô theo kiểu, định dạng, đầu vùng, mẫu hành vi, Lưới, template danh sách–chi tiết; mẫu chờ màn sẵn sàng, bài phá thử bắt buộc, môi trường kiểm cách ly; dữ liệu mẫu `MAU-…`            | Đạt đủ ma trận ở bốn khổ, mỗi bài kiểm giao diện đỏ được khi phá, khai là màn mẫu    |
| 2. Sửa ô và màn thứ hai  | Kho mới                 | Thêm sửa trên ô, dán từ Excel; dựng Đã gửi trên cùng Lưới                                                                                                                                                      | Không thêm prop kiểu dáng, đạt ngưỡng hiệu năng                                      |
| 3. Đo mức phương án      | Kho mới                 | Ba tác tử: một màn danh sách mới, một kiểu màn chưa có mẫu                                                                                                                                                     | Đạt nhóm P ở mục 7                                                                   |
| 4. Tính năng MVP         | Kho mới                 | Chỉ các phần «giữ» ở mục Cắt gọn, nối API thật, gồm trang khách; lược đồ mới và lệnh chuyển dữ liệu; `web-vitals`; kiểm trang khách trong trình duyệt của Zalo                                                 | Đủ 10 hồ sơ có màn; năm việc cốt lõi đạt nhóm U ở mục 7                              |
| 5. Ra MVP, thay Quỹ hàng | Kho mới                 | Chuyển dữ liệu, trỏ tên miền, đo đợt «bỏ Sheet»                                                                                                                                                                | Đạt ngưỡng đã ký ở `mvp-mo-dan.md`                                                   |
| 6. Đóng gói              | Kit, repo-standards     | Đưa phần chung ra, kể cả token khi cần                                                                                                                                                                         | Đạt nhóm T ở mục 7; một kho khác cài được, không chép tay                            |

**Nếu không đạt:** ở chặng 3, sửa mô hình tối đa hai vòng. Vẫn không đạt thì dừng chuyển hàng loạt và mang số về cho chủ kho quyết. Ở chặng 6, không đạt thì giữ riêng trong kho này, không đóng gói.

**Chi phí đo:** khoảng 190 nghìn token mỗi tác tử theo số tự báo, ba lần đo ba tác tử là khoảng 1,7 triệu token.

## 7. Ngưỡng đạt

Bảng quyết định và cách phân loại khoá trước ở chặng A. Người chấm «mang lỗi» và «đáng ra hệ phải trả lời» là tác tử mới, không biết bản đề xuất này.

| Nhóm | Thước đo                                                      | Gốc                                      | Ngưỡng                   | Căn cứ ngưỡng                                   |
| ---- | ------------------------------------------------------------- | ---------------------------------------- | ------------------------ | ----------------------------------------------- |
| H    | Tỉ lệ tất định                                                | 26/44 tại kho mới, không so với Quỹ hàng | Từ 70 %                  | Audit: 70 % mục tự đoán đáng ra hệ phải trả lời |
| P    | Đồng thuận giữa các tác tử (Fleiss κ) trên bảng đã khoá       | 76 % đồng thuận thô (16/21), chưa tính κ | κ từ 0,81                | Thang Landis và Koch                            |
| P    | Quyết định giống nhau nhưng mang lỗi                          | 6/21                                     | 0                        | Mỗi điểm là một lỗi                             |
| P    | Mục hệ đáng ra phải trả lời mà máy tự đoán, mỗi tác tử        | 12–15                                    | Tối đa 4                 | 30 % số gốc, theo tỉ lệ audit                   |
| P    | Tệp đọc và token để ra một phương án                          | 26–38 tệp, 180–196 nghìn                 | Giảm một nửa             | Đề xuất                                         |
| P    | Kiểu màn chưa có mẫu                                          | Chưa đo                                  | Báo số                   | Chưa có căn cứ                                  |
| Q    | Lỗi axe mức nghiêm trọng trên màn mẫu                         | Chưa có ai chấm                          | 0                        | WCAG 2.2 AA                                     |
| Q    | LCP, INP, CLS ở p75, thu từ người dùng thật bằng `web-vitals` | Chưa đo                                  | 2,5 giây, 200 ms, 0,1    | Core Web Vitals, đã đối chiếu web.dev           |
| Q    | Lưới 5.000 dòng × 20 cột                                      | Đã đo ở bài thử                          | p95 khung hình ≤ 33,4 ms | Bài thử của Quỹ hàng                            |
| T    | Hồ sơ đạt ngay vòng chấm đầu                                  | Khoảng 30 %                              | Từ 60 %                  | Đề xuất                                         |
| T    | Đơn vị làm lại do bài kiểm và hạ tầng, mỗi hồ sơ              | Khoảng 1,5 (110 trên 75 hồ sơ)           | Tối đa 0,75              | Đề xuất                                         |
| T    | Bốn chỉ số DORA                                               | Chưa đo ở kho mới                        | Báo số                   | Chưa có căn cứ                                  |
| U    | Tỉ lệ hoàn thành năm việc cốt lõi, 3–4 người mỗi vai          | Chưa đo, 0 buổi                          | Báo số, buổi đầu làm mốc | Chưa có căn cứ                                  |
| U    | Điểm dễ làm từng việc (SEQ, thang 7)                          | Chưa đo                                  | Báo số, buổi đầu làm mốc | Chưa có căn cứ                                  |
| U    | Khách hỏi → gửi link, trung vị                                | Chưa đo                                  | Tối đa 5 phút            | Đã đề xuất ở `mvp-mo-dan.md`                    |
| U    | SUS cuối buổi                                                 | Chưa đo                                  | Từ 68                    | Mức trung bình công bố                          |

**Cách đọc:**

- So với số đối chứng ở chặng B, không chỉ số gốc. Phần chênh mới là của hệ; kho mới sạch tự nó đã bớt lệch.
- Hai bảng hết lệch vô cớ là điều kiện nghiệm thu của chặng 2, không phải bằng chứng, vì chúng dùng chung một Lưới.
- Câu giao nguyên văn của phép đo gốc chưa tìm thấy trong tài liệu. Viết lại thì số gốc chỉ so được gần đúng; khi đó số đối chứng là mốc chính.
- Một màn, ba tác tử, kit đổi bản giữa chừng: kết quả chỉ để định hướng.
- Báo cáo ghi riêng kết quả thử với người dùng: hệ rất nhất quán vẫn có thể sai đồng loạt.
- Phép đo ba tác tử chỉ đo độ tất định khi dựng, **không đo trải nghiệm**. Nhóm U chỉ lấy từ người thật; không dùng người dùng giả lập.

## 8. Tương thích

| Điểm                                | Kết quả                                                                                | Xử lý                                                   |
| ----------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Bốn bậc độ nghiêm của kit           | Với TSX, M2 và M3 chỉ chặn hex như M1 (đã thử)                                         | Dừng ở M1; M2 khi có kho thứ hai và tệp token           |
| Định dạng `tokens.json` khi cần     | Kit đọc giá trị chuỗi; tệp DTCG 2025.10 nghiêm bị chấm 0 % (đã thử)                    | Sinh dạng chuỗi như onehub-invest                       |
| Bản đồ khuôn                        | `design/patterns/` dùng được, kit tự chấm                                              | Khai theo templates                                     |
| Khoá `display` trong ontology       | Lint và bộ sinh không báo lỗi, nhưng chưa sinh ra gì (đã thử)                          | Viết bộ sinh riêng                                      |
| Mã nhà cung cấp với chuẩn của kho   | 3/3 tệp mẫu trượt Prettier (đã thử); khoảng 18.500 dòng sẽ kéo độ phủ dưới ngưỡng 80 % | Loại khỏi kiểm tra; sửa `vitest.config.ts` cần người ký |
| Next.js với ESLint 10, TypeScript 6 | Khai báo tương thích của `eslint-config-next` cho phép, chưa chạy thử                  | Kiểm ở chặng 0, lùi về bản của Quỹ hàng nếu vỡ          |
| Công cụ đo màn chạy                 | Quỹ hàng không có Playwright, axe, Testing Library, jsdom trong khai báo gói           | Thêm ở chặng 0                                          |
| Cổng gộp                            | Hai lỗ hổng T1-escape đang được vá ở kit                                               | Chờ vá xong trước chặng 1                               |

## 9. Phân chia về sau

| Thuộc về       | Gồm                                                                                                                   | Khi nào                      |
| -------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| Kit nghiệm thu | Lược đồ `design/`, ma trận trạng thái, danh mục mẫu hành vi, bộ mẫu bài kiểm, giảm điểm ghim, luật lint không gắn kho | Chặng 6                      |
| repo-standards | Lớp quyết định `design`, bộ khung Next.js, khoá `display`, cửa `ui`                                                   | Chặng 6                      |
| Registry riêng | Core components, chung cho các kho cùng nền base-nova và ReUI                                                         | Khi có kho thứ hai dùng thật |
| Từng kho       | Giá trị token, recipe, snowflake, màn mẫu                                                                             | Luôn riêng                   |

Thang M0–M3 giữ nguyên như một chỉ báo hẹp về token; thang L1–L5 của bản kiến trúc là độ phủ. Không gộp.

## 10. Rủi ro và điều không làm

| Rủi ro                           | Cách giữ                                                                    |
| -------------------------------- | --------------------------------------------------------------------------- |
| Kho mới đạt chỉ vì mới           | Đối chứng ở chặng B và kiểu màn chưa có mẫu                                 |
| Hai kho cùng làm một việc        | Quỹ hàng dừng thêm tính năng, chỉ vá lỗi                                    |
| Viết lại làm chậm ra mắt         | Bám bảng Cắt gọn; thứ gì không phục vụ đợt «bỏ Sheet» thì để sau            |
| Chọn sai vì chưa có số dùng thật | Sửa bảng phạm vi theo số đo của đợt đầu                                     |
| Phần đã mang lệch với bản gốc    | Ghi commit nguồn; lỗi vá ở Quỹ hàng được rà theo danh sách đó               |
| Lưới phình thành một cục         | Giữ cấu hình, kiểu, trạng thái; cuộn ảo và sửa trên ô gắn từ ngoài          |
| Màn mẫu mang lỗi                 | Phải đạt đủ ma trận trước khi khai là màn mẫu                               |
| Chuẩn hoá quá sớm cho nền khác   | Chỉ kết luận cho nhóm base-nova và ReUI cho tới khi có kho khác nền         |
| Khoá quá chặt                    | Recipe luôn mở, ngoại lệ có lý do và hạn                                    |
| Lệch khỏi nhận diện OneHub       | Một lớp ánh xạ, không style tại màn; thay đổi góp ngược qua `ds-changes.md` |

**Không làm:** cây thư mục theo atoms; một gói giao diện cho mọi kho; đưa thành phần vào core khi chưa đủ điều kiện; so ảnh tự động trước khi hành vi đứng vững;
đổi nền của kho khác chỉ để khớp hệ.
