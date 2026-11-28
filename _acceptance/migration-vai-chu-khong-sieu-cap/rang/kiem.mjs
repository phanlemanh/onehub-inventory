#!/usr/bin/env node
// Phép đo của hồ sơ migration-vai-chu-khong-sieu-cap (PR #135, quyết định 0052), viết trước khi chấm.
//
//   node _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs --pg 17          # mọi ca trên postgres:17
//   node _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs --pg 16          # cùng các ca trên postgres:16
//   node _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs --pg 17 --tu-kiem  # các bản phá phải đỏ
//
// Mỗi lần chạy dựng MỘT cụm Postgres riêng (container tên mcksc-<pid>, không phải onehub-inventory-db-*), vì vai thuộc
// cả cụm. Vai chủ giả Supabase: LOGIN NOSUPERUSER CREATEROLE CREATEDB BYPASSRLS — đúng bốn thuộc tính đọc được của
// `postgres` trên bản thử ngày 28/11/2026. Migration chạy bằng db/scripts/migrate.sh qua PSQL, như lệnh đưa bản lên.
//
// Ca, theo thứ tự chạy (thứ tự có nghĩa: chỉ vai đã tạo quy_hang_identity mới cấp được nó):
//   doi-chung      — thiếu 001_vai_chu_khong_sieu_cap.sql và 004_thu_quyen_tao_cua_vai_danh_tinh.sql: dừng ở 002 với
//                    «must be able to SET ROLE "quy_hang_identity"», và cụm chưa có vai danh tính (giao dịch đã huỷ)
//   noi-ban-thu    — như bản thử: chỉ 001_nen_cong_ty.sql đã áp, rồi chạy lại đủ: áp nốt mọi tệp còn lại
//   du-migration   — cơ sở mới, vai chủ áp đủ; sổ schema_migrations bằng danh sách tệp
//   giong-sieu-vai — trạng thái cuối của hai cơ sở trên bằng bản siêu vai, trừ tên chủ; vai danh tính không giữ CREATE
//                    (chủ và quyền của bảng, view, chuỗi, hàm, kiểu, schema, và mọi quyền mặc định)
//   vai-giong-sieu-vai — thuộc tính của mọi vai quy_hang_* và mọi thành viên nhắc tới chúng bằng một cụm thứ hai chỉ
//                    siêu vai chạy migration; riêng vai chủ giữ đúng mức khai: ADMIN không SET không INHERIT trên mỗi
//                    vai nó tạo (mặc định của Postgres 16+), và SET + INHERIT trên quy_hang_identity (001_vai)
//   da-ap-tu-truoc — siêu vai đã áp mọi tệp cũ; chạy lại thì đúng hai tệp mới áp, ở cuối, theo thứ tự 001 rồi 004, và
//                    trạng thái cuối bằng bản siêu vai
//   cach-ly-dich   — db/scripts/cach-ly-dich.sh xanh với vai chủ ấy
//
// --tu-kiem: vật lành xanh, rồi ba bản phá phải đỏ với thông điệp ghim — thiếu 004 («vai danh tính còn quyền CREATE»),
// thêm một tệp chỉ cấp quyền khi vai không siêu cấp («trạng thái cuối lệch bản siêu vai»), thiếu 001_vai khi vai danh
// tính đã có («permission denied for schema app» ở 002 — nửa còn lại của 001; nửa SET ROLE là ca doi-chung), thêm
// một tệp chỉ cấp thêm thành viên vai khi vai không siêu cấp («vai lệch bản siêu vai»).
//
// Không đo ở đây: db/scripts/cach-ly.sh (bộ dựng cơ sở nháp của máy dãy và CI) cần siêu vai — các ca của nó tự
// `set local role quy_hang_app`, mà vai chủ không siêu cấp chỉ có ADMIN trên vai ấy (đo 28/11: 21/38 ca). Lệnh đưa bản
// lên không chạy bộ ấy; nó chạy cach-ly-dich.sh, ca cach-ly-dich.
import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const MIGRATIONS = join(ROOT, "db/migrations");
const OWNER = "chu_nhu_supabase";
const NEW = ["001_vai_chu_khong_sieu_cap.sql", "004_thu_quyen_tao_cua_vai_danh_tinh.sql"];
const FILES = readdirSync(MIGRATIONS)
  .filter((f) => /^\d{3}_.*\.sql$/.test(f))
  .sort();

