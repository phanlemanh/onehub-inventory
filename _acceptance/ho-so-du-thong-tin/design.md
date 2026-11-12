# Thiết kế — Hồ sơ đủ thông tin (hàng 3b)

Ngày 2026-11-13 · dãy N · hạng T3 (chạm `ontology/**`).

## Ý định

Đầu chủ mở hồ sơ một căn ở Bảng hàng và đọc đủ những gì cần để trả lời khách hay gọi chủ nhà mà không phải mở Sheet:
căn ấy là căn gì (loại căn, diện tích, tầng, hướng, toà, dự án, loại hình), lần chào đang mở có gì (pháp lý, nội thất,
tài chính, tình trạng sử dụng), căn đã được chào mấy lần trước, hồ sơ còn thiếu phần nào, và lần cuối xác nhận với chủ
nhà cách đây bao lâu. Hồ sơ vẫn chỉ đọc. Hàng 15 (Sẵn sàng bán) dựng trên bốn trường mới của hàng này.

## Hiện trạng (sau hàng 3)

- Hồ sơ căn là ngăn nổi bên phải Bảng hàng (khung dùng chung `record-panel`), toàn màn trên điện thoại. Ruột là thẻ căn
  (mã, giá, nơi «toà · dự án», trạng thái, ba thông số Diện tích · Phòng ngủ · Xác nhận lúc) rồi tám trường của bảng.
- Lần chào chỉ có ở dữ liệu mẫu (`src/modules/listings/sample.ts`): 60 lần chào trên 60 căn, mỗi căn đúng một lần.
  **Cơ sở dữ liệu chưa có bảng lần chào** — hàng 10 «Bảng hàng dữ liệu thật» mới tạo bảng ấy.
- Danh mục căn (hàng 7d) đã có tầng (chữ, theo RESO), hướng (chữ «Đông Nam»…), loại hình (`propertySubType`), nhưng
  bảng nhãn chưa có nhãn «Hướng», «Loại hình», «Loại căn».

## Phương án

1. **Mô hình nghiệp vụ (đổi ontology — chủ kho soi).** `Listing` thêm năm trường:
   `furnished` (RESO `Furnished`), `occupantType` (RESO `OccupantType`), `legalStatus` (riêng của ta), `financing`
   (riêng của ta), `originalEntryTimestamp` (RESO `OriginalEntryTimestamp` — lúc lần chào được tạo, để xếp và ghi ngày
   cho «các lần chào của căn»). Kiểu giá trị của bốn trường đầu là Hỏi-1. Thêm luật `one-open-listing-per-unit`: trong
   một sàn, một căn có nhiều nhất một lần chào đang mở (Incomplete, Active, Pending, Hold); lần chào cũ đã đóng (Closed,
   Withdrawn) thì giữ lại. Bảng nhãn thêm nhãn cho năm trường, cho `DirectionFaces` («Hướng»), `PropertySubType`
   («Loại hình») và bốn giá trị của nó, «Loại căn», «Mức đủ thông tin», «Các lần chào» — mỗi nhãn tối đa 17 ký tự.
2. **Không migration ở hàng này (Hỏi-2).** Chưa có bảng lần chào để thêm cột; năm cột vào cùng bảng lần chào khi hàng 10
   tạo bảng ấy, qua `/new-migration` và bộ kiểm cách ly. Ô cơ hội ghi «có lần chuyển lược đồ» — đây là chỗ lệch, chủ kho
   chốt.
3. **Dữ liệu mẫu.** 60 lần chào hiện tại giữ nguyên mã, trạng thái, giá (Bảng hàng và hồ sơ đã ký của hàng 1, 2, 3 không
   đổi). Thêm bốn trường cho mỗi lần chào (có ô bỏ trống có chủ đích) và `originalEntryTimestamp`. Thêm một tập «lần
   chào cũ» (Closed hoặc Withdrawn, nhãn MAU) trên một phần ba số căn đã có lần chào — đọc qua một hàm riêng, nên
   `buildSampleListings` vẫn trả đúng 60 và Bảng hàng vẫn 60 dòng.
4. **Luật thuần trong mô-đun lần chào** (`src/modules/listings/index.ts`, an toàn ở trình duyệt):
   - `completeness(listing)`: năm phần theo thứ tự Giá · Nội thất · Pháp lý · Tài chính · Tình trạng sử dụng; trả số có,
     số cần và tên phần thiếu theo thứ tự ấy. Hàng 15 thêm «Ảnh thật», hàng 19 thêm điều kiện thuế phí cho «Giá».
   - `confirmationAge(lastConfirmedAt, today)`: số ngày lịch theo giờ Việt Nam (Asia/Ho_Chi_Minh), không âm; `null` khi
     chưa xác nhận. Câu hiện: «Xác nhận hôm nay», «Xác nhận N ngày trước», «Chưa xác nhận với chủ nhà».
   - `listingsOfUnit(upi)`: mọi lần chào của sàn trên căn ấy, mới trước theo `originalEntryTimestamp`; đánh số «Lần N»
     với lần cũ nhất là Lần 1.
   - `unitKind(bedroomsTotal)`: «Studio» khi 0, «{n}PN» khi có số, «—» khi trống (cách của Quỹ hàng).
