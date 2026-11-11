-- Break: member_invite no longer checks that the caller is a company admin.
create or replace function app.member_invite(p_email text, p_name text, p_roles text[])
  returns table (status text, user_id uuid)
  language plpgsql security definer
  set search_path = pg_catalog, pg_temp
as $$
declare
  v_company uuid := app.current_company_id();
  v_email   text := lower(btrim(p_email));
  v_user    uuid;
begin
  select u.id into v_user from identity.users u where u.email = v_email;
  if v_user is null then
    insert into identity.users (email, name) values (v_email, btrim(p_name)) returning id into v_user;
  end if;
  insert into public.company_members (company_id, user_id, name, roles, invited_by, invited_at)
  values (v_company, v_user, btrim(p_name), identity.canonical_roles(p_roles), identity.session_user_id(), now());
  return query select 'ok'::text, v_user;
end $$;
