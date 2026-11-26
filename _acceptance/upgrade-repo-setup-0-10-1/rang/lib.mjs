// Shared helpers of the measures of upgrade-repo-setup-0-10-1. The repository root is derived from
// this file's place (three levels up), or given with --root <dir> (a broken copy in two-way.mjs).

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { BASE, PLUGIN_REPO, PLUGIN_TAG } from "./matrix.mjs";

export const HERE = dirname(fileURLToPath(import.meta.url));

export function root(argv = process.argv.slice(2)) {
  const i = argv.indexOf("--root");
  return i >= 0 ? resolve(argv[i + 1]) : resolve(HERE, "../../..");
}

/** Run a command; never throws. */
export function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024, ...opts });
  return { code: r.status, out: r.stdout ?? "", err: r.stderr ?? "" };
}

export function git(dir, ...args) {
  const r = run("git", ["-C", dir, ...args]);
  if (r.code !== 0) throw new Error(`git ${args.join(" ")}: ${r.err.trim()}`);
  return r.out;
}

/** A file at a commit, or null when the commit does not have it. */
export function show(dir, ref, path) {
  const r = run("git", ["-C", dir, "show", `${ref}:${path}`]);
  return r.code === 0 ? r.out : null;
}

/** A measure's verdict: one line, `<name>: <text>`, exit 0 or 1. */
export function verdict(name, problems, okLine) {
  if (problems.length > 0) {
    for (const p of problems) console.log(`${name}: ${p}`);
    process.exit(1);
  }
  console.log(`${name}: ${okLine}`);
  process.exit(0);
}

/** The base of the pull request: where HEAD left origin/main; BASE when origin/main cannot be read. */
export function prBase(dir) {
  const r = run("git", ["-C", dir, "merge-base", "HEAD", "origin/main"]);
  return r.code === 0 && r.out.trim() ? r.out.trim() : BASE;
}

/** YAML to an object, through PyYAML (the repository has no YAML parser for node). */
export function yaml(text) {
  const r = run("python3", ["-c", "import json,sys,yaml;print(json.dumps(yaml.safe_load(sys.stdin.read())))"], {
    input: text,
  });
  if (r.code !== 0) throw new Error(`cannot read YAML: ${r.err.trim()}`);
  return JSON.parse(r.out);
}

/** The tree of the pinned tag of repo-setup, fetched once into a temp dir (data only, nothing runs). */
export function pluginTree() {
  const own = process.env.REPO_SETUP_TREE;
  if (own) return own;
  const dir = join(tmpdir(), `rs0101-${PLUGIN_TAG}`);
  if (existsSync(join(dir, "plugins/repo-setup"))) return dir;
  mkdirSync(dir, { recursive: true });
  const got = run("gh", ["api", `repos/${PLUGIN_REPO}/tarball/${PLUGIN_TAG}`], { encoding: "buffer" });
  if (got.code !== 0) throw new Error(`cannot read ${PLUGIN_REPO}@${PLUGIN_TAG}`);
  const tar = join(dir, "tag.tar.gz");
  const x = run("bash", ["-c", 'cat > "$1" && tar -xzf "$1" -C "$2" --strip-components=1', "_", tar, dir], {
    input: got.out,
  });
  if (x.code !== 0 || !existsSync(join(dir, "plugins/repo-setup"))) {
    throw new Error(`cannot read ${PLUGIN_REPO}@${PLUGIN_TAG}: ${x.err.trim()}`);
  }
  return dir;
}

/** A detached worktree of `ref` in a temp dir; `remove()` takes it away. */
export function worktree(dir, ref) {
  const at = join(mkdtempSync(join(tmpdir(), "rs0101-wt-")), "w");
  git(dir, "worktree", "add", "-q", "--detach", at, ref);
  return {
    dir: at,
    remove() {
      run("git", ["-C", dir, "worktree", "remove", "--force", at]);
      rmSync(dirname(at), { recursive: true, force: true });
    },
  };
}
