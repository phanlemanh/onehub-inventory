// The design tokens file: the foundations values of the stylesheet, in the Design Tokens Community
// Group format, for tools that do not read CSS. It is derived: the stylesheet is where a value is
// changed, and this file is written again from it.
// Usage: node tools/design-assembly/tokens.mjs [--write] [--target DIR]
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import path from "node:path";
import { argv, cwd, exit, stderr, stdout } from "node:process";
import { fileURLToPath } from "node:url";

import { tokenHex } from "./color.mjs";
import { TYPE_STEPS } from "./scale.mjs";
import { darkScopes, expand, loadStyles, themeDeclarations } from "./styles.mjs";

// The file a repository gets when nothing names another one.
export const TOKENS = "design/tokens.json";
// The id of the decision that this file says what the stylesheet says.
export const TOKENS_DECISION = "design-tokens";
const OWNER = "design-assembly";

// The theme namespaces that become tokens, and the token type of each. A token `group.name` is the
// variable `--group-name` of the stylesheet, so a reader that turns a token path into a variable
// name finds a variable that exists.
const GROUPS = { color: "color", radius: "dimension", text: "dimension" };

// `calc(<length> * <number>)` as the length it is. Anything else is kept as written.
function fold(value) {
  const product = /^calc\(\s*([\d.]+)([a-z%]+)\s*\*\s*([\d.]+)\s*\)$/.exec(value);
  if (!product) return value;
  return `${Number((Number(product[1]) * Number(product[3])).toFixed(4))}${product[2]}`;
}

// Tokens read from a stylesheet, and the variables that could not be followed to a value.
export function readTokens(styles) {
  const declared = themeDeclarations(styles).map((item) => item.name);
  const names = [...new Set([...declared, ...TYPE_STEPS.map(([step]) => `--text-${step}`)])];
  const dark = darkScopes(styles);
  const tokens = {};
  const unresolved = [];
  for (const variable of names) {
    const match = /^--(color|radius|text)-([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(variable);
    if (!match) continue;
    const [, group, name] = match;
    const value = fold(expand(styles, ":root", `var(${variable})`));
    if (value.includes("var(")) {
      unresolved.push(variable);
      continue;
    }
    // A colour is written in hexadecimal, the one form every reader of the file takes; the CSS
    // text stays under this tool's own extension, so a reader of the stylesheet's words has them.
    const color = group === "color" ? tokenHex(value) : null;
    const token = { $type: GROUPS[group], $value: color ?? value };
    const own = color && color !== value ? { css: value } : {};
    const other = dark.length === 0 ? value : fold(expand(styles, dark, `var(${variable})`));
    if (other !== value && !other.includes("var(")) own.dark = other;
    if (Object.keys(own).length > 0) token.$extensions = { [OWNER]: own };
    tokens[group] = { ...tokens[group], [name]: token };
  }
  return { tokens, unresolved };
}

// A token's value as the stylesheet writes it, whichever form the file keeps it in.
export const tokenCss = (token) => token?.$extensions?.[OWNER]?.css ?? token?.$value;

export const renderTokens = (tokens) => `${JSON.stringify(tokens, null, 2)}\n`;

// Why the file is not what the stylesheet gives, or null. Compared as data: a formatter may lay
// the file out differently. The reason names the first tokens that differ, so a person can see
// which side moved.
export function tokensProblem(text, styles, file, stylesheet) {
  const again = "run make design-tokens to write the file again from the stylesheet";
  if (text === null || text === undefined) return `${file} is missing: ${again}`;
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return `${file} is not valid JSON: ${again}`;
  }
  const expected = readTokens(styles).tokens;
  if (JSON.stringify(data) === JSON.stringify(expected)) return null;
  const flat = (tree) =>
    new Map(
      Object.entries(tree ?? {}).flatMap(([group, entries]) =>
        Object.entries(entries ?? {}).map(([name, token]) => [`${group}.${name}`, token]),
      ),
    );
  const [given, listed] = [flat(expected), flat(data)];
  const differs = [];
  for (const [name, token] of given) {
    const other = listed.get(name);
    if (!other) differs.push(`${name} is not in the file`);
    else if (
      tokenCss(other) !== tokenCss(token) ||
      JSON.stringify(other.$value) !== JSON.stringify(token.$value)
    ) {
      differs.push(
        `${name}: the stylesheet gives ${tokenCss(token)}, the file says ${tokenCss(other)}`,
      );
    } else if (JSON.stringify(other) !== JSON.stringify(token)) {
      differs.push(`${name}: its dark value differs`);
    }
  }
  for (const name of listed.keys()) {
    if (!given.has(name)) differs.push(`${name} is not in the stylesheet`);
  }
  const more = differs.length > 3 ? `; and ${differs.length - 3} more` : "";
  const detail = differs.length > 0 ? ` (${differs.slice(0, 3).join("; ")}${more})` : "";
  return `${file} is not what ${stylesheet} gives${detail}: the stylesheet is where a value changes, so ${again}`;
}

function main() {
  const args = argv.slice(2);
  const at = args.indexOf("--target");
  const root = at === -1 ? cwd() : path.resolve(args[at + 1] ?? "");
  const themeFile = path.join(root, "design/theme.json");
  const theme = existsSync(themeFile) ? JSON.parse(readFileSync(themeFile, "utf8")) : null;
  const check = theme?.checks?.[TOKENS_DECISION]?.[0];
  if (!check) {
    stderr.write(
      "design-assembly: this tool manages no design tokens file here: the repository has none yet, or keeps one of its own\n",
    );
    exit(1);
  }
  const stylesheet = theme.stylesheet ?? "src/index.css";
  const { tokens, unresolved } = readTokens(loadStyles(root, stylesheet));
  const full = path.join(root, check.file);
  const before = existsSync(full) ? readFileSync(full, "utf8") : null;
  const same = before !== null && JSON.stringify(JSON.parse(before)) === JSON.stringify(tokens);
  const count = Object.values(tokens).reduce((sum, group) => sum + Object.keys(group).length, 0);
  for (const variable of unresolved) stdout.write(`not read: ${variable} points nowhere\n`);
  if (same) {
    stdout.write(`design tokens: ${check.file} is up to date (${count} tokens)\n`);
    return;
  }
  if (!args.includes("--write")) {
    stderr.write(`design tokens: ${check.file} is not what ${stylesheet} gives\n`);
    exit(1);
  }
  mkdirSync(path.dirname(full), { recursive: true });
  writeFileSync(full, renderTokens(tokens));
  stdout.write(`design tokens: wrote ${check.file} from ${stylesheet} (${count} tokens)\n`);
}

if (argv[1] && realpathSync(argv[1]) === realpathSync(fileURLToPath(import.meta.url))) main();
