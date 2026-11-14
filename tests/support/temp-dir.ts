// The one door for temporary folders in tests. Every folder made here is removed when the test file ends — after a
// failing or timed-out test too — and, as a last net, when the worker process exits. A test that makes its own
// temporary folder with mkdtemp fails `tests/temp-dir-guard.test.ts`: on 2026-11-14 such folders filled the disk.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterAll } from "vitest";

const made: string[] = [];

function removeAll(): void {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
}

// Imported at the top of a test file, so this hook belongs to that file's root suite.
afterAll(removeAll);
process.once("exit", removeAll);

/** A new empty folder in the system's temporary folder, removed when the test file ends. */
export function tempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  made.push(dir);
  return dir;
}
