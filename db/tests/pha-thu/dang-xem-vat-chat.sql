-- Break test, row 7a (Ngoài-19), scratch database only: a materialized view has no row security at all. The suite
-- must fail with `HỎNG dang-xem-khong-vuot-luat: public.agreements_dem`.
create materialized view agreements_dem as select company_id, count(*) as so from agreements group by company_id;
grant select on agreements_dem to quy_hang_app;
