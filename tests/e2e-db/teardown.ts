// Drop this run's scratch database and its outbox.
import { rmSync } from "node:fs";

import pg from "pg";

import { DB_NAME, DB_URL, OUTBOX } from "../../playwright.db.config";

export default async function teardown(): Promise<void> {
  const admin = new pg.Client({ connectionString: DB_URL.replace(`/${DB_NAME}`, "/postgres") });
  await admin.connect();
  try {
    await admin.query(`drop database if exists ${DB_NAME} with (force)`);
  } finally {
    await admin.end();
  }
  rmSync(OUTBOX, { force: true });
}
