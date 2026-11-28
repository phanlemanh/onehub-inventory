# Migration chạy được bằng vai chủ không phải siêu vai — ghi chú thiết kế

Hồ sơ: `_acceptance/migration-vai-chu-khong-sieu-cap/`. PR #135. Ngày 2026-11-28. Quyết định:
`wiki/decisions/0052-migration-chay-bang-vai-chu-khong-sieu-cap.md`.

## Vấn đề

Lần đầu đưa bản thử lên (28/11/2026, Deploy run 46087008610), lệnh đưa bản lên nối được cơ sở dữ liệu của bản thử, áp
xong migration 001 rồi dừng ở 002: «must be able to SET ROLE "quy_hang_identity"». Giao dịch của 002 huỷ, tên miền không
đổi, người dùng chưa thấy gì.

Đọc trực tiếp bản thử ngày 28/11 (SQL chỉ đọc): Postgres 17.11; vai `postgres` không có SUPERUSER, có CREATEROLE, CREATEDB
và BYPASSRLS; sổ migration chỉ có `001_nen_cong_ty.sql`; chưa có vai `quy_hang_identity`. Mọi bộ kiểm của kho đều chạy
migration bằng siêu vai của container, nên chưa bộ nào thấy lỗi.

## Cách làm của PR

Hai migration mới, không sửa migration đã commit (luật kho; móc `guard-edits.sh` chặn):

- `001_vai_chu_khong_sieu_cap.sql` (sắp sau `001_nen_cong_ty.sql`, trước 002): tạo vai danh tính như 002 vẫn tạo; khi
  vai chủ không siêu cấp thì cấp vai ấy cho vai chủ với SET và INHERIT; tạm cho vai danh tính quyền CREATE trên schema
  `app` và, qua quyền mặc định, trên schema `identity` mà 002 sắp tạo.
- `004_thu_quyen_tao_cua_vai_danh_tinh.sql` (số trống sau 003): thu lại cả hai quyền CREATE và quyền mặc định.

Bài kiểm `tests/db/chu-khong-sieu-cap.db.test.ts` chạy trong bộ kiểm cơ sở dữ liệu của CI (Postgres 16).

## Vòng nghiệm thu chứng gì

Vòng không viết mã sản phẩm. Nó chứng PR đúng và an toàn, bằng một tệp đo riêng của hồ sơ
(`rang/kiem.mjs`) chạy trên một cụm Postgres riêng, lần lượt ở bản 17 (như Supabase) và bản 16 (như CI và máy dãy):

1. Đối chứng: bỏ hai tệp mới thì vai chủ giả Supabase dừng đúng ở 002 với đúng câu lỗi của bản thử.
2. Nối từ trạng thái bản thử: cơ sở chỉ mới áp `001_nen_cong_ty.sql` chạy lại thì áp nốt mọi tệp.
3. Cơ sở mới: vai chủ áp đủ chuỗi.
4. Trạng thái cuối (chủ và quyền của mọi bảng, hàm, schema, quyền mặc định) bằng bản siêu vai, trừ tên chủ; vai danh
   tính không còn quyền CREATE nào.
5. Cơ sở đã áp các tệp cũ từ trước (máy dãy): chạy lại chỉ áp hai tệp mới, ở cuối, theo thứ tự 001 rồi 004, trạng thái
   cuối không đổi.
6. Bộ kiểm cách ly chỉ đọc mà lệnh đưa bản lên chạy (`cach-ly-dich.sh`) xanh với vai chủ ấy; dữ liệu mẫu ghi bằng
   chính vai chủ ấy.
7. Vai và thành viên: thuộc tính mọi vai `quy_hang_*` và mọi thành viên nhắc tới chúng bằng một cụm thứ hai chỉ siêu
   vai chạy; vai chủ giữ đúng mức khai (ADMIN trên vai nó tạo, SET + INHERIT trên vai danh tính).

`--tu-kiem` chạy năm ca: vật lành xanh, và bốn bản phá phải đỏ với thông điệp ghim — thiếu 004 (vai danh tính còn quyền
CREATE), thêm một tệp chỉ cấp quyền khi vai không siêu cấp (lệch bản siêu vai), thiếu 001 khi vai danh tính đã có (002
dừng vì thiếu quyền trên schema `app` — nửa còn lại của 001; nửa SET ROLE là ca đối chứng), và một tệp chỉ cấp thêm
thành viên vai khi vai không siêu cấp (lệch cụm chỉ siêu vai).

