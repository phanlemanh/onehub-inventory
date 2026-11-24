// The matrix written before the measures: every value a measure checks lives here, once.
// Source: docs/superpowers/specs/2026-11-24-nang-kit-3-1-1-design.md and _acceptance/nang-kit-3-1-1/evals.yaml.

export const SLUG = "nang-kit-3-1-1";

// The kit this round moves to: tag v3.1.1, peeled commit below (release of 2026-11-23).
export const NEW_KIT = {
  url: "https://github.com/phanlemanh/delivery-loop",
  repo: "phanlemanh/delivery-loop",
  tag: "v3.1.1",
  sha: "1193bc2203a47f7a5664999bd9b1259595baa1e3",
  core: "plugins/acceptance-gate",
};

// The kit main runs today: the session marketplace on origin/main and KIT_TAG of the CI gate job.
export const OLD_KIT = {
  url: "https://github.com/phanlemanh/delivery-loop",
  repo: "phanlemanh/delivery-loop",
  tag: "v3.1.0",
  sha: "0a93a5b95f3d35b29ffefc6da2b2ad0fa5e96e0d",
  core: "plugins/acceptance-gate",
};

export const MARKETPLACE = "delivery-loop";
export const PLUGINS = ["acceptance-gate", "dispatch", "diagram-design", "feature-loop", "knowledge", "roadmap"];
// Plugin versions at v3.1.1: five plugins moved to 3.1.1, diagram-design did not change and stays 3.0.0.
export const PLUGIN_VERSIONS = {
  "acceptance-gate": "3.1.1",
  dispatch: "3.1.1",
  "diagram-design": "3.0.0",
  "feature-loop": "3.1.1",
  knowledge: "3.1.1",
  roadmap: "3.1.1",
};
export const KEPT_PLUGIN = "superpowers@claude-plugins-official";

// The one line of .claude/settings.json this branch changes.
export const SETTINGS_CHANGED = { from: '"ref": "v3.1.0"', to: '"ref": "v3.1.1"' };

// The one line of .github/workflows/ci.yml this branch changes, and the patch kept in the record.
export const CI_CHANGED = { from: "KIT_TAG: v3.1.0", to: "KIT_TAG: v3.1.1" };
export const CI_PATCH = "_acceptance/nang-kit-3-1-1/ci-kit-tag.patch";

// kiem-ban-cai of the tag, run against a fetch of the kit that has the tag: the last line it must print.
export const KIEM_BAN_CAI = {
  script: "plugins/acceptance-gate/scripts/kiem-ban-cai.mjs",
  lastLine: "[kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v3.1.1 (1193bc22) cài đúng tag",
};

// AC-5: the files under plugins/ that differ between v3.1.0 and v3.1.1 (git diff --name-only), sorted.
export const KIT_CHANGED = [
  "plugins/acceptance-gate/.claude-plugin/plugin.json",
  "plugins/acceptance-gate/commands/signoff.md",
  "plugins/dispatch/.claude-plugin/plugin.json",
  "plugins/dispatch/scripts/dieu-phoi.mjs",
  "plugins/dispatch/scripts/gop.mjs",
  "plugins/feature-loop/.claude-plugin/plugin.json",
  "plugins/feature-loop/skills/feature-loop/SKILL.md",
  "plugins/knowledge/.claude-plugin/plugin.json",
  "plugins/roadmap/.claude-plugin/plugin.json",
];
// The core folders the CI gate (pre-merge-check.sh) and the four kit executors of _acceptance/config.yaml run from.
export const CORE_RUN_DIRS = ["plugins/acceptance-gate/scripts/", "plugins/acceptance-gate/lib/"];
// The only switch under which the patch changes behaviour.
export const PATCH_SWITCH = { block: "feature_loop", key: "gop_theo_loi_ky" };
