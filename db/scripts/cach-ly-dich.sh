#!/usr/bin/env bash
# Read-only isolation suite on a TARGET database (row 22, AC-7; SP-1): staging or production, a restored copy, or a
# lane's Postgres in tests. Unlike db/scripts/cach-ly.sh it never creates or drops a database and never writes a row:
# every statement runs inside `begin transaction read only` and ends with `rollback`.
#
#   MIGRATE_DATABASE_URL — the owner's connection string (the role that applies migrations); catalog reads only.
#   LOGIN_DATABASE_URL   — the app's login role connection string (quy_hang_login on the lane); the session cases.
#   PSQL_DICH            — the psql command line that reaches the target (default `psql`). Tests use
#                          `docker exec -i onehub-inventory-db-<lane> psql` with addresses seen from inside the container.
#
# Neither address is ever printed. Every case prints `ok <case>` exactly once; the last line is
# `cach-ly-dich: <n> ca đạt`. A failing case prints one pinned line per finding, and the exit code is not 0:
#   bang khong ep luat dong: <table>        — a company table without enabled AND forced row level security
#   vai <role> co quyen tren: <table>       — anon, authenticated or PUBLIC holds a privilege (Supabase Data API risk)
#   vai dang nhap la chu: <object>          — the login role owns a table, function or schema
#   vai api la chu: <object>                — quy_hang_app owns one
#   vai dang nhap vuot luat dong: <role>    — the login role (or a role it reaches) is superuser or bypasses RLS
#   vai dang nhap ve duoc vai chu: <role>   — the login role is a member of a role that owns tables
#   vai dang nhap doc thang duoc: <table>   — the login role reads a company table without the door's role switch
#   cua khong doi duoc vai: quy_hang_app    — the door's `set local role quy_hang_app` is refused
#   thay dong khi chua dat san: <table> (<n> dong) · thay dong cua san khac: <table> (<n> dong)
#
#   MIGRATE_DATABASE_URL=… LOGIN_DATABASE_URL=… bash db/scripts/cach-ly-dich.sh
set -uo pipefail

# Written before the code: the cases of AC-7, in run order.
CA=(
  bang-cong-ty-ep-luat-dong
  vai-supabase-khong-quyen
  vai-dang-nhap-khong-chu
  phien-dang-nhap-khong-thay-dong
)

for bien in MIGRATE_DATABASE_URL LOGIN_DATABASE_URL; do
  if [ -z "${!bien:-}" ]; then
    echo "cach-ly-dich: thiếu biến $bien (.env.example)" >&2
    exit 2
  fi
done
read -r -a psql_lenh <<<"${PSQL_DICH:-psql}"
API_ROLE="quy_hang_app"

# Company tables: every ordinary or partitioned table with a company_id column outside the identity module (SP-1
# exempts it), plus public.companies.
BANG_CONG_TY="
  select c.oid, format('%I.%I', n.nspname, c.relname) as ten
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where c.relkind in ('r', 'p')
    and n.nspname not in ('pg_catalog', 'information_schema', 'identity')
    and n.nspname not like 'pg\\_%'
    and ((n.nspname = 'public' and c.relname = 'companies')
         or exists (select from pg_attribute a
                    where a.attrelid = c.oid and a.attname = 'company_id' and not a.attisdropped))"

# One read-only transaction on one connection. Stdin is the SQL body; prints the result rows and the text of any
# error, one per line, nothing else. Returns psql's exit code.
chi_doc() {
  local url="$1" ra
  shift
  ra=$({
    echo "begin transaction read only;"
    cat
    echo "rollback;"
  } | "${psql_lenh[@]}" -X -q -A -t -v ON_ERROR_STOP=1 -v VERBOSITY=terse "$@" -d "$url" 2>&1)
  local rc=$?
  sed -E -e 's/^(psql:[^ ]* )?(ERROR|FATAL|LỖI):  //' -e '/^$/d' <<<"$ra"
  return $rc
}

ca_bang_cong_ty_ep_luat_dong() {
  chi_doc "$MIGRATE_DATABASE_URL" <<SQL
with b as ($BANG_CONG_TY)
select 'bang khong ep luat dong: ' || b.ten
from b join pg_class c on c.oid = b.oid
where not (c.relrowsecurity and c.relforcerowsecurity)
union all
select 'bang khong ep luat dong: không thấy bảng công ty nào' where not exists (select from b)
order by 1;
SQL
}

# Tables in scope here: the company tables and every table of the identity module (personal data).
ca_vai_supabase_khong_quyen() {
  chi_doc "$MIGRATE_DATABASE_URL" <<SQL
with b as (
  $BANG_CONG_TY
  union
  select c.oid, format('%I.%I', n.nspname, c.relname)
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'identity' and c.relkind in ('r', 'p', 'v', 'm', 'f')
),
quyen as (
  -- PUBLIC: grantee 0 in the table's ACL, or on any of its columns.
  select 'PUBLIC' as vai, b.ten from b join pg_class c on c.oid = b.oid, aclexplode(c.relacl) x where x.grantee = 0
  union
  select 'PUBLIC', b.ten from b join pg_attribute a on a.attrelid = b.oid, aclexplode(a.attacl) x
  where x.grantee = 0 and not a.attisdropped
  union
  -- anon, authenticated: effective privileges, membership and PUBLIC included. A missing role holds nothing.
  select r.rolname, b.ten from b cross join pg_roles r
  where r.rolname in ('anon', 'authenticated')
    and (has_table_privilege(r.oid, b.oid, 'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER')
         or has_any_column_privilege(r.oid, b.oid, 'SELECT, INSERT, UPDATE, REFERENCES'))
)
select format('vai %s co quyen tren: %s', vai, ten) from quyen order by 1;
SQL
}

