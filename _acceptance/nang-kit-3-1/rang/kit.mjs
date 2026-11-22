// Shared helpers: fetch a kit by tag outside the repo, temp worktrees, running the gate.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = () => resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

export function git(cwd, ...args) {
  return execFileSync("git", ["-C", cwd, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 64 * 1024 * 1024,
  }).trim();
}

export function short(sha) {
  return sha.slice(0, 8);
}

// The kit at its tag, in os.tmpdir(); reused when its HEAD is the pinned commit.
export function fetchKit(kit) {
  const dir = join(tmpdir(), `nk31-kit-${kit.tag}`);
  try {
    if (git(dir, "rev-parse", "HEAD") === kit.sha) return dir;
  } catch {
    // not fetched yet
  }
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  try {
    git(dir, "init", "-q");
    git(dir, "fetch", "-q", "--depth", "1", kit.url, `refs/tags/${kit.tag}`);
    git(dir, "checkout", "-q", "FETCH_HEAD");
  } catch {
    throw new Error(`kit: cannot fetch ${kit.url} ${kit.tag}`);
  }
  const head = git(dir, "rev-parse", "HEAD");
  if (head !== kit.sha) throw new Error(`kit: ${kit.url} ${kit.tag} is ${short(head)}, want ${short(kit.sha)}`);
  return dir;
}

export function coreRoot(kit, dir) {
  return kit.core ? join(dir, kit.core) : dir;
}

// A detached worktree of `rev` in os.tmpdir(); always remove() it in a finally.
export function worktree(rev, root = repoRoot()) {
  const dir = join(mkdtempSync(join(tmpdir(), "nk31-wt-")), "tree");
  git(root, "worktree", "add", "-q", "--detach", dir, rev);
  return {
    dir,
    remove() {
      try {
        git(root, "worktree", "remove", "--force", dir);
      } catch {
        rmSync(dir, { recursive: true, force: true });
        git(root, "worktree", "prune");
      }
    },
  };
}

export function commitAll(dir, message) {
  git(dir, "add", "-A");
  git(dir, "-c", "user.name=nk31 measure", "-c", "user.email=nk31@example.invalid", "commit", "-q", "-m", message);
}

export function runGate(core, cwd, args) {
  const r = spawnSync("bash", [join(core, "scripts/pre-merge-check.sh"), ".", ...args], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, CLAUDE_PLUGIN_ROOT: core },
    maxBuffer: 64 * 1024 * 1024,
  });
  return { status: r.status, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}

export function mergeBase(root = repoRoot()) {
  return git(root, "merge-base", "HEAD", "origin/main");
}

export function saveRun(name, text, root = repoRoot()) {
  const dir = join(root, ".acceptance-runs/nang-kit-3-1");
  mkdirSync(dir, { recursive: true });
  const path = join(dir, name);
  writeFileSync(path, text);
  return path;
}

// CLI wrapper: print every line, exit 0 only when the measure is ok.
export async function cli(measure, opts = {}) {
  try {
    const r = await measure(opts);
    for (const l of [].concat(r.line)) process.stdout.write(`${l}\n`);
    process.exit(r.ok ? 0 : 1);
  } catch (e) {
    process.stdout.write(`${e.message}\n`);
    process.exit(1);
  }
}

export { existsSync };
