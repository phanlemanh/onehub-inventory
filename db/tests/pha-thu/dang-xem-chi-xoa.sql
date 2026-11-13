-- Break test, row 7b, scratch database only: a plain view runs as its owner, who bypasses row security. The API role
-- may only delete through it — no SELECT, so case 18 does not see it — and that is enough to delete every company's
-- agreements. The suite must fail with `HỎNG dang-xem-ghi-khong-vuot-luat: public.agreements_xoa DELETE`.
create view public.agreements_xoa as select * from agreements;
grant delete on public.agreements_xoa to quy_hang_app;
