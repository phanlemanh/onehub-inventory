import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

function check(message: string) {
  const file = join(mkdtempSync(join(tmpdir(), "commit-msg-")), "MSG");
  writeFileSync(file, message);
  return spawnSync("python3", ["tools/commit_msg.py", file]).status;
}

describe("commit message check", () => {
  for (const ok of [
    "feat: add the grid",
    "fix(sharing): stop leaking labels",
    "feat!: drop the old route",
    "tri-thuc: ghi mvp-mo-dan (tep-may)",
    "design-floor S3: autofix 0 tệp, sinh lại 1 lệnh — bang-hang",
    "Merge branch 'main' into feature",
  ]) {
    it(`accepts: ${ok}`, () => expect(check(ok)).toBe(0));
  }
  for (const bad of ["added stuff", "feat add grid", "tri-thuc ghi x", "design-floor: x", ""]) {
    it(`rejects: ${bad || "(empty)"}`, () => expect(check(bad)).toBe(1));
  }
});
