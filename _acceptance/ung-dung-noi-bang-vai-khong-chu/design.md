# Thiết kế: ứng dụng nối cơ sở dữ liệu bằng vai đăng nhập không chủ (hàng 7c)

Ngày: 2026-11-13 · Dãy C · Hạng T3 · Luật chạm: SP-1 (chỉ siết, không nới).

## Vấn đề

Hôm nay ứng dụng nối cơ sở dữ liệu bằng chính vai chủ bảng (`postgres` trên máy dãy, vai chạy migration ở bản thật).
Cửa `withCompany` đổi sang vai API `quy_hang_app` trong từng giao dịch (`set local role quy_hang_app`), nên luật theo dòng
áp. Nhưng vai của phiên vẫn là vai chủ: mã nào trong cửa chạy `reset role` hay `set role <chủ>` là về lại vai chủ, đọc ghi
được mọi sàn. Hàng 7a chỉ chặn được câu viết thẳng trong mã (bộ quét một cửa, luật 3); câu dựng động, thư viện bên
thứ ba, hay một lỗi tiêm câu lệnh vẫn lọt. Gốc của mục Ngoài-5 hàng 7 nằm ở vai đăng nhập: phải xong trước hàng 10
(nối dữ liệu thật).

## Hướng chọn

1. **Vai đăng nhập mới `quy_hang_login`** (migration 008): đăng nhập được, không siêu người dùng, không tạo vai, không tạo
   cơ sở dữ liệu, không nhân bản, không vượt luật theo dòng; là thành viên DUY NHẤT của `quy_hang_app`, với quyền đổi sang
   (`SET TRUE`) nhưng không kế thừa (`INHERIT FALSE`) và không quản (`ADMIN FALSE`). Không sở hữu gì, không có quyền
   thẳng trên bảng hay hàm nào. Mật khẩu không vào kho: migration tạo vai không mật khẩu; máy dãy đặt mật khẩu
   `local-only` (cùng lệ với vai `postgres` của container), bản thật do chủ kho đặt ngoài kho.
2. **Mã trong cửa đổi vai cũng không về được vai chủ** — đúng nghĩa Postgres: `reset role` trả về vai của phiên
   (`quy_hang_login`, không quyền gì vì không kế thừa); `set role <chủ>`, `set role quy_hang_identity`,
   `set session authorization` bị từ chối vì vai đăng nhập không phải thành viên và không phải siêu người dùng.
3. **Cửa tự kiểm vai nối** (Hỏi-1): lần dùng đầu của mỗi pool, `withCompany` đọc danh mục hệ thống dưới vai của phiên và
   TỪ CHỐI chạy nếu vai ấy là siêu người dùng, vượt được luật theo dòng (thẳng hay qua vai nó là thành viên), là thành
   viên (trực tiếp hay gián tiếp) của vai chủ một bảng hay hàm nào ở schema không phải hệ thống, hoặc không đổi được sang
   `quy_hang_app`. Thông điệp nêu tên vai và lý do, không nêu chuỗi nối. Một lần đạt thì nhớ cho pool ấy; từ chối thì lần
   sau kiểm lại (sửa cấu hình không phải khởi động lại vẫn thấy).
4. **Bộ kiểm cách ly** thêm ba ca và một ca phá, trong hai tệp SQL mới để không đụng `db/tests/cach-ly.sql` (hàng 2c sửa
   tệp ấy):
   - `db/tests/vai-dang-nhap.sql` — ca `vai-dang-nhap-khong-ve-chu`: đọc danh mục dưới vai chủ, kiểm mọi thuộc tính ở mục 1
     và tập vai `quy_hang_login` với tới được (thành viên, `MEMBER`) đúng bằng {chính nó, `quy_hang_app`}; quyền hiệu lực của
     nó (tính cả quyền của mọi người và quyền mặc định của hàm) không gồm bảng nào và chỉ gồm hàm `quy_hang_app` cũng chạy
     được — tập ấy đã được ca `ham-dac-quyen-trong-danh-sach` của hàng 7a duyệt.
   - `db/tests/vai-dang-nhap-phien.sql` — chạy trên một kết nối ĐĂNG NHẬP BẰNG `quy_hang_login` (ổ cắm cục bộ của
     container; khi `PSQL` đặt thì phải có `PSQL_LOGIN`): ca `dang-nhap-khong-ve-vai-chu` (bốn lối đổi vai bị từ chối;
     sau `reset role` đọc bảng sàn bị từ chối) và ca đối chứng `dang-nhap-qua-cua-doc-duoc` (đúng hai câu của cửa rồi đọc
     thấy đúng một thoả thuận của sàn A trên cơ sở nháp có hai sàn, mỗi sàn một thoả thuận).
   - Ca phá `pha-thu-vai-dang-nhap`, bảy tệp phá trong `db/tests/pha-thu/`: cấp vai chủ, cấp vai danh tính, đổi lời cấp
     sang kế thừa, cho vai đăng nhập sở hữu bảng thoả thuận, cho vai đăng nhập vượt luật theo dòng, cấp thẳng quyền đọc
     bảng thoả thuận, cấp riêng quyền chạy một hàm chạy bằng quyền chủ. **Mỗi tệp chạy trong một giao dịch rút lại** cùng ca danh mục (`begin; <tệp phá>; <ca>; rollback`),
     vì vai và lời cấp vai thuộc cả cụm Postgres: commit thì mọi cơ sở nháp đang chạy song song trên dãy thấy bản phá. Sau
     bảy tệp, bộ chạy chạy lại ca danh mục: còn dấu phá trên cụm thì ca phá đỏ.
