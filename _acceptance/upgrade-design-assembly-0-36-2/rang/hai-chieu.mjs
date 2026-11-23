// Both directions of every measure in kiem.mjs: green on a clean copy of HEAD, red with its pinned
// line on a copy with one thing broken. Copies are clones sharing this repository's objects; the
// repository itself is never written. Run: node --test hai-chieu.mjs [--test-name-pattern <mode>]
import assert from "node:assert/strict";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

import { git, HERE, pluginAt, ROOT, run, scratch, workClone } from "./lib.mjs";
import { BASE, PLUGIN, RULES_PAGE, STAMP, THEME, TOOL_FOLDER } from "./matrix.mjs";

const KIEM = path.join(HERE, "kiem.mjs");
const kiem = (mode, root, extra = [], env = {}) => run("node", [KIEM, mode, "--root", root, ...extra], ROOT, env);

// One clean copy and one broken copy of HEAD; `breakIt` gets the broken copy's folder.
function pair(mode, breakIt, pinned, { extra = [], env = {} } = {}) {
  const clean = workClone(ROOT);
  const broken = workClone(ROOT);
  try {
    const green = kiem(mode, clean.dir);
    assert.equal(green.status, 0, `${mode} should be green on a clean copy:\n${green.out}`);
    const more = breakIt(broken.dir) ?? {};
    const red = kiem(mode, broken.dir, more.extra ?? extra, more.env ?? env);
    assert.equal(red.status, 1, `${mode} should be red on the broken copy:\n${red.out}`);
    assert.ok(red.out.includes(pinned), `${mode} red without '${pinned}':\n${red.out}`);
  } finally {
    clean.remove();
    broken.remove();
  }
}

const edit = (dir, file, change) => writeFileSync(path.join(dir, file), change(readFileSync(path.join(dir, file), "utf8")));
const dropCheck = (dir, id) =>
  edit(dir, THEME, (text) => {
    const theme = JSON.parse(text);
    delete theme.checks[id];
    return `${JSON.stringify(theme, null, 2)}\n`;
  });

test("gate: a check gone from design/theme.json", () =>
  pair("gate", (dir) => dropCheck(dir, "radius"), "the gate did not say: design-assembly: 22 decisions held by 30 checks"));

test("tool: a tool file edited", () =>
  pair("tool", (dir) => edit(dir, `${TOOL_FOLDER}/fonts.mjs`, (t) => `${t}\n// edited\n`), "differs from the plugin's version 0.36.2"));

test("tool: the stamp says 0.36.1", () =>
  pair("tool", (dir) => edit(dir, STAMP, (t) => t.replace('"0.36.2"', '"0.36.1"')), "the stamp says version 0.36.1, not 0.36.2"));

test("tool: the plugin's source cannot be read", () => {
  const empty = scratch("no-plugin");
  try {
    pair("tool", () => ({ env: { DA_REPO: empty } }), "cannot read the plugin's source at bdf2bcc");
  } finally {
    rmSync(empty, { recursive: true, force: true });
  }
});

test("font: the build adapter of 0.36.1", () =>
  pair(
    "font",
    (dir) => git(dir, "checkout", "-q", BASE, "--", `${TOOL_FOLDER}/adapters/nextjs-build.mjs`),
    'the load of --font-sans has via undefined, not "loader"',
  ));

test("rules: the page as PR 111 left it", () =>
  pair("rules", (dir) => git(dir, "checkout", "-q", BASE, "--", RULES_PAGE), "the Type line is not the one 0.36.2 writes: - Running text is set in `undefined`"));

test("rules: a line added by hand", () =>
  pair("rules", (dir) => edit(dir, RULES_PAGE, (t) => `${t}- A rule written by hand.\n`), "the page differs from the one 0.36.2's adopt writes on a copy of HEAD"));

test("rules: E7 of the signed record no longer red", () =>
  pair(
    "rules",
    (dir) => git(dir, "checkout", "-q", BASE, "--", RULES_PAGE),
    "E7 of the signed record did not go red with exactly 'rules: 0 lines say undefined, the known defect is one': exit 0",
  ));

test("adopt: a row adopt would add again", () =>
  pair(
    "adopt",
    (dir) => {
      dropCheck(dir, "typeface");
      edit(dir, "design/decisions.yaml", (t) => {
        const start = t.indexOf("  - id: typeface\n");
        const next = t.indexOf("\n  - id:", start + 5);
        return next === -1 ? t.slice(0, start) : t.slice(0, start) + t.slice(next + 1);
      });
    },
    "adopt did not say (rows): rows to add: 0",
  ));

// The real output of adopt 0.36.2 on a clean copy, edited one way, measured through --out-file.
function adoptOutputPair(editOut, pinned) {
  const clean = workClone(ROOT);
  const plugin = pluginAt(PLUGIN.repo(), PLUGIN.rev, PLUGIN.folder);
  const file = path.join(scratch("adopt-out"), "out.txt");
  try {
    const real = run("node", [path.join(plugin.dir, "scripts/adopt.mjs"), "--target", clean.dir, "--dry-run"], clean.dir, {
      CLAUDE_PLUGIN_ROOT: plugin.dir,
    }).out;
    writeFileSync(file, real);
    const green = kiem("adopt", clean.dir, ["--out-file", file]);
    assert.equal(green.status, 0, `adopt should be green on the real output:\n${green.out}`);
    writeFileSync(file, editOut(real));
    const red = kiem("adopt", clean.dir, ["--out-file", file]);
    assert.equal(red.status, 1, `adopt should be red on the edited output:\n${red.out}`);
    assert.ok(red.out.includes(pinned), `adopt red without '${pinned}':\n${red.out}`);
  } finally {
    clean.remove();
    plugin.remove();
    rmSync(path.dirname(file), { recursive: true, force: true });
  }
}

test("adopt: a second question for a person", () =>
  adoptOutputPair(
    (out) => out.replace("needs a person:\n", "needs a person:\n  font-via: a question adopt never asked before\n"),
    "adopt asks 2 question(s), not the one font-source question",
  ));

test("adopt: a file to write", () =>
  adoptOutputPair(
    (out) => out.replace("files:\n  nothing to write", "files:\n  update    .claude/rules/design-assembly.md"),
    "adopt did not say (nothing): nothing to write",
  ));

test("states: the 0.36.1 side reads a theme without the raw-table check", () => {
  const theme = path.join(scratch("theme"), "theme.json");
  const data = JSON.parse(readFileSync(path.join(ROOT, THEME), "utf8"));
  delete data.checks["raw-table"];
  writeFileSync(theme, `${JSON.stringify(data, null, 2)}\n`);
  try {
    pair("states", () => ({ extra: ["--old-theme", theme] }), "raw-table is held with the tool at HEAD");
  } finally {
    rmSync(path.dirname(theme), { recursive: true, force: true });
  }
});

test("changes: a commit that touches a screen", () =>
  pair(
    "changes",
    (dir) => {
      edit(dir, "src/app/layout.tsx", (t) => `${t}\n`);
      git(dir, "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-am", "break");
    },
    "file changed outside the matrix: src/app/layout.tsx",
  ));
