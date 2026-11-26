// The matrix written first (evals.yaml, top of file), as data every measure of this record reads.
import { homedir } from "node:os";
import path from "node:path";

// Where the branch left main, the commit that ran the upgrade to 0.69.0 (with the two repository
// fixes that keep the gate green), and the commit of its wiki log line.
export const BASE = "1ea13196de8472efc81df66e896db9640fec4a91";
export const UPGRADE = "7174ab43c4a7245c61f6b4054bbed6e28c2a1e42";
// AC-5 break: a main older than where the branch left it (the first parent of BASE).
export const OLDER_MAIN = "d47869acd2a52c7f97eef0af75d23b66220301dc";
export const LOG = "781243353cf3f4d3cc411fbfc66d5a6d3c466e3c";

// AC-3: the version this record takes, the ids git gives what that version hands a repository, as
// its release ledger records them and its template folder holds them.
export const RELEASE = {
  version: "0.69.0",
  tool: "0f6ddbdf348d9c36ed7cac07c2cfd1972200df31",
  files: 51,
};
export const GATE_STEP = { file: "mk/design-assembly.mk", blob: "a9af3d808fc7f156d659ada3f6528cfe3482264c" };
// The installed plugin's folder for that version. PLUGIN_CACHE stands in for it in the break copies.
export const PLUGIN_DIR = (version = RELEASE.version) =>
  path.join(
    process.env.PLUGIN_CACHE ?? path.join(homedir(), ".claude/plugins/cache/design-assembly/design-assembly"),
    version,
  );
export const PLUGIN_FILES = {
  ledger: "references/releases.json",
  toolTemplate: "templates/tools/design-assembly",
  gateStep: "templates/mk/design-assembly.mk",
};

export const TOOL_FOLDER = "tools/design-assembly";
export const STAMP = "design/tool-stamp.json";
export const THEME = "design/theme.json";

// AC-1, AC-2: what the gate and make check say. The upgrade adds three checks under ledger-shapes
// (30 at BASE, 33 here); the decisions and the rate do not move.
export const GATE = { decisions: 22, checks: 33 };
export const gateLine = ({ decisions, checks }) =>
  `design-assembly: ${decisions} decisions held by ${checks} checks, each seen failing on a changed copy`;
export const RATE = { automatic: 57, all: 69, held: 22, claimed: 35 };
export const rateLine = ({ automatic, all }) =>
  `determinism rate: ${automatic}/${all} (${Math.round((100 * automatic) / all)}%)`;
export const heldLine = ({ held, claimed }) =>
  `${held} held and re-run here, ${claimed} claimed by another check and not re-run`;
export const TESTS = { passed: 2663, skipped: 2 };
export const COMPONENTS = 294;

// AC-4: the 0.36.1 tool, taken from where the branch left main, and the decision the break drops.
export const OLD_TOOL_AT = BASE;
export const OLD_VERSION = "0.36.1";
export const BREAK_DECISION = "raw-table";

// AC-5: the rows that compare with main, and what each prints on a shallow clone that fetched main
// itself, or that has no main to fetch (the tool's own words at 0.69.0, pinned when first seen).
export const ROWS = ["decision-sheet", "owner-calls"];
export const FETCHED = (row) =>
  `${row}: a shallow checkout: main and the history back to where this branch left it were fetched from origin`;
export const NO_MAIN = "origin has neither main nor master";

// AC-6: every file the upgrade commit changes (git diff, renames off, against its parent).
export const UPGRADE_CHANGES = [
  "design/theme.json",
  "design/tool-stamp.json",
  "eslint.config.js",
  "mk/design-assembly.mk",
  "tests/ci-ban-sao-nong.test.ts",
  "tests/e2e/floating-parts.spec.ts",
  "tools/design-assembly/adapters/css-fonts.mjs",
  "tools/design-assembly/adapters/eslint.mjs",
  "tools/design-assembly/adapters/nextjs-build.mjs",
  "tools/design-assembly/adapters/playwright-floating-parts.d.mts",
  "tools/design-assembly/adapters/playwright-floating-parts.mjs",
  "tools/design-assembly/adapters/playwright.mjs",
  "tools/design-assembly/adapters/shadcn.mjs",
  "tools/design-assembly/check.mjs",
  "tools/design-assembly/choose-first.mjs",
  "tools/design-assembly/color.mjs",
  "tools/design-assembly/components.mjs",
  "tools/design-assembly/contract.mjs",
  "tools/design-assembly/exports.mjs",
  "tools/design-assembly/floating-parts.mjs",
  "tools/design-assembly/governance.mjs",
  "tools/design-assembly/host-make.mjs",
  "tools/design-assembly/intake-ledger.mjs",
  "tools/design-assembly/item-text.mjs",
  "tools/design-assembly/ledger.mjs",
  "tools/design-assembly/probes.mjs",
  "tools/design-assembly/source-folders.mjs",
  "tools/design-assembly/sources-ledger.mjs",
  "tools/design-assembly/styles.mjs",
  "tools/design-assembly/tokens.mjs",
  "tools/design-assembly/waiting.mjs",
];
export const LOG_CHANGES = ["wiki/log/2026-11-26-01-design-assembly-n-ng-t-0-36-1-l-n-0-69-0.md"];

// AC-6: what the branch as a whole may change beyond the two commits. A path ending in a slash is a
// folder; any file under it is allowed.
export const SLUG = "upgrade-design-assembly-0-69-0";
export const BRANCH_MAY_CHANGE = [
  ...UPGRADE_CHANGES,
  ...LOG_CHANGES,
  `_acceptance/${SLUG}/`,
  `docs/superpowers/specs/2026-11-26-${SLUG}-design.md`,
  `docs/superpowers/plans/2026-11-26-${SLUG}.md`,
];
// The two pages the gate commands draw again (see the 0-33-0 record for why).
export const DRAWN_PAGES = ["PRODUCT-MAP.md", "LO-TRINH.html"];
export const DRAWER = "scripts/product-map.mjs";
export const DATA_BLOCK = /<script type="application\/json" id="lo-trinh-du-lieu">([\s\S]*?)<\/script>/;

// AC-7: the lint override reaches only the tool folder: a plain function calling a use-named
// function is let through there, and still an error in src/ and in a .mjs file beside the folder.
export const HOOK_RULE = "react-hooks/rules-of-hooks";
export const HOOK_PROBE = {
  // A .mjs file beside the tool folder, so an override wider than the folder shows.
  sibling: "tools/hook-probe.mjs",
  tool: "tools/design-assembly/contract.mjs",
  src: "src/lib/format/hook-probe.ts",
  text: "function useProbe() {\n  return 1;\n}\nexport function plain() {\n  return useProbe();\n}\n",
};

// AC-8: the choose-first check holds in this repository: a component file a branch adds with no row
// of the intake ledger turns the gate red, naming the check and the file.
export const CHOOSE_FIRST = {
  file: "src/components/candidate/probe-badge.tsx",
  text: "export function ProbeBadge() {\n  return <span>probe</span>;\n}\n",
  check: "choose-first",
  // The row that takes it in is made from a row the plugin's writer wrote, with three keys changed.
  rowFrom: "design/intake/bang-nhieu-dong.yaml",
  rowAt: "design/intake/probe-badge.yaml",
  need: "probe-badge",
};
