# Thiết kế — Bảng hàng thẻ điện thoại (hàng 2b)

## Vấn đề

Đầu chủ và Đầu khách mở Bảng hàng trên điện thoại hôm nay thấy một bảng cuộn ngang: ở 360 chỉ trọn hai cột (Căn, Toà),
giá và trạng thái nằm khuất bên phải (ảnh `cong/hom-nay-360-sang.png`). Người đang ở ngoài chỉ cần tra căn, xem giá, xem
còn bán không rồi mở hồ sơ để gọi hay gửi khách (trang bối cảnh Bảng hàng: bốn việc trên điện thoại). Quỹ hàng đã đổi
bảng thành danh sách thẻ dưới `md` (hàng 32 của Quỹ hàng: `product-grid-4` + ngăn lọc `filter-sidebar-5`).

## Hướng đã chọn

- **Ngưỡng 768.** Dưới 768 px vùng Lưới của Bảng hàng hiện thẻ căn thay cho bảng; từ 768 trở lên giữ nguyên bảng. Cùng
  ngưỡng với hồ sơ toàn màn trên điện thoại và nút «Toàn màn hình» của vùng (chỉ từ 768) — một ngưỡng cho cả họ.
- **Thẻ nằm trong vùng Lưới chung, không dựng danh sách thứ hai.** Vùng (`DataRegion`) nhận thêm một khe «danh sách điện
  thoại»: màn đưa cách vẽ một thẻ, vùng giữ lọc, nhóm, sắp xếp, trạng thái tải/trống/lỗi/không quyền, số dòng và hồ sơ.
  Lọc ở bảng và ở thẻ là cùng một bộ lọc; xoay ngang máy qua ngưỡng không mất lọc. Họ Lưới cấm dựng lưới ngoài khuôn.
- **Chạm thẻ mở hồ sơ căn đã có** (hàng 3, 3a, 3e, 3f): cùng địa chỉ `?ho-so=<id>`, toàn màn trên điện thoại, «Trước/Sau»
  đi theo thứ tự thẻ, «Đóng» hay nút lùi của máy đóng hồ sơ; danh sách thẻ không bị dựng lại nên chỗ đang cuộn giữ
  nguyên và tiêu điểm về đúng thẻ vừa mở (đã thử trên bản bấm được: cuộn 1500 px, mở, lùi → vẫn 1500 px, tiêu điểm ở thẻ).
- **Nhóm theo Toà** giữ trên thẻ: dòng tên toà kèm số căn, như dải đầu chương của `product-grid-4` (Quỹ hàng đổi thành
  dòng nhóm toà).
- **Không sửa trên thẻ.** Sửa giá, trạng thái trên điện thoại là hàng 3d, đứng sau. Thẻ chỉ là một nút mở hồ sơ; hồ sơ mở
  từ thẻ mang đúng bộ nút theo vai (9a, 9b, 9e) như mở từ bảng. Nút «Cột» ẩn trên điện thoại (thẻ không có cột).
- **Tìm** vẫn ở ô ⌘K của thanh trên (2e, 3f): chữ tìm điền vào ô lọc Căn, thẻ hiện đúng các căn khớp.

## Trình lại sau bốn ý của chủ kho (2026-11-14)

Lần trình đầu (thẻ A xếp dọc, thẻ B dòng gọn) chủ kho trả bốn ý: bộ nút chưa hợp điện thoại, cần thấy nhiều căn, tận dụng
không gian, product-grid-4 đưa vào chưa đúng dáng (có ảnh, không ảnh). Lối mới, chủ kho đồng ý hướng và đòi ảnh:

- Thẻ là dáng «ngang gọn» của chính `ListingCard` (đầu hồ sơ giữ dáng xếp dọc): ô vuông 64 px bên trái (ảnh căn khi có —
  hàng 15), mã căn + giá một dòng, nơi + trạng thái, diện tích · phòng ngủ. Mỗi căn 86 px: 7 căn trọn màn đầu ở 360, 8 ở 414
  (trước: 2).
- Dưới 768 danh sách không có khung bao (trước: ba lớp), dùng trọn bề ngang, các căn ngăn bằng vạch.
- Một hàng công cụ dính dưới thanh trên: số dòng; Lọc (kèm số), Nhóm theo Toà, «…» (Lưu góc nhìn) — ba nút 44 px. Bỏ ở điện
  thoại: «Cột», «Toàn màn hình».

## Câu hỏi cho chủ kho (Cổng Phạm vi)

- Hỏi-1 · Căn chưa có ảnh. Ô: giữ ô vuông ghi mã toà (khuyến nghị) · Gọn: bỏ ô, chữ dồn trái.
- Hỏi-2 · Lọc. Nút: nút Lọc mở ngăn đáy, lọc đang chạy thành chip (khuyến nghị) · Hàng ô: hàng ô lọc luôn hiện (luật 2e).
- Hỏi-3 · Khoá ghim cột «Căn» ở bảng máy tính — tách việc nhỏ riêng (khuyến nghị) hay làm trong hàng này.

## Rủi ro đã thấy

- Dữ liệu mẫu của kho chỉ có mã căn bốn ký tự, giá 2,71–8,06 tỷ, không căn cho thuê, không căn thiếu giá. Ảnh cổng dựng
  trên dữ liệu ấy; trường hợp mã dài (14 ký tự), giá trăm tỷ, giá thuê, giá trống được đo bằng bài kiểm với dữ liệu kiểm
  riêng ở khổ 360 (AC-8), không vẽ tay vào ảnh.
