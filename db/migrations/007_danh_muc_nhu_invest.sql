-- 007_danh_muc_nhu_invest.sql · Danh mục căn dùng chung lưu cùng cách với onehub-invest (hàng 7d, hồ sơ
-- danh-muc-can-nhu-onehub-invest; onehub-invest migration 026, 082 và ADR-0016): dự án và phân khu ở một bảng nút,
-- toà · trục · căn có khoá riêng có tiền tố, tầng là chữ theo RESO UnitFloorLocation, mã gốc giữ làm bí danh.
-- Năm bảng catalog_* là danh mục dùng chung: không company_id (ngoại lệ danh mục chung của AGENTS.md), mọi sàn đọc,
-- vai API chỉ đọc, khai trong danh sách danh mục chung của bộ kiểm cách ly. company_catalog_aliases là bảng của sàn
-- bình thường: mã và tên riêng một sàn gọi toà, căn; danh mục chung không đổi. Số 006 là của hàng 9a.

-- 1. Dự án (Subdivision, RESO SubdivisionName) và phân khu (Complex, RESO Building.ComplexName).
create table catalog_nodes (
  slug             text primary key check (slug ~ '^[a-z0-9][a-z0-9-]*$'),
  node_type        text not null check (node_type in ('project', 'complex')),
  name             text not null check (length(name) > 0),
  subdivision_slug text,
  -- Phân khu chỉ có cha là dự án: khoá ngoại ghép trỏ (slug, node_type = 'project').
  parent_type      text generated always as (case when node_type = 'complex' then 'project' end) stored,
  constraint catalog_nodes_slug_type unique (slug, node_type),
  constraint catalog_nodes_slug_parent unique (slug, subdivision_slug),
  constraint catalog_nodes_parent check ((node_type = 'project') = (subdivision_slug is null)),
  constraint catalog_nodes_parent_is_project foreign key (subdivision_slug, parent_type)
    references catalog_nodes (slug, node_type)
);

-- 2. Toà (Building): dưới phân khu khi biết, không thì thẳng dưới dự án.
create table catalog_buildings (
  building_key     text primary key
                     constraint catalog_buildings_key check (building_key ~ '^bld_[0-9A-HJKMNP-TV-Z]{26}$'),
  subdivision_key  text not null,
  subdivision_type text generated always as ('project') stored,
  complex_key      text,
  building_name    text not null check (length(building_name) > 0),
  upi              text not null unique,
  constraint catalog_buildings_project foreign key (subdivision_key, subdivision_type)
    references catalog_nodes (slug, node_type),
  -- Phân khu của toà phải thuộc đúng dự án của toà.
  constraint catalog_buildings_complex foreign key (complex_key, subdivision_key)
    references catalog_nodes (slug, subdivision_slug),
  constraint catalog_buildings_for_units unique (building_key, subdivision_key, building_name),
  constraint catalog_buildings_complex_of unique (building_key, complex_key)
);

-- 3. Trục (Stack): mở rộng riêng như onehub-invest.
create table catalog_stacks (
  stack_key    text primary key
                 constraint catalog_stacks_key check (stack_key ~ '^stk_[0-9A-HJKMNP-TV-Z]{26}$'),
  building_key text not null references catalog_buildings (building_key),
  stack_code   text not null check (length(stack_code) > 0),
  constraint catalog_stacks_code unique (building_key, stack_code),
  constraint catalog_stacks_for_units unique (stack_key, building_key, stack_code)
);

