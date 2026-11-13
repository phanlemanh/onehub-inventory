#!/usr/bin/env bash
# Rebuild the CI runner on a lane and run the database job there (row 1s, _acceptance/ci-co-postgres AC-5, AC-6,
# AC-8, AC-9). Proof that `make ci-db` works the way CI runs it, before the job exists on CI:
#   1. a shallow clone (depth 1) of HEAD, fetched the way actions/checkout does, installed from the lockfile;
#   2. a fresh Postgres container whose image, password and port mapping come from the workflow patch itself;
#   3. the patch's run command (`make ci-db`) in the clone — green, timed against 2/3 of the patch's timeout-minutes;
#      no build folder of a run left behind; `make check` (the old check job) green in the same shallow clone;
#   4. three break copies in the clone, each must go red with its pinned line:
#        bo-phien     — the one sign-in of the signed-in run saves an empty browser state;
#        vai-chu      — ci-db.sh connects the isolation suite's session cases as postgres;
#        may-chu-chu  — the dev server of the signed-in run connects as postgres.
# Last line: `ci-thu: xanh <phút> phút · check xanh · pha bo-phien do · pha vai-chu do · pha may-chu-chu do`.
#
#   bash db/scripts/ci-thu.sh [patch]                 the whole run (default patch: _acceptance/ci-co-postgres/ci-yml.patch)
#   bash db/scripts/ci-thu.sh --chi-doc [patch]       print what is read from the patch, run nothing
#   bash db/scripts/ci-thu.sh --kiem-tran <phút> [patch]  exit 1 when <phút> is 2/3 of the patch's timeout or more
#
# It only creates and removes its own container (onehub-inventory-db-ci-thu-<pid>) and its own temporary folder.
set -uo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PATCH_DEFAULT="$root/_acceptance/ci-co-postgres/ci-yml.patch"

# Values of the added lines of the patch.
doc_ban_va() {
  local patch="$1"
  [ -f "$patch" ] || {
    echo "ci-thu: không có bản vá $patch" >&2
    return 2
  }
  ANH=$(sed -nE 's/^\+ +image: *([^ ]+) *$/\1/p' "$patch" | head -1)
  MAT_KHAU=$(sed -nE 's/^\+ +POSTGRES_PASSWORD: *([^ ]+) *$/\1/p' "$patch" | head -1)
  CONG_TRONG=$(sed -nE 's/^\+ +- *"?([0-9]+):([0-9]+)"? *$/\2/p' "$patch" | head -1)
  TRAN=$(sed -nE 's/^\+ +timeout-minutes: *([0-9]+) *$/\1/p' "$patch" | head -1)
  LENH=$(sed -nE 's/^\+ +- run: *(.+)$/\1/p' "$patch" | tail -1)
  local thieu=""
  [ -n "$ANH" ] || thieu+="image "
  [ -n "$MAT_KHAU" ] || thieu+="POSTGRES_PASSWORD "
  [ -n "$CONG_TRONG" ] || thieu+="ports "
  [ -n "$TRAN" ] || thieu+="timeout-minutes "
  [ -n "$LENH" ] || thieu+="run "
  if [ -n "$thieu" ]; then
    echo "ci-thu: bản vá thiếu: $thieu" >&2
    return 2
  fi
}

# Exit 1 when $1 minutes reach 2/3 of the timeout: CI runners are slower than a lane.
kiem_tran() {
  local phut="$1" tran="$2"
  if awk -v p="$phut" -v t="$tran" 'BEGIN { exit !(p * 3 >= t * 2) }'; then
    echo "vuot 2/3 tran: $phut / $tran"
    return 1
  fi
  echo "duoi 2/3 tran: $phut / $tran"
}

