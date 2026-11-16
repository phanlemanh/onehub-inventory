// AC-3: against the register on main before the upgrade, the register the upgrade commit wrote gains
// exactly the parts the matrix lists, and nothing else of any component changes: no component comes
// or goes, and no other field of any entry differs. Both commits are named in the matrix, so the
// measure reads the same once the branch has merged and main has moved on.
// Usage: node register-gains-parts.mjs --root <repository> [--before F] [--after F]
//   --before: the register before, instead of asking git for it at the base commit
//   --after: the register after, instead of asking git for it at the upgrade commit
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { stdout } from "node:process";

import { option } from "./linked-copy.mjs";
import { ADDED_PARTS, BASE, REGISTRY, UPGRADE } from "./matrix.mjs";

const root = path.resolve(option("--root", "."));
const at = (commit, flag) => {
  const file = option(flag);
  return JSON.parse(
    file
      ? readFileSync(file, "utf8")
      : execFileSync("git", ["-C", root, "show", `${commit}:${REGISTRY}`], { encoding: "utf8" }),
  );
};
const before = at(BASE, "--before");
const after = at(UPGRADE, "--after");

const byName = (register) => new Map(register.components.map((entry) => [entry.name, entry]));
const was = byName(before);
const now = byName(after);

const found = [];
const comeOrGone = [
  ...[...was.keys()].filter((name) => !now.has(name)),
  ...[...now.keys()].filter((name) => !was.has(name)),
];
if (comeOrGone.length) found.push(`components added or removed: ${comeOrGone.join(" ")}`);

const missing = [];
const beyond = [];
for (const [name, entry] of now) {
  const old = was.get(name);
  if (!old) continue;
  const expected = { ...old };
  const gained = ADDED_PARTS[name] ?? [];
  if (gained.length) expected.parts = [...(old.parts ?? []), ...gained];
  const has = entry.parts ?? [];
  for (const part of gained) if (!has.includes(part)) missing.push(`${name}.${part}`);
  const keys = new Set([...Object.keys(expected), ...Object.keys(entry)]);
  const differs = [...keys].filter((key) => JSON.stringify(expected[key]) !== JSON.stringify(entry[key]));
  // A missing part already says what is wrong with `parts`; anything else is beyond the upgrade.
  const other = differs.filter((key) => !(key === "parts" && gained.some((part) => !has.includes(part))));
  if (other.length) beyond.push(`${name} (${other.join(", ")})`);
}
if (missing.length) found.push(`parts not added: ${missing.join(" ")}`);
if (beyond.length) found.push(`changed beyond the parts: ${beyond.join(" ")}`);

for (const line of found) stdout.write(`register: ${line}\n`);
if (found.length === 0) {
  const listed = Object.entries(ADDED_PARTS)
    .map(([name, parts]) => `${name}: ${parts.join(" ")}`)
    .join("; ");
  const count = Object.values(ADDED_PARTS).flat().length;
  stdout.write(
    `register: ${count} parts added (${listed}), nothing else changed in ${now.size} components\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
