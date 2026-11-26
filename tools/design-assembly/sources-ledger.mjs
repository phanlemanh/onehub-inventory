// The ledger of outside sources: which libraries a repository picks blocks from, in what order, at
// which pin, and where the list of what each one offers is kept. One file per source,
// `design/sources/<id>.json`, so that pinning one source again writes that file alone.
//
// Nothing here fetches. A source is pinned by the repository's own tool or by a person; this reads
// the pin, compares the snapshot it names with the hashes it records, and reads the catalog. A
// source that cannot be read this way is said to be unreadable, with why, and offers nothing.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";

import { pinnedPackage } from "./adapters/lockfile.mjs";

export const SOURCES_FOLDER = "design/sources";
export const SOURCES_VERSION = 1;
// The kind of source that is a font: where it comes from, its pin and its licence. A source with
// no kind, or with a kind this plugin gives no meaning, is a library blocks are picked from.
export const FONT_KIND = "font";

const isMap = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const text = (value) => (typeof value === "string" ? value : undefined);
const filled = (value) => typeof value === "string" && value.trim() !== "";
export const isFont = (source) => isMap(source) && source.kind === FONT_KIND;
// The kind of source that is the core of the family the repository declared it is of (spec 0016,
// answer 4): a copy of the core kept in the repository, compared by hash. It offers no block of a
// library; a repository is of one family, so the row is `design/sources/core.json`, id `core`.
export const CORE_KIND = "core";
export const CORE_ID = "core";
export const isCoreSource = (source) => isMap(source) && source.kind === CORE_KIND;
// Where a source stands on the ladder find and intake walk: before the starter kit and the family's
// store, or after them, which is where a source that declares nothing stands (spec 0015).
export const LADDER_PLACES = ["before-starter", "after-family"];
export const DEFAULT_LADDER_PLACE = "after-family";
// The pin a file keeps: the file itself, or, for a catalog that keeps its own pin, its `pin`.
export const pinWithin = (data) => (isMap(data) && isMap(data.pin) ? data.pin : data);
// The source a plug is pinned as: the one that names it, else the one of its id.
export const sourceOfPlug = (sources, plug) =>
  sources.find((source) => source.plug === plug) ??
  sources.find((source) => source.id === plug && !source.plug);
// How each field of a font row a stylesheet takes is written: the contract holds a row's shape
// with these, and the reader refuses a row that breaks one before any of it reaches a stylesheet.
export const FONT_FIELDS = {
  family: "^[^\"'\\\\;{}\\n]+$",
  variable: "^--[A-Za-z0-9_-]+$",
  file: '^[^"\\\\\\n]+$',
  weight: "^(normal|bold|\\d{1,4}( \\d{1,4})?)$",
};
export const FONT_STYLES = ["normal", "italic"];

// The items of a catalog, each with its name, kind, title, description, and where it can be seen.
// A catalog lists its items, or keeps them in groups: an item in a group takes the group's kind,
// group and category, and the group's page when it has none of its own.
export function catalogItems(catalog) {
  const item = (entry, group = {}) => {
    const read = {
      name: text(entry?.name),
      kind: text(entry?.kind) ?? text(group.kind),
      title: text(entry?.title),
      description: text(entry?.description),
      group: text(entry?.group) ?? text(group.group),
      category: text(entry?.category) ?? text(group.category),
      page: text(entry?.page) ?? text(group.base),
    };
    return Object.fromEntries(Object.entries(read).filter(([, value]) => value !== undefined));
  };
  const flat = Array.isArray(catalog?.items) ? catalog.items.map((entry) => item(entry)) : [];
  const grouped = Array.isArray(catalog?.groups)
    ? catalog.groups.flatMap((group) =>
        Array.isArray(group?.items) ? group.items.map((entry) => item(entry, group)) : [],
      )
    : [];
  return [...flat, ...grouped].filter((entry) => entry.name);
}

// A path a source names, inside the repository, or null when it leads out of it.
function inside(root, file) {
  const full = path.resolve(root, String(file));
  const within = (from, to) => {
    const relative = path.relative(from, to);
    return !(relative.startsWith("..") || path.isAbsolute(relative));
  };
  if (!within(path.resolve(root), full)) return null;
  // A link inside the repository may lead out of it: where it leads is what counts.
  try {
    return within(realpathSync(root), realpathSync(full)) ? full : null;
  } catch {
    return full;
  }
}

