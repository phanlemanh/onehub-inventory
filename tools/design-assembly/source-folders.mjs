// Where a package keeps its screens and components: one answer every reader of the source asks, so
// the audit, the status, the store's commands, the component manifest and the checks that walk
// source files cannot disagree. Asked in this order:
//   1. the tool data's own word: `source_folder` in design/theme.json, a folder of the package;
//   2. the package's own settings: the folder its TypeScript settings map the import prefix of its
//      components to (the prefix its component settings write, else `@/`);
//   3. the usual folder, `src`.
// The answer is one folder, which may be the package's root itself (`.`). Walking the root leaves out
// what is never the package's source: hidden folders, installed packages, the outputs of a build and
// this tool's own copy.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { adapterOf } from "./adapters/index.mjs";

export const DEFAULT_FOLDER = "src";
// The key of the tool data that declares the folder.
export const SOURCE_KEY = "source_folder";
const THEME = "design/theme.json";
const SETTINGS = "tsconfig.json";
// Walking the package's root, these are never its own source: installed packages, the outputs of a
// build or a test run, and this tool's copy of itself.
const NOT_SOURCE = new Set(["node_modules", "dist", "build", "out", "coverage", "test-results"]);
const TOOL = "tools/design-assembly";

const library = adapterOf("components");

const readText = (root, file) => {
  const full = path.join(root, file);
  return existsSync(full) && statSync(full).isFile() ? readFileSync(full, "utf8") : null;
};

// The text with its comments taken out, a comment being one outside a string: a glob in quotes,
// `**/*.tsx`, holds the signs of one.
function withoutComments(text) {
  let code = "";
  let quote = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quote) {
      code += c;
      if (c === "\\") code += text[++i] ?? "";
      else if (c === '"') quote = false;
    } else if (c === '"') {
      quote = true;
      code += c;
    } else if (c === "/" && text[i + 1] === "*") {
      const close = text.indexOf("*/", i + 2);
      i = close === -1 ? text.length : close + 1;
    } else if (c === "/" && text[i + 1] === "/") {
      const close = text.indexOf("\n", i);
      i = close === -1 ? text.length : close - 1;
    } else code += c;
  }
  return code;
}

// Settings that may hold comments and a comma after the last entry, which JSON does not, or null.
export function readLoose(text) {
  if (text === null) return null;
  try {
    return JSON.parse(withoutComments(text).replace(/,(\s*[}\]])/g, "$1"));
  } catch {
    return null;
  }
}

// A folder named inside the package, as the package writes it: `.` for its root. Null when it
// leaves the package or is not a folder there.
function inside(root, folder) {
  if (typeof folder !== "string" || folder.trim() === "" || path.isAbsolute(folder)) return null;
  const plain = path.posix.normalize(folder.replace(/\/+$/, "")) || ".";
  if (plain === ".." || plain.startsWith("../")) return null;
  const full = path.join(root, plain);
  return existsSync(full) && statSync(full).isDirectory() ? plain : null;
}

// Every `prefix/*` the package's TypeScript settings map to one folder, as [prefix, folder].
export function settingsPrefixes(root) {
  const options = readLoose(readText(root, SETTINGS))?.compilerOptions ?? {};
  const from = typeof options.baseUrl === "string" ? options.baseUrl : ".";
  const found = [];
  for (const [key, targets] of Object.entries(options.paths ?? {})) {
    const target = Array.isArray(targets) ? targets[0] : null;
    if (!key.endsWith("/*") || typeof target !== "string" || !target.endsWith("/*")) continue;
    const folder = path.posix.normalize(path.posix.join(from, target.slice(0, -2))) || ".";
    found.push([key.slice(0, -1), folder]);
  }
  return found;
}

// The prefix a screen imports the package's own components with: the one its component settings
// write, else `@/`.
function ownPrefix(root) {
  const settings = readLoose(readText(root, library.settingsFile));
  const alias = settings?.aliases?.components;
  const at = typeof alias === "string" ? alias.indexOf("/") : -1;
  return at > 0 ? alias.slice(0, at + 1) : "@/";
}

