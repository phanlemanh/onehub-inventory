---
type: decision
title: Thu quyền của các vai khoá công khai Supabase trên mọi đối tượng của kho
links:
  [
    wiki/decisions/0041-ban-that-o-dia-chi-rieng.md,
    db/migrations/014_thu_quyen_vai_cong_khai.sql,
    tests/db/thu-quyen-vai-cong-khai.db.test.ts,
    db/scripts/cach-ly-dich.sh,
    db/scripts/migrate.sh,
    tests/db/migrate-vai-khong-sieu.db.test.ts,
  ]
sources: [_acceptance/moi-truong-thu-va-ban-that/contract.md]
---

# 0044 Thu quyền của các vai khoá công khai Supabase trên mọi đối tượng của kho

## Status

Accepted, 2026-11-17. Chủ kho duyệt kế hoạch việc phụ VP6 của hàng 22 «Môi trường thử và bản thật».

## Context

Bản thử và bản thật chạy trên Postgres của Supabase. Ở đó vai `postgres` (vai chạy migration) có quyền mặc định: mỗi
bảng, chuỗi số và hàm mới ở schema `public` tự cấp ALL cho `anon`, `authenticated`, `service_role`, và ba vai ấy được
dùng schema `public`. Đó là các vai đứng sau khoá công khai của Data API. Nghĩa là mọi bảng migration của kho tạo ra
đều đọc được, ghi được qua khoá công khai, không cần đi qua cửa `withCompany`. Luật theo dòng vẫn ép buộc, nhưng
`service_role` vượt luật theo dòng, và chính việc có quyền trên bảng đã là cửa thứ hai vào dữ liệu của sàn — trái
SP-1 (các sàn tách biệt, một cửa duy nhất).

Ngoài ra, cho tới migration 013, hai thứ của ứng dụng còn đi qua PUBLIC (mọi vai, gồm cả ba vai khoá công khai):
quyền dùng schema `public`, và quyền gọi `app.current_company_id()` của các hàm security definer thuộc
`quy_hang_identity`.

## Decision

Migration 014 (`db/migrations/014_thu_quyen_vai_cong_khai.sql`):

- Cấp thẳng những gì ứng dụng trước nay chỉ có nhờ PUBLIC: dùng schema `public` cho `quy_hang_app`,
  `quy_hang_identity` và `quy_hang_login`; gọi `app.current_company_id()` cho `quy_hang_identity`. Vai đăng nhập giữ
  quyền dùng schema để mã trong cửa lỡ `reset role` vẫn bị từ chối bằng «không có quyền trên bảng» như trước; quyền
  dùng schema không mở bảng nào.
- Thu mọi quyền của PUBLIC, `anon`, `authenticated`, `service_role` trên bảng (kể cả quyền theo cột), chuỗi số, hàm và
  schema ở ba schema của kho: `public`, `app`, `identity`. Thu từng đối tượng, nhân danh chủ của nó, nên cả các hàm
  thuộc `quy_hang_identity` cũng được thu.
- Thu quyền mặc định của vai chạy migration, và của `postgres` khi khác vai ấy, cho ba vai khoá công khai: cả tầng chung
  lẫn từng schema của kho.
- KHÔNG thu quyền mặc định «PUBLIC gọi hàm mới». Postgres không cho thu quyền chung ấy theo từng schema, và thu ở tầng
  chung thì hàm tạm (`pg_temp`, bộ kiểm cách ly dùng) và hàm extension do vai chạy migration tạo cũng hết gọi được —
  bộ kiểm cách ly đỏ ngay khi thử. Ba vai khoá công khai không còn dùng được schema nào của kho, nên không với tới hàm
  dù PUBLIC gọi được.
- Cuối migration tự kiểm: còn vai khoá công khai nào có quyền, hay PUBLIC còn gọi được hàm nào của kho, thì báo lỗi và
  huỷ cả migration.
- Vai nào trong ba vai không có (Postgres thường của CI và các dãy) thì bỏ qua, không lỗi.
- Không vai khoá công khai nào giữ lại quyền gì: ứng dụng không dùng Data API.

Bài kiểm `tests/db/thu-quyen-vai-cong-khai.db.test.ts` chạy trên cụm Postgres riêng của nó, dựng như Supabase (ba vai,
quyền mặc định, quyền dùng `public`): đủ migration thì không còn quyền nào và `cach-ly-dich.sh` xanh; đối tượng tạo sau
014 không mở lại; chỉ tới 013 thì đỏ, gọi tên bảng và vai.

## Consequences

- Chủ kho nên tắt luôn Data API của dự án Supabase. Migration đóng quyền, còn tắt Data API thì cổng không còn mở.
- Migration 015 trở đi không cần cấp hay thu gì cho ba vai khoá công khai.
- Hàm mới vẫn sinh ra với PUBLIC gọi được: migration tạo hàm giữ thói quen `revoke all on function ... from public` rồi
  cấp thẳng cho vai cần gọi (như các migration trước vẫn làm).
- Bảng mới ở schema `public` không còn quyền dùng schema qua PUBLIC: vai mới của ứng dụng cần `grant usage on schema
public` thẳng.
- Quyền mặc định của các vai khác do Supabase quản (ví dụ `supabase_admin`) không đổi: migration của kho không chạy
  bằng các vai ấy.
