-- Bản phá (hàng 7c): một hàm chạy bằng quyền chủ, thu quyền của mọi người, chỉ cấp cho vai đăng nhập — sau `reset role`
-- mã trong cửa gọi nó là đọc được mọi sàn. Chạy trong giao dịch rút lại.
create function public.ham_chu_mau() returns bigint language sql security definer set search_path = public
  as $f$ select count(*) from public.agreements $f$;
revoke execute on function public.ham_chu_mau() from public;
grant execute on function public.ham_chu_mau() to quy_hang_login;
