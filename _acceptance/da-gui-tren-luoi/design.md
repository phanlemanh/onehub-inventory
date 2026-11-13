# Thiết kế: Đã gửi trên Lưới (hàng 6)

## Mục tiêu

Đầu khách mở Đã gửi (`/sent`) và thấy các link mình đã gửi trên cùng Lưới với Bảng hàng: ai nhận, khách đã mở mấy lần,
quan tâm mấy căn, mở gần nhất lúc nào, gửi lúc nào, gồm mấy căn. Dữ liệu mẫu (mã phạm vi K4); chưa gửi thật — gửi link là
hàng 16, lượt mở thật và lưu khách là hàng 18. Vì sao: đây là màn thứ hai chứng Lưới dùng lại được mà không thêm prop kiểu
dáng — màn chỉ khai cột, dòng, câu trống và ngăn chi tiết, mọi hành vi đến từ khuôn Lưới.

Hạng T3: thêm một khái niệm vào mô hình nghiệp vụ (`ontology/**`), ghi vào `architecture/modules.yaml`, chạm
`src/modules/sharing/**` và `tools/e2e_templates/`.

## Cách dựng

- **Khái niệm mới — `ShareLink` («Link đã gửi»)**, khái niệm riêng của kho (giám sát duyệt D-1311-2). RESO
  `ContactListings` là từng lần chào gửi cho từng liên hệ; một link gói nhiều lần chào trong một lần gửi nên không dùng
  tên ấy. Sáu trường màn hiện: `recipientName` (người nhận, dữ liệu cá nhân, chỉ là tên hiển thị — chưa nối Liên hệ, Hỏi-1),
  `openCount`, `interestCount`, `lastOpenedAt`, `sentAt`, `listingCount`. Số căn suy từ quan hệ mới `ShareLink includes
  Listing` (mô hình chưa có kiểu trường suy ra, nên ghi thành luật `listing-count-is-derived` của thực thể, chỗ giữ luật
  là bộ dựng mẫu). Quan hệ `Company holds_share_link ShareLink` giữ `companyId` bắt buộc. Mô-đun `sharing` sở hữu
  thực thể. Không khai trước trường của hàng 16, 17, 18 (mã link, hạn, bản che); không thêm thao tác vào bảng quyền.
- **Dữ liệu mẫu** — `src/modules/sharing/sample.ts`: 14 link của sàn mẫu, nhãn MAU ở id (`4d415500-0010-…`), tên người
  nhận dạng `[Tên] Khách nn`. Đủ dạng: chưa mở lần nào (ô «Mở gần nhất» trống), mở một lần, mở nhiều lần, một căn, 30 căn
  (trần một lần gửi của Quỹ hàng), một tên dài. Mô-đun không phụ thuộc mô-đun nào: trang đưa id sàn và id lần chào của
  `listings`, bộ dựng chọn lần chào theo thứ tự rồi vòng lại. `checkShareLinks` kiểm luật của thực thể (cùng sàn, nhãn
  MAU, tên giả, số căn bằng số lần chào trong link, quan tâm không quá số căn, chưa mở thì không có lúc mở, không mở trước
  lúc gửi), mỗi luật một thông điệp tiếng Việt để bài kiểm ghim.
- **Vùng** — `src/modules/sharing/ui/`: `SentGrid` dựng `DataRegion` của khuôn Lưới với đúng các prop Bảng hàng dùng
  (tên vùng, cột, dòng, trạng thái, thử lại, ngăn chi tiết, câu trống, lời mời ở trạng thái trống) — không prop kiểu dáng,
  không nhóm. `sentRows` xếp mới gửi trước; `sentColumns` khai sáu cột theo trường, kiểu và bề rộng do bảng kiểu đã sinh
  quyết. `sentStateFrom` đọc `?state=` như Bảng hàng (chỉ ngoài bản thật) để bộ bài sinh từ sổ màn mở được mọi trạng thái.
