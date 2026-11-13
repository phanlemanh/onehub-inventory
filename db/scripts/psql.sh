# Shared helpers for the db scripts: pick this lane's Postgres container and call psql inside it.
# Source it from bash: `source "$(dirname "${BASH_SOURCE[0]}")/psql.sh"`.
#
#   PSQL      — when set, used as the whole psql command (for example `psql -h 127.0.0.1 -p 5563 -U postgres`).
#   DB_LANE   — lane name; the container is onehub-inventory-db-$DB_LANE (see mk/db.mk).
#               Unset: the single running onehub-inventory-db-* container. None or several: stop and ask for DB_LANE.
#
#   PSQL_LOGIN — with PSQL set (CI, row 1s): the whole psql command for the app's login role quy_hang_login (row 7c).
#
# pg_psql_login [psql args…] — psql connected AS quy_hang_login: the container's local socket (trust), or PSQL_LOGIN.
# pg_sql <db> [psql args…]  — stdin goes straight to psql, which stops at the first error.
# pg_cmd <db> <statement>   — one statement; stdin is closed so `docker exec -i` cannot eat the caller's input.

pg_resolve() {
  if [ -n "${PSQL:-}" ]; then
    PG_CONTAINER=""
    return 0
  fi
  if [ -n "${DB_LANE:-}" ]; then
    PG_CONTAINER="onehub-inventory-db-$DB_LANE"
  else
    local running
    running=$(docker ps --format '{{.Names}}' | grep '^onehub-inventory-db-' || true)
    local count
    count=$(printf '%s' "$running" | grep -c . || true)
    if [ "$count" -ne 1 ]; then
      echo "cần DB_LANE: thấy $count container onehub-inventory-db-* đang chạy — đặt DB_LANE=<dãy> (make db-up DB_LANE=<dãy>)" >&2
      exit 2
    fi
    PG_CONTAINER="$running"
  fi
  if [ "$(docker inspect -f '{{.State.Running}}' "$PG_CONTAINER" 2>/dev/null)" != "true" ]; then
    echo "container $PG_CONTAINER không chạy — make db-up DB_LANE=${DB_LANE:-${PG_CONTAINER#onehub-inventory-db-}}" >&2
    exit 2
  fi
}

pg_psql() {
  if [ -n "${PSQL:-}" ]; then
    # shellcheck disable=SC2086 # PSQL is a command line on purpose
    $PSQL "$@"
  else
    docker exec -i "$PG_CONTAINER" psql -U postgres "$@"
  fi
}

pg_psql_login() {
  if [ -n "${PSQL:-}" ]; then
    if [ -z "${PSQL_LOGIN:-}" ]; then
      echo "PSQL đặt mà thiếu PSQL_LOGIN — cần lệnh psql nối bằng quy_hang_login (.env.example)" >&2
      return 2
    fi
    # shellcheck disable=SC2086 # PSQL_LOGIN is a command line on purpose
    $PSQL_LOGIN "$@"
  else
    docker exec -i "$PG_CONTAINER" psql -U quy_hang_login "$@"
  fi
}

pg_sql() {
  local db="$1"
  shift
  pg_psql -d "$db" -v ON_ERROR_STOP=1 -X -q "$@"
}

pg_cmd() {
  local db="$1"
  shift
  pg_psql -d "$db" -v ON_ERROR_STOP=1 -X -q -A -t -c "$1" </dev/null
}

pg_resolve
