// Each measure of this record, both ways: green on the repository as it is, red with its pinned
// message on a copy or an input broken from the repository's own files. A measure never seen red
// proves nothing. The shallow-clone measure has its own file (shallow-two-way.mjs): it runs make check.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { after, test } from "node:test";

import { git, HERE, linkedCopy, lines, PLUGIN_REPO, ROOT, scratch } from "./lib.mjs";
import { AUDIT_DIFF, BASE, DERIVED, FILE_GROUPS, GATE_STEP, PLUGIN_SOURCE, RELEASE, STAMP, TOOL_FOLDER, UPGRADE, UPGRADE_CHANGES } from "./matrix.mjs";

const tmp = scratch("two-way");
after(() => rmSync(tmp, { recursive: true, force: true }));
const real = (file) => readFileSync(path.join(ROOT, file), "utf8");
const input = (name, text) => {
  const file = path.join(tmp, name);
  writeFileSync(file, text);
  return file;
};
const run = (script, ...args) => {
  const [cmd, first] = script.endsWith(".py") ? ["python3", []] : [process.execPath, []];
  const result = spawnSync(cmd, [...first, path.join(HERE, script), ...args], { encoding: "utf8", maxBuffer: 1 << 26 });
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
const redOnCopy = (expected, script, shape) => {
  const copy = linkedCopy(ROOT, shape);
  try {
    red(expected, script, "--root", copy.dir);
  } finally {
    copy.remove();
  }
};

test("tool-tree: green as it is; red on a changed byte, an extra file, a wrong stamp, a changed gate step", () => {
  green(`tool: ${TOOL_FOLDER} is the plugin's version 0.7.0, 34 files, tree f3d66a61fdcf`, "tool-tree.mjs");
  const check = `${TOOL_FOLDER}/check.mjs`;
  redOnCopy(`differs from the plugin's version 0.7.0: 34 files`, "tool-tree.mjs", { replace: { [check]: `${real(check)} ` } });
  redOnCopy(`differs from the plugin's version 0.7.0: 35 files`, "tool-tree.mjs", { replace: { [`${TOOL_FOLDER}/extra.mjs`]: "export {};\n" } });
  const stamp = JSON.parse(real(STAMP));
  redOnCopy("tool: the stamp says version 0.6.0, not 0.7.0", "tool-tree.mjs", {
    replace: { [STAMP]: JSON.stringify({ ...stamp, version: "0.6.0" }) },
  });
  redOnCopy("tool: the stamp's tree 7806e10b6bd6 is not the tree of version 0.7.0", "tool-tree.mjs", {
    replace: { [STAMP]: JSON.stringify({ ...stamp, tree: "7806e10b6bd670b038b630ffdaf5da841ff8b429" }) },
  });
  redOnCopy("tool: no stamp at design/tool-stamp.json", "tool-tree.mjs", { omit: [STAMP] });
  redOnCopy(`tool: ${GATE_STEP.file} is not the plugin's gate step`, "tool-tree.mjs", {
    replace: { [GATE_STEP.file]: `${real(GATE_STEP.file)}# changed\n` },
  });
});

test("release-ledger: green at the pinned commit; red with no repository, another tree, no such version", () => {
  green("release ledger: version 0.7.0 at 93daea4 names tool tree f3d66a61fdcf", "release-ledger.mjs", "--plugin-repo", PLUGIN_REPO);
  red(`release ledger: cannot read ${PLUGIN_SOURCE.ledger} at 93daea4 in ${tmp}`, "release-ledger.mjs", "--plugin-repo", tmp);
  const ledger = JSON.parse(git(PLUGIN_REPO, "show", `${PLUGIN_SOURCE.commit}:${PLUGIN_SOURCE.ledger}`));
  const other = structuredClone(ledger);
  other.releases.find((entry) => entry.version === RELEASE.version).tool = "f".repeat(40);
  red("release ledger: version 0.7.0 names tool tree ffffffffffff, not f3d66a61fdcf", "release-ledger.mjs", "--plugin-repo", PLUGIN_REPO, "--ledger", input("other.json", JSON.stringify(other)));
  const none = structuredClone(ledger);
  none.releases = none.releases.filter((entry) => entry.version !== RELEASE.version);
  red("release ledger: no version 0.7.0 at 93daea4", "release-ledger.mjs", "--plugin-repo", PLUGIN_REPO, "--ledger", input("none.json", JSON.stringify(none)));
});

test("out-of-git: green as it is; red on a tracked or unignored derived file, an old name, a lost fragment, an old reader", () => {
  green("out of git: 4 derived files untracked and ignored", "out-of-git.mjs");
  const tracked = lines(git(ROOT, "ls-files"));
  const list = (name, items) => input(name, items.join("\n"));
  red("out of git: derived files tracked by git: design/screens.yaml", "out-of-git.mjs", "--tracked", list("t1", [...tracked, "design/screens.yaml"]));
  red("out of git: derived files not ignored: design/intake.yaml", "out-of-git.mjs", "--ignored", list("i1", DERIVED.filter((f) => f !== "design/intake.yaml")));
  red("out of git: old names still in git: design/so-khoi.yaml", "out-of-git.mjs", "--tracked", list("t2", [...tracked, "design/so-khoi.yaml"]));
  red("out of git: intake: design/intake has 22 entry files, not 23", "out-of-git.mjs", "--tracked", list("t3", tracked.filter((f) => f !== "design/intake/sua-tren-o.yaml")));
  red("out of git: readers still naming an old path: tools/coverage_matrix/buttons.py", "out-of-git.mjs", "--old-names", list("o1", ["tools/proof_gate/legacy.py", "tools/coverage_matrix/buttons.py"]));
});

test("fragments-equal: green as it is; red on a lost entry, a changed field, a changed other key", () => {
  green("fragments: 9 screens entries and 23 intake entries hold exactly the data of the old ledgers at 69253032", "fragments-equal.py");
  redOnCopy("fragments: intake: entries lost: sua-tren-o", "fragments-equal.py", { omit: ["design/intake/sua-tren-o.yaml"] });
  const oldScreens = git(ROOT, "show", `${BASE}:design/screens.yaml`);
  const oldIntake = git(ROOT, "show", `${BASE}:design/so-khoi.yaml`);
  red("fragments: screens: entries lost: thu", "fragments-equal.py", "--old-screens", input("s1.yaml", `${oldScreens}  - id: thu\n    route: /thu\n`));
  red("fragments: intake: sua-tren-o differs (mo_ta)", "fragments-equal.py", "--old-intake", input("k1.yaml", oldIntake.replace("mo_ta: Sửa một ô ngay trong Lưới", "mo_ta: Đổi")));
  red("fragments: screens: _shared.yaml differs from the old ledger's other keys (statuses)", "fragments-equal.py", "--old-screens", input("s2.yaml", oldScreens.replace("statuses: [built, planned]", "statuses: [built]")));
});

test("two-branch-merge: green as it is; red when both branches add one id, and when the control has no one-file ledgers", () => {
  green("merge: two branches each adding a screen and a block merge clean", "two-branch-merge.mjs");
  red("merge: fragments: the two branches conflict", "two-branch-merge.mjs", "--same-id");
  red(`merge: control: design/screens.yaml is not in git at ${UPGRADE.slice(0, 8)}`, "two-branch-merge.mjs", "--control-on", UPGRADE);
});

test("affected-merges: green as it is; red with an empty map, and with a map that drops every screen", () => {
  green("affected: 30 merges: 26 all screens, 0 some screens, 4 no screen; with a declared screen missing: 0", "affected-merges.mjs");
  red("affected: 30 all screens, 0 some screens, 0 no screen, not 26 all screens", "affected-merges.mjs", "--map", input("m0.json", '{"global":[],"none":[]}'));
  red("affected: with a declared screen missing: 1, not 0", "affected-merges.mjs", "--map", input("m1.json", '{"global":[],"none":["**"]}'));
});

test("proof-gate-fragments: green as it is; red with no _shared.yaml, and with the old model renamed only", () => {
  green("proof gate: with design/intake.yaml and design/screens.yaml absent, the gate passes and decision 0023 reads 23 blocks", "proof-gate-fragments.mjs");
  red("proof gate: decision 0023 reads 0 blocks without the copies, not 23", "proof-gate-fragments.mjs", "--omit", "design/intake/_shared.yaml");
  const old = git(ROOT, "show", `${BASE}:tools/proof_gate/model.py`).replaceAll("design/so-khoi.yaml", "design/intake.yaml");
  red("proof gate: decision 0023 reads 0 blocks without the copies, not 23", "proof-gate-fragments.mjs", "--model", input("model.py", old));
});

test("audit-diff: green as it is; red on another changed line, on no change, on no plugin", () => {
  green(`audit: at 69253032 and at HEAD the plugin's audit differs in one line: «${AUDIT_DIFF.before}» → «${AUDIT_DIFF.after}»`, "audit-diff.mjs");
  const before = input("before.txt", `a\n${AUDIT_DIFF.before}\nb\n`);
  red("audit: the audits differ beyond the ledger files line", "audit-diff.mjs", "--before", before, "--after", input("a1.txt", `a\n${AUDIT_DIFF.after}\nc\n`));
  red('audit: the audits differ beyond the ledger files line: gone [], new []', "audit-diff.mjs", "--before", before, "--after", before);
  red("audit: cannot take the plugin out of", "audit-diff.mjs", "--plugin-repo", tmp);
});

test("change-list: green as it is; red on a file outside the commit's list, a file it left, a branch file beyond", () => {
  green(`changes: the upgrade commit changes exactly its ${UPGRADE_CHANGES.length} files`, "change-list.mjs");
  red("changes: upgrade commit changed outside the list: design/tokens.json", "change-list.mjs", "--commit-changes", input("c1", [...UPGRADE_CHANGES, "design/tokens.json"].join("\n")));
  red("changes: upgrade commit did not change: mk/derived.mk", "change-list.mjs", "--commit-changes", input("c2", UPGRADE_CHANGES.filter((f) => f !== "mk/derived.mk").join("\n")));
  red("changes: branch changed beyond the upgrade and this record: Makefile", "change-list.mjs", "--branch-changes", input("b1", [...UPGRADE_CHANGES, "Makefile"].join("\n")));
  const noBehaviors = Object.fromEntries(Object.entries(FILE_GROUPS).filter(([name]) => name !== "behaviour patterns as a list"));
  red("changes: upgrade commit files not in exactly one group: design/behaviors.md (0 groups)", "change-list.mjs", "--groups", input("g1.json", JSON.stringify(noBehaviors)));
  const wrongCount = structuredClone(FILE_GROUPS);
  wrongCount["wiki front-matter links"].count = 5;
  red("changes: groups off their count: wiki front-matter links 6/5", "change-list.mjs", "--groups", input("g2.json", JSON.stringify(wrongCount)));
  green("changes: the upgrade commit changes exactly its 81 files, each in one of 13 groups; the branch is in origin/main already, so only the commit was compared", "change-list.mjs", "--merged");
  red("changes: upgrade commit changed outside the list: design/tokens.json", "change-list.mjs", "--merged", "--commit-changes", input("c3", [...UPGRADE_CHANGES, "design/tokens.json"].join("\n")));
});

test("law-day: green as it is; red when the gate reads the new paths only", () => {
  green("law day: 2026-11-12, from the commit 1edac3b0 adding design/so-khoi.yaml", "law-day.py");
  const newOnly = real("tools/proof_gate/legacy.py").replace('LEDGER_PATHS = ("design/so-khoi.yaml", ', "LEDGER_PATHS = (");
  red("law day: the gate reads 2026-11-17, not 2026-11-12", "law-day.py", "--legacy", input("legacy.py", newOnly));
});
