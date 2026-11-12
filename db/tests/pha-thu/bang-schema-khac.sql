-- Break test, row 7a (Ngoài-19), scratch database only: a company table in another schema, without row security,
-- readable by the API role. Cases 12 and 13 look at schema public only, so only the role-side scan can catch it.
-- The suite must fail with `HỎNG vai-api-chi-cham-bang-co-luat: kho_ngoai.listings_mau`.
create schema kho_ngoai;
create table kho_ngoai.listings_mau (
  id         uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id)
);
grant usage on schema kho_ngoai to quy_hang_app;
grant select on kho_ngoai.listings_mau to quy_hang_app;
