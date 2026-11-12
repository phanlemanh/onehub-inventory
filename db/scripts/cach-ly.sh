#!/usr/bin/env bash
# Company isolation suite (SP-1, hồ sơ cach-ly-moi-san). Runs on this lane's Postgres container, never on real data:
#   1. a fresh scratch database, migrations applied twice (the second run applies nothing);
#   2. db/tests/cach-ly.sql — 20 cases under the API role, using the door's own statements;
#   3. ten break cases (twenty-one break files), each file on its own scratch database: the suite must go red with the
#      pinned messages.
# Every case prints `ok <case>` exactly once; the last line is `cach-ly: 31 ca đạt, vai quy_hang_app`.
# Missing, repeated or failing cases are named and the exit code is not 0.
#
#   DB_LANE=n bash db/scripts/cach-ly.sh       (see db/scripts/psql.sh for DB_LANE and PSQL)
#   TESTS_DIR — another copy of db/tests (tests of this runner only, tests/db/cach-ly.db.test.ts).
#
# It only creates and drops databases named cach_ly_*.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=db/scripts/psql.sh
source "$here/psql.sh"
tests="${TESTS_DIR:-$here/../tests}"
migrations="${MIGRATIONS_DIR:-$here/../migrations}"

CA_SQL=(
  doi-chung-vai-chu-thay-du
  chua-dat-san-khong-thay-gi
  san-rong-khong-thay-gi
  ket-noi-da-dung-khong-thay-gi
  a-chi-thay-chinh-minh
  a-thay-thoa-thuan-cua-minh-va-hop-tac
  a-khong-them-dong-ten-b
  a-khong-sua-dong-cua-b
  a-khong-chuyen-dong-sang-b
  vai-api-khong-tao-sua-san
  vai-api-khong-xoa-thoa-thuan
  moi-bang-cong-ty-ep-luat-theo-dong
  luat-doc-ghi-theo-san
  vai-api-khong-so-huu-khong-vuot
  a-ghi-duoc-dong-cua-minh
  vai-api-khong-quyen-nguy-hiem
  vai-api-chi-cham-bang-co-luat
  dang-xem-khong-vuot-luat
  ham-dac-quyen-trong-danh-sach
  dang-xem-ghi-khong-vuot-luat
)
CA_LENH=(
  ap-hai-lan
  pha-thu-bo-ep-luat
  pha-thu-luat-them-khong-kiem
  pha-thu-luat-doc-mo
  pha-thu-bang-moi-luat-mo
  pha-thu-ghi-bi-chan
  pha-thu-quyen-nguy-hiem
  pha-thu-bang-khong-luat
  pha-thu-dang-xem-vuot
  pha-thu-ham-dac-quyen
  pha-thu-dang-xem-chi-ghi
)
# Break case → its break files (db/tests/pha-thu/<file>.sql), each on its own scratch database.
pha_thu_tep() {
  case "$1" in
    bo-ep-luat) printf '%s\n' bo-ep-luat ;;
    luat-them-khong-kiem)
      printf '%s\n' luat-them-khong-kiem luat-them-khong-kiem-doi-tac luat-ghi-for-all-doi-tac luat-xoa-doi-tac ;;
    luat-doc-mo) printf '%s\n' luat-doc-mo luat-doc-mo-hoac-true luat-doc-mo-khac-san ;;
    bang-moi-luat-mo) printf '%s\n' bang-moi-luat-mo ;;
    ghi-bi-chan) printf '%s\n' ghi-bi-chan ;;
    quyen-nguy-hiem) printf '%s\n' cap-xoa-sach cap-trigger-public ;;
    bang-khong-luat) printf '%s\n' bang-schema-khac bang-public-khong-cot-san ;;
    dang-xem-vuot) printf '%s\n' dang-xem-thuong dang-xem-vat-chat ;;
    ham-dac-quyen) printf '%s\n' ham-dac-quyen-public ham-trigger-dac-quyen ;;
    dang-xem-chi-ghi) printf '%s\n' dang-xem-chi-xoa dang-xem-chi-sua-cot dang-xem-chi-them-schema-khac ;;
  esac
}
# Break file → the lines its red run must contain.
pha_thu_ghim() {
  case "$1" in
    bo-ep-luat) printf '%s\n' "HỎNG moi-bang-cong-ty-ep-luat-theo-dong: agreements" ;;
    luat-them-khong-kiem) printf '%s\n' "HỎNG a-khong-them-dong-ten-b" "HỎNG luat-doc-ghi-theo-san: agreements" ;;
    luat-them-khong-kiem-doi-tac) printf '%s\n' "HỎNG luat-doc-ghi-theo-san: agreements" ;;
    luat-ghi-for-all-doi-tac) printf '%s\n' "HỎNG luat-doc-ghi-theo-san: bang_doi_tac_mau" ;;
    luat-xoa-doi-tac) printf '%s\n' "HỎNG luat-doc-ghi-theo-san: agreements" ;;
    luat-doc-mo | luat-doc-mo-hoac-true)
      printf '%s\n' "HỎNG chua-dat-san-khong-thay-gi: agreements" "HỎNG luat-doc-ghi-theo-san: agreements" ;;
    luat-doc-mo-khac-san) printf '%s\n' "HỎNG luat-doc-ghi-theo-san: agreements" ;;
    bang-moi-luat-mo) printf '%s\n' "HỎNG luat-doc-ghi-theo-san: bang_mau_cach_ly" ;;
    ghi-bi-chan) printf '%s\n' "HỎNG a-ghi-duoc-dong-cua-minh" ;;
    cap-xoa-sach) printf '%s\n' "HỎNG vai-api-khong-quyen-nguy-hiem: public.agreements TRUNCATE" ;;
    cap-trigger-public) printf '%s\n' "HỎNG vai-api-khong-quyen-nguy-hiem: public.companies TRIGGER" ;;
    bang-schema-khac) printf '%s\n' "HỎNG vai-api-chi-cham-bang-co-luat: kho_ngoai.listings_mau" ;;
    bang-public-khong-cot-san) printf '%s\n' "HỎNG vai-api-chi-cham-bang-co-luat: public.bang_tra_cuu_mau" ;;
    dang-xem-thuong) printf '%s\n' "HỎNG dang-xem-khong-vuot-luat: public.agreements_tat_ca" ;;
    dang-xem-vat-chat) printf '%s\n' "HỎNG dang-xem-khong-vuot-luat: public.agreements_dem" ;;
    ham-dac-quyen-public) printf '%s\n' "HỎNG ham-dac-quyen-trong-danh-sach: public.dem_moi_thoa_thuan" ;;
    ham-trigger-dac-quyen) printf '%s\n' "HỎNG ham-dac-quyen-trong-danh-sach: public.ghi_vet_thoa_thuan" ;;
    dang-xem-chi-xoa) printf '%s\n' "HỎNG dang-xem-ghi-khong-vuot-luat: public.agreements_xoa DELETE" ;;
    dang-xem-chi-sua-cot) printf '%s\n' "HỎNG dang-xem-ghi-khong-vuot-luat: public.agreements_sua_ben UPDATE" ;;
    dang-xem-chi-them-schema-khac) printf '%s\n' "HỎNG dang-xem-ghi-khong-vuot-luat: kho_xem.agreements_them INSERT" ;;
  esac
}

