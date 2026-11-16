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
# Before the scratch database is created, three major versions must equal the restore target's (`show
# server_version_num`), each mismatch one line, exit 2, nothing created:
#   khoi-phuc: pg_restore bản <a>, máy chủ khôi phục bản <b> — dùng công cụ cùng bản với máy chủ
#   khoi-phuc: tệp sao lưu lấy bằng pg_dump bản <a>, máy chủ khôi phục bản <b> — sao lưu lại bằng công cụ cùng bản
#   khoi-phuc: tệp sao lưu lấy bằng pg_dump mới hơn bản <b> của máy chủ khôi phục — sao lưu lại bằng công cụ cùng bản
#                                                         (pg_restore cannot even read that archive's header)
#   khoi-phuc: tệp sao lưu từ máy chủ bản <a>, máy chủ khôi phục bản <b> — khôi phục vào máy chủ cùng bản với máy chủ gốc
# The backup's two versions come from its own archive header (`pg_restore -l`: «Dumped from database version», «Dumped
# by pg_dump version»), not from the sidecar, so any custom-format file is checked, sao-luu.sh's or not.
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

# --- 0. Same major version: pg_restore, the backup's pg_dump and source server, the restore target. ---------------
ban_cua() { sed -nE "s/.*$1[^0-9]*([0-9]+).*/\\1/p" | head -n 1; }
if ! so_may_chu=$(quan_tri "show server_version_num") || ! [[ "$so_may_chu" =~ ^[0-9]+$ ]]; then
  echo "khoi-phuc: không đọc được bản của máy chủ khôi phục" >&2
  printf '%s\n' "$so_may_chu" >&2
  exit 1
fi
ban_may_chu=$((so_may_chu / 10000))
ban_restore="$("${restore_lenh[@]}" --version </dev/null 2>/dev/null | ban_cua '\(PostgreSQL\)')"
if [ -z "$ban_restore" ]; then
  echo "khoi-phuc: không đọc được bản của pg_restore (${restore_lenh[*]} --version)" >&2
  exit 2
fi
if [ "$ban_restore" != "$ban_may_chu" ]; then
  echo "khoi-phuc: pg_restore bản $ban_restore, máy chủ khôi phục bản $ban_may_chu — dùng công cụ cùng bản với máy chủ" >&2
  exit 2
fi
if ! dau_tep=$("${restore_lenh[@]}" -l <"$tep" 2>&1); then
  if printf '%s\n' "$dau_tep" | grep -q 'unsupported version'; then
    # The archive format of a newer pg_dump (pg_dump 17 writes 1.16, unknown to pg_restore 16).
    echo "khoi-phuc: tệp sao lưu lấy bằng pg_dump mới hơn bản $ban_may_chu của máy chủ khôi phục — sao lưu lại bằng công cụ cùng bản" >&2
    exit 2
  fi
  echo "khoi-phuc: pg_restore không đọc được tệp sao lưu" >&2
  printf '%s\n' "$dau_tep" | head -n 5 >&2
  exit 2
fi
ban_dump="$(printf '%s\n' "$dau_tep" | ban_cua 'Dumped by pg_dump version:')"
ban_goc="$(printf '%s\n' "$dau_tep" | ban_cua 'Dumped from database version:')"
if [ -z "$ban_dump" ] || [ -z "$ban_goc" ]; then
  echo "khoi-phuc: tệp sao lưu không ghi bản pg_dump và bản máy chủ gốc — không phải tệp của pg_dump -Fc" >&2
  exit 2
fi
lech_ban=0
if [ "$ban_dump" != "$ban_may_chu" ]; then
  echo "khoi-phuc: tệp sao lưu lấy bằng pg_dump bản $ban_dump, máy chủ khôi phục bản $ban_may_chu — sao lưu lại bằng công cụ cùng bản" >&2
  lech_ban=1
fi
if [ "$ban_goc" != "$ban_may_chu" ]; then
  echo "khoi-phuc: tệp sao lưu từ máy chủ bản $ban_goc, máy chủ khôi phục bản $ban_may_chu — khôi phục vào máy chủ cùng bản với máy chủ gốc" >&2
  lech_ban=1
fi
[ "$lech_ban" -eq 0 ] || exit 2

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
