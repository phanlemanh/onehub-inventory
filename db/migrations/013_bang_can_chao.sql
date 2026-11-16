-- 013_bang_can_chao.sql · Căn chào của sàn trên dữ liệu thật (hàng 10, hồ sơ bang-hang-du-lieu-that; quyết định 0039):
-- bảng `listings` (lần chào) và `listing_units` (lần chào trỏ căn của danh mục chung). Có company_id, luật theo dòng ép
-- buộc như mọi bảng của sàn (SP-1). Vai ứng dụng chỉ đọc và sửa: thêm căn là hàng 12, gỡ căn là hàng 18b.
-- Ranh giới luật: luật nấc (nấc nào đi được sang nấc nào, giá trần, Đã bán cần gì) ở src/modules/listings/edit-rules.ts,
-- máy chủ gọi trước khi ghi. Ở đây giữ luật dữ liệu (Đã bán có giá chốt và ngày, Ngừng hẳn có lý do, một lần chào đang
-- mở mỗi căn mỗi sàn), luật theo sàn, luật thu hẹp theo bảng quyền và luật người giữ căn khi đưa lên «Đang bán».

create table listings (
  id                       uuid primary key,
  company_id               uuid not null references companies (id),
  standard_status          text not null
                             check (standard_status in ('Incomplete', 'Active', 'Pending', 'Closed', 'Hold', 'Withdrawn')),
  list_price               bigint check (list_price >= 1),
  close_price              bigint check (close_price >= 1),
  close_date               date,
  withdrawn_reason         text check (withdrawn_reason in ('sold_elsewhere', 'owner_changed_mind', 'unreachable')),
  fee_inclusion            text check (fee_inclusion in ('Included', 'Excluded')),
  furnished                text check (furnished in ('Furnished', 'Partially', 'Unfurnished')),
  occupant_type            text check (occupant_type in ('Owner', 'Tenant', 'Vacant')),
  legal_status             text,
  financing                text,
  custom_fields            jsonb not null default '{}'::jsonb check (jsonb_typeof(custom_fields) = 'object'),
  -- Người giữ căn: một thành viên của chính sàn này, hay trống («Chưa ai giữ»). Tên sàn gọi người ấy chép kèm.
  list_agent_user_id       uuid,
  list_agent_full_name     text check (char_length(list_agent_full_name) between 1 and 120),
  original_entry_timestamp timestamptz not null default now(),
  last_confirmed_at        timestamptz,
  version                  integer not null default 1 check (version >= 1),
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  constraint listings_keeper_member foreign key (company_id, list_agent_user_id)
    references company_members (company_id, user_id),
  constraint listings_keeper_named check ((list_agent_user_id is null) = (list_agent_full_name is null)),
  constraint listings_closed_needs_price_and_date check (
    standard_status <> 'Closed' or (close_price is not null and close_date is not null)),
  constraint listings_withdrawn_needs_reason check (standard_status <> 'Withdrawn' or withdrawn_reason is not null),
  constraint listings_id_company unique (id, company_id)
);
create index listings_company_idx on listings (company_id);

create table listing_units (
  listing_id uuid primary key,
  company_id uuid not null references companies (id),
  upi        text not null references catalog_units (upi),
  -- Lần chào đang mở (Chưa đủ, Đang bán, Đang giữ chỗ, Tạm ngừng): do trigger trên listings giữ đúng theo trạng thái.
  open       boolean not null,
  constraint listing_units_listing foreign key (listing_id, company_id) references listings (id, company_id)
);
-- Mỗi căn tối đa một lần chào đang mở mỗi sàn; chỉ mục duy nhất chặn được cả hai giao dịch chạy đua.
create unique index listing_units_one_open on listing_units (company_id, upi) where open;
create index listing_units_upi_idx on listing_units (upi);

-- Giữ cột `open` theo trạng thái của lần chào, trong cùng giao dịch. Chạy bằng quyền người gọi.
create function app.listing_open_sync() returns trigger language plpgsql as $f$
begin
  update listing_units
     set open = new.standard_status in ('Incomplete', 'Active', 'Pending', 'Hold')
   where listing_id = new.id
     and open is distinct from (new.standard_status in ('Incomplete', 'Active', 'Pending', 'Hold'));
  return new;
