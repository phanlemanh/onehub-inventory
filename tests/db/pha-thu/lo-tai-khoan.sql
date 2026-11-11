-- Break: inviting an email that already has an account answers differently from a new email.
create or replace function app.member_invite(p_email text, p_name text, p_roles text[])
  returns table (status text, user_id uuid)
  language plpgsql security definer
  set search_path = pg_catalog, pg_temp
as $$
begin
  if exists (select 1 from identity.users u where u.email = lower(btrim(p_email))) then
    return query select 'already-member'::text, null::uuid;
    return;
  end if;
  insert into identity.users (email, name) values (lower(btrim(p_email)), btrim(p_name));
  insert into public.company_members (company_id, user_id, name, roles, invited_by, invited_at)
  select app.current_company_id(), u.id, btrim(p_name), identity.canonical_roles(p_roles), identity.session_user_id(), now()
    from identity.users u where u.email = lower(btrim(p_email));
  return query select 'ok'::text, (select u.id from identity.users u where u.email = lower(btrim(p_email)));
end $$;
