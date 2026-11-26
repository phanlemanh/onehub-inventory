// AC-2: apply.py of repo-setup 0.9.0 has nothing left to do on HEAD, no file still holds a marker,
// and on BASE the same run marks 12 files and stops on mk/derived.mk.
// Usage: node apply-again.mjs [--root <dir>] [--skip-base]

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { applyPy, flag, root, run, verdict, worktree } from "./lib.mjs";
import { BASE, BASE_CONFLICT, BASE_MARKED } from "./matrix.mjs";

const NAME = "apply-again";
const dir = root();
const problems = [];

function dryRun(at) {
  const r = run("python3", [applyPy(), "--dry-run", "--json"], { cwd: at });
  try {
    return { code: r.code, report: JSON.parse(r.out) };
  } catch {
    throw new Error(`apply.py --dry-run printed no JSON in ${at}: ${r.err.trim().split("\n").pop()}`);
  }
}

try {
  const head = dryRun(dir);
  if (head.code !== 0) problems.push(`on HEAD apply.py --dry-run exited ${head.code}, not 0`);
  for (const key of ["created", "updated", "merged", "marked", "conflict"]) {
    const list = head.report[key] ?? [];
    if (list.length > 0) problems.push(`on HEAD apply.py would still ${key}: ${list.join(", ")}`);
  }
  const version = JSON.parse(readFileSync(join(dir, ".repo-setup.json"), "utf8")).version;
  if (version !== "0.9.0") problems.push(`.repo-setup.json records version ${version}, not 0.9.0`);
  const markers = run("python3", ["tools/upgrade_markers.py"], { cwd: dir });
  if (markers.code !== 0) problems.push(`a file is still marked: ${(markers.out + markers.err).trim().split("\n")[0]}`);

  if (!flag("--skip-base")) {
    const wt = worktree(dir, BASE);
    try {
      const base = dryRun(wt.dir);
      if (base.code !== 1) problems.push(`on ${BASE.slice(0, 8)} apply.py --dry-run exited ${base.code}, not 1`);
      if ((base.report.marked ?? []).length !== BASE_MARKED) {
        problems.push(`on ${BASE.slice(0, 8)} apply.py marks ${(base.report.marked ?? []).length} files, not ${BASE_MARKED}`);
      }
      if (JSON.stringify(base.report.conflict ?? []) !== JSON.stringify(BASE_CONFLICT)) {
        problems.push(`on ${BASE.slice(0, 8)} the conflict is ${JSON.stringify(base.report.conflict)}, not ${JSON.stringify(BASE_CONFLICT)}`);
      }
    } finally {
      wt.remove();
    }
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `repo-setup 0.9.0 has nothing left to do on HEAD (created, updated, merged, marked, conflict all empty; manifest 0.9.0; no marker left); on ${BASE.slice(0, 8)} it exits 1 with ${BASE_MARKED} marked files and a conflict on mk/derived.mk`,
);
