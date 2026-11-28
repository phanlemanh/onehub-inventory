-- 018_nhap_excel_can_cho_theo_san.sql · Liên kết lần chào với căn chờ khớp ghép cả sàn (hàng 11, hồ sơ nhap-excel; lượt
-- chấm S4-r2 phát hiện t2, giám sát G-2711-32; bất biến SP-1 «sàn cách ly»). Khoá ngoại của migration 015 chỉ trỏ id
-- căn chờ, mà Postgres kiểm khoá ngoại không qua luật theo dòng: một lần chào của sàn A trỏ được căn chờ của sàn B nếu
-- tầng ứng dụng sai. Nay khoá ngoại là cặp (pending_unit_id, company_id) trỏ cặp (id, company_id) của căn chờ, nên cơ sở
-- dữ liệu tự chặn liên kết chéo sàn. Chạy hai lần không đổi gì.
alter table company_pending_units drop constraint if exists company_pending_units_id_company;
alter table company_pending_units add constraint company_pending_units_id_company unique (id, company_id);
alter table listing_pending_units drop constraint if exists listing_pending_units_pending_unit_id_fkey;
alter table listing_pending_units drop constraint if exists listing_pending_units_pending_company;
alter table listing_pending_units add constraint listing_pending_units_pending_company
  foreign key (pending_unit_id, company_id) references company_pending_units (id, company_id);
