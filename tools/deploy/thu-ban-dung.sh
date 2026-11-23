#!/usr/bin/env bash
# The production build on a lane's Postgres (row moi-truong-thu-va-ban-that, AC-6, eval E6). A real `next build` runs
# with `next start` as staging, connected as the app's login role, and every switch of a development machine must be
# shut: /proto/<every slug of the prototype register> answers 404; ?role=, ?sample=, ?state= change nothing, signed out
# (sign-in, like the address without them) and with a session this run signs itself with its own AUTH_SECRET (same
# role, same rows, same state as without them). A dev server on the same tree shows the switches do work there
# (positive control), and the same build connected as a table owner says so: it refuses to start naming DATABASE_URL,
# and with the login role made owner of a table its health answers ok false with the query door's reason.
#
#   DB_LANE=k DB_PORT=5564 bash tools/deploy/thu-ban-dung.sh        (config:executors.script.ban_dung_that)
#
# Every check prints `ok <case>`; a failure prints `ban-dung-that: ĐỎ — <case>: <why>` and exits 1. The last line is
# `ban-dung-that: <n> phép kiểm đạt`. No value of a variable is printed. Everything this run starts is stopped and its
# build folders and database are removed, also on failure.
#
# Why a separate build folder: next.config.ts takes NEXT_DIST_DIR (and NEXT_TSCONFIG) for exactly this — a second
# server in the same checkout. `next build` empties its build folder when it starts, so building into .next would
# delete a running dev server's files; this run builds into node_modules/.cache/onehub-ban-dung/<pid>/ instead, with its
# own tsconfig there, and puts back next-env.d.ts (which `next build` rewrites to point at its folder).
set -uo pipefail
set -m # each server in its own process group, so stopping it stops its children too

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 2

LANE="${DB_LANE:-k}"
DB_PORT="${DB_PORT:-5564}"
CONTAINER="onehub-inventory-db-$LANE"
DB_NAME="bang_hang_dev" # the one database db/scripts/nap-mau.ts creates and drops
RUN="$$"
WORK="node_modules/.cache/onehub-ban-dung/$RUN"
TMP="$(mktemp -d "${TMPDIR:-/tmp}/onehub-ban-dung.XXXXXX")"
HEAD="$(git rev-parse HEAD)"
NEXT_BIN="node_modules/next/dist/bin/next"
# Fake but well-formed production settings: nothing here reaches a real service (the sender is never called).
AUTH_SECRET_RUN="ban-dung-$RUN-$(node -e 'process.stdout.write(require("crypto").randomBytes(24).toString("hex"))')"
LOGIN_URL="postgres://quy_hang_login:local-only@127.0.0.1:$DB_PORT/$DB_NAME"
OWNER_URL="postgres://postgres:local-only@127.0.0.1:$DB_PORT/$DB_NAME"
PERSON="ban-dung-$RUN@example.test"
PERSON_ROLE="ListAgent"

PIDS=()
STARTED_DB=0
DB_MADE=0
N=0
NEXT_ENV_BACKUP=""

cleanup() {
  local pid
  set +m # no job notices while stopping
  for pid in ${PIDS[@]+"${PIDS[@]}"}; do
    kill -TERM -- "-$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null
  done
  for pid in ${PIDS[@]+"${PIDS[@]}"}; do
    for _ in 1 2 3 4 5 6 7 8 9 10; do kill -0 "$pid" 2>/dev/null || break; sleep 0.5; done
    kill -KILL -- "-$pid" 2>/dev/null || kill -KILL "$pid" 2>/dev/null
    wait "$pid" 2>/dev/null
  done
  if [ "$DB_MADE" = 1 ]; then
    docker exec "$CONTAINER" psql -U postgres -qAtc "drop database if exists $DB_NAME with (force)" >/dev/null 2>&1
  fi
  [ "$STARTED_DB" = 1 ] && docker rm -f "$CONTAINER" >/dev/null 2>&1
  if [ -n "$NEXT_ENV_BACKUP" ] && [ -f "$NEXT_ENV_BACKUP" ]; then cp "$NEXT_ENV_BACKUP" next-env.d.ts; fi
  rm -rf "$WORK" "$TMP"
  rmdir "$(dirname "$WORK")" 2>/dev/null
  return 0
}
trap cleanup EXIT
trap 'exit 130' INT TERM

