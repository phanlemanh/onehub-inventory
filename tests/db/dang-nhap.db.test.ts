// Sign-in on this lane's Postgres (row 8, _acceptance/dang-nhap-ma-email/evals.yaml). Every case goes through the real
// route handlers, the real door and the real database functions; only the mail sender is captured in memory.
// Case names are the matrix written before the code: 16 cases on a clean database, 4 break files that must turn
// their case red with a pinned message.
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import {
  CODE_MAX_ATTEMPTS,
  CODE_REQUEST_LIMIT,
  SESSION_COOKIE,
  SESSION_TTL_SEC,
} from "@/modules/identity/constants";
import { createAuthHandlers, type AuthHandlers } from "@/modules/identity/http";
import type { LoginDeps } from "@/modules/identity/login";
import { readSession, sessionContext } from "@/modules/identity/login";
import { readAuthConfig } from "@/modules/identity/config";
import { captureSender, type SentMail } from "@/modules/identity/sender";
import { createPool, withCompany, type DbPool } from "@/modules/identity/with-company";

import { count, scratchDb, seed, type Fixture, type ScratchDb } from "./helpers";

const BASE = "http://127.0.0.1:3485/api/v1/auth";
const INVALID_BODY = '{"error":"code-invalid"}';

interface World {
  db: ScratchDb;
  pool: DbPool & { end?: () => Promise<void> };
  fx: Fixture;
  mail: SentMail[];
  h: AuthHandlers;
  deps: LoginDeps;
}

async function world(suffix: string, breakFile?: string): Promise<World> {
  const db = await scratchDb(suffix, breakFile);
  const fx = await seed(db.owner);
  const pool = createPool(db.url) as World["pool"];
  const { sender, sent } = captureSender();
  const deps: LoginDeps = { pool, secret: "test-secret-dang-nhap", sender };
  return { db, pool, fx, mail: sent, deps, h: createAuthHandlers(() => deps) };
}

async function close(w: World) {
  await w.pool.end?.();
  await w.db.drop();
}

function post(path: string, body: unknown, cookie?: string, method = "POST"): Request {
  return new Request(`${BASE}${path}`, {
    method,
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(body),
  });
}

function get(path: string, cookie?: string, method = "GET"): Request {
  return new Request(`${BASE}${path}`, { method, headers: cookie ? { cookie } : {} });
}

/** The code inside the last mail to `email`, read from the mail's own text — never from a fixture or argument. */
function codeFromMail(w: World, email: string): string {
  const mail = [...w.mail].reverse().find((m) => m.email === email);
  if (!mail) throw new Error(`không có thư nào tới ${email}`);
  const found = mail.text.match(/\b\d{6}\b/g) ?? [];
  if (found.length !== 1 || !mail.subject.includes(found[0]!)) {
    throw new Error(`thư tới ${email} không mang đúng một mã 6 số trong thân và tiêu đề`);
  }
  return found[0]!;
}

function cookieOf(res: Response): string {
  const set = res.headers.get("set-cookie") ?? "";
  const token = set.split(";")[0]!;
  if (!token.startsWith(`${SESSION_COOKIE}=`)) throw new Error("không có cookie phiên");
  return token;
}

async function signIn(
  w: World,
  email: string,
): Promise<{ res: Response; cookie: string; json: unknown }> {
  await w.h.requestCode(post("/code", { email }));
  const res = await w.h.verifyCode(post("/session", { email, code: codeFromMail(w, email) }));
  const json = await res.clone().json();
  return { res, cookie: res.ok ? cookieOf(res) : "", json };
}

const sessions = (w: World) => count(w.db.owner, "select count(*) as n from identity.sessions");

// ——— checks shared by the clean run and the break files (each throws its pinned message) ———

async function checkCompaniesOnlyOwn(w: World): Promise<void> {
  const { cookie } = await signIn(w, w.fx.emails.two);
  const res = await w.h.getSession(get("/session", cookie));
  const json = (await res.json()) as { companies: { id: string }[]; user: { email: string } };
  const ids = json.companies.map((c) => c.id).sort();
  if (JSON.stringify(ids) !== JSON.stringify([w.fx.companies.A, w.fx.companies.B].sort())) {
    throw new Error("ham-hep-khong-lo: lộ sàn không thuộc người");
  }
  if (json.user.email !== w.fx.emails.two)
    throw new Error("ham-hep-khong-lo: trả email của người khác");
}

