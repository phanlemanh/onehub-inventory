-- 003_moi_nguoi_gan_vai.sql · Mời người vào sàn và gán vai (hàng 9, quyết định 0022).
-- Dòng thành viên của hàng 8 nhận thêm tập vai (lấy trong bốn vai của ontology/roles.yaml), tên sàn đặt cho người, người
-- mời và lúc mời. Không thêm luật theo dòng nào: luật đọc lọc theo sàn của hàng 8 giữ nguyên, vai API vẫn chỉ đọc. Mọi
-- lần ghi đi qua bốn hàm hẹp thuộc vai riêng quy_hang_identity (ngoại lệ danh tính của SP-1, chủ kho duyệt ở Cổng Phạm
-- vi hàng 9); mỗi hàm tự đọc người và sàn của phiên, chỉ chạm sàn ấy, và chỉ Quản trị sàn được xem, mời, đổi vai.

-- Tập vai hợp lệ: ít nhất một, không lặp. Danh sách bốn vai nằm thẳng trong ràng buộc để đọc được từ pg_constraint.
create function app.member_roles_ok(p_roles text[]) returns boolean
  language sql immutable
  set search_path = pg_catalog, pg_temp
as $$
  select coalesce(cardinality(p_roles), 0) >= 1
     and cardinality(p_roles) = (select count(distinct r) from unnest(p_roles) r)
     and not exists (select from unnest(p_roles) r where r is null);
$$;
revoke all on function app.member_roles_ok(text[]) from public;
grant execute on function app.member_roles_ok(text[]) to quy_hang_identity;

alter table company_members
  add column roles      text[],
  add column name       text,
  add column invited_by uuid references identity.users (id) on delete set null,
  add column invited_at timestamptz;

-- Dòng có sẵn chỉ là dữ liệu thử của máy dev (quyết định 0008: lược đồ chưa áp lên bản thật trước lúc chuyển).
update company_members m set roles = '{CompanyAdmin}', name = u.name from identity.users u where u.id = m.user_id;

alter table company_members
  alter column roles set not null,
  alter column name set not null,
  add constraint company_members_roles_check
    check (app.member_roles_ok(roles) and roles <@ array['ListAgent', 'BuyerAgent', 'TeamLead', 'CompanyAdmin']::text[]),
  add constraint company_members_name_check check (btrim(name) <> '' and char_length(name) <= 120);

grant insert, update on company_members to quy_hang_identity;

-- Người và sàn của phiên, đặt bởi cửa withCompany cho từng giao dịch.
create function identity.session_user_id() returns uuid
  language sql stable
  set search_path = pg_catalog, pg_temp
as $$ select nullif(current_setting('app.user_id', true), '')::uuid $$;

create function identity.is_admin(p_company uuid, p_user uuid) returns boolean
  language sql stable
  set search_path = pg_catalog, pg_temp
as $$
  select p_company is not null and p_user is not null and exists (
    select 1 from public.company_members m
     where m.company_id = p_company and m.user_id = p_user and 'CompanyAdmin' = any (m.roles));
$$;

-- Tập vai theo thứ tự của ontology/roles.yaml, không lặp.
create function identity.canonical_roles(p_roles text[]) returns text[]
  language sql immutable
  set search_path = pg_catalog, pg_temp
as $$
  select array_agg(r order by array_position(array['ListAgent', 'BuyerAgent', 'TeamLead', 'CompanyAdmin'], r))
    from (select distinct r from unnest(p_roles) r) d;
$$;

alter function identity.session_user_id() owner to quy_hang_identity;
alter function identity.is_admin(uuid, uuid) owner to quy_hang_identity;
alter function identity.canonical_roles(text[]) owner to quy_hang_identity;
revoke all on function identity.session_user_id(), identity.is_admin(uuid, uuid), identity.canonical_roles(text[])
  from public;

-- 1. Vai của người gọi ở sàn của phiên; rỗng khi không thuộc sàn ấy hay chưa chọn sàn.
create function app.member_roles()
  returns text[]
  language sql stable security definer
  set search_path = pg_catalog, pg_temp
as $$
  select coalesce((select m.roles from public.company_members m
                    where m.company_id = app.current_company_id() and m.user_id = identity.session_user_id()),
                  '{}'::text[]);
$$;

-- 2. Người của sàn, chỉ cho Quản trị sàn. Tên là tên sàn này đặt; người mời cũng ghi bằng tên sàn này đặt.
create function app.member_list()
  returns table (user_id uuid, name text, email text, roles text[], invited_by_name text, invited_at timestamptz)
  language plpgsql stable security definer
  set search_path = pg_catalog, pg_temp
as $$
declare
  v_company uuid := app.current_company_id();
begin
  if not identity.is_admin(v_company, identity.session_user_id()) then
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

-- 3. Mời: tìm hay tạo tài khoản theo email, thêm vào sàn của phiên. Trả 'ok' kèm id, 'already-member' hay 'forbidden'.
--    Tài khoản đã có giữ nguyên tên của nó; sàn này chỉ thấy tên mình gõ.
create function app.member_invite(p_email text, p_name text, p_roles text[])
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
  if not identity.is_admin(v_company, v_caller) then
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

-- 4. Đổi vai một người của sàn của phiên. Trả 'ok', 'not-member', 'last-admin' hay 'forbidden'. Khoá theo sàn để hai
--    quản trị bỏ vai nhau cùng lúc không làm sàn mất quản trị cuối cùng.
create function app.member_set_roles(p_user_id uuid, p_roles text[])
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
  if not identity.is_admin(v_company, identity.session_user_id()) then
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

alter function app.member_roles() owner to quy_hang_identity;
alter function app.member_list() owner to quy_hang_identity;
alter function app.member_invite(text, text, text[]) owner to quy_hang_identity;
alter function app.member_set_roles(uuid, text[]) owner to quy_hang_identity;

revoke all on function app.member_roles(), app.member_list(), app.member_invite(text, text, text[]),
  app.member_set_roles(uuid, text[]) from public;
grant execute on function app.member_roles(), app.member_list(), app.member_invite(text, text, text[]),
  app.member_set_roles(uuid, text[]) to quy_hang_app;
