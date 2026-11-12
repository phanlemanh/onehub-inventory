// Fresh scratch database for the browser flow; each test adds its own people so rate limits never meet. The
// register-driven suite (row 1r) gets one test person, signed in once by tests/e2e-db/phien.setup.ts.
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { DB_NAME, OUTBOX, SESSION_FILE, TEST_PERSON } from "../../playwright.db.config";
import { scratchDb } from "../db/helpers";

export default async function setup(): Promise<void> {
  const db = await scratchDb(DB_NAME.replace(/^dang_nhap_/, ""));
  // The register-driven suite's test person (row 1r): one test company, all four roles, so every screen opens in its
  // normal state and none in «not allowed».
  const company = (
    await db.owner.query<{ id: string }>(
      "insert into companies (name) values ('[Sàn thử phiên]') returning id",
    )
  ).rows[0]!.id;
  const person = (
    await db.owner.query<{ id: string }>(
      "insert into identity.users (email, name) values ($1, '[Tên] Phiên thử') returning id",
      [TEST_PERSON],
    )
  ).rows[0]!.id;
  await db.owner.query(
    "insert into company_members (company_id, user_id, name, roles) values ($1, $2, '[Tên] Phiên thử', $3)",
    [company, person, ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"]],
  );
  await db.owner.end();
  rmSync(SESSION_FILE, { force: true });
  mkdirSync(dirname(OUTBOX), { recursive: true });
  writeFileSync(OUTBOX, "");
}
