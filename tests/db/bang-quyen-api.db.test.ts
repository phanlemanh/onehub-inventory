// Permission table at the API (row 9a, _acceptance/bang-quyen-theo-vai/evals.yaml E3). Every person signs in through the
// real sign-in handlers of row 8 and calls the real members handlers of row 9; the database is this lane's Postgres.
import { afterEach, describe, expect, it } from "vitest";

import { ACTIONS, type ActionSpec } from "@/generated/ontology";
import { createAuthHandlers } from "@/modules/identity/http";
import { captureInviteSender } from "@/modules/identity/invite-mail";
import type { LoginDeps } from "@/modules/identity/login";
import type { MembersDeps } from "@/modules/identity/members";
import { createMembersHandlers } from "@/modules/identity/members-http";
import { captureSender } from "@/modules/identity/sender";
import { openDoor } from "@/modules/identity/action-door";
import { tokenFrom } from "@/modules/identity/http";
import { withCompany } from "@/modules/identity/with-company";
import { createCompanyLayerHandlers } from "@/modules/company-config/company-layer-http";
import { createFeeScheduleHandlers } from "@/modules/company-config/fee-schedule-http";
import { createSavedViewsHandlers } from "@/modules/listings/saved-views-http";

import {
  doorScope,
  dropWorld,
  liveRows,
  ROLE_OF,
  world,
  type Person,
  type World,
} from "./bang-quyen-world";
import { count } from "./helpers";

const ORIGIN = "http://127.0.0.1:3485";
// Written before the code (evals.yaml): 3 API doors × 4 roles; plus row 2c's 4 saved-view doors × 4 roles; plus row
// 7e's 5 company-layer doors × 4 roles; plus row 19's 2 fee-schedule doors × 4 roles.
const API_CELLS = 56;

const worlds: World[] = [];
afterEach(async () => {
  for (const w of worlds.splice(0)) await dropWorld(w);
});

