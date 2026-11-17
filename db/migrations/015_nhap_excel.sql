-- 015_nhap_excel.sql · Nhập tệp vào Bảng hàng (hàng 11, hồ sơ nhap-excel; chủ kho duyệt Cổng Phạm vi và kế hoạch
-- 2026-11-17): bảng `import_runs` (lần nạp tệp), lần chào nhớ lần nhập đã tạo nó, bảng `listing_pending_units` (lần
-- chào trên căn chờ khớp của sàn), quyền tạo lần chào (createListing chuyển live) và quyền xoá có rào: chỉ lần chào của
-- một lần nhập chưa hoàn tác, chưa ai sửa (version 1), khi bảng quyền cho undoImport. Mọi bảng mới có company_id, luật
-- theo dòng ép buộc (SP-1). Luật dấu ô và luật áp ở src/modules/imports/; ở đây giữ luật dữ liệu và quyền.

-- 1. Lần nạp tệp. Tệp không lên máy chủ: chỉ dạng tệp, con số, phần vừa học và các ô giữ chữ gốc.
create table import_runs (
  id                 uuid primary key,
  company_id         uuid not null references companies (id),
  imported_by        uuid not null,
  list_agent_user_id uuid not null,
  file_name          text not null check (char_length(file_name) between 1 and 200),
  sheet_name         text check (char_length(sheet_name) between 1 and 200),
  signature          text[] not null check (cardinality(signature) between 1 and 500),
  row_count          integer not null check (row_count between 1 and 5000),
  created_count      integer not null default 0 check (created_count >= 0),
  learned            jsonb not null default '{}'::jsonb check (jsonb_typeof(learned) = 'object'),
  kept               jsonb not null default '[]'::jsonb check (jsonb_typeof(kept) = 'array'),
  batches_done       integer[] not null default '{}',
  status             text not null default 'open' check (status in ('open', 'done', 'undone')),
  created_at         timestamptz not null default now(),
  undone_at          timestamptz,
  undone_by          uuid,
  constraint import_runs_importer_member foreign key (company_id, imported_by)
    references company_members (company_id, user_id),
  constraint import_runs_agent_member foreign key (company_id, list_agent_user_id)
    references company_members (company_id, user_id),
  constraint import_runs_undone check ((status = 'undone') = (undone_at is not null)),
  constraint import_runs_id_company unique (id, company_id)
);
create index import_runs_company_idx on import_runs (company_id, created_at desc);

-- 2. Lần chào nhớ lần nhập đã tạo nó.
alter table listings add column import_run_id uuid;
alter table listings add constraint listings_import_run foreign key (import_run_id, company_id)
  references import_runs (id, company_id);
create index listings_import_run_idx on listings (import_run_id) where import_run_id is not null;

-- 3. Lần chào trên căn chờ khớp của sàn (danh mục chung chưa có căn ấy). listing_units (căn danh mục) không đổi.
create table listing_pending_units (
  listing_id      uuid primary key,
  company_id      uuid not null references companies (id),
  pending_unit_id uuid not null references company_pending_units (id),
  open            boolean not null,
  constraint listing_pending_units_listing foreign key (listing_id, company_id)
    references listings (id, company_id) on delete cascade
);
create unique index listing_pending_units_one_open on listing_pending_units (company_id, pending_unit_id) where open;

-- Gỡ lần chào của một lần nhập kéo theo liên kết căn danh mục; ràng buộc cũ của 013 không có on delete.
alter table listing_units drop constraint listing_units_listing;
alter table listing_units add constraint listing_units_listing foreign key (listing_id, company_id)
  references listings (id, company_id) on delete cascade;

-- Mỗi lần chào đúng một liên kết căn: căn danh mục hoặc căn chờ khớp, không cả hai. Chạy bằng quyền người gọi.
create function app.listing_one_unit_link() returns trigger language plpgsql as $f$
begin
  if tg_table_name = 'listing_units'
     and exists (select from listing_pending_units p where p.listing_id = new.listing_id) then
    raise exception 'listing_one_unit_link: listing % already sits on a pending unit', new.listing_id
      using errcode = '23514';
  end if;
  if tg_table_name = 'listing_pending_units'
     and exists (select from listing_units u where u.listing_id = new.listing_id) then
    raise exception 'listing_one_unit_link: listing % already sits on a catalog unit', new.listing_id
      using errcode = '23514';
  end if;
  return new;
end $f$;
revoke all on function app.listing_one_unit_link() from public;
create trigger listing_one_unit_link before insert on listing_units
  for each row execute function app.listing_one_unit_link();
create trigger listing_one_unit_link before insert on listing_pending_units
  for each row execute function app.listing_one_unit_link();

-- Cột `open` của lần chào trên căn chờ khớp theo trạng thái, như listing_units (013). Chạy bằng quyền người gọi.
create function app.listing_pending_open_sync() returns trigger language plpgsql as $f$
begin
  update listing_pending_units
     set open = new.standard_status in ('Incomplete', 'Active', 'Pending', 'Hold')
   where listing_id = new.id
     and open is distinct from (new.standard_status in ('Incomplete', 'Active', 'Pending', 'Hold'));
  return new;
end $f$;
revoke all on function app.listing_pending_open_sync() from public;
create trigger listing_pending_open_sync after update of standard_status on listings
  for each row execute function app.listing_pending_open_sync();

