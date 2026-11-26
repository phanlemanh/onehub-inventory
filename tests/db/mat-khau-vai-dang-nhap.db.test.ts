// Row dat-khoa-mot-lenh, E4b. The deploy step vai-dang-nhap sets quy_hang_login's password as a SCRAM-SHA-256
// verifier computed by tools/deploy/scram.mjs; this file proves a real Postgres accepts it: the role signs in over TCP
// with that password, a wrong one is refused, and running the step a second time still signs in. The role belongs to
// the whole cluster, and the lanes' clusters give it the shared test password, so this runs on a cluster of its own
// (tests/db/rieng-cum.ts).
import { randomBytes } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// @ts-expect-error — plain .mjs module of the deploy tools, no type declarations
import { setLoginRolePassword } from "../../tools/deploy/len-ban.mjs";
import { startOwnCluster, type OwnCluster } from "./rieng-cum";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DB = "mat_khau_vai";
// Made at run time: letters and digits, 40 long, the shape LOGIN_DB_PASSWORD has; nothing secret is written down.
const PASSWORD = randomBytes(20).toString("hex");

describe("E4b · vai đăng nhập vào được bằng mật khẩu bước vai-dang-nhap đặt", () => {
  let cluster: OwnCluster | undefined;

  /** Signs in as quy_hang_login from the host, over TCP (scram-sha-256 in the image's pg_hba). */
  async function signIn(password: string): Promise<string> {
    const u = new URL(cluster!.url(DB));
    u.username = "quy_hang_login";
    u.password = password;
    const c = new pg.Client({ connectionString: u.toString() });
    try {
      await c.connect();
      return (await c.query<{ u: string }>("select current_user as u")).rows[0]!.u;
    } finally {
      await c.end().catch(() => {});
    }
  }

  /** The step as make deploy runs it, with psql inside the container on the owner connection. */
  function runStep(): void {
    setLoginRolePassword({
      ...process.env,
      PSQL_DICH: `${cluster!.psqlInside} -U postgres`,
      MIGRATE_DATABASE_URL: `postgres://postgres@127.0.0.1:5432/${DB}`,
      LOGIN_DB_PASSWORD: PASSWORD,
    });
  }

  beforeAll(async () => {
    cluster = await startOwnCluster(ROOT, "mat-khau-vai");
    const admin = new pg.Client({ connectionString: cluster.url("postgres") });
    await admin.connect();
    await admin.query(`create database ${DB}`);
    await admin.end();
    cluster.migrate(DB);
  }, 180_000);
  afterAll(() => cluster?.remove());

  it("E4b · đối chứng: trước bước, cùng mật khẩu bị từ chối", async () => {
    await expect(signIn(PASSWORD)).rejects.toThrow(/password authentication failed/);
  });

  it("E4b · sau bước: đúng mật khẩu vào được, current_user là quy_hang_login; mật khẩu khác bị từ chối", async () => {
    runStep();
    expect(await signIn(PASSWORD)).toBe("quy_hang_login");
    await expect(signIn(`${PASSWORD}x`)).rejects.toThrow(/password authentication failed/);
  });

  it("E4b · chạy bước lần hai: vẫn vào được bằng đúng mật khẩu", async () => {
    runStep();
    expect(await signIn(PASSWORD)).toBe("quy_hang_login");
  });
});
