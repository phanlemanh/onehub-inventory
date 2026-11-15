// Probes: for a decision a lint rule may hold, source texts that break it. A repository's lint holds
// the decision when it rejects every probe, and the gate shows that again on each run. The texts
// come from the adapters; this file only says which decision each set breaks.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { adapterOf } from "./adapters/index.mjs";

const values = adapterOf("values");
const source = adapterOf("source");
const components = adapterOf("components");
const lint = adapterOf("lint");

// The decisions this tool can probe. A decision about which part may import which is not here:
// what breaks it depends on the parts of each repository.
export const PROBED = [
  ...Object.keys(values.breakingClasses),
  ...Object.keys(source.probe.breaking),
  "no-restyled-component",
  "whole-class-names",
  "lint-exceptions",
];

// A ledger row's pointer at a lint rule, and the rule a pointer names, or null.
export const lintPointer = (rule) => `${lint.prefix}:${rule}`;
export const ruleOf = (check) =>
  typeof check === "string" && check.startsWith(`${lint.prefix}:`)
    ? check.slice(lint.prefix.length + 1)
    : null;

// The component a probe may use: the library's, when it is installed, with the path a screen
// imports it by. Null when the repository has none.
export function probeComponent(root) {
  const settingsFile = path.join(root, components.settingsFile);
  let settings;
  try {
    settings = existsSync(settingsFile) ? JSON.parse(readFileSync(settingsFile, "utf8")) : null;
  } catch {
    settings = null;
  }
  const folder = components.folderIn(settings) ?? components.folder;
  const { name, file } = components.probeComponent;
  const found = [".tsx", ".jsx"].some((extension) =>
    existsSync(path.join(root, folder, `${file}${extension}`)),
  );
  return found ? { name, from: `${components.importPathIn(settings)}/${file}` } : null;
}

// The texts that break `id`, each with the line that names it, and the control: the same file
// with nothing that breaks a decision. `rules` are the lint rules the ledger points at, for the
// decision about exceptions. Null when this tool cannot probe the decision here.
export function probesFor(id, { component = null, rules = [] } = {}) {
  const { probe } = source;
  const control = probe.file(probe.control);
  const plain = (bodies) => bodies.map((body) => ({ label: body, text: probe.file(body) }));
  const classes = values.breakingClasses[id];
  if (classes) return { control, probes: plain(classes.map((value) => probe.withClass(value))) };
  if (probe.breaking[id]) return { control, probes: plain(probe.breaking[id]) };
  const onComponent = (attribute) => ({
    label: probe.component(component.name, attribute),
    text: probe.file(
      probe.component(component.name, attribute),
      probe.importOf(component.name, component.from),
    ),
  });
  if (id === "no-restyled-component") {
    if (!component) return null;
    return { control, probes: [onComponent(probe.classAttribute(values.lookClass))] };
  }
  if (id === "whole-class-names") {
    const pieces = probe.pieces(values.classStart);
    return {
      control,
      probes: [
        ...plain(pieces.map((attribute) => probe.element(attribute))),
        ...(component ? pieces.map(onComponent) : []),
      ],
    };
  }
  if (id === "lint-exceptions") {
    return {
      control,
      probes: lint.exceptionsWithoutReason(rules).map((line) => ({
        label: line,
        text: `${line}\n${control}`,
      })),
    };
  }
  return null;
}

// Screen files a probe may be linted as, in a stable order: source files outside the component
// library and the tests, so that the rules for screens apply.
export function probeCandidates(root, limit = 60) {
  const library = components.folder;
  const found = [];
  const walk = (dir) => {
    const full = path.join(root, dir);
    if (!existsSync(full) || found.length >= limit) return;
    for (const name of readdirSync(full).sort()) {
      const file = path.posix.join(dir, name);
      if (file === library || name === "node_modules" || name.startsWith(".")) continue;
      if (statSync(path.join(root, file)).isDirectory()) walk(file);
      else if (/\.[jt]sx$/.test(name) && !/\.(test|spec)\./.test(name)) found.push(file);
      if (found.length >= limit) return;
    }
  };
  walk("src");
  return found;
}
