-- Break test, row 7b, scratch database only: a plain view with UPDATE on one column only, granted to PUBLIC (so to the
-- API role too). The suite must fail with `HỎNG dang-xem-ghi-khong-vuot-luat: public.agreements_sua_ben UPDATE`.
create view public.agreements_sua_ben as select * from agreements;
grant update (counterparty) on public.agreements_sua_ben to public;
