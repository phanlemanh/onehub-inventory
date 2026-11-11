// Tests for row 1k (_acceptance/danh-muc-reui-doc-chac/evals.yaml). Case names start with "DC<n> ·", n = criterion
// number, so they never match the "E<n> ·" names counted by the signed danh-muc-reui dossier in catalog.test.mjs.
// Every matrix is written ahead as two lists, and an anchor case checks the lists against the code's own lists
// (REQUIRED_SECTIONS, FORBIDDEN, ALLOWED_FIELDS, KINDS, SOURCES), so the case count is not just the matrix length.
// Red cases that run a command break one thing in a copy of the real files, run the copy's own command by absolute
// path from another directory under the network blocker, and check the real repo is untouched.
import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import * as lib from "./catalog.mjs";

const TOOL = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(TOOL, "..", "..");
const CATALOG = "design/reui-catalog.json";
const SNAP = "tools/reui_catalog/snapshot";
const T = 60_000;

// ---- guards and copies ----

const temps = [];
const git = (...a) => spawnSync("git", a, { cwd: ROOT, encoding: "utf8" }).stdout;
const realState = () =>
  git("status", "--porcelain", "--", "tools/reui_catalog", CATALOG) +
  lib.sha256(
    ["pin.json", "snapshot/llms-full.txt", "snapshot/llms.txt"]
      .map((f) => readFileSync(join(TOOL, f), "utf8"))
      .join("\0") + readFileSync(join(ROOT, CATALOG), "utf8"),
  );
let baseline;
beforeAll(() => {
  baseline = realState();
});
afterEach(() => {
  expect(realState(), "real repo changed by a test").toBe(baseline);
});
afterAll(() => {
  for (const d of temps) rmSync(d, { recursive: true, force: true });
});

function tempDir() {
  const d = mkdtempSync(join(tmpdir(), "reui-doc-chac-"));
  temps.push(d);
  return d;
}

/** Run a catalog command of `root` under the network blocker, from a directory that is not `root`. */
function run(root, script, ...args) {
  const r = spawnSync(
    process.execPath,
    [
      "--require",
      join(root, "tools/reui_catalog/no-network.cjs"),
      join(root, "tools/reui_catalog", script),
      ...args,
    ],
    { cwd: tmpdir(), encoding: "utf8" },
  );
  return { code: r.status, out: r.stdout, err: r.stderr };
}

/** A copy of the real catalog folder, catalog file and prettier config, with node_modules linked. */
function makeCopy() {
  const root = tempDir();
  cpSync(TOOL, join(root, "tools/reui_catalog"), { recursive: true });
  mkdirSync(join(root, "design"));
  cpSync(join(ROOT, CATALOG), join(root, CATALOG));
  cpSync(join(ROOT, ".prettierrc.json"), join(root, ".prettierrc.json"));
  symlinkSync(join(ROOT, "node_modules"), join(root, "node_modules"), "dir");
  const p = (rel) => join(root, rel);
  const read = (rel) => readFileSync(p(rel), "utf8");
  const files = [
    "tools/reui_catalog/pin.json",
    `${SNAP}/llms-full.txt`,
    `${SNAP}/llms.txt`,
    CATALOG,
  ];
  return {
    root,
    read,
    write: (rel, text) => writeFileSync(p(rel), text),
    run: (script, ...args) => run(root, script, ...args),
    state: () => files.map((f) => lib.sha256(read(f))).join(","),
  };
}

/** Recompute the copy's pin hashes after editing its snapshot, so the run reaches the reader. */
function repinCopy(c) {
  const pin = JSON.parse(c.read("tools/reui_catalog/pin.json"));
  for (const f of pin.files) f.sha256 = lib.sha256(c.read(`${SNAP}/${f.file}`));
  c.write("tools/reui_catalog/pin.json", `${JSON.stringify(pin, null, 2)}\n`);
}

