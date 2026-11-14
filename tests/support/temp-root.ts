// Vitest global setup: the second net under tests/support/temp-dir.ts. Each run points TMPDIR at a folder of its own
// and removes that folder when the run ends, so a temporary folder a test makes without the helper — a signed,
// hash-pinned test file that may not change, a tool the test runs, a git clone — does not stay behind either.
// A run killed before teardown leaves its root; the next run removes roots whose process is gone.
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const ROOT_PREFIX = "onehub-test-run-";

function alive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return (e as NodeJS.ErrnoException).code === "EPERM";
  }
}

/** Roots left by earlier runs whose process is gone; only this repo's own prefix, never other folders. */
export function staleRoots(base: string): string[] {
  return readdirSync(base)
    .map((name) => ({ name, pid: Number(name.slice(ROOT_PREFIX.length).split("-")[0]) }))
    .filter(
      ({ name, pid }) =>
        name.startsWith(ROOT_PREFIX) && pid > 0 && pid !== process.pid && !alive(pid),
    )
    .map(({ name }) => join(base, name));
}

export default function setup(): () => void {
  const base = tmpdir();
  for (const dir of staleRoots(base)) rmSync(dir, { recursive: true, force: true });
  const root = mkdtempSync(join(base, `${ROOT_PREFIX}${process.pid}-`));
  const before = process.env["TMPDIR"];
  process.env["TMPDIR"] = root;
  return () => {
    if (before === undefined) delete process.env["TMPDIR"];
    else process.env["TMPDIR"] = before;
    rmSync(root, { recursive: true, force: true });
  };
}
