// AC-2: kit 3.0's pre-merge gate on the branch, as CI runs it. Before signature the only stop allowed is one
// lifecycle reason of this record; with --signed (S5, after the Evidence gate) no stop at all.
import { fileURLToPath } from "node:url";

import { cli, coreRoot, fetchKit, repoRoot, runGate, saveRun } from "./kit.mjs";
import { LIFECYCLE_REASONS, NEW_KIT, SLUG } from "./matrix.mjs";

export function judge(out, { signed = false } = {}) {
  if (!/^pre-merge-check: rules ran=/m.test(out)) return { ok: false, line: "gate-branch: no rules ran" };
  const stops = out.split("\n").filter((l) => l.startsWith("VIOLATION"));
  if (signed && stops.length)
    return { ok: false, line: `gate-branch: --signed wants 0 VIOLATION, got ${stops.length}: ${stops[0].slice(0, 200)}` };
  const prefix = `VIOLATION [${SLUG}]: `;
  const bad = stops.find(
    (l) => !(l.startsWith(prefix) && LIFECYCLE_REASONS.some(({ re }) => re.test(l.slice(prefix.length)))),
  );
  if (bad)
    return { ok: false, line: `gate-branch: VIOLATION outside the lifecycle reasons of ${SLUG}: ${bad.slice(0, 200)}` };
  if (stops.length > 1) return { ok: false, line: `gate-branch: ${stops.length} VIOLATION lines, want at most 1` };
  return {
    ok: true,
    line: `gate-branch: kit ${NEW_KIT.tag} ran its rules on HEAD against origin/main; ${stops.length} VIOLATION lines, each a lifecycle reason of ${SLUG} (not graded yet, graded but not PASS, or T3 not signed yet)`,
  };
}

export async function measure({ root = repoRoot(), base = "origin/main", signed = false, save = true } = {}) {
  const core = coreRoot(NEW_KIT, fetchKit(NEW_KIT));
  const { out } = runGate(core, root, ["--base", base]);
  if (save) saveRun(signed ? "gate-branch-signed.txt" : "gate-branch.txt", out);
  return judge(out, { signed });
}

if (process.argv[1] === fileURLToPath(import.meta.url))
  await cli(measure, { signed: process.argv.includes("--signed") });
