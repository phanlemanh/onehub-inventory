# Thiết kế: Lưới và ô theo kiểu (hàng 1b)

Ngày 11/11/2026 · dãy K của đợt nen · hạng T2 · nguồn: hàng 1b của `docs/plan/lo-trinh.json`, mã F6 và F7 của `docs/plan/pham-vi-mvp-dot-1.md`. Dựng trên hàng 1a (khung, bộ định dạng, màu trạng thái).

## Mục tiêu

Mọi vùng dữ liệu dùng chung một Lưới: ô hiện theo kiểu `display` của trường, đầu vùng giống nhau, đủ bốn trạng thái vùng (chờ tải, trống, tìm không ra, lỗi), tìm và chia trang có sẵn, luật ô chỉ đọc nằm một chỗ. Màn nghiệp vụ sau (Bảng hàng, Đã gửi) chỉ khai cột theo tên trường và đưa dữ liệu; canh lề, bề rộng, định dạng, mật độ không do màn tự chọn.

## Hướng đã chọn

**Cột khai bằng tên trường, không bằng lớp CSS.** Màn đưa `typedColumn({ field, header })` với `field` là một khoá của bảng kiểu sinh từ ontology (`FIELD_DISPLAY`, vd `Listing.listPrice`); kiểu tra từ bảng ấy, và kiểu tham số không nhận `kind`, `align` hay `width` (bài kiểm kiểu `@ts-expect-error` chặn). Canh lề, bề rộng và cách hiện đều suy từ `kind` theo `design/behaviors.md`: `money`, `area`, `count` canh phải, còn lại canh trái; bề rộng `max(độ dài nhãn, độ dài mẫu của kiểu) × 1ch + đệm hai bên`; mẫu mỗi kiểu là chuỗi dài nhất bộ định dạng trả cho giá trị điển hình («999,99 tỷ», «999,99 m²», «14:30 05/11/2026», «0900 000 001», «Chưa đủ để rao»…). Không có prop canh cột hay bề rộng cột ở cửa công khai.

**Ô theo kiểu (`TypedCell`)** dùng đúng bộ định dạng của hàng 1a. Kiểu `status` hiện huy hiệu màu theo bảng của 1a với chữ từ `label()`, kiểu `boolean` hiện «Có» hoặc «Không», kiểu chữ (`text`, `person`, `select`) cắt bằng dấu ba chấm khi dài và có `title` để đọc đủ. Ô trống hiện «—». Như vậy mục Ngoài-6 của 1a (trạng thái hiện mã tiếng Anh) được giải ở lớp ô.

**Mật độ** là một hàm thuần: tổng bề rộng tối thiểu các cột vượt bề rộng vùng nội dung thì dày (`h-10`, `text-sm`), không thì thường (`h-12`, `text-base`).

**Lưới (`DataRegion`)** bọc `DataGrid` của ReUI (TanStack v9, `dataGridFeatures`) — không vẽ bảng tay. Nhãn tiếng Anh của ReUI được thay bằng tiếng Việt qua `i18n`. Lưới cuộn ngang trong vùng của nó, trang không cuộn ngang.

**Đầu vùng (`RegionHeader`)**: `h2` tên vùng, số dòng («12 dòng», sau lọc «3 / 12 dòng»), ô tìm, chỗ cho nút chính của vùng. Tìm lọc trên mọi cột chữ ngay khi gõ.

**Trạng thái vùng (`RegionState`)**: chờ tải (dưới 1 giây không chỉ báo, từ 1 giây các dòng khung chờ đúng số cột — dùng lại độ trễ CSS của 1a, ẩn bằng `visibility`), trống (vì sao trống + việc làm tiếp do màn khai), tìm không ra (bắt buộc nút «Xoá lọc», kiểu bắt buộc ở prop), lỗi (câu ba phần + «Thử lại»), một phần hỏng (băng trong vùng nói phần chưa tải + «Thử lại», các dòng đã tải vẫn hiện), không đủ quyền (nói rõ, không dòng và không số dòng). Mọi câu chữ ở một tệp `grid-copy.ts`.

**Chia trang**: có sẵn, chỉ hiện khi số dòng vượt cỡ trang; cỡ trang là tham số với mặc định 50. Chốt chia trang hay cuộn ảo, và cỡ trang thật, để ở lát cắt Bảng hàng như `design/behaviors.md` đã ghi.

**Ô chỉ đọc**: ô không có quyền sửa hiện như chữ thường, không có dấu hiệu sửa; ô tạm khoá hiện biểu tượng khoá và nói lý do (chữ đọc được bằng trình đọc màn hình và hiện khi rê chuột).

Lối khác đã loại: để mỗi màn tự khai canh lề và bề rộng — chính là chỗ các tác tử lệch nhau ở Quỹ hàng (vì sao của hàng).