do_() { # one passed check
  N=$((N + 1))
  echo "ok $1"
}
red() {
  echo "ban-dung-that: ĐỎ — $1"
  exit 1
}

free_port() {
  node -e 'const s=require("net").createServer();s.listen(0,"127.0.0.1",()=>{console.log(s.address().port);s.close()})'
}

# Waits until `url` answers anything; fails when the process `pid` is gone first. 0 = up, 1 = process ended.
wait_up() {
  local url="$1" pid="$2" secs="${3:-180}" i
  for ((i = 0; i < secs * 2; i++)); do
    kill -0 "$pid" 2>/dev/null || return 1
    curl -s -o /dev/null --max-time 5 "$url" && return 0
    sleep 0.5
  done
  return 2
}

stop() {
  local pid="$1"
  set +m
  kill -TERM -- "-$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null
  for _ in $(seq 1 20); do kill -0 "$pid" 2>/dev/null || break; sleep 0.5; done
  kill -KILL -- "-$pid" 2>/dev/null
  wait "$pid" 2>/dev/null # reaps it, so the shell prints no job notice
  set -m
  return 0
}

psql_owner() { docker exec -i "$CONTAINER" psql -U postgres -d "$DB_NAME" -X -q -A -t -v ON_ERROR_STOP=1 "$@"; }

# Production server env: a clean environment, nothing of this shell's development settings.
prod_env() {
  env -i PATH="$PATH" HOME="$HOME" TMPDIR="${TMPDIR:-/tmp}" \
    NODE_ENV=production APP_ENV=staging \
    NEXT_DIST_DIR="$WORK/build" NEXT_TSCONFIG="$WORK/tsconfig.json" NEXT_TELEMETRY_DISABLED=1 \
    AUTH_SECRET="$AUTH_SECRET_RUN" RESEND_API_KEY="re_bandung_$RUN" \
    MAIL_FROM="OneHub <khong-tra-loi@thu.onehub.center>" APP_URL="https://thu.onehub.center" \
    COMMIT_SHA="$HEAD" "$@"
}