- **Trang** — `src/app/(app)/sent/page.tsx` ghép mẫu của `catalog`, `listings`, `sharing` qua cửa công khai và lấy mọi
  nhãn từ `label()`.
- **Ngăn chi tiết** — bấm tên người nhận mở ngăn nổi (quyết định 0024) có địa chỉ riêng `?ho-so=`: tên người nhận làm
  tiêu đề, sáu trường dạng nhãn và giá trị, rồi «Căn trong link» liệt mã căn · toà của từng lần chào trong link.
- **Sửa lưới dùng chung** (giám sát duyệt D-1311-4, làm SAU khi 2c gộp): chữ ở cột đầu (nút mở hồ sơ) không cắt — tên dài
  đè sang ô bên. Sửa đúng chỗ bọc nút: cắt bằng dấu ba chấm như ô chữ khác, đọc đủ qua `title`; giữ luật «chữ mở trong ô»
  của hàng 3. Commit riêng, bài kiểm đỏ khi bỏ chỗ sửa, đo ở Bảng hàng lẫn Đã gửi.
- **Gỡ ngoại lệ** (giám sát duyệt D-1311-3): bỏ `sent` khỏi danh sách «chưa có vùng» của bộ bài sinh từ sổ màn
  (`tools/e2e_templates/recipes.ts`), đổi ca ví dụ trong bài kiểm sang tên giả không hạ phép đo, và bỏ dòng ngoại lệ
  `sent/page.tsx` ở `design/patterns/luoi.md`.

## Luật sản phẩm

- SP-1 (cách ly): không truy vấn cơ sở dữ liệu ở hàng này; thực thể mới mang `companyId` bắt buộc, bảng thật (hàng 16)
  sẽ bật cách ly theo dòng.
- SP-3 (người bấm gửi): màn chỉ đọc, không có nút gửi; không gọi dịch vụ nhắn tin nào.
- SP-4 (nội bộ không ra trang khách): `src/modules/sharing/ui/**` nằm trong phạm vi dấu hiệu của SP-4. Vùng Đã gửi là màn
  nội bộ, không nhập `modules/contacts`, `modules/identity/server` hay nhãn vai, bên; bài kiểm quét thư mục ấy theo dấu hiệu
  của luật. Trang khách và luật che là hàng 17.

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: App Shell → Đã gửi (thanh bên, mục «Tất cả link») → lưới 14 link, mới gửi trước → bấm tên người nhận → ngăn
  chi tiết cạnh bảng (sáu trường, căn trong link) → «Trước», «Sau» hay «Đóng» (điểm ra: lưới, tiêu điểm về dòng vừa mở).
- Biên: link chưa mở lần nào (ô «Mở gần nhất» là «—»); tên người nhận dài (cắt bằng dấu ba chấm, đọc đủ khi rê chuột hay
  khi ô có tiêu điểm); 30 căn trong một link (ngăn cuộn); chưa gửi link nào (trạng thái trống).
- Lỗi & quay lại: tải lỗi → câu ba phần và «Thử lại»; tải hỏng một phần → 7 dòng còn dùng được kèm câu nói phần hỏng;
  không đủ quyền → câu nói rõ, không lộ dòng nào.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Đã gửi (`sent`) | Xem khách đã phản ứng thế nào với từng link mình gửi | Thanh bên của App Shell / ngăn chi tiết của một link; Bảng hàng khi chưa gửi link nào |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-sent-ready | Đã gửi | Lưới 14 dòng, chân bảng «14 dòng» | Tìm, lọc, sắp xếp, mở một link |
