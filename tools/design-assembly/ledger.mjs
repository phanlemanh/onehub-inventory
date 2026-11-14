// The ledger: design/decisions.yaml, one row per design decision, in block-style YAML that a person
// can edit. A row points at the proof that holds the decision; it does not hold the value.
//   kind   standard | formula | closed | judgment
//   check  test:<path> | e2e:<path> | tool:<path> | eslint:<rule>, or absent
// The format is one already in use in a product repository of the owner. Nothing here depends on
// one repository's layout.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

export const LEDGER = "design/decisions.yaml";
// The pointer a row carries when this plugin's own tool holds the decision.
export const TOOL = "tool:tools/design-assembly/check.mjs";
// A decision's layer is the artifact it constrains. One list, used by the guide, the ledger and
// the audit.
export const LAYERS = [
  "context",
  "foundations",
  "components",
  "patterns",
  "content",
  "templates",
  "governance",
];
// Layer names found in ledgers written before the list was fixed. They are read, and reported.
export const LAYER_ALIASES = {
  core: "components",
  product: "context",
  architecture: "governance",
  semantics: "components",
  conformance: null,
};
export const KINDS = ["standard", "formula", "closed", "judgment"];
export const KEYS = ["id", "layer", "kind", "source", "check", "note"];
const QUOTED = ["source", "check", "note"];
const HEADER = [
  "# Determinism ledger: one row per design decision.",
  "#   kind   standard | formula | closed | judgment",
  "#   check  test:<path> | e2e:<path> | tool:<path> | eslint:<rule>. Leave it out until a check exists.",
  "#          A test or e2e file names the decision it proves with `decision:<id>`. A tool is run by the gate.",
  "#          Keep this file in block style.",
  "version: 1",
  "decisions:",
].join("\n");

