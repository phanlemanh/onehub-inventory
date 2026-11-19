// AC-9: the four ledgers stay one-file, `make split DRY=1` writes nothing for any of them, the
// renamed file is BASE's mk/derived.mk byte for byte, and `make -n test` still runs the table.
// Usage: node ledgers.mjs [--root <dir>]

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { git, root, run, verdict } from "./lib.mjs";
import { BASE, GEN_OUT, LEDGERS } from "./matrix.mjs";

const NAME = "ledgers";
const dir = root();
const problems = [];
const tracked = () => git(dir, "status", "--porcelain", "--untracked-files=all");

try {
  for (const l of LEDGERS) {
    const args = ["tools/ledgers.py", "shape", l, ...(l === "gen" ? ["--gen-out", GEN_OUT] : [])];
    const shape = run("python3", args, { cwd: dir }).out.trim();
    if (shape !== "one-file") problems.push(`ledger ${l} is ${shape || "unreadable"}, not one-file`);
  }
  for (const l of LEDGERS) {
    const before = tracked();
    const r = run("make", ["-s", "split", `L=${l}`, "DRY=1"], { cwd: dir });
    if (r.code !== 0) problems.push(`make split L=${l} DRY=1 exited ${r.code}: ${(r.err || r.out).trim().split("\n").pop()}`);
    if (tracked() !== before) problems.push(`make split L=${l} DRY=1 wrote to the tree`);
  }
  const renamed = readFileSync(join(dir, "mk/design-role-table.mk"), "utf8");
  if (renamed !== git(dir, "show", `${BASE}:mk/derived.mk`)) problems.push(`mk/design-role-table.mk is not mk/derived.mk of ${BASE.slice(0, 8)}`);
  const plan = run("make", ["-n", "test"], { cwd: dir }).out;
  if (!plan.includes("tools/coverage_matrix/buttons.py")) problems.push("make -n test no longer runs tools/coverage_matrix/buttons.py");
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `log, index, glossary and gen are one-file; make split DRY=1 exits 0 and writes nothing for each; mk/design-role-table.mk is mk/derived.mk of ${BASE.slice(0, 8)}; make -n test runs tools/coverage_matrix/buttons.py`,
);
