// Members over HTTP against a fake pool (row 9): the handler, the door and the module run for real; the database is a
// script that answers each statement by its text. The real database functions are tested on Postgres in
// tests/db/moi-nguoi.db.test.ts.
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { captureInviteSender, devInviteSender } from "./invite-mail";
import { memberRoles, type MembersDeps } from "./members";
import { createMembersHandlers } from "./members-http";
import { canonicalRoles, isRole } from "./roles";
import type { DbClient, DbPool } from "./with-company";

const A = "00000000-0000-4000-8000-00000000000a";
const P = "00000000-0000-4000-8000-0000000000a1";
const R = "00000000-0000-4000-8000-0000000000a2";
const URL = "http://127.0.0.1:3485/api/v1/members";

type Answer = (params: unknown[] | undefined) => unknown[] | Promise<unknown[]>;

/** A pool whose client answers by the first statement text that starts with a scripted prefix. */
function fakePool(script: Record<string, Answer>): DbPool & { seen: string[] } {
  const seen: string[] = [];
  const client: DbClient = {
    async query(text, params) {
      seen.push(text);
      const key = Object.keys(script).find((k) => text.startsWith(k));
      const rows = key ? await script[key]!(params) : [];
      return { rows, rowCount: rows.length };
    },
    release() {},
  };
  return { seen, connect: async () => client };
}

