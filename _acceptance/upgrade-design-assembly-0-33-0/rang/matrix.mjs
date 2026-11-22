// The matrix written first (evals.yaml, top of file), as data every measure of this record reads.
import { homedir } from "node:os";
import path from "node:path";

// Where the branch left main, the commit that brought 0.33.0 on top of it, and the commit that ran
// the upgrade again with 0.36.1.
export const BASE = "6ce94d9ff8e064a0c13c2dc49ca4198c195b0116";
export const UPGRADE = "26ab13af76954c932edc00d15f67a7a968c7e832";
export const RERUN = "07b5c5547b7e821968e9a601d7678c2003621c4a";

// AC-3: the version this record takes, the ids git gives what that version hands a repository, as
// its release ledger records them and its template folder holds them.
export const RELEASE = {
  version: "0.36.1",
  tool: "f53b64535e01adcf1421d594d23413facdb455d5",
  files: 44,
};
export const GATE_STEP = { file: "mk/design-assembly.mk", blob: "15c4208b99e238f16a5d7b1826e66629ebf5d510" };
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

// AC-1, AC-2: what the gate and make check say. None of these depends on the tool version.
export const GATE = { decisions: 19, checks: 27 };
export const gateLine = ({ decisions, checks }) =>
  `design-assembly: ${decisions} decisions held by ${checks} checks, each seen failing on a changed copy`;
export const RATE = { automatic: 47, all: 67, held: 19, claimed: 28 };
export const rateLine = ({ automatic, all }) =>
  `determinism rate: ${automatic}/${all} (${Math.round((100 * automatic) / all)}%)`;
export const heldLine = ({ held, claimed }) =>
  `${held} held and re-run here, ${claimed} claimed by another check and not re-run`;
export const TESTS = { passed: 2607, skipped: 2 };
export const COMPONENTS = 294;

// AC-4: the 0.7.1 tool, taken from where the branch left main, and the decision the break drops.
export const OLD_TOOL_AT = BASE;
export const BREAK_DECISION = "raw-table";

// AC-5: the two rows that compare with main, and what each prints on a shallow clone that fetched
// main itself, or that has no main to fetch (the tool's own words at 0.36.1).
export const ROWS = ["decision-sheet", "owner-calls"];
export const FETCHED = (row) =>
  `${row}: a shallow checkout: main and the history back to where this branch left it were fetched from origin`;
export const NO_MAIN = "origin has neither main nor master";

// AC-6: every file each upgrade commit changes (git diff, renames off, against its parent).
export const UPGRADE_CHANGES = [
  "design/tool-stamp.json",
  "tools/design-assembly/adapters/css-fonts.mjs",
  "tools/design-assembly/adapters/index.mjs",
  "tools/design-assembly/adapters/lockfile.mjs",
  "tools/design-assembly/adapters/nextjs-build.mjs",
  "tools/design-assembly/adapters/playwright.mjs",
  "tools/design-assembly/adapters/react.mjs",
  "tools/design-assembly/adapters/shadcn.mjs",
  "tools/design-assembly/adapters/tailwind.mjs",
  "tools/design-assembly/adapters/vite.mjs",
  "tools/design-assembly/affected.mjs",
  "tools/design-assembly/check.mjs",
  "tools/design-assembly/color-formulas.mjs",
  "tools/design-assembly/components.mjs",
  "tools/design-assembly/contract.mjs",
  "tools/design-assembly/fonts.mjs",
  "tools/design-assembly/intake-ledger.mjs",
  "tools/design-assembly/owner-calls.mjs",
  "tools/design-assembly/probes.mjs",
  "tools/design-assembly/screen-actions-seen.d.mts",
  "tools/design-assembly/screen-actions-seen.mjs",
  "tools/design-assembly/screen-actions.mjs",
  "tools/design-assembly/screens.mjs",
  "tools/design-assembly/sources-ledger.mjs",
  "tools/design-assembly/theme.mjs",
  "tools/design-assembly/tokens.mjs",
  "tools/design-assembly/waiting.mjs",
  "wiki/log/2026-11-22-04-l-n-i-c-ng-c-design-assembly-t-0-7-1-l-n.md",
];
export const RERUN_CHANGES = [
  "design/tool-stamp.json",
  "mk/design-assembly.mk",
  "tools/design-assembly/adapters/vite.mjs",
  "tools/design-assembly/check.mjs",
  "tools/design-assembly/contract.mjs",
  "tools/design-assembly/derived.mjs",
  "tools/design-assembly/host-make.mjs",
  "tools/design-assembly/ledger.mjs",
  "tools/design-assembly/screen-facts.mjs",
  "wiki/log/2026-11-22-06-design-assembly-tool-0-33-0-0-36-1-machi.md",
];

// AC-6: what the branch as a whole may change beyond the two commits. A path ending in a slash is a
// folder; any file under it is allowed.
export const SLUG = "upgrade-design-assembly-0-33-0";
export const BRANCH_MAY_CHANGE = [
  ...UPGRADE_CHANGES,
  ...RERUN_CHANGES,
  `_acceptance/${SLUG}/`,
  `docs/superpowers/specs/2026-11-22-${SLUG}-design.md`,
  `docs/superpowers/plans/2026-11-22-${SLUG}.md`,
];
// The two pages the gate commands draw again: they may change only on segments that name this record
// (with the heading of the stage section it opens), or on the per-stage counts these patterns name.
// Only inside a count segment are digits read as a count; anywhere else a changed digit is a change.
export const DRAWN_PAGES = ["PRODUCT-MAP.md", "LO-TRINH.html"];
export const DRAWN_COUNTS = [
  /\d+ việc|chưa có/,
  /\d+ chỗ cần sửa/,
  /Cần sửa trong kế hoạch \(\d+\)/,
  /\d+ hồ sơ không thuộc kế hoạch nào/,
];
export const DRAWN_HEADINGS = /^## (Đang làm|Đã giao|Chờ duyệt phạm vi|Chờ phiên nghiệm thu)/;
