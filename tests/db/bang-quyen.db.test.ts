// Permission table in the database (row 9a, _acceptance/bang-quyen-theo-vai/evals.yaml E4, E6, E7, E10, E11, E13). Every
// call goes through the door under the API role. Each check returns its failures as pinned lines, so the same check
// runs on a clean scratch database (no failure) and on a broken one (the pinned line).
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { ACTIONS, PERMISSION_EXEMPT, type ActionSpec, type Role } from "@/generated/ontology";
import { sampleCatalog } from "@/modules/catalog";
import { catalogLoadStatements } from "@/modules/catalog/load-sql";
import type { DbClient } from "@/modules/identity/with-company";

import {
  asPerson,
  doorScope,
  dropWorld,
  liveRows,
  ROLE_OF,
  world,
  type Person,
  type World,
} from "./bang-quyen-world";

const worlds: World[] = [];
async function make(suffix: string, breakFile?: string, upTo?: number): Promise<World> {
  const w = await world(suffix, breakFile, upTo);
  worlds.push(w);
  return w;
}
afterEach(async () => {
  for (const w of worlds.splice(0)) await dropWorld(w);
});

const FOUR = ["LA", "BA", "TL", "CA"] as const;
type Seen = "company" | "own" | null;
// Written before the code (evals.yaml): 10 database doors × 4 roles, plus row 7d's 8 doors × 4 roles (five catalog
// tables read; company codes read, add, change) — 40 + 32; plus row 2c's 4 saved-view doors × 4 roles — 16.
const DB_CELLS = 88;
// Written before the code (evals.yaml): the exempt database doors.
const EXEMPT_DB = [
  "function app.current_company_id()",
  "function app.allowed(text)",
  "function app.login_request_code(text, text, integer, integer, integer)",
  "function app.login_verify_code(text, text, text, integer, integer)",
  "function app.session_read(text, integer, integer)",
  "function app.session_companies(text)",
  "function app.session_set_company(text, uuid)",
  "function app.session_end(text)",
];

const code = (err: unknown) => (err as { code?: string }).code;

// Row 7d: the shared catalog and one company code in A and one in B, loaded once per world by the owner.
const catalogs = new WeakMap<World, Promise<{ unit: string; codeA: string }>>();
function catalogFixture(w: World): Promise<{ unit: string; codeA: string }> {
  let p = catalogs.get(w);
  if (!p) {
    p = (async () => {
      const c = sampleCatalog();
      for (const s of catalogLoadStatements(c)) await w.db.owner.query(s.text, s.values);
      const unit = c.units[0]!.unitKey;
      const add = (company: string) =>
        w.db.owner.query(
          "insert into company_catalog_aliases (company_id, unit_key, kind, value) values ($1, $2, 'ma', 'SA5-12.08') returning id",
          [company, unit],
        );
      const codeA = ((await add(w.A)).rows[0] as { id: string }).id;
      await add(w.B);
      return { unit, codeA };
    })();
    catalogs.set(w, p);
  }
  return p;
}

/** Reads one shared catalog table: every role reads it, a role without the cell gets permission denied. */
const readShared = (w: World, who: Person, table: string) =>
  catalogFixture(w).then(() =>
    asPerson(w, who, w.A, async (c) => {
      try {
        const { rows } = await c.query(`select count(*)::int as n from ${table}`);
        return ((rows[0] as { n: number }).n > 0 ? "company" : "?0") as Seen;
      } catch (err) {
        if (code(err) === "42501") return null;
        throw err;
      }
    }),
  );

