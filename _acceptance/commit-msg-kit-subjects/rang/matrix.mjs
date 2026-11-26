// The matrix of commit-msg-kit-subjects, written before the change. Every measure reads it.

/** main when the dossier was opened (the merge of PR 93); the measures read the base as merge-base HEAD origin/main. */
export const BASE = "499ee2cf2a2d037b4946ba3bbee5f29cae21eecc";
export const KIT_TAG = "v3.0.0";

/**
 * Every commit subject the kit at KIT_TAG writes into the repository by itself: the file of the kit (relative to the
 * delivery-loop install, `<plugin>/<version>/...`), the template exactly as the file writes it, and one message built
 * from it with sample values. A placeholder is <...> in a command file and ${...} in a script.
 */
export const KIT_SUBJECTS = [
  {
    file: "acceptance-gate/3.0.0/commands/signoff.md",
    template: "Gate 2 signoff: <slug> — <name>",
    sample: "Gate 2 signoff: vi-du-ho-so — [Tên]",
  },
  {
    file: "acceptance-gate/3.0.0/commands/signoff.md",
    template: "Veto: <slug> — <tên>",
    sample: "Veto: vi-du-ho-so — [Tên]",
  },
  {
    file: "acceptance-gate/3.0.0/commands/signoff.md",
    template: "repin(<slug>): ghim lại sau chữ ký",
    sample: "repin(vi-du-ho-so): ghim lại sau chữ ký",
  },
  {
    file: "acceptance-gate/3.0.0/scripts/tri-thuc-ghi.mjs",
    template: "tri-thuc: ghi ${ten} (${loai})",
    sample: "tri-thuc: ghi vi-du-ho-so (tep-may)",
  },
  {
    file: "acceptance-gate/3.0.0/scripts/design-floor-s3.mjs",
    template: "design-floor S3: autofix ${nSua} tệp, sinh lại ${lenh.length} lệnh — ${slug}",
    sample: "design-floor S3: autofix 2 tệp, sinh lại 1 lệnh — vi-du-ho-so",
  },
  {
    file: "dispatch/3.0.0/scripts/ban-giao.mjs",
    template: "wip(ban-giao): ${wip.trim()}",
    sample: "wip(ban-giao): dừng giữa bước 3",
  },
  {
    file: "dispatch/3.0.0/scripts/hook-het-han-muc.mjs",
    template: "wip(ban-giao): lưới cuối — rate_limit ${luc}",
    sample: "wip(ban-giao): lưới cuối — rate_limit 2026-11-20T05:00:00Z",
  },
];

/**
 * The scripts of the kit that commit with a message they write (any `commit` call with -m, -qm, -am, -F or --message
 * and a fixed or template message, or commitWip(<dir>, `…`)): the scan must find these only, besides KIT_SCRATCH.
 */
export const KIT_COMMITTING_SCRIPTS = [
  "acceptance-gate/3.0.0/scripts/design-floor-s3.mjs",
  "acceptance-gate/3.0.0/scripts/tri-thuc-ghi.mjs",
  "dispatch/3.0.0/scripts/ban-giao.mjs",
  "dispatch/3.0.0/scripts/hook-het-han-muc.mjs",
];

/** Scripts of the kit that commit only inside a scratch repository they create, never into the user's repository. */
export const KIT_SCRATCH = {
  "acceptance-gate/3.0.0/scripts/kiem-ban-cai.mjs": "builds a sample repository in a temp dir to check an install",
};

/**
 * What the kit's markdown files tell an agent to commit (`git commit -m "…"` or commit `…`): the subject templates of
 * KIT_SUBJECTS that live in a command or skill, plus these mentions that name a file, not a subject.
 */
export const KIT_DOC_NOT_SUBJECTS = { "index.md": "acceptance-gate/3.0.0/skills/acceptance/references/tri-thuc-template.md" };

/**
 * Near misses: each must stay refused. The two probes are the ones the conventional-commits job sends first; the last
 * three put a kit subject on a line after the first, or the first after a comment line.
 */
export const NEAR_MISSES = [
  ".",
  ".".repeat(300),
  "",
  "Gate 2 signoff:",
  "Gate 2 signoff: ",
  "gate 2 signoff: vi-du-ho-so — [Tên]",
  "Gate 1 signoff: vi-du-ho-so — [Tên]",
  "Gate 2 signoff vi-du-ho-so",
  "Veto:",
  "Veto vi-du-ho-so",
  "veto: vi-du-ho-so — [Tên]",
  "repin: ghim lại",
  "repin(): ghim lại",
  "repin(vi-du-ho-so):",
  "repin(vi du): ghim lại",
  "wip: dừng giữa bước 3",
  "wip(dan-tu-excel): paste path",
  "wip(ban-giao):",
  "WIP(ban-giao): dừng",
  "update stuff",
  "Gate 2 signoff:x",
  "Veto:x",
  "repin(vi-du-ho-so):ghim lại",
  " Gate 2 signoff: vi-du-ho-so — [Tên]",
  "Gate 2 signoff:\u00a0vi-du-ho-so — [Tên]",
  "Gate 2 signoff: vi-du-ho-so",
  "Veto: lol",
  "repin(Vi-Du): ghim lại",
  "repin(../x): ghim lại",
  "update stuff\n\nGate 2 signoff: vi-du-ho-so — [Tên]",
  "# Gate 2 signoff: vi-du-ho-so — [Tên]\nupdate stuff",
  "update stuff\nrepin(vi-du-ho-so): ghim lại",
];

/** The cases tests/commit-msg.test.ts adds; every case it has on the base stays as it is. */
export const TEST_NEW_OK = [
  "Gate 2 signoff: vi-du-ho-so — [Tên]",
  "Veto: vi-du-ho-so — [Tên]",
  "repin(vi-du-ho-so): ghim lại sau chữ ký",
  "wip(ban-giao): dừng giữa bước 3",
];
export const TEST_NEW_BAD = [
  "Gate 2 signoff:",
  "Veto: lol",
  "repin(): ghim lại",
  "wip: dừng",
  "wip(dan-tu-excel): paste path",
  "update stuff\n\nGate 2 signoff: vi-du-ho-so — [Tên]",
];

/** Over every non-merge commit of BASE (fixed): what the new rule changes against tools/commit_msg.py of BASE. */
export const HISTORY = {
  total: 1393,
  newlyAccepted: { "Gate 2 signoff": 7, repin: 5 },
  newlyRefused: 0,
  stillRefused: ["wip(dan-tu-excel): paste path from the clickable preview"],
};

/** The hooks pre-commit runs at the commit-msg stage in a clean checkout, in order (as in upgrade-repo-setup-0-10-1). */
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

/** The files this change may touch besides this dossier and the round's own files. */
export const CHANGE_FILES = ["tools/commit_msg.py", "tests/commit-msg.test.ts"];
export const CHANGE_GLOBS = ["wiki/log/**"];
export const DOSSIER = "_acceptance/commit-msg-kit-subjects/";
export const ROUND_FILES = ["_acceptance/config.yaml", "PRODUCT-MAP.md", "LO-TRINH.html"];
/** Paths this change must not touch: the hook's wiring and the job that runs it. */
export const UNTOUCHED = [".pre-commit-config.yaml", ".github/**", "governance/**"];
