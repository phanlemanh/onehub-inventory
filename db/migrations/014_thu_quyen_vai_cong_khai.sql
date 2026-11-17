-- 014_thu_quyen_vai_cong_khai.sql · Thu quyền của các vai khoá công khai Supabase trên mọi đối tượng của kho (việc phụ
-- VP6 của hàng 22; quyết định 0044; SP-1). Trên Supabase, vai postgres có quyền mặc định cấp ALL trên bảng, chuỗi số và
-- hàm mới ở schema public cho anon, authenticated, service_role: mọi bảng migration tạo ra đều đọc được qua khoá công
-- khai của Data API. Migration này:
--   1. cấp thẳng cho vai của ứng dụng những gì trước nay chúng chỉ có nhờ PUBLIC: dùng schema public (quy_hang_app,
--      quy_hang_identity, và quy_hang_login để lời từ chối khi đọc thẳng vẫn là «không có quyền trên bảng» — dùng
--      schema không mở bảng nào), gọi app.current_company_id() (các hàm security definer của quy_hang_identity gọi nó);
--   2. thu MỌI quyền của PUBLIC, anon, authenticated, service_role trên bảng (cả quyền theo cột), chuỗi số, hàm và schema
--      ở public, app, identity — từng đối tượng, nhân danh chủ của nó;
--   3. thu quyền mặc định của vai chạy migration (và của postgres khi khác vai ấy) cho ba vai ấy, để migration 015 trở
--      đi không mở lại;
--   4. tự kiểm cuối: còn quyền nào thì báo lỗi và huỷ cả migration.
-- Chạy được trên Postgres thường không có ba vai ấy (CI, các dãy): vai nào không có thì bỏ qua, không lỗi.

-- 1. Quyền trước nay đi qua PUBLIC, nay cấp thẳng.
grant usage on schema public to quy_hang_app, quy_hang_identity, quy_hang_login;
grant execute on function app.current_company_id() to quy_hang_identity;

-- 2. Thu quyền trên từng đối tượng.
do $$
declare
  v_schemas  text[] := array['public', 'app', 'identity'];
  v_api      oid[]  := array(select oid from pg_roles where rolname in ('anon', 'authenticated', 'service_role'));
  v_from     text;
  v_switch   boolean;
  r          record;
begin
  -- PUBLIC và các vai khoá công khai đang có, cách nhau dấu phẩy.
  select string_agg(x, ', ') into v_from
  from (select 'public' as x
        union all
        select quote_ident(rolname) from pg_roles where oid = any(v_api)) t;

  for r in
    -- Bảng, khung nhìn, bảng ngoài: quyền cả bảng hay quyền theo một cột.
    select format('table %I.%I', n.nspname, c.relname) as obj, c.relowner as owner
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = any(v_schemas) and c.relkind in ('r', 'p', 'v', 'm', 'f')
      and (exists (select from aclexplode(coalesce(c.relacl, acldefault('r', c.relowner))) x
                   where x.grantee = 0 or x.grantee = any(v_api))
           or exists (select from pg_attribute a, aclexplode(a.attacl) x
                      where a.attrelid = c.oid and not a.attisdropped
                        and (x.grantee = 0 or x.grantee = any(v_api))))
    union all
    select format('sequence %I.%I', n.nspname, c.relname), c.relowner
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = any(v_schemas) and c.relkind = 'S'
      and exists (select from aclexplode(coalesce(c.relacl, acldefault('s', c.relowner))) x
                  where x.grantee = 0 or x.grantee = any(v_api))
    union all
    -- Hàm và thủ tục: không có ACL nghĩa là PUBLIC được gọi, nên đọc ACL mặc định.
    select format('routine %s', p.oid::regprocedure), p.proowner
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = any(v_schemas)
      and exists (select from aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) x
                  where x.grantee = 0 or x.grantee = any(v_api))
    union all
    select format('schema %I', n.nspname), n.nspowner
    from pg_namespace n
    where n.nspname = any(v_schemas)
      and exists (select from aclexplode(coalesce(n.nspacl, acldefault('n', n.nspowner))) x
                  where x.grantee = 0 or x.grantee = any(v_api))
  loop
    -- Thu nhân danh chủ: vai chạy migration kế thừa quyền của chủ thì thu thẳng, chỉ đổi được sang chủ thì đổi sang rồi
    -- thu (Supabase: postgres không phải siêu vai, các hàm của quy_hang_identity thuộc vai ấy).
    v_switch := not pg_has_role(current_user, r.owner, 'USAGE') and pg_has_role(current_user, r.owner, 'SET');
    if v_switch then
      execute format('set local role %I', (select rolname from pg_roles where oid = r.owner));
    end if;
    execute format('revoke all on %s from %s', r.obj, v_from);
    if v_switch then
      reset role;
    end if;
  end loop;
