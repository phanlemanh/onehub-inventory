// AC-8: each measure is green on the tree as it is, and red with its pinned message on a copy where
// exactly one thing is broken. A measure that has never been red proves nothing.
// Usage: node --test two-way.mjs

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { after, test } from "node:test";

import {
  ATTR_FILE,
  ATTR_LINE,
  CONFIG,
  DECISION,
  DRIVER_CMD,
  LIMIT_GITHUB,
  LIMIT_OLD_BRANCH,
  MAP_LINE,
  PAGE,
  PATTERN,
  SLUG,
  TOUR,
  UPGRADES,
  WORKFLOW,
} from "./matrix.mjs";
import { atBase, baseSha, git, HERE, lines, read, REPO, rm, run, scratchDir, scratchRepo, write } from "./lib.mjs";
import { judge } from "./change-set.mjs";

const made = [];
after(() => made.forEach(rm));

/** Run a measure of this folder; returns its exit code and what it printed. */
const measure = (name, ...args) => {
  const r = run(process.execPath, [join(HERE, `${name}.mjs`), ...args]);
  return { status: r.status, out: `${r.stdout}${r.stderr}` };
};

/** A copy holding the given files of the repository, each passed through its edit when it has one. */
function copyOf(files, edits = {}, { repo = false } = {}) {
  const dir = repo ? scratchRepo("two-way") : scratchDir("two-way");
  made.push(dir);
  for (const rel of files) write(dir, rel, (edits[rel] ?? ((t) => t))(read(REPO, rel)));
  return dir;
}

/** Replace exactly one occurrence, or fail loudly: a break that did not apply must not look green. */
const swap = (from, to) => (text) => {
  assert.equal(text.split(from).length - 1, 1, `the break did not apply: ${JSON.stringify(from)}`);
  return text.replace(from, to);
};
const dropLine = (line) => swap(`${line}\n`, "");

function red(name, args, pinned) {
  const r = measure(name, ...args);
  assert.equal(r.status, 1, `${name} should be red:\n${r.out}`);
  assert.match(r.out, pinned);
}

// --- green on the tree as it is -------------------------------------------------------------

for (const name of ["attr", "merge", "redraw", "docs", "decision", "codeql", "change-set"]) {
  test(`${name}: green on the tree`, () => {
    const r = measure(name);
    assert.equal(r.status, 0, r.out);
    assert.match(r.out, new RegExp(`^${name}: `, "m"));
  });
}

// --- attr -------------------------------------------------------------------------------------

test("attr: red when the new line is gone", () => {
  const dir = copyOf([ATTR_FILE], { [ATTR_FILE]: dropLine(ATTR_LINE) }, { repo: true });
  red("attr", ["--root", dir], /^attr: no line LO-TRINH\.html merge=generated-file$/m);
});

test("attr: red when the new line does not follow PRODUCT-MAP.md", () => {
  const moved = (t) => `${ATTR_LINE}\n${dropLine(ATTR_LINE)(t)}`;
  const dir = copyOf([ATTR_FILE], { [ATTR_FILE]: moved }, { repo: true });
  red("attr", ["--root", dir], /^attr: the new line does not follow PRODUCT-MAP\.md$/m);
});

test("attr: red when a line of the base is gone", () => {
  const dir = copyOf([ATTR_FILE], { [ATTR_FILE]: dropLine("*.png binary") }, { repo: true });
  red("attr", ["--root", dir], /^attr: a line of the base is gone: "\*\.png binary"$/m);
});

// --- merge ------------------------------------------------------------------------------------

test("merge: case 1 red when .gitattributes has no line for the page", () => {
  const dir = copyOf([ATTR_FILE, "package.json"], { [ATTR_FILE]: dropLine(ATTR_LINE) });
  red("merge", ["--root", dir], /^merge case 1: expected a clean merge keeping the branch, got a conflict in LO-TRINH\.html$/m);
});

test("merge: case 5 red when the control still has the line", () => {
  const control = join(copyOf([ATTR_FILE]), ATTR_FILE);
  red("merge", ["--control", control], /^merge case 5: expected a conflict in LO-TRINH\.html, got a clean merge$/m);
});

test("merge: red when the prepare script no longer sets the driver", () => {
  const dir = copyOf([ATTR_FILE, "package.json"], { "package.json": swap(DRIVER_CMD, "true") });
  red("merge", ["--root", dir], /^merge: the prepare script did not set merge\.generated-file\.driver$/m);
});

// --- redraw -----------------------------------------------------------------------------------

test("redraw: red when the check lets a stale page through", () => {
  const kit = scratchDir("kit");
  made.push(kit);
  write(kit, "scripts/product-map.mjs", "process.exit(0);\n");
  red("redraw", ["--kit", kit], /^redraw: the stale page was not caught$/m);
});

// --- docs -------------------------------------------------------------------------------------

const DOC_FILES = [TOUR, "package.json", ATTR_FILE, CONFIG];

test("docs: red when the driver command is gone", () => {
  const dir = copyOf(DOC_FILES, { [TOUR]: dropLine(DRIVER_CMD) });
  red("docs", ["--root", dir], /^docs: the driver command is missing$/m);
});

