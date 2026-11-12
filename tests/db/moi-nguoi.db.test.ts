// Members and roles on this lane's Postgres (row 9, _acceptance/moi-nguoi-gan-vai/evals.yaml). Every case goes through
// the real route handlers (sign-in of row 8 and members of row 9), the real door and the real database functions;
// only the two mail senders are captured in memory. Case names are the matrix written before the code: 12 cases on
// clean scratch databases, 8 break files that must turn their check red with a pinned message.
import { readFileSync } from "node:fs";

import pg from "pg";
import { afterEach, describe, expect, it } from "vitest";

import type { Role } from "@/generated/ontology";
import { createAuthHandlers, type AuthHandlers } from "@/modules/identity/http";
import { captureInviteSender, type SentInvite } from "@/modules/identity/invite-mail";
import type { LoginDeps } from "@/modules/identity/login";
import type { MembersDeps } from "@/modules/identity/members";
import { createMembersHandlers, type MembersHandlers } from "@/modules/identity/members-http";
import { ROLES } from "@/modules/identity/roles";
import { captureSender, type SentMail } from "@/modules/identity/sender";
import { createPool, withCompany, type DbPool } from "@/modules/identity/with-company";

import { count, migrate, scratchDb, type ScratchDb } from "./helpers";

const ORIGIN = "http://127.0.0.1:3485";
const AUTH = `${ORIGIN}/api/v1/auth`;
const MEMBERS = `${ORIGIN}/api/v1/members`;

interface People {
  A: string;
  B: string;
  /** P, Q: company admins of A · R: BuyerAgent of A · LA, TL: ListAgent, TeamLead of A · TWO: A (BuyerAgent) and B
   *  (ListAgent) · X: B only, named «[Tên] B» · BB: company admin of B · Z: B only, never invited into A. */
  id: Record<"P" | "Q" | "R" | "LA" | "TL" | "TWO" | "X" | "BB" | "Z", string>;
  email: Record<"P" | "Q" | "R" | "LA" | "TL" | "TWO" | "X" | "BB" | "Z", string>;
}

interface World {
  db: ScratchDb;
  pool: DbPool & { end?: () => Promise<void> };
  p: People;
  codes: SentMail[];
  invites: SentInvite[];
  failInvite: { on: boolean };
  auth: AuthHandlers;
  members: MembersHandlers;
}

const worlds: World[] = [];

async function seedPeople(owner: pg.Client): Promise<People> {
  const company = async (name: string) =>
    (
      await owner.query<{ id: string }>("insert into companies (name) values ($1) returning id", [
        name,
      ])
    ).rows[0]!.id;
  const A = await company("[Sàn A]");
  const B = await company("[Sàn B]");
  const keys = ["P", "Q", "R", "LA", "TL", "TWO", "X", "BB", "Z"] as const;
  const id = {} as People["id"];
  const email = {} as People["email"];
  for (const k of keys) {
    email[k] = `${k.toLowerCase()}@example.test`;
    id[k] = (
      await owner.query<{ id: string }>(
        "insert into identity.users (email, name) values ($1, $2) returning id",
        [email[k], `[Tên] ${k}`],
      )
    ).rows[0]!.id;
  }
  const member = (c: string, u: string, name: string, roles: Role[]) =>
    owner.query(
      "insert into company_members (company_id, user_id, name, roles) values ($1, $2, $3, $4)",
      [c, u, name, roles],
    );
  await member(A, id.P, "[Tên] P", ["CompanyAdmin"]);
  await member(A, id.Q, "[Tên] Q", ["CompanyAdmin"]);
  await member(A, id.R, "[Tên] R", ["BuyerAgent"]);
  await member(A, id.LA, "[Tên] LA", ["ListAgent"]);
  await member(A, id.TL, "[Tên] TL", ["TeamLead"]);
  await member(A, id.TWO, "[Tên] TWO", ["BuyerAgent"]);
  await member(B, id.TWO, "[Tên] TWO", ["ListAgent"]);
  await member(B, id.X, "[Tên] B", ["BuyerAgent"]);
  await member(B, id.BB, "[Tên] BB", ["CompanyAdmin"]);
  await member(B, id.Z, "[Tên] Z", ["BuyerAgent"]);
  return { A, B, id, email };
}

async function world(suffix: string, breakFile?: string): Promise<World> {
  const db = await scratchDb(suffix, breakFile, { prefix: "moi_nguoi" });
  const p = await seedPeople(db.owner);
  const pool = createPool(db.url) as World["pool"];
  const code = captureSender();
  const invite = captureInviteSender();
  const deps: LoginDeps & MembersDeps = {
    pool,
    secret: "test-secret-moi-nguoi",
    sender: code.sender,
    invite: invite.sender,
  };
  const w: World = {
    db,
    pool,
    p,
    codes: code.sent,
    invites: invite.sent,
    failInvite: invite.fail,
    auth: createAuthHandlers(() => deps),
    members: createMembersHandlers(() => deps),
  };
  worlds.push(w);
  return w;
}

