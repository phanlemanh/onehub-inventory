// Row 3g (debt (b) of row 10): one rule reads a failed write of a listing. No file on the listing's write path — every
// file of src/ that uses the save door or the shared write door — compares an answer's HTTP status to a number; only
// src/lib/write-failure.ts does. Other screens' forms (members, saved views) read their own answers with their own
// sentences and are not this path. Case name is the record's pinned message (evals.yaml, E7b).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

const ROOT = join(import.meta.dirname, "..");
const ONE = "src/lib/write-failure.ts";
/** A status compared to a number on an answer: `response.status === 409`, `res.status >= 500`, `case 403:` after a status switch. */
const COMPARE =
  /\b(?:response|res|answer)\.status\s*(?:===|!==|==|>=|<=|>|<)\s*\d{3}|switch\s*\(\s*(?:response|res|answer)\.status\s*\)/;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

/** A file on the listing's write path: it uses the save door (row 4, 10) or the shared write door (use-change). */
const ON_PATH =
  /from "[^"]*(?:\/save-door|\/http-save-door|candidate\/use-change)"|\bListingSaveDoor\b|\bfunction httpSaveDoor\b|\bexport async function runDoorChange\b/;

/** The files of `root`'s write path that read a write's answer by its status, other than the one rule. */
export function secondTables(root: string): string[] {
  const all = files(join(root, "src"));
  const onPath = all.filter((f) => ON_PATH.test(readFileSync(f, "utf8")));
  // The path must be found, or the scan would pass on nothing.
  if (onPath.length < 4)
    throw new Error(`mot-luat-ghi: only ${onPath.length} files on the write path`);
  return onPath
    .filter((f) => relative(root, f) !== ONE)
    .filter((f) => COMPARE.test(readFileSync(f, "utf8")))
    .map((f) => relative(root, f));
}

describe("mot-luat-ghi", () => {
  it("khong-bang-ma-thu-hai: only the one rule reads statuses", () => {
    expect(secondTables(ROOT), "khong-bang-ma-thu-hai").toEqual([]);
  });

  it("khong-bang-ma-thu-hai: the scan sees a second table (positive control on a copy of the old door)", () => {
    const old = 'if (response.status === 409) return { kind: "conflict" };';
    expect(COMPARE.test(old), "khong-bang-ma-thu-hai: http-save-door.ts").toBe(true);
    expect(COMPARE.test('if (failureOfStatus(response.status) === "conflict")')).toBe(false);
  });
});
