-- 001_vai_chu_khong_sieu_cap.sql · Cho migration chạy được khi vai chủ không phải siêu vai — Supabase: vai postgres có
-- CREATEROLE và BYPASSRLS nhưng không SUPERUSER (Postgres 17). Quyết định 0052.
--
-- Tệp mang số 001 để chạy TRƯỚC 002 (sắp theo tên: sau 001_nen_cong_ty.sql, trước 002_). 002 và 003 chuyển các hàm hẹp
-- sang vai quy_hang_identity. Ngoài siêu vai, Postgres 16+ chỉ cho đổi chủ khi (1) người chạy được SET ROLE sang vai mới
-- — người tạo vai chỉ có quyền ADMIN trên nó — và (2) vai mới có quyền CREATE trên schema chứa hàm. Hai migration ấy đã
-- commit nên không sửa; tệp này chuẩn bị trước, 004 thu quyền CREATE lại. Trên siêu vai (máy dãy, CI) trạng thái cuối
-- giống hệt lúc chưa có hai tệp. Lần đầu đưa bản thử lên (28/11/2026) dừng ở 002: «must be able to SET ROLE
-- "quy_hang_identity"».

do $$
begin
  -- Y như 002: 002 thấy vai đã có thì bỏ qua.
  if not exists (select from pg_roles where rolname = 'quy_hang_identity') then
    create role quy_hang_identity nologin nosuperuser nocreatedb nocreaterole bypassrls;
  end if;
  -- (1) Vai chủ không siêu cấp được SET sang vai danh tính và mang quyền chủ của nó: đổi chủ ở 002, 003, cấp quyền
  -- trên hàm của vai ấy (003) và thay hàm của vai ấy (006). Siêu vai không cần nên không cấp.
  if not (select rolsuper from pg_roles where rolname = current_user) then
    execute format('grant quy_hang_identity to %I with set true, inherit true', current_user);
  end if;
end $$;

-- (2) Vai danh tính tạm có CREATE trên app (đã có) và trên schema 002 sắp tạo (identity); 004 thu lại cả hai.
grant create on schema app to quy_hang_identity;
alter default privileges grant create on schemas to quy_hang_identity;