ca_vai_dang_nhap_khong_chu() {
  local vai
  vai=$(chi_doc "$LOGIN_DATABASE_URL" <<<"select session_user;") || {
    printf '%s\n' "$vai"
    return 1
  }
  chi_doc "$MIGRATE_DATABASE_URL" -v vai="$vai" -v api="$API_ROLE" <<'SQL'
with vai(ten, nhan) as (values (:'vai'::name, 'vai dang nhap'), (:'api'::name, 'vai api')),
he_thong(nsp) as (select oid from pg_namespace
                  where nspname in ('pg_catalog', 'information_schema') or nspname like 'pg\_%')
select v.nhan || ' la chu: ' || format('%I.%I', n.nspname, c.relname)
from vai v join pg_roles r on r.rolname = v.ten
join pg_class c on c.relowner = r.oid join pg_namespace n on n.oid = c.relnamespace
where c.relnamespace not in (select nsp from he_thong) and c.relkind not in ('i', 'I', 't')
union all
select v.nhan || ' la chu: ' || format('%I.%I()', n.nspname, p.proname)
from vai v join pg_roles r on r.rolname = v.ten
join pg_proc p on p.proowner = r.oid join pg_namespace n on n.oid = p.pronamespace
where p.pronamespace not in (select nsp from he_thong)
union all
select v.nhan || ' la chu: schema ' || n.nspname
from vai v join pg_roles r on r.rolname = v.ten join pg_namespace n on n.nspowner = r.oid
union all
select 'vai dang nhap vuot luat dong: ' || x.rolname
from pg_roles r join pg_roles x on pg_has_role(r.oid, x.oid, 'MEMBER')
where r.rolname = :'vai' and (x.rolsuper or x.rolbypassrls or x.rolcreaterole or x.rolcreatedb)
union all
select 'vai dang nhap ve duoc vai chu: ' || x.rolname
from pg_roles r join pg_roles x on pg_has_role(r.oid, x.oid, 'MEMBER') and x.oid <> r.oid
where r.rolname = :'vai'
  and exists (select from pg_class c where c.relowner = x.oid
                and c.relnamespace not in (select nsp from he_thong))
union all
select 'vai dang nhap: không có vai ' || :'vai' where not exists (select from pg_roles where rolname = :'vai')
order by 1;
SQL
}

# On the login connection, through the door's own statements (src/modules/identity/with-company.ts): no direct read,
# the role switch works, and neither an empty context nor an unknown company sees a row of any company table.
ca_phien_dang_nhap_khong_thay_dong() {
  chi_doc "$LOGIN_DATABASE_URL" -v api="$API_ROLE" <<SQL
select 'vai dang nhap doc thang duoc: ' || b.ten
from ($BANG_CONG_TY) b where has_table_privilege(session_user, b.oid, 'SELECT') order by 1;
do \$\$
begin
  execute format('set local role %I', '$API_ROLE');
exception when others then
  raise exception 'cua khong doi duoc vai: $API_ROLE';
end \$\$;
do \$\$ begin perform set_config('app.user_id', '', true), set_config('app.company_id', '', true); end \$\$;
select format('thay dong khi chua dat san: %s (%s dong)', ten, n) from (
  select b.ten, (xpath('/row/n/text()',
           query_to_xml(format('select count(*) as n from %s', b.ten), false, true, '')))[1]::text::bigint as n
  from ($BANG_CONG_TY) b where has_table_privilege(current_user, b.oid, 'SELECT')
) d where n > 0 order by 1;
do \$\$
begin
  perform set_config('app.user_id', '00000000-0000-4000-8000-00000000dead', true),
          set_config('app.company_id', '00000000-0000-4000-8000-00000000dead', true);
end \$\$;
select format('thay dong cua san khac: %s (%s dong)', ten, n) from (
  select b.ten, (xpath('/row/n/text()',
           query_to_xml(format('select count(*) as n from %s', b.ten), false, true, '')))[1]::text::bigint as n
  from ($BANG_CONG_TY) b where has_table_privilege(current_user, b.oid, 'SELECT')
) d where n > 0 order by 1;
SQL
}

dat=0
chua=()
for ca in "${CA[@]}"; do
  ra=$("ca_${ca//-/_}")
  rc=$?
  if [ "$rc" -eq 0 ] && [ -z "$ra" ]; then
    echo "ok $ca"
    dat=$((dat + 1))
  else
    [ -n "$ra" ] && printf '%s\n' "$ra"
    [ -z "$ra" ] && echo "HỎNG $ca: psql lỗi (mã $rc)"
    chua+=("$ca")
  fi
done

if [ "$dat" -eq "${#CA[@]}" ]; then
  echo "cach-ly-dich: $dat ca đạt"
  exit 0
fi
echo "cach-ly-dich: $dat/${#CA[@]} ca đạt — chưa đạt: ${chua[*]}" >&2
exit 1
