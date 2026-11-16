// Several runs of the proof gate fetch the missing history into one shallow copy at once (vitest runs the gate's test
// files in parallel, and the CI checkout is shallow). git lets one of them change the copy's history at a time
// (`.git/shallow.lock`); the others wait for it instead of turning red (tools/proof_gate/legacy.py, PR #66).
import { execFileSync, spawn } from "node:child_process";
import { existsSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { tempDir } from "../../tests/support/temp-dir";

const TOOL_DIR = join(process.cwd(), "tools/proof_gate");
const READ = `
import json, sys
from pathlib import Path
sys.path.insert(0, ${JSON.stringify(TOOL_DIR)})
from legacy import History
h = History.read(Path(sys.argv[1]))
print(json.dumps({"err": h.fetch_error, "shallow": h._shallow()}))
`;

function git(cwd: string, args: string[]): string {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      GIT_AUTHOR_DATE: "2026-11-10T00:00:00Z",
      GIT_COMMITTER_DATE: "2026-11-10T00:00:00Z",
    },
  }).trim();
}

/** A small origin with three commits, and a shallow copy (depth 1) of it that keeps `origin`. */
function shallowCopy(): string {
  const src = tempDir("pg-khoa-goc-");
  git(src, ["init", "--quiet", "-b", "main"]);
  for (const n of [1, 2, 3]) {
    writeFileSync(join(src, `f${n}.txt`), `${n}\n`);
    git(src, ["add", "."]);
    git(src, ["-c", "user.name=t", "-c", "user.email=t@t", "commit", "--quiet", "-m", `c${n}`]);
  }
  const dst = join(tempDir("pg-khoa-nong-"), "kho");
  git(src, ["clone", "--quiet", "--no-local", "--depth=1", `file://${src}`, dst]);
  expect(git(dst, ["rev-parse", "--is-shallow-repository"])).toBe("true");
  return dst;
}

interface Read {
  err: string;
  shallow: boolean;
}

/** History.read on `root` in a python process of its own. */
function read(root: string, tries?: number): Promise<Read> {
  const env = { ...process.env };
  if (tries !== undefined) env["PROOF_GATE_UNSHALLOW_TRIES"] = String(tries);
  return new Promise((resolve, reject) => {
    const p = spawn("python3", ["-c", READ, root], { env });
    let out = "";
    let err = "";
    p.stdout.on("data", (d: Buffer) => (out += d.toString()));
    p.stderr.on("data", (d: Buffer) => (err += d.toString()));
    p.on("error", reject);
    p.on("close", (code) =>
      code === 0 ? resolve(JSON.parse(out) as Read) : reject(new Error(`python ${code}: ${err}`)),
    );
  });
}

/** Hold git's history lock of `root` as another fetch would, and let it go after `ms`. */
function holdLock(root: string, ms: number): string {
  const lock = join(root, ".git/shallow.lock");
  writeFileSync(lock, "");
  setTimeout(() => rmSync(lock, { force: true }), ms);
  return lock;
}

describe("shallow copy: several runs of the gate fetch its history at once", () => {
  it("three runs at once on one shallow copy all get the history", async () => {
    const root = shallowCopy();
    const runs = await Promise.all([read(root), read(root), read(root)]);
    expect(runs).toEqual([
      { err: "", shallow: false },
      { err: "", shallow: false },
      { err: "", shallow: false },
    ]);
  }, 60_000);

  it("a run that finds the lock held waits for it, then fetches", async () => {
    const root = shallowCopy();
    const lock = holdLock(root, 2_500);
    const r = await read(root);
    expect(existsSync(lock)).toBe(false);
    expect(r).toEqual({ err: "", shallow: false });
  }, 60_000);

  it("break: without waiting, the held lock turns the run red", async () => {
    const root = shallowCopy();
    holdLock(root, 2_500);
    const r = await read(root, 1);
    expect(r.shallow).toBe(true);
    expect(r.err).toContain("shallow.lock");
  }, 60_000);

  it("a lock still held after the last try is red with the reason, never swallowed", async () => {
    const root = shallowCopy();
    const lock = holdLock(root, 30_000);
    try {
      const r = await read(root, 3);
      expect(r.shallow).toBe(true);
      expect(r.err).toContain("khoá lịch sử vẫn bị tiến trình khác giữ sau 3 lần thử");
      expect(r.err).toContain("shallow.lock");
    } finally {
      rmSync(lock, { force: true });
    }
  }, 60_000);
});
