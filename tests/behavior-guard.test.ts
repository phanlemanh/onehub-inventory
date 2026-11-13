// decision:state-matrix
// decision:record-panel
// A screen only declares what it needs; the behaviour (record panel, dialogs, loading, empty states, toasts) is
// built once in src/components/candidate and src/components/templates. This guard turns red when a screen file
// builds one of them again from the primitives.
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, posix, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";
import { describe, expect, it } from "vitest";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

type Forbidden =
  { kind: "file"; target: string; use: string } | { kind: "package"; target: string; use: string };

/**
 * Every source a screen may not import, and the shared piece it must use instead. Written first: 13 entries.
 * A file is named by its path in the repository without extension, so every way of writing the import path
 * (alias, relative, with an extension, through an index) resolves to the same target before it is compared.
 */
const FORBIDDEN: readonly Forbidden[] = [
  {
    kind: "file",
    target: "src/components/ui/sheet",
    use: "use RecordPanel through DataRegion record",
  },
  { kind: "file", target: "src/components/ui/dialog", use: "use useChange for confirmation" },
  { kind: "file", target: "src/components/ui/alert-dialog", use: "use useChange for confirmation" },
  {
    kind: "file",
    target: "src/components/ui/drawer",
    use: "use RecordPanel through DataRegion record",
  },
  {
    kind: "file",
    target: "src/components/ui/skeleton",
    use: "use DataRegion status loading or PageSkeleton",
  },
  { kind: "file", target: "src/components/ui/empty", use: "use DataRegion states or PageState" },
  { kind: "file", target: "src/components/ui/spinner", use: "use DataRegion status loading" },
  {
    kind: "file",
    target: "src/components/candidate/record-panel",
    use: "use RecordPanel through DataRegion record",
  },
  { kind: "file", target: "src/components/candidate/region-state", use: "use DataRegion status" },
  { kind: "package", target: "sonner", use: "use useChange or notifyResult" },
  { kind: "package", target: "vaul", use: "use RecordPanel through DataRegion record" },
  { kind: "package", target: "@base-ui/react/dialog", use: "use RecordPanel or useChange" },
  { kind: "package", target: "@base-ui/react/alert-dialog", use: "use useChange for confirmation" },
];

/** The one file that mounts the toast host. */
const ALLOWED: Readonly<Record<string, readonly string[]>> = {
  "src/app/layout.tsx": ["src/components/ui/sonner"],
};

/** Base UI's barrel: importing Dialog or AlertDialog from it is the same as importing their own entry. */
const BARREL = "@base-ui/react";
const BARREL_PARTS: Readonly<Record<string, string>> = {
  Dialog: "@base-ui/react/dialog",
  AlertDialog: "@base-ui/react/alert-dialog",
};

function sourceFiles(dir: string): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  return entries.flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(name) ? [path] : [];
  });
}

/** Screen files: everything under src/app, and the ui folder of every module. */
function screenFiles(root: string): string[] {
  const modules = join(root, "src/modules");
  const moduleUi = (() => {
    try {
      return readdirSync(modules).flatMap((name) => sourceFiles(join(modules, name, "ui")));
    } catch {
      return [];
    }
  })();
  return [...sourceFiles(join(root, "src/app")), ...moduleUi];
}

/**
 * What an import path points at: a repository path without extension or `/index` for the app's own files, the
 * package path otherwise. `file` is the importing file, relative to the repository.
 */
function resolveTarget(file: string, spec: string): string {
  let target: string;
  if (spec.startsWith("@/")) target = `src/${spec.slice(2)}`;
  else if (spec.startsWith("./") || spec.startsWith("../"))
    target = posix.join(posix.dirname(file), spec);
  else return spec;
  return posix
    .normalize(target)
    .replace(/\.(tsx?|jsx?|mjs|cjs)$/, "")
    .replace(/\/index$/, "");
}

function forbiddenFor(target: string): Forbidden | undefined {
  return FORBIDDEN.find((f) =>
    f.kind === "file"
      ? f.target === target
      : target === f.target || target.startsWith(`${f.target}/`),
  );
}

/** One import of a file: its path, the names it brings in (`*` for the whole module) and whether only types come. */
interface ImportOf {
  spec: string;
  names: string[];
  typeOnly: boolean;
}

