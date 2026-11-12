-- Break test, row 7a (Ngoài-19), scratch database only: a SECURITY DEFINER trigger function on agreements. The API
-- role cannot call it, but every insert it makes runs it as the owner. The suite must fail with
-- `HỎNG ham-dac-quyen-trong-danh-sach: public.ghi_vet_thoa_thuan`.
create function public.ghi_vet_thoa_thuan() returns trigger
  language plpgsql security definer set search_path = pg_catalog
  as $$ begin return new; end $$;
revoke execute on function public.ghi_vet_thoa_thuan() from public;
create trigger agreements_ghi_vet after insert on public.agreements
  for each row execute function public.ghi_vet_thoa_thuan();
