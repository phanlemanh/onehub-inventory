# Thiết kế — Bảng hàng theo địa lý (hàng 2d)

## Vấn đề

Chủ kho 2026-11-12: đầu chủ nghĩ theo địa lý rộng → hẹp — dự án → phân khu → toà —, ở Sheet mỗi khu một tab và lọc bằng
cột. Bảng hàng hôm nay chỉ lọc được bằng cách gõ vào ô đầu cột Dự án, Toà; không có chỗ nào cho thấy sàn có hàng ở những
nơi nào, mỗi nơi bao nhiêu căn. Hàng này đặt cây dự án → phân khu → toà ở cột thứ hai của App Shell — chỗ chủ kho đã chốt
cho mục lục phụ của màn — kèm số căn, và nối cây với ô lọc cột thành một trạng thái lọc.

## Cách làm

- **Dữ liệu của cây.** Cây dựng từ chính các dòng Bảng hàng đang có (cùng dòng ô ⌘K đọc, hàng 3f) và chỗ đứng của từng toà
  trong danh mục căn của hàng 7d (dự án → phân khu → toà). Không thêm cách đọc dữ liệu nào (SP-1). Cây chỉ gồm nơi có ít
  nhất một căn trên Bảng hàng. Toà không thuộc phân khu nào (Ocean Park 2, 3) đứng thẳng dưới dự án. Toà danh mục không
  biết thì vẫn hiện, đứng thẳng dưới dự án của nó.
- **Một trạng thái lọc.** Chọn một nơi = điền ô lọc cột Dự án (và Toà khi là phân khu hay toà) bằng **tên trọn vẹn**. Phân
  khu điền cột Toà bằng danh sách các toà của nó — bảng không thêm cột Phân khu, giữ tám cột của hàng 2. Ô lọc hiện tên
  ngay dưới tiêu đề cột. Ngược lại, sửa ô lọc thì một nút sáng khi và chỉ khi tập dòng lọc ra bằng đúng tập dòng của nơi
  ấy (chữ gõ tay cũng vậy); không trùng nơi nào thì không nút nào sáng. «Xoá lọc» bỏ cả hai. Góc nhìn đã lưu (2c) lưu lọc cột nên giữ được lựa chọn địa lý.
- **Khớp trọn tên.** Luật lọc chung chỉ THÊM một kiểu: lọc là một danh sách tên (đến từ cây) thì khớp trọn tên; chữ gõ tay
  vẫn «chứa chữ» như cũ, ở Bảng hàng và Đã gửi. Lý do: «Park 1» không được lấy cả «Park 10», và phân khu cần «một trong
  các toà».
- **Địa chỉ.** Nơi đang chọn nằm trên địa chỉ (`?vung=`), nên tải lại hay chép đường dẫn mở lại đúng nơi; nút đang chọn là
  mục đang mở duy nhất của cột thứ hai (luật «một mục, không hai» của App Shell).
- **Cột thứ hai.** Mục của cột thứ hai được có mục con và số; cột vẽ một nhóm có mục con thành cây. Đây là cùng lối cắm mà 2c
  (góc nhìn) và 7e (Tuỳ chỉnh của sàn) dùng — danh sách mục do màn khai —, không mở lối cắm thứ hai. Màn khác dùng cột thứ
  hai (Đã gửi, Tuỳ chỉnh của sàn) không đổi.
- **Tên dài.** Ba dự án mẫu cùng mở đầu «Vinhomes Ocean …»; cắt chữ thì không phân biệt được (thấy ở bản đầu). Tên nơi xuống
  dòng trong cột, không cắt.

## Hai lối (Hỏi-1, câu chính của Cổng Phạm vi)

| Lối | Dáng | Số căn | Rất nhiều toà | Khối |
|---|---|---|---|---|
| A (khuyên) | Cây gập; chỉ mở nhánh đang chọn; tên dài xuống dòng | chữ số mờ cuối dòng | gọn — nhánh khác gập | ReUI Tree «Basic» (c-tree-1) |
| C | Cây có ô chọn, cộng/trừ; chọn nhiều toà một lúc | chữ số mờ cuối dòng | dài, cuộn trong cột | ReUI Tree «Permissions» (c-tree-7) |

Khuyên A: đọc được tên dài, gọn khi nhiều toà, chọn một nơi là một lần bấm. Giá: cây là kiểu mục khác các mục còn lại của
cột (chủ kho chốt ở 2c «cả cột thứ hai một kiểu mục») và thêm gói phụ thuộc `@headless-tree`.

