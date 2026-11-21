// AC-7: plant, in both out-of-git folders, a failing test, a type error and a .mjs that breaks the lint rules, then
// run `make check` from the root and require exit 0 with none of the planted files named, and require that the type
// checker's file list (tsconfig.json and tsconfig.strict.json) names none of them. The planted folders are removed
// afterwards, also when red.
//
// Before measuring, each planted file is shown to break its own tool when that tool is pointed at it: the test fails
// when run, the .ts is a type error, the .mjs is an ESLint error and not formatted for Prettier. Exit 2 otherwise —
// a plant that breaks nothing would make a green run prove nothing.
//
// The type checker reads only the folders named in tsconfig.json `include`, and TypeScript wildcards skip folders whose
// name starts with a dot, so it cannot reach the two folders today; the file-list check keeps that true if `include`
// changes. Steps of `make check` not covered by a plant read fixed folders inside the tree: wiki_lint and the ledgers
// read `wiki/`, boundaries reads `src/modules/` and `src/app/`. They cannot reach the two folders and are not measured.
//
// Usage: node kiem-tron.mjs                     make check + type checker file list
//        node kiem-tron.mjs --liet-ke [--pha]   two-way: the test files Vitest collects, with the repository config or,
//                                               with --pha, a copy without the two new excludes
//        node kiem-tron.mjs --tsc [--pha]       two-way: the type checker's file list, with the repository config or,
//                                               with --pha, a copy whose include names the two folders (the list
//                                               must then show the plants: the listing can see them at all)
//        node kiem-tron.mjs --cay-lanh          two-way: plants that break nothing; the precheck must stop (exit 2)
// Every run prints its root and the tag of its planted folders.
// Exit 0 when the promise holds, 1 when it does not, 2 when the measure cannot run.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import prettier from "prettier";

import { eslintAt, guardPlants, REPO, ROOT_LINE, runAsync } from "./lib.mjs";

const args = process.argv.slice(2);
const mode = args.includes("--liet-ke") ? "list" : args.includes("--tsc") ? "tsc" : "check";
const broken = args.includes("--pha");
const sound = args.includes("--cay-lanh");
const tag = `lnt-${process.pid}-${Date.now()}`;

console.log(ROOT_LINE("kiem-tron"));
console.log(`kiem-tron: plants ${tag}`);

const BROKEN_PLANT = {
  "tests/planted.test.ts": 'import { expect, test } from "vitest";\n\ntest("planted", () => {\n  expect(1).toBe(2);\n});\n',
  "src/planted.ts": 'export const planted: number = "not a number";\n',
  "tools/planted.mjs": 'const a=1\nvar b = require("x")\nconsole.log(c)\n',
};
const SOUND_PLANT = {
  "tests/planted.test.ts": 'import { expect, test } from "vitest";\n\ntest("planted", () => {\n  expect(1).toBe(1);\n});\n',
  "src/planted.ts": "export const planted: number = 1;\n",
  "tools/planted.mjs": "export const planted = 1;\n",
};
export const PLANT = sound ? SOUND_PLANT : BROKEN_PLANT;

const parentsOf = [join(REPO, ".acceptance-runs"), join(REPO, ".claude/worktrees")];
const parents = parentsOf.map((d) => [d, existsSync(d)]);
const roots = parentsOf.map((d) => join(d, tag));
guardPlants(roots);

function cleanUp() {
  for (const d of roots) rmSync(d, { recursive: true, force: true });
  for (const [d, existed] of parents) {
    if (!existed && existsSync(d) && readdirSync(d).length === 0) rmSync(d, { recursive: true, force: true });
  }
  return roots.every((d) => !existsSync(d));
}

const npx = (cliArgs, opts = {}) => {
  const r = spawnSync("npx", cliArgs, { cwd: REPO, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, ...opts });
  return { status: r.status, output: `${r.stdout ?? ""}${r.stderr ?? ""}` };
};

