# Thiết kế: thanh bên theo mọi vai một người giữ (hàng 1i)

Hồ sơ: `_acceptance/thanh-ben-nhieu-vai/` · hàng 1i của `docs/plan/lo-trinh.json` · dựng trên 1a (khung) và 1d (khai vai).

## Mục tiêu

Hàng 1a dựng thanh bên lọc mục theo **một** vai. Quyết định `wiki/decisions/0016-permission-model.md` nói «Người kiêm nhiều vai được cộng quyền», và hàng 1d khai `holds: many` trong `ontology/roles.yaml`. Người giữ Đầu chủ và Trưởng nhóm hôm nay chỉ thấy được mục của một trong hai vai. Hàng này đổi luật lọc: thanh bên nhận **danh sách vai** người ấy giữ và hiện mục không giới hạn vai cộng mọi mục dành cho ít nhất một vai trong danh sách.

## Hướng đã chọn

- Luật lọc ở một chỗ: `visibleNav(items, roles)` trong `src/components/templates/nav-menu.tsx`. Mục hiện khi không khai vai, hoặc khi danh sách vai của mục có ít nhất một vai người ấy giữ. Mỗi mục hiện một lần, theo thứ tự khai trong danh sách điều hướng.
- Khung và thanh bên nhận `roles` (danh sách) thay cho `role` (một vai). Một vai là danh sách một phần tử, nên luật của hàng 1a giữ nguyên cho người giữ một vai.
- Kiểu vai lấy từ bản khai của hàng 1d: `Role` sinh từ `ontology/roles.yaml` vào `src/generated/ontology.ts`. Một mục điều hướng khai vai ngoài bốn vai thì kiểm kiểu báo lỗi; không khai lại vai.
- Không biết vai (chưa đăng nhập) hoặc danh sách rỗng: chỉ mục không giới hạn vai hiện, như hàng 1a.
- Không có đăng nhập trong kho, nên khung thật hôm nay chưa truyền vai và danh sách điều hướng thật chưa có mục giới hạn vai. Hàng đăng nhập truyền vai của người vào khung; hàng bảng quyền (9a) quyết mục nào giới hạn vai nào.

Không chọn:

- Vai «chính» cộng nút đổi vai: trái 0016 (cộng quyền, không chọn vai), và thêm một thao tác người phải nhớ.
- Sinh thanh bên từ sổ màn `design/screens.yaml`: cần đổi bộ sinh trong `tools/` (hạng T3) và sổ màn chưa khai vai nào vào màn nào (0016 để việc đó cho bảng quyền).

## Đặc tả UX

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: người giữ nhiều vai mở ứng dụng → thanh bên hiện mục chung cộng mục của mọi vai mình giữ, theo thứ tự khai → chọn một mục (điểm ra: màn được chọn).
- Biên: người giữ một vai thấy đúng như hàng 1a. Hai vai cùng được một mục thì mục ấy hiện một lần. Chưa biết vai thì chỉ mục chung.
- Lỗi & quay lại: không có trạng thái lỗi mới; khung giữ các trạng thái của hàng 1a.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Khung (thanh bên của mọi màn nội bộ) | Cho đi tới mọi màn các vai của người ấy được vào | mọi màn nội bộ / mục trên thanh bên |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-thanh-ben-nhieu-vai | Khung | mục chung + mục của mọi vai người giữ, mỗi mục một lần, theo thứ tự khai | chọn mục |
| ST-thanh-ben-mot-vai | Khung | mục chung + mục của vai ấy (như hàng 1a) | chọn mục |
| ST-thanh-ben-chua-ro-vai | Khung | chỉ mục chung | chọn mục |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Thứ tự mục là thứ tự khai trong danh sách điều hướng, không xếp lại theo vai.
- Máy tính và điện thoại dùng cùng một thanh bên, nên cùng một danh sách mục.

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| NavMenu | mở rộng | nhận danh sách vai thay cho một vai |
| AppShell | mở rộng | chuyển danh sách vai xuống thanh bên |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: trung-tâm-toả-nhánh (hub-and-spoke), giữ nguyên của hàng 1a.
Căn cứ: hàng này chỉ đổi mục nào hiện trên thanh bên, không đổi cấu trúc; khuôn hiển nhiên nên không tra mẫu ngoài.

### 7. Thẻ việc

| Trường | Giá trị |
|---|---|
| Ai dùng | Nhân viên sàn giữ hai vai trở lên (ví dụ Đầu chủ kiêm Trưởng nhóm, chủ sàn kiêm Quản trị sàn và Trưởng nhóm) |
| Việc chính | Đi tới mọi màn các vai của mình được vào, không phải đổi vai |
| Tần suất | mỗi ngày nhiều lần |
| Số bản ghi | một |
| Thiết bị | cả hai |
<!-- UX-SPEC-TEMPLATE>>> -->

## Tệp chạm

- `src/components/templates/nav-menu.tsx`: luật lọc theo danh sách vai, kiểu `Role` cho vai của mục.
- `src/components/templates/app-shell.tsx`: nhận `roles`, chuyển xuống thanh bên.
- `tests/nav-roles.test.tsx` (mới): ma trận viết trước mọi tổ hợp vai × mục, khung dựng thật, mục khai vai lạ thì kiểm kiểu báo lỗi.
- `tests/frame.test.tsx`: đổi `role` thành `roles` ở ba chỗ gọi; ma trận một vai của hàng 1a giữ nguyên.

Không chạm `src/app/(app)/nav.ts` (danh sách thật chưa có mục giới hạn vai), `ontology/`, sổ màn, khuôn chung của khung (hàng 1e làm phần ấy).

## Đo

- Vitest: ma trận viết trước 16 tổ hợp vai (kể cả rỗng) × 5 mục mẫu = 80 ô hiện/ẩn đọc từ DOM của thanh bên dựng thật; khung `AppShell` dựng thật chuyển danh sách vai xuống thanh bên.
- Kiểm kiểu (`make check`): một mục khai vai ngoài bốn vai mang `@ts-expect-error`; nới kiểu vai về chuỗi thì chỉ thị thành thừa và kiểm kiểu đỏ.
- Mỗi bài có chiều đỏ: dựng thanh bên cho một tổ hợp rồi so với kỳ vọng của tổ hợp khác thì bộ kiểm ném lỗi gọi tên mục lọt hay mục thiếu.
