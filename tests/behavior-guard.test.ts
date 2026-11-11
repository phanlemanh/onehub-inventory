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
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Every source a screen may not import, and the shared piece it must use instead. Written first: 13 entries. */
const FORBIDDEN: readonly { spec: string; use: string }[] = [
  { spec: "@/components/ui/sheet", use: "use RecordPanel through DataRegion record" },
  { spec: "@/components/ui/dialog", use: "use useChange for confirmation" },
  { spec: "@/components/ui/alert-dialog", use: "use useChange for confirmation" },
  { spec: "@/components/ui/drawer", use: "use RecordPanel through DataRegion record" },
  { spec: "@/components/ui/skeleton", use: "use DataRegion status loading or PageSkeleton" },
  { spec: "@/components/ui/empty", use: "use DataRegion states or PageState" },
  { spec: "@/components/ui/spinner", use: "use DataRegion status loading" },
  { spec: "sonner", use: "use useChange or notifyResult" },
  { spec: "vaul", use: "use RecordPanel through DataRegion record" },
  { spec: "@base-ui/react/dialog", use: "use RecordPanel or useChange" },
  { spec: "@base-ui/react/alert-dialog", use: "use useChange for confirmation" },
  { spec: "@/components/candidate/record-panel", use: "use RecordPanel through DataRegion record" },
  { spec: "@/components/candidate/region-state", use: "use DataRegion status" },
];

/** The one file that mounts the toast host. */
const ALLOWED: Readonly<Record<string, readonly string[]>> = {
  "src/app/layout.tsx": ["@/components/ui/sonner"],
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

/** `import … from`, `export … from`, `import "…"` and `import("…")`. */
const IMPORT = /(?:from\s+|import\s*\(\s*|import\s+)["']([^"']+)["']/g;

/** One line per screen file that imports a forbidden source: `<file>: imports <source> — <use>`. */
function rebuiltBehaviour(root: string): string[] {
  const problems: string[] = [];
  for (const path of screenFiles(root)) {
    const file = relative(root, path);
    const text = readFileSync(path, "utf8");
    for (const match of text.matchAll(IMPORT)) {
      const spec = match[1] ?? "";
      const rule = FORBIDDEN.find((f) => f.spec === spec);
      if (!rule || ALLOWED[file]?.includes(spec)) continue;
      problems.push(`${file}: imports ${spec} — ${rule.use}`);
    }
  }
  return problems;
}

describe("screens declare, they do not rebuild behaviour", () => {
  it("lists the 11 forbidden sources", () => {
    expect(FORBIDDEN).toHaveLength(13);
    expect(new Set(FORBIDDEN.map((f) => f.spec)).size).toBe(13);
  });

  it("finds no screen file that rebuilds a behaviour", () => {
    expect(screenFiles(ROOT).length).toBeGreaterThan(0);
    expect(rebuiltBehaviour(ROOT)).toEqual([]);
  });

  it("break: a screen importing any forbidden source turns the guard red", () => {
    const root = mkdtempSync(join(tmpdir(), "behaviour-guard-"));
    try {
      let red = 0;
      for (const [i, rule] of FORBIDDEN.entries()) {
        const dir = join(root, `src/app/man-${i}`);
        mkdirSync(dir, { recursive: true });
        writeFileSync(
          join(dir, "page.tsx"),
          `import { X } from "${rule.spec}";\nexport default X;\n`,
        );
        const problems = rebuiltBehaviour(root);
        const file = `src/app/man-${i}/page.tsx`;
        expect(problems, rule.spec).toContain(`${file}: imports ${rule.spec} — ${rule.use}`);
        red += 1;
        rmSync(dir, { recursive: true });
      }
      expect(red).toBe(13);
      // Re-exporting is importing too.
      const again = join(root, "src/app/lai");
      mkdirSync(again, { recursive: true });
      writeFileSync(
        join(again, "page.tsx"),
        'export { RegionError } from "@/components/candidate/region-state";\n',
      );
      expect(rebuiltBehaviour(root)).toEqual([
        "src/app/lai/page.tsx: imports @/components/candidate/region-state — use DataRegion status",
      ]);
      rmSync(again, { recursive: true });
      // A module's ui folder counts as a screen too.
      const ui = join(root, "src/modules/listings/ui");
      mkdirSync(ui, { recursive: true });
      writeFileSync(join(ui, "panel.tsx"), 'import { Sheet } from "@/components/ui/sheet";\n');
      expect(rebuiltBehaviour(root)).toEqual([
        "src/modules/listings/ui/panel.tsx: imports @/components/ui/sheet — use RecordPanel through DataRegion record",
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