const args = process.argv.slice(2);
const pg = args[args.indexOf("--pg") + 1];
const tuKiem = args.includes("--tu-kiem");
if (!args.includes("--pg") || !["16", "17"].includes(pg)) {
  console.error("cách dùng: kiem.mjs --pg 16|17 [--tu-kiem]");
  process.exit(2);
}
const IMAGE = `postgres:${pg}`;
const MAIN = `mcksc-${pg}-${process.pid}`;
let C = MAIN;
const containers = [];

function run(cmd, argv, opts = {}) {
  return spawnSync(cmd, argv, { encoding: "utf8", ...opts });
}
function must(cmd, argv, opts) {
  const r = run(cmd, argv, opts);
  if (r.status !== 0) throw new Error(`${cmd} ${argv.join(" ")} → ${r.status}: ${r.stderr}`);
  return r.stdout;
}
const psql = (role, db, sql) =>
  must("docker", ["exec", "-i", C, "psql", "-h", "127.0.0.1", "-U", role, "-d", db, "-v", "ON_ERROR_STOP=1", "-X", "-q", "-A", "-t"], {
    input: sql,
  });

/** Copies the migrations minus `skip`, plus `extra` ({name: sql}), into a new folder. */
function dirOf(skip = [], extra = {}, only = null) {
  const d = mkdtempSync(join(tmpdir(), "mcksc-mig-"));
  for (const f of FILES) if (!skip.includes(f) && (!only || only.includes(f))) cpSync(join(MIGRATIONS, f), join(d, f));
  for (const [n, s] of Object.entries(extra)) writeFileSync(join(d, n), s);
  return d;
}
function migrate(db, role, dir) {
  const r = run("bash", [join(ROOT, "db/scripts/migrate.sh"), db], {
    env: { ...process.env, PSQL: `docker exec -i ${C} psql -h 127.0.0.1 -U ${role}`, MIGRATIONS_DIR: dir },
  });
  return r;
}
function createDb(db, owner) {
  psql("postgres", "postgres", `create database ${db} owner ${owner};`);
}