end $$;

-- 3. Quyền mặc định: đối tượng mà vai chạy migration (và postgres, khi khác vai ấy) tạo sau này không tự cấp cho ba vai
--    khoá công khai. Cấp chung (không theo schema) không thu được theo từng schema, nên thu cả hai tầng. PUBLIC gọi hàm
--    mới thì KHÔNG thu ở đây: đó là quyền chung, thu thì hàm tạm (pg_temp) và hàm extension do vai này tạo cũng hết gọi
--    được; ba vai không còn dùng được schema nào của kho nên không với tới hàm. Hàm mới vẫn tự `revoke ... from public`.
do $$
declare
  v_schemas text[] := array['public', 'app', 'identity'];
  v_api     text   := (select string_agg(quote_ident(rolname), ', ' order by rolname)
                       from pg_roles where rolname in ('anon', 'authenticated', 'service_role'));
  v_role    text;
  v_schema  text;
  v_kind    text;
begin
  for v_role in
    select current_user::text
    union
    select rolname::text from pg_roles where rolname = 'postgres' and pg_has_role(current_user, oid, 'USAGE')
  loop
    if v_api is null then
      continue;
    end if;
    foreach v_kind in array array['tables', 'sequences', 'functions', 'types'] loop
      execute format('alter default privileges for role %I revoke all on %s from %s', v_role, v_kind, v_api);
      foreach v_schema in array v_schemas loop
        if v_kind <> 'types' then
          execute format('alter default privileges for role %I in schema %I revoke all on %s from %s',
                         v_role, v_schema, v_kind, v_api);
        end if;
      end loop;
    end loop;
    execute format('alter default privileges for role %I revoke all on schemas from %s', v_role, v_api);
  end loop;
end $$;

-- 4. Tự kiểm: không vai khoá công khai nào (kể cả qua PUBLIC) còn quyền gì trên đối tượng của kho.
do $$
declare
  v_schemas text[] := array['public', 'app', 'identity'];
  v_left    text;
begin
  select string_agg(format('%s: %s', q.vai, q.obj), '; ' order by q.vai, q.obj) into v_left
  from (
    select r.rolname::text as vai, format('%I.%I', n.nspname, c.relname) as obj
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    cross join pg_roles r
    where r.rolname in ('anon', 'authenticated', 'service_role') and n.nspname = any(v_schemas)
      and ((c.relkind in ('r', 'p', 'v', 'm', 'f')
            and (has_table_privilege(r.oid, c.oid, 'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER')
                 or has_any_column_privilege(r.oid, c.oid, 'SELECT, INSERT, UPDATE, REFERENCES')))
           or (c.relkind = 'S' and has_sequence_privilege(r.oid, c.oid, 'USAGE, SELECT, UPDATE')))
    union all
    select r.rolname, p.oid::regprocedure::text
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    cross join pg_roles r
    where r.rolname in ('anon', 'authenticated', 'service_role') and n.nspname = any(v_schemas)
      and has_function_privilege(r.oid, p.oid, 'EXECUTE')
    union all
    select r.rolname, n.nspname::text
    from pg_namespace n cross join pg_roles r
    where r.rolname in ('anon', 'authenticated', 'service_role') and n.nspname = any(v_schemas)
      and has_schema_privilege(r.oid, n.oid, 'USAGE, CREATE')
    union all
    select 'PUBLIC', p.oid::regprocedure::text
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = any(v_schemas)
      and exists (select from aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) x where x.grantee = 0)
  ) q;
  if v_left is not null then
    raise exception 'vai khoá công khai còn quyền: %', v_left;
  end if;
end $$;
