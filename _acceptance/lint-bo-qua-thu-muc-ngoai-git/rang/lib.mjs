// Shared parts of the lint-bo-qua-thu-muc-ngoai-git measures: where the repository is, the path matrix written
// before the change, and the two lint tools asked the way `npm run lint` uses them.
// The broken copies used by two-way.mjs live here too, built in memory or in the system temp folder, never in the
// repository: a measure must not change the tree it measures.

import { spawn } from "node:child_process";
import { copyFileSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const ROOT_LINE = (name) => `${name}: root ${REPO}`;

export const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO = resolve(HERE, "../../..");

// The two folders the change adds to both ignore lists.
export const NEW_IGNORES = [".acceptance-runs/", ".claude/worktrees/"];

// AC-1, AC-2: paths that must be ignored after the change.
export const OUT_OF_GIT = [
  ".acceptance-runs/x/a.mjs",
  ".claude/worktrees/w/src/app/page.tsx",
  ".claude/worktrees/w/.next/chunk.js",
];

// AC-3: paths inside the tree and the state each had at 799ae9dc, measured before the change.
// [path, eslint ignored?, prettier ignored?]
export const IN_TREE = [
  ["src/app/x.tsx", false, false],
  ["src/modules/listings/x.ts", false, false],
  ["src/components/candidate/x.tsx", false, false],
  ["tests/x.test.ts", false, false],
  ["tests/e2e/x.spec.ts", false, false],
  ["tools/x.mjs", false, false],
  ["tools/eslint-ui/x.mjs", false, false],
  ["db/scripts/x.mjs", false, false],
  [".claude/hooks/x.mjs", false, false],
  [".claude/skills/x/y.mjs", false, false],
  ["eslint.config.js", false, false],
  ["playwright.config.ts", false, false],
  ["_acceptance/x/rang/y.mjs", false, true],
  ["src/components/ui/x.tsx", false, true],
  ["src/generated/x.ts", true, true],
  ["src/components/reui/x.tsx", true, true],
  [".next/x.js", true, true],
  ["node_modules/x/y.js", true, true],
];

// Resolved from this file upwards, so the repository's own installed versions are used.
const { ESLint } = await import("eslint");
const prettier = (await import("prettier")).default;

export { ESLint };

// The repository's flat config as an array, read from eslint.config.js.
export async function repoConfig() {
  const mod = await import(pathToFileURL(join(REPO, "eslint.config.js")).href + `?t=${Date.now()}`);
  return mod.default;
}

// A copy of the config. `drop` removes ignore patterns from the global ignores; `add` appends one more global
// ignores entry. Returns the copy and how many patterns were removed.
export function editConfig(config, { drop = [], add = [] } = {}) {
  let removed = 0;
  const copy = config.map((entry) => {
    const keys = Object.keys(entry).filter((k) => k !== "name");
    if (keys.length !== 1 || keys[0] !== "ignores") return entry;
    const kept = entry.ignores.filter((p) => !drop.includes(p));
    removed += entry.ignores.length - kept.length;
    return { ...entry, ignores: kept };
  });
  if (add.length) copy.push({ ignores: add });
  return { config: copy, removed };
}

// ESLint as `npm run lint` runs it: the config file found from the repository root. With `config`, ESLint uses that
// array instead of any file (the broken copies).
export function eslintAt(config) {
  return config
    ? new ESLint({ cwd: REPO, overrideConfigFile: true, overrideConfig: config })
    : new ESLint({ cwd: REPO });
}

// Prettier as `prettier --check .` decides: .gitignore and .prettierignore of the root. With `ignoreText`, the two
// files are copied to a temp folder, .prettierignore replaced by that text, and the path is asked relative to it —
// Prettier reads ignore patterns relative to the ignore file.
// `alone: true` reads .prettierignore only, to show each of its own lines works without .gitignore.
export async function prettierIgnored(paths, ignoreText, { alone = false } = {}) {
  const withGit = (files) => (alone ? files.filter((f) => !f.endsWith(".gitignore")) : files);
  if (ignoreText === undefined) {
    const ignorePath = withGit([join(REPO, ".gitignore"), join(REPO, ".prettierignore")]);
    return Promise.all(paths.map(async (p) => (await prettier.getFileInfo(join(REPO, p), { ignorePath })).ignored));
  }
  const dir = mkdtempSync(join(tmpdir(), "lnt-prettier-"));
  try {
    copyFileSync(join(REPO, ".gitignore"), join(dir, ".gitignore"));
    writeFileSync(join(dir, ".prettierignore"), ignoreText);
    const ignorePath = withGit([join(dir, ".gitignore"), join(dir, ".prettierignore")]);
    return await Promise.all(paths.map(async (p) => (await prettier.getFileInfo(join(dir, p), { ignorePath })).ignored));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export function prettierIgnoreText() {
  return readFileSync(join(REPO, ".prettierignore"), "utf8");
}

// .prettierignore without the lines naming the two new folders. Returns the text and how many lines were removed.
export function dropPrettierLines(text) {
  const lines = text.split("\n");
  const kept = lines.filter((l) => !NEW_IGNORES.includes(l.trim()));
  return { text: kept.join("\n"), removed: lines.length - kept.length };
}

// Run a command without blocking, so a stop signal still reaches the cleanup below, which also stops the command.
const children = new Set();
export function runAsync(cmd, args, opts = {}) {
  return new Promise((done) => {
    const child = spawn(cmd, args, { cwd: REPO, detached: true, ...opts });
    children.add(child);
    child.on("exit", () => children.delete(child));
    let out = "";
    child.stdout?.on("data", (b) => (out += b));
    child.stderr?.on("data", (b) => (out += b));
    child.on("error", (e) => done({ status: null, output: `${out}${e.message}` }));
    child.on("close", (status, signal) => done({ status, signal, output: out }));
  });
}

// Planted folders left by a measure that was stopped from outside (a grader's time limit kills it): remove those of
// a dead run older than an hour, then make sure this run's own folders go even when it is stopped.
export function guardPlants(roots) {
  const hour = 60 * 60 * 1000;
  for (const d of [join(REPO, ".acceptance-runs"), join(REPO, ".claude/worktrees")]) {
    if (!existsSync(d)) continue;
    for (const n of readdirSync(d)) {
      if (!/^lnt-\d+-\d+$/.test(n)) continue;
      const full = join(d, n);
      if (Date.now() - statSync(full).mtimeMs > hour) rmSync(full, { recursive: true, force: true });
    }
  }
  const stop = (sig) => {
    for (const c of children) {
      try {
        process.kill(-c.pid, "SIGTERM");
      } catch {
        // already gone
      }
    }
    for (const r of roots) rmSync(r, { recursive: true, force: true });
    for (const d of [join(REPO, ".acceptance-runs"), join(REPO, ".claude/worktrees")]) {
      if (existsSync(d) && readdirSync(d).length === 0) rmSync(d, { recursive: true, force: true });
    }
    process.exit(sig === "SIGINT" ? 130 : 143);
  };
  process.once("SIGTERM", stop);
  process.once("SIGINT", stop);
}
