import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { defineConfig, devices } from "@playwright/test";

const SIZES = [
  { name: "360", width: 360, height: 800 },
  { name: "414", width: 414, height: 896 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
];

// One run, its own dev server: a gate round runs two browser commands of this config side by side (`make e2e` and
// the slowed repeat run of row 1r), so each run gets its own port, build folder and tsconfig, as playwright.db.config.ts
// does. The run id is set once by the main process; workers inherit it. E2E_PORT overrides the port.
process.env["E2E_RUN"] ??= `${process.pid}`;
const RUN = process.env["E2E_RUN"];
const digest = createHash("sha1").update(`${process.cwd()}:${RUN}`).digest();
const PORT = Number(process.env["E2E_PORT"] ?? 3500 + (digest.readUInt16BE(0) % 400));
const URL = `http://127.0.0.1:${PORT}`;
const CACHE = join("node_modules", ".cache", "onehub-e2e", RUN);
const UP = "../../../../";
const BASE_TSCONFIG = JSON.parse(readFileSync("tsconfig.json", "utf8")) as {
  compilerOptions: Record<string, unknown>;
};
mkdirSync(CACHE, { recursive: true });
writeFileSync(
  join(CACHE, "tsconfig.json"),
  JSON.stringify(
    {
      compilerOptions: { ...BASE_TSCONFIG.compilerOptions, paths: { "@/*": [`${UP}src/*`] } },
      include: [`${UP}next-env.d.ts`, `${UP}src`],
    },
    null,
    2,
  ),
);

export default defineConfig({
  testDir: "tests/e2e",
  reporter: "list",
  use: { baseURL: URL },
  projects: SIZES.map(({ name, width, height }) => ({
    name,
    use: { ...devices["Desktop Chrome"], viewport: { width, height } },
  })),
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: URL,
    // Never reuse: a server left running by another checkout would be tested instead of this code.
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NEXT_DIST_DIR: join(CACHE, "next"),
      NEXT_TSCONFIG: join(CACHE, "tsconfig.json"),
    },
  },
});
