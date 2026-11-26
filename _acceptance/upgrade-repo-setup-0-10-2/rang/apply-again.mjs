// AC-2: apply.py of the tag repo-setup-v0.10.2, no option.
//   - On HEAD, --dry-run --json: exit 0, every action list empty, no file still marked; `removed`
//     is the 8 samples of KEPT_OLD and `edited` holds EDITED_COUNT files.
//   - On the base, --dry-run --json: `updated` is exactly the three files of UPDATED, no other action;
//     `removed` and `edited` are the same as on HEAD (the upgrade merged nothing).
//   - On a throwaway worktree of the base, a real run, then a second dry run: the four files it
//     writes are HEAD's byte for byte, and the second run has nothing left to do.
// apply.py is the owner's tool; it writes only into the temp worktree.
// Usage: node apply-again.mjs [--root <dir>]

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { pluginTree, prBase, root, run, verdict, worktree } from "./lib.mjs";
import { EDITED_COUNT, KEPT_OLD, PLUGIN_TAG, UPDATED, UPGRADE_FILES } from "./matrix.mjs";

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
  if ((head.report.edited ?? []).length !== EDITED_COUNT) {
    problems.push(`on HEAD apply.py leaves ${(head.report.edited ?? []).length} edited files alone, not ${EDITED_COUNT}`);
  }
  const markers = run("python3", ["tools/upgrade_markers.py"], { cwd: dir });
  if (markers.code !== 0) problems.push(`a file is still marked: ${(markers.out + markers.err).trim().split("\n")[0]}`);

  const base = prBase(dir);
  const at = base.slice(0, 8);
  const wt = worktree(dir, base);
  try {
    const dry = apply(wt.dir, "--dry-run");
    if (dry.code !== 0) problems.push(`on ${at} apply.py --dry-run exited ${dry.code}, not 0`);
    lists(dry.report, { updated: Object.keys(UPDATED) }, `on ${at}`);
    for (const [where, r] of [["HEAD", head.report], [at, dry.report]]) {
      if (sorted(r.removed) !== sorted(Object.keys(KEPT_OLD))) {
        problems.push(`on ${where} removed is ${sorted(r.removed)}, not the ${Object.keys(KEPT_OLD).length} samples`);
      }
    }
    if (sorted(head.report.edited) !== sorted(dry.report.edited)) problems.push("edited on HEAD is not edited on the base");

    const real = apply(wt.dir);
    if (real.code !== 0) problems.push(`on a copy of ${at} apply.py exited ${real.code}, not 0`);
    for (const f of UPGRADE_FILES) {
      if (!readFileSync(join(wt.dir, f)).equals(readFileSync(join(dir, f)))) {
        problems.push(`the tag applied to ${at} writes a ${f} that is not HEAD's`);
      }
    }
    const again = apply(wt.dir, "--dry-run");
    lists(again.report, {}, `after the real run on ${at}, a second`);
  } finally {
    wt.remove();
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `apply.py of ${PLUGIN_TAG} has nothing left to do on HEAD (no marker, ${EDITED_COUNT} edited files left alone, the ${Object.keys(KEPT_OLD).length} deleted samples not made again); on the base it updates pr-title.yml, autonomy.py and github_setup.py and does nothing else; applied to a copy of the base it writes HEAD's four files byte for byte, and a second run has nothing to do`,
);
