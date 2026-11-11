// ReUI catalog: read the pinned snapshot, build the catalog, verify it, and look items up.
// Every path is derived from this file's location, so a copy of this folder works on its own root.
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const TOOL_DIR = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(TOOL_DIR, "..", "..");
export const SNAPSHOT_DIR = join(TOOL_DIR, "snapshot");
export const PIN_PATH = join(TOOL_DIR, "pin.json");
export const CATALOG_REL = "design/reui-catalog.json";
export const CATALOG_PATH = join(ROOT, CATALOG_REL);
export const MAX_CATALOG_BYTES = 500 * 1024;
export const TOP_N = 10;

export const SOURCES = [
  { file: "llms-full.txt", url: "https://reui.io/llms-full.txt" },
  { file: "llms.txt", url: "https://reui.io/llms.txt" },
];

export const KINDS = ["component", "block", "example"];

// Sections every source must carry, with the exact heading the reader expects. A missing one stops the build.
export const REQUIRED_SECTIONS = [
  { file: "llms-full.txt", label: "Pro blocks", kind: "block" },
  { file: "llms-full.txt", label: "Free examples", kind: "example" },
  { file: "llms.txt", label: "ReUI Primitives", kind: "component" },
];
const SECTION_HEADING = /^## (.+?) \(([\d,]+)\)$/;
const KIND_ORDER = { component: 0, block: 1, example: 2 };

export const ALLOWED_FIELDS = {
  top: ["pin", "counts", "groups"],
  group: ["kind", "group", "category", "base", "items"],
  item: ["name", "title", "description"],
};

