-- Break test, row 7a (Ngoài-4, 14), scratch database only: a plain view runs as its owner, who bypasses row security,
-- so it returns every company's agreements. The suite must fail with
-- `HỎNG dang-xem-khong-vuot-luat: public.agreements_tat_ca`.
create view agreements_tat_ca as select * from agreements;
grant select on agreements_tat_ca to quy_hang_app;
