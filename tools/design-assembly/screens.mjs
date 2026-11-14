// What a kind of screen is, read from source: the page each kind has, which kind every screen
// belongs to, the real screen each kind names as its reference, and the screen sizes pages are
// checked at.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { CORE_STATES, listedScreens, readScreens, REGISTRY } from "./patterns.mjs";
import { builtScreens, readScreenLedger, SCREEN_LEDGER } from "./screen-ledger.mjs";
import { readYaml } from "./yaml.mjs";

// One page per kind of screen. The folder and the front matter are the ones the acceptance kit
// reads, so a repository keeps one page for both tools; the keys are in the kit's own language.
export const KINDS_FOLDER = "design/patterns";
const KEY = {
  kind: "nhom", // the kind's name, equal to the file name
  task: "nhan_viec", // the main task of a person on a screen of this kind
  files: "nhan_dien", // globs of the source files that draw a screen of this kind
  reference: "mau_dang_chay", // { tep }: the source file of the kind's reference screen
  file: "tep",
  exceptions: "ngoai_le", // [{ tep, khoi?, ly_do }]: without `khoi`, the file leaves the kind
  part: "khoi",
  why: "ly_do",
};
// Files in the folder that are not a kind of screen.
const NOT_A_KIND = ["README.md", "lech-lot.md"];

// The file a person owns: the widths every page is checked at.
export const SIZES_FILE = "design/screen-sizes.json";
// The browser test this tool installs, which reads that file.
export const PAGES_TEST = "tests/e2e/templates.spec.ts";
// WCAG 2.2, reflow: a page must work at a width of 320 CSS pixels.
export const REFLOW_WIDTH = 320;
export const STARTER_WIDTHS = [REFLOW_WIDTH, 1440];

// Every page of the folder, by path.
export function readPages(root, folder = KINDS_FOLDER) {
  const full = path.join(root, folder);
  if (!existsSync(full)) return {};
  const found = {};
  for (const name of readdirSync(full).sort()) {
    if (!name.endsWith(".md") || NOT_A_KIND.includes(name)) continue;
    found[path.posix.join(folder, name)] = readFileSync(path.join(full, name), "utf8");
  }
  return found;
}

// The front matter of a page as data, or null when the page has none. Reads the block style and
// the one-line style of YAML that such pages use; nothing here depends on a YAML library.
export function frontMatter(text) {
  const found = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/.exec(text ?? "");
  return found ? readYaml(found[1]) : null;
}

const list = (value) => (Array.isArray(value) ? value : value ? [value] : []);

// Each kind of screen a repository describes: its name, its main task, the files of its screens
// and the file of its reference screen.
export function readKinds(pages) {
  return Object.entries(pages).map(([file, text]) => {
    const data = frontMatter(text) ?? {};
    const named = data[KEY.files];
    // A list of globs, or a map that keeps the list under its file key.
    const globs = list(Array.isArray(named) ? named : named?.[KEY.file]).filter(
      (glob) => typeof glob === "string",
    );
    const exceptions = list(data[KEY.exceptions]).filter(
      (item) => item && typeof item === "object",
    );
    const left = exceptions
      .filter((item) => !list(item[KEY.part]).length)
      .map((item) => item[KEY.file]);
    // An exception is a departure on purpose: it says why.
    const unexplained = exceptions
      .filter((item) => typeof item[KEY.why] !== "string" || item[KEY.why].trim() === "")
      .map((item) => String(item[KEY.file] ?? "an unnamed file"));
    return {
      file,
      name: path.posix.basename(file, ".md"),
      kind: typeof data[KEY.kind] === "string" ? data[KEY.kind] : "",
      task: typeof data[KEY.task] === "string" ? data[KEY.task].trim() : "",
      globs,
      left,
      exceptions: exceptions.length,
      unexplained,
      reference:
        typeof data[KEY.reference] === "object" ? (data[KEY.reference][KEY.file] ?? "") : "",
    };
  });
}

// A glob as a pattern: `**` crosses folders, `*` and `?` stay inside one.
export function globPattern(glob) {
  let pattern = "";
  for (let i = 0; i < glob.length; i += 1) {
    const c = glob[i];
    if (c === "*" && glob[i + 1] === "*") {
      const folders = glob[i + 2] === "/";
      pattern += folders ? "(?:.*/)?" : ".*";
      i += folders ? 2 : 1;
    } else if (c === "*") pattern += "[^/]*";
    else if (c === "?") pattern += "[^/]";
    else pattern += c.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`^${pattern}$`);
}

const belongs = (kind, file) =>
  !kind.left.includes(file) && kind.globs.some((glob) => globPattern(glob).test(file));

// Whether a source file draws a screen of one of the kinds the pages describe.
export function ofAKind(pages) {
  const kinds = readKinds(pages ?? {});
  return (file) => kinds.some((kind) => belongs(kind, file));
}

