#!/usr/bin/env bash
# Backup of a target database (row 22, AC-8): a pg_dump custom-format file plus a sidecar `<file>.dem` with the row count
# of every table, both taken from ONE snapshot, so db/scripts/khoi-phuc-thu.sh can compare a restore with the source
# even while the source is being written to. The counts come from the source's catalog, not from the dump: a table the
# dump lost still appears in the sidecar, and the restore drill turns red naming it.
#
#   bash db/scripts/sao-luu.sh <out-file>   — the file and its sidecar; both must lie OUTSIDE the git worktree and its
#                                             main checkout (they hold real data): otherwise it stops with
#                                             `không ghi sao lưu vào trong kho` before connecting to anything.
#   bash db/scripts/sao-luu.sh --dem        — only print the counts of MIGRATE_DATABASE_URL (used by the restore drill).
#
#   MIGRATE_DATABASE_URL — the owner's connection string (session or direct connection: the snapshot is exported).
#   SAO_LUU_LUOC_DO      — optional, space-separated schema names: dump and count only these (default: every schema
#                          outside the system ones, extension members excluded).
#   PSQL_DICH            — the psql command line (default `psql`); PG_DUMP_CMD — the pg_dump command line (default
#                          `pg_dump`). Tests use `docker exec -i onehub-inventory-db-<lane> psql` / `… pg_dump`.
#
# Before anything is dumped, pg_dump's major version (`pg_dump --version`) must equal the server's (`show
# server_version_num` through the same psql). A newer pg_dump writes settings the server's own pg_restore refuses (pg_dump
# 17 writes `SET transaction_timeout`, unknown to 16), so a mismatch stops with one line and writes nothing:
#   sao-luu: pg_dump bản <a>, máy chủ bản <b> — dùng công cụ cùng bản với máy chủ
# The archive header records both versions; db/scripts/khoi-phuc-thu.sh reads them back (`pg_restore -l`).
#
# Sidecar format: one line per table, `<schema>.<table><TAB><rows>`, sorted. No address is ever printed.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"

# Every table outside the system schemas (and outside SAO_LUU_LUOC_DO when set) with its exact row count.
DEM_SQL="
select format('%I.%I', n.nspname, c.relname) || chr(9) ||
       (xpath('/row/n/text()', query_to_xml(format('select count(*) as n from %I.%I', n.nspname, c.relname),
                                            false, true, '')))[1]::text
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where c.relkind in ('r', 'p')
  and n.nspname not in ('pg_catalog', 'information_schema') and n.nspname not like 'pg\\_%'
  and not exists (select from pg_depend d
                  where d.classid = 'pg_class'::regclass and d.objid = c.oid and d.deptype = 'e')
  and (:'luoc_do' = '' or n.nspname = any (string_to_array(:'luoc_do', ' ')))
order by 1;"

read -r -a psql_lenh <<<"${PSQL_DICH:-psql}"
read -r -a dump_lenh <<<"${PG_DUMP_CMD:-pg_dump}"
LUOC_DO="${SAO_LUU_LUOC_DO:-}"

can_bien() {
  if [ -z "${MIGRATE_DATABASE_URL:-}" ]; then
    echo "sao-luu: thiếu biến MIGRATE_DATABASE_URL (.env.example)" >&2
    exit 2
  fi
}

if [ "${1:-}" = "--dem" ]; then
  can_bien
  { echo "begin transaction read only;"; echo "$DEM_SQL"; echo "rollback;"; } |
    "${psql_lenh[@]}" -X -q -A -t -v ON_ERROR_STOP=1 -v luoc_do="$LUOC_DO" -d "$MIGRATE_DATABASE_URL"
  exit $?
fi

tep="${1:?cách dùng: sao-luu.sh <tệp ra> | sao-luu.sh --dem}"

# --- 1. Never inside the repository: neither this worktree nor the main checkout it belongs to. -------------------
cha="$(dirname -- "$tep")"
if [ ! -d "$cha" ]; then
  echo "sao-luu: không có thư mục $cha" >&2
  exit 2
fi
tuyet_doi="$(cd "$cha" && pwd -P)/$(basename -- "$tep")"
kho_list=("$(cd "$here/../.." && pwd -P)")
chung="$(git -C "$here" rev-parse --path-format=absolute --git-common-dir 2>/dev/null || true)"
if [ -n "$chung" ] && [ -d "$chung/.." ]; then
  kho_list+=("$(cd "$chung/.." && pwd -P)")
