// The matrix written before the measures: every value a measure checks lives here, once.
// Source: docs/superpowers/specs/2026-11-18-nang-kit-3-0-design.md and _acceptance/nang-kit-3-0/evals.yaml.

export const SLUG = "nang-kit-3-0";

export const NEW_KIT = {
  url: "https://github.com/phanlemanh/delivery-loop",
  repo: "phanlemanh/delivery-loop",
  tag: "v3.0.0",
  sha: "c16d25dbe224ec0b122b6d578118731750b6a4e3",
  core: "plugins/acceptance-gate",
};

export const OLD_KIT = {
  url: "https://github.com/phanlemanh/acceptance-gate-kit",
  repo: "phanlemanh/acceptance-gate-kit",
  tag: "v2.38.1",
  sha: "88d31b6387f07606b00faebfa75b68664b8908e2",
  core: "",
};

// Where this branch left main; the rehearsal ran here on 2026-11-18.
export const BASELINE = "8925e8fffc776534c5388ced3fea36ac2a1345f6";

export const MARKETPLACE = "delivery-loop";
export const PLUGINS = ["acceptance-gate", "feature-loop", "diagram-design", "roadmap", "knowledge", "dispatch"];
export const KEPT_PLUGIN = "superpowers@claude-plugins-official";

export const NEW_KEY = "acceptance-gate@delivery-loop";
export const OLD_KEY = "acceptance-gate@acceptance-gate-kit";

// The gate job of ci.yml changes in exactly these three lines.
export const CI_CHANGED_LINES = 3;
export const CI_PLUGIN_ROOT_SUFFIX = "/plugins/acceptance-gate";
export const CI_CORE_FILES = ["scripts/pre-merge-check.sh", "scripts/product-map.mjs"];

// Before the record is signed, every stop of the gate names this record (AC-2 after the scope cut of
// 2026-11-18: which of the record's own reasons is not measured here; --signed at S5 wants none at all).

// Executor commands of _acceptance/config.yaml that join a script to the kit root.
export const KIT_EXECUTORS = ["script.product_map", "design.floor", "design.khuon", "design.ui_check"];

// Commands and kit paths named in the living docs.
export const DOC_FILES = ["docs/tri-thuc/TRI-THUC.md", "docs/plan/dot-nen/README.md", "_acceptance/config.yaml"];
export const DOC_COUNTS = { mentions: 4, distinct: 3, paths: 1 };

// Old-name sweep.
export const OLD_NAME_RE =
  "acceptance-gate-kit|(road-map|tri-thuc|dieu-phoi)@|/(road-map|tri-thuc|dieu-phoi):|/(road-map|dieu-phoi)/|`(road-map|tri-thuc|dieu-phoi)`";
export const SWEEP_EXCLUDE = [
  "_acceptance/**",
  "wiki/decisions/**",
  "docs/tri-thuc/raw/**",
  "docs/superpowers/specs/2026-11-18-nang-kit-3-0-design.md",
  "docs/superpowers/plans/2026-11-18-nang-kit-3-0.md",
  // These two name the old key only to refuse it; AC-5 guards that refusal.
  "tools/kit-root.mjs",
  "tests/kit-root.test.ts",
];
export const SWEEP_INCLUDE_AGAIN = ["_acceptance/config.yaml"];
export const SWEEP_AT_BASELINE = { lines: 14, files: 5 };