created=()
cleanup() {
  local db
  for db in "${created[@]+"${created[@]}"}"; do
    pg_cmd postgres "drop database if exists $db with (force)" >/dev/null 2>&1 || true
  done
}
trap cleanup EXIT

fresh_db() {
  case "$1" in cach_ly_*) ;; *) echo "từ chối: chỉ tạo cơ sở nháp cach_ly_*, không phải $1" >&2; exit 2 ;; esac
  # A run that was killed may have left this scratch database behind.
  if [ "$(pg_cmd postgres "select 1 from pg_database where datname = '$1'")" = "1" ]; then
    pg_cmd postgres "drop database $1 with (force)" >/dev/null || exit 2
  fi
  pg_cmd postgres "create database $1" >/dev/null || exit 2
  created+=("$1")
}

# Run cach-ly.sql on one database. Prints its ok/HỎNG lines; returns 0 only when every SQL case printed ok exactly
# once, no case failed and no unknown case appeared.
chay_bo_kiem() {
  local db="$1" lines rc=0 ca n
  lines=$(pg_psql -d "$db" -X -q -o /dev/null <"$tests/cach-ly.sql" 2>&1 |
    sed -nE 's/^.*(NOTICE|ERROR):  ((ok|HỎNG) .*)$/\2/p')
  [ -n "$lines" ] && printf '%s\n' "$lines"
  if grep -q '^HỎNG ' <<<"$lines"; then rc=1; fi
  for ca in "${CA_SQL[@]}"; do
    n=$(grep -cE "^ok $ca( |$)" <<<"$lines" || true)
    if [ "$n" -ne 1 ]; then
      echo "HỎNG $ca: in ok $n lần, cần đúng 1"
      rc=1
    fi
  done
  while read -r ca; do
    [ -z "$ca" ] && continue
    if ! printf '%s\n' "${CA_SQL[@]}" | grep -qxF "$ca"; then
      echo "HỎNG $ca: ca không có trong danh sách"
      rc=1
    fi
  done < <(grep '^ok ' <<<"$lines" | awk '{print $2}')
  return $rc
}

