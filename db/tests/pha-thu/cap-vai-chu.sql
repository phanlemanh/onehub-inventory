-- Bản phá (hàng 7c): cấp vai chủ bảng companies cho vai đăng nhập — mã trong cửa `set role <chủ>` là về lại vai chủ.
-- Chạy trong giao dịch rút lại (lời cấp vai thuộc cả cụm).
do $$
begin
  execute format('grant %I to quy_hang_login', (select relowner::regrole::text from pg_class where oid = 'public.companies'::regclass));
end $$;
