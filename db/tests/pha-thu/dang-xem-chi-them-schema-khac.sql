-- Break test, row 7b, scratch database only: a plain view in a schema other than public, INSERT only. The suite must
-- fail with `HỎNG dang-xem-ghi-khong-vuot-luat: kho_xem.agreements_them INSERT`.
create schema kho_xem;
grant usage on schema kho_xem to quy_hang_app;
create view kho_xem.agreements_them as select * from public.agreements;
grant insert on kho_xem.agreements_them to quy_hang_app;
