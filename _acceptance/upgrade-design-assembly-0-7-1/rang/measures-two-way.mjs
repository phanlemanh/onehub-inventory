// Each fast measure of this record, both ways: green on the repository as it is, red with its pinned
// message on a copy or an input broken from the repository's own files. A measure never seen red
// proves nothing. The shallow-clone measures have their own file (shallow-two-way.mjs): they run make.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { after, test } from "node:test";

import { git, HERE, linkedCopy, PLUGIN_REPO, ROOT, scratch } from "./lib.mjs";
import { BASE, GATE_STEP, PLUGIN_SOURCE, RELEASE, STAMP, TOOL_FOLDER, UPGRADE_CHANGES } from "./matrix.mjs";

const tmp = scratch("two-way");
after(() => rmSync(tmp, { recursive: true, force: true }));
const real = (file) => readFileSync(path.join(ROOT, file), "utf8");
const input = (name, text) => {
  const file = path.join(tmp, name);
  writeFileSync(file, text);
  return file;
};
const run = (script, ...args) => {
  const cmd = script.endsWith(".py") ? "python3" : process.execPath;
  const result = spawnSync(cmd, [path.join(HERE, script), ...args], { encoding: "utf8", maxBuffer: 1 << 26 });
  return { code: result.status, out: `${result.stdout}${result.stderr}` };
};
const green = (expected, script, ...args) => {
  const result = run(script, ...args);
  assert.equal(result.code, 0, result.out);
  assert.ok(result.out.includes(expected), `expected "${expected}" in:\n${result.out}`);
};
const red = (expected, script, ...args) => {
  const result = run(script, ...args);
  assert.equal(result.code, 1, result.out);
  assert.ok(result.out.includes(expected), `expected "${expected}" in:\n${result.out}`);
};
const redOnCopy = (expected, script, shape, ...args) => {
  const copy = linkedCopy(ROOT, shape);
  try {
    red(expected, script, "--root", copy.dir, ...args);
  } finally {
    copy.remove();
  }
};

test("tool-tree: green as it is; red on a changed tool file, a 0.7.0 stamp, a changed gate step", () => {
  green(
    `tool: ${TOOL_FOLDER} is the plugin's version 0.7.1, 34 files, tree 2da4cc56de55; the stamp says the same; mk/design-assembly.mk is the template's`,
    "tool-tree.mjs",
  );
  const tool = `${TOOL_FOLDER}/owner-calls.mjs`;
  redOnCopy(`differs from the plugin's version 0.7.1: 34 files`, "tool-tree.mjs", {
    replace: { [tool]: `${real(tool)} ` },
  });
  const stamp = JSON.parse(real(STAMP));
  redOnCopy("tool: the stamp says version 0.7.0, not 0.7.1", "tool-tree.mjs", {
    replace: { [STAMP]: JSON.stringify({ ...stamp, version: "0.7.0" }) },
  });
  redOnCopy("tool: the stamp's tree f3d66a61fdcf is not the tree of version 0.7.1", "tool-tree.mjs", {
    replace: { [STAMP]: JSON.stringify({ ...stamp, tree: "f3d66a61fdcfbdfca103d48c7077bd1c9b95bb73" }) },
  });
  redOnCopy(`tool: ${GATE_STEP.file} is not the plugin's gate step`, "tool-tree.mjs", {
    replace: { [GATE_STEP.file]: `${real(GATE_STEP.file)}# changed\n` },
  });
});

test("release-ledger: green at the pinned commit; red with no repository, no such version", () => {
  green(
    "release ledger: version 0.7.1 at ba3af6b names tool tree 2da4cc56de55, the one pinned here; its templates have that tree and the gate step",
    "release-ledger.mjs",
    "--plugin-repo",
    PLUGIN_REPO,
  );
  red(`release ledger: cannot read ${PLUGIN_SOURCE.ledger} at ba3af6b in ${tmp}`, "release-ledger.mjs", "--plugin-repo", tmp);
  const ledger = JSON.parse(git(PLUGIN_REPO, "show", `${PLUGIN_SOURCE.commit}:${PLUGIN_SOURCE.ledger}`));
  const none = { ...ledger, releases: ledger.releases.filter((entry) => entry.version !== RELEASE.version) };
  red(
    "release ledger: no version 0.7.1 at ba3af6b",
    "release-ledger.mjs",
    "--plugin-repo",
    PLUGIN_REPO,
    "--ledger",
    input("none.json", JSON.stringify(none)),
  );
});

