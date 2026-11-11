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

applied=0
for path in $(find "$dir" -maxdepth 1 -name '[0-9][0-9][0-9]_*.sql' | sort); do
  file="$(basename "$path")"
  if printf '%s\n' "$done_list" | grep -qxF "$file"; then
    continue
  fi
  if ! { cat "$path"; printf "\ninsert into public.schema_migrations (name) values ('%s');\n" "$file"; } |
    pg_sql "$db" -1 -f - >/dev/null; then
    echo "lỗi khi áp $file — giao dịch đã huỷ, sổ không ghi tệp này" >&2
    exit 1
  fi
  echo "đã áp $file"
  applied=$((applied + 1))
done
echo "xong — $applied migration mới"