fi
for kho in "${kho_list[@]}"; do
  case "$tuyet_doi" in
    "$kho" | "$kho"/*)
      echo "không ghi sao lưu vào trong kho" >&2
      exit 3
      ;;
  esac
done

can_bien

# --- 2. pg_dump of the server's major version, before anything is written. --------------------------------------
ban_dump="$("${dump_lenh[@]}" --version </dev/null 2>/dev/null | sed -nE '1s/.*\(PostgreSQL\) ([0-9]+).*/\1/p')"
if [ -z "$ban_dump" ]; then
  echo "sao-luu: không đọc được bản của pg_dump (${dump_lenh[*]} --version)" >&2
  exit 2
fi
if ! so_may_chu="$("${psql_lenh[@]}" -X -q -A -t -d "$MIGRATE_DATABASE_URL" -c "show server_version_num" </dev/null 2>&1)" ||
  ! [[ "$so_may_chu" =~ ^[0-9]+$ ]]; then
  echo "sao-luu: không đọc được bản của máy chủ" >&2
  printf '%s\n' "$so_may_chu" | sed -E 's/^(psql:[^ ]* )?(ERROR|FATAL|LỖI):  //' >&2
  exit 1
fi
ban_may_chu=$((so_may_chu / 10000))
if [ "$ban_dump" != "$ban_may_chu" ]; then
  echo "sao-luu: pg_dump bản $ban_dump, máy chủ bản $ban_may_chu — dùng công cụ cùng bản với máy chủ" >&2
  exit 2
fi

# --- 3. One snapshot for the dump and the counts. ----------------------------------------------------------------
tam="$(mktemp -d)"
psql_pid=""
don() {
  exec 3>&- 2>/dev/null
  [ -n "$psql_pid" ] && kill "$psql_pid" 2>/dev/null
  rm -rf "$tam"
}
trap don EXIT

mkfifo "$tam/vao"
"${psql_lenh[@]}" -X -q -A -t -v ON_ERROR_STOP=1 -v luoc_do="$LUOC_DO" -d "$MIGRATE_DATABASE_URL" \
  <"$tam/vao" >"$tam/ra" 2>&1 &
psql_pid=$!
exec 3>"$tam/vao"
echo "begin transaction isolation level repeatable read read only; select pg_export_snapshot();" >&3

anh=""
for _ in $(seq 1 600); do
  anh="$(head -n 1 "$tam/ra" 2>/dev/null)"
  [ -n "$anh" ] && break
  kill -0 "$psql_pid" 2>/dev/null || break
  sleep 0.1
done
if ! [[ "$anh" =~ ^[0-9A-F]+-[0-9A-F]+-[0-9]+$ ]]; then
  echo "sao-luu: không mở được ảnh chụp trên cơ sở dữ liệu" >&2
  sed -E 's/^(psql:[^ ]* )?(ERROR|FATAL|LỖI):  //' "$tam/ra" >&2
  exit 1
fi

dump_args=(-Fc --snapshot="$anh")
for ld in $LUOC_DO; do dump_args+=(-n "$ld"); done
# shellcheck disable=SC2086 # PG_DUMP_ARGS is a list of extra pg_dump flags on purpose
if ! "${dump_lenh[@]}" "${dump_args[@]}" ${PG_DUMP_ARGS:-} -d "$MIGRATE_DATABASE_URL" >"$tep" 2>"$tam/loi"; then
  echo "sao-luu: pg_dump lỗi" >&2
  cat "$tam/loi" >&2
  rm -f "$tep"
  exit 1
fi

{
  echo "$DEM_SQL"
  echo "commit;"
} >&3
exec 3>&-
wait "$psql_pid"
rc=$?
psql_pid=""
if [ "$rc" -ne 0 ]; then
  echo "sao-luu: đếm dòng lỗi" >&2
  tail -n +2 "$tam/ra" >&2
  rm -f "$tep"
  exit 1
fi
tail -n +2 "$tam/ra" | sed '/^$/d' >"$tep.dem"

n=$(grep -c . "$tep.dem")
m=$(awk -F'\t' '{ s += $2 } END { print s + 0 }' "$tep.dem")
echo "sao-luu: $(date +%F) · $n bảng · $m dòng · $(wc -c <"$tep" | tr -d ' ') byte"
