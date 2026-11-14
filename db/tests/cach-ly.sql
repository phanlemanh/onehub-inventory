-- Company isolation suite (SP-1): 22 SQL cases (14 of row 7, 5 of row 7a, 1 of row 7b, 1 of row 7e, 1 of row 19), run by db/scripts/cach-ly.sh on a scratch database that has the
-- migrations applied. Each case builds companies A and B as the table owner inside one transaction, switches to the
-- API role with the door's own statements (src/modules/identity/with-company.ts), checks reads and writes, and
-- rolls back. A passing case prints `ok <case>`; a failing one raises `HỎNG <case>: <table or reason>`.
-- Runs without ON_ERROR_STOP so every case runs even when one fails. Sample data only: [Sàn A], [Sàn B], [Tên].
-- Company A = 00000000-0000-4000-8000-00000000000a, company B = 00000000-0000-4000-8000-00000000000b.

set client_min_messages = notice;

-- The door's statement that sets user and company, verbatim (a unit test checks this line against the door).
prepare dat_san(text, text) as select set_config('app.user_id', $1, true), set_config('app.company_id', $2, true);

-- Two companies; A has its own agreement, B has a private one and a partnership opened with A.
create function pg_temp.dung_hai_san() returns void language sql as $f$
  insert into companies (id, name) values
    ('00000000-0000-4000-8000-00000000000a', '[Sàn A]'),
    ('00000000-0000-4000-8000-00000000000b', '[Sàn B]');
  insert into agreements (company_id, kind, direction, counterparty, counterparty_company_id, data_classes,
                          valid_from, approved_by) values
    ('00000000-0000-4000-8000-00000000000a', 'catalog_source', 'inbound', 'nguồn mẫu', null,
     '{catalog}', now(), '[Tên]'),
    ('00000000-0000-4000-8000-00000000000b', 'listing_channel', 'outbound', 'kênh mẫu', null,
     '{shareable_listing}', now(), '[Tên]'),
    ('00000000-0000-4000-8000-00000000000b', 'company_partnership', 'outbound', '[Sàn A]',
     '00000000-0000-4000-8000-00000000000a', '{shareable_listing}', now(), '[Tên]');
$f$;

-- A's company admin (row 9a): since the permission table, only a person whose roles allow manageAgreements writes
-- agreements. Write cases run as this person, so what refuses a write to B is the company rule, not the role rule.
create function pg_temp.them_quan_tri_a() returns void language sql as $f$
  insert into identity.users (id, email, name)
    values ('00000000-0000-4000-8000-0000000000a1', 'quan-tri-a@example.test', '[Tên]');
  insert into company_members (company_id, user_id, name, roles)
    values ('00000000-0000-4000-8000-00000000000a', '00000000-0000-4000-8000-0000000000a1', '[Tên]', '{CompanyAdmin}');
$f$;

-- Under the API role, neither table shows any row.
create function pg_temp.khong_thay_gi(ca text) returns void language plpgsql as $f$
declare n bigint;
begin
  if current_user <> 'quy_hang_app' then
    raise exception 'HỎNG %: đang chạy bằng vai %', ca, current_user;
  end if;
  select count(*) into n from companies;
  if n <> 0 then raise exception 'HỎNG %: companies (% dòng)', ca, n; end if;
  select count(*) into n from agreements;
  if n <> 0 then raise exception 'HỎNG %: agreements (% dòng)', ca, n; end if;
end $f$;

-- The statement must fail with an error whose message contains `mau`; any other outcome fails the case.
create function pg_temp.phai_loi(ca text, cau text, mau text) returns void language plpgsql as $f$
begin
  begin
    execute cau;
  exception when others then
    if position(mau in sqlerrm) > 0 then return; end if;
    raise exception 'HỎNG %: lỗi khác — %', ca, sqlerrm;
  end;
  raise exception 'HỎNG %: câu chạy được — %', ca, cau;
end $f$;

-- Allowed policy shapes (allow-list, not a search for bad shapes). A policy expression of a company table must be
-- exactly the standard form `(<company column> = app.current_company_id())` as Postgres prints it, or a named read
-- exception listed here. Write policies (INSERT, UPDATE, DELETE, ALL) have no exception. Anything else fails, so a new
-- shape needs a deliberate line in this list.
create temp table luat_cho_phep (bang name not null, luat name not null, bieu_thuc text not null);
insert into luat_cho_phep values
  -- 001_nen_cong_ty.sql: the company on the other side of a partnership may read the agreement.
  ('agreements', 'agreements_read',
   '((company_id = app.current_company_id()) OR (counterparty_company_id = app.current_company_id()))');

