// AC-5: on main as it is, kit v3.0.0 and v3.1.0 recheck every record with the same result — as many OK records as
// there are records with a contract — and on HEAD (this record, written by a 3.1 session) both kits print the same
// verdict lines, so the CI gate can move to v3.1.0 without changing any verdict.
import { fileURLToPath } from "node:url";

import { cli, coreRoot, fetchKit, git, mergeBase, repoRoot, runGate, saveRun, short, worktree } from "./kit.mjs";
import { NEW_KIT, OLD_KIT } from "./matrix.mjs";

export function okRecords(out) {
  return [...out.matchAll(/^OK \[([^\]]+)\]/gm)].map((m) => m[1]).sort();
}

export function violations(out) {
  return out.split("\n").filter((l) => l.startsWith("VIOLATION")).length;
}

// Records with a contract at a commit, counted from git, not from the gate.
export function contractsAt(sha, root = repoRoot()) {
  return git(root, "ls-tree", "-r", "--name-only", sha, "--", "_acceptance")
    .split("\n")
    .filter((p) => /^_acceptance\/[^/]+\/contract\.md$/.test(p)).length;
}

// The verdict lines of a gate run (OK and VIOLATION), sorted.
export function verdictLines(out) {
  return out
    .split("\n")
    .filter((l) => /^(OK|VIOLATION)\b/.test(l))
    .sort();
}

// null when both runs ran rules, have 0 VIOLATION and OK the same `want` records; otherwise the red line.
export function compareRuns(oldOut, newOut, want = null) {
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
  if (want !== null && a.length !== want) return `gate-control: OK ${a.length} records, want ${want}`;
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

// null when both kits print the same verdict lines on the branch; otherwise the red line.
export function compareHead(oldOut, newOut) {
  for (const [name, out] of [
    [OLD_KIT.tag, oldOut],
    [NEW_KIT.tag, newOut],
  ])
    if (!/^pre-merge-check: rules ran=/m.test(out)) return `gate-control: kit ${name} ran no rules on HEAD`;
  const a = verdictLines(oldOut);
  const b = verdictLines(newOut);
  if (a.join("\n") !== b.join("\n")) return "gate-control: verdict lines on HEAD differ between kits";
  return null;
}

export function headRun(kit, root = repoRoot()) {
  return runGate(coreRoot(kit, fetchKit(kit)), root, ["--base", "origin/main"]).out;
}

export async function measure({ sha = mergeBase(repoRoot()) } = {}) {
  const oldOut = recheck(OLD_KIT, sha);
  const newOut = recheck(NEW_KIT, sha);
  saveRun(`gate-control-${short(sha)}-${OLD_KIT.tag}.txt`, oldOut);
  saveRun(`gate-control-${short(sha)}-${NEW_KIT.tag}.txt`, newOut);
  const want = contractsAt(sha);
  const red = compareRuns(oldOut, newOut, want);
  if (red) return { ok: false, line: `${red} on ${short(sha)}` };
  const oldHead = headRun(OLD_KIT);
  const newHead = headRun(NEW_KIT);
  saveRun(`gate-control-HEAD-${OLD_KIT.tag}.txt`, oldHead);
  saveRun(`gate-control-HEAD-${NEW_KIT.tag}.txt`, newHead);
  const redHead = compareHead(oldHead, newHead);
  if (redHead) return { ok: false, line: redHead };
  return {
    ok: true,
    line: [
      `gate-control: on ${short(sha)} (merge-base) --recheck-all, kit ${OLD_KIT.tag} and ${NEW_KIT.tag} both 0 VIOLATION, ${want} OK each (= records with a contract), same records`,
      `gate-control: on HEAD against origin/main both kits print the same ${verdictLines(newHead).length} verdict lines`,
    ],
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await cli(measure);
