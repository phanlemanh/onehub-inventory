import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
    coverage: {
      enabled: true,
      provider: "v8",
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
