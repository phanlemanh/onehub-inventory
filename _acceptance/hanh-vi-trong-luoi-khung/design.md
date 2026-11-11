# Thiết kế: Hành vi nằm trong Lưới và khung (hàng 1e)

Ngày 11/11/2026 · dãy K của đợt nen · hạng T2 · nguồn: hàng 1e của `docs/plan/lo-trinh.json`, mã F9 của `docs/plan/pham-vi-mvp-dot-1.md`, quyết định `wiki/decisions/0019-measurable-design-system-pilot.md`. Dựng trên hàng 1b (Lưới, ô theo kiểu, trạng thái vùng) và 1a (khung, kênh thông báo, băng trên màn).

## Mục tiêu

Ở Quỹ hàng, trạng thái và hành vi là chỗ Bảng hàng lệch Liên hệ: mỗi màn tự dựng hồ sơ cạnh bảng, tự chọn lúc hiện chờ tải, tự viết câu lỗi, tự quyết khi nào hỏi xác nhận. Hàng này dồn các hành vi ấy vào Lưới và khung, để một màn chỉ khai mình cần gì (cột, dòng, việc tải lại, việc lưu và cách hoàn tác, quyền làm việc), còn cách hiện và cách cư xử chỉ có một chỗ dựng.

Sáu quyết định tầng hành vi trong sổ `design/decisions.yaml` (lớp `patterns`) sau hàng này đều có bài kiểm đỏ được: `edit-in-cell`, `undo-or-confirm`, `feedback-by-delay`, `state-matrix`, `notification-channel`, `read-only-cell`; thêm một quyết định cho «Mở hồ sơ cạnh bảng» (dòng có trong `design/behaviors.md` nhưng chưa có trong sổ).

## Hướng đã chọn

**Hồ sơ cạnh bảng là một khung (`RecordPanel`), do Lưới giữ.** Màn khai cho `DataRegion` một hàm dựng tiêu đề và nội dung cho một dòng; Lưới mở khung với thứ tự dòng đang hiện sau tìm lọc, nên «Sau» không bao giờ nhảy sang dòng bị lọc ẩn. Màn cần hồ sơ ngoài Lưới thì dùng `RecordPanel` trực tiếp với danh sách id của mình. Khung lo phần còn lại theo dòng «Mở hồ sơ cạnh bảng» của `design/behaviors.md`: địa chỉ riêng là tham số `?ho-so=<id>` trên đường của màn (mở thẳng địa chỉ ấy là mở hồ sơ); Esc hay nút đóng thì đóng, xoá tham số và trả tiêu điểm về dòng đã mở; dưới 640px mở toàn màn, rộng hơn thì nằm cạnh bảng; nút «Trước» và «Sau» đi qua dòng kề trong thứ tự đang hiện, đổi địa chỉ, giữ nguyên khung (vị trí, bề rộng, đầu hồ sơ). Khung không biết căn hay người: bản mẫu dùng cùng một khung cho hồ sơ căn và hồ sơ người. Dựng trên `Sheet` của kho (Base UI Dialog), không vẽ tay. Nội dung thật của hồ sơ căn là B2 (hàng 3).

**Lưới mở hồ sơ.** Khi màn khai hồ sơ, mỗi dòng có nút mở ở ô đầu (tên là giá trị ô đầu), Enter trên nút ấy mở. Khi màn khai vùng sửa được, mỗi ô mang `data-edit="cell"` hay `data-edit="panel"` theo luật `editModeFor(kind)`: `money`, `count`, `text`, `select`, `boolean`, `date` sửa trên ô, còn lại sửa trong hồ sơ. Bộ sửa trên ô thật là B4; hàng này khoá luật chọn và lối vào hồ sơ.

**Chờ tải theo độ trễ, một chỗ.** Vùng đang tải: dưới 1 giây không chỉ báo; từ 1 giây khung chờ đúng số cột (giữ cách 1b làm); từ 10 giây thêm câu tiến độ «Vẫn đang tải…» và, khi màn đưa `onCancel`, nút «Huỷ». Đo trên đồng hồ của vùng, không bằng CSS cho nấc 10 giây.

**Lỗi, một phần hỏng, không đủ quyền — sửa năm mục chủ kho đòi khi ký 1b.**
(a) Khi vùng đang tải, lỗi hay không đủ quyền, đầu vùng chỉ còn tên vùng: không số dòng, không ô tìm. (b) Tải hỏng một phần mà chưa có dòng nào thì vùng nói dữ liệu có nhưng chưa tải được, không nói «chưa ai nhập». (c) «Thử lại» chỉ hiện khi màn nối `onRetry`; không nối thì câu lỗi bảo tải lại trang, không có nút chết. (d) Nút làm việc của vùng khai kèm quyền (`action={{ node, allowed }}`); không đủ quyền hay vùng cấm thì nút không hiện. (e) Chữ bị cắt đo lại khi bề rộng ô đổi (ResizeObserver), không chỉ lúc mới dựng.

