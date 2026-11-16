// A Postgres cluster used by ONE test file only: its own container (same image as the lanes, mk/db.mk), its own host
// port picked by docker, removed by the caller in afterAll. The lanes' clusters are shared — other suites make and
// drop scratch databases there at any moment — so a measure of "which databases exist" is only exact on a cluster
// nobody else touches (row 22, round 2 of E7).
//
// The container name does not start with onehub-inventory-db-, so db/scripts/psql.sh never counts it as a lane when
// DB_LANE is unset. Migrations reach it through PSQL (psql.sh), not DB_LANE.
import { execFileSync, spawnSync } from "node:child_process";
import { join } from "node:path";

import pg from "pg";

const IMAGE = "postgres:16";
const PASSWORD = "local-only";

export interface OwnCluster {
  container: string;
  port: number;
  /** The owner's connection string from the host to database `db`. */
  url(db: string): string;
  /** `docker exec -i <container> psql`: the psql command line inside the container (local addresses, trust). */
  psqlInside: string;
  /** Applies every migration to `db` with db/scripts/migrate.sh. */
  migrate(db: string): void;
  /** Removes the container; safe to call twice and when start failed half way. */
  remove(): void;
}

function docker(args: string[]): string {
  return execFileSync("docker", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

/**
 * Starts the cluster and waits until the final server (not the entrypoint's temporary one, which listens on no TCP
 * port) accepts the owner over TCP. Throws — never skips — when docker or the image is missing.
 */
export async function startOwnCluster(root: string, label: string): Promise<OwnCluster> {
  const container = `cach-ly-rieng-${label}-${process.pid}`;
  const remove = () => {
    spawnSync("docker", ["rm", "-f", container], { stdio: "ignore" });
  };
  remove();
  try {
    docker([
      "run",
      "-d",
      "--rm",
      "--name",
      container,
      "-e",
      `POSTGRES_PASSWORD=${PASSWORD}`,
      "-p",
      "127.0.0.1::5432",
      IMAGE,
    ]);
    const mapped = docker(["port", container, "5432/tcp"]).split("\n")[0]!;
    const port = Number(mapped.slice(mapped.lastIndexOf(":") + 1));
    if (!Number.isInteger(port) || port <= 0)
      throw new Error(`không đọc được cổng của ${container}: ${mapped}`);
    const url = (db: string) => `postgres://postgres:${PASSWORD}@127.0.0.1:${port}/${db}`;

    const deadline = Date.now() + 60_000;
    for (;;) {
      const c = new pg.Client({ connectionString: url("postgres") });
      try {
        await c.connect();
        await c.query("select 1");
        break;
      } catch (err) {
        if (Date.now() > deadline)
          throw new Error(`cụm riêng ${container} không lên sau 60 giây: ${String(err)}`, {
            cause: err,
          });
        await new Promise((r) => setTimeout(r, 250));
      } finally {
        await c.end().catch(() => {});
      }
    }

    const psqlInside = `docker exec -i ${container} psql`;
    return {
      container,
      port,
      url,
      psqlInside,
      migrate(db: string) {
        execFileSync("bash", [join(root, "db/scripts/migrate.sh"), db], {
          env: { ...process.env, PSQL: `${psqlInside} -U postgres` },
          stdio: "pipe",
        });
      },
      remove,
    };
  } catch (err) {
    remove();
    throw err;
  }
}