case "${1:-}" in
  --chi-doc)
    doc_ban_va "${2:-$PATCH_DEFAULT}" || exit 2
    echo "postgres: $ANH (tu ban va)"
    echo "mat khau: $MAT_KHAU"
    echo "cong trong container: $CONG_TRONG"
    echo "lenh: $LENH"
    echo "tran $TRAN phut"
    exit 0
    ;;
  --kiem-tran)
    doc_ban_va "${3:-$PATCH_DEFAULT}" || exit 2
    kiem_tran "${2:?--kiem-tran <phút>}" "$TRAN"
    exit $?
    ;;
esac

PATCH="${1:-$PATCH_DEFAULT}"
doc_ban_va "$PATCH" || exit 2
sha=$(git -C "$root" rev-parse HEAD)
[ -z "$(git -C "$root" status --porcelain -- . ':!_acceptance')" ] ||
  echo "ci-thu: cảnh báo — cây có thay đổi chưa commit; bản sao chỉ mang commit $sha"

tmp=$(mktemp -d "${TMPDIR:-/tmp}/ci-thu.XXXXXX")
ten="onehub-inventory-db-ci-thu-$$"
don() {
  docker rm -f "$ten" >/dev/null 2>&1 || true
  rm -rf "$tmp"
}
trap don EXIT

kho="$tmp/kho"
echo "ci-thu: ── ban sao nong cua $sha"
git init -q "$kho" &&
  git -C "$kho" fetch -q --depth 1 "file://$root" "$sha" &&
  git -C "$kho" checkout -q FETCH_HEAD || {
  echo "ci-thu: không lấy được bản sao nông"
  exit 1
}
[ "$(git -C "$kho" rev-parse --is-shallow-repository)" = "true" ] && echo "ban sao nong: depth 1"
(cd "$kho" && npm ci --no-audit --no-fund --loglevel=error) || {
  echo "ci-thu: npm ci đỏ"
  exit 1
}

cong=$(node -e 'const s=require("net").createServer();s.listen(0,"127.0.0.1",()=>{console.log(s.address().port);s.close()})')
echo "postgres: $ANH (tu ban va) · cong $cong"
docker run -d --rm --name "$ten" -e POSTGRES_PASSWORD="$MAT_KHAU" -p "127.0.0.1:$cong:$CONG_TRONG" "$ANH" >/dev/null || {
  echo "ci-thu: không dựng được container $ANH"
  exit 1
}
for i in $(seq 1 120); do
  docker exec "$ten" pg_isready -U postgres -q 2>/dev/null && break
  [ "$i" -eq 120 ] && {
    echo "ci-thu: Postgres $ANH không sẵn sàng sau 120 giây"
    exit 1
  }
  sleep 1
done

# psql inside the container when this machine has none (CI has psql on the runner).
moi_truong=(DB_PORT="$cong" PGPASSWORD=local-only DB_LANE=ci)
if command -v psql >/dev/null 2>&1; then
  psql_cmd="psql -h 127.0.0.1 -p $cong"
else
  moi_truong+=(CI_DB_CONTAINER="$ten")
  psql_cmd="docker exec -i -e PGPASSWORD=local-only $ten psql -h 127.0.0.1 -p 5432"
fi
# A break that calls Playwright directly (may-chu-chu) gets the psql commands make ci-db would export; without them the
# scratch database is looked up among the lane containers by name. ci-db.sh sets its own and ignores these.
moi_truong+=("PSQL=$psql_cmd -U postgres" "PSQL_LOGIN=$psql_cmd -U quy_hang_login")
loi=""

echo "ci-thu: ── luot xanh: $LENH"
t0=$(date +%s)
(cd "$kho" && env "${moi_truong[@]}" CI_DB_OUT="$tmp/bao-cao" bash -c "$LENH") 2>&1 | tee "$tmp/xanh.log"
ma=${PIPESTATUS[0]}
phut=$(awk -v s="$(($(date +%s) - t0))" 'BEGIN { printf "%.1f", s / 60 }')
if [ "$ma" -ne 0 ] || [ "$(grep '^ci-db: ' "$tmp/xanh.log" | tail -1)" != "ci-db: 6/6 bước đạt" ]; then
  loi+="luot xanh do (ma $ma); "
