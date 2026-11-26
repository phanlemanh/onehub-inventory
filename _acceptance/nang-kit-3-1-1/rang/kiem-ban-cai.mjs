// AC-4: the install check of the tag itself (kiem-ban-cai.mjs --ref v3.1.1, the step «Kho tiêu thụ làm gì khi nhận» of
// the release notes) run against a fetch of the kit that carries the tag: exit 0 and the pinned last line.
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { cli, git, short } from "./kit.mjs";
import { KIEM_BAN_CAI, NEW_KIT } from "./matrix.mjs";

// The kit at its tag with the tag ref itself (kiem-ban-cai resolves --ref through git), in os.tmpdir().
export function fetchKitWithTag(kit) {
  const dir = join(tmpdir(), `nk311-kitref-${kit.tag}`);
  try {
    if (git(dir, "rev-parse", `${kit.tag}^{commit}`) === kit.sha && git(dir, "rev-parse", "HEAD") === kit.sha) return dir;
  } catch {
    // not fetched yet
  }
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  try {
    git(dir, "init", "-q");
    git(dir, "fetch", "-q", "--depth", "1", kit.url, `refs/tags/${kit.tag}:refs/tags/${kit.tag}`);
    git(dir, "checkout", "-q", `${kit.tag}^{commit}`);
  } catch {
    throw new Error(`kiem-ban-cai: cannot fetch ${kit.url} ${kit.tag}`);
  }
  const head = git(dir, "rev-parse", "HEAD");
  if (head !== kit.sha) throw new Error(`kiem-ban-cai: ${kit.url} ${kit.tag} is ${short(head)}, want ${short(kit.sha)}`);
  return dir;
}

export function run(kitDir, extra = []) {
  const r = spawnSync(process.execPath, [join(kitDir, KIEM_BAN_CAI.script), "--ref", NEW_KIT.tag, "--root", kitDir, ...extra], {
    cwd: kitDir,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    timeout: 300_000,
  });
  return { status: r.status, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}

export function judge({ status, out }) {
  const last = out.trimEnd().split("\n").pop() ?? "";
  const head = `kiem-ban-cai: kiem-ban-cai.mjs of ${NEW_KIT.tag} --ref ${NEW_KIT.tag} exit ${status}`;
  if (status !== 0 || last !== KIEM_BAN_CAI.lastLine) return { ok: false, line: `${head}: ${last.replace(/^\[kiem-ban-cai\] /, "")}` };
  return { ok: true, line: `${head}: ${last.replace(/^\[kiem-ban-cai\] /, "")}` };
}

export async function measure() {
  return judge(run(fetchKitWithTag(NEW_KIT)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await cli(measure);
