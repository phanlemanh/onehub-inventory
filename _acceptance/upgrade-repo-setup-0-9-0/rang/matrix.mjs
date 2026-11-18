// The matrix of upgrade-repo-setup-0-9-0, written before grading. Every measure reads it.
// The groups of the 46 files come from the apply.py report on BASE and the hand-edit list below,
// never from the diff itself.

export const REPO = "phanlemanh/onehub-inventory";
export const PR = 88;
export const BASE = "bd32d73e7f59ada71ff13185250933783b08334c";
export const RENAME = "a9acfe7762b42f66b1c36bedf85464332af94e99";
export const UPGRADE = "fd53ac960bf6bc0247caa0f4b015b52541c00f36";
// After Gate 1, the owner's answer to Hoi-1 (split): e2e-db out of the needs of check. The first CI run
// of the decided ci.yml is on this commit.
export const CI_COMMIT = "0deb79befe9931c6d4ea88969496de2ce012107f";
// main moved (PR 87, delivery-loop v3.0.0) and was merged into the branch: the base the rules are
// compared with, and the commit of the first full CI run on it.
export const MAIN = "47d52b06c6dfcfc61bc0225666023c66cf3b514e";
export const RUN_COMMIT = "2109c27dc1edf47075d174fd3fa06232480c9ad5";
export const CI_COMMIT_FILES = [".github/workflows/ci.yml", "tests/ci-yml-patch.test.ts"];
export const PLUGIN_REPO = "phanlemanh/repo-standards";
export const PLUGIN_TAG = "repo-setup-v0.9.0";

// make check on HEAD.
export const CHECK_PASSED =
  "make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance";
export const TESTS_LINE = "Tests  2464 passed | 2 skipped (2466)";
export const DA_LINE = "design-assembly: 19 decisions held by 27 checks, each seen failing on a changed copy";

// apply.py --dry-run --json on BASE: 12 marked, one conflict.
export const BASE_MARKED = 12;
export const BASE_CONFLICT = ["mk/derived.mk"];

// Rule files kept as at BASE, byte for byte.
export const KEPT = [
  "governance/autonomy.yaml",
  "tools/ontology_actions.py",
  "tools/boundaries.py",
  "ontology/relations.yaml",
];
export const CODEOWNERS_LINE = 3; // 1-based: the one comment line the new generator words differently
export const RULESET_CHECKS = ["check", "e2e", "gate"];

// ci.yml.
export const JOBS = ["quick", "e2e", "e2e-db", "check", "gate"];
export const HEAVY = ["e2e", "e2e-db"];
export const CHECK_NEEDS = ["quick", "e2e"]; // Hoi-1: split, e2e-db does not hold check
export const REUSED = ["e2e"];
export const DRAFT_IF = "github.event_name != 'pull_request' || !github.event.pull_request.draft";
export const STATES = ["success", "skipped", "failure", "cancelled"];
// What ci_verdict.py prints for a tier that is not success, by its documented rule: a skipped
// tier beside tiers that all passed is a draft; beside one that did not pass, it was held back.
export const PHRASE = {
  failure: "failed",
  cancelled: "cancelled",
  skippedDraft: "the pull request is a draft",
  skippedBehind: "a tier it waits for did not pass",
};
export const HEAVY_NOT_INPUTS = ["docs/**", "wiki/**", "*.md", "_acceptance/**"];

// gitleaks.
export const LEAKS_BASE = 12; // with the old allowlist, over the history up to BASE (it never changes)
export const LEAK_RULE = "generic-api-key";
export const LEAK_PATH = /^_acceptance\/[^/]+\/s4-args[^/]*\.json$/;

// Ledgers.
export const LEDGERS = ["log", "index", "glossary", "gen"];
export const GEN_OUT = "src/generated/ontology.ts";

// The 46 files of BASE..UPGRADE, by group, with their counts.
export const HAND = [
  ".gitleaks.toml",
  "mk/design-role-table.mk",
  "tests/ci-ban-sao-nong.test.ts",
  "tests/ci-yml-patch.test.ts",
  "tests/coverage-matrix.test.ts",
];
export const GROUP_COUNTS = {
  manifest: 1,
  created: 14,
  conflict: 1,
  updated: 10,
  merged: 6,
  marked: 9,
  hand: 5,
};
export const TOTAL = 46;
// After UPGRADE, only these change.
export const AFTER_ALLOWED = [/^_acceptance\/upgrade-repo-setup-0-9-0\//, /^_acceptance\/config\.yaml$/, /^PRODUCT-MAP\.md$/, /^LO-TRINH\.html$/];
