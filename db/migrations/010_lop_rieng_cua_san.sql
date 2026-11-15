-- 010_lop_rieng_cua_san.sql · Lớp riêng của sàn (hàng 7e, hồ sơ lop-rieng-cua-san, quyết định 0029): năm bảng của sàn
-- trên lõi chuẩn — nhãn riêng, trường riêng, cách viết riêng (từ điển giá trị), căn chờ khớp, mẫu nhập. Mọi bảng có
-- company_id, luật theo dòng ép buộc như mọi bảng của sàn (SP-1), vai API chỉ đọc, thêm, sửa: không xoá, ngừng dùng là
-- ghi retired_at. Danh mục chung không đổi: căn chờ khớp chỉ trỏ tới căn của danh mục bằng khoá ngoại.
-- Luật theo nghĩa (khái niệm có trong bảng nhãn, giá trị thuộc tập của trường, tên không trùng sau khi gấp chữ) ở
-- src/modules/company-config; ở đây giữ những gì cơ sở dữ liệu giữ được: khuôn chữ, độ dài, trần, duy nhất.

-- 1. Nhãn riêng (CompanyLabel): một nhãn đang dùng cho mỗi khái niệm.
create table company_labels (
  id         bigint generated always as identity primary key,
  company_id uuid not null references companies (id),
  concept    text not null check (concept ~ '^[A-Z][A-Za-z0-9]*$'),
  label      text not null check (label = btrim(label) and char_length(label) between 1 and 40),
  created_at timestamptz not null default now(),
  retired_at timestamptz
);
create unique index company_labels_one_live on company_labels (company_id, concept) where retired_at is null;

-- 2. Trường riêng (CustomField): mã cấp một lần, không dùng lại; năm kiểu; lựa chọn chỉ ở «chọn một», 1–30.
create table company_fields (
  company_id uuid not null references companies (id),
  code       text not null check (code ~ '^[a-z][a-z0-9_]{0,31}$'),
  name       text not null check (name = btrim(name) and char_length(name) between 1 and 40),
  kind       text not null check (kind in ('text', 'number', 'date', 'single_select', 'boolean')),
  options    jsonb not null default '[]'::jsonb,
  position   integer not null check (position >= 0),
  created_at timestamptz not null default now(),
  retired_at timestamptz,
  primary key (company_id, code),
  constraint company_fields_options check (
    jsonb_typeof(options) = 'array'
    and case when kind = 'single_select'
             then jsonb_array_length(options) between 1 and 30
             else jsonb_array_length(options) = 0 end)
);

-- Kiểu không đổi sau khi tạo; mã không đổi (khoá chính). Trần 20 trường đang dùng mỗi sàn, giữ cả khi hai lệnh ghi
-- cùng lúc: khoá theo sàn trong giao dịch rồi mới đếm. Hàm chạy bằng quyền người gọi (không SECURITY DEFINER), nên chỉ
-- đếm được dòng của sàn đang mở.
create function app.company_fields_guard() returns trigger language plpgsql as $f$
declare live integer;
begin
  if tg_op = 'UPDATE' and new.kind <> old.kind then
    raise exception 'company_fields_kind: kind of a custom field never changes';
  end if;
  if new.retired_at is null and (tg_op = 'INSERT' or old.retired_at is not null) then
    perform pg_advisory_xact_lock(hashtextextended('company_fields:' || new.company_id::text, 0));
    select count(*) into live from company_fields
      where company_id = new.company_id and retired_at is null and code <> new.code;
    if live >= 20 then
      raise exception 'company_fields_limit: at most 20 custom fields in use per company';
    end if;
  end if;
  return new;
end $f$;
revoke all on function app.company_fields_guard() from public;
create trigger company_fields_guard before insert or update on company_fields
  for each row execute function app.company_fields_guard();

-- 3. Cách viết riêng (CompanyValueAlias): một cặp đang dùng cho mỗi trường và chữ đã gấp.
create table company_value_aliases (
  id         bigint generated always as identity primary key,
  company_id uuid not null references companies (id),
  field      text not null check (char_length(field) between 1 and 64),
  raw        text not null check (raw = btrim(raw) and char_length(raw) between 1 and 40),
  raw_fold   text not null check (char_length(raw_fold) between 1 and 40),
  value      text not null check (char_length(value) between 1 and 40),
  created_at timestamptz not null default now(),
  retired_at timestamptz
);
create unique index company_value_aliases_one_live on company_value_aliases (company_id, field, raw_fold)
  where retired_at is null;

