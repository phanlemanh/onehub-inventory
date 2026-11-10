#!/usr/bin/env node
// Prints the path of the acceptance-gate plugin installed for this repo, from Claude Code's plugin registry.
// Needed because verifying agents do not get CLAUDE_PLUGIN_ROOT. Prints nothing when no install is found.
//
// Order: the install for this checkout, then for the main checkout of a worktree, then the user-scope install.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function chooseInstall(entries, roots) {
  const usable = (e) => e?.installPath && existsSync(e.installPath);
  for (const root of roots) {
    const entry = entries.find(
      (e) => e.scope === "project" && e.projectPath && resolve(e.projectPath) === resolve(root),
    );
    if (usable(entry)) return entry.installPath;
  }
  const user = entries.find((e) => e.scope === "user");
  return usable(user) ? user.installPath : "";
}

function repoRoots(cwd) {
  const git = (...args) =>
    execFileSync("git", ["-C", cwd, ...args], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  try {
    const top = git("rev-parse", "--show-toplevel");
    return [top, dirname(resolve(top, git("rev-parse", "--git-common-dir")))];
  } catch {
    return [cwd];
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  const registry =
    process.env.PLUGIN_REGISTRY ?? `${homedir()}/.claude/plugins/installed_plugins.json`;
  let entries;
  try {
    entries =
      JSON.parse(readFileSync(registry, "utf8")).plugins?.["acceptance-gate@acceptance-gate-kit"] ??
      [];
  } catch {
    entries = [];
  }
  const found = chooseInstall(entries, repoRoots(process.cwd()));
  if (found) process.stdout.write(`${found}\n`);
}