test("rows-mirror: green as it is; red on a changed field, a lost row, a changed check, another changed row, no plugin", () => {
  green(
    "rows: decision-sheet and owner-calls are the plugin's rows at ba3af6b field for field; their checks are the plugin's but for blueprint, which this repository has no file for; nothing else changed in the two files since 8925e8ff",
    "rows-mirror.py",
  );
  const ledger = real("design/decisions.yaml");
  const theme = real("design/theme.json");
  const ownNote = ledger.match(/ {4}note: "a new page under design\/patterns[^\n]*/)[0];
  redOnCopy("rows: row owner-calls differs from the plugin's in note", "rows-mirror.py", {
    replace: { "design/decisions.yaml": ledger.replace(ownNote, '    note: "changed"') },
  });
  const sheetRow = ledger.slice(ledger.indexOf("  - id: decision-sheet\n"), ledger.indexOf("  - id: owner-calls\n"));
  redOnCopy("rows: no row decision-sheet", "rows-mirror.py", {
    replace: { "design/decisions.yaml": ledger.replace(sheetRow, "") },
  });
  const at = theme.indexOf('"owner-calls": [');
  const pages = theme.indexOf('"pages": "design/patterns"', at);
  assert.ok(at > 0 && pages > at, "the owner-calls check names its pages folder");
  const movedPages = `${theme.slice(0, pages)}"pages": "design/screens"${theme.slice(pages + '"pages": "design/patterns"'.length)}`;
  redOnCopy("rows: check owner-calls differs from the plugin's", "rows-mirror.py", {
    replace: { "design/theme.json": movedPages },
  });
  const shapesNote = ledger.match(/ {4}note: "that each ledger present has its shape[^\n]*/)[0];
  redOnCopy("rows: design/decisions.yaml changed beyond the two rows since 8925e8ff", "rows-mirror.py", {
    replace: { "design/decisions.yaml": ledger.replace(shapesNote, '    note: "changed"') },
  });
  const themeData = JSON.parse(theme);
  const otherCheck = Object.keys(themeData.checks).find((key) => !["decision-sheet", "owner-calls"].includes(key));
  const changedOther = { ...themeData, checks: { ...themeData.checks, [otherCheck]: [] } };
  redOnCopy("rows: design/theme.json changed beyond the two checks since 8925e8ff", "rows-mirror.py", {
    replace: { "design/theme.json": JSON.stringify(changedOther, null, 2) },
  });
  red("rows: cannot read design/decisions.yaml at ba3af6b", "rows-mirror.py", "--plugin-repo", tmp);
});

test("fixture-tags: green as it is; red on the fixtures of 8925e8ff", () => {
  green(
    "fixtures: tests/design-check.test.ts holds no string the tagged-test reader takes for a tag; at 8925e8ff it held decision:a, decision:other, decision:a-b",
    "fixture-tags.mjs",
  );
  red(
    "fixtures: tests/design-check.test.ts still holds tags: decision:a decision:other decision:a-b",
    "fixture-tags.mjs",
    "--file-from",
    BASE,
  );
});

test("change-list: green as it is; red on an extra commit file, a lost one, a branch file beyond, a wiki file beyond; green merged", () => {
  green(`changes: the upgrade commit changes its ${UPGRADE_CHANGES.length} files; the branch changes nothing beyond them and this record`, "change-list.mjs");
  const list = (name, files) => input(name, files.join("\n"));
  red("changes: upgrade commit changed outside the list: design/tokens.json", "change-list.mjs", "--commit-changes", list("c1", [...UPGRADE_CHANGES, "design/tokens.json"]));
  red("changes: upgrade commit did not change: design/theme.json", "change-list.mjs", "--commit-changes", list("c2", UPGRADE_CHANGES.filter((file) => file !== "design/theme.json")));
  red("changes: branch changed beyond the upgrade and this record: Makefile", "change-list.mjs", "--branch-changes", list("b1", [...UPGRADE_CHANGES, "Makefile"]));
  red("changes: branch changed beyond the upgrade and this record: wiki/decisions/0099-x.md", "change-list.mjs", "--branch-changes", list("b2", [...UPGRADE_CHANGES, "wiki/log.md", "wiki/decisions/0099-x.md"]));
  green(`changes: the upgrade commit changes its ${UPGRADE_CHANGES.length} files; the branch is in origin/main already, so only the commit was compared`, "change-list.mjs", "--merged");
});
