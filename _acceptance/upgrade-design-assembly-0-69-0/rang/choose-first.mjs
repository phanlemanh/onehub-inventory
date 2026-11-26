// AC-8: the choose-first check holds in this repository, both ways. On a clone of HEAD whose main is
// where the branch left it: the gate is green; a commit that adds a component file with no row of
// the intake ledger turns it red, naming the file and the component; and a row of the intake ledger
// naming that file turns it green again. The row is made from a row the plugin's writer already
// wrote (`ROW_FROM` in the matrix), with its name, file and need changed, never typed in the
// reader's shape.
// Usage: node choose-first.mjs [--root <repository>] [--theme <file>] [--row-file <path>]
//   (--theme hands the clone another design/theme.json, --row-file makes the row name another file:
//   both for the break copies)
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { branchBase, git, head, option, ROOT, run, workClone } from "./lib.mjs";
import { CHOOSE_FIRST, GATE, gateLine, THEME } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const theme = option("--theme");
const rowFile = option("--row-file", CHOOSE_FIRST.file);
const base = branchBase(root);
const clone = workClone(root);
const at = (...args) => git(clone.dir, ...args);
const commit = (message) => at("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", message);
const found = [];
const component = path
  .basename(CHOOSE_FIRST.file, ".tsx")
  .split("-")
  .map((part) => part[0].toUpperCase() + part.slice(1))
  .join("");
const said = `${CHOOSE_FIRST.file} holds ${component}, a component this branch adds with no row of the intake ledger`;

// A row of the intake ledger for the probe, made from a row the writer wrote: each key the matrix
// names is replaced on its own line, and the call stops when the source row lacks one of them.
function probeRow() {
  const source = readFileSync(path.join(root, CHOOSE_FIRST.rowFrom), "utf8");
  const values = { ten: component, tep: rowFile, nhu_cau: CHOOSE_FIRST.need };
  let text = source;
  for (const [key, value] of Object.entries(values)) {
    const line = new RegExp(`^${key}: .*$`, "m");
    if (!line.test(text)) throw new Error(`${CHOOSE_FIRST.rowFrom} has no line ${key}: to change`);
    text = text.replace(line, `${key}: ${value}`);
  }
  return text;
}

try {
  // The clone's main is where this branch left main, and nothing else names a main branch.
  run("git", ["-C", clone.dir, "update-ref", "-d", "refs/remotes/origin/HEAD"], clone.dir);
  at("update-ref", "refs/remotes/origin/main", base);
  if (theme) {
    copyFileSync(path.resolve(theme), path.join(clone.dir, THEME));
    at("add", THEME);
    commit("theme");
  }
  const before = run("node", ["tools/design-assembly/check.mjs"], clone.dir);
  if (!theme && before.status !== 0) found.push(`the gate exit ${before.status} before the component was added`);
  if (!theme && !before.out.includes(gateLine(GATE))) found.push(`the gate did not say before: ${gateLine(GATE)}`);
  mkdirSync(path.dirname(path.join(clone.dir, CHOOSE_FIRST.file)), { recursive: true });
  writeFileSync(path.join(clone.dir, CHOOSE_FIRST.file), CHOOSE_FIRST.text);
  at("add", CHOOSE_FIRST.file);
  commit("probe");
  const after = run("node", ["tools/design-assembly/check.mjs"], clone.dir);
  if (after.status === 0) found.push(`the gate let ${CHOOSE_FIRST.file} through (exit 0)`);
  else if (!after.out.includes(said)) found.push(`the gate went red without saying: ${said}`);
  // The row that takes it in.
  writeFileSync(path.join(clone.dir, CHOOSE_FIRST.rowAt), probeRow());
  at("add", CHOOSE_FIRST.rowAt);
  commit("row");
  const taken = run("node", ["tools/design-assembly/check.mjs"], clone.dir);
  if (taken.status !== 0) found.push(`the gate stayed red with an intake row for ${rowFile} (exit ${taken.status})`);
  else if (!taken.out.includes(gateLine(GATE))) found.push(`the gate did not say with the row: ${gateLine(GATE)}`);
} finally {
  clone.remove();
}
for (const line of found) process.stdout.write(`choose-first: ${line}\n`);
if (found.length === 0) {
  process.stdout.write(
    `choose-first: on a clone of ${head(root).slice(0, 12)} with main at ${base.slice(0, 8)}, the gate is green, adding ${CHOOSE_FIRST.file} with no intake row turns it red (${said}), and an intake row for it made from ${CHOOSE_FIRST.rowFrom} turns it green again\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