**Lưu và hoàn tác, một cửa (`useChange`).** Màn khai một thay đổi: động từ, có đảo được không, có ra ngoài sàn không, việc làm, việc hoàn tác. Cửa quyết theo dòng «Lưu»: đảo được và trong sàn thì làm ngay rồi báo bằng toast có «Hoàn tác» (kênh `result`); không đảo được hoặc ra ngoài sàn thì mở hộp xác nhận nói rõ việc sẽ xảy ra, nút xác nhận mang đúng động từ, «Thôi» không làm gì. Lưu hỏng vì mất mạng đi qua `saveWithBanner` của 1a (băng trên màn, giữ phần đang nhập). Lỗi của một trường do màn báo tại chỗ (kênh `field`), cửa không dùng toast cho nó.

**Rào «màn tự dựng lại».** Một bài kiểm quét mọi tệp màn (`src/app/**`, `src/modules/*/ui/**`) theo danh sách viết trước 11 nguồn: `sheet`, `dialog`, `alert-dialog`, `drawer`, `skeleton`, `empty`, `spinner` của `components/ui`, `sonner`, `vaul`, và `Dialog`, `AlertDialog` nhập thẳng của Base UI; tệp nào nhập một nguồn thì đỏ, nêu tên tệp và thành phần dùng chung phải dùng thay. Chỉ `src/app/layout.tsx` được gắn `Toaster`. Rào đặt ở bài kiểm chứ không ở luật ESLint vì thư mục luật ESLint và tệp cấu hình nằm ngoài vùng của hàng.

**Câu chữ** mới ở `grid-copy.ts` (vùng, hồ sơ) và `frame-copy.ts` (xác nhận, hoàn tác).

Lối khác đã loại: để màn tự dựng hồ sơ bằng `Sheet` và tự gọi `toast` — chính là chỗ lệch của Quỹ hàng (vì sao của hàng); thêm luật ESLint — ngoài vùng, và bài kiểm đã đủ đỏ.

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: Lưới → bấm hay Enter trên mã của một dòng → hồ sơ mở cạnh bảng, địa chỉ có `?ho-so=<id>` → «Sau» sang dòng kề → Esc → hồ sơ đóng, tiêu điểm về dòng đã mở (điểm ra: Lưới).
- Biên: mở thẳng địa chỉ có hồ sơ; dòng cuối thì «Sau» tắt; điện thoại thì hồ sơ phủ toàn màn; người không đủ quyền không thấy nút làm việc.
- Lỗi & quay lại: vùng tải lỗi → câu ba phần, «Thử lại» khi màn nối; thay đổi không đảo được → hộp xác nhận, «Thôi» quay lại không đổi gì; lưu hỏng vì mất mạng → băng trên màn, phần đang nhập còn nguyên.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Bản mẫu hành vi `/proto/hanh-vi-trong-luoi-khung` | Bày Lưới căn và Lưới người dùng chung hồ sơ cạnh bảng, chờ tải ba nấc, lỗi, lưu và hoàn tác | chỉ ở bản phát triển |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-hanhvi-ho-so | Bản mẫu hành vi | hồ sơ cạnh bảng, đầu có tên dòng, «Trước», «Sau», «Đóng» | đọc, đi qua lại, đóng |
| ST-hanhvi-ho-so-dt | Bản mẫu hành vi | khổ dưới 640px: hồ sơ phủ toàn màn | đóng |
| ST-hanhvi-cho-1s | Bản mẫu hành vi | dưới 1 giây không gì; từ 1 giây khung chờ đúng số cột; đầu vùng chỉ tên | chờ |
| ST-hanhvi-cho-10s | Bản mẫu hành vi | khung chờ + «Vẫn đang tải…» + «Huỷ» khi màn đưa | chờ hay huỷ |
| ST-hanhvi-loi | Bản mẫu hành vi | câu ba phần; «Thử lại» chỉ khi màn nối; đầu vùng chỉ tên | thử lại hay tải lại trang |
| ST-hanhvi-mot-phan-rong | Bản mẫu hành vi | chưa dòng nào tải được: nói dữ liệu có nhưng chưa tải được | thử lại |
| ST-hanhvi-khong-quyen | Bản mẫu hành vi | không nút làm việc, không số dòng | hỏi quản trị sàn |
| ST-hanhvi-hoan-tac | Bản mẫu hành vi | toast «Đã … » + «Hoàn tác» | hoàn tác hay đi tiếp |
| ST-hanhvi-xac-nhan | Bản mẫu hành vi | hộp nói việc sẽ xảy ra, nút mang động từ, «Thôi» | xác nhận hay thôi |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Esc đóng hồ sơ và trả tiêu điểm về nút mở của dòng; tiêu điểm vào hồ sơ khi mở.
- «Trước»/«Sau» theo thứ tự Lưới đang hiện (sau tìm lọc); khung không đổi vị trí và bề rộng.
- Dưới 640px hồ sơ phủ toàn màn; trang không cuộn ngang ở 360, 414, 1024, 1440.

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| Sheet, Dialog, Button (kho) | dùng | khung hồ sơ và hộp xác nhận của kho, không vẽ tay |
| toast qua `notifyResult` (1a) | dùng | kênh `result` đã có |
| DataRegion, RegionHeader, RegionState, TruncatedText (1b) | mở rộng | thêm mở hồ sơ, chờ tải ba nấc, sửa năm mục |
| RecordPanel, useChange, editModeFor | tạo | chưa có ở đâu trong kho |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: dòng «Mở hồ sơ cạnh bảng» của `design/behaviors.md` đã chọn sẵn chi tiết nằm cạnh danh sách; khuôn hiển nhiên nên không tra mẫu ngoài.

