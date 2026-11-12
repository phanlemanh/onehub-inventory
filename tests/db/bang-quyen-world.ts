// Shared world of the permission-table tests (row 9a): company A with four people, one role each; person X who is
// CompanyAdmin in B but only ListAgent in A; person Y in B only (CompanyAdmin). Fixtures are written as the owner;
// everything the product does goes through the door, withCompany, under the API role.

import { ACTIONS, type ActionSpec, type Role } from "@/generated/ontology";
import {
  createPool,
  withCompany,
  type DbClient,
  type DbPool,
} from "@/modules/identity/with-company";

import { scratchDb, type ScratchDb } from "./helpers";

export const PEOPLE = ["LA", "BA", "TL", "CA", "X", "Y"] as const;
export type Person = (typeof PEOPLE)[number];
/** The one role each of the four people of A holds there. */
export const ROLE_OF: Record<"LA" | "BA" | "TL" | "CA", Role> = {
  LA: "ListAgent",
  BA: "BuyerAgent",
  TL: "TeamLead",
  CA: "CompanyAdmin",
};

export interface World {
  db: ScratchDb;
  pool: DbPool & { end?: () => Promise<void> };
  A: string;
  B: string;
  id: Record<Person, string>;
  email: Record<Person, string>;
  /** A's own agreement. */
  agreementA: string;
}

export async function world(suffix: string, breakFile?: string, upTo?: number): Promise<World> {
  const db = await scratchDb(suffix, breakFile, {
    prefix: "bang_quyen",
    ...(upTo ? { upTo } : {}),
  });
  const o = db.owner;
  const company = async (name: string) =>
    (await o.query<{ id: string }>("insert into companies (name) values ($1) returning id", [name]))
      .rows[0]!.id;
  const A = await company("[Sàn A]");
  const B = await company("[Sàn B]");
  const id = {} as Record<Person, string>;
  const email = {} as Record<Person, string>;
  for (const k of PEOPLE) {
    email[k] = `${k.toLowerCase()}@example.test`;
    id[k] = (
      await o.query<{ id: string }>(
        "insert into identity.users (email, name) values ($1, $2) returning id",
        [email[k], `[Tên] ${k}`],
      )
    ).rows[0]!.id;
  }
  const member = (c: string, u: string, roles: Role[]) =>
    o.query(
      "insert into company_members (company_id, user_id, name, roles) values ($1, $2, '[Tên]', $3)",
      [c, u, roles],
    );
  for (const k of ["LA", "BA", "TL", "CA"] as const) await member(A, id[k], [ROLE_OF[k]]);
  await member(A, id.X, ["ListAgent"]);
  await member(B, id.X, ["CompanyAdmin"]);
  await member(B, id.Y, ["CompanyAdmin"]);
  const agreement = async (c: string, kind: string) =>
    (
      await o.query<{ id: string }>(
        `insert into agreements (company_id, kind, direction, counterparty, data_classes, valid_from, approved_by)
         values ($1, $2, 'inbound', 'nguồn mẫu', '{catalog}', now(), '[Tên]') returning id`,
        [c, kind],
      )
    ).rows[0]!.id;
  const agreementA = await agreement(A, "catalog_source");
  await agreement(B, "spreadsheet");
  return { db, pool: createPool(db.url) as World["pool"], A, B, id, email, agreementA };
}

export async function dropWorld(w: World): Promise<void> {
  await w.pool.end?.();
  await w.db.drop();
}

class Rollback extends Error {}

/** Runs `fn` as `who` in `company` through the door, then rolls the transaction back. */
export async function asPerson<T>(
  w: World,
  who: Person,
  company: string,
  fn: (c: DbClient) => Promise<T>,
): Promise<T> {
  let out: T | undefined;
  try {
    await withCompany(w.pool, { userId: w.id[who], companyId: company }, async (c) => {
      out = await fn(c);
      throw new Rollback();
    });
  } catch (err) {
    if (!(err instanceof Rollback)) throw err;
  }
  return out as T;
}

export const liveRows = (table: readonly ActionSpec[] = ACTIONS) =>
  table.filter((a) => a.status === "live");

/** Widest scope over every live row that lists `door`, for `role`. */
export function doorScope(
  table: readonly ActionSpec[],
  door: string,
  role: Role,
  kind: "api" | "db",
): "company" | "own" | null {
  let best: "company" | "own" | null = null;
  for (const a of liveRows(table)) {
    if (!a.doors[kind].includes(door)) continue;
    const cell = a.scope[role];
    if (cell === "company") best = "company";
    else if (cell === "own" && best === null) best = "own";
  }
  return best;
}
