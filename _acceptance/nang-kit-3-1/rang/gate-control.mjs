// AC-5: on main as it is, kit v3.0.0 and v3.1.0 recheck every record with the same result, so the CI gate can move
// to v3.1.0 without changing any verdict.
import { fileURLToPath } from "node:url";

import { cli, coreRoot, fetchKit, mergeBase, repoRoot, runGate, saveRun, short, worktree } from "./kit.mjs";
import { NEW_KIT, OLD_KIT } from "./matrix.mjs";

export function okRecords(out) {
  return [...out.matchAll(/^OK \[([^\]]+)\]/gm)].map((m) => m[1]).sort();
}

export function violations(out) {
  return out.split("\n").filter((l) => l.startsWith("VIOLATION")).length;
}

// null when both runs ran rules, have 0 VIOLATION and OK the same records; otherwise the red line.
export function compareRuns(oldOut, newOut) {
  for (const [name, out] of [
    [OLD_KIT.tag, oldOut],
    [NEW_KIT.tag, newOut],
  ]) {
    if (!/^pre-merge-check: rules ran=/m.test(out)) return `gate-control: kit ${name} ran no rules`;
    const v = violations(out);
    if (v) return `gate-control: kit ${name} has ${v} VIOLATION`;
  }
  const a = okRecords(oldOut);
  const b = okRecords(newOut);
  if (!a.length) return "gate-control: no OK record";
  if (a.join("\n") !== b.join("\n")) {
    const onlyOld = a.filter((x) => !b.includes(x));
    const onlyNew = b.filter((x) => !a.includes(x));
    return `gate-control: OK records differ (only ${OLD_KIT.tag}: ${onlyOld.join(",") || "-"}; only ${NEW_KIT.tag}: ${onlyNew.join(",") || "-"})`;
  }
  return null;
}

export function recheck(kit, sha) {
  const core = coreRoot(kit, fetchKit(kit));
  const wt = worktree(sha);
  try {
    return runGate(core, wt.dir, ["--base", sha, "--recheck-all"]).out;
  } finally {
    wt.remove();
  }
}

export async function measure({ sha = mergeBase(repoRoot()) } = {}) {
  const oldOut = recheck(OLD_KIT, sha);
  const newOut = recheck(NEW_KIT, sha);
  saveRun(`gate-control-${short(sha)}-${OLD_KIT.tag}.txt`, oldOut);
  saveRun(`gate-control-${short(sha)}-${NEW_KIT.tag}.txt`, newOut);
  const red = compareRuns(oldOut, newOut);
  if (red) return { ok: false, line: `${red} on ${short(sha)}` };
  return {
    ok: true,
    line: `gate-control: on ${short(sha)} (merge-base) --recheck-all, kit ${OLD_KIT.tag} and ${NEW_KIT.tag} both 0 VIOLATION, ${okRecords(newOut).length} OK each, same records`,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await cli(measure);
