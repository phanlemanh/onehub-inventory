-- 006_bang_quyen_theo_vai.sql · Bảng quyền theo vai (hàng 9a, quyết định 0016). Cơ sở dữ liệu đọc cùng bảng quyền với
-- API: app.permissions là bản chép các ô của dòng sống trong ontology/actions.yaml (bài kiểm so từng dòng với bảng
-- sinh), app.allowed(text) trả phạm vi của người của phiên ở sàn của phiên. Bốn hàm của hàng 9 hỏi bảng thay vì tự kiểm
-- vai Quản trị sàn; bảng thành viên và thoả thuận kết nối thêm luật theo dòng thu hẹp theo bảng. Cách ly theo sàn giữ
-- nguyên: các luật mới đều là luật thu hẹp (restrictive), chỉ bớt quyền, không bao giờ mở thêm. Số 004 bỏ trống.

-- 1. Bảng quyền: danh mục dùng chung, không có company_id (ngoại lệ danh mục chung của AGENTS.md). Vai API chỉ đọc.
create table app.permissions (
  action text not null check (action ~ '^[a-z][A-Za-z0-9]*$'),
  role   text not null check (role in ('ListAgent', 'BuyerAgent', 'TeamLead', 'CompanyAdmin')),
  scope  text not null check (scope in ('company', 'own')),
  primary key (action, role)
);
alter table app.permissions enable row level security;
alter table app.permissions force row level security;
create policy permissions_catalog_read on app.permissions for select using (true);
revoke all on app.permissions from public;
grant select on app.permissions to quy_hang_app, quy_hang_identity;

insert into app.permissions (action, role, scope) values
  ('readOwnRoles', 'ListAgent', 'own'),
  ('readOwnRoles', 'BuyerAgent', 'own'),
  ('readOwnRoles', 'TeamLead', 'own'),
  ('readOwnRoles', 'CompanyAdmin', 'own'),
  ('readCompany', 'ListAgent', 'company'),
  ('readCompany', 'BuyerAgent', 'company'),
  ('readCompany', 'TeamLead', 'company'),
  ('readCompany', 'CompanyAdmin', 'company'),
  ('listMembers', 'CompanyAdmin', 'company'),
  ('inviteMember', 'CompanyAdmin', 'company'),
  ('changeMemberRoles', 'CompanyAdmin', 'company'),
  ('readAgreements', 'ListAgent', 'company'),
  ('readAgreements', 'BuyerAgent', 'company'),
  ('readAgreements', 'TeamLead', 'company'),
  ('readAgreements', 'CompanyAdmin', 'company'),
  ('manageAgreements', 'CompanyAdmin', 'company');

-- 2. Người của phiên: một chuỗi không phải uuid (không bao giờ đến từ cửa withCompany) cho null thay vì lỗi ép kiểu,
--    vì app.allowed giờ chạy trong luật theo dòng của bảng thoả thuận.
create or replace function identity.session_user_id() returns uuid
  language sql stable
  set search_path = pg_catalog, pg_temp
as $$
  select case when s ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then s::uuid end
    from (select current_setting('app.user_id', true) as s) x;
$$;

-- 3. Phạm vi của người của phiên với một thao tác: rộng nhất theo các vai của họ ở sàn của phiên; null khi không được,
--    khi chưa chọn sàn hay không thuộc sàn. Chạy bằng quyền người gọi; vai lấy qua app.member_roles() của hàng 9.
create function app.allowed(p_action text) returns text
  language sql stable
  set search_path = pg_catalog, pg_temp
as $$
  select case max(case p.scope when 'company' then 2 when 'own' then 1 end) when 2 then 'company' when 1 then 'own' end
    from app.permissions p
   where p.action = p_action and p.role = any (app.member_roles());
$$;
revoke all on function app.allowed(text) from public;
grant execute on function app.allowed(text) to quy_hang_app, quy_hang_identity;

-- 4. Ba hàm quản trị người của hàng 9 hỏi bảng. Thân hàm giữ nguyên ngoài câu kiểm vai.
create or replace function app.member_list()
  returns table (user_id uuid, name text, email text, roles text[], invited_by_name text, invited_at timestamptz)
  language plpgsql stable security definer
  set search_path = pg_catalog, pg_temp