/**
 * How a file is parsed, by its ending (row 4, K-5): `.tsx` as TSX, `.ts` as TypeScript. Read as TSX, a type assertion
 * `<T>x` in a `.ts` file opens a JSX element that swallows the imports after it.
 */
function scriptKindOf(fileName: string): ts.ScriptKind {
  return fileName.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
}

/**
 * Every import of a file, read from TypeScript's own syntax tree rather than from the text: `import … from`,
 * `import "…"`, `export … from` and `import("…")`, wherever they sit in the file.
 */
function importsOf(
  text: string,
  fileName: string,
  kindOf: (fileName: string) => ts.ScriptKind = scriptKindOf,
): ImportOf[] {
  const source = ts.createSourceFile(
    fileName,
    text,
    ts.ScriptTarget.Latest,
    true,
    kindOf(fileName),
  );
  const found: ImportOf[] = [];
  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const clause = node.importClause;
      const names: string[] = [];
      let typeOnly = clause?.isTypeOnly ?? false;
      if (clause?.name) names.push("default");
      const bindings = clause?.namedBindings;
      if (bindings && ts.isNamespaceImport(bindings)) names.push("*");
      if (bindings && ts.isNamedImports(bindings)) {
        for (const element of bindings.elements)
          names.push((element.propertyName ?? element.name).text);
        if (
          !clause?.name &&
          bindings.elements.length > 0 &&
          bindings.elements.every((e) => e.isTypeOnly)
        ) {
          typeOnly = true;
        }
      }
      found.push({ spec: node.moduleSpecifier.text, names, typeOnly });
    } else if (
      ts.isExportDeclaration(node) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const clause = node.exportClause;
      const names =
        clause && ts.isNamedExports(clause)
          ? clause.elements.map((e) => (e.propertyName ?? e.name).text)
          : ["*"];
      found.push({ spec: node.moduleSpecifier.text, names, typeOnly: node.isTypeOnly });
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments[0] &&
      ts.isStringLiteralLike(node.arguments[0])
    ) {
      found.push({ spec: node.arguments[0].text, names: ["*"], typeOnly: false });
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
}

/** The forbidden targets one import reaches; a type-only import brings no behaviour and reaches none. */
function targetsOf(file: string, entry: ImportOf): string[] {
  if (entry.typeOnly) return [];
  if (entry.spec !== BARREL) return [resolveTarget(file, entry.spec)];
  if (entry.names.includes("*")) return Object.values(BARREL_PARTS);
  return Object.entries(BARREL_PARTS)
    .filter(([name]) => entry.names.includes(name))
    .map(([, part]) => part);
}

/** One line per forbidden import of a screen file: `<file>: imports <path> (<target>) — <use>`. */
function rebuiltBehaviour(
  root: string,
  kindOf: (fileName: string) => ts.ScriptKind = scriptKindOf,
): string[] {
  const problems: string[] = [];
  for (const path of screenFiles(root)) {
    const file = relative(root, path).split(sep).join("/");
    for (const entry of importsOf(readFileSync(path, "utf8"), file, kindOf)) {
      for (const target of targetsOf(file, entry)) {
        const rule = forbiddenFor(target);
        if (!rule || ALLOWED[file]?.includes(target)) continue;
        problems.push(`${file}: imports ${entry.spec} (${target}) — ${rule.use}`);
      }
    }
  }
  return problems;
}

/** Every form of statement that brings a module in, each placed between other imports. Written first: 11 forms. */
const STATEMENT_FORMS: readonly ((spec: string) => string)[] = [
  (x) => `import { RecordPanel } from "${x}";`,
  (x) => `import RecordPanel from "${x}";`,
  (x) => `import * as P from "${x}";`,
  (x) => `import P, { RecordPanel } from "${x}";`,
  (x) => `import "${x}";`,
  (x) => `export { RecordPanel } from "${x}";`,
  (x) => `export * from "${x}";`,
  (x) => `export * as P from "${x}";`,
  (x) => `const m = await import("${x}");`,
  (x) => `function load() {\n  return import("${x}");\n}`,
  (x) => `import {\n  RecordPanel,\n  useRecordAddress,\n} from "${x}";`,
];

