// decision:grid-reuse-no-styling
// The point of roadmap row 6 (_acceptance/da-gui-tren-luoi, E8): Sent reuses the shared grid with no styling prop of
// its own and no grid built outside the template. Read with the TypeScript parser, not with text patterns, so every
// way of writing an attribute or an import is seen the same way.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";
import { describe, expect, it } from "vitest";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Attribute names that set looks rather than content; any of them on DataRegion means the screen styles the grid. */
const STYLING = ["className", "style", "size", "variant", "color", "density"];
/** Grid pieces a screen may not use directly: the template (DataRegion) is the only way in. */
const OUTSIDE_TEMPLATE = ["DataGrid", "DataGridTable", "Table"];

function parse(name: string, text: string): ts.SourceFile {
  return ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

/** The attribute names of every <DataRegion …> element in a file (spread attributes count as «...»). */
function dataRegionAttributes(file: ts.SourceFile): string[][] {
  const found: string[][] = [];
  const visit = (node: ts.Node) => {
    if (
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
      node.tagName.getText(file) === "DataRegion"
    ) {
      found.push(
        node.attributes.properties.map((p) =>
          ts.isJsxAttribute(p) ? p.name.getText(file) : "...",
        ),
      );
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return found;
}

/** Every name a file imports, with the module it comes from. */
function imports(file: ts.SourceFile): { name: string; from: string }[] {
  const out: { name: string; from: string }[] = [];
  for (const statement of file.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const from = (statement.moduleSpecifier as ts.StringLiteral).text;
    const clause = statement.importClause;
    if (clause?.name) out.push({ name: clause.name.text, from });
    const bindings = clause?.namedBindings;
    if (bindings && ts.isNamedImports(bindings))
      for (const el of bindings.elements)
        out.push({ name: (el.propertyName ?? el.name).text, from });
    if (bindings && ts.isNamespaceImport(bindings)) out.push({ name: "*", from });
  }
  return out;
}

function checkReuse(files: Record<string, string>, reference: string): void {
  const allowed = new Set(dataRegionAttributes(parse("reference.tsx", reference)).flat());
  if (allowed.size === 0) throw new Error("reference has no DataRegion");
  for (const [name, text] of Object.entries(files)) {
    const file = parse(name, text);
    for (const attrs of dataRegionAttributes(file))
      for (const attr of attrs) {
        if (STYLING.includes(attr) || attr.startsWith("class") || attr === "...")
          throw new Error(`styling prop on DataRegion: ${attr}`);
        if (!allowed.has(attr)) throw new Error(`prop Inventory does not use: ${attr}`);
      }
    for (const { name: imported, from } of imports(file))
      if (
        OUTSIDE_TEMPLATE.includes(imported) ||
        from.includes("/reui/data-grid") ||
        from.endsWith("/ui/table")
      )
        throw new Error(`grid built outside the template: ${imported}`);
  }
}

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? filesUnder(p) : /\.tsx?$/.test(n) ? [p] : [];
  });
}

const read = (p: string) => readFileSync(p, "utf8");
const REFERENCE = read(join(ROOT, "src/modules/listings/ui/inventory-grid.tsx"));
const SENT_FILES = Object.fromEntries(
  [
    ...filesUnder(join(ROOT, "src/modules/sharing/ui")),
    ...filesUnder(join(ROOT, "src/app/(app)/sent")),
  ].map((p) => [p, read(p)]),
);

const SAMPLE = `import { DataRegion } from "@/components/candidate/data-region";
export const X = () => <DataRegion title="t" columns={[]} rows={[]} />;`;

describe("Sent reuses the shared grid (E8)", () => {
  it("passes only props Inventory also passes, none of them styling, and builds no grid outside the template", () => {
    expect(Object.keys(SENT_FILES).length).toBeGreaterThan(0);
    expect(
      Object.values(SENT_FILES).some((t) => dataRegionAttributes(parse("x.tsx", t)).length > 0),
    ).toBe(true);
    expect(() => checkReuse(SENT_FILES, REFERENCE)).not.toThrow();
  });

  it("fails on a styling prop", () => {
    const styled = SAMPLE.replace('title="t"', 'title="t" className="p-2"');
    expect(() => checkReuse({ "x.tsx": styled }, REFERENCE)).toThrow(
      "styling prop on DataRegion: className",
    );
  });

  it("fails on a grid piece imported past the template", () => {
    const outside = `import { DataGridTable } from "@/components/reui/data-grid/data-grid-table";\n${SAMPLE}`;
    expect(() => checkReuse({ "x.tsx": outside }, REFERENCE)).toThrow(
      "grid built outside the template: DataGridTable",
    );
  });
});
