-- Bản phá (hàng 7c): cấp thẳng quyền đọc bảng thoả thuận cho vai đăng nhập. Chạy trong giao dịch rút lại.
grant select on public.agreements to quy_hang_login;
