import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import globals from "globals";

import { plugin as shadcn } from "@shadcn/lint";

import onehubUi from "./tools/eslint-ui/index.mjs";

const UI_FILES = [
  "src/app/**/*.{ts,tsx}",
  "src/components/**/*.{ts,tsx}",
  "src/modules/*/ui/**/*.{ts,tsx}",
];
const VENDOR = ["src/components/ui/**", "src/components/reui/**", "src/hooks/use-mobile.ts"];
const UI_RULES = Object.fromEntries(
  Object.keys(onehubUi.rules).map((r) => [`onehub-ui/${r}`, "error"]),
);
const noImports = (group, message) => ({
  "no-restricted-imports": ["error", { patterns: [{ group, message }] }],
});

export default defineConfig([
  globalIgnores([
    ".next/",
    "dist/",
    "coverage/",
    "node_modules/",
    "src/generated/",
    "next-env.d.ts",
    "playwright-report/",
    "test-results/",
    "src/components/reui/",
  ]),
  js.configs.recommended,
  ...nextVitals,
  ...nextTs,
  { files: ["src/hooks/use-mobile.ts"], rules: { "react-hooks/set-state-in-effect": "off" } },
  {
    files: ["**/*.mjs", "tools/**/*.js"],
    languageOptions: { globals: globals.node },
    rules: { "import/no-anonymous-default-export": "off" },
  },
  { files: UI_FILES, ignores: VENDOR, plugins: { "onehub-ui": onehubUi }, rules: UI_RULES },
  {
    files: UI_FILES,
    ignores: VENDOR,
    plugins: { shadcn },
    rules: {
      "shadcn/no-restyle": [
        "error",
        {
          contracts: [
            { pattern: "^Button$", allow: ["w-full", "mt-*", "mb-*", "ml-*", "mr-*", "self-*"] },
          ],
        },
      ],
      "shadcn/no-arbitrary-values": "error",
      "shadcn/no-inline-styles": "error",
    },
  },
  {
    files: ["src/components/templates/**/*.{ts,tsx}"],
    rules: noImports(
      ["@/modules/*", "**/modules/*"],
      "A template receives content through slots, never from a module.",
    ),
  },
  {
    files: ["src/components/candidate/**/*.{ts,tsx}", "src/components/core/**/*.{ts,tsx}"],
    rules: noImports(
      ["@/app/*", "@/modules/*", "**/modules/*"],
      "Shared components know nothing about screens or modules.",
    ),
  },
  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: noImports(
      ["@/components/candidate/*", "@/components/templates/*", "@/modules/*"],
      "Vendor components stay at the bottom.",
    ),
  },
  prettier,
]);
