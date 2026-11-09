import { createHash } from "node:crypto";

import { defineConfig, devices } from "@playwright/test";

const SIZES = [
  { name: "360", width: 360, height: 800 },
  { name: "414", width: 414, height: 896 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
];

// Each checkout gets its own port, so parallel worktrees never meet. E2E_PORT overrides it.
const digest = createHash("sha1").update(process.cwd()).digest();
const PORT = Number(process.env["E2E_PORT"] ?? 3500 + (digest.readUInt16BE(0) % 400));
const URL = `http://127.0.0.1:${PORT}`;

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
  },
});
