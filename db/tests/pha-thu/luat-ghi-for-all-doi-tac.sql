-- Break test (b, third form), scratch database only: a new company table has one policy for every command whose
-- condition also accepts the partner column, and no separate check, so the partner can write rows of another company.
-- The isolation suite must fail with `HỎNG luat-doc-ghi-theo-san: bang_doi_tac_mau`.
create table bang_doi_tac_mau (
  id                 uuid primary key default gen_random_uuid(),
  company_id         uuid not null references companies (id),
  partner_company_id uuid references companies (id)
);
alter table bang_doi_tac_mau enable row level security;
alter table bang_doi_tac_mau force row level security;
create policy bang_doi_tac_mau_all on bang_doi_tac_mau for all
  using (company_id = app.current_company_id() or partner_company_id = app.current_company_id());
grant select, insert, update on bang_doi_tac_mau to quy_hang_app;
