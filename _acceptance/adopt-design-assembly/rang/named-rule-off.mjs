// AC-2: each of the eight lint decisions is held by the rule its ledger row names. On a linked copy
// of the repository with that one rule turned off, and nothing else, the design-assembly check
// fails and names the row; one copy per row.
// Usage: node named-rule-off.mjs --root <repository> [--tool <dir>]
//   --tool: a folder whose check.mjs, lint.mjs and adapters/eslint.mjs replace the tool's in every
//   copy, to see this measure red with a tool that lets another rule hold the row.
import { readFileSync } from "node:fs";
import path from "node:path";
import { exit, stdout } from "node:process";

import { linkedCopy, option, runCheck } from "./linked-copy.mjs";
import { LINT } from "./matrix.mjs";

const root = path.resolve(option("--root", "."));
const tool = option("--tool");
const TOOL_FILES = ["check.mjs", "lint.mjs", "adapters/eslint.mjs"];
const replaced = tool
  ? Object.fromEntries(
      TOOL_FILES.map((file) => [
        `tools/design-assembly/${file}`,
        readFileSync(path.join(tool, file), "utf8"),
      ]),
    )
  : {};
const config = readFileSync(path.join(root, "eslint.config.js"), "utf8");

const failures = [];
for (const [id, rule] of Object.entries(LINT)) {
  const ruleOff = config.replace(
    /\]\);\s*$/,
    `  { files: UI_FILES, rules: { "${rule}": "off" } },\n]);\n`,
  );
  if (ruleOff === config) {
    stdout.write("named rule off: cannot place the rule-off entry at the end of eslint.config.js\n");
    exit(1);
  }
  const copy = linkedCopy(root, { ...replaced, "eslint.config.js": ruleOff });
  try {
    const result = runCheck(copy.dir);
    const named = result.out
      .split("\n")
      .find(
        (line) =>
          line.trim().startsWith(`${id}: the repository's lint lets through`) &&
          line.includes(`${rule} does not reject it`),
      );
    if (result.code === 0) failures.push(`${id} still green with ${rule} off`);
    else if (!named) failures.push(`${id} not named with ${rule} off\n${result.out}`);
    else stdout.write(`${named.trim()}\n`);
  } finally {
    copy.remove();
  }
}
if (failures.length) {
  for (const failure of failures) stdout.write(`named rule off: ${failure}\n`);
  exit(1);
}
stdout.write(
  `named rule off: ${Object.keys(LINT).length} rows, each red with its own rule off\n`,
);
