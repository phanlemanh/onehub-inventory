// The typefaces a stylesheet names, and whether the repository loads each one. A typeface that is
// named and not loaded is not an error any browser reports: the page quietly shows the next one in
// the list. What loads a typeface is the build stack's to say, so it is asked of the adapter of the
// repository's build.
import { adapterOf, buildOf } from "./adapters/index.mjs";
import { expand } from "./styles.mjs";

const values = adapterOf("values");

// The variables of running text and of headings, in that order.
export const FONT_VARIABLES = [values.fonts.text, values.fonts.heading];

// The families CSS names by kind, which every device resolves to a typeface it has, and the
// names of the system interface font: none of them is loaded.
const GENERIC = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "math",
  "emoji",
  "fangsong",
  "-apple-system",
  "blinkmacsystemfont",
]);

// A font-family list as its items, quotes taken off: what a reader of the tokens file takes.
export function families(value) {
  const items = [];
  let depth = 0;
  let quote = null;
  let current = "";
  for (const char of String(value)) {
    if (quote) {
      if (char === quote) quote = null;
      current += char;
    } else if (char === '"' || char === "'") {
      quote = char;
      current += char;
    } else if (char === "(") {
      depth += 1;
      current += char;
    } else if (char === ")") {
      depth -= 1;
      current += char;
    } else if (char === "," && depth === 0) {
      items.push(current);
      current = "";
    } else current += char;
  }
  items.push(current);
  return items
    .map((item) => item.trim().replace(/^(["'])(.*)\1$/, "$2"))
    .filter((item) => item !== "");
}

// The typeface a list means: its first item. The rest are what the page falls back to. It is a
// name, a variable that something else sets, or a generic family.
export function firstFamily(value) {
  const first = String(value).trim().split(",")[0]?.trim() ?? "";
  const variable = /^var\(\s*(--[\w-]+)\s*(?:,.*)?\)$/.exec(first);
  if (variable) return { variable: variable[1] };
  const [name] = families(String(value));
  if (name === undefined) return { generic: "" };
  if (!/^["']/.test(first) && GENERIC.has(name.toLowerCase())) return { generic: name };
  return { name };
}

// What loads a typeface in the repository at `root`, as the adapter of its build reads it, and
// how that adapter says nothing does.
export function readLoads(root, css, stylesheet) {
  const build = buildOf(root);
  return {
    build: build.id,
    loads: build.fontLoads ? build.fontLoads(root, css, stylesheet) : [],
    say: build.fontsSay ?? "this repository's build says nothing of how it loads a typeface",
  };
}

// The variables of `variables` the stylesheet declares, its own or its framework's.
export const declaredFonts = (styles, variables = FONT_VARIABLES) =>
  variables.filter((name) => expand(styles, ":root", `var(${name})`) !== `var(${name})`);

// One sentence for each typeface the stylesheet names and nothing loads, by the first variable
// that names it.
export function fontProblems(styles, variables, stylesheet, fonts) {
  const loads = fonts?.loads ?? [];
  const seen = new Set();
  const found = [];
  for (const variable of variables) {
    const value = expand(styles, ":root", `var(${variable})`);
    if (value === `var(${variable})`) continue;
    const first = firstFamily(value);
    if (first.generic !== undefined) continue;
    const key = first.variable ?? first.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const loaded = first.variable
      ? loads.some((item) => item.variable === first.variable)
      : loads.some((item) => item.family?.toLowerCase() === key);
    if (loaded) continue;
    const shown = first.variable ? `var(${first.variable})` : `"${first.name}"`;
    // A package the stylesheet imports and nobody installed here may be what loads it: the
    // sentence says what could not be read, and what to run, instead of that nothing loads it.
    const missing = loads.filter((item) => item.missing).map((item) => item.missing);
    if (missing.length > 0) {
      const which = missing.length === 1 ? "the package" : "the packages";
      const verb = missing.length === 1 ? "is" : "are";
      found.push(
        `${variable} in ${stylesheet} names the typeface ${shown}, and nothing read here loads it: ${which} ${missing.join(", ")}, which ${stylesheet} imports, ${verb} not installed here, so what ${missing.length === 1 ? "it loads" : "they load"} could not be read. Install the repository's packages, then run the gate again`,
      );
      continue;
    }
    found.push(
      `${variable} in ${stylesheet} names the typeface ${shown}, and nothing in the repository loads it: ${fonts?.say ?? "nothing was read"}. Load it, or choose the floor's font or the system font`,
    );
  }
  return found;
}

// The stylesheet with one more declaration naming a typeface nothing loads: the changed copy the
// check is seen failing on.
export const unloadedCopy = (css, variable) =>
  `${css}\n${values.fonts.block} {\n  ${variable}: "Changed Copy Typeface", sans-serif;\n}\n`;
