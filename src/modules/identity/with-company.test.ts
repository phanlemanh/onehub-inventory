import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  CHECK_LOGIN_ROLE_SQL,
  createPool,
  LoginRoleError,
  SET_CONTEXT_SQL,
  SET_ROLE_SQL,
  withCompany,
  type DbClient,
  type DbPool,
} from "./with-company";

type Call = [text: string, params: unknown[] | undefined];

const LOGIN_OK = [{ vai: "quy_hang_login", loi: null }];

// A fake pool that records every statement and can fail on one of them. The login-role check (row 7c) answers `role`;
// texts() leaves that check out so the transaction's own statements read as before.
function fakePool(failOn?: string, role: unknown[] = LOGIN_OK) {
  const calls: Call[] = [];
  let released = 0;
  const client: DbClient = {
    async query(text, params) {
      calls.push([text, params]);
      if (text === failOn) throw new Error(`fake failure on ${text}`);
      if (text === CHECK_LOGIN_ROLE_SQL) return { rows: role, rowCount: role.length };
      return { rows: [], rowCount: 0 };
    },
    release() {
      released += 1;
    },
  };
  const pool: DbPool = { connect: async () => client };
  return {
    pool,
    calls,
    texts: () => calls.map(([text]) => text).filter((t) => t !== CHECK_LOGIN_ROLE_SQL),
    checks: () => calls.filter(([text]) => text === CHECK_LOGIN_ROLE_SQL).length,
    released: () => released,
  };
}

describe("withCompany", () => {
  it("runs the work inside one transaction under the app role", async () => {
    const db = fakePool();
    const result = await withCompany(db.pool, { userId: "u1", companyId: "c1" }, async (client) => {
      await client.query("select 1");
      return "kết quả";
    });

    expect(result, "the work's result is returned").toBe("kết quả");
    expect(db.texts(), "statements run in order inside one transaction").toEqual([
      "begin",
      SET_ROLE_SQL,
      SET_CONTEXT_SQL,
      "select 1",
      "commit",
    ]);
    expect(db.calls[3]?.[1], "user and company are bound as parameters").toEqual(["u1", "c1"]);
    expect(db.released(), "the connection goes back to the pool once").toBe(1);
  });

  it("rolls back and rethrows when the work fails", async () => {
    const db = fakePool();
    const original = new Error("việc lỗi");
    const run = withCompany(db.pool, { userId: "u1", companyId: "c1" }, async () => {
      throw original;
    });

    await expect(run, "the original error is rethrown").rejects.toBe(original);
    expect(db.texts().at(-1), "the transaction ends with rollback").toBe("rollback");
    expect(db.texts(), "nothing is committed").not.toContain("commit");
    expect(db.released(), "the connection goes back to the pool once").toBe(1);
  });

  it("sets an empty company when none is chosen", async () => {
    const db = fakePool();
    await withCompany(db.pool, { userId: "u1", companyId: null }, async () => undefined);

    expect(db.calls[3]?.[1], "a missing company becomes an empty string").toEqual(["u1", ""]);
  });

  it("does not run the work when switching role fails", async () => {
    const db = fakePool(SET_ROLE_SQL);
    let ran = false;
    const run = withCompany(db.pool, { userId: "u1", companyId: "c1" }, async () => {
      ran = true;
    });

    await expect(run, "the role error is rethrown").rejects.toThrow(
      `fake failure on ${SET_ROLE_SQL}`,
    );
    expect(ran, "the work never runs without the app role").toBe(false);
    expect(db.texts(), "the transaction is rolled back").toContain("rollback");
    expect(db.released(), "the connection goes back to the pool once").toBe(1);
  });

  it("still releases and rethrows the original error when rollback itself fails", async () => {
    const db = fakePool("rollback");
    const original = new Error("việc lỗi");
    const run = withCompany(db.pool, { userId: "u1", companyId: "c1" }, async () => {
      throw original;
    });

    await expect(run, "the work's error wins over the rollback error").rejects.toBe(original);
    expect(db.released(), "the connection goes back to the pool once").toBe(1);
  });
});

// Row 7c (_acceptance/ung-dung-noi-bang-vai-khong-chu/evals.yaml E6b): the door checks the connection's role once per
// pool and refuses one that can reach a table owner, before any statement of the transaction.
const REFUSALS = [
  { vai: "postgres", loi: "về được vai chủ postgres" },
  { vai: "vai_tam", loi: "vượt được luật theo dòng qua quy_hang_identity" },
];

