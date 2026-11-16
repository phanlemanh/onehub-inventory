// The Postgres client command lines (psql, pg_dump, pg_restore) and the addresses the db/scripts receive from a test,
// chosen the same way db/scripts/psql.sh and db/scripts/ci-db.sh choose them:
//   - PSQL set (CI, `make ci-db`, row 1s): the cluster is reached over TCP with the password local-only. With
//     CI_DB_CONTAINER the tools run inside that container (127.0.0.1:5432 as seen from it); without it they are the
//     ones on PATH and the address is 127.0.0.1:$DB_PORT. The CI service container carries no lane name.
//   - otherwise (a lane): inside the lane's container onehub-inventory-db-$DB_LANE, 127.0.0.1:5432, trust.
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

export function pgClient(defaultLane: string): PgClient {
  const env = process.env;
  let prefix: string;
  let hostPort: string;
  let withPassword: boolean;
  if (env["PSQL"]) {
    withPassword = true;
    const container = env["CI_DB_CONTAINER"];
    if (container) {
      prefix = `docker exec -i -e PGPASSWORD=${PASSWORD} ${container} `;
      hostPort = "127.0.0.1:5432";
    } else {
      prefix = "";
      hostPort = `127.0.0.1:${env["DB_PORT"] ?? "5432"}`;
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
