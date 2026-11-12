-- Break (row 9a): app.allowed takes the caller's roles in every company, not only the company of the session.
create or replace function app.allowed(p_action text) returns text
  language sql stable security definer
  set search_path = pg_catalog, pg_temp
as $$
  select case max(case p.scope when 'company' then 2 when 'own' then 1 end) when 2 then 'company' when 1 then 'own' end
    from app.permissions p
   where p.action = p_action
     and p.role in (select unnest(m.roles) from public.company_members m
                     where m.user_id::text = current_setting('app.user_id', true));
$$;
alter function app.allowed(text) owner to quy_hang_identity;
