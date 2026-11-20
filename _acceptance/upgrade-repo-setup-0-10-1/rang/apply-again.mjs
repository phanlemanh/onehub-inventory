// AC-2: apply.py of the tag repo-setup-v0.10.1, no option.
//   - On HEAD, --dry-run --json: exit 0, every action list empty, no file still marked.
//   - On the base, --dry-run --json: pr-title.yml updated, AGENTS.md merged, nothing else.
//   - On a throwaway worktree of the base, a real run: the three files it writes are HEAD's byte
//     for byte. This is where the text of AGENTS.md and pr-title.yml gets a source outside the tree.
// apply.py is the owner's tool; it writes only into the temp worktree.
// Usage: node apply-again.mjs [--root <dir>]

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { pluginTree, prBase, root, run, verdict, worktree } from "./lib.mjs";
import { NEW_VERSION, PLUGIN_TAG, UPGRADE_FILES } from "./matrix.mjs";

const NAME = "apply-again";
const dir = root();
const problems = [];
const ACTIONS = ["created", "updated", "merged", "edited", "marked", "base_unread", "removed", "dropped", "conflict"];
const AT_BASE = { updated: [".github/workflows/pr-title.yml"], merged: ["AGENTS.md"] };

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
    const got = [...(report[key] ?? [])].sort();
    const exp = [...(want[key] ?? [])].sort();
    if (JSON.stringify(got) !== JSON.stringify(exp)) problems.push(`${where} apply.py would ${key} ${JSON.stringify(got)}, not ${JSON.stringify(exp)}`);
  }
}

try {
  const head = apply(dir, "--dry-run");
  if (head.code !== 0) problems.push(`on HEAD apply.py --dry-run exited ${head.code}, not 0`);
  lists(head.report, {}, "on HEAD");
  const markers = run("python3", ["tools/upgrade_markers.py"], { cwd: dir });
  if (markers.code !== 0) problems.push(`a file is still marked: ${(markers.out + markers.err).trim().split("\n")[0]}`);

  const base = prBase(dir);
  const wt = worktree(dir, base);
  try {
    const dry = apply(wt.dir, "--dry-run");
    if (dry.code !== 0) problems.push(`on ${base.slice(0, 8)} apply.py --dry-run exited ${dry.code}, not 0`);
    lists(dry.report, AT_BASE, `on ${base.slice(0, 8)}`);
    const real = apply(wt.dir);
    if (real.code !== 0) problems.push(`on a copy of ${base.slice(0, 8)} apply.py exited ${real.code}, not 0`);
    for (const f of UPGRADE_FILES) {
      if (!readFileSync(join(wt.dir, f)).equals(readFileSync(join(dir, f)))) {
        problems.push(`the tag applied to ${base.slice(0, 8)} writes a ${f} that is not HEAD's`);
      }
    }
  } finally {
    wt.remove();
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `apply.py of ${PLUGIN_TAG} has nothing left to do on HEAD (manifest ${NEW_VERSION}, no marker); on the base it updates pr-title.yml, merges AGENTS.md and does nothing else, and applied to a copy of the base it writes HEAD's three files byte for byte`,
);
