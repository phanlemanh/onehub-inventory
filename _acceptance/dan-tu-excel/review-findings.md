# Review findings: dan-tu-excel (round 6)

# Review findings: dan-tu-excel (round 6)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra) kèm hình dạng 5: phép 'every axis is used' chỉ đếm nhãn trục do từng case tự khai**
  Người dùng thấy gì: Bài thử tự động về việc dán khi người dùng đã ghim, ẩn hoặc đổi thứ tự cột có thể báo xanh dù các cách sắp xếp đó chưa thật sự được thử. Nếu sau này có lỗi ở đó, bài thử có thể không bắt được.
  Căn cứ: Không ảnh hưởng trực tiếp đến người dùng hôm nay vì chức năng dán vẫn chạy đúng theo các tình huống đã duyệt; lỗi chỉ lộ ra ở bài thử, và bổ sung sau thì rẻ.
  file: `src/components/candidate/paste-block.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): `shown` và `covered` gõ sẵn theo đúng thứ tự hàm cần, không rút từ bảng thật**
  Người dùng thấy gì: Bài thử chưa kiểm được việc ghép dòng dán ngắn với đúng thứ tự cột đang hiện trên bảng thật khi người dùng ghim phải hoặc đổi chỗ cột. Nếu ghép sai, ô dán có thể rơi nhầm cột mà bài thử vẫn xanh.
  Căn cứ: Chỉ xảy ra với dòng dán thiếu ô trên bảng đã sắp xếp lại cột, và người dùng thấy ngay trong bản xem trước rồi bấm Thôi nên không mất dữ liệu; kiểm thêm trên trình duyệt thật đã phủ ghim trái và ẩn cột.
  file: `src/components/candidate/paste-block.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên quét LỚP «on any column» nhưng chỉ có ba điểm-case, không có ma trận cột viết trước (r4)**
  Người dùng thấy gì: Nguoi dung khong gap loi nao ngay bay gio. Chi la ten bai thu hua rong hon so truong hop no that su kiem, nen sau nay mot thay doi co the lam o trong bi xu ly sai ma bai thu van xanh.
  Căn cứ: Khong anh huong nguoi dung hom nay va khong mat du lieu; neu sau nay co loi thi no se hien ra o cac bai thu khac hoac khi dung thu, nen chap nhan va ghi vet la du.
  file: `src/modules/listings/ui/listing-paste.test.ts`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 (assertion âm tính một mình): kiểm 'bảng chưa đổi' bằng not.toContain trên ô đầu, không có đối chứng dương (r3)**
  Người dùng thấy gì: Bài thử xác nhận bảng chưa đổi trước khi bấm Áp chỉ nhìn ô giá đầu tiên và chỉ chắc nó không hiện giá mới. Nếu ô ở dòng khác bị đổi sớm thì bài thử có thể không phát hiện, nên người dùng có thể thấy giá đổi trước khi bấm Áp.
  Căn cứ: Rủi ro thấp: chỉ là bài thử kiểm chưa đủ rộng, không có dữ liệu bị mất và các bài thử khác cùng chặn việc ghi trước khi áp; ghi lại là hạn chế đã biết.
  file: `src/components/candidate/data-region-paste.test.tsx`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

## Đã sửa trong hàng (mục mang sang từ vòng trước, không còn ở bản đã chấm)

Lượt chấm vòng 6 mang sang các mục dưới theo tên tệp, không kiểm lại; mỗi mục đã sửa ở commit ghi kèm và có bài kiểm đỏ khi phá. Không phải việc của chủ kho quyết.

- **[đã sửa] Hình dạng 2 — fixture viết tay đúng khuôn bên đọc: phép lấp dòng ngắn của lưới được chép lại thay vì gọi hàm thật của lưới (r5 · tệp đã đổi)**
  Đã sửa: 82ea4fd — bảng tổ hợp dựng ô bằng tileDataGridClipboardBlock của lưới.

- **[đã sửa] Hình dạng 5 — tuyên quét cả lớp nhưng chỉ có các ca điểm; phép đếm chỉ đếm chính danh sách ca (r5 · tệp đã đổi)**
  Đã sửa: 82ea4fd — thêm ba tổ hợp kết hợp (ghim hai bên, ẩn kèm ghim, đổi thứ tự kèm ẩn); chỗ còn yếu của bảng trục là Ngoài-1 mới của vòng 6.

- **[đã sửa] Short-row blanking maps block columns in the configured column order, not the order shown on screen, so a person who pins a column can lose real pasted values (r4 · tệp đã đổi)**
  Đã sửa: ddef774 — đối chiếu theo thứ tự cột lưới đang hiện; ca màn dong-ngan-cot-ghim đỏ «giá dán bị mất» khi phá.

- **[đã sửa] Hình dạng 4 (assertion âm tính một mình): «Xác nhận lúc» chỉ được kiểm là khác giá trị cũ (r3)**
  Đã sửa: 9cb62b7 — đồng hồ giả, ghim đúng giờ mới; lệch giờ áp 60 giây thì đỏ.
