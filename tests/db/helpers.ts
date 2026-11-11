// Scratch databases on this lane's Postgres for the sign-in tests. Fixtures are written as the owner (the container's
// superuser); everything the product does goes through the door, withCompany, exactly as the server does.
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PORT = process.env["DB_PORT"] ?? "5563";
const ADMIN_URL =
  process.env["TEST_ADMIN_URL"] ?? `postgres://postgres:local-only@127.0.0.1:${PORT}/postgres`;

function urlFor(db: string): string {
  const u = new URL(ADMIN_URL);
  u.pathname = `/${db}`;
  return u.toString();
}

async function admin<T>(fn: (c: pg.Client) => Promise<T>): Promise<T> {
  const c = new pg.Client({ connectionString: ADMIN_URL });
  await c.connect();
  try {
    return await fn(c);
  } finally {
    await c.end();
  }
}

export interface ScratchDb {
  name: string;
  url: string;
  owner: pg.Client;
  drop(): Promise<void>;
}

/** Applies the migrations not yet applied; with `upTo`, only those numbered up to it (a copy of the folder). */
export function migrate(name: string, upTo?: number): void {
  let dir: string | undefined;
  if (upTo !== undefined) {
    dir = mkdtempSync(join(tmpdir(), "migrations-"));
    for (const f of readdirSync(join(ROOT, "db/migrations")))
      if (Number(f.slice(0, 3)) <= upTo) cpSync(join(ROOT, "db/migrations", f), join(dir, f));
  }
  try {
    execFileSync("bash", [join(ROOT, "db/scripts/migrate.sh"), name], {
      env: {
        ...process.env,
        DB_LANE: process.env["DB_LANE"] ?? "n",
        ...(dir ? { MIGRATIONS_DIR: dir } : {}),
      },
      stdio: "pipe",
    });
  } finally {
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * A fresh database <prefix>_<suffix> (prefix dang_nhap unless given) with every migration applied — or only those up
 * to `upTo` — and an owner connection to it.
 */
export async function scratchDb(
  suffix: string,
  breakFile?: string,
  opts: { prefix?: string; upTo?: number } = {},
): Promise<ScratchDb> {
  const name = `${opts.prefix ?? "dang_nhap"}_${suffix.replace(/[^a-z0-9_]/g, "_")}`;
  await admin(async (c) => {
    await c.query(`drop database if exists ${name} with (force)`);
    await c.query(`create database ${name}`);
  });
  migrate(name, opts.upTo);
  const owner = new pg.Client({ connectionString: urlFor(name) });
  await owner.connect();
  if (breakFile)
    await owner.query(readFileSync(join(ROOT, "tests/db/pha-thu", `${breakFile}.sql`), "utf8"));
  return {
    name,
    url: urlFor(name),
    owner,
    async drop() {
      await owner.end();
      await admin((c) => c.query(`drop database if exists ${name} with (force)`));
    },
  };
}

export interface Fixture {
  companies: { A: string; B: string; C: string };
  users: { one: string; two: string; none: string; other: string };
  emails: { one: string; two: string; none: string; other: string; unknown: string };
}

/** Three companies; a person in A only, a person in A and B, a person in no company, a person in C. */
export async function seed(owner: pg.Client): Promise<Fixture> {
  const company = async (name: string) =>
    (
      await owner.query<{ id: string }>("insert into companies (name) values ($1) returning id", [
        name,
      ])
    ).rows[0]!.id;
  const A = await company("[Sàn A]");
  const B = await company("[Sàn B]");
  const C = await company("[Sàn C]");
  const emails = {
    one: "mot-san@example.test",
    two: "hai-san@example.test",
    none: "chua-san@example.test",
    other: "san-c@example.test",
    unknown: "khong-co@example.test",
  };
  const user = async (email: string) =>
    (
      await owner.query<{ id: string }>(
        "insert into identity.users (email, name) values ($1, '[Tên]') returning id",
        [email],
      )
    ).rows[0]!.id;
  const users = {
    one: await user(emails.one),
    two: await user(emails.two),
    none: await user(emails.none),
    other: await user(emails.other),
  };
  const member = (c: string, u: string) =>
    owner.query(
      "insert into company_members (company_id, user_id, name, roles) values ($1, $2, '[Tên]', '{CompanyAdmin}')",
      [c, u],
    );
  await member(A, users.one);
  await member(A, users.two);
  await member(B, users.two);
  await member(C, users.other);
  return { companies: { A, B, C }, users, emails };
}

export async function count(
  owner: pg.Client,
  sql: string,
  params: unknown[] = [],
): Promise<number> {
  return Number((await owner.query<{ n: string }>(sql, params)).rows[0]!.n);
}
