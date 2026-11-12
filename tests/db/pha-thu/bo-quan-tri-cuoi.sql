-- Break: member_set_roles lets the last company admin lose the role.
create or replace function app.member_set_roles(p_user_id uuid, p_roles text[])
  returns text
  language plpgsql security definer
  set search_path = pg_catalog, pg_temp
as $$
declare
  v_company uuid := app.current_company_id();
begin
  if not identity.is_admin(v_company, identity.session_user_id()) then
    return 'forbidden';
  end if;
  update public.company_members m set roles = identity.canonical_roles(p_roles)
   where m.company_id = v_company and m.user_id = p_user_id;
  if not found then
    return 'not-member';
  end if;
  return 'ok';
end $$;
