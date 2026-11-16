// The Postgres client command lines (psql, pg_dump, pg_restore) and the addresses the db/scripts receive from a test,
// chosen the same way db/scripts/psql.sh and db/scripts/ci-db.sh choose them:
//   - PSQL set (CI, `make ci-db`, row 1s): the cluster is reached over TCP with the password local-only, and the tools
//     run INSIDE the Postgres container (127.0.0.1:5432 as seen from it), so pg_dump and pg_restore always have the
//     server's major version. The runner's own tools are newer (pg_dump 17 against the postgres:16 service wrote
//     `SET transaction_timeout`, which pg_restore on 16 refuses). The container is CI_DB_CONTAINER when set; otherwise
//     the one running container that publishes DB_PORT (`docker ps --filter publish=<port>`): the CI service container
//     has a generated name but publishes 5432:5432, and GitHub runs the job on the host, where `docker exec` reaches it.
//     No such container (a cluster outside Docker): the tools on PATH at 127.0.0.1:$DB_PORT; the db/scripts then stop
//     with their version line if those tools are of another major than the server.
//   - otherwise (a lane): inside the lane's container onehub-inventory-db-$DB_LANE, 127.0.0.1:5432, trust.
import { execFileSync } from "node:child_process";

import { LOGIN_ROLE } from "./helpers";

const PASSWORD = "local-only";

export interface PgClient {
  /** psql, pg_dump and pg_restore command lines for PSQL_DICH, PG_DUMP_CMD and PG_RESTORE_CMD. */
  psql: string;
  pgDump: string;
  pgRestore: string;
  /** The owner's (postgres) address of database `db`, valid for the command lines above. */
  ownerUrl(db: string): string;
  /** The app's login role's address of database `db`, valid for the command lines above. */
  loginUrl(db: string): string;
}

/** The id of the one running container that publishes `port`, or undefined (none, several, or no Docker). */
function containerPublishing(port: string): string | undefined {
  try {
    const ids = execFileSync(
      "docker",
      ["ps", "-q", "--filter", `publish=${port}`, "--filter", "status=running"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    )
      .split("\n")
      .filter(Boolean);
    return ids.length === 1 ? ids[0] : undefined;
  } catch {
    return undefined;
  }
}

export function pgClient(defaultLane: string): PgClient {
  const env = process.env;
  let prefix: string;
  let hostPort: string;
  let withPassword: boolean;
  if (env["PSQL"]) {
    withPassword = true;
    const port = env["DB_PORT"] ?? "5432";
    const container = env["CI_DB_CONTAINER"] || containerPublishing(port);
    if (container) {
      prefix = `docker exec -i -e PGPASSWORD=${PASSWORD} ${container} `;
      hostPort = "127.0.0.1:5432";
    } else {
      prefix = "";
      hostPort = `127.0.0.1:${port}`;
    }
  } else {
    withPassword = false;
    prefix = `docker exec -i onehub-inventory-db-${env["DB_LANE"] ?? defaultLane} `;
    hostPort = "127.0.0.1:5432";
  }
  const url = (role: string, db: string) =>
    `postgres://${role}${withPassword ? `:${PASSWORD}` : ""}@${hostPort}/${db}`;
  return {
    psql: `${prefix}psql`,
    pgDump: `${prefix}pg_dump`,
    pgRestore: `${prefix}pg_restore`,
    ownerUrl: (db) => url("postgres", db),
    loginUrl: (db) => url(LOGIN_ROLE, db),
  };
}
