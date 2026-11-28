// Frames for E15 (the look check of VP11 slice 1): the repository's browser config, with this folder as the test folder
// and one browser. Paths of the base config are relative to the repository root, so they are made absolute here.
// CHUP_DIR names where the frames go (evidence/truoc on the branch before the round, evidence/sau here).
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import base from "../../../playwright.config";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");
const server = Array.isArray(base.webServer) ? base.webServer[0]! : base.webServer!;

export default {
  ...base,
  testDir: HERE,
  testMatch: "chup.pw.ts",
  globalSetup: join(ROOT, "tests", "e2e-db", "don-dung-tam.ts"),
  reporter: "list",
  projects: [{ name: "chup" }],
  webServer: { ...server, cwd: ROOT },
};
