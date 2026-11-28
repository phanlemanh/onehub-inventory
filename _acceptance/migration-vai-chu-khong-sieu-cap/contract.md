---
schema_version: 1
feature: Migration chạy được bằng vai chủ không phải siêu vai (Supabase, Postgres 17) — PR #135 thêm hai migration để lần đưa bản thử kế không dừng ở 002
slug: migration-vai-chu-khong-sieu-cap
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [config]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-28
design_doc: _acceptance/migration-vai-chu-khong-sieu-cap/design.md
---

# Acceptance Contract: migration-vai-chu-khong-sieu-cap

## Context

Lần đầu đưa bản thử lên (28/11/2026) dừng ở migration 002 vì trên Supabase vai `postgres` không phải siêu vai. PR #135
thêm `001_vai_chu_khong_sieu_cap.sql` và `004_thu_quyen_tao_cua_vai_danh_tinh.sql`, không sửa tệp cũ (quyết định 0052).
Thư mục `db/**` là hạng cao, nên bước kiểm cổng của PR đòi hồ sơ đã ký. Vòng không viết mã sản phẩm: nó chứng PR làm
được việc trên đúng loại vai và đúng bản Postgres của bản thử, và không đổi gì ở máy dãy, CI hay cơ sở đã có.

Source input: phiên `PROD · Kiểm nhanh ứng dụng bản thật`, theo lời chủ kho «Nếu không phải lỗi của tôi bạn tự hoàn thành
hết». Đọc bản thử ngày 28/11 (chỉ đọc): Postgres 17.11, vai `postgres` không SUPERUSER, có CREATEROLE, CREATEDB, BYPASSRLS;
sổ migration chỉ có `001_nen_cong_ty.sql`.

«Vai chủ giả Supabase» dưới đây là vai LOGIN NOSUPERUSER CREATEROLE CREATEDB BYPASSRLS trên một cụm Postgres riêng.

## Criteria

- AC-1: Given cụm Postgres 17 mới và vai chủ giả Supabase, When bỏ hai tệp mới rồi áp chuỗi `db/migrations/` bằng
  `db/scripts/migrate.sh`, Then lệnh dừng ở `002_dang_nhap_ma_email.sql` với «must be able to SET ROLE
  "quy_hang_identity"» và cụm không có vai `quy_hang_identity` (đối chứng: đúng lỗi của bản thử).
- AC-2: Given cùng cụm và vai ấy, When áp đủ chuỗi lên một cơ sở mới, và When một cơ sở chỉ mới áp `001_nen_cong_ty.sql`
  (đúng trạng thái bản thử) được chạy lại, Then cả hai thoát 0 và sổ `schema_migrations` của mỗi cơ sở bằng danh sách
  tệp migration.
- AC-3: Given hai cơ sở của AC-2, một cơ sở do siêu vai áp đủ trên cùng cụm, và một cụm thứ hai chỉ siêu vai chạy
  migration, When so (a) chủ và quyền của mọi bảng, view, chuỗi, hàm, kiểu, schema của `public`, `app`, `identity` và mọi
  quyền mặc định, (b) thuộc tính của mọi vai `quy_hang_*` và mọi thành viên nhắc tới chúng, Then (a) bằng nhau từng dòng
  sau khi thay tên vai chủ, vai danh tính không giữ quyền CREATE nào và không còn quyền mặc định nào; (b) bằng nhau từng
  dòng, trừ đúng các dòng của vai chủ đã khai: ADMIN (không SET, không INHERIT) trên mỗi vai nó tạo — mặc định của
  Postgres 16+ — và SET + INHERIT trên `quy_hang_identity`, do `001_vai_chu_khong_sieu_cap.sql` cấp và không thu lại.
- AC-4: Given cơ sở do siêu vai áp mọi tệp migration trừ hai tệp mới (máy dãy, CI cũ), When chạy lại `migrate.sh` với
  đủ tệp, Then lệnh chỉ áp `001_vai_chu_khong_sieu_cap.sql` rồi `004_thu_quyen_tao_cua_vai_danh_tinh.sql` (in đúng hai
  dòng ấy và «xong — 2 migration mới»), và trạng thái cuối bằng bản siêu vai của AC-3.
- AC-5: Given cơ sở vai chủ giả Supabase áp đủ (AC-2) — vai đăng nhập `quy_hang_login` do chính vai chủ ấy tạo qua
  migration 008 — và hai sàn mẫu do vai chủ ấy ghi, When chạy `db/scripts/cach-ly-dich.sh` với
  địa chỉ vai chủ ấy, Then lệnh thoát 0, không in gì ra lỗi, dòng cuối là «cach-ly-dich: <n> ca đạt».
- AC-6: Given PR #135, When liệt kê tệp đổi so với điểm rẽ của nhánh với `origin/main`, Then mọi tệp dưới
  `db/migrations/` là tệp thêm mới (không tệp đã commit nào bị sửa, đổi tên hay xoá), và ngoài hồ sơ `_acceptance/`, một
  tệp `wiki/log/` và hai trang máy vẽ chỉ có hai migration, bài kiểm và trang quyết định 0052.
