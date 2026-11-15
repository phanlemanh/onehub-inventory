// Each measure of this record, both ways: green on the repository as it is, red with its pinned
// message on a copy broken from the repository's own files. A measure never seen red proves
// nothing.
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execPath } from "node:process";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";

import { linkedCopy } from "./linked-copy.mjs";
import { BASE, DEFINED_AT, REGISTRY, TOOL_FOLDER } from "./matrix.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../../..");
const scratch = mkdtempSync(path.join(tmpdir(), "refresh-design-assembly-tool-"));
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

test("register-names-once: green as it is; red on the old register, a moved entry, a lost name", () => {
  green("register-names-once.mjs", "--root", ROOT);
  // The register as the old tool wrote it, from the commit the branch was cut from.
  const before = execFileSync("git", ["-C", ROOT, "show", `${BASE}:${REGISTRY}`], { encoding: "utf8" });
  red(
    "names once: listed more than once: FilterAdvancedRow FilterChip",
    "register-names-once.mjs",
    "--root",
    ROOT,
    "--registry",
    broken("before.json", before),
  );
  const barrel = "src/components/reui/filters/filters.tsx";
  const moved = JSON.parse(real(REGISTRY));
  moved.components.find((component) => component.name === "FilterChip").file = barrel;
  red(
    `names once: FilterChip is at ${barrel}, not at ${DEFINED_AT.FilterChip}`,
    "register-names-once.mjs",
    "--root",
    ROOT,
    "--registry",
    broken("moved.json", JSON.stringify(moved)),
  );
  const lost = JSON.parse(real(REGISTRY));
  const at = lost.components.findIndex((component) => !(component.name in DEFINED_AT));
  const [gone] = lost.components.splice(at, 1);
  red(
    `names once: the old tool listed, the new one does not: ${gone.name}`,
    "register-names-once.mjs",
    "--root",
    ROOT,
    "--registry",
    broken("lost.json", JSON.stringify(lost)),
  );
  const more = JSON.parse(real(REGISTRY));
  more.components.push({ ...more.components[0], name: "NotAComponent" });
  red(
    "names once: the new tool lists, the old one did not: NotAComponent",
    "register-names-once.mjs",
    "--root",
    ROOT,
    "--registry",
    broken("more.json", JSON.stringify(more)),
  );
  // With the new tool given as the old one, nothing is listed twice, so the comparison says so.
  red(
    "names once: the old tool did not list twice: FilterAdvancedRow FiltersAdvancedPanel",
    "register-names-once.mjs",
    "--root",
    ROOT,
    "--old-tool",
    path.join(ROOT, TOOL_FOLDER, "components.mjs"),
  );
});

test("the tool's own register check, with the new tool: green as committed, red without an entry", () => {
  const check = (dir) => {
    const result = spawnSync(execPath, [path.join(dir, TOOL_FOLDER, "components.mjs"), "--target", dir], {
      encoding: "utf8",
    });
    return { code: result.status, out: `${result.stdout}${result.stderr}` };
  };
  const sound = check(ROOT);
  assert.equal(sound.code, 0, sound.out);
  const without = JSON.parse(real(REGISTRY));
  without.components = without.components.filter((component) => component.name !== "FilterChip");
  const copy = linkedCopy(ROOT, { [REGISTRY]: `${JSON.stringify(without, null, 2)}\n` });
  try {
    const result = check(copy.dir);
    assert.equal(result.code, 1, result.out);
    assert.ok(result.out.includes(`${REGISTRY} is not what src/components gives`), result.out);
  } finally {
    copy.remove();
  }
});

test("tool-tree: green as it is; red with one byte more in a file, and with one file more", () => {
  green("tool-tree.mjs", "--root", ROOT);
  const pinned = "differs from the plugin's at feea58d";
  const byte = linkedCopy(ROOT, { [`${TOOL_FOLDER}/check.mjs`]: `${real(`${TOOL_FOLDER}/check.mjs`)}\n` });
  try {
    red(`${pinned}: 27 files`, "tool-tree.mjs", "--root", byte.dir);
  } finally {
    byte.remove();
  }
  const extra = linkedCopy(ROOT, { [`${TOOL_FOLDER}/added.mjs`]: "// not the plugin's\n" });
  try {
    red(`${pinned}: 28 files`, "tool-tree.mjs", "--root", extra.dir);
  } finally {
    extra.remove();
  }
});

test("only-register-changed: green as it is; red with another ledger changed, or the screen check declared", () => {
  green("only-register-changed.mjs", "--root", ROOT);
  red(
    "design ledgers: changed by this branch: design/theme.json",
    "only-register-changed.mjs",
    "--root",
    ROOT,
    "--changed",
    broken("changed.txt", `${REGISTRY}\ndesign/theme.json\n`),
  );
  const theme = JSON.parse(real("design/theme.json"));
  theme.checks["screen-actions"] = [{ kind: "screen-actions", file: "design/screens.yaml", model: "ontology" }];
  red(
    "design ledgers: the check data declares screen-actions for screen-actions",
    "only-register-changed.mjs",
    "--root",
    ROOT,
    "--theme",
    broken("theme.json", JSON.stringify(theme)),
  );
});