| ST-sent-loading | Đã gửi | Dưới 1 giây không báo; từ 1 giây khung chờ đúng bố cục | Chờ, hay huỷ sau 10 giây |
| ST-sent-empty | Đã gửi | «Bạn chưa gửi link nào cho khách. Chọn căn để gửi ở Bảng hàng.» | Bấm «Mở Bảng hàng» |
| ST-sent-no-match | Đã gửi | Không dòng nào khớp tìm hay lọc | «Xoá lọc» |
| ST-sent-error | Đã gửi | Câu ba phần của Lưới | «Thử lại» |
| ST-sent-partial | Đã gửi | 7 dòng còn dùng được, câu nói phần hỏng | Dùng phần còn lại, «Thử lại» |
| ST-sent-long-text | Đã gửi | Tên người nhận dài cắt bằng dấu ba chấm | Rê chuột hay đưa tiêu điểm để đọc đủ |
| ST-sent-forbidden | Đã gửi | Câu không đủ quyền, không dòng nào | Không có việc tiếp |
| ST-sent-record | Đã gửi | Ngăn chi tiết: sáu trường, «Căn trong link» | «Trước», «Sau», «Đóng» |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Mọi hành vi lưới (cuộn liền, ghim cột đầu, sắp xếp, lọc, tìm, ẩn cột, toàn màn hình, phím) đến từ khuôn Lưới theo
  `design/behaviors.md`; màn không khai thêm.
- Cột số đếm canh phải, cột thời điểm dạng `HH:mm dd/MM/yyyy` theo kiểu của bảng kiểu đã sinh.
- Khổ 360, 414: lưới cuộn ngang trong vùng, cột số dòng và cột Người nhận đứng yên (Hỏi-3).

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| DataRegion (khuôn Lưới) | dùng | Họ Lưới, màn mẫu Bảng hàng; đúng điều hàng này phải chứng |
| RecordPanel (ngăn nổi) | dùng | Quyết định 0024: cách chung để xem chi tiết một dòng |
| PageHeader | dùng | Đầu màn chung của App Shell |
| Button (shadcn) làm lời mời ở trạng thái trống | dùng | Thành phần nhà cung cấp, giữ nguyên |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: nấc (ii) — chọn thẳng, luồng hiển nhiên: quyết định 0024 chốt ngăn nổi làm chi tiết của mọi màn danh sách, và sổ
bối cảnh ghi Quỹ hàng dựng Đã gửi theo bố cục danh sách → chi tiết.

### 7. Thẻ việc

| Trường | Giá trị |
|---|---|
| Ai dùng | Đầu khách (Trưởng nhóm xem cả đội khi có người gửi thật) |
| Việc chính | Xem khách đã mở, quan tâm link mình gửi chưa, để biết gọi ai trước |
| Tần suất | mỗi ngày nhiều lần |
| Số bản ghi | vài chục |
| Thiết bị | cả hai (đầu khách hay dùng điện thoại) |
<!-- UX-SPEC-TEMPLATE>>> -->

## Câu hỏi cho chủ kho

- **Hỏi-1** — Người nhận chỉ là tên hiển thị, chưa nối Liên hệ. Khuyên: giữ vậy, hàng 18 (lưu khách) quyết nối. Lối khác:
  nối ngay — phải dựng chọn khách trước khi có màn lưu khách.
- **Hỏi-2** — Thứ tự cột. Khuyên: Người nhận · Lượt mở · Quan tâm · Mở gần nhất · Gửi lúc · Số căn (phản ứng của khách thấy
  ngay trên điện thoại). Lối khác: theo thẻ Quỹ hàng (Người nhận · Số căn · Gửi lúc · Lượt mở · Quan tâm · Mở gần nhất).
- **Hỏi-3** — Điện thoại. Khuyên: lưới cuộn ngang như Bảng hàng; thẻ điện thoại để hàng thẻ điện thoại dùng chung. Lối
  khác: thẻ riêng cho Đã gửi ngay hàng này — khối ngoài khuôn Lưới, trái mục đích của hàng.
- **Hỏi-4** — Thêm khái niệm «Link đã gửi» vào mô hình nghiệp vụ (đổi ontology, chủ kho soi): một thực thể riêng, sáu
  trường, hai quan hệ, mô-đun chia sẻ sở hữu. Khuyên: duyệt như khai.
