// Build folders of browser runs (row 1s, AC-8; Ngoài-1 and Ngoài-3 of row 1r). Each run of either Playwright
// configuration builds Next into node_modules/.cache/<base>/<run> — a full build, and the machine's disk once filled up
// with them. A run now:
//   - writes its main process id to `<run folder>/.chu`;
//   - when it starts, deletes every folder of the same base whose `.chu` names a process that is gone;
//   - deletes its own folder when its main process exits — after Playwright has stopped the dev server (Playwright stops
//     the server after globalTeardown, so deleting there would pull the folder from under a running server).
// Whether a run is alive is read from `.chu`, never from the folder name: the name may be set through E2E_RUN or
// E2E_DB_RUN, and a process id in a name may belong to another process by now. A folder without `.chu` is left alone.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const CACHE_ROOT = join("node_modules", ".cache");
export const OWNER_FILE = ".chu";

/** True when a process with this id exists (EPERM: it exists, owned by someone else). */
export function alive(pid: number): boolean {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return (err as NodeJS.ErrnoException).code === "EPERM";
  }
}

/** The owner's process id written in a run folder, or null when the folder has no readable `.chu`. */
export function owner(folder: string): number | null {
  try {
    const pid = Number(readFileSync(join(folder, OWNER_FILE), "utf8").trim());
    return Number.isInteger(pid) && pid > 0 ? pid : null;
  } catch {
    return null;
  }
}

/** Deletes every run folder under `baseDir` whose owner is gone; returns the names deleted. */
export function sweepDead(baseDir: string, isAlive: (pid: number) => boolean = alive): string[] {
  if (!existsSync(baseDir)) return [];
  const gone: string[] = [];
  for (const name of readdirSync(baseDir)) {
    const pid = owner(join(baseDir, name));
    if (pid === null || isAlive(pid)) continue;
    rmSync(join(baseDir, name), { recursive: true, force: true });
    gone.push(name);
  }
  return gone;
}

/**
 * Called from globalSetup in the runner's main process: sweeps dead runs of `base`, marks `run` as owned by this
 * process and deletes its folder when this process exits.
 */
export function claimRunFolder(base: string, run: string, root = process.cwd()): string[] {
  const baseDir = join(root, CACHE_ROOT, base);
  const gone = sweepDead(baseDir);
  const mine = join(baseDir, run);
  mkdirSync(mine, { recursive: true });
  writeFileSync(join(mine, OWNER_FILE), `${process.pid}\n`);
  process.once("exit", () => rmSync(mine, { recursive: true, force: true }));
  if (gone.length > 0) console.log(`don thu muc dung tam: ${base} — ${gone.length} luot da chet`);
  return gone;
}

/** globalSetup of playwright.config.ts (the signed-out run). */
export default function setup(): void {
  claimRunFolder("onehub-e2e", process.env["E2E_RUN"] ?? `${process.pid}`);
}