-- Restrictive policies (row 9a, permission table): Postgres ANDs them with the company policies above, so they can only
-- take rows away, never add any. Still a written list: each one asks the permission table (app.allowed) and nothing
-- else, and the company policy of the same command must still be there (case 13 checks that).
create temp table luat_thu_hep (bang name not null, luat name not null, bieu_thuc text not null);
insert into luat_thu_hep values
  -- 006_bang_quyen_theo_vai.sql: one's own row, or every row of the company when listMembers allows it.
  ('company_members', 'company_members_by_permission',
   '(((user_id)::text = current_setting(''app.user_id''::text, true)) OR (app.allowed(''listMembers''::text) = ''company''::text))'),
  -- 006_bang_quyen_theo_vai.sql: only manageAgreements adds or changes an agreement.
  ('agreements', 'agreements_insert_by_permission', '(app.allowed(''manageAgreements''::text) = ''company''::text)'),
  ('agreements', 'agreements_update_by_permission', '(app.allowed(''manageAgreements''::text) = ''company''::text)'),
  -- 007_danh_muc_nhu_invest.sql (hàng 7d): only manageCompanyCodes adds or changes a company's own codes.
  ('company_catalog_aliases', 'company_catalog_aliases_insert_by_permission',
   '(app.allowed(''manageCompanyCodes''::text) = ''company''::text)'),
  ('company_catalog_aliases', 'company_catalog_aliases_update_by_permission',
   '(app.allowed(''manageCompanyCodes''::text) = ''company''::text)'),
  -- 009_goc_nhin.sql (hàng 2c): a saved view is touched only by the person who saved it, and only when the permission
  -- table allows the action of that command.
  ('saved_view', 'saved_view_own_read',
   '(((user_id)::text = current_setting(''app.user_id''::text, true)) AND (app.allowed(''listSavedViews''::text) IS NOT NULL))'),
  ('saved_view', 'saved_view_own_insert',
   '(((user_id)::text = current_setting(''app.user_id''::text, true)) AND (app.allowed(''saveView''::text) IS NOT NULL))'),
  ('saved_view', 'saved_view_own_update',
   '(((user_id)::text = current_setting(''app.user_id''::text, true)) AND (app.allowed(''editView''::text) IS NOT NULL))'),
  ('saved_view', 'saved_view_own_delete',
   '(((user_id)::text = current_setting(''app.user_id''::text, true)) AND (app.allowed(''removeView''::text) IS NOT NULL))'),
  -- 010_lop_rieng_cua_san.sql (hàng 7e): the company layer is read with readCompanyLayer, added with addCompanyLayer and
  -- changed with the write actions that table uses.
  ('company_labels', 'company_labels_read_by_permission', '(app.allowed(''readCompanyLayer''::text) = ''company''::text)'),
  ('company_labels', 'company_labels_insert_by_permission', '(app.allowed(''addCompanyLayer''::text) = ''company''::text)'),
  ('company_labels', 'company_labels_update_by_permission',
   '((app.allowed(''editCompanyLayer''::text) = ''company''::text) OR (app.allowed(''retireCompanyLayer''::text) = ''company''::text))'),
  ('company_fields', 'company_fields_read_by_permission', '(app.allowed(''readCompanyLayer''::text) = ''company''::text)'),
  ('company_fields', 'company_fields_insert_by_permission', '(app.allowed(''addCompanyLayer''::text) = ''company''::text)'),
  ('company_fields', 'company_fields_update_by_permission',
   '((app.allowed(''editCompanyLayer''::text) = ''company''::text) OR (app.allowed(''retireCompanyLayer''::text) = ''company''::text))'),
  ('company_value_aliases', 'company_value_aliases_read_by_permission', '(app.allowed(''readCompanyLayer''::text) = ''company''::text)'),
  ('company_value_aliases', 'company_value_aliases_insert_by_permission', '(app.allowed(''addCompanyLayer''::text) = ''company''::text)'),
  ('company_value_aliases', 'company_value_aliases_update_by_permission',
   '((app.allowed(''editCompanyLayer''::text) = ''company''::text) OR (app.allowed(''retireCompanyLayer''::text) = ''company''::text))'),
  ('company_pending_units', 'company_pending_units_read_by_permission', '(app.allowed(''readCompanyLayer''::text) = ''company''::text)'),
  ('company_pending_units', 'company_pending_units_insert_by_permission', '(app.allowed(''addCompanyLayer''::text) = ''company''::text)'),
  ('company_pending_units', 'company_pending_units_update_by_permission',
   '((app.allowed(''retireCompanyLayer''::text) = ''company''::text) OR (app.allowed(''matchPendingUnits''::text) = ''company''::text))'),
  ('company_import_templates', 'company_import_templates_read_by_permission', '(app.allowed(''readCompanyLayer''::text) = ''company''::text)'),
  ('company_import_templates', 'company_import_templates_insert_by_permission', '(app.allowed(''addCompanyLayer''::text) = ''company''::text)'),
  ('company_import_templates', 'company_import_templates_update_by_permission',
   '((app.allowed(''editCompanyLayer''::text) = ''company''::text) OR (app.allowed(''retireCompanyLayer''::text) = ''company''::text))'),
  -- 012_thue_phi.sql (hàng 19): the fee items are read with readFeeSchedule and written with setFeeSchedule.
  ('company_fee_items', 'company_fee_items_read_by_permission', '(app.allowed(''readFeeSchedule''::text) = ''company''::text)'),
  ('company_fee_items', 'company_fee_items_insert_by_permission', '(app.allowed(''setFeeSchedule''::text) = ''company''::text)'),
  ('company_fee_items', 'company_fee_items_update_by_permission', '(app.allowed(''setFeeSchedule''::text) = ''company''::text)');

create function pg_temp.dung_dang(bang name, luat name, lenh text, bieu_thuc text, cot text,
                                  kieu text default 'PERMISSIVE') returns boolean
language sql stable as $f$
  select (kieu = 'PERMISSIVE'
          and (bieu_thuc = format('(%s = app.current_company_id())', cot)
               or (lenh = 'SELECT' and exists (select from pg_temp.luat_cho_phep l
                                               where l.bang = $1 and l.luat = $2 and l.bieu_thuc = $4))))
      or (kieu = 'RESTRICTIVE' and exists (select from pg_temp.luat_thu_hep l
                                           where l.bang = $1 and l.luat = $2 and l.bieu_thuc = $4));
$f$;

-- Tables in scope: every ordinary or partitioned table in schema public with a company_id column, plus companies.
create function pg_temp.bang_cong_ty() returns table (oid oid, ten name, cot text) language sql as $f$
  select c.oid, c.relname, case when c.relname = 'companies' then 'id' else 'company_id' end
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind in ('r', 'p')
    and (c.relname = 'companies'
         or exists (select from pg_attribute a
                    where a.attrelid = c.oid and a.attname = 'company_id' and not a.attisdropped))
  order by c.relname;
$f$;

-- 1. Positive control: the owner sees everything in the same transaction, then the switch to the API role works.
begin;
select pg_temp.dung_hai_san();
do $$
declare s bigint; t bigint;
begin
  select count(*) into s from companies;
  select count(*) into t from agreements;
  if s <> 2 or t <> 3 then
    raise exception 'HỎNG doi-chung-vai-chu-thay-du: vai chủ thấy % sàn, % thoả thuận', s, t;
  end if;
end $$;
set local role quy_hang_app;
do $$
begin
  if current_user <> 'quy_hang_app' then
    raise exception 'HỎNG doi-chung-vai-chu-thay-du: không đổi được sang vai quy_hang_app';
  end if;
  raise notice 'ok doi-chung-vai-chu-thay-du';
