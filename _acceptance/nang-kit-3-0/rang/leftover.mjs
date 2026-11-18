// AC-8: no old kit name left in living files; the same sweep on the fixed baseline finds the 15 known lines.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { cli, repoRoot, short } from "./kit.mjs";
import { BASELINE, OLD_NAME_RE, SWEEP_AT_BASELINE, SWEEP_EXCLUDE, SWEEP_INCLUDE_AGAIN } from "./matrix.mjs";

function grep(root, rev, specs) {
  const args = ["-C", root, "grep", "-n", "-I", "-E", OLD_NAME_RE, ...(rev ? [rev] : []), "--", ...specs];
  const r = spawnSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0 && r.status !== 1) throw new Error(`leftover: git grep failed: ${r.stderr.trim()}`);
  return r.stdout.split("\n").filter(Boolean);
}

// Lines of the sweep, in the working tree of `root` (rev undefined) or at `rev`.
export function sweep(root, rev) {
  const main = grep(root, rev, [".", ...SWEEP_EXCLUDE.map((g) => `:(exclude)${g}`)]);
  const again = grep(root, rev, SWEEP_INCLUDE_AGAIN);
  const lines = [...main, ...again];
  const file = (l) => (rev ? l.split(":")[1] : l.split(":")[0]);
  return { lines, files: new Set(lines.map(file)).size };
}

export async function measure({ root = repoRoot() } = {}) {
  const head = sweep(root);
  if (head.lines.length) return { ok: false, line: `leftover: ${head.lines.length} lines at HEAD: ${head.lines[0].slice(0, 160)}` };
  const base = sweep(repoRoot(), BASELINE);
  if (base.lines.length !== SWEEP_AT_BASELINE.lines || base.files !== SWEEP_AT_BASELINE.files)
    return {
      ok: false,
      line: `leftover: ${base.lines.length} lines in ${base.files} files at ${short(BASELINE)}, want ${SWEEP_AT_BASELINE.lines} in ${SWEEP_AT_BASELINE.files}`,
    };
  return { ok: true, line: `leftover: 0 lines at HEAD; ${base.lines.length} lines in ${base.files} files at ${short(BASELINE)}` };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await cli(measure);
