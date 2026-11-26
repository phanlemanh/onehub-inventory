#!/usr/bin/env node
// AC-5: the repository's own design tool, run now, finds the three decisions held by their lint rules.
//
//   node held.mjs [--root <tree>]
//
// Runs `tools/design-assembly/check.mjs --rate` of the tree, which re-runs the tool's probes through the
// tree's lint, and reads the line of each decision. A decision that is not "held … re-run here" by its rule
// prints "E5 KHÔNG GIỮ: <id> …" and the command exits 1.
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const at = args.indexOf("--root");
const ROOT = path.resolve(at === -1 ? path.join(HERE, "../../..") : args[at + 1]);

const WANT = {
  spacing: "onehub-ui/no-off-scale-spacing",
  "whole-class-names": "onehub-ui/no-partial-class",
  "lint-exceptions": "onehub-ui/require-disable-reason",
};

console.log(`held: root ${ROOT}`);
const run = spawnSync(
  process.execPath,
  [path.join(ROOT, "tools/design-assembly/check.mjs"), "--rate", "--target", ROOT],
  { cwd: ROOT, encoding: "utf8" },
);
const out = `${run.stdout}\n${run.stderr}`;
if (run.status !== 0) console.log(`held: check.mjs thoát ${run.status}`);
let failed = run.status === 0 ? 0 : 1;
for (const [id, rule] of Object.entries(WANT)) {
  const line = out.split("\n").find((l) => new RegExp(`^\\s+\\S+\\s+\\S+\\s+${id}\\s+\\(`).test(l)) ?? "";
  if (/^\s+held\s/.test(line) && line.includes(`(eslint:${rule}, re-run here)`)) {
    console.log(`E5 giữ: ${id} bởi ${rule}`);
  } else {
    failed++;
    console.log(`E5 KHÔNG GIỮ: ${id} — ${line.trim() || "không có dòng"}`);
  }
}
process.exit(failed ? 1 : 0);