// Where the package keeps its screens and components, and how that was learnt: `{ folder, from,
// said }`. `from` is `declared`, `settings` or `default`; `said` says it in words. A declaration
// that names no folder of the package is set aside, and `ignored` says why.
export function sourceFolder(root) {
  const theme = readLoose(readText(root, THEME));
  const declared = theme?.[SOURCE_KEY];
  let ignored = null;
  if (declared !== undefined) {
    const folder = inside(root, declared);
    if (folder !== null) {
      return { folder, from: "declared", said: `${SOURCE_KEY} in ${THEME} names it` };
    }
    ignored = `${SOURCE_KEY} in ${THEME} is ${JSON.stringify(declared)}, which is no folder of the package, so it is set aside`;
  }
  const prefix = ownPrefix(root);
  const mapped = settingsPrefixes(root).find(([known]) => known === prefix);
  const folder = mapped ? inside(root, mapped[1]) : null;
  if (folder !== null) {
    const where = folder === "." ? "the package's root" : folder;
    return {
      folder,
      from: "settings",
      said: `${SETTINGS} maps ${prefix} to ${where}`,
      ...(ignored ? { ignored } : {}),
    };
  }
  return {
    folder: DEFAULT_FOLDER,
    from: "default",
    said: `the usual folder`,
    ...(ignored ? { ignored } : {}),
  };
}

// The prefixes a screen imports with, each as the folder it stands for, ended by a slash (empty for
// the package's root): `@/` first, at the source folder, then every other the settings map.
export function importPrefixes(root, answer = sourceFolder(root)) {
  const slash = (folder) => (folder === "." ? "" : `${folder}/`);
  const found = [["@/", slash(answer.folder)]];
  for (const [prefix, folder] of settingsPrefixes(root)) {
    if (!found.some(([known]) => known === prefix)) found.push([prefix, slash(folder)]);
  }
  return found;
}

// A path a screen imports, as a file path of the package, or null when no prefix is known.
export function throughPrefixes(spec, prefixes) {
  const hit = prefixes.find(([prefix]) => spec.startsWith(prefix));
  return hit ? `${hit[1]}${spec.slice(hit[0].length)}` : null;
}

// Whether a walk from `folder` leaves an entry out. Only a walk from the package's root leaves
// anything out: a folder of the package's own is read whole, as it always was.
export function leftOut(folder, relative) {
  if (folder !== ".") return false;
  const name = path.posix.basename(relative);
  return (
    name.startsWith(".") ||
    NOT_SOURCE.has(name) ||
    relative === TOOL ||
    relative.startsWith(`${TOOL}/`)
  );
}

// The folders right under the source folder that hold the given files, for saying where a reader
// read. Under `src` this is `src`, as before.
export function foldersRead(answer, files) {
  if (answer.folder !== ".") return [answer.folder];
  const tops = files.filter((file) => file.includes("/")).map((file) => file.split("/")[0]);
  return [...new Set(tops)].sort();
}

// One phrase that says which folders were read and how the plugin knew, or null for the usual
// `src`, which every reader has always read without saying so.
export function sourceSaid(answer, files) {
  if (answer.folder === DEFAULT_FOLDER) return null;
  const folders = foldersRead(answer, files);
  const named = folders.length > 0 ? folders.join(", ") : answer.folder;
  return `${named} (${answer.said})`;
}

// Every file under the source folder a test keeps, by path from the package's root.
export function walkSource(root, folder, keep) {
  const found = [];
  const walk = (dir) => {
    const full = path.join(root, dir);
    if (!existsSync(full) || !statSync(full).isDirectory()) return;
    for (const name of readdirSync(full).sort()) {
      const relative = path.posix.join(dir, name);
      if (leftOut(folder, relative)) continue;
      if (statSync(path.join(root, relative)).isDirectory()) walk(relative);
      else if (keep(relative)) found.push(relative);
    }
  };
  walk(folder);
  return found;
}