// Row 2c: one saved view per person of A (X too) and one of Y in B, loaded once per world by the owner.
const views = new WeakMap<World, Promise<Record<string, string>>>();
function viewFixture(w: World): Promise<Record<string, string>> {
  let p = views.get(w);
  if (!p) {
    p = (async () => {
      const ids: Record<string, string> = {};
      for (const [who, company] of [
        ["LA", w.A],
        ["BA", w.A],
        ["TL", w.A],
        ["CA", w.A],
        ["X", w.A],
        ["Y", w.B],
      ] as const) {
        const { rows } = await w.db.owner.query<{ id: string }>(
          `insert into saved_view (company_id, user_id, screen, name, view)
           values ($1, $2, 'inventory', 'Của ' || $3, '{"query":"","filters":{},"sort":[],"grouped":false,"hidden":[]}')
           returning id`,
          [company, w.id[who], who],
        );
        ids[who] = rows[0]!.id;
      }
      return ids;
    })();
    views.set(w, p);
  }
  return p;
}

/** Someone else of A than `who`, whose saved view `who` must not touch. */
const otherOf = (who: Person): Person => (who === "LA" ? "BA" : "LA");

/** A saved-view write: own when one's own row goes through and another's does not, company when both do. */
async function viewWrite(
  w: World,
  who: Person,
  write: (c: DbClient, ownerId: string, viewId: string) => Promise<number>,
): Promise<Seen> {
  const ids = await viewFixture(w);
  const tryOne = (target: Person) =>
    asPerson(w, who, w.A, async (c) => {
      try {
        return await write(c, w.id[target], ids[target]!);
      } catch (err) {
        if (code(err) === "42501") return 0;
        throw err;
      }
    });
  const own = await tryOne(who);
  const other = await tryOne(otherOf(who));
  return (own === 1 ? (other === 1 ? "company" : "own") : other === 1 ? "?" : null) as Seen;
}

