// AC-9: what the pull request changes, and how it got there.
//   - The upgrade commit is unchanged: its parent is the base, it changes exactly UPGRADE_FILES, and
//     it is in HEAD (history not rewritten).
//   - Against the base, the pull request changes only UPGRADE_FILES, this dossier and ROUND_FILES;
//     nothing under UNTOUCHED (the policy, the hook's wiring, the hook).
//   - _acceptance/config.yaml only gains lines `    rs0102_<name>: ...` and loses none.
//   - tools/autonomy.py and tools/github_setup.py match risk_tiers.t3_paths of the base's config: the
//     dossier is T3.
//   - Every non-merge commit of the pull request passes tools/commit_msg.py of the base: the job
//     judges this pull request with the base's rule.
// --files a,b,c and --messages <json file> stand in for the diff and the messages (two-way.mjs).
// Usage: node change-set.mjs [--root <dir>] [--files ...] [--messages <file>]

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { git, prBase, root, run, show, verdict, yaml } from "./lib.mjs";
import { DOSSIER, ROUND_FILES, UNTOUCHED, UPGRADE, UPGRADE_FILES } from "./matrix.mjs";

const NAME = "change-set";
const dir = root();
const argv = process.argv.slice(2);
const opt = (name) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : null);
const problems = [];
const lines = (s) => s.split("\n").filter(Boolean).sort();

/** A glob of the config (`**`, `*`) as a regular expression on a path. */
function glob(g) {
  const re = g
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .split("**")
    .map((part) => part.replace(/\*/g, "[^/]*"))
    .join(".*");
  return new RegExp(`^${re}$`);
}

try {
  const base = prBase(dir);
  const up = lines(git(dir, "diff-tree", "--no-commit-id", "--name-only", "-r", UPGRADE));
  if (JSON.stringify(up) !== JSON.stringify([...UPGRADE_FILES].sort())) problems.push(`${UPGRADE.slice(0, 8)} changes ${JSON.stringify(up)}, not ${JSON.stringify(UPGRADE_FILES)}`);
  if (git(dir, "rev-parse", `${UPGRADE}^`).trim() !== base) problems.push(`the parent of ${UPGRADE.slice(0, 8)} is not the base ${base.slice(0, 8)}`);
  if (run("git", ["-C", dir, "merge-base", "--is-ancestor", UPGRADE, "HEAD"]).code !== 0) problems.push(`${UPGRADE.slice(0, 8)} is not in HEAD`);

  const changed = opt("--files") ? opt("--files").split(",").sort() : lines(git(dir, "diff", "--name-only", `${base}...HEAD`));
  const allowed = new Set([...UPGRADE_FILES, ...ROUND_FILES]);
  for (const f of changed) {
    if (!allowed.has(f) && !f.startsWith(DOSSIER)) problems.push(`the pull request changes ${f}, outside the upgrade and its round`);
    if (UNTOUCHED.some((u) => f === u || f.startsWith(u))) problems.push(`the pull request changes ${f}, which it must not touch`);
  }
  for (const f of UPGRADE_FILES) if (!changed.includes(f)) problems.push(`the pull request no longer changes ${f}`);

  // _acceptance/config.yaml only gains the commands of this round; the tier is read from the base's.
  const CONFIG = "_acceptance/config.yaml";
  const cfgDiff = git(dir, "diff", "--unified=0", base, "HEAD", "--", CONFIG).split("\n");
  for (const l of cfgDiff) {
    if (/^(\+\+\+|---) /.test(l) || !/^[+-]/.test(l)) continue;
    if (l.startsWith("-")) problems.push(`the pull request removes a line of ${CONFIG}: ${JSON.stringify(l.slice(1).trim())}`);
    else if (!/^\+ {4}rs0102_\w+: /.test(l)) problems.push(`the pull request adds a line to ${CONFIG} that is not a command rs0102_*: ${JSON.stringify(l.slice(1).trim())}`);
  }
  const baseConfig = show(dir, base, CONFIG);
  if (baseConfig === null) throw new Error(`the base has no ${CONFIG}`);
  const cfg = yaml(baseConfig);
  const t3 = (cfg.risk_tiers?.t3_paths ?? []).map(glob);
  const t3hits = UPGRADE_FILES.filter((f) => t3.some((re) => re.test(f)));
  if (!t3hits.includes("tools/autonomy.py") || !t3hits.includes("tools/github_setup.py")) problems.push(`the T3 paths among the upgrade are ${JSON.stringify(t3hits)}: the tier of the dossier is wrong`);

  const messages = opt("--messages")
    ? JSON.parse(readFileSync(opt("--messages"), "utf8"))
    : lines(git(dir, "rev-list", "--no-merges", `${base}..HEAD`)).map((sha) => git(dir, "log", "-1", "--format=%B", sha));
  const rule = show(dir, base, "tools/commit_msg.py");
  if (rule === null) throw new Error("the base has no tools/commit_msg.py");
  const tmp = mkdtempSync(join(tmpdir(), "rs0102-cs-"));
  try {
    writeFileSync(join(tmp, "commit_msg.py"), rule);
    messages.forEach((m, i) => {
      writeFileSync(join(tmp, `MSG-${i}`), m);
      const r = run("python3", ["-I", join(tmp, "commit_msg.py"), join(tmp, `MSG-${i}`)]);
      if (r.code !== 0) problems.push(`the commit "${m.split("\n")[0]}" does not pass the base's rule`);
    });
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `${UPGRADE.slice(0, 8)} is unchanged on the base and changes the four files of the upgrade; besides them the pull request changes only this dossier and the files of its round, not the policy, the hook or its wiring; the config only gains the commands rs0102_*; tools/** makes it T3 by the base's tiers; every commit of the pull request passes the base's rule`,
);
