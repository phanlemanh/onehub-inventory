-- Break: member_roles reads the caller's roles in any company, not the session's.
create or replace function app.member_roles()
  returns text[]
  language sql stable security definer
  set search_path = pg_catalog, pg_temp
as $$
  select coalesce((select m.roles from public.company_members m
                    where m.user_id = identity.session_user_id() order by (m.company_id = app.current_company_id()) limit 1), '{}'::text[]);
$$;
