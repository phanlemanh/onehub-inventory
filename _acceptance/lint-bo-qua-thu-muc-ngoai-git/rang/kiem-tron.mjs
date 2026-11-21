// AC-7: plant, in both out-of-git folders, one file that each step of `make check` would fail on if it read it — a
// failing test, a type error, a broken wiki page, a screen that breaks the UI rules and a badly formatted .mjs — then
// run `make check` from the root and require exit 0 with none of the planted files named. The planted folders are
// removed afterwards, also when red.
// Usage: node kiem-tron.mjs
//        node kiem-tron.mjs --liet-ke [--pha]   (two-way: ask the test runner which test files it collects, with the
//                                                repository config or, with --pha, a copy without the two new
//                                                excludes written inside the planted folder)
// Exit 0 when the promise holds, 1 when it does not, 2 when the measure cannot run.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { REPO } from "./lib.mjs";

const args = process.argv.slice(2);
const list = args.includes("--liet-ke");
const broken = args.includes("--pha");
const tag = `lnt-${process.pid}-${Date.now()}`;

// The planted tree, the same in both folders.
export const PLANT = {
  "tests/planted.test.ts": 'import { expect, test } from "vitest";\n\ntest("planted", () => {\n  expect(1).toBe(2);\n});\n',
  "src/planted.ts": 'export const planted: number = "not a number";\n',
  "src/app/planted/page.tsx": 'export default function Page() {\n  return <div style={{ color: "red" }}>x</div>;\n}\n',
  "wiki/entities/planted.md": "---\nbroken front matter\n",
  "tools/planted.mjs": 'const a=1\nvar b = require("x")\nconsole.log(c)\n',
};

const parentsOf = [join(REPO, ".acceptance-runs"), join(REPO, ".claude/worktrees")];
const parents = parentsOf.map((d) => [d, existsSync(d)]);
const roots = parentsOf.map((d) => join(d, tag));

function cleanUp() {
  for (const d of roots) rmSync(d, { recursive: true, force: true });
  for (const [d, existed] of parents) {
    if (!existed && existsSync(d) && readdirSync(d).length === 0) rmSync(d, { recursive: true, force: true });
  }
  return roots.every((d) => !existsSync(d));
}

let code = 2;
let line = "";
try {
  for (const root of roots) {
    for (const [rel, text] of Object.entries(PLANT)) {
      mkdirSync(dirname(join(root, rel)), { recursive: true });
      writeFileSync(join(root, rel), text);
    }
  }
  if (list) {
    const cliArgs = ["vitest", "list", "--filesOnly", "--root", REPO];
    if (broken) {
      const cfg = join(roots[0], "vitest.broken.config.ts");
      writeFileSync(
        cfg,
        `import base from ${JSON.stringify(join(REPO, "vitest.config.ts"))};\n` +
          `const drop = [".acceptance-runs/**", ".claude/worktrees/**"];\n` +
          `const before = base.test.exclude.length;\n` +
          `base.test.exclude = base.test.exclude.filter((p) => !drop.includes(p));\n` +
          `if (before - base.test.exclude.length !== drop.length) throw new Error("kiem-tron: cannot build the broken copy");\n` +
          `base.root = ${JSON.stringify(REPO)};\n` +
          `export default base;\n`,
      );
      cliArgs.push("--config", cfg);
    }
    const run = spawnSync("npx", cliArgs, { cwd: REPO, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    const output = `${run.stdout ?? ""}${run.stderr ?? ""}`;
    const named = output.split("\n").filter((l) => l.includes(tag) && l.includes("planted.test.ts"));
    if (run.status !== 0 && !named.length) {
      line = `kiem-tron: vitest list exit ${run.status}:\n${output.slice(-2000)}`;
    } else if (named.length) {
      code = 1;
      line = `kiem-tron: test runner collects a planted file: ${named.map((l) => l.trim()).join(" | ")}`;
    } else {
      code = 0;
      line = "kiem-tron: test runner collects no planted file";
    }
  } else {
    const run = spawnSync("make", ["--no-print-directory", "check"], {
      cwd: REPO,
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
      env: { ...process.env, CI: "" },
    });
    const output = `${run.stdout ?? ""}${run.stderr ?? ""}`;
    const named = output
      .split("\n")
      .filter((l) => l.includes(tag))
      .map((l) => l.trim());
    if (run.status === null) {
      line = `kiem-tron: make check did not finish (${run.error?.message ?? run.signal})`;
    } else if (named.length) {
      code = 1;
      line = `kiem-tron: make check named a planted file: ${[...new Set(named)].slice(0, 6).join(" | ")}`;
    } else if (run.status !== 0) {
      code = 1;
      line = `kiem-tron: make check exit ${run.status} without naming a planted file:\n${output.slice(-3000)}`;
    } else {
      code = 0;
      line = `kiem-tron: make check exit 0 with ${Object.keys(PLANT).length} planted files in each of 2 out-of-git folders; none named in the output`;
    }
  }
} finally {
  if (cleanUp()) line += "; planted folders removed";
  else {
    code = 2;
    line += `\nkiem-tron: planted folders NOT removed: ${roots.filter(existsSync).join(", ")}`;
  }
}
console.log(`kiem-tron: root ${REPO}`);
console.log(line);
process.exit(code);
