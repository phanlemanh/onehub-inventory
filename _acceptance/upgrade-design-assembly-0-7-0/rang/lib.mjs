// Shared helpers of this record's measures. Nothing here writes to the repository itself.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const HERE = path.dirname(fileURLToPath(import.meta.url));
// The repository this record lives in, worked out from where this file is.
export const ROOT = path.resolve(HERE, "../../..");
// The plugin's own repository: the folder named by DESIGN_ASSEMBLY_REPO, or the owner's checkout.
export const PLUGIN_REPO = process.env.DESIGN_ASSEMBLY_REPO ?? path.join(homedir(), "design-assembly");

// The value of `--name` in the arguments, or the fallback.
export function option(name, fallback = null) {
  const at = process.argv.indexOf(name);
  return at === -1 ? fallback : process.argv[at + 1];
}

// git in `dir`; throws with git's own words when it fails.
export function git(dir, ...args) {
  const run = spawnSync("git", ["-C", dir, ...args], { encoding: "utf8", maxBuffer: 1 << 28 });
  if (run.status !== 0) throw new Error(`git ${args.join(" ")}: ${(run.stderr || "").trim()}`);
  return run.stdout;
}

export function lines(text) {
  return text.split("\n").filter((line) => line.trim() !== "");
}

const object = (kind, body) =>
  createHash("sha1").update(`${kind} ${body.length}\0`).update(body).digest();

export function blobId(file) {
  return object("blob", readFileSync(file)).toString("hex");
}

// The id git gives a folder from the files on disk, and how many files it holds.
export function treeId(dir) {
  let files = 0;
  const walk = (at) => {
    const entries = readdirSync(at).map((name) => {
      const full = path.join(at, name);
      const isFolder = statSync(full).isDirectory();
      if (!isFolder) files += 1;
      return {
        name,
        key: isFolder ? `${name}/` : name,
        mode: isFolder ? "40000" : "100644",
        id: isFolder ? walk(full) : object("blob", readFileSync(full)),
      };
    });
    entries.sort((a, b) => Buffer.compare(Buffer.from(a.key), Buffer.from(b.key)));
    return object(
      "tree",
      Buffer.concat(entries.flatMap((entry) => [Buffer.from(`${entry.mode} ${entry.name}\0`), entry.id])),
    );
  };
  const id = walk(dir).toString("hex");
  return { id, files };
}

export function scratch(name) {
  return mkdtempSync(path.join(tmpdir(), `upgrade-0-7-0-${name}-`));
}

// A throwaway copy of the repository made of links. `omit` paths are absent from it, `replace` paths
// are real files with the given text; the folders above them are real, their other entries links.
export function linkedCopy(root, { replace = {}, omit = [] } = {}) {
  const dir = scratch("copy");
  const links = [];
  const special = new Set([...Object.keys(replace), ...omit]);
  const realDirs = new Set();
  for (const rel of special) {
    const parts = rel.split("/");
    for (let i = 1; i < parts.length; i += 1) realDirs.add(parts.slice(0, i).join("/"));
  }
  const fill = (rel) => {
    for (const name of readdirSync(path.join(root, rel))) {
      const entry = rel ? `${rel}/${name}` : name;
      if (special.has(entry)) continue;
      if (realDirs.has(entry)) {
        mkdirSync(path.join(dir, entry));
        fill(entry);
        continue;
      }
      symlinkSync(path.join(root, entry), path.join(dir, entry));
      links.push(path.join(dir, entry));
    }
  };
  fill("");
  for (const [rel, text] of Object.entries(replace)) {
    mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    writeFileSync(path.join(dir, rel), text);
  }
  return {
    dir,
    // The links go first, one by one, so removing the copy never reaches what they point at.
    remove() {
      for (const link of links) rmSync(link, { force: true });
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

// A clone of the repository that shares its objects and has no checkout: new commits made in it
// never reach the repository.
export function sharedClone(root) {
  const dir = scratch("clone");
  git(root, "clone", "-q", "--shared", "--no-checkout", root, dir);
  return {
    dir,
    remove() {
      rmSync(dir, { recursive: true, force: true });
    },
  };
}
