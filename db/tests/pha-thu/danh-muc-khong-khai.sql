-- Break test (row 7d), scratch database only: a table without company_id, row level security forced, readable by the
-- API role, but not on the written list of shared catalogs. The isolation suite must fail with
-- `HỎNG vai-api-chi-cham-bang-co-luat: public.catalog_khong_khai — bảng không có company_id mà vai chạm được, không phải danh mục chung đã khai`.
create table catalog_khong_khai (slug text primary key);
alter table catalog_khong_khai enable row level security;
alter table catalog_khong_khai force row level security;
create policy catalog_khong_khai_read on catalog_khong_khai for select using (true);
grant select on catalog_khong_khai to quy_hang_app;
