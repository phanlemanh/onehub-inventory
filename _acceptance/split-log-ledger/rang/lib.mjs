// Shared helpers of the measures of split-log-ledger. The repository root is derived from this file's
// place (three levels up), or given with --root <dir> (a broken copy in two-way.mjs).

import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const HERE = dirname(fileURLToPath(import.meta.url));

export function root(argv = process.argv.slice(2)) {
  const i = argv.indexOf("--root");
  return i >= 0 ? resolve(argv[i + 1]) : resolve(HERE, "../../..");
}

export function arg(name, argv = process.argv.slice(2)) {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
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

/** A measure's verdict: one line per problem or one ok line, `<name>: <text>`, exit 1 or 0. */
export function verdict(name, problems, okLine) {
  if (problems.length > 0) {
    for (const p of problems) console.log(`${name}: ${p}`);
    process.exit(1);
  }
  console.log(`${name}: ${okLine}`);
  process.exit(0);
}

/**
 * A detached worktree of `ref` in a temp dir with node_modules linked; `remove()` takes it away. git sees the
 * link as an untracked file (`.gitignore` names the folder `node_modules/`), so `env` hides it from every git
 * a measure runs in the copy, through a temporary excludes file.
 */
export function worktree(dir, ref) {
  const at = join(mkdtempSync(join(tmpdir(), "sll-wt-")), "w");
  git(dir, "worktree", "add", "-q", "--detach", at, ref);
  symlinkSync(join(dir, "node_modules"), join(at, "node_modules"));
  const exclude = join(dirname(at), "exclude");
  writeFileSync(exclude, "node_modules\n");
  return {
    dir: at,
    env: { ...process.env, GIT_CONFIG_COUNT: "1", GIT_CONFIG_KEY_0: "core.excludesFile", GIT_CONFIG_VALUE_0: exclude },
    remove() {
      run("git", ["-C", dir, "worktree", "remove", "--force", at]);
      rmSync(dirname(at), { recursive: true, force: true });
    },
  };
}

/** The entry lines of a drawn or one-file log: `- YYYY-MM-DD — …`. */
export function entries(text) {
  return text.split("\n").filter((l) => /^- \d{4}-\d{2}-\d{2} — /.test(l));
}
