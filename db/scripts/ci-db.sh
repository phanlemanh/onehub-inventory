#!/usr/bin/env bash
# Everything CI runs on a database, in one command (row 1s, _acceptance/ci-co-postgres). The CI job only starts a
# Postgres of its own (postgres:16, password local-only) and calls `make ci-db`; a lane reproduces it with
# `make ci-db DB_PORT=<port of a fresh container>`.
#
#   bash db/scripts/ci-db.sh [step…]      steps, in this order (default: all six):
#     chuan-bi     wait for Postgres; migrate a scratch database so the login role quy_hang_login exists on the
#                  cluster; give it the password local-only (this cluster lives for one run); drop the scratch database
#     cach-ly      the isolation suite (db/scripts/cach-ly.sh), its session cases connected as quy_hang_login
#     bai-db       every database test file (vitest -c vitest.db.config.ts), JSON report
#     co-phien     every signed-in browser test file (playwright -c playwright.db.config.ts), JSON report
#     khong-phien  the signed-out run of the register-driven suite (main configuration), JSON report
#     dem          hand-over count between the two runs and passed tests per file (tests/e2e-db/dem-giao-nhan.ts)
#   BUOC="…"       same as the arguments, for `make ci-db BUOC="co-phien khong-phien dem"`.
#   DB_PORT        Postgres port (default 5432, the CI service).
#   CI_DB_OUT      folder for the reports (default: a new temporary folder, printed).
#   CI_DB_CONTAINER  run psql inside this container (a lane without psql); CI_DB_DOI  seconds to wait (default 60).
#
# Every step prints one line `ci-db: <step> đạt|HỎNG (mã <n>, <s> giây)`. A red step does not stop the next ones,
# except chuan-bi: without the login role every later step would be red for no reason of its own. The last line is
# `ci-db: <k>/<m> bước đạt` (exit 0) or `ci-db: <k>/<m> bước đạt — HỎNG: <steps>` (exit 1).
set -uo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root" || exit 2

ALL=(chuan-bi cach-ly bai-db co-phien khong-phien dem)
chon=()
if [ "$#" -gt 0 ]; then
  chon=("$@")
elif [ -n "${BUOC:-}" ]; then
  read -r -a chon <<<"$BUOC"
else
  chon=("${ALL[@]}")
fi
for b in "${chon[@]}"; do
  case " ${ALL[*]} " in *" $b "*) ;; *)
    echo "ci-db: bước lạ: $b (có: ${ALL[*]})" >&2
    exit 2
    ;;
  esac
done
# Keep the fixed order whatever order the steps were given in.
buoc=()
for b in "${ALL[@]}"; do
  case " ${chon[*]} " in *" $b "*) buoc+=("$b") ;; esac
done

export DB_PORT="${DB_PORT:-5432}"
export PGPASSWORD=local-only
# psql over TCP with a password, as the CI runner has it. A machine without psql names the Postgres container in
# CI_DB_CONTAINER: psql then runs inside it, still over TCP with the password, so the login role is checked the same way.
if [ -n "${CI_DB_CONTAINER:-}" ]; then
  PSQL_CMD="docker exec -i -e PGPASSWORD=local-only $CI_DB_CONTAINER psql -h 127.0.0.1 -p 5432"
else
  PSQL_CMD="psql -h 127.0.0.1 -p $DB_PORT"
  if ! command -v psql >/dev/null 2>&1; then
    echo "ci-db: không có psql trên máy — cài psql, hoặc đặt CI_DB_CONTAINER=<container Postgres>" >&2
    exit 2
  fi
fi
export PSQL="$PSQL_CMD -U postgres"
export PSQL_LOGIN="$PSQL_CMD -U quy_hang_login"
# The tests pass DB_LANE on to db/scripts; with PSQL set no container is looked up.
export DB_LANE="${DB_LANE:-ci}"
OUT="${CI_DB_OUT:-$(mktemp -d "${TMPDIR:-/tmp}/ci-db.XXXXXX")}"
mkdir -p "$OUT"
echo "ci-db: Postgres 127.0.0.1:$DB_PORT · vai nối quy_hang_login · báo cáo ở $OUT"

chuan_bi() {
  local i
  local doi="${CI_DB_DOI:-60}"
  for i in $(seq 1 "$doi"); do
    $PSQL -d postgres -X -q -A -t -c "select 1" >/dev/null 2>&1 && break
    [ "$i" -eq "$doi" ] && {
      echo "Postgres không nhận kết nối sau $doi giây ở cổng $DB_PORT"
      return 1
    }
    sleep 1
  done
  $PSQL -d postgres -X -q -v ON_ERROR_STOP=1 -c "drop database if exists ci_db_vai with (force)" -c "create database ci_db_vai" || return 1
  bash db/scripts/migrate.sh ci_db_vai || return 1
  $PSQL -d postgres -X -q -v ON_ERROR_STOP=1 -c "alter role quy_hang_login password 'local-only'" || return 1
  $PSQL -d postgres -X -q -v ON_ERROR_STOP=1 -c "drop database ci_db_vai with (force)" || return 1
  $PSQL_LOGIN -d postgres -X -q -A -t -c "select 'vai nối: ' || current_user" || return 1
}

chay() {
  case "$1" in
    chuan-bi) chuan_bi ;;
    cach-ly) bash db/scripts/cach-ly.sh ;;
    bai-db)
      npx vitest run -c vitest.db.config.ts --reporter=default --reporter=json \
        --outputFile.json="$OUT/bai-db.json"
      ;;
    co-phien)
      PLAYWRIGHT_JSON_OUTPUT_NAME="$OUT/co-phien.json" npx playwright test -c playwright.db.config.ts --reporter=list,json
      ;;
    khong-phien)
      PLAYWRIGHT_JSON_OUTPUT_NAME="$OUT/khong-phien.json" npx playwright test tests/e2e/screens/screens.spec.ts \
        --reporter=list,json
      ;;
    dem) node tests/e2e-db/dem-giao-nhan.ts "$OUT" ;;
  esac
}

dat=0
hong=()
for b in "${buoc[@]}"; do
  echo "ci-db: ── $b"
  t0=$(date +%s)
  chay "$b"
  ma=$?
  s=$(($(date +%s) - t0))
  if [ "$ma" -eq 0 ]; then
    echo "ci-db: $b đạt (mã 0, $s giây)"
    dat=$((dat + 1))
  else
    echo "ci-db: $b HỎNG (mã $ma, $s giây)"
    hong+=("$b")
    [ "$b" = "chuan-bi" ] && break
  fi
done

if [ "${#hong[@]}" -eq 0 ]; then
  echo "ci-db: $dat/${#buoc[@]} bước đạt"
  exit 0
fi
echo "ci-db: $dat/${#buoc[@]} bước đạt — HỎNG: ${hong[*]}"
exit 1
