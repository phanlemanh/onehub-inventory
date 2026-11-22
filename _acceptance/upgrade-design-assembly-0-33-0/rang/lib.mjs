// Shared helpers of this record's measures. Nothing here writes to the repository itself.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  appendFileSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const HERE = path.dirname(fileURLToPath(import.meta.url));
// The repository this record lives in, worked out from where this file is.
export const ROOT = path.resolve(HERE, "../../..");

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
  return mkdtempSync(path.join(tmpdir(), `upgrade-0-36-1-${name}-`));
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

// A depth-1 clone of `rev`, made the way the CI checkout and db/scripts/ci-thu.sh make one, whose
// `origin` is a bare repository that borrows this repository's objects and has `main` at `mainAt`.
// The repository's own `main` is never the base: on this machine it can lag where the branch left
// main. node_modules is an APFS clone of the repository's own (cp -c), nothing is installed.
export function shallowClone(root, rev, { mainAt }) {
  const dir = scratch("shallow");
  const mid = path.join(dir, "mid");
  const kho = path.join(dir, "kho");
  try {
    const objects = path.resolve(root, git(root, "rev-parse", "--git-common-dir").trim(), "objects");
    git(dir, "init", "-q", "--bare", mid);
    writeFileSync(path.join(mid, "objects/info/alternates"), `${objects}\n`);
    git(mid, "update-ref", "refs/heads/main", git(root, "rev-parse", mainAt).trim());
    git(mid, "update-ref", "refs/heads/tip", git(root, "rev-parse", rev).trim());
    git(dir, "init", "-q", kho);
    git(kho, "fetch", "-q", "--depth", "1", `file://${mid}`, "tip");
    git(kho, "checkout", "-q", "FETCH_HEAD");
    git(kho, "remote", "add", "origin", `file://${mid}`);
    const from = path.join(root, "node_modules");
    const cp = spawnSync("cp", ["-c", "-R", from, path.join(kho, "node_modules")], { encoding: "utf8" });
    if (cp.status !== 0) throw new Error(`cp -c node_modules: ${(cp.stderr || "").trim()}`);
  } catch (error) {
    rmSync(dir, { recursive: true, force: true });
    throw error;
  }
  return {
    dir,
    kho,
    remove() {
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

// Where HEAD of a clone leaves its origin's main, or null when git cannot tell (no main fetched, or
// the history too shallow to reach it).
export function leftMain(kho) {
  const run = spawnSync("git", ["-C", kho, "merge-base", "HEAD", "origin/main"], { encoding: "utf8" });
  return run.status === 0 ? run.stdout.trim() : null;
}

// The commit HEAD names in `root`, for the green lines: a measure says which tree it measured.
export function head(root) {
  return git(root, "rev-parse", "HEAD").trim();
}

// The point where HEAD leaves origin/main in `root`.
export function branchBase(root) {
  return git(root, "merge-base", "HEAD", "origin/main").trim();
}

// A clone sharing this repository's objects, checked out at `rev`, with node_modules linked in, so
// the tool can run there. Removing it unlinks node_modules first, so nothing it points at is touched.
export function workClone(root, rev = "HEAD") {
  const clone = sharedClone(root);
  git(clone.dir, "checkout", "-q", git(root, "rev-parse", rev).trim());
  const modules = path.join(clone.dir, "node_modules");
  symlinkSync(path.join(root, "node_modules"), modules);
  // The repository ignores the node_modules folder, not a link of that name: keep the link out of
  // every commit a break case makes, so a case is red for its own break only.
  appendFileSync(path.join(clone.dir, ".git/info/exclude"), "\nnode_modules\n");
  return {
    dir: clone.dir,
    remove() {
      rmSync(modules, { force: true });
      clone.remove();
    },
  };
}

// Runs `cmd args` in `cwd` and returns status and both streams together.
export function run(cmd, args, cwd, env = {}) {
  const r = spawnSync(cmd, args, { cwd, encoding: "utf8", maxBuffer: 1 << 28, env: { ...process.env, ...env } });
  return { status: r.status, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}
