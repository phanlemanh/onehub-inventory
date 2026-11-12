# Thiết kế — Hồ sơ căn cạnh Bảng hàng, thẻ căn trên điện thoại (hàng 3)

Ngày 2026-11-12 · Dãy D, đợt «nen» · Hạng T2 · Hồ sơ `_acceptance/ho-so-can/`

## Ý định

Đầu chủ trên máy tính bấm mã một căn ở Bảng hàng và thấy hồ sơ căn nổi trên phần phải của bảng (ngăn nổi), rồi đi lần lượt các căn bằng «Trước» và
«Sau» mà không đóng hồ sơ. Trên điện thoại, chạm mã căn thì hồ sơ mở toàn màn, đầu màn là thẻ căn. Hồ sơ và thẻ là hai dạng
xem của cùng một căn: cả hai đọc chung một mô hình dựng từ dòng của bảng, nên không bao giờ lệch nhau.

**Chủ kho chốt ở Cổng Phạm vi (2026-11-12): «Lấy B có ghim».** Ngăn nổi (lối B) là cách chung của cả ứng dụng để xem chi
tiết một dòng (Bảng hàng, Liên hệ, Đã gửi, Hôm nay, Thành viên) và là chỗ của lớp trò chuyện với AI sau này. Ba điều kiện:
ngăn không che thanh trên và thanh công cụ của bảng; ngăn không khoá bảng; có nút ghim biến ngăn thành cột khi làm lâu. Bên
phải chỉ có một chỗ: hồ sơ và AI là hai thẻ của cùng một ngăn, không chồng lên nhau. Độ cao: chủ kho chốt «Trừ thanh trên» — ngăn chạy từ ngay dưới thanh trên của App Shell tới đáy màn hình (che phần phải
của tên màn và thanh công cụ; nút của thanh công cụ nên đứng sát ô tìm); toàn màn thì ngăn cao hết màn. Hàng 3 dựng ngăn nổi với hai điều kiện
đầu; nút ghim (kèm kéo đổi rộng) và lớp AI là hàng sau.

## Từ Quỹ hàng

Nguồn: `docs/tri-thuc/wiki/chu-de/ho-so-can.md`, `docs/tri-thuc/wiki/chu-de/bang-hang.md`; trong kho Quỹ hàng (commit
`1729b11f`, chỉ đọc): `design/patterns/ho-so-can.md`, `docs/adr/0024-he-bo-cuc.md` (sửa đổi 05/11),
`docs/design/danh-gia-ngan-chi-tiet-can.md`.

| Quỹ hàng đã chọn | Hàng này giữ | Hàng này bỏ | Vì sao |
| --- | --- | --- | --- |
| Cạnh bảng là cột kéo chia `app-shell-11`, 38%, kéo 28–50% (lối C, chủ kho Quỹ hàng chọn 05/11, bỏ ngăn nổi `sheet-9` vì che nút) | Bảng vẫn bấm được, thanh công cụ và thanh trên không bị che, đi Trước/Sau không đóng | Cột đẩy bảng và kéo chia — thay bằng ngăn nổi `sheet-9` từ dưới thanh trên tới đáy màn hình, cột thành nút ghim ở hàng sau | Chủ kho chốt «Lấy B có ghim»: một cách chung cho mọi màn và lớp AI; điều kiện «không che thanh» vá đúng lỗi Quỹ hàng gặp |
| Ruột hồ sơ `solution-crm-4` | Đầu hồ sơ (mã căn, trạng thái), giá nổi bật, danh sách trường có nhãn | Chọn giai đoạn, xác suất thắng, đội, việc kế, tài chính, nút thắng thua | Hàng 3 chỉ đọc; các vùng kia là của bài toán bán hàng khác |
| Thân điện thoại `product-detail-5`, thẻ trong danh sách `product-grid-4` | Thẻ căn theo ô của `product-grid-4`: mã căn và giá một dòng, nơi và trạng thái, ba thông số cạnh nhau | Ảnh bìa, hướng, giá kèm điều kiện phí, «Hỏi đầu chủ», nút chính dính đáy | Ảnh là G4, chủ nhà G1, Sẵn sàng bán G5 (hàng sau); nhãn «Hướng» chưa có trong bảng nhãn |
| Hai thân từ một mô hình thuần (`mo-hinh.ts`) | Một mô hình `listingView` cho thẻ và hồ sơ | Lớp phủ quyền bốn cờ | Chưa có phần nội bộ nào trong hồ sơ hàng này |
| Có địa chỉ riêng `/inventory?unit=<mã>`, lùi giữ lọc và chỗ cuộn | Địa chỉ riêng `?ho-so=<id>` của khung dùng chung (hàng 1e), nút lùi đóng hồ sơ | Trang toàn màn riêng `/units/<mã>` | Một căn một hồ sơ; trang riêng chưa có việc nào cần |
| Chế độ cuộc gọi trong hồ sơ | — | Bỏ | MVP chưa xác nhận (trang Hồ sơ căn ghi «chưa xác nhận») |

