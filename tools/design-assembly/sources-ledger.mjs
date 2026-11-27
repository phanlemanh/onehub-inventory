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
// The kind of source that is the mark of the product (spec 0017): each file of the mark the
// repository keeps, with its role, its variant and its hash. It offers no block of a library; it is
// read by `readLogoSources`, below.
export const LOGO_KIND = "logo";
export const isLogo = (source) => isMap(source) && source.kind === LOGO_KIND;
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
export function inside(root, file) {
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
// so is the family core, which the contract reads as the repository's family, so is an icon set,
// read by `readIconSets`, and so is the mark, read by `readLogoSources`.
export function readPinnedSources(root) {
  return sourceFiles(root)
    .filter((name) => {
      const source = parsed(root, name);
      return !isFont(source) && !isCoreSource(source) && !isIconSet(source) && !isLogo(source);
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

// ---- icon sets (item 12.1 of the plan, spec 0017) ----------------------------------------------

// The kind of source that is the icon set the product uses: the module the code imports icons
// from, or the folder of the repository's own icon files; its pin, and the licence it is used
// under, which a person writes. Like a font, it offers no block of a library.
export const ICON_SET_KIND = "icon-set";
export const isIconSet = (source) => isMap(source) && source.kind === ICON_SET_KIND;
// The check of the gate that holds the pin of every icon set of the ledger, laid under the row
// that holds the ledgers' shapes once the repository has a row of the kind, and not before.
export const ICON_SET_CHECK = { kind: "icon-set-pin" };
// The check of the gate that holds which icons the code uses, laid under the row `icons` of the
// decision ledger once the repository has a row of the kind, and not before. It names the row the
// decision points at, the folder of source it reads, and the packages it knows as icon packages.
export const ICON_USE_CHECK = { kind: "icon-set-use" };

// What an icon set row lacks beside its shape, each sentence naming the row: the pin, always; the
// licence, unless a command wrote the row and says so under `proposed`.
export function iconSetRowProblems(source, file) {
  const problems = [];
  if (!fontPin(source)) {
    problems.push(
      `${file} is an icon set and has no pin: its row says the package and the version the lockfile pins it at, or each of its files with its sha256`,
    );
  }
  if (!filled(source?.licence) && !isMap(source?.proposed)) {
    problems.push(
      `${file} is an icon set and has no licence: a person writes the licence the icon set is used under`,
    );
  }
  return [...problems, ...drawnProblems(source, file)];
}

// The key of an icon set row that records the icons drawn because the pinned set lacked them (spec
// 0017, criterion 18): each a file of the row's pin, kept in the folder of the repository's own
// icons, with the need and why. A command asks the repository's copy of the tool for this name
// before it writes the key.
export const ICON_DRAWN = "drawn";

// What the drawn icons of an icon set row say wrongly: a drawn icon on a package's row, which keeps
// no file of the repository, or one its pin does not hold.
function drawnProblems(source, file) {
  const drawn = Array.isArray(source?.[ICON_DRAWN]) ? source[ICON_DRAWN] : [];
  if (drawn.length === 0) return [];
  const pin = isMap(source?.pin) ? source.pin : {};
  if (filled(pin.package) || !filled(source?.folder)) {
    return [
      `${file} is a package's icon set and records drawn icons: a drawn icon goes into the folder of an icon set row of the repository's own files`,
    ];
  }
  const pinned = new Set((Array.isArray(pin.files) ? pin.files : []).map((entry) => entry?.file));
  return drawn
    .filter((entry) => filled(entry?.file) && !pinned.has(entry.file))
    .map((entry) => `${file} records the drawn icon ${entry.file}, which its pin does not hold`);
}

// One icon set of the ledger as the tools use it: what code imports it by, where it comes from,
// whether the gate holds its row, and how its pin differs from the repository today.
function readIconSet(root, name, source) {
  const file = `${SOURCES_FOLDER}/${name}`;
  const id = name.replace(/\.json$/, "");
  const problems = iconSetRowProblems(source, file);
  const pin = fontPin(source);
  const { drift, blind } = pin ? pinDrift(root, file, pin) : { drift: [], blind: [] };
  const licensed = filled(source.licence);
  const from = !pin
    ? null
    : pin.package
      ? `the package ${pin.package} at ${pin.version}`
      : `${pin.files.length} file${pin.files.length === 1 ? "" : "s"} of the repository`;
  return {
    id,
    file,
    title: text(source.title) ?? id,
    module: text(source.module) ?? (pin?.package || null),
    folder: text(source.folder) ?? null,
    licence: licensed ? source.licence : null,
    own: source.own === true,
    proposed: isMap(source.proposed) ? source.proposed : null,
    pin,
    from,
    held: problems.length === 0 && licensed,
    waits:
      problems.length === 0 && !licensed
        ? `${file} has no licence yet: a person writes the licence the icon set is used under, and the row is held from then on`
        : null,
    problems,
    drift,
    blind,
  };
}

// Every icon set of the ledger, by id. Empty when the repository keeps none.
export function readIconSets(root) {
  return sourceFiles(root)
    .map((name) => [name, parsed(root, name)])
    .filter(([, source]) => isIconSet(source))
    .map(([name, source]) => readIconSet(root, name, source));
}

// ---- the mark ------------------------------------------------------------------------------------
// The mark of the product in the sources ledger (spec 0017): a source of the kind `logo` names each
// file of the mark the repository keeps, with its role, its variant and its hash, and the licence a
// person writes for it: who holds the right to use the mark, and where it may be used. Nothing here
// draws or fetches: a file is hashed where it is, and a row is held once it is whole.
// What a file of the mark is for: the symbol alone, the name drawn as letters, the two side by side
// or one above the other, the icon a browser shows for the page, and the icon of the installed app.
export const LOGO_ROLES = [
  "mark",
  "wordmark",
  "lockup-horizontal",
  "lockup-vertical",
  "favicon",
  "app-icon",
];
// How a file of the mark is coloured: in its colours, in one colour, or drawn for a dark ground.
export const LOGO_VARIANTS = ["color", "mono", "inverse"];
// The check of the gate that holds the pin of every logo row, laid beside the row's shapes.
export const LOGO_PINS_CHECK = { kind: "logo-pins" };
// A logo row as a choice of the foundations layer names it: `source:` and the id of its row.
const SOURCED = /^source:([a-z0-9]+(?:-[a-z0-9]+)*)$/;

// The pin of a mark, as the row itself says it: each file by its path from the repository's root,
// with its hash, role and variant. Null when the row does not say every file whole.
export function logoPin(source) {
  const files = Array.isArray(source?.pin?.files) ? source.pin.files : [];
  const whole = files.every(
    (entry) =>
      filled(entry?.file) &&
      /^[0-9a-f]{64}$/.test(String(entry?.sha256 ?? "")) &&
      LOGO_ROLES.includes(entry?.role) &&
      LOGO_VARIANTS.includes(entry?.variant),
  );
  return files.length > 0 && whole ? { files } : null;
}

// What a logo row lacks beside its shape, each sentence naming the row. The pin is required of every
// row, and a file is named once. The licence is required of a row a person finished: a row a command
// wrote says so under `proposed`, and waits on its licence without being held.
export function logoRowProblems(source, file) {
  const problems = [];
  if (!logoPin(source)) {
    problems.push(
      `${file} is a logo and has no pin: its row names each file of the mark with its sha256, its role and its variant`,
    );
  }
  const named = (Array.isArray(source?.pin?.files) ? source.pin.files : []).map((entry) =>
    String(entry?.file ?? ""),
  );
  for (const twice of new Set(named.filter((name, index) => named.indexOf(name) !== index))) {
    problems.push(
      `${file} names ${twice} twice: each file of the mark has one role and one variant`,
    );
  }
  if (!filled(source?.licence) && !isMap(source?.proposed)) {
    problems.push(
      `${file} is a logo and has no licence: a person writes who holds the right to use the mark and where it may be used, and until then the mark cannot be chosen`,
    );
  }
  return problems;
}

// How the files of a mark differ from its pin today, each sentence naming the row.
function filesDrift(root, file, files) {
  const drift = [];
  for (const entry of files) {
    const full = inside(root, entry.file);
    if (full === null) {
      drift.push(`${file}: ${entry.file}, a file of its pin, is outside the repository`);
      continue;
    }
    if (!existsSync(full) || !statSync(full).isFile()) {
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
  return drift;
}

// One logo row as the tools use it: its title, its files, whether the gate holds it, and how its pin
// differs from the repository today.
function readLogo(root, name, source) {
  const file = `${SOURCES_FOLDER}/${name}`;
  const problems = [];
  const version = Number(source.version);
  if (Number.isFinite(version) && version > SOURCES_VERSION) {
    problems.push(
      `${file} has shape ${version} and this tool knows shape ${SOURCES_VERSION}: update the design-assembly plugin`,
    );
  }
  problems.push(...logoRowProblems(source, file));
  const pin = logoPin(source);
  const drift = pin ? filesDrift(root, file, pin.files) : [];
  const licensed = filled(source.licence);
  return {
    id: name.replace(/\.json$/, ""),
    file,
    title: filled(source.title) ? source.title : name.replace(/\.json$/, ""),
    licence: licensed ? source.licence : null,
    // The repository kept these files before the row was written: its own mark, kept as found.
    own: source.own === true,
    proposed: isMap(source.proposed) ? source.proposed : null,
    pin,
    // The gate holds a row that is whole: its shape, its pin and its licence.
    held: problems.length === 0 && licensed,
    // A row a command wrote, that only a person's licence is missing from.
    waits:
      problems.length === 0 && !licensed
        ? `${file} has no licence yet: a person writes who holds the right to use the mark and where it may be used, and the row is held from then on`
        : null,
    problems,
    drift,
  };
}

// Every logo row of the ledger, by id. Empty when the repository keeps none.
export function readLogoSources(root) {
  const folder = path.join(root, SOURCES_FOLDER);
  if (!existsSync(folder) || !statSync(folder).isDirectory()) return [];
  return readdirSync(folder)
    .filter((name) => name.endsWith(".json") && statSync(path.join(folder, name)).isFile())
    .sort()
    .flatMap((name) => {
      try {
        const source = JSON.parse(readFileSync(path.join(folder, name), "utf8"));
        return isLogo(source) ? [readLogo(root, name, source)] : [];
      } catch {
        return [];
      }
    });
}

// The id of the logo row a choice names, or null when the value is a word.
export const sourceLogoId = (value) => SOURCED.exec(String(value ?? ""))?.[1] ?? null;

// The logo row a choice names, among the rows read from the ledger. It throws one sentence when the
// mark cannot be chosen: its row is missing, is not whole, waits on its licence, or pins files the
// repository no longer holds as they were.
export function sourcedLogo(value, logos) {
  const id = sourceLogoId(value);
  const logo = (logos ?? []).find((item) => item.id === id);
  if (!logo) {
    throw new Error(
      `the sources ledger has no logo row ${SOURCES_FOLDER}/${id}.json: a mark is chosen once its row is there, of the kind logo, with its pin and its licence`,
    );
  }
  const cannot = logo.problems[0] ?? logo.waits ?? logo.drift[0] ?? null;
  if (cannot) throw new Error(cannot);
  return logo;
}

// ---- the mark in use -----------------------------------------------------------------------------
// Once a repository has a logo row, the mark it shows comes from a row (spec 0017, criterion 9): the
// page icons its build declares, and the images its app frame shows, are files a logo row pins. The
// build's adapter says where the page icons are declared and which files are the frame; this reads
// what the frame shows and compares. A repository with no logo row is never asked.
export const LOGO_USE_CHECK = { kind: "logo-use" };
// The endings of a file a page shows as an image.
const IMAGE = /\.(svg|png|jpe?g|gif|webp|avif|ico)$/i;
const IMPORTED = /(?:^|\n)\s*import\s+(?:[^"';]*?\s+from\s+)?["']([^"']+)["']/g;
const ADDRESSED = /["'`](\/(?!\/)[^"'`\s?#]+)(?:[?#][^"'`]*)?["'`]/g;

// The images a file of the frame shows, as files of the repository: an image it imports by a path
// from its own folder, or from the source folder by `@/`; and an address from the root of the site,
// served from the build's public folder. What leads to no file of the repository is not read.
export function frameImages(root, frame, publicFolder) {
  const isFile = (file) => {
    const full = inside(root, file);
    return full !== null && existsSync(full) && statSync(full).isFile();
  };
  const found = [];
  for (const from of frame) {
    let source;
    try {
      source = readFileSync(path.join(root, from), "utf8");
    } catch {
      continue;
    }
    const files = new Set();
    for (const [, specifier] of source.matchAll(IMPORTED)) {
      const bare = specifier.replace(/[?#].*$/, "");
      if (!IMAGE.test(bare)) continue;
      const file = bare.startsWith(".")
        ? path.posix.normalize(path.posix.join(path.posix.dirname(from), bare))
        : bare.startsWith("@/")
          ? `${existsSync(path.join(root, "src")) ? "src/" : ""}${bare.slice(2)}`
          : null;
      if (file && isFile(file)) files.add(file);
    }
    if (publicFolder) {
      for (const [, address] of source.matchAll(ADDRESSED)) {
        if (!IMAGE.test(address)) continue;
        const file = path.posix.normalize(`${publicFolder}${address}`);
        if (isFile(file)) files.add(file);
      }
    }
    for (const file of [...files].sort()) found.push({ file, in: from });
  }
  return found;
}

// Why the mark the repository shows does not come from its logo rows, one sentence per file: a
// page icon the build declares, or an image the frame shows, that no logo row pins. Empty when the
// repository has no logo row, or the build is not read for either.
export function markUseProblems(root, build, logos) {
  if ((logos ?? []).length === 0) return [];
  const pinned = new Set(
    logos.flatMap((logo) => (logo.pin?.files ?? []).map((entry) => entry.file)),
  );
  const into = `logo-source --into ${logos[0].id}`;
  const problems = [];
  const icons = typeof build?.markFiles === "function" ? build.markFiles(root) : [];
  for (const icon of icons) {
    const where = icon.in ?? icon.said;
    if (icon.file === null) {
      problems.push(
        `the page declares the icon ${icon.said} (${where}), which is no file of the repository, so no logo row can pin it: declare a file of the repository a logo row pins`,
      );
    } else if (!pinned.has(icon.file)) {
      problems.push(
        `${icon.file}, a page icon the build declares (${where}), is no file of a logo row: add it to the row with ${into}, or declare a file a logo row pins`,
      );
    }
  }
  const frame = typeof build?.frameFiles === "function" ? build.frameFiles(root) : [];
  for (const image of frameImages(root, frame, build?.publicFolder ?? null)) {
    if (pinned.has(image.file)) continue;
    problems.push(
      `${image.file}, an image the app frame imports in ${image.in}, is no file of a logo row: add it to the row with ${into}, or show a file a logo row pins`,
    );
  }
  return problems;
}