afterEach(async () => {
  for (const w of worlds.splice(0)) {
    await w.pool.end?.();
    await w.db.drop();
  }
});

function req(url: string, method: string, body?: unknown, cookie?: string): Request {
  return new Request(url, {
    method,
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    ...(body === undefined ? {} : { body: typeof body === "string" ? body : JSON.stringify(body) }),
  });
}

/** The code in the last mail to `email`, read from the mail itself. */
function codeFromMail(w: World, email: string): string {
  const mail = [...w.codes].reverse().find((m) => m.email === email);
  if (!mail) throw new Error(`không có thư mã nào tới ${email}`);
  const found = mail.text.match(/\b\d{6}\b/g) ?? [];
  if (found.length !== 1) throw new Error(`thư tới ${email} không mang đúng một mã`);
  return found[0]!;
}

/** Signs in through the real sign-in handlers; chooses `company` when the person belongs to several. */
async function signIn(w: World, email: string, company?: string): Promise<string> {
  await w.auth.requestCode(req(`${AUTH}/code`, "POST", { email }));
  const res = await w.auth.verifyCode(
    req(`${AUTH}/session`, "POST", { email, code: codeFromMail(w, email) }),
  );
  if (!res.ok) throw new Error(`đăng nhập ${email} trả ${res.status}`);
  const cookie = (res.headers.get("set-cookie") ?? "").split(";")[0]!;
  const json = (await res.json()) as { company: { id: string } | null };
  if (company && json.company?.id !== company) {
    const chosen = await w.auth.chooseCompany(
      req(`${AUTH}/session/company`, "PUT", { companyId: company }, cookie),
    );
    if (!chosen.ok) throw new Error(`chọn sàn trả ${chosen.status}`);
  }
  return cookie;
}

const list = (w: World, cookie?: string) => w.members.list(req(MEMBERS, "GET", undefined, cookie));
const invite = (w: World, body: unknown, cookie?: string) =>
  w.members.invite(req(MEMBERS, "POST", body, cookie));
const setRoles = (w: World, userId: string, roles: unknown, cookie?: string) =>
  w.members.setRoles(req(`${MEMBERS}/${userId}/roles`, "PUT", { roles }, cookie), userId);

async function rolesOf(w: World, company: string, user: string): Promise<string[] | null> {
  const { rows } = await w.db.owner.query<{ roles: string[] }>(
    "select roles from company_members where company_id = $1 and user_id = $2",
    [company, user],
  );
  return rows[0]?.roles ?? null;
}

const memberCount = (w: World) => count(w.db.owner, "select count(*) as n from company_members");
const userCount = (w: World) => count(w.db.owner, "select count(*) as n from identity.users");

/** Calls one narrow function straight through the door under the API role, as `user` in `company`. */
function direct<T>(
  w: World,
  user: string,
  company: string | null,
  sql: string,
  params: unknown[] = [],
) {
  return withCompany(
    w.pool,
    { userId: user, companyId: company },
    async (c) => (await c.query(sql, params)).rows as T[],
  );
}

// ——— checks shared by the clean run and the break files (each throws its pinned message) ———

async function checkNonAdminCannotInvite(w: World): Promise<void> {
  const cookie = await signIn(w, w.p.email.LA);
  const before = await memberCount(w);
  const res = await invite(
    w,
    { email: "moi@example.test", name: "[Tên] Mới", roles: ["ListAgent"] },
    cookie,
  );
  if (res.status !== 403 || (await memberCount(w)) !== before)
    throw new Error("ba-vai-khong-quan-tri: Đầu chủ mời được người");
}

/**
 * Row 7b (Ngoài-1 of row 9a): the database itself refuses a ListAgent's invite. Since row 9a the API answers 403 before
 * the database is asked, so the API check above cannot tell a database that checks the permission from one that does
 * not; this one calls the function straight through the door under the API role, as LA in A.
 */
async function checkDbRefusesNonAdminInvite(w: World): Promise<void> {
  const before = await memberCount(w);
  const rows = await direct<{ status: string }>(
    w,
    w.p.id.LA,
    w.p.A,
    "select status from app.member_invite($1, $2, $3)",
    ["moi@example.test", "[Tên] Mới", ["ListAgent"]],
  );
  if (rows[0]?.status !== "forbidden" || (await memberCount(w)) !== before)
    throw new Error("ba-vai-khong-quan-tri: cơ sở dữ liệu cho Đầu chủ mời người");
}