const END_STATE = `select line from (
 select 'fn ' || p.oid::regprocedure::text || ' ' || pg_get_userbyid(p.proowner) || ' ' || coalesce(p.proacl::text, '') as line
   from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname in ('public', 'app', 'identity')
 union all
 select 'rel ' || format('%I.%I', n.nspname, c.relname) || ' ' || pg_get_userbyid(c.relowner) || ' ' || coalesce(c.relacl::text, '')
   from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname in ('public', 'app', 'identity') and c.relkind in ('r', 'p', 'v', 'm', 'S')
 union all
 select 'schema ' || nspname || ' ' || pg_get_userbyid(nspowner) || ' ' || coalesce(nspacl::text, '')
   from pg_namespace where nspname in ('public', 'app', 'identity')
 union all
 select 'type ' || format('%I.%I', n.nspname, t.typname) || ' ' || pg_get_userbyid(t.typowner) || ' ' || coalesce(t.typacl::text, '')
   from pg_type t join pg_namespace n on n.oid = t.typnamespace
  where n.nspname in ('public', 'app', 'identity') and t.typelem = 0
    and (t.typtype in ('d', 'e', 'r', 'm') or (t.typtype = 'c' and (select relkind from pg_class where oid = t.typrelid) = 'c'))
 union all
 select 'default ' || defaclobjtype::text || ' ' || pg_get_userbyid(defaclrole) || ' ' || defaclacl::text from pg_default_acl
) s order by 1;`;
function endState(db, owner) {
  const re = new RegExp(`\\b${owner}\\b`, "g");
  return psql("postgres", db, END_STATE)
    .split("\n")
    .filter(Boolean)
    .map((l) => l.replace(re, "OWNER"));
}
/** Pinned red line when `db` (owned by `owner`) differs from the superuser reference. */
function sameAsSuper(db, owner, ref) {
  const mine = endState(db, owner);
  const a = new Set(mine);
  const b = new Set(ref);
  const diff = [...mine.filter((l) => !b.has(l)).map((l) => `+ ${l}`), ...ref.filter((l) => !a.has(l)).map((l) => `- ${l}`)];
  const creates = mine.filter((l) => /quy_hang_identity=\w*C/.test(l));
  const defaults = mine.filter((l) => l.startsWith("default "));
  const errs = [];
  if (diff.length) errs.push(`trạng thái cuối lệch bản siêu vai: ${db} (${diff.length} dòng)\n  ${diff.slice(0, 8).join("\n  ")}`);
  if (creates.length) errs.push(`vai danh tính còn quyền CREATE: ${creates.join(" | ")}`);
  if (defaults.length) errs.push(`còn quyền mặc định: ${defaults.join(" | ")}`);
  return { errs, lines: mine.length };
}
// Roles a migration makes (quy_hang_*): attributes, and every membership that names one of them. Cluster-wide, so the
// reference is a second cluster where only the superuser ran the migrations.
const ROLE_FACTS = `select line from (
 select 'role ' || rolname || ' super=' || rolsuper || ' inherit=' || rolinherit || ' createrole=' || rolcreaterole
        || ' createdb=' || rolcreatedb || ' login=' || rolcanlogin || ' replication=' || rolreplication
        || ' bypassrls=' || rolbypassrls as line
   from pg_roles where rolname like 'quy\\_hang\\_%'
 union all
 select 'member ' || r.rolname || ' <- ' || m.rolname || ' admin=' || a.admin_option || ' set=' || a.set_option
        || ' inherit=' || a.inherit_option
   from pg_auth_members a join pg_roles r on r.oid = a.roleid join pg_roles m on m.oid = a.member
  where r.rolname like 'quy\\_hang\\_%' or m.rolname like 'quy\\_hang\\_%'
) s order by 1;`;
const roleFacts = () => psql("postgres", "postgres", ROLE_FACTS).split("\n").filter(Boolean);
/**
 * What the owner may hold on the roles, and nothing else: Postgres 16+ gives a non-superuser creator ADMIN (no SET, no
 * INHERIT) on every role it creates; 001_vai_chu_khong_sieu_cap.sql adds SET and INHERIT on quy_hang_identity.
 */
function ownerMembersWanted(created) {
  const w = created.map((r) => `member ${r} <- ${OWNER} admin=true set=false inherit=false`);
  w.push(`member quy_hang_identity <- ${OWNER} admin=false set=true inherit=true`);
  return w.sort();
}
/** Pinned red lines when the main cluster's roles differ from the reference cluster's (`ref`). */
function rolesAsSuper(ref) {
  const mine = roleFacts();
  const own = mine.filter((l) => l.endsWith("") && l.includes(` <- ${OWNER} `));
  const rest = mine.filter((l) => !own.includes(l));
  const a = new Set(rest);
  const b = new Set(ref);
  const diff = [...rest.filter((l) => !b.has(l)).map((l) => `+ ${l}`), ...ref.filter((l) => !a.has(l)).map((l) => `- ${l}`)];
  const created = ref.filter((l) => l.startsWith("role ")).map((l) => l.split(" ")[1]);
  const want = ownerMembersWanted(created);
  const ownDiff = [...own.filter((l) => !want.includes(l)).map((l) => `+ ${l}`), ...want.filter((l) => !own.includes(l)).map((l) => `- ${l}`)];
  const errs = [];
  if (diff.length) errs.push(`vai lệch bản siêu vai (${diff.length} dòng)\n  ${diff.slice(0, 8).join("\n  ")}`);
  if (ownDiff.length) errs.push(`thành viên của vai chủ lệch mức khai (${ownDiff.length} dòng)\n  ${ownDiff.join("\n  ")}`);
  return { errs, lines: mine.length, own: own.length };
}
const applied = (db) => psql("postgres", db, "select name from public.schema_migrations order by name;").split("\n").filter(Boolean);