// Why a path a source names cannot be read, or null.
const outside = (root, file, what) =>
  inside(root, file) === null ? `${file}, ${what}, is outside the repository` : null;

const isFile = (full) => existsSync(full) && statSync(full).isFile();
const readJson = (root, file) => JSON.parse(readFileSync(inside(root, file), "utf8"));

// JSON with its keys in order, so that the same pin, written another way, hashes the same.
const stable = (value) =>
  Array.isArray(value)
    ? `[${value.map(stable).join(",")}]`
    : isMap(value)
      ? `{${Object.keys(value)
          .sort()
          .map((key) => `${JSON.stringify(key)}:${stable(value[key])}`)
          .join(",")}}`
      : JSON.stringify(value);

// The hash of a source's pin as the repository holds it now, kept in its file or in the one its
// pin_file names, or null when it cannot be read. A conform record keeps it, so that a newer item
// is told from a hand edit, and an item behind its source's pin is told at all (spec 0015).
export function pinSha256(root, sourceId) {
  const json = (file) => {
    try {
      return inside(root, file) === null ? null : readJson(root, file);
    } catch {
      return null;
    }
  };
  const source = json(`${SOURCES_FOLDER}/${sourceId}.json`);
  if (!isMap(source)) return null;
  const pin = isMap(source.pin)
    ? source.pin
    : typeof source.pin_file === "string"
      ? pinWithin(json(source.pin_file))
      : null;
  return isMap(pin) ? createHash("sha256").update(stable(pin)).digest("hex") : null;
}

// Why the snapshot a pin names differs from it, or null when every file matches. What could not
// be compared is said in `blind`.
function snapshotProblem(root, source, pin, blind) {
  if (!Array.isArray(pin?.files)) {
    blind.push(`${source.id} is pinned by a version, so no snapshot of it is compared`);
    return null;
  }
  if (source.snapshot === undefined) {
    blind.push(`${source.id} names no snapshot folder, so its pinned files are not compared`);
    return null;
  }
  if (typeof source.snapshot !== "string") return `its snapshot is not the path of a folder`;
  for (const entry of pin.files) {
    const file = path.posix.join(source.snapshot, String(entry?.file ?? ""));
    const away = outside(root, file, "a file of its pin");
    if (away) return away;
    const full = inside(root, file);
    if (!existsSync(full)) return `${file}, a file of its pin, is not there`;
    if (!isFile(full)) return `${file}, a file of its pin, cannot be read as a file`;
    const hash = createHash("sha256").update(readFileSync(full)).digest("hex");
    if (hash !== entry.sha256) {
      return `${file} is not the file it was pinned with: its sha256 differs from the pin`;
    }
  }
  return null;
}

// One source as the tools use it, read from its file: its pin, the items of its catalog, and why
// it is unreadable when it is.
function readSource(root, name) {
  const file = `${SOURCES_FOLDER}/${name}`;
  const id = name.replace(/\.json$/, "");
  const blind = [];
  const unreadable = (why) => ({ id, file, unreadable: why, items: null, blind });
  let source;
  try {
    source = readJson(root, file);
  } catch {
    return unreadable(`${file} is not valid JSON`);
  }
  if (!isMap(source)) return unreadable(`${file} is not an object`);
  const version = Number(source.version);
  if (Number.isFinite(version) && version > SOURCES_VERSION) {
    return unreadable(
      `${file} has shape ${version} and this tool knows shape ${SOURCES_VERSION}: update the design-assembly plugin`,
    );
  }
  const said = {
    id,
    file,
    title: text(source.title) ?? id,
    order: typeof source.order === "number" ? source.order : null,
    catalog: text(source.catalog) ?? null,
    install: text(source.install) ?? null,
    licence: text(source.licence) ?? null,
    plug: text(source.plug) ?? null,
    ladder_place: LADDER_PLACES.includes(source.ladder_place)
      ? source.ladder_place
      : DEFAULT_LADDER_PLACE,
  };
  for (const [key, what] of [
    ["pin_file", "the file its pin is kept in"],
    ["snapshot", "its snapshot"],
    ["catalog", "its catalog"],
  ]) {
    const away = typeof source[key] === "string" ? outside(root, source[key], what) : null;
    if (away) return { ...said, ...unreadable(away) };
  }
  let pin = isMap(source.pin) ? source.pin : null;
  if (!pin && source.pin_file) {
    try {
      pin = pinWithin(readJson(root, source.pin_file));
    } catch {
      return {
        ...said,
        ...unreadable(`${source.pin_file}, the file its pin is kept in, cannot be read`),
      };
    }
  }
  if (!isMap(pin)) return { ...said, ...unreadable(`${file} has no pin`) };
  const snapshot = snapshotProblem(root, { ...source, id }, pin, blind);
  if (snapshot) return { ...said, pin, ...unreadable(snapshot) };
  if (!said.catalog) return { ...said, pin, ...unreadable(`${file} names no catalog`) };
  let catalog;
  try {
    catalog = readJson(root, said.catalog);
  } catch {
    return { ...said, pin, ...unreadable(`${said.catalog}, its catalog, cannot be read`) };
  }
  return { ...said, pin, unreadable: null, items: catalogItems(catalog), blind };
}

