// AC-2: the tool folder is the one version 0.1.0 of the plugin hands a repository, and the stamp
// says so. Git names a folder by one id made from every file's name and bytes; the id pinned is the
// one the plugin records for the version, and the id here is worked out the same way from the
// files on disk.
// Usage: node tool-tree.mjs --root <repository>
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { stdout } from "node:process";

import { option } from "./linked-copy.mjs";
import { RELEASE, STAMP, TOOL_FOLDER } from "./matrix.mjs";

const object = (kind, body) =>
  createHash("sha1").update(`${kind} ${body.length}\0`).update(body).digest();

let files = 0;
// The id git gives a folder: its entries in git's order, a folder sorting as its name and a slash.
function tree(dir) {
  const entries = readdirSync(dir).map((name) => {
    const full = path.join(dir, name);
    const isFolder = statSync(full).isDirectory();
    if (!isFolder) files += 1;
    return {
      name,
      key: isFolder ? `${name}/` : name,
      mode: isFolder ? "40000" : "100644",
      id: isFolder ? tree(full) : object("blob", readFileSync(full)),
    };
  });
  entries.sort((a, b) => Buffer.compare(Buffer.from(a.key), Buffer.from(b.key)));
  return object(
    "tree",
    Buffer.concat(entries.flatMap((entry) => [Buffer.from(`${entry.mode} ${entry.name}\0`), entry.id])),
  );
}

const root = path.resolve(option("--root", "."));
const id = tree(path.join(root, TOOL_FOLDER)).toString("hex");
const found = [];
if (id !== RELEASE.tool) {
  found.push(
    `${TOOL_FOLDER} differs from the plugin's version ${RELEASE.version}: ${files} files, tree ${id.slice(0, 12)}; the version's tree is ${RELEASE.tool.slice(0, 12)}`,
  );
}
const stampFile = path.join(root, STAMP);
if (!existsSync(stampFile)) {
  found.push(`no stamp at ${STAMP}`);
} else {
  const stamp = JSON.parse(readFileSync(stampFile, "utf8"));
  if (stamp.version !== RELEASE.version) {
    found.push(`the stamp says version ${stamp.version}, not ${RELEASE.version}`);
  }
  if (stamp.tree !== RELEASE.tool) {
    found.push(
      `the stamp's tree ${String(stamp.tree).slice(0, 12)} is not the tree of version ${RELEASE.version}`,
    );
  }
}
for (const line of found) stdout.write(`tool: ${line}\n`);
if (found.length === 0) {
  stdout.write(
    `tool: ${TOOL_FOLDER} is the plugin's version ${RELEASE.version}, ${files} files, tree ${id.slice(0, 12)}; the stamp says the same\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
