-- 008_vai_dang_nhap_ung_dung.sql · Vai đăng nhập của ứng dụng (hàng 7c, hồ sơ ung-dung-noi-bang-vai-khong-chu; SP-1).
-- Ứng dụng nối bằng quy_hang_login: không sở hữu gì, không quyền đặc biệt, chỉ là thành viên của quy_hang_app với quyền
-- đổi sang (SET) nhưng không kế thừa (INHERIT) và không quản (ADMIN). Cửa withCompany đổi sang quy_hang_app trong từng
-- giao dịch như cũ; mã trong cửa có `reset role` thì về quy_hang_login (không đọc được bảng nào), còn `set role` sang vai
-- chủ hay quy_hang_identity, `set session authorization` thì Postgres từ chối.
--
-- Vai thuộc cả cụm Postgres: tạo khi chưa có, cấp lại thì Postgres chỉ báo. Migration KHÔNG đặt mật khẩu — máy dãy đặt
-- `local-only` (make db-login, bộ trợ giúp bài kiểm), bản thật do chủ kho đặt ngoài kho.
do $$
begin
  if not exists (select from pg_roles where rolname = 'quy_hang_login') then
    create role quy_hang_login login noinherit nosuperuser nocreatedb nocreaterole noreplication;
  end if;
end $$;

grant quy_hang_app to quy_hang_login with inherit false, set true, admin false;
