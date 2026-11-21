// Data of the measures of roadmap-merge-driver, written before the measures. Every measure reads it;
// two-way.mjs breaks one thing at a time and expects the pinned message of the measure that guards it.

export const PAGE = "LO-TRINH.html";
export const MAP = "PRODUCT-MAP.md";
export const ATTR_FILE = ".gitattributes";
export const MAP_LINE = `${MAP} merge=generated-file`;
export const ATTR_LINE = `${PAGE} merge=generated-file`;
export const DRIVER_KEY = "merge.generated-file.driver";
export const DRIVER_CMD = `git config ${DRIVER_KEY} true`;
export const CHECK_CMD = `git config --get ${DRIVER_KEY}`;

// AC-1: what `git check-attr merge` answers, path by path.
export const ATTRS = [
  [PAGE, "generated-file"],
  [MAP, "generated-file"],
  ["wiki/log.md", "union"],
  ["README.md", "unspecified"],
  ["package.json", "unspecified"],
];

// AC-2: the merges, main into the branch. `attr` is the .gitattributes of both sides: "tree" is the
// file under test, "control" the same file without ATTR_LINE. Case 9 gives each side its own.
// change: who rewrites the file. expect: clean-branch | clean-main | clean-both | conflict.
export const GOP = [
  { n: 1, attr: "tree", driver: true, file: PAGE, change: "both", expect: "clean-branch" },
  { n: 2, attr: "tree", driver: true, file: MAP, change: "both", expect: "clean-branch" },
  { n: 3, attr: "tree", driver: true, file: "docs/note.md", change: "both", expect: "conflict" },
  { n: 4, attr: "tree", driver: false, file: PAGE, change: "both", expect: "conflict" },
  { n: 5, attr: "control", driver: true, file: PAGE, change: "both", expect: "conflict" },
  { n: 6, attr: "control", driver: true, file: MAP, change: "both", expect: "clean-branch" },
  { n: 7, attr: "tree", driver: true, file: PAGE, change: "main", expect: "clean-main" },
  { n: 8, attr: "tree", driver: true, file: "wiki/log.md", change: "append", expect: "clean-both" },
  { n: 9, attr: "control", mainAttr: "tree", driver: true, file: PAGE, change: "both", expect: "conflict" },
];

// AC-4: the setup section of the tour.
export const TOUR = "docs/START-HERE.md";
export const SECTION_TITLE = "## Gộp nhánh chính và tệp máy sinh";
export const SETUP_CMD = "make setup";
export const LIMIT_GITHUB = "GitHub không chạy driver của máy";
export const LIMIT_OLD_BRANCH = "Nhánh mở trước khi dòng của `LO-TRINH.html` lên nhánh chính";
export const REDRAW_KEY = "product_map"; // executors.script.<key> of _acceptance/config.yaml, minus --check

// AC-5: the decision page.
export const DECISION = "wiki/decisions/0046-repo-setup-upgrades-per-milestone.md";
export const DECISION_SECTIONS = ["Status", "Context", "Decision", "Consequences"];
export const DECISION_STATUS = "Accepted, 2026-11-21";
export const OWNER_SENTENCE = "gom theo mốc, trừ bản vá chữa lỗi kho đang vấp";
export const MILESTONE_SENTENCE = "Mốc là lần kho này nhận một mốc của kit nghiệm thu";
export const TIERS_UNCHANGED = "`risk_tiers` không đổi";
export const UPGRADES = [
  { version: "0.9.0", slug: "upgrade-repo-setup-0-9-0", tier: "T3" },
  { version: "0.10.1", slug: "upgrade-repo-setup-0-10-1", tier: "T2" },
  { version: "0.10.2", slug: "upgrade-repo-setup-0-10-2", tier: "T3" },
  { version: "0.10.3", slug: "upgrade-repo-setup-0-10-3", tier: "T3" },
];

// AC-6: the CodeQL scope.
export const WORKFLOW = ".github/workflows/security.yml";
export const PATTERN = "_acceptance/**/rang/**";
export const PATCH_ANCHOR = "          languages: javascript-typescript";
export const PATCH_LINES = [
  "          # The measures of an acceptance record run only when a round is graded; they are not shipped.",
  "          config: |",
  "            paths-ignore:",
  `              - "${PATTERN}"`,
];
export const ALERT_FILES = [
  "_acceptance/upgrade-repo-setup-0-9-0/rang/lib.mjs", // alert 9
  "_acceptance/upgrade-repo-setup-0-10-1/rang/lib.mjs", // alert 12
  "_acceptance/commit-msg-kit-subjects/rang/lib.mjs", // alert 15
  "_acceptance/upgrade-repo-setup-0-10-2/rang/lib.mjs", // alert 16
];
// Who could run a measure outside a grading round. `optional` entries may match no file.
export const BEN_GOI = [
  { glob: ".github/workflows/**" },
  { glob: "Makefile" },
  { glob: "mk/**" },
  { glob: "package.json" },
  { glob: ".pre-commit-config.yaml" },
  { glob: "src/**" },
  { glob: "tests/**" },
  { glob: "tools/**" },
  { glob: "db/**" },
];
export const MEASURE_PATH = /_acceptance\/[^\s'"`)]*\/rang\//;

// AC-7: the files the branch may change. A trailing ** covers a folder.
export const SLUG = "roadmap-merge-driver";
export const CONFIG = "_acceptance/config.yaml";
export const ROUND_FILES = [
  ATTR_FILE,
  TOUR,
  DECISION,
  "wiki/index.md", // the hand-kept index links every decision page (AGENTS.md); ledger line of S3
  "wiki/log/**",
  WORKFLOW,
  `docs/superpowers/specs/2026-11-21-${SLUG}-design.md`,
  `docs/superpowers/plans/2026-11-21-${SLUG}.md`,
  `_acceptance/${SLUG}/**`,
  CONFIG,
  MAP,
  PAGE,
];
export const FENCED = ["governance/", ".claude/", "tools/", "mk/", "Makefile", "package.json", ".github/"];
export const CONFIG_ADDED = /^ {4}rmd_[a-z_]+: /;
