# Thiết kế: bộ kiểm cách ly bắt thêm tám kẽ hở trước khi nối dữ liệu thật (hàng 7a)

Ngày: 2026-11-12 · Dãy C · Hạng T3 · Luật chạm: SP-1 (siết, không nới).

## Vì sao

Ở Cổng Bằng chứng của hàng 7, chủ kho chọn «mở hợp đồng mới» cho tám mục ngoài hợp đồng (Ngoài-1, 4, 5, 6, 14, 19, 20,
30 trong `_acceptance/cach-ly-moi-san/review-findings.md`). Tám mục gộp lại thành năm kẽ hở thật:

| Kẽ hở | Mục của hàng 7 | Hậu quả cho sàn |
|---|---|---|
| K1 · Quyền xoá sạch bảng (và quyền gắn trigger, khoá ngoại) cấp nhầm cho vai của API | Ngoài-4, 6, 20 | Một sàn xoá sạch dữ liệu của mọi sàn; luật theo dòng không áp cho lệnh xoá sạch |
| K2 · Dạng xem, hàm đặc quyền, bảng ở schema khác vượt luật theo dòng | Ngoài-4, 14, 19 | Một sàn đọc dữ liệu của mọi sàn qua đường vòng, bộ kiểm vẫn xanh |
| K3 · Mã trong cửa tự đổi vai hay đổi sàn | Ngoài-5 | Mã nghiệp vụ viết sai tự chuyển sang sàn khác ngay trong cửa |
| K4 · Không có ca chứng sàn ghi được dòng của chính mình | Ngoài-30 | Một lỗi chặn mọi lần ghi lọt qua, bộ kiểm vẫn xanh |
| K5 · Bảng thoả thuận lệch mô hình nghiệp vụ | Ngoài-1 | Hai loại thoả thuận hợp lệ bị bảng từ chối khi lưu; mô hình không biết hai luật bảng đang áp |

## Cách làm

Giữ nguyên khuôn của hàng 7: bộ kiểm SQL chạy dưới vai của API bằng đúng câu của cửa, mỗi ca in `ok <ca>` đúng một lần,
mỗi ca mới có ít nhất một tệp phá thử làm bộ kiểm đỏ với dòng ghim. Kiểu kiểm là **danh sách cho phép**, không phải dò
mẫu xấu: thứ gì vai của API chạm được mà không nằm trong dạng cho phép thì đỏ, nên một kiểu đường vòng mới phải có một
dòng cố ý trong danh sách.

1. **Sàn ghi được dòng của mình (K4)** — ca `a-ghi-duoc-dong-cua-minh`: sàn A thêm một thoả thuận đứng tên A và sửa
   thoả thuận của A; mỗi lệnh chạm đúng một dòng và dòng đọc lại được dưới vai của API. Bản phá: rút quyền thêm của vai.
2. **Không quyền nguy hiểm (K1)** — ca `vai-api-khong-quyen-nguy-hiem`: trên MỌI bảng, dạng xem ở mọi schema không phải
   hệ thống, vai của API không có TRUNCATE, TRIGGER, REFERENCES — kể cả nhận qua PUBLIC hay qua vai mẹ (đọc bằng
   `has_table_privilege`, gồm cả hai đường ấy); và lệnh xoá sạch bảng thoả thuận dưới vai của API bị từ chối. Bản phá:
   cấp xoá sạch cho vai; cấp gắn trigger cho PUBLIC.
3. **Chỉ chạm bảng có luật (K2, schema khác, bảng mới)** — ca `vai-api-chi-cham-bang-co-luat`: mọi bảng (thường, phân
   vùng, ngoại) mà vai của API có bất kỳ quyền nào, ở BẤT KỲ schema nào, phải bật và ép luật theo dòng; vai không có
   quyền tạo ở schema nào và không vào được schema danh tính. Ca 12–13 của hàng 7 chỉ quét schema `public`; ca này
   đóng chỗ hở ấy từ phía quyền của vai. Bản phá: bảng có cột sàn ở một schema mới, không luật, cấp cho vai; bảng ở
   `public` không có cột sàn, không luật, cấp cho vai.
4. **Dạng xem không vượt luật (K2)** — ca `dang-xem-khong-vuot-luat`: mọi dạng xem vai của API đọc được phải chạy theo
   quyền người đọc (`security_invoker`), nên luật theo dòng của bảng bên dưới vẫn áp; dạng xem vật chất hoá không được
   cấp cho vai (nó không có luật theo dòng). Bản phá: dạng xem thường trên bảng thoả thuận; dạng xem vật chất hoá.
5. **Hàm đặc quyền trong danh sách (K2)** — ca `ham-dac-quyen-trong-danh-sach`: mọi hàm chạy bằng quyền người tạo mà vai
   của API gọi được (trực tiếp hay qua PUBLIC) hoặc mà một trigger trên bảng vai chạm được gọi tới, phải nằm trong danh
   sách viết tay — tên, schema, chủ — và ghim đường tìm. Danh sách hiện có đúng 10 hàm đăng nhập và thành viên của
   hàng 8, 9, chủ là `quy_hang_identity` (quyết định trong sổ hồ sơ `dang-nhap-ma-email`); ca khẳng định đủ 10. Bản phá:
   hàm đặc quyền mới đếm thoả thuận, gọi được qua PUBLIC; hàm trigger đặc quyền gắn vào bảng thoả thuận.
