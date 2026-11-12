-- Break: the members list shows the account's name instead of the name this company gave.
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
    select m.user_id, u.name, u.email, m.roles, null::text, m.invited_at
      from public.company_members m join identity.users u on u.id = m.user_id
     where m.company_id = v_company;
end $$;
