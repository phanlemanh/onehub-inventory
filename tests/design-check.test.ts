import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

function run(decisions: string) {
  const root = mkdtempSync(join(tmpdir(), "design-check-"));
  mkdirSync(join(root, "design"));
  mkdirSync(join(root, "tests"));
  writeFileSync(join(root, "tests/a.test.ts"), "");
  writeFileSync(join(root, "design/decisions.yaml"), `decisions:\n${decisions}`);
  return spawnSync("python3", ["tools/design_check.py", "--root", root], { encoding: "utf8" });
}

describe("determinism ledger", () => {
  it("reports automatic checks over all decisions", () => {
    const result = run(
      "  - { id: a, layer: x, kind: closed, source: s, check: 'test:tests/a.test.ts' }\n" +
        "  - { id: b, layer: x, kind: formula, source: s }\n",
    );
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("1/2 = 50%");
  });

  it("rejects a check that does not exist", () => {
    const result = run("  - { id: a, layer: x, kind: closed, source: s, check: 'test:nope.ts' }\n");
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("no such file");
  });

  it("rejects a judgment that claims an automatic check", () => {
    const result = run(
      "  - { id: a, layer: x, kind: judgment, source: s, check: 'test:tests/a.test.ts' }\n",
    );
    expect(result.status).toBe(1);
  });
});