async function checkOtherCompanyUntouched(w: World): Promise<void> {
  const cookie = await signIn(w, w.p.email.P);
  const res = await setRoles(w, w.p.id.X, ["CompanyAdmin"], cookie);
  const xRoles = await rolesOf(w, w.p.B, w.p.id.X);
  if (res.status !== 404 || JSON.stringify(xRoles) !== JSON.stringify(["BuyerAgent"]))
    throw new Error("doi-vai-nguoi-san-khac: đổi được vai người của sàn khác");
}

async function checkLastAdmin(w: World): Promise<void> {
  const cookie = await signIn(w, w.p.email.P);
  const first = await setRoles(w, w.p.id.Q, ["TeamLead"], cookie);
  if (first.status !== 200)
    throw new Error(`doi-vai-va-quan-tri-cuoi: bỏ quản trị của Q trả ${first.status}`);
  const self = await setRoles(w, w.p.id.P, ["ListAgent"], cookie);
  const admins = await count(
    w.db.owner,
    "select count(*) as n from company_members where company_id = $1 and 'CompanyAdmin' = any (roles)",
    [w.p.A],
  );
  if (self.status !== 409 || admins !== 1)
    throw new Error("doi-vai-va-quan-tri-cuoi: sàn mất quản trị cuối cùng");
  expect(await self.json()).toEqual({ error: "last-admin" });
}

async function checkApiCannotWrite(w: World): Promise<void> {
  const { rows } = await w.db.owner.query<Record<string, boolean>>(
    `select has_table_privilege('quy_hang_app', 'company_members', 'INSERT') as i,
            has_table_privilege('quy_hang_app', 'company_members', 'UPDATE') as u,
            has_table_privilege('quy_hang_app', 'company_members', 'DELETE') as d`,
  );
  if (rows[0]!["i"] || rows[0]!["u"] || rows[0]!["d"])
    throw new Error("vai-api-khong-ghi-thang: company_members");
}

async function checkNamePerCompany(w: World): Promise<void> {
  const cookie = await signIn(w, w.p.email.P);
  const res = await invite(
    w,
    { email: w.p.email.X, name: "[Tên] A", roles: ["BuyerAgent"] },
    cookie,
  );
  expect(res.status).toBe(200);
  const json = (await (await list(w, cookie)).json()) as {
    members: { email: string; name: string }[];
  };
  if (json.members.find((m) => m.email === w.p.email.X)?.name !== "[Tên] A")
    throw new Error("moi-email-da-co-khong-lo: lộ tên sàn khác đặt");
}

async function checkListAdminOnly(w: World): Promise<void> {
  try {
    await direct(w, w.p.id.LA, w.p.A, "select * from app.member_list()");
  } catch (err) {
    if ((err as { code?: string }).code === "42501") return;
    throw err;
  }
  throw new Error("ham-hep-chi-san-cua-phien: member_list trả danh sách cho người không quản trị");
}

async function checkRolesOwnCompany(w: World): Promise<void> {
  const rows = await direct<{ r: string[] }>(
    w,
    w.p.id.TWO,
    w.p.A,
    "select app.member_roles() as r",
  );
  if (JSON.stringify(rows[0]!.r) !== JSON.stringify(["BuyerAgent"]))
    throw new Error("ham-hep-chi-san-cua-phien: member_roles đọc vai sàn khác");
}

/** Invites the same email Y in two worlds — Y has an account in B in the first, none in the second — and compares. */
async function checkSameAnswer(known: World, fresh: World): Promise<void> {
  const y = "y@example.test";
  await known.db.owner.query(
    `with u as (insert into identity.users (email, name) values ($1, '[Tên] B') returning id)
     insert into company_members (company_id, user_id, name, roles) select $2, id, '[Tên] B', '{BuyerAgent}' from u`,
    [y, known.p.B],
  );
  const answers: { status: number; body: string; mail: string }[] = [];
  for (const w of [known, fresh]) {
    const cookie = await signIn(w, w.p.email.P);
    const res = await invite(
      w,
      { email: y, name: "[Tên] A", roles: ["ListAgent", "TeamLead"] },
      cookie,
    );
    const body = (await res.text()).replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, "<id>");
    const sent = w.invites.filter((m) => m.email === y);
    answers.push({ status: res.status, body, mail: JSON.stringify(sent) });
  }
  if (JSON.stringify(answers[0]) !== JSON.stringify(answers[1]))
    throw new Error("moi-email-da-co-khong-lo: phản hồi khác khi tài khoản đã có");
}

// ——— the 12 cases ———