async function checkThirdWrongKills(w: World): Promise<void> {
  const email = w.fx.emails.one;
  await w.h.requestCode(post("/code", { email }));
  const good = codeFromMail(w, email);
  const wrong = good === "000000" ? "111111" : "000000";
  for (let i = 0; i < CODE_MAX_ATTEMPTS; i++) {
    const res = await w.h.verifyCode(post("/session", { email, code: wrong }));
    if (
      res.status !== 400 ||
      (await res.text()) !== INVALID_BODY ||
      res.headers.get("set-cookie")
    ) {
      throw new Error(`ma-hong-cung-mot-loi: lần sai ${i + 1} không trả code-invalid`);
    }
  }
  const after = await w.h.verifyCode(post("/session", { email, code: good }));
  if (after.ok) throw new Error("ma-hong-cung-mot-loi: sai lần ba vẫn dùng được mã");
  if (
    after.status !== 400 ||
    (await after.text()) !== INVALID_BODY ||
    after.headers.get("set-cookie")
  ) {
    throw new Error("ma-hong-cung-mot-loi: mã đã chết không trả code-invalid");
  }
}

/** Every table of the identity schema × select, insert, update, delete — 16 cells, each must be denied. */
async function checkApiCannotTouchIdentity(w: World): Promise<{ tables: number; cells: number }> {
  const tables = (
    await w.db.owner.query<{ t: string }>(
      "select c.relname as t from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'identity' and c.relkind = 'r' order by 1",
    )
  ).rows.map((r) => r.t);
  const column = (t: string) => (t === "sessions" ? "token_hash" : t === "users" ? "id" : "email");
  let cells = 0;
  for (const t of tables) {
    for (const sql of [
      `select * from identity.${t} limit 1`,
      `insert into identity.${t} default values`,
      `update identity.${t} set ${column(t)} = ${column(t)} where false`,
      `delete from identity.${t} where false`,
    ]) {
      let denied = false;
      try {
        await withCompany(w.pool, { userId: "", companyId: null }, (c) => c.query(sql));
      } catch (err) {
        denied = /permission denied/.test(String((err as Error).message));
      }
      if (!denied)
        throw new Error(`vai-api-khong-cham-danh-tinh: identity.${t} (${sql.split(" ")[0]})`);
      cells += 1;
    }
  }
  return { tables: tables.length, cells };
}

async function checkIdentityRoleNarrow(w: World): Promise<number> {
  const role = (
    await w.db.owner.query<{ rolcanlogin: boolean; rolsuper: boolean; api_member: boolean }>(
      "select rolcanlogin, rolsuper, pg_has_role('quy_hang_app', oid, 'MEMBER') as api_member from pg_roles where rolname = 'quy_hang_identity'",
    )
  ).rows[0];
  if (!role || role.rolcanlogin || role.rolsuper || role.api_member) {
    throw new Error(
      "vai-ham-danh-tinh-hep: vai đăng nhập được, là siêu người dùng, hoặc vai API là thành viên",
    );
  }
  const funcs = (
    await w.db.owner.query<{
      name: string;
      owner: string;
      config: string[] | null;
      public_exec: boolean;
    }>(
      `select p.proname as name, pg_get_userbyid(p.proowner) as owner, p.proconfig as config,
              has_function_privilege('public', p.oid, 'EXECUTE') as public_exec
         from pg_proc p join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'app' and p.prosecdef order by 1`,
    )
  ).rows;
  for (const f of funcs) {
    if (f.owner !== "quy_hang_identity")
      throw new Error(`vai-ham-danh-tinh-hep: hàm ${f.name} thuộc ${f.owner}`);
    if (!(f.config ?? []).some((c) => c.startsWith("search_path=")))
      throw new Error(`vai-ham-danh-tinh-hep: hàm ${f.name} không ghim search_path`);
    if (f.public_exec) throw new Error(`vai-ham-danh-tinh-hep: hàm ${f.name} mở cho public`);
  }
  const grants = (
    await w.db.owner.query<{ t: string; p: string }>(
      `select table_name as t, privilege_type as p from information_schema.role_table_grants
        where grantee = 'quy_hang_identity' and table_schema = 'public' order by 1, 2`,
    )
  ).rows;
  for (const g of grants) {
    if (!["companies", "company_members"].includes(g.t) || g.p !== "SELECT") {
      throw new Error(`vai-ham-danh-tinh-hep: ${g.t}`);
    }
  }
  if (
    JSON.stringify([...new Set(grants.map((g) => g.t))]) !==
    JSON.stringify(["companies", "company_members"])
  ) {
    throw new Error("vai-ham-danh-tinh-hep: thiếu quyền đọc hai bảng sàn");
  }
  const owned = await count(
    w.db.owner,
    "select count(*) as n from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and pg_get_userbyid(c.relowner) = 'quy_hang_identity'",
  );
  if (owned > 0) throw new Error("vai-ham-danh-tinh-hep: vai sở hữu bảng của public");
  return funcs.length;
}