end $$;
rollback;

-- 2. Company never set in this session: nothing visible, no error.
begin;
select pg_temp.dung_hai_san();
set local role quy_hang_app;
do $$
begin
  if current_setting('app.company_id', true) is not null then
    raise exception 'HỎNG chua-dat-san-khong-thay-gi: phiên đã có sàn trước ca';
  end if;
  perform pg_temp.khong_thay_gi('chua-dat-san-khong-thay-gi');
  raise notice 'ok chua-dat-san-khong-thay-gi';
end $$;
rollback;

-- 3. Company set to an empty string, as the door does when no company is chosen.
begin;
select pg_temp.dung_hai_san();
set local role quy_hang_app;
execute dat_san('[Tên]', '');
do $$
begin
  perform pg_temp.khong_thay_gi('san-rong-khong-thay-gi');
  raise notice 'ok san-rong-khong-thay-gi';
end $$;
rollback;

-- 4. Reused connection: the previous transaction set company A and committed; the next one sets nothing.
begin;
set local role quy_hang_app;
execute dat_san('[Tên]', '00000000-0000-4000-8000-00000000000a');
commit;
begin;
select pg_temp.dung_hai_san();
set local role quy_hang_app;
do $$
begin
  perform pg_temp.khong_thay_gi('ket-noi-da-dung-khong-thay-gi');
  raise notice 'ok ket-noi-da-dung-khong-thay-gi';
end $$;
rollback;

-- 5. Company A sees only itself.
begin;
select pg_temp.dung_hai_san();
set local role quy_hang_app;
execute dat_san('[Tên]', '00000000-0000-4000-8000-00000000000a');
do $$
declare ids text[];
begin
  select coalesce(array_agg(id::text order by id), '{}') into ids from companies;
  if ids <> array['00000000-0000-4000-8000-00000000000a'] then
    raise exception 'HỎNG a-chi-thay-chinh-minh: companies trả %', ids;
  end if;
  raise notice 'ok a-chi-thay-chinh-minh';
end $$;
rollback;

-- 6. Company A sees its own agreement and the partnership B opened with A, not B's private agreement.
begin;
select pg_temp.dung_hai_san();
set local role quy_hang_app;
execute dat_san('[Tên]', '00000000-0000-4000-8000-00000000000a');
do $$
declare rows_seen text[];
begin
  select coalesce(array_agg(company_id::text || '/' || kind order by company_id, kind), '{}') into rows_seen
  from agreements;
  if rows_seen <> array['00000000-0000-4000-8000-00000000000a/catalog_source',
                        '00000000-0000-4000-8000-00000000000b/company_partnership'] then
    raise exception 'HỎNG a-thay-thoa-thuan-cua-minh-va-hop-tac: agreements trả %', rows_seen;
  end if;
  raise notice 'ok a-thay-thoa-thuan-cua-minh-va-hop-tac';
end $$;
rollback;

-- 7. Company A cannot add an agreement in B's name.
begin;
select pg_temp.dung_hai_san();
select pg_temp.them_quan_tri_a();
set local role quy_hang_app;
execute dat_san('00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-00000000000a');
do $$
begin
  perform pg_temp.phai_loi('a-khong-them-dong-ten-b',
    $q$insert into agreements (company_id, kind, direction, counterparty, data_classes, valid_from, approved_by)
       values ('00000000-0000-4000-8000-00000000000b', 'spreadsheet', 'outbound', 'x', '{catalog}', now(), '[Tên]')$q$,
    'violates row-level security policy');
  raise notice 'ok a-khong-them-dong-ten-b';
end $$;
rollback;

-- 8. Company A's update of B's agreement touches no row, and B's row keeps its value.
begin;
select pg_temp.dung_hai_san();
select pg_temp.them_quan_tri_a();
set local role quy_hang_app;
execute dat_san('00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-00000000000a');
do $$
declare n bigint;
begin
  update agreements set counterparty = 'đã đổi' where company_id = '00000000-0000-4000-8000-00000000000b';
  get diagnostics n = row_count;
  if n <> 0 then
    raise exception 'HỎNG a-khong-sua-dong-cua-b: sửa được % dòng của B', n;
  end if;
end $$;
reset role;
do $$
begin
  if exists (select from agreements where company_id = '00000000-0000-4000-8000-00000000000b'
                                     and counterparty = 'đã đổi') then
    raise exception 'HỎNG a-khong-sua-dong-cua-b: dòng của B đã bị đổi';
  end if;
  raise notice 'ok a-khong-sua-dong-cua-b';
end $$;
rollback;

-- 9. Company A cannot move its agreement to B.
begin;
select pg_temp.dung_hai_san();
select pg_temp.them_quan_tri_a();
set local role quy_hang_app;
execute dat_san('00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-00000000000a');
do $$
begin
  perform pg_temp.phai_loi('a-khong-chuyen-dong-sang-b',
    $q$update agreements set company_id = '00000000-0000-4000-8000-00000000000b'
       where company_id = '00000000-0000-4000-8000-00000000000a'$q$,
    'violates row-level security policy');
  raise notice 'ok a-khong-chuyen-dong-sang-b';
end $$;
rollback;

-- 10. The API role cannot create a company or rename one.
begin;
select pg_temp.dung_hai_san();
set local role quy_hang_app;
execute dat_san('[Tên]', '00000000-0000-4000-8000-00000000000a');
do $$
begin
  perform pg_temp.phai_loi('vai-api-khong-tao-sua-san',
    $q$insert into companies (name) values ('[Sàn mới]')$q$,
    'permission denied for table companies');
  perform pg_temp.phai_loi('vai-api-khong-tao-sua-san',
    $q$update companies set name = '[Tên mới]' where id = '00000000-0000-4000-8000-00000000000a'$q$,
    'permission denied for table companies');
  raise notice 'ok vai-api-khong-tao-sua-san';
end $$;
rollback;