describe("moi-nguoi (row 9) on a clean database", () => {
  it("moi-email-moi-vao-dung-san", async () => {
    const w = await world("moi_email");
    const email = "moi@example.test";
    await w.auth.requestCode(req(`${AUTH}/code`, "POST", { email }));
    expect(w.codes.filter((m) => m.email === email)).toHaveLength(0);
    const cookie = await signIn(w, w.p.email.P);
    const res = await invite(
      w,
      { email, name: "[Tên] Mới", roles: ["TeamLead", "ListAgent"] },
      cookie,
    );
    expect(res.status).toBe(200);
    const json = (await (await list(w, cookie)).json()) as {
      members: {
        email: string;
        name: string;
        roles: string[];
        invitedByName: string;
        invitedAt: string;
      }[];
    };
    const row = json.members.filter((m) => m.email === email);
    expect(row).toHaveLength(1);
    expect(row[0]).toMatchObject({
      name: "[Tên] Mới",
      roles: ["ListAgent", "TeamLead"],
      invitedByName: "[Tên] P",
    });
    expect(Math.abs(Date.now() - Date.parse(row[0]!.invitedAt))).toBeLessThan(60_000);
    await w.auth.requestCode(req(`${AUTH}/code`, "POST", { email }));
    const verified = await w.auth.verifyCode(
      req(`${AUTH}/session`, "POST", { email, code: codeFromMail(w, email) }),
    );
    if (verified.status !== 200)
      throw new Error("moi-email-moi-vao-dung-san: người được mời không vào được sàn");
    const body = (await verified.json()) as { company: { id: string } };
    expect(body.company.id).toBe(w.p.A);
    const newId = (
      await w.db.owner.query<{ id: string }>("select id from identity.users where email = $1", [
        email,
      ])
    ).rows[0]!.id;
    const roles = await direct<{ r: string[] }>(w, newId, w.p.A, "select app.member_roles() as r");
    expect(roles[0]!.r).toEqual(["ListAgent", "TeamLead"]);
  });

  it("thu-moi-mot-lan", async () => {
    const w = await world("thu_mot_lan");
    const cookie = await signIn(w, w.p.email.P);
    expect(
      (
        await invite(
          w,
          { email: "moi@example.test", name: "[Tên] Mới", roles: ["BuyerAgent", "TeamLead"] },
          cookie,
        )
      ).status,
    ).toBe(200);
    expect(w.invites).toHaveLength(1);
    const mail = w.invites[0]!;
    expect(mail.email).toBe("moi@example.test");
    for (const part of ["[Sàn A]", "[Tên] P", "Đầu khách, Trưởng nhóm", `${ORIGIN}/login`])
      expect(mail.text, part).toContain(part);
    expect(`${mail.subject}\n${mail.text}`).not.toMatch(/\b\d{6}\b/);
    // Four refused invitations send nothing more.
    expect(
      (await invite(w, { email: w.p.email.R, name: "[Tên] R", roles: ["BuyerAgent"] }, cookie))
        .status,
    ).toBe(409);
    expect(
      (await invite(w, { email: "khac@example.test", name: "[Tên]", roles: [] }, cookie)).status,
    ).toBe(400);
    const la = await signIn(w, w.p.email.LA);
    expect(
      (await invite(w, { email: "khac@example.test", name: "[Tên]", roles: ["ListAgent"] }, la))
        .status,
    ).toBe(403);
    expect(
      (await invite(w, { email: "khac@example.test", name: "[Tên]", roles: ["ListAgent"] })).status,
    ).toBe(401);
    expect(w.invites).toHaveLength(1);
  });

  it("thu-hong-khong-them", async () => {
    const w = await world("thu_hong");
    const cookie = await signIn(w, w.p.email.P);
    const members = await memberCount(w);
    const users = await userCount(w);
    w.failInvite.on = true;
    const res = await invite(
      w,
      { email: "moi@example.test", name: "[Tên] Mới", roles: ["ListAgent"] },
      cookie,
    );
    expect(res.status).toBe(500);
    if ((await memberCount(w)) !== members || (await userCount(w)) !== users)
      throw new Error("thu-hong-khong-them: thư hỏng mà người vẫn được thêm");
    w.failInvite.on = false;
    expect(
      (
        await invite(
          w,
          { email: "moi@example.test", name: "[Tên] Mới", roles: ["ListAgent"] },
          cookie,
        )
      ).status,
    ).toBe(200);
    expect(await memberCount(w)).toBe(members + 1);
  });

  it("moi-email-da-co-khong-lo", async () => {
    const known = await world("da_co_1");
    const fresh = await world("da_co_2");
    await checkSameAnswer(known, fresh);
    // In the first world: A sees its own name, B keeps its own, the account keeps its name, both companies offered.
    const a = await signIn(known, known.p.email.P);
    const aList = (await (await list(known, a)).json()) as {
      members: { email: string; name: string }[];
    };
    expect(aList.members.find((m) => m.email === "y@example.test")?.name).toBe("[Tên] A");
    const b = await signIn(known, known.p.email.BB);
    const bList = (await (await list(known, b)).json()) as {
      members: { email: string; name: string }[];
    };
    expect(bList.members.find((m) => m.email === "y@example.test")?.name).toBe("[Tên] B");
    expect(
      (await known.db.owner.query("select name from identity.users where email = 'y@example.test'"))
        .rows[0],
    ).toEqual({ name: "[Tên] B" });
    await known.auth.requestCode(req(`${AUTH}/code`, "POST", { email: "y@example.test" }));
    const v = await known.auth.verifyCode(
      req(`${AUTH}/session`, "POST", {
        email: "y@example.test",
        code: codeFromMail(known, "y@example.test"),
      }),
    );
    const vj = (await v.json()) as { companies: { id: string }[] };
    expect(vj.companies.map((c) => c.id).sort()).toEqual([known.p.A, known.p.B].sort());
    await checkNamePerCompany(await world("ten_theo_san"));
  });

  it("moi-bi-tu-choi-khong-doi", async () => {
    const w = await world("tu_choi");
    const cookie = await signIn(w, w.p.email.P);
    const inputs: [string, unknown, number][] = [
      ["đã ở sàn", { email: w.p.email.R, name: "[Tên] R", roles: ["BuyerAgent"] }, 409],
      ["email sai khuôn", { email: "khong-phai-email", name: "[Tên]", roles: ["ListAgent"] }, 400],
      ["tên trống", { email: "moi@example.test", name: "   ", roles: ["ListAgent"] }, 400],
      ["vai rỗng", { email: "moi@example.test", name: "[Tên]", roles: [] }, 400],
      ["vai lạ", { email: "moi@example.test", name: "[Tên]", roles: ["Owner"] }, 400],
      [
        "vai lặp",
        { email: "moi@example.test", name: "[Tên]", roles: ["ListAgent", "ListAgent"] },
        400,
      ],
      ["thân không phải JSON", "{không phải json", 400],
    ];
    const members = await memberCount(w);
    const users = await userCount(w);
    for (const [what, body, status] of inputs) {
      const res = await invite(w, body, cookie);
      if (res.status === 200) throw new Error(`moi-bi-tu-choi-khong-doi: ${what} được nhận`);
      expect(res.status, what).toBe(status);
      expect(await memberCount(w), what).toBe(members);
      expect(await userCount(w), what).toBe(users);
      expect(w.invites, what).toHaveLength(0);
    }
    for (const bad of ["{}", "{Owner}"]) {
      await expect(
        w.db.owner.query("update company_members set roles = $1 where user_id = $2", [
          bad,
          w.p.id.R,
        ]),
      ).rejects.toThrow(/company_members_roles_check/);
    }
    expect(
      (await invite(w, { email: "moi@example.test", name: "[Tên]", roles: ["ListAgent"] }, cookie))
        .status,
    ).toBe(200);
  });

  it("doi-vai-va-quan-tri-cuoi", async () => {
    const w = await world("doi_vai");
    const cookie = await signIn(w, w.p.email.P);
    expect((await setRoles(w, w.p.id.R, ["TeamLead", "ListAgent"], cookie)).status).toBe(200);
    const json = (await (await list(w, cookie)).json()) as {
      members: { userId: string; roles: string[] }[];
    };
    expect(json.members.find((m) => m.userId === w.p.id.R)?.roles).toEqual([
      "ListAgent",
      "TeamLead",
    ]);
    const r = await direct<{ r: string[] }>(w, w.p.id.R, w.p.A, "select app.member_roles() as r");
    expect(r[0]!.r).toEqual(["ListAgent", "TeamLead"]);
    await checkLastAdmin(w);
    expect(await rolesOf(w, w.p.A, w.p.id.P)).toEqual(["CompanyAdmin"]);

    // Two admins drop each other's admin role at the same time: exactly one wins, one admin is left.
    const v = await world("doi_vai_dong_thoi");
    const raw = new pg.Pool({ connectionString: v.db.url, max: 2 });
    const open = async (user: string) => {
      const c = await raw.connect();
      await c.query("begin");
      await c.query("set local role quy_hang_app");
      await c.query(
        "select set_config('app.user_id', $1, true), set_config('app.company_id', $2, true)",
        [user, v.p.A],
      );
      return c;
    };
    const c1 = await open(v.p.id.P);
    const c2 = await open(v.p.id.Q);
    const r1 = await c1.query<{ s: string }>("select app.member_set_roles($1, '{TeamLead}') as s", [
      v.p.id.Q,
    ]);
    const pending = c2.query<{ s: string }>("select app.member_set_roles($1, '{TeamLead}') as s", [
      v.p.id.P,
    ]);
    await c1.query("commit");
    const r2 = await pending;
    await c2.query("commit");
    c1.release();
    c2.release();
    await raw.end();
    // The loser waited on the company lock; by then it is no longer an admin, so it is refused as forbidden.
    expect([r1.rows[0]!.s, r2.rows[0]!.s]).toEqual(["ok", "forbidden"]);
    expect(
      await count(
        v.db.owner,
        "select count(*) as n from company_members where company_id = $1 and 'CompanyAdmin' = any (roles)",
        [v.p.A],
      ),
    ).toBe(1);
  });

  it("ba-vai-khong-quan-tri", async () => {
    const w = await world("ba_vai");
    const members = await memberCount(w);
    const rolesBefore = await rolesOf(w, w.p.A, w.p.id.R);
    let calls = 0;
    for (const who of ["LA", "R", "TL"] as const) {
      const cookie = await signIn(w, w.p.email[who]);
      const responses = [
        await list(w, cookie),
        await invite(
          w,
          { email: "moi@example.test", name: "[Tên] Mới", roles: ["ListAgent"] },
          cookie,
        ),
        await setRoles(w, w.p.id.R, ["CompanyAdmin"], cookie),
      ];
      for (const res of responses) {
        calls++;
        expect(res.status, who).toBe(403);
        const text = await res.text();
        expect(text).toBe('{"error":"forbidden"}');
        for (const e of Object.values(w.p.email)) expect(text).not.toContain(e);
      }
    }
    expect(calls).toBe(9);
    expect(await memberCount(w)).toBe(members);
    expect(await rolesOf(w, w.p.A, w.p.id.R)).toEqual(rolesBefore);
    expect(w.invites).toHaveLength(0);
    const admin = await signIn(w, w.p.email.P);
    expect((await list(w, admin)).status).toBe(200);
    expect(
      (
        await invite(
          w,
          { email: "moi@example.test", name: "[Tên] Mới", roles: ["ListAgent"] },
          admin,
        )
      ).status,
    ).toBe(200);
    expect((await setRoles(w, w.p.id.R, ["ListAgent"], admin)).status).toBe(200);
    await checkNonAdminCannotInvite(await world("ba_vai_lan_hai"));
  });

  it("chua-dang-nhap-chua-chon-san", async () => {
    const w = await world("chua_chon");
    const members = await memberCount(w);
    const noChoice = await signIn(w, w.p.email.TWO);
    for (const cookie of [undefined, noChoice]) {
      for (const res of [
        await list(w, cookie),
        await invite(w, { email: "moi@example.test", name: "[Tên]", roles: ["ListAgent"] }, cookie),
        await setRoles(w, w.p.id.R, ["ListAgent"], cookie),
      ]) {
        expect(res.status).toBe(401);
        expect(await res.text()).toBe('{"error":"unauthenticated"}');
      }
    }
    expect(await memberCount(w)).toBe(members);
    expect(w.invites).toHaveLength(0);
    // The narrow functions on their own, without a session: nothing comes back and nothing changes.
    await expect(direct(w, "", null, "select * from app.member_list()")).rejects.toMatchObject({
      code: "42501",
    });
    expect(
      (await direct<{ r: string[] }>(w, "", null, "select app.member_roles() as r"))[0]!.r,
    ).toEqual([]);
    expect(
      (
        await direct<{ status: string }>(
          w,
          "",
          null,
          "select status from app.member_invite('moi@example.test', '[Tên]', '{ListAgent}')",
        )
      )[0]!.status,
    ).toBe("forbidden");
    expect(
      (
        await direct<{ s: string }>(
          w,
          "",
          null,
          "select app.member_set_roles($1, '{ListAgent}') as s",
          [w.p.id.R],
        )
      )[0]!.s,
    ).toBe("forbidden");
  });

  it("doi-vai-nguoi-san-khac", async () => {
    const w = await world("san_khac");
    await checkOtherCompanyUntouched(w);
    const cookie = await signIn(w, w.p.email.P);
    const json = (await (await list(w, cookie)).json()) as { members: { userId: string }[] };
    const ids = new Set(json.members.map((m) => m.userId));
    for (const k of ["X", "BB", "Z"] as const) expect(ids.has(w.p.id[k]), k).toBe(false);
    expect(ids).toEqual(new Set([w.p.id.P, w.p.id.Q, w.p.id.R, w.p.id.LA, w.p.id.TL, w.p.id.TWO]));
  });

  it("vai-api-khong-ghi-thang", async () => {
    const w = await world("api_khong_ghi");
    await checkApiCannotWrite(w);
    const q = async (sql: string) => (await w.db.owner.query<{ v: boolean }>(sql)).rows[0]!.v;
    expect(
      await q("select has_table_privilege('quy_hang_app', 'identity.users', 'SELECT') as v"),
    ).toBe(false);
    expect(
      await q("select has_table_privilege('quy_hang_app', 'identity.users', 'INSERT') as v"),
    ).toBe(false);
    expect(
      await q("select rolcanlogin as v from pg_roles where rolname = 'quy_hang_identity'"),
    ).toBe(false);
    const { rows } = await w.db.owner.query<{ t: string; p: string }>(
      `select c.relname as t, p.privilege_type as p
         from pg_class c join pg_namespace n on n.oid = c.relnamespace
         cross join lateral (values ('SELECT'), ('INSERT'), ('UPDATE'), ('DELETE')) as p(privilege_type)
        where n.nspname = 'public' and c.relkind = 'r'
          and has_table_privilege('quy_hang_identity', c.oid, p.privilege_type)
        order by 1, 2`,
    );
    expect(rows.map((r) => `${r.t}:${r.p}`)).toEqual([
      "companies:SELECT",
      "company_members:INSERT",
      "company_members:SELECT",
      "company_members:UPDATE",
    ]);
  });

  it("ham-hep-chi-san-cua-phien", async () => {
    const w = await world("ham_hep");
    const { A, B, id } = w.p;
    type Cell = {
      fn: string;
      caller: string;
      target: string;
      run: () => Promise<string>;
      expect: string;
    };
    const roles = async (user: string, company: string) =>
      JSON.stringify(
        (await direct<{ r: string[] }>(w, user, company, "select app.member_roles() as r"))[0]!.r,
      );
    const listed = async (user: string, company: string, target: string) => {
      try {
        const rows = await direct<{ user_id: string }>(
          w,
          user,
          company,
          "select user_id from app.member_list()",
        );
        return rows.some((r) => r.user_id === target) ? "có" : "không";
      } catch (err) {
        if ((err as { code?: string }).code === "42501") return "forbidden";
        throw err;
      }
    };
    const invited = async (user: string, company: string, email: string) =>
      (
        await direct<{ status: string }>(
          w,
          user,
          company,
          "select status from app.member_invite($1, '[Tên] Mời', '{ListAgent}')",
          [email],
        )
      )[0]!.status;
    const changed = async (user: string, company: string, target: string) =>
      (
        await direct<{ s: string }>(
          w,
          user,
          company,
          "select app.member_set_roles($1, '{TeamLead,CompanyAdmin}') as s",
          [target],
        )
      )[0]!.s;
    const callers = [
      { k: "P", user: id.P, company: A, admin: true, own: '["CompanyAdmin"]' },
      { k: "LA", user: id.LA, company: A, admin: false, own: '["ListAgent"]' },
      { k: "R", user: id.R, company: A, admin: false, own: '["BuyerAgent"]' },
      { k: "TL", user: id.TL, company: A, admin: false, own: '["TeamLead"]' },
      { k: "X", user: id.X, company: B, admin: false, own: '["BuyerAgent"]' },
    ];
    const cells: Cell[] = [];
    for (const c of callers) {
      for (const [t, target, email] of [
        ["A", id.TL, w.p.email.TL],
        ["B", id.Z, w.p.email.Z],
      ] as const) {
        cells.push({
          fn: "member_roles",
          caller: c.k,
          target: t,
          run: () => roles(c.user, c.company),
          expect: c.own,
        });
        cells.push({
          fn: "member_list",
          caller: c.k,
          target: t,
          run: () => listed(c.user, c.company, target),
          expect: c.admin ? (t === "A" ? "có" : "không") : "forbidden",
        });
        cells.push({
          fn: "member_set_roles",
          caller: c.k,
          target: t,
          // Q keeps CompanyAdmin, so no caller's own roles change mid-matrix.
          run: () => changed(c.user, c.company, t === "A" ? id.Q : target),
          expect: c.admin ? (t === "A" ? "ok" : "not-member") : "forbidden",
        });
        cells.push({
          fn: "member_invite",
          caller: c.k,
          target: t,
          run: () => invited(c.user, c.company, email),
          // Admin of A: TL is already in A; Z (B only) joins A and keeps its row in B.
          expect: c.admin ? (t === "A" ? "already-member" : "ok") : "forbidden",
        });
      }
    }
    expect(cells).toHaveLength(40);
    const zInB = await rolesOf(w, B, id.Z);
    for (const cell of cells) {
      const got = await cell.run();
      expect(got, `${cell.fn} · ${cell.caller} → ${cell.target}`).toBe(cell.expect);
    }
    expect(await rolesOf(w, B, id.Z)).toEqual(zInB);
    expect(await rolesOf(w, A, id.Z)).toEqual(["ListAgent"]);
    // A person of B called under A's session holds nothing there.
    expect(await roles(id.X, A)).toBe("[]");
    await checkListAdminOnly(w);
    await checkRolesOwnCompany(w);
  });

  it("rang-buoc-vai-bang-mo-hinh", async () => {
    const w = await world("rang_buoc");
    const { rows } = await w.db.owner.query<{ def: string }>(
      "select pg_get_constraintdef(oid) as def from pg_constraint where conname = 'company_members_roles_check'",
    );
    const inDb = [...rows[0]!.def.matchAll(/'(\w+)'::text/g)].map((m) => m[1]);
    const register = [
      ...readFileSync("ontology/roles.yaml", "utf8").matchAll(/^ {2}- name: (\w+)$/gm),
    ].map((m) => m[1]);
    const compare = (roles: readonly string[]) => {
      if (
        JSON.stringify(inDb) !== JSON.stringify(roles) ||
        JSON.stringify(register) !== JSON.stringify(roles)
      )
        throw new Error("rang-buoc-vai-bang-mo-hinh: ràng buộc lệch mô hình");
    };
    compare(ROLES);
    expect(() => compare([...ROLES, "Owner"])).toThrow(
      "rang-buoc-vai-bang-mo-hinh: ràng buộc lệch mô hình",
    );
    const cookie = await signIn(w, w.p.email.P);
    expect(
      (await invite(w, { email: "a@example.test", name: "[Tên]", roles: [...ROLES] }, cookie))
        .status,
    ).toBe(200);
    expect(
      (await invite(w, { email: "b@example.test", name: "[Tên]", roles: ["Owner"] }, cookie))
        .status,
    ).toBe(400);

    // A member row written before migration 003 becomes a company admin, named like the account.
    const old = await scratchDb("truoc_003", undefined, { prefix: "moi_nguoi", upTo: 2 });
    try {
      await old.owner.query(
        `with c as (insert into companies (name) values ('[Sàn cũ]') returning id),
              u as (insert into identity.users (email, name) values ('cu@example.test', '[Tên] Cũ') returning id)
         insert into company_members (company_id, user_id) select c.id, u.id from c, u`,
      );
      migrate(old.name);
      const r = await old.owner.query<{ roles: string[]; name: string }>(
        "select roles, name from company_members",
      );
      expect(r.rows).toEqual([{ roles: ["CompanyAdmin"], name: "[Tên] Cũ" }]);
    } finally {
      await old.drop();
    }
  });
});

