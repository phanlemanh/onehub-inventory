import { describe, expect, it } from "vitest";

import { healthOf } from "./health";
import { CHECK_LOGIN_ROLE_SQL, LoginRoleError, type DbClient, type DbPool } from "./with-company";

const SECRET_URL = "postgres://quy_hang_login:mat-khau-gia@db.example.test:5432/postgres";
const ENV = { VERCEL_GIT_COMMIT_SHA: "abc1234", APP_ENV: "staging", DATABASE_URL: SECRET_URL };

// A fake pool: the door's role check answers `role`, every other statement answers nothing and is recorded.
function fakePool(role: unknown[]) {
  const texts: string[] = [];
  const client: DbClient = {
    async query(text) {
      texts.push(text);
      if (text === CHECK_LOGIN_ROLE_SQL) return { rows: role, rowCount: role.length };
      return { rows: [], rowCount: 0 };
    },
    release() {},
  };
  const pool: DbPool = { connect: async () => client };
  return { pool, texts };
}

describe("healthOf", () => {
  it("reports ok and vai dat when the door accepts the connection role", async () => {
    const db = fakePool([{ vai: "quy_hang_login", loi: null }]);
    const health = await healthOf({ env: ENV, pool: () => db.pool });

    expect(health).toEqual({ ok: true, commit: "abc1234", env: "staging", vai: "dat" });
    expect(Object.keys(health).sort(), "exactly four keys").toEqual(["commit", "env", "ok", "vai"]);
    const reads = db.texts.filter((t) => /\bfrom\b/i.test(t) && t !== CHECK_LOGIN_ROLE_SQL);
    expect(reads, "no statement besides the door's own check reads a table").toEqual([]);
  });

  it("reports the door's own reason when the connection role is a table owner", async () => {
    const db = fakePool([{ vai: "postgres", loi: "về được vai chủ postgres" }]);
    const health = await healthOf({ env: ENV, pool: () => db.pool });

    expect(health.ok).toBe(false);
    expect(health.vai).toBe(new LoginRoleError("postgres", "về được vai chủ postgres").message);
    expect(Object.keys(health).sort()).toEqual(["commit", "env", "ok", "vai"]);
    expect(JSON.stringify(health), "no secret in the body").not.toContain("mat-khau-gia");
  });

  it("reports not ok without the driver message when the database cannot be reached", async () => {
    const pool: DbPool = {
      connect: async () => {
        throw new Error(`connect ECONNREFUSED ${SECRET_URL}`);
      },
    };
    const health = await healthOf({ env: ENV, pool: () => pool });

    expect(health).toEqual({
      ok: false,
      commit: "abc1234",
      env: "staging",
      vai: "không nối được cơ sở dữ liệu",
    });
  });

  it("reports not ok when no database is configured or the configuration cannot be read", async () => {
    const none = await healthOf({ env: {}, pool: () => null });
    expect(none).toEqual({
      ok: false,
      commit: "unknown",
      env: "development",
      vai: "chưa cấu hình cơ sở dữ liệu",
    });

    const broken = await healthOf({
      env: ENV,
      pool: () => {
        throw new Error(`bad ${SECRET_URL}`);
      },
    });
    expect(broken.ok).toBe(false);
    expect(broken.vai).toBe("không đọc được cấu hình");
  });

  it("falls back to COMMIT_SHA when Vercel did not set the commit", async () => {
    const health = await healthOf({ env: { COMMIT_SHA: "def5678" }, pool: () => null });
    expect(health.commit).toBe("def5678");
  });

  it("never returns a project name, connection string or key, in any outcome", async () => {
    // Every value a real environment carries, each with a unique marker; none may reach the body.
    const env = {
      VERCEL_GIT_COMMIT_SHA: "abc1234",
      APP_ENV: "staging",
      DATABASE_URL:
        "postgres://quy_hang_login.abcdefghijklmnopqrst:moc-mat-khau@moc-may-chu.example.test:6543/postgres",
      AUTH_SECRET: `moc-${"a".repeat(30)}`,
      RESEND_API_KEY: "moc-resend-key",
      MAIL_FROM: "OneHub <moc-thu@onehub.center>",
      APP_URL: "https://moc-dia-chi.example.test",
      VERCEL_PROJECT_ID: "moc-du-an",
      VERCEL_ORG_ID: "moc-to-chuc",
    };
    const leaks = ["moc-", "abcdefghijklmnopqrst", "6543", "postgres://"];
    const outcomes = [
      () => fakePool([{ vai: "quy_hang_login", loi: null }]).pool,
      () => fakePool([{ vai: "postgres", loi: "về được vai chủ postgres" }]).pool,
      () =>
        ({
          connect: async () => {
            throw new Error(`connect failed: ${env.DATABASE_URL}`);
          },
        }) as DbPool,
      () => null,
      () => {
        throw new Error(`bad config: ${env.DATABASE_URL}`);
      },
    ];
    for (const pool of outcomes) {
      const body = JSON.stringify(await healthOf({ env, pool }));
      for (const leak of leaks) expect(body, `body leaks ${leak}`).not.toContain(leak);
    }
  });
});
