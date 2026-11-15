// The component manifest: the components the source exports and the variants each one declares,
// in the registry format the acceptance kit reads. It is derived: a component is changed in its
// source file, and this file is written again from the source.
// Usage: node tools/design-assembly/components.mjs [--write] [--target DIR]
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { argv, cwd, exit, stderr, stdout } from "node:process";
import { fileURLToPath } from "node:url";

import { adapter as library } from "./adapters/shadcn.mjs";
import { newerProblem } from "./contract.mjs";
import { lineWidth, renderJson } from "./json.mjs";
import { frontMatter, readPages } from "./screens.mjs";

// The file a repository gets when nothing names another one, and the folder read by default.
export const REGISTRY = "design/component-registry.json";
export const COMPONENTS_FOLDER = library.folder;
// The id of the decision that this file says what the source says.
export const COMPONENTS_DECISION = "component-manifest";
// The shape of the file: the acceptance kit reads the version as a string.
const VERSION = "2";

// The folders of every component library the repository installed: the library's own, then the
// folder of each other registry its settings name, when that folder is there.
export function libraryFolders(root) {
  const file = path.join(root, library.settingsFile);
  let settings;
  try {
    settings = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
  } catch {
    settings = null;
  }
  const others = library
    .registryFoldersIn(settings)
    .filter((folder) => existsSync(path.join(root, folder)));
  return [library.folderIn(settings) ?? library.folder, ...others];
}

// A folder of templates: the frames screens are built in, whatever they import.
const TEMPLATES = /(^|\/)templates\//;

// Where a repository keeps components of its own beside the library's: the folder that holds the
// library's folder, when the library sits in a folder named for it.
export function ownFolder(folder) {
  return path.posix.basename(folder) === "ui" ? path.posix.dirname(folder) : null;
}

// Every source file of a folder, by path from the repository root.
export function readFolder(root, folder) {
  const found = {};
  const walk = (dir) => {
    const full = path.join(root, dir);
    if (!existsSync(full)) return;
    for (const name of readdirSync(full).sort()) {
      const relative = path.posix.join(dir, name);
      if (statSync(path.join(root, relative)).isDirectory()) walk(relative);
      else if (/\.[jt]sx$/.test(name))
        found[relative] = readFileSync(path.join(root, relative), "utf8");
    }
  };
  walk(folder);
  return found;
}

// The index just past the string that opens at `at`, so that braces inside class names and
// template text are never counted.
function skipString(text, at) {
  const quote = text[at];
  for (let i = at + 1; i < text.length; i += 1) {
    if (text[i] === "\\") i += 1;
    else if (text[i] === quote) return i + 1;
  }
  return text.length;
}

// The text with every comment blanked out, strings left as they are: a comment is never read as
// structure, and every index stays where it was.
export function withoutComments(text) {
  let out = "";
  let i = 0;
  while (i < text.length) {
    const char = text[i];
    if (char === '"' || char === "'" || char === "`") {
      const end = skipString(text, i);
      out += text.slice(i, end);
      i = end;
    } else if (char === "/" && text[i + 1] === "/") {
      const end = text.indexOf("\n", i);
      const stop = end === -1 ? text.length : end;
      out += " ".repeat(stop - i);
      i = stop;
    } else if (char === "/" && text[i + 1] === "*") {
      const end = text.indexOf("*/", i + 2);
      const stop = end === -1 ? text.length : end + 2;
      out += text.slice(i, stop).replace(/[^\n]/g, " ");
      i = stop;
    } else {
      out += char;
      i += 1;
    }
  }
  return out;
}

// The index of the bracket that closes the one at `at`.
export function closing(text, at) {
  const pairs = { "{": "}", "(": ")", "[": "]" };
  const stack = [];
  for (let i = at; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"' || char === "'" || char === "`") {
      i = skipString(text, i) - 1;
    } else if (pairs[char]) stack.push(pairs[char]);
    else if (char === stack.at(-1)) {
      stack.pop();
      if (stack.length === 0) return i;
    }
  }
  return -1;
}