test("docs: red when the redraw command is not the repository's", () => {
  const dir = copyOf(DOC_FILES, { [TOUR]: swap('scripts/product-map.mjs" --root .', 'scripts/other-map.mjs" --root .') });
  red("docs", ["--root", dir], /^docs: the redraw command is not the repository's$/m);
});

test("docs: red when the GitHub limit is gone", () => {
  const dir = copyOf(DOC_FILES, { [TOUR]: swap(LIMIT_GITHUB, "GitHub") });
  red("docs", ["--root", dir], /^docs: the GitHub limit is missing$/m);
});

test("docs: red when the limit for older branches is gone", () => {
  const dir = copyOf(DOC_FILES, { [TOUR]: swap(LIMIT_OLD_BRANCH, "Nhánh cũ") });
  red("docs", ["--root", dir], /^docs: the limit for branches opened before the line is missing$/m);
});

// --- decision ---------------------------------------------------------------------------------

const logEntry = readdirSync(join(REPO, "wiki/log")).filter((f) => read(REPO, join("wiki/log", f)).includes("0046"));
const DECISION_FILES = [
  DECISION,
  ...logEntry.map((f) => join("wiki/log", f)),
  ...UPGRADES.map((u) => join("_acceptance", u.slug, "contract.md")),
];

test("decision: red when a tier is not the contract's", () => {
  const row = lines(read(REPO, DECISION)).find((l) => l.startsWith("| 0.10.1 "));
  const dir = copyOf(DECISION_FILES, { [DECISION]: swap(row, row.replace("T2", "T3")) });
  red("decision", ["--root", dir], /^decision: tier of 0\.10\.1 is T3 in the page, T2 in its contract$/m);
});

test("decision: red when a section is gone", () => {
  const dir = copyOf(DECISION_FILES, { [DECISION]: swap("\n## Consequences\n", "\n") });
  red("decision", ["--root", dir], /^decision: section Consequences is missing$/m);
});

test("decision: red when the owner's sentence is gone", () => {
  const dir = copyOf(DECISION_FILES, { [DECISION]: (t) => t.replaceAll("gom theo mốc, trừ bản vá", "gom lại, trừ bản vá") });
  red("decision", ["--root", dir], /^decision: the owner's sentence is missing$/m);
});

// --- codeql -----------------------------------------------------------------------------------

test("codeql: red when the pattern is wider", () => {
  const dir = copyOf([WORKFLOW], { [WORKFLOW]: swap(`"${PATTERN}"`, '"_acceptance/**"') });
  red("codeql", ["--root", dir], /^codeql: the pattern is not exactly _acceptance\/\*\*\/rang\/\*\*$/m);
});

test("codeql: red when the pattern is narrower", () => {
  const dir = copyOf([WORKFLOW], { [WORKFLOW]: swap(`"${PATTERN}"`, `"_acceptance/${SLUG}/rang/**"`) });
  red("codeql", ["--root", dir], /^codeql: the pattern misses \d+ measure files/m);
});

test("codeql: red when the workflow lost a line of the base", () => {
  const dir = copyOf([WORKFLOW], { [WORKFLOW]: dropLine("name: Security") });
  red("codeql", ["--root", dir], /^codeql: the workflow lost a line of the base: "name: Security"$/m);
});

test("codeql: red when a workflow runs a measure", () => {
  const dir = copyOf([WORKFLOW]);
  write(dir, ".github/workflows/ci.yml", `${read(REPO, ".github/workflows/ci.yml")}      - run: node _acceptance/${SLUG}/rang/attr.mjs\n`);
  red("codeql", ["--root", dir], /^codeql: a caller names a measure of a record: \.github\/workflows\/ci\.yml$/m);
});

// --- change-set -------------------------------------------------------------------------------

const changeSet = () => ({
  files: lines(git(REPO, "diff", "--name-only", `${baseSha()}...HEAD`)),
  baseConfig: atBase(CONFIG),
  headConfig: git(REPO, "show", `HEAD:${CONFIG}`),
});

test("change-set: red when a file outside the round changed", () => {
  const set = changeSet();
  const { problems } = judge({ ...set, files: [...set.files, "src/app/page.tsx"] });
  assert.deepEqual(problems, ["outside the round: src/app/page.tsx"]);
});

test("change-set: red when risk_tiers changed", () => {
  const set = changeSet();
  const headConfig = swap('    - "LO-TRINH.html"\n', '    - "LO-TRINH.html"\n    - ".gitattributes"\n')(set.headConfig);
  const { problems } = judge({ ...set, headConfig });
  assert.ok(problems.includes("risk_tiers differs from the base"), problems.join("\n"));
});

test("change-set: red when the config lost a line", () => {
  const set = changeSet();
  const headConfig = dropLine("schema_version: 1")(set.headConfig);
  const { problems } = judge({ ...set, headConfig });
  assert.ok(problems.includes(`${CONFIG} lost a line: "schema_version: 1"`), problems.join("\n"));
});

// The page and the map are files of the round too: a guard on the names the measures share.
test("matrix: the generated files are the two the attributes mark", () => {
  const marked = lines(read(REPO, ATTR_FILE)).filter((l) => l.endsWith(" merge=generated-file"));
  assert.deepEqual(marked, [MAP_LINE, ATTR_LINE]);
  assert.equal(ATTR_LINE.split(" ")[0], PAGE);
});