/** Wraps one statement in a screen with ordinary imports before and after it. */
function screenWith(statement: string): string {
  return [
    'import { useState } from "react";',
    statement,
    'import { DataRegion } from "@/components/candidate/data-region";',
    'export { label } from "@/modules/company-config";',
    "export default function Page() {",
    "  return null;",
    "}",
    "",
  ].join("\n");
}

/** Every way of writing an import path the guard knows of, from a screen at `src/app/man/page.tsx`. Written first. */
function spellings(rule: Forbidden): string[] {
  if (rule.kind === "package") return [rule.target, `${rule.target}/index.js`];
  const inside = rule.target.slice("src/".length);
  return [
    `@/${inside}`,
    `@/${inside}.tsx`,
    `../../${inside}`,
    `../../${inside}.tsx`,
    `../../../src/${inside}`,
    `./../../${inside}`,
  ];
}

describe("screens declare, they do not rebuild behaviour", () => {
  it("lists the 13 forbidden sources", () => {
    expect(FORBIDDEN).toHaveLength(13);
    expect(new Set(FORBIDDEN.map((f) => f.target)).size).toBe(13);
  });

  it("resolves every spelling of a path to the same file", () => {
    const file = "src/app/man/page.tsx";
    for (const spec of spellings(FORBIDDEN[0]!)) {
      expect(resolveTarget(file, spec), spec).toBe("src/components/ui/sheet");
    }
    expect(resolveTarget(file, "@/components/candidate/record-panel/index")).toBe(
      "src/components/candidate/record-panel",
    );
  });

  it("finds no screen file that rebuilds a behaviour", () => {
    expect(screenFiles(ROOT).length).toBeGreaterThan(0);
    expect(rebuiltBehaviour(ROOT)).toEqual([]);
  });

  it("break: a screen importing a forbidden source in any spelling turns the guard red", () => {
    const root = mkdtempSync(join(tmpdir(), "behaviour-guard-"));
    const dir = join(root, "src/app/man");
    const page = "src/app/man/page.tsx";
    mkdirSync(dir, { recursive: true });
    const write = (code: string) => writeFileSync(join(dir, "page.tsx"), code);
    try {
      let red = 0;
      let cases = 0;
      for (const rule of FORBIDDEN) {
        for (const spec of spellings(rule)) {
          cases += 1;
          write(`import { X } from "${spec}";\nexport default X;\n`);
          const expected = `${page}: imports ${spec} (${resolveTarget(page, spec)}) — ${rule.use}`;
          expect(rebuiltBehaviour(root), spec).toEqual([expected]);
          red += 1;
        }
      }
      // 9 files × 6 spellings + 4 packages × 2 spellings, written before the code.
      expect(cases).toBe(9 * 6 + 4 * 2);
      expect(red).toBe(cases);

      // Every statement form, placed between other imports in one file, turns the guard red exactly once.
      const forbidden = "@/components/candidate/record-panel";
      expect(STATEMENT_FORMS).toHaveLength(11);
      let forms = 0;
      for (const form of STATEMENT_FORMS) {
        const code = screenWith(form(forbidden));
        write(code);
        expect(rebuiltBehaviour(root), code).toEqual([
          `${page}: imports ${forbidden} (src/components/candidate/record-panel) — use RecordPanel through DataRegion record`,
        ]);
        forms += 1;
      }
      expect(forms).toBe(11);

      // Base UI's barrel: named, renamed, the whole module, and passed on.
      const BARREL_FORMS = [
        'import { Dialog, Menu } from "@base-ui/react";',
        'import { AlertDialog as Ask } from "@base-ui/react";',
        'import * as Base from "@base-ui/react";',
        'export { Dialog } from "@base-ui/react";',
      ];
      for (const statement of BARREL_FORMS) {
        write(screenWith(statement));
        expect(rebuiltBehaviour(root).length, statement).toBeGreaterThan(0);
      }

      // Controls: the shared pieces themselves, types only, a look-alike name and Base UI's other parts stay green.
      write(
        screenWith(
          [
            'import { useChange } from "@/components/candidate/use-change";',
            'import type { RecordView } from "@/components/candidate/record-panel";',
            'import { type RecordView as View } from "../../components/candidate/record-panel";',
            'export type { RecordView } from "@/components/candidate/record-panel";',
            'import { X } from "@/components/ui/sheetish";',
            'import { Menu } from "@base-ui/react";',
            'import { Y } from "sonnerish";',
            "const text = 'import \"@/components/ui/sheet\"';",
          ].join("\n"),
        ),
      );
      expect(rebuiltBehaviour(root)).toEqual([]);
      rmSync(dir, { recursive: true });

      // A module's ui folder counts as a screen too.
      const ui = join(root, "src/modules/listings/ui");
      mkdirSync(ui, { recursive: true });
      writeFileSync(
        join(ui, "panel.tsx"),
        'import { Sheet } from "../../../components/ui/sheet";\n',
      );
      expect(rebuiltBehaviour(root)).toEqual([
        "src/modules/listings/ui/panel.tsx: imports ../../../components/ui/sheet (src/components/ui/sheet) — use RecordPanel through DataRegion record",
      ]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("ts-doc-nhu-typescript", () => {
  const dialog = "@/components/ui/dialog";
  const statement = `import { Dialog } from "${dialog}";`;
  /** Writes one screen file with `before` ahead of the forbidden import, and runs the guard with `kindOf`. */
  function guard(name: string, before: string, kindOf?: (f: string) => ts.ScriptKind): string[] {
    const root = mkdtempSync(join(tmpdir(), "behaviour-guard-ts-"));
    try {
      const dir = join(root, "src/app/man");
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, name), `${before}\n${statement}\nexport default x;\n`);
      return rebuiltBehaviour(root, kindOf);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
  const expected = (file: string) =>
    `${file}: imports ${dialog} (src/components/ui/dialog) — use useChange for confirmation`;
  // Read as TSX for every file, the guard misses the import of a .ts file (the hole of row 1e).
  const allTsx = () => ts.ScriptKind.TSX;

  it("ts-doc-nhu-typescript: src/app/man/page.ts", () => {
    const found = guard("page.ts", "const x = <T>y;");
    expect(found, "ts-doc-nhu-typescript: src/app/man/page.ts").toEqual([
      expected("src/app/man/page.ts"),
    ]);
  });

  it("ts-doc-nhu-typescript: src/app/man/page.tsx stays TSX", () => {
    const found = guard("page.tsx", "const x = <div />;");
    expect(found, "ts-doc-nhu-typescript: src/app/man/page.tsx").toEqual([
      expected("src/app/man/page.tsx"),
    ]);
  });

  it("break: reading every file as TSX misses the import of the .ts file", () => {
    expect(guard("page.ts", "const x = <T>y;", allTsx)).toEqual([]);
  });
});

/** The behaviour decisions this row makes checkable, and the record panel it adds. Written first: 7 entries. */
const CHECKED = [
  "edit-in-cell",
  "undo-or-confirm",
  "feedback-by-delay",
  "state-matrix",
  "notification-channel",
  "read-only-cell",
  "record-panel",
] as const;

/** The `check` of each decision in design/decisions.yaml (block style, one key per line). */
function checksOf(ledger: string): Map<string, string> {
  const checks = new Map<string, string>();
  let current: string | null = null;
  for (const line of ledger.split("\n")) {
    const id = /^\s*-\s+id:\s*(\S+)/.exec(line);
    if (id) current = id[1] ?? null;
    const check = /^\s+check:\s*"?([^"\s]+)"?/.exec(line);
    if (check && current) checks.set(current, check[1] ?? "");
  }
  return checks;
}

describe("every behaviour decision names a check that exists", () => {
  it("has a check pointing to a file that names the decision", () => {
    const checks = checksOf(readFileSync(join(ROOT, "design/decisions.yaml"), "utf8"));
    expect(CHECKED).toHaveLength(7);
    for (const id of CHECKED) {
      const check = checks.get(id);
      expect(check, id).toMatch(/^(test|e2e):/);
      const path = join(ROOT, check!.slice(check!.indexOf(":") + 1));
      expect(readFileSync(path, "utf8"), id).toMatch(new RegExp(`decision:${id}(?![\\w-])`));
    }
  });

  it("break: a decision without a check is found", () => {
    const checks = checksOf('  - id: a\n    layer: patterns\n  - id: b\n    check: "test:x.ts"\n');
    expect(checks.get("a")).toBeUndefined();
    expect(checks.get("b")).toBe("test:x.ts");
  });
});
