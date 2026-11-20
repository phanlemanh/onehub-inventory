// AC-7: the commit that upgrades changes exactly UPGRADE_FILES, the commit that logs it exactly
// LOG_FILE; against the base of the pull request nothing else changes besides this dossier and
// ROUND_FILES; and none of the changed files matches risk_tiers.t3_paths of _acceptance/config.yaml.
// Should not pass: a file outside these lists, or a T3 path among them.
// Usage: node change-set.mjs [--root <dir>]

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { git, prBase, root, run, verdict, yaml } from "./lib.mjs";
import { DOSSIER, LOG, LOG_FILE, ROUND_FILES, UPGRADE, UPGRADE_FILES } from "./matrix.mjs";

const NAME = "change-set";
const dir = root();
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
  const up = lines(git(dir, "diff-tree", "--no-commit-id", "--name-only", "-r", UPGRADE));
  if (JSON.stringify(up) !== JSON.stringify([...UPGRADE_FILES].sort())) {
    problems.push(`${UPGRADE.slice(0, 8)} changes ${JSON.stringify(up)}, not ${JSON.stringify(UPGRADE_FILES)}`);
  }
  const lg = lines(git(dir, "diff-tree", "--no-commit-id", "--name-only", "-r", LOG));
  if (JSON.stringify(lg) !== JSON.stringify([LOG_FILE])) {
    problems.push(`${LOG.slice(0, 8)} changes ${JSON.stringify(lg)}, not ${LOG_FILE}`);
  }
  for (const sha of [UPGRADE, LOG]) {
    if (run("git", ["-C", dir, "merge-base", "--is-ancestor", sha, "HEAD"]).code !== 0) problems.push(`${sha} is not in HEAD`);
  }

  const changed = lines(git(dir, "diff", "--name-only", `${prBase(dir)}...HEAD`));
  const allowed = new Set([...UPGRADE_FILES, LOG_FILE, ...ROUND_FILES]);
  for (const f of changed) {
    if (!allowed.has(f) && !f.startsWith(DOSSIER)) problems.push(`the pull request changes ${f}, outside the upgrade and its round`);
  }
  for (const f of [...UPGRADE_FILES, LOG_FILE]) {
    if (!changed.includes(f)) problems.push(`the pull request no longer changes ${f}`);
  }

  const cfg = yaml(readFileSync(join(dir, "_acceptance/config.yaml"), "utf8"));
  const t3 = (cfg.risk_tiers?.t3_paths ?? []).map(glob);
  if (t3.length === 0) problems.push("_acceptance/config.yaml has no t3_paths");
  for (const f of changed) {
    if (t3.some((re) => re.test(f))) problems.push(`${f} is a T3 path`);
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `${UPGRADE.slice(0, 8)} changes pr-title.yml, .repo-setup.json and AGENTS.md; ${LOG.slice(0, 8)} one wiki/log file; besides them the pull request changes only this dossier and the files of its round, none a T3 path`,
);
