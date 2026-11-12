// Saved views at the API and in the database (row 2c, _acceptance/luu-goc-nhin-cot-hai/evals.yaml E1, E8, E11). People
// sign in through the real sign-in handlers of row 8 and call the real saved-view handlers through the identity
// module's shared door; the database is this lane's Postgres. Each check returns its failures as pinned lines, so the
// same check runs on a clean scratch database (no failure) and on a broken one (the pinned line).
import { afterEach, describe, expect, it } from "vitest";

import { openDoor } from "@/modules/identity/action-door";
import { createAuthHandlers, tokenFrom } from "@/modules/identity/http";
import type { LoginDeps } from "@/modules/identity/login";
import type { ActionName } from "@/modules/identity/permissions";
import { captureSender } from "@/modules/identity/sender";
import { withCompany } from "@/modules/identity/with-company";
import type { SavedView, SavedViewState } from "@/modules/listings/saved-view";
import { listSavedViews, readSavedView, type RunAs } from "@/modules/listings/saved-views";
import { createSavedViewsHandlers } from "@/modules/listings/saved-views-http";

import { dropWorld, world, type Person, type World } from "./bang-quyen-world";
import { count } from "./helpers";

const ORIGIN = "http://127.0.0.1:3485";

const worlds: World[] = [];
afterEach(async () => {
  for (const w of worlds.splice(0)) await dropWorld(w);
});

// Written before the code (E1): a view with all five things set.
const VIEW: SavedViewState = {
  query: "S1",
  filters: { "Listing.buildingName": ["S1.01"], "Listing.standardStatus": ["Active"] },
  sort: [{ field: "Listing.listPrice", direction: "desc" }],
  grouped: true,
  hidden: ["Listing.subdivisionName", "Listing.lastConfirmedAt"],
};
const FIVE = ["query", "filters", "sort", "grouped", "hidden"] as const;
const OTHER_VIEW: SavedViewState = {
  query: "",
  filters: { "Unit.bedroomsTotal": "2" },
  sort: [],
  grouped: false,
  hidden: [],
};