5. **Hồ sơ** (`src/modules/listings/ui/listing-record.tsx`): giữ khung và thẻ căn của hàng 3, thay danh sách tám trường
   bằng bốn khối theo thứ tự: dòng xác nhận · Mức đủ thông tin · Căn · Lần chào đang mở · Các lần chào của căn. Thẻ căn:
   dòng nơi chốn thành «Dự án · Toà · Loại hình»; ba thông số thành Diện tích · Phòng ngủ · Hướng (Xác nhận lúc chuyển
   thành câu đếm ngày ở đầu hồ sơ).
6. **Xem một lần chào cũ (Hỏi-3).** Chạm một dòng trong «Các lần chào của căn» thì cả hồ sơ đổi sang lần ấy (giá, trạng
   thái, phần lần chào, mức đủ, xác nhận), đầu hồ sơ có dải «Đang xem lần chào cũ · Lần N» kèm nút «Về lần mới nhất».
   Địa chỉ trang không đổi; Trước/Sau hay chọn căn khác thì về lần mới nhất của căn ấy.

## Từ Quỹ hàng

Đọc ở `/Users/manhphan/dev/onehub-quy-hang` (commit 1729b11f, chỉ đọc).

| Quỹ hàng | Hàng này |
|---|---|
| Bốn cột `furnished`, `legal_status`, `financing`, `occupant_type` trên bảng `listings` (`packages/db/migrations/004_loi_hang_va_su_kien.sql:62-65`), chữ tự do 1–200 ký tự (`packages/core/src/listing/events.ts:27-28`) | Giữ tên trường (hai tên theo RESO). Kiểu giá trị là Hỏi-1. Không migration (Hỏi-2) |
| Mức đủ thông tin: Giá (kèm bao phí) · Nội thất · Pháp lý · Tài chính · Tình trạng sử dụng · Ảnh thật khi có đếm ảnh (`packages/core/src/listing/completeness.ts:9-37`) | Giữ thứ tự; bỏ «bao phí» (hàng 19) và «Ảnh thật» (hàng 15) vì chưa có — hai hàng ấy thêm |
| «Xác nhận N ngày trước», «Xác nhận hôm nay», «Chưa xác nhận với chủ nhà», đếm ngày lịch theo UTC (`apps/web/src/app/(app)/units/ho-so/mo-hinh.ts:233`, `packages/core/src/listing/freshness.ts:19-25`) | Giữ câu; đếm theo giờ Việt Nam vì xác nhận lúc 0–7 giờ sáng bị UTC tính sang hôm trước |
| Các lần rao: «Lần N · huy hiệu · giá · ngày tạo», mới trước, chạm thì cả hồ sơ đổi sang lần ấy qua `?lan=` (`ho-so/ho-so.ts:205-219`, `than-chung.tsx:43-46`) | Giữ dòng và cách đổi cả hồ sơ; không thêm tham số địa chỉ (Hỏi-3); đổi chữ «lần rao» thành «lần chào» theo bảng thuật ngữ |
| Thuộc tính: Loại căn (theo số phòng ngủ) · Diện tích · Tầng · Hướng · Toà · Khu · Loại hình (`ho-so/ho-so.ts:147-157`) | Giữ thứ tự; «Khu» thành «Dự án» vì bảng nhãn cấm «Khu» cho `Subdivision` |
| Sẵn sàng bán đòi Pháp lý và Tình trạng sử dụng (`packages/core/src/listing/status.ts:101-115`) | Không làm ở đây; hàng 15 đọc hai trường này |
| Ô thiếu «Chưa có · điền ở Bảng hàng» chỉ sau khi bấm Sẵn sàng bán (`mo-hinh.ts:243`) | Ô thiếu ghi «Chưa có» ngay; chưa có chỗ điền nên bỏ vế «điền ở Bảng hàng» |
| Khối hồ sơ theo `solution-crm-4` (`docs/design/vo-va-ia.md` mục 2) | Ứng viên A của Hỏi-4 |

## Luật sản phẩm

Đã đọc `PRODUCT-INVARIANTS.md` (SP-1, SP-3, SP-4). Hàng này không truy vấn cơ sở dữ liệu (SP-1), không gửi gì (SP-3),
không chạm trang khách (SP-4). Ghi để hàng chia sẻ biết: pháp lý, tài chính, tình trạng sử dụng là dữ liệu nội bộ cho
tới khi luật ẩn nói khác — trang khách dựng từ luật ẩn, không đọc thẳng các trường này.

## Vai × Màn