const realText = (file) => readFileSync(join(TOOL, "snapshot", file), "utf8");
const realCatalog = () => JSON.parse(readFileSync(join(ROOT, CATALOG), "utf8"));

/** A source folder for `--refresh --from`: the real snapshot files, with `edits[file]` applied. */
function sourceDir(edits = {}) {
  const d = tempDir();
  for (const s of lib.SOURCES) {
    const text = realText(s.file);
    writeFileSync(join(d, s.file), edits[s.file] ? edits[s.file](text) : text);
  }
  return d;
}

// ---- heading matrix (AC-1 to AC-4) ----

const SECTIONS = [
  {
    file: "llms-full.txt",
    label: "Pro blocks",
    kind: "block",
    count: "678",
    cased: "Pro Blocks",
    renamed: "Blocks",
  },
  {
    file: "llms-full.txt",
    label: "Free examples",
    kind: "example",
    count: "1,264",
    cased: "Free Examples",
    renamed: "Examples",
  },
  {
    file: "llms.txt",
    label: "ReUI Primitives",
    kind: "component",
    count: "27",
    cased: "ReUI primitives",
    renamed: "Primitives",
  },
];
const HEADING_FORMS = [
  ["case", (s) => `## ${s.cased} (${s.count})`],
  ["no count", (s) => `## ${s.label}`],
  ["count with words", (s) => `## ${s.label} (${s.count} items)`],
  ["heading level", (s) => `### ${s.label} (${s.count})`],
  ["trailing space", (s) => `## ${s.label} (${s.count}) `],
  ["CRLF", (s) => `## ${s.label} (${s.count})\r`],
  ["renamed", (s) => `## ${s.renamed} (${s.count})`],
];
const HEADING_MATRIX = SECTIONS.flatMap((s) =>
  HEADING_FORMS.map(([form, line]) => ({ s, form, line: line(s) })),
);
const missingLine = (s) => `section missing in ${s.file}: ${s.label} (${s.kind})`;

/** Replace the one original heading line of section `s` with `line`. */
function headingEdit(s, line) {
  return (text) => {
    const lines = text.split("\n");
    const at = lines.flatMap((l, i) => (l === `## ${s.label} (${s.count})` ? [i] : []));
    expect(at, `heading of ${s.label} in ${s.file}`).toHaveLength(1);
    lines[at[0]] = line;
    const out = lines.join("\n");
    expect(out).not.toBe(text);
    return out;
  };
}

describe("DC1 · heading forms stop the re-pin", () => {
  it("DC1 · matrix is 3 required sections x 7 heading forms", () => {
    expect(SECTIONS.map(({ file, label, kind }) => ({ file, label, kind }))).toEqual(
      lib.REQUIRED_SECTIONS,
    );
    expect(new Set(SECTIONS.map((s) => s.kind))).toEqual(new Set(lib.KINDS));
    expect(HEADING_MATRIX).toHaveLength(21);
  });

  for (const m of HEADING_MATRIX) {
    it(
      `DC1 · ${m.s.label} · ${m.form}`,
      () => {
        const c = makeCopy();
        const before = c.state();
        const dir = sourceDir({ [m.s.file]: headingEdit(m.s, m.line) });
        const r = c.run("build.mjs", "--refresh", "--from", dir);
        expect(r.code, r.out).toBe(1);
        expect(r.err).toContain(missingLine(m.s));
        expect(r.err).not.toContain("count mismatch");
        expect(c.state()).toBe(before);
      },
      T,
    );
  }
});

describe("DC2 · intact source", () => {
  it(
    "DC2 · intact source re-pins green",
    () => {
      const c = makeCopy();
      const r = c.run("build.mjs", "--refresh", "--from", sourceDir());
      expect(r.code, r.err).toBe(0);
      expect(r.out).toContain("678 blocks, 27 components, 1264 examples");
      expect(r.out.split("\n").filter((l) => /^(added|removed):/.test(l))).toEqual([]);
    },
    T,
  );
});

