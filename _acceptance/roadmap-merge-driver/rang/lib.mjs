// Shared helpers of the measures of roadmap-merge-driver. The repository root is derived from this
// file's place (three levels up); --root <dir> points a measure at a broken copy (two-way.mjs).
// Commands are run from argument arrays, never from a command string.

import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO = resolve(HERE, "../../..");

/** The value of `--name <value>`, or undefined. */
export function opt(argv, name) {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : undefined;
}

export function rootOf(argv = process.argv.slice(2)) {
  const given = opt(argv, "root");
  return given === undefined ? REPO : resolve(given);
}

/** Run a command without a shell; never throws. */
export function run(cmd, args, options = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024, ...options });
  return { status: r.status, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

/** Git in a directory; throws when git fails. */
export function git(dir, ...args) {
  return execFileSync("git", ["-C", dir, ...args], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
}

export function read(root, rel) {
  return readFileSync(join(root, rel), "utf8");
}

export function write(root, rel, text) {
  mkdirSync(dirname(join(root, rel)), { recursive: true });
  writeFileSync(join(root, rel), text);
}

/** The base of the pull request: where the branch left the main branch. */
export function baseSha() {
  for (const ref of ["origin/main", "main"]) {
    const r = run("git", ["-C", REPO, "merge-base", "HEAD", ref]);
    if (r.status === 0) return r.stdout.trim();
  }
  refuse("base", "no merge-base of HEAD with origin/main or main");
}

/** A file of the repository as it was at the base, or null when the base does not have it. */
export function atBase(rel) {
  const r = run("git", ["-C", REPO, "show", `${baseSha()}:${rel}`]);
  return r.status === 0 ? r.stdout : null;
}

/** The lines of a text without the empty line after a final newline. */
export function lines(text) {
  const all = text.split("\n");
  if (all.at(-1) === "") all.pop();
  return all;
}

/** A measure's verdict: `<name>: <problem>` per problem and exit 1, or one line and exit 0. */
export function done(name, problems, okLine) {
  if (problems.length > 0) {
    for (const p of problems) console.log(`${name}: ${p}`);
    process.exit(1);
  }
  console.log(`${name}: ${okLine}`);
  process.exit(0);
}

/** The measure could not establish its answer: that is neither a pass nor a fail. */
export function refuse(name, why) {
  console.log(`${name}: REFUSED — ${why}`);
  process.exit(2);
}

/** An empty directory of its own under the system's temporary folder. */
export function scratchDir(label) {
  return mkdtempSync(join(tmpdir(), `rmd-${label}-`));
}

export function rm(dir) {
  rmSync(dir, { recursive: true, force: true });
}

/**
 * A scratch repository on branch main that no setting of the machine reaches: no signing, no hooks,
 * no attributes file of the user.
 */
export function scratchRepo(label) {
  const dir = scratchDir(label);
  git(dir, "init", "-q", "-b", "main");
  const none = join(dir, ".git", "none");
  mkdirSync(none);
  writeFileSync(join(dir, ".git", "no-attributes"), "");
  for (const [key, value] of [
    ["user.email", "measure@example.invalid"],
    ["user.name", "measure"],
    ["commit.gpgsign", "false"],
    ["core.hooksPath", none],
    ["core.attributesFile", join(dir, ".git", "no-attributes")],
  ]) {
    git(dir, "config", key, value);
  }
  return dir;
}

/** `a/**` covers everything under a/; `**` in the middle is zero or more folders; otherwise the path itself. */
export function matches(pattern, path) {
  const want = pattern.split("/");
  const have = path.split("/");
  const walk = (i, j) => {
    if (i === want.length) return j === have.length;
    if (want[i] === "**") {
      if (i === want.length - 1) return j < have.length;
      for (let k = j; k <= have.length; k += 1) if (walk(i + 1, k)) return true;
      return false;
    }
    return j < have.length && want[i] === have[j] && walk(i + 1, j + 1);
  };
  return walk(0, 0);
}

/** Every file git tracks in the repository. */
export function tracked() {
  return lines(git(REPO, "ls-files"));
}