Bài học giữ: «mở hồ sơ cạnh bảng chỉ còn 5 trong 15 cột, giá khuất» (`bang-hang.md`). Hàng này đo số cột còn thấy ở 1024
và 1440 trên bản chạy (bảng dưới) và đặt giá lên đầu hồ sơ để giá không bao giờ khuất.

## Sống chung với hàng 2a (dãy K, đã thống nhất qua tin K-1211-9)

- Bấm chuột vào một ô chỉ chọn ô (như Sheet). Mở hồ sơ bằng bấm mã căn hoặc Enter trên dòng; Enter gọi đúng một lối «mở
  dòng» của khuôn Lưới (2a dựng), hồ sơ nối vào lối ấy. Hàng 4 sau này mới đổi Enter thành sửa ô ở cột sửa được.
- Khi hồ sơ mở, mũi tên vẫn đi ô trong lưới (của 2a); Esc trong hồ sơ đóng hồ sơ và trả tiêu điểm về mã căn của dòng.
- Khi hồ sơ mở, cột số dòng, Căn, Toà vẫn đứng yên; bảng cuộn ngang trong phần còn lại, không tự ẩn cột (người tự ẩn bằng nút
  Cột của 2a).
- Toàn màn hình của Bảng hàng (hàng 2a, chủ kho chốt): khi hồ sơ đang mở thì toàn màn giữ ngăn hồ sơ, không tự đóng; Esc
  lúc toàn màn do trình duyệt nhận để thoát toàn màn trước, lần Esc sau mới đóng hồ sơ (thống nhất với dãy K, tin K-1211-13).
- Số cột còn thấy trọn (không bị ngăn che) khi hồ sơ mở, đo trên bản chạy với 60 căn mẫu (App Shell hai cột, bảng tám cột cộng cột số dòng;
  kịch bản đo đếm đầu cột nằm trọn bên trái mép ngăn):

