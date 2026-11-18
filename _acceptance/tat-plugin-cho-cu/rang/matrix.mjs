// Matrix written before the measures (evals.yaml of tat-plugin-cho-cu).

// The old marketplace, frozen at 2.39.0. The only place the name is spelled in this record's code.
export const OLD_MARKET = "acceptance-gate-kit";
// Its six plugins, from its .claude-plugin/marketplace.json.
export const OLD_PLUGINS = ["acceptance-gate", "diagram-design", "dieu-phoi", "feature-loop", "road-map", "tri-thuc"];
// The order the pinned messages of evals.yaml name them in.
export const OLD_PLUGINS_SHOWN = ["acceptance-gate", "feature-loop", "diagram-design", "dieu-phoi", "road-map", "tri-thuc"];

export const NEW_MARKET = "delivery-loop";
export const NEW_PLUGINS = ["acceptance-gate", "diagram-design", "dispatch", "feature-loop", "knowledge", "roadmap"];
export const NEW_VERSION = "3.0.0";

// Every kit plugin name either marketplace uses (AC-3: each appears at most once in a session).
export const KIT_NAMES = [...new Set([...OLD_PLUGINS, ...NEW_PLUGINS])].sort();

export const OLD_COMMAND = "acceptance-gate:cat-luot";
export const NEW_COMMANDS = ["acceptance-gate:scope-slice", "feature-loop:feature-loop"];
