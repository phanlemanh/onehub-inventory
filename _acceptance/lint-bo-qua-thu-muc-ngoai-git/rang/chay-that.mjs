// AC-4: plant a .mjs that breaks both lint tools in three out-of-git places, run `npm run lint` from the root, and
// require exit 0 with none of the planted files named. The planted folders are removed afterwards, also when red.
// Usage: node chay-that.mjs
//        node chay-that.mjs --pha     (two-way only: ESLint over the whole tree with the two new patterns removed, in
//                                      memory; must name a planted file)
//        node chay-that.mjs --pha-pr  (two-way only: Prettier on the planted worktree file with .gitignore only, i.e.
//                                      without the .prettierignore lines; must name it)
// Before measuring, the planted text is shown to break both tools when nothing ignores it (exit 2 otherwise).
// Exit 0 when the promise holds, 1 when it does not, 2 when the measure cannot run.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import prettier from "prettier";

import { editConfig, eslintAt, NEW_IGNORES, REPO, repoConfig, ROOT_LINE } from "./lib.mjs";

console.log(ROOT_LINE("chay-that"));

const broken = process.argv.includes("--pha");
const brokenPrettier = process.argv.includes("--pha-pr");
const tag = `lnt-${process.pid}-${Date.now()}`;
const BAD = 'const a=1\nvar b = require("x")\nconsole.log(c)\n';

// Planted folders, and whether each parent existed before (so an empty parent we made is removed too).
const runsDir = join(REPO, ".acceptance-runs");
const worktreesDir = join(REPO, ".claude/worktrees");
const parents = [runsDir, worktreesDir].map((d) => [d, existsSync(d)]);
const plantedRoots = [join(runsDir, tag), join(worktreesDir, tag)];
const plantedFiles = [
  join(runsDir, tag, "x.mjs"),
  join(worktreesDir, tag, "x.mjs"),
  join(worktreesDir, tag, ".next", "chunk.js"),
];

function cleanUp() {
  for (const d of plantedRoots) rmSync(d, { recursive: true, force: true });
  for (const [d, existed] of parents) {
    if (!existed && existsSync(d) && readdirSync(d).length === 0) rmSync(d, { recursive: true, force: true });
  }
  return plantedRoots.every((d) => !existsSync(d));
}

// The planted text must break both tools on its own, or a green run would prove nothing.
const lintedAlone = await eslintAt().lintText(BAD, { filePath: join(REPO, "tools/planted-probe.mjs") });
if (!lintedAlone[0]?.errorCount) {
  console.log("chay-that: the planted text is not an ESLint error where nothing ignores it");
  process.exit(2);
}
const options = (await prettier.resolveConfig(join(REPO, "tools/planted-probe.mjs"))) ?? {};
if (await prettier.check(BAD, { ...options, filepath: join(REPO, "tools/planted-probe.mjs") })) {
  console.log("chay-that: the planted text is already formatted for Prettier");
  process.exit(2);
}

let code = 2;
let line = "";
try {
  for (const f of plantedFiles) {
    mkdirSync(join(f, ".."), { recursive: true });
    writeFileSync(f, BAD);
  }

  if (brokenPrettier) {
    const target = plantedFiles[1].slice(REPO.length + 1);
    const run = spawnSync("npx", ["prettier", "--check", "--ignore-path", ".gitignore", target], {
      cwd: REPO,
      encoding: "utf8",
    });
    const output = `${run.stdout ?? ""}${run.stderr ?? ""}`;
    if (run.status === 1 && output.includes(target)) {
      code = 1;
      line = `chay-that: prettier named a planted file: ${target}`;
    } else {
      code = 0;
      line = `chay-that: prettier without .prettierignore named no planted file (exit ${run.status})`;
    }
  } else if (broken) {
    const { config, removed } = editConfig(await repoConfig(), { drop: NEW_IGNORES });
    if (removed !== NEW_IGNORES.length) {
      line = `chay-that: cannot build the broken copy — ${removed} of ${NEW_IGNORES.length} ESLint patterns found`;
    } else {
      const results = await eslintAt(config).lintFiles(["."]);
      const named = results.filter((r) => r.filePath.includes(tag) && r.messages.length).map((r) => r.filePath);
      if (named.length) {
        code = 1;
        line = `chay-that: lint named a planted file: ${named.map((f) => f.slice(REPO.length + 1)).join(", ")}`;
      } else {
        code = 0;
        line = "chay-that: the broken copy named no planted file";
      }
    }
  } else {
    const run = spawnSync("npm", ["run", "lint"], { cwd: REPO, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    const output = `${run.stdout ?? ""}${run.stderr ?? ""}`;
    const named = output
      .split("\n")
      .filter((l) => l.includes(tag))
      .map((l) => l.trim());
    if (run.status === null) {
      line = `chay-that: npm run lint did not finish (${run.error?.message ?? run.signal})`;
    } else if (named.length) {
      code = 1;
      line = `chay-that: lint named a planted file: ${named.join(" | ")}`;
    } else if (run.status !== 0) {
      code = 1;
      line = `chay-that: npm run lint exit ${run.status} without naming a planted file:\n${output.slice(-2000)}`;
    } else {
      code = 0;
      line = "chay-that: npm run lint exit 0 with a broken .mjs planted in 3 out-of-git places; none named in the output";
    }
  }
} finally {
  const gone = cleanUp();
  if (!gone) {
    code = 2;
    line += "\nchay-that: planted folders NOT removed: " + plantedRoots.filter(existsSync).join(", ");
  } else {
    line += "; planted folders removed";
  }
}
console.log(line);
process.exit(code);