function startCluster(name = MAIN) {
  C = name;
  containers.push(C);
  run("docker", ["rm", "-f", C], { stdio: "ignore" });
  must("docker", ["run", "-d", "--rm", "--name", C, "-e", "POSTGRES_PASSWORD=local-only", IMAGE]);
  const deadline = Date.now() + 90_000;
  // The entrypoint's temporary server listens on no TCP port; wait for the final one over 127.0.0.1.
  for (;;) {
    const r = run("docker", ["exec", C, "psql", "-h", "127.0.0.1", "-U", "postgres", "-Atc", "select 1"]);
    if (r.status === 0 && r.stdout.trim() === "1") break;
    if (Date.now() > deadline) throw new Error(`cụm ${C} không lên sau 90 giây`);
    spawnSync("sleep", ["0.5"]);
  }
  psql("postgres", "postgres", `create role ${OWNER} login nosuperuser createrole createdb bypassrls;`);
  const ver = psql("postgres", "postgres", "show server_version;").trim();
  if (!ver.startsWith(`${pg}.`)) throw new Error(`cụm chạy Postgres ${ver}, không phải ${pg}`);
  return ver;
}

const dirs = [];
const D = (...a) => {
  const d = dirOf(...a);
  dirs.push(d);
  return d;
};

/** Role facts of a second cluster where only the superuser migrated; switches back to the main cluster. */
function referenceRoles() {
  const back = C;
  startCluster(`${MAIN}-ref`);
  try {
    createDb("sieu_vai", "postgres");
    const r = migrate("sieu_vai", "postgres", D());
    if (r.status !== 0) throw new Error(`siêu vai không áp được ở cụm đối chiếu: ${r.stderr}`);
    return roleFacts();
  } finally {
    run("docker", ["rm", "-f", C], { stdio: "ignore" });
    C = back;
  }
}

/** The superuser reference: every migration, database sieu_vai. Run after the owner created the roles. */
function reference() {
  createDb("sieu_vai", "postgres");
  const r = migrate("sieu_vai", "postgres", D());
  if (r.status !== 0) throw new Error(`siêu vai không áp được: ${r.stderr}`);
  return endState("sieu_vai", "postgres");
}

