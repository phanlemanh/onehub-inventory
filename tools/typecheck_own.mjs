#!/usr/bin/env node
// Type-checks the repo's own code with noUncheckedIndexedAccess. Vendor files are installed by the
// CLI and never edited, and some do not pass that flag, so their errors are left out here.
//
//   node tools/typecheck_own.mjs
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const VENDOR = /^src\/components\/(ui|reui)\//;

export function ownErrors(output) {
  return output.split("\n").filter((line) => /: error TS\d+/.test(line) && !VENDOR.test(line));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = ["tsc", "-p", "tsconfig.strict.json", "--noEmit", "--pretty", "false"];
  const { stdout } = spawnSync("npx", args, { encoding: "utf8" });
  const errors = ownErrors(stdout);
  for (const line of errors) console.error(line);
  process.exit(errors.length ? 1 : 0);
}
