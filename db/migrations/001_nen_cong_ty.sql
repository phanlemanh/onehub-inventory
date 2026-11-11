-- 001_nen_cong_ty.sql · Nền nhiều công ty và thoả thuận kết nối (ADR-0001 §3, §4).
-- Luật cho mọi bảng của công ty về sau: có company_id, enable + force row level security theo
-- app.current_company_id(), và một ca trong packages/db/tests/isolation.test.mjs.

create schema if not exists app;

-- Công ty của phiên: API đặt `set local app.company_id = '<uuid>'` trong mỗi giao dịch.
-- Không đặt thì hàm trả null và mọi luật theo dòng trả về rỗng.
create or replace function app.current_company_id() returns uuid
  language sql stable
  as $$ select nullif(current_setting('app.company_id', true), '')::uuid $$;

-- Vai mà API dùng để truy vấn: không phải chủ bảng, nên luật theo dòng luôn áp.
do $$
begin
  if not exists (select from pg_roles where rolname = 'quy_hang_app') then
    create role quy_hang_app nologin;
  end if;
end $$;
grant usage on schema app to quy_hang_app;
grant execute on function app.current_company_id() to quy_hang_app;

create table companies (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);
alter table companies enable row level security;
alter table companies force row level security;
create policy companies_self on companies for select using (id = app.current_company_id());
grant select on companies to quy_hang_app;

-- Thoả thuận kết nối (packages/core/src/agreements.ts). Thuộc công ty mở thoả thuận; công ty ở phía bên kia
-- của một thoả thuận hợp tác thấy được nhưng không sửa được.
create table agreements (
  id                      uuid primary key default gen_random_uuid(),
  company_id              uuid not null references companies (id),
  kind                    text not null check (kind in (
                            'catalog_source', 'listing_channel', 'lead_source',
                            'spreadsheet', 'company_partnership', 'company_api')),
  direction               text not null check (direction in ('inbound', 'outbound')),
  counterparty            text not null,
  counterparty_company_id uuid references companies (id),
  data_classes            text[] not null check (
                            cardinality(data_classes) > 0
                            and data_classes <@ array['catalog', 'shareable_listing', 'company_internal',
                                                      'custom_field', 'source', 'transaction', 'behavior']::text[]),
  valid_from              timestamptz not null,
  valid_until             timestamptz,
  status                  text not null default 'active' check (status in ('active', 'paused', 'ended')),
  approved_by             text not null,
  special_terms           boolean not null default false,
  created_at              timestamptz not null default now(),
  -- Bất biến: lớp «nguồn» (chủ nhà, số điện thoại, giá đáy, ảnh sổ) không bao giờ rời công ty —
  -- chặn ở đây, không chỉ ở lõi.
  constraint agreements_never_source check (not ('source' = any (data_classes))),
  constraint agreements_internal_stays check (direction = 'inbound' or not ('company_internal' = any (data_classes))),
  constraint agreements_valid_range check (valid_until is null or valid_until > valid_from)
);
create index agreements_company_idx on agreements (company_id);
create index agreements_counterparty_idx on agreements (counterparty_company_id);

alter table agreements enable row level security;
alter table agreements force row level security;
create policy agreements_read on agreements for select
  using (company_id = app.current_company_id() or counterparty_company_id = app.current_company_id());
create policy agreements_insert on agreements for insert
  with check (company_id = app.current_company_id());
create policy agreements_update on agreements for update
  using (company_id = app.current_company_id())
  with check (company_id = app.current_company_id());
grant select, insert, update on agreements to quy_hang_app;
