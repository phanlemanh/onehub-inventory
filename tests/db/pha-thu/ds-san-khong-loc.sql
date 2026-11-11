-- Break: the company list of a session returns every company, not only the person's own.
create or replace function app.session_companies(p_token_hash text)
  returns table (id uuid, name text)
  language sql stable security definer
  set search_path = pg_catalog, pg_temp
as $$
  select c.id, c.name from public.companies c order by c.name, c.id;
$$;
