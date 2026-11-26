// AC-5 (the cases): tests/commit-msg.test.ts of the tree against the base. Its accepted and refused lists are read
// from the file (the two `for (const … of [ … ])` arrays): every case of the base is still in the same list, the tree
// adds exactly TEST_NEW_OK to the accepted list and TEST_NEW_BAD to the refused list, and nothing else changes.
// Usage: node test-cases.mjs [--root <dir>]

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { prBase, root, show, verdict } from "./lib.mjs";
import { TEST_NEW_BAD, TEST_NEW_OK } from "./matrix.mjs";

const NAME = "test-cases";
const FILE = "tests/commit-msg.test.ts";
const dir = root();
const problems = [];

/** The string items of the array after `for (const <name> of [`, as JavaScript reads them. */
function list(text, name) {
  const m = text.match(new RegExp(`for \\(const ${name} of \\[([\\s\\S]*?)\\]\\)`));
  if (!m) throw new Error(`${FILE} has no list of ${name} cases`);
  return [...m[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => JSON.parse(`"${x[1]}"`));
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

try {
  const base = show(dir, prBase(dir), FILE);
  if (base === null) throw new Error(`the base has no ${FILE}`);
  const tree = readFileSync(join(dir, FILE), "utf8");
  for (const [name, added] of [
    ["ok", TEST_NEW_OK],
    ["bad", TEST_NEW_BAD],
  ]) {
    const before = list(base, name);
    const after = list(tree, name);
    const kept = after.filter((c) => before.includes(c));
    if (!same(kept, before)) problems.push(`the ${name} cases of the base are not all kept in order: ${JSON.stringify(before.filter((c) => !after.includes(c)))} gone`);
    const extra = after.filter((c) => !before.includes(c));
    if (!same([...extra].sort(), [...added].sort())) problems.push(`the tree adds ${JSON.stringify(extra)} to the ${name} cases, not ${JSON.stringify(added)}`);
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `${FILE} keeps every case of the base and adds ${TEST_NEW_OK.length} accepted and ${TEST_NEW_BAD.length} refused cases, no other`,
);