// The files of the ledger, by name.
function sourceFiles(root) {
  const folder = path.join(root, SOURCES_FOLDER);
  if (!existsSync(folder) || !statSync(folder).isDirectory()) return [];
  return readdirSync(folder)
    .filter((name) => name.endsWith(".json") && isFile(path.join(folder, name)))
    .sort();
}

// A file of the ledger as data, or null when it is not JSON.
function parsed(root, name) {
  try {
    return readJson(root, `${SOURCES_FOLDER}/${name}`);
  } catch {
    return null;
  }
}

// Every pinned source blocks are picked from, in the order they are looked through: by `order`,
// the smallest first and a source without one last, then by id. Empty when the repository keeps
// none. A font is a source of another kind: it offers no block, and is read by `readFontSources`;
// so is the family core, which the contract reads as the repository's family.
export function readPinnedSources(root) {
  return sourceFiles(root)
    .filter((name) => {
      const source = parsed(root, name);
      return !isFont(source) && !isCoreSource(source);
    })
    .map((name) => readSource(root, name))
    .sort(
      (a, b) =>
        (a.order ?? Infinity) - (b.order ?? Infinity) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
    );
}

// The pin of a font, as the row itself says it: the package and the version the lockfile pins it
// at, or each of its files, by its path from the repository's root, with its hash. Null when the
// row says neither whole: a pin kept in another file is no pin of a font.
export function fontPin(source) {
  const pin = isMap(source?.pin) ? source.pin : null;
  if (!pin) return null;
  if (filled(pin.package) && filled(pin.version)) {
    return { package: pin.package, version: pin.version };
  }
  const files = Array.isArray(pin.files) ? pin.files : [];
  const whole = files.every(
    (entry) => filled(entry?.file) && /^[0-9a-f]{64}$/.test(String(entry?.sha256 ?? "")),
  );
  return files.length > 0 && whole ? { files } : null;
}

// What a font row lacks beside its shape, each sentence naming the row. The pin is required of
// every font row. The licence is required of a row a person finished: a row a command wrote says
// so under `proposed`, and waits on its licence without being held.
export function fontRowProblems(source, file) {
  const problems = [];
  if (!fontPin(source)) {
    problems.push(
      `${file} is a font and has no pin: its row says the package and the version the lockfile pins it at, or each of its files with its sha256`,
    );
  }
  if (!filled(source?.licence) && !isMap(source?.proposed)) {
    problems.push(
      `${file} is a font and has no licence: a person writes the licence the font is used under, and until then the font cannot be chosen`,
    );
  }
  return problems;
}

// How a font's pin differs from what the repository holds now, and what could not be compared.
function pinDrift(root, file, pin) {
  const drift = [];
  const blind = [];
  if (pin.package) {
    const locked = pinnedPackage(root, pin.package);
    if (locked.lockfile === null) {
      blind.push(
        `no lockfile this tool reads is in the repository, so the version ${file} pins ${pin.package} at is not compared`,
      );
    } else if (locked.version === null) {
      drift.push(
        `${file} pins ${pin.package} at ${pin.version}, and ${locked.lockfile} does not pin ${pin.package}: install the package, or take the row out`,
      );
    } else if (locked.version !== pin.version) {
      drift.push(
        `${file} pins ${pin.package} at ${pin.version}, and ${locked.lockfile} pins ${locked.version}: write the new version into the row once its licence is read again, or put the package back`,
      );
    }
    return { drift, blind };
  }
  for (const entry of pin.files) {
    const away = outside(root, entry.file, "a file of its pin");
    if (away) {
      drift.push(`${file}: ${away}`);
      continue;
    }
    const full = inside(root, entry.file);
    if (!isFile(full)) {
      drift.push(`${file}: ${entry.file}, a file of its pin, is not there`);
      continue;
    }
    const hash = createHash("sha256").update(readFileSync(full)).digest("hex");
    if (hash !== entry.sha256) {
      drift.push(
        `${file}: ${entry.file} is not the file it was pinned with: its sha256 differs from the pin`,
      );
    }
  }
  return { drift, blind };
}