/** What one person gets at one database door, read the way the door works. */
async function observe(w: World, who: Person, door: string): Promise<Seen> {
  const A = w.A;
  switch (door) {
    case "function app.member_roles()":
      return asPerson(w, who, A, async (c) => {
        const { rows } = await c.query("select app.member_roles() as r");
        return ((rows[0] as { r: string[] }).r.length > 0 ? "own" : null) as Seen;
      });
    case "function app.member_list()":
      return asPerson(w, who, A, async (c) => {
        try {
          await c.query("select * from app.member_list()");
          return "company" as Seen;
        } catch (err) {
          if (code(err) === "42501") return null;
          throw err;
        }
      });
    case "function app.member_invite(text, text, text[])":
      return asPerson(w, who, A, async (c) => {
        const { rows } = await c.query(
          "select status from app.member_invite('moi@example.test', '[Tên] Mới', '{ListAgent}')",
        );
        const s = (rows[0] as { status: string }).status;
        return (s === "ok" ? "company" : s === "forbidden" ? null : `?${s}`) as Seen;
      });
    case "function app.member_set_roles(uuid, text[])":
      return asPerson(w, who, A, async (c) => {
        const { rows } = await c.query("select app.member_set_roles($1, '{ListAgent}') as s", [
          w.id.LA,
        ]);
        const s = (rows[0] as { s: string }).s;
        return (s === "ok" ? "company" : s === "forbidden" ? null : `?${s}`) as Seen;
      });
    case "table companies select":
      return asPerson(w, who, A, async (c) => {
        const { rows } = await c.query("select id from companies");
        return (
          rows.length === 1 && (rows[0] as { id: string }).id === A
            ? "company"
            : rows.length === 0
              ? null
              : "?"
        ) as Seen;
      });
    case "table company_members select":
      return asPerson(w, who, A, async (c) => {
        const { rows } = await c.query("select user_id, company_id from company_members");
        const r = rows as { user_id: string; company_id: string }[];
        if (r.some((x) => x.company_id !== A)) return "?" as Seen;
        if (r.length === 5) return "company" as Seen;
        if (r.length === 1 && r[0]!.user_id === w.id[who]) return "own" as Seen;
        return (r.length === 0 ? null : `?${r.length}`) as Seen;
      });
    case "table agreements select":
      return asPerson(w, who, A, async (c) => {
        const { rows } = await c.query("select id from agreements where company_id = $1", [A]);
        return (rows.length === 1 ? "company" : rows.length === 0 ? null : "?") as Seen;
      });
    case "table agreements insert":
      return asPerson(w, who, A, async (c) => {
        try {
          await c.query(
            `insert into agreements (company_id, kind, direction, counterparty, data_classes, valid_from, approved_by)
             values ($1, 'spreadsheet', 'inbound', 'bảng mẫu', '{catalog}', now(), '[Tên]')`,
            [A],
          );
          return "company" as Seen;
        } catch (err) {
          if (code(err) === "42501") return null;
          throw err;
        }
      });
    case "table agreements update":
      return asPerson(w, who, A, async (c) => {
        const r = await c.query("update agreements set status = 'paused' where id = $1", [
          w.agreementA,
        ]);
        return (r.rowCount === 1 ? "company" : r.rowCount === 0 ? null : "?") as Seen;
      });
    case "table catalog_nodes select":
      return readShared(w, who, "catalog_nodes");
    case "table catalog_buildings select":
      return readShared(w, who, "catalog_buildings");
    case "table catalog_stacks select":
      return readShared(w, who, "catalog_stacks");
    case "table catalog_units select":
      return readShared(w, who, "catalog_units");
    case "table catalog_aliases select":
      return readShared(w, who, "catalog_aliases");
    case "table company_catalog_aliases select":
      await catalogFixture(w);
      return asPerson(w, who, A, async (c) => {
        const { rows } = await c.query("select company_id from company_catalog_aliases");
        const r = rows as { company_id: string }[];
        if (r.some((x) => x.company_id !== A)) return "?" as Seen;
        return (r.length === 1 ? "company" : r.length === 0 ? null : `?${r.length}`) as Seen;
      });
    case "table company_catalog_aliases insert": {
      const { unit } = await catalogFixture(w);
      return asPerson(w, who, A, async (c) => {
        try {
          await c.query(
            "insert into company_catalog_aliases (company_id, unit_key, kind, value) values ($1, $2, 'ma', 'SA5-12.09')",
            [A, unit],
          );
          return "company" as Seen;
        } catch (err) {
          if (code(err) === "42501") return null;
          throw err;
        }
      });
    }
    case "table company_catalog_aliases update": {
      const { codeA } = await catalogFixture(w);
      return asPerson(w, who, A, async (c) => {
        const r = await c.query(
          "update company_catalog_aliases set value = 'SA5-12.10' where id = $1",
          [codeA],
        );
        return (r.rowCount === 1 ? "company" : r.rowCount === 0 ? null : "?") as Seen;
      });
    }
    // Row 2c: the saved view table; each person keeps to their own views.
    case "table saved_view select": {
      await viewFixture(w);
      return asPerson(w, who, A, async (c) => {
        const { rows } = await c.query("select user_id, company_id from saved_view");
        const r = rows as { user_id: string; company_id: string }[];
        if (r.some((x) => x.company_id !== A)) return "?" as Seen;
        if (r.length === 5) return "company" as Seen;
        if (r.length === 1 && r[0]!.user_id === w.id[who]) return "own" as Seen;
        return (r.length === 0 ? null : `?${r.length}`) as Seen;
      });
    }
    case "table saved_view insert":
      return viewWrite(
        w,
        who,
        async (c, ownerId) =>
          (
            await c.query(
              `insert into saved_view (company_id, user_id, screen, name, view)
             values ($1, $2, 'inventory', 'Mới', '{"query":"","filters":{},"sort":[],"grouped":false,"hidden":[]}')`,
              [A, ownerId],
            )
          ).rowCount ?? 0,
      );
    case "table saved_view update":
      return viewWrite(
        w,
        who,
        async (c, _ownerId, viewId) =>
          (await c.query("update saved_view set name = 'Đổi' where id = $1", [viewId])).rowCount ??
          0,
      );
    case "table saved_view delete":
      return viewWrite(
        w,
        who,
        async (c, _ownerId, viewId) =>
          (await c.query("delete from saved_view where id = $1", [viewId])).rowCount ?? 0,
      );
    default:
      throw new Error(`csdl-theo-bang: không biết đo cửa ${door}`);
  }
}