describe("DC3 · hand-edited snapshot stops regenerate and check", () => {
  for (const s of SECTIONS) {
    for (const [cmd, args] of [
      ["regenerate", []],
      ["check", ["--check"]],
    ]) {
      it(
        `DC3 · ${s.label} · ${cmd}`,
        () => {
          const c = makeCopy();
          const rel = `${SNAP}/${s.file}`;
          c.write(rel, headingEdit(s, `## ${s.label}`)(c.read(rel)));
          repinCopy(c);
          const before = c.read(CATALOG);
          const r = c.run("build.mjs", ...args);
          expect(r.code).toBe(1);
          expect(r.err).toContain(`section missing in ${s.file}: ${s.label}`);
          expect(c.read(CATALOG)).toBe(before);
        },
        T,
      );
    }
  }
});

describe("DC4 · naming", () => {
  const [pro, free] = SECTIONS;
  it(
    "DC4 · both llms-full sections missing are named together",
    () => {
      const c = makeCopy();
      const dir = sourceDir({
        "llms-full.txt": (t) =>
          headingEdit(
            free,
            `## ${free.renamed} (${free.count})`,
          )(headingEdit(pro, `## ${pro.renamed} (${pro.count})`)(t)),
      });
      const r = c.run("build.mjs", "--refresh", "--from", dir);
      expect(r.code).toBe(1);
      const lines = r.err.split("\n");
      const a = lines.findIndex((l) => l.includes(missingLine(pro)));
      const b = lines.findIndex((l) => l.includes(missingLine(free)));
      expect(a).toBeGreaterThanOrEqual(0);
      expect(b).toBeGreaterThanOrEqual(0);
      expect(a).not.toBe(b);
    },
    T,
  );

  it(
    "DC4 · nearest heading is named for a case change",
    () => {
      const c = makeCopy();
      const dir = sourceDir({ "llms-full.txt": headingEdit(pro, "## Pro Blocks (678)") });
      const r = c.run("build.mjs", "--refresh", "--from", dir);
      expect(r.code).toBe(1);
      expect(r.err).toContain("nearest heading line 7: ## Pro Blocks (678)");
    },
    T,
  );

  it(
    "DC4 · nearest heading is named for a dropped count, not for a rename",
    () => {
      const c = makeCopy();
      const dropped = c.run(
        "build.mjs",
        "--refresh",
        "--from",
        sourceDir({ "llms-full.txt": headingEdit(pro, "## Pro blocks") }),
      );
      expect(dropped.code).toBe(1);
      expect(dropped.err).toContain("nearest heading line 7: ## Pro blocks");
      const renamed = c.run(
        "build.mjs",
        "--refresh",
        "--from",
        sourceDir({ "llms-full.txt": headingEdit(pro, "## Blocks (678)") }),
      );
      expect(renamed.code).toBe(1);
      expect(renamed.err).toContain(missingLine(pro));
      expect(renamed.err).not.toContain("nearest heading");
    },
    T,
  );
});

// ---- forbidden text matrix (AC-5 to AC-8) ----

const FORMS = [
  { text: "```", label: "```" },
  { text: 'import x from "y"', label: "import" },
  { text: "import { a } from 'y'", label: "import" },
  { text: 'import * as a from "y"', label: "import" },
  { text: "export default", label: "export" },
  { text: "export const", label: "export" },
  { text: "export function", label: "export" },
  { text: "export class", label: "export" },
  { text: "Bearer", label: "Bearer" },
  { text: "REUI_LICENSE", label: "REUI_LICENSE" },
];
const TOP_KEYS = ["pin", "counts"];
const GROUP_FIELDS = ["kind", "group", "category", "base"];
const ITEM_FIELDS = ["name", "title", "description"];
const PLACE_KINDS = ["block", "component", "example"];
const SNAP_FILES = ["llms-full.txt", "llms.txt"];

