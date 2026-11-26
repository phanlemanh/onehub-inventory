// The matrix written first (evals.yaml, top of file), as data every measure of this record reads.

// Where the branch left main, and the commit that upgraded the tool on top of it.
export const BASE = "8925e8fffc776534c5388ced3fea36ac2a1345f6";
export const UPGRADE = "8d64f79c9bac30497ed46a5e242a56eef9909865";
// The local main of this machine when the record opened, 16 commits behind BASE: the base a clone
// would get from ci-thu.sh's origin, and the break of the shallow measures.
export const OLD_MAIN = "ea774a0f55a5cda763e63f3f61051fd5a98805ba";

// AC-5: the plugin version the upgrade brought in, and the ids git gives what that version hands a
// repository, as the plugin records them (references/releases.json, field `tool`) and as its
// template folder has them at the commit of the plugin's main the upgrade ran from.
export const RELEASE = {
  version: "0.7.1",
  tool: "2da4cc56de55b9805b50baf46731151f12428f63",
  files: 34,
};
export const PLUGIN_SOURCE = {
  commit: "ba3af6b090bb4a0922ff16f708220e9ff0bc57e6",
  ledger: "plugins/design-assembly/references/releases.json",
  toolTemplate: "plugins/design-assembly/templates/tools/design-assembly",
  gateStep: "plugins/design-assembly/templates/mk/design-assembly.mk",
};
// The gate step the repository already had from the 0.7.0 upgrade; 0.7.1 leaves it as it was.
export const GATE_STEP = { file: "mk/design-assembly.mk", blob: "d67aeb30023e8ce4e0583979387c8078653ff3a3" };

export const TOOL_FOLDER = "tools/design-assembly";
export const STAMP = "design/tool-stamp.json";

// AC-1, AC-2: what the gate and make check say at HEAD, and what the gate says where the branch left main.
export const GATE = { decisions: 19, checks: 27 };
export const BASE_GATE = { decisions: 17, checks: 25 };
export const gateLine = ({ decisions, checks }) =>
  `design-assembly: ${decisions} decisions held by ${checks} checks, each seen failing on a changed copy`;
export const TESTS = { passed: 2460, skipped: 2 };
export const COMPONENTS = 294;
export const manifestLine = (count) =>
  `component manifest: design/component-registry.json is up to date (${count} components)`;

// AC-3: the two rows of this upgrade, and the note each prints when a shallow clone fetched main itself.
export const ROWS = ["decision-sheet", "owner-calls"];
export const FETCHED = (row) =>
  `${row}, debt: a shallow checkout: main and the history back to where this branch left it were fetched from origin`;
export const NO_MAIN = "no main branch to compare with";

// AC-4: the two bites, and the tags the fixtures of BASE held.
export const NEW_PAGE = {
  file: "design/patterns/trang-moi.md",
  line: "pattern:trang-moi: a new kind of screen (trang-moi) is the owner's call",
};
export const UNTOLD_TAG = {
  file: "tests/the-thu.test.ts",
  text: '// decision:khong-co-hang\nimport { it } from "vitest";\n\nit("holds", () => {});\n',
  line: "decision:khong-co-hang: tests/the-thu.test.ts proves it, and the ledger has no row for it",
};
export const FIXTURE_FILE = "tests/design-check.test.ts";
export const BASE_FIXTURE_TAGS = ["decision:a", "decision:other", "decision:a-b"];

// AC-8: every file the upgrade commit changes (git diff, renames off, BASE to UPGRADE).
export const UPGRADE_CHANGES = [
  "design/decisions.yaml",
  "design/theme.json",
  "design/tool-stamp.json",
  "tests/ci-ban-sao-nong.test.ts",
  "tests/design-check.test.ts",
  "tools/design-assembly/owner-calls.mjs",
];

// AC-8: what the branch as a whole may change beyond the upgrade commit. A path ending in a slash
// is a folder; any file under it is allowed.
export const BRANCH_MAY_CHANGE = [
  ...UPGRADE_CHANGES,
  "_acceptance/upgrade-design-assembly-0-7-1/",
  "_acceptance/config.yaml",
  "docs/superpowers/specs/2026-11-18-upgrade-design-assembly-0-7-1-design.md",
  "docs/superpowers/plans/2026-11-18-upgrade-design-assembly-0-7-1.md",
  "wiki/log.md",
  "PRODUCT-MAP.md",
  "LO-TRINH.html",
];