6. **Mã trong cửa không đổi vai, đổi sàn (K3, đóng một phần)** — luật quét thứ ba của bài quét một cửa: không tệp nào ngoài cửa chứa câu
   đổi vai (`set role`, `reset role`, `set session authorization`, `reset all`, `discard all`) hay đặt biến của phiên
   (`set_config(`, `set app.…`). Đối chứng: tệp sạch đi qua cửa không bị nêu; ma trận mỗi dạng một tệp phá, mỗi tệp
   bị nêu đúng dòng.
7. **Bảng thoả thuận khớp mô hình (K5)** — bài kiểm cơ sở dữ liệu mới `tests/db/cach-ly.db.test.ts`: tập giá trị
   loại, chiều, trạng thái mà bảng nhận bằng đúng tập của mô hình (đọc từ `ontology/entities/Agreement.yaml`); mỗi ràng
   buộc kiểm thêm của bảng ứng với một luật có tên trong mô hình. Bản phá: mô hình thêm một loại bảng không nhận; bảng
   có ràng buộc kiểm mới mà mô hình không ghi.

Bộ chạy `db/scripts/cach-ly.sh` đăng ký năm ca SQL mới và năm ca phá thử mới; dòng tổng của bản lành thành
`cach-ly: 29 ca đạt, vai quy_hang_app` (19 cũ + 5 ca SQL + 5 ca phá). Bộ chạy nhận thêm biến `TESTS_DIR` (như
`MIGRATIONS_DIR` đã có) để bài kiểm cơ sở dữ liệu chạy nó trên một bản sao thư mục kiểm mang ba chỗ hỏng — tệp phá bị
xoá, tệp phá không còn làm đỏ, tệp phá lỗi cú pháp — và khẳng định bộ chạy nêu đúng ba tệp ấy.

Mỗi ca quét có đối chứng dương trong cùng ca: ca dạng xem tạo tạm một dạng xem chạy theo quyền người đọc rồi khẳng định
nó không bị nêu; ca hàm đặc quyền ghi cạnh từng hàm trong danh sách mã dòng sổ chủ kho đã duyệt nó (hàng 8:
`dang-nhap-ma-email#d-20261111T052230Z-14`, hàng 9: `moi-nguoi-gan-vai#d-20261111T084753Z-14`) — hàm thứ 11 phải có
chữ chủ kho mới.

## Câu hỏi cho chủ kho (Hỏi-1)

Mô hình cho tám loại thoả thuận, bảng chỉ nhận sáu (thiếu «xử lý bằng AI» và «xác nhận danh mục»); bảng áp hai luật mà
mô hình chưa ghi (lớp «nguồn» không rời sàn; dữ liệu nội bộ chỉ đi chiều vào). Máy khuyên: **bảng nhận đủ tám loại, và
ghi hai luật vào mô hình như luật của bảng chép từ Quỹ hàng** — vì Quỹ hàng đã nới đúng hai loại này ở migration 035 và
040, mô hình là nguồn sự thật của kho, và hai luật ấy chặn chặt hơn chứ không nới; quyết định 0014 bỏ trần lớp dữ liệu
khỏi luật sản phẩm nhưng không đòi gỡ chốt ở bảng (chủ kho đã ghi điều đó là giới hạn đã biết ở hàng 7, Ngoài-12, 18).
Lối khác: rút mô hình về sáu loại (rẻ, nhưng hàng nhập bằng AI và hàng xác nhận danh mục sau này phải mở lại mô hình);
gỡ hai luật khỏi bảng (theo đúng chữ 0014, nhưng nới một chốt trước khi có dữ liệu thật).

Theo lối khuyên: migration `005_thoa_thuan_du_loai.sql` chỉ thay ràng buộc loại của bảng thoả thuận cho đủ tám loại
(xếp sau 004 của hàng 9a, giám sát duyệt ở C-1211-2); `Agreement.yaml` thêm hai luật kèm `implemented_in`; wiki thực
thể và `make gen` theo đó.

## Thứ không đo chắc bằng máy (ghi trên thẻ)

- Luật quét một cửa chỉ bắt câu viết thẳng trong mã nguồn. Câu đổi vai ghép lúc chạy (nối chuỗi, đọc từ tệp) không bị
  bắt. Chỗ hở gốc là vai đăng nhập của ứng dụng: hiện ứng dụng nối bằng vai chủ, nên `reset role` trong cửa đưa thẳng
  về vai chủ. Đóng tận gốc là đổi vai đăng nhập cho dữ liệu thật — việc riêng, đề xuất thành hàng lộ trình.
- Luật viết lại câu (CREATE RULE) và trigger sự kiện chạy bằng quyền chủ bảng; bộ kiểm không quét hai thứ này.
- Bộ kiểm vẫn chạy trên Postgres của dãy, chưa chạy trên CI (Ngoài-3 của hàng 7, chủ kho ghi giới hạn đã biết).

## Đặc tả UX

Bỏ — hàng không có màn (xem sổ quyết định).