const append = (value, text) => `${value ?? ""} ${text}`;
const firstGroup = (cat, kind) => cat.groups.find((g) => g.kind === kind);
const lastTextLine = (text) => {
  const lines = text.split("\n");
  for (let i = lines.length - 1; i >= 0; i -= 1) if (lines[i].trim()) return i + 1;
  throw new Error("empty file");
};

/**
 * A place: `inject(form)` returns the scan errors of the injected copy and `where` the expected error prefix;
 * `copy(c, form)` does the same injection in a repo copy for the --check run.
 */
const PLACES = [
  ...TOP_KEYS.map((key) => ({
    id: key,
    layer: "top",
    edit: (cat, t) => {
      if (key === "pin") cat.pin.fetched_at = append(cat.pin.fetched_at, t);
      else cat.counts.block = append(cat.counts.block, t);
    },
    where: () => key,
  })),
  ...GROUP_FIELDS.flatMap((field) =>
    PLACE_KINDS.map((kind) => ({
      id: `${field} (${kind})`,
      layer: "group",
      edit: (cat, t) => {
        const g = firstGroup(cat, kind);
        g[field] = append(g[field], t);
      },
      where: (cat0, t) => {
        const cat = firstGroup(cat0, kind).category;
        return field === "category" ? `group ${append(cat, t)}` : `group ${cat}`;
      },
    })),
  ),
  ...ITEM_FIELDS.flatMap((field) =>
    PLACE_KINDS.map((kind) => ({
      id: `${field} (${kind})`,
      layer: "item",
      edit: (cat, t) => {
        const it = firstGroup(cat, kind).items[0];
        it[field] = append(it[field], t);
      },
      where: (cat0, t) => {
        const name = firstGroup(cat0, kind).items[0].name;
        return field === "name" ? append(name, t) : name;
      },
    })),
  ),
  ...SNAP_FILES.flatMap((file) =>
    [
      ["line 3", () => 3],
      ["last line", (text) => lastTextLine(text)],
    ].map(([pos, lineOf]) => ({
      id: `${file} ${pos}`,
      layer: "snapshot",
      file,
      lineOf,
    })),
  ),
];
const FORBIDDEN_MATRIX = PLACES.flatMap((place) => FORMS.map((form) => ({ place, form })));

const CHECK_PAIRS = [
  ["pin", 0],
  ["counts", 1],
  ["kind (block)", 2],
  ["category (example)", 3],
  ["base (component)", 4],
  ["name (example)", 5],
  ["title (block)", 6],
  ["description (component)", 7],
  ["llms-full.txt line 3", 8],
  ["llms.txt last line", 9],
];

function injectSnapshot(texts, place, form) {
  const n = place.lineOf(texts[place.file]);
  const lines = texts[place.file].split("\n");
  lines[n - 1] = `${lines[n - 1]} ${form.text}`;
  return { texts: { ...texts, [place.file]: lines.join("\n") }, n };
}

/** The pinned message for one place and form, computed from the untouched real files. */
function expectedMessage(place, form, cat0, texts0) {
  if (place.layer === "snapshot") {
    const n = place.lineOf(texts0[place.file]);
    return `forbidden in snapshot ${place.file} line ${n}: ${form.label}`;
  }
  return `forbidden in ${place.where(cat0, form.text)}: ${form.label}`;
}

