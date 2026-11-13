// Row 7c (_acceptance/ung-dung-noi-bang-vai-khong-chu/evals.yaml E6, E7), on this lane's Postgres.
//   1. The door refuses a connection whose role can get back to a table owner or bypass row security: the owner itself,
//      a login role that is also a member of the owner, a login role that is also a member of quy_hang_identity. The
//      work never runs and no company's data changes. On the app's login role the same call reads its own company.
//   2. Code inside the door on the login role cannot get back to the owner: `reset role`, `set role <owner>` and
//      `set session authorization <owner>` are refused. Control: the same statements on an owner connection go through,
//      so the measure tells the two apart.
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  createPool,
  LoginRoleError,
  withCompany,
  type DbClient,
  type DbPool,
} from "@/modules/identity/with-company";

import { LOGIN_ROLE, scratchDb, type ScratchDb } from "./helpers";

const A = "00000000-0000-4000-8000-00000000000a";
const B = "00000000-0000-4000-8000-00000000000b";
const USER = "00000000-0000-4000-8000-0000000000a1";
const TAG = `p${process.pid}`;

let db: ScratchDb;
let owner: string;
const pools: (DbPool & { end?: () => Promise<void> })[] = [];
const tempRoles: string[] = [];

function pool(url: string): DbPool {
  const p = createPool(url) as DbPool & { end?: () => Promise<void> };
  pools.push(p);
  return p;
}

function urlAs(role: string): string {
  const u = new URL(db.url);
  u.username = role;
  u.password = "local-only";
  return u.toString();
}

/** A login role for one test: member of quy_hang_app like the app's role, and of `extra` too. Dropped after the file. */
async function tempLogin(name: string, extra: string): Promise<string> {
  const role = `vai_tam_${TAG}_${name}`;
  await db.owner.query(`drop role if exists ${role}`);
  await db.owner.query(`create role ${role} login noinherit password 'local-only'`);
  tempRoles.push(role);
  await db.owner.query(`grant quy_hang_app to ${role} with inherit false, set true`);
  await db.owner.query(`grant ${extra} to ${role}`);
  return urlAs(role);
}

async function counts(): Promise<{ a: number; b: number }> {
  const r = await db.owner.query<{ company_id: string; n: string }>(
    "select company_id, count(*) as n from agreements group by company_id",
  );
  const of = (c: string) => Number(r.rows.find((x) => x.company_id === c)?.n ?? 0);
  return { a: of(A), b: of(B) };
}

beforeAll(async () => {
  db = await scratchDb(TAG, undefined, { prefix: "vai_dang_nhap" });
  owner = (
    await db.owner.query<{ o: string }>(
      "select relowner::regrole::text as o from pg_class where oid = 'public.companies'::regclass",
    )
  ).rows[0]!.o;
  await db.owner.query(
    `insert into companies (id, name) values ('${A}', '[Sàn A]'), ('${B}', '[Sàn B]');
     insert into agreements (company_id, kind, direction, counterparty, data_classes, valid_from, approved_by)
     values ('${A}', 'spreadsheet', 'inbound', 'thoả thuận sàn A', '{catalog}', now(), '[Tên]'),
            ('${B}', 'spreadsheet', 'inbound', 'thoả thuận sàn B', '{catalog}', now(), '[Tên]')`,
  );
});

afterAll(async () => {
  for (const p of pools) await p.end?.();
  for (const role of tempRoles) await db.owner.query(`drop role if exists ${role}`);
  await db.drop();
});

describe("the door refuses a connection that can reach the owner (E6)", () => {
  it("control: on quy_hang_login the door reads exactly its own company's agreement", async () => {
    expect(new URL(db.appUrl).username).toBe(LOGIN_ROLE);
    const rows = await withCompany(pool(db.appUrl), { userId: USER, companyId: A }, async (c) => {
      return (await c.query("select counterparty from agreements")).rows;
    });
    expect(rows).toEqual([{ counterparty: "thoả thuận sàn A" }]);
  });

  const cases: [string, () => Promise<string>, () => string][] = [
    [
      "the owner",
      async () => db.url,
      () => `cửa từ chối vai nối ${owner}: về được vai chủ ${owner}`,
    ],
    [
      "a login role that is also a member of the owner",
      () => tempLogin("chu", owner),
      () => `cửa từ chối vai nối vai_tam_${TAG}_chu: về được vai chủ ${owner}`,
    ],
    [
      "a login role that is also a member of quy_hang_identity",
      () => tempLogin("danh_tinh", "quy_hang_identity"),
      () =>
        `cửa từ chối vai nối vai_tam_${TAG}_danh_tinh: vượt được luật theo dòng qua quy_hang_identity`,
    ],
  ];
  for (const [name, url, message] of cases)
    it(`refuses ${name}: the work never runs, no data changes`, async () => {
      const before = await counts();
      let ran = 0;
      const run = withCompany(pool(await url()), { userId: USER, companyId: A }, async (c) => {
        ran += 1;
        await c.query("delete from agreements");
      });
      await expect(run).rejects.toBeInstanceOf(LoginRoleError);
      await expect(run).rejects.toThrow(`${message()} — nối bằng ${LOGIN_ROLE}`);
      expect(ran, "hàm truyền vào không chạy").toBe(0);
      expect(await counts()).toEqual(before);
      expect(before).toEqual({ a: 1, b: 1 });
    });
});

describe("code inside the door cannot get back to the owner (E7)", () => {
  const attempts: [string, (c: DbClient) => Promise<unknown>][] = [
    [
      "reset role, then read agreements",
      async (c) => {
        await c.query("reset role");
        return c.query("select count(*) from agreements");
      },
    ],
    ["set role to the owner", (c) => c.query(`set role ${owner}`)],
    [
      "set session authorization to the owner",
      (c) => c.query(`set session authorization ${owner}`),
    ],
  ];

  for (const [name, attempt] of attempts)
    it(`${name}: refused on quy_hang_login, rolled back, both companies keep their agreement`, async () => {
      const run = withCompany(pool(db.appUrl), { userId: USER, companyId: A }, attempt);
      await expect(run).rejects.toThrow(/permission denied/);
      expect(await counts()).toEqual({ a: 1, b: 1 });
    });

  it("control: the same statements on an owner connection go through", async () => {
    const c = db.owner;
    await c.query("begin");
    try {
      await c.query("set local role quy_hang_app");
      await c.query("reset role");
      const n = await c.query<{ n: string }>("select count(*) as n from agreements");
      expect(Number(n.rows[0]!.n), "after reset role the owner reads every company").toBe(2);
      await c.query(`set role ${owner}`);
      await c.query(`set session authorization ${owner}`);
    } finally {
      await c.query("rollback");
      await c.query("reset session authorization");
    }
  });
});
