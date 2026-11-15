// AC-3: the tool folder is the plugin's tool folder at the commit the matrix pins. Git names a folder
// by one id made from every file's name and bytes; the id pinned is the one the plugin's own
// repository gives (`git rev-parse <commit>:plugins/design-assembly/templates/tools/design-assembly`),
// and the id here is worked out the same way from the files on disk.
// Usage: node tool-tree.mjs --root <repository>
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { stdout } from "node:process";

import { option } from "./linked-copy.mjs";
import { PLUGIN, TOOL_FOLDER } from "./matrix.mjs";

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

const id = tree(path.join(path.resolve(option("--root", ".")), TOOL_FOLDER)).toString("hex");
if (id !== PLUGIN.tree) {
  stdout.write(
    `tool: ${TOOL_FOLDER} differs from the plugin's at ${PLUGIN.commit}: ${files} files, tree ${id.slice(0, 12)}; the plugin's tree is ${PLUGIN.tree.slice(0, 12)}\n`,
  );
  process.exitCode = 1;
} else {
  stdout.write(
    `tool: ${TOOL_FOLDER} is the plugin's at ${PLUGIN.commit}, ${files} files, tree ${id.slice(0, 12)}\n`,
  );
}