// ——— each break file turns its check red with the pinned message ———

describe("break files", () => {
  const breaks: [string, string, (w: World) => Promise<void>][] = [
    [
      "moi-khong-kiem-quan-tri",
      "ba-vai-khong-quan-tri: cơ sở dữ liệu cho Đầu chủ mời người",
      checkDbRefusesNonAdminInvite,
    ],
    [
      "doi-vai-moi-san",
      "doi-vai-nguoi-san-khac: đổi được vai người của sàn khác",
      checkOtherCompanyUntouched,
    ],
    ["bo-quan-tri-cuoi", "doi-vai-va-quan-tri-cuoi: sàn mất quản trị cuối cùng", checkLastAdmin],
    ["cap-ghi-bang", "vai-api-khong-ghi-thang: company_members", checkApiCannotWrite],
    ["ten-chung", "moi-email-da-co-khong-lo: lộ tên sàn khác đặt", checkNamePerCompany],
    [
      "danh-sach-khong-kiem-quan-tri",
      "ham-hep-chi-san-cua-phien: member_list trả danh sách cho người không quản trị",
      checkListAdminOnly,
    ],
    [
      "vai-moi-san",
      "ham-hep-chi-san-cua-phien: member_roles đọc vai sàn khác",
      checkRolesOwnCompany,
    ],
  ];
  for (const [file, message, check] of breaks) {
    it(`pha-thu-${file}`, async () => {
      const healthy = await world(`lanh_${file}`);
      await check(healthy);
      const broken = await world(`pha_${file}`, file);
      await expect(check(broken)).rejects.toThrow(message);
    });
  }

  it("pha-thu-lo-tai-khoan", async () => {
    await checkSameAnswer(await world("lanh_lo_1"), await world("lanh_lo_2"));
    await expect(
      checkSameAnswer(
        await world("pha_lo_1", "lo-tai-khoan"),
        await world("pha_lo_2", "lo-tai-khoan"),
      ),
    ).rejects.toThrow("moi-email-da-co-khong-lo: phản hồi khác khi tài khoản đã có");
  });
});
