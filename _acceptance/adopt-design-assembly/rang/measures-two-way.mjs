// Each new measure of this record, both ways: green on the repository as it is, red with its
// pinned message on a copy broken from the repository's own files. A measure that has never been
// seen red proves nothing.
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execPath } from "node:process";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";

import { linkedCopy } from "./linked-copy.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../../..");
const scratch = mkdtempSync(path.join(tmpdir(), "adopt-design-assembly-measures-"));
after(() => rmSync(scratch, { recursive: true, force: true }));

const real = (file) => readFileSync(path.join(ROOT, file), "utf8");
const broken = (name, text) => {
  const file = path.join(scratch, name);
  writeFileSync(file, text);
  return file;
};
const run = (script, ...args) => {
  const command = script.endsWith(".sh") ? "bash" : execPath;
  const result = spawnSync(command, [path.join(HERE, script), ...args], { encoding: "utf8" });
  return { code: result.status, out: `${result.stdout}${result.stderr}` };
};
const green = (script, ...args) => {
  const result = run(script, ...args);
  assert.equal(result.code, 0, result.out);
  return result;
};
const red = (expected, script, ...args) => {
  const result = run(script, ...args);
  assert.equal(result.code, 1, result.out);
  assert.ok(result.out.includes(expected), `expected "${expected}" in:\n${result.out}`);
};

test("lint-rerun: green as it is, red when a held decision is missing or a rule is not the row's", () => {
  green("lint-rerun.mjs", "--root", ROOT);
  const rate = execFileSync(execPath, [path.join(ROOT, "tools/design-assembly/check.mjs"), "--rate", "--target", ROOT], {
    encoding: "utf8",
  });
  const withoutRawTable = rate
    .split("\n")
    .filter((line) => !/^\s+held\s+\S+\s+raw-table\b/.test(line))
    .join("\n");
  red("held: 17, missing raw-table", "lint-rerun.mjs", "--root", ROOT, "--rate-file", broken("rate.txt", withoutRawTable));
  const theme = JSON.parse(real("design/theme.json"));
  theme.checks["raw-table"] = theme.checks["raw-table"].map((check) => ({ ...check, rule: "other/rule" }));
  red(
    "lint re-run: raw-table checks other/rule, the row names onehub-ui/no-raw-table",
    "lint-rerun.mjs",
    "--root",
    ROOT,
    "--theme",
    broken("theme.json", JSON.stringify(theme)),
  );
});

test("ledger-rows-kept: green as it is, red when a row of 1226ec5 changes or goes", () => {
  green("ledger-rows-kept.mjs", "--root", ROOT);
  const ledger = real("design/decisions.yaml");
  const radiusChanged = ledger.replace(/( {2}- id: radius\n(?: {4}.*\n)*? {4}source: ")/, "$1changed copy, ");
  assert.notEqual(radiusChanged, ledger);
  red("row changed: radius", "ledger-rows-kept.mjs", "--root", ROOT, "--new", broken("radius.yaml", radiusChanged));
  const withoutWcag = ledger.replace(/ {2}- id: wcag-aa\n(?: {4}.*\n)*/, "");
  assert.notEqual(withoutWcag, ledger);
  red("row missing: wcag-aa", "ledger-rows-kept.mjs", "--root", ROOT, "--new", broken("wcag.yaml", withoutWcag));
});

test("register-regenerated: green as it is, red with the old tool back or make gen on the old tool", () => {
  green("register-regenerated.sh", ROOT);
  const oldTool = linkedCopy(ROOT, { "tools/design_registry.mjs": "// the old register tool\n" });
  try {
    red("old tool still there", "register-regenerated.sh", oldTool.dir);
  } finally {
    oldTool.remove();
  }
  const mk = real("mk/design.mk").replace(
    "node tools/design-assembly/components.mjs --write",
    "node tools/design_registry.mjs",
  );
  const oldGen = linkedCopy(ROOT, { "mk/design.mk": mk });
  try {
    red("make gen does not write the register with the design-assembly tool", "register-regenerated.sh", oldGen.dir);
  } finally {
    oldGen.remove();
  }
});

test("owner-answers: green as it is, red when the level recorded is not the owner's", () => {
  green("owner-answers.mjs", "--root", ROOT);
  const theme = JSON.parse(real("design/theme.json"));
  theme.inputs.conformanceLevel = "AAA";
  red("answers: conformanceLevel AAA", "owner-answers.mjs", "--root", ROOT, "--theme", broken("aaa.json", JSON.stringify(theme)));
});

test("tokens-primary: green as it is, red when the primary colour is another", () => {
  green("tokens-primary.mjs", "--root", ROOT);
  const tokens = JSON.parse(real("design/tokens.json"));
  // The first `primary` entry of the tree, the one the measure reads.
  const repaint = (node) => {
    if (!node || typeof node !== "object") return false;
    if (node.primary && typeof node.primary === "object" && "$value" in node.primary) {
      node.primary.$value = "#000000";
      return true;
    }
    return Object.values(node).some(repaint);
  };
  assert.ok(repaint(tokens));
  red("primary #000000", "tokens-primary.mjs", "--root", ROOT, "--tokens", broken("tokens.json", JSON.stringify(tokens)));
});
