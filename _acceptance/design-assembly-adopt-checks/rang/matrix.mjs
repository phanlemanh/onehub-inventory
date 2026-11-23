// The matrix this record measures against, written before the measures ran. Every measure in this
// folder reads it from here, so a number is written down once.

// The commit the branch was cut from (git merge-base origin/main HEAD on 2026-11-23). The shape
// measure computes the merge-base again at run time, so merging main into the branch does not move
// what it compares; this pin is the fallback where origin/main cannot be read.
export const BASE = "9bf4054f6cb2bd2509277830b6c35d3c6297295d";

export const TOOL = "tool:tools/design-assembly/check.mjs";

// The eight rows that already were in the ledger with no check, and the check each now names (AC-2).
export const GAINED = {
  "target-size": TOOL,
  "theme-modes": "e2e:tests/e2e/frame.spec.ts",
  "mobile-navigation": "e2e:tests/e2e/frame.spec.ts",
  "status-tone": "e2e:tests/e2e/frame.spec.ts",
  "table-density": "e2e:tests/e2e/grid.spec.ts",
  "format-number-date": "test:tests/format.test.ts",
  "column-align": "test:tests/grid.test.tsx",
  "column-width": "test:tests/grid.test.tsx",
};

// The two rows the branch adds at the end of the ledger, both held by the design tool (AC-2).
export const ADDED = { "font-loaded": TOOL, typeface: TOOL };

// The only files the branch may change outside _acceptance/ (AC-4): the three design ledgers, this
// record's own design doc (the contract's design_doc), and one wiki log entry, matched by its folder
// because its name is drawn from the log line.
export const DESIGN_DOC = "docs/superpowers/specs/2026-11-23-design-assembly-adopt-checks-design.md";
export const FILES = [
  ".claude/rules/design-assembly.md",
  "design/decisions.yaml",
  "design/theme.json",
  DESIGN_DOC,
];
export const LOG_FOLDER = "wiki/log/";

// Views the gate ritual itself redraws from the acceptance records when a person approves or signs
// (the approve and signoff commands stage them). They count with _acceptance/, not as a change of
// the branch.
export const GATE_VIEWS = ["PRODUCT-MAP.md", "LO-TRINH.html"];

// The sections the regenerated rules page must have (AC-5), and the one known wrong line.
export const RULES_PAGE = ".claude/rules/design-assembly.md";
export const RULES_SECTIONS = ["Type", "A screen", "Questions only the owner answers", "No check holds these: a person reviews them", "Controls", "After a change"];
export const KNOWN_DEFECT = "Running text is set in `undefined`";

// What the design tool prints on the branch (AC-1).
export const HELD_LINE = "design-assembly: 22 decisions held by 30 checks, each seen failing on a changed copy";

// Pinned messages:
//   pointers ok   → "pointers: 10 rows point at their check"
//   pointers red  → "pointers: <id> names <x>, not <y>" · "pointers: <id> has no row" ·
//                   "pointers: <id> → <file> carries no decision:<id>" ·
//                   "pointers: <id> has no check entry in design/theme.json"
//   shape ok      → "shape: 8 rows gained a check, 2 rows added, no other row changed; files changed: 5"
//   shape red     → "shape: row <id> changed beyond its check" · "shape: row <id> removed" ·
//                   "shape: row <id> added, not in the matrix" · "shape: file changed outside the matrix: <file>"
//   rules ok      → "rules: Controls says 24px as design/theme.json holds; Type says headings in var(--font-sans) as
//                   design/theme.json holds; one known wrong line"
//   rules red     → "rules: Controls says <n>px, design/theme.json holds <m>px" ·
//                   "rules: Type says headings in <x>, design/theme.json holds <y>" ·
//                   "rules: <k> lines say undefined, the known defect is one" ·
//                   "rules: section <name> missing"
