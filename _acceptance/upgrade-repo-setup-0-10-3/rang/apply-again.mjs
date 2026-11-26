// AC-2: apply.py of the tag repo-setup-v0.10.3, no option.
//   - On HEAD, --dry-run --json: exit 0, every action list empty, no file still marked; `removed` is
//     the 8 samples of KEPT_OLD; `edited` is the base's plus AGENTS.md and the policy file.
//   - On the base, --dry-run --json: created, updated, merged and marked are exactly the lists of the
//     matrix, nothing dropped or in conflict.
//   - On a throwaway worktree of the base, a real run: it marks the policy file only, and every
//     other file it writes is HEAD's byte for byte, and `git status` of the copy names exactly the
//     eleven files of the upgrade (the manifest it writes, hashes included, is HEAD's).
// apply.py is the owner's tool; it writes only into the temp worktree.
// Usage: node apply-again.mjs [--root <dir>]

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { git, pluginTree, prBase, root, run, verdict, worktree } from "./lib.mjs";
import { CREATED, EDITED_AT_BASE, KEPT_OLD, MARKED, MERGED, PLUGIN_TAG, POLICY, UPDATED, UPGRADE_FILES } from "./matrix.mjs";

const NAME = "apply-again";
const dir = root();
const problems = [];
const ACTIONS = ["created", "updated", "merged", "marked", "base_unread", "dropped", "conflict"];
const sorted = (l) => JSON.stringify([...(l ?? [])].sort());

function apply(at, ...opts) {
  const script = join(pluginTree(), "plugins/repo-setup/scripts/apply.py");
  const r = run("python3", ["-I", script, ...opts, "--json", "--target", at], { cwd: at });
  try {
    return { code: r.code, report: JSON.parse(r.out) };
  } catch {
    throw new Error(`apply.py ${opts.join(" ")} printed no JSON in ${at}: ${r.err.trim().split("\n").pop()}`);
  }
}

function lists(report, want, where) {
  for (const key of ACTIONS) {
    const got = sorted(report[key]);
    const exp = sorted(want[key]);
    if (got !== exp) problems.push(`${where} apply.py would ${key} ${got}, not ${exp}`);
  }
}

try {
  const head = apply(dir, "--dry-run");
  if (head.code !== 0) problems.push(`on HEAD apply.py --dry-run exited ${head.code}, not 0`);
  lists(head.report, {}, "on HEAD");
  const markers = run("python3", ["tools/upgrade_markers.py"], { cwd: dir });
  if (markers.code !== 0) problems.push(`a file is still marked: ${(markers.out + markers.err).trim().split("\n")[0]}`);

  const base = prBase(dir);
  const at = base.slice(0, 8);
  const wt = worktree(dir, base);
  try {
    const want = { created: CREATED, updated: UPDATED, merged: MERGED, marked: MARKED };
    const dry = apply(wt.dir, "--dry-run");
    lists(dry.report, want, `on ${at}`);
    if ((dry.report.edited ?? []).length !== EDITED_AT_BASE) problems.push(`on ${at} apply.py leaves ${(dry.report.edited ?? []).length} edited files alone, not ${EDITED_AT_BASE}`);
    for (const [where, r] of [["HEAD", head.report], [at, dry.report]]) {
      if (sorted(r.removed) !== sorted(Object.keys(KEPT_OLD))) problems.push(`on ${where} removed is ${sorted(r.removed)}, not the ${Object.keys(KEPT_OLD).length} samples`);
    }
    if (sorted(head.report.edited) !== sorted([...(dry.report.edited ?? []), ...MERGED, ...MARKED])) {
      problems.push("edited on HEAD is not edited on the base plus AGENTS.md and the policy file");
    }
    const real = apply(wt.dir);
    lists(real.report, want, `applied to ${at},`);
    for (const f of UPGRADE_FILES.filter((x) => x !== POLICY)) {
      if (!readFileSync(join(wt.dir, f)).equals(readFileSync(join(dir, f)))) problems.push(`the tag applied to ${at} writes a ${f} that is not HEAD's`);
    }
    const touched = git(wt.dir, "status", "--porcelain", "--untracked-files=all").split("\n").filter(Boolean).map((l) => l.slice(3)).sort();
    if (JSON.stringify(touched) !== JSON.stringify([...UPGRADE_FILES].sort())) problems.push(`the tag applied to ${at} touches ${JSON.stringify(touched)}, not the ${UPGRADE_FILES.length} files of the upgrade`);
    if (!readFileSync(join(wt.dir, POLICY), "utf8").includes("<<<<<<< this repository")) problems.push(`the tag applied to ${at} leaves no marker in ${POLICY}`);
  } finally {
    wt.remove();
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `apply.py of ${PLUGIN_TAG} has nothing left to do on HEAD (no marker, the ${Object.keys(KEPT_OLD).length} deleted samples not made again); on the base it creates the five sdlc tools, updates autonomy.py, github_setup.py and sdlc_metrics.py, merges AGENTS.md and marks the policy file, nothing else; applied to a copy of the base it writes HEAD's other ten files byte for byte and leaves markers in the policy file only`,
);
