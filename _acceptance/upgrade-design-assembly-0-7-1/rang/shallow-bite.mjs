// AC-4: on fresh depth-1 clones of HEAD, the two new rows stop what they exist to stop. The
// untouched copy is green; a new page under design/patterns stops owner-calls; a test tagged with a
// decision the ledger has no row for stops decision-sheet; the fixtures of BASE stop decision-sheet,
// naming each tag they held. Each change is committed in its clone, so it is what the branch adds.
// Usage: node shallow-bite.mjs [--root <repository>] [--rev <commit>] [--main-at <commit>]
//   [--omit-checks]   (a break: the two checks taken out of design/theme.json in every clone)
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { git, option, ROOT, shallowClone } from "./lib.mjs";
import { BASE, BASE_FIXTURE_TAGS, FIXTURE_FILE, NEW_PAGE, ROWS, UNTOLD_TAG } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const rev = option("--rev", "HEAD");
const mainAt = option("--main-at", BASE);
const omitChecks = process.argv.includes("--omit-checks");
const THEME = "design/theme.json";

const write = (kho, file, text) => {
  mkdirSync(path.dirname(path.join(kho, file)), { recursive: true });
  writeFileSync(path.join(kho, file), text);
};

// One fresh clone, `change` applied and committed, the gate run alone; its output and exit code.
function gateOn(change) {
  const clone = shallowClone(root, rev, { mainAt });
  try {
    if (omitChecks) {
      const theme = JSON.parse(readFileSync(path.join(clone.kho, THEME), "utf8"));
      const checks = Object.fromEntries(Object.entries(theme.checks).filter(([key]) => !ROWS.includes(key)));
      write(clone.kho, THEME, `${JSON.stringify({ ...theme, checks }, null, 2)}\n`);
    }
    change(clone.kho);
    git(clone.kho, "add", "-A");
    const status = git(clone.kho, "status", "--porcelain").trim();
    if (status) git(clone.kho, "-c", "user.name=rang", "-c", "user.email=rang@example.invalid", "commit", "-q", "-m", "bite");
    const run = spawnSync("make", ["design-assembly"], { cwd: clone.kho, encoding: "utf8", maxBuffer: 1 << 28 });
    return { code: run.status, out: `${run.stdout}${run.stderr}` };
  } finally {
    clone.remove();
  }
}

const found = [];
let sha = rev;
try {
  sha = git(root, "rev-parse", rev).trim();
  const untouched = gateOn(() => {});
  if (untouched.code !== 0) {
    const tail = untouched.out.trim().split("\n").slice(-4).join(" | ");
    found.push(`the untouched copy is red: make design-assembly exit ${untouched.code}: ${tail}`);
  }
  const page = gateOn((kho) => write(kho, NEW_PAGE.file, "# Trang mới\n"));
  if (!page.out.includes(NEW_PAGE.line)) found.push("a new page under design/patterns did not stop owner-calls");
  const tag = gateOn((kho) => write(kho, UNTOLD_TAG.file, UNTOLD_TAG.text));
  if (!tag.out.includes(UNTOLD_TAG.line)) found.push("an untold tag did not stop decision-sheet");
  const fixtures = gateOn((kho) => write(kho, FIXTURE_FILE, git(root, "show", `${BASE}:${FIXTURE_FILE}`)));
  const sheetLines = fixtures.out.split("\n").filter((line) => line.includes("decision-sheet") || line.includes(FIXTURE_FILE));
  const unnamed = BASE_FIXTURE_TAGS.filter((tag) => !sheetLines.some((line) => line.includes(`${tag}:`)));
  if (fixtures.code === 0 || unnamed.length) {
    found.push(`the fixtures of ${BASE.slice(0, 8)} did not stop decision-sheet by name: ${unnamed.join(" ") || "exit 0"}`);
  }
} catch (error) {
  found.push(error.message.split("\n")[0]);
}
for (const line of found) process.stdout.write(`bite: ${line}\n`);
if (!found.length) {
  process.stdout.write(
    `bite: on fresh depth-1 clones of ${sha.slice(0, 8)}, the untouched copy is green; a new page stops owner-calls, an untold tag stops decision-sheet, and the fixtures of ${BASE.slice(0, 8)} stop decision-sheet by name\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
