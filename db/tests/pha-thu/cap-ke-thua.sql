-- Bản phá (hàng 7c): lời cấp quy_hang_app đổi sang kế thừa — sau `reset role` vai đăng nhập vẫn mang quyền của vai API.
-- Chạy trong giao dịch rút lại.
grant quy_hang_app to quy_hang_login with inherit true;
