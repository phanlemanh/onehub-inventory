// The matrix this record pins before measuring: every number and name a measure checks reads here.
// Read from the tree at the merge of main (fe9afc7f) into the branch, after `make design-exports`.

// The state of the design ledgers the exports were written from, and the gate that holds them.
export const STAMP = "f1f0bbbc4e26";
export const GATE = { decisions: 26, checks: 41 };
export const gateLine = (g) => `design-assembly: ${g.decisions} decisions held by ${g.checks} checks, each seen failing on a changed copy`;

// The five exports, in the order design/theme.json lists them; the last four are the bundle.
export const EXPORTS = [
  "DESIGN.md",
  "design/export/system/README.md",
  "design/export/system/tokens.json",
  "design/export/system/components.md",
  "design/export/system/assets.json",
];
export const BUNDLE = EXPORTS.slice(1);
export const THEME = "design/theme.json";
export const EXPORT_DECISION = "design-exports";
export const STAMP_LINE = /written from the design ledgers at ([0-9a-f]{12})/i;

// What the bundle holds, from its sources.
export const SOURCE_TOKENS = "design/tokens.json";
export const REGISTRY = "design/component-registry.json";
export const COLOURS = 40;
export const THEMES = ["light", "dark"];
export const COMPONENTS = 298;
export const FAMILIES = { sans: "Inter", heading: "Inter" };
export const LOADED_BY = "the font loader in src/app/layout.tsx";
export const SPACING_UNIT = "4px";
// Where the typefaces and the spacing unit come from: bundle.mjs reads them there, not from the bundle.
export const LAYOUT = "src/app/layout.tsx";
export const STYLESHEET = "src/app/globals.css";
export const REM = 16;

// The owner's leave to send, and the push.
export const LEDGER = "design/decisions.yaml";
export const LEAVE = {
  id: "send-claude-design",
  kind: "judgment",
  to: "The design values and files of the repository it is given, to a private artifact of the person's Claude account.",
  note: "confirmed by Manh Phan on 2026-11-26",
};
export const PLUG = "claude-design";
// The place a leave sends to must be a private one.
export const PRIVATE = "a private artifact";
export const PUSHED = "design/export/pushed.json";
export const PUSH_ON = "2026-11-27";
// The installed plugin, on the owner's machine; DA_PLUGIN names it elsewhere.
export const PLUGIN_DIR = () => process.env.DA_PLUGIN || "/Users/manhphan/dev/design-assembly/plugins/design-assembly";

// The question that waits on the owner: no answer may be written for it.
export const WAITING = "design/waiting/default-claude-design.json";
export const DEFAULT_ID = "default-claude-design";
export const ANSWER_KEYS = ["answer", "answered", "answered_by", "answered_on", "by", "decided", "decision", "choice"];

// What the exports may never carry.
export const NOT_IN_EXPORTS = [
  { name: "an email address", re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}/ },
  // Joined, spaced or dotted, from 0 or +84: «0900000012», «0900 000 012», «+84 900 000 012».
  { name: "a phone number", re: /(?<![0-9a-f#.])(?:\+84[ .]?|0)[1-9](?:[ .]?[0-9]){8}(?![0-9a-f])/ },
  { name: "a key or token", re: /\b(?:sk-[A-Za-z0-9_-]{16,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|eyJ[A-Za-z0-9_-]{20,}\.)|-----BEGIN [A-Z ]*PRIVATE KEY/ },
  { name: "a path on this machine", re: /\/Users\/|\/private\/(?:tmp|var)\/|\/var\/folders\/|\/home\/[a-z]|\/tmp\/[A-Za-z0-9]/ },
];

// The branch, from where it leaves origin/main to HEAD.
export const BRANCH_MUST_CHANGE = [...EXPORTS, PUSHED, LEDGER, THEME, WAITING];
export const ADD_ONLY = [LEDGER, THEME];
export const BRANCH_MAY_CHANGE = [
  ...BRANCH_MUST_CHANGE,
  "wiki/log/",
  "_acceptance/bring-out-claude-design/",
  "docs/superpowers/specs/2026-11-27-bring-out-claude-design-design.md",
];
export const DRAWN_PAGES = ["PRODUCT-MAP.md", "LO-TRINH.html"];
export const DRAWER = "scripts/product-map.mjs";