const session = (company: string | null) => () => [
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

function world(script: Record<string, Answer>, company: string | null = A) {
  // The session's person is a company admin unless a test scripts other roles (row 9a: the handlers ask the
  // permission table first; the database refusal below stays the second lock).
  const pool = fakePool({
    "select * from app.session_read": session(company),
    "select app.member_roles": () => [{ roles: ["CompanyAdmin"] }],
    ...script,
  });
  const invite = captureInviteSender();
  const deps: MembersDeps = { pool, invite: invite.sender };
  return { pool, invite, h: createMembersHandlers(() => deps) };
}

const req = (method: string, body?: unknown, path = "") =>
  new Request(`${URL}${path}`, {
    method,
    headers: { "content-type": "application/json", cookie: "ohi_session=t" },
    ...(body === undefined ? {} : { body: typeof body === "string" ? body : JSON.stringify(body) }),
  });

afterEach(() => vi.restoreAllMocks());

describe("members over HTTP", () => {
  it("lists members for an admin and maps the rows", async () => {
    const { h } = world({
      "select user_id, name, email": () => [
        {
          user_id: R,
          name: "[Tên] R",
          email: "r@example.test",
          roles: ["TeamLead", "ListAgent", "Owner"],
          invited_by_name: "[Tên] P",
          invited_at: "2026-11-11T09:00:00Z",
        },
        {
          user_id: P,
          name: "[Tên] P",
          email: "p@example.test",
          roles: null,
          invited_by_name: null,
          invited_at: null,
        },
      ],
    });
    const res = await h.list(req("GET"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      members: [
        {
          userId: R,
          name: "[Tên] R",
          email: "r@example.test",
          roles: ["ListAgent", "TeamLead"],
          invitedByName: "[Tên] P",
          invitedAt: "2026-11-11T09:00:00.000Z",
        },
        {
          userId: P,
          name: "[Tên] P",
          email: "p@example.test",
          roles: [],
          invitedByName: null,
          invitedAt: null,
        },
      ],
    });
  });

  it("answers forbidden when the database refuses a non-admin, and names nobody", async () => {
    const { h } = world({
      "select user_id, name, email": () => {
        throw Object.assign(new Error("forbidden"), { code: "42501" });
      },
    });
    const res = await h.list(req("GET"));
    expect(res.status).toBe(403);
    expect(await res.text()).toBe('{"error":"forbidden"}');
  });

  it("refuses a role without a cell before touching any data, with the same body for every action", async () => {
    for (const roles of [["ListAgent"], ["BuyerAgent"], ["TeamLead"], []]) {
      const { h, pool } = world({ "select app.member_roles": () => [{ roles }] });
      const answers = [
        await h.list(req("GET")),
        await h.invite(req("POST", { email: "x@example.test", name: "x", roles: ["ListAgent"] })),
        await h.setRoles(req("PUT", { roles: ["ListAgent"] }, `/${R}/roles`), R),
      ];
      for (const res of answers) {
        expect(res.status, `${roles.join("+") || "không vai"}`).toBe(403);
        expect(await res.text()).toBe('{"error":"forbidden"}');
      }
      expect(pool.seen.filter((t) => /member_(list|invite|set_roles)/.test(t))).toEqual([]);
    }
  });

  it("is unauthenticated without a session, or before a company is chosen", async () => {
    const none = world({ "select * from app.session_read": () => [] });
    expect((await none.h.list(req("GET"))).status).toBe(401);
    const noCompany = world({}, null);
    expect(
      (
        await noCompany.h.invite(
          req("POST", { email: "x@example.test", name: "x", roles: ["ListAgent"] }),
        )
      ).status,
    ).toBe(401);
  });

  it("invites, sends one mail with the company and inviter, and returns the id", async () => {
    const { h, invite, pool } = world({
      "select status, user_id from app.member_invite": () => [{ status: "ok", user_id: R }],
      "select c.name as company": () => [{ company: "[Công ty A]", inviter: "[Tên] P" }],
    });
    const res = await h.invite(
      req("POST", {
        email: " R@Example.test ",
        name: " [Tên] R ",
        roles: ["TeamLead", "ListAgent"],
      }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ member: { id: R } });
    expect(invite.sent).toHaveLength(1);
    expect(invite.sent[0]!.email).toBe("r@example.test");
    expect(invite.sent[0]!.text).toContain("[Công ty A]");
    expect(invite.sent[0]!.text).toContain("http://127.0.0.1:3485/login");
    expect(pool.seen).toContain("commit");
  });

  it("rolls back and answers server-error when the mail fails", async () => {
    const { h, invite, pool } = world({
      "select status, user_id from app.member_invite": () => [{ status: "ok", user_id: R }],
      "select c.name as company": () => [{ company: "[Công ty A]", inviter: "[Tên] P" }],
    });
    invite.fail.on = true;
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await h.invite(
      req("POST", { email: "r@example.test", name: "[Tên] R", roles: ["ListAgent"] }),
    );
    expect(res.status).toBe(500);
    // The invite transaction ends in a rollback (the session read before it committed on its own).
    expect(pool.seen.at(-1)).toBe("rollback");
  });

  it("maps refused invitations and bad bodies", async () => {
    for (const [status, code] of [
      ["already-member", 409],
      ["forbidden", 403],
    ] as const) {
      const { h, invite } = world({
        "select status, user_id from app.member_invite": () => [{ status, user_id: null }],
      });
      const res = await h.invite(
        req("POST", { email: "r@example.test", name: "[Tên] R", roles: ["ListAgent"] }),
      );
      expect(res.status, status).toBe(code);
      expect(invite.sent).toHaveLength(0);
    }
    const { h } = world({});
    for (const body of [
      { email: "x", name: "a", roles: ["ListAgent"] },
      { email: "a@b.vn", name: "  ", roles: ["ListAgent"] },
      { email: "a@b.vn", name: "a", roles: [] },
      { email: "a@b.vn", name: "a", roles: ["Owner"] },
      { email: "a@b.vn", name: "a", roles: ["ListAgent", "ListAgent"] },
      "{không phải json",
    ])
      expect((await h.invite(req("POST", body))).status).toBe(400);
  });

  it("changes roles and maps each refusal", async () => {
    for (const [status, code] of [
      ["ok", 200],
      ["not-member", 404],
      ["last-admin", 409],
      ["forbidden", 403],
    ] as const) {
      const { h } = world({ "select app.member_set_roles": () => [{ status }] });
      const res = await h.setRoles(req("PUT", { roles: ["BuyerAgent"] }, `/${R}/roles`), R);
      expect(res.status, status).toBe(code);
    }
    const { h } = world({});
    expect(
      (await h.setRoles(req("PUT", { roles: ["BuyerAgent"] }), "khong-phai-uuid")).status,
    ).toBe(404);
    expect((await h.setRoles(req("PUT", { roles: [] }), R)).status).toBe(400);
  });

  it("is a server error when members are not configured", async () => {
    const h = createMembersHandlers(() => null);
    expect((await h.list(req("GET"))).status).toBe(500);
  });

  it("reads the roles of the session's company only", async () => {
    const pool = fakePool({ "select app.member_roles": () => [{ roles: ["CompanyAdmin", "x"] }] });
    expect(await memberRoles({ pool }, { userId: P, companyId: A })).toEqual(["CompanyAdmin"]);
    expect(await memberRoles({ pool }, { userId: P, companyId: null })).toEqual([]);
  });
});

describe("roles and the development invite sender", () => {
  it("keeps register order and knows the four roles", () => {
    expect(canonicalRoles(["CompanyAdmin", "ListAgent", "ListAgent"])).toEqual([
      "ListAgent",
      "CompanyAdmin",
    ]);
    expect(isRole("TeamLead")).toBe(true);
    expect(isRole("Owner")).toBe(false);
    expect(isRole(3)).toBe(false);
  });

  it("prints the invitation and appends it to the outbox", async () => {
    const dir = mkdtempSync(join(tmpdir(), "thu-moi-"));
    const outbox = join(dir, "outbox.jsonl");
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    await devInviteSender(outbox)({
      email: "r@example.test",
      companyName: "[Công ty A]",
      inviterName: "[Tên] P",
      roles: ["ListAgent"],
      origin: "http://127.0.0.1:3485",
    });
    await devInviteSender()({
      email: "q@example.test",
      companyName: "x",
      inviterName: "y",
      roles: [],
      origin: "z",
    });
    expect(log).toHaveBeenCalledTimes(2);
    const line = JSON.parse(readFileSync(outbox, "utf8").trim()) as { kind: string; email: string };
    expect(line).toMatchObject({ kind: "invite", email: "r@example.test" });
    rmSync(dir, { recursive: true, force: true });
  });
});