// ——— clean database ———

describe("dang-nhap (Postgres của dãy)", () => {
  let w: World;
  beforeAll(async () => {
    w = await world("lanh");
  });
  afterAll(async () => {
    if (w) await close(w);
  });
  // Every case starts with a clean request counter, so the rate limit of one case never leaks into the next.
  beforeEach(async () => {
    await w.db.owner.query("delete from identity.code_requests");
  });

  it("xin-ma-ba-email-cung-cau", async () => {
    const answers: { status: number; body: string }[] = [];
    for (const email of [w.fx.emails.one, w.fx.emails.none, w.fx.emails.unknown]) {
      const res = await w.h.requestCode(post("/code", { email }));
      answers.push({ status: res.status, body: await res.text() });
    }
    expect(answers.map((a) => a.status)).toEqual([200, 200, 200]);
    expect(new Set(answers.map((a) => a.body)).size).toBe(1);
    // Positive control: the sender was called, exactly once, for the only email that should get a code.
    expect(w.mail.length, "email lạ nhận thư").toBe(1);
    expect(w.mail[0]!.email).toBe(w.fx.emails.one);
    expect(codeFromMail(w, w.fx.emails.one)).toMatch(/^\d{6}$/);
  });

  it("ban-that-loi-may-chu", async () => {
    const log = vi.spyOn(console, "log");
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const { sender, sent } = captureSender();
    const env = {
      NODE_ENV: "production",
      DATABASE_URL: w.db.url,
      AUTH_SECRET: "x".repeat(40),
      MAIL_FROM: "a@b.test",
    };
    const broken = createAuthHandlers(() => {
      const config = readAuthConfig(env);
      return { pool: w.pool, secret: config.secret, sender };
    });
    const res = await broken.requestCode(post("/code", { email: w.fx.emails.one }));
    expect(res.status).toBe(500);
    expect(sent).toHaveLength(0);
    expect([...log.mock.calls, ...err.mock.calls].flat().join(" ")).not.toMatch(/\b\d{6}\b/);
    // Positive control: the same request with full production configuration (fake fetch) succeeds.
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    const ok = createAuthHandlers(() => {
      const config = readAuthConfig(
        { ...env, RESEND_API_KEY: "re_test" },
        fetchMock as unknown as typeof fetch,
      );
      return { pool: w.pool, secret: config.secret, sender: config.sender };
    });
    expect((await ok.requestCode(post("/code", { email: w.fx.emails.other }))).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    log.mockRestore();
    err.mockRestore();
  });

  it("doi-ma-mot-san", async () => {
    const email = w.fx.emails.one;
    await w.h.requestCode(post("/code", { email }));
    const code = codeFromMail(w, email);
    const other = code === "999999" ? "999998" : "999999";
    const wrong = await w.h.verifyCode(post("/session", { email, code: other }));
    expect(wrong.status).toBe(400);
    const res = await w.h.verifyCode(post("/session", { email, code, next: "/inventory" }));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { company: { id: string; name: string }; next: string };
    expect(body.company.id).toBe(w.fx.companies.A);
    expect(body.next).toBe("/inventory");
    const set = res.headers.get("set-cookie") ?? "";
    expect(set, "cookie phiên đọc được từ trình duyệt").toContain("HttpOnly");
    expect(set).toContain("SameSite=Lax");
    expect(set).toContain("Path=/");
    // The cookie outlives the 30-day session, so a sliding session is never cut by the browser.
    expect(Number(/Max-Age=(\d+)/.exec(set)?.[1]), "cookie hết trước phiên trượt").toBeGreaterThan(
      SESSION_TTL_SEC,
    );
    const me = await w.h.getSession(get("/session", cookieOf(res)));
    const meBody = (await me.json()) as { user: { email: string }; company: { name: string } };
    expect(meBody.user.email).toBe(email);
    expect(meBody.company.name).toBe("[Sàn A]");
  });

  it("ma-hong-cung-mot-loi", async () => {
    const email = w.fx.emails.one;
    const before = await sessions(w);
    const bodies: string[] = [];
    const expectInvalid = async (res: Response) => {
      expect(res.status).toBe(400);
      expect(res.headers.get("set-cookie")).toBeNull();
      bodies.push(await res.text());
    };
    // wrong
    await w.h.requestCode(post("/code", { email }));
    let good = codeFromMail(w, email);
    const bad = good === "000000" ? "111111" : "000000";
    await expectInvalid(await w.h.verifyCode(post("/session", { email, code: bad })));
    // third wrong, then right
    await checkThirdWrongKills(w);
    // expired
    await w.h.requestCode(post("/code", { email }));
    good = codeFromMail(w, email);
    await w.db.owner.query(
      "update identity.login_codes set expires_at = now() - interval '1 second' where email = $1",
      [email],
    );
    await expectInvalid(await w.h.verifyCode(post("/session", { email, code: good })));
    // used
    const used = await signIn(w, email);
    expect(used.res.status).toBe(200);
    const usedCode = codeFromMail(w, email);
    const sessionsAfterUse = await sessions(w);
    await expectInvalid(await w.h.verifyCode(post("/session", { email, code: usedCode })));
    // replaced by a newer code
    await w.h.requestCode(post("/code", { email }));
    const old = codeFromMail(w, email);
    await w.h.requestCode(post("/code", { email: w.fx.emails.other })); // a different mailbox in between
    await w.db.owner.query("delete from identity.code_requests");
    await w.h.requestCode(post("/code", { email }));
    const fresh = codeFromMail(w, email);
    if (old !== fresh)
      await expectInvalid(await w.h.verifyCode(post("/session", { email, code: old })));
    // unknown email, malformed code
    await expectInvalid(
      await w.h.verifyCode(post("/session", { email: w.fx.emails.unknown, code: "123456" })),
    );
    await expectInvalid(await w.h.verifyCode(post("/session", { email, code: "12ab" })));
    expect(new Set(bodies)).toEqual(new Set(['{"error":"code-invalid"}']));
    expect(await sessions(w)).toBe(sessionsAfterUse);
    expect(sessionsAfterUse).toBe(before + 1);
    await w.db.owner.query("delete from identity.code_requests");
  });

  it("ma-moi-van-dung", async () => {
    const email = w.fx.emails.one;
    await w.h.requestCode(post("/code", { email }));
    await w.h.requestCode(post("/code", { email }));
    const res = await w.h.verifyCode(post("/session", { email, code: codeFromMail(w, email) }));
    expect(res.status).toBe(200);
    await w.db.owner.query("delete from identity.code_requests");
  });

  it("gioi-han-xin-ma", async () => {
    for (const email of [w.fx.emails.other, w.fx.emails.unknown]) {
      const mailsBefore = w.mail.filter((m) => m.email === email).length;
      const statuses: number[] = [];
      for (let i = 0; i <= CODE_REQUEST_LIMIT; i++)
        statuses.push((await w.h.requestCode(post("/code", { email }))).status);
      expect(statuses, "xin mã lần sáu vẫn được").toEqual([200, 200, 200, 200, 200, 429]);
      const sixth = await w.h.requestCode(post("/code", { email }));
      expect(await sixth.json()).toEqual({ error: "rate-limited" });
      const mails = w.mail.filter((m) => m.email === email).length - mailsBefore;
      expect(mails).toBe(email === w.fx.emails.other ? CODE_REQUEST_LIMIT : 0);
      expect(
        await count(
          w.db.owner,
          "select count(*) as n from identity.code_requests where email = $1",
          [email],
        ),
      ).toBe(CODE_REQUEST_LIMIT);
      await w.db.owner.query(
        "update identity.code_requests set at = at - interval '16 minutes' where email = $1",
        [email],
      );
      expect((await w.h.requestCode(post("/code", { email }))).status).toBe(200);
    }
    await w.db.owner.query("delete from identity.code_requests");
  });

  it("nhieu-san-chon-dung-san", async () => {
    const { res, cookie } = await signIn(w, w.fx.emails.two);
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      company: unknown;
      companies: { id: string; name: string }[];
    };
    expect(body.company).toBeNull();
    expect(body.companies.map((c) => c.id).sort()).toEqual(
      [w.fx.companies.A, w.fx.companies.B].sort(),
    );
    expect(body.companies.map((c) => c.name).sort()).toEqual(["[Sàn A]", "[Sàn B]"]);
    const pick = (id: string) =>
      w.h.chooseCompany(post("/session/company", { companyId: id }, cookie, "PUT"));
    expect((await pick(w.fx.companies.A)).status).toBe(200);
    const notMember = await pick(w.fx.companies.C);
    expect(notMember.status).toBe(403);
    expect(await notMember.json()).toEqual({ error: "not-member" });
    let me = (await (await w.h.getSession(get("/session", cookie))).json()) as {
      company: { id: string };
    };
    expect(me.company.id).toBe(w.fx.companies.A);
    expect((await pick(w.fx.companies.B)).status).toBe(200);
    me = (await (await w.h.getSession(get("/session", cookie))).json()) as {
      company: { id: string };
    };
    expect(me.company.id).toBe(w.fx.companies.B);
    await w.db.owner.query("delete from identity.code_requests");
  });

  it("go-truoc-khi-doi-ma", async () => {
    const email = w.fx.emails.one;
    // Positive control: still a member, a code works.
    expect((await signIn(w, email)).res.status).toBe(200);
    await w.h.requestCode(post("/code", { email }));
    const code = codeFromMail(w, email);
    await w.db.owner.query("delete from company_members where user_id = $1", [w.fx.users.one]);
    const before = await sessions(w);
    const res = await w.h.verifyCode(post("/session", { email, code }));
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "no-company" });
    expect(res.headers.get("set-cookie")).toBeNull();
    expect(await sessions(w)).toBe(before);
    await w.db.owner.query("insert into company_members (company_id, user_id) values ($1, $2)", [
      w.fx.companies.A,
      w.fx.users.one,
    ]);
    await w.db.owner.query("delete from identity.code_requests");
  });

  it("phien-dua-sang-qua-cua", async () => {
    const { cookie } = await signIn(w, w.fx.emails.one);
    const session = await readSession(w.deps, cookie.split("=").slice(1).join("="));
    expect(session).not.toBeNull();
    const ctx = sessionContext(session!);
    expect(ctx).toEqual({ userId: w.fx.users.one, companyId: w.fx.companies.A });
    // Each company has an agreement of its own; the session's door must show only A's.
    const agreement = (company: string) =>
      w.db.owner.query<{ id: string }>(
        "insert into agreements (company_id, kind, direction, counterparty, data_classes, valid_from, approved_by) values ($1, 'catalog_source', 'inbound', '[Đối tác]', array['catalog'], now(), '[Tên]') returning id",
        [company],
      );
    const ownAgreement = (await agreement(w.fx.companies.A)).rows[0]!.id;
    await agreement(w.fx.companies.B);
    await agreement(w.fx.companies.C);
    const seen = await withCompany(w.pool, ctx, async (c) => ({
      agreements: (await c.query("select id from agreements")).rows as { id: string }[],
      companies: (await c.query("select id from companies")).rows as { id: string }[],
      members: (await c.query("select company_id from company_members")).rows as {
        company_id: string;
      }[],
    }));
    expect(seen.companies.map((r) => r.id)).toEqual([w.fx.companies.A]);
    expect(seen.agreements.map((r) => r.id)).toEqual([ownAgreement]);
    expect(new Set(seen.members.map((r) => r.company_id))).toEqual(new Set([w.fx.companies.A]));
    // Company A cannot read the members of B or C either.
    expect(seen.members).toHaveLength(2);
    await w.db.owner.query("delete from identity.code_requests");
  });

  it("go-khoi-san-mat-san", async () => {
    const { cookie } = await signIn(w, w.fx.emails.one);
    const token = cookie.split("=").slice(1).join("=");
    expect((await readSession(w.deps, token))!.company?.id).toBe(w.fx.companies.A);
    await w.db.owner.query("delete from company_members where user_id = $1", [w.fx.users.one]);
    const after = await readSession(w.deps, token);
    expect(after?.company ?? null, "phiên giữ sàn đã bị gỡ").toBeNull();
    const me = (await (await w.h.getSession(get("/session", cookie))).json()) as {
      company: unknown;
    };
    expect(me.company).toBeNull();
    await w.db.owner.query("insert into company_members (company_id, user_id) values ($1, $2)", [
      w.fx.companies.A,
      w.fx.users.one,
    ]);
    await w.db.owner.query("delete from identity.code_requests");
  });

  it("phien-truot-va-het-han", async () => {
    const { cookie } = await signIn(w, w.fx.emails.one);
    const hash = (
      await w.db.owner.query<{ h: string }>(
        "select token_hash as h from identity.sessions order by created_at desc limit 1",
      )
    ).rows[0]!.h;
    const expiresOf = async () =>
      (
        await w.db.owner.query<{ e: Date }>(
          "select expires_at as e from identity.sessions where token_hash = $1",
          [hash],
        )
      ).rows[0]!.e.getTime();
    // Same day: unchanged.
    const first = await expiresOf();
    await w.h.getSession(get("/session", cookie));
    expect(await expiresOf()).toBe(first);
    // Used again after 25 hours: now + 30 days.
    await w.db.owner.query(
      "update identity.sessions set refreshed_at = now() - interval '25 hours', expires_at = now() + interval '29 days' where token_hash = $1",
      [hash],
    );
    const t0 = Date.now();
    await w.h.getSession(get("/session", cookie));
    const slid = await expiresOf();
    expect(Math.abs(slid - (t0 + 30 * 24 * 3600 * 1000)), "hạn phiên không trượt").toBeLessThan(
      5000,
    );
    // Expired, and a made-up cookie.
    await w.db.owner.query(
      "update identity.sessions set expires_at = now() - interval '1 second' where token_hash = $1",
      [hash],
    );
    const expired = await w.h.getSession(get("/session", cookie));
    expect(expired.status).toBe(401);
    expect(await expired.json()).toEqual({ error: "unauthenticated" });
    const fake = await w.h.getSession(get("/session", `${SESSION_COOKIE}=${"A".repeat(43)}`));
    expect(fake.status).toBe(401);
    await w.db.owner.query("delete from identity.code_requests");
  });

  it("dang-xuat-xoa-phien", async () => {
    const { cookie } = await signIn(w, w.fx.emails.one);
    const before = await sessions(w);
    const res = await w.h.signOut(get("/session", cookie, "DELETE"));
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie")).toContain("Max-Age=0");
    expect(await sessions(w), "phiên còn sống sau đăng xuất").toBe(before - 1);
    expect((await w.h.getSession(get("/session", cookie))).status).toBe(401);
    await w.db.owner.query("delete from identity.code_requests");
  });

  it("vai-api-khong-cham-danh-tinh", async () => {
    expect(await checkApiCannotTouchIdentity(w)).toEqual({ tables: 4, cells: 16 });
  });

  it("chi-luu-bam", async () => {
    const email = w.fx.emails.one;
    await w.h.requestCode(post("/code", { email }));
    const code = codeFromMail(w, email);
    const pending = (await w.db.owner.query("select * from identity.login_codes")).rows;
    const res = await w.h.verifyCode(post("/session", { email, code }));
    const token = cookieOf(res).split("=").slice(1).join("=");
    const stored = [...pending, ...(await w.db.owner.query("select * from identity.sessions")).rows]
      .flatMap((row) => Object.values(row as Record<string, unknown>))
      .filter((v): v is string => typeof v === "string");
    expect(stored.length).toBeGreaterThan(0);
    for (const value of stored) {
      expect(value.includes(code), "mã 6 số nằm rõ trong cơ sở dữ liệu").toBe(false);
      expect(value.includes(token), "mã phiên nằm rõ trong cơ sở dữ liệu").toBe(false);
    }
    await w.db.owner.query("delete from identity.code_requests");
  });

  it("ham-hep-khong-lo", async () => {
    await checkCompaniesOnlyOwn(w);
    await w.db.owner.query("delete from identity.code_requests");
  });

  it("vai-ham-danh-tinh-hep", async () => {
    expect(await checkIdentityRoleNarrow(w)).toBe(6);
  });
});

// ——— break files: each must turn its case red with the pinned message ———

describe("dang-nhap — bản phá thử", () => {
  const cases: [string, (w: World) => Promise<unknown>, string][] = [
    ["ds-san-khong-loc", checkCompaniesOnlyOwn, "ham-hep-khong-lo: lộ sàn không thuộc người"],
    ["khong-dem-sai", checkThirdWrongKills, "ma-hong-cung-mot-loi: sai lần ba vẫn dùng được mã"],
    ["cap-quyen-bang", checkApiCannotTouchIdentity, "vai-api-khong-cham-danh-tinh: identity.users"],
    ["vai-ham-doc-them", checkIdentityRoleNarrow, "vai-ham-danh-tinh-hep: agreements"],
  ];
  for (const [file, check, message] of cases) {
    it(`pha-thu-${file}`, async () => {
      const w = await world(`pha_${file}`, file);
      try {
        await expect(check(w)).rejects.toThrow(message);
      } finally {
        await close(w);
      }
    });
  }
});
