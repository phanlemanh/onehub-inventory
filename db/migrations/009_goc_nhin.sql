-- 009_goc_nhin.sql · Góc nhìn đã lưu (SavedView, hàng 2c, hồ sơ luu-goc-nhin-cot-hai): một người lưu cách xem một màn
-- Lưới (chữ ô tìm, lọc từng cột, sắp xếp, có nhóm hay không, cột ẩn) dưới một tên, rồi mở lại từ cột thứ hai của App
-- Shell. Góc nhìn là của riêng người lưu (chủ kho chọn ở Cổng Phạm vi, Hỏi-2): luật theo sàn như mọi bảng của sàn, thêm
-- luật thu hẹp «đúng người lưu và bảng quyền cho phép» cho từng lệnh. Số 008 dành cho hàng 7c.

-- 1. Bảng của sàn. Tên đã cắt khoảng trắng hai đầu, 1–40 ký tự, không trùng (không phân biệt hoa thường) trong góc nhìn
--    của cùng một người trên cùng một màn; người khác cùng sàn được trùng tên. Cách xem là năm khoá, đúng kiểu.
create table saved_view (
  id         uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies (id),
  user_id    uuid not null references identity.users (id),
  screen     text not null check (screen in ('inventory')),
  name       text not null check (name = btrim(name) and char_length(name) between 1 and 40),
  view       jsonb not null check (
               jsonb_typeof(view) = 'object'
               and view ?& array['query', 'filters', 'sort', 'grouped', 'hidden']
               and view - array['query', 'filters', 'sort', 'grouped', 'hidden'] = '{}'::jsonb
               and jsonb_typeof(view -> 'query') = 'string'
               and jsonb_typeof(view -> 'filters') = 'object'
               and jsonb_typeof(view -> 'sort') = 'array'
               and jsonb_typeof(view -> 'grouped') = 'boolean'
               and jsonb_typeof(view -> 'hidden') = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index saved_view_name_uq on saved_view (company_id, user_id, screen, lower(name));
create index saved_view_owner on saved_view (company_id, user_id, screen);

alter table saved_view enable row level security;
alter table saved_view force row level security;
create policy saved_view_read on saved_view for select
  using (company_id = app.current_company_id());
create policy saved_view_insert on saved_view for insert
  with check (company_id = app.current_company_id());
create policy saved_view_update on saved_view for update
  using (company_id = app.current_company_id())
  with check (company_id = app.current_company_id());
create policy saved_view_delete on saved_view for delete
  using (company_id = app.current_company_id());
revoke all on saved_view from public;
grant select, insert, update, delete on saved_view to quy_hang_app;

-- 2. Bảng quyền (hàng 9a): bốn thao tác của hàng này, chép từ ontology/actions.yaml. Phạm vi «của tôi» cho ba vai đọc
--    được Bảng hàng (hàng 2a); Quản trị sàn không có ô.
insert into app.permissions (action, role, scope) values
  ('listSavedViews', 'ListAgent', 'own'),
  ('listSavedViews', 'BuyerAgent', 'own'),
  ('listSavedViews', 'TeamLead', 'own'),
  ('saveView', 'ListAgent', 'own'),
  ('saveView', 'BuyerAgent', 'own'),
  ('saveView', 'TeamLead', 'own'),
  ('editView', 'ListAgent', 'own'),
  ('editView', 'BuyerAgent', 'own'),
  ('editView', 'TeamLead', 'own'),
  ('removeView', 'ListAgent', 'own'),
  ('removeView', 'BuyerAgent', 'own'),
  ('removeView', 'TeamLead', 'own');

-- 3. Mỗi lệnh chỉ chạm góc nhìn của chính người của phiên, và chỉ khi bảng quyền cho thao tác ấy. Luật thu hẹp: Postgres
--    AND với luật theo sàn ở trên, nên chỉ bớt dòng, không bao giờ mở thêm. So chuỗi để người của phiên không phải uuid
--    không làm lỗi câu đọc.
create policy saved_view_own_read on saved_view as restrictive for select
  using (user_id::text = current_setting('app.user_id', true) and app.allowed('listSavedViews') is not null);
create policy saved_view_own_insert on saved_view as restrictive for insert
  with check (user_id::text = current_setting('app.user_id', true) and app.allowed('saveView') is not null);
create policy saved_view_own_update on saved_view as restrictive for update
  using (user_id::text = current_setting('app.user_id', true) and app.allowed('editView') is not null)
  with check (user_id::text = current_setting('app.user_id', true) and app.allowed('editView') is not null);
create policy saved_view_own_delete on saved_view as restrictive for delete
  using (user_id::text = current_setting('app.user_id', true) and app.allowed('removeView') is not null);
