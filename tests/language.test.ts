// decision:labels
// decision:tone-position
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

interface Concept {
  kind: string;
  reso?: string;
  own?: boolean;
  pref: string;
  lease?: string;
  alt?: string[];
  en: string;
  avoid?: string[];
}

const LOAD = [
  "import json, sys",
  "sys.path.insert(0, 'tools')",
  "from pathlib import Path",
  "from repo_ontology import load_yaml_file",
  "print(json.dumps(load_yaml_file(Path('ontology/labels.yaml'))))",
].join("\n");

const { concepts } = JSON.parse(execFileSync("python3", ["-c", LOAD], { encoding: "utf8" })) as {
  concepts: Record<string, Concept>;
};
const entries = Object.entries(concepts);
const displayed = (c: Concept): string[] => [c.pref, ...(c.lease ? [c.lease] : [])];

const OLD_TONE = /[òóỏõọ][ae](?!\p{L})|[ùúủũụ]y(?!\p{L})/iu;
const hasOldTone = (text: string): boolean => OLD_TONE.test(text);
const isSentenceCase = (label: string): boolean =>
  label.split(" ").every((word, i) => {
    const first = word.charAt(0);
    return i === 0 ? first === first.toUpperCase() : first === first.toLowerCase();
  });

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "generated" ? [] : sourceFiles(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });
}

describe("language checks can fail", () => {
  it("flags the old tone position only", () => {
    expect(hasOldTone("chuẩn hóa")).toBe(true);
    expect(hasOldTone("thủy")).toBe(true);
    expect(hasOldTone("chuẩn hoá")).toBe(false);
    expect(hasOldTone("hoàn tất")).toBe(false);
    expect(hasOldTone("quý")).toBe(false);
  });

  it("flags title case", () => {
    expect(isSentenceCase("Đầu Chủ")).toBe(false);
    expect(isSentenceCase("Đầu chủ")).toBe(true);
  });
});

describe("label dictionary", () => {
  it("anchors every concept to RESO or marks it as our own", () => {
    for (const [code, c] of entries) {
      expect(Boolean(c.reso) !== Boolean(c.own), code).toBe(true);
    }
  });

  it("gives every concept one unique preferred label", () => {
    const prefs = entries.map(([, c]) => c.pref);
    expect(new Set(prefs).size).toBe(prefs.length);
  });

  it("never uses a preferred label as an alternative of another concept", () => {
    const prefs = new Map(entries.map(([code, c]) => [c.pref, code]));
    for (const [code, c] of entries) {
      for (const alt of c.alt ?? []) {
        expect(prefs.get(alt) ?? code, `${code}: ${alt}`).toBe(code);
      }
    }
  });

  it("covers lease wherever a status, action or field label says sell", () => {
    for (const [code, c] of entries) {
      if (["status", "action", "field"].includes(c.kind) && c.pref.includes("bán")) {
        expect(c.lease, code).toBeTruthy();
      }
    }
  });

  it("keeps labels short, normalised and in the agreed style", () => {
    for (const [code, c] of entries) {
      for (const label of displayed(c)) {
        expect(label.length, code).toBeLessThanOrEqual(17);
        expect(label, code).toBe(label.normalize("NFC"));
        expect(isSentenceCase(label), `${code}: ${label}`).toBe(true);
        expect(hasOldTone(label), `${code}: ${label}`).toBe(false);
        expect(/[!\p{Extended_Pictographic}]/u.test(label), `${code}: ${label}`).toBe(false);
      }
    }
  });

  it("agrees with the display names in the glossary", () => {
    const glossary = readFileSync("ontology/glossary.md", "utf8");
    for (const [, code, display] of glossary.matchAll(/^\| `(\w+)`.*\| *([^|]+?) *\|$/gm)) {
      expect(concepts[code as string]?.pref, code).toBe(display);
    }
  });
});

describe("source code", () => {
  it("does not hard-code labels or old spellings", () => {
    const terms = entries.flatMap(([, c]) => [...displayed(c), ...(c.alt ?? [])]);
    for (const file of sourceFiles("src")) {
      const text = readFileSync(file, "utf8");
      expect(hasOldTone(text), file).toBe(false);
      for (const term of terms) {
        expect(text.includes(term), `${file}: ${term}`).toBe(false);
      }
    }
  });
});