// The entries of the object literal that opens at `at`: each key with the text of its value.
function entries(text, at) {
  const end = closing(text, at);
  const found = [];
  let i = at + 1;
  while (i < end) {
    const key = /^\s*(?:"([^"]+)"|'([^']+)'|([A-Za-z_$][\w$]*))\s*:/.exec(text.slice(i, end));
    if (!key) break;
    let stop = i + key[0].length;
    const from = stop;
    while (stop < end && text[stop] !== ",") {
      const char = text[stop];
      if (char === '"' || char === "'" || char === "`") stop = skipString(text, stop);
      else if ("{([".includes(char)) stop = closing(text, stop) + 1;
      else stop += 1;
    }
    found.push({ key: key[1] ?? key[2] ?? key[3], value: text.slice(from, stop).trim() });
    i = stop + 1;
  }
  return found;
}

// The text of every string literal in a piece of source, joined: the class names it carries.
export function literals(text) {
  const found = [];
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '"' || text[i] === "'" || text[i] === "`") {
      const end = skipString(text, i);
      found.push(text.slice(i + 1, end - 1));
      i = end - 1;
    }
  }
  return found.join(" ");
}

// Elements a person points at and activates: the native ones, and the parts of a primitives
// library that render one.
const CONTROLS = new Set(
  "button input select textarea a summary Button Input Textarea Trigger Item Close Checkbox Radio Switch Tab Toggle Thumb Link Option CheckboxItem RadioItem Increment Decrement".split(
    " ",
  ),
);
// Prefixes that size something else than the element itself: a descendant, or a pseudo-element.
const NOT_ITSELF = /^(\[&|\*+$|(file|placeholder|before|after|marker|selection|backdrop)$)/;
const SPACING_UNIT_PX = 4;

// A class name split at its colons, leaving the colons inside brackets alone.
export function parts(token) {
  const found = [];
  let depth = 0;
  let from = 0;
  for (let i = 0; i < token.length; i += 1) {
    if ("[(".includes(token[i])) depth += 1;
    else if ("])".includes(token[i])) depth -= 1;
    else if (token[i] === ":" && depth === 0) {
      found.push(token.slice(from, i));
      from = i + 1;
    }
  }
  return [...found, token.slice(from)];
}

// The heights a list of class names gives the element itself, in CSS pixels. A pseudo-element
// placed around the element with a negative inset (`after:absolute after:-inset-y-2`) takes the
// pointer for it, so it adds to the height a person can hit.
function heights(classes) {
  const found = [];
  let grown = null;
  for (const token of classes.split(/\s+/).filter(Boolean)) {
    const pieces = parts(token);
    const utility = pieces.at(-1).replace(/^!|!$/g, "");
    const prefixes = pieces.slice(0, -1);
    const around = /^-inset(?:-y)?-(\d+(?:\.\d+)?)$/.exec(utility);
    if (around && prefixes.length === 1 && /^(before|after)$/.test(prefixes[0])) {
      const px = 2 * Number(around[1]) * SPACING_UNIT_PX;
      if (grown === null || px > grown.px) grown = { token, px };
      continue;
    }
    if (prefixes.some((prefix) => NOT_ITSELF.test(prefix))) continue;
    const step = /^(?:h|size|min-h)-(\d+(?:\.\d+)?)$/.exec(utility);
    const exact = /^(?:h|size|min-h)-\[(\d+(?:\.\d+)?)(px|rem)\]$/.exec(utility);
    if (step) found.push({ token, px: Number(step[1]) * SPACING_UNIT_PX });
    else if (exact) found.push({ token, px: Number(exact[1]) * (exact[2] === "rem" ? 16 : 1) });
  }
  if (grown === null) return found;
  return found.map((item) => ({ token: `${item.token} ${grown.token}`, px: item.px + grown.px }));
}

// The attributes of a JSX opening tag: the text from just after its name to the `>` that closes
// it, with braces and strings read as such.
export function openingTag(source, from) {
  let depth = 0;
  let end = from;
  for (; end < source.length; end += 1) {
    const char = source[end];
    if (char === '"' || char === "'" || char === "`") end = skipString(source, end) - 1;
    else if (char === "{") depth += 1;
    else if (char === "}") depth -= 1;
    else if (char === ">" && depth === 0) break;
  }
  return source.slice(from, end);
}

// The element a component renders, by the name its library gives it, and the class names written
// on that element.
function rendered(source, text) {
  const root = /return\s*\(?\s*<([A-Za-z][\w.]*)/.exec(source);
  if (!root) return null;
  const [head, ...members] = root[1].split(".");
  const alias = new RegExp(`\\b(\\w+)\\s+as\\s+${head}\\b`).exec(text);
  // `Root` names no kind of element: the library's own name does (`CheckboxPrimitive.Root` is a
  // checkbox).
  const part = members.at(-1);
  const library = alias?.[1] ?? head.replace(/Primitives?$/, "");
  return {
    element: part === undefined || part === "Root" ? library : part,
    tag: openingTag(source, root.index + root[0].length),
  };
}

// Variant axes declared with the library's helper for variant sets, as its adapter reads them.
function declaredSets(text) {
  const sets = {};
  for (const match of text.matchAll(library.variantSet)) {
    const open = match.index + match[0].length - 1;
    const call = text.slice(open, closing(text, open) + 1);
    // The options are the object after the base classes: the first brace outside a string.
    let at = 1;
    while (at < call.length && call[at] !== "{") {
      at = "\"'`".includes(call[at]) ? skipString(call, at) : at + 1;
    }
    if (at >= call.length) continue;
    const options = Object.fromEntries(entries(call, at).map((item) => [item.key, item.value]));
    const axes = {};
    // The classes of the set, by where they apply: its base, then each `axis=value`.
    const classes = { "its own classes": literals(call.slice(0, at)) };
    for (const axis of options.variants ? entries(options.variants, 0) : []) {
      const values = entries(axis.value, 0);
      axes[axis.key] = values.map((item) => item.key);
      for (const item of values) classes[`${axis.key}=${item.key}`] = literals(item.value);
    }
    const defaults = {};
    for (const item of options.defaultVariants ? entries(options.defaultVariants, 0) : []) {
      const value = /^["']([^"']+)["']$/.exec(item.value);
      if (value) defaults[item.key] = value[1];
    }
    sets[match[1]] = { axes, defaults, classes };
  }
  return sets;
}

// Names a file exports that are components: they start with a capital letter.
function exported(text) {
  const names = [];
  for (const list of text.matchAll(/^export\s*\{([^}]*)\}/gm)) {
    for (const item of list[1].split(",")) {
      const name = item
        .trim()
        .split(/\s+as\s+/)
        .at(-1);
      if (name) names.push(name);
    }
  }
  for (const direct of text.matchAll(/^export\s+(?:default\s+)?(?:function|const)\s+(\w+)/gm)) {
    names.push(direct[1]);
  }
  // A name in capitals throughout is a constant, not a component.
  return [...new Set(names)].filter(
    (name) => /^[A-Z]/.test(name) && !/^[A-Z][A-Z0-9_]*$/.test(name),
  );
}

// The source of one component: from its declaration to the next declaration at the left margin.
function declaration(text, name) {
  const start = new RegExp(
    `^(?:export\\s+)?(?:function\\s+${name}\\b|const\\s+${name}\\s*=)`,
    "m",
  ).exec(text);
  if (!start) return "";
  const rest = text.slice(start.index + start[0].length);
  const next = /^(?:export\b|function\b|const\b)/m.exec(rest);
  return start[0] + (next ? rest.slice(0, next.index) : rest);
}

// Reads every source file once: the manifest, and the heights the controls declare.
// The files a file imports among the given ones: `@/` is the source folder, and a relative path
// is read from the file's own folder.
function importsAmong(file, text, files) {
  const found = new Set();
  for (const match of text.matchAll(/(?:from|import)\s*\(?\s*["']([^"']+)["']/g)) {
    const spec = match[1];
    let base;
    if (spec.startsWith("@/")) base = `src/${spec.slice(2)}`;
    else if (spec.startsWith(".")) base = path.posix.join(path.posix.dirname(file), spec);
    else continue;
    const hit = ["", ".tsx", ".ts", ".jsx", ".js", "/index.tsx", "/index.ts"]
      .map((end) => `${base}${end}`)
      .find((candidate) => candidate !== file && candidate in files);
    if (hit) found.add(hit);
  }
  return [...found];
}

// A file's atomic level, computed and never declared: how deep it imports other components. None
// is an atom, one step a molecule, two or more an organism. A file in a folder of templates is a
// template, and so is a component a page of a screen kind names as the frame of its screens.
function levels(files) {
  const depth = new Map();
  const visit = (file, seen) => {
    if (depth.has(file)) return depth.get(file);
    if (seen.has(file)) return 0;
    const next = new Set(seen).add(file);
    const below = importsAmong(file, files[file], files).map((other) => visit(other, next));
    const value = below.length === 0 ? 0 : 1 + Math.max(...below);
    depth.set(file, value);
    return value;
  };
  return (file) =>
    TEMPLATES.test(file)
      ? "template"
      : ["atom", "molecule", "organism"][Math.min(visit(file, new Set()), 2)];
}

// The components the pages of screen kinds name as the frame of their screens.
export function templateNames(pages) {
  return new Set(
    Object.values(pages ?? {})
      .map((text) => frontMatter(text)?.khuon?.ten)
      .filter((name) => typeof name === "string"),
  );
}

// The props a component's signature names one by one, in its order: the names a caller writes,
// from the object its first parameter takes apart. Props taken whole name none.
function propsOf(signature) {
  const open = /^[^(]*\(\s*(?:function\s*\w*\s*\(\s*|\(\s*)?\{/.exec(signature);
  if (!open) return [];
  const at = open.index + open[0].length - 1;
  const end = closing(signature, at);
  if (end === -1) return [];
  const names = [];
  let from = at + 1;
  let depth = 0;
  for (let i = from; i <= end; i += 1) {
    const char = signature[i];
    if (char === '"' || char === "'" || char === "`") i = skipString(signature, i) - 1;
    else if ("{([".includes(char)) depth += 1;
    else if ("})]".includes(char) && i < end) depth -= 1;
    else if ((char === "," && depth === 0) || i === end) {
      const piece = signature.slice(from, i).trim();
      const name = /^(?:"([^"]+)"|'([^']+)'|([A-Za-z_$][\w$]*))/.exec(piece);
      if (name && !piece.startsWith("...")) names.push(name[1] ?? name[2] ?? name[3]);
      from = i + 1;
    }
  }
  return names;
}

// Props every component takes, which say nothing about this one.
const COMMON_PROPS = new Set(["className", "children"]);

function survey(given, { library, pages } = {}) {
  const libraries = [library].flat().filter(Boolean);
  const files = Object.fromEntries(
    Object.entries(given).map(([file, text]) => [file, withoutComments(text)]),
  );
  const level = levels(files);
  const templates = templateNames(pages);
  // Variant sets by file: a component reads a set of its own file before one of the same name
  // declared elsewhere.
  const setsOf = Object.fromEntries(
    Object.entries(files).map(([file, text]) => [file, declaredSets(text)]),
  );
  const elsewhere = {};
  for (const found of Object.values(setsOf)) {
    for (const [name, set] of Object.entries(found)) elsewhere[name] ??= set;
  }
  const components = [];
  // For each control with a declared height: the smallest one, and where it is declared.
  const sizes = new Map();
  for (const [file, text] of Object.entries(files).sort(([a], [b]) => (a < b ? -1 : 1))) {
    const sets = { ...elsewhere, ...setsOf[file] };
    const names = exported(text);
    for (const name of names) {
      const source = declaration(text, name);
      // The other components of the same file this one is drawn with.
      const drawnWith = names.filter(
        (other) => other !== name && new RegExp(`<${other}\\b`).test(source),
      );
      const signature = source.slice(
        0,
        source.search(/\)\s*(?::[^{]+)?\{|=>/) + 1 || source.length,
      );
      const named = propsOf(signature);
      const axes = {};
      const defaults = {};
      for (const [setName, set] of Object.entries(sets)) {
        if (!new RegExp(`\\b${setName}\\b`).test(source)) continue;
        // A set of another file is this component's only for the axes it takes as props: one it
        // calls with values of its own does not let a caller choose them.
        const own = setName in (setsOf[file] ?? {});
        for (const [axis, values] of Object.entries(set.axes)) {
          if (!own && !named.includes(axis)) continue;
          axes[axis] = values;
          if (axis in set.defaults) defaults[axis] = set.defaults[axis];
        }
      }
      // The axes of a variant set are said once, under variants; a prop typed as a list of words
      // is a prop as well.
      const setAxes = new Set(Object.keys(axes));
      for (const prop of signature.matchAll(/(\w+)\??:\s*((?:"[^"]+"\s*\|\s*)+"[^"]+")/g)) {
        axes[prop[1]] ??= [...prop[2].matchAll(/"([^"]+)"/g)].map((value) => value[1]);
      }
      for (const given of signature.matchAll(/(\w+)\s*=\s*"([^"]+)"/g)) {
        if (given[1] in axes) defaults[given[1]] ??= given[2];
      }
      const props = named.filter((prop) => !COMMON_PROPS.has(prop) && !setAxes.has(prop));
      const variants = Object.entries(axes).flatMap(([axis, values]) =>
        values.map((value) => `${axis}=${value}`),
      );
      // A control's height, where its own classes declare one: on the element it renders, or in
      // a variant set that element calls.
      const root = rendered(source, text);
      const control = root !== null && CONTROLS.has(root.element);
      const measured = [];
      if (control) {
        for (const item of heights(literals(root.tag))) {
          measured.push({ ...item, where: "its own classes" });
        }
        for (const [setName, set] of Object.entries(sets)) {
          if (!new RegExp(`\\b${setName}\\b`).test(root.tag)) continue;
          for (const [where, classes] of Object.entries(set.classes)) {
            for (const item of heights(classes)) measured.push({ ...item, where });
          }
        }
      }
      const smallest = measured.sort((a, b) => a.px - b.px)[0];
      if (smallest) sizes.set(name, smallest);
      components.push({
        name,
        category: "component",
        file,
        level: templates.has(name) ? "template" : level(file),
        source:
          libraries.length === 0 || libraries.some((folder) => file.startsWith(`${folder}/`))
            ? "library"
            : "own",
        ...(drawnWith.length > 0 ? { parts: drawnWith } : {}),
        ...(props.length > 0 ? { props } : {}),
        ...(control ? { control: true } : {}),
        ...(smallest ? { min_height: `${smallest.px}px` } : {}),
        ...(variants.length > 0 ? { variants } : {}),
        ...(Object.keys(defaults).length > 0 ? { defaults } : {}),
      });
    }
  }
  return { manifest: { version: VERSION, components }, sizes };
}

// The manifest for a set of source files: one entry per exported component. A component's
// variants are the axes of the variant sets it calls, and the props it types as a closed list of
// words. Each is written `axis=value`, the form a plan names a variant in. A control is marked,
// with the smallest height its own classes declare.
// `library` is the folder of the component library, so a component outside it is the
// repository's own; `pages` are the pages of screen kinds, which name the templates.
export function readComponents(files, options = {}) {
  return survey(files, options).manifest;
}

// How the controls measure against a target size in CSS pixels: the ones below it, the ones
// measured, and the ones whose height is not in their own classes.
export function targetSizes(files, min) {
  const { manifest, sizes } = survey(files);
  const controls = manifest.components.filter((item) => item.control);
  const label = (name) => {
    const size = sizes.get(name);
    return `${name} (${size.where}: ${size.token}, ${size.px}px)`;
  };
  const measured = controls.filter((item) => sizes.has(item.name)).map((item) => item.name);
  return {
    below: measured.filter((name) => sizes.get(name).px < min).map(label),
    measured,
    smallest: measured.length
      ? label([...measured].sort((a, b) => sizes.get(a).px - sizes.get(b).px)[0])
      : null,
    unmeasured: controls.filter((item) => !sizes.has(item.name)).map((item) => item.name),
  };
}

// Why the controls do not reach a target size, or null. Nothing measured is a problem too: a
// check that measures nothing proves nothing.
export function targetProblem(files, min, folder) {
  const result = targetSizes(files, min);
  if (result.measured.length === 0) {
    return `no control in ${folder} declares a height this tool can read, so no target size is measured`;
  }
  if (result.below.length === 0) return null;
  return `${result.below.join("; ")}: below the ${min}px target size`;
}

// Why the file is not what the source gives, or null. Compared as data. The reason names the
// first components that differ, so a person can see which side moved.
export function componentsProblem(text, files, file, folder, options = {}) {
  const again = "run make design-components to write the file again from the source";
  if (text === null || text === undefined) return `${file} is missing: ${again}`;
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return `${file} is not valid JSON: ${again}`;
  }
  const newer = newerProblem("components", data);
  if (newer) return newer;
  const expected = readComponents(files, options);
  if (JSON.stringify(data) === JSON.stringify(expected)) return null;
  const listed = new Map((data.components ?? []).map((item) => [item.name, JSON.stringify(item)]));
  const found = new Map(expected.components.map((item) => [item.name, JSON.stringify(item)]));
  const differs = [
    ...[...found.keys()]
      .filter((name) => !listed.has(name))
      .map((name) => `${name} is not in the file`),
    ...[...listed.keys()]
      .filter((name) => !found.has(name))
      .map((name) => `${name} is not in the source`),
    ...[...found.keys()]
      .filter((name) => listed.has(name) && listed.get(name) !== found.get(name))
      .map((name) => `${name} differs`),
  ];
  const detail = differs.length > 0 ? ` (${differs.slice(0, 3).join("; ")})` : "";
  return `${file} is not what ${folder} gives${detail}: the source is where a component changes, so ${again}`;
}

function main() {
  const args = argv.slice(2);
  const at = args.indexOf("--target");
  const root = at === -1 ? cwd() : path.resolve(args[at + 1] ?? "");
  const themeFile = path.join(root, "design/theme.json");
  const theme = existsSync(themeFile) ? JSON.parse(readFileSync(themeFile, "utf8")) : null;
  const check = theme?.checks?.[COMPONENTS_DECISION]?.[0];
  // Nothing to manage is not a failure: a repository with a registry of its own runs this
  // command too, and it must not turn its gate red.
  if (!check) {
    stdout.write(
      "design-assembly: this tool manages no component manifest here: the repository has no components to list, or keeps a registry of its own\n",
    );
    exit(0);
  }
  const read = check.own ?? check.folder;
  const files = readFolder(root, read);
  const options = {
    library: [check.folder, ...(check.libraries ?? [])],
    pages: check.pages ? readPages(root, check.pages) : {},
  };
  const manifest = readComponents(files, options);
  const full = path.join(root, check.file);
  const before = existsSync(full) ? readFileSync(full, "utf8") : null;
  const count = `${manifest.components.length} components`;
  const newer = before === null ? null : newerProblem("components", JSON.parse(before));
  if (newer) {
    stderr.write(`component manifest: ${newer}\n`);
    exit(1);
  }
  if (componentsProblem(before, files, check.file, read, options) === null) {
    stdout.write(`component manifest: ${check.file} is up to date (${count})\n`);
    return;
  }
  if (!args.includes("--write")) {
    stderr.write(`component manifest: ${check.file} is not what ${read} gives\n`);
    exit(1);
  }
  mkdirSync(path.dirname(full), { recursive: true });
  writeFileSync(full, renderJson(manifest, lineWidth(root)));
  stdout.write(`component manifest: wrote ${check.file} from ${read} (${count})\n`);
}

if (argv[1] && realpathSync(argv[1]) === realpathSync(fileURLToPath(import.meta.url))) main();