/** Every live database door × every role of A, and X with a session in A like a ListAgent. */
async function checkDbCells(
  w: World,
  table: readonly ActionSpec[],
): Promise<{ matched: number; total: number; failures: string[] }> {
  const failures: string[] = [];
  let matched = 0;
  let total = 0;
  const seen = new Map<string, Seen>();
  const look = async (who: Person, door: string) => {
    const key = `${who}|${door}`;
    if (!seen.has(key)) seen.set(key, await observe(w, who, door));
    return seen.get(key)!;
  };
  for (const a of liveRows(table)) {
    for (const door of a.doors.db) {
      for (const who of FOUR) {
        total += 1;
        const want = doorScope(table, door, ROLE_OF[who], "db");
        const got = await look(who, door);
        if (got === want) matched += 1;
        else
          failures.push(
            `csdl-theo-bang: ${a.name} × ${ROLE_OF[who]} (cửa ${door}: muốn ${want}, thấy ${got})`,
          );
      }
      const x = await look("X", door);
      const la = doorScope(table, door, "ListAgent", "db");
      if (x !== la)
        failures.push(`csdl-theo-bang: X × ${a.name} (cửa ${door}: muốn ${la}, thấy ${x})`);
    }
  }
  return { matched, total, failures };
}

/** The table with one cell changed: inviteMember × TeamLead allowed company-wide. */
const changedCell: readonly ActionSpec[] = ACTIONS.map((a) =>
  a.name === "inviteMember" ? { ...a, scope: { ...a.scope, TeamLead: "company" as const } } : a,
);

describe("csdl-theo-bang", () => {
  it("every database door × every role matches its cell", async () => {
    const w = await make("csdl");
    const r = await checkDbCells(w, ACTIONS);
    console.log(`csdl-theo-bang: ${r.matched}/${r.total} ô khớp`);
    expect(r.failures).toEqual([]);
    expect(r.total).toBe(DB_CELLS);
    expect(r.matched).toBe(DB_CELLS);
  });

  it("break pha-thu-doi-o: one cell changed in a copy of the table names it", async () => {
    const w = await make("csdl_doi_o");
    const r = await checkDbCells(w, changedCell);
    expect(r.failures.map((f) => f.split(" (")[0])).toEqual([
      "csdl-theo-bang: inviteMember × TeamLead",
    ]);
  });

  it("break pha-thu-allowed-moi-san: roles of every company leak into A", async () => {
    const w = await make("csdl_moi_san", "allowed-moi-san");
    const r = await checkDbCells(w, ACTIONS);
    expect(r.failures.map((f) => f.split(" (")[0])).toContain("csdl-theo-bang: X × listMembers");
  });
});

// ---- ban-chep-khop-bang: app.permissions is the live cells of the generated table

async function checkCopy(w: World): Promise<string[]> {
  const { rows } = await w.db.owner.query<{ action: string; role: string; scope: string }>(
    "select action, role, scope from app.permissions",
  );
  const db = new Set(rows.map((r) => `${r.action} × ${r.role} = ${r.scope}`));
  const gen = new Set(
    liveRows().flatMap((a) =>
      Object.entries(a.scope).map(([role, scope]) => `${a.name} × ${role} = ${scope}`),
    ),
  );
  return [
    ...[...gen]
      .filter((x) => !db.has(x))
      .map((x) => `ban-chep-khop-bang: thiếu ${x.split(" = ")[0]}`),
    ...[...db]
      .filter((x) => !gen.has(x))
      .map((x) => `ban-chep-khop-bang: thừa ${x.split(" = ")[0]}`),
  ];
}

