// The matrix written first (evals.yaml, top of file), as data every measure of this record reads.

// Where the branch left main, and the commit that upgraded the tool on top of it.
export const BASE = "692530329a09e368caea58f335ed648122a9dfba";
export const UPGRADE = "ec2c4597c9260043b93315888a884c3e204321c0";

// AC-3: the plugin version the upgrade brought in, and the ids git gives what that version hands a
// repository, as the plugin records them (references/releases.json, field `tool`) and as its
// template folder has them at the commit of the plugin's main the upgrade ran from.
export const RELEASE = {
  version: "0.7.0",
  tool: "f3d66a61fdcfbdfca103d48c7077bd1c9b95bb73",
  files: 34,
};
export const PLUGIN_SOURCE = {
  commit: "93daea48bf27b4b3cc629859eb5b74b805642a94",
  ledger: "plugins/design-assembly/references/releases.json",
  toolTemplate: "plugins/design-assembly/templates/tools/design-assembly",
  gateStep: "plugins/design-assembly/templates/mk/design-assembly.mk",
};
// The gate step copied by hand from the plugin's template (upgrade does not write it).
export const GATE_STEP = { file: "mk/design-assembly.mk", blob: "d67aeb30023e8ce4e0583979387c8078653ff3a3" };

export const TOOL_FOLDER = "tools/design-assembly";
export const STAMP = "design/tool-stamp.json";

// AC-4: the four derived files, written again before anything reads them, never in git.
export const DERIVED = [
  "design/component-registry.json",
  "design/screens.yaml",
  "design/role-screen-buttons.md",
  "design/intake.yaml",
];
// The two old names, gone from the tree.
export const OLD_NAMES = ["design/so-khoi.yaml", "design/vai-man-nut.md"];
// The fragment folders, each with _shared.yaml beside one file per entry.
export const FRAGMENTS = {
  screens: { folder: "design/screens", entries: 9, old: "design/screens.yaml", list: "screens", id: "id" },
  intake: { folder: "design/intake", entries: 23, old: "design/so-khoi.yaml", list: "khoi", id: "nhu_cau" },
};
// Readers of the repository's own that may still name an old path: the proof gate's history list
// (legacy.py reads the law's day from every path the ledger had) and a comment of the ledger itself.
// Records, plans, docs and wiki bodies are history and are not searched.
export const OLD_NAME_ALLOWED = ["tools/proof_gate/legacy.py", "design/intake/_shared.yaml"];
export const READER_SEARCH = [".", ":(exclude)_acceptance/**", ":(exclude)docs/**", ":(exclude)wiki/**"];

// AC-7: affected over the last merges of main, with the 0.7.0 tool and the map of HEAD.
// Narrowed means fewer than all: here every narrowed merge touched files the map declares reach no
// screen, so it gets none; no merge got some screens and not others.
export const AFFECTED = { merges: 30, all: 26, some: 0, none: 4, missing: 0 };

// AC-8: the proof gate with the fragment folders alone.
export const PROOF_GATE = { blocks: 23, line: "proof-gate: mọi màn đang mở đã chứng minh đúng lối" };

// AC-9: the plugin's audit at the base and at HEAD differ in this one line, nothing else.
export const AUDIT_DIFF = {
  before: "contract: 7 of 7 ledger file(s) have the one shape every reader relies on",
  after: "contract: 8 of 8 ledger file(s) have the one shape every reader relies on",
};