5. **Mọi bài cơ sở dữ liệu nối bằng vai ấy**: `tests/db/helpers.ts` cho mỗi cơ sở nháp thêm `appUrl` (vai
   `quy_hang_login`), đặt mật khẩu `local-only` sau khi áp migration; mọi pool của sản phẩm trong bài kiểm (`createPool`,
   pool thô của ca đổi vai đồng thời) và máy chủ dev của bài trình duyệt có cơ sở dữ liệu (`DATABASE_URL`) dùng
   `appUrl`. Dữ liệu mẫu vẫn ghi bằng vai chủ (như hôm nay). Một bài quét giữ luật này: không tệp nào dưới `tests/db`,
   `tests/e2e-db` hay `playwright.db.config.ts` đưa chuỗi nối vai chủ cho pool sản phẩm hay `DATABASE_URL`.
6. **Máy dãy**: `make db-up` in cả chuỗi nối vai chủ (migration, dữ liệu mẫu) lẫn chuỗi nối của ứng dụng; đích mới
   `make db-login` đặt mật khẩu `local-only` cho `quy_hang_login` trên container của dãy (chỉ container). `.env.example`
   thêm dòng (không sửa dòng cũ): chuỗi nối mẫu bằng `quy_hang_login`, biến `PSQL_LOGIN` cho hàng 1s.

## Vai dùng chung cả cụm

Vai và lời cấp vai thuộc cả cụm Postgres của dãy, mà mỗi cơ sở nháp đều áp migration 008 và lượt chấm chạy song song:
migration chỉ tạo vai khi chưa có, cấp lại thì Postgres chỉ báo; không bao giờ đặt mật khẩu. Bộ trợ giúp bài kiểm thử nối
bằng `quy_hang_login` trước, chỉ đặt mật khẩu khi chưa nối được, và thử lại khi Postgres báo sửa đồng thời. Cửa không có
tham số nào tắt bước kiểm; bài đơn vị chứng chiều đỏ bằng một cửa giả trong tệp bài.

## Lối đã bỏ

- Ép bộ kiểm cách ly cũ (20 ca SQL) chạy hẳn dưới vai đăng nhập: các ca dựng dữ liệu và hàm tạm bằng vai chủ trong cùng
  phiên, rồi đổi vai bằng câu của cửa. Đổi sang hai kết nối là viết lại cả bộ. Câu `set local role` từ phiên vai chủ
  không chứng gì về thành viên (Postgres xét quyền đổi vai theo vai của phiên, mà vai chủ là siêu người dùng), nên lối
  «`set role quy_hang_login` rồi chạy bộ cũ» là đo giả. Thay bằng ca phiên thật ở mục 4.
- Ca phá commit thẳng lời cấp vai: rò sang các lượt chạy song song trên cùng cụm (mục 4).
- Vai riêng cho từng sàn: ngoài ý định, nhân vai theo số sàn; luật theo dòng đã cách ly.

## Ra khỏi kho (việc của chủ kho, nêu ở PR)

- Bản thật (hàng 10): đặt mật khẩu cho `quy_hang_login` trên cơ sở dữ liệu thật và đổi `DATABASE_URL` của máy chủ sang
  vai ấy. Cửa sẽ từ chối chuỗi nối vai chủ (Hỏi-1).
- CI (hàng 1s): khi CI có Postgres, đặt `PSQL_LOGIN` (lệnh psql nối bằng `quy_hang_login`) và mật khẩu của vai ấy trên
  Postgres của CI. Không sửa `.github/workflows/` ở hàng này.

## Đặc tả UX

Không có — hàng không chạm giao diện (dòng `descope` «bỏ đặc-tả-UX» trong sổ).
