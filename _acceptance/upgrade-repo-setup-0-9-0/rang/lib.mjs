// Shared helpers of the measures of upgrade-repo-setup-0-9-0. The repository root is derived from
// this file's place (three levels up), or given with --root <dir> (a broken copy in two-way.mjs).

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { PLUGIN_REPO, PLUGIN_TAG } from "./matrix.mjs";

export const HERE = dirname(fileURLToPath(import.meta.url));

export function root(argv = process.argv.slice(2)) {
  const i = argv.indexOf("--root");
  return i >= 0 ? resolve(argv[i + 1]) : resolve(HERE, "../../..");
}

export function flag(name, argv = process.argv.slice(2)) {
  return argv.includes(name);
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

/** A measure's verdict: one line, `<name>: <text>`, exit 0 or 1. */
export function verdict(name, problems, okLine) {
  if (problems.length > 0) {
    for (const p of problems) console.log(`${name}: ${p}`);
    process.exit(1);
  }
  console.log(`${name}: ${okLine}`);
  process.exit(0);
}

/** YAML to an object, through PyYAML (the repository has no YAML parser for node). */
export function yaml(file) {
  const r = run("python3", ["-c", "import json,sys,yaml;print(json.dumps(yaml.safe_load(open(sys.argv[1]))))", file]);
  if (r.code !== 0) throw new Error(`cannot read ${file} as YAML: ${r.err.trim()}`);
  return JSON.parse(r.out);
}

/** gh api; throws "cannot read" when gh is missing or not signed in. */
export function gh(args) {
  const r = run("gh", args);
  if (r.code !== 0) throw new Error(`cannot read GitHub (gh ${args.slice(0, 2).join(" ")}): ${(r.err || r.out).trim().split("\n")[0]}`);
  return r.out;
}

/** apply.py of the pinned tag: REPO_SETUP_PLUGIN, or the tag's archive fetched once. */
export function applyPy() {
  const own = process.env.REPO_SETUP_PLUGIN;
  if (own) {
    const p = join(own, "scripts/apply.py");
    if (!existsSync(p)) throw new Error(`cannot read ${p}`);
    return p;
  }
  const dir = join(tmpdir(), `rs090-${PLUGIN_TAG}`);
  const p = join(dir, "plugins/repo-setup/scripts/apply.py");
  if (existsSync(p)) return p;
  mkdirSync(dir, { recursive: true });
  const tar = join(dir, "tag.tar.gz");
  const got = run("gh", ["api", `repos/${PLUGIN_REPO}/tarball/${PLUGIN_TAG}`], { encoding: "buffer" });
  if (got.code !== 0) throw new Error(`cannot read ${PLUGIN_REPO}@${PLUGIN_TAG}`);
  const fs = run("bash", ["-c", 'cat > "$1" && tar -xzf "$1" -C "$2" --strip-components=1', "_", tar, dir], { input: got.out });
  if (fs.code !== 0 || !existsSync(p)) throw new Error(`cannot read ${PLUGIN_REPO}@${PLUGIN_TAG}: ${fs.err.trim()}`);
  return p;
}

/** A detached worktree of `ref` in a temp dir; `remove()` takes it away. */
export function worktree(dir, ref) {
  const at = join(mkdtempSync(join(tmpdir(), "rs090-wt-")), "w");
  git(dir, "worktree", "add", "-q", "--detach", at, ref);
  return {
    dir: at,
    remove() {
      run("git", ["-C", dir, "worktree", "remove", "--force", at]);
      rmSync(dirname(at), { recursive: true, force: true });
    },
  };
}

/** Whether the heavy tier reads `path`, asked of tools/ci_inputs.py itself (exit 0 input, 1 not). */
export function isHeavyInput(dir, path, notInputs) {
  const r = run("python3", ["tools/ci_inputs.py", "matches", path], {
    cwd: dir,
    env: { ...process.env, HEAVY_NOT_INPUTS: notInputs.join(" ") },
  });
  if (r.code !== 0 && r.code !== 1) throw new Error(`ci_inputs.py matches ${path}: ${r.err.trim()}`);
  return r.code === 0;
}