// AC-10: every file the upgrade commit changes (git diff --no-renames BASE UPGRADE).
export const UPGRADE_CHANGES = [
  ".claude/skills/inventory-ui/SKILL.md",
  ".gitignore",
  "design/behaviors.md",
  "design/component-registry.json",
  "design/intake/_shared.yaml",
  "design/intake/bang-nhieu-dong.yaml",
  "design/intake/chu-dai-cat-gon.yaml",
  "design/intake/danh-sach-khung.yaml",
  "design/intake/danh-sach-the-dien-thoai.yaml",
  "design/intake/dau-trang.yaml",
  "design/intake/ho-so-du-thong-tin.yaml",
  "design/intake/ho-so-ghim-thanh-cot.yaml",
  "design/intake/hop-bieu-mau.yaml",
  "design/intake/hop-co-nhan-tieu-de.yaml",
  "design/intake/man-truoc-khi-vao-san.yaml",
  "design/intake/nhom-dong.yaml",
  "design/intake/nut-dinh-day-ho-so.yaml",
  "design/intake/o-theo-kieu-du-lieu.yaml",
  "design/intake/o-tim-thanh-tren.yaml",
  "design/intake/ruot-ho-so-can.yaml",
  "design/intake/sua-tren-o.yaml",
  "design/intake/the-can.yaml",
  "design/intake/toan-man-hinh.yaml",
  "design/intake/viec-tren-dong.yaml",
  "design/intake/viec-trong-ho-so.yaml",
  "design/intake/vung-cham-44.yaml",
  "design/intake/xem-chi-tiet-mot-dong.yaml",
  "design/intake/xem-truoc-khi-dan.yaml",
  "design/screens.yaml",
  "design/screens/_shared.yaml",
  "design/screens/contacts.yaml",
  "design/screens/inventory.yaml",
  "design/screens/members.yaml",
  "design/screens/proto-bo-nut.yaml",
  "design/screens/proto.yaml",
  "design/screens/sent.yaml",
  "design/screens/sign-in.yaml",
  "design/screens/today.yaml",
  "design/screens/tuy-chinh-san.yaml",
  "design/so-khoi.yaml",
  "design/theme.json",
  "design/tool-stamp.json",
  "design/vai-man-nut.md",
  "mk/derived.mk",
  "mk/design-assembly.mk",
  "tests/bo-nut-vai-man.test.ts",
  "tests/ci-ban-sao-nong.test.ts",
  "tests/e2e-db/vai-man.spec.ts",
  "tests/e2e-db/vai-man.ts",
  "tests/e2e/bo-nut.spec.ts",
  "tests/vai-man-nut-sinh.test.ts",
  "tools/coverage_matrix/buttons.py",
  "tools/design-assembly/adapters/index.mjs",
  "tools/design-assembly/adapters/nextjs.mjs",
  "tools/design-assembly/affected.mjs",
  "tools/design-assembly/check.mjs",
  "tools/design-assembly/components.mjs",
  "tools/design-assembly/contract.mjs",
  "tools/design-assembly/derived.mjs",
  "tools/design-assembly/governance.mjs",
  "tools/design-assembly/intake-ledger.mjs",
  "tools/design-assembly/owner-calls.mjs",
  "tools/design-assembly/screen-actions.mjs",
  "tools/design-assembly/screen-fragments.mjs",
  "tools/design-assembly/screen-ledger.d.mts",
  "tools/design-assembly/screen-ledger.mjs",
  "tools/design-assembly/screens.mjs",
  "tools/design-assembly/waiting.mjs",
  "tools/proof_gate/check.py",
  "tools/proof_gate/khuon-chung-minh.md",
  "tools/proof_gate/legacy.py",
  "tools/proof_gate/model.py",
  "tools/proof_gate/proof-gate-0023.test.ts",
  "tools/proof_gate/proof-gate-1q.test.ts",
  "tools/proof_gate/thanh-phan-co-truoc.yaml",
  "wiki/decisions/0025-bo-nut-theo-quyen.md",
  "wiki/decisions/0028-them-goi-cmdk-cho-o-k.md",
  "wiki/decisions/0030-so-man-khai-cua-vao-va-nut.md",
  "wiki/decisions/0031-them-goi-khung-chia-keo-duoc.md",
  "wiki/decisions/0033-ho-man-danh-sach-khung.md",
  "wiki/decisions/0040-dan-qua-ban-xem-truoc.md"
];

// AC-10: every file of the upgrade commit in exactly one group of work, each group a row of the
// contract's Coverage table. A path ending in a slash is a folder. The counts add up to 81.
export const FILE_GROUPS = {
  "tool 0.7.0 and stamp": { count: 17, paths: ["tools/design-assembly/", "design/tool-stamp.json"] },
  "gate step copied by hand": { count: 1, paths: ["mk/design-assembly.mk"] },
  "component manifest out of git": { count: 2, paths: ["design/component-registry.json", ".gitignore"] },
  "ledger of screens in fragments": { count: 11, paths: ["design/screens.yaml", "design/screens/"] },
  "role table renamed, out of git, drawn by mk/derived.mk": {
    count: 7,
    paths: [
      "design/vai-man-nut.md",
      "mk/derived.mk",
      "tools/coverage_matrix/buttons.py",
      "tests/bo-nut-vai-man.test.ts",
      "tests/e2e-db/vai-man.spec.ts",
      "tests/e2e-db/vai-man.ts",
      "tests/e2e/bo-nut.spec.ts",
    ],
  },
  "block ledger renamed intake, in fragments": { count: 25, paths: ["design/so-khoi.yaml", "design/intake/"] },
  "proof gate readers": { count: 7, paths: ["tools/proof_gate/"] },
  "skill inventory-ui": { count: 1, paths: [".claude/skills/inventory-ui/SKILL.md"] },
  "affected map and ledger shapes": { count: 1, paths: ["design/theme.json"] },
  "behaviour patterns as a list": { count: 1, paths: ["design/behaviors.md"] },
  "wiki front-matter links": { count: 6, paths: ["wiki/decisions/"] },
  "order tests expect id order": { count: 1, paths: ["tests/vai-man-nut-sinh.test.ts"] },
  "owner-calls named in the shallow-clone test": { count: 1, paths: ["tests/ci-ban-sao-nong.test.ts"] },
};

// AC-10: what the branch as a whole may change beyond the upgrade commit. A path ending in a slash
// is a folder; any file under it is allowed.
export const BRANCH_MAY_CHANGE = [
  ...UPGRADE_CHANGES,
  "_acceptance/upgrade-design-assembly-0-7-0/",
  "_acceptance/config.yaml",
  "docs/superpowers/specs/2026-11-17-upgrade-design-assembly-0-7-0-design.md",
  "docs/superpowers/plans/2026-11-17-upgrade-design-assembly-0-7-0.md",
  "wiki/log.md",
  "PRODUCT-MAP.md",
  "LO-TRINH.html",
  // Fixed after the Gate 2 signature (sua-sau-ky.md): the signed-in suite read the ledger of screens in the old order.
  "tests/e2e-db/screens.spec.ts",
];