fi
kiem_tran "$phut" "$TRAN" || loi+="vuot 2/3 tran; "

con=0
for goc in onehub-e2e onehub-e2e-db; do
  [ -d "$kho/node_modules/.cache/$goc" ] && con=$((con + $(find "$kho/node_modules/.cache/$goc" -mindepth 1 -maxdepth 1 -type d | wc -l)))
done
echo "thu muc dung tam con lai: $con"
[ "$con" -eq 0 ] || loi+="con $con thu muc dung tam; "

echo "ci-thu: ── make check trong ban sao nong"
if (cd "$kho" && make check) >"$tmp/check.log" 2>&1; then
  check="check xanh"
else
  tail -40 "$tmp/check.log"
  check="check do"
  loi+="make check do trong ban sao nong; "
fi
echo "$check"

# One break: edit a copy of a file in the clone, run, expect red with the pinned lines, put the file back.
pha() {
  local ten_pha="$1" tep="$2" cu="$3" moi="$4" lenh="$5"
  shift 5
  echo "ci-thu: ── pha $ten_pha"
  if ! grep -qF "$cu" "$kho/$tep"; then
    echo "pha $ten_pha: không thấy chỗ phá trong $tep"
    loi+="pha $ten_pha khong dung duoc; "
    return
  fi
  CU="$cu" MOI="$moi" perl -0pi -e 's/\Q$ENV{CU}\E/$ENV{MOI}/' "$kho/$tep"
  (cd "$kho" && env "${moi_truong[@]}" CI_DB_OUT="$tmp/pha-$ten_pha" bash -c "$lenh") >"$tmp/pha-$ten_pha.log" 2>&1
  local ma=$?
  git -C "$kho" checkout -q -- "$tep"
  local thieu=""
  [ "$ma" -ne 0 ] || thieu+="lenh van xanh; "
  for ghim in "$@"; do
    grep -qE "$ghim" "$tmp/pha-$ten_pha.log" || thieu+="thieu dong '$ghim'; "
  done
  grep -E '^ci-db: |^roi: |HỎNG |may chu dev' "$tmp/pha-$ten_pha.log" | head -12 | sed "s/^/  [pha $ten_pha] /"
  if [ -n "$thieu" ]; then
    echo "pha $ten_pha: ${thieu%; }"
    loi+="pha $ten_pha khong do dung; "
    ket+=" · pha $ten_pha XANH"
  else
    ket+=" · pha $ten_pha do"
  fi
}
ket=""
pha bo-phien tests/e2e-db/phien.setup.ts \
  'setup("dang nhap phien thu", async ({ page }) => {' \
  'setup("dang nhap phien thu", async ({ page }) => {
  await page.context().storageState({ path: SESSION_FILE });
  return;' \
  'BUOC="co-phien khong-phien dem" make ci-db' \
  '^ci-db: co-phien HỎNG' '^roi: ' 'HỎNG: co-phien'
pha vai-chu db/scripts/ci-db.sh \
  'export PSQL_LOGIN="$PSQL_CMD -U quy_hang_login"' \
  'export PSQL_LOGIN="$PSQL_CMD -U postgres"' \
  'BUOC="chuan-bi cach-ly" make ci-db' \
  '^ci-db: cach-ly HỎNG' 'HỎNG dang-nhap-khong-ve-vai-chu' 'HỎNG: cach-ly'
pha may-chu-chu playwright.db.config.ts \
  'postgres://quy_hang_login:local-only@' \
  'postgres://postgres:local-only@' \
  'npx playwright test -c playwright.db.config.ts tests/e2e-db/vai-noi.spec.ts --project=1440' \
  'may chu dev noi bang vai khac quy_hang_login: postgres'

if [ -n "$loi" ]; then
  echo "ci-thu: DO — ${loi%; }"
  echo "ci-thu: xanh? khong · $phut phut · $check$ket"
  exit 1
fi
echo "ci-thu: xanh $phut phút · $check$ket"
