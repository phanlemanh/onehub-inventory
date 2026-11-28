-- 004_thu_quyen_tao_cua_vai_danh_tinh.sql · Thu lại quyền CREATE mà 001_vai_chu_khong_sieu_cap.sql tạm cấp cho vai
-- quy_hang_identity, sau khi 002 và 003 đã chuyển hàm sang vai ấy (quyết định 0052). Vai danh tính chỉ sở hữu hàm,
-- không tạo được gì trên schema nào. Trên máy đã có 002..014 từ trước, hai tệp này chạy liền nhau ở cuối: thêm rồi thu.

revoke create on schema app from quy_hang_identity;
revoke create on schema identity from quy_hang_identity;
alter default privileges revoke create on schemas from quy_hang_identity;
