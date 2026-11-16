// Row 22, AC-9 (E9): the runbook in docs/van-hanh/ — four procedures with their required headings and four parts per
// step, the outside-repo list numbered 1..n with the variable names each item hands back, every `make <target>` it
// mentions defined in Makefile or mk/*.mk, and every variable of its variable table declared in .env.example.
// E10: the runbook stands on its own — no step sends the operator to `_acceptance/`, every outside-repo item says what
// passes and what to do on red, and the two procedures that install tools pin the vercel version and the Node version.
import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { tempDir } from "./support/temp-dir";

const ROOT = join(__dirname, "..");
const RUNBOOK = join("docs", "van-hanh");

const PROCEDURES = ["dua-ban-len.md", "lui-ban.md", "xoay-khoa.md", "khoi-phuc.md"];
const REQUIRED_HEADINGS = ["## Khi nào dùng", "## Cần có trước", "## Các bước", "## Đỏ thì làm gì"];
/** Every step under «## Các bước» says where, what to type or press, what passes and what to do on red. */
const STEP_PARTS = ["**Ở đâu:**", "**Gõ hay bấm:**", "**Đạt khi:**", "**Đỏ thì:**"];

function read(root: string, ...parts: string[]): string {
  return readFileSync(join(root, ...parts), "utf8");
}

/** The body of a `## ` section, up to the next `## ` heading. */
function section(text: string, heading: string): string {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => l.trim() === heading);
  if (start < 0) return "";
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => /^## /.test(l));
  return (end < 0 ? rest : rest.slice(0, end)).join("\n");
}

/** Targets defined in Makefile and mk/*.mk: `name:` or `a b:` at the start of a line, not `name :=`. */
export function makeTargets(root: string): Set<string> {
  const files = [join(root, "Makefile")];
  const mk = join(root, "mk");
  if (existsSync(mk))
    for (const f of readdirSync(mk)) if (f.endsWith(".mk")) files.push(join(mk, f));
  const targets = new Set<string>();
  for (const file of files) {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = /^([A-Za-z0-9_.-]+(?:[ \t]+[A-Za-z0-9_.-]+)*)[ \t]*:(?!=)/.exec(line);
      if (!m) continue;
      for (const name of m[1]!.split(/\s+/)) if (!name.startsWith(".")) targets.add(name);
    }
  }
  return targets;
}

/** Every `make <target>` mentioned in a .md file of the runbook whose target is not defined: "<target> (<file>)". */
export function missingMakeTargets(root: string): string[] {
  const targets = makeTargets(root);
  const dir = join(root, RUNBOOK);
  const missing: string[] = [];
  for (const file of readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()) {
    const text = read(dir, file);
    for (const m of text.matchAll(/\bmake\s+([a-z][a-z0-9_-]*)/g)) {
      const entry = `${m[1]} (${RUNBOOK}/${file})`;
      if (!targets.has(m[1]!) && !missing.includes(entry)) missing.push(entry);
    }
  }
  return missing;
}

/** Names declared in .env.example, as `NAME=` or commented `# NAME=`. */
function envExampleNames(root: string): Set<string> {
  const names = new Set<string>();
  for (const line of read(root, ".env.example").split("\n")) {
    const m = /^#?\s*([A-Z][A-Z0-9_]*)=/.exec(line);
    if (m) names.add(m[1]!);
  }
  return names;
}

/** UPPER_CASE names in the first column of the README's «## Bảng biến» table. */
function tableVariables(root: string): string[] {
  const body = section(read(root, RUNBOOK, "README.md"), "## Bảng biến");
  const names: string[] = [];
  for (const line of body.split("\n")) {
    if (!line.startsWith("|") || /^\|\s*-/.test(line)) continue;
    const first = line.split("|")[1] ?? "";
    for (const m of first.matchAll(/`([A-Z][A-Z0-9_]{2,})`/g)) names.push(m[1]!);
  }
  return names;
}

