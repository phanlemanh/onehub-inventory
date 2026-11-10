import { execFileSync, spawnSync } from "node:child_process";
import { chmodSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
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

describe("check-changed hook", () => {
  const VENDOR = "src/components/reui/a.tsx";
  const OWN = "src/modules/listings/b.ts";

  function repoWith(changed: string[]): string {
    const root = mkdtempSync(join(tmpdir(), "stop-hook-"));
    execFileSync("git", ["init", "-q"], { cwd: root });
    mkdirSync(join(root, "node_modules/.bin"), { recursive: true });
    writeFileSync(join(root, ".gitignore"), "node_modules\n");
    const tsc = `#!/bin/sh\necho "${VENDOR}(1,1): error TS2532: vendor"\necho "${OWN}(1,1): error TS2532: own"\n`;
    writeFileSync(join(root, "node_modules/.bin/tsc"), tsc);
    writeFileSync(join(root, "node_modules/.bin/eslint"), "#!/bin/sh\nexit 0\n");
    chmodSync(join(root, "node_modules/.bin/tsc"), 0o755);
    chmodSync(join(root, "node_modules/.bin/eslint"), 0o755);
    for (const file of changed) {
      mkdirSync(join(root, file, ".."), { recursive: true });
      writeFileSync(join(root, file), "export {};\n");
    }
    return root;
  }

  const stop = (root: string) =>
    spawnSync("bash", [resolve(".claude/hooks/check-changed.sh")], {
      input: JSON.stringify({ cwd: root, stop_hook_active: false }),
      encoding: "utf8",
    });

  it("ignores errors in vendor files", () => {
    expect(stop(repoWith([VENDOR])).status).toBe(0);
  });

  it("reports errors in the repo's own files, and only those", () => {
    const result = stop(repoWith([VENDOR, OWN]));
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("own");
    expect(result.stderr).not.toContain("vendor");
  });
});
