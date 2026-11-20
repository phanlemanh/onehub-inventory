// The matrix of upgrade-repo-setup-0-10-1, written before grading. Every measure reads it.
// The expected values come from the pull request's description and the tag of repo-setup, never
// from the measured tree itself.

export const REPO = "phanlemanh/onehub-inventory";
export const PR = 93;
// Where the branch left origin/main, and the two commits of the upgrade.
export const BASE = "1ad8469fb35e70e5ffb33de52b79028c667eafaf";
export const UPGRADE = "238099bbbf160a0e175da5900483a16caa7b7b55";
export const LOG = "10f4e6fbf086b5fc417ce1233bfb2da1d4da7248";
export const PLUGIN_REPO = "phanlemanh/repo-standards";
export const PLUGIN_TAG = "repo-setup-v0.10.1";
export const OLD_VERSION = "0.9.0";
export const NEW_VERSION = "0.10.1";
export const TEMPLATE = "plugins/repo-setup/presets/_core/team/dot.github/workflows/pr-title.yml";

// The commit that upgrades changes exactly these files; the commit that logs it, one file under wiki/log/.
export const UPGRADE_FILES = [".github/workflows/pr-title.yml", ".repo-setup.json", "AGENTS.md"];
export const LOG_FILE = "wiki/log/2026-11-20-01-n-ng-repo-setup-t-0-9-0-l-n-0-10-1-b-ng.md";

// Besides the four files, the pull request may change only the files of its acceptance round.
export const DOSSIER = "_acceptance/upgrade-repo-setup-0-10-1/";
export const ROUND_FILES = ["_acceptance/config.yaml", "PRODUCT-MAP.md", "LO-TRINH.html"];

// .repo-setup.json: the files whose recorded hash changes, the one entry it adds, and the files
// that keep an older version because the samples they name were deleted from the tree long ago.
export const HASH_CHANGED = [".github/workflows/pr-title.yml", "AGENTS.md"];
export const HASH_ADDED = ["wiki/log.head.md"];
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

// AGENTS.md: the lines the tool removed and the lines it added, in order. Copied from the PR's diff;
// their source outside the tree is AC-2, where the tag applied to a copy of the base must write
// this AGENTS.md byte for byte.
export const AGENTS_REMOVED = [
  "- Never commit secrets or `.env`. Configuration goes in `.env.example`.",
  "- Follow the page formats in `ontology/page-types.yaml`. Link to code paths,",
  "  do not paste code into the wiki.",
];
export const AGENTS_ADDED = [
  "- Never commit secrets.",
  "- Never commit `.env`. Configuration goes in `.env.example`.",
  "- Follow the page formats in `ontology/page-types.yaml`.",
  "- Link to code paths, do not paste code into the wiki.",
  "",
  "## What holds these rules",
  "",
  "A machine catches a miss of these:",
  "",
  "- a secret in a commit: `secret-scan` goes red (GitHub)",
  "- commit format: `conventional-title` or `conventional-commits` goes red (GitHub)",
  "- a wiki page that breaks its page format: `make check` goes red",
  "- a module reaching past another module's public API: `make check` goes red",
  "",
  "Nothing listed here covers the other rules in this file. Do not count on a machine to catch a",
  "miss: keeping them is on you.",
];

// The conventional-commits job, run here with this repository's own hook (tools/commit_msg.py).
export const OLD_HOOK_ID = "conventional-pre-commit";
export const OLD_HOOK_ERROR = "No hook with id `conventional-pre-commit` in stage `commit-msg`";
export const REFUSED_MESSAGE = "update stuff\n";
// Read from .pre-commit-config.yaml: hooks with no `stages` of their own run at every stage, so
// pre-commit runs these at commit-msg (most skip: no file to check). Only commit-message judges.
export const HOOKS_AT_COMMIT_MSG = [
  "check-yaml",
  "check-json",
  "check-toml",
  "check-merge-conflict",
  "detect-private-key",
  "gitleaks",
  "lint",
  "commit-message",
];
// The subjects the kit writes itself (signoff command, repin lane), as found on main.
export const KIT_SUBJECTS = ["Gate 2 signoff: x — [Tên]", "repin(x): re-pin after merging main"];
// Counted on main when the contract was written (git log of the base, no merges, since MAIN_SINCE).
export const MAIN_SINCE = "2026-11-01";
export const MAIN_REFUSED = { "Gate 2 signoff": 7, repin: 5, wip: 1 };
// The ruleset of main (the brief of the round, and the 0.9.0 dossier).
export const REQUIRED_CHECKS = ["check", "e2e", "gate"];
export const NO_HOOK_ERROR = "No hook of this repository refuses a message at commit-msg";
export const CANNOT_RUN_ERROR = "pre-commit could not run in this repository, so the commits were not judged";