function req(url: string, method: string, body?: unknown, cookie?: string): Request {
  return new Request(url, {
    method,
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

/** Who acts in these tests: A and B of company A (list agent, buyer agent), C a list agent of company B. */
type Who = "A" | "B" | "C" | Person;

async function viewWorld(suffix: string, breakFile?: string) {
  const w = await world(`goc_nhin_${suffix}`, breakFile);
  worlds.push(w);
  const o = w.db.owner;
  const cId = (
    await o.query<{ id: string }>(
      "insert into identity.users (email, name) values ('c@example.test', '[Tên] C') returning id",
    )
  ).rows[0]!.id;
  await o.query(
    "insert into company_members (company_id, user_id, name, roles) values ($1, $2, '[Tên]', '{ListAgent}')",
    [w.B, cId],
  );
  const code = captureSender();
  const deps: LoginDeps = { pool: w.pool, secret: "test-secret-goc-nhin", sender: code.sender };
  const auth = createAuthHandlers(() => deps);
  const door = (r: Request, action: ActionName) => openDoor(() => w.pool, tokenFrom(r), action);
  const h = createSavedViewsHandlers({ door, withCompany });

  const emailOf = (who: Who) =>
    who === "A"
      ? w.email.LA
      : who === "B"
        ? w.email.BA
        : who === "C"
          ? "c@example.test"
          : w.email[who];
  const companyOf = (who: Who) => (who === "C" ? w.B : w.A);
  const idOf = (who: Who) =>
    who === "A" ? w.id.LA : who === "B" ? w.id.BA : who === "C" ? cId : w.id[who];
  const cookies = new Map<Who, string>();
  const cookie = async (who: Who): Promise<string> => {
    const have = cookies.get(who);
    if (have) return have;
    const email = emailOf(who);
    await auth.requestCode(req(`${ORIGIN}/api/v1/auth/code`, "POST", { email }));
    const mail = [...code.sent].reverse().find((m) => m.email === email);
    const otp = mail?.text.match(/\b\d{6}\b/)?.[0];
    const res = await auth.verifyCode(
      req(`${ORIGIN}/api/v1/auth/session`, "POST", { email, code: otp }),
    );
    if (!res.ok) throw new Error(`đăng nhập ${who} trả ${res.status}`);
    const c = (res.headers.get("set-cookie") ?? "").split(";")[0]!;
    const json = (await res.json()) as { company: { id: string } | null };
    if (json.company?.id !== companyOf(who)) {
      const chosen = await auth.chooseCompany(
        req(`${ORIGIN}/api/v1/auth/session/company`, "PUT", { companyId: companyOf(who) }, c),
      );
      if (!chosen.ok) throw new Error(`chọn sàn của ${who} trả ${chosen.status}`);
    }
    cookies.set(who, c);
    return c;
  };

  const url = `${ORIGIN}/api/v1/saved-views`;
  const api = {
    list: async (who: Who) =>
      h.list(req(`${url}?screen=inventory`, "GET", undefined, await cookie(who))),
    save: async (who: Who, name: string, view: unknown = VIEW) =>
      h.save(req(url, "POST", { screen: "inventory", name, view }, await cookie(who))),
    edit: async (who: Who, id: string, change: unknown) =>
      h.edit(req(`${url}/${id}`, "PATCH", change, await cookie(who)), id),
    remove: async (who: Who, id: string) =>
      h.remove(req(`${url}/${id}`, "DELETE", undefined, await cookie(who)), id),
    /** Runs `fn` as `who` through the shared door for `action`, the way the server pages do. */
    as: async <T>(who: Who, action: ActionName, fn: (run: RunAs, userId: string) => Promise<T>) => {
      const d = await door(req(url, "GET", undefined, await cookie(who)), action);
      if (typeof d === "string") return d;
      return fn((f) => withCompany(w.pool, d.ctx, f), d.ctx.userId);
    },
  };
  const rows = () => count(o, "select count(*) as n from saved_view");
  const stored = async (id: string) =>
    (
      await o.query<{ company_id: string; user_id: string; name: string; view: SavedViewState }>(
        "select company_id, user_id, name, view from saved_view where id = $1",
        [id],
      )
    ).rows[0];
  return { w, api, idOf, rows, stored };
}
type ViewWorld = Awaited<ReturnType<typeof viewWorld>>;

async function saved(
  v: ViewWorld,
  who: Who,
  name: string,
  view: unknown = VIEW,
): Promise<SavedView> {
  const res = await v.api.save(who, name, view);
  if (res.status !== 201) throw new Error(`lưu «${name}» của ${who} trả ${res.status}`);
  return ((await res.json()) as { view: SavedView }).view;
}

// ---- save (E1): the server keeps all five things of the view, for the right person and company

async function checkStored(
  v: ViewWorld,
  id: string,
  who: Who,
  name: string,
  sent: SavedViewState,
): Promise<{ compared: number; failures: string[] }> {
  const row = await v.stored(id);
  if (!row) return { compared: 0, failures: ["saved view missing"] };
  const failures: string[] = [];
  if (row.company_id !== v.w.A) failures.push("saved view stored under wrong company");
  if (row.user_id !== v.idOf(who)) failures.push("saved view stored under wrong person");
  if (row.name !== name) failures.push("saved view stored under wrong name");
  let compared = 0;
  for (const k of FIVE) {
    compared += 1;
    if (JSON.stringify(row.view[k]) !== JSON.stringify(sent[k]))
      failures.push(`saved view lost part: ${k}`);
  }
  return { compared, failures };
}

describe("save", () => {
  it("POST keeps the five things of the view for the saver in the saver's company", async () => {
    const v = await viewWorld("luu");
    const g = await saved(v, "A", "Toà S1 đang bán");
    const r = await checkStored(v, g.id, "A", "Toà S1 đang bán", VIEW);
    expect(r.failures).toEqual([]);
    expect(r.compared).toBe(5);
    expect(g).toEqual({ id: g.id, screen: "inventory", name: "Toà S1 đang bán", view: VIEW });
  });

  it("a view without its sort is refused at the door and nothing is stored", async () => {
    const v = await viewWorld("luu_thieu");
    const noSort = Object.fromEntries(Object.entries(VIEW).filter(([k]) => k !== "sort"));
    const res = await v.api.save("A", "Thiếu sắp xếp", noSort);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "bad-request" });
    expect(await v.rows()).toBe(0);
  });

  it("break: a stored view that lost its sort is named", async () => {
    const v = await viewWorld("luu_mat_sap");
    const g = await saved(v, "A", "Toà S1");
    await v.w.db.owner.query(
      "update saved_view set view = jsonb_set(view, '{sort}', '[]'::jsonb) where id = $1",
      [g.id],
    );
    expect((await checkStored(v, g.id, "A", "Toà S1", VIEW)).failures).toEqual([
      "saved view lost part: sort",
    ]);
  });

  it("break: a view stored under another company is named", async () => {
    const v = await viewWorld("luu_sai_san");
    const g = await saved(v, "A", "Toà S1");
    await v.w.db.owner.query("update saved_view set company_id = $1 where id = $2", [v.w.B, g.id]);
    expect((await checkStored(v, g.id, "A", "Toà S1", VIEW)).failures).toEqual([
      "saved view stored under wrong company",
    ]);
  });
});

// ---- who sees a saved view (E8)

type Lister = (run: RunAs, userId: string) => Promise<SavedView[]>;
type Overwriter = (v: ViewWorld, who: Who, id: string) => Promise<number>;

const ownList: Lister = (run, userId) => listSavedViews(run, userId, "inventory");
/** The product's save-changes path: PATCH through the API. */
const apiOverwrite: Overwriter = async (v, who, id) =>
  (await v.api.edit(who, id, { view: OTHER_VIEW })).status;

const ACTS = ["list", "read", "rename", "overwrite", "remove"] as const;
type Act = (typeof ACTS)[number];
// Written before the code: 3 people × 5 actions = 15 cells. «ok» is the saver's own; «hidden» is the view absent from
// the list or a 404; «refused» is 403 or 404 with the row left as it was.
const WANT: Record<"A" | "B" | "C", Record<Act, "ok" | "hidden" | "refused">> = {
  A: { list: "ok", read: "ok", rename: "ok", overwrite: "ok", remove: "ok" },
  B: { list: "hidden", read: "hidden", rename: "refused", overwrite: "refused", remove: "refused" },
  C: { list: "hidden", read: "hidden", rename: "refused", overwrite: "refused", remove: "refused" },
};

async function checkWhoSees(
  v: ViewWorld,
  lister: Lister = ownList,
  overwrite: Overwriter = apiOverwrite,
): Promise<{ cells: number; failures: string[] }> {
  const failures: string[] = [];
  let cells = 0;
  const g = await saved(v, "A", "Của A");
  const before = await v.stored(g.id);
  const untouched = async () => JSON.stringify(await v.stored(g.id)) === JSON.stringify(before);
  for (const who of ["B", "C", "A"] as const) {
    for (const act of ACTS) {
      cells += 1;
      let got: "ok" | "hidden" | "refused" | string;
      switch (act) {
        case "list": {
          const seen = await v.api.as(who, "listSavedViews", lister);
          got = typeof seen === "string" ? seen : seen.some((x) => x.id === g.id) ? "ok" : "hidden";
          if (who !== "A" && got === "ok") failures.push("saved view visible to another member");
          break;
        }
        case "read": {
          const one = await v.api.as(who, "listSavedViews", (run, userId) =>
            readSavedView(run, userId, g.id),
          );
          got = typeof one === "string" ? one : one ? "ok" : "hidden";
          break;
        }
        case "rename":
        case "overwrite":
        case "remove": {
          const status =
            act === "rename"
              ? (await v.api.edit(who, g.id, { name: `Đổi bởi ${who}` })).status
              : act === "overwrite"
                ? await overwrite(v, who, g.id)
                : who === "A"
                  ? 0 // the saver removes last, after the matrix
                  : (await v.api.remove(who, g.id)).status;
          if (who === "A") got = status === 200 || status === 0 ? "ok" : `?${status}`;
          else if ([403, 404].includes(status) && (await untouched())) got = "refused";
          else {
            got = `?${status}`;
            if (act === "overwrite") failures.push("saved view overwritten by another member");
          }
          break;
        }
      }
      if (got !== WANT[who][act])
        failures.push(`who-sees: ${who} × ${act} (muốn ${WANT[who][act]}, thấy ${got})`);
    }
  }
  const removed = await v.api.remove("A", g.id);
  if (removed.status !== 200 || (await v.stored(g.id)) !== undefined)
    failures.push("who-sees: A × remove (the saver could not remove)");
  return { cells, failures };
}

// Written before the code: 4 roles × 4 actions = 16 cells; CompanyAdmin holds none.
const ROLES = ["LA", "BA", "TL", "CA"] as const;

async function checkRoles(v: ViewWorld): Promise<{ cells: number; failures: string[] }> {
  const failures: string[] = [];
  let cells = 0;
  for (const who of ROLES) {
    const allowed = who !== "CA";
    // Each allowed person works on a view of their own; CompanyAdmin aims at the list agent's.
    const own = allowed ? await saved(v, who, `Của ${who}`) : null;
    const target = own?.id ?? (await saved(v, "LA", `Mục tiêu ${who}`)).id;
    const n0 = await v.rows();
    const before = JSON.stringify(await v.stored(target));
    const calls: [string, () => Promise<Response>, number][] = [
      ["list", () => v.api.list(who), 200],
      ["save", () => v.api.save(who, `Mới của ${who}`), 201],
      ["edit", () => v.api.edit(who, target, { name: `Sửa của ${who}` }), 200],
      ["remove", () => v.api.remove(who, target), 200],
    ];
    for (const [act, call, ok] of calls) {
      cells += 1;
      const res = await call();
      if (allowed) {
        if (res.status !== ok)
          failures.push(`roles: ${who} × ${act} (muốn ${ok}, thấy ${res.status})`);
      } else {
        const body = await res.text();
        if (res.status !== 403 || body !== '{"error":"forbidden"}')
          failures.push(`roles: ${who} × ${act} (muốn 403 forbidden, thấy ${res.status} ${body})`);
      }
    }
    if (!allowed && ((await v.rows()) !== n0 || JSON.stringify(await v.stored(target)) !== before))
      failures.push("roles: CompanyAdmin bị từ chối mà bảng vẫn đổi");
  }
  return { cells, failures };
}

describe("who sees a saved view", () => {
  it("only the saver lists, opens, renames, overwrites and removes it: 3 × 5 = 15 cells", async () => {
    const v = await viewWorld("ai_thay");
    const r = await checkWhoSees(v);
    expect(r.failures).toEqual([]);
    expect(r.cells).toBe(15);
  });

  it("roles: list agent, buyer agent and team lead may; company admin gets 403 and nothing changes: 4 × 4 = 16", async () => {
    const v = await viewWorld("vai");
    const r = await checkRoles(v);
    expect(r.failures).toEqual([]);
    expect(r.cells).toBe(16);
  });

  it("the table read straight under the API role in another company's context gives no row", async () => {
    const v = await viewWorld("thang_bang");
    await saved(v, "A", "Của A");
    const n = await withCompany(v.w.pool, { userId: v.w.id.LA, companyId: v.w.B }, async (c) => {
      const { rows } = await c.query("select count(*)::int as n from saved_view");
      return (rows[0] as { n: number }).n;
    });
    expect(n).toBe(0);
    expect(await v.rows()).toBe(1);
  });

  it("break: a list without the saver, on a table without its own-read policy, is named", async () => {
    const v = await viewWorld("pha_doc", "goc-nhin-doc-khong-kiem-nguoi");
    const everyone: Lister = (run) =>
      run(async (c) => {
        const { rows } = await c.query("select id, screen, name, view from saved_view");
        return rows as SavedView[];
      });
    expect((await checkWhoSees(v, everyone)).failures).toContain(
      "saved view visible to another member",
    );
  });

  it("break: a save-changes statement without the saver, on a table without its own policies, is named", async () => {
    const v = await viewWorld("pha_sua", "goc-nhin-sua-khong-kiem-nguoi");
    const anyone: Overwriter = async (vw, who, id) => {
      const r = await vw.api.as(who, "editView", (run) =>
        run(
          async (c) =>
            (
              await c.query("update saved_view set view = $2 where id = $1", [
                id,
                JSON.stringify(OTHER_VIEW),
              ])
            ).rowCount,
        ),
      );
      return r === 1 ? 200 : 404;
    };
    expect((await checkWhoSees(v, ownList, anyone)).failures).toContain(
      "saved view overwritten by another member",
    );
  });
});

// ---- name rules at the API (E11): the seven cases of E10, straight at POST and PATCH

// Written before the code: name → status and error code, against A's own «Toà S1».
const NAMES: [string, number, string | null][] = [
  ["", 400, "name-empty"],
  ["   ", 400, "name-empty"],
  ["a".repeat(41), 400, "name-too-long"],
  ["toà s1", 400, "name-taken"],
  ["Căn rẻ", 0, null], // B's name: A may use it too
  ["b".repeat(40), 0, null],
  ["Đầu chủ — Phố Huế ưu tiên", 0, null],
];

type Post = (name: string) => Promise<Response>;

async function checkNames(
  v: ViewWorld,
  post: Post,
): Promise<{ cases: number; failures: string[] }> {
  const failures: string[] = [];
  let cases = 0;
  for (const [name, status, code] of NAMES) {
    cases += 1;
    const n0 = await v.rows();
    const res = await post(name);
    if (code === null) {
      if (res.status !== 201) failures.push(`names: POST «${name}» (muốn 201, thấy ${res.status})`);
      continue;
    }
    if (name.trim() === "" && res.status < 300) failures.push("server accepted empty name");
    const body = res.status < 300 ? null : ((await res.json()) as { error: string }).error;
    if (res.status !== status || body !== code)
      failures.push(`names: POST «${name}» (muốn ${status} ${code}, thấy ${res.status} ${body})`);
    if ((await v.rows()) !== n0) failures.push(`names: POST «${name}» bị từ chối mà vẫn thêm dòng`);
  }
  return { cases, failures };
}

describe("name rules at the API", () => {
  it("POST: four wrong names get 400 with their code and no row, three right ones get 201", async () => {
    const v = await viewWorld("ten_post");
    await saved(v, "A", "Toà S1");
    await saved(v, "B", "Căn rẻ");
    const r = await checkNames(v, (name) => v.api.save("A", name));
    expect(r.failures).toEqual([]);
    expect(r.cases).toBe(7);
  });

  it("PATCH: the same seven cases on a rename", async () => {
    const v = await viewWorld("ten_patch");
    await saved(v, "A", "Toà S1");
    await saved(v, "B", "Căn rẻ");
    const failures: string[] = [];
    for (const [i, [name, status, code]] of NAMES.entries()) {
      const g = await saved(v, "A", `Đổi tên ${i}`);
      const res = await v.api.edit("A", g.id, { name });
      const want = code === null ? 200 : status;
      const body = res.status < 300 ? null : ((await res.json()) as { error: string }).error;
      if (res.status !== want || body !== code)
        failures.push(`names: PATCH «${name}» (muốn ${want} ${code}, thấy ${res.status} ${body})`);
      const row = await v.stored(g.id);
      if (code !== null && row?.name !== g.name)
        failures.push(`names: PATCH «${name}» vẫn đổi tên`);
      await v.api.remove("A", g.id);
    }
    expect(failures).toEqual([]);
  });

  it("two people of the same company may use the same name", async () => {
    const v = await viewWorld("ten_hai_nguoi");
    await saved(v, "A", "Toà S1");
    expect((await v.api.save("B", "Toà S1")).status).toBe(201);
    expect((await v.api.save("B", "TOÀ S1")).status).toBe(400);
  });

  it("break: a server that skips the name rule, on a table without its name check, is named", async () => {
    const v = await viewWorld("pha_ten", "goc-nhin-ten-trong");
    await saved(v, "A", "Toà S1");
    await saved(v, "B", "Căn rẻ");
    const loose: Post = async (name) => {
      const r = await v.api.as("A", "saveView", (run, userId) =>
        run(
          async (c) =>
            (
              await c.query(
                "insert into saved_view (company_id, user_id, screen, name, view) values ($1, $2, 'inventory', $3, $4)",
                [v.w.A, userId, name, JSON.stringify(VIEW)],
              )
            ).rowCount,
        ).catch(() => 0),
      );
      return new Response(r === 1 ? "{}" : '{"error":"x"}', { status: r === 1 ? 201 : 400 });
    };
    expect((await checkNames(v, loose)).failures).toContain("server accepted empty name");
  });
});
