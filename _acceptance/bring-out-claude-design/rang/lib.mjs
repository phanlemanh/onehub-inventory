// Shared helpers of this record's measures. Nothing here writes to the repository itself: every
// change a measure or a break case makes is made in a clone under the system's temporary folder.
import { spawnSync } from "node:child_process";
import { appendFileSync, mkdtempSync, rmSync, symlinkSync } from "node:fs";
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
  const r = spawnSync("git", ["-C", dir, ...args], { encoding: "utf8", maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error(`git ${args.join(" ")}: ${(r.stderr || "").trim()}`);
  return r.stdout;
}

export const lines = (text) => text.split("\n").filter((line) => line.trim() !== "");

// Runs `cmd args` in `cwd` and returns the status and both streams together.
export function run(cmd, args, cwd, env = {}) {
  const r = spawnSync(cmd, args, { cwd, encoding: "utf8", maxBuffer: 1 << 28, env: { ...process.env, ...env } });
  return { status: r.status, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}

// The commit HEAD names in `root`: a green line says which tree it measured.
export const head = (root) => git(root, "rev-parse", "HEAD").trim();

// The node_modules folder behind `root`, following a clone's link back to the repository's own.
const modulesOf = (root) => path.join(root, "node_modules");

// A clone of `root` at `rev` that shares its objects, with node_modules linked in, so the tool can run
// there. Removing it unlinks node_modules first, so nothing the link points at is touched.
export function workClone(root, rev = "HEAD") {
  const dir = mkdtempSync(path.join(tmpdir(), "bring-out-claude-design-"));
  git(root, "clone", "-q", "--shared", "--no-checkout", root, dir);
  git(dir, "checkout", "-q", git(root, "rev-parse", rev).trim());
  const modules = path.join(dir, "node_modules");
  symlinkSync(modulesOf(root), modules);
  appendFileSync(path.join(dir, ".git/info/exclude"), "\nnode_modules\n");
  // The clone's origin/main is where the repository's own origin/main is, not its local main.
  const main = spawnSync("git", ["-C", root, "rev-parse", "--verify", "-q", "origin/main"], { encoding: "utf8" });
  if (main.status === 0) git(dir, "update-ref", "refs/remotes/origin/main", main.stdout.trim());
  return {
    dir,
    // Commits every change of the clone, so a measure that clones it again sees the change.
    commit(message) {
      git(dir, "add", "-A");
      git(dir, "-c", "user.name=measure", "-c", "user.email=measure@example.invalid", "commit", "-q", "--no-verify", "-m", message);
    },
    remove() {
      rmSync(modules, { force: true });
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

// Writes the files the repository keeps out of git (the component manifest among them), as make
// check does before anything reads one: the stamp of the exports is computed with them.
export function derive(dir) {
  return run("node", ["tools/design-assembly/derived.mjs", "--quiet"], dir);
}

// Prints the found problems with `label`, or the green line, and sets the exit code.
export function report(label, found, green) {
  for (const line of found) process.stdout.write(`${label}: ${line}\n`);
  if (found.length === 0) process.stdout.write(`${label}: ${green}\n`);
  process.exitCode = found.length ? 1 : 0;
}

// The fields of one row of design/decisions.yaml, by id, or null. The ledger's rows are flat
// `key: value` lines under `  - id: <id>`; a quoted value is read as JSON.
export function ledgerRow(text, id) {
  const rows = text.split(/^ {2}- id: /m).slice(1);
  const row = rows.find((r) => r.split("\n")[0].trim() === id);
  if (!row) return null;
  const fields = { id };
  for (const line of row.split("\n").slice(1)) {
    const m = line.match(/^ {4}([a-z_]+): (.*)$/);
    if (!m) continue;
    const raw = m[2].trim();
    fields[m[1]] = raw.startsWith('"') ? JSON.parse(raw) : raw;
  }
  return fields;
}