// Each screen with the source file that draws it: the module its `load` imports in the code that
// lists the screens. Its path and states come from the ledger of screens where there is one.
// `sources` are the source files there are, by path; the file is null when none can be told.
export function screenFiles(registryText, sources, ledgerText = null) {
  const text = registryText ?? "";
  const starts = [...text.matchAll(/\bpath:\s*["']([^"']+)["']/g)];
  return listedScreens(text, ledgerText).map((screen) => {
    const at = starts.findIndex((start) => start[1] === screen.path);
    if (at === -1) return { ...screen, file: null };
    const slice = text.slice(starts[at].index, starts[at + 1]?.index ?? text.length);
    // Not named `module`: a host's lint may forbid that name, and this file lives in the host.
    const imported = /\bimport\(\s*["']([^"']+)["']\s*\)/.exec(slice)?.[1];
    if (!imported) return { ...screen, file: null };
    const base = imported.startsWith("@/")
      ? `src/${imported.slice(2)}`
      : path.posix.join("src", imported);
    const tries = [base, `${base}.tsx`, `${base}.jsx`, `${base}/index.tsx`, `${base}/index.jsx`];
    return { ...screen, file: tries.find((file) => file in sources) ?? null };
  });
}

// Why the screens are not each of one described kind, or null.
export function kindsProblem(
  pages,
  registryText,
  sources,
  folder = KINDS_FOLDER,
  ledgerText = null,
) {
  const kinds = readKinds(pages);
  if (kinds.length === 0) return `no page under ${folder} describes a kind of screen`;
  const found = [];
  for (const kind of kinds) {
    const missing = [
      ...(kind.kind ? [] : [KEY.kind]),
      ...(kind.task ? [] : [`${KEY.task}: the main task`]),
      ...(kind.globs.length > 0 ? [] : [`${KEY.files}: the files of its screens`]),
    ];
    if (kind.unexplained.length > 0) {
      found.push(
        `${kind.file} leaves out ${kind.unexplained.join(", ")} without a reason (${KEY.why})`,
      );
    }
    if (missing.length > 0) found.push(`${kind.file} has no ${missing.join(", no ")}`);
    else if (kind.kind !== kind.name) {
      found.push(`${kind.file} names the kind ${kind.kind}, not ${kind.name} as its file does`);
    }
  }
  const screens = screenFiles(registryText, sources, ledgerText);
  if (screens.length === 0) found.push("no screen is listed, so no screen is measured");
  for (const screen of screens) {
    if (screen.file === null) {
      found.push(`${screen.path}: cannot tell which file draws it`);
      continue;
    }
    const of = kinds.filter((kind) => belongs(kind, screen.file));
    if (of.length === 0) {
      found.push(
        `${screen.path} (${screen.file}) is of no kind: add its file to the page of its kind, or describe a new kind`,
      );
    } else if (of.length > 1) {
      found.push(`${screen.path} (${screen.file}) is of ${of.map((k) => k.name).join(" and ")}`);
    }
  }
  return found.length > 0 ? found.slice(0, 5).join("; ") : null;
}

// Why a kind's reference screen cannot stand as one, or null. It is a real screen of the registry,
// of that kind, and it declares every state a view of data has.
export function referenceProblem(pages, registryText, statesText, sources, ledgerText = null) {
  const kinds = readKinds(pages);
  if (kinds.length === 0) return "no kind of screen is described, so no reference is measured";
  let table;
  try {
    table = JSON.parse(statesText ?? "{}");
  } catch {
    table = {};
  }
  const required = table.required ?? CORE_STATES;
  const screens = screenFiles(registryText, sources, ledgerText);
  const found = [];
  for (const kind of kinds) {
    if (!kind.reference) {
      found.push(`${kind.file} names no reference screen (${KEY.reference}.${KEY.file})`);
      continue;
    }
    const screen = screens.find((item) => item.file === kind.reference);
    if (!screen) {
      found.push(`${kind.file}: ${kind.reference} is not the file of a listed screen`);
    } else if (!belongs(kind, kind.reference)) {
      found.push(`${kind.file}: ${kind.reference} is not of the kind ${kind.name}`);
    } else if (screen.path in (table.exempt ?? {})) {
      found.push(`${kind.file}: ${screen.path} is excused from the states, so it shows none`);
    } else {
      const missing = required.filter((state) => !screen.states.includes(state));
      if (missing.length > 0) {
        found.push(`${kind.file}: ${screen.path} declares no state named ${missing.join(", ")}`);
      }
    }
  }
  return found.length > 0 ? found.slice(0, 5).join("; ") : null;
}

