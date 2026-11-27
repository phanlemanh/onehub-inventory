// The matrix written first (evals.yaml, top of file), as data every measure of this record reads.
import { readFileSync } from "node:fs";
import path from "node:path";

// Where the branch left main, and the one commit that ran the upgrade to 0.76.0, wrote the 13 brand
// words of the design book and the wiki log line.
export const BASE = "f1fd703887effc061797413a7ca5d65e1b406500";
export const UPGRADE = "afcb1ca26257e457ea5004e155164edbc35b439a";

// AC-3: the version this record takes, the id git gives the tool folder that version hands a
// repository, as its release ledger records it and its template folder holds it.
export const RELEASE = {
  version: "0.76.0",
  tool: "80ed15e5d52b6cd1682e5a299772586e0854ee35",
  files: 51,
};
export const OLD_VERSION = "0.69.0";
// The upgrade left the gate step as it was: the 0.76.0 template is the file the branch keeps.
export const GATE_STEP = { file: "mk/design-assembly.mk", blob: "a9af3d808fc7f156d659ada3f6528cfe3482264c" };
// The installed plugin: the owner's checkout of design-assembly, not the plugin cache (the cache has
// no 0.76.0). DA_PLUGIN stands in for it, in the break copies and on another machine.
export const PLUGIN_DIR = () => process.env.DA_PLUGIN ?? "/Users/manhphan/dev/design-assembly/plugins/design-assembly";
export const PLUGIN_FILES = {
  manifest: ".claude-plugin/plugin.json",
  ledger: "references/releases.json",
  toolTemplate: "templates/tools/design-assembly",
  gateStep: "templates/mk/design-assembly.mk",
  book: "scripts/book.mjs",
  audit: "scripts/audit.mjs",
};

export const TOOL_FOLDER = "tools/design-assembly";
export const STAMP = "design/tool-stamp.json";
export const THEME = "design/theme.json";
export const LEDGER = "design/decisions.yaml";

// AC-1, AC-2: what the gate and make check say. Neither the decisions, the checks nor the rate move
// with the upgrade: the same numbers stand at BASE.
export const GATE = { decisions: 25, checks: 36 };
export const gateLine = ({ decisions, checks }) =>
  `design-assembly: ${decisions} decisions held by ${checks} checks, each seen failing on a changed copy`;
export const RATE = { automatic: 62, all: 73, held: 25, claimed: 37 };
export const rateLine = ({ automatic, all }) =>
  `determinism rate: ${automatic}/${all} (${Math.round((100 * automatic) / all)}%)`;
export const heldLine = ({ held, claimed }) =>
  `${held} held and re-run here, ${claimed} claimed by another check and not re-run`;
export const TESTS = { passed: 2698, skipped: 2 };
export const COMPONENTS = 297;

// AC-4: the decision the break takes away from the 0.69.0 side.
export const BREAK_DECISION = "raw-table";

// AC-5: what the plugin's audit says of the core decisions, and the row the break drops.
export const CORE = { answered: 40, all: 40, held: 14, claimed: 19, recorded: 7 };
export const coreLine = ({ answered, all, held, claimed, recorded }) =>
  `coverage: ${answered} of ${all} core decisions answered (${held} held and re-run here, ${claimed} claimed and not re-run, ${recorded} recorded)`;
export const BREAK_CORE_ROW = "error-copy";

