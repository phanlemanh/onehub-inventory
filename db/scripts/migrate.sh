#!/usr/bin/env bash
# Apply the migrations that have not run yet, in number order, each file in one transaction together with its
# line in public.schema_migrations. Running it again applies nothing. Same rule as scripts/migrate.mjs of
# onehub-quy-hang (commit 1729b11f), through psql.
#
#   bash db/scripts/migrate.sh <database>
#   MIGRATIONS_DIR — another folder of NNN_*.sql files (tests only).
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=db/scripts/psql.sh
source "$here/psql.sh"

db="${1:?cách dùng: migrate.sh <cơ sở dữ liệu>}"
dir="${MIGRATIONS_DIR:-$here/../migrations}"

pg_cmd "$db" "set client_min_messages = warning; create table if not exists public.schema_migrations (name text primary key, applied_at timestamptz not null default now())" >/dev/null
done_list=$(pg_cmd "$db" "select name from public.schema_migrations")

# The names a statement introduces in migration files ($2…, default every migration file), comma separated; empty
# when none does. Names are [a-z0-9_] only, so they go into SQL as they are.
names() {
  local pattern="$1"
  shift
  if [ "$#" -eq 0 ]; then
    set -- "$dir"/[0-9][0-9][0-9]_*.sql
  fi
  { grep -hoiE "$pattern" "$@" 2>/dev/null || true; } | awk '{print tolower($NF)}' | sort -u | paste -sd, -
}
# The repo's schemas: every `create schema` of a migration.
schemas=$(names 'create schema +(if not exists +)?[a-z_][a-z0-9_]*')

# Who holds CREATE on a repo schema besides its owner, one `<schema> <role or PUBLIC>` line each, sorted.
create_holders() {
  pg_cmd "$db" "select n.nspname || ' ' || case when x.grantee = 0 then 'PUBLIC' else x.grantee::regrole::text end
    from pg_namespace n, aclexplode(coalesce(n.nspacl, acldefault('n', n.nspowner))) x
    where n.nspname = any (string_to_array('$schemas', ',')) and x.privilege_type = 'CREATE'
      and x.grantee <> n.nspowner
    order by 1" | LC_ALL=C sort
}

# A migrating role that is not a superuser but has CREATEROLE (Supabase's postgres, decision 0044). Postgres checks two
# things when it hands an object to another role (`alter function ... owner to quy_hang_identity`, migrations 002 and
# 003) that it skips for a superuser:
#   - the migrating role can SET ROLE to the new owner. From Postgres 16 on, a CREATEROLE role gets only ADMIN on a
#     role it creates — not SET, not INHERIT — unless createrole_self_grant says so;
#   - the new owner has CREATE on the object's schema.
# So, on such a role and Postgres 16 or later only (a superuser, the lanes and CI, gets nothing of this):
#   1. the repo's roles (`create role` in a migration) made earlier without SET or INHERIT for the migrating role — by
#      an older migrate.sh — are granted to it now, with both; each session creates its roles with both, too;
#   2. inside each migration's own transaction, each role the file hands objects to (`owner to <role>`) gets CREATE on
#      the repo's schemas it lacks, and loses exactly that again before the commit. A role the same file creates does
#      not exist yet when the transaction starts, so for it PUBLIC gets that CREATE instead (002 and quy_hang_identity);
#      roles that exist are lent first, so they hold it themselves. No other session ever sees either: nothing of it is
#      committed. Whatever the role, after each commit migrate.sh checks that nobody new holds CREATE on a repo schema
#      and PUBLIC holds it on none; otherwise it stops with exit code 3 and names the schema.
# INHERIT, not only SET: the grant and revoke right after each owner change (`grant execute ... to quy_hang_app`) are
# made as the migrating role, which then needs the owner's privileges; with SET alone Postgres skips them with a
# warning and the app cannot call the function.
lend=false
if [ "$(pg_cmd "$db" "select current_setting('server_version_num')::int >= 160000 and not rolsuper from pg_roles where rolname = current_user")" = "t" ]; then
  lend=true
  roles=$(names 'create role +[a-z_][a-z0-9_]*')
  pg_cmd "$db" "do \$\$
