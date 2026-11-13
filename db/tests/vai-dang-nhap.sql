-- Ca vai-dang-nhap-khong-ve-chu (hàng 7c, hồ sơ ung-dung-noi-bang-vai-khong-chu; SP-1). Đọc danh mục hệ thống dưới vai
-- chủ, về vai mà ứng dụng dùng để nối: quy_hang_login. Bộ chạy (db/scripts/cach-ly.sh) chạy tệp này trong một giao dịch
-- rút lại — một mình trên bản lành, và sau từng tệp phá db/tests/pha-thu/vai-dang-nhap-*.sql (vai và lời cấp vai thuộc
-- cả cụm, nên bản phá không bao giờ được commit). In đúng một dòng: `ok vai-dang-nhap-khong-ve-chu` hoặc `HỎNG …`.
--
-- Điều kiện, theo thứ tự (lỗi đầu tiên được nêu):
--   1. vai có và đăng nhập được;
--   2. không siêu người dùng, không tạo vai, không tạo cơ sở dữ liệu, không nhân bản; 3. không vượt luật theo dòng;
--   4. không sở hữu quan hệ, hàm hay schema nào ở schema không phải hệ thống;
--   5. vai nó là thành viên (trực tiếp hay gián tiếp) chỉ gồm chính nó và quy_hang_app — vai lạ nào sở hữu bảng thì
--      «về được vai chủ», vai lạ vượt luật hay siêu người dùng thì «vượt được luật theo dòng qua», còn lại «là thành viên»;
--   6. lời cấp quy_hang_app: đổi sang được, không kế thừa, không quản;
--   7. không quyền thẳng nào trên quan hệ (ô quyền của bảng có tên vai);
--   8. quyền hiệu lực (tính cả PUBLIC): không dùng được quan hệ nào, và chỉ chạy được hàm quy_hang_app cũng chạy được.
do $$
declare
  vai constant text := 'quy_hang_login';
  api constant text := 'quy_hang_app';
  r record;
  v text;