// Why the screen sizes are not ones pages are checked at, or null.
export function sizesProblem(sizesText, testText, file = SIZES_FILE, test = PAGES_TEST) {
  if (sizesText === null || sizesText === undefined) return `${file} is missing`;
  let widths;
  try {
    widths = JSON.parse(sizesText).widths;
  } catch {
    return `${file} is not valid JSON`;
  }
  if (!Array.isArray(widths) || widths.length === 0) return `${file} lists no width`;
  if (widths.some((width) => !Number.isInteger(width) || width <= 0)) {
    return `${file}: every width is a whole number of CSS pixels`;
  }
  if (Math.min(...widths) > REFLOW_WIDTH) {
    return `${file}: the narrowest width is ${Math.min(...widths)}px, and a page must work at ${REFLOW_WIDTH}px`;
  }
  if (testText === null || testText === undefined) {
    return `${test} is missing, so no page is checked at these widths`;
  }
  // What the test does, not what its comments say: it opens the file and goes through its widths.
  const code = testText.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  if (!code.includes(path.posix.basename(file))) {
    return `${test} does not read ${file}, so pages are not checked at these widths`;
  }
  // The list itself, read off what was parsed: a type that only names the field is not a use.
  if (!/\.widths\b/.test(code)) {
    return `${test} reads ${file} and does not go through its widths, so pages are not checked at them`;
  }
  return null;
}

// Why the ledger of screens and the code that lists them do not agree, or null: the same screens
// at the same paths, no id or path twice, and every family the page of a kind.
export function screenLedgerProblem(ledgerText, registryText, pages, ledgerFile = SCREEN_LEDGER) {
  if (ledgerText === null || ledgerText === undefined) return `${ledgerFile} is missing`;
  const ledger = readScreenLedger(ledgerText);
  const found = [];
  const twice = (values) => values.filter((value, index) => values.indexOf(value) !== index);
  for (const id of new Set(twice(ledger.screens.map((screen) => screen.id)))) {
    found.push(`${ledgerFile} lists the id ${id} twice`);
  }
  for (const route of new Set(twice(ledger.screens.map((screen) => screen.route)))) {
    found.push(`${ledgerFile} lists the route ${route} twice`);
  }
  const listed = builtScreens(ledger).map((screen) => screen.path);
  const coded = readScreens(registryText ?? "").map((screen) => screen.path);
  for (const route of coded.filter((item) => !listed.includes(item))) {
    found.push(`${route} is a screen of ${REGISTRY} and not a built screen of ${ledgerFile}`);
  }
  for (const route of listed.filter((item) => !coded.includes(item))) {
    found.push(`${route} is a built screen of ${ledgerFile} and not a screen of ${REGISTRY}`);
  }
  const kinds = readKinds(pages ?? {}).map((kind) => kind.kind);
  const families = ledger.families ? Object.keys(ledger.families) : null;
  for (const screen of ledger.screens) {
    const family = screen.family ?? null;
    if (family === null) continue;
    if (families && !families.includes(family)) {
      found.push(`${screen.id}: the family ${family} is not one of the ledger's families`);
    } else if (kinds.length > 0 && !kinds.includes(family)) {
      found.push(`${screen.id}: the family ${family} is the kind of no page under ${KINDS_FOLDER}`);
    }
  }
  return found.length > 0 ? found.slice(0, 5).join("; ") : null;
}

// A first ledger of screens, read from the code that lists them: what the guide writes once, for
// a person to keep from then on. A title is the key of the words it takes; the family is the kind
// whose page covers the screen's file. States built by a function cannot be read here: such a
// screen gets none, and the repository's own test names what is missing.
export function ledgerFromCode(registryText, pages, sources) {
  const text = registryText ?? "";
  const kinds = readKinds(pages ?? {});
  const starts = [...text.matchAll(/\bpath:\s*["']([^"']+)["']/g)];
  const taken = new Set();
  const screens = screenFiles(text, sources ?? {}).map((screen, index) => {
    const slice = text.slice(starts[index].index, starts[index + 1]?.index ?? text.length);
    const key = /\btitle:\s*[A-Z_]+\.(\w+)/.exec(slice)?.[1];
    const literal = /\btitle:\s*["']([^"']+)["']/.exec(slice)?.[1];
    const stem = screen.file ? path.posix.basename(screen.file).replace(/\.[jt]sx?$/, "") : "";
    const named = stem
      .replace(/Screen$/, "")
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase();
    let id = named || screen.path.replace(/^\/|\/$/g, "").replace(/\//g, "-") || "home";
    while (taken.has(id)) id = `${id}-2`;
    taken.add(id);
    const kind = screen.file ? kinds.find((item) => belongs(item, screen.file)) : null;
    return {
      id,
      route: screen.path,
      title: key ?? literal ?? null,
      family: kind?.kind ?? null,
      status: "built",
      states: screen.states,
    };
  });
  return { screens };
}
