// The members screen reads and writes people only through the identity module's door (row 9c, AC-7, SP-1): every
// fetch goes to MEMBERS_BASE_PATH, and no file of the screen reaches the database or a hard-coded API path.
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const SCREEN = join(__dirname, "..", "src", "app", "(app)", "members");

/** Every rule broken in the folder, one line each; empty when the screen keeps to the door. */
export function outsideTheDoor(dir: string): string[] {
  const found: string[] = [];
  for (const file of readdirSync(dir).filter((f) => /\.tsx?$/.test(f))) {
    const text = readFileSync(join(dir, file), "utf8");
    for (const m of text.matchAll(/fetch\(\s*([^,)]+)/g)) {
      const target = m[1]!.trim();
      if (!/^`?\$?\{?MEMBERS_BASE_PATH/.test(target) && target !== "MEMBERS_BASE_PATH")
        found.push(`${file}: fetch(${target})`);
    }
    for (const bad of [/from "@\/lib\/db/, /from "pg"/, /import "server-only"/, /["'`]\/api\//]) {
      if (bad.test(text)) found.push(`${file}: ${bad.source}`);
    }
    if (/MEMBERS_BASE_PATH/.test(text) && !/from "@\/modules\/identity"/.test(text))
      found.push(`${file}: MEMBERS_BASE_PATH not from @/modules/identity`);
  }
  return found;
}

function assertDoor(dir: string): void {
  const found = outsideTheDoor(dir);
  if (found.length)
    throw new Error(`members screen reads outside the identity door: ${found.join("; ")}`);
}

describe("members screen, one door (row 9c)", () => {
  it("reads and writes only through the identity module", () => {
    expect(readdirSync(SCREEN).filter((f) => /\.tsx?$/.test(f)).length).toBeGreaterThanOrEqual(4);
    expect(() => assertDoor(SCREEN)).not.toThrow();
  });

  it("pha thu: a copy with one more fetch to another path is caught", () => {
    const copy = mkdtempSync(join(tmpdir(), "thanh-vien-mot-cua-"));
    for (const f of readdirSync(SCREEN).filter((f) => /\.tsx?$/.test(f)))
      writeFileSync(join(copy, f), readFileSync(join(SCREEN, f)));
    writeFileSync(join(copy, "extra.ts"), 'export const x = () => fetch("/api/v1/khac");\n');
    expect(() => assertDoor(copy)).toThrow("members screen reads outside the identity door");
  });
});
