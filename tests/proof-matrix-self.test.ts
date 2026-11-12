// Self-check of the proof gate on Bảng hàng (roadmap row 2, AC-8, E8). Row 1c's gate passes in silence in three places
// (states table unreadable, an unknown contract status); this file proves the matrix check REALLY runs on the inventory
// proof before the screen becomes the grid family's reference.
import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SLUG = "bang-hang-ban-doc";
const SCREEN = "inventory";
const CONTRACT = `_acceptance/${SLUG}/contract.md`;
const PROOF = `_acceptance/${SLUG}/chung-minh-man.md`;

/** What the gate itself reads, asked from its own Python model so the check cannot drift from the gate. */
function gateFacts(root: string): {
  states: string[];
  status: string | null;
  proven: boolean | null;
} {
  const script = [
    "import json, sys",
    "from pathlib import Path",
    "sys.path.insert(0, 'tools/proof_gate')",
    "import check, model",
    "root = Path(sys.argv[1])",
    "repo = model.load_repo(root)",
    "c = next((c for c in model.load_contracts(root) if c.slug == sys.argv[2]), None)",
    "p = c.proofs.get(sys.argv[3]) if c else None",
    "print(json.dumps({'states': repo.states, 'status': c.status if c else None,",
    "  'proven': check.matrix_complete(repo, p) if p else None}))",
  ].join("\n");
  const out = spawnSync("python3", ["-c", script, root, SLUG, SCREEN], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (out.status !== 0) throw new Error(`gate model failed: ${out.stderr}`);
  return JSON.parse(out.stdout) as {
    states: string[];
    status: string | null;
    proven: boolean | null;
  };
}

/** Rows of the states table, read here without the gate's parser. */
function tableRows(root: string): number {
  const lines = readFileSync(join(root, "design/states.md"), "utf8").split("\n");
  return lines.filter((l) => /^\|/.test(l) && !/^\|\s*-/.test(l)).length - 1;
}

const JUDGED = ["draft", "approved", "implemented", "verified", "signed-off", "machine-cleared"];

/** Throws unless the gate reads every state, judges this record, and finds the inventory matrix complete. */
function selfCheck(root: string): void {
  const facts = gateFacts(root);
  if (facts.states.length === 0) throw new Error("bang trang thai rong");
  if (facts.states.length !== tableRows(root))
    throw new Error(`luoi doc thieu trang thai: ${facts.states.length}/${tableRows(root)}`);
  if (facts.status === null || !JUDGED.includes(facts.status))
    throw new Error(`ho so khong duoc cham: ${facts.status}`);
  if (facts.proven !== true) throw new Error(`ma tran inventory chua du: ${facts.proven}`);
}

/** A copy of what the gate reads (design, records, the test files the matrix points at). */
function copyRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), "proof-self-"));
  for (const part of [
    "design",
    "_acceptance",
    "tools/proof_gate",
    "tools/e2e_templates",
    "tools/repo_ontology.py",
    "tests",
    "wiki",
    // The 0023 gate checks the files of the block ledger and the context page of the record.
    "docs/tri-thuc",
    "src/components",
    // A module's own blocks (row 3: the listing card and record body) live in src/modules/<name>/ui.
    "src/modules",
  ]) {
    cpSync(join(ROOT, part), join(dir, part), { recursive: true });
  }
  return dir;
}

function edit(root: string, path: string, fn: (text: string) => string): void {
  writeFileSync(join(root, path), fn(readFileSync(join(root, path), "utf8")));
}

const runGate = (root: string) =>
  spawnSync("python3", [join(ROOT, "tools/proof_gate/check.py"), "--root", root], {
    encoding: "utf8",
  });

describe("the matrix check really runs on Bảng hàng (E8)", () => {
  it("reads all eleven states, judges this record and finds the inventory matrix complete", () => {
    const facts = gateFacts(ROOT);
    expect(facts.states).toHaveLength(11);
    expect(tableRows(ROOT)).toBe(11);
    expect(() => selfCheck(ROOT)).not.toThrow();
  });

  it("the gate turns red when the «Lỗi» row leaves the inventory matrix (record implemented)", () => {
    const root = copyRepo();
    edit(root, CONTRACT, (t) => t.replace(/^status: .*$/m, "status: implemented"));
    expect(runGate(root).status).toBe(0);
    edit(root, PROOF, (t) => t.replace(/^\| Lỗi .*\n/m, ""));
    const red = runGate(root);
    expect(red.status).not.toBe(0);
    expect(red.stdout).toContain("ma trận thiếu trạng thái 'Lỗi'");
    expect(() => selfCheck(root)).toThrow("ma tran inventory chua du");
  });

  it("an unreadable states table passes the gate in silence, and the self-check catches it", () => {
    const root = copyRepo();
    edit(root, CONTRACT, (t) => t.replace(/^status: .*$/m, "status: implemented"));
    edit(root, "design/states.md", (t) => t.replace(/^\|.*\n/gm, ""));
    expect(runGate(root).status).toBe(0);
    expect(() => selfCheck(root)).toThrow("bang trang thai rong");
  });

  it("a misspelt record status passes the gate in silence, and the self-check catches it", () => {
    const root = copyRepo();
    // The record is no longer judged, so a broken matrix row would go unseen; the gate stays green.
    edit(root, CONTRACT, (t) => t.replace(/^status: .*$/m, "status: implemnted"));
    expect(runGate(root).status).toBe(0);
    expect(() => selfCheck(root)).toThrow("ho so khong duoc cham: implemnted");
  });
});