describe("DC5 · forbidden text matrix", () => {
  const cat0 = realCatalog();
  const texts0 = lib.readSnapshot();

  it("DC5 · matrix is anchored to the code lists", () => {
    expect(new Set(FORMS.map((f) => f.label))).toEqual(new Set(lib.FORBIDDEN.map((f) => f.label)));
    expect(TOP_KEYS).toEqual(lib.ALLOWED_FIELDS.top.filter((k) => k !== "groups"));
    expect(GROUP_FIELDS).toEqual(lib.ALLOWED_FIELDS.group.filter((k) => k !== "items"));
    expect(ITEM_FIELDS).toEqual(lib.ALLOWED_FIELDS.item);
    expect(new Set(PLACE_KINDS)).toEqual(new Set(lib.KINDS));
    expect(SNAP_FILES).toEqual(lib.SOURCES.map((s) => s.file));
    expect(PLACES).toHaveLength(2 + 7 * 3 + 2 * 2);
    expect(FORBIDDEN_MATRIX).toHaveLength(270);
    expect(CHECK_PAIRS.map(([, f]) => f).sort((a, b) => a - b)).toEqual(FORMS.map((_, i) => i));
    expect(new Set(CHECK_PAIRS.map(([id]) => PLACES.find((p) => p.id === id).layer))).toEqual(
      new Set(["top", "group", "item", "snapshot"]),
    );
  });

  for (const { place, form } of FORBIDDEN_MATRIX) {
    it(`DC5 · ${place.id} · ${form.text}`, () => {
      const msg = expectedMessage(place, form, cat0, texts0);
      if (place.layer === "snapshot") {
        const { texts } = injectSnapshot(texts0, place, form);
        expect(texts[place.file]).not.toBe(texts0[place.file]);
        expect(lib.scanSnapshot(texts)).toEqual([msg]);
      } else {
        const cat = structuredClone(cat0);
        place.edit(cat, form.text);
        expect(JSON.stringify(cat)).not.toBe(JSON.stringify(cat0));
        expect(lib.scanCatalog(cat)).toEqual([msg]);
      }
    });
  }
});

describe("DC6 · unknown fields", () => {
  const LEVELS = [
    ["top", (cat) => cat, () => "catalog"],
    ["group", (cat) => cat.groups[0], (cat) => `group ${cat.groups[0].category}`],
    ["item", (cat) => cat.groups[0].items[0], (cat) => cat.groups[0].items[0].name],
  ];
  it("DC6 · levels are anchored to ALLOWED_FIELDS", () => {
    expect(LEVELS.map(([l]) => l)).toEqual(Object.keys(lib.ALLOWED_FIELDS));
  });
  for (const [level, target, where] of LEVELS) {
    it(`DC6 · ${level}`, () => {
      const cat = realCatalog();
      target(cat).source = "x";
      expect(lib.scanCatalog(cat)).toEqual([`forbidden field in ${where(cat)}: source`]);
    });
  }
});

describe("DC7 · clean controls", () => {
  it("DC7 · committed catalog and snapshots scan clean", () => {
    expect(lib.scanCatalog(realCatalog())).toEqual([]);
    expect(lib.scanSnapshot(lib.readSnapshot())).toEqual([]);
  });
  it("DC7 · near-miss text is not flagged", () => {
    const cat = realCatalog();
    const it0 = cat.groups[0].items[0];
    it0.description = `${it0.description} Import data from a CSV file. Export table rows.`;
    expect(lib.scanCatalog(cat)).toEqual([]);
  });
  it(
    "DC7 · check is green with forbidden: 0",
    () => {
      const r = makeCopy().run("build.mjs", "--check");
      expect(r.code, r.err).toBe(0);
      expect(r.out).toContain("forbidden: 0");
    },
    T,
  );
});

describe("DC8 · check command catches every layer", () => {
  const cat0 = realCatalog();
  const texts0 = lib.readSnapshot();
  for (const [id, f] of CHECK_PAIRS) {
    const place = PLACES.find((p) => p.id === id);
    const form = FORMS[f];
    it(
      `DC8 · ${id} · ${form.text}`,
      () => {
        const c = makeCopy();
        if (place.layer === "snapshot") {
          const { texts } = injectSnapshot(texts0, place, form);
          c.write(`${SNAP}/${place.file}`, texts[place.file]);
          repinCopy(c);
        } else {
          const cat = structuredClone(cat0);
          place.edit(cat, form.text);
          c.write(CATALOG, JSON.stringify(cat, null, 2));
        }
        const r = c.run("build.mjs", "--check");
        expect(r.code).toBe(1);
        expect(r.err).toContain(expectedMessage(place, form, cat0, texts0));
      },
      T,
    );
  }
});

