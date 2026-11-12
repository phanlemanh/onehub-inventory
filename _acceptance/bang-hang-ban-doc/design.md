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
- **Cột** (tám, theo thứ tự): Căn (`Listing.unitNumber`) · Toà (`Listing.buildingName`) · Dự án
  (`Listing.subdivisionName`) · Trạng thái (`Listing.standardStatus`) · Giá chào (`Listing.listPrice`) · Diện tích
  (`Unit.livingArea`) · Phòng ngủ (`Unit.bedroomsTotal`) · Xác nhận lúc (`Listing.lastConfirmedAt`). Kiểu, canh lề, bề
  rộng, mật độ đến từ bảng kiểu đã sinh, màn không chọn. Tên khu dài («Vinhomes Ocean Park 2 – The Empire») bị cắt
  trong cột chữ 18ch ở mọi khổ: đó là trạng thái «chữ dài» thật, không cần dữ liệu giả.
- **Nhãn.** Căn, Toà, Khu (khái niệm Subdivision, nhãn đã có, tránh «Dự án») đã có trong `ontology/labels.yaml`. Năm nhãn cột còn lại chưa có — thêm năm khái niệm loại
  `field` (chỉ thêm dòng) rồi `make gen` (Hỏi-2, đã hỏi giám sát K-1111-15).