describe("ban-chep-khop-bang", () => {
  it("the database copy has exactly the live cells", async () => {
    const w = await make("ban_chep");
    expect(await checkCopy(w)).toEqual([]);
  });

  it("break pha-thu-ban-chep-lech: a missing row is named", async () => {
    const w = await make("ban_chep_lech");
    await w.db.owner.query(
      "delete from app.permissions where action = 'listMembers' and role = 'CompanyAdmin'",
    );
    expect(await checkCopy(w)).toEqual(["ban-chep-khop-bang: thiếu listMembers × CompanyAdmin"]);
  });
});

// ---- quyen-csdl-ngoai-bang: every privilege of the API role is a door of the table or exempt

async function apiRolePrivileges(w: World): Promise<string[]> {
  const fns = await w.db.owner.query<{ door: string }>(`
    select format('function %s.%s(%s)', n.nspname, p.proname, oidvectortypes(p.proargtypes)) as door
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname in ('public', 'app', 'identity') and has_function_privilege('quy_hang_app', p.oid, 'EXECUTE')`);
  const tables = await w.db.owner.query<{ door: string }>(`
    select format('table %s %s', case when n.nspname = 'public' then c.relname::text else n.nspname || '.' || c.relname end,
                  lower(q)) as door
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    cross join unnest(array['SELECT', 'INSERT', 'UPDATE', 'DELETE']) q
    where n.nspname in ('public', 'app', 'identity') and c.relkind in ('r', 'p', 'v', 'm', 'f')
      and c.relname <> 'schema_migrations' and has_table_privilege('quy_hang_app', c.oid, q)`);
  return [...fns.rows, ...tables.rows].map((r) => r.door).sort();
}

function checkPrivileges(
  found: string[],
  table: readonly ActionSpec[],
  exempt: readonly { door: string; reads: readonly string[] }[],
): string[] {
  const failures: string[] = [];
  const exemptDb = exempt.filter((e) => /^(function|table) /.test(e.door));
  const want = [...EXEMPT_DB].sort();
  const have = exemptDb.map((e) => e.door).sort();
  if (JSON.stringify(want) !== JSON.stringify(have)) {
    const diff = [
      ...have.filter((d) => !want.includes(d)),
      ...want.filter((d) => !have.includes(d)),
    ];
    failures.push(
      `quyen-csdl-ngoai-bang: tập miễn khác tập viết trước: ${diff.map((d) => d.replace(/^function /, "").replace(/\(.*$/, "")).join(", ")}`,
    );
  }
  const declared = new Set([
    ...liveRows(table).flatMap((a) => a.doors.db),
    ...exemptDb.flatMap((e) => [e.door, ...e.reads]),
  ]);
  for (const door of found)
    if (!declared.has(door)) failures.push(`quyen-csdl-ngoai-bang: ${door}`);
  const real = new Set(found);
  for (const door of declared)
    if (!real.has(door)) failures.push(`quyen-csdl-ngoai-bang: khai mà không có: ${door}`);
  return failures;
}

describe("quyen-csdl-ngoai-bang", () => {
  it("every function and table privilege of the API role is in the table or exempt, and every declared door is real", async () => {
    const w = await make("quyen");
    const found = await apiRolePrivileges(w);
    console.log(`quyen-csdl-ngoai-bang: ${found.length} quyền của vai API`);
    expect(checkPrivileges(found, ACTIONS, PERMISSION_EXEMPT)).toEqual([]);
  });

  it("break pha-thu-mien-them: an extra exempt door is named", async () => {
    const w = await make("quyen_mien");
    const exempt = [
      ...PERMISSION_EXEMPT,
      { door: "function app.member_invite(text, text, text[])", reason: "x", reads: [] },
    ];
    expect(checkPrivileges(await apiRolePrivileges(w), ACTIONS, exempt)).toContain(
      "quyen-csdl-ngoai-bang: tập miễn khác tập viết trước: app.member_invite",
    );
  });

  it("break pha-thu-ham-moi: a new function the API role may run is named", async () => {
    const w = await make("quyen_ham");
    await w.db.owner.query(
      "create function app.thu_ghi() returns void language sql as $$ select $$",
    );
    await w.db.owner.query("grant execute on function app.thu_ghi() to quy_hang_app");
    expect(checkPrivileges(await apiRolePrivileges(w), ACTIONS, PERMISSION_EXEMPT)).toContain(
      "quyen-csdl-ngoai-bang: function app.thu_ghi()",
    );
  });

  it("break pha-thu-cap-insert: a new table privilege is named", async () => {
    const w = await make("quyen_insert");
    await w.db.owner.query("grant insert on companies to quy_hang_app");
    expect(checkPrivileges(await apiRolePrivileges(w), ACTIONS, PERMISSION_EXEMPT)).toEqual([
      "quyen-csdl-ngoai-bang: table companies insert",
    ]);
  });
});