-- 11. The API role cannot delete an agreement, not even its own.
begin;
select pg_temp.dung_hai_san();
set local role quy_hang_app;
execute dat_san('[Tên]', '00000000-0000-4000-8000-00000000000a');
do $$
begin
  perform pg_temp.phai_loi('vai-api-khong-xoa-thoa-thuan',
    $q$delete from agreements where company_id = '00000000-0000-4000-8000-00000000000a'$q$,
    'permission denied for table agreements');
  raise notice 'ok vai-api-khong-xoa-thoa-thuan';
end $$;
rollback;

-- 12. Every company table enables and forces row level security.
do $$
declare b record; n int := 0;
begin
  for b in select * from pg_temp.bang_cong_ty() loop
    n := n + 1;
    if not exists (select from pg_class c where c.oid = b.oid and c.relrowsecurity and c.relforcerowsecurity) then
      raise exception 'HỎNG moi-bang-cong-ty-ep-luat-theo-dong: % chưa bật và ép luật theo dòng', b.ten;
    end if;
  end loop;
  if n = 0 then
    raise exception 'HỎNG moi-bang-cong-ty-ep-luat-theo-dong: không thấy bảng công ty nào';
  end if;
  raise notice 'ok moi-bang-cong-ty-ep-luat-theo-dong — % bảng', n;
end $$;

-- 13. Every policy of every company table has an allowed shape (pg_temp.dung_dang); reads exist; inserts and updates
--     have a check.
do $$
declare b record; p record; n int := 0;
begin
  for b in select * from pg_temp.bang_cong_ty() loop
    n := n + 1;
    if not exists (select from pg_policies
                   where schemaname = 'public' and tablename = b.ten and cmd in ('SELECT', 'ALL')
                     and permissive = 'PERMISSIVE') then
      raise exception 'HỎNG luat-doc-ghi-theo-san: % không có luật đọc', b.ten;
    end if;
    for p in select * from pg_policies where schemaname = 'public' and tablename = b.ten loop
      -- A restrictive policy alone grants nothing: its command needs a company policy of its own.
      if p.permissive = 'RESTRICTIVE'
         and not exists (select from pg_policies q
                         where q.schemaname = 'public' and q.tablename = b.ten and q.permissive = 'PERMISSIVE'
                           and (q.cmd = p.cmd or q.cmd = 'ALL')) then
        raise exception 'HỎNG luat-doc-ghi-theo-san: % — luật thu hẹp % không có luật theo sàn cùng lệnh', b.ten, p.policyname;
      end if;
      if p.qual is not null and not pg_temp.dung_dang(b.ten, p.policyname, p.cmd, p.qual, b.cot, p.permissive) then
        raise exception 'HỎNG luat-doc-ghi-theo-san: % — luật % không đúng dạng cho phép: %', b.ten, p.policyname, p.qual;
      end if;
      if p.with_check is not null
         and not pg_temp.dung_dang(b.ten, p.policyname, p.cmd, p.with_check, b.cot, p.permissive) then
        raise exception 'HỎNG luat-doc-ghi-theo-san: % — luật % kiểm không đúng dạng cho phép: %',
          b.ten, p.policyname, p.with_check;
      end if;
      if p.cmd in ('INSERT', 'UPDATE') and p.with_check is null then
        raise exception 'HỎNG luat-doc-ghi-theo-san: % — luật % không có điều kiện kiểm', b.ten, p.policyname;
      end if;
    end loop;
  end loop;
  raise notice 'ok luat-doc-ghi-theo-san — % bảng', n;
end $$;

-- 14. The API role owns no company table, is not a superuser and cannot bypass row level security.
do $$
declare b record; r record;
begin
  select rolsuper, rolbypassrls into r from pg_roles where rolname = 'quy_hang_app';
  if not found then
    raise exception 'HỎNG vai-api-khong-so-huu-khong-vuot: không có vai quy_hang_app';
  end if;
  if r.rolsuper or r.rolbypassrls then
    raise exception 'HỎNG vai-api-khong-so-huu-khong-vuot: vai là siêu người dùng hoặc vượt được luật theo dòng';
  end if;
  for b in select * from pg_temp.bang_cong_ty() loop
    if exists (select from pg_class c where c.oid = b.oid
                                        and pg_has_role('quy_hang_app', c.relowner, 'MEMBER')) then
      raise exception 'HỎNG vai-api-khong-so-huu-khong-vuot: vai sở hữu bảng %', b.ten;
    end if;
  end loop;
  raise notice 'ok vai-api-khong-so-huu-khong-vuot';
end $$;

-- Row 7a (hồ sơ cach-ly-truoc-du-lieu-that). Each scan below is an allow-list over everything the API role can reach,
-- in every schema that is not a system schema, so a new kind of detour fails until a line here says it is allowed.