function req(url: string, method: string, body?: unknown, cookie?: string): Request {
  return new Request(url, {
    method,
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

async function apiWorld(suffix: string) {
  const w = await world(suffix);
  worlds.push(w);
  const code = captureSender();
  const invite = captureInviteSender();
  const deps: LoginDeps & MembersDeps = {
    pool: w.pool,
    secret: "test-secret-bang-quyen",
    sender: code.sender,
    invite: invite.sender,
  };
  const auth = createAuthHandlers(() => deps);
  const members = createMembersHandlers(() => deps);
  // Row 7e: the company layer through the same door.
  const layer = createCompanyLayerHandlers({
    door: (r, action) => openDoor(() => w.pool, tokenFrom(r), action),
    withCompany,
  });
  // Row 19: the fee schedule through the same door.
  const fees = createFeeScheduleHandlers({
    door: (r, action) => openDoor(() => w.pool, tokenFrom(r), action),
    withCompany,
  });
  // Row 2c: saved views through the identity module's shared door.
  const views = createSavedViewsHandlers({
    door: (r, action) => openDoor(() => w.pool, tokenFrom(r), action),
    withCompany,
  });
  const NO_VIEW = "00000000-0000-4000-8000-0000000000ff";
  const EMPTY_VIEW = { filters: {}, sort: [], grouped: false, hidden: [] };
  const signIn = async (who: Person, company: string): Promise<string> => {
    const email = w.email[who];
    await auth.requestCode(req(`${ORIGIN}/api/v1/auth/code`, "POST", { email }));
    const mail = [...code.sent].reverse().find((m) => m.email === email);
    const otp = mail?.text.match(/\b\d{6}\b/)?.[0];
    const res = await auth.verifyCode(
      req(`${ORIGIN}/api/v1/auth/session`, "POST", { email, code: otp }),
    );
    if (!res.ok) throw new Error(`đăng nhập ${who} trả ${res.status}`);
    const cookie = (res.headers.get("set-cookie") ?? "").split(";")[0]!;
    const json = (await res.json()) as { company: { id: string } | null };
    if (json.company?.id !== company) {
      const chosen = await auth.chooseCompany(
        req(`${ORIGIN}/api/v1/auth/session/company`, "PUT", { companyId: company }, cookie),
      );
      if (!chosen.ok) throw new Error(`chọn sàn của ${who} trả ${chosen.status}`);
    }
    return cookie;
  };
  /** Calls one API door as the signed-in person. */
  const call = (door: string, cookie: string, n: number): Promise<Response> => {
    switch (door) {
      case "GET /api/v1/members":
        return members.list(req(`${ORIGIN}/api/v1/members`, "GET", undefined, cookie));
      case "POST /api/v1/members":
        return members.invite(
          req(
            `${ORIGIN}/api/v1/members`,
            "POST",
            { email: `moi-${n}@example.test`, name: "[Tên] Mới", roles: ["ListAgent"] },
            cookie,
          ),
        );
      case "PUT /api/v1/members/[id]/roles":
        return members.setRoles(
          req(`${ORIGIN}/api/v1/members/${w.id.LA}/roles`, "PUT", { roles: ["ListAgent"] }, cookie),
          w.id.LA,
        );
      case "GET /api/v1/saved-views":
        return views.list(
          req(`${ORIGIN}/api/v1/saved-views?screen=inventory`, "GET", undefined, cookie),
        );
      case "POST /api/v1/saved-views":
        return views.save(
          req(
            `${ORIGIN}/api/v1/saved-views`,
            "POST",
            { screen: "inventory", name: `Góc nhìn ${n}`, view: EMPTY_VIEW },
            cookie,
          ),
        );
      case "PATCH /api/v1/saved-views/[id]":
        return views.edit(
          req(`${ORIGIN}/api/v1/saved-views/${NO_VIEW}`, "PATCH", { name: `Đổi ${n}` }, cookie),
          NO_VIEW,
        );
      case "DELETE /api/v1/saved-views/[id]":
        return views.remove(
          req(`${ORIGIN}/api/v1/saved-views/${NO_VIEW}`, "DELETE", undefined, cookie),
          NO_VIEW,
        );
      // Row 7e: a label that does not exist is changed and retired — allowed answers 404, refused answers 403.
      case "GET /api/v1/company-layer":
        return layer.read(req(`${ORIGIN}/api/v1/company-layer`, "GET", undefined, cookie));
      case "POST /api/v1/company-layer/[part]":
        return layer.add(
          req(
            `${ORIGIN}/api/v1/company-layer/pending-units`,
            "POST",
            { rawCode: `SA5-${n}` },
            cookie,
          ),
          "pending-units",
        );
      case "PATCH /api/v1/company-layer/[part]/[id]":
        return layer.edit(
          req(`${ORIGIN}/api/v1/company-layer/labels/0`, "PATCH", { label: `Lô ${n}` }, cookie),
          "labels",
          "0",
        );
      case "POST /api/v1/company-layer/[part]/[id]/retire":
        return layer.retire(
          req(`${ORIGIN}/api/v1/company-layer/labels/0/retire`, "POST", undefined, cookie),
          "labels",
          "0",
        );
      case "POST /api/v1/company-layer/pending-units/match":
        return layer.match(
          req(`${ORIGIN}/api/v1/company-layer/pending-units/match`, "POST", undefined, cookie),
        );
      // Row 19: the default schedule, saved as it is — allowed answers 200 and writes nothing.
      case "GET /api/v1/company/fee-schedule":
        return fees.read(req(`${ORIGIN}/api/v1/company/fee-schedule`, "GET", undefined, cookie));
      case "PUT /api/v1/company/fee-schedule":
        return fees.save(
          req(
            `${ORIGIN}/api/v1/company/fee-schedule`,
            "PUT",
            {
              items: [
                { code: "pit", rateBasisPoints: 200, included: true },
                { code: "registration", rateBasisPoints: 50, included: true },
                { code: "brokerage", rateBasisPoints: 100, included: true },
              ],
            },
            cookie,
          ),
        );
      default:
        throw new Error(`api-theo-bang: không biết gọi cửa ${door}`);
    }
  };
  return { w, signIn, call };
}

type Seen = "allowed" | "forbidden";

/** Every live API door × every person of A (X like a ListAgent): 403 with one body and no write, or not 403. */
async function checkApiCells(
  table: readonly ActionSpec[],
): Promise<{ matched: number; total: number; failures: string[] }> {
  const { w, signIn, call } = await apiWorld("api");
  const failures: string[] = [];
  let matched = 0;
  let total = 0;
  let n = 0;
  const cookies = new Map<Person, string>();
  for (const who of ["LA", "BA", "TL", "CA", "X"] as const)
    cookies.set(who, await signIn(who, w.A));
  const people = () => count(w.db.owner, "select count(*) as n from company_members");
  const users = () => count(w.db.owner, "select count(*) as n from identity.users");
  const seen = async (who: Person, door: string): Promise<Seen> => {
    const [m0, u0] = [await people(), await users()];
    const res = await call(door, cookies.get(who)!, (n += 1));
    if (res.status !== 403) return "allowed";
    const body = await res.text();
    if (body !== '{"error":"forbidden"}')
      failures.push(`api-theo-bang: thân lời khác ở ${door} cho ${who}: ${body}`);
    if ((await people()) !== m0 || (await users()) !== u0)
      failures.push(`api-theo-bang: ${door} bị từ chối mà vẫn ghi`);
    return "forbidden";
  };
  for (const a of liveRows(table)) {
    for (const door of a.doors.api) {
      for (const who of ["LA", "BA", "TL", "CA"] as const) {
        total += 1;
        const want: Seen = doorScope(table, door, ROLE_OF[who], "api") ? "allowed" : "forbidden";
        if ((await seen(who, door)) === want) matched += 1;
        else failures.push(`api-theo-bang: ${a.name} × ${ROLE_OF[who]}`);
      }
      const la: Seen = doorScope(table, door, "ListAgent", "api") ? "allowed" : "forbidden";
      if ((await seen("X", door)) !== la) failures.push(`api-theo-bang: X × ${a.name}`);
    }
  }
  // Y signs in to B: the list shows B's people only.
  const listB = await call("GET /api/v1/members", await signIn("Y", w.B), 0);
  const ids = ((await listB.json()) as { members: { userId: string }[] }).members
    .map((m) => m.userId)
    .sort();
  if (JSON.stringify(ids) !== JSON.stringify([w.id.X, w.id.Y].sort()))
    failures.push("api-theo-bang: người sàn B thấy người ngoài B");
  return { matched, total, failures };
}

describe("api-theo-bang", () => {
  it("every live API door × every role answers as its cell, with one 403 body and no write", async () => {
    const r = await checkApiCells(ACTIONS);
    console.log(`api-theo-bang: ${r.matched}/${r.total} ô khớp`);
    expect(r.failures).toEqual([]);
    expect(r.total).toBe(API_CELLS);
    expect(r.matched).toBe(API_CELLS);
  });

  it("break pha-thu-doi-o: one cell changed in a copy of the table names it", async () => {
    const changed = ACTIONS.map((a) =>
      a.name === "inviteMember" ? { ...a, scope: { ...a.scope, TeamLead: "company" as const } } : a,
    );
    expect((await checkApiCells(changed)).failures).toEqual([
      "api-theo-bang: inviteMember × TeamLead",
    ]);
  });
});
