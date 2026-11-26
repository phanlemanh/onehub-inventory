// AC-2: kit 3.0's pre-merge gate on the branch, as CI runs it. Before signature every stop must name this record
// (its reason is not measured: Known limit 3 of the contract); with --signed (S5, after the Evidence gate) no stop.
import { fileURLToPath } from "node:url";

import { cli, coreRoot, fetchKit, repoRoot, runGate, saveRun } from "./kit.mjs";
import { NEW_KIT, SLUG } from "./matrix.mjs";

export function judge(out, { signed = false } = {}) {
  if (!/^pre-merge-check: rules ran=/m.test(out)) return { ok: false, line: "gate-branch: no rules ran" };
  const stops = out.split("\n").filter((l) => l.startsWith("VIOLATION"));
  if (signed && stops.length)
    return { ok: false, line: `gate-branch: --signed wants 0 VIOLATION, got ${stops.length}: ${stops[0].slice(0, 200)}` };
  const prefix = `VIOLATION [${SLUG}]: `;
  const bad = stops.find((l) => !l.startsWith(prefix));
  if (bad) return { ok: false, line: `gate-branch: VIOLATION not naming ${SLUG}: ${bad.slice(0, 200)}` };
  return {
    ok: true,
    line: `gate-branch: kit ${NEW_KIT.tag} ran its rules on HEAD against origin/main; ${stops.length} VIOLATION lines, all naming ${SLUG}`,
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
