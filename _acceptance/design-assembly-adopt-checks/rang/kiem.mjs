// Two measures of this record.
//
//   node kiem.mjs pointers [--root DIR]
//     AC-2: each of the ten rows names the check the matrix says, and the check is really there: a
//     test file that carries `decision:<id>`, or an entry of design/theme.json for the design tool.
//
//   node kiem.mjs rules [--root DIR] [--page F]
//     AC-5: the regenerated rules page has its sections, states the control size and the heading
//     typeface the design tool holds in design/theme.json, and has exactly the one known wrong line.
//
//   node kiem.mjs shape [--root DIR] [--base-file F] [--head-file F] [--files a,b,...]
//     AC-4: against the merge-base with origin/main (the pinned BASE where it cannot be read), the ledger gained exactly eight check lines
//     and two rows and nothing else, and no file outside the matrix changed. The three overrides
//     let the two-way test feed a broken ledger or file list.
//
// Exit 0 with one line on success; exit 1 with one line per fault.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ADDED, BASE, FILES, GAINED, GATE_VIEWS, KNOWN_DEFECT, LOG_FOLDER, RULES_PAGE, RULES_SECTIONS, TOOL } from "./matrix.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const [mode, ...rest] = process.argv.slice(2);
const flag = (name) => {
  const at = rest.indexOf(name);
  return at === -1 ? undefined : rest[at + 1];
};
const root = path.resolve(flag("--root") ?? path.resolve(HERE, "../../.."));
const { parseLedger } = await import(path.join(root, "tools/design-assembly/ledger.mjs"));

const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" });
const rowsOf = (text) => new Map(parseLedger(text).map((row) => [row.id, row]));
const faults = [];
const finish = (ok) => {
  if (faults.length) {
    for (const fault of faults) console.log(fault);
    process.exit(1);
  }
  console.log(ok);
};

if (mode === "pointers") {
  const rows = rowsOf(readFileSync(path.join(root, "design/decisions.yaml"), "utf8"));
  const theme = JSON.parse(readFileSync(path.join(root, "design/theme.json"), "utf8"));
  const declared = theme.checks ?? {};
  const expected = { ...GAINED, ...ADDED };
  for (const [id, check] of Object.entries(expected)) {
    const row = rows.get(id);
    if (!row) {
      faults.push(`pointers: ${id} has no row`);
      continue;
    }
    if (row.check !== check) {
      faults.push(`pointers: ${id} names ${row.check ?? "no check"}, not ${check}`);
      continue;
    }
    if (check === TOOL) {
      if (!Array.isArray(declared[id]) || declared[id].length === 0)
        faults.push(`pointers: ${id} has no check entry in design/theme.json`);
      continue;
    }
    const file = check.slice(check.indexOf(":") + 1);
    const full = path.join(root, file);
    if (!existsSync(full) || !readFileSync(full, "utf8").includes(`decision:${id}`))
      faults.push(`pointers: ${id} → ${file} carries no decision:${id}`);
  }
  finish(`pointers: ${Object.keys(expected).length} rows point at their check`);
} else if (mode === "shape") {
  let base;
  try {
    base = git("merge-base", "origin/main", "HEAD").trim() || BASE;
  } catch {
    base = BASE;
  }
  const baseText = flag("--base-file")
    ? readFileSync(flag("--base-file"), "utf8")
    : git("show", `${base}:design/decisions.yaml`);
  const headText = readFileSync(flag("--head-file") ?? path.join(root, "design/decisions.yaml"), "utf8");
  const before = rowsOf(baseText);
  const after = rowsOf(headText);
  for (const [id, row] of before) {
    const now = after.get(id);
    if (!now) {
      faults.push(`shape: row ${id} removed`);
      continue;
    }
    const want = id in GAINED ? { ...row, check: GAINED[id] } : row;
    if (JSON.stringify(Object.entries(now).sort()) !== JSON.stringify(Object.entries(want).sort()))
      faults.push(`shape: row ${id} changed beyond its check`);
  }
  for (const id of after.keys())
    if (!before.has(id) && !(id in ADDED)) faults.push(`shape: row ${id} added, not in the matrix`);
  for (const id of Object.keys(ADDED))
    if (!after.has(id)) faults.push(`shape: row ${id} removed`);
  const files = flag("--files")
    ? flag("--files").split(",").filter(Boolean)
    : git("diff", "--name-only", base, "HEAD").split("\n").filter(Boolean);
  const changed = files.filter((file) => !file.startsWith("_acceptance/") && !GATE_VIEWS.includes(file));
  for (const file of changed)
    if (!FILES.includes(file) && !(file.startsWith(LOG_FOLDER) && file.endsWith(".md")))
      faults.push(`shape: file changed outside the matrix: ${file}`);
  finish(
    `shape: 8 rows gained a check, 2 rows added, no other row changed; files changed: ${changed.length}`,
  );
} else if (mode === "rules") {
  const page = readFileSync(flag("--page") ?? path.join(root, RULES_PAGE), "utf8");
  const theme = JSON.parse(readFileSync(path.join(root, "design/theme.json"), "utf8"));
  const sections = [...page.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
  for (const name of RULES_SECTIONS) if (!sections.includes(name)) faults.push(`rules: section ${name} missing`);
  const min = theme.checks?.["target-size"]?.[0]?.min;
  const said = /A control is at least (\d+)px high/.exec(page)?.[1];
  if (String(min) !== said) faults.push(`rules: Controls says ${said ?? "nothing"}px, design/theme.json holds ${min}px`);
  const heading = theme.checks?.typeface?.[0]?.expected;
  const saidHeading = /headings in `([^`]+)`/.exec(page)?.[1];
  if (heading !== saidHeading)
    faults.push(`rules: Type says headings in ${saidHeading ?? "nothing"}, design/theme.json holds ${heading}`);
  const wrong = page.split("\n").filter((line) => line.includes("undefined"));
  if (wrong.length !== 1 || !wrong[0].includes(KNOWN_DEFECT))
    faults.push(`rules: ${wrong.length} lines say undefined, the known defect is one`);
  finish(
    `rules: Controls says ${min}px as design/theme.json holds; Type says headings in ${heading} as design/theme.json holds; one known wrong line`,
  );
} else {
  console.log("usage: kiem.mjs pointers|rules|shape [--root DIR] [--base-file F] [--head-file F] [--files a,b]");
  process.exit(2);
}
