import { describe, expect, it } from "vitest";

import {
  SET_CONTEXT_SQL,
  SET_ROLE_SQL,
  withCompany,
  type DbClient,
  type DbPool,
} from "./with-company";

type Call = [text: string, params: unknown[] | undefined];

// A fake pool that records every statement and can fail on one of them.
function fakePool(failOn?: string) {
  const calls: Call[] = [];
  let released = 0;
  const client: DbClient = {
    async query(text, params) {
      calls.push([text, params]);
      if (text === failOn) throw new Error(`fake failure on ${text}`);
      return { rows: [], rowCount: 0 };
    },
    release() {
      released += 1;
    },
  };
  const pool: DbPool = { connect: async () => client };
  return { pool, calls, texts: () => calls.map(([text]) => text), released: () => released };
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
    expect(db.calls[2]?.[1], "user and company are bound as parameters").toEqual(["u1", "c1"]);
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

    expect(db.calls[2]?.[1], "a missing company becomes an empty string").toEqual(["u1", ""]);
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
