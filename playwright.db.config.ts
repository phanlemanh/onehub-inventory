// Browser tests of sign-in on this lane's Postgres (row 8):
//   DB_LANE=n DB_PORT=5563 npx playwright test -c playwright.db.config.ts
// Global setup makes the scratch database dang_nhap_e2e and seeds it; the dev server reads codes from an outbox file
// (development only — production never writes codes anywhere). Not run on CI: CI has no Postgres yet.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { defineConfig, devices } from "@playwright/test";

const SIZES = [
  { name: "360", width: 360, height: 800 },
  { name: "414", width: 414, height: 896 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
];

// One run, its own everything: two runs at once (a gate round runs this command for two evals in parallel) never
// share a port, a database, a build folder or an outbox. The run id is set once by the main process; workers
// inherit it through the environment.
process.env["E2E_DB_RUN"] ??= `${process.pid}`;
const RUN = process.env["E2E_DB_RUN"];
const digest = createHash("sha1").update(`${process.cwd()}:db:${RUN}`).digest();
const PORT = Number(process.env["E2E_DB_PORT"] ?? 4000 + (digest.readUInt16BE(0) % 900));
const URL = `http://127.0.0.1:${PORT}`;
const DB_PORT = process.env["DB_PORT"] ?? "5563";
// Outside .next: `next build` (run beside these tests in a gate round) empties .next and would pull the folder out
// from under this dev server (row 1m). dist/ is already ignored by git, ESLint and Prettier.
const DIST_DIR = `dist/e2e-db-${RUN}`;
// The dev server's own tsconfig (next.config.ts), a copy of the repository's with paths from its own folder: the
// repository's tsconfig.json stays untouched. Turbopack does not read files inside the build folder, so it lives in
// the package cache.
const TSCONFIG_DIR = join("node_modules", ".cache", "onehub-e2e-db", RUN);
const BASE_TSCONFIG = JSON.parse(readFileSync("tsconfig.json", "utf8")) as {
  compilerOptions: Record<string, unknown>;
};
const UP = "../../../../";
mkdirSync(TSCONFIG_DIR, { recursive: true });
writeFileSync(
  join(TSCONFIG_DIR, "tsconfig.json"),
  JSON.stringify(
    {
      compilerOptions: { ...BASE_TSCONFIG.compilerOptions, paths: { "@/*": [`${UP}src/*`] } },
      include: [`${UP}next-env.d.ts`, `${UP}src`],
    },
    null,
    2,
  ),
);
export const DB_NAME = `dang_nhap_e2e_${RUN}`;
export const DB_URL = `postgres://postgres:local-only@127.0.0.1:${DB_PORT}/${DB_NAME}`;
// Outside test-results: every Playwright run empties that folder when it starts, including another run's outbox.
export const OUTBOX = join(tmpdir(), `onehub-e2e-db-outbox-${RUN}.jsonl`);

export default defineConfig({
  testDir: "tests/e2e-db",
  reporter: "list",
  workers: 1,
  // A dev server compiles each route on first use; with other servers building at the same time that takes longer
  // than the 5-second default.
  timeout: 90_000,
  expect: { timeout: 20_000 },
  globalSetup: "./tests/e2e-db/setup.ts",
  globalTeardown: "./tests/e2e-db/teardown.ts",
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
      DATABASE_URL: DB_URL,
      NEXT_DIST_DIR: DIST_DIR,
      NEXT_TSCONFIG: join(TSCONFIG_DIR, "tsconfig.json"),
      AUTH_SECRET: "e2e-only-secret",
      LOGIN_CODE_OUTBOX: OUTBOX,
    },
  },
});
