// The shared action door (row 2c, K-23) against a fake pool: closed by default. Every way the door must stay shut has
// one case, and each case says what the door answered — never a context. The real database functions behind it
// (app.session_read, app.member_roles) are tested on Postgres in tests/db/.
import { afterEach, describe, expect, it, vi } from "vitest";

import { isDoorError, openDoor } from "./action-door";
import type { ActionName } from "./permissions";
import { CHECK_LOGIN_ROLE_SQL, type DbClient, type DbPool } from "./with-company";

const A = "00000000-0000-4000-8000-00000000000a";
const B = "00000000-0000-4000-8000-00000000000b";
const P = "00000000-0000-4000-8000-0000000000a1";

type Answer = (params: unknown[] | undefined) => unknown[] | Promise<unknown[]>;

/** A pool whose client answers by the first statement text that starts with a scripted prefix. */
function fakePool(script: Record<string, Answer>): DbPool & { seen: string[] } {
  const seen: string[] = [];
  const client: DbClient = {
    async query(text, params) {
      // The door's login-role check (row 7c): this fake connects as the login role.
      if (text === CHECK_LOGIN_ROLE_SQL)
        return { rows: [{ vai: "quy_hang_login", loi: null }], rowCount: 1 };
      seen.push(text);
      const key = Object.keys(script).find((k) => text.startsWith(k));
      const rows = key ? await script[key]!(params) : [];
      return { rows, rowCount: rows.length };
    },
    release() {},
  };
  return { seen, connect: async () => client };
}

const sessionIn = (company: string | null) => () => [
  {
    user_id: P,
    email: "p@example.test",
    name: "[Tên] P",
    company_id: company,
    company_name: company ? "[Công ty A]" : null,
    company_count: 1,
    expires_at: new Date(Date.now() + 60_000),
  },
];

/** A person of company A holding `roles` there; the session's company is `company`. */
function pool(roles: string[], company: string | null = A, extra: Record<string, Answer> = {}) {
  return fakePool({
    "select * from app.session_read": sessionIn(company),
    // app.member_roles() answers for the session's company only: a person who is not a member of B has no roles there.
    "select app.member_roles": () => [{ roles: company === A ? roles : [] }],
    ...extra,
  });
}

afterEach(() => vi.restoreAllMocks());

describe("action door", () => {
  it("opens for a role that holds the action, with the session's person and company and the cell's scope", async () => {
    const p = pool(["ListAgent"]);
    const door = await openDoor(() => p, "t", "listSavedViews");
    expect(door).toEqual({ pool: p, ctx: { userId: P, companyId: A }, scope: "own" });
  });

  it("gives the widest scope of the person's roles", async () => {
    const p = pool(["ListAgent", "CompanyAdmin"]);
    const door = await openDoor(() => p, "t", "readCompany");
    expect(isDoorError(door) ? door : door.scope).toBe("company");
  });

  it("stays shut without a session cookie", async () => {
    const p = pool(["ListAgent"]);
    expect(await openDoor(() => p, undefined, "listSavedViews")).toBe("unauthenticated");
    expect(p.seen).toEqual([]);
  });

  it("stays shut for an expired or unknown session", async () => {
    const p = pool(["ListAgent"], A, { "select * from app.session_read": () => [] });
    expect(await openDoor(() => p, "gone", "listSavedViews")).toBe("unauthenticated");
  });

  it("stays shut before a company is chosen", async () => {
    const p = pool(["ListAgent"], null);
    expect(await openDoor(() => p, "t", "listSavedViews")).toBe("unauthenticated");
  });

  it("stays shut for a person of A whose session points at B, where they are not a member", async () => {
    const p = pool(["ListAgent"], B);
    expect(await openDoor(() => p, "t", "listSavedViews")).toBe("forbidden");
  });

  it("stays shut for a role without the cell", async () => {
    const p = pool(["CompanyAdmin"]);
    expect(await openDoor(() => p, "t", "saveView")).toBe("forbidden");
  });

  it("stays shut for an action the permission table does not know, before reading anything", async () => {
    const p = pool(["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"]);
    expect(await openDoor(() => p, "t", "dropEverything" as ActionName)).toBe("forbidden");
    expect(p.seen).toEqual([]);
  });

  it("stays shut when reading the session or the roles fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const broken = pool(["ListAgent"], A, {
      "select * from app.session_read": () => Promise.reject(new Error("connection reset")),
    });
    expect(await openDoor(() => broken, "t", "listSavedViews")).toBe("server-error");
    const rolesBroken = pool(["ListAgent"], A, {
      "select app.member_roles": () => Promise.reject(new Error("connection reset")),
    });
    expect(await openDoor(() => rolesBroken, "t", "listSavedViews")).toBe("server-error");
  });

  it("stays shut when the database is not configured here", async () => {
    expect(await openDoor(() => null, "t", "listSavedViews")).toBe("server-error");
    vi.spyOn(console, "error").mockImplementation(() => {});
    const badConfig = () => {
      throw new Error("DATABASE_URL thiếu");
    };
    expect(await openDoor(badConfig, "t", "listSavedViews")).toBe("server-error");
  });
});