// One font of the ledger as the tools use it: its family, how the stylesheet reaches it, where it
// comes from, whether the gate holds its row, and how its pin differs from the repository today.
function readFont(root, name, source) {
  const file = `${SOURCES_FOLDER}/${name}`;
  const id = name.replace(/\.json$/, "");
  const problems = [];
  const version = Number(source.version);
  if (Number.isFinite(version) && version > SOURCES_VERSION) {
    problems.push(
      `${file} has shape ${version} and this tool knows shape ${SOURCES_VERSION}: update the design-assembly plugin`,
    );
  }
  if (!filled(source.family)) problems.push(`${file}.family is missing`);
  else if (!new RegExp(FONT_FIELDS.family).test(source.family)) {
    problems.push(`${file}.family is not a name a stylesheet can take`);
  }
  if (
    source.variable !== undefined &&
    !new RegExp(FONT_FIELDS.variable).test(String(source.variable))
  ) {
    problems.push(`${file}.variable is not the name of a CSS variable`);
  }
  for (const [index, entry] of (Array.isArray(source.pin?.files)
    ? source.pin.files
    : []
  ).entries()) {
    const where = `${file}.pin.files[${index}]`;
    if (!new RegExp(FONT_FIELDS.file).test(String(entry?.file ?? ""))) {
      problems.push(`${where}.file is not a path a stylesheet can take`);
    }
    if (entry?.weight !== undefined && !new RegExp(FONT_FIELDS.weight).test(String(entry.weight))) {
      problems.push(`${where}.weight is not a weight, nor a range of weights`);
    }
    if (entry?.style !== undefined && !FONT_STYLES.includes(entry.style)) {
      problems.push(`${where}.style is not one of ${FONT_STYLES.join(", ")}`);
    }
  }
  problems.push(...fontRowProblems(source, file));
  const pin = fontPin(source);
  const { drift, blind } = pin ? pinDrift(root, file, pin) : { drift: [], blind: [] };
  const licensed = filled(source.licence);
  const from = !pin
    ? null
    : pin.package
      ? `the package ${pin.package} at ${pin.version}`
      : `${pin.files.length} file${pin.files.length === 1 ? "" : "s"} of the repository (${pin.files.map((entry) => entry.file).join(", ")})`;
  return {
    id,
    file,
    title: text(source.title) ?? text(source.family) ?? id,
    family: text(source.family) ?? null,
    variable: new RegExp(FONT_FIELDS.variable).test(String(source.variable ?? ""))
      ? source.variable
      : null,
    licence: licensed ? source.licence : null,
    // The repository loaded this font before the row was written: its own font, kept as found.
    own: source.own === true,
    proposed: isMap(source.proposed) ? source.proposed : null,
    pin,
    from,
    // The gate holds a row that is whole: its shape, its pin and its licence.
    held: problems.length === 0 && licensed,
    // A row a command wrote, that only a person's licence is missing from.
    waits:
      problems.length === 0 && !licensed
        ? `${file} has no licence yet: a person writes the licence the font is used under, and the row is held from then on`
        : null,
    problems,
    drift,
    blind,
  };
}

// Why a font cannot be chosen as a typeface, in one sentence, or null: its row is not whole, it
// waits on its licence, or its pin is no longer what the repository holds.
export const fontCannot = (font) => font.problems[0] ?? font.waits ?? font.drift[0] ?? null;

// Every font of the ledger, by id. Empty when the repository keeps none.
export function readFontSources(root) {
  return sourceFiles(root)
    .map((name) => [name, parsed(root, name)])
    .filter(([, source]) => isFont(source))
    .map(([name, source]) => readFont(root, name, source));
}
