// AC-4: every ledger row of 1226ec5, the commit before the adoption, is kept byte for byte, but the
// component-level row, whose check line alone moves to the design-assembly tool.
// Usage: node ledger-rows-kept.mjs --root <repository> [--old F] [--new F]
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { exit, stdout } from "node:process";

import { option } from "./linked-copy.mjs";

const BASE = "1226ec5";
const FROM = '    check: "tool:tools/design_registry.mjs"';
const TO = '    check: "tool:tools/design-assembly/components.mjs"';

const root = path.resolve(option("--root", "."));
const oldText = option("--old")
  ? readFileSync(option("--old"), "utf8")
  : execFileSync("git", ["-C", root, "show", `${BASE}:design/decisions.yaml`], { encoding: "utf8" });
const newText = readFileSync(option("--new", path.join(root, "design/decisions.yaml")), "utf8");

// One block per row, from its `  - id:` line to the next row, comments inside included.
const rows = (text) =>
  new Map(
    text
      .split(/\n(?= {2}- id: )/)
      .slice(1)
      .map((block) => block.replace(/\s+$/, ""))
      .map((block) => [/^ {2}- id: (\S+)/.exec(block)[1], block]),
  );
const before = rows(oldText);
const after = rows(newText);

let kept = 0;
for (const [id, block] of before) {
  if (!after.has(id)) {
    stdout.write(`row missing: ${id}\n`);
    exit(1);
  }
  const expected = id === "component-level" ? block.replace(FROM, TO) : block;
  if (id === "component-level" && expected === block) {
    stdout.write("row changed: component-level (its old check line is not what 1226ec5 had)\n");
    exit(1);
  }
  if (after.get(id) !== expected) {
    stdout.write(`row changed: ${id}\n`);
    exit(1);
  }
  if (id !== "component-level") kept += 1;
}
stdout.write(`rows kept: ${kept} of ${before.size}; changed: component-level\n`);
stdout.write("component-level: tool:tools/design_registry.mjs -> tool:tools/design-assembly/components.mjs\n");