/** The refusal case's assertions, applied to any door: run the work on a refused role and see what happened. */
async function refusalSeen(
  door: typeof withCompany,
  row: { vai: string; loi: string },
): Promise<{ message: string | null; ran: boolean; texts: string[]; released: number }> {
  const db = fakePool(undefined, [row]);
  let ran = false;
  let message: string | null = null;
  try {
    await door(db.pool, { userId: "u1", companyId: "c1" }, async () => {
      ran = true;
    });
  } catch (err) {
    message = err instanceof Error ? err.message : String(err);
  }
  return { message, ran, texts: db.texts(), released: db.released() };
}

function refusalHolds(
  seen: Awaited<ReturnType<typeof refusalSeen>>,
  row: { vai: string; loi: string },
): boolean {
  return (
    seen.message === `cửa từ chối vai nối ${row.vai}: ${row.loi} — nối bằng quy_hang_login` &&
    !seen.ran &&
    seen.texts.length === 0 &&
    seen.released === 1
  );
}

describe("withCompany checks its login role (row 7c)", () => {
  it("a passing role is checked once per pool, then the work runs", async () => {
    const db = fakePool();
    await withCompany(db.pool, { userId: "u1", companyId: "c1" }, async () => undefined);
    await withCompany(db.pool, { userId: "u1", companyId: "c1" }, async () => undefined);
    expect(db.checks(), "one check for two calls on one pool").toBe(1);
    expect(db.calls[0]?.[0], "the check runs before the transaction").toBe(CHECK_LOGIN_ROLE_SQL);
    expect(db.texts().filter((t) => t === "commit")).toHaveLength(2);
  });

  for (const row of REFUSALS)
    it(`refuses ${row.vai}: ${row.loi}, and runs nothing`, async () => {
      const seen = await refusalSeen(withCompany, row);
      expect(seen.message).toBe(
        `cửa từ chối vai nối ${row.vai}: ${row.loi} — nối bằng quy_hang_login`,
      );
      expect(seen.ran, "the work never runs").toBe(false);
      expect(seen.texts, "no begin or other statement is sent").toEqual([]);
      expect(seen.released, "the connection goes back to the pool").toBe(1);
      expect(refusalHolds(seen, row)).toBe(true);
    });

  it("a refusal is not remembered: the next call checks again", async () => {
    const db = fakePool(undefined, [REFUSALS[0]]);
    const ctx = { userId: "u1", companyId: "c1" };
    await expect(withCompany(db.pool, ctx, async () => undefined)).rejects.toBeInstanceOf(
      LoginRoleError,
    );
    await expect(withCompany(db.pool, ctx, async () => undefined)).rejects.toBeInstanceOf(
      LoginRoleError,
    );
    expect(db.checks()).toBe(2);
  });

  it("no row or an unreadable answer is a refusal (fail closed)", async () => {
    for (const rows of [[], [{}]]) {
      const db = fakePool(undefined, rows);
      await expect(
        withCompany(db.pool, { userId: "u1", companyId: "c1" }, async () => undefined),
      ).rejects.toBeInstanceOf(LoginRoleError);
      expect(db.texts()).toEqual([]);
    }
  });

  it("break: when the check lets the role through, the refusal case's assertions fail", async () => {
    // What a door without the check would do with the refused role: run the work. Same assertions, same fake pool,
    // only the role passes — the refusal case must not hold.
    const db = fakePool();
    let ran = false;
    await withCompany(db.pool, { userId: "u1", companyId: "c1" }, async () => {
      ran = true;
    });
    const seen = { message: null, ran, texts: db.texts(), released: db.released() };
    expect(
      refusalHolds(seen, REFUSALS[0]!),
      "the refusal case catches a role that got through",
    ).toBe(false);
  });

  it("no parameter of the public door turns the check off", () => {
    expect(withCompany.length, "withCompany(pool, ctx, fn)").toBe(3);
    expect(createPool.length, "createPool(url)").toBe(1);
  });
});

// The isolation suite must run the door's own statements, so a change to the door cannot leave the suite
// testing something else (AC-7).
function sqlUsesDoorStatements(sql: string): boolean {
  return (
    sql.includes(SET_ROLE_SQL + ";") &&
    sql.includes("prepare dat_san(text, text) as " + SET_CONTEXT_SQL + ";")
  );
}

describe("isolation suite and door", () => {
  it("the isolation suite runs the door's own statements", () => {
    const suite = readFileSync(
      fileURLToPath(new URL("../../../db/tests/cach-ly.sql", import.meta.url)),
      "utf8",
    );
    expect(sqlUsesDoorStatements(suite), "cach-ly.sql dùng nguyên văn hai câu của cửa").toBe(true);

    const drifted = suite.replaceAll("app.company_id", "app.companyid");
    expect(sqlUsesDoorStatements(drifted), "control: a one-character drift is caught").toBe(false);
  });
});