end $f$;
revoke all on function app.listing_open_sync() from public;
create trigger listing_open_sync after update of standard_status on listings
  for each row execute function app.listing_open_sync();

-- Đưa lên «Đang bán» cần activateListing: Toàn sàn, hay Của tôi với căn mình giữ hoặc căn chưa ai giữ. Luật theo dòng
-- không thấy giá trị cũ của dòng, nên luật này đứng ở trigger. Chạy bằng quyền người gọi.
create function app.listing_activate_guard() returns trigger language plpgsql as $f$
declare scope text;
begin
  if new.standard_status = 'Active' and old.standard_status <> 'Active' then
    scope := app.allowed('activateListing');
    if scope is distinct from 'company' and not (
         scope = 'own'
         and (old.list_agent_user_id is null
              or old.list_agent_user_id::text = current_setting('app.user_id', true))) then
      raise exception 'listings_activate: activateListing does not allow this listing'
        using errcode = '42501';
    end if;
  end if;
  return new;
end $f$;
revoke all on function app.listing_activate_guard() from public;
create trigger listing_activate_guard before update on listings
  for each row execute function app.listing_activate_guard();

-- Luật theo sàn, như mọi bảng của sàn.
alter table listings enable row level security;
alter table listings force row level security;
create policy listings_read on listings for select
  using (company_id = app.current_company_id());
create policy listings_insert on listings for insert
  with check (company_id = app.current_company_id());
create policy listings_update on listings for update
  using (company_id = app.current_company_id()) with check (company_id = app.current_company_id());

alter table listing_units enable row level security;
alter table listing_units force row level security;
create policy listing_units_read on listing_units for select
  using (company_id = app.current_company_id());
create policy listing_units_insert on listing_units for insert
  with check (company_id = app.current_company_id());
create policy listing_units_update on listing_units for update
  using (company_id = app.current_company_id()) with check (company_id = app.current_company_id());

-- Vai ứng dụng: đọc hai bảng, sửa lần chào; trên listing_units chỉ cột `open` mà trigger giữ. Không thêm, không xoá.
revoke all on listings, listing_units from public;
grant select, update on listings to quy_hang_app;
grant select on listing_units to quy_hang_app;
grant update (open) on listing_units to quy_hang_app;

-- Bảng quyền (hàng 9a): ba thao tác của hàng này, chép từ ontology/actions.yaml (chủ kho duyệt ở Cổng Phạm vi,
-- 2026-11-15: Quản trị sàn xem chỉ đọc, ba vai sửa toàn sàn, đưa lên «Đang bán» theo người giữ căn).
insert into app.permissions (action, role, scope) values
  ('viewListings', 'ListAgent', 'company'),
  ('viewListings', 'BuyerAgent', 'company'),
  ('viewListings', 'TeamLead', 'company'),
  ('viewListings', 'CompanyAdmin', 'company'),
  ('updateListing', 'ListAgent', 'company'),
  ('updateListing', 'BuyerAgent', 'company'),
  ('updateListing', 'TeamLead', 'company'),
  ('activateListing', 'ListAgent', 'own'),
  ('activateListing', 'TeamLead', 'company');

-- Luật thu hẹp đứng cùng luật theo sàn: đọc cần viewListings; sửa cần updateListing, kể cả khi gọi thẳng dưới vai ứng
-- dụng. Thêm không có quyền nào mở (hàng 12), nên luật thêm đóng hẳn.
create policy listings_read_by_permission on listings as restrictive for select
  using (app.allowed('viewListings') = 'company');
create policy listings_insert_by_permission on listings as restrictive for insert
  with check (app.allowed('createListing') = 'company');
create policy listings_update_by_permission on listings as restrictive for update
  using (app.allowed('updateListing') = 'company') with check (app.allowed('updateListing') = 'company');
create policy listing_units_read_by_permission on listing_units as restrictive for select
  using (app.allowed('viewListings') = 'company');
create policy listing_units_insert_by_permission on listing_units as restrictive for insert
  with check (app.allowed('createListing') = 'company');
create policy listing_units_update_by_permission on listing_units as restrictive for update
  using (app.allowed('updateListing') = 'company') with check (app.allowed('updateListing') = 'company');
