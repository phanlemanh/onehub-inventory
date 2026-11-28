-- 015_vai_danh_tinh_tam_quyen_tao.sql · Cho 016 và 019 (hàng 11, nhap-excel) chạy được khi vai chủ không phải siêu vai,
-- như Supabase. Cùng lối với quyết định 0052.
--
-- Tệp mang số 015 để chạy sau 015_nhap_excel.sql và TRƯỚC 016 (sắp theo tên). 016 và 019 giao hàm
-- app.import_list_agents() cho vai quy_hang_identity; ngoài siêu vai, Postgres 16+ chỉ cho đổi chủ khi vai mới có quyền
-- CREATE trên schema chứa hàm. 004 đã thu quyền ấy sau 002, 003; hai migration của hàng 11 đã commit nên không sửa — tệp
-- này cấp lại tạm, 020 thu lại. Điều (1) của 0052 — vai chủ được SET sang vai danh tính — 001 đã cấp và vẫn còn.
-- Trên siêu vai (máy dãy, CI) trạng thái cuối giống hệt lúc chưa có hai tệp. Chạy hai lần không áp gì thêm.

grant create on schema app to quy_hang_identity;