# ---------------------------------------------------------------- registers, read from the code that obeys them
PROTO_DIR="src/app/(app)/proto"
PROTO_SLUGS=()
while IFS= read -r s; do [ -n "$s" ] && PROTO_SLUGS+=("$s"); done < <(
  { grep -ho '_SLUG = "[^"]*"' "$PROTO_DIR/[slug]/page.tsx" 2>/dev/null | sed -E 's/.*"(.*)"/\1/'
    for d in "$PROTO_DIR"/*/; do
      b="$(basename "$d")"
      [ "$b" != "[slug]" ] && [ -f "$d/page.tsx" ] && echo "$b"
    done; } | sort -u)
[ "${#PROTO_SLUGS[@]}" -gt 0 ] || red "so ban mau rong"
ROLES=()
while IFS= read -r s; do [ -n "$s" ] && ROLES+=("$s"); done < <(
  sed -n '/export const ROLES = \[/,/\]/p' src/modules/identity/roles.ts | grep -o '"[A-Za-z]*"' | tr -d '"')
[ "${#ROLES[@]}" -gt 0 ] || red "bang quyen rong"
STATES=()
while IFS= read -r s; do [ -n "$s" ] && STATES+=("$s"); done < <(
  grep -h 'const STATE_PARAMS = \[' src/modules/listings/ui/inventory-rows.ts | grep -o '"[a-z-]*"' | tr -d '"')
[ "${#STATES[@]}" -gt 0 ] || red "khong thay trang thai ep"
MAUS=()
while IFS= read -r s; do [ -n "$s" ] && MAUS+=("$s"); done < <(
  sed -n '/export function inventoryEdgeRowsFrom/,/^}/p' src/modules/listings/ui/inventory-rows.ts |
    grep -o 'param !== "[a-z-]*"' | sed -E 's/.*"(.*)"/\1/')
[ "${#MAUS[@]}" -gt 0 ] || red "khong thay gia tri mau"
PARAMS=()
for v in "${ROLES[@]}"; do PARAMS+=("role=$v"); done
for v in "${MAUS[@]}"; do PARAMS+=("sample=$v"); done
for v in "${STATES[@]}"; do PARAMS+=("state=$v"); done
echo "so ban mau: ${PROTO_SLUGS[*]}"
echo "bang quyen: ${ROLES[*]} · mau: ${MAUS[*]} · trang thai ep: ${STATES[*]}"

# ---------------------------------------------------------------- 1. fresh database on the lane
if ! docker exec "$CONTAINER" pg_isready -U postgres -q 2>/dev/null; then
  make -s db-up DB_LANE="$LANE" DB_PORT="$DB_PORT" >/dev/null || red "co-so-du-lieu: không dựng được Postgres làn $LANE"
  STARTED_DB=1
fi
DB_MADE=1
if ! DB_LANE="$LANE" DB_PORT="$DB_PORT" npx tsx db/scripts/nap-mau.ts >"$TMP/nap-mau.log" 2>&1; then
  sed -E 's#postgres://[^ ]*#postgres://***#g' "$TMP/nap-mau.log" | tail -5
  red "co-so-du-lieu: nạp mẫu lỗi"
fi
# This run's own person: one company ([MAU]), one role, so the session opens straight into it.
psql_owner -v email="$PERSON" -v role="$PERSON_ROLE" >/dev/null <<'SQL' || red "co-so-du-lieu: không thêm được người của lượt"
with u as (insert into identity.users (email, name) values (:'email', '[Tên] Bản dựng') returning id)
insert into company_members (company_id, user_id, name, roles)
select c.id, u.id, '[Tên] Bản dựng', array[:'role']::text[] from u, companies c where c.name = '[MAU]';
SQL
do_ "co-so-du-lieu-lan-$LANE"

# ---------------------------------------------------------------- 2. production build in its own folder
mkdir -p "$WORK"
NEXT_ENV_BACKUP="$TMP/next-env.d.ts"
if [ -f next-env.d.ts ]; then cp next-env.d.ts "$NEXT_ENV_BACKUP"; else NEXT_ENV_BACKUP=""; fi
node -e '
const fs = require("fs");
const base = JSON.parse(fs.readFileSync("tsconfig.json", "utf8"));
const up = "../../../../";
fs.writeFileSync(process.argv[1], JSON.stringify({
  compilerOptions: { ...base.compilerOptions, paths: { "@/*": [up + "src/*"] } },
  include: [up + "next-env.d.ts", up + "src"],
}, null, 2));' "$WORK/tsconfig.json"
t0=$SECONDS
if ! prod_env node "$NEXT_BIN" build >"$TMP/build.log" 2>&1; then
  tail -20 "$TMP/build.log"
  red "dung: next build lỗi"
fi
echo "dựng xong sau $((SECONDS - t0))s"
do_ "next-build"

PORT="$(free_port)"
BASE="http://127.0.0.1:$PORT"
prod_env DATABASE_URL="$LOGIN_URL" node "$NEXT_BIN" start -p "$PORT" -H 127.0.0.1 >"$TMP/start.log" 2>&1 &
PROD_PID=$!
PIDS+=("$PROD_PID")
wait_up "$BASE/login" "$PROD_PID" 90 || { tail -20 "$TMP/start.log"; red "khoi-dong: next start không lên"; }
do_ "next-start"

# ---------------------------------------------------------------- 3. health
# Prints "" when the body is exactly {ok, commit, env, vai} with the expected values, else the reason.
health_check() { # $1 body, $2 want ok (true|false), $3 want commit, $4 want env, $5 vai: "dat" or a prefix
  node -e '
const [body, ok, commit, env, vai] = process.argv.slice(1);
let b; try { b = JSON.parse(body); } catch { console.log("không phải JSON"); process.exit(); }
const keys = Object.keys(b).sort().join(",");
if (keys !== "commit,env,ok,vai") { console.log("khoá: " + keys); process.exit(); }
if (String(b.ok) !== ok) { console.log("ok là " + b.ok + " (vai: " + b.vai + ")"); process.exit(); }
if (b.commit !== commit) { console.log("commit " + String(b.commit).slice(0, 7)); process.exit(); }
if (b.env !== env) { console.log("env " + b.env); process.exit(); }
if (vai === "dat" ? b.vai !== "dat" : !String(b.vai).startsWith(vai)) { console.log("vai: " + b.vai); process.exit(); }
console.log("");' "$@"
}
body="$(curl -s --max-time 20 "$BASE/api/v1/health")"
why="$(health_check "$body" true "$HEAD" staging dat)"
[ -z "$why" ] || red "suc-khoe: $why"
do_ "suc-khoe-bon-khoa-ok-commit-staging-dat"

# ---------------------------------------------------------------- 4. every prototype is gone
# The HTTP status itself must be 404 (AC-6, and what kiem-nhanh.mjs reads after a deploy). A page that streams Next's
# not-found screen under status 200 (a "soft 404": notFound() after the (app) layout's loading boundary has started the
# response) is named as such.
for slug in "${PROTO_SLUGS[@]}"; do
  code="$(curl -s -o "$TMP/proto.html" -w '%{http_code}' --max-time 30 "$BASE/proto/$slug")"
  if [ "$code" != 404 ]; then
    if grep -q 'NEXT_HTTP_ERROR_FALLBACK;404' "$TMP/proto.html"; then
      red "proto/$slug: trả $code với màn không-có trong luồng (404 mềm), cần mã 404"
    fi
    red "proto/$slug: trả $code, cần 404"
  fi
  do_ "proto/$slug-404"
  # The behaviour prototype's switch (row 1v): with ?permission=denied the page is still not there.
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 "$BASE/proto/$slug?permission=denied")"
  [ "$code" = 404 ] || red "proto/$slug?permission=denied: trả $code, cần 404"
  do_ "proto/$slug?permission=denied-404"
done

# ---------------------------------------------------------------- 5. signed out: every switch goes to sign-in
# "<status> <path it sends the browser to>", no redirect followed: the Location header of a 3xx, or — when the page has
# already started streaming, as every (app) screen does behind its loading boundary — the target of Next's in-stream
# redirect (NEXT_REDIRECT;…;<url>;<code>). The query (?next=…) is left out: it only carries the address back.
answer_of() {
  local code loc
  code="$(curl -s -o "$TMP/answer.html" -D "$TMP/answer.h" --max-time 60 -w '%{http_code}' "$@")"
  loc="$(grep -i '^location:' "$TMP/answer.h" | head -1 | tr -d '\r' | sed -E 's/^[^:]*: *//')"
  [ -n "$loc" ] || loc="$(grep -o 'NEXT_REDIRECT;[a-z]*;[^;]*;' "$TMP/answer.html" | head -1 | cut -d';' -f3)"
  loc="$(sed -E -e 's#^https?://[^/]*##' -e 's#[?].*##' <<<"$loc")"
  echo "$code ${loc:--}"
}
plain="$(answer_of "$BASE/inventory")"
case "$plain" in
  *" /login") ;;
  *) red "chua-dang-nhap /inventory: '$plain', cần chuyển về /login" ;;