- L1 ở 360 chỉ thấy hai ô lọc đầu; ô đang lọc ở cột khuất (Trạng thái) không thấy nếu không cuộn — số «24 / 60 dòng» và
  «Xoá lọc» vẫn báo đang lọc (ảnh `cong/loc-hang-360-sang.png`).

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: mở Bảng hàng trên điện thoại → (lọc theo Hỏi-2) → chạm một thẻ → hồ sơ căn toàn màn → «Trước/Sau» hay «Đóng» /
  nút lùi của máy (điểm ra: danh sách thẻ, đúng chỗ đang cuộn, tiêu điểm ở thẻ vừa mở)
- Biên: không căn nào khớp lọc; nhóm theo Toà; vào từ ô ⌘K với mã căn (một căn → mở thẳng hồ sơ, nhiều căn → thẻ đã lọc);
  vào từ lối tắt trạng thái hay góc nhìn đã lưu; xoay máy qua ngưỡng 768 giữa chừng
- Lỗi & quay lại: tải hỏng → câu lỗi và «Thử lại» của vùng; một phần hỏng → thẻ phần đã tải và dải báo; liên kết tới căn
  không còn trên Bảng hàng → danh sách mở như thường kèm câu báo của 3f

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Bảng hàng dưới 768 (thẻ) | tra và chọn một căn | thanh bên, lối tắt trạng thái, ⌘K, góc nhìn / hồ sơ căn |
| Hồ sơ căn toàn màn (có sẵn, hàng 3) | đọc một căn, hỏi đầu chủ | thẻ / về thẻ |
| Bảng hàng từ 768 (bảng, không đổi) | xem, lọc, sửa như Sheet | như hôm nay |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-the-co-dong | Bảng hàng < 768 | hàng công cụ dính (số dòng; Lọc, Nhóm theo Toà, «…»); thẻ ngang gọn, không khung | chạm thẻ, lọc |
| ST-the-dang-loc | Bảng hàng < 768 | «x / 60 dòng», nút Lọc mang số, chip mỗi cột đang lọc, «Xoá lọc», chỉ thẻ khớp | chạm thẻ, bỏ chip, xoá lọc |
| ST-the-khong-khop | Bảng hàng < 768 | lọc ở nguyên chỗ; «Không có dòng nào khớp» và «Xoá lọc» | sửa ô lọc, xoá lọc |
| ST-the-nhom | Bảng hàng < 768 | dòng tên toà + số căn trên mỗi nhóm thẻ | chạm thẻ |
| ST-the-loading | Bảng hàng < 768 | khung chờ của vùng, «Huỷ» sau 10 giây | chờ / huỷ |
| ST-the-empty | Bảng hàng < 768 | «Sàn chưa có căn nào đang chào trên Bảng hàng.» + «Tải lại» | tải lại |
| ST-the-error | Bảng hàng < 768 | câu lỗi của vùng + «Thử lại» | thử lại |
| ST-the-partial | Bảng hàng < 768 | dải báo một phần + thẻ đã tải | thử lại |
| ST-the-forbidden | Bảng hàng < 768 | câu không đủ quyền của vùng | về Hôm nay |
| ST-ho-so-tu-the | Hồ sơ căn | hồ sơ toàn màn của hàng 3, bộ nút theo vai | Trước/Sau, Đóng, Hỏi đầu chủ |
| ST-bang-768 | Bảng hàng ≥ 768 | bảng như hôm nay | như hôm nay |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Ngưỡng: dưới 768 px thẻ, từ 768 bảng; đổi khổ qua ngưỡng giữ lọc, nhóm, sắp xếp.
- Cả thẻ là một nút, tên đọc «Căn <mã>»; Tab đi qua từng thẻ; Enter hay Space mở hồ sơ.
- Đóng hồ sơ: chỗ cuộn giữ nguyên, tiêu điểm về thẻ vừa mở.
- Không sửa trên thẻ, không «…» trên thẻ (Bảng hàng không có việc trên dòng); dưới 768 không «Cột», không «Toàn màn hình»; hàng công cụ dính dưới thanh trên khi cuộn.

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| DataRegion | mở rộng | thêm khe danh sách điện thoại, giữ một bộ lọc, nhóm, trạng thái, hồ sơ |
| ListingCard | mở rộng | thêm dáng «ngang gọn» theo `product-grid-4` (sổ khối `the-can`); đầu hồ sơ giữ dáng xếp dọc |
| ColumnFilterCell | dùng | cùng ô lọc dưới tiêu đề cột |
| Sheet đáy (ngăn lọc, «…») | dùng | `src/components/ui/sheet.tsx` |
| RecordPanel | dùng | hồ sơ toàn màn của hàng 3 |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: (ii) chọn từ danh sách — họ Lưới đã là danh sách – chi tiết (`design/patterns/luoi.md`); Quỹ hàng hàng 32 đổi bảng
thành thẻ dưới `md` và giữ hồ sơ toàn màn; không có khuôn khả dĩ thứ hai.
### 7. Thẻ việc

Năm trường để máy so với `nhan_viec` của nhóm trong bản đồ khuôn (`design/patterns/<nhóm>.md`) — kho không khai bản đồ thì vẫn điền, đó là căn cứ chọn khuôn IA ở mục 6.

| Trường | Giá trị |
|---|---|
| Ai dùng | Đầu chủ, Đầu khách |
| Việc chính | Tra một căn trên Bảng hàng khi đang ở ngoài, xem giá và trạng thái, mở hồ sơ |
| Tần suất | mỗi ngày nhiều lần |
| Số bản ghi | hàng trăm trở lên |
| Thiết bị | điện thoại |
<!-- UX-SPEC-TEMPLATE>>> -->
