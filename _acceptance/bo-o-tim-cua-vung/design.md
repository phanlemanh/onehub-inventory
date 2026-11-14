# Thiết kế — bo-o-tim-cua-vung (hàng 2e)

Ngày: 2026-11-13 · dãy K · hạng T3 (chạm bộ bài kiểm sinh từ sổ màn ở `tools/e2e_templates/`).

## Vì sao

Chủ kho, 2026-11-13: «bảng hàng đang hoạt động theo ux của sheet, nên khi tìm căn thì nó dùng luôn header của cột để
input, tương tự ở từng cột, box search hiện nay chỉ gây confuse cho người dùng là khi nào dùng box search và khi nào gõ
trên cột?». Chủ kho chốt cùng ngày: «Đồng ý lối A, một điểm tôi muốn bổ sung là đưa search đúng vào (⌘K) ở thanh trên đây
cũng là nơi shell đã có ux?». Lối A: bỏ ô «Gõ để tìm» của vùng ở mọi bảng dùng chung khuôn Lưới, lọc bằng ô dưới tiêu đề
cột như Sheet; tìm thuộc ô ⌘K ở thanh trên của App Shell (hàng 3f). Ghi ở sổ đợt, mục «Ô tìm của họ Lưới».

## Hôm nay trên nhánh chính

- Lưới dùng chung vẽ ô tìm ở đầu thanh công cụ của vùng; ô ấy lọc mọi dòng theo các cột chữ (căn, toà, dự án) và chồng
  lên các ô lọc cột. Số dòng đầu vùng đổi thành «x / y dòng» khi đang lọc.
- Hàng ô lọc dưới tiêu đề cột (hàng 2a) chỉ hiện khi bấm «Lọc», hoặc khi vùng mở với lọc sẵn.
- Trạng thái vùng tên «Tìm không ra» ở ma trận trạng thái; chữ trên màn đã là «Không có dòng nào khớp» nhưng câu giải thích
  nói «chữ bạn gõ» và «ô tìm».
- Góc nhìn đã lưu (2c) không còn giữ chữ tìm (migration 011), nhưng kiểu cách xem trong lưới vẫn còn trường chữ tìm, và lớp
  gọi API của Bảng hàng phải vá nó thành rỗng.
