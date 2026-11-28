-- 020_thu_quyen_tao_sau_nhap_excel.sql · Thu lại quyền CREATE trên app mà 015_vai_danh_tinh_tam_quyen_tao.sql tạm cấp
-- cho vai quy_hang_identity, sau khi 016 và 019 (hàng 11) đã giao hàm app.import_list_agents() cho vai ấy. Vai danh
-- tính lại chỉ sở hữu hàm, không tạo được gì trên schema nào — như sau 004. Trên máy đã có 016..019 từ trước, hai tệp
-- này chạy liền nhau ở cuối: cấp rồi thu, không còn dấu gì. Chạy hai lần không áp gì thêm.

revoke create on schema app from quy_hang_identity;