esac
for p in "${PARAMS[@]}"; do
  got="$(answer_of "$BASE/inventory?$p")"
  [ "$got" = "$plain" ] || red "chua-dang-nhap ?$p: '$got', không tham số là '$plain'"
  do_ "chua-dang-nhap-?$p-ve-login"
done

# ---------------------------------------------------------------- 6. with a session this run signs itself
# A code hashed with this run's AUTH_SECRET exactly as the server hashes it (hashCode in src/modules/identity/code.ts),
# put in place as the owner, then traded for a session through the real POST /api/v1/auth/session.
CODE="$(node -e 'process.stdout.write(String(require("crypto").randomInt(0, 1e6)).padStart(6, "0"))')"
HASH="$(AUTH_SECRET_RUN="$AUTH_SECRET_RUN" node -e '
const c = require("crypto");
process.stdout.write(c.createHmac("sha256", process.env.AUTH_SECRET_RUN).update(process.argv[1] + ":" + process.argv[2]).digest("hex"));' "$PERSON" "$CODE")"
psql_owner -v email="$PERSON" -v h="$HASH" >/dev/null <<'SQL' || red "phien: không đặt được mã"
insert into identity.login_codes (email, code_hash, expires_at) values (:'email', :'h', now() + interval '10 minutes')
on conflict (email) do update set code_hash = excluded.code_hash, expires_at = excluded.expires_at, failed_attempts = 0;
SQL
status="$(curl -s -o "$TMP/session.json" -D "$TMP/session.h" -w '%{http_code}' --max-time 30 \
  -H 'content-type: application/json' --data "{\"email\":\"$PERSON\",\"code\":\"$CODE\"}" "$BASE/api/v1/auth/session")"