// ---- reopened at the evidence gate (AC-11, AC-12) ----

const KEY_PLACES = [
  ["pin", (cat) => cat.pin, "pin"],
  ["pin.files[0]", (cat) => cat.pin.files[0], "pin"],
  ["counts", (cat) => cat.counts, "counts"],
];
const KEY_MATRIX = KEY_PLACES.flatMap((place) => FORMS.map((form) => ({ place, form })));

describe("DC11 · forbidden key names", () => {
  const cat0 = realCatalog();
  it("DC11 · matrix is 10 forms x 3 key places", () => {
    expect(FORMS).toHaveLength(10);
    expect(KEY_MATRIX).toHaveLength(30);
  });
  for (const { place, form } of KEY_MATRIX) {
    const [id, target, where] = place;
    it(`DC11 · ${id} · ${form.text}`, () => {
      const cat = structuredClone(cat0);
      target(cat)[form.text] = "x";
      expect(Object.keys(target(cat))).toContain(form.text);
      expect(lib.scanCatalog(cat)).toEqual([`forbidden in ${where}: ${form.label}`]);
    });
  }
});

/** Drop every line of section `s` after its heading up to the next `## ` heading, and declare 0. */
function emptySection(s) {
  return (text) => {
    const lines = text.split("\n");
    const at = lines.indexOf(`## ${s.label} (${s.count})`);
    expect(at, `heading of ${s.label}`).toBeGreaterThanOrEqual(0);
    let end = at + 1;
    while (end < lines.length && !lines[end].startsWith("## ")) end += 1;
    const out = [...lines.slice(0, at), `## ${s.label} (0)`, "", ...lines.slice(end)].join("\n");
    expect(out).not.toBe(text);
    return out;
  };
}

describe("DC12 · one place for section headings", () => {
  const prim = SECTIONS[2];
  const renameInCode = (c) => {
    const rel = "tools/reui_catalog/catalog.mjs";
    const code = c.read(rel);
    const changed = code.replace('label: "ReUI Primitives"', 'label: "ReUI primitives"');
    expect(changed).not.toBe(code);
    c.write(rel, changed);
  };

  it(
    "DC12 · label renamed in code and source re-pins all 27 components",
    () => {
      const c = makeCopy();
      renameInCode(c);
      const dir = sourceDir({ "llms.txt": headingEdit(prim, "## ReUI primitives (27)") });
      const r = c.run("build.mjs", "--refresh", "--from", dir);
      expect(r.code, r.err).toBe(0);
      expect(r.out).toContain("27 components");
      expect(r.out.split("\n").filter((l) => l.startsWith("removed:"))).toEqual([]);
    },
    T,
  );

  it(
    "DC12 · label renamed in code only stops and names the section",
    () => {
      const c = makeCopy();
      renameInCode(c);
      const r = c.run("build.mjs", "--refresh", "--from", sourceDir());
      expect(r.code).toBe(1);
      expect(r.err).toContain("section missing in llms.txt: ReUI primitives (component)");
    },
    T,
  );

  for (const s of SECTIONS) {
    it(
      `DC12 · ${s.label} · empty section`,
      () => {
        const c = makeCopy();
        const before = c.state();
        const r = c.run(
          "build.mjs",
          "--refresh",
          "--from",
          sourceDir({ [s.file]: emptySection(s) }),
        );
        expect(r.code, r.out).toBe(1);
        expect(r.err).toContain(`section empty in ${s.file}: ${s.label} (${s.kind})`);
        expect(c.state()).toBe(before);
      },
      T,
    );
  }
});