### 7. Thẻ việc

| Trường | Giá trị |
|---|---|
| Ai dùng | Nhân viên sàn ở bốn vai |
| Việc chính | Mở một dòng của Lưới để xem và sửa, rồi quay lại đúng chỗ |
| Tần suất | mỗi ngày nhiều lần |
| Số bản ghi | hàng trăm trở lên |
| Thiết bị | cả hai |
<!-- UX-SPEC-TEMPLATE>>> -->

**Design-pass không đồng bộ.** Các mặt mới (khung hồ sơ, toàn màn trên điện thoại, hộp xác nhận, toast có Hoàn tác, vùng chờ và lỗi) được dựng lên bản mẫu trước Cổng Phạm vi; máy chụp ma trận cảnh × khổ × sáng tối và gửi kèm thẻ, không chờ người ngồi cùng.

**Sáu ca phá thử ghim.** Mỗi quyết định trong sáu quyết định có một ca phá thử với thông điệp ghim trong `tests/behavior.test.tsx` (hay `tests/grid.test.tsx` với `read-only-cell`), và bài rào khẳng định đủ sáu ca đã đỏ.

## Tệp chạm

- `src/components/candidate/`: `record-panel.tsx` (mới), `use-change.tsx` (mới), `data-region.tsx`, `region-header.tsx`, `region-state.tsx`, `column-kind.ts` (`editModeFor`), `truncated-text.tsx`, `grid-copy.ts`.
- `src/components/templates/frame-copy.ts` (câu xác nhận, hoàn tác).
- `design/behaviors.md` (dòng «Lưu», «Mở hồ sơ cạnh bảng», «Phản hồi theo độ trễ» nêu thành phần dùng chung), `design/states.md` (cột «Kiểm bằng»).
- `src/app/(app)/proto/[slug]/`: `behavior-showcase.tsx` (mới) và một nhánh trong `page.tsx`.
- `tests/behavior.test.tsx` (mới), `tests/behavior-guard.test.ts` (mới), `tests/e2e/behavior.spec.ts` (mới), `tests/grid.test.tsx` (ca của 1b đổi theo (a), (c), (d)).
- `design/decisions.yaml`: thêm dòng `check` cho sáu mục và một mục `record-panel` — chờ giám sát cho phép (yêu cầu K-4).

## Đo

- Vitest: ma trận viết trước cho `editModeFor` (11 kiểu), cho cửa lưu (đảo được × trong/ngoài sàn), cho đầu vùng theo trạng thái; hồ sơ mở, Esc, tiêu điểm, đi qua lại; mỗi bài có ca phá thử ghim thông điệp.
- Playwright ở bốn khổ: hồ sơ cạnh bảng và toàn màn, địa chỉ riêng, chờ tải ba nấc trên đồng hồ giả, lỗi, xác nhận, hoàn tác; trang không cuộn ngang; axe sáng và tối.
- Bài rào quét tệp màn, kèm ca phá thử đặt một tệp màn giả nhập `Sheet`.
