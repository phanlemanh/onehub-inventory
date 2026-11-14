// Row 19 (thue-phi), evals E3, E4, E7-db and AC-10 at the API and in the database: the fee schedule through the identity
// module's door, withCompany, under the API role, on this lane's Postgres. Company A holds the people of the
// permission-table world (LA, BA, TL, CA); Y is CompanyAdmin of B.
import { afterEach, describe, expect, it } from "vitest";

import { createFeeScheduleHandlers } from "@/modules/company-config/fee-schedule-http";
import { openDoor } from "@/modules/identity/action-door";
import { createAuthHandlers, tokenFrom } from "@/modules/identity/http";
import type { LoginDeps } from "@/modules/identity/login";
import type { ActionName } from "@/modules/identity/permissions";
import { captureSender } from "@/modules/identity/sender";
import { withCompany } from "@/modules/identity/with-company";

import { asPerson, dropWorld, world, type Person, type World } from "./bang-quyen-world";

const worlds: World[] = [];
afterEach(async () => {
  for (const w of worlds.splice(0)) await dropWorld(w);
});

const ORIGIN = "http://127.0.0.1:3485";
const URL_ = `${ORIGIN}/api/v1/company/fee-schedule`;
function req(method: string, body?: unknown, cookie?: string): Request {
  return new Request(URL_, {
    method,
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

async function apiWorld(suffix: string) {
  const w = await world(`thue_phi_${suffix}`);
  worlds.push(w);
  const code = captureSender();
  const deps: LoginDeps = { pool: w.pool, secret: "test-secret-thue-phi", sender: code.sender };
  const auth = createAuthHandlers(() => deps);
  const door = (r: Request, action: ActionName) => openDoor(() => w.pool, tokenFrom(r), action);
  const h = createFeeScheduleHandlers({ door, withCompany });
  const cookies = new Map<string, string>();
  const cookie = async (who: Person, company = w.A): Promise<string> => {
    const key = who + company;
    const have = cookies.get(key);
    if (have) return have;
    const email = w.email[who];
    const post = (url: string, method: string, body: unknown, c?: string) =>
      new Request(url, {
        method,
        headers: { "content-type": "application/json", ...(c ? { cookie: c } : {}) },
        body: JSON.stringify(body),
      });
    await auth.requestCode(post(`${ORIGIN}/api/v1/auth/code`, "POST", { email }));
    const mail = [...code.sent].reverse().find((m) => m.email === email);
    const otp = mail?.text.match(/\b\d{6}\b/)?.[0];
    const res = await auth.verifyCode(
      post(`${ORIGIN}/api/v1/auth/session`, "POST", { email, code: otp }),
    );
    if (!res.ok) throw new Error(`đăng nhập ${who} trả ${res.status}`);
    const c = (res.headers.get("set-cookie") ?? "").split(";")[0]!;
    const json = (await res.json()) as { company: { id: string } | null };
    if (json.company?.id !== company) {
      const chosen = await auth.chooseCompany(
        post(`${ORIGIN}/api/v1/auth/session/company`, "PUT", { companyId: company }, c),
      );
      if (!chosen.ok) throw new Error(`chọn sàn của ${who} trả ${chosen.status}`);
    }
    cookies.set(key, c);
    return c;
  };
  return { w, h, cookie };
}

interface Item {
  code: string;
  kind: string;
  name: string;
  rateBasisPoints: number;
  included: boolean;
  source: { kind: string; by?: string };
}
const items = async (res: Response): Promise<Item[]> =>
  ((await res.json()) as { items: Item[] }).items;
const draftOf = (list: Item[]) =>
  list.map((i) => ({
    code: i.code,
    ...(i.kind === "Own" && i.source.kind !== "default" ? { name: i.name } : {}),
    rateBasisPoints: i.rateBasisPoints,
    included: i.included,
  }));
const LAW = (pit = true, registration = true) => [
  { code: "pit", rateBasisPoints: 200, included: pit },
  { code: "registration", rateBasisPoints: 50, included: registration },
];
const rowsOf = async (w: World) =>
  (
    await w.db.owner.query(
      `select company_id, code, kind, name, rate_bp, included, removed, changed_by, retired_by, retired_at is not null as retired
         from company_fee_items order by id`,
    )
  ).rows;

describe("luu-mot-dong (E3)", () => {
  it("one PUT saves the whole schedule; only changed items get a row; reset brings an item back", async () => {
    const { w, h, cookie } = await apiWorld("luu");
    const c = await cookie("CA");
    const before = await items(await h.read(req("GET", undefined, c)));
    expect(before.map((i) => [i.code, i.rateBasisPoints, i.included, i.source.kind])).toEqual([
      ["pit", 200, true, "default"],
      ["registration", 50, true, "default"],
      ["brokerage", 100, true, "default"],
    ]);
    const put = await h.save(
      req(
        "PUT",
        {
          items: [...LAW(true, false), { code: "brokerage", rateBasisPoints: 200, included: true }],
        },
        c,
      ),
    );
    expect(put.status).toBe(200);
    const after = await items(await h.read(req("GET", undefined, c)));
    expect(after.map((i) => [i.code, i.rateBasisPoints, i.included, i.source.kind])).toEqual([
      ["pit", 200, true, "default"],
      ["registration", 50, false, "changed"],
      ["brokerage", 200, true, "changed"],
    ]);
    const rows = await rowsOf(w);
    expect(
      rows.map((r) => [r.company_id, r.code, r.rate_bp, r.included, r.changed_by, r.retired]),
    ).toEqual([
      [w.A, "registration", 50, false, w.id.CA, false],
      [w.A, "brokerage", 200, true, w.id.CA, false],
    ]);
    // The same schedule again writes nothing.
    await h.save(req("PUT", { items: draftOf(after) }, c));
    expect(await rowsOf(w)).toHaveLength(2);
    // Brokerage back to its default: its row is retired with who, and the item reads as default.
    await h.save(
      req(
        "PUT",
        {
          items: [...LAW(true, false), { code: "brokerage", rateBasisPoints: 100, included: true }],
        },
        c,
      ),
    );
    const reset = await items(await h.read(req("GET", undefined, c)));
    expect(reset[2]).toMatchObject({
      code: "brokerage",
      rateBasisPoints: 100,
      source: { kind: "default" },
    });
    const brokerageRows = (await rowsOf(w)).filter((r) => r.code === "brokerage");
    expect(brokerageRows.map((r) => [r.retired, r.retired_by])).toEqual([[true, w.id.CA]]);
  });
});

describe("sai-khong-ghi (E3)", () => {
  it("three wrong schedules answer 400 naming the item and change nothing", async () => {
    const { w, h, cookie } = await apiWorld("sai");
    const c = await cookie("CA");
    await h.save(
      req(
        "PUT",
        { items: [...LAW(), { code: "brokerage", rateBasisPoints: 150, included: true }] },
        c,
      ),
    );
    const BAD: [string, unknown[], { problem: string; code?: string | null }[]][] = [
      [
        "600",
        [...LAW(), { code: "brokerage", rateBasisPoints: 600, included: true }],
        [{ problem: "rate-above-max", code: "brokerage" }],
      ],
      [
        "125",
        [...LAW(), { code: "brokerage", rateBasisPoints: 125, included: true }],
        [{ problem: "rate-step", code: "brokerage" }],
      ],
      [
        "tắt cả ba",
        [...LAW(false, false), { code: "brokerage", rateBasisPoints: 100, included: false }],
        [{ problem: "nothing-included" }],
      ],
    ];
    expect(BAD).toHaveLength(3);
    for (const [name, body, want] of BAD) {
      const rowsBefore = await rowsOf(w);
      const res = await h.save(req("PUT", { items: body }, c));
      expect(res.status, `sai-khong-ghi: ${name}`).toBe(400);
      const json = (await res.json()) as { problems: { problem: string; code?: string | null }[] };
      expect(
        json.problems.map((p) =>
          p.code === undefined ? { problem: p.problem } : { problem: p.problem, code: p.code },
        ),
        name,
      ).toEqual(want);
      expect(await rowsOf(w), `sai-khong-ghi: ${name}`).toEqual(rowsBefore);
    }
    // A law item renamed or left out, sent straight to the API.
    for (const body of [
      [
        { code: "pit", name: "Thuế khác", rateBasisPoints: 200, included: true },
        LAW()[1],
        { code: "brokerage", rateBasisPoints: 100, included: true },
      ],
      [LAW()[1], { code: "brokerage", rateBasisPoints: 100, included: true }],
    ]) {
      expect((await h.save(req("PUT", { items: body }, c))).status).toBe(400);
    }
  });
});

const ROLES = ["LA", "BA", "TL", "CA"] as const;
// Written from the owner's approval at the scope gate, not read from ontology/actions.yaml.
const WRITES: Record<(typeof ROLES)[number], boolean> = {
  LA: false,
  BA: false,
  TL: false,
  CA: true,
};

describe("vai-8-o (E4)", () => {
  it("vai-8-o-api: every role reads, only CompanyAdmin saves", async () => {
    const { w, h, cookie } = await apiWorld("vai_api");
    let cells = 0;
    for (const who of ROLES) {
      const c = await cookie(who);
      expect((await h.read(req("GET", undefined, c))).status, `vai-8-o-api: ${who} đọc`).toBe(200);
      cells += 1;
      const before = await rowsOf(w);
      const res = await h.save(
        req(
          "PUT",
          {
            items: [
              ...LAW(),
              { code: "brokerage", rateBasisPoints: 110 + cells * 10, included: true },
            ],
          },
          c,
        ),
      );
      expect(res.status, `vai-8-o-api: ${who} ghi`).toBe(WRITES[who] ? 200 : 403);
      if (!WRITES[who]) expect(await rowsOf(w)).toEqual(before);
      cells += 1;
    }
    console.log(`vai-8-o-api: ${cells} ô`);
    expect(cells).toBe(8);
  });

  it("vai-8-o-db: straight under the API role, the role rules refuse every write but CompanyAdmin's", async () => {
    const w = await world("thue_phi_vai_db");
    worlds.push(w);
    await w.db.owner.query(
      `insert into company_fee_items (company_id, code, kind, rate_bp, included, position, changed_by, changed_by_name)
       values ($1, 'brokerage', 'Own', 200, true, 0, $2, '[Tên]')`,
      [w.A, w.id.CA],
    );
    let cells = 0;
    for (const who of ROLES) {
      const n = await asPerson(
        w,
        who,
        w.A,
        async (c) => (await c.query("select 1 from company_fee_items")).rows.length,
      );
      expect(n, `vai-8-o-db: ${who} đọc`).toBe(1);
      cells += 1;
      const wrote = await asPerson(w, who, w.A, async (c) => {
        const u = await c.query("update company_fee_items set rate_bp = 300");
        let inserted = false;
        try {
          await c.query(
            `insert into company_fee_items (company_id, code, kind, rate_bp, included, position, changed_by, changed_by_name)
             values ($1, 'k1', 'Own', 10, true, 1, $2, '[Tên]')`,
            [w.A, w.id[who]],
          );
          inserted = true;
        } catch (err) {
          if (!(err instanceof Error) || !/row-level security/.test(err.message)) throw err;
        }
        return (u.rowCount ?? 0) > 0 || inserted;
      });
      expect(wrote, `vai-8-o-db: ${who} ghi`).toBe(WRITES[who]);
      cells += 1;
    }
    console.log(`vai-8-o-db: ${cells} ô`);
    expect(cells).toBe(8);
  });
});

describe("hai-san-6-o (E7)", () => {
  it("B reads the defaults, never sees nor changes A's rows, at the API and straight in the table", async () => {
    const { w, h, cookie } = await apiWorld("hai_san");
    const a = await cookie("CA");
    await h.save(
      req(
        "PUT",
        {
          items: [...LAW(true, false), { code: "brokerage", rateBasisPoints: 200, included: true }],
        },
        a,
      ),
    );
    const b = await cookie("Y", w.B);
    let cells = 0;
    const readB = await items(await h.read(req("GET", undefined, b)));
    expect(
      readB.map((i) => i.source.kind),
      "hai-san-6-o: B thấy A",
    ).toEqual(["default", "default", "default"]);
    cells += 1;
    const readA = await items(await h.read(req("GET", undefined, a)));
    expect(readA[2]?.rateBasisPoints).toBe(200);
    cells += 1;
    expect(
      (
        await h.save(
          req(
            "PUT",
            { items: [...LAW(), { code: "brokerage", rateBasisPoints: 300, included: true }] },
            b,
          ),
        )
      ).status,
    ).toBe(200);
    cells += 1;
    const aAfter = await items(await h.read(req("GET", undefined, a)));
    expect(
      aAfter.map((i) => [i.code, i.rateBasisPoints, i.included]),
      "hai-san-6-o: B ghi đè A",
    ).toEqual([
      ["pit", 200, true],
      ["registration", 50, false],
      ["brokerage", 200, true],
    ]);
    cells += 1;
    const seen = await asPerson(w, "Y", w.B, async (c) =>
      (await c.query("select company_id from company_fee_items")).rows.map(
        (r) => (r as { company_id: string }).company_id,
      ),
    );
    expect(seen, "hai-san-6-o: B thấy A").toEqual([w.B]);
    cells += 1;
    const changed = await asPerson(
      w,
      "Y",
      w.B,
      async (c) =>
        (await c.query("update company_fee_items set rate_bp = 0 where company_id = $1", [w.A]))
          .rowCount,
    );
    expect(changed, "hai-san-6-o: B sửa A").toBe(0);
    cells += 1;
    console.log(`hai-san-6-o: ${cells} ô`);
    expect(cells).toBe(6);
  });
});

describe("khoan-rieng (E10)", () => {
  it("adds, renames and removes an own item; law items cannot; a sixth item, a duplicate or over 10% is refused", async () => {
    const { w, h, cookie } = await apiWorld("khoan");
    const c = await cookie("CA");
    const brokerage = { code: "brokerage", rateBasisPoints: 100, included: true };
    const added = await h.save(
      req(
        "PUT",
        {
          items: [
            ...LAW(),
            brokerage,
            { name: "Phí dịch vụ hồ sơ", rateBasisPoints: 30, included: true },
          ],
        },
        c,
      ),
    );
    expect(added.status).toBe(200);
    const list = await items(added);
    const extra = list[3]!;
    expect(extra).toMatchObject({
      kind: "Own",
      name: "Phí dịch vụ hồ sơ",
      rateBasisPoints: 30,
      source: { kind: "added" },
    });
    const renamed = await items(
      await h.save(
        req(
          "PUT",
          {
            items: [
              ...LAW(),
              brokerage,
              { code: extra.code, name: "Phí hồ sơ", rateBasisPoints: 30, included: true },
            ],
          },
          c,
        ),
      ),
    );
    expect(renamed.map((i) => i.name).at(-1)).toBe("Phí hồ sơ");
    const removed = await items(await h.save(req("PUT", { items: [...LAW(), brokerage] }, c)));
    expect(removed.map((i) => i.code)).toEqual(["pit", "registration", "brokerage"]);
    const extraRows = (await rowsOf(w)).filter((r) => r.code === extra.code);
    expect(extraRows.every((r) => r.retired && r.retired_by === w.id.CA)).toBe(true);
    // A new item never takes the removed one's code.
    const again = await items(
      await h.save(
        req(
          "PUT",
          {
            items: [...LAW(), brokerage, { name: "Phí khác", rateBasisPoints: 10, included: true }],
          },
          c,
        ),
      ),
    );
    expect(again.at(-1)?.code).not.toBe(extra.code);
    const before = await rowsOf(w);
    const own = (n: number) =>
      Array.from({ length: n }, (_, i) => ({
        name: `Phí ${i}`,
        rateBasisPoints: 10,
        included: true,
      }));
    for (const [name, body, problem] of [
      ["thứ sáu", [...LAW(), brokerage, ...own(5)], "too-many-items"],
      [
        "trùng",
        [...LAW(), brokerage, { name: "PHÍ MÔI GIỚI", rateBasisPoints: 10, included: true }],
        "name-duplicate",
      ],
      [
        "quá 10%",
        [
          ...LAW(),
          { ...brokerage, rateBasisPoints: 500 },
          { name: "Phí lớn", rateBasisPoints: 260, included: true },
        ],
        "total-above-max",
      ],
    ] as const) {
      const res = await h.save(req("PUT", { items: body }, c));
      expect(res.status, name).toBe(400);
      expect(
        ((await res.json()) as { problems: { problem: string }[] }).problems.map((p) => p.problem),
        name,
      ).toContain(problem);
    }
    expect(await rowsOf(w)).toEqual(before);
  });
});
