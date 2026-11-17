// AC-7: the 0.7.0 `affected` command, with the map design/theme.json of HEAD declares, over the last
// merges of main where the branch left it. Each merge gets all screens, some, or none; a declared screen is missing when the merge's own contract lists a screen
// affected did not name. Each merge is checked out in a clone that shares the repository's objects.
// Usage: node affected-merges.mjs [--root <repository>] [--map <JSON file of an affected map>]
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import { git, lines, option, ROOT, sharedClone } from "./lib.mjs";
import { AFFECTED, BASE, TOOL_FOLDER } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const map = option("--map")
  ? JSON.parse(readFileSync(option("--map"), "utf8"))
  : JSON.parse(readFileSync(path.join(root, "design/theme.json"), "utf8")).affected;
const merges = lines(git(root, "log", "--first-parent", "--merges", "--format=%H", `-${AFFECTED.merges}`, BASE));
const clone = sharedClone(root);
const rows = [];
try {
  for (const merge of merges) {
    const pr = (git(root, "log", "-1", "--format=%s", merge).match(/#(\d+)/) ?? [null, "?"])[1];
    const files = lines(git(root, "diff", "--name-only", "--no-renames", `${merge}^1`, merge));
    git(clone.dir, "checkout", "-q", "--force", merge);
    git(clone.dir, "clean", "-qfdx", "--", TOOL_FOLDER, "design");
    rmSync(path.join(clone.dir, TOOL_FOLDER), { recursive: true, force: true });
    cpSync(path.join(root, TOOL_FOLDER), path.join(clone.dir, TOOL_FOLDER), { recursive: true });
    const themeFile = path.join(clone.dir, "design/theme.json");
    const theme = existsSync(themeFile)
      ? JSON.parse(readFileSync(themeFile, "utf8"))
      : { version: 1, stylesheet: "src/app/globals.css" };
    writeFileSync(themeFile, JSON.stringify({ ...theme, affected: map }));
    const run = spawnSync(
      process.execPath,
      [path.join(clone.dir, TOOL_FOLDER, "affected.mjs"), "--json", "--files", files.join(",")],
      { cwd: clone.dir, encoding: "utf8", maxBuffer: 1 << 26 },
    );
    let result;
    try {
      result = JSON.parse(run.stdout);
    } catch {
      rows.push({ pr, error: (run.stderr || run.stdout).trim().split("\n")[0] });
      continue;
    }
    const chosen = new Set((result.screens ?? []).map((screen) => screen.id));
    const declared = new Set();
    for (const file of files) {
      if (!/^_acceptance\/[^/]+\/contract\.md$/.test(file)) continue;
      const at = path.join(clone.dir, file);
      const text = existsSync(at) ? readFileSync(at, "utf8") : "";
      const list = text.match(/^screens:\s*\[(.*?)\]/m);
      for (const id of list ? list[1].split(",") : []) if (id.trim()) declared.add(id.trim());
    }
    const missing = result.all ? [] : [...declared].filter((id) => !chosen.has(id));
    rows.push({ pr, all: Boolean(result.all), screens: chosen.size, declared: [...declared], missing, files: files.length });
  }
} finally {
  clone.remove();
}
const errors = rows.filter((row) => row.error);
const all = rows.filter((row) => !row.error && row.all).length;
const some = rows.filter((row) => !row.error && !row.all && row.screens > 0).length;
const none = rows.filter((row) => !row.error && !row.all && row.screens === 0).length;
const missing = rows.filter((row) => row.missing?.length).length;
for (const row of rows) {
  const what = row.error ? `error: ${row.error}` : row.all ? "all screens" : `${row.screens} screens`;
  const miss = row.missing?.length ? `; missing ${row.missing.join(" ")}` : "";
  process.stdout.write(`  #${row.pr}: ${what}${miss} (${row.files ?? 0} files)\n`);
}
const found = [];
if (rows.length !== AFFECTED.merges) found.push(`${rows.length} merges read, not ${AFFECTED.merges}`);
if (errors.length) found.push(`${errors.length} merges affected could not read`);
const counts = `${all} all screens, ${some} some screens, ${none} no screen`;
const want = `${AFFECTED.all} all screens, ${AFFECTED.some} some screens, ${AFFECTED.none} no screen`;
if (counts !== want) found.push(`${counts}, not ${want}`);
if (missing !== AFFECTED.missing) found.push(`with a declared screen missing: ${missing}, not ${AFFECTED.missing}`);
for (const line of found) process.stdout.write(`affected: ${line}\n`);
if (!found.length) {
  process.stdout.write(`affected: ${rows.length} merges: ${counts}; with a declared screen missing: ${missing}\n`);
}
process.exitCode = found.length ? 1 : 0;
