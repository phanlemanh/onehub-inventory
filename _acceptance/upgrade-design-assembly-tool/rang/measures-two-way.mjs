// Each measure of this record, both ways: green on the repository as it is, red with its pinned
// message on a copy broken from the repository's own files. A measure never seen red proves
// nothing.
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import path from "node:path";
import { execPath } from "node:process";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";

import { linkedCopy, runCheck } from "./linked-copy.mjs";
import {
  BASE,
  PLUGIN_SOURCE,
  REGISTRY,
  RELEASE,
  STAMP,
  TOOL_FOLDER,
  UPGRADE_CHANGES,
} from "./matrix.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../../..");
// The plugin's own repository, where its release ledger is read: the owner's checkout on this machine,
// or the folder named by DESIGN_ASSEMBLY_REPO.
const PLUGIN_REPO = process.env.DESIGN_ASSEMBLY_REPO ?? path.join(homedir(), "dev/design-assembly");
const scratch = mkdtempSync(path.join(tmpdir(), "upgrade-design-assembly-tool-"));
after(() => rmSync(scratch, { recursive: true, force: true }));

const real = (file) => readFileSync(path.join(ROOT, file), "utf8");
const broken = (name, text) => {
  const file = path.join(scratch, name);
  writeFileSync(file, text);
  return file;
};
const run = (script, ...args) => {
  const result = spawnSync(execPath, [path.join(HERE, script), ...args], { encoding: "utf8" });
  return { code: result.status, out: `${result.stdout}${result.stderr}` };
};
const green = (script, ...args) => {
  const result = run(script, ...args);
  assert.equal(result.code, 0, result.out);
};
const red = (expected, script, ...args) => {
  const result = run(script, ...args);
  assert.equal(result.code, 1, result.out);
  assert.ok(result.out.includes(expected), `expected "${expected}" in:\n${result.out}`);
};
// The measure run on a linked copy of the repository with some files replaced.
const redOnCopy = (expected, script, replace) => {
  const copy = linkedCopy(ROOT, replace);
  try {
    red(expected, script, "--root", copy.dir);
  } finally {
    copy.remove();
  }
};
const stamp = (change) => {
  const value = JSON.parse(real(STAMP));
  change(value);
  return `${JSON.stringify(value, null, 2)}\n`;
};

test("tool-tree: green as it is; red on a changed byte, an extra file, a wrong or missing stamp", () => {
  green("tool-tree.mjs", "--root", ROOT);
  const check = `${TOOL_FOLDER}/check.mjs`;
  redOnCopy(
    `tool: ${TOOL_FOLDER} differs from the plugin's version ${RELEASE.version}: ${RELEASE.files} files`,
    "tool-tree.mjs",
    { [check]: `${real(check)} ` },
  );
  redOnCopy(
    `tool: ${TOOL_FOLDER} differs from the plugin's version ${RELEASE.version}: ${RELEASE.files + 1} files`,
    "tool-tree.mjs",
    { [`${TOOL_FOLDER}/extra.mjs`]: "export {};\n" },
  );
  redOnCopy("tool: the stamp says version 0.0.9, not 0.1.0", "tool-tree.mjs", {
    [STAMP]: stamp((value) => (value.version = "0.0.9")),
  });
  redOnCopy(
    "tool: the stamp's tree 000000000000 is not the tree of version 0.1.0",
    "tool-tree.mjs",
    { [STAMP]: stamp((value) => (value.tree = "0".repeat(40))) },
  );
  // A copy whose design folder has no stamp: every other file of design/ is linked back.
  const copy = linkedCopy(ROOT, { [`design/.keep`]: "" });
  try {
    rmSync(path.join(copy.dir, STAMP));
    red("tool: no stamp at design/tool-stamp.json", "tool-tree.mjs", "--root", copy.dir);
  } finally {
    copy.remove();
  }
});

