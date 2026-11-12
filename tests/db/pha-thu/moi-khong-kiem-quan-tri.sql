-- Break (row 9, rewritten in row 7b): app.member_invite as migration 006 defines it, with exactly one thing removed —
-- the permission check `app.allowed('inviteMember')`. The database then lets any member of the session's company invite
-- people. The pair pha-thu-moi-khong-kiem-quan-tri must fail with
-- `ba-vai-khong-quan-tri: cơ sở dữ liệu cho Đầu chủ mời người`.
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