- Bộ bài kiểm sinh từ sổ màn có ca «tìm» (gõ ô tìm, so tập dòng khớp kể cả dòng ngoài khung đầu, ba ca phá) và ca trạng thái
  «Tìm không ra». Hàng 6 (Đã gửi, PR #44 chưa gộp) thêm danh sách miễn «màn sent không chạy ca tìm», chờ hàng này gỡ.

## Cách làm

1. **Lưới dùng chung bỏ ô tìm, không thêm công tắc.** Ô tìm biến khỏi thanh công cụ ở mọi trạng thái và mọi khổ; hàm lọc
   chỉ còn lọc theo ô đầu cột. Không để «màn nào muốn thì bật» — chủ kho chọn bỏ cho cả họ Lưới, và một công tắc là đường
   cho ô tìm quay lại lặng lẽ.
2. **Trạng thái «Không có dòng nào khớp».** Đổi tên ở ma trận trạng thái; câu giải thích nói về ô lọc đầu cột; «Xoá lọc»
   xoá mọi ô lọc cột và trả lại dòng. Thanh công cụ và hàng ô lọc ở nguyên chỗ, ô đang gõ giữ focus (luật 2c AC-9 giữ
   nguyên, chỉ bỏ phần «ô tìm»).
3. **Hàng ô lọc đầu cột: luôn hiện hay sau nút «Lọc»** — câu hỏi cho chủ kho (Hỏi-1). Máy khuyên LUÔN HIỆN ở mọi khổ: bỏ ô
   tìm thì ô đầu cột là cách lọc duy nhất, nên nó phải thấy được ngay như Sheet; giá là một hàng cao hơn (khoảng 36 px), ở
   điện thoại bớt khoảng một dòng trong khung đầu. Khi luôn hiện, nút «Lọc» thôi có việc nên bỏ; số ô lọc đang bật đọc ở
   «x / y dòng» và nút «Xoá lọc». Lối khác: giữ sau nút «Lọc» như hôm nay.
4. **Kiểu cách xem không còn chữ tìm.** Trường chữ tìm bỏ khỏi cách xem của lưới; lớp gọi API của Bảng hàng thôi vá; địa
   chỉ hay dữ liệu cũ còn mang chữ tìm thì bị bỏ qua. Không migration mới (011 đã dọn dữ liệu).
5. **Bộ bài kiểm chung: ca «tìm» thành ca «lọc đầu cột».** Cùng phép so (tập dòng khớp so như tập nhiều phần tử với toàn
   bộ dòng đọc bằng cuộn, chuỗi chọn sao cho dòng khớp nằm cả ngoài khung đầu và đầy hơn một khung) nhưng gõ vào ô lọc của
   cột đầu; ba ca phá giữ nguyên ý (giấu một dòng khớp · chỉ còn khung đầu · thêm một dòng không khớp), mỗi ca đỏ với thông
   điệp ghim. Ca trạng thái «Tìm không ra» thành «Không có dòng nào khớp». Thêm một khẳng định ở mọi ca vùng: không có ô
   tìm. Gỡ danh sách miễn «màn sent không chạy ca tìm» và chỗ đọc nó — Đã gửi chạy ca lọc đầu cột như Bảng hàng.
6. **Mọi bài kiểm khác nhắc ô tìm viết lại sang ô đầu cột, không nới.** Mỗi khẳng định cũ có một khẳng định mới đo cùng
   điều trên ô đầu cột, hoặc thành khẳng định «không có ô tìm»; bảng đối chiếu cũ → mới nằm ở hồ sơ để người ký soi, và một
   thước của hồ sơ đếm mọi dòng bài kiểm bị bỏ có nhắc ô tìm — dòng nào không có hàng trong bảng thì đỏ.
7. **Tài liệu.** `design/states.md`, `design/behaviors.md`, `design/patterns/luoi.md`; mô tả Góc nhìn trong mô hình nghiệp vụ
   (Ngoài-1, Ngoài-6 của 2c — xin giám sát vì chạm `ontology/`); nhật ký thay đổi và nhật ký chung (Ngoài-4, Ngoài-9).
8. **Ngoài-3 của 2c — mục miễn của sổ khối phải có chứng từ thật.** Công cụ chứng minh màn, với mỗi cặp ở mục «khối có
   trước luật» của sổ khối: commit có thật; commit ấy THÊM đúng tệp của khối (đọc từ dòng sổ của khối); ngày của commit
   bằng ngày khai và trước ngày sổ khối ra đời (ngày commit đầu tiên tạo sổ khối). Sai điều nào thì đỏ với mã riêng. Khi
   bản sao thiếu lịch sử (CI lấy bản sao nông): Hỏi-2 cho chủ kho. Ở bản sao nông commit gốc ghép trông như «thêm mọi tệp»
   và mang ngày của chính nó — công cụ không bao giờ dùng nó làm chứng: thiếu cha hay thiếu lịch sử sổ khối thì lấy thêm,
   không lấy được thì đỏ.

## Đặc tả UX

<!-- <<<UX-SPEC-TEMPLATE -->
### 1. Luồng

- Suôn sẻ: mở Bảng hàng (hay Đã gửi) → gõ vào ô lọc dưới tiêu đề «Căn» → bảng chỉ còn dòng khớp, chân bảng «x / y dòng»
  → gõ thêm ô lọc cột khác thì chồng lọc → «Xoá lọc» về đủ dòng (điểm ra: bảng đủ dòng).
- Biên: không dòng nào khớp → thân bảng «Không có dòng nào khớp» + «Xoá lọc», ô đang gõ giữ chữ và focus; vùng không đủ
  quyền, đang tải, lỗi → không có ô lọc, không có ô tìm.
- Lỗi & quay lại: gõ sai một ô lọc → sửa riêng ô ấy là dòng hiện lại, không phải xoá hết lọc.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| inventory (Bảng hàng) | xem và lọc hàng của sàn như ở Sheet | cột biểu tượng / hồ sơ căn |
| sent (Đã gửi) | xem các link đã gửi và ai đã mở | cột biểu tượng / ngăn chi tiết link |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-inventory-co-dong | inventory | thanh công cụ «60 dòng · Nhóm theo Toà · Cột · Toàn màn hình», hàng ô lọc «Chứa…» dưới tiêu đề, không ô tìm | gõ ô lọc |
| ST-inventory-dang-loc | inventory | bảng chỉ dòng khớp, «x / 60 dòng», nút «Xoá lọc» | gõ thêm, xoá lọc |
| ST-inventory-khong-khop | inventory | «Không có dòng nào khớp» · «Chữ bạn gõ ở ô lọc đầu cột không có trong dòng nào của vùng này.» · «Xoá lọc» | sửa ô lọc hay bấm «Xoá lọc» |
| ST-sent-co-dong | sent | như Bảng hàng, cột đầu «Người nhận» | gõ ô lọc |
| ST-sent-khong-khop | sent | như Bảng hàng | như Bảng hàng |
<!-- UX-STATE-TABLE>>> -->

Các trạng thái khác của vùng (đang tải, trống, lỗi, một phần hỏng, chữ dài, không đủ quyền) không đổi, trừ việc không còn
ô tìm.

### 4. Hành vi

- Ô lọc cột giữ luật của 2a: chữ «Chứa…», số và ngày theo khoảng, trạng thái chọn nhiều; các ô chồng lọc.
- Phím của Bảng hàng (hàng 2) không đổi; ô lọc đầu cột đã có trong vòng Tab của 2a.
- Điện thoại (360, 414): hàng ô lọc vẫn ở dưới tiêu đề, cuộn ngang cùng bảng.

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| `DataRegion`, `RegionToolbar` (candidate) | mở rộng (bớt) | bỏ ô tìm, giữ nguyên các nút của 2a |
| `RegionNoMatch` (candidate) | dùng | đổi câu giải thích theo nhãn mới |
| Ô lọc cột của ReUI data-grid | dùng | không đổi |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: khuôn Lưới của kho (`design/patterns/luoi.md`) đã chọn; hàng này chỉ bớt một ô, không đổi khuôn.

### 7. Thẻ việc

| Trường | Giá trị |
|---|---|
| Ai dùng | Đầu chủ, Đầu khách |
| Việc chính | lọc ra đúng các căn (hay link) cần xem bằng cách gõ ở đầu cột |
| Tần suất | mỗi ngày nhiều lần |
| Số bản ghi | hàng trăm trở lên |
| Thiết bị | cả hai |
<!-- UX-SPEC-TEMPLATE>>> -->

## Bản bấm được

Bản vá tạm không commit trên nhánh chính cộng PR của hàng 6 (để có Đã gửi), chạy ở cổng 3481 của dãy K: ô tìm bỏ, câu của
trạng thái không khớp đổi, `?loc=luon` cho hàng ô lọc luôn hiện. Ảnh bốn khổ sáng tối ở `figures/proto/`
(`<màn>-<nut|luon>-<khổ>-<sang|toi>.png`, cùng `<màn>-khong-khop-<1440|360>-<sang|toi>.png`). Bản vá giữ ở thư mục ghi chú
của giám sát (`2e-ban-bam-duoc.patch`).

## Câu hỏi cho chủ kho (Cổng Phạm vi)

- **Hỏi-1 — Hàng ô lọc đầu cột luôn hiện hay vẫn sau nút «Lọc»?** Khuyên: luôn hiện ở mọi khổ, bỏ nút «Lọc» (ảnh
  `*-luon-*`). Lối khác: giữ sau nút «Lọc» (ảnh `*-nut-*`) — giá: người mới không thấy chỗ lọc, đúng chỗ rối chủ kho nêu.
- **Hỏi-2 — Khi bản sao không có lịch sử (CI), công cụ chứng minh màn làm gì với cặp miễn của sổ khối?** Khuyên (b): công
  cụ tự lấy phần lịch sử còn thiếu (commit khai, cha của nó, lịch sử của sổ khối) từ kho gốc rồi kiểm; lấy không được thì đỏ, nói rõ vì sao — chặt ở mọi nơi, không sửa
  tệp CI; giá: bước kiểm cần mạng tới kho gốc. (a) chủ kho thêm một dòng lấy đủ lịch sử cho bước kiểm của CI (tệp CI của
  chủ kho). (c) bản sao nông thì chỉ báo «không kiểm được», không đỏ — lỏng nhất, để ngỏ đúng chỗ Ngoài-3 muốn đóng.

## Ngoài phạm vi

- Ô ⌘K ở thanh trên và cách nó điền sẵn ô lọc cột Căn: hàng 3f.
- Lọc nhanh cả bảng bằng một chữ (giống ô tìm cũ) ở bất kỳ chỗ nào trong vùng: không làm — trái lời chốt.
- Liên hệ: màn chưa dựng; khi dựng sẽ dùng lưới đã không có ô tìm.
- Ngoài-11, 12, 15 của 2c: chủ kho ghi hạn chế đã biết, không gắn vào hàng này.

## Luật sản phẩm chạm

Không chạm SP-1, SP-3, SP-4: hàng này bớt một ô trên giao diện, sửa tài liệu, bài kiểm và công cụ kiểm; không bảng mới,
không gửi, không chạm trang khách.
