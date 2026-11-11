# Thiết kế: Bảng hàng bản đọc (hàng 2)

## Mục tiêu

Đầu chủ mở Bảng hàng (`/inventory`) và thấy 60 lần chào mẫu của sàn mẫu Ocean Park trên Lưới dùng chung: đủ trạng thái
vùng, ở bốn khổ 360, 414, 1024, 1440. Đây là màn Lưới thật đầu tiên, nên khi tệp chứng minh đạt đủ ma trận trạng thái
thì nó thành màn mẫu của họ Lưới (`design/patterns/luoi.md`: «Màn: inventory»), và các màn Lưới sau so cạnh nó.

Bản đọc: không sửa ô (B4), không hồ sơ căn cạnh bảng (hàng 3), không lọc theo cột, không đọc cơ sở dữ liệu, chưa bắt
đăng nhập (hàng 8 để màn đọc dữ liệu thật bắt).

## Cách dựng

- **Dữ liệu.** Trang `src/app/(app)/inventory/page.tsx` ghép dữ liệu mẫu của hàng 1 qua cửa công khai của hai mô-đun:
  căn từ `catalog` (`sampleUnits`, `subdivisionNameOf`), lần chào và liên kết căn từ `listings`
  (`buildSampleListings`, `SAMPLE_COMPANY`). Ghép ở trang vì `listings` không được phụ thuộc `catalog`
  (`architecture/modules.yaml`: `depends_on: []`) — không thêm phụ thuộc mô-đun.
- **Vùng.** Thành phần `InventoryGrid` ở `src/modules/listings/ui/` nhận danh sách cặp (lần chào, căn) và dựng
  `DataRegion` của khuôn Lưới; nó chỉ khai cột, dòng, tên vùng, câu trống và trạng thái — không tự dựng hành vi (bài rào
  của 1e). Hàm thuần `inventoryRows` đổi cặp thành dòng Lưới, kiểm được không cần trình duyệt.
- **Cột** (tám, theo thứ tự): Căn (`Listing.unitNumber`) · Toà (`Listing.buildingName`) · Khu
  (`Listing.subdivisionName`) · Trạng thái (`Listing.standardStatus`) · Giá chào (`Listing.listPrice`) · Diện tích
  (`Unit.livingArea`) · Phòng ngủ (`Unit.bedroomsTotal`) · Xác nhận lúc (`Listing.lastConfirmedAt`). Kiểu, canh lề, bề
  rộng, mật độ đến từ bảng kiểu đã sinh, màn không chọn. Tên khu dài («Vinhomes Ocean Park 2 – The Empire») bị cắt
  trong cột chữ 18ch ở mọi khổ: đó là trạng thái «chữ dài» thật, không cần dữ liệu giả.
- **Nhãn.** Căn, Toà, Khu (khái niệm Subdivision, nhãn đã có, tránh «Dự án») đã có trong `ontology/labels.yaml`. Năm nhãn cột còn lại chưa có — thêm năm khái niệm loại
  `field` (chỉ thêm dòng) rồi `make gen` (Hỏi-2, đã hỏi giám sát K-1111-15).
- **Cỡ trang.** `design/behaviors.md` để «Chia trang — chốt ở lát cắt Bảng hàng». Khuyến nghị 25 dòng một trang (Hỏi-1,
  đã hỏi giám sát K-1111-14): với 60 lần chào và cỡ 50, bài «tìm» của bộ bài sinh từ sổ màn không tìm được chuỗi thử
  (cần khớp quá một trang mà không khớp hết), nên đỏ «không đủ dữ liệu» dù màn đúng. Với 25 thì có chuỗi đạt (đã thử
  bằng chính hàm chọn chuỗi của bộ bài). Bài «tìm» sửa để đọc cỡ trang thật của vùng thay cho số 50 ghi cứng; mọi ca phá
  giữ nguyên.
- **Trạng thái vùng.** Ở bản phát triển và bản chạy thử, trang nhận `?state=loading|empty|error|partial|forbidden` như
  bản mẫu Lưới — đây là cách bộ bài sinh từ sổ màn bật từng trạng thái trên màn thật (`tools/e2e_templates/recipes.ts`).
  Ở bản thật (`NODE_ENV=production`) tham số bị bỏ qua và vùng luôn ở trạng thái có dữ liệu. «Thử lại» ở lỗi và một phần
  hỏng đưa vùng về có dữ liệu.
- **Bộ bài sinh từ sổ màn.** Gỡ `inventory` khỏi danh sách «chưa có vùng» của bộ công thức; bộ vùng (bảy trạng thái kèm
  ca phá) và bộ khung (h1, không cuộn ngang, không lỗi trình duyệt, axe sáng tối) chạy trên Bảng hàng như trên đích hiệu
  chuẩn. Tệp nằm trong `tools/`, nên hàng là T3.
- **Màn mẫu.** Tệp chứng minh `_acceptance/bang-hang-ban-doc/chung-minh-man.md` theo lối «màn mẫu mới»: ma trận đủ
  mười một trạng thái của `design/states.md` (bảy đạt bằng bài kiểm có thật, bốn không áp có lý do) và bảng khối. Đổi
  `Màn: chưa có` thành `Màn: inventory` và gỡ ngoại lệ của trang Bảng hàng trong `design/patterns/luoi.md`.
