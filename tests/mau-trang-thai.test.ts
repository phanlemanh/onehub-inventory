// VP11 chuan-hoa-he-design, AC-1 (E2): six statuses, six badge variants, and the info tone belongs to «Đang giao dịch»
// alone. The checks are functions so each one is also shown failing on a broken copy, in this file.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

import { STATUS_TONE } from "../src/lib/format";

const ROOT = join(__dirname, "..");

/** Throws when two statuses share a badge variant. */
function checkDistinct(table: Readonly<Record<string, string>>): void {
  const seen = new Map<string, string>();
  for (const [status, tone] of Object.entries(table)) {
    const other = seen.get(tone);
    if (other) throw new Error(`STATUS_TONE gives ${other} and ${status} the same variant`);
    seen.set(tone, status);
  }
}

/** The value a custom property takes in the light `:root { … }` block of a stylesheet. */
function rootValue(css: string, name: string): string | undefined {
  const block = /(^|\n):root\s*\{([^}]*)\}/.exec(css)?.[2] ?? "";
  return new RegExp(`${name}:\\s*([^;]+);`).exec(block)?.[1]?.trim();
}

/** Throws when the light info tone is the brand blue, or the same value as the primary. */
function checkLightInfo(css: string): void {
  const info = rootValue(css, "--info");
  if (!info) throw new Error("light --info not declared");
  if (info.includes("--onehub-blue") || info === rootValue(css, "--primary"))
    throw new Error("light --info equals the brand blue");
}

/** The source files of the app, outside the vendor folders. */
function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const rel = relative(ROOT, path);
    if (
      rel.startsWith(join("src", "components", "ui")) ||
      rel.startsWith(join("src", "components", "reui"))
    )
      continue;
    if (statSync(path).isDirectory()) out.push(...sourceFiles(path));
    else if (/\.tsx?$/.test(name)) out.push(path);
  }
  return out;
}

const INFO_USE = /info-light|info-outline|variant="info"|\b(text|bg|border)-info\b/;
const STATUS_TABLE = join("src", "lib", "format", "index.ts");

/** Throws when a file other than the status table uses the info tone; throws when there is nothing to scan. */
function checkInfoOnlyInStatusTable(files: readonly { path: string; text: string }[]): void {
  if (files.length === 0) throw new Error("no source file scanned");
  for (const { path, text } of files) {
    if (relative(ROOT, path) === STATUS_TABLE) continue;
    if (INFO_USE.test(text))
      throw new Error(`info used outside the status table: ${relative(ROOT, path)}`);
  }
}

const globals = readFileSync(join(ROOT, "src", "app", "globals.css"), "utf8");
const sources = sourceFiles(join(ROOT, "src")).map((path) => ({
  path,
  text: readFileSync(path, "utf8"),
}));

describe("AC-1 · six statuses, six variants", () => {
  it("gives the six statuses six different variants", () => {
    expect(Object.keys(STATUS_TONE)).toHaveLength(6);
    expect(() => checkDistinct(STATUS_TONE)).not.toThrow();
    expect(STATUS_TONE.Incomplete).toBe("invert-light");
    expect(STATUS_TONE.Pending).toBe("info-light");
  });

  it("fails when two statuses share a variant", () => {
    expect(() => checkDistinct({ ...STATUS_TONE, Incomplete: STATUS_TONE.Hold })).toThrow(
      "STATUS_TONE gives Incomplete and Hold the same variant",
    );
  });

  it("keeps the light info tone off the brand blue", () => {
    expect(() => checkLightInfo(globals)).not.toThrow();
  });

  it("fails when the light info tone is the brand blue", () => {
    const broken = globals.replace(/(:root\s*\{[^}]*?--info:)\s*[^;]+;/, "$1 var(--onehub-blue);");
    expect(broken).not.toBe(globals);
    expect(() => checkLightInfo(broken)).toThrow("light --info equals the brand blue");
  });

  it("uses the info tone only in the status table", () => {
    expect(sources.length).toBeGreaterThan(100);
    expect(() => checkInfoOnlyInStatusTable(sources)).not.toThrow();
  });

  it("fails when another file uses the info tone, or when nothing was scanned", () => {
    const planted = {
      path: join(ROOT, "src", "modules", "x", "ui", "planted.tsx"),
      text: '<Badge variant="info">',
    };
    expect(() => checkInfoOnlyInStatusTable([...sources, planted])).toThrow(
      "info used outside the status table: src/modules/x/ui/planted.tsx",
    );
    expect(() => checkInfoOnlyInStatusTable([])).toThrow("no source file scanned");
  });
});