// ---- quan-tri-nguoi-qua-bang: the people functions ask the table, and behave as before

async function checkPeopleFunctions(w: World): Promise<{ scanned: number; failures: string[] }> {
  const failures: string[] = [];
  const { rows } = await w.db.owner.query<{ name: string; def: string }>(`
    select p.proname as name, pg_get_functiondef(p.oid) as def
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname in ('app', 'identity') and has_function_privilege('quy_hang_app', p.oid, 'EXECUTE')`);
  for (const f of rows)
    if (/is_admin/.test(f.def))
      failures.push(`quan-tri-nguoi-qua-bang: ${f.name} còn kiểm vai tự viết`);
  for (const name of ["member_list", "member_invite", "member_set_roles"]) {
    const f = rows.find((r) => r.name === name);
    if (!f || !/app\.allowed\('/.test(f.def))
      failures.push(`quan-tri-nguoi-qua-bang: ${name} không hỏi bảng quyền`);
  }
  for (const door of [
    "function app.member_list()",
    "function app.member_invite(text, text, text[])",
    "function app.member_set_roles(uuid, text[])",
  ]) {
    if ((await observe(w, "CA", door)) !== "company")
      failures.push(`quan-tri-nguoi-qua-bang: Quản trị sàn bị từ chối ở ${door}`);
    if ((await observe(w, "LA", door)) !== null)
      failures.push(`quan-tri-nguoi-qua-bang: Đầu chủ được ${door}`);
  }
  return { scanned: rows.length, failures };
}

describe("quan-tri-nguoi-qua-bang", () => {
  it("no function the API role may run checks the admin role by itself; the three ask app.allowed and behave as before", async () => {
    const w = await make("quan_tri");
    const r = await checkPeopleFunctions(w);
    console.log(`quan-tri-nguoi-qua-bang: đã quét ${r.scanned} hàm`);
    expect(r.failures).toEqual([]);
    expect(r.scanned).toBe(12);
  });

  it("the rule of Member points at the permission table", () => {
    const yaml = readFileSync(join(process.cwd(), "ontology/entities/Member.yaml"), "utf8");
    const rule = yaml.split("- id: company-admin-manages-people")[1]?.split("- id:")[0] ?? "";
    expect(rule).toContain("implemented_in: db/migrations/006_bang_quyen_theo_vai.sql");
    expect(rule).toContain("ontology/actions.yaml");
  });

  it("break: member_invite back to its own role check is named", async () => {
    const w = await make("quan_tri_pha", "moi-kiem-vai-tu-viet");
    expect((await checkPeopleFunctions(w)).failures).toContain(
      "quan-tri-nguoi-qua-bang: member_invite còn kiểm vai tự viết",
    );
  });
});

// ---- bang-thanh-vien-chi-dong-minh: the members table read straight under the API role

async function checkMemberRows(w: World): Promise<string[]> {
  const failures: string[] = [];
  const rowsOf = (who: Person, company: string) =>
    asPerson(
      w,
      who,
      company,
      async (c) =>
        (await c.query("select user_id, company_id from company_members")).rows as {
          user_id: string;
          company_id: string;
        }[],
    );
  const want: [Person, string, number, string][] = [
    ["LA", w.A, 1, "ListAgent"],
    ["BA", w.A, 1, "BuyerAgent"],
    ["TL", w.A, 1, "TeamLead"],
    ["X", w.A, 1, "X"],
    ["CA", w.A, 5, "CompanyAdmin"],
    ["Y", w.B, 2, "Y"],
  ];
  for (const [who, company, n, label] of want) {
    const rows = await rowsOf(who, company);
    if (rows.some((r) => r.company_id !== company))
      failures.push(`bang-thanh-vien-chi-dong-minh: ${label} thấy dòng sàn khác`);
    else if (rows.length !== n || (n === 1 && rows[0]!.user_id !== w.id[who]))
      failures.push(`bang-thanh-vien-chi-dong-minh: ${label} thấy ${rows.length} dòng`);
  }
  return failures;
}

describe("bang-thanh-vien-chi-dong-minh", () => {
  it("each person reads their own row; the company admin reads the whole company; nobody reads another company", async () => {
    expect(await checkMemberRows(await make("thanh_vien"))).toEqual([]);
  });

  it("break pha-thu-doc-moi-dong: without the role condition a ListAgent reads every row", async () => {
    const w = await make("thanh_vien_pha");
    await w.db.owner.query("drop policy company_members_by_permission on company_members");
    expect(await checkMemberRows(w)).toContain(
      "bang-thanh-vien-chi-dong-minh: ListAgent thấy 5 dòng",
    );
  });
});

// ---- thoa-thuan-chi-quan-tri: only manageAgreements adds or changes an agreement

async function checkAgreements(w: World): Promise<string[]> {
  const failures: string[] = [];
  const label: Record<Person, string> = {
    LA: "ListAgent",
    BA: "BuyerAgent",
    TL: "TeamLead",
    CA: "CompanyAdmin",
    X: "X",
    Y: "Y",
  };
  for (const who of ["LA", "BA", "TL", "CA", "X"] as const) {
    const may = who === "CA";
    const add = await observe(w, who, "table agreements insert");
    const change = await observe(w, who, "table agreements update");
    if (may && add !== "company")
      failures.push(`thoa-thuan-chi-quan-tri: ${label[who]} không thêm được thoả thuận`);
    if (!may && add !== null)
      failures.push(`thoa-thuan-chi-quan-tri: ${label[who]} thêm được thoả thuận`);
    if (may && change !== "company")
      failures.push(`thoa-thuan-chi-quan-tri: ${label[who]} không sửa được thoả thuận`);
    if (!may && change !== null)
      failures.push(`thoa-thuan-chi-quan-tri: ${label[who]} sửa được thoả thuận`);
    const read = await observe(w, who, "table agreements select");
    const role: Role = who === "X" ? "ListAgent" : ROLE_OF[who];
    if (read !== doorScope(ACTIONS, "table agreements select", role, "db"))
      failures.push(`thoa-thuan-chi-quan-tri: ${label[who]} đọc thoả thuận khác ô readAgreements`);
  }
  const fromB = await asPerson(
    w,
    "Y",
    w.B,
    async (c) =>
      (await c.query("update agreements set status = 'paused' where id = $1", [w.agreementA]))
        .rowCount,
  );
  if (fromB !== 0)
    failures.push("thoa-thuan-chi-quan-tri: Quản trị sàn B sửa được thoả thuận của A");
  const { rows } = await w.db.owner.query<{ n: string; s: string }>(
    "select count(*) as n, max(status) as s from agreements where company_id = $1",
    [w.A],
  );
  if (rows[0]!.n !== "1" || rows[0]!.s !== "active")
    failures.push("thoa-thuan-chi-quan-tri: thoả thuận của A đã đổi");
  return failures;
}

describe("thoa-thuan-chi-quan-tri", () => {
  it("only the company admin adds and changes; reads follow readAgreements; another company changes nothing", async () => {
    expect(await checkAgreements(await make("thoa_thuan"))).toEqual([]);
  });

  it("break pha-thu-thoa-thuan-mo: without the role condition a ListAgent adds one", async () => {
    const w = await make("thoa_thuan_pha");
    await w.db.owner.query("drop policy agreements_insert_by_permission on agreements");
    expect(await checkAgreements(w)).toContain(
      "thoa-thuan-chi-quan-tri: ListAgent thêm được thoả thuận",
    );
  });
});

// ---- bang-quyen-dung-chung: a shared catalog the API role only reads; no new privileged function

async function secDefiners(w: World): Promise<string[]> {
  const { rows } = await w.db.owner.query<{ f: string }>(`
    select n.nspname || '.' || p.proname as f from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where p.prosecdef and n.nspname not in ('pg_catalog', 'information_schema') order by 1`);
  return rows.map((r) => r.f);
}

async function checkCatalog(w: World, before: string[]): Promise<string[]> {
  const failures: string[] = [];
  const q = async (sql: string) => (await w.db.owner.query<{ v: boolean }>(sql)).rows[0]!.v;
  if (
    await q(
      "select exists (select from pg_attribute where attrelid = 'app.permissions'::regclass and attname = 'company_id' and not attisdropped) as v",
    )
  )
    failures.push("bang-quyen-dung-chung: bảng quyền có company_id");
  if (!(await q("select has_table_privilege('quy_hang_app', 'app.permissions', 'SELECT') as v")))
    failures.push("bang-quyen-dung-chung: quy_hang_app không đọc được bảng quyền");
  if (
    await q(
      "select has_table_privilege('quy_hang_app', 'app.permissions', 'INSERT') or has_table_privilege('quy_hang_app', 'app.permissions', 'UPDATE') or has_table_privilege('quy_hang_app', 'app.permissions', 'DELETE') as v",
    )
  )
    failures.push("bang-quyen-dung-chung: quy_hang_app ghi được bảng quyền");
  if (
    await q(
      "select pg_has_role('quy_hang_app', relowner, 'MEMBER') as v from pg_class where oid = 'app.permissions'::regclass",
    )
  )
    failures.push("bang-quyen-dung-chung: quy_hang_app sở hữu bảng quyền");
  if (await q("select prosecdef as v from pg_proc where oid = 'app.allowed(text)'::regprocedure"))
    failures.push("bang-quyen-dung-chung: app.allowed chạy bằng quyền chủ hàm");
  if (
    !(await q(
      "select exists (select from pg_proc, unnest(proconfig) c where oid = 'app.allowed(text)'::regprocedure and c like 'search_path=%') as v",
    ))
  )
    failures.push("bang-quyen-dung-chung: app.allowed không ghim search_path");
  const after = await secDefiners(w);
  const added = after.filter((f) => !before.includes(f));
  if (added.length) failures.push(`bang-quyen-dung-chung: hàm vượt luật mới ${added.join(", ")}`);
  return failures;
}

describe("bang-quyen-dung-chung", () => {
  it("the permission table has no company_id, the API role only reads it, app.allowed runs as the caller, no new privileged function", async () => {
    const before = await secDefiners(await make("dung_chung_005", undefined, 5));
    expect(before.length).toBeGreaterThan(0);
    expect(await checkCatalog(await make("dung_chung"), before)).toEqual([]);
  });

  it("break: insert granted to the API role is named", async () => {
    const before = await secDefiners(await make("dung_chung_005b", undefined, 5));
    const w = await make("dung_chung_pha");
    await w.db.owner.query("grant insert on app.permissions to quy_hang_app");
    expect(await checkCatalog(w, before)).toEqual([
      "bang-quyen-dung-chung: quy_hang_app ghi được bảng quyền",
    ]);
  });
});