// AC-6, AC-7: the words of the design book, and the 13 keys 0.76.0's words template adds.
export const WORDS = "design/book-words.json";
export const BRAND_KEYS = [
  "brandTitle",
  "brandQuestion",
  "brandLede",
  "brandMark",
  "brandIcons",
  "brandFloorText",
  "brandNoIcons",
  "brandRow",
  "brandPin",
  "brandSizes",
  "brandNoSizes",
  "brandStroke",
  "brandUnread",
];
// The six questions PR #124 wrote, kept as they are.
export const QUESTIONS = [
  "terms",
  "error-copy",
  "test-screen-sizes",
  "reference-implementation",
  "screen-ledger",
  "screen-actions",
];
// What design/language.md says a text must not hold: an exclamation mark, a value of the repository,
// a tone mark in the old place (its closed list), and «sàn», which is a legal kind of business there.
export const LANGUAGE = {
  forbidden: [
    { re: /!/, why: "an exclamation mark (design/language.md §5)" },
    { re: /#[0-9a-f]{3,8}\b/i, why: "a colour value" },
    { re: /\b(?:oklch|rgb|hsl)\(/i, why: "a colour value" },
    { re: /onehub/i, why: "the repository's name" },
    { re: /h[óò]a|t[òó]a|th[ỏó]a|kh[óò]a|x[óò]a|th[ủú]y/i, why: "a tone mark in the old place (design/language.md §5)" },
    { re: /(^|[^\p{L}])sàn([^\p{L}]|$)/iu, why: "«sàn», a legal kind of business (design/language.md §2)" },
    { re: /\p{Extended_Pictographic}/u, why: "an emoji (design/language.md §5)" },
  ],
};
// The side-by-side table the judgment eval reads: written by words.mjs --table, compared by words.mjs.
export const TABLE = "_acceptance/upgrade-design-assembly-0-76-0/rang/brand-words.md";

// AC-7: the sample rows a copy of the repository gets, so the book has a brand page to draw. An icon
// set with sizes and a stroke; one with neither; and a logo row pinning a file the copy does not hold.
export const ICON_ROW = {
  file: "design/sources/probe-icons.json",
  row: { kind: "icon-set", title: "Probe icons", module: "lucide-react", pin: { package: "lucide-react", version: "1.70.0" }, sizes: [16, 20], stroke: 2 },
};
export const BARE_ICON_ROW = {
  file: "design/sources/probe-icons.json",
  row: { kind: "icon-set", title: "Probe icons", module: "lucide-react", pin: { package: "lucide-react", version: "1.70.0" } },
};
export const LOGO_ROW = {
  file: "design/sources/probe-mark.json",
  row: {
    kind: "logo",
    title: "Probe mark",
    pin: { files: [{ file: "public/probe-mark.svg", role: "mark", variant: "color", sha256: "0".repeat(64) }] },
  },
};

// AC-7: the note the book prints when it is written without the components' pictures (exit 1).
export const NO_PICTURES = "note: the components are not drawn";

// AC-8: every file the upgrade commit changes (git diff, renames off, against its parent).
export const UPGRADE_CHANGES = [
  "design/book-words.json",
  "design/tool-stamp.json",
  "tools/design-assembly/adapters/nextjs-build.mjs",
  "tools/design-assembly/adapters/shadcn.mjs",
  "tools/design-assembly/adapters/tailwind.mjs",
  "tools/design-assembly/adapters/vite.mjs",
  "tools/design-assembly/check.mjs",
  "tools/design-assembly/contract.mjs",
  "tools/design-assembly/exports.mjs",
  "tools/design-assembly/governance.mjs",
  "tools/design-assembly/owner-calls.mjs",
  "tools/design-assembly/sources-ledger.mjs",
  "tools/design-assembly/waiting.mjs",
  "wiki/log/2026-11-26-06-n-ng-plugin-design-assembly-0-69-0-0-76.md",
];
export const SLUG = "upgrade-design-assembly-0-76-0";
export const BRANCH_MAY_CHANGE = [
  ...UPGRADE_CHANGES,
  `_acceptance/${SLUG}/`,
  `docs/superpowers/specs/2026-11-26-${SLUG}-design.md`,
  `docs/superpowers/plans/2026-11-26-${SLUG}.md`,
];
// The two pages the gate commands draw again (see the 0-33-0 record for why).
export const DRAWN_PAGES = ["PRODUCT-MAP.md", "LO-TRINH.html"];
export const DRAWER = "scripts/product-map.mjs";
export const DATA_BLOCK = /<script type="application\/json" id="lo-trinh-du-lieu">([\s\S]*?)<\/script>/;

// The words template of the installed plugin, as its book prints it.
export function template(spawn) {
  const out = spawn("node", [path.join(PLUGIN_DIR(), PLUGIN_FILES.book), "--words-template"]);
  return JSON.parse(out);
}
export const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));
