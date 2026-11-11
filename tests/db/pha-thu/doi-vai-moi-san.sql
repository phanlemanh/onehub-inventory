-- Break: member_set_roles finds and changes the person in any company, not only the session's.
create or replace function app.member_set_roles(p_user_id uuid, p_roles text[])
  returns text
  language plpgsql security definer
  set search_path = pg_catalog, pg_temp
as $$
begin
  if not identity.is_admin(app.current_company_id(), identity.session_user_id()) then
    return 'forbidden';
  end if;
  update public.company_members m set roles = identity.canonical_roles(p_roles) where m.user_id = p_user_id;
  if not found then
    return 'not-member';
  end if;
  return 'ok';
end $$;
