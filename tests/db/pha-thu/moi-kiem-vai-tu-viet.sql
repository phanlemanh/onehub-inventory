-- Break (row 9a): member_invite goes back to its own check of the CompanyAdmin role instead of the permission table.
-- Migration 006 dropped row 9's identity.is_admin, so the break brings it back first (same body as migration 003).
create function identity.is_admin(p_company uuid, p_user uuid) returns boolean
  language sql stable
  set search_path = pg_catalog, pg_temp
as $$
  select p_company is not null and p_user is not null and exists (
    select 1 from public.company_members m
     where m.company_id = p_company and m.user_id = p_user and 'CompanyAdmin' = any (m.roles));
$$;
alter function identity.is_admin(uuid, uuid) owner to quy_hang_identity;
revoke all on function identity.is_admin(uuid, uuid) from public;

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
  if not identity.is_admin(v_company, v_caller) then
    return query select 'forbidden'::text, null::uuid;
    return;
  end if;
  select u.id into v_user from identity.users u where u.email = v_email;
  if v_user is null then
    insert into identity.users (email, name) values (v_email, btrim(p_name)) returning id into v_user;
  end if;
  insert into public.company_members (company_id, user_id, name, roles, invited_by, invited_at)
  values (v_company, v_user, btrim(p_name), identity.canonical_roles(p_roles), v_caller, now());
  return query select 'ok'::text, v_user;
end $$;