**Đã loại — B, mục con gốc của cột** (bậc 1 của quyết định 0023, đúng kiểu mục 2c): luật lint của kho cấm đặt lớp chiều
cao, chữ lên mục gốc thanh bên; dựng đúng luật thì mục con lồng hai cấp ở cột 14 rem chỉ còn chừng mười chữ — «S..»,
«Vinhomes Oc…» (`figures/proto/b-phan-khu-cot.png`). Mở lại B cần thêm một cỡ «hai dòng» vào mục gốc của thanh bên, là sửa
`src/components/ui`, cấm theo luật riêng 11 của kho. Kẻ thụt lề của khối c-tree-2 cũng bỏ vì cần lớp tự chế lint cấm.

## Từ Quỹ hàng

Quỹ hàng chia mỗi khu một tab của Sheet thành góc nhìn lưu, không có cây và bỏ chữ «dự án» (gọi khu, toà, căn) —
`docs/tri-thuc/wiki/chu-de/bang-hang.md`. Giữ: ý «mỗi khu một chỗ bấm». Bỏ: gọi theo khu — kho này giữ
Dự án/Phân khu/Toà của RESO và danh mục 7d.

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: Bảng hàng → bấm một dự án, phân khu hay toà ở cột thứ hai → bảng còn đúng căn của nơi ấy, ô lọc Dự án/Toà hiện
  tên, nút sáng (điểm ra: bấm nơi khác, «Xoá lọc», hay «Tất cả hàng»).
- Biên: sàn chưa có căn nào → nhóm «Theo địa lý» không hiện nút nào và nói một câu; toà không thuộc phân khu đứng thẳng dưới
  dự án; tên dài xuống dòng; điện thoại: cây nằm trong ngăn App Shell, chọn xong ngăn đóng.
- Lỗi & quay lại: đường dẫn trỏ nơi không còn căn → bảng mở như thường, không nút nào sáng; lọc cột gõ tay không trùng nơi
  nào → không nút sáng; «Xoá lọc» về «Tất cả hàng».

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Bảng hàng (inventory) | Đầu chủ xem căn của một nơi | Cột thứ hai «Theo địa lý», ⌘K, đường dẫn / hồ sơ căn |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-inventory-cay-co-hang | Bảng hàng | Cây ba cấp, mỗi nút số căn | Bấm một nơi |
| ST-inventory-cay-dang-chon | Bảng hàng | Nút sáng, ô lọc Dự án/Toà hiện tên, chân bảng «x / 60 dòng» | Bấm nơi khác hay «Xoá lọc» |
| ST-inventory-cay-trong | Bảng hàng | «Chưa có căn nào trên Bảng hàng.» dưới «Theo địa lý» | Nhập hàng (hàng 11) |
| ST-inventory-loc-khong-trung | Bảng hàng | Lọc cột gõ tay, không nút nào sáng | Sửa ô lọc hay bấm một nơi |
| ST-inventory-dien-thoai | Bảng hàng | Cây trong ngăn App Shell; chọn xong ngăn đóng | Xem bảng đã lọc |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Bấm một nơi chỉ thay lọc Dự án, Toà; lọc khác đang bật giữ nguyên (Hỏi-2). Số căn đếm theo các lọc khác đang bật, không theo chính lọc Dự án/Toà; nơi còn 0 vẫn hiện, ghi 0 (Hỏi-3).
- Phím: Tab vào cây, mũi tên lên/xuống/trái/phải của khối Cây đi giữa các nơi và gập/mở, Enter mở nơi.
- Khổ: 1440, 1024 cột thứ hai rộng 14 rem như cũ; 414, 360 cây trong ngăn.

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| Tree (ReUI, c-tree-1 / c-tree-7) | dùng | cây của lối A hay C, cài bằng CLI |
| Danh sách mục cột thứ hai (nav-items) | mở rộng | mục có mục con và số; màn khai, cột vẽ |
| Ô lọc cột (candidate) | mở rộng | hiện danh sách tên; khớp trọn tên cho danh sách |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: cây ở cột thứ hai là danh sách nơi, bảng là chi tiết của nơi đang chọn; App Shell đã chốt cột thứ hai là mục lục phụ
của màn (hàng 1o) — luồng hiển nhiên, không tra thêm.

### 7. Thẻ việc

| Trường | Giá trị |
|---|---|
| Ai dùng | Đầu chủ |
| Việc chính | Xem và lọc căn của một dự án, phân khu hay toà |
| Tần suất | mỗi ngày nhiều lần |
| Số bản ghi | hàng trăm trở lên |
| Thiết bị | cả hai |
<!-- UX-SPEC-TEMPLATE>>> -->