- AC-7 (cross-layer): Given PR #135 trên GitHub, When đọc CI của nó (chỉ đọc), Then ở commit mã của PR việc e2e-db chạy
  thật (không dùng lại kết quả cũ) trên Postgres 16 với «ci-db: 6/6 bước đạt» và có chạy
  `tests/db/chu-khong-sieu-cap.db.test.ts`; ở đầu nhánh các việc quick, e2e, e2e-db xanh.
- AC-8: Given nhánh ở HEAD, When chạy `tests/db/chu-khong-sieu-cap.db.test.ts` trên Postgres 16 và AC-1..AC-5 trên
  Postgres 16, rồi các lệnh chung của kho (`make check`, `npm run build`, `make e2e`), Then tất cả thoát 0.

## Coverage

| Trục | Phần tử | AC |
| --- | --- | --- |
| Vai chạy migration | vai chủ giả Supabase · siêu vai (máy dãy, CI) | AC-1..AC-5 · AC-3, AC-4 |
| Bản Postgres | 17 (Supabase) · 16 (CI, máy dãy) | AC-1..AC-5 · AC-7, AC-8 |
| Trạng thái trước khi chạy | cơ sở mới (= bản thật, đọc 28/11) · bản thử (chỉ 001_nen) · đã áp mọi tệp cũ | AC-2 · AC-2 · AC-4 |
| Hai nửa của 001 | SET ROLE (AC-1 đối chứng) · CREATE tạm trên schema (bản phá của tự kiểm, E1t) | AC-1 · AC-3 |
| Trạng thái cuối | chủ · quyền · quyền mặc định · CREATE của vai danh tính · vai và thành viên | AC-3 · AC-4 |
| Cách ly sau khi áp | bộ chỉ đọc của lệnh đưa bản lên | AC-5 |
| Luật kho | migration chỉ thêm · PR gọn · kho xanh | AC-6 · AC-6 · AC-8 |

Mọi trục đều đã kiểm chứng: các trục liệt kê từ hai tệp 26 và 7 dòng, cộng ba trạng thái máy có thật đọc chỉ đọc ngày 28/11 (bản thử: chỉ `001_nen_cong_ty.sql`; bản thật Postgres 17.11: chưa có sổ migration, chưa có vai `quy_hang_*`).

## Out of scope

- Sửa migration đã commit, `governance/`, hay `.github/workflows/` (kể cả đổi ảnh CI sang Postgres 17).
- Hai ca đỏ của `tests/db/cach-ly.db.test.ts` trên Postgres 17 (bản phá `cap-ke-thua` ghim câu báo của 16).
- Chạy lại lệnh đưa bản thử lên: việc của chủ kho sau khi gộp.
- Đặc điểm riêng của Supabase ngoài bốn thuộc tính của vai (schema hệ thống, phần mở rộng): chỉ lần đưa bản kế chứng.

## Notes

- Vì sao hai tệp mang số 001 và 004 thay vì số cuối (015, 016): 002 và 003 cần sẵn vai danh tính cấp cho vai chủ và
  quyền CREATE tạm, nên tệp chuẩn bị phải chạy trước 002; `migrate.sh` áp theo thứ tự tên. Tên tệp mới, không trùng tệp
  nào; số không tăng dần là điểm lệch nếp đánh số (Hỏi-2 ở Cổng Phạm vi). Cơ sở đã chạy tới số cao hơn (máy dãy, CI) áp
  bù hai tệp ở cuối, không cần dựng lại (AC-4).
- Vai chủ và luật SP-1: luật nói truy vấn của ứng dụng đi qua một cửa dưới vai không sở hữu bảng (`quy_hang_app`, nối
  bằng `quy_hang_login`). Vai chủ là vai chạy migration, vốn đã sở hữu mọi bảng; PR chỉ cho nó thêm thành viên của vai
  danh tính (AC-3 b). Hai vai của cửa không đổi (AC-3 b) và bộ cách ly chỉ đọc của lệnh đưa bản lên xanh trên 16 và 17
  (AC-5, AC-8).
- Known limits (đề xuất, chủ kho chốt ở Cổng Bằng chứng):
  - Hai ca của `tests/db/cach-ly.db.test.ts` đỏ trên Postgres 17; CI chạy 16 nên không đỏ ở đây.
  - Bộ cách ly đầy đủ `db/scripts/cach-ly.sh` (bộ dựng cơ sở nháp của máy dãy và CI) không chạy được bằng vai chủ không
    siêu cấp: các ca tự đổi sang `quy_hang_app`, mà vai chủ chỉ có ADMIN trên vai ấy (đo 28/11: 21/38 ca). Lệnh đưa bản
    lên không chạy bộ ấy.
  - Phép đo chạy trên Postgres chính thức của Docker, không trên Supabase.