test("register-gains-parts: green as it is; red with no part added, a part lost, a field changed, a component gone", () => {
  green("register-gains-parts.mjs", "--root", ROOT);
  const before = execFileSync("git", ["-C", ROOT, "show", `${BASE}:${REGISTRY}`], { encoding: "utf8" });
  red(
    "register: parts not added: Filters.FiltersAdvanced FiltersRow.FilterChip FiltersRow.FiltersBuilder",
    "register-gains-parts.mjs",
    "--root",
    ROOT,
    "--after",
    broken("before.json", before),
  );
  const now = () => JSON.parse(real(REGISTRY));
  const lost = now();
  lost.components.find((entry) => entry.name === "FiltersRow").parts = ["FilterChip"];
  red(
    "register: parts not added: FiltersRow.FiltersBuilder",
    "register-gains-parts.mjs",
    "--root",
    ROOT,
    "--after",
    broken("lost.json", JSON.stringify(lost)),
  );
  const changed = now();
  changed.components.find((entry) => entry.name === "FilterChip").level = "atom";
  red(
    "register: changed beyond the parts: FilterChip (level)",
    "register-gains-parts.mjs",
    "--root",
    ROOT,
    "--after",
    broken("changed.json", JSON.stringify(changed)),
  );
  const gone = now();
  gone.components = gone.components.filter((entry) => entry.name !== "FilterChip");
  red(
    "register: components added or removed: FilterChip",
    "register-gains-parts.mjs",
    "--root",
    ROOT,
    "--after",
    broken("gone.json", JSON.stringify(gone)),
  );
});

test("the tool's register check: green as it is; red when the register lacks a part the source draws", () => {
  const as = runCheck(ROOT);
  assert.equal(as.code, 0, as.out);
  const lacking = JSON.parse(real(REGISTRY));
  lacking.components.find((entry) => entry.name === "FiltersRow").parts = ["FilterChip"];
  const copy = linkedCopy(ROOT, { [REGISTRY]: `${JSON.stringify(lacking, null, 2)}\n` });
  try {
    const result = runCheck(copy.dir);
    assert.notEqual(result.code, 0, result.out);
    assert.ok(
      result.out.includes("design/component-registry.json is not what src/components gives"),
      result.out,
    );
    assert.ok(result.out.includes("FiltersRow differs"), result.out);
  } finally {
    copy.remove();
  }
});

test("upgrade-changes: green as it is; red with a file outside the upgrade, or one it did not change", () => {
  green("upgrade-changes.mjs", "--root", ROOT);
  red(
    "upgrade commit: changed outside the upgrade: design/theme.json",
    "upgrade-changes.mjs",
    "--root",
    ROOT,
    "--changed",
    broken("outside.txt", [...UPGRADE_CHANGES, "design/theme.json"].join("\n")),
  );
  red(
    "upgrade commit: not changed by the upgrade: design/tool-stamp.json",
    "upgrade-changes.mjs",
    "--root",
    ROOT,
    "--changed",
    broken("untouched.txt", UPGRADE_CHANGES.filter((file) => file !== STAMP).join("\n")),
  );
});

test("release-ledger: green at the pinned commit; red with no repository, another tree, no such version", () => {
  green("release-ledger.mjs", "--plugin-repo", PLUGIN_REPO);
  red(
    `release ledger: cannot read ${PLUGIN_SOURCE.ledger} at ${PLUGIN_SOURCE.commit.slice(0, 7)} in ${scratch}`,
    "release-ledger.mjs",
    "--plugin-repo",
    scratch,
  );
  const ledger = JSON.parse(
    execFileSync("git", ["-C", PLUGIN_REPO, "show", `${PLUGIN_SOURCE.commit}:${PLUGIN_SOURCE.ledger}`], {
      encoding: "utf8",
    }),
  );
  const other = structuredClone(ledger);
  other.releases.find((entry) => entry.version === RELEASE.version).tool = "f".repeat(40);
  red(
    `release ledger: version ${RELEASE.version} names tool tree ffffffffffff, not ${RELEASE.tool.slice(0, 12)}`,
    "release-ledger.mjs",
    "--ledger",
    broken("other.json", JSON.stringify(other)),
  );
  const none = structuredClone(ledger);
  none.releases = none.releases.filter((entry) => entry.version !== RELEASE.version);
  red(
    `release ledger: no version ${RELEASE.version} at ${PLUGIN_SOURCE.commit.slice(0, 7)}`,
    "release-ledger.mjs",
    "--ledger",
    broken("none.json", JSON.stringify(none)),
  );
});

test("branch-changes: green as it is; red with the tokens ledger or the gate step changed", () => {
  green("branch-changes.mjs", "--root", ROOT);
  const record = "_acceptance/upgrade-design-assembly-tool/contract.md";
  for (const extra of ["design/tokens.json", "mk/design-assembly.mk"]) {
    red(
      `branch: changed outside the upgrade and this record: ${extra}`,
      "branch-changes.mjs",
      "--root",
      ROOT,
      "--changed",
      broken("branch.txt", [...UPGRADE_CHANGES, record, extra].join("\n")),
    );
  }
  const merged = run("branch-changes.mjs", "--root", ROOT, "--changed", broken("empty.txt", ""));
  assert.equal(merged.code, 0, merged.out);
  assert.ok(merged.out.includes("branch: nothing between main and HEAD to compare (merged already)"), merged.out);
});
