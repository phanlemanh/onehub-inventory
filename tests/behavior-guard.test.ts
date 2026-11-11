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

/** `import … from`, `export … from`, `import "…"` and `import("…")`, with the clause when there is one. */
const IMPORT =
  /(?:(?:import|export)\s+(?:type\s+)?([\s\S]*?)\s+from\s*|import\s*\(\s*|import\s+)["']([^"']+)["']/g;

/** One line per forbidden import of a screen file: `<file>: imports <path> (<target>) — <use>`. */
function rebuiltBehaviour(root: string): string[] {
  const problems: string[] = [];
  for (const path of screenFiles(root)) {
    const file = relative(root, path).split(sep).join("/");
    const text = readFileSync(path, "utf8");
    for (const match of text.matchAll(IMPORT)) {
      const clause = match[1] ?? "";
      const spec = match[2] ?? "";
      const targets =
        spec === BARREL
          ? Object.entries(BARREL_PARTS)
              .filter(([name]) => new RegExp(`\\b${name}\\b`).test(clause))
              .map(([, part]) => part)
          : [resolveTarget(file, spec)];
      for (const target of targets) {
        const rule = forbiddenFor(target);
        if (!rule || ALLOWED[file]?.includes(target)) continue;
        problems.push(`${file}: imports ${spec} (${target}) — ${rule.use}`);
      }
    }
  }
  return problems;
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

      // Re-exporting, a side-effect import and a dynamic import are imports too.
      for (const code of [
        'export { RegionError } from "../../components/candidate/region-state";\n',
        'import "@/components/candidate/region-state";\n',
        'const m = await import("@/components/candidate/region-state");\n',
      ]) {
        write(code);
        expect(rebuiltBehaviour(root), code).toHaveLength(1);
        red += 1;
      }
      // Base UI's barrel.
      write('import { Dialog, Menu } from "@base-ui/react";\n');
      expect(rebuiltBehaviour(root)).toEqual([
        `${page}: imports @base-ui/react (@base-ui/react/dialog) — use RecordPanel or useChange`,
      ]);

      // Controls: the shared pieces themselves, a look-alike name and Base UI's other parts stay green.
      write(
        [
          'import { DataRegion } from "../../components/candidate/data-region";',
          'import { useChange } from "@/components/candidate/use-change";',
          'import { X } from "@/components/ui/sheetish";',
          'import { Menu } from "@base-ui/react";',
          'import { Y } from "sonnerish";',
          "",
        ].join("\n"),
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