## Đặc tả UX

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: mở màn có vùng dữ liệu → đầu vùng nêu tên và số dòng → đọc các cột đã canh và định dạng theo kiểu → gõ vào ô tìm → dòng lọc ngay, số dòng đổi (điểm ra: dòng cần tìm).
- Biên: vùng chưa có dữ liệu → nói vì sao trống và việc làm tiếp; tìm không ra → «Xoá lọc»; nhiều dòng hơn cỡ trang → chia trang; nhiều cột hơn bề rộng → lưới dày và cuộn ngang trong vùng.
- Lỗi & quay lại: tải vùng hỏng → câu ba phần trong vùng, «Thử lại», phần còn lại của màn vẫn dùng được.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Bản mẫu Lưới `/proto/luoi-va-o-theo-kieu` | Bày Lưới với đủ kiểu cột và bốn trạng thái vùng | chỉ ở bản phát triển |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-luoi-du-lieu | Bản mẫu Lưới | đầu vùng + lưới đủ kiểu cột | đọc, tìm |
| ST-luoi-cho-tai | Bản mẫu Lưới | dưới 1 giây không gì; từ 1 giây dòng khung chờ đúng số cột | chờ |
| ST-luoi-trong | Bản mẫu Lưới | «Chưa có dữ liệu ở đây» + vì sao + nút làm tiếp do màn khai | làm việc gợi ý |
| ST-luoi-khong-ra | Bản mẫu Lưới | «Không có dòng nào khớp» + «Xoá lọc» | xoá lọc |
| ST-luoi-loi | Bản mẫu Lưới | câu ba phần + «Thử lại» trong vùng | thử lại |
| ST-luoi-day | Bản mẫu Lưới | nhiều cột: dòng thấp, chữ nhỏ, cuộn ngang trong vùng | cuộn |
| ST-luoi-khoa | Bản mẫu Lưới | ô tạm khoá có biểu tượng khoá và lý do | đọc lý do |
| ST-luoi-mot-phan | Bản mẫu Lưới | các dòng đã tải + băng nói phần chưa tải + «Thử lại» | thử lại |
| ST-luoi-khong-quyen | Bản mẫu Lưới | «Bạn chưa có quyền xem vùng này» + vì sao + làm gì tiếp, không dòng nào | hỏi quản trị sàn |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Canh lề, bề rộng, mật độ, ô chỉ đọc theo `design/behaviors.md`; màn không chọn.
- Gõ vào ô tìm lọc ngay; số dòng đổi theo.
- Trang không cuộn ngang ở 360, 414, 1024, 1440; lưới cuộn ngang trong vùng của nó.

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| DataGrid, DataGridTable, DataGridPagination, DataGridScrollArea (ReUI) | dùng | Lưới của kho, không vẽ bảng tay |
| Badge (ReUI) | dùng | ô trạng thái |
| Empty, Skeleton, Input, Button | ghép | trạng thái vùng, ô tìm |
| TypedCell, typedColumn, densityFor | tạo | luật ô theo kiểu chưa có ở đâu |
| RegionHeader, RegionState, DataRegion | tạo | đầu vùng và trạng thái vùng chưa có |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: Lưới là nửa danh sách của mọi màn danh sách–chi tiết (Bảng hàng + hồ sơ căn cạnh bảng, Đã gửi); nửa chi tiết thuộc hàng 3. Khuôn hiển nhiên nên không tra mẫu ngoài.

### 7. Thẻ việc

| Trường | Giá trị |
|---|---|
| Ai dùng | Nhân viên sàn ở bốn vai |
| Việc chính | Đọc và tìm dòng trong một vùng dữ liệu |
| Tần suất | mỗi ngày nhiều lần |
| Số bản ghi | hàng trăm trở lên |
| Thiết bị | cả hai |
<!-- UX-SPEC-TEMPLATE>>> -->

## Tệp chạm

- `src/components/candidate/`: `column-kind.ts` (canh lề, bề rộng, mẫu, mật độ), `typed-cell.tsx`, `region-header.tsx`, `region-state.tsx`, `data-region.tsx`, `grid-copy.ts`.
- `src/app/(app)/proto/[slug]/`: `grid-showcase.tsx` và một nhánh trong `page.tsx` cho slug này.
- `tests/grid.test.tsx`, `tests/e2e/grid.spec.ts`.

## Đo

- Vitest: ma trận viết trước kiểu × (canh lề, bề rộng, cách hiện); hai cột cùng kiểu cùng nhãn thì cùng canh lề, cùng bề rộng; hàm mật độ ở hai phía ngưỡng; ô chỉ đọc; đầu vùng; trạng thái vùng; mỗi bài có ca phá thử.
- Playwright ở bốn khổ: lưới thật trên bản mẫu, tìm và «Xoá lọc», chờ tải trễ, trống, lỗi và «Thử lại», chia trang, trang không cuộn ngang, axe sáng và tối.