- **Đọc như Sheet (chủ kho đổi trước Cổng Phạm vi).** Không chia trang: lưới cuộn liền một mạch bằng bảng cuộn ảo ReUI đã
  cài (`DataGridTableVirtual`, giữ nguyên thành phần), tiêu đề cột đứng yên khi cuộn dọc, cột số dòng (đầu cột «#») cùng
  Căn và Toà ghim bên trái khi cuộn ngang, chân bảng ghi số dòng. Mật độ dòng giữ luật cũ của khuôn (dày khi cột tràn).
  Bài «tìm» của bộ bài sinh từ sổ màn đọc mọi dòng bằng lăn chuột qua khung cuộn và chọn chuỗi theo khung đầu. «Dùng tay
  như Sheet» (phím mũi tên, bôi vùng, sắp, lọc, nhóm, ẩn hiện cột) là hàng sau; ngưỡng 5.000 dòng đo ở hàng nối dữ liệu
  thật.
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

## Từ Quỹ hàng

Nguồn (chỉ đọc, không chép mã): kho Quỹ hàng commit `1729b11f` — `docs/design/vo-va-ia.md` §2 (dòng Bảng hàng máy tính và
Bảng hàng thẻ điện thoại), `design/patterns/bang-hang.md`, ADR-0004 (lưới dữ liệu ReUI qua bài thử 5.000 dòng), hồ sơ đã
ký `bang-hang-kieu-sheet` (hàng 14) và `bang-hang-dang-the` (hàng 32).

- **Khối đích Quỹ hàng đã chọn.** Máy tính: `data-grid-editing-6` (bảng kiểu Sheet: hàng lọc theo cột bật khi cần, dòng
  tổng ở chân, sửa trên ô), nhóm dòng toà → loại căn theo `data-grid-grouping-2`, bố cục danh sách–chi tiết (hồ sơ căn là
  cột kéo chia cạnh bảng). Điện thoại: bảng thẻ `product-grid-4` (thẻ ngang: ảnh trái, mã căn + giá, ba thông số Diện
  tích · Phòng ngủ · Hướng) kèm ngăn lọc `filter-sidebar-5` thành ngăn kéo đáy, cùng địa chỉ `/inventory`.
- **Bản đọc MVP này giữ:** đọc trên lưới dữ liệu ReUI (cùng thành phần ADR-0004 đã đo), giá dạng «x,xx tỷ», trạng thái là
  nhãn có màu, tìm mã căn, đủ trạng thái tải · trống · tìm không ra · lỗi, một địa chỉ `/inventory`.
- **Bỏ ở hàng này, vì sao:** lọc theo từng cột, nhóm toà → loại căn, dòng tổng, góc nhìn lưu — lộ trình kho này chưa có
  hàng cho chúng và hàng 2 là bản đọc; sửa trên ô — hàng B4; hồ sơ căn cạnh bảng — hàng 3; đọc từ kho trên máy (lọc
  không gọi mạng) — luật kho: chưa giữ dữ liệu sàn trên máy trước khi xong MVP; mười sáu cột — dữ liệu mẫu hàng 1 chưa có
  loại căn, phí, nội thất, pháp lý, tài chính, mức đủ; bảng thẻ điện thoại — Hỏi-5.
- **Địa lý rộng → hẹp (chủ kho nêu 2026-11-12, sau Cổng Phạm vi).** Đầu chủ làm việc theo Dự án → Phân khu → Toà → Tầng,
  Sheet chia tab theo dự án, lọc bằng cột. Quỹ hàng: danh mục «khu (`SubdivisionName`) → toà / phân khu → trục / dãy → căn»
  (`docs/product/tham-chieu.md:67`); mỗi khu một tab Sheet (`docs/product/ghi-chep/2026-10-28-desktop-app.md:13`); góc
  nhìn đã lưu thay các tab (`docs/product/tham-chieu.md:75`); đổi `project` thành `SubdivisionName` trong lõi
  (`_acceptance/khu-va-loai-hinh/contract.md`, AC-1); «khu phụ trách» là khái niệm khác, do sàn tự đặt (`docs/adr/0006-vai-khu-va-loi-moi.md:21`);
  hàng chưa có mã căn chỉ biết toà (`docs/adr/0026-gan-ma-can.md`). Hàng 2 giữ: dòng xếp theo khu → toà → tầng → trục.
  Hàng 2 không làm: cây dự án → toà ở cột thứ hai, lọc theo cột địa lý, cấp phân khu — là hàng sau, chờ chủ kho quyết.

- **Khuôn Lưới (hàng 1b) khác `data-grid-editing-6` ở đâu:** cùng lưới ReUI bên dưới. Khuôn Lưới có đầu vùng tên + số
  dòng, một ô tìm chung, chia trang và bảy trạng thái vùng đã có bài kiểm; `data-grid-editing-6` có hàng lọc theo cột,
  dòng tổng, số thứ tự dòng, ô chọn, nút cột · cài đặt · xuất, cuộn liền thay chia trang, và không có trạng thái vùng.
  Dựng theo nó thì phải đổi khuôn đã ký cho mọi màn Lưới (Hỏi-4).

## Xếp khung theo data-grid-editing-6 (Hỏi-4 đã trả lời)

Chủ kho, «Đúng ý.»: giữ khuôn Lưới của kho (mọi trạng thái vùng và bài kiểm), xếp khung viền, thanh công cụ và chân bảng
theo `data-grid-editing-6`, chưa thêm chức năng. Thành phần giữ nguyên như ReUI giao (`Frame`, `DataGrid`); mỗi vùng của
khối lấy hay bỏ:

| Vùng của khối | Lấy / bỏ | Vì sao |
|---|---|---|
| Khung viền bao trọn vùng, dải đầu mang tên vùng | lấy | gom tên, công cụ, bảng, chân vào một khối nhìn được như bảng tính |
| Dòng tóm tắt dưới tên (số cần xem, tổng tiền) | bỏ | bản đọc chưa có số tóm tắt nào ngoài số dòng |
| Thanh công cụ: ô tìm bên trái, số dòng ngay cạnh | lấy | đúng việc tìm mã căn; số dòng đứng cạnh ô tìm như khối |
| Hoàn tác, làm lại | bỏ | bản đọc không sửa |
| Nút Lọc, Cột, Cài đặt, Xuất | bỏ | chưa có chức năng (lọc, chọn cột là hàng sau) |
| Cột số thứ tự dòng | lấy | «đọc như Sheet» |
| Ô chọn dòng, chữ cái tên cột | bỏ | không chọn dòng, không công thức |
| Chân bảng: dòng tổng | bỏ | chưa có dòng tổng |
| Chân bảng trong khung, có viền trên | lấy | ghi số dòng như chân khối («đọc như Sheet»: cuộn liền, không chia trang) |
| Thanh gợi ý «chọn ô để xem» | bỏ | không chọn ô |
| Cuộn liền thay chia trang | lấy | chủ kho đổi hàng 2 thành «đọc như Sheet» |

Bề rộng: cột Toà rộng 15 ký tự ở mọi khổ vì tên toà mẫu của Ocean Park 2, 3 là «[MAU] Toà E1» (nhãn mẫu bắt buộc), nằm ở
trang 3; bề rộng tính trên mọi dòng nên không nhảy khi sang trang. Tên khu dài bị cắt ở 1440 chỉ khi không còn chỗ thừa:
khi bảng hẹp hơn vùng, chỗ thừa chia cho cột đang cắt chữ trước (đến đủ chữ); ở 1440 tám cột đã dùng hết bề ngang nên tên
dài «Vinhomes Ocean Park 2 – The Empire» vẫn cắt, đọc đủ khi rê hay tới bằng phím (trạng thái chữ dài).

Bản điện thoại (Hỏi-5 đã trả lời, «Đúng ý.»): thẻ điện thoại là một hàng riêng sau hàng 3; hàng này trên điện thoại là
lưới cuộn ngang trong vùng.

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
- Biên: sàn chưa có căn nào → câu vì sao trống và việc làm tiếp; tìm không ra → «Xoá lọc»; nhiều dòng → cuộn liền trong khung, tiêu đề đứng yên;
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
| ST-inventory-du-lieu | Bảng hàng | tên vùng + ô tìm + cột số dòng và 8 cột cuộn liền, chân bảng «60 dòng» | đọc, tìm, cuộn |
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
- Cuộn liền, không chia trang; tiêu đề và cột số dòng, Căn, Toà đứng yên (ghi vào `design/behaviors.md`); tìm lọc trên mọi dòng.
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
