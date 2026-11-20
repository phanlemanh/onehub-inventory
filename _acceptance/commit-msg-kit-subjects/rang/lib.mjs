// Shared helpers of the measures of commit-msg-kit-subjects. The repository root is derived from this file's place
// (three levels up), or given with --root <dir> (a broken copy in two-way.mjs).

import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { BASE } from "./matrix.mjs";

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

/**
 * The delivery-loop install that holds the kit's plugins side by side (`<install>/acceptance-gate/3.0.0`,
 * `<install>/dispatch/3.0.0`), found from tools/kit-root.mjs; KIT_INSTALL overrides it.
 */
export function kitInstall(dir) {
  if (process.env.KIT_INSTALL) return resolve(process.env.KIT_INSTALL);
  const r = run("node", ["tools/kit-root.mjs"], { cwd: dir });
  const ag = r.out.trim();
  if (r.code !== 0 || !ag) throw new Error("tools/kit-root.mjs finds no acceptance-gate install of delivery-loop");
  return resolve(ag, "../..");
}

/**
 * Judge messages with tools/commit_msg.py of `dir` as the hook does: one file per message, `python3 tools/commit_msg.py
 * <file>`. Returns the exit codes in order.
 */
export function judgeAll(dir, messages, script = "tools/commit_msg.py") {
  const tmp = mkdtempSync(join(tmpdir(), "cmks-msg-"));
  try {
    return messages.map((m, i) => {
      const f = join(tmp, `MSG-${i}`);
      writeFileSync(f, m);
      return run("python3", ["-I", script, f], { cwd: dir }).code;
    });
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/** A detached worktree of `ref` in a temp dir; `remove()` takes it away. */
export function worktree(dir, ref) {
  const at = join(mkdtempSync(join(tmpdir(), "cmks-wt-")), "w");
  git(dir, "worktree", "add", "-q", "--detach", at, ref);
  return {
    dir: at,
    remove() {
      run("git", ["-C", dir, "worktree", "remove", "--force", at]);
      rmSync(dirname(at), { recursive: true, force: true });
    },
  };
}
