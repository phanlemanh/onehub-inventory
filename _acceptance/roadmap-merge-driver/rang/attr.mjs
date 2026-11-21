// AC-1: LO-TRINH.html carries merge=generated-file next to PRODUCT-MAP.md, and nothing older moved.
// Usage: node attr.mjs [--root <dir>]   (the directory must be a git work tree: check-attr reads it)

import { ATTR_FILE, ATTR_LINE, ATTRS, MAP_LINE } from "./matrix.mjs";
import { atBase, done, lines, read, refuse, rootOf, run } from "./lib.mjs";

const NAME = "attr";
const root = rootOf();
const tree = lines(read(root, ATTR_FILE));
const baseText = atBase(ATTR_FILE);
if (baseText === null) refuse(NAME, `the base has no ${ATTR_FILE}`);
const base = lines(baseText);
const problems = [];

const at = tree.indexOf(ATTR_LINE);
const mapAt = tree.indexOf(MAP_LINE);
if (at < 0) problems.push(`no line ${ATTR_LINE}`);
else if (mapAt < 0 || at !== mapAt + 1) problems.push("the new line does not follow PRODUCT-MAP.md");

// Every line of the base, but the one comment above the block, is still there and in the same order.
const comment = base.indexOf(MAP_LINE) - 1;
if (comment < 0 || !base[comment].startsWith("#")) refuse(NAME, "the base has no comment line above PRODUCT-MAP.md");
let seen = 0;
for (const [i, line] of base.entries()) {
  if (i === comment) continue;
  const found = tree.indexOf(line, seen);
  if (found < 0) {
    problems.push(`a line of the base is gone: ${JSON.stringify(line)}`);
    break;
  }
  seen = found + 1;
}
const added = tree.length - (base.length - 1);
const reworded = mapAt > 0 && tree[mapAt - 1].startsWith("#") && tree[mapAt - 1] !== base[comment] ? 1 : 0;
if (problems.length === 0 && added !== 2) problems.push(`the tree has ${added} lines the base has not, expected 2`);
if (problems.length === 0 && reworded !== 1) problems.push("the comment above the block was not reworded in place");

const paths = ATTRS.map(([path]) => path);
const asked = run("git", ["-C", root, "check-attr", "merge", "--", ...paths]);
if (asked.status !== 0) refuse(NAME, `git check-attr failed in ${root}: ${asked.stderr.trim()}`);
const answers = new Map(lines(asked.stdout).map((l) => [l.split(": merge: ")[0], l.split(": merge: ")[1]]));
for (const [path, want] of ATTRS) {
  if (answers.get(path) !== want) problems.push(`check-attr merge of ${path} is ${answers.get(path)}, expected ${want}`);
}

done(
  NAME,
  problems,
  "LO-TRINH.html merge=generated-file follows PRODUCT-MAP.md; check-attr gives generated-file for both, union for wiki/log.md, unspecified for README.md and package.json; every line of the base is kept in order, 1 comment line reworded, 1 line added",
);