| Khổ | Hồ sơ đóng | Hồ sơ mở | Giá chào khi hồ sơ mở |
| --- | --- | --- | --- |
| 1440 | 9 / 9 (#, Căn, Toà, Dự án, Trạng thái, Giá chào, Diện tích, Phòng ngủ, Xác nhận lúc) | 5 (#, Căn, Toà, Dự án, Trạng thái) | khuất trong bảng (cuộn ngang tới), luôn ở đầu hồ sơ |
| 1024 | 5 (#, Căn, Toà, Dự án, Trạng thái) | 3 (#, Căn, Toà) | khuất trong bảng, luôn ở đầu hồ sơ |

## Đặc tả UX

<!-- <<<UX-SPEC-TEMPLATE -->
### 1. Luồng

- Suôn sẻ: Bảng hàng → bấm mã căn (hoặc Enter trên dòng) → hồ sơ nổi trên phần phải bảng, tiêu điểm vào tên hồ sơ → «Sau» sang căn kế
  theo thứ tự bảng đang hiện → Esc hoặc «Đóng» (điểm ra: bảng, tiêu điểm ở mã căn của căn vừa xem).
- Biên: căn cuối danh sách thì «Sau» tắt, căn đầu thì «Trước» tắt; tìm làm dòng đang mở biến khỏi bảng thì hồ sơ vẫn
  hiện căn ấy và cả «Trước» lẫn «Sau» tắt; căn chưa có giá, diện tích hay phòng ngủ thì ô ấy hiện «—».
- Lỗi & quay lại: địa chỉ mang id không có (`?ho-so=xyz`) → không mở gì, bảng bình thường; nút lùi của trình duyệt đóng hồ
  sơ, tới lần lùi kế mới rời trang.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Bảng hàng có hồ sơ mở (máy tính) | xem một căn mà vẫn thấy và dùng bảng | Bảng hàng / Bảng hàng |
| Hồ sơ toàn màn (điện thoại) | xem một căn, đầu màn là thẻ căn | Bảng hàng / Bảng hàng |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-ho-so-dong | Bảng hàng | bảng đủ rộng, không ngăn hồ sơ | bấm mã căn |
| ST-ho-so-mo | Bảng hàng | ngăn nổi hai phần năm bên phải, từ dưới thanh trên tới đáy màn hình: thẻ căn + tám trường | Trước / Sau / Đóng, hoặc tiếp tục dùng bảng |
| ST-ho-so-dau-cuoi | Bảng hàng | «Trước» (căn đầu) hay «Sau» (căn cuối) tắt | đi chiều kia hoặc Đóng |
| ST-ho-so-thieu-du-lieu | Bảng hàng | ô thiếu hiện «—», không khoảng trống | không gì — đọc tiếp |
| ST-ho-so-id-la | Bảng hàng | không mở hồ sơ | bấm mã căn khác |
| ST-ho-so-dien-thoai | Hồ sơ toàn màn | toàn màn, đầu là thẻ căn, dưới là tám trường | Trước / Sau / Đóng |
| ST-ho-so-vung-khong-co-dong | Bảng hàng | chờ tải, lỗi, trống, không đủ quyền: không có mã căn để mở, hồ sơ không hiện | theo trạng thái vùng |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Từ 768 px: ngăn nổi bên phải từ dưới thanh trên tới đáy màn hình, không giữ tiêu điểm (bảng vẫn trong thứ tự Tab); mở từ trạng thái đóng thì tiêu điểm vào tên hồ
  sơ; đi «Trước»/«Sau» giữ tiêu điểm tại nút. Dưới 768 px: toàn màn, giữ tiêu điểm trong hồ sơ tới khi đóng.
- Esc trong hồ sơ đóng hồ sơ; Esc trong lưới là của hàng 2a.
- Giá trị mỗi trường hiện bằng đúng cách hiện của ô bảng (tiền «x,xx tỷ», m², huy hiệu trạng thái).

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| RecordPanel (khung hồ sơ dùng chung, hàng 1e) | mở rộng | từ 768 px nổi bên phải từ dưới thanh trên tới đáy màn hình, không khoá bảng; giữ toàn màn trên điện thoại; đổi ở mọi nơi dùng |
| DataRegion | mở rộng (chỉ chỗ đặt ngăn) | gắn ngăn hồ sơ; ngăn tự đo chỗ đứng theo thanh trên và vùng làm việc |
| Frame, FramePanel, Button, Badge | dùng | thành phần nhà cung cấp |
| ListingCard (thẻ căn) | ghép | xếp theo ô `product-grid-4`, từ TypedCell và chữ |
| ListingRecordBody (ruột hồ sơ) | ghép | thẻ căn + danh sách trường theo `solution-crm-4` |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: đã có khảo sát của Quỹ hàng (`docs/design/danh-gia-ngan-chi-tiet-can.md` mục 3: Smartsheet, Salesforce Split View,
Material list-detail, Airtable, Notion, ReUI 678 khối) — việc làm lâu cạnh bảng thì đứng cạnh, xem nhanh thì nổi; chủ kho chốt nổi làm mặc định và ghim thành cột cho việc làm lâu (hàng sau); điện thoại thì hai màn
chồng.

### 7. Thẻ việc

| Trường | Giá trị |
| --- | --- |
| Ai dùng | Đầu chủ |
| Việc chính | Xem một căn cạnh bảng và đi lần lượt các căn mà vẫn dùng được bảng |
| Tần suất | mỗi ngày nhiều lần |
| Số bản ghi | hàng trăm trở lên |
| Thiết bị | cả hai |
<!-- UX-SPEC-TEMPLATE>>> -->

## Quét không gian tiêu chí (Zwicky)

Ngữ cảnh: chân sản phẩm `[SUY-TỪ-REPO: docs/tri-thuc/wiki/chu-de/ho-so-can.md]`; chân ngành `[NGÀNH: Smartsheet record
detail panel, Salesforce Split View, Airtable record detail, Material list-detail]` theo khảo sát có nguồn của Quỹ hàng.

- Trục A · khổ: 1440 | 1024 | 414 | 360 `[SUY-TỪ-REPO: design/patterns/luoi.md]`
- Trục B · lối mở và đóng: bấm mã căn | Enter (2a dựng lối, hàng này nối) | địa chỉ trực tiếp | nút lùi | Esc | «Đóng»
  `[SUY-TỪ-REPO: design/behaviors.md]`
- Trục C · trạng thái hồ sơ: đóng | mở | đi Trước/Sau | đầu/cuối | id lạ | dòng bị tìm lọc mất | vùng không có dòng
  `[CE: ngành Airtable, Smartsheet — đi trước sau không đóng ngăn]`
- Trục D · dữ liệu căn: đủ | thiếu giá | thiếu diện tích/phòng ngủ | cho thuê `[SUY-TỪ-REPO: src/modules/listings/sample.ts]`

Core (vào hợp đồng): A×C ở 1440/1024 (ngăn nổi không che thanh, bảng dùng được, cột ghim, số cột đo được); A×C ở 414/360 (toàn màn, thẻ
đầu màn); B địa chỉ + lùi; B Esc/Đóng trả tiêu điểm; C Trước/Sau theo thứ tự đang hiện, đầu/cuối; C id lạ; D thiếu dữ liệu;
thẻ và hồ sơ cùng mô hình; khung dùng chung không vỡ ở chỗ khác; axe sáng/tối khi hồ sơ mở.

Later: nút ghim biến ngăn thành cột, kéo đổi rộng, lớp trò chuyện với AI (chủ kho chốt «B có ghim», hàng sau); Enter mở dòng (2a dựng lối, nối khi 2a gộp — hàng ký sau chấm lại); kéo đổi rộng (Hỏi-2); ảnh bìa (G4); hướng (thiếu
nhãn); giá kèm điều kiện phí (C1).

Never: trang toàn màn riêng `/units/<mã>` ở MVP — một căn một hồ sơ, chưa có việc cần; tự ẩn cột khi hồ sơ mở — phá thói
quen «thấy hết» và giành việc của nút Cột (2a).

Ngăn nổi trước khi vá (cách khung dùng chung đang dựng, `evidence/ban-bam/loi-b-1024-sang.png`) phủ từ mép trên màn hình,
che số dòng cạnh ô tìm và nút Đăng nhập ở thanh trên. Bản hàng 3 đặt ngăn từ ngay dưới thanh trên tới đáy màn hình: thanh trên
và ô tìm luôn thấy; ở 1024 ngăn che số dòng cạnh ô tìm.
