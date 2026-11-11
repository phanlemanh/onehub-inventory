import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
    coverage: {
      enabled: true,
      provider: "v8",
      // One folder per run: two test runs in the same checkout (a gate round runs the suite and the
      // test evals side by side) otherwise fight over one report folder and the second run aborts.
      reportsDirectory: `coverage/run-${process.pid}`,
      include: ["src/**"],
      // Entry points, generated code, vendor components and screens are covered by other means.
      exclude: [
        "src/generated/**",
        "src/**/*.d.ts",
        "src/app/**",
        "src/components/ui/**",
        "src/components/reui/**",
        "src/components/templates/**",
        "src/hooks/**",
        "src/lib/utils.ts",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
});
