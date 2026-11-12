// Row 9e (bo-nut-theo-quyen), AC-3: every button that writes goes through the shared permission component.
//
// Three rules, each measured per write call or per literal, never per file:
//   ghi-khong-qua-cua    a write request (fetch with POST, PUT, PATCH or DELETE) from a screen must hit a door of the
//                        permission table (ontology/actions.yaml), and the component holding it must be rendered only
//                        inside <PermittedAction action="<that door's action>">. Doors the table lists as exempt
//                        (sign-in, choosing the company) pass.
//   thao-tac-ngoai-bang  <PermittedAction action="X"> names a row of the permission table.
//   vai-viet-cung        no role name is written as a string in a screen (src/app/**) to show or hide something;
//                        label("<Role>") for display is allowed.
//
// The real tree has files the build step of row 9e converts (plan step 8); they are listed in PENDING with their exact
// findings, so a new violation turns red and a converted file must leave the list. PENDING is empty before the
// evidence gate of 9e.
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

import ts from "typescript";
import { afterAll, describe, expect, it } from "vitest";

import { ACTIONS, PERMISSION_EXEMPT } from "../src/generated/ontology";
import { ROLES } from "../src/modules/identity";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

type Finding = {
  rule: "ghi-khong-qua-cua" | "thao-tac-ngoai-bang" | "vai-viet-cung";
  at: string;
  why: string;
};

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const ACTION_NAMES = new Set(ACTIONS.map((a) => a.name as string));
const ROLE_NAMES = new Set(ROLES.map((r) => r as string));

/** Screen files: src/app/** and src/modules/<m>/ui/**, without tests, API routes and the dev-only prototypes. */
export function screenFiles(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      const rel = relative(root, path);
      if (statSync(path).isDirectory()) {
        if (rel === join("src", "app", "api") || rel === join("src", "app", "(app)", "proto"))
          continue;
        walk(path);
      } else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(path);
    }
  };
  const app = join(root, "src", "app");
  try {
    walk(app);
  } catch {
    // a fixture tree may have no src/app
  }
  const modules = join(root, "src", "modules");
  try {
    for (const m of readdirSync(modules)) {
      const ui = join(modules, m, "ui");
      try {
        if (statSync(ui).isDirectory()) walk(ui);
      } catch {
        // module without ui door
      }
    }
  } catch {
    // a fixture tree may have no modules
  }
  return out.sort();
}

/** `export const X_BASE_PATH = "/api/v1/…"` in any top-level file of a module, to read paths written with them. */
function basePaths(root: string): Map<string, string> {
  const map = new Map<string, string>();
  const modules = join(root, "src", "modules");
  const list = (dir: string): string[] => {
    try {
      return readdirSync(dir);
    } catch {
      return [];
    }
  };
  for (const m of list(modules)) {
    const files = list(join(modules, m)).filter(
      (f) => /\.ts$/.test(f) && !/\.test\.ts$/.test(f) && statSync(join(modules, m, f)).isFile(),
    );
    for (const f of files) {
      const text = readFileSync(join(modules, m, f), "utf8");
      for (const match of text.matchAll(/export const (\w+_BASE_PATH) = "([^"]+)"/g))
        map.set(match[1]!, match[2]!);
    }
  }
  return map;
}

/** The path a fetch writes to: constants resolved, any other `${…}` segment becomes «*». Null when unreadable. */
function pathOf(arg: ts.Expression, bases: Map<string, string>): string | null {
  if (ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg)) return arg.text;
  if (ts.isIdentifier(arg)) return bases.get(arg.text) ?? null;
  if (ts.isTemplateExpression(arg)) {
    let out = arg.head.text;
    for (const span of arg.templateSpans) {
      const e = span.expression;
      out += ts.isIdentifier(e) && bases.has(e.text) ? bases.get(e.text) : "*";
      out += span.literal.text;
    }
    return out;
  }
  return null;
}

