// Reads a repository's stylesheet the way the cascade sees it: the entry file with its relative
// imports put in place, and the framework's theme kept apart as the lowest layer.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { adapter as components } from "./adapters/shadcn.mjs";
import { adapter as values } from "./adapters/tailwind.mjs";
import { parseColor } from "./color.mjs";
import { readVariable } from "./theme.mjs";

export const DEFAULT_STYLESHEET = "src/index.css";
const FRAMEWORK_THEME = values.frameworkTheme;

const read = (root, file) =>
  existsSync(path.join(root, file)) ? readFileSync(path.join(root, file), "utf8") : null;

// Where the repository says its stylesheet is, or null.
export function findStylesheet(root) {
  const config = read(root, components.settingsFile);
  const declared = config ? components.stylesheetIn(JSON.parse(config)) : null;
  if (declared && read(root, declared) !== null) return declared;
  return read(root, DEFAULT_STYLESHEET) === null ? null : DEFAULT_STYLESHEET;
}

// `css` is the repository's own text in cascade order; `base` is the framework's theme, read only
// when a value points into it. `files` lists what was read. `instead` gives the text of files as
// they are about to be written, for a caller that has not written them yet.
export function loadStyles(root, entry, instead = {}) {
  const files = [];
  const inline = (file) => {
    const text = instead[file] ?? read(root, file);
    if (text === null || files.includes(file)) return "";
    files.push(file);
    return text.replace(/^@import\s+["'](\.{1,2}\/[^"']+)["'];?[ \t]*$/gm, (_, relative) =>
      inline(path.posix.join(path.posix.dirname(file), relative)),
    );
  };
  return { css: inline(entry), base: read(root, FRAMEWORK_THEME) ?? "", files };
}

// The selectors a repository may write its dark mode under, the one that wins the cascade first:
// a class on the root element outranks the class alone.
export const DARK_SCOPES = [":root.dark", "html.dark", ".dark"];
const MODE_MARKERS = ["--background", "--foreground", "--primary", "--primary-foreground"];

// A variable the repository's own text declares for a selector, or null: no fallback to the root.
export function ownValue(styles, scope, name) {
  return readVariable(styles.css, scope, name);
}

// The selector the repository writes its dark mode under, or null when it has none.
export function darkScope(styles) {
  return (
    DARK_SCOPES.find((scope) => MODE_MARKERS.some((name) => ownValue(styles, scope, name))) ?? null
  );
}

// Every selector the repository writes dark-mode values under. A stylesheet may split them: the
// color roles under one, further values under another. Reading one alone would miss the rest.
export function darkScopes(styles) {
  return DARK_SCOPES.filter((scope) =>
    new RegExp(`(?:^|\\n)${scope.replaceAll(".", "\\.")}\\s*\\{`).test(styles.css),
  );
}

// Every declaration inside the repository's own @theme blocks, in the order written.
export function themeDeclarations(styles) {
  const found = [];
  for (const block of styles.css.matchAll(/(?:^|\n)@theme[^{]*\{([^}]*)\}/g)) {
    for (const line of block[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      found.push({ name: line[1], value: line[2].trim() });
    }
  }
  return found;
}

// The text inside each `@layer name { ... }` block of a stylesheet, in the order written.
function layerBodies(css) {
  const bodies = [];
  for (const open of css.matchAll(/(?:^|\n)[ \t]*@layer[^{;]*\{/g)) {
    let depth = 1;
    let at = open.index + open[0].length;
    const from = at;
    while (at < css.length && depth > 0) {
      if (css[at] === "{") depth += 1;
      else if (css[at] === "}") depth -= 1;
      at += 1;
    }
    bodies.push(css.slice(from, at - 1));
  }
  return bodies;
}

// A variable a cascade layer declares for a selector, or null. A selector inside a layer is
// indented, and a later layer wins over an earlier one.
const literal = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function layeredValue(css, selector, name) {
  const blocks = new RegExp(`(?:^|\\n)[ \\t]*${literal(selector)}\\s*\\{([^}]*)\\}`, "g");
  let value = null;
  for (const body of layerBodies(css)) {
    for (const block of body.matchAll(blocks)) {
      const found = [
        ...block[1].matchAll(new RegExp(`${literal(name)}\\s*:\\s*([^;]+);`, "g")),
      ].pop();
      if (found) value = found[1].trim();
    }
  }
  return value;
}

// What a variable is declared as for a selector: its own block, the root, the same in a cascade
// layer (which every unlayered declaration outranks), the repository's theme, then the framework's.
// `scope` may be several selectors that apply together, strongest first.
function declared(styles, scope, name) {
  const selectors = [scope, ":root"].flat();
  const own = selectors
    .map((selector) => readVariable(styles.css, selector, name))
    .find((value) => value !== null);
  if (own !== undefined) return own;
  const layered = styles.css.includes("@layer")
    ? selectors
        .map((selector) => layeredValue(styles.css, selector, name))
        .find((value) => value !== null)
    : undefined;
  if (layered !== undefined) return layered;
  const themed = themeDeclarations(styles).findLast((item) => item.name === name);
  if (themed) return themed.value;
  const pattern = new RegExp(`(?:^|[\\s;{])${name}\\s*:\\s*([^;]+);`, "g");
  return [...(styles.base ?? "").matchAll(pattern)].pop()?.[1].trim() ?? null;
}

// A value with every var() replaced by what it points at, for a selector. A pointer that leads
// nowhere is left as written, so the caller can see that the value is not fully known.
export function expand(styles, scope, text, depth = 0) {
  if (depth > 8) return text;
  return text.replace(/var\(\s*(--[\w-]+)\s*\)/g, (whole, name) => {
    const value = declared(styles, scope, name);
    return value === null ? whole : expand(styles, scope, value, depth + 1);
  });
}

// A variable as the cascade resolves it for a selector. `value` is what is written; `color` is
// what it ends up as after following var(), or null when that cannot be read here.
export function resolve(styles, scope, name) {
  const value = declared(styles, scope, name);
  if (value === null) return null;
  return { value, color: parseColor(expand(styles, scope, value)) };
}
