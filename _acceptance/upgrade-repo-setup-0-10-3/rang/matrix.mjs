// The matrix of upgrade-repo-setup-0-10-3, written before grading. Every measure reads it.
// The expected values come from the pull request's description, the tag of repo-setup and the
// state of main before the pull request, never from the measured tree itself.

export const REPO = "phanlemanh/onehub-inventory";
export const PR = 98;
// Where the branch left origin/main (the merge of PR 97), and the one commit of the upgrade.
export const BASE = "8e0a91c9868825f72fc17e2302bf55276423efab";
export const UPGRADE = "871afebba101b1140902fda456212da4e0c65426";
export const PLUGIN_REPO = "phanlemanh/repo-standards";
export const PLUGIN_TAG = "repo-setup-v0.10.3";
export const PLUGIN_COMMIT = "c5581ff15daf011c149f25330d62ebd08cca1b74";
export const OLD_VERSION = "0.10.2";
export const NEW_VERSION = "0.10.3";
export const TEMPLATE_DIR = "plugins/repo-setup/presets/_core/team";

// What apply.py does on the base, from the pull request's description.
export const CREATED = ["tools/sdlc_gh.py", "tools/sdlc_jobs.py", "tools/sdlc_limits.py", "tools/sdlc_pulls.py", "tools/sdlc_report.py"];
export const UPDATED = ["tools/autonomy.py", "tools/github_setup.py", "tools/sdlc_metrics.py"];
export const MERGED = ["AGENTS.md"];
export const MARKED = ["governance/autonomy.yaml"];
// The tool files, each the template of the same path under TEMPLATE_DIR.
export const TOOLS = [...CREATED, ...UPDATED];
export const UPGRADE_FILES = [...TOOLS, ...MERGED, ...MARKED, ".repo-setup.json"];
export const POLICY = "governance/autonomy.yaml";

// AGENTS.md loses one sentence (the line keeps its start).
export const AGENTS_BEFORE = "  on your own. The gate sees both and raises the tier.";
export const AGENTS_AFTER = "  on your own.";

// The hand resolution of the marked block: the side of repo-setup 0.10.3, with one line changed.
export const TEMPLATE_MERGE_LINE = "merge_method: squash";
export const RESOLVED_MERGE_LINE = "merge_method: merge";
// The keys the resolution adds, and what they name: nothing.
export const ADDED_KEYS = { proof: { check: "" }, required_checks: [], merge_method: "merge" };

// Besides the upgrade, the pull request may change only the files of its acceptance round.
export const DOSSIER = "_acceptance/upgrade-repo-setup-0-10-3/";
export const ROUND_FILES = ["_acceptance/config.yaml", "PRODUCT-MAP.md", "LO-TRINH.html"];
// Paths the pull request must not touch besides the policy file.
export const UNTOUCHED = [".github/", ".pre-commit-config.yaml", "tools/commit_msg.py", "governance/autonomy.yaml.local"];

// .repo-setup.json: 85 + 5 files at the new version, the 8 deleted samples at 0.4.0.
export const NEW_COUNT = 90;
export const KEPT_OLD = {
  "src/greet.ts": "0.4.0",
  "src/index.ts": "0.4.0",
  "src/modules/loyalty/index.ts": "0.4.0",
  "src/modules/sales/index.ts": "0.4.0",
  "src/modules/sales/pricing.ts": "0.4.0",
  "tests/greet.test.ts": "0.4.0",
  "tests/modules.test.ts": "0.4.0",
  "tsconfig.build.json": "0.4.0",
};
// apply.py on the base: files edited here and left alone (HEAD adds AGENTS.md and the policy).
export const EDITED_AT_BASE = 30;

// github_setup.py: what the merge step says, by merge method.
export const MERGE_TITLE = "merge commits only";
export const SQUASH_TITLE = "squash-only merges";
export const KEEP_TITLE = "merge method left as it is";
export const REFUSED_EXIT = 2;
// The ruleset the dry run would set today (unchanged by the upgrade), and what GitHub requires.
export const PLANNED_CHECKS = ["check", "secret-scan", "conventional-title", "conventional-commits"];
export const RULESET_CHECKS = ["check", "e2e", "gate"];
// The rulesets of the repository today, the name github_setup.py gives its own, and whether main's
// pull request rule requires a code owner's review (read 2026-11-21, recorded, not changed here).
export const RULESET_NAMES = ["main"];
export const SETUP_RULESET = "repo-setup: protect default branch";
export const CODE_OWNER_REVIEW = false;

// The flow measure: its files, and what it may read and write.
export const FLOW_TOOLS = ["tools/sdlc_metrics.py", ...CREATED];
