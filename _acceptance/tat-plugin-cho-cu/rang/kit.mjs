// Shared helpers for the tat-plugin-cho-cu measures. Paths come from git, never from a fixed root.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

export function git(root, ...args) {
  return execFileSync("git", ["-C", root, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 64 * 1024 * 1024,
  }).trim();
}

export function repoRoot() {
  return git(HERE, "rev-parse", "--show-toplevel");
}

export function mergeBase(root = repoRoot()) {
  return git(root, "merge-base", "HEAD", "origin/main");
}

// Runs fn(dir) in a detached temporary worktree at rev; the worktree is removed even when fn throws.
export async function withWorktree(rev, fn, root = repoRoot()) {
  const dir = mkdtempSync(join(tmpdir(), "tpc-wt-"));
  git(root, "worktree", "add", "--detach", "--quiet", dir, rev);
  try {
    return await fn(dir);
  } finally {
    try {
      git(root, "worktree", "remove", "--force", dir);
    } catch {
      rmSync(dir, { recursive: true, force: true });
      git(root, "worktree", "prune");
    }
  }
}

// Prints the measure's line; exit 0 when ok, else its code (default 1). A throw is exit 2.
export async function cli(measure) {
  try {
    const r = await measure();
    console.log(r.line);
    process.exit(r.ok ? 0 : (r.code ?? 1));
  } catch (e) {
    console.error(String(e?.message ?? e));
    process.exit(2);
  }
}
