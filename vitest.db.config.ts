// Database tests of sign-in (row 8): run on this lane's Postgres, never in `make test` (CI has no Postgres yet).
//   DB_LANE=n DB_PORT=5563 npx vitest run -c vitest.db.config.ts
// Each test file makes its own scratch databases named dang_nhap_* and drops them.
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    include: ["tests/db/**/*.db.test.ts"],
    fileParallelism: false,
    testTimeout: 60_000,
    hookTimeout: 120_000,
    coverage: { enabled: false },
  },
});