- **Tự kiểm phép kiểm ma trận.** Lưới chứng minh màn (1c) im lặng cho qua ở ba chỗ: không đọc được bảng trạng thái (ma
  trận rỗng là «đủ»), và hồ sơ ghi trạng thái hợp đồng lạ (bỏ qua không chấm). Một tệp kiểm mới chứng rằng trên kho
  thật lưới đọc đủ mười một trạng thái, hợp đồng này nằm trong diện được chấm, và xoá một dòng ma trận của Bảng hàng thì
  lưới đỏ gọi tên trạng thái thiếu.

## Vai × Màn

Bản khai vai (`ontology/roles.yaml`) nói Quản trị sàn «không thấy hàng theo mặc định». Hôm nay chưa có vai thật của người
đăng nhập trong khung; vùng có trạng thái «không đủ quyền» sẵn, nối vai thật vào vùng là bảng quyền của hàng 9a.

## Ngoài phạm vi

Sửa ô, hồ sơ căn cạnh bảng, lọc và sắp xếp theo cột, chọn dòng, nút «Thêm dòng» hay nhập tệp, dữ liệu thật của sàn,
bắt đăng nhập, gắn vai thật, màn Đã gửi.

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: thanh bên «Bảng hàng» → đầu màn «Bảng hàng» → vùng nêu tên và «60 dòng» → đọc 8 cột theo kiểu → gõ mã căn
  vào ô tìm → dòng lọc ngay qua mọi trang, số dòng thành «k / 60 dòng» (điểm ra: căn cần tìm).
- Biên: sàn chưa có căn nào → câu vì sao trống và việc làm tiếp; tìm không ra → «Xoá lọc»; quá 25 dòng → chia trang;
  cột rộng hơn khổ → lưới dày, cuộn ngang trong vùng, trang không cuộn ngang; tên khu dài → cắt, đọc đủ khi rê hay
  tới bằng phím.
- Lỗi & quay lại: tải vùng hỏng → câu ba phần + «Thử lại», thanh bên vẫn dùng được; tải hỏng một phần → các dòng đã tải
  vẫn đọc, tìm được, băng nói phần chưa tải + «Thử lại»; không đủ quyền → câu nói rõ, không dòng, không số dòng.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Bảng hàng `/inventory` | Đọc và tìm các căn sàn đang chào | thanh bên / chưa ra đâu (hồ sơ căn là hàng 3) |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-inventory-du-lieu | Bảng hàng | đầu vùng «Bảng hàng» + «60 dòng» + ô tìm + 8 cột, 25 dòng một trang | đọc, tìm, sang trang |
| ST-inventory-cho-tai | Bảng hàng | dưới 1 giây không gì; từ 1 giây dòng khung chờ đúng 8 cột | chờ |
| ST-inventory-trong | Bảng hàng | «Chưa có dữ liệu ở đây» + vì sao: sàn chưa có căn nào đang chào | chờ đầu chủ nhập hàng (nhập là hàng sau) |
| ST-inventory-khong-ra | Bảng hàng | «Không có dòng nào khớp» + «Xoá lọc» | xoá lọc |
| ST-inventory-loi | Bảng hàng | câu ba phần + «Thử lại» trong vùng | thử lại |
| ST-inventory-mot-phan | Bảng hàng | các dòng đã tải + băng nói phần chưa tải + «Thử lại» | thử lại |
| ST-inventory-chu-dai | Bảng hàng | tên khu dài bị cắt, đọc đủ khi rê hay focus | rê, tab |
| ST-inventory-khong-quyen | Bảng hàng | câu không đủ quyền, không dòng, không số dòng, không ô tìm | hỏi quản trị sàn |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Canh lề, bề rộng, mật độ, định dạng, ô chỉ đọc theo `design/behaviors.md`; màn chỉ khai cột.
- Chia trang 25 dòng (chốt ở hàng này, ghi vào `design/behaviors.md`); tìm lọc trên mọi dòng, không chỉ trang đang hiện.
- Trang không cuộn ngang ở 360, 414, 1024, 1440.

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| DataRegion, typedColumn (candidate) | dùng | khuôn Lưới của họ, giữ trạng thái và hành vi |
| PageHeader (templates) | dùng | đầu màn có sẵn |
| InventoryGrid, inventoryRows (listings/ui) | tạo | chỉ khai cột và dòng của Bảng hàng |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: Bảng hàng là nửa danh sách; nửa chi tiết (hồ sơ căn cạnh bảng) là hàng 3. Khuôn hiển nhiên, đã khai ở họ Lưới, không tra mẫu ngoài.

### 7. Thẻ việc

| Trường | Giá trị |
|---|---|
| Ai dùng | Đầu chủ |
| Việc chính | Xem và tìm các căn sàn đang chào thay cho bảng tính |
| Tần suất | mỗi ngày nhiều lần |
| Số bản ghi | hàng trăm trở lên |
| Thiết bị | cả hai |
<!-- UX-SPEC-TEMPLATE>>> -->
