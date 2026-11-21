// AC-5: decision page 0046 records the owner's decision on the pace of repo-setup upgrades, and the
// tier it gives each upgrade round equals risk_tier of that round's contract.
// Usage: node decision.mjs [--root <dir>]

import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  DECISION,
  DECISION_SECTIONS,
  DECISION_STATUS,
  MILESTONE_SENTENCE,
  OWNER_SENTENCE,
  TIERS_UNCHANGED,
  UPGRADES,
} from "./matrix.mjs";
import { done, lines, read, rootOf } from "./lib.mjs";

const NAME = "decision";
const root = rootOf();
if (!existsSync(join(root, DECISION))) done(NAME, [`${DECISION} is missing`], "");
const page = read(root, DECISION);
const problems = [];

if (!/^---\n(?:.*\n)*?type: decision\n/.test(page)) problems.push("the front matter has no type: decision");
const sectionOf = (title) => {
  const start = page.indexOf(`\n## ${title}\n`);
  if (start < 0) return null;
  const rest = page.slice(start + title.length + 5);
  const end = rest.indexOf("\n## ");
  return end < 0 ? rest : rest.slice(0, end);
};
for (const title of DECISION_SECTIONS) {
  if (sectionOf(title) === null) problems.push(`section ${title} is missing`);
}
if (!(sectionOf("Status") ?? "").includes(DECISION_STATUS)) problems.push(`Status does not say ${DECISION_STATUS}`);
if (!/chủ kho/i.test(sectionOf("Status") ?? "")) problems.push("Status does not say the owner decided");
const decision = (sectionOf("Decision") ?? "").replace(/\s+/g, " ");
if (!decision.includes(OWNER_SENTENCE)) problems.push("the owner's sentence is missing");
if (!decision.includes(MILESTONE_SENTENCE)) problems.push("the milestone definition is missing");
if (!page.replace(/\s+/g, " ").includes(TIERS_UNCHANGED)) problems.push("the page does not say risk_tiers is unchanged");

// One table row per upgrade round; its tier is the contract's.
const rows = lines(page).filter((l) => l.startsWith("|"));
const absent = [];
let compared = 0;
for (const { version, slug, tier } of UPGRADES) {
  const row = rows.find((l) => l.split("|").some((cell) => cell.trim() === version));
  const inPage = row?.match(/\bT[123]\b/)?.[0];
  if (inPage === undefined) {
    problems.push(`no row gives a tier to ${version}`);
    continue;
  }
  if (inPage !== tier) problems.push(`tier of ${version} is ${inPage} in the page, ${tier} in the matrix`);
  const contract = join(root, "_acceptance", slug, "contract.md");
  if (!existsSync(contract)) {
    absent.push(slug);
    continue;
  }
  const real = read(root, join("_acceptance", slug, "contract.md")).match(/^risk_tier: (T[123])$/m)?.[1];
  if (real === undefined) problems.push(`${slug}/contract.md has no risk_tier`);
  else if (real !== inPage) problems.push(`tier of ${version} is ${inPage} in the page, ${real} in its contract`);
  else compared += 1;
}

const logDir = join(root, "wiki/log");
const entries = existsSync(logDir) ? readdirSync(logDir).filter((f) => read(root, join("wiki/log", f)).includes("0046")) : [];
if (entries.length !== 1) problems.push(`${entries.length} log entries name decision 0046, expected 1`);

done(
  NAME,
  problems,
  `page 0046 has the four sections, ${DECISION_STATUS}, the owner's sentence and the milestone definition; tiers ${UPGRADES.map((u) => `${u.version} ${u.tier}`).join(", ")} equal risk_tier of ${compared} contracts in the tree (${absent.length === 0 ? "none absent" : `not in the tree: ${absent.join(", ")}`}); risk_tiers said unchanged; 1 log entry names it`,
);