function doorMatches(door: string, method: string, path: string): boolean {
  const [m, p] = door.split(" ");
  if (m !== method || !p) return false;
  const a = p.split("/");
  const b = path.split("/");
  return (
    a.length === b.length &&
    a.every((seg, i) => seg === b[i] || /^\[.+\]$/.test(seg) || b[i] === "*")
  );
}

function methodOf(init: ts.Expression | undefined): string | null {
  if (!init || !ts.isObjectLiteralExpression(init)) return null;
  for (const p of init.properties) {
    if (
      ts.isPropertyAssignment(p) &&
      p.name.getText() === "method" &&
      ts.isStringLiteral(p.initializer)
    ) {
      return p.initializer.text.toUpperCase();
    }
  }
  return null;
}

/** The module-level declaration (function or const) that holds a node: the component a write belongs to. */
function topLevelName(node: ts.Node): string | null {
  let cur: ts.Node | undefined = node;
  while (cur && cur.parent && !ts.isSourceFile(cur.parent)) cur = cur.parent;
  if (!cur) return null;
  if (ts.isFunctionDeclaration(cur) && cur.name) return cur.name.text;
  if (ts.isVariableStatement(cur)) {
    const d = cur.declarationList.declarations[0];
    if (d && ts.isIdentifier(d.name)) return d.name.text;
  }
  return null;
}

function jsxName(node: ts.Node): string | null {
  if (ts.isJsxElement(node)) return node.openingElement.tagName.getText();
  if (ts.isJsxSelfClosingElement(node)) return node.tagName.getText();
  return null;
}

function attrText(node: ts.JsxOpeningLikeElement, name: string): string | null {
  for (const a of node.attributes.properties) {
    if (
      ts.isJsxAttribute(a) &&
      a.name.getText() === name &&
      a.initializer &&
      ts.isStringLiteral(a.initializer)
    ) {
      return a.initializer.text;
    }
  }
  return null;
}

/** The action of the nearest <PermittedAction> around a JSX node, or null. */
function guardOf(node: ts.Node): string | null {
  let cur: ts.Node | undefined = node.parent;
  while (cur) {
    if (ts.isJsxElement(cur) && cur.openingElement.tagName.getText() === "PermittedAction") {
      return attrText(cur.openingElement, "action") ?? "";
    }
    cur = cur.parent;
  }
  return null;
}

