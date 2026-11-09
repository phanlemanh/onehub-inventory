#!/usr/bin/env node
// Writes design/component-registry.json from the code: one entry per component family (file) with
// its level and its parts; each part lists its own props, variants and defaults.
// The level is computed, never declared: templates are "template"; otherwise import depth among
// components decides (0 atom, 1 molecule, 2 or more organism).
//
//   node tools/design_registry.mjs [--check]
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");
const AREAS = ["ui", "reui", "candidate", "core", "templates"];
const OUT = path.join(ROOT, "design/component-registry.json");

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".tsx") ? [p] : [];
  });
}

const literal = (node) =>
  ts.isStringLiteralLike(node) ? node.text : ts.isIdentifier(node) ? node.text : node.getText();

function objectEntries(node) {
  if (!node || !ts.isObjectLiteralExpression(node)) return [];
  return node.properties.filter(ts.isPropertyAssignment);
}

function readVariants(call) {
  const options = call.arguments[1];
  const props = objectEntries(options);
  const find = (key) => props.find((p) => literal(p.name) === key)?.initializer;
  const variants = {};
  for (const axis of objectEntries(find("variants"))) {
    variants[literal(axis.name)] = objectEntries(axis.initializer).map((v) => literal(v.name));
  }
  const defaults = {};
  for (const d of objectEntries(find("defaultVariants"))) {
    defaults[literal(d.name)] = literal(d.initializer);
  }
  return { variants, defaults };
}

function functionOf(init) {
  if (!init) return null;
  if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) return init;
  if (ts.isCallExpression(init) && /forwardRef$/.test(init.expression.getText())) {
    return functionOf(init.arguments[0]);
  }
  return null;
}

function describeFunction(name, fn, cvas) {
  const first = fn?.parameters?.[0];
  const params =
    first && ts.isObjectBindingPattern(first.name)
      ? first.name.elements
          .filter((e) => !e.dotDotDotToken)
          .map((e) => (e.propertyName ?? e.name).getText())
      : [];
  let used = null;
  const visit = (node) => {
    if (ts.isCallExpression(node) && cvas.has(node.expression.getText())) {
      used = cvas.get(node.expression.getText());
    }
    ts.forEachChild(node, visit);
  };
  if (fn?.body) visit(fn.body);
  const axes = used?.variants ?? {};
  const props = params.filter((p) => p !== "className" && p !== "children" && !(p in axes));
  return {
    name,
    ...(props.length ? { props } : {}),
    ...(used ? { variants: used.variants, defaults: used.defaults } : {}),
  };
}

function parse(file) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const exported = new Set();
  const imports = [];
  const cvas = new Map();
  const functions = new Map();
  const isExported = (node) => node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
  const visit = (node) => {
    if (ts.isImportDeclaration(node)) imports.push(node.moduleSpecifier.text);
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      const init = node.initializer;
      if (ts.isCallExpression(init) && init.expression.getText() === "cva" && init.arguments[1]) {
        const found = readVariants(init);
        if (Object.keys(found.variants).length) cvas.set(node.name.text, found);
      }
      const fn = functionOf(init);
      if (fn) functions.set(node.name.text, fn);
    }
    if (ts.isVariableStatement(node) && isExported(node)) {
      for (const d of node.declarationList.declarations) exported.add(d.name.getText());
    }
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
      for (const e of node.exportClause.elements) exported.add(e.name.text);
    }
    if (ts.isFunctionDeclaration(node) && node.name) {
      functions.set(node.name.text, node);
      if (isExported(node)) exported.add(node.name.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  const parts = [...exported]
    .filter((n) => /^[A-Z]/.test(n))
    .sort()
    .map((n) => describeFunction(n, functions.get(n), cvas));
  return { parts, imports };
}

function resolveImport(from, spec, known) {
  const base = spec.startsWith("@/")
    ? path.join(SRC, spec.slice(2))
    : spec.startsWith(".")
      ? path.resolve(path.dirname(from), spec)
      : null;
  if (!base) return null;
  return [`${base}.tsx`, path.join(base, "index.tsx")].find((c) => known.has(c)) ?? null;
}

export function build() {
  const files = AREAS.flatMap((a) => walk(path.join(SRC, "components", a)));
  const known = new Set(files);
  const parsed = new Map(files.map((f) => [f, parse(f)]));
  const memo = new Map();
  const depth = (file, seen = new Set()) => {
    if (memo.has(file)) return memo.get(file);
    if (seen.has(file)) return 0;
    seen.add(file);
    const deps = parsed
      .get(file)
      .imports.map((s) => resolveImport(file, s, known))
      .filter(Boolean);
    const d = deps.length ? 1 + Math.max(...deps.map((x) => depth(x, seen))) : 0;
    memo.set(file, d);
    return d;
  };
  const level = (file) => {
    if (file.includes("/components/templates/")) return "template";
    return ["atom", "molecule", "organism"][Math.min(depth(file), 2)];
  };
  const components = files.flatMap((file) => {
    const { parts } = parsed.get(file);
    if (!parts.length) return [];
    const pascal = path
      .basename(file, ".tsx")
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join("");
    const name = parts.find((p) => p.name === pascal)?.name ?? parts[0].name;
    return [{ name, file: path.relative(ROOT, file), level: level(file), parts }];
  });
  components.sort((a, b) => a.file.localeCompare(b.file));
  return `${JSON.stringify({ version: 2, components }, null, 2)}\n`;
}

const text = build();
if (process.argv.includes("--check")) {
  if (!existsSync(OUT) || readFileSync(OUT, "utf8") !== text) {
    console.error("out of date: design/component-registry.json (run make gen)");
    process.exit(1);
  }
} else {
  writeFileSync(OUT, text);
  console.log(
    `wrote design/component-registry.json (${JSON.parse(text).components.length} components)`,
  );
}
