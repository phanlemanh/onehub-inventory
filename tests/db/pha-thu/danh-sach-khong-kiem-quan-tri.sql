-- Break: member_list answers anyone in the company, not only company admins.
create or replace function app.member_list()
  returns table (user_id uuid, name text, email text, roles text[], invited_by_name text, invited_at timestamptz)
  language plpgsql stable security definer
  set search_path = pg_catalog, pg_temp
as $$
begin
  return query
    select m.user_id, m.name, u.email, m.roles, null::text, m.invited_at
      from public.company_members m join identity.users u on u.id = m.user_id
     where m.company_id = app.current_company_id();
end $$;