ket_qua=""
bao() {
  echo "$1"
  ket_qua+="$1"$'\n'
}

# 1. Migrations applied twice on a fresh database.
fresh_db cach_ly_lanh
so_tep=$(find "$migrations" -maxdepth 1 -name '[0-9][0-9][0-9]_*.sql' | wc -l | tr -d ' ')
lan_mot=$(bash "$here/migrate.sh" cach_ly_lanh 2>&1)
rc_mot=$?
printf '%s\n' "$lan_mot"
lan_hai=$(bash "$here/migrate.sh" cach_ly_lanh 2>&1)
rc_hai=$?
printf '%s\n' "$lan_hai"
so_dong=$(pg_cmd cach_ly_lanh "select count(*) from public.schema_migrations" 2>/dev/null || echo "?")
so_da_ap=$(grep -c '^đã áp ' <<<"$lan_mot" || true)
if [ "$so_dong" != "$so_tep" ]; then
  bao "HỎNG ap-hai-lan: sổ có $so_dong dòng, thư mục có $so_tep tệp"
elif [ "$rc_mot" -ne 0 ] || [ "$rc_hai" -ne 0 ]; then
  bao "HỎNG ap-hai-lan: lệnh áp migration lỗi (lần một $rc_mot, lần hai $rc_hai)"
elif [ "$so_da_ap" -ne "$so_tep" ] || ! grep -qxF "xong — 0 migration mới" <<<"$lan_hai"; then
  bao "HỎNG ap-hai-lan: lần một áp $so_da_ap/$so_tep tệp, hoặc lần hai vẫn áp"
else
  bao "ok ap-hai-lan"
fi

# 2. The suite on the clean database.
lanh=$(chay_bo_kiem cach_ly_lanh)
while IFS= read -r dong; do
  [ -n "$dong" ] && bao "$dong"
done <<<"$lanh"

# 3. Break tests: every break file of a case must turn the suite red with its pinned lines.
for pha in bo-ep-luat luat-them-khong-kiem luat-doc-mo bang-moi-luat-mo \
  ghi-bi-chan quyen-nguy-hiem bang-khong-luat dang-xem-vuot ham-dac-quyen dang-xem-chi-ghi; do
  loi_ca=""
  while IFS= read -r tep; do
    db="cach_ly_pha_${tep//-/_}"
    fresh_db "$db"
    if ! bash "$here/migrate.sh" "$db" >/dev/null 2>&1 || ! pg_sql "$db" <"$tests/pha-thu/$tep.sql" >/dev/null 2>&1; then
      loi_ca+="$tep: không dựng được bản phá; "
      continue
    fi
    do_ra=$(chay_bo_kiem "$db")
    rc=$?
    printf '%s\n' "$do_ra" | sed "s/^/  [pha-thu $tep] /"
    thieu=""
    while IFS= read -r ghim; do
      grep -qF "$ghim" <<<"$do_ra" || thieu+="'$ghim' "
    done < <(pha_thu_ghim "$tep")
    if [ "$rc" -eq 0 ]; then
      loi_ca+="$tep: bộ kiểm vẫn xanh trên bản phá; "
    elif [ -n "$thieu" ]; then
      loi_ca+="$tep: đỏ nhưng thiếu dòng ghim $thieu; "
    fi
  done < <(pha_thu_tep "$pha")
  if [ -n "$loi_ca" ]; then
    bao "HỎNG pha-thu-$pha: ${loi_ca%; }"
  else
    bao "ok pha-thu-$pha"
  fi
done

# 4. Count: every case exactly once, nothing failed.
tat_ca=("${CA_SQL[@]}" "${CA_LENH[@]}")
dat=0
thieu_ca=()
for ca in "${tat_ca[@]}"; do
  n=$(grep -cE "^ok $ca( |$)" <<<"$ket_qua" || true)
  if [ "$n" -eq 1 ]; then dat=$((dat + 1)); else thieu_ca+=("$ca"); fi
done
if [ "$dat" -eq "${#tat_ca[@]}" ] && ! grep -q '^HỎNG ' <<<"$ket_qua"; then
  echo "cach-ly: $dat ca đạt, vai quy_hang_app"
  exit 0
fi
echo "cach-ly: $dat/${#tat_ca[@]} ca đạt — chưa đạt: ${thieu_ca[*]:-(không)}; có dòng HỎNG ở trên" >&2
exit 1
