// AC-7: the branch changes the files of the round and nothing else; _acceptance/config.yaml only
// gains the commands of this round and its risk_tiers block is the base's.
// Usage: node change-set.mjs          (reads git: the base is where the branch left main)
// judge() is exported so two-way.mjs can hand it a broken change set.

import { pathToFileURL } from "node:url";

import { CONFIG, CONFIG_ADDED, FENCED, ROUND_FILES, WORKFLOW } from "./matrix.mjs";
import { atBase, baseSha, done, git, lines, matches, read, refuse, REPO } from "./lib.mjs";

const NAME = "change-set";

/** The risk_tiers block: from its key to the next top-level key. */
function riskTiers(config) {
  const all = lines(config);
  const start = all.indexOf("risk_tiers:");
  if (start < 0) return null;
  const end = all.findIndex((l, i) => i > start && /^\S/.test(l));
  return all.slice(start, end < 0 ? all.length : end).join("\n");
}

/** The problems of a change set: the changed files, and the config at the base and at HEAD. */
export function judge({ files, baseConfig, headConfig }) {
  const problems = [];
  for (const f of files) {
    if (!ROUND_FILES.some((p) => matches(p, f))) problems.push(`outside the round: ${f}`);
    const fenced = FENCED.find((p) => (p.endsWith("/") ? f.startsWith(p) : f === p));
    if (fenced !== undefined && f !== WORKFLOW) problems.push(`fenced path changed: ${f}`);
  }
  const before = lines(baseConfig);
  const after = lines(headConfig);
  let seen = 0;
  const kept = new Set();
  for (const line of before) {
    const found = after.indexOf(line, seen);
    if (found < 0) {
      problems.push(`${CONFIG} lost a line: ${JSON.stringify(line.slice(0, 80))}`);
      break;
    }
    kept.add(found);
    seen = found + 1;
  }
  const added = after.filter((_, i) => !kept.has(i));
  const foreign = added.filter((l) => !CONFIG_ADDED.test(l));
  if (problems.length === 0 && foreign.length > 0) {
    problems.push(`${CONFIG} gained a line that is no rmd_ command: ${JSON.stringify(foreign[0].slice(0, 80))}`);
  }
  if (riskTiers(baseConfig) === null) problems.push(`${CONFIG} of the base has no risk_tiers`);
  else if (riskTiers(baseConfig) !== riskTiers(headConfig)) problems.push("risk_tiers differs from the base");
  return { problems, added: added.length };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const base = baseSha();
  const files = lines(git(REPO, "diff", "--name-only", `${base}...HEAD`));
  if (files.length === 0) refuse(NAME, "the branch changes no file against its base");
  const baseConfig = atBase(CONFIG);
  if (baseConfig === null) refuse(NAME, `the base has no ${CONFIG}`);
  const { problems, added } = judge({ files, baseConfig, headConfig: git(REPO, "show", `HEAD:${CONFIG}`) });
  if (read(REPO, CONFIG) !== git(REPO, "show", `HEAD:${CONFIG}`)) problems.push(`${CONFIG} has changes that are not committed`);
  done(
    NAME,
    problems,
    `the branch changes only the files of the round (${files.length} files); ${CONFIG} only adds ${added} rmd_ commands and risk_tiers equals the base; nothing under governance/, .claude/, tools/, mk/, no Makefile, no package.json, and of .github/ only workflows/security.yml`,
  );
}
