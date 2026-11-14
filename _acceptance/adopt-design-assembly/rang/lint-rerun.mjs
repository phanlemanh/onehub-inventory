// AC-2: exactly the 18 decisions of the matrix written first are held by the design-assembly tool,
// and the nine lint ones by the rule their ledger row names, re-run here.
// Usage: node lint-rerun.mjs --root <repository> [--rate-file F] [--theme F] [--ledger F]
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { execPath, exit, stdout } from "node:process";

import { option } from "./linked-copy.mjs";

const HELD = [
  "checks-in-gate",
  "color-contrast",
  "color-palette",
  "color-role",
  "component-manifest",
  "design-tokens",
  "empty-state-actions",
  "ledger-shapes",
  "no-inline-style",
  "no-restyled-component",
  "radius",
  "radius-value",
  "raw-controls",
  "raw-table",
  "spacing",
  "spacing-values",
  "type-scale",
  "type-scale-values",
];
const LINT = {
  "color-palette": "onehub-ui/no-raw-palette",
  "color-role": "onehub-ui/no-hardcoded-color",
  "no-inline-style": "shadcn/no-inline-styles",
  "no-restyled-component": "shadcn/no-restyle",
  radius: "shadcn/no-arbitrary-values",
  "raw-controls": "onehub-ui/no-raw-controls",
  "raw-table": "onehub-ui/no-raw-table",
  spacing: "onehub-ui/no-off-scale-spacing",
  "type-scale": "onehub-ui/no-arbitrary-text-size",
};

const root = path.resolve(option("--root", "."));
const rateFile = option("--rate-file");
const rate = rateFile
  ? readFileSync(rateFile, "utf8")
  : spawnSync(execPath, [path.join(root, "tools/design-assembly/check.mjs"), "--rate", "--target", root], {
      encoding: "utf8",
    }).stdout;
const theme = JSON.parse(readFileSync(option("--theme", path.join(root, "design/theme.json")), "utf8"));
const ledger = readFileSync(option("--ledger", path.join(root, "design/decisions.yaml")), "utf8");

const fail = (line) => {
  stdout.write(`${line}\n`);
  exit(1);
};

// Rows the tool holds, with what holds them: only lines that start with the state.
const held = new Map();
for (const line of rate.split("\n")) {
  const row = /^\s+held\s+\S+\s+(\S+)(?:\s+\((.*)\))?\s*$/.exec(line);
  if (row) held.set(row[1], row[2] ?? "");
}
const missing = HELD.filter((id) => !held.has(id));
const extra = [...held.keys()].filter((id) => !HELD.includes(id));
if (missing.length) fail(`held: ${held.size}, missing ${missing.join(" ")}`);
if (extra.length) fail(`held: ${held.size}, extra ${extra.join(" ")}`);
stdout.write(`held: 18 — ${HELD.join(" ")}\n`);

// The rule each ledger row names after `eslint:`.
const named = {};
for (const block of ledger.split(/\n(?= {2}- id: )/).slice(1)) {
  const id = /^ {2}- id: (\S+)/.exec(block)?.[1];
  const rule = /^\s+check: "eslint:([^"]+)"/m.exec(block)?.[1];
  if (id && rule) named[id] = rule;
}
const lintChecks = Object.entries(theme.checks ?? {}).flatMap(([id, checks]) =>
  checks.filter((check) => check.kind === "lint").map((check) => [id, check.rule]),
);
for (const id of Object.keys(LINT)) {
  if (!lintChecks.some(([checked]) => checked === id)) fail(`lint re-run: ${lintChecks.length}, missing ${id}`);
}
for (const [id, rule] of lintChecks) {
  if (!(id in LINT)) fail(`lint re-run: ${lintChecks.length}, extra ${id}`);
  if (rule !== named[id]) fail(`lint re-run: ${id} checks ${rule}, the row names ${named[id]}`);
  if (rule !== LINT[id]) fail(`lint re-run: ${id} checks ${rule}, the matrix names ${LINT[id]}`);
  if (held.get(id) !== `eslint:${rule}, re-run here`) {
    fail(`lint re-run: ${id} is held by "${held.get(id)}", not by its own rule re-run here`);
  }
}
stdout.write(
  `lint re-run: 9 — ${Object.entries(LINT)
    .map(([id, rule]) => `${id}=${rule}`)
    .join(" ")}\n`,
);