Đọc bản thật ngày 28/11 (chỉ đọc): Postgres 17.11, vai `postgres` cùng bốn thuộc tính, chưa có sổ migration và chưa có
vai `quy_hang_*` — trạng thái «cơ sở mới» của ca 3.

Cộng thêm: bài kiểm sẵn có của PR chạy trên Postgres của dãy; phạm vi PR (`rang/pham-vi.mjs`: migration chỉ thêm, ngoài
hồ sơ chỉ đúng tệp của thiết kế, có tự kiểm); CI thật của PR (`rang/ci.mjs`: việc e2e-db chạy thật trên Postgres 16 ở
commit mã, và đầu nhánh xanh); ba lệnh chung của kho.

## Vì sao chèn số 001 và 004 thay vì thêm số cuối

002 và 003 cần sẵn hai thứ trước khi chạy: vai chủ được đổi sang vai danh tính, và vai danh tính có quyền CREATE trên
schema. `migrate.sh` áp theo thứ tự tên tệp, nên tệp chuẩn bị phải đứng trước 002 (một tệp 001 thứ hai, sắp sau
`001_nen_cong_ty.sql`), và tệp thu lại đứng sau 003 (số 004 còn trống). Số cuối (015) chạy sau 002, tức quá muộn. Tên
tệp mới, không trùng, không sửa tệp nào đã commit; điều lệch là nếp số tăng dần — Hỏi-2 ở Cổng Phạm vi.

Cơ sở đã chạy tới số cao hơn: máy dãy và CI (siêu vai) áp bù hai tệp ở cuối, không phải dựng lại — ca 5 đo đúng điều đó.
Bản thử dừng ở 002 nên chạy tiếp từ `001_vai_chu_khong_sieu_cap.sql`; bản thật chưa có gì nên chạy từ đầu.

## Vai chủ và luật cách ly sàn (SP-1)

SP-1 nói truy vấn của ứng dụng đi qua một cửa dưới vai không sở hữu bảng: `quy_hang_app`, nối bằng `quy_hang_login`. PR
không đổi hai vai ấy (ca 7). Vai chủ là vai chạy migration, vốn đã sở hữu mọi bảng và vượt luật theo dòng; PR chỉ cho
nó thêm thành viên SET + INHERIT của vai danh tính, vai chỉ sở hữu mười hàm hẹp. Bộ cách ly chỉ đọc mà lệnh đưa bản lên
chạy xanh dưới vai chủ ấy trên 16 và 17 (ca 6). Bộ cách ly đầy đủ của máy dãy và CI thì cần siêu vai: các ca của nó tự
đổi sang `quy_hang_app`, mà vai chủ không siêu cấp chỉ có ADMIN trên vai ấy (đo 28/11: 21/38 ca) — giới hạn của bộ kiểm,
không phải của bản chạy.

## Lối đã loại

- Sửa 002 và 003 cho chạy được bằng vai không siêu cấp: luật kho cấm sửa migration đã commit, và các máy đã áp chúng sẽ
  lệch nhau.
- Cho vai `postgres` của Supabase thành siêu vai, hay chạy migration bằng `supabase_admin`: Supabase không cho, và lệnh
  đưa bản lên chỉ có địa chỉ của vai chủ.
- Đổi ảnh Postgres của CI sang 17 ngay trong PR này: chạm `.github/workflows/` (máy không được gộp) và làm đỏ hai ca của
  `tests/db/cach-ly.db.test.ts` ghim câu báo của 16 — để một vòng riêng.

## Giới hạn

- Bộ cách ly đầy đủ `db/scripts/cach-ly.sh` không chạy được bằng vai chủ không siêu cấp (mục trên).
- Hai ca của `tests/db/cach-ly.db.test.ts` (bản phá `cap-ke-thua`) đỏ trên Postgres 17 vì ghim câu báo của 16; ngoài
  phạm vi PR, CI chạy 16 nên vẫn xanh.
- Không phép đo nào ở đây chạy trên chính Supabase: đặc điểm riêng của Supabase ngoài bốn thuộc tính của vai (schema hệ
  thống, phần mở rộng) chỉ lần đưa bản thử kế chứng được.

Vòng không chạm màn hình nào: không có đặc tả UX, không có bản bấm được.