// Each plant must break its own tool when pointed at directly. Runs on copies in the system temp folder, so the
// tools' own ignore lists play no part.
async function precheck() {
  const why = [];
  const dir = join(tmpdir(), `${tag}-precheck`);
  mkdirSync(join(dir, "tests"), { recursive: true });
  try {
    const ts = join(dir, "planted.ts");
    writeFileSync(ts, PLANT["src/planted.ts"]);
    const tsc = npx(["tsc", "--noEmit", "--strict", "--ignoreConfig", ts]);
    if (tsc.status === 0) why.push("src/planted.ts is not a type error");

    const test = join(dir, "tests", "planted.test.ts");
    writeFileSync(test, PLANT["tests/planted.test.ts"]);
    const cfg = join(dir, "vitest.config.mjs");
    writeFileSync(cfg, "export default {};\n");
    const vt = npx(["vitest", "run", "--root", dir, "--config", cfg, "--coverage.enabled=false"]);
    if (!/Tests\s+1 failed/.test(vt.output)) why.push("tests/planted.test.ts does not fail");

    const mjs = PLANT["tools/planted.mjs"];
    const probePath = join(REPO, "tools/planted-probe.mjs");
    const linted = await eslintAt().lintText(mjs, { filePath: probePath });
    if (!linted[0]?.errorCount) why.push("tools/planted.mjs is not an ESLint error");
    const options = (await prettier.resolveConfig(probePath)) ?? {};
    if (await prettier.check(mjs, { ...options, filepath: probePath })) why.push("tools/planted.mjs is formatted for Prettier");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  return why;
}

// The files the type checker would read for one project file, as paths relative to the root.
function tscFiles(project) {
  const r = npx(["tsc", "-p", project, "--listFilesOnly"]);
  return { status: r.status, files: r.output.split("\n").filter((l) => l.startsWith(REPO)) };
}

let code = 2;
let line = "";
try {
  const why = await precheck();
  if (why.length) {
    line = `kiem-tron: a planted file breaks nothing: ${why.join("; ")}`;
  } else {
    for (const root of roots) {
      for (const [rel, text] of Object.entries(PLANT)) {
        mkdirSync(dirname(join(root, rel)), { recursive: true });
        writeFileSync(join(root, rel), text);
      }
    }

    if (mode === "list") {
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
      const run = npx(cliArgs);
      const named = run.output.split("\n").filter((l) => l.includes(tag) && l.includes("planted.test.ts"));
      if (run.status !== 0 && !named.length) {
        line = `kiem-tron: vitest list exit ${run.status}:\n${run.output.slice(-2000)}`;
      } else if (named.length) {
        code = 1;
        line = `kiem-tron: test runner collects a planted file: ${named.map((l) => l.trim()).join(" | ")}`;
      } else {
        code = 0;
        line = "kiem-tron: test runner collects no planted file";
      }
    } else if (mode === "tsc") {
      let project = "tsconfig.json";
      if (broken) {
        project = join(roots[0], "tsconfig.broken.json");
        writeFileSync(
          project,
          JSON.stringify({
            extends: join(REPO, "tsconfig.json"),
            include: [join(REPO, ".acceptance-runs"), join(REPO, ".claude/worktrees")],
          }),
        );
      }
      const { status, files } = tscFiles(project);
      const named = files.filter((f) => f.includes(tag));
      if (status !== 0 && !named.length) {
        line = `kiem-tron: tsc --listFilesOnly exit ${status}`;
      } else if (named.length) {
        code = 1;
        line = `kiem-tron: type checker reads a planted file: ${named.map((f) => f.slice(REPO.length + 1)).join(" | ")}`;
      } else {
        code = 0;
        line = "kiem-tron: type checker reads no planted file";
      }
    } else {
      const lists = ["tsconfig.json", "tsconfig.strict.json"].map((p) => [p, tscFiles(p)]);
      const listed = lists.flatMap(([p, { files }]) => files.filter((f) => f.includes(tag)).map((f) => `${p}: ${f}`));
      const listFailed = lists.filter(([, { status }]) => status !== 0).map(([p]) => p);
      const run = await runAsync("make", ["--no-print-directory", "check"], { env: { ...process.env, CI: "" } });
      const output = run.output;
      const named = output
        .split("\n")
        .filter((l) => l.includes(tag))
        .map((l) => l.trim());
      if (run.status === null) {
        line = `kiem-tron: make check did not finish (${run.signal ?? run.output.slice(-500)})`;
      } else if (listFailed.length) {
        line = `kiem-tron: tsc --listFilesOnly failed for ${listFailed.join(", ")}`;
      } else if (named.length || listed.length) {
        code = 1;
        line = `kiem-tron: a planted file was read: ${[...new Set([...named, ...listed])].slice(0, 6).join(" | ")}`;
      } else if (run.status !== 0) {
        code = 1;
        line = `kiem-tron: make check exit ${run.status} without naming a planted file:\n${output.slice(-3000)}`;
      } else {
        code = 0;
        line =
          `kiem-tron: make check exit 0 with ${Object.keys(PLANT).length} planted files in each of 2 out-of-git folders; ` +
          "none named in the output; the type checker lists none (tsconfig.json, tsconfig.strict.json)";
      }
    }
  }
} finally {
  if (cleanUp()) line += "; planted folders removed";
  else {
    code = 2;
    line += `\nkiem-tron: planted folders NOT removed: ${roots.filter(existsSync).join(", ")}`;
  }
}
console.log(line);
process.exit(code);
