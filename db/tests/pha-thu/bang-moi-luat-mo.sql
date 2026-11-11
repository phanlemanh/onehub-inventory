-- Break test (d), scratch database only: a new company table forces row level security but its policy is open.
-- The isolation suite must fail with `HỎNG luat-doc-ghi-theo-san: bang_mau_cach_ly`.
create table bang_mau_cach_ly (
  id         uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies (id)
);
alter table bang_mau_cach_ly enable row level security;
alter table bang_mau_cach_ly force row level security;
create policy bang_mau_cach_ly_all on bang_mau_cach_ly for all using (true) with check (true);
grant select, insert, update on bang_mau_cach_ly to quy_hang_app;
