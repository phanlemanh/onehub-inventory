// AC-2: the component register lists every component once, the nine the old tool listed twice
// sit at the file that defines them, and the new tool lost no name the old tool gave: both are
// run on the same source, the old one (from the commit the branch was cut from) on a linked copy.
// Usage: node register-names-once.mjs --root <repository> [--registry F] [--old-tool F]
//   --old-tool: a file to run as the old tool, instead of the one of the commit the branch was cut from
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { execPath, stdout } from "node:process";

import { linkedCopy, option } from "./linked-copy.mjs";
import { BASE, DEFINED_AT, REGISTRY, TOOL_FOLDER } from "./matrix.mjs";

const root = path.resolve(option("--root", "."));
const names = (register) => register.components.map((component) => component.name);
const twice = (list) => [...new Set(list.filter((name, at) => list.indexOf(name) !== at))].sort();

function problems() {
  const register = JSON.parse(readFileSync(option("--registry", path.join(root, REGISTRY)), "utf8"));
  const found = [];
  const listed = names(register);
  const repeated = twice(listed);
  if (repeated.length) found.push(`listed more than once: ${repeated.join(" ")}`);
  for (const [name, file] of Object.entries(DEFINED_AT)) {
    const entries = register.components.filter((component) => component.name === name);
    if (entries.length === 0) found.push(`missing: ${name}`);
    else if (entries.some((entry) => entry.file !== file)) {
      found.push(`${name} is at ${entries.map((entry) => entry.file).join(", ")}, not at ${file}`);
    }
  }
  if (found.length) return found;

  // The old tool on the same source: more entries, the same names.
  const given = option("--old-tool");
  const oldTool = given
    ? readFileSync(given, "utf8")
    : execFileSync("git", ["-C", root, "show", `${BASE}:${TOOL_FOLDER}/components.mjs`], {
        encoding: "utf8",
      });
  const copy = linkedCopy(root, { [`${TOOL_FOLDER}/components.mjs`]: oldTool, [REGISTRY]: "{}\n" });
  try {
    const run = spawnSync(
      execPath,
      [path.join(copy.dir, TOOL_FOLDER, "components.mjs"), "--write", "--target", copy.dir],
      { encoding: "utf8" },
    );
    if (run.status !== 0) return [`the old tool could not write a register: ${run.stderr.split("\n")[0]}`];
    const old = names(JSON.parse(readFileSync(path.join(copy.dir, REGISTRY), "utf8")));
    const lost = [...new Set(old)].filter((name) => !listed.includes(name)).sort();
    const gained = listed.filter((name) => !old.includes(name)).sort();
    if (lost.length) found.push(`the old tool listed, the new one does not: ${lost.join(" ")}`);
    if (gained.length) found.push(`the new tool lists, the old one did not: ${gained.join(" ")}`);
    // Without this the comparison proves nothing: the old tool must be seen listing them twice.
    const oldTwice = twice(old);
    const notTwice = Object.keys(DEFINED_AT).filter((name) => !oldTwice.includes(name));
    if (notTwice.length) found.push(`the old tool did not list twice: ${notTwice.join(" ")}`);
    if (found.length === 0) {
      stdout.write(
        `names once: ${listed.length} entries for ${new Set(listed).size} names; the old tool gave ${old.length} entries for the same names\n`,
      );
    }
  } finally {
    copy.remove();
  }
  return found;
}

const found = problems();
for (const line of found) stdout.write(`names once: ${line}\n`);
process.exitCode = found.length ? 1 : 0;