export function check(root: string, files: string[] = screenFiles(root)): Finding[] {
  const bases = basePaths(root);
  const sources = files.map((f) =>
    ts.createSourceFile(
      f,
      readFileSync(f, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    ),
  );
  const findings: Finding[] = [];
  const at = (sf: ts.SourceFile, node: ts.Node) =>
    `${relative(root, sf.fileName)}:${sf.getLineAndCharacterOfPosition(node.getStart()).line + 1}`;

  // Every JSX use of a component, with the action guarding it.
  const uses = new Map<string, { guard: string | null }[]>();
  for (const sf of sources) {
    const visit = (n: ts.Node) => {
      const name = jsxName(n);
      if (name) {
        const list = uses.get(name) ?? [];
        list.push({ guard: guardOf(n) });
        uses.set(name, list);
        if (name === "PermittedAction") {
          const opening = ts.isJsxElement(n) ? n.openingElement : (n as ts.JsxSelfClosingElement);
          const action = attrText(opening, "action");
          if (action === null || !ACTION_NAMES.has(action)) {
            findings.push({
              rule: "thao-tac-ngoai-bang",
              at: at(sf, n),
              why: action ?? "(không khai)",
            });
          }
        }
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }

  for (const sf of sources) {
    const isScreen = relative(root, sf.fileName).startsWith(join("src", "app"));
    const visit = (n: ts.Node) => {
      if (ts.isCallExpression(n) && n.expression.getText() === "fetch") {
        const method = methodOf(n.arguments[1]);
        if (method && WRITE_METHODS.has(method)) {
          const path = n.arguments[0] ? pathOf(n.arguments[0], bases) : null;
          const exempt =
            path !== null && PERMISSION_EXEMPT.some((d) => doorMatches(d.door, method, path));
          if (!exempt) {
            const action =
              path === null
                ? undefined
                : ACTIONS.find((a) => a.doors.api.some((d) => doorMatches(d, method, path)));
            const owner = topLevelName(n);
            const used = owner ? (uses.get(owner) ?? []) : [];
            if (!action) {
              findings.push({
                rule: "ghi-khong-qua-cua",
                at: at(sf, n),
                why: `${method} ${path ?? "?"} không có trong bảng quyền`,
              });
            } else if (used.length === 0 || used.some((u) => u.guard !== action.name)) {
              findings.push({
                rule: "ghi-khong-qua-cua",
                at: at(sf, n),
                why: `${owner ?? "?"} chưa đứng trong PermittedAction action="${action.name}"`,
              });
            }
          }
        }
      }
      if (
        isScreen &&
        (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) &&
        ROLE_NAMES.has(n.text)
      ) {
        const call = n.parent;
        const isLabel = ts.isCallExpression(call) && call.expression.getText() === "label";
        const isTypeOnly = ts.isLiteralTypeNode(n.parent);
        if (!isLabel && !isTypeOnly)
          findings.push({ rule: "vai-viet-cung", at: at(sf, n), why: n.text });
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }
  return findings;
}

const fmt = (f: Finding) => `${f.rule}: ${f.at} — ${f.why}`;

/** Files of the real tree the build of row 9e converts (plan step 8); empty before the evidence gate. */
const PENDING = [
  'ghi-khong-qua-cua: src/app/(app)/members/member-dialogs.tsx:96 — InviteDialog chưa đứng trong PermittedAction action="inviteMember"',
  'ghi-khong-qua-cua: src/app/(app)/members/member-dialogs.tsx:183 — RolesDialog chưa đứng trong PermittedAction action="changeMemberRoles"',
  "vai-viet-cung: src/app/(app)/members/page.tsx:18 — CompanyAdmin",
  "vai-viet-cung: src/app/(app)/nav.ts:49 — CompanyAdmin",
];

describe("bộ kiểm nút đi đường khác (hàng 9e, AC-3)", () => {
  it("cây thật: không lỗi nào ngoài danh sách đang chuyển, và danh sách không cũ", () => {
    expect(check(ROOT).map(fmt).sort()).toEqual([...PENDING].sort());
  });

  describe("cặp lành/phá trên cây mẫu tạm", () => {
    const made: string[] = [];
    afterAll(() => made.forEach((d) => rmSync(d, { recursive: true, force: true })));

    /** A throwaway tree: the identity constants, plus the given screen files. */
    function tree(files: Record<string, string>): string {
      const root = mkdtempSync(join(tmpdir(), "bo-nut-kiem-"));
      made.push(root);
      const all: Record<string, string> = {
        "src/modules/identity/constants.ts":
          'export const MEMBERS_BASE_PATH = "/api/v1/members";\n',
        ...files,
      };
      for (const [rel, text] of Object.entries(all)) {
        mkdirSync(dirname(join(root, rel)), { recursive: true });
        writeFileSync(join(root, rel), text);
      }
      return root;
    }
    const invite = (name: string) => `
export function ${name}() {
  async function send() {
    await fetch(MEMBERS_BASE_PATH, { method: "POST", body: "{}" });
  }
  return <button onClick={send}>Mời</button>;
}
`;
    const run = (root: string) => check(root).map(fmt);

    it("ghi-khong-qua-cua: nút bọc đúng thì xanh", () => {
      const root = tree({
        "src/app/x/dialog.tsx": `import { MEMBERS_BASE_PATH } from "@/modules/identity/constants";\n${invite("Invite")}`,
        "src/app/x/page.tsx": `export default function P() {\n  return <PermittedAction action="inviteMember"><Invite /></PermittedAction>;\n}\n`,
      });
      expect(run(root)).toEqual([]);
    });

    it("ghi-khong-qua-cua: nút trần thì đỏ, chỉ đúng tệp và dòng", () => {
      const root = tree({
        "src/app/x/dialog.tsx": `import { MEMBERS_BASE_PATH } from "@/modules/identity/constants";\n${invite("Invite")}`,
        "src/app/x/page.tsx": `export default function P() {\n  return <Invite />;\n}\n`,
      });
      expect(run(root)).toEqual([
        'ghi-khong-qua-cua: src/app/x/dialog.tsx:5 — Invite chưa đứng trong PermittedAction action="inviteMember"',
      ]);
    });

    it("ghi-khong-qua-cua: một nút bọc đúng cạnh một nút trần trong cùng tệp vẫn đỏ ở dòng của nút trần", () => {
      const root = tree({
        "src/app/x/dialog.tsx": `import { MEMBERS_BASE_PATH } from "@/modules/identity/constants";\n${invite("Good")}${invite("Bare")}`,
        "src/app/x/page.tsx": `export default function P() {\n  return <>\n    <PermittedAction action="inviteMember"><Good /></PermittedAction>\n    <Bare />\n  </>;\n}\n`,
      });
      expect(run(root)).toEqual([
        'ghi-khong-qua-cua: src/app/x/dialog.tsx:12 — Bare chưa đứng trong PermittedAction action="inviteMember"',
      ]);
    });

    it("ghi-khong-qua-cua: bọc bằng sai thao tác thì đỏ", () => {
      const root = tree({
        "src/app/x/dialog.tsx": `import { MEMBERS_BASE_PATH } from "@/modules/identity/constants";\n${invite("Invite")}`,
        "src/app/x/page.tsx": `export default function P() {\n  return <PermittedAction action="listMembers"><Invite /></PermittedAction>;\n}\n`,
      });
      expect(run(root)).toEqual([
        'ghi-khong-qua-cua: src/app/x/dialog.tsx:5 — Invite chưa đứng trong PermittedAction action="inviteMember"',
      ]);
    });

    it("ghi-khong-qua-cua: ghi vào cửa không có trong bảng quyền thì đỏ; cửa miễn (đăng xuất) thì xanh", () => {
      const root = tree({
        "src/app/x/a.tsx": `export function A() {\n  return <button onClick={() => fetch("/api/v1/thu", { method: "POST" })}>x</button>;\n}\n`,
        "src/app/x/b.tsx": `export function B() {\n  return <button onClick={() => fetch("/api/v1/auth/session", { method: "DELETE" })}>x</button>;\n}\n`,
      });
      expect(run(root)).toEqual([
        "ghi-khong-qua-cua: src/app/x/a.tsx:2 — POST /api/v1/thu không có trong bảng quyền",
      ]);
    });

    it("thao-tac-ngoai-bang: thao tác có trong bảng thì xanh, tên lạ thì đỏ", () => {
      const good = tree({
        "src/app/x/p.tsx": `export const P = () => <PermittedAction action="listMembers"><b /></PermittedAction>;\n`,
      });
      expect(run(good)).toEqual([]);
      const bad = tree({
        "src/app/x/p.tsx": `export const P = () => <PermittedAction action="deleteEverything"><b /></PermittedAction>;\n`,
      });
      expect(run(bad)).toEqual(["thao-tac-ngoai-bang: src/app/x/p.tsx:1 — deleteEverything"]);
    });

    it("vai-viet-cung: label của vai thì xanh; so, includes, some hay roles: [...] thì đỏ", () => {
      const good = tree({ "src/app/x/p.tsx": `export const t = label("CompanyAdmin");\n` });
      expect(run(good)).toEqual([]);
      const bad = tree({
        "src/app/x/p.tsx": [
          'export const a = (roles: string[]) => roles.includes("CompanyAdmin");',
          'export const b = (roles: string[]) => roles.some((r) => r === "TeamLead");',
          'export const c = { href: "/m", roles: ["ListAgent"] };',
          "",
        ].join("\n"),
      });
      expect(run(bad)).toEqual([
        "vai-viet-cung: src/app/x/p.tsx:1 — CompanyAdmin",
        "vai-viet-cung: src/app/x/p.tsx:2 — TeamLead",
        "vai-viet-cung: src/app/x/p.tsx:3 — ListAgent",
      ]);
    });
  });
});