/** The top-level numbered items of the README's «## Việc ngoài kho»: number and full text. */
function outsideItems(root: string): { n: number; text: string }[] {
  const body = section(read(root, RUNBOOK, "README.md"), "## Việc ngoài kho");
  const items: { n: number; text: string }[] = [];
  for (const line of body.split("\n")) {
    const m = /^(\d+)\.\s/.exec(line);
    if (m) items.push({ n: Number(m[1]), text: line });
    else if (items.length && /^\s+\S/.test(line))
      items[items.length - 1]!.text += ` ${line.trim()}`;
  }
  return items;
}

/** The two labels every item of the README's «## Việc ngoài kho» carries, as in a procedure step. */
const OUTSIDE_PARTS = ["**Đạt khi:**", "**Đỏ thì:**"];
/** Procedures that install tools on the operator's machine, so they name the exact versions. */
const TOOL_PROCEDURES = ["dua-ban-len.md", "lui-ban.md"];
const TOOL_VERSIONS: { label: string; pattern: RegExp }[] = [
  { label: "vercel@<x.y.z>", pattern: /\bvercel@\d+\.\d+\.\d+\b/ },
  { label: "Node 24", pattern: /\bNode 24\b/ },
];

function runbookFiles(root: string): string[] {
  return readdirSync(join(root, RUNBOOK))
    .filter((f) => f.endsWith(".md"))
    .sort();
}

/** Every line of a runbook .md file that sends the reader to `_acceptance/`: "<file>:<line>". */
export function acceptanceMentions(root: string): string[] {
  const found: string[] = [];
  for (const file of runbookFiles(root))
    read(root, RUNBOOK, file)
      .split("\n")
      .forEach((line, k) => {
        if (line.includes("_acceptance/")) found.push(`${RUNBOOK}/${file}:${k + 1}`);
      });
  return found;
}

/** Every outside-repo item missing a label: "item <n>: <label>". */
export function outsideItemsMissingParts(root: string): string[] {
  const missing: string[] = [];
  for (const item of outsideItems(root))
    for (const part of OUTSIDE_PARTS)
      if (!item.text.includes(part)) missing.push(`item ${item.n}: ${part}`);
  return missing;
}

/** Every tool-installing procedure missing a pinned version: "<file>: <label>". */
export function missingToolVersions(root: string): string[] {
  const missing: string[] = [];
  for (const file of TOOL_PROCEDURES) {
    const text = read(root, RUNBOOK, file);
    for (const v of TOOL_VERSIONS) if (!v.pattern.test(text)) missing.push(`${file}: ${v.label}`);
  }
  return missing;
}

/** A temporary copy of the runbook folder, for the break cases. */
function runbookCopy(): string {
  const root = tempDir("van-hanh-");
  cpSync(join(ROOT, RUNBOOK), join(root, RUNBOOK), { recursive: true });
  return root;
}

