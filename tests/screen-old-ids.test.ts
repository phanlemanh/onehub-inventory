// Former screen ids (english-route-names, AC-7): a screen file's `old_ids` lets a closed contract keep the id it was
// signed with, while an open contract naming that id is red with the new id named. Both register readers — the role ×
// screen check (tools/coverage_matrix) and the screen proof gate (tools/proof_gate) — on a copy holding the real
// register and the real signed contract of row 19 (thue-phi), which declares `screens: [tuy-chinh-san, inventory]`.
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";
import { tempDir } from "./support/temp-dir";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// OLD_IDS_COVERAGE points at a broken copy of the tool for the break pair of rang/old-ids.sh.
const COVERAGE = process.env["OLD_IDS_COVERAGE"] ?? join(REPO, "tools/coverage_matrix/check.py");
const PROOF = join(REPO, "tools/proof_gate/check.py");
const SIGNED = readFileSync(join(REPO, "_acceptance/thue-phi/contract.md"), "utf8");
const OLD = "screen 'tuy-chinh-san' is an old id of 'company-layer'";
const SLOW = { timeout: 120_000 };

const made: string[] = [];
afterAll(() => made.forEach((d) => rmSync(d, { recursive: true, force: true })));

/** A copy with the registers, the pages and one contract under `_acceptance/fixture/`. */
function copyWith(contract: string): string {
  const root = tempDir("screen-old-ids-");
  made.push(root);
  for (const rel of ["design", "ontology", "src/app"])
    cpSync(join(REPO, rel), join(root, rel), { recursive: true });
  mkdirSync(join(root, "_acceptance/fixture"), { recursive: true });
  writeFileSync(join(root, "_acceptance/fixture/contract.md"), contract);
  return root;
}

const run = (tool: string, root: string) =>
  spawnSync("python3", [tool, "--root", root], { encoding: "utf8" });
const out = (r: ReturnType<typeof run>) => `${r.stdout}${r.stderr}`;
const opened = SIGNED.replace(/^status: signed-off$/m, "status: approved");

describe("old-ids", () => {
  it("the signed contract still names the old id", () => {
    expect(SIGNED).toMatch(/^screens: \[tuy-chinh-san, inventory\]$/m);
    expect(SIGNED).toMatch(/^status: signed-off$/m);
    expect(opened).toMatch(/^status: approved$/m);
  });

  it("old-ids: closed contract passes — coverage matrix", SLOW, () => {
    const r = run(COVERAGE, copyWith(SIGNED));
    expect(out(r), "old-ids: closed contract passes").not.toContain("tuy-chinh-san");
    expect(r.status).toBe(0);
  });

  it("old-ids: open contract uses tuy-chinh-san — coverage matrix", SLOW, () => {
    const r = run(COVERAGE, copyWith(opened));
    expect(out(r), "old-ids: open contract uses tuy-chinh-san").toContain(OLD);
    expect(r.status).toBe(1);
  });

  it("old-ids: closed contract passes — proof gate", SLOW, () => {
    const r = run(PROOF, copyWith(SIGNED));
    expect(out(r), "old-ids: closed contract passes").not.toMatch(/^fixture · tuy-chinh-san/m);
  });

  it("old-ids: open contract uses tuy-chinh-san — proof gate", SLOW, () => {
    const r = run(PROOF, copyWith(opened));
    expect(out(r), "old-ids: open contract uses tuy-chinh-san").toContain(
      `fixture · tuy-chinh-san · ma-man-cu: ${OLD}`,
    );
  });

  it("old-ids: an id that never existed is still red, signed or not", SLOW, () => {
    const r = run(
      COVERAGE,
      copyWith(SIGNED.replace("[tuy-chinh-san, inventory]", "[khong-co, inventory]")),
    );
    expect(out(r)).toContain("screen 'khong-co' is not in design/screens.yaml");
    expect(r.status).toBe(1);
  });
});
