// Row 2e (bo-o-tim-cua-vung), E11 — AC-7: the docs and the domain model no longer say the region has a search box or a
// saved view keeps a search text. The files and the forbidden phrases are written here, not declared by the docs.
//   6 files × 8 phrases = 48 cells, one result each; the only allowed sentence is «không gồm chữ tìm», listed per line.
//   Positive: the state table names «Không có dòng nào khớp» with «Xoá lọc»; the Grid pattern sends search to ⌘K; the
//   changelog and the shared log each have a line with «migration 011» and «chữ tìm».
//   Break: a copy with «the search text» put back in SavedView.yaml → «stale search wording in …».
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "..");

/** Written before the check: the files that must not speak of a region search box. */
const FILES = [
  "design/states.md",
  "design/behaviors.md",
  "design/patterns/luoi.md",
  "ontology/entities/SavedView.yaml",
  "ontology/glossary.md",
  "wiki/entities/saved-view.md",
];

/** Written before the check: the phrases that would say the region still has a search box or a view keeps its text. */
const PHRASES = [
  "Tìm không ra",
  "ô tìm",
  "Gõ để tìm",
  "Tìm trong vùng",
  "the search text",
  "search box",
  "lưu chữ tìm",
  "giữ chữ tìm",
];

/** The one sentence allowed to name the search text: it says a view does NOT hold it. */
const ALLOWED: Record<string, string[]> = {
  "ontology/glossary.md": ["không gồm chữ tìm"],
  "wiki/entities/saved-view.md": ["không gồm chữ tìm"],
};

/** One result per (file, phrase) cell: the line where the phrase still stands, or null. */
function cells(root: string): { file: string; phrase: string; hit: string | null }[] {
  return FILES.flatMap((file) => {
    const lines = readFileSync(join(root, file), "utf8").split("\n");
    return PHRASES.map((phrase) => {
      const lower = phrase.toLocaleLowerCase("vi");
      const hit = lines.find((line) => {
        let text = line.toLocaleLowerCase("vi");
        for (const ok of ALLOWED[file] ?? []) text = text.split(ok).join("");
        return text.includes(lower);
      });
      return { file, phrase, hit: hit ?? null };
    });
  });
}

function checkWording(root: string): void {
  for (const c of cells(root))
    if (c.hit !== null) throw new Error(`stale search wording in ${c.file}: «${c.phrase}»`);
}

describe("no region search box in the docs (row 2e, AC-7)", () => {
  it("has 6 files × 8 phrases written ahead", () => {
    expect(FILES).toHaveLength(6);
    expect(PHRASES).toHaveLength(8);
    expect(cells(ROOT)).toHaveLength(48);
  });

  it.each(FILES)("%s says nothing of a region search box", (file) => {
    const found = cells(ROOT).filter((c) => c.file === file && c.hit !== null);
    expect(found.map((c) => `${c.phrase}: ${c.hit}`)).toEqual([]);
  });

  it("the state table names «Không có dòng nào khớp» with «Xoá lọc»", () => {
    const states = readFileSync(join(ROOT, "design/states.md"), "utf8");
    expect(states).toMatch(/^\| Không có dòng nào khớp +\|[^\n]*«Xoá lọc»/m);
    expect(states).not.toContain("Tìm không ra");
  });

  it("the Grid pattern filters under the headers and sends search to the top bar's ⌘K box", () => {
    const pattern = readFileSync(join(ROOT, "design/patterns/luoi.md"), "utf8");
    expect(pattern).toMatch(/ô dưới tiêu đề cột/);
    expect(pattern).toMatch(/tìm nằm ở ô ⌘K của thanh trên/);
  });

  it.each(["CHANGELOG.md", "wiki/log.md"])(
    "%s has a line about migration 011 and the search text",
    (file) => {
      const lines = readFileSync(join(ROOT, file), "utf8").split("\n");
      expect(lines.some((l) => l.includes("migration 011") && l.includes("chữ tìm"))).toBe(true);
    },
  );

  it("the check fails when «the search text» comes back in SavedView.yaml", () => {
    const copy = mkdtempSync(join(tmpdir(), "khong-o-tim-"));
    for (const file of FILES) {
      mkdirSync(dirname(join(copy, file)), { recursive: true });
      cpSync(join(ROOT, file), join(copy, file));
    }
    expect(() => checkWording(copy)).not.toThrow();
    const yaml = join(copy, "ontology/entities/SavedView.yaml");
    writeFileSync(yaml, `${readFileSync(yaml, "utf8")}\n# keeps the search text\n`);
    expect(() => checkWording(copy)).toThrow(
      "stale search wording in ontology/entities/SavedView.yaml",
    );
  });
});