describe("runbook docs/van-hanh (AC-9)", () => {
  it.each(PROCEDURES)("%s has every required heading", (file) => {
    const path = join(ROOT, RUNBOOK, file);
    expect(existsSync(path), `${file} is missing`).toBe(true);
    const headings = read(ROOT, RUNBOOK, file)
      .split("\n")
      .map((l) => l.trim());
    for (const h of REQUIRED_HEADINGS) expect(headings, `${file}: ${h}`).toContain(h);
  });

  it.each(PROCEDURES)("%s: every step says where, what, pass and red", (file) => {
    const steps = section(read(ROOT, RUNBOOK, file), "## Các bước")
      .split(/\n(?=### )/)
      .slice(1);
    expect(steps.length, `${file}: no ### step under ## Các bước`).toBeGreaterThan(0);
    for (const step of steps) {
      const title = step.split("\n")[0];
      for (const part of STEP_PARTS) expect(step, `${file} ${title}: ${part}`).toContain(part);
    }
  });

  it("README links the four procedures and the restore log", () => {
    const readme = read(ROOT, RUNBOOK, "README.md");
    for (const f of [...PROCEDURES, "nhat-ky-khoi-phuc.md"]) expect(readme).toContain(`(${f})`);
    expect(existsSync(join(ROOT, RUNBOOK, "nhat-ky-khoi-phuc.md"))).toBe(true);
  });

  it("the outside-repo list is numbered 1..n and each item names what the machine gets back", () => {
    const items = outsideItems(ROOT);
    expect(items.length).toBeGreaterThan(5);
    expect(items.map((i) => i.n)).toEqual(items.map((_, k) => k + 1));
    for (const item of items) expect(item.text, `item ${item.n}`).toContain("Máy nhận lại");
  });

  it("every make target the runbook mentions exists", () => {
    expect(missingMakeTargets(ROOT)).toEqual([]);
  });

  it("every variable of the variable table is declared in .env.example", () => {
    const names = tableVariables(ROOT);
    expect(names.length).toBeGreaterThan(10);
    const declared = envExampleNames(ROOT);
    expect(names.filter((n) => !declared.has(n))).toEqual([]);
  });

  it("break: a copy that mentions a target nobody defined names the target and the file", () => {
    const root = tempDir("van-hanh-");
    cpSync(join(ROOT, RUNBOOK), join(root, RUNBOOK), { recursive: true });
    cpSync(join(ROOT, "Makefile"), join(root, "Makefile"));
    cpSync(join(ROOT, "mk"), join(root, "mk"), { recursive: true });
    const file = join(root, RUNBOOK, "lui-ban.md");
    writeFileSync(
      file,
      `${readFileSync(file, "utf8")}\nGõ \`make khong-co-dich ENV=production\`.\n`,
    );
    expect(missingMakeTargets(root)).toEqual([`khong-co-dich (${RUNBOOK}/lui-ban.md)`]);
  });

  it("no runbook file sends the reader to _acceptance/ (E10)", () => {
    expect(acceptanceMentions(ROOT)).toEqual([]);
  });

  it("every outside-repo item says what passes and what to do on red (E10)", () => {
    expect(outsideItems(ROOT).length).toBeGreaterThan(5);
    expect(outsideItemsMissingParts(ROOT)).toEqual([]);
  });

  it("the procedures that install tools pin the vercel version and Node 24 (E10)", () => {
    expect(missingToolVersions(ROOT)).toEqual([]);
  });

  it("break: a copy that points at _acceptance/ names the file and the line", () => {
    const root = runbookCopy();
    const file = join(root, RUNBOOK, "xoay-khoa.md");
    const lines = readFileSync(file, "utf8").split("\n").length;
    writeFileSync(file, `${readFileSync(file, "utf8")}Làm theo \`_acceptance/x/de-xuat.md\`.\n`);
    expect(acceptanceMentions(root)).toEqual([`${RUNBOOK}/xoay-khoa.md:${lines}`]);
  });

  it("break: an outside-repo item without its red line names the item and the label", () => {
    const root = runbookCopy();
    const file = join(root, RUNBOOK, "README.md");
    const text = readFileSync(file, "utf8");
    const start = text.indexOf("\n7. ");
    const red = text.indexOf("**Đỏ thì:**", start);
    expect(start).toBeGreaterThan(0);
    writeFileSync(
      file,
      `${text.slice(0, red)}**Sai thì:**${text.slice(red + "**Đỏ thì:**".length)}`,
    );
    expect(outsideItemsMissingParts(root)).toEqual(["item 7: **Đỏ thì:**"]);
  });

  it("break: a procedure that installs an unpinned vercel on an unnamed Node names the file and both labels", () => {
    const root = runbookCopy();
    const file = join(root, RUNBOOK, "lui-ban.md");
    writeFileSync(
      file,
      readFileSync(file, "utf8")
        .replace(/vercel@\d+\.\d+\.\d+/g, "vercel@latest")
        .replace(/Node 24/g, "Node.js"),
    );
    expect(missingToolVersions(root)).toEqual([
      "lui-ban.md: vercel@<x.y.z>",
      "lui-ban.md: Node 24",
    ]);
  });
});