as $$
declare
  v_company uuid := app.current_company_id();
begin
  if app.allowed('listMembers') is distinct from 'company' then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return query
    select m.user_id, m.name, u.email, m.roles, b.name, m.invited_at
      from public.company_members m
      join identity.users u on u.id = m.user_id
      left join public.company_members b on b.company_id = m.company_id and b.user_id = m.invited_by
     where m.company_id = v_company
     order by m.invited_at desc nulls last, m.name, m.user_id;
end $$;

create or replace function app.member_invite(p_email text, p_name text, p_roles text[])
  returns table (status text, user_id uuid)
  language plpgsql security definer
  set search_path = pg_catalog, pg_temp
as $$
declare
  v_company uuid := app.current_company_id();
  v_caller  uuid := identity.session_user_id();
  v_email   text := lower(btrim(p_email));
  v_user    uuid;
begin
  if app.allowed('inviteMember') is distinct from 'company' then
    return query select 'forbidden'::text, null::uuid;
    return;
  end if;
  perform pg_advisory_xact_lock(hashtext('dang-nhap:' || v_email));
  select u.id into v_user from identity.users u where u.email = v_email;
  if v_user is not null and exists (select 1 from public.company_members m
                                     where m.company_id = v_company and m.user_id = v_user) then
    return query select 'already-member'::text, null::uuid;
    return;
  end if;
  if v_user is null then
    insert into identity.users (email, name) values (v_email, btrim(p_name)) returning id into v_user;
  end if;
  insert into public.company_members (company_id, user_id, name, roles, invited_by, invited_at)
  values (v_company, v_user, btrim(p_name), identity.canonical_roles(p_roles), v_caller, now());
  return query select 'ok'::text, v_user;
end $$;

create or replace function app.member_set_roles(p_user_id uuid, p_roles text[])
  returns text
  language plpgsql security definer
  set search_path = pg_catalog, pg_temp
as $$
declare
  v_company uuid := app.current_company_id();
  v_roles   text[] := identity.canonical_roles(p_roles);
  v_current text[];
begin
  if v_company is null then
    return 'forbidden';
  end if;
  perform pg_advisory_xact_lock(hashtext('thanh-vien:' || v_company::text));
  if app.allowed('changeMemberRoles') is distinct from 'company' then
    return 'forbidden';
  end if;
  select m.roles into v_current from public.company_members m
   where m.company_id = v_company and m.user_id = p_user_id for update;
  if not found then
    return 'not-member';
  end if;
  if 'CompanyAdmin' = any (v_current) and not ('CompanyAdmin' = any (coalesce(v_roles, '{}')))
     and (select count(*) from public.company_members m
           where m.company_id = v_company and 'CompanyAdmin' = any (m.roles)) <= 1 then
    return 'last-admin';
  end if;
  update public.company_members m set roles = v_roles where m.company_id = v_company and m.user_id = p_user_id;
  return 'ok';
end $$;

-- Không hàm nào còn gọi kiểm vai tự viết của hàng 9.
drop function identity.is_admin(uuid, uuid);

-- 5. Bảng thành viên: mỗi người đọc dòng của chính mình; mọi dòng của sàn chỉ khi listMembers cho phép. So chuỗi để
--    một người của phiên không phải uuid không làm lỗi câu đọc.
create policy company_members_by_permission on company_members as restrictive for select
  using (user_id::text = current_setting('app.user_id', true) or app.allowed('listMembers') = 'company');

-- 6. Thoả thuận kết nối: chỉ người manageAgreements cho phép mới thêm, sửa. Đọc giữ luật theo sàn của migration 001:
--    ô readAgreements hôm nay cho cả bốn vai, bài kiểm đối chiếu từng ô và đỏ khi bảng đổi mà luật chưa theo.
create policy agreements_insert_by_permission on agreements as restrictive for insert
  with check (app.allowed('manageAgreements') = 'company');
create policy agreements_update_by_permission on agreements as restrictive for update
  using (app.allowed('manageAgreements') = 'company')
  with check (app.allowed('manageAgreements') = 'company');