- Một schema mới của kho phải được thêm vào danh sách schema của bài kiểm và của lần thu quyền kế tiếp.
- Trên Supabase, `postgres` không phải siêu vai: migration thu quyền trên hàm của `quy_hang_identity` bằng cách đổi sang
  vai ấy khi chỉ đổi được mà không kế thừa. Nay `migrate.sh` cho vai chạy migration kế thừa luôn (mục dưới), nên nhánh
  đổi vai ấy chỉ còn là lưới. Nếu `postgres` không với tới chủ của một đối tượng, bước tự kiểm sẽ huỷ migration và gọi
  tên đối tượng.

## Vì sao Supabase khác CI

Ngày 2026-11-17, lần đầu chạy migration trên bản thử Supabase: 001 áp xong, 002 huỷ ở câu đổi chủ hàm sang
`quy_hang_identity` với lỗi «must be able to SET ROLE». Các dãy và CI chạy migration bằng siêu vai nên chưa từng gặp.

- Supabase chạy Postgres 17, và vai `postgres` ở đó không phải siêu vai: chỉ có quyền tạo vai (CREATEROLE) và vượt luật
  theo dòng (BYPASSRLS). Từ Postgres 16, vai tạo vai chỉ được quyền quản (ADMIN) trên vai mình tạo, không được đổi sang
  (SET) hay kế thừa (INHERIT), trừ khi đặt `createrole_self_grant`.
- Khi trao một hàm cho vai khác, Postgres đòi hai điều mà siêu vai được miễn: vai chạy migration đổi sang được chủ mới,
  và chủ mới có quyền tạo (CREATE) trong schema của hàm. Lỗi thứ hai lộ ngay sau khi sửa lỗi thứ nhất.
- Chỉ đổi sang được mà không kế thừa thì chưa đủ: câu cấp và thu quyền ngay sau mỗi lần đổi chủ
  (`grant execute ... to quy_hang_app`) chạy nhân danh vai chạy migration, vai ấy cần quyền của chủ; thiếu thì Postgres
  chỉ cảnh báo rồi bỏ qua, và ứng dụng không gọi được hàm đăng nhập. Bài kiểm có ca đối chứng cho đúng điều này.

Nên `db/scripts/migrate.sh`, chỉ khi vai chạy migration không phải siêu vai và Postgres từ 16 trở lên (siêu vai, các
dãy và CI không đổi gì):

1. Trước khi áp, vá trạng thái cũ: các vai của kho (các câu `create role` trong migration) đã có mà vai chạy migration
   có quyền quản nhưng chưa đổi sang hay chưa kế thừa được — do `migrate.sh` cũ tạo, như `quy_hang_app` trên bản thử —
   được cấp lại cho vai chạy migration, có SET và INHERIT. Cấp lại khi đã có thì không đổi gì.
2. Mỗi phiên migration đặt `createrole_self_grant = 'set, inherit'`, nên vai mới tạo cũng như thế.
3. Trong chính giao dịch của mỗi migration, mỗi vai mà tệp ấy trao đối tượng cho (`owner to <vai>`) được mượn quyền
   tạo trong các schema của kho (các câu `create schema`) mà nó chưa có, rồi bị thu đúng phần ấy trước khi giao dịch
   xong. Vai đã có thì được mượn thẳng. Chỉ khi vai được tạo ngay trong chính tệp ấy (002 tạo `quy_hang_identity` rồi
   trao hàm cho nó), lúc giao dịch bắt đầu vai chưa có để cấp, nên PUBLIC mượn thay.
4. Sau mỗi migration, `migrate.sh` đọc lại quyền tạo trên các schema của kho: có vai nào mới có mà trước migration chưa
   có, hay PUBLIC có ở bất kỳ schema nào, thì dừng với mã 3 và một dòng gọi tên vai và schema. Lưới này chạy cả với
   siêu vai.

Phiên khác không bao giờ thấy quyền cho mượn, vì nó không bao giờ được ghi hẳn: migration hỏng thì cả giao dịch huỷ,
quyền mượn huỷ theo. Sau migration, quyền trên schema y như khi siêu vai chạy.

Quyền tối thiểu: vai chạy migration không được thêm gì nó chưa tự cấp được (nó đã có quyền quản các vai ấy), và
`quy_hang_identity` vốn vượt luật theo dòng như chính `postgres` của Supabase. Quyền tạo chỉ cho mượn tới đúng vai sắp
nhận đối tượng; PUBLIC chỉ mượn khi vai ấy chưa có để cấp.

Bài kiểm `tests/db/migrate-vai-khong-sieu.db.test.ts` chạy trên cụm riêng (Postgres 16, đã có luật của Postgres 16)
với một vai dựng như `postgres` của Supabase:

- bản `migrate.sh` cũ đỏ ở 002 «must be able to SET ROLE»;
- trên cơ sở đã áp 001 bằng bản cũ, và trên cơ sở trống, bản nay áp hết tới 014, mọi quyền trên bảng, hàm, schema y như
  khi siêu vai chạy, `cach-ly-dich.sh` xanh;
- trong lúc áp, một phiên thứ hai hỏi liên tục ai có quyền tạo trên `app` và `identity`, PUBLIC và cả ba vai của kho:
  không lần nào thấy;
- migration hỏng giữa chừng: trong giao dịch thấy đúng PUBLIC (vai tạo trong tệp) và `quy_hang_identity` (vai đã có)
  mượn quyền, sau khi huỷ không ai còn quyền tạo;
- migration để lại quyền tạo cho một vai hay cho PUBLIC thì `migrate.sh` dừng, gọi tên schema;
- chỉ SET mà không INHERIT thì đỏ.
