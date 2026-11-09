import { defineConfig, devices } from "@playwright/test";

const SIZES = [
  { name: "360", width: 360, height: 800 },
  { name: "414", width: 414, height: 896 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
];

export default defineConfig({
  testDir: "tests/e2e",
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3470" },
  projects: SIZES.map(({ name, width, height }) => ({
    name,
    use: { ...devices["Desktop Chrome"], viewport: { width, height } },
  })),
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3470",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