TOKEN="$(grep -i '^set-cookie: ohi_session=' "$TMP/session.h" | head -1 | sed -E 's/^[^=]*=([^;]*).*/\1/' | tr -d '\r')"
[ "$status" = 200 ] && [ -n "$TOKEN" ] || red "phien: đổi mã lấy phiên trả $status"
# The cookie travels as a header (curl -b with a file would want the Netscape format); the token is never printed.
printf "cookie: ohi_session=%s\n" "$TOKEN" >"$TMP/cookie"
chmod 600 "$TMP/cookie"
do_ "phien-tu-ky"

# What a signed-in page shows, reduced to what the switches could change: where it sends the browser, the roles the
# page hands to its buttons (from the React payload), how many rows of each status it lists, the sample's edge rows,
# the forced-state screen, and a hash of the visible markup (scripts removed: the React payload numbers its chunks, and
# a request with a query has one more) once the request's own query is taken out of the links that carry it along.
signal_of() { # $1 file, $2 query ("" for none)
  node -e '
const fs = require("fs");
const { createHash } = require("crypto");
const [file, q] = process.argv.slice(1);
let html = fs.readFileSync(file, "utf8");
if (q) {
  const [k, v] = q.split("=");
  const e = encodeURIComponent;
  const forms = [[`?${k}=${v}&amp;`, "?"], [`?${k}=${v}&`, "?"], [`&amp;${k}=${v}`, ""], [`&${k}=${v}`, ""],
    [`?${k}=${v}`, ""], [e(`?${k}=${v}&`), e("?")], [e(`&${k}=${v}`), ""], [e(`?${k}=${v}`), ""], [`${k}=${v}`, ""],
    [`\\"${k}\\":\\"${v}\\"`, ""], [`"${k}":"${v}"`, ""]];
  for (const [f, t] of forms) html = html.split(f).join(t);
}
const short = (s) => createHash("sha256").update(s).digest("hex").slice(0, 12);
const roles = [...html.matchAll(/\\?"roles\\?":\[([^\]]*)\]/g)].map((m) => m[1].replace(/\\/g, "")).join("|");
const statuses = [...html.matchAll(/data-(?:region-)?status="([^"]*)"/g)].map((m) => m[1]);
const count = {};
for (const s of statuses) count[s] = (count[s] || 0) + 1;
const rows = Object.keys(count).sort().map((s) => `${s}:${count[s]}`).join(",");
const edge = (html.match(/bien-\d/g) || []).length;
const forbidden = /data-slot="page-state"[^>]*forbidden|kind="forbidden"/.test(html);
const redirect = (html.match(/NEXT_REDIRECT;[a-z]*;([^;?]*)/) || [])[1] || "";
const markup = short(html.replace(/<script[\s\S]*?<\/script>/g, ""));
console.log(JSON.stringify({ redirect, roles, rows, edge, forbidden, markup }));' "$@"
}
fetch_signed() { # $1 query, $2 out file; prints status
  curl -s -o "$2" -w '%{http_code}' --max-time 60 -H @"$TMP/cookie" "$BASE/inventory${1:+?$1}"
}
st="$(fetch_signed "" "$TMP/plain.html")"
[ "$st" = 200 ] || red "co-phien /inventory: trả $st"
plain_sig="$(signal_of "$TMP/plain.html" "")"
echo "co-phien /inventory: $plain_sig"
grep -q "\"redirect\":\"\"" <<<"$plain_sig" || red "co-phien /inventory: phiên tự ký vẫn bị chuyển đi"
grep -q "$PERSON_ROLE" <<<"$plain_sig" || red "co-phien /inventory: không thấy vai $PERSON_ROLE của phiên"
for p in "${PARAMS[@]}"; do
  st="$(fetch_signed "$p" "$TMP/p.html")"
  [ "$st" = 200 ] || red "co-phien ?$p: trả $st"
  sig="$(signal_of "$TMP/p.html" "$p")"
  [ "$sig" = "$plain_sig" ] || red "co-phien ?$p: '$sig', không tham số là '$plain_sig'"
  do_ "co-phien-?$p-giong-khong-tham-so"
