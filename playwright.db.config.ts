// Browser tests of sign-in on this lane's Postgres (row 8):
//   DB_LANE=n DB_PORT=5563 npx playwright test -c playwright.db.config.ts
// Global setup makes the scratch database dang_nhap_e2e and seeds it; the dev server reads codes from an outbox file
// (development only — production never writes codes anywhere). Not run on CI: CI has no Postgres yet.
import { createHash } from "node:crypto";
import { join } from "node:path";

import { defineConfig, devices } from "@playwright/test";

const SIZES = [
  { name: "360", width: 360, height: 800 },
  { name: "414", width: 414, height: 896 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
];

const digest = createHash("sha1").update(`${process.cwd()}:db`).digest();
const PORT = Number(process.env["E2E_DB_PORT"] ?? 3900 + (digest.readUInt16BE(0) % 90));
const URL = `http://127.0.0.1:${PORT}`;
const DB_PORT = process.env["DB_PORT"] ?? "5563";
export const OUTBOX = join(process.cwd(), "test-results", "e2e-db-outbox.jsonl");

export default defineConfig({
  testDir: "tests/e2e-db",
  reporter: "list",
  workers: 1,
  globalSetup: "./tests/e2e-db/setup.ts",
  use: { baseURL: URL },
  projects: SIZES.map(({ name, width, height }) => ({
    name,
    use: { ...devices["Desktop Chrome"], viewport: { width, height } },
  })),
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: URL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      DATABASE_URL: `postgres://postgres:local-only@127.0.0.1:${DB_PORT}/dang_nhap_e2e`,
      AUTH_SECRET: "e2e-only-secret",
      LOGIN_CODE_OUTBOX: OUTBOX,
    },
  },
});
