import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

const HOOK = resolve(".claude/hooks/guard-edits.sh");

function repoWithMigration(): string {
  const root = mkdtempSync(join(tmpdir(), "hook-"));
  const git = (...args: string[]) => execFileSync("git", args, { cwd: root });
  git("init", "-q");
  git("config", "user.email", "test@example.invalid");
  git("config", "user.name", "Test");
  mkdirSync(join(root, "db/migrations"), { recursive: true });
  writeFileSync(join(root, "db/migrations/001_a.sql"), "select 1;\n");
  git("add", "-A");
  git("commit", "-qm", "base");
  return root;
}

const run = (file: string) =>
  spawnSync("bash", [HOOK], {
    input: JSON.stringify({ tool_input: { file_path: file } }),
    encoding: "utf8",
  }).status;

describe("guard-edits hook", () => {
  const root = repoWithMigration();

  it("blocks a committed migration", () => {
    expect(run(join(root, "db/migrations/001_a.sql"))).toBe(2);
  });

  it("allows a new migration", () => {
    expect(run(join(root, "db/migrations/002_b.sql"))).toBe(0);
  });

  it("blocks secret files", () => {
    expect(run(join(root, ".env.local"))).toBe(2);
  });

  it("allows ordinary files", () => {
    expect(run(join(root, "src/a.ts"))).toBe(0);
  });
});
