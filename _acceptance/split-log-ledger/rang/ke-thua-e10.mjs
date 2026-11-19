// AC-3, which stands for upgrade-repo-setup-0-9-0/E10 (AC-9 of that record): the log is fragments; each of the
// other three ledgers has one shape, and `make split L=<ledger> DRY=1` exits 0 and writes nothing for all four;
// mk/design-role-table.mk is still mk/derived.mk of that record's BASE; `make -n test` still runs the table.
// What E10 said and this does not: index, glossary and gen are one-file. PR 2 of the plan splits them.
// Usage: node ke-thua-e10.mjs [--root <dir>]

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { git, root, run, verdict } from "./lib.mjs";
import { RS090_BASE } from "./matrix.mjs";

const NAME = "ke-thua-e10";
const LEDGERS = ["log", "index", "glossary", "gen"];
const GEN_OUT = "src/generated/ontology.ts";
const dir = root();
const problems = [];
const shapes = {};
// What `make split DRY=1` could write: anything git sees, and the four drawn or kept ledger files, which
// .gitignore may hide from git status — so those are compared by content.
const LEDGER_FILES = ["wiki/log.md", "wiki/index.md", "ontology/glossary.md", GEN_OUT];
const read = (f) => (existsSync(join(dir, f)) ? createHash("sha256").update(readFileSync(join(dir, f))).digest("hex") : "absent");
const status = () => [git(dir, "status", "--porcelain", "--untracked-files=all"), ...LEDGER_FILES.map(read)].join("\n");

try {
  for (const l of LEDGERS) {
    const args = ["tools/ledgers.py", "shape", l, ...(l === "gen" ? ["--gen-out", GEN_OUT] : [])];
    shapes[l] = run("python3", args, { cwd: dir }).out.trim();
    if (!["one-file", "fragments"].includes(shapes[l])) problems.push(`ledger ${l} is ${shapes[l] || "unreadable"}`);
  }
  if (shapes.log !== "fragments") problems.push(`ledger log is ${shapes.log || "unreadable"}, not fragments`);
  for (const l of LEDGERS) {
    const before = status();
    const r = run("make", ["-s", "split", `L=${l}`, "DRY=1"], { cwd: dir });
    if (r.code !== 0) problems.push(`make split L=${l} DRY=1 exited ${r.code}: ${(r.err || r.out).trim().split("\n").pop()}`);
    if (status() !== before) problems.push(`make split L=${l} DRY=1 wrote to the tree`);
  }
  const renamed = readFileSync(join(dir, "mk/design-role-table.mk"), "utf8");
  if (renamed !== git(dir, "show", `${RS090_BASE}:mk/derived.mk`)) problems.push(`mk/design-role-table.mk is not mk/derived.mk of ${RS090_BASE}`);
  if (!run("make", ["-n", "test"], { cwd: dir }).out.includes("tools/coverage_matrix/buttons.py")) problems.push("make -n test no longer runs tools/coverage_matrix/buttons.py");
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `log fragments, index ${shapes.index}, glossary ${shapes.glossary}, gen ${shapes.gen}; make split DRY=1 exits 0 and writes nothing for each; mk/design-role-table.mk is mk/derived.mk of ${RS090_BASE}; make -n test runs tools/coverage_matrix/buttons.py`,
);
