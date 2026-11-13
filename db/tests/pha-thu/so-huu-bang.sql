-- Bản phá (hàng 7c): vai đăng nhập sở hữu bảng thoả thuận — chủ bảng không bị luật theo dòng ép khi bảng không force.
-- Chạy trong giao dịch rút lại.
alter table public.agreements owner to quy_hang_login;