done

# ---------------------------------------------------------------- 8. the same build connected as a table owner
stop "$PROD_PID"
# 8a. As the owner itself: the start-up check refuses, naming DATABASE_URL (the app never reaches the database).
OPORT="$(free_port)"
prod_env DATABASE_URL="$OWNER_URL" node "$NEXT_BIN" start -p "$OPORT" -H 127.0.0.1 >"$TMP/owner.log" 2>&1 &
OWN_PID=$!
PIDS+=("$OWN_PID")
wait_up "http://127.0.0.1:$OPORT/api/v1/health" "$OWN_PID" 60
rc=$?
grep -q DATABASE_URL "$TMP/owner.log" || { tail -5 "$TMP/owner.log"; red "vai-chu: khởi động không gọi tên DATABASE_URL"; }
if grep -q "local-only@" "$TMP/owner.log"; then red "vai-chu: nhật ký khởi động in địa chỉ"; fi
if [ "$rc" = 0 ]; then
  # The process stays up after the start-up check threw: it must not serve. Health and a page both refuse.
  hc="$(curl -s -o "$TMP/owner-h.json" -w '%{http_code}' --max-time 20 "http://127.0.0.1:$OPORT/api/v1/health")"
  pc="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "http://127.0.0.1:$OPORT/login")"
  if [ "$hc" = 200 ] || grep -q '"ok":true' "$TMP/owner-h.json"; then red "vai-chu: nối bằng vai chủ mà sức khoẻ trả $hc"; fi
  [ "$pc" = 500 ] || red "vai-chu: nối bằng vai chủ mà /login trả $pc"
  echo "vai-chu: kiểm khởi động gọi tên DATABASE_URL; tiến trình còn sống nhưng sức khoẻ trả $hc, /login trả $pc"
else
  echo "vai-chu: kiểm khởi động gọi tên DATABASE_URL; máy chủ không lên"
