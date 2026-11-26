// AC-2: nine merges of main into a branch, each on a scratch repository built with real git.
// The driver is set by the prepare script of package.json itself, not by this measure.
// Usage: node merge.mjs [--root <dir>] [--control <file>]
//   --root     where .gitattributes and package.json are read (default: the repository)
//   --control  a .gitattributes to use as the control instead of the tree's file without the new line

import { readFileSync } from "node:fs";

import { ATTR_FILE, ATTR_LINE, DRIVER_KEY, GOP } from "./matrix.mjs";
import { done, git, lines, opt, read, refuse, rm, rootOf, run, scratchRepo, write } from "./lib.mjs";

const NAME = "merge";
const argv = process.argv.slice(2);
const root = rootOf(argv);
const treeAttr = read(root, ATTR_FILE);
const controlFile = opt(argv, "control");
const controlAttr =
  controlFile === undefined
    ? `${lines(treeAttr)
        .filter((l) => l !== ATTR_LINE)
        .join("\n")}\n`
    : readFileSync(controlFile, "utf8");
const prepare = JSON.parse(read(root, "package.json")).scripts?.prepare;
if (typeof prepare !== "string") refuse(NAME, "package.json has no prepare script");

const driverOf = (dir) => run("git", ["-C", dir, "config", "--get", DRIVER_KEY]).stdout.trim();
/** What `npm install` does for the driver: the prepare script, run in the clone. */
const setUp = (dir) => run("sh", ["-c", prepare], { cwd: dir });

const problems = [];

// The machine must not set the driver for every repository, or case 4 measures nothing.
const bare = scratchRepo("bare");
try {
  if (driverOf(bare) !== "") refuse(NAME, `${DRIVER_KEY} is set outside the repository on this machine`);
  setUp(bare);
  if (driverOf(bare) !== "true") problems.push(`the prepare script did not set ${DRIVER_KEY}`);
} finally {
  rm(bare);
}
if (problems.length === 0) {
  console.log(`${NAME}: the prepare script of package.json sets ${DRIVER_KEY} to true on a scratch repository`);
}

const attrOf = (which) => (which === "tree" ? treeAttr : controlAttr);
const commit = (dir, message) => {
  git(dir, "add", "-A");
  git(dir, "commit", "-q", "-m", message);
};

function attempt(c) {
  const dir = scratchRepo(`case${c.n}`);
  try {
    write(dir, ATTR_FILE, attrOf(c.attr));
    for (const file of new Set(["LO-TRINH.html", "PRODUCT-MAP.md", "docs/note.md", "wiki/log.md", c.file])) {
      write(dir, file, "base\n");
    }
    commit(dir, "base");

    git(dir, "checkout", "-q", "-b", "pr");
    if (c.change === "both") write(dir, c.file, "branch\n");
    if (c.change === "append") write(dir, c.file, "base\nbranch\n");
    write(dir, "branch-only.txt", "branch\n");
    commit(dir, "branch");

    git(dir, "checkout", "-q", "main");
    if (c.mainAttr !== undefined) write(dir, ATTR_FILE, attrOf(c.mainAttr));
    write(dir, c.file, c.change === "append" ? "base\nmain\n" : "main\n");
    commit(dir, "main");

    git(dir, "checkout", "-q", "pr");
    if (c.driver) {
      setUp(dir);
      if (driverOf(dir) !== "true") return `the prepare script did not set ${DRIVER_KEY}`;
    }
    const merged = run("git", ["-C", dir, "merge", "-q", "--no-edit", "main"]);
    const unmerged = lines(git(dir, "diff", "--name-only", "--diff-filter=U"));
    const text = read(dir, c.file);

    if (c.expect === "conflict") {
      if (merged.status === 0) return `expected a conflict in ${c.file}, got a clean merge`;
      if (unmerged.length !== 1 || unmerged[0] !== c.file) {
        return `expected a conflict in ${c.file} alone, got [${unmerged.join(", ")}]`;
      }
      return null;
    }
    const want = { "clean-branch": "branch\n", "clean-main": "main\n", "clean-both": null }[c.expect];
    const label = { "clean-branch": "keeping the branch", "clean-main": "taking main", "clean-both": "keeping both lines" }[
      c.expect
    ];
    if (merged.status !== 0 || unmerged.length > 0) {
      return `expected a clean merge ${label}, got a conflict in ${unmerged.join(", ")}`;
    }
    const kept = want === null ? text.includes("branch\n") && text.includes("main\n") : text === want;
    if (!kept) return `expected a clean merge ${label}, got ${JSON.stringify(text)}`;
    return null;
  } finally {
    rm(dir);
  }
}

const describe = (c) =>
  `${c.file}, ${c.mainAttr === undefined ? `.gitattributes of the ${c.attr}` : `branch ${c.attr} and main ${c.mainAttr}`}, ${c.driver ? "driver" : "no driver"}, ${c.change} → ${c.expect}`;

let clean = 0;
let failed = 0;
let conflict = 0;
for (const c of GOP) {
  const problem = attempt(c);
  if (problem === null) {
    console.log(`${NAME} case ${c.n}: ${describe(c)}, as expected`);
    if (c.expect === "conflict") conflict += 1;
    else clean += 1;
  } else {
    console.log(`${NAME} case ${c.n}: ${problem}`);
    failed += 1;
  }
}
if (failed > 0) problems.push(`${failed} of ${GOP.length} cases not as expected`);

done(NAME, problems, `${GOP.length} of ${GOP.length} cases as expected (${clean} clean, ${conflict} conflict)`);
