// Row 3e, E8b: the share path stays the device's (SP-3). Three rules, each with a break on a copy of the real file:
//   dau-hieu-sp3   the SP-3 signal of PRODUCT-INVARIANTS.md (read from the file, not copied) matches none of the files.
//   khong-goi-mang the files call no fetch, XMLHttpRequest, sendBeacon or WebSocket.
//   cua-quyen      the ask button asks the permission rule for viewListings, the report button for readCatalog
//                  (read from the TypeScript syntax tree, not by matching text).
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";
import { describe, expect, it } from "vitest";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILES = {
  share: "src/lib/share/index.ts",
  messages: "src/modules/listings/messages.ts",
  ask: "src/modules/listings/ui/ask-list-agent.tsx",
  report: "src/modules/listings/ui/report-unit-error.tsx",
} as const;
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

/** The SP-3 signal: the backticked pattern on the «Dấu hiệu» line under the SP-3 heading. */
function sp3Signal(): RegExp {
  const text = read("PRODUCT-INVARIANTS.md");
  const section = text.split(/^## /m).find((s) => s.startsWith("SP-3"));
  const line = section?.split("\n").find((l) => l.startsWith("- Dấu hiệu:"));
  const pattern = line?.match(/`(.+)`/)?.[1];
  if (!pattern) throw new Error("SP-3 signal not found in PRODUCT-INVARIANTS.md");
  return new RegExp(pattern);
}

function signalHits(source: string): string[] {
  const re = sp3Signal();
  return source.split("\n").filter((l) => re.test(l));
}

const NETWORK = new Set(["fetch", "XMLHttpRequest", "sendBeacon", "WebSocket", "EventSource"]);

/** Every call or construction of a network API in the source. */
function networkCalls(source: string, name: string): string[] {
  const file = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const out: string[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
      const callee = node.expression;
      const id = ts.isIdentifier(callee)
        ? callee.text
        : ts.isPropertyAccessExpression(callee)
          ? callee.name.text
          : "";
      if (NETWORK.has(id)) out.push(id);
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return out;
}

/** The actions a component asks the permission rule about: calls of the function useActionPermission() returned. */
function permissionActions(source: string, name: string): string[] {
  const file = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const rules = new Set<string>();
  const out: string[] = [];
  const visit = (node: ts.Node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      ts.isCallExpression(node.initializer) &&
      ts.isIdentifier(node.initializer.expression) &&
      node.initializer.expression.text === "useActionPermission"
    )
      rules.add(node.name.text);
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      rules.has(node.expression.text)
    ) {
      const first = node.arguments[0];
      if (first && ts.isStringLiteral(first)) out.push(first.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return out;
}

describe("dau-hieu-sp3", () => {
  it("reads a signal that catches a Zalo send", () => {
    expect(sp3Signal().test("zalo.sendMessage(")).toBe(true);
  });
  for (const [key, rel] of Object.entries(FILES)) {
    it(`${key}: no SP-3 signal`, () => expect(signalHits(read(rel))).toEqual([]));
  }
  it("break: a copy with a Zalo send says «SP-3 signal»", () => {
    const copy = `${read(FILES.ask)}\nzalo.sendMessage("x");\n`;
    expect(() => expect(signalHits(copy), "SP-3 signal").toEqual([])).toThrow(/SP-3 signal/);
  });
});

describe("khong-goi-mang", () => {
  for (const [key, rel] of Object.entries(FILES)) {
    it(`${key}: no network call`, () => expect(networkCalls(read(rel), rel)).toEqual([]));
  }
  it("break: a copy with a fetch says «network call in a share button»", () => {
    const copy = `${read(FILES.ask)}\nvoid fetch("/api/v1/x", { method: "POST" });\n`;
    expect(() =>
      expect(networkCalls(copy, FILES.ask), "network call in a share button").toEqual([]),
    ).toThrow(/network call in a share button/);
  });
});

describe("cua-quyen", () => {
  it("the ask button asks for viewListings", () =>
    expect(permissionActions(read(FILES.ask), FILES.ask)).toEqual(["viewListings"]));
  it("the report button asks for readCatalog", () =>
    expect(permissionActions(read(FILES.report), FILES.report)).toEqual(["readCatalog"]));
  it("break: a copy asking for another action says «wrong permission door»", () => {
    const copy = read(FILES.ask).replace('permitted("viewListings"', 'permitted("readCatalog"');
    expect(() =>
      expect(permissionActions(copy, FILES.ask), "wrong permission door").toEqual(["viewListings"]),
    ).toThrow(/wrong permission door/);
  });
});
