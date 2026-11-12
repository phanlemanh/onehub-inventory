-- Break test, row 7a (Ngoài-4, 14, 19), scratch database only: a SECURITY DEFINER function owned by the superuser
-- counts every company's agreements; PUBLIC gets EXECUTE by default, so the API role can call it. The suite must fail
-- with `HỎNG ham-dac-quyen-trong-danh-sach: public.dem_moi_thoa_thuan`.
create function public.dem_moi_thoa_thuan() returns bigint
  language sql security definer set search_path = pg_catalog, public
  as $$ select count(*) from public.agreements $$;
