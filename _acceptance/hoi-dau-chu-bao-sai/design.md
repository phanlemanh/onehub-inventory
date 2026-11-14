# Thiết kế — Hỏi đầu chủ và Báo sai thông tin căn (hàng 3e)

## Ý định

Đầu khách (và mọi người xem hàng mà không giữ căn) đang xem hồ sơ một căn thì hỏi được người giữ căn ngay tại đó: bấm
«Hỏi đầu chủ · [Tên]» ở đáy hồ sơ, máy soạn sẵn tin có mã căn, toà và đường dẫn về hồ sơ, rồi mở bảng chia sẻ của máy
để người chọn nơi gửi và tự bấm gửi. Thấy thuộc tính căn sai (diện tích, phòng ngủ…), người bấm «Báo sai thông tin» ở mục
thuộc tính, chọn trường sai, gõ giá trị đúng, ghi căn cứ, rồi tin đi cùng đường ấy. Không tin nào tự gửi, không gì ghi vào
dữ liệu căn (SP-3).

Ô Cổng Đáng: `_acceptance/hoi-dau-chu-bao-sai/opportunity.md` (chủ kho «Build cả năm hàng», 2026-11-12T22:20Z). Nguồn đối
chiếu: mục 25 và 35 của bảng so Chi tiết căn Quỹ hàng ↔ Inventory; mã Quỹ hàng commit `1729b11f`,
`apps/web/src/app/(app)/units/ho-so/{nut-hoi-dau-chu.tsx,hoi-dau-chu.ts,nut-bao-sai.tsx,bao-sai.ts}`.

## Từ Quỹ hàng (giữ · đổi)

- Giữ: thanh dính đáy một nút; căn chưa ai giữ thì nút tắt và chữ trên nút nói vì sao; nhãn «Hỏi đầu chủ · <tên>», chưa
  có tên thì nhãn trần; bảng chia sẻ gọi ngay trong lượt bấm (máy từ chối nếu mất cử chỉ của người); người huỷ bảng chia
  sẻ thì không báo gì; máy từ chối chia sẻ thì chép thay; chép không được thì hiện tin để chép tay.
- Giữ: hộp báo sai — chọn thuộc tính, ô giá trị đúng bắt buộc (≤ 200 ký tự), ô căn cứ (≤ 500), tin gồm mã căn, toà, dự án,
  thuộc tính, đang hiện, đúng là, ghi chú. Ô trống thì báo lỗi tại ô (cách của hộp dùng chung `FormDialog`), không tắt nút.
- Đổi: Quỹ hàng đọc tên đầu chủ bằng một lời gọi mạng lúc mở hồ sơ; ở đây tên đi cùng dòng của Bảng hàng (dữ liệu mẫu
  tới hàng 10), không lời gọi nào.
- Đổi: đường dẫn trong tin trỏ thẳng hồ sơ của căn trên Bảng hàng (`/inventory?ho-so=<mã hàng>`), không phải trang tìm.
- Đổi: chữ nút báo sai «Báo sai thông tin» (17 ký tự, Hỏi-1).

## Chỗ gắn (ranh giới với 3b, 3f, 2c)

- Đáy hồ sơ: khe mới `footer` của khung hồ sơ dùng chung (`RecordView` trong `src/components/candidate/record-panel.tsx`),
  vẽ ngoài vùng cuộn, ở cả hồ sơ cạnh bảng lẫn hồ sơ toàn màn điện thoại. Đầu hồ sơ (chỗ 3f gắn «Mở toàn màn») không đổi.
  Chạm tệp xin ở yêu cầu V-7.
- Mục thuộc tính: một dòng đầu mục ngay trên danh sách trường của `ListingRecordBody`, bên phải là nút «Báo sai thông tin».
  Không đổi phần thân khác (chỗ 3b thêm khối).