// Text that means source code or a licence key reached the catalog or the snapshot.
export const FORBIDDEN = [
  { label: "```", re: /```/ },
  { label: "import", re: /\bimport\s+[\w*{][^\n]*?\bfrom\s+["']/ },
  { label: "export", re: /\bexport\s+(?:default|const|function|class)\b/ },
  { label: "Bearer", re: /\bBearer\b/ },
  { label: "REUI_LICENSE", re: /REUI_LICENSE/ },
];

export class CatalogError extends Error {}

export const sha256 = (text) => createHash("sha256").update(text).digest("hex");

const toInt = (s) => Number(s.replace(/,/g, ""));

/** Parse the two source texts. Throws CatalogError when a declared count differs from what was read. */
export function parseSources({ full, index }) {
  const missing = [
    ...missingSections("llms-full.txt", full),
    ...missingSections("llms.txt", index),
  ];
  if (missing.length) throw new CatalogError(missing.join("\n"));
  const groups = [];
  const counts = { block: 0, component: 0, example: 0 };
  parseFull(full, groups, counts);
  parseIndex(index, groups, counts);
  const empty = REQUIRED_SECTIONS.filter((r) => counts[r.kind] === 0).map(
    (r) => `section empty in ${r.file}: ${r.label} (${r.kind})`,
  );
  if (empty.length) throw new CatalogError(empty.join("\n"));
  return { groups, counts };
}

// Heading text with the hashes, the trailing count and the case taken away, to point at a heading that changed form.
const looseHeading = (line) =>
  line
    .replace(/^#+\s*/, "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim()
    .toLowerCase();

/** One line per required section of `file` whose exact heading is absent, naming the nearest look-alike heading. */
function missingSections(file, text) {
  const lines = text.split("\n");
  const out = [];
  for (const s of REQUIRED_SECTIONS.filter((r) => r.file === file)) {
    if (lines.some((l) => l.match(SECTION_HEADING)?.[1] === s.label)) continue;
    let msg = `section missing in ${file}: ${s.label} (${s.kind})`;
    const near = lines.findIndex(
      (l) => l.startsWith("#") && looseHeading(l) === s.label.toLowerCase(),
    );
    if (near >= 0) msg += ` — nearest heading line ${near + 1}: ${lines[near].trimEnd()}`;
    out.push(msg);
  }
  return out;
}

function closeCategory(cat) {
  if (cat && cat.read !== cat.declared) {
    throw new CatalogError(
      `count mismatch: ${cat.label} declares ${cat.declared}, read ${cat.read}`,
    );
  }
}

function parseFull(text, groups, counts) {
  const sections = Object.fromEntries(
    REQUIRED_SECTIONS.filter((r) => r.file === "llms-full.txt").map((r) => [r.label, r.kind]),
  );
  let section = null;
  let cat = null;
  const lines = text.split("\n");
  const closeSection = () => {
    closeCategory(cat);
    cat = null;
    if (section && section.read !== section.declared) {
      throw new CatalogError(
        `count mismatch: ${section.label} declares ${section.declared}, read ${section.read}`,
      );
    }
  };
  lines.forEach((line, i) => {
    const sec = line.match(SECTION_HEADING);
    if (sec || /^## /.test(line)) {
      closeSection();
      const kind = sec ? sections[sec[1]] : undefined;
      section = kind ? { kind, label: sec[1], declared: toInt(sec[2]), read: 0 } : null;
      return;
    }
    if (!section) return;
    const head = line.match(/^### (?:(.+?): )?(.+?) \(([\d,]+)\)$/);
    if (head) {
      closeCategory(cat);
      const label = head[1] ? `${head[1]}: ${head[2]}` : head[2];
      cat = { label, declared: toInt(head[3]), read: 0, group: head[1] ?? null, category: head[2] };
      return;
    }
    if (!line.startsWith("- [")) return;
    const m = line.match(
      /^- \[(.+)\]\((https:\/\/reui\.io\/(?:blocks|components)\/[^)\s]+)\)(?:: (.+))?$/,
    );
    if (!m || !cat) throw new CatalogError(`unreadable item line ${i + 1}`);
    addItem(groups, {
      kind: section.kind,
      group: cat.group,
      category: cat.category,
      url: m[2],
      title: m[1],
      description: m[3] ?? "",
    });
    cat.read += 1;
    section.read += 1;
    counts[section.kind] += 1;
  });
  closeSection();
}

function parseIndex(text, groups, counts) {
  const req = REQUIRED_SECTIONS.find((r) => r.file === "llms.txt");
  let prim = null;
  const lines = text.split("\n");
  const close = () => {
    if (prim && prim.read !== prim.declared) {
      throw new CatalogError(
        `count mismatch: ${req.label} declares ${prim.declared}, read ${prim.read}`,
      );
    }
  };
  lines.forEach((line, i) => {
    const sec = line.match(SECTION_HEADING);
    if (sec && sec[1] === req.label) {
      prim = { declared: toInt(sec[2]), read: 0 };
      return;
    }
    if (!prim) return;
    if (/^## /.test(line) || /^Documented patterns/.test(line)) {
      close();
      prim = null;
      return;
    }
    if (!line.startsWith("- [")) return;
    const m = line.match(
      /^- \[(.+)\]\((https:\/\/reui\.io\/docs\/components\/base\/[^)\s]+)\): (.+)$/,
    );
    if (!m) throw new CatalogError(`unreadable item line ${i + 1} of llms.txt`);
    addItem(groups, {
      kind: req.kind,
      group: null,
      category: req.label,
      url: m[2],
      title: m[1],
      description: m[3],
    });
    prim.read += 1;
    counts.component += 1;
  });
  close();
}

function addItem(groups, { kind, group, category, url, title, description }) {
  const cut = url.lastIndexOf("/");
  const base = url.slice(0, cut);
  const name = url.slice(cut + 1);
  let g = groups.at(-1);
  if (!g || g.kind !== kind || g.category !== category || g.base !== base || g.group !== group) {
    g = { kind, group, category, base, items: [] };
    groups.push(g);
  }
  const item = { name, title };
  if (description) item.description = description;
  g.items.push(item);
}

/** Catalog object in its committed shape (key order is part of the byte-for-byte promise). */
export function catalogObject(pin, { groups, counts }) {
  return {
    pin,
    counts: { block: counts.block, component: counts.component, example: counts.example },
    groups: groups.map((g) => {
      const out = { kind: g.kind };
      if (g.group) out.group = g.group;
      out.category = g.category;
      out.base = g.base;
      out.items = g.items;
      return out;
    }),
  };
}

export async function formatCatalog(obj, root = ROOT) {
  const prettier = await import("prettier");
  const target = join(root, CATALOG_REL);
  const config = (await prettier.resolveConfig(target)) ?? {};
  return prettier.format(JSON.stringify(obj), { ...config, parser: "json", filepath: target });
}

export function readSnapshot(dir = SNAPSHOT_DIR) {
  const texts = {};
  for (const s of SOURCES) texts[s.file] = readFileSync(join(dir, s.file), "utf8");
  return texts;
}

export const sourcesFromTexts = (texts) => ({
  full: texts["llms-full.txt"],
  index: texts["llms.txt"],
});

/** Hash check of the snapshot files against the pin. Returns error strings. */
export function checkHashes(texts, pin) {
  const errors = [];
  for (const s of SOURCES) {
    const entry = pin.files.find((f) => f.file === s.file);
    if (!entry || entry.sha256 !== sha256(texts[s.file])) {
      errors.push(`snapshot hash mismatch: ${s.file}`);
    }
  }
  return errors;
}

/** Forbidden text in the snapshot files. Returns error strings naming file and line. */
export function scanSnapshot(texts) {
  const errors = [];
  for (const s of SOURCES) {
    texts[s.file].split("\n").forEach((line, i) => {
      for (const f of FORBIDDEN) {
        if (f.re.test(line))
          errors.push(`forbidden in snapshot ${s.file} line ${i + 1}: ${f.label}`);
      }
    });
  }
  return errors;
}

/** Field whitelist and forbidden text in a catalog object. Returns error strings. */
export function scanCatalog(catalog) {
  const errors = [];
  const fields = (obj, allowed, where) => {
    for (const k of Object.keys(obj)) {
      if (!allowed.includes(k)) errors.push(`forbidden field in ${where}: ${k}`);
    }
  };
  // Scan each string leaf as written: JSON text would escape quotes and hide `import x from "y"`.
  // Key names count too: a licence key written as a field name must not pass.
  const leaves = (value) =>
    value && typeof value === "object"
      ? Object.entries(value).flatMap(([k, v]) =>
          Array.isArray(value) ? leaves(v) : [k, ...leaves(v)],
        )
      : [String(value)];
  const text = (value, where) => {
    const strings = leaves(value);
    for (const f of FORBIDDEN) {
      if (strings.some((s) => f.re.test(s))) errors.push(`forbidden in ${where}: ${f.label}`);
    }
  };
  fields(catalog, ALLOWED_FIELDS.top, "catalog");
  text(catalog.pin, "pin");
  text(catalog.counts, "counts");
  for (const g of catalog.groups ?? []) {
    fields(g, ALLOWED_FIELDS.group, `group ${g.category}`);
    for (const [k, v] of Object.entries(g)) if (k !== "items") text(v, `group ${g.category}`);
    for (const it of g.items ?? []) {
      fields(it, ALLOWED_FIELDS.item, it.name);
      for (const v of Object.values(it)) text(v, it.name);
    }
  }
  return errors;
}

// ---- lookup ----

const tokens = (s) =>
  (s ?? "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

/** Flatten a catalog into items with their group context and build the lookup index. */
export function loadIndex(catalog) {
  const items = [];
  for (const g of catalog.groups) {
    for (const it of g.items) {
      items.push({
        name: it.name,
        kind: g.kind,
        plan: g.kind === "block" ? "pro" : "free",
        group: g.group ?? null,
        category: g.category,
        title: it.title,
        description: it.description ?? "",
        url: `${g.base}/${it.name}`,
        install: `@reui/${it.name}`,
      });
    }
  }
  const postings = new Map();
  const byName = new Map();
  items.forEach((it, idx) => {
    const lower = it.name.toLowerCase();
    if (!byName.has(lower)) byName.set(lower, []);
    byName.get(lower).push(idx);
    const weights = new Map();
    const put = (list, w) => {
      for (const t of list) if ((weights.get(t) ?? 0) < w) weights.set(t, w);
    };
    put(tokens(it.description), 2);
    put([...tokens(it.category), ...tokens(it.group)], 4);
    put(tokens(it.title), 6);
    put(tokens(it.name), 8);
    for (const [t, w] of weights) {
      if (!postings.has(t)) postings.set(t, []);
      postings.get(t).push([idx, w]);
    }
  });
  // Tie-break order (kind, then name with numbers compared as numbers), computed once.
  const order = new Array(items.length);
  items
    .map((it, idx) => idx)
    .sort(
      (a, b) =>
        KIND_ORDER[items[a].kind] - KIND_ORDER[items[b].kind] ||
        items[a].name.localeCompare(items[b].name, "en", { numeric: true }) ||
        a - b,
    )
    .forEach((idx, pos) => {
      order[idx] = pos;
    });
  return { items, postings, byName, order, pin: catalog.pin };
}

/** Deterministic ranked lookup. */
export function search(index, query, { limit = TOP_N, kind = null } = {}) {
  const q = tokens(query);
  const unique = [...new Set(q)];
  const score = new Map();
  const hits = new Map();
  for (const t of unique) {
    for (const [idx, w] of index.postings.get(t) ?? []) {
      score.set(idx, (score.get(idx) ?? 0) + w);
      hits.set(idx, (hits.get(idx) ?? 0) + 1);
    }
  }
  for (const idx of index.byName.get(query.trim().toLowerCase()) ?? []) {
    score.set(idx, (score.get(idx) ?? 0) + 1000);
  }
  const ranked = [];
  for (const [idx, s] of score) {
    const it = index.items[idx];
    if (kind && it.kind !== kind) continue;
    const h = hits.get(idx) ?? 0;
    ranked.push({ idx, s: s + (unique.length ? (10 * h * h) / unique.length : 0) });
  }
  ranked.sort((a, b) => b.s - a.s || index.order[a.idx] - index.order[b.idx]);
  return ranked.slice(0, limit).map((r) => index.items[r.idx]);
}

/** Every item must be first when looked up by its name and within the default results by title. */
export function checkFindable(index) {
  const errors = [];
  let byName = 0;
  let byTitle = 0;
  for (const it of index.items) {
    if (search(index, it.name, { limit: 1 })[0] === it) byName += 1;
    else errors.push(`not findable by name: ${it.name}`);
    if (search(index, `${it.category} ${it.title}`).includes(it)) byTitle += 1;
    else errors.push(`not findable by title: ${it.name}`);
  }
  return { errors, byName, byTitle, total: index.items.length };
}

export const pinDate = (pin) => String(pin?.fetched_at ?? "").slice(0, 10);

export function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export const exists = existsSync;