declare
  v_role name;
begin
  for v_role in
    select r.rolname from pg_roles r
    where r.rolname = any (string_to_array('$roles', ','))
      and exists (select from pg_auth_members m
                  where m.roleid = r.oid and m.member = (select oid from pg_roles where rolname = current_user)
                    and m.admin_option)
      and not (pg_has_role(current_user, r.oid, 'SET') and pg_has_role(current_user, r.oid, 'USAGE'))
    order by 1
  loop
    execute format('grant %I to %I with inherit true, set true', v_role, current_user);
  end loop;
end \$\$" >/dev/null
fi

# The SQL around one migration file ($1) when lending: one line each, so psql's line numbers in an error stay those of
# the file plus one. migrate_sh.lent holds `<schema>/<role or public>` items to take back.
prelude() {
  local owners
  owners=$(names 'owner to +[a-z_][a-z0-9_]*' "$1")
  tr -s '\n ' ' ' <<SQL
set createrole_self_grant = 'set, inherit';
do \$\$
declare
  v_lent text[] := '{}';
  v_owner text;
  v_to text;
  v_schema name;
begin
  for v_owner in
    select o from unnest(string_to_array('$owners', ',')) o
    order by not exists (select from pg_roles where rolname = o), o
  loop
    v_to := case when exists (select from pg_roles where rolname = v_owner) then v_owner else 'public' end;
    for v_schema in
      select n.nspname from pg_namespace n
      where n.nspname = any (string_to_array('$schemas', ','))
        and has_schema_privilege(current_user, n.oid, 'CREATE WITH GRANT OPTION')
        and not has_schema_privilege(v_to, n.oid, 'CREATE')
      order by 1
    loop
      execute format('grant create on schema %I to %s', v_schema,
                     case when v_to = 'public' then 'public' else quote_ident(v_to) end);
      v_lent := v_lent || (v_schema || '/' || v_to);
    end loop;
  end loop;
  perform set_config('migrate_sh.lent', array_to_string(v_lent, ','), true);
end \$\$;
SQL
}
postlude() {
  tr -s '\n ' ' ' <<'SQL'
do $$
declare
  v_item text;
begin
  foreach v_item in array coalesce(string_to_array(nullif(current_setting('migrate_sh.lent', true), ''), ','), '{}')
  loop
    execute format('revoke create on schema %I from %s', split_part(v_item, '/', 1),
                   case when split_part(v_item, '/', 2) = 'public' then 'public'
                        else quote_ident(split_part(v_item, '/', 2)) end);
  end loop;
end $$;
SQL
}

applied=0
for path in $(find "$dir" -maxdepth 1 -name '[0-9][0-9][0-9]_*.sql' | sort); do
  file="$(basename "$path")"
  if printf '%s\n' "$done_list" | grep -qxF "$file"; then
    continue
  fi
  before=$(create_holders)
  if ! {
    if $lend; then prelude "$path" && echo; fi
    cat "$path"
    echo
    if $lend; then postlude && echo; fi
    printf "insert into public.schema_migrations (name) values ('%s');\n" "$file"
  } | pg_sql "$db" -1 -f - >/dev/null; then
    echo "lỗi khi áp $file — giao dịch đã huỷ, sổ không ghi tệp này" >&2
    exit 1
  fi
  # After the commit: nobody new holds CREATE on a repo schema, and PUBLIC holds it on none (decision 0044).
  after=$(create_holders)
  leaked=$( (
    LC_ALL=C comm -13 <(printf '%s\n' "$before") <(printf '%s\n' "$after")
    grep ' PUBLIC$' <<<"$after" || true
  ) | sed '/^$/d' | LC_ALL=C sort -u)
  if [ -n "$leaked" ]; then
    while read -r schema holder; do
      echo "!!! migrate.sh: sau $file, $holder có quyền CREATE trên schema $schema — dừng, gỡ quyền ấy trước khi áp tiếp (quyết định 0044)" >&2
    done <<<"$leaked"
    exit 3
  fi
  echo "đã áp $file"
  applied=$((applied + 1))
done
echo "xong — $applied migration mới"
