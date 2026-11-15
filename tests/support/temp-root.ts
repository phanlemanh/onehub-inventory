// Vitest global setup: the second net under tests/support/temp-dir.ts. Each run points TMPDIR at a folder of its own
// under `<system temp>/onehub-test-runs/` and removes that folder when the run ends, so a temporary folder a test makes
// without the helper — a signed test file that may not change, a tool the test runs, a git clone — does not stay
// behind either. A run killed before teardown leaves its folder; the next run removes it.
// Liveness follows the build-folder rule of row 1s (tests/e2e-db/don-dung-tam.ts, AC-8): the run's main process writes
// its id to `.chu`, a folder is removed only when the process named there is gone, and never from the folder name — so
// a live run of another worktree keeps its folder, and a reused process id only delays a removal.
import { mkdirSync, mkdtempSync, rmdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { OWNER_FILE, sweepDead } from "../e2e-db/don-dung-tam";

export const RUNS_DIR = "onehub-test-runs";

/** Removes dead runs' folders under `base`, makes this run's own folder, owned by this process. */
export function claimRunRoot(base: string = tmpdir()): string {
  const runs = join(base, RUNS_DIR);
  mkdirSync(runs, { recursive: true });
  sweepDead(runs);
  // A folder is never swept before its owner file exists, so the gap between the two lines below is safe.
  for (let attempt = 0; ; attempt++) {
    try {
      const root = mkdtempSync(join(runs, "run-"));
      writeFileSync(join(root, OWNER_FILE), `${process.pid}\n`);
      return root;
    } catch (err) {
      // The last run of another worktree removed the shared folder just now: make it again.
      if ((err as NodeJS.ErrnoException).code !== "ENOENT" || attempt >= 4) throw err;
      mkdirSync(runs, { recursive: true });
    }
  }
}

/** Removes this run's folder, and the shared parent too when no other run is in it. */
export function releaseRunRoot(root: string): void {
  rmSync(root, { recursive: true, force: true });
  try {
    rmdirSync(dirname(root));
  } catch {
    // another run still has its folder there
  }
}

/** Runs in the runner's main process, which lives until teardown: its id is the owner of the run's folder. */
export default function setup(): () => void {
  const before = process.env["TMPDIR"];
  const root = claimRunRoot();
  process.env["TMPDIR"] = root;
  process.once("exit", () => releaseRunRoot(root));
  return () => {
    if (before === undefined) delete process.env["TMPDIR"];
    else process.env["TMPDIR"] = before;
    releaseRunRoot(root);
  };
}