const unquote = (value) => value.trim().replace(/^(["'])(.*)\1$/, "$2");

// The text split into what comes before the rows, and one block of lines per row.
function split(text) {
  const lines = text.replace(/\n+$/, "").split("\n");
  const first = lines.findIndex((line) => /^\s*-\s+id:/.test(line));
  if (first === -1) return { head: lines.join("\n"), blocks: [] };
  const blocks = [];
  for (const line of lines.slice(first)) {
    if (/^\s*-\s+id:/.test(line)) blocks.push([line]);
    else blocks.at(-1).push(line);
  }
  return { head: lines.slice(0, first).join("\n"), blocks };
}

function parseBlock(lines) {
  const row = {};
  for (const line of lines) {
    const field = /^\s*(?:-\s+)?([a-z_]+):\s*(.*)$/.exec(line);
    if (field && !line.trim().startsWith("#")) row[field[1]] = unquote(field[2]);
  }
  return row;
}

export function parseLedger(text) {
  return split(text).blocks.map(parseBlock);
}

function renderBlock(row) {
  const lines = [`  - id: ${row.id}`];
  for (const key of KEYS.slice(1)) {
    if (row[key] === undefined || row[key] === "") continue;
    const value = QUOTED.includes(key) ? JSON.stringify(row[key]) : row[key];
    lines.push(`    ${key}: ${value}`);
  }
  return lines;
}

// Puts `rows` into the ledger text: a row whose id is already there replaces that block, a new one
// is added at the end, and everything else is kept byte for byte. `drop` removes rows by id.
export function mergeLedger(text, rows, drop = []) {
  const { head, blocks } = split(text ?? HEADER);
  const ids = blocks.map((block) => parseBlock(block).id);
  const kept = blocks.map((block, index) => {
    const mine = rows.find((row) => row.id === ids[index]);
    return mine ? renderBlock(mine) : block;
  });
  const added = rows.filter((row) => !ids.includes(row.id)).map(renderBlock);
  const all = [...kept, ...added].filter((block) => !drop.includes(parseBlock(block).id));
  return `${[head, ...all.map((block) => block.join("\n"))].join("\n")}\n`;
}

// Gives a row that has no check its pointer: one `check:` line added to that row. Every other
// byte of the ledger, the rest of the row included, stays as it is.
export function pointRow(text, id, check) {
  const { head, blocks } = split(text);
  const pointed = blocks.map((block) => {
    const row = parseBlock(block);
    if (row.id !== id || row.check) return block;
    const last = block.findLastIndex((line) => line.trim() !== "" && !line.trim().startsWith("#"));
    const indent = /^(\s*)/.exec(block[Math.max(1, last)] ?? "    ")[1] || "    ";
    return [
      ...block.slice(0, last + 1),
      `${indent}check: ${JSON.stringify(check)}`,
      ...block.slice(last + 1),
    ];
  });
  return `${[head, ...pointed.map((block) => block.join("\n"))].join("\n")}\n`;
}

function filesNamed(root, names, dir = "") {
  const full = path.join(root, dir);
  if (!existsSync(full)) return false;
  return readdirSync(full).some((name) => {
    if (name === "node_modules" || name.startsWith(".")) return false;
    const relative = path.join(dir, name);
    if (statSync(path.join(root, relative)).isDirectory()) return filesNamed(root, names, relative);
    return names.includes(name);
  });
}

const read = (root, file) =>
  existsSync(path.join(root, file)) ? readFileSync(path.join(root, file), "utf8") : null;

// Whether the gate runs a tool: a Makefile, an included mk file or a package script names it.
function inGate(root, tool) {
  const mk = existsSync(path.join(root, "mk")) ? readdirSync(path.join(root, "mk")).sort() : [];
  const texts = ["Makefile", "package.json", ...mk.map((name) => `mk/${name}`)];
  return texts.some((file) => (read(root, file) ?? "").includes(tool));
}

// Why a check pointer does not resolve, or null. Structural: it shows the proof exists and is wired
// in, not that it was seen failing.
export function pointerProblem(root, id, check) {
  const [prefix, ...rest] = check.split(":");
  const value = rest.join(":");
  if (["test", "e2e", "tool"].includes(prefix)) {
    const text = read(root, value);
    if (text === null) return `${check}: no such file`;
    if (prefix === "tool") return inGate(root, value) ? null : `${check}: not run by the gate`;
    const tagged = new RegExp(`decision:${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`);
    return tagged.test(text) ? null : `${check}: the file does not name decision:${id}`;
  }
  if (prefix === "eslint") {
    const configs = ["eslint.config.js", "eslint.config.mjs", "eslint.config.ts"];
    if (configs.some((file) => (read(root, file) ?? "").includes(value))) return null;
    const bare = value.split("/").at(-1);
    const names = ["mjs", "cjs", "js", "ts"].map((extension) => `${bare}.${extension}`);
    return filesNamed(root, names) ? null : `${check}: no such rule`;
  }
  return `${check}: unknown check type`;
}

// Rows that use an older layer name: read as they are, and listed so a person can rename them.
export function oldLayerNames(rows) {
  return rows
    .filter((row) => row.layer in LAYER_ALIASES)
    .map((row) => `${row.id}: layer '${row.layer}'`);
}

// One line per problem in the ledger. `layers` is the list of layer names a row may use; pass null
// to accept any.
export function ledgerProblems(root, rows, layers) {
  const found = [];
  const seen = new Set();
  for (const row of rows) {
    const id = String(row.id);
    if (seen.has(id)) found.push(`${id}: duplicate id`);
    seen.add(id);
    for (const key of Object.keys(row)) {
      if (!KEYS.includes(key)) found.push(`${id}: unknown key '${key}'`);
    }
    for (const key of ["layer", "kind", "source"]) {
      if (!row[key]) found.push(`${id}: missing ${key}`);
    }
    if (row.kind && !KINDS.includes(row.kind)) found.push(`${id}: unknown kind '${row.kind}'`);
    if (row.layer && layers && !layers.includes(row.layer)) {
      found.push(`${id}: unknown layer '${row.layer}'`);
    }
    if (row.kind === "judgment" && row.check) {
      found.push(`${id}: a judgment cannot have an automatic check`);
    }
    if (row.check) {
      const problem = pointerProblem(root, id, row.check);
      if (problem) found.push(`${id}: ${problem}`);
    }
  }
  return found;
}

// Decisions with a check that resolves, over all decisions.
export function ledgerRate(root, rows) {
  const automatic = rows.filter(
    (row) => row.check && !pointerProblem(root, String(row.id), row.check),
  );
  return { automatic: automatic.length, total: rows.length };
}

export function readLedger(root) {
  const text = read(root, LEDGER);
  return text === null ? null : parseLedger(text);
}
