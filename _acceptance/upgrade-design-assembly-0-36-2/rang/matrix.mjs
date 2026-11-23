// The matrix written first (evals.yaml, top of file), as data every measure of this record reads.
import { homedir } from "node:os";
import path from "node:path";

export const SLUG = "upgrade-design-assembly-0-36-2";

// Where the branch left main (PR 111 merged), the upgrade commit and the rules page commit.
export const BASE = "25f847090057f37bbd5d9ac35a16f6b272878fda";
export const UPGRADE = "b5f48f65";
export const RULES_COMMIT = "326326dc";

// AC-2: the plugin release this record takes, read from the plugin's source repository at the
// merge of its PR 101. DA_REPO in the environment stands in for that repository in the break copies.
export const PLUGIN = {
  repo: () => process.env.DA_REPO ?? path.join(homedir(), "dev/design-assembly"),
  rev: "bdf2bcc2202db19351afd81b4bb4245219ffc395",
  folder: "plugins/design-assembly",
  manifest: "plugins/design-assembly/.claude-plugin/plugin.json",
  ledger: "plugins/design-assembly/references/releases.json",
  toolTemplate: "plugins/design-assembly/templates/tools/design-assembly",
  gateStep: "plugins/design-assembly/templates/mk/design-assembly.mk",
};
export const RELEASE = { version: "0.36.2", tool: "cc732f566b65eba9439469e456c814324c2ba42e", files: 44 };
export const GATE_STEP = { file: "mk/design-assembly.mk", blob: "15c4208b99e238f16a5d7b1826e66629ebf5d510" };
export const TOOL_FOLDER = "tools/design-assembly";
export const STAMP = "design/tool-stamp.json";
export const THEME = "design/theme.json";
export const LEDGER = "design/decisions.yaml";

// AC-1: what the gate says. Neither number depends on the tool version (PR 111 set them).
export const GATE = { decisions: 22, checks: 30 };
export const gateLine = ({ decisions, checks }) =>
  `design-assembly: ${decisions} decisions held by ${checks} checks, each seen failing on a changed copy`;
export const RATE = { automatic: 57, all: 69 };

// AC-3: the load of the running-text typeface, as the build's adapter reads it at 0.36.2.
export const STYLESHEET = "src/app/globals.css";
export const FONT_LOAD = { variable: "--font-sans", via: "loader", file: "src/app/layout.tsx", loader: "google" };

// AC-4: the agent rules page, its Type line as 0.36.2 writes it, and the row whose re-adoption makes
// adopt write the page on a copy.
export const RULES_PAGE = ".claude/rules/design-assembly.md";
export const TYPE_LINE =
  "- Running text is set in the typeface the font loader in src/app/layout.tsx sets as `--font-sans` and headings in `var(--font-sans)`, as `src/app/globals.css` sets them today, adopted as found: the gate holds `--font-heading` to it.";
export const OLD_TYPE_LINE_START = "- Running text is set in `undefined`";
export const READOPT_ROW = "typeface";
// The changed premise of the signed record design-assembly-adopt-checks: its E7 pinned the one known
// wrong line; on this page it is red with exactly this line, and nothing else.
export const ADOPT_RECORD = "design-assembly-adopt-checks";
export const ADOPT_E7 = ["node", `_acceptance/${ADOPT_RECORD}/rang/kiem.mjs`, "rules"];
export const ADOPT_E7_RED = "rules: 0 lines say undefined, the known defect is one";

// AC-5: adopt run again with 0.36.2 adds nothing, writes nothing and asks only the question PR 111
// already put aside (the font source row, descoped in that record's ledger).
export const ADOPT_AGAIN = {
  rows: "rows to add: 0",
  nothing: "files:\n  nothing to write",
  person: "needs a person:\n  font-source: var(--font-sans) is the repository's own font",
};

// AC-7: every file each commit changes, and what the branch as a whole may change besides.
export const UPGRADE_CHANGES = [
  "design/tool-stamp.json",
  "tools/design-assembly/adapters/css-fonts.mjs",
  "tools/design-assembly/adapters/nextjs-build.mjs",
  "wiki/log/2026-11-23-02-design-assembly-tool-0-36-1-0-36-2-upgra.md",
];
export const RULES_CHANGES = [RULES_PAGE];
export const BRANCH_MAY_CHANGE = [
  ...UPGRADE_CHANGES,
  ...RULES_CHANGES,
  `_acceptance/${SLUG}/`,
  `docs/superpowers/specs/2026-11-23-${SLUG}-design.md`,
];
// Drawn again from the acceptance records by the gate commands; not a change of this branch.
export const DRAWN_PAGES = ["PRODUCT-MAP.md", "LO-TRINH.html"];
