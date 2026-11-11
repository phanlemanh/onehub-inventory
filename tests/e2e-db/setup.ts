// Fresh scratch database for the browser flow; each test adds its own people so rate limits never meet.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { DB_NAME, OUTBOX } from "../../playwright.db.config";
import { scratchDb } from "../db/helpers";

export default async function setup(): Promise<void> {
  const db = await scratchDb(DB_NAME.replace(/^dang_nhap_/, ""));
  await db.owner.end();
  mkdirSync(dirname(OUTBOX), { recursive: true });
  writeFileSync(OUTBOX, "");
}
