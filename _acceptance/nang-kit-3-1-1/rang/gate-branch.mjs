// AC-7: the pre-merge gate on the branch with the kit CI fetches (KIT_TAG of ci.yml, v3.1.1). It must run rules; before
// signature at least one stop and every stop names this record; with --signed (S5, after the Evidence gate) no stop.
import { fileURLToPath } from "node:url";

import { ciKit } from "./ci-tag.mjs";
import { cli, coreRoot, fetchKit, repoRoot, runGate, saveRun } from "./kit.mjs";
import { SLUG } from "./matrix.mjs";

export function judge(out, { signed = false, tag = "?" } = {}) {
  const ran = Number(out.match(/^pre-merge-check: rules ran=(\d+)/m)?.[1] ?? 0);
  if (!ran) return { ok: false, line: "gate-branch: no rules ran" };
  const stops = out.split("\n").filter((l) => l.startsWith("VIOLATION"));
  if (signed && stops.length)
    return { ok: false, line: `gate-branch: --signed wants 0 VIOLATION, got ${stops.length}: ${stops[0].slice(0, 200)}` };
  const prefix = `VIOLATION [${SLUG}]: `;
  const bad = stops.find((l) => !l.startsWith(prefix));
  if (bad) return { ok: false, line: `gate-branch: VIOLATION not naming ${SLUG}: ${bad.slice(0, 200)}` };
  if (!signed && stops.length === 0)
    return { ok: false, line: `gate-branch: before signature wants at least 1 VIOLATION naming ${SLUG}` };
  return {
    ok: true,
    line: `gate-branch: kit ${tag} (KIT_TAG of ci.yml) ran ${ran} rules on HEAD against origin/main; ${stops.length} VIOLATION lines, all naming ${SLUG}`,
  };
}

export async function measure({ root = repoRoot(), base = "origin/main", signed = false, save = true } = {}) {
  const kit = ciKit(root);
  const core = coreRoot(kit, fetchKit(kit));
  const { out } = runGate(core, root, ["--base", base]);
  if (save) saveRun(signed ? "gate-branch-signed.txt" : "gate-branch.txt", out);
  return judge(out, { signed, tag: kit.tag });
}

if (process.argv[1] === fileURLToPath(import.meta.url))
  await cli(measure, { signed: process.argv.includes("--signed") });