- Mã: tiện ích mở bảng chia sẻ hay chép ở `src/lib/share/` (thuần trình duyệt, không nghiệp vụ, hàng 16 dùng lại); hàm soạn
  chữ hai tin ở cửa `src/modules/listings/index.ts`; hai nút ở `src/modules/listings/ui/`. Không chạm mô-đun sharing (giám
  sát, V-1311-2).
- Quyền: hai nút đi qua `useActionPermission` của khuôn nút 9e — «Hỏi đầu chủ» với thao tác `viewListings`, «Báo sai thông
  tin» với `readCatalog` (Hỏi-2). Người giữ căn không thấy nút hỏi: đó là luật của căn (hỏi chính mình), không phải quyền.
- Người giữ căn: dữ liệu mẫu MAU — mỗi hàng mẫu mang một trong ba: người khác giữ (`[Tên] 0x`), chính người xem giữ, chưa ai
  giữ. Hàng 10 thay bằng dữ liệu thật; luật hiện nút không đổi.

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ (hỏi): Bảng hàng → bấm mã căn → hồ sơ mở → đáy hồ sơ «Hỏi đầu chủ · [Tên] 02» → bấm → bảng chia sẻ của máy với
  tin «Hỏi về căn A-12.05 · Toà S1.01» kèm đường dẫn hồ sơ → người chọn ứng dụng và tự gửi (điểm ra: ứng dụng người chọn).
- Suôn sẻ (báo sai): hồ sơ → mục thuộc tính → «Báo sai thông tin» → hộp: chọn «Diện tích», thấy «Đang hiện: 68,5 m²», gõ
  giá trị đúng, ghi căn cứ → «Chép và mở bảng chia sẻ» → bảng chia sẻ → người tự gửi; hộp ở lại với dòng «Đã mở bảng chia
  sẻ» cho tới khi người đóng.
- Biên: căn chưa ai giữ → nút tắt «Căn chưa có đầu chủ giữ»; người xem chính là người giữ → không có thanh đáy; vai không có
  quyền xem hàng (Quản trị sàn) → không thanh đáy; ô giá trị đúng trống mà bấm soạn → ô báo lỗi tại chỗ, không soạn gì.
- Lỗi & quay lại: máy không có bảng chia sẻ hay từ chối → chép, báo «Đã chép tin hỏi» / «Đã chép»; chép cũng không được →
  báo «Máy này không chép hay chia sẻ được» và hiện tin trong ô chỉ đọc để chép tay; người huỷ bảng chia sẻ → không báo gì,
  bấm lại được.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Hồ sơ căn (cạnh bảng, toàn màn điện thoại) — thanh đáy | Hỏi người giữ căn | Bảng hàng / bảng chia sẻ của máy |
