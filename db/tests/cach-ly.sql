-- Company isolation suite (SP-1): 14 SQL cases, run by db/scripts/cach-ly.sh on a scratch database that has the
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

-- A policy expression filters by company when every OR-term is exactly `<column> = app.current_company_id()`.
-- Reads may also match a partner column (one ending in company_id); writes may only match the table's own company
-- column. Anything else — `true`, `<>`, `is not null`, an extra `or …`, an `and …` — fails closed.
create function pg_temp.loc_theo_san(bieu_thuc text, cot text, chi_cot_san boolean) returns boolean
language plpgsql immutable as $f$
declare phan text; m text[]; co_cot_san boolean := false;
begin
  foreach phan in array string_to_array(bieu_thuc, ' OR ') loop
    -- Strips the deparser's parentheses, including the call's own `()`.
    m := regexp_match(btrim(phan, ' ()'), '^(\w+) = app\.current_company_id$');
    if m is null then return false; end if;
    if m[1] = cot then
      co_cot_san := true;
    elsif chi_cot_san or m[1] !~ 'company_id$' then
      return false;
    end if;
  end loop;
  return co_cot_san;
end $f$;

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
set local role quy_hang_app;
execute dat_san('[Tên]', '00000000-0000-4000-8000-00000000000a');
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
set local role quy_hang_app;
execute dat_san('[Tên]', '00000000-0000-4000-8000-00000000000a');
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
set local role quy_hang_app;
execute dat_san('[Tên]', '00000000-0000-4000-8000-00000000000a');
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

-- 13. Every policy of every company table filters by company (pg_temp.loc_theo_san); reads exist; inserts and updates
--     have a check.
do $$
declare b record; p record; n int := 0;
begin
  for b in select * from pg_temp.bang_cong_ty() loop
    n := n + 1;
    if not exists (select from pg_policies
                   where schemaname = 'public' and tablename = b.ten and cmd in ('SELECT', 'ALL')) then
      raise exception 'HỎNG luat-doc-ghi-theo-san: % không có luật đọc', b.ten;
    end if;
    for p in select * from pg_policies where schemaname = 'public' and tablename = b.ten loop
      if p.qual is not null and not pg_temp.loc_theo_san(p.qual, b.cot, false) then
        raise exception 'HỎNG luat-doc-ghi-theo-san: % — luật % không lọc theo sàn: %', b.ten, p.policyname, p.qual;
      end if;
      if p.with_check is not null and not pg_temp.loc_theo_san(p.with_check, b.cot, true) then
        raise exception 'HỎNG luat-doc-ghi-theo-san: % — luật % kiểm không theo sàn: %',
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
