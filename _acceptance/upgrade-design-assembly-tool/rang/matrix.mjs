// The matrix written first (evals.yaml, top of file), as data every measure of this record reads.

// The commit of this repository's main the branch was cut from, and the commit that ran the
// plugin's upgrade on top of it.
export const BASE = "b6f4f2934b4bdc5d0625755bb59efacb6448f284";
export const UPGRADE = "158cf51";

// The version of the design-assembly plugin the upgrade brought in, and the id git gives the tool
// folder that version hands a repository, as the plugin records it in
// plugins/design-assembly/references/releases.json (field `tool`).
export const RELEASE = {
  version: "0.1.0",
  tool: "4f5d879929427743a4d10ea5aafc435afd0e1034",
  files: 27,
};

// Where the value above comes from: the release ledger of the plugin's own repository, at the
// commit of its main the upgrade ran from. release-ledger.mjs reads it there.
export const PLUGIN_SOURCE = {
  commit: "34a7938a84b9f5628bcf9e2f4fec2ee6a4a3dd77",
  ledger: "plugins/design-assembly/references/releases.json",
};

export const TOOL_FOLDER = "tools/design-assembly";
export const REGISTRY = "design/component-registry.json";
export const STAMP = "design/tool-stamp.json";

// AC-3: the parts the register gains, by component, and nothing else.
export const ADDED_PARTS = {
  Filters: ["FiltersAdvanced"],
  FiltersRow: ["FilterChip", "FiltersBuilder"],
};

// AC-4: every file the upgrade commit changes.
export const UPGRADE_CHANGES = [
  REGISTRY,
  STAMP,
  "tools/design-assembly/adapters/eslint.mjs",
  "tools/design-assembly/check.mjs",
  "tools/design-assembly/columns.mjs",
  "tools/design-assembly/components.mjs",
  "tools/design-assembly/lint.mjs",
  "tools/design-assembly/tokens.mjs",
];

// AC-6: what the branch as a whole may change, against where it left main. A path ending in a slash
// is a folder; any file under it is allowed.
export const BRANCH_MAY_CHANGE = [
  ...UPGRADE_CHANGES,
  "_acceptance/upgrade-design-assembly-tool/",
  "_acceptance/config.yaml",
  "docs/superpowers/specs/2026-11-16-upgrade-design-assembly-tool-design.md",
  "docs/superpowers/plans/2026-11-16-upgrade-design-assembly-tool.md",
  "wiki/log.md",
  "PRODUCT-MAP.md",
  "LO-TRINH.html",
];