-- 4. Căn (Unit). upi giữ nguyên để lần chào (ListingUnit) không đổi. Tên toà, dự án, phân khu, mã trục chép trên căn
--    cho Bảng hàng đọc thẳng, và được khoá ngoại ghép giữ khớp với toà, trục.
create table catalog_units (
  unit_key          text primary key
                      constraint catalog_units_key check (unit_key ~ '^unt_[0-9A-HJKMNP-TV-Z]{26}$'),
  upi               text not null unique,
  subdivision_key   text not null,
  complex_key       text,
  building_key      text not null,
  building_name     text not null,
  stack_key         text,
  stack             text,
  unit_number       text not null check (length(unit_number) > 0),
  floor             text constraint catalog_units_floor check (floor ~ '^(0|[1-9][0-9]*)[A-Z]?$'),
  living_area       numeric check (living_area >= 0),
  bedrooms_total    integer check (bedrooms_total >= 0),
  direction_faces   text,
  property_type     text not null check (property_type in ('Residential', 'Land')),
  property_sub_type text not null check (property_sub_type in
                      ('Condominium', 'Townhouse', 'Single Family Residence', 'Unimproved Land')),
  constraint catalog_units_number unique (building_key, unit_number),
  constraint catalog_units_stack_pair check ((stack_key is null) = (stack is null)),
  constraint catalog_units_building foreign key (building_key, subdivision_key, building_name)
    references catalog_buildings (building_key, subdivision_key, building_name) on update cascade,
  constraint catalog_units_complex foreign key (building_key, complex_key)
    references catalog_buildings (building_key, complex_key),
  constraint catalog_units_stack foreign key (stack_key, building_key, stack)
    references catalog_stacks (stack_key, building_key, stack_code) on update cascade
);
create index catalog_units_stack_idx on catalog_units (stack_key);

-- 5. Mã gốc và tên (CatalogAlias), như registry_aliases của onehub-invest: giá trị mã gốc là <slug dự án>/<MÃ>.
create table catalog_aliases (
  id         bigint generated always as identity primary key,
  object_key text not null check (object_key ~ '^(bld|stk|unt)_[0-9A-HJKMNP-TV-Z]{26}$'),
  kind       text not null check (kind in ('ma_goc', 'ten')),
  value      text not null check (length(value) > 0),
  source     text not null check (length(source) > 0),
  first_seen timestamptz not null default now(),
  retired_at timestamptz
);
create unique index catalog_aliases_ma_goc_uq on catalog_aliases (source, kind, value)
  where retired_at is null and kind = 'ma_goc';
create index catalog_aliases_object_idx on catalog_aliases (object_key);

-- Năm bảng dùng chung: ép luật theo dòng, mọi sàn đọc, vai API chỉ đọc; không ai ghi qua API ở hàng này.
do $$
declare t text;
begin
  foreach t in array array['catalog_nodes', 'catalog_buildings', 'catalog_stacks', 'catalog_units', 'catalog_aliases']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('alter table %I force row level security', t);
    execute format('create policy %I on %I for select using (true)', t || '_read', t);
    execute format('revoke all on %I from public', t);
    execute format('grant select on %I to quy_hang_app', t);
  end loop;
end $$;

-- 6. Mã và tên riêng của sàn (CompanyCatalogAlias): bảng của sàn, trỏ đúng một toà hay một căn có thật.
create table company_catalog_aliases (
  id           bigint generated always as identity primary key,
  company_id   uuid not null references companies (id),
  building_key text references catalog_buildings (building_key),
  unit_key     text constraint company_catalog_aliases_unit references catalog_units (unit_key),
  kind         text not null check (kind in ('ma', 'ten')),
  value        text not null check (length(value) > 0),
  created_at   timestamptz not null default now(),
  retired_at   timestamptz,
  constraint company_catalog_aliases_one_object check (num_nonnulls(building_key, unit_key) = 1)
);
create unique index company_catalog_aliases_uq on company_catalog_aliases (company_id, kind, value)
  where retired_at is null;
alter table company_catalog_aliases enable row level security;
alter table company_catalog_aliases force row level security;
create policy company_catalog_aliases_read on company_catalog_aliases for select
  using (company_id = app.current_company_id());
create policy company_catalog_aliases_insert on company_catalog_aliases for insert
  with check (company_id = app.current_company_id());
create policy company_catalog_aliases_update on company_catalog_aliases for update
  using (company_id = app.current_company_id())
  with check (company_id = app.current_company_id());
revoke all on company_catalog_aliases from public;
grant select, insert, update on company_catalog_aliases to quy_hang_app;
