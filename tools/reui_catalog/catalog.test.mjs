// Tests for the pinned ReUI catalog. Case names start with the eval id of
// _acceptance/danh-muc-reui/evals.yaml. Every red case breaks one thing in a copy of the real files,
// runs the copy's own command by absolute path from another directory, and checks the real repo is untouched.
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

import { checkFindable, loadIndex, sha256 } from "./catalog.mjs";

const TOOL = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(TOOL, "..", "..");
const CATALOG = "design/reui-catalog.json";
const T = 30_000;

const temps = [];
const git = (...a) => spawnSync("git", a, { cwd: ROOT, encoding: "utf8" }).stdout;
const realState = () =>
  git("status", "--porcelain", "--", "tools/reui_catalog", CATALOG) +
  sha256(
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
  const d = mkdtempSync(join(tmpdir(), "reui-catalog-"));
  temps.push(d);
  return d;
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
  return {
    root,
    p,
    read: (rel) => readFileSync(p(rel), "utf8"),
    write: (rel, text) => writeFileSync(p(rel), text),
    run: (script, ...args) => run(root, script, ...args),
  };
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

const realCatalog = () => JSON.parse(readFileSync(join(ROOT, CATALOG), "utf8"));
const realPin = () => JSON.parse(readFileSync(join(TOOL, "pin.json"), "utf8"));

/** Re-pin a copy's snapshot after editing it, so the test reaches the reader instead of the hash check. */
function repinCopy(c) {
  const pin = JSON.parse(c.read("tools/reui_catalog/pin.json"));
  for (const f of pin.files) f.sha256 = sha256(c.read(`tools/reui_catalog/snapshot/${f.file}`));
  c.write("tools/reui_catalog/pin.json", `${JSON.stringify(pin, null, 2)}\n`);
}

describe("E2 · pin hash", () => {
  it(
    "E2 · intact copy regenerates and checks green",
    () => {
      const c = makeCopy();
      const before = c.read(CATALOG);
      const b = c.run("build.mjs");
      expect(b.code, b.err).toBe(0);
      expect(b.out).toContain("unchanged design/reui-catalog.json");
      const k = c.run("build.mjs", "--check");
      expect(k.code, k.err).toBe(0);
      expect(k.out).toContain("snapshot hashes match pin");
      expect(c.read(CATALOG)).toBe(before);
    },
    T,
  );

  for (const file of ["llms-full.txt", "llms.txt"]) {
    it(
      `E2 · flipped byte in ${file} is refused`,
      () => {
        const c = makeCopy();
        const rel = `tools/reui_catalog/snapshot/${file}`;
        const text = c.read(rel);
        const at = text.indexOf("e", 500);
        c.write(rel, `${text.slice(0, at)}f${text.slice(at + 1)}`);
        const before = c.read(CATALOG);
        for (const args of [[], ["--check"]]) {
          const r = c.run("build.mjs", ...args);
          expect(r.code).toBe(1);
          expect(r.err).toContain(`snapshot hash mismatch: ${file}`);
        }
        expect(c.read(CATALOG)).toBe(before);
      },
      T,
    );
  }
});

describe("E3 · counts", () => {
  it("E3 · committed catalog has 678 blocks, 27 components, 1264 examples and the pin", () => {
    const cat = realCatalog();
    expect(cat.counts).toEqual({ block: 678, component: 27, example: 1264 });
    const read = { block: 0, component: 0, example: 0 };
    for (const it of loadIndex(cat).items) read[it.kind] += 1;
    expect(read).toEqual(cat.counts);
    expect(cat.pin).toEqual(realPin());
  });

  const cases = [
    {
      name: "E3 · missing block row stops the build",
      file: "llms-full.txt",
      edit: (t) => t.replace(/^- \[.*\/app-shell-1\):.*\n/m, ""),
      msg: "count mismatch: Application: App Shell declares 36, read 35",
    },
    {
      name: "E3 · missing component row stops the build",
      file: "llms.txt",
      edit: (t) => t.replace(/^- \[Alert\]\(.*\n/m, ""),
      msg: "count mismatch: ReUI Primitives declares 27, read 26",
    },
    {
      name: "E3 · unreadable item line stops the build",
      file: "llms-full.txt",
      edit: (t) => t.replace(/^- \[(.*\/app-shell-2)\)/m, "- [$1"),
      msg: "unreadable item line ",
    },
  ];
  for (const k of cases) {
    it(
      k.name,
      () => {
        const c = makeCopy();
        const rel = `tools/reui_catalog/snapshot/${k.file}`;
        const text = c.read(rel);
        const broken = k.edit(text);
        expect(broken).not.toBe(text);
        c.write(rel, broken);
        repinCopy(c);
        const before = c.read(CATALOG);
        const r = c.run("build.mjs");
        expect(r.code).toBe(1);
        expect(r.err).toContain(k.msg);
        expect(c.read(CATALOG)).toBe(before);
      },
      T,
    );
  }
});

describe("E4 · lookup", () => {
  const date = realPin().fetched_at.slice(0, 10);

  it(
    "E4 · kanban lists 10 ranked items with the pin date",
    () => {
      const r = run(ROOT, "tra.mjs", "kanban");
      expect(r.code, r.err).toBe(0);
      const lines = r.out.trim().split("\n");
      expect(lines[0]).toBe(`ReUI catalog pinned ${date}`);
      expect(lines).toHaveLength(11);
      expect(lines[1].startsWith("@reui/kanban · component · ")).toBe(true);
    },
    T,
  );

  it(
    "E4 · same query twice gives the same output",
    () => {
      const a = run(ROOT, "tra.mjs", "data", "grid", "filters");
      const b = run(ROOT, "tra.mjs", "data", "grid", "filters");
      expect(a.code).toBe(0);
      expect(a.out).toBe(b.out);
    },
    T,
  );

  it(
    "E4 · --loai block lists only blocks",
    () => {
      const r = run(ROOT, "tra.mjs", "kanban", "--loai", "block");
      expect(r.code).toBe(0);
      const rows = r.out.trim().split("\n").slice(1);
      expect(rows.length).toBeGreaterThan(0);
      for (const row of rows) expect(row.split(" · ")[1]).toBe("block");
    },
    T,
  );

  it(
    "E4 · --json returns name, kind, category, title, url",
    () => {
      const r = run(ROOT, "tra.mjs", "kanban", "--json");
      expect(r.code).toBe(0);
      const data = JSON.parse(r.out);
      expect(data.pinned).toBe(date);
      expect(data.results).toHaveLength(10);
      for (const it of data.results) {
        for (const k of ["name", "kind", "category", "title", "url"]) expect(it[k]).toBeTruthy();
      }
    },
    T,
  );

  it(
    "E4 · no match exits 1 with the pin date",
    () => {
      const r = run(ROOT, "tra.mjs", "zzqxw");
      expect(r.code).toBe(1);
      expect(r.out).toContain(
        `không có mục nào khớp «zzqxw» trong danh mục ReUI ghim ngày ${date}`,
      );
    },
    T,
  );
});

describe("E5 · findable", () => {
  it("E5 · every entry is findable", () => {
    const f = checkFindable(loadIndex(realCatalog()));
    expect(f.errors).toEqual([]);
    expect(f.total).toBe(1969);
    expect(f.byName).toBe(1969);
    expect(f.byTitle).toBe(1969);
  });

  it(
    "E5 · entry unreachable by name is red",
    () => {
      const c = makeCopy();
      const cat = JSON.parse(c.read(CATALOG));
      const items = cat.groups[0].items;
      items[1].name = items[0].name;
      c.write(CATALOG, JSON.stringify(cat, null, 2));
      const r = c.run("build.mjs", "--check");
      expect(r.code).toBe(1);
      expect(r.err).toContain(`not findable by name: ${items[0].name}`);
    },
    T,
  );

  it(
    "E5 · entry pushed out of top 10 by title is red",
    () => {
      const c = makeCopy();
      const cat = JSON.parse(c.read(CATALOG));
      const g = cat.groups.find((x) => x.items.some((i) => i.name === "c-accordion-1"));
      const target = g.items.find((i) => i.name === "c-accordion-1");
      for (let n = 1; n <= 10; n += 1) {
        g.items.unshift({ name: `c-accordion-0-${n}`, title: target.title });
      }
      c.write(CATALOG, JSON.stringify(cat, null, 2));
      const r = c.run("build.mjs", "--check");
      expect(r.code).toBe(1);
      expect(r.err).toContain("not findable by title: c-accordion-1");
    },
    T,
  );
});

describe("E6 · only names and descriptions", () => {
  const item = (cat) => cat.groups[0].items[0];
  const inject = (text) => (cat) => {
    item(cat).description = `${item(cat).description} ${text}`;
  };
  const snap = (file, text) => ({ file, text });
  const MATRIX = [
    {
      label: "source",
      catalog: (cat) => (item(cat).source = "x"),
      msg: (n) => `forbidden field in ${n}: source`,
    },
    {
      label: "files",
      catalog: (cat) => (item(cat).files = ["a.tsx"]),
      msg: (n) => `forbidden field in ${n}: files`,
    },
    { label: "```", catalog: inject("```tsx"), msg: (n) => `forbidden in ${n}: \`\`\`` },
    {
      label: "import",
      catalog: inject('import x from "y"'),
      msg: (n) => `forbidden in ${n}: import`,
    },
    { label: "export", catalog: inject("export default"), msg: (n) => `forbidden in ${n}: export` },
    { label: "Bearer", catalog: inject("Bearer"), msg: (n) => `forbidden in ${n}: Bearer` },
    {
      label: "REUI_LICENSE",
      catalog: inject("REUI_LICENSE"),
      msg: (n) => `forbidden in ${n}: REUI_LICENSE`,
    },
    {
      label: "snapshot ```",
      snapshot: snap("llms-full.txt", "```"),
      msg: () => "forbidden in snapshot llms-full.txt line 3: ```",
    },
    {
      label: "snapshot Bearer",
      snapshot: snap("llms.txt", "Bearer"),
      msg: () => "forbidden in snapshot llms.txt line 3: Bearer",
    },
  ];

  it("E6 · matrix has 9 injections", () => {
    expect(MATRIX).toHaveLength(9);
  });

  it(
    "E6 · committed catalog and snapshots are clean",
    () => {
      const r = run(ROOT, "build.mjs", "--check");
      expect(r.code, r.err).toBe(0);
      expect(r.out).toContain("forbidden: 0");
    },
    T,
  );

  for (const m of MATRIX) {
    it(
      `E6 · ${m.label} is red`,
      () => {
        const c = makeCopy();
        const cat = JSON.parse(c.read(CATALOG));
        const name = item(cat).name;
        if (m.catalog) {
          m.catalog(cat);
          c.write(CATALOG, JSON.stringify(cat, null, 2));
        } else {
          const rel = `tools/reui_catalog/snapshot/${m.snapshot.file}`;
          const lines = c.read(rel).split("\n");
          lines[2] = `${lines[2]} ${m.snapshot.text}`;
          c.write(rel, lines.join("\n"));
        }
        const r = c.run("build.mjs", "--check");
        expect(r.code).toBe(1);
        expect(r.err).toContain(m.msg(name));
      },
      T,
    );
  }
});

describe("E7 · re-pin", () => {
  /** A source folder built from the real snapshot with one block added and one example removed. */
  function changedSource() {
    const dir = tempDir();
    let full = readFileSync(join(TOOL, "snapshot/llms-full.txt"), "utf8");
    full = full
      .replace("## Pro blocks (678)", "## Pro blocks (679)")
      .replace(
        "### Application: App Shell (36)\n\n",
        "### Application: App Shell (37)\n\n- [Test shell](https://reui.io/blocks/application/app-shell/app-shell-999): Test block.\n",
      )
      .replace("## Free examples (1,264)", "## Free examples (1,263)")
      .replace("### Accordion (11)", "### Accordion (10)")
      .replace(/^- \[.*\/c-accordion-1\)\n/m, "");
    writeFileSync(join(dir, "llms-full.txt"), full);
    cpSync(join(TOOL, "snapshot/llms.txt"), join(dir, "llms.txt"));
    return { dir, full };
  }

  it(
    "E7 · refresh --from reports added and removed",
    () => {
      const c = makeCopy();
      const { dir, full } = changedSource();
      const r = c.run("build.mjs", "--refresh", "--from", dir);
      expect(r.code, r.err).toBe(0);
      expect(r.out).toContain("added: app-shell-999");
      expect(r.out).toContain("removed: c-accordion-1");
      const pin = JSON.parse(c.read("tools/reui_catalog/pin.json"));
      expect(pin.files.find((f) => f.file === "llms-full.txt").sha256).toBe(sha256(full));
      const names = loadIndex(JSON.parse(c.read(CATALOG))).items.map((i) => i.name);
      expect(names).toContain("app-shell-999");
      expect(names).not.toContain("c-accordion-1");
      expect(c.run("build.mjs", "--check").code).toBe(0);
    },
    T,
  );

  it(
    "E7 · refresh refuses a source with forbidden text",
    () => {
      const c = makeCopy();
      const { dir, full } = changedSource();
      writeFileSync(join(dir, "llms-full.txt"), full.replace("Test block.", "Test block. ```tsx"));
      const files = [
        "tools/reui_catalog/snapshot/llms-full.txt",
        "tools/reui_catalog/pin.json",
        CATALOG,
      ];
      const before = files.map((f) => c.read(f));
      const r = c.run("build.mjs", "--refresh", "--from", dir);
      expect(r.code).toBe(1);
      expect(r.err).toContain("refusing to pin a source with forbidden text");
      expect(files.map((f) => c.read(f))).toEqual(before);
    },
    T,
  );
});

describe("E8 · blocker", () => {
  const probes = [
    { api: "fetch", code: 'await fetch("http://127.0.0.1:9")' },
    { api: "http.get", code: 'const h = await import("node:http"); h.get("http://127.0.0.1:9")' },
    {
      api: "https.request",
      code: 'import { request } from "node:https"; request("https://127.0.0.1:9")',
    },
    { api: "net.connect", code: 'const n = await import("node:net"); n.connect(9, "127.0.0.1")' },
  ];
  for (const p of probes) {
    it(
      `E8 · blocker stops ${p.api}`,
      () => {
        const script = `${p.code};\nsetTimeout(() => process.exit(0), 200);`;
        const node = (pre) =>
          spawnSync(process.execPath, [...pre, "--input-type=module", "-e", script], {
            encoding: "utf8",
          });
        const open = node([]);
        expect(open.stderr).not.toContain("network blocked");
        const shut = node(["--require", join(TOOL, "no-network.cjs")]);
        expect(shut.status).not.toBe(0);
        expect(shut.stderr).toContain(`network blocked: ${p.api}`);
      },
      T,
    );
  }
});

describe("E10 · README", () => {
  it(
    "E10 · README commands run as documented",
    () => {
      const readme = readFileSync(join(TOOL, "README.md"), "utf8");
      const blocks = [...readme.matchAll(/```bash\n([\s\S]*?)```/g)].map((m) => m[1]);
      const lines = blocks.flatMap((b) => b.split("\n").filter((l) => l.trim()));
      expect(lines.length).toBeGreaterThan(5);
      const c = makeCopy();
      let ran = 0;
      for (const line of lines) {
        const m = line.match(/^node tools\/reui_catalog\/(\S+\.mjs)(.*)$/);
        expect(m, `not a catalog command: ${line}`).toBeTruthy();
        const args = m[2].trim() ? m[2].trim().split(/\s+/) : [];
        if (args.includes("--refresh") && !args.includes("--from")) {
          expect(readme).toContain("It is the only command that needs the network");
          continue;
        }
        if (args.includes("--from")) {
          const r = c.run(m[1], "--refresh", "--from", join(c.root, "tools/reui_catalog/snapshot"));
          expect(r.code, `${line}\n${r.err}`).toBe(0);
        } else {
          const r = run(ROOT, m[1], ...args);
          expect(r.code, `${line}\n${r.err}`).toBe(0);
        }
        ran += 1;
      }
      expect(ran).toBe(lines.length - 1);

      const date = realPin().fetched_at.slice(0, 10);
      const out = run(ROOT, "tra.mjs", "zzqxw").out.trim().split("\n");
      const taught = readme.match(/```text\n(.*)\n```/)[1];
      expect(out[1]).toBe(taught.replace("<words>", "zzqxw").replace("<date>", date));
      expect(readme).toContain("under the line `ReUI catalog pinned <date>`");
      expect(out[0]).toBe(`ReUI catalog pinned ${date}`);
    },
    T,
  );
});
