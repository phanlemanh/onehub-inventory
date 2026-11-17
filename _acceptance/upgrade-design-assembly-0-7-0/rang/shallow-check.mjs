// AC-2: on a depth-1 clone of HEAD with an `origin`, the way the CI checkout and db/scripts/ci-thu.sh
// make one, `make check` is green: it draws every derived file itself, and the copy still tracks none
// of them. node_modules is an APFS clone of the repository's own (cp -c), nothing is installed.
// Usage: node shallow-check.mjs [--root <repository>] [--rev <commit>] [--drop <tracked path to delete in the clone>]
//   (--drop is a break: the clone loses a file before make check)
import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";

import { git, lines, option, ROOT, scratch } from "./lib.mjs";
import { DERIVED } from "./matrix.mjs";

const MUST_SAY = [
  "derived files: wrote design/component-registry.json from the source",
  "derived files: wrote design/screens.yaml from design/screens",
  "derived files: wrote design/intake.yaml from design/intake",
  "design-assembly: 17 decisions held by 25 checks, each seen failing on a changed copy",
  "component manifest: design/component-registry.json is up to date (294 components)",
];

const root = path.resolve(option("--root", ROOT));
const rev = git(root, "rev-parse", option("--rev", "HEAD")).trim();
const dir = scratch("shallow");
const kho = path.join(dir, "kho");
const found = [];
try {
  git(dir, "init", "-q", kho);
  git(kho, "fetch", "-q", "--depth", "1", `file://${root}`, rev);
  git(kho, "checkout", "-q", "FETCH_HEAD");
  git(kho, "remote", "add", "origin", `file://${root}`);
  if (git(kho, "rev-parse", "--is-shallow-repository").trim() !== "true") found.push("the clone is not shallow");
  const cp = spawnSync("cp", ["-c", "-R", path.join(root, "node_modules"), path.join(kho, "node_modules")]);
  if (cp.status !== 0) throw new Error(`cp -c node_modules: ${cp.stderr}`);
  if (option("--drop")) rmSync(path.join(kho, option("--drop")), { force: true });
  const undrawnBefore = DERIVED.filter((file) => !existsSync(path.join(kho, file)));
  const run = spawnSync("make", ["check"], { cwd: kho, encoding: "utf8", maxBuffer: 1 << 28 });
  const out = `${run.stdout}${run.stderr}`;
  if (run.status !== 0) {
    const tail = out.trim().split("\n").slice(-6).join(" | ");
    found.push(`make check exit ${run.status} on the shallow clone of ${rev.slice(0, 8)}: ${tail}`);
  }
  for (const line of MUST_SAY) if (!out.includes(line)) found.push(`make check did not say: ${line}`);
  const tests = out.match(/Tests\s+(\d+) passed/);
  if (!tests) found.push("make check printed no test count");
  const notDrawn = DERIVED.filter((file) => !existsSync(path.join(kho, file)));
  if (notDrawn.length) found.push(`not drawn by make check: ${notDrawn.join(" ")}`);
  const tracked = new Set(lines(git(kho, "ls-files")));
  const inGit = DERIVED.filter((file) => tracked.has(file));
  if (inGit.length) found.push(`tracked in the clone: ${inGit.join(" ")}`);
  if (!found.length) {
    process.stdout.write(
      `shallow: make check green on a depth-1 clone of ${rev.slice(0, 8)} with origin; ${tests[1]} tests passed; it drew ${undrawnBefore.length} derived files absent before, none tracked\n`,
    );
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
for (const line of found) process.stdout.write(`shallow: ${line}\n`);
process.exitCode = found.length ? 1 : 0;
