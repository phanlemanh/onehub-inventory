---
type: decision
title: Thu quyền của các vai khoá công khai Supabase trên mọi đối tượng của kho
links:
  [
    wiki/decisions/0041-ban-that-o-dia-chi-rieng.md,
    db/migrations/014_thu_quyen_vai_cong_khai.sql,
    tests/db/thu-quyen-vai-cong-khai.db.test.ts,
    db/scripts/cach-ly-dich.sh,
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
  vai ấy khi chỉ đổi được mà không kế thừa. Chưa chạy được trên Supabase thật trong kho; nếu `postgres` không với tới
  chủ của một đối tượng, bước tự kiểm sẽ huỷ migration và gọi tên đối tượng.
