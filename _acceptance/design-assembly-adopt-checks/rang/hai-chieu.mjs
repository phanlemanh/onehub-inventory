// Each measure of this record, both ways: green on the repository as it is, red with its pinned
// message on a copy broken from the repository's own files. A measure never seen red proves
// nothing. Run: node --test _acceptance/design-assembly-adopt-checks/rang/hai-chieu.mjs
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execPath } from "node:process";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";

import { BASE } from "./matrix.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../../..");
const scratch = mkdtempSync(path.join(tmpdir(), "design-assembly-adopt-checks-"));
after(() => rmSync(scratch, { recursive: true, force: true }));

const real = (file) => readFileSync(path.join(ROOT, file), "utf8");
const run = (...args) => {
  const result = spawnSync(execPath, [path.join(HERE, "kiem.mjs"), ...args], { encoding: "utf8" });
  return { code: result.status, out: `${result.stdout}${result.stderr}` };
};
const green = (...args) => {
  const result = run(...args);
  assert.equal(result.code, 0, result.out);
  return result.out;
};
const red = (expected, ...args) => {
  const result = run(...args);
  assert.equal(result.code, 1, result.out);
  assert.ok(result.out.includes(expected), `expected "${expected}" in:\n${result.out}`);
};

// A copy holding only what the pointers measure reads, from the repository's own files.
let copies = 0;
function copyRoot(edit = {}) {
  const dir = path.join(scratch, `root-${(copies += 1)}`);
  for (const file of [
    "tools/design-assembly",
    "design/decisions.yaml",
    "design/theme.json",
    "tests/format.test.ts",
    "tests/grid.test.tsx",
    "tests/e2e/frame.spec.ts",
    "tests/e2e/grid.spec.ts",
  ]) {
    mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    cpSync(path.join(ROOT, file), path.join(dir, file), { recursive: true });
  }
  for (const [file, change] of Object.entries(edit)) {
    const full = path.join(dir, file);
    writeFileSync(full, change(readFileSync(full, "utf8")));
  }
  return dir;
}
const file = (name, text) => {
  const full = path.join(scratch, name);
  writeFileSync(full, text);
  return full;
};

test("pointers: green on the repository", () => {
  assert.match(green("pointers"), /pointers: 10 rows point at their check/);
});

test("pointers: red when a row loses its check", () => {
  const root = copyRoot({
    "design/decisions.yaml": (t) => t.replace('    check: "test:tests/grid.test.tsx"\n  - id: table-density', "  - id: table-density"),
  });
  red("pointers: column-width names no check, not test:tests/grid.test.tsx", "pointers", "--root", root);
});

test("pointers: red when the pointed test does not carry the decision", () => {
  const root = copyRoot({ "tests/format.test.ts": (t) => t.replace("// decision:format-number-date\n", "") });
  red("pointers: format-number-date → tests/format.test.ts carries no decision:format-number-date", "pointers", "--root", root);
});

test("pointers: red when the design tool declares no check for a held row", () => {
  const root = copyRoot({
    "design/theme.json": (t) => {
      const theme = JSON.parse(t);
      delete theme.checks.typeface;
      return JSON.stringify(theme, null, 2);
    },
  });
  red("pointers: typeface has no check entry in design/theme.json", "pointers", "--root", root);
});

test("pointers: red when a new row is missing", () => {
  const root = copyRoot({ "design/decisions.yaml": (t) => t.slice(0, t.indexOf("  - id: typeface")) });
  red("pointers: typeface has no row", "pointers", "--root", root);
});

test("shape: green on the repository", () => {
  assert.match(green("shape"), /shape: 8 rows gained a check, 2 rows added, no other row changed; files changed: 5/);
});

test("shape: red when another row changes", () => {
  const head = file("head-source.yaml", real("design/decisions.yaml").replace('source: "Intl vi-VN"', 'source: "Intl en-US"'));
  red("shape: row format-number-date changed beyond its check", "shape", "--head-file", head);
});

test("shape: red when a row is removed", () => {
  const text = real("design/decisions.yaml");
  const start = text.indexOf("  - id: column-width");
  const end = text.indexOf("  - id: table-density");
  red("shape: row column-width removed", "shape", "--head-file", file("head-removed.yaml", text.slice(0, start) + text.slice(end)));
});

test("shape: red when a row outside the matrix is added", () => {
  const head = file("head-extra.yaml", `${real("design/decisions.yaml")}  - id: probe-row\n    layer: foundations\n    kind: closed\n    source: "probe"\n`);
  red("shape: row probe-row added, not in the matrix", "shape", "--head-file", head);
});

test("shape: red when a row gains a check it was not given", () => {
  const base = execFileSync("git", ["show", `${BASE}:design/decisions.yaml`], { cwd: ROOT, encoding: "utf8" });
  const head = file("head-check.yaml", real("design/decisions.yaml").replace('source: "Chủ kho, sáng và tối"\n    check: "e2e:tests/e2e/frame.spec.ts"', 'source: "Chủ kho, sáng và tối"\n    check: "e2e:tests/e2e/grid.spec.ts"'));
  assert.ok(base.length > 0);
  red("shape: row theme-modes changed beyond its check", "shape", "--head-file", head);
});

test("shape: red when a file outside the matrix changed", () => {
  red(
    "shape: file changed outside the matrix: src/app/globals.css",
    "shape",
    "--files",
    "design/decisions.yaml,design/theme.json,src/app/globals.css",
  );
});

test("shape: red when another file under docs/ changed", () => {
  red(
    "shape: file changed outside the matrix: docs/superpowers/specs/2026-11-23-other-design.md",
    "shape",
    "--files",
    "design/decisions.yaml,docs/superpowers/specs/2026-11-23-design-assembly-adopt-checks-design.md,docs/superpowers/specs/2026-11-23-other-design.md",
  );
});

test("rules: green on the repository", () => {
  assert.match(green("rules"), /rules: Controls says 24px as design\/theme.json holds; Type says headings in var\(--font-sans\) as design\/theme.json holds; one known wrong line/);
});

test("rules: red when Controls states another size", () => {
  const page = file("rules-size.md", real(".claude/rules/design-assembly.md").replace("at least 24px high", "at least 20px high"));
  red("rules: Controls says 20px, design/theme.json holds 24px", "rules", "--page", page);
});

test("rules: red when Type names another heading typeface", () => {
  const page = file("rules-type.md", real(".claude/rules/design-assembly.md").replace("headings in `var(--font-sans)`", "headings in `Georgia`"));
  red("rules: Type says headings in Georgia, design/theme.json holds var(--font-sans)", "rules", "--page", page);
});

test("rules: red when a second line goes wrong", () => {
  const page = file("rules-two.md", real(".claude/rules/design-assembly.md").replace("A control is at least 24px high.", "A control is at least 24px high. Spacing is undefined."));
  red("rules: 2 lines say undefined, the known defect is one", "rules", "--page", page);
});

test("rules: red when a section is missing", () => {
  const page = file("rules-section.md", real(".claude/rules/design-assembly.md").replace("## Controls", "## Knobs"));
  red("rules: section Controls missing", "rules", "--page", page);
});