begin
  select * into r from pg_roles where rolname = vai;
  if not found then
    raise exception 'HỎNG vai-dang-nhap-khong-ve-chu: không có vai %', vai;
  end if;
  if not r.rolcanlogin then
    raise exception 'HỎNG vai-dang-nhap-khong-ve-chu: % không đăng nhập được', vai;
  end if;
  if r.rolsuper or r.rolcreaterole or r.rolcreatedb or r.rolreplication then
    raise exception 'HỎNG vai-dang-nhap-khong-ve-chu: % có quyền đặc biệt (siêu người dùng, tạo vai, tạo cơ sở dữ liệu hay nhân bản)', vai;
  end if;
  if r.rolbypassrls then
    raise exception 'HỎNG vai-dang-nhap-khong-ve-chu: % vượt được luật theo dòng', vai;
  end if;

  -- 4. Sở hữu.
  select format('%s.%s', n.nspname, c.relname) into v
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where c.relowner = r.oid and n.nspname not in ('pg_catalog', 'information_schema')
    and n.nspname not like 'pg\_toast%' and n.nspname not like 'pg\_temp%'
  order by 1 limit 1;
  if v is not null then
    raise exception 'HỎNG vai-dang-nhap-khong-ve-chu: % sở hữu %', vai, v;
  end if;
  select format('%s.%s', n.nspname, p.proname) into v
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where p.proowner = r.oid and n.nspname not in ('pg_catalog', 'information_schema')
  order by 1 limit 1;
  if v is not null then
    raise exception 'HỎNG vai-dang-nhap-khong-ve-chu: % sở hữu hàm %', vai, v;
  end if;
  select nspname into v from pg_namespace where nspowner = r.oid order by 1 limit 1;
  if v is not null then
    raise exception 'HỎNG vai-dang-nhap-khong-ve-chu: % sở hữu schema %', vai, v;
  end if;

  -- 5. Vai với tới được.
  for v in
    select x.rolname from pg_roles x
    where pg_has_role(r.oid, x.oid, 'MEMBER') and x.rolname not in (vai, api)
    order by
      exists (select from pg_class c join pg_namespace n on n.oid = c.relnamespace
              where c.relowner = x.oid and n.nspname not in ('pg_catalog', 'information_schema')) desc,
      x.rolbypassrls or x.rolsuper desc,
      x.rolname
  loop
    if exists (select from pg_class c join pg_namespace n on n.oid = c.relnamespace
               where c.relowner = (select oid from pg_roles where rolname = v)
                 and n.nspname not in ('pg_catalog', 'information_schema')
                 and n.nspname not like 'pg\_toast%' and n.nspname not like 'pg\_temp%') then
      raise exception 'HỎNG vai-dang-nhap-khong-ve-chu: % về được vai chủ %', vai, v;
    end if;
    if exists (select from pg_roles where rolname = v and (rolbypassrls or rolsuper)) then
      raise exception 'HỎNG vai-dang-nhap-khong-ve-chu: % vượt được luật theo dòng qua %', vai, v;
    end if;
    if exists (select from pg_proc where proowner = (select oid from pg_roles where rolname = v)
                                     and pronamespace not in ('pg_catalog'::regnamespace, 'information_schema'::regnamespace)) then
      raise exception 'HỎNG vai-dang-nhap-khong-ve-chu: % về được vai chủ %', vai, v;
    end if;
    raise exception 'HỎNG vai-dang-nhap-khong-ve-chu: % là thành viên của %', vai, v;
  end loop;

  -- 6. Lời cấp quy_hang_app.
  select a.* into r from pg_auth_members a
  where a.roleid = (select oid from pg_roles where rolname = api) and a.member = (select oid from pg_roles where rolname = vai);
  if not found or not r.set_option then
    raise exception 'HỎNG vai-dang-nhap-khong-ve-chu: % không đổi được sang %', vai, api;
  end if;
  if r.inherit_option then
    raise exception 'HỎNG vai-dang-nhap-khong-ve-chu: % kế thừa quyền của %', vai, api;
  end if;
  if r.admin_option then
    raise exception 'HỎNG vai-dang-nhap-khong-ve-chu: % quản được %', vai, api;
  end if;

  -- 7. Quyền thẳng trên quan hệ.
  select format('%s.%s %s', n.nspname, c.relname, a.privilege_type) into v
  from pg_class c join pg_namespace n on n.oid = c.relnamespace, aclexplode(c.relacl) a
  where a.grantee = (select oid from pg_roles where rolname = vai)
  order by 1 limit 1;
  if v is not null then
    raise exception 'HỎNG vai-dang-nhap-khong-ve-chu: % có quyền thẳng trên %', vai, v;
  end if;

  -- 8. Quyền hiệu lực, tính cả PUBLIC và quyền mặc định của hàm.
  select format('%s.%s %s', n.nspname, c.relname, q.quyen) into v
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  cross join unnest(array['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER']) q(quyen)
  where n.nspname not in ('pg_catalog', 'information_schema')
    and n.nspname not like 'pg\_toast%' and n.nspname not like 'pg\_temp%'
    and c.relkind in ('r', 'p', 'v', 'm', 'f')
    and has_table_privilege(vai, c.oid, q.quyen)
  order by 1 limit 1;
  if v is not null then
    raise exception 'HỎNG vai-dang-nhap-khong-ve-chu: % dùng được %', vai, v;
  end if;
  select format('%s.%s', n.nspname, p.proname) into v
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname not in ('pg_catalog', 'information_schema')
    and has_function_privilege(vai, p.oid, 'EXECUTE')
    and not has_function_privilege(api, p.oid, 'EXECUTE')
  order by 1 limit 1;
  if v is not null then
    raise exception 'HỎNG vai-dang-nhap-khong-ve-chu: % chạy được hàm % mà % không chạy được', vai, v, api;
  end if;

  raise notice 'ok vai-dang-nhap-khong-ve-chu';
end $$;