-- 4. Căn chờ khớp (PendingUnit): giữ nguyên mã sàn gõ; khoá căn chỉ trỏ căn có trong danh mục.
create table company_pending_units (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references companies (id),
  raw_code      text not null check (raw_code = btrim(raw_code) and char_length(raw_code) between 1 and 80),
  building_text text check (char_length(building_text) between 1 and 80),
  unit_text     text check (char_length(unit_text) between 1 and 80),
  unit_key      text references catalog_units (unit_key),
  matched_at    timestamptz,
  created_at    timestamptz not null default now(),
  retired_at    timestamptz,
  constraint company_pending_units_matched check ((unit_key is null) = (matched_at is null))
);
create unique index company_pending_units_one_live on company_pending_units (company_id, raw_code)
  where retired_at is null;

-- 5. Mẫu nhập (ImportTemplate): chữ ký là tên cột đã gấp theo thứ tự; một mẫu đang dùng mỗi chữ ký.
create table company_import_templates (
  id         uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies (id),
  name       text not null check (name = btrim(name) and char_length(name) between 1 and 60),
  signature  text[] not null check (cardinality(signature) between 1 and 200),
  columns    jsonb not null check (jsonb_typeof(columns) = 'array'),
  created_at timestamptz not null default now(),
  retired_at timestamptz,
  constraint company_import_templates_columns check (jsonb_array_length(columns) = cardinality(signature))
);
create unique index company_import_templates_one_live on company_import_templates (company_id, signature)
  where retired_at is null;

-- 6. Luật theo sàn cho năm bảng, như mọi bảng của sàn; vai API đọc, thêm, sửa — không xoá.
do $$
declare t text;
begin
  foreach t in array array['company_labels', 'company_fields', 'company_value_aliases', 'company_pending_units',
                           'company_import_templates']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('alter table %I force row level security', t);
    execute format('create policy %I on %I for select using (company_id = app.current_company_id())', t || '_read', t);
    execute format('create policy %I on %I for insert with check (company_id = app.current_company_id())',
                   t || '_insert', t);
    execute format('create policy %I on %I for update using (company_id = app.current_company_id()) '
                   'with check (company_id = app.current_company_id())', t || '_update', t);
    execute format('revoke all on %I from public', t);
    execute format('grant select, insert, update on %I to quy_hang_app', t);
  end loop;
end $$;

-- 7. Bảng quyền (hàng 9a): năm thao tác của hàng này, chép từ ontology/actions.yaml. Đọc cho cả bốn vai; thêm, sửa,
--    ngừng dùng, khớp cho Đầu chủ, Trưởng nhóm, Quản trị sàn (chủ kho duyệt Hỏi-1 ở Cổng Phạm vi, 2026-11-13).
insert into app.permissions (action, role, scope) values
  ('readCompanyLayer', 'ListAgent', 'company'),
  ('readCompanyLayer', 'BuyerAgent', 'company'),
  ('readCompanyLayer', 'TeamLead', 'company'),
  ('readCompanyLayer', 'CompanyAdmin', 'company'),
  ('addCompanyLayer', 'ListAgent', 'company'),
  ('addCompanyLayer', 'TeamLead', 'company'),
  ('addCompanyLayer', 'CompanyAdmin', 'company'),
  ('editCompanyLayer', 'ListAgent', 'company'),
  ('editCompanyLayer', 'TeamLead', 'company'),
  ('editCompanyLayer', 'CompanyAdmin', 'company'),
  ('retireCompanyLayer', 'ListAgent', 'company'),
  ('retireCompanyLayer', 'TeamLead', 'company'),
  ('retireCompanyLayer', 'CompanyAdmin', 'company'),
  ('matchPendingUnits', 'ListAgent', 'company'),
  ('matchPendingUnits', 'TeamLead', 'company'),
  ('matchPendingUnits', 'CompanyAdmin', 'company');

-- Luật thu hẹp đứng cùng luật theo sàn: đọc cần readCompanyLayer; thêm cần addCompanyLayer (căn chờ khớp và mẫu nhập
-- do màn nhập của hàng 11 thêm, cùng thao tác); sửa cần một trong các thao tác ghi bảng ấy dùng.
do $$
declare
  t text;
  upd text;
begin
  foreach t in array array['company_labels', 'company_fields', 'company_value_aliases', 'company_pending_units',
                           'company_import_templates']
  loop
    upd := case when t = 'company_pending_units'
                then '(app.allowed(''retireCompanyLayer'') = ''company'' or app.allowed(''matchPendingUnits'') = ''company'')'
                else '(app.allowed(''editCompanyLayer'') = ''company'' or app.allowed(''retireCompanyLayer'') = ''company'')'
           end;
    execute format('create policy %I on %I as restrictive for select using (app.allowed(''readCompanyLayer'') = ''company'')',
                   t || '_read_by_permission', t);
    execute format('create policy %I on %I as restrictive for insert with check (app.allowed(''addCompanyLayer'') = ''company'')',
                   t || '_insert_by_permission', t);
    execute format('create policy %I on %I as restrictive for update using %s with check %s',
                   t || '_update_by_permission', t, upd, upd);
  end loop;
end $$;
