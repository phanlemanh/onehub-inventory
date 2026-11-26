// The matrix of upgrade-repo-setup-0-10-2, written before grading. Every measure reads it.
// The expected values come from the pull request's description, the tag of repo-setup and the
// state of main before the pull request, never from the measured tree itself.

export const REPO = "phanlemanh/onehub-inventory";
export const PR = 95;
// Where the branch left origin/main (the merge of PR 94), and the one commit of the upgrade.
export const BASE = "f2a49b491e27de3e50a1c3b883b987a97ead16e1";
export const UPGRADE = "dbe08dca536b8cdb985f421edc1f765a6823af97";
export const PLUGIN_REPO = "phanlemanh/repo-standards";
export const PLUGIN_TAG = "repo-setup-v0.10.2";
export const PLUGIN_COMMIT = "2f8f1415742242b1268c136079ea3da31d03c533";
export const OLD_VERSION = "0.10.1";
export const NEW_VERSION = "0.10.2";
export const TEMPLATE_DIR = "plugins/repo-setup/presets/_core/team";

// The files the upgrade writes, each with its template in the tag (under TEMPLATE_DIR).
export const UPDATED = {
  ".github/workflows/pr-title.yml": "dot.github/workflows/pr-title.yml",
  "tools/autonomy.py": "tools/autonomy.py",
  "tools/github_setup.py": "tools/github_setup.py",
};
export const UPGRADE_FILES = [...Object.keys(UPDATED), ".repo-setup.json"];

// Besides the upgrade, the pull request may change only the files of its acceptance round.
export const DOSSIER = "_acceptance/upgrade-repo-setup-0-10-2/";
export const ROUND_FILES = ["_acceptance/config.yaml", "PRODUCT-MAP.md", "LO-TRINH.html"];
// Paths the pull request must not touch: the policy is the owner's, the hook's wiring stays.
export const UNTOUCHED = ["governance/", ".pre-commit-config.yaml", "tools/commit_msg.py"];

// .repo-setup.json: the files whose recorded hash changes, and the files that keep an older version
// because the samples they name were deleted from the tree long ago (as in 0.10.1).
export const HASH_CHANGED = Object.keys(UPDATED);
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
// apply.py counts of the pull request's description: files edited here and left alone.
export const EDITED_COUNT = 32;

// The conventional-commits job. Its step 2 is run here as it is, with stand-ins for `gh` and the
// runner, and pre-commit from uvx in place of `pipx run`.
export const STEP_START = "keeps=$(gh repo view";
// Lines planted in commit messages: each would be a workflow command if it reached the runner.
export const PLANTED = ["::error::planted-subject", "::warning::planted-body", "::add-mask::planted-mask"];
// Messages and what the hooks of the tree answer (0 accepted, 1 refused). The base answers the same.
export const ANSWERS = [
  { name: "the upgrade commit", from: UPGRADE, want: 0 },
  { name: "update stuff", message: "update stuff\n", want: 1 },
  { name: "a Gate 2 signoff subject", message: "Gate 2 signoff: vi-du-ho-so — [Tên]\n", want: 0 },
  { name: "wip(dan-tu-excel)", message: "wip(dan-tu-excel): paste path\n", want: 1 },
  {
    name: "a refusal with a body like an error of pre-commit (the hooks do not print it back; fence.mjs covers that path)",
    message: "update stuff\n\nAn error has occurred: FatalError: planted\n",
    want: 1,
  },
  { name: "an accepted commit with a planted body", message: "fix: a\n\n::warning::planted-body\n", want: 0 },
];
export const NO_HOOK_ERROR = "No hook of this repository refuses a message at commit-msg";
export const CANNOT_RUN_ERROR = "pre-commit could not run in this repository, so the commits were not judged";
export const NO_FENCE_ERROR = "What the commit-msg hooks printed could not be shown safely";

// The run of PR 95's conventional-commits job on GitHub, before any change of the round: the job of
// the base ran (pull_request_target), not the job of the pull request.
export const PR_RUN = { run: 44709236514, job: 136196394717, head: UPGRADE };

// Checks named in the policy, on a copy (the real governance/autonomy.yaml is not changed).
export const OWN_EVERYWHERE = ["check", "secret-scan"];
export const AGENT_CHECK = "gate";
export const AGENT_WORKFLOW = ".github/workflows/pr-pipeline.yml";
