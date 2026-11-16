#!/usr/bin/env bash
# Restore drill (row 22, AC-8): restore a backup made by db/scripts/sao-luu.sh into a NEW scratch database, compare the
# row count of every table with the backup's sidecar `<file>.dem`, run the read-only isolation suite
# db/scripts/cach-ly-dich.sh on the restored copy, print the line for docs/van-hanh/nhat-ky-khoi-phuc.md, then drop
# the scratch database. It never touches any other database.
#
#   bash db/scripts/khoi-phuc-thu.sh [--giu] <backup-file>
#     --giu (or KHOI_PHUC_GIU=1) keeps the scratch database and prints its name, for a look by hand.
#
#   KHOI_PHUC_ADMIN_URL — a connection string on the server to restore on, as a role that may create databases and
#                         owns the roles the backup names (the lane's postgres, or the target's owner). Its database
#                         part is ignored: the drill connects to the scratch database on the same server.
#   KHOI_PHUC_LOGIN_URL — the app's login role (quy_hang_login) on the same server; database part ignored likewise.
#   PSQL_DICH, PG_RESTORE_CMD — the psql and pg_restore command lines (default `psql`, `pg_restore`). Tests use
#                         `docker exec -i onehub-inventory-db-<lane> …` with addresses seen from inside the container.
#
# Green: the last line is `khoi-phuc: <YYYY-MM-DD> · <n> bảng · <m> dòng · cach-ly đạt` (n, m from the sidecar), exit 0.
# Red, one pinned line per finding, exit 1:
#   thieu bang: <schema.table>                              — in the source, not in the restored copy
#   lech dong: <schema.table> (goc <a> · khoi phuc <b>)     — row counts differ
# plus the isolation suite's own lines. No address is ever printed.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"

giu="${KHOI_PHUC_GIU:-0}"
if [ "${1:-}" = "--giu" ]; then
  giu=1
  shift
fi
tep="${1:?cách dùng: khoi-phuc-thu.sh [--giu] <tệp sao lưu>}"
if [ ! -f "$tep" ]; then
  echo "khoi-phuc: không thấy tệp $tep" >&2
  exit 2
fi
if [ ! -s "$tep.dem" ]; then
  echo "khoi-phuc: thiếu tệp đếm $tep.dem (do sao-luu.sh ghi cạnh tệp sao lưu)" >&2
  exit 2
fi
for bien in KHOI_PHUC_ADMIN_URL KHOI_PHUC_LOGIN_URL; do
  if [ -z "${!bien:-}" ]; then
    echo "khoi-phuc: thiếu biến $bien (.env.example)" >&2
    exit 2
  fi
done
read -r -a psql_lenh <<<"${PSQL_DICH:-psql}"
read -r -a restore_lenh <<<"${PG_RESTORE_CMD:-pg_restore}"

# The same address on another database: scheme://authority/<db>?query.
doi_csdl() {
  printf '%s\n' "$1" | sed -E "s#^([a-zA-Z][a-zA-Z0-9+.-]*://[^/?]*)(/[^?]*)?(\\?.*)?\$#\\1/$2\\3#"
}

ten="khoi_phuc_thu_$(date +%Y%m%d_%H%M%S)_$$"
NHAP_CHU="$(doi_csdl "$KHOI_PHUC_ADMIN_URL" "$ten")"
NHAP_DANG_NHAP="$(doi_csdl "$KHOI_PHUC_LOGIN_URL" "$ten")"

quan_tri() {
  "${psql_lenh[@]}" -X -q -A -t -v ON_ERROR_STOP=1 -d "$KHOI_PHUC_ADMIN_URL" -c "$1" </dev/null 2>&1
}

tao=0
don() {
  [ "$tao" -eq 1 ] || return 0
  if [ "$giu" = "1" ]; then
    echo "khoi-phuc: giữ cơ sở nháp $ten"
  elif ! quan_tri "drop database if exists $ten with (force)" >/dev/null; then
    echo "khoi-phuc: không xoá được cơ sở nháp $ten — xoá tay" >&2
  fi
}
trap don EXIT

if ! ra=$(quan_tri "create database $ten"); then
  echo "khoi-phuc: không tạo được cơ sở nháp" >&2
  printf '%s\n' "$ra" >&2
  exit 1
fi
tao=1
echo "co-so-nhap: $ten"

# --- 1. Restore, all or nothing. ---------------------------------------------------------------------------------
if ! ra=$("${restore_lenh[@]}" --exit-on-error --single-transaction -d "$NHAP_CHU" <"$tep" 2>&1); then
  echo "khoi-phuc: pg_restore lỗi" >&2
  printf '%s\n' "$ra" >&2
  exit 1
fi

# --- 2. Row counts against the backup's sidecar. -----------------------------------------------------------------
if ! dem_nhap=$(MIGRATE_DATABASE_URL="$NHAP_CHU" SAO_LUU_LUOC_DO="" bash "$here/sao-luu.sh" --dem 2>&1); then
  echo "khoi-phuc: đếm dòng trên bản khôi phục lỗi" >&2
  printf '%s\n' "$dem_nhap" >&2
  exit 1
fi
lech=$(awk -F'\t' '
  NR == FNR { kp[$1] = $2; next }
  !($1 in kp) { print "thieu bang: " $1; next }
  kp[$1] != $2 { print "lech dong: " $1 " (goc " $2 " · khoi phuc " kp[$1] ")" }
' <(printf '%s\n' "$dem_nhap") "$tep.dem")
n=$(grep -c . "$tep.dem")
m=$(awk -F'\t' '{ s += $2 } END { print s + 0 }' "$tep.dem")
[ -n "$lech" ] && printf '%s\n' "$lech"

# --- 3. The isolation suite on the restored copy (read-only). ----------------------------------------------------
MIGRATE_DATABASE_URL="$NHAP_CHU" LOGIN_DATABASE_URL="$NHAP_DANG_NHAP" PSQL_DICH="${PSQL_DICH:-psql}" \
  bash "$here/cach-ly-dich.sh"
cach_ly=$?

if [ -z "$lech" ] && [ "$cach_ly" -eq 0 ]; then
  echo "khoi-phuc: $(date +%F) · $n bảng · $m dòng · cach-ly đạt"
  exit 0
fi
ly_do=()
[ -n "$lech" ] && ly_do+=("số dòng không khớp bản sao lưu")
[ "$cach_ly" -ne 0 ] && ly_do+=("cach-ly-dich chưa đạt")
ly_do_chu="$(printf '%s; ' "${ly_do[@]}")"
echo "khoi-phuc: đỏ — ${ly_do_chu%; }" >&2
exit 1