-- 4. Luật theo sàn, như mọi bảng của sàn.
alter table import_runs enable row level security;
alter table import_runs force row level security;
create policy import_runs_read on import_runs for select
  using (company_id = app.current_company_id());
create policy import_runs_insert on import_runs for insert
  with check (company_id = app.current_company_id());
create policy import_runs_update on import_runs for update
  using (company_id = app.current_company_id()) with check (company_id = app.current_company_id());

alter table listing_pending_units enable row level security;
alter table listing_pending_units force row level security;
create policy listing_pending_units_read on listing_pending_units for select
  using (company_id = app.current_company_id());
create policy listing_pending_units_insert on listing_pending_units for insert
  with check (company_id = app.current_company_id());
create policy listing_pending_units_update on listing_pending_units for update
  using (company_id = app.current_company_id()) with check (company_id = app.current_company_id());

create policy listings_delete on listings for delete
  using (company_id = app.current_company_id());

-- 5. Vai ứng dụng: thêm lần chào và liên kết căn; xoá lần chào (liên kết đi theo); không xoá lần nhập.
revoke all on import_runs, listing_pending_units from public;
grant select, insert, update on import_runs to quy_hang_app;
grant insert on listings, listing_units to quy_hang_app;
grant select, insert on listing_pending_units to quy_hang_app;
grant update (open) on listing_pending_units to quy_hang_app;
grant delete on listings to quy_hang_app;

-- 6. Bảng quyền: chép từ ontology/actions.yaml (chủ kho duyệt 2026-11-17, Hỏi-1 và Hỏi-7: Đầu chủ của mình, Trưởng nhóm
-- toàn sàn; Đầu khách và Quản trị sàn không nhập).
insert into app.permissions (action, role, scope) values
  ('createListing', 'ListAgent', 'own'),
  ('createListing', 'TeamLead', 'company'),
  ('importListings', 'ListAgent', 'own'),
  ('importListings', 'TeamLead', 'company'),
  ('viewImports', 'ListAgent', 'company'),
  ('viewImports', 'TeamLead', 'company'),
  ('continueImport', 'ListAgent', 'own'),
  ('continueImport', 'TeamLead', 'company'),
  ('undoImport', 'ListAgent', 'own'),
  ('undoImport', 'TeamLead', 'company');

-- 7. Luật thu hẹp. Thêm lần chào: toàn sàn, hay của mình khi người giữ căn là chính người thêm (thay luật đóng của 013).
drop policy listings_insert_by_permission on listings;
create policy listings_insert_by_permission on listings as restrictive for insert
  with check (app.allowed('createListing') = 'company'
              or (app.allowed('createListing') = 'own'
                  and (list_agent_user_id)::text = current_setting('app.user_id', true)));
drop policy listing_units_insert_by_permission on listing_units;
create policy listing_units_insert_by_permission on listing_units as restrictive for insert
  with check (app.allowed('createListing') is not null);
create policy listing_pending_units_read_by_permission on listing_pending_units as restrictive for select
  using (app.allowed('viewListings') = 'company');
create policy listing_pending_units_insert_by_permission on listing_pending_units as restrictive for insert
  with check (app.allowed('createListing') is not null);
create policy listing_pending_units_update_by_permission on listing_pending_units as restrictive for update
  using (app.allowed('updateListing') = 'company') with check (app.allowed('updateListing') = 'company');

-- Xoá lần chào: chỉ lần chào của một lần nhập chưa hoàn tác, chưa ai sửa, khi undoImport cho phép (của mình: lần nhập
-- do chính người ấy nạp).
create policy listings_delete_by_permission on listings as restrictive for delete
  using (import_run_id is not null and version = 1
         and exists (select from import_runs r
                      where r.id = listings.import_run_id and r.status <> 'undone'
                        and (app.allowed('undoImport') = 'company'
                             or (app.allowed('undoImport') = 'own'
                                 and (r.imported_by)::text = current_setting('app.user_id', true)))));

-- Lần nhập: xem với viewImports; mở với importListings (của mình: chính mình nạp, cho chính mình giữ căn); ghi tiếp hay
-- hoàn tác với continueImport hay undoImport (của mình: lần nhập do chính mình nạp).
create policy import_runs_read_by_permission on import_runs as restrictive for select
  using (app.allowed('viewImports') = 'company');
create policy import_runs_insert_by_permission on import_runs as restrictive for insert
  with check ((imported_by)::text = current_setting('app.user_id', true)
              and (app.allowed('importListings') = 'company'
                   or (app.allowed('importListings') = 'own'
                       and (list_agent_user_id)::text = current_setting('app.user_id', true))));
create policy import_runs_update_by_permission on import_runs as restrictive for update
  using (app.allowed('continueImport') = 'company' or app.allowed('undoImport') = 'company'
         or ((imported_by)::text = current_setting('app.user_id', true)
             and (app.allowed('continueImport') = 'own' or app.allowed('undoImport') = 'own')))
  with check (app.allowed('continueImport') = 'company' or app.allowed('undoImport') = 'company'
              or ((imported_by)::text = current_setting('app.user_id', true)
                  and (app.allowed('continueImport') = 'own' or app.allowed('undoImport') = 'own')));
