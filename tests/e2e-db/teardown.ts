// Drop this run's scratch database, its outbox and its test session.
import { rmSync } from "node:fs";

import pg from "pg";

import { DB_NAME, DB_URL, OUTBOX, SESSION_FILE } from "../../playwright.db.config";

export default async function teardown(): Promise<void> {
  const admin = new pg.Client({ connectionString: DB_URL.replace(`/${DB_NAME}`, "/postgres") });
  await admin.connect();
  try {
    await admin.query(`drop database if exists ${DB_NAME} with (force)`);
  } finally {
    await admin.end();
  }
  rmSync(OUTBOX, { force: true });
  rmSync(SESSION_FILE, { force: true });
}
