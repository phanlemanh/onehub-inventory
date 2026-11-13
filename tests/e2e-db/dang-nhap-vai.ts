// The shared door for «one role of the sample company» in browser tests (roadmap row 9b, AC-3). One place makes the
// sample company, one person per role and a witness who never signs in, signs each person in once through the real
// sign-in page with the code from this run's test outbox, and keeps each role's browser state. A test that needs a
// role asks for its state here — `test.use({ storageState: roleSession("ListAgent") })` — and never signs in itself.
// The same states serve any later browser run under a role, such as screenshots of the prototypes (contract Ngoài-1).
import { existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { expect, type Page } from "@playwright/test";
import pg from "pg";

import type { Role } from "../../src/generated/ontology";

/** The run id the database config sets once in its main process; workers inherit it. */
const RUN = process.env["E2E_DB_RUN"] ?? `${process.pid}`;
const DB_PORT = process.env["DB_PORT"] ?? "5563";
/** The owner connection to this run's scratch database (made by tests/e2e-db/setup.ts). */
const OWNER_URL = `postgres://postgres:local-only@127.0.0.1:${DB_PORT}/dang_nhap_e2e_${RUN}`;
const OUTBOX = join(tmpdir(), `onehub-e2e-db-outbox-${RUN}.jsonl`);

export const ROLES: readonly Role[] = ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"];
export const SAMPLE_COMPANY = "[Sàn mẫu thử vai]";

/** The person who holds one role and nothing else. */
export function rolePerson(role: Role): { name: string; email: string } {
  return { name: `[Tên] Vai ${role}`, email: `vai-${role.toLowerCase()}-${RUN}@example.test` };
}

/** A member of the sample company who never signs in: their name and email must never reach a blocked page. */
export const WITNESS = {
  name: "[Tên] Người chứng",
  email: `nguoi-chung-${RUN}@example.test`,
} as const;

/** Where one role's browser state is kept, outside the repository. */
export function roleSession(role: Role): string {
  return join(tmpdir(), `onehub-e2e-db-vai-${role}-${RUN}.json`);
}

/** The sample company with one person per role and the witness, written as the database owner. */
export async function makeSampleCompany(): Promise<void> {
  const db = new pg.Client({ connectionString: OWNER_URL });
  await db.connect();
  try {
    const company = (
      await db.query<{ id: string }>("insert into companies (name) values ($1) returning id", [
        SAMPLE_COMPANY,
      ])
    ).rows[0]!.id;
    const people: { name: string; email: string; roles: Role[] }[] = [
      ...ROLES.map((r) => ({ ...rolePerson(r), roles: [r] })),
      { ...WITNESS, roles: ["ListAgent"] },
    ];
    for (const p of people) {
      const user = (
        await db.query<{ id: string }>(
          "insert into identity.users (email, name) values ($1, $2) returning id",
          [p.email, p.name],
        )
      ).rows[0]!.id;
      await db.query(
        "insert into company_members (company_id, user_id, name, roles) values ($1, $2, $3, $4)",
        [company, user, p.name, p.roles],
      );
    }
  } finally {
    await db.end();
  }
}

interface Mail {
  email: string;
  text: string;
  kind?: string;
}

function codesFor(email: string): Mail[] {
  if (!existsSync(OUTBOX)) return [];
  return readFileSync(OUTBOX, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l) as Mail)
    .filter((m) => m.email === email && m.kind !== "invite");
}

/** Signs one person in through the real sign-in page, with the code the dev server wrote to this run's outbox. */
export async function signInWithCode(page: Page, email: string): Promise<void> {
  const before = codesFor(email).length;
  await page.goto("/login?next=%2F");
  await expect(page.locator('[data-state="email"][data-ready]')).toBeVisible();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Email").press("Enter");
  await expect(page.locator('[data-state="code"]')).toBeVisible();
  await expect.poll(() => codesFor(email).length, { timeout: 10_000 }).toBe(before + 1);
  const found =
    codesFor(email)
      .at(-1)!
      .text.match(/\b\d{6}\b/g) ?? [];
  if (found.length !== 1) throw new Error(`thu toi ${email} khong mang dung mot ma`);
  const code = page.getByLabel("Mã đăng nhập");
  await code.fill(found[0]!);
  await code.press("Enter");
  await page.waitForURL((u) => u.pathname === "/" && u.search === "");
  await expect(page.locator('[data-slot="account-menu"][data-ready]')).toBeVisible();
}