Khung chưa có vai thật của người đăng nhập ở Bảng hàng (như hàng 3); ô dưới là ý định.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| inventory | được — đọc đủ hồ sơ mọi căn của sàn | được — đọc đủ hồ sơ mọi căn của sàn | được — đọc đủ hồ sơ mọi căn của sàn | chặn — vùng báo không đủ quyền, không mở hồ sơ |

## Đặc tả UX

<!-- <<<UX-SPEC-TEMPLATE -->
### 1. Luồng

- Suôn sẻ: Bảng hàng → bấm mã căn → hồ sơ mở, đọc từ trên xuống: xác nhận · mức đủ · căn · lần chào · các lần chào
  (điểm ra: «Đóng», Esc, nút lùi — như hàng 3).
- Biên: căn chỉ có một lần chào (danh sách một dòng); lần chào thiếu cả bốn trường (mức đủ 1/5); chưa xác nhận bao giờ;
  căn không có tầng hay hướng («—»).
- Lỗi & quay lại: đang xem lần cũ → dải báo kèm «Về lần mới nhất»; Trước/Sau cũng về lần mới nhất của căn kế.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Hồ sơ căn (ngăn nổi trên Bảng hàng; toàn màn trên điện thoại) | Đọc đủ thông tin một căn và lần chào của nó | Từ mã căn trên Bảng hàng / về đúng dòng ấy |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-ho-so-du | hồ sơ | đủ năm phần: «Mức đủ thông tin 5/5 · Đủ thông tin» | đọc |
| ST-ho-so-thieu | hồ sơ | «3/5 · Còn thiếu: Pháp lý, Tài chính»; ô thiếu ghi «Chưa có» | đọc, điền ở hàng sau |
| ST-ho-so-chua-xac-nhan | hồ sơ | «Chưa xác nhận với chủ nhà» ở đầu hồ sơ | gọi chủ nhà |
| ST-ho-so-mot-lan | hồ sơ | «Các lần chào của căn · 1», một dòng đang chọn | — |
| ST-ho-so-lan-cu | hồ sơ | dải «Đang xem lần chào cũ · Lần N» + «Về lần mới nhất»; tên khối «Lần chào đang xem» | về lần mới nhất |
| ST-ho-so-dong | Bảng hàng | như hàng 3 (chờ tải, lỗi, không có dòng, không đủ quyền thì không mở hồ sơ) | — |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Danh sách lần chào là nút bấm được bằng Tab và Enter; lần đang xem mang `aria-current`. Thanh mức đủ là `progressbar`
  có nhãn và giá trị. Đổi lần chào không đóng hồ sơ, không đổi địa chỉ, tiêu điểm ở lại dòng vừa chạm.
- Ở 1024 trở lên ruột hồ sơ một cột trong ngăn nổi; ở 414 và 360 toàn màn, thẻ căn ở đầu.

### 5. Xuất xứ component

| Component | Nấc | Vì sao (1 dòng) |
|---|---|---|
| Khung hồ sơ `record-panel`, thẻ căn `ListingCard` | dùng | của hàng 3, đã ký |
| `TypedCell` (huy hiệu trạng thái, tiền) | dùng | cùng cách hiện với ô bảng |
| Khối có tiêu đề nhỏ + danh sách nhãn/giá trị | mở rộng | theo `solution-crm-4` (Hỏi-4), ghép từ phần đã có |
| Thanh mức đủ | ghép | `progress` của shadcn (cài bằng CLI) |
| Danh sách «Các lần chào» | ghép | `item` của shadcn hoặc nút danh sách; chọn ở Hỏi-4 |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: hàng 3 đã chốt «ngăn nổi cạnh bảng»; hàng này chỉ thêm khối vào phần chi tiết.

### 7. Thẻ việc

| Trường | Giá trị |
|---|---|
| Ai dùng | Đầu chủ |
| Việc chính | Đọc đủ thông tin một căn và lần chào của nó trước khi gọi chủ nhà hay trả lời khách |
| Tần suất | mỗi ngày nhiều lần |
| Số bản ghi | một |
| Thiết bị | cả hai |
<!-- UX-SPEC-TEMPLATE>>> -->

## Quét không gian tiêu chí

Khuôn «entity-feature». Trục: (A) khổ 1440 · 1024 · 414 · 360 × sáng · tối; (B) phần hồ sơ: đầu · mức đủ · căn · lần
chào · các lần chào; (C) dữ liệu lần chào: đủ · thiếu từng trường · thiếu cả bốn · chưa xác nhận · xác nhận hôm nay;
(D) số lần chào của căn: một · hai · ba; đang xem mới nhất · đang xem lần cũ; (E) mô hình: trường mới · nhãn · luật một
lần chào mở · kiểu sinh ra. Core → AC-1…AC-10. Later: sửa bốn trường (hàng 4, 3d), lịch sử (3c), ảnh và Sẵn sàng bán
(15), bao phí (19), địa chỉ riêng cho lần cũ (3f), migration (10). Never: tự điền bốn trường từ nguồn ngoài.
