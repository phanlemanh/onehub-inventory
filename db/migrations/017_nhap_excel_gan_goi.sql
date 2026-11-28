-- 017_nhap_excel_gan_goi.sql · Mỗi gói ghi của một lần nhập phải là một phần của đúng bảng người đã xem lúc mở (hàng 11,
-- hồ sơ nhap-excel, lượt chấm S4-r1 phát hiện t2): lúc mở ghi dấu vân tay của tên cột và lựa chọn, và dấu vân tay của từng
-- gói 200 dòng; gói nào lệch dấu, sai chỗ hay vượt số dòng đã mở thì máy chủ trả 409 và không ghi dòng nào (AC-6, AC-7).
-- Chỉ thêm hai cột; quyền và luật theo dòng của import_runs giữ nguyên (migration 015). Chạy hai lần không đổi gì.
alter table import_runs add column if not exists table_hash text check (char_length(table_hash) = 64);
alter table import_runs add column if not exists batch_hashes text[] check (cardinality(batch_hashes) between 1 and 25);