-- Relations of every non-system schema (this session's own temporary objects are not counted).
create function pg_temp.quan_he_ngoai_he_thong() returns table (oid oid, ten text, loai "char") language sql as $f$
  select c.oid, format('%s.%s', n.nspname, c.relname), c.relkind
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname not in ('pg_catalog', 'information_schema')
    and n.nspname not like 'pg\_toast%' and n.nspname not like 'pg\_temp%'
    and c.relkind in ('r', 'p', 'v', 'm', 'f')
  order by 2;
$f$;

-- 15. Positive control for writes (Ngoài-30): company A adds and changes its own agreement, and reads both back. Since
--     row 9a only a person whose roles allow manageAgreements writes agreements, so the session is A's company admin.
begin;
select pg_temp.dung_hai_san();
select pg_temp.them_quan_tri_a();
set local role quy_hang_app;
execute dat_san('00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-00000000000a');
do $$
declare n bigint; v text;
begin
  begin
    insert into agreements (company_id, kind, direction, counterparty, data_classes, valid_from, approved_by)
    values ('00000000-0000-4000-8000-00000000000a', 'spreadsheet', 'inbound', 'bảng mẫu', '{catalog}', now(), '[Tên]');
    get diagnostics n = row_count;
    if n <> 1 then raise exception 'thêm được % dòng, cần 1', n; end if;
    update agreements set counterparty = 'nguồn đã sửa'
    where company_id = '00000000-0000-4000-8000-00000000000a' and kind = 'catalog_source';
    get diagnostics n = row_count;
    if n <> 1 then raise exception 'sửa được % dòng, cần 1', n; end if;
    select count(*) into n from agreements
    where company_id = '00000000-0000-4000-8000-00000000000a' and kind = 'spreadsheet' and counterparty = 'bảng mẫu';
    if n <> 1 then raise exception 'đọc lại thấy % dòng vừa thêm, cần 1', n; end if;
    select counterparty into v from agreements
    where company_id = '00000000-0000-4000-8000-00000000000a' and kind = 'catalog_source';
    if v is distinct from 'nguồn đã sửa' then raise exception 'đọc lại giá trị %, cần «nguồn đã sửa»', v; end if;
  exception when others then
    raise exception 'HỎNG a-ghi-duoc-dong-cua-minh: %', sqlerrm;
  end;
  raise notice 'ok a-ghi-duoc-dong-cua-minh';
end $$;
rollback;

-- 16. No dangerous privilege (Ngoài-4, 6, 20): row security does not apply to TRUNCATE, and TRIGGER or REFERENCES
--     let a role act on rows it cannot see. has_table_privilege counts grants to PUBLIC and to parent roles too.
begin;
select pg_temp.dung_hai_san();
set local role quy_hang_app;
execute dat_san('[Tên]', '00000000-0000-4000-8000-00000000000a');
do $$
begin
  perform pg_temp.phai_loi('vai-api-khong-quyen-nguy-hiem', 'truncate agreements',
    'permission denied for table agreements');
end $$;
rollback;
do $$
declare r record; q text; k int := 0;
begin
  for r in select * from pg_temp.quan_he_ngoai_he_thong() loop
    k := k + 1;
    foreach q in array array['TRUNCATE', 'TRIGGER', 'REFERENCES'] loop
      if has_table_privilege('quy_hang_app', r.oid, q) then
        raise exception 'HỎNG vai-api-khong-quyen-nguy-hiem: % %', r.ten, q;
      end if;
    end loop;
  end loop;
  if k = 0 then raise exception 'HỎNG vai-api-khong-quyen-nguy-hiem: không thấy quan hệ nào'; end if;
  raise notice 'ok vai-api-khong-quyen-nguy-hiem — % quan hệ', k;
end $$;

-- 17. The API role touches only tables with row security (Ngoài-19, a new table without rules): every table it holds
--     any privilege on, in any schema, enables and forces row level security; it creates nothing and cannot enter
--     the identity schema. Cases 12 and 13 look at schema public only; this case closes that from the role's side.
do $$
declare r record; k int := 0; thay text[] := '{}';
begin
  for r in select q.oid, q.ten from pg_temp.quan_he_ngoai_he_thong() q where q.loai in ('r', 'p', 'f') loop
    if has_any_column_privilege('quy_hang_app', r.oid, 'SELECT')
       or has_any_column_privilege('quy_hang_app', r.oid, 'INSERT')
       or has_any_column_privilege('quy_hang_app', r.oid, 'UPDATE')
       or has_table_privilege('quy_hang_app', r.oid, 'DELETE') then
      k := k + 1;
      thay := thay || r.ten;
      if not exists (select from pg_class c where c.oid = r.oid and c.relrowsecurity and c.relforcerowsecurity) then
        raise exception 'HỎNG vai-api-chi-cham-bang-co-luat: % — vai chạm được mà không bật và ép luật theo dòng', r.ten;
      end if;
    end if;
  end loop;
  -- Positive control: the scan sees the three company tables the API role is known to read.
  if not thay @> array['public.agreements', 'public.companies', 'public.company_members'] then
    raise exception 'HỎNG vai-api-chi-cham-bang-co-luat: bản quét không thấy đủ ba bảng công ty, chỉ thấy %', thay;
  end if;
  -- Shared catalogs (row 9a): a table without company_id that the role reaches must be on this written list, and the
  -- role only reads it: the permission table, app.permissions (006_bang_quyen_theo_vai.sql), and the five tables of the
  -- shared unit catalog (007_danh_muc_nhu_invest.sql).
  for r in select q.oid, q.ten from pg_temp.quan_he_ngoai_he_thong() q
           where q.loai in ('r', 'p', 'f') and q.ten = any (thay)
             and q.ten <> 'public.companies'
             and not exists (select from pg_attribute a
                             where a.attrelid = q.oid and a.attname = 'company_id' and not a.attisdropped) loop
    if r.ten <> all (array['app.permissions',
                           -- 007_danh_muc_nhu_invest.sql (hàng 7d): danh mục căn dùng chung.
                           'public.catalog_nodes', 'public.catalog_buildings', 'public.catalog_stacks',
                           'public.catalog_units', 'public.catalog_aliases']) then
      raise exception 'HỎNG vai-api-chi-cham-bang-co-luat: % — bảng không có company_id mà vai chạm được, không phải danh mục chung đã khai', r.ten;
    end if;
    if has_any_column_privilege('quy_hang_app', r.oid, 'INSERT')
       or has_any_column_privilege('quy_hang_app', r.oid, 'UPDATE')
       or has_table_privilege('quy_hang_app', r.oid, 'DELETE') then
      raise exception 'HỎNG vai-api-chi-cham-bang-co-luat: % — vai ghi được danh mục chung', r.ten;
    end if;
  end loop;
  for r in select n.nspname from pg_namespace n
           where n.nspname not like 'pg\_%' and has_schema_privilege('quy_hang_app', n.oid, 'CREATE') loop
    raise exception 'HỎNG vai-api-chi-cham-bang-co-luat: vai có quyền tạo trong schema %', r.nspname;
  end loop;
  if exists (select from pg_namespace where nspname = 'identity')
     and has_schema_privilege('quy_hang_app', 'identity', 'USAGE') then
    raise exception 'HỎNG vai-api-chi-cham-bang-co-luat: vai vào được schema identity';
  end if;
  raise notice 'ok vai-api-chi-cham-bang-co-luat — % bảng', k;
end $$;

-- 18. Views do not bypass row security (Ngoài-4, 14, 19): a view runs as its owner unless it is security_invoker, and
--     a materialized view has no row security at all. Every view the API role can read must be security_invoker; no
--     materialized view may be readable by it.
create function pg_temp.dang_xem_vuot() returns table (ten text, doc_duoc int) language sql as $f$
  with doc as (
    select q.oid, q.ten, q.loai from pg_temp.quan_he_ngoai_he_thong() q
    where q.loai in ('v', 'm') and has_any_column_privilege('quy_hang_app', q.oid, 'SELECT')
  )
  select d.ten, (select count(*)::int from doc) from doc d
  where d.loai = 'm'
     or not exists (select from pg_class c, unnest(coalesce(c.reloptions, '{}')) o
                    where c.oid = d.oid
                      and lower(o) in ('security_invoker=true', 'security_invoker=on', 'security_invoker=1',
                                       'security_invoker=yes'))
  union all
  select null, (select count(*)::int from doc);
$f$;
-- Positive control in its own transaction: a security_invoker view granted to the API role is counted, not named.
begin;
create view public.agreements_doi_chung with (security_invoker = true) as select id, company_id from agreements;
grant select on public.agreements_doi_chung to quy_hang_app;
do $$
declare ten_vuot text[]; dem int;
begin
  select array_agg(ten) filter (where ten is not null), max(doc_duoc) into ten_vuot, dem from pg_temp.dang_xem_vuot();
  if ten_vuot is not null or dem <> 1 then
    raise exception 'HỎNG dang-xem-khong-vuot-luat: đối chứng — dạng xem chạy theo người đọc bị nêu (%) hoặc không được đếm (%)',
      ten_vuot, dem;
  end if;
end $$;
rollback;
do $$
declare ten_vuot text[]; dem int;
begin
  select array_agg(ten order by ten) filter (where ten is not null), max(doc_duoc) into ten_vuot, dem
  from pg_temp.dang_xem_vuot();
  if ten_vuot is not null then
    raise exception 'HỎNG dang-xem-khong-vuot-luat: % — dạng xem vai đọc được mà không chạy theo quyền người đọc, hoặc là dạng xem vật chất hoá',
      array_to_string(ten_vuot, ', ');
  end if;
  raise notice 'ok dang-xem-khong-vuot-luat — % dạng xem', dem;
end $$;

-- 19. Privileged functions are a written list (Ngoài-4, 14, 19): a SECURITY DEFINER function runs as its owner, so one
--     the API role can call — directly or through PUBLIC, which every new function gets by default — or that a trigger
--     on a table the role can write calls, must be listed here with its owner and a pinned search_path. The list is the
--     identity exception the owner approved: row 8 (dang-nhap-ma-email#d-20261111T052230Z-14) and row 9
--     (moi-nguoi-gan-vai#d-20261111T084753Z-14). An 11th function needs the owner's word first.
create temp table ham_cho_phep (lich text not null, chu name not null, duyet text not null);
insert into ham_cho_phep values
  ('app.login_request_code', 'quy_hang_identity', 'dang-nhap-ma-email#d-20261111T052230Z-14'),
  ('app.login_verify_code', 'quy_hang_identity', 'dang-nhap-ma-email#d-20261111T052230Z-14'),
  ('app.session_read', 'quy_hang_identity', 'dang-nhap-ma-email#d-20261111T052230Z-14'),
  ('app.session_companies', 'quy_hang_identity', 'dang-nhap-ma-email#d-20261111T052230Z-14'),
  ('app.session_set_company', 'quy_hang_identity', 'dang-nhap-ma-email#d-20261111T052230Z-14'),
  ('app.session_end', 'quy_hang_identity', 'dang-nhap-ma-email#d-20261111T052230Z-14'),
  ('app.member_roles', 'quy_hang_identity', 'moi-nguoi-gan-vai#d-20261111T084753Z-14'),
  ('app.member_list', 'quy_hang_identity', 'moi-nguoi-gan-vai#d-20261111T084753Z-14'),
  ('app.member_invite', 'quy_hang_identity', 'moi-nguoi-gan-vai#d-20261111T084753Z-14'),
  ('app.member_set_roles', 'quy_hang_identity', 'moi-nguoi-gan-vai#d-20261111T084753Z-14');
do $$
declare r record; k int := 0;
begin
  for r in
    select distinct format('%s.%s', n.nspname, p.proname) as lich, pg_get_userbyid(p.proowner) as chu, p.proconfig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where p.prosecdef
      and n.nspname not in ('pg_catalog', 'information_schema') and n.nspname not like 'pg\_temp%'
      and (has_function_privilege('quy_hang_app', p.oid, 'EXECUTE')
           or exists (select from pg_trigger t
                      where t.tgfoid = p.oid and not t.tgisinternal
                        and (has_table_privilege('quy_hang_app', t.tgrelid, 'INSERT')
                             or has_table_privilege('quy_hang_app', t.tgrelid, 'UPDATE')
                             or has_table_privilege('quy_hang_app', t.tgrelid, 'DELETE'))))
    order by 1
  loop
    k := k + 1;
    if not exists (select from ham_cho_phep h where h.lich = r.lich) then
      raise exception 'HỎNG ham-dac-quyen-trong-danh-sach: % (chủ %) — hàm đặc quyền vai gọi được hay trigger gọi tới, không có trong danh sách',
        r.lich, r.chu;
    end if;
    if not exists (select from ham_cho_phep h where h.lich = r.lich and h.chu = r.chu) then
      raise exception 'HỎNG ham-dac-quyen-trong-danh-sach: % — chủ là %, danh sách ghi khác', r.lich, r.chu;
    end if;
    if not exists (select from unnest(coalesce(r.proconfig, '{}')) c where c like 'search\_path=%') then
      raise exception 'HỎNG ham-dac-quyen-trong-danh-sach: % — không ghim đường tìm', r.lich;
    end if;
  end loop;
  if k <> (select count(*) from ham_cho_phep) then
    raise exception 'HỎNG ham-dac-quyen-trong-danh-sach: tìm thấy % hàm, danh sách có % — hàm trong danh sách đã mất hay đổi',
      k, (select count(*) from ham_cho_phep);
  end if;
  raise notice 'ok ham-dac-quyen-trong-danh-sach — % hàm', k;
end $$;

-- 20. Views do not write past row security (row 7b, hồ sơ cach-ly-dang-xem-chi-ghi): case 18 looks only at views the
--     API role can read, but a plain view runs as its owner for INSERT, UPDATE and DELETE too, and those need no
--     SELECT. Every view the role can insert into, update (any column) or delete from — granted directly, through
--     PUBLIC or through a parent role — must be security_invoker. Materialized views cannot be written.
create function pg_temp.dang_xem_ghi() returns table (ten text, quyen text, theo_nguoi_doc boolean) language sql as $f$
  select q.ten, p.quyen,
         exists (select from pg_class c, unnest(coalesce(c.reloptions, '{}')) o
                 where c.oid = q.oid
                   and lower(o) in ('security_invoker=true', 'security_invoker=on', 'security_invoker=1',
                                    'security_invoker=yes'))
  from pg_temp.quan_he_ngoai_he_thong() q
  cross join unnest(array['INSERT', 'UPDATE', 'DELETE']) as p(quyen)
  where q.loai = 'v'
    and case p.quyen when 'DELETE' then has_table_privilege('quy_hang_app', q.oid, 'DELETE')
                     else has_any_column_privilege('quy_hang_app', q.oid, p.quyen) end
  order by 1, 2;
$f$;
do $$
declare doi_chung int; doi_chung_bi_neu boolean; dem int; vuot text[];
begin
  -- Positive control in a subtransaction that is always undone: a security_invoker view with insert, update on one
  -- column and delete granted to the API role is counted once and not named.
  begin
    create view public.agreements_doi_chung_ghi with (security_invoker = true) as select * from agreements;
    grant insert, delete on public.agreements_doi_chung_ghi to quy_hang_app;
    grant update (counterparty) on public.agreements_doi_chung_ghi to quy_hang_app;
    select count(distinct ten), bool_or(not theo_nguoi_doc) into doi_chung, doi_chung_bi_neu
    from pg_temp.dang_xem_ghi() where ten = 'public.agreements_doi_chung_ghi';
    raise sqlstate 'U7B00';
  exception when sqlstate 'U7B00' then null;
  end;
  if doi_chung <> 1 or doi_chung_bi_neu then
    raise exception 'HỎNG dang-xem-ghi-khong-vuot-luat: đối chứng — dạng xem chạy theo người đọc được đếm % lần, bị nêu: %',
      doi_chung, doi_chung_bi_neu;
  end if;
  select count(distinct ten), array_agg(ten || ' ' || quyen order by ten, quyen) filter (where not theo_nguoi_doc)
    into dem, vuot
  from pg_temp.dang_xem_ghi();
  if vuot is not null then
    raise exception 'HỎNG dang-xem-ghi-khong-vuot-luat: % — dạng xem vai ghi được mà không chạy theo quyền người đọc',
      array_to_string(vuot, ', ');
  end if;
  raise notice 'ok dang-xem-ghi-khong-vuot-luat — % dạng xem, đối chứng %', dem, doi_chung;
end $$;

-- 21. The company layer (row 7e, hồ sơ lop-rieng-cua-san): each of the five tables, with one row of A as the owner,
--     shows that row to A's admin and nothing to B's admin or to a session without a company; A cannot write a row in
--     B's name; the API role cannot delete from any of them. Positive control: A's admin reads its five rows back.
begin;
select pg_temp.dung_hai_san();
select pg_temp.them_quan_tri_a();
insert into identity.users (id, email, name)
  values ('00000000-0000-4000-8000-0000000000b1', 'quan-tri-b@example.test', '[Tên]');
insert into company_members (company_id, user_id, name, roles)
  values ('00000000-0000-4000-8000-00000000000b', '00000000-0000-4000-8000-0000000000b1', '[Tên]', '{CompanyAdmin}');
insert into company_labels (company_id, concept, label)
  values ('00000000-0000-4000-8000-00000000000a', 'Building', 'Block');
insert into company_fields (company_id, code, name, kind, options, position)
  values ('00000000-0000-4000-8000-00000000000a', 'huong_view', 'Hướng view', 'single_select', '["Biển"]', 1);
insert into company_value_aliases (company_id, field, raw, raw_fold, value)
  values ('00000000-0000-4000-8000-00000000000a', 'directionFaces', 'ĐN', 'dn', 'Southeast');
insert into company_pending_units (company_id, raw_code)
  values ('00000000-0000-4000-8000-00000000000a', 'SA5-12.08');
insert into company_import_templates (company_id, name, signature, columns)
  values ('00000000-0000-4000-8000-00000000000a', 'Mẫu A', '{ma can}', '[{"target":"Listing.unitNumber"}]');
set local role quy_hang_app;
create function pg_temp.dem_lop_rieng() returns int[] language sql as $f$
  select array[(select count(*) from company_labels)::int, (select count(*) from company_fields)::int,
               (select count(*) from company_value_aliases)::int, (select count(*) from company_pending_units)::int,
               (select count(*) from company_import_templates)::int];
$f$;
do $$
declare n int[]; cau text; bang text;
begin
  perform set_config('app.user_id', '00000000-0000-4000-8000-0000000000a1', true);
  perform set_config('app.company_id', '00000000-0000-4000-8000-00000000000a', true);
  n := pg_temp.dem_lop_rieng();
  if n <> array[1, 1, 1, 1, 1] then
    raise exception 'HỎNG lop-rieng-theo-san: đối chứng — quản trị sàn A thấy % dòng', n;
  end if;
  -- Each of the five tables: no row in B's name, and no delete at all (retiring is the only way out).
  foreach cau in array array[
    'insert into company_labels (company_id, concept, label) values (''00000000-0000-4000-8000-00000000000b'', ''Unit'', ''X'')',
    'insert into company_fields (company_id, code, name, kind, position) values (''00000000-0000-4000-8000-00000000000b'', ''x'', ''X'', ''text'', 1)',
    'insert into company_value_aliases (company_id, field, raw, raw_fold, value) values (''00000000-0000-4000-8000-00000000000b'', ''directionFaces'', ''X'', ''x'', ''North'')',
    'insert into company_pending_units (company_id, raw_code) values (''00000000-0000-4000-8000-00000000000b'', ''X-1'')',
    'insert into company_import_templates (company_id, name, signature, columns) values (''00000000-0000-4000-8000-00000000000b'', ''X'', ''{x}'', ''[]'')'
  ] loop
    perform pg_temp.phai_loi('lop-rieng-theo-san', cau, 'row-level security');
  end loop;
  foreach bang in array array['company_labels', 'company_fields', 'company_value_aliases', 'company_pending_units',
                              'company_import_templates'] loop
    perform pg_temp.phai_loi('lop-rieng-theo-san', 'delete from ' || bang, 'permission denied');
  end loop;
  perform set_config('app.user_id', '00000000-0000-4000-8000-0000000000b1', true);
  perform set_config('app.company_id', '00000000-0000-4000-8000-00000000000b', true);
  n := pg_temp.dem_lop_rieng();
  if n <> array[0, 0, 0, 0, 0] then
    raise exception 'HỎNG lop-rieng-theo-san: sàn B thấy % dòng của A', n;
  end if;
  perform set_config('app.company_id', '', true);
  n := pg_temp.dem_lop_rieng();
  if n <> array[0, 0, 0, 0, 0] then
    raise exception 'HỎNG lop-rieng-theo-san: phiên chưa chọn sàn thấy % dòng', n;
  end if;
  raise notice 'ok lop-rieng-theo-san — 5 bảng';
end $$;
rollback;

-- 22. Fees and taxes (row 19, hồ sơ thue-phi): A's changed brokerage shows to A's admin and to nobody else; B's admin
--     cannot write a row in A's name nor change A's row; a person of A without setFeeSchedule cannot write at all; the
--     API role cannot delete. Positive control: A's admin reads its row back and writes one of its own.
begin;
select pg_temp.dung_hai_san();
select pg_temp.them_quan_tri_a();
insert into identity.users (id, email, name) values
  ('00000000-0000-4000-8000-0000000000b1', 'quan-tri-b@example.test', '[Tên]'),
  ('00000000-0000-4000-8000-0000000000a2', 'dau-chu-a@example.test', '[Tên]');
insert into company_members (company_id, user_id, name, roles) values
  ('00000000-0000-4000-8000-00000000000b', '00000000-0000-4000-8000-0000000000b1', '[Tên]', '{CompanyAdmin}'),
  ('00000000-0000-4000-8000-00000000000a', '00000000-0000-4000-8000-0000000000a2', '[Tên]', '{ListAgent,TeamLead}');
insert into company_fee_items (company_id, code, kind, rate_bp, included, position, changed_by, changed_by_name)
  values ('00000000-0000-4000-8000-00000000000a', 'brokerage', 'Own', 200, true, 0,
          '00000000-0000-4000-8000-0000000000a1', '[Tên]');
set local role quy_hang_app;
do $$
declare n int;
begin
  perform set_config('app.user_id', '00000000-0000-4000-8000-0000000000a1', true);
  perform set_config('app.company_id', '00000000-0000-4000-8000-00000000000a', true);
  select count(*) into n from company_fee_items;
  if n <> 1 then raise exception 'HỎNG thue-phi-theo-san: đối chứng — quản trị sàn A thấy % dòng', n; end if;
  insert into company_fee_items (company_id, code, kind, rate_bp, included, position, changed_by, changed_by_name)
    values ('00000000-0000-4000-8000-00000000000a', 'k1', 'Own', 30, true, 1,
            '00000000-0000-4000-8000-0000000000a1', '[Tên]');
  perform pg_temp.phai_loi('thue-phi-theo-san',
    'insert into company_fee_items (company_id, code, kind, rate_bp, included, position, changed_by, changed_by_name) '
    'values (''00000000-0000-4000-8000-00000000000b'', ''brokerage'', ''Own'', 500, true, 0, '
    '''00000000-0000-4000-8000-0000000000a1'', ''X'')', 'row-level security');
  perform pg_temp.phai_loi('thue-phi-theo-san', 'delete from company_fee_items', 'permission denied');
  -- A person of A whose roles only read the schedule: reads, never writes.
  perform set_config('app.user_id', '00000000-0000-4000-8000-0000000000a2', true);
  select count(*) into n from company_fee_items;
  if n <> 2 then raise exception 'HỎNG thue-phi-theo-san: đầu chủ sàn A thấy % dòng', n; end if;
  perform pg_temp.phai_loi('thue-phi-theo-san',
    'insert into company_fee_items (company_id, code, kind, rate_bp, included, position, changed_by, changed_by_name) '
    'values (''00000000-0000-4000-8000-00000000000a'', ''k2'', ''Own'', 10, true, 2, '
    '''00000000-0000-4000-8000-0000000000a2'', ''X'')', 'row-level security');
  update company_fee_items set rate_bp = 0;
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'HỎNG thue-phi-theo-san: đầu chủ sàn A sửa được % dòng', n; end if;
  perform set_config('app.user_id', '00000000-0000-4000-8000-0000000000b1', true);
  perform set_config('app.company_id', '00000000-0000-4000-8000-00000000000b', true);
  select count(*) into n from company_fee_items;
  if n <> 0 then raise exception 'HỎNG thue-phi-theo-san: sàn B thấy % dòng của A', n; end if;
  update company_fee_items set rate_bp = 0;
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'HỎNG thue-phi-theo-san: sàn B sửa được % dòng của A', n; end if;
  perform set_config('app.company_id', '', true);
  select count(*) into n from company_fee_items;
  if n <> 0 then raise exception 'HỎNG thue-phi-theo-san: phiên chưa chọn sàn thấy % dòng', n; end if;
  raise notice 'ok thue-phi-theo-san — đọc, ghi, vai chỉ đọc, sàn khác';
end $$;
rollback;