function cases() {
  const out = [];
  const ok = (name, detail) => out.push({ name, ok: true, detail });
  const bad = (name, msg) => out.push({ name, ok: false, msg });

  // doi-chung
  createDb("chu_thieu", OWNER);
  let r = migrate("chu_thieu", OWNER, D(NEW));
  const noRole = psql("postgres", "postgres", "select count(*) from pg_roles where rolname = 'quy_hang_identity';").trim() === "0";
  if (r.status !== 0 && r.stderr.includes('must be able to SET ROLE "quy_hang_identity"') && r.stderr.includes("lỗi khi áp 002_dang_nhap_ma_email.sql") && noRole)
    ok("doi-chung", "thiếu hai tệp: dừng ở 002 với must be able to SET ROLE \"quy_hang_identity\"");
  else bad("doi-chung", `đối chứng không dừng ở 002 như bản thử: exit ${r.status}, vai danh tính ${noRole ? "chưa có" : "đã có"}\n  ${r.stderr.trim().split("\n").slice(-3).join("\n  ")}`);

  // noi-ban-thu
  createDb("chu_noi", OWNER);
  r = migrate("chu_noi", OWNER, D([], {}, ["001_nen_cong_ty.sql"]));
  let r2 = migrate("chu_noi", OWNER, D());
  const want = FILES.length - 1;
  if (r.status === 0 && r2.status === 0 && r2.stdout.includes(`xong — ${want} migration mới`) && !/ERROR/.test(r2.stderr) && applied("chu_noi").join() === FILES.join())
    ok("noi-ban-thu", `chỉ 001_nen đã áp, chạy lại áp nốt ${want} tệp`);
  else bad("noi-ban-thu", `vai chủ không nối được từ trạng thái bản thử: exit ${r.status}/${r2.status}\n  ${(r.stderr + r2.stderr).trim().split("\n").slice(-3).join("\n  ")}`);

  // du-migration
  createDb("chu_du", OWNER);
  r = migrate("chu_du", OWNER, D());
  if (r.status === 0 && !/ERROR/.test(r.stderr) && applied("chu_du").join() === FILES.join())
    ok("du-migration", `vai chủ không siêu cấp áp đủ ${FILES.length} tệp`);
  else bad("du-migration", `vai chủ không áp đủ migration: exit ${r.status}\n  ${r.stderr.trim().split("\n").slice(-3).join("\n  ")}`);

  // giong-sieu-vai
  const ref = reference();
  const e1 = sameAsSuper("chu_du", OWNER, ref);
  const e2 = sameAsSuper("chu_noi", OWNER, ref);
  if (!e1.errs.length && !e2.errs.length) ok("giong-sieu-vai", `${e1.lines} dòng chủ và quyền bằng bản siêu vai, ở cả chu_du và chu_noi`);
  else bad("giong-sieu-vai", [...e1.errs, ...e2.errs].join("\n"));

  // vai-giong-sieu-vai
  const rv = rolesAsSuper(referenceRoles());
  if (!rv.errs.length) ok("vai-giong-sieu-vai", `${rv.lines - rv.own} dòng vai và thành viên bằng cụm chỉ siêu vai chạy; vai chủ giữ đúng ${rv.own} dòng đã khai`);
  else bad("vai-giong-sieu-vai", rv.errs.join("\n"));

  // da-ap-tu-truoc
  createDb("cu", "postgres");
  r = migrate("cu", "postgres", D(NEW));
  r2 = migrate("cu", "postgres", D());
  const lines = r2.stdout.trim().split("\n");
  const e3 = sameAsSuper("cu", "postgres", ref);
  const tail = applied("cu");
  if (r.status === 0 && r2.status === 0 && lines.join("|") === `đã áp ${NEW[0]}|đã áp ${NEW[1]}|xong — 2 migration mới` && tail.length === FILES.length && !e3.errs.length)
    ok("da-ap-tu-truoc", "đã áp 13 tệp cũ: chạy lại chỉ áp 001_vai rồi 004, trạng thái cuối không đổi");
  else bad("da-ap-tu-truoc", `cơ sở đã áp từ trước không nhận hai tệp mới đúng cách: exit ${r.status}/${r2.status}, in «${lines.join(" | ")}»${e3.errs.length ? "\n" + e3.errs.join("\n") : ""}`);

  // cach-ly-dich
  // The sample rows go in as the non-superuser owner, as the deploy writes as that owner.
  psql(OWNER, "chu_du", readFileSync(join(ROOT, "db/tests/vai-dang-nhap-mau.sql"), "utf8"));
  const url = (role) => `postgres://${role}@127.0.0.1:5432/chu_du`;
  r = run("bash", [join(ROOT, "db/scripts/cach-ly-dich.sh")], {
    env: { ...process.env, PSQL_DICH: `docker exec -i ${C} psql`, MIGRATE_DATABASE_URL: url(OWNER), LOGIN_DATABASE_URL: url("quy_hang_login") },
  });
  const last = r.stdout.trim().split("\n").at(-1) ?? "";
  if (r.status === 0 && r.stderr === "" && /^cach-ly-dich: \d+ ca đạt$/.test(last)) ok("cach-ly-dich", last);
  else bad("cach-ly-dich", `cach-ly-dich.sh đỏ với vai chủ không siêu cấp: exit ${r.status}, «${last}» ${r.stderr.trim()}`);

  return out;
}

