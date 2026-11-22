// The matrix written before the measures: every value a measure checks lives here, once.
// Source: docs/superpowers/specs/2026-11-22-nang-kit-3-1-design.md and _acceptance/nang-kit-3-1/evals.yaml.

export const SLUG = "nang-kit-3-1";

// The kit the session marketplace moves to (tag object b623358b, peeled commit below).
export const NEW_KIT = {
  url: "https://github.com/phanlemanh/delivery-loop",
  repo: "phanlemanh/delivery-loop",
  tag: "v3.1.0",
  sha: "0a93a5b95f3d35b29ffefc6da2b2ad0fa5e96e0d",
  core: "plugins/acceptance-gate",
};

// The kit main runs today: the session marketplace on origin/main and KIT_TAG of the CI gate job.
export const OLD_KIT = {
  url: "https://github.com/phanlemanh/delivery-loop",
  repo: "phanlemanh/delivery-loop",
  tag: "v3.0.0",
  sha: "c16d25dbe224ec0b122b6d578118731750b6a4e3",
  core: "plugins/acceptance-gate",
};

export const MARKETPLACE = "delivery-loop";
export const PLUGINS = ["acceptance-gate", "dispatch", "diagram-design", "feature-loop", "knowledge", "roadmap"];
// Plugin versions at v3.1.0: five plugins moved to 3.1.0, diagram-design did not change and stays 3.0.0.
export const PLUGIN_VERSIONS = {
  "acceptance-gate": "3.1.0",
  dispatch: "3.1.0",
  "diagram-design": "3.0.0",
  "feature-loop": "3.1.0",
  knowledge: "3.1.0",
  roadmap: "3.1.0",
};
export const KEPT_PLUGIN = "superpowers@claude-plugins-official";

// The one line of .claude/settings.json this branch changes.
export const SETTINGS_CHANGED = { from: '"ref": "v3.0.0"', to: '"ref": "v3.1.0"' };

// The decision assistant of kit 3.1: script, mode, and the first line its count prints.
export const TRO_LY = {
  script: "scripts/tro-ly-quyet-dinh.cjs",
  args: ["--dem"],
  firstLine: /^Sổ đếm trợ lý quyết định — (\d+) hồ sơ · mặc-ký (tắt|bật)/,
  kinds: ["sua-o-dau", "cat-pham-vi", "chon-cach-lam", "ten-va-chu", "nguong-so", "giu-duong-cu", "thu-tu-lam"],
};

// Executor commands of _acceptance/config.yaml that join a script to the kit root.
export const KIT_EXECUTORS = ["script.product_map", "design.floor", "design.khuon", "design.ui_check"];

// Commands and kit paths named in the living docs.
export const DOC_FILES = ["docs/tri-thuc/TRI-THUC.md", "docs/plan/dot-nen/README.md", "_acceptance/config.yaml"];
export const DOC_COUNTS = { mentions: 4, distinct: 3, paths: 1 };