fi
stop "$OWN_PID"
do_ "vai-chu-khong-khoi-dong-goi-ten-DATABASE_URL"
# 8b. The login role made owner of a company table, on this run's database only: the start-up check passes (the name
# is right), and the door judges the role — health answers ok false with the door's own reason.
psql_owner -c "alter table public.companies owner to quy_hang_login" >/dev/null || red "vai-chu: không đổi được chủ bảng"
prod_env DATABASE_URL="$LOGIN_URL" node "$NEXT_BIN" start -p "$OPORT" -H 127.0.0.1 >"$TMP/owner2.log" 2>&1 &
OWN2_PID=$!
PIDS+=("$OWN2_PID")
wait_up "http://127.0.0.1:$OPORT/login" "$OWN2_PID" 90 || { tail -5 "$TMP/owner2.log"; red "vai-chu: next start không lên"; }
code="$(curl -s -o "$TMP/owner-health.json" -w '%{http_code}' --max-time 20 "http://127.0.0.1:$OPORT/api/v1/health")"
why="$(health_check "$(cat "$TMP/owner-health.json")" false "$HEAD" staging "cửa từ chối vai nối quy_hang_login: về được vai chủ")"
[ -z "$why" ] && [ "$code" = 503 ] || red "vai-chu: sức khoẻ $code — $why"
echo "vai-chu: $(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).vai)' "$TMP/owner-health.json")"
stop "$OWN2_PID"
do_ "vai-chu-bang-suc-khoe-ok-false-ly-do-cua"

# ---------------------------------------------------------------- 7. positive control on a dev server
# Same tree, `next dev`, no database: the sample company, where the switches exist. At least one ?role= and one
# /proto/<slug> must have an effect, else the checks above prove nothing.
DPORT="$(free_port)"
DBASE="http://127.0.0.1:$DPORT"
env -i PATH="$PATH" HOME="$HOME" TMPDIR="${TMPDIR:-/tmp}" NEXT_TELEMETRY_DISABLED=1 \
  NEXT_DIST_DIR="$WORK/dev" NEXT_TSCONFIG="$WORK/tsconfig.json" \
  node "$NEXT_BIN" dev -p "$DPORT" -H 127.0.0.1 >"$TMP/dev.log" 2>&1 &
DEV_PID=$!
PIDS+=("$DEV_PID")
wait_up "$DBASE/login" "$DEV_PID" 180 || { tail -10 "$TMP/dev.log"; red "doi-chung: next dev không lên"; }
proto_hit=""
for slug in "${PROTO_SLUGS[@]}"; do
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 120 "$DBASE/proto/$slug")"
  if [ "$code" = 200 ]; then proto_hit="$slug"; break; fi
done
[ -n "$proto_hit" ] || red "doi-chung: không /proto/<slug> nào mở được trên máy dev"
do_ "doi-chung-dev-proto/$proto_hit-200"
curl -s -o "$TMP/dev-plain.html" --max-time 120 "$DBASE/inventory"
dev_plain="$(signal_of "$TMP/dev-plain.html" "")"
vai_hit=""
for v in "${ROLES[@]}"; do
  curl -s -o "$TMP/dev-vai.html" --max-time 120 "$DBASE/inventory?role=$v"
  sig="$(signal_of "$TMP/dev-vai.html" "role=$v")"
  if [ "$sig" != "$dev_plain" ] && grep -q "$v" <<<"$sig"; then vai_hit="$v"; break; fi
done
[ -n "$vai_hit" ] || red "doi-chung: không ?role= nào đổi được trang trên máy dev ('$dev_plain')"
echo "doi-chung /inventory: $dev_plain"
echo "doi-chung ?role=$vai_hit: $sig"
do_ "doi-chung-dev-?role=$vai_hit-co-tac-dung"
stop "$DEV_PID"

echo "ban-dung-that: $N phép kiểm đạt"