/** Break copies: each must turn red with its pinned message. */
function breaks() {
  const out = [];
  // Roles first, as the owner (same order as the real cases), then the reference.
  createDb("pha_dung", OWNER);
  if (migrate("pha_dung", OWNER, D()).status !== 0) throw new Error("vật lành không áp được trong tự kiểm");
  const ref = reference();
  const refRoles = referenceRoles();
  const lanh = [...sameAsSuper("pha_dung", OWNER, ref).errs, ...rolesAsSuper(refRoles).errs];
  out.push({ name: "vat-lanh", ok: lanh.length === 0, msg: lanh.join("\n") || "vật lành xanh" });

  const tryBreak = (name, db, dir, pinned, roles = false) => {
    createDb(db, OWNER);
    const r = migrate(db, OWNER, dir);
    if (roles && r.status === 0) {
      const msg = rolesAsSuper(refRoles).errs.join("\n");
      out.push({ name, ok: msg.includes(pinned), msg: msg || "(xanh — thước không bắt)" });
      return;
    }
    const msg = r.status !== 0 ? `vai chủ dừng: ${(r.stderr.split("\n").find((l) => /ERROR/.test(l)) ?? "").trim()} · ${r.stderr.trim().split("\n").at(-1)}` : sameAsSuper(db, OWNER, ref).errs.join("\n");
    out.push({ name, ok: msg.includes(pinned), msg: msg || "(xanh — thước không bắt)" });
  };
  tryBreak("pha-thieu-004", "pha_thieu_004", D([NEW[1]]), "vai danh tính còn quyền CREATE");
  tryBreak(
    "pha-quyen-chi-khi-khong-sieu",
    "pha_quyen",
    D([], { "015_pha.sql": "do $$ begin if not (select rolsuper from pg_roles where rolname = current_user) then grant usage on schema app to public; end if; end $$;" }),
    "trạng thái cuối lệch bản siêu vai",
  );
  // Roles already exist here and the owner already may SET to quy_hang_identity (vat-lanh ran 001): without 001 the
  // other half — CREATE lent on schema app — is missing, so 002 stops on it. The SET ROLE half is the control case.
  tryBreak("pha-thieu-001-vai-khi-da-co-vai", "pha_thieu_001", D([NEW[0]]), "permission denied for schema app");
  // Last: a membership is cluster-wide, so this break must not run before any other measure.
  tryBreak(
    "pha-them-thanh-vien",
    "pha_thanh_vien",
    D([], { "015_pha.sql": "do $$ begin if not (select rolsuper from pg_roles where rolname = current_user) then grant quy_hang_identity to quy_hang_login; end if; end $$;" }),
    "vai lệch bản siêu vai",
    true,
  );
  return out;
}

let code = 0;
try {
  const ver = startCluster();
  const res = tuKiem ? breaks() : cases();
  for (const c of res) {
    if (c.ok) console.log(`ok ${c.name}${c.detail ? ` — ${c.detail}` : tuKiem ? ` — ${c.msg.split("\n")[0]}` : ""}`);
    else {
      console.log(`DO ${c.name}: ${c.msg}`);
      code = 1;
    }
  }
  const n = res.filter((c) => c.ok).length;
  console.log(tuKiem ? `tu-kiem: ${n}/${res.length} ca đúng (postgres ${ver})` : `kiem: ${n}/${res.length} ca đạt (postgres ${ver})`);
} catch (err) {
  console.error(`kiem: không chạy được — ${err.message}`);
  code = 2;
} finally {
  for (const c of containers) run("docker", ["rm", "-f", c], { stdio: "ignore" });
  for (const d of dirs) rmSync(d, { recursive: true, force: true });
}
process.exit(code);