| Hộp «Báo sai thông tin căn <mã>» | Soạn tin báo một thuộc tính sai | Mục thuộc tính của hồ sơ / bảng chia sẻ của máy |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-hoi-co-nguoi-giu | Thanh đáy | Nút chính «Hỏi đầu chủ · [Tên] 02», biểu tượng hỏi | Bấm để mở bảng chia sẻ |
| ST-hoi-chua-ai-giu | Thanh đáy | Nút tắt, chữ «Căn chưa có đầu chủ giữ» | Không làm gì; hỏi trưởng nhóm ngoài ứng dụng |
| ST-hoi-minh-giu | Thanh đáy | Không có thanh đáy | — |
| ST-hoi-khong-quyen | Thanh đáy | Không có thanh đáy (vai không có ô xem hàng) | — |
| ST-hoi-da-chep | Thanh đáy | Toast «Đã chép tin hỏi» | Dán vào ứng dụng nhắn tin |
| ST-hoi-loi | Thanh đáy | Toast lỗi «Máy này không chép hay chia sẻ được» kèm tin để chép tay, ở lại tới khi người đóng | Chép tay, đóng |
| ST-bao-mo | Hộp báo sai | Thuộc tính đầu tiên đã chọn, «Đang hiện», ô giá trị đúng trống | Gõ giá trị đúng |
| ST-bao-thieu | Hộp báo sai | Bấm soạn khi ô trống: ô đỏ, câu «Gõ giá trị đúng trước khi gửi.» | Gõ rồi bấm lại |
| ST-bao-da-mo | Hộp báo sai | Dòng báo «Đã mở bảng chia sẻ» | Đóng hộp |
| ST-bao-da-chep | Hộp báo sai | Dòng báo «Đã chép» | Dán, đóng hộp |
| ST-bao-loi | Hộp báo sai | Dòng báo lỗi và ô chỉ đọc chứa tin để chép tay | Chép tay, đóng |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Bảng chia sẻ (`navigator.share`) gọi ngay trong lượt bấm, không chờ gì trước; huỷ (AbortError) là im lặng.
- Giá trị đúng 1–200 ký tự sau khi cắt khoảng trắng; căn cứ ≤ 500; hai ô dùng `maxLength`.
- Đóng hộp báo sai thì xoá hai ô và dòng báo; mở lại bắt đầu từ đầu.
- Thanh đáy điện thoại: nút cao 44 px, rộng hết hồ sơ; máy tính: nút cỡ thường, rộng hết cột hồ sơ.
- Toast qua `notify` của khuôn màn (`src/components/templates/notify.ts`), hộp qua `FormDialog` dùng chung.

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| RecordPanel (khe `footer`) | mở rộng | Hồ sơ chưa có chỗ dính đáy; thêm một khe như `actions` |
| Button | dùng | Nút chính và nút ghost của shadcn |
| FormDialog | dùng | Hộp soạn dùng chung của kho |
| Select, Input, Textarea, Field | dùng | Ô của hộp báo sai |
| notify | dùng | Toast «Đã chép tin hỏi» |
| useActionPermission | dùng | Khuôn nút 9e |
| src/lib/share | tạo | Chưa có tiện ích bảng chia sẻ; hàng 16 dùng lại |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: hai nút gắn vào hồ sơ của hàng 3, vốn là chi tiết mở cạnh Bảng hàng; không mở màn mới. Đã xem mã Quỹ hàng (thanh dính
đáy theo thân product-detail-5, hộp báo sai trên mục thuộc tính) — luồng hiển nhiên, không tra thêm.

### 7. Thẻ việc

| Trường | Giá trị |
|---|---|
| Ai dùng | Đầu khách (chính), Đầu chủ không giữ căn, Trưởng nhóm |
| Việc chính | Hỏi người giữ căn về một căn đang xem, hoặc báo một thuộc tính căn sai |
| Tần suất | mỗi ngày nhiều lần |
| Số bản ghi | một |
| Thiết bị | cả hai |
<!-- UX-SPEC-TEMPLATE>>> -->

## Tin soạn sẵn

```
Hỏi về căn A-12.05 · Toà S1.01
https://<máy chủ>/inventory?ho-so=<mã hàng>
```

```
Báo sai thông tin căn A-12.05
Toà: S1.01
Dự án: Vinhomes Ocean Park 1
Thuộc tính: Diện tích
Đang hiện: 68,5 m²
Đúng là: 72 m²
Ghi chú: Sổ hồng trang 2
```

Tin chỉ dựng từ thuộc tính căn trên hồ sơ và chữ người gõ — không số điện thoại, không tên chủ nhà (SP-4 không áp vì tin là
tin nội bộ, nhưng vẫn không mang gì của chủ nhà). Đường dẫn đòi đăng nhập vào đúng sàn.

## Quét không gian tiêu chí (Zwicky)

Trục: người xem (giữ căn · không giữ · không quyền) × trạng thái căn (có người giữ · chưa ai giữ) × máy (có bảng chia sẻ ·
chỉ chép · không cả hai) × kết cục (gửi · huỷ · lỗi) × khổ (360 · 414 · 1024 · 1440) × nút (hỏi · báo sai).
Core → AC-1…AC-9. Later: nhận báo trên máy chủ, đếm số lần hỏi (descope). Never: gửi thay người, nút gửi Zalo.
