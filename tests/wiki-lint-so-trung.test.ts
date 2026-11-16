// Row 1u, AC-7: the wiki check is red when two decision pages share a number, and only then.
import { spawnSync } from "node:child_process";
import { copyFileSync, cpSync, readdirSync, symlinkSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { tempDir } from "./support/temp-dir";

const ROOT = join(__dirname, "..");
const DECISIONS = join("wiki", "decisions");

/** A copy of the repository where only wiki/ is a real copy; everything else links back, so page links resolve. */
function copyRepo(): string {
  const dir = tempDir("wiki-so-trung-");
  for (const name of readdirSync(ROOT)) {
    if (name === "wiki" || name === ".git") continue;
    symlinkSync(join(ROOT, name), join(dir, name));
  }
  cpSync(join(ROOT, "wiki"), join(dir, "wiki"), { recursive: true });
  return dir;
}

function lint(root: string): { code: number; errors: string[] } {
  const r = spawnSync("python3", [join(ROOT, "tools", "wiki_lint.py"), "--root", root, "--json"], {
    encoding: "utf8",
  });
  const out = JSON.parse(r.stdout) as { errors: { path: string; message: string }[] };
  return { code: r.status ?? -1, errors: out.errors.map((e) => `${e.path}: ${e.message}`) };
}

const numberErrors = (errors: string[]) => errors.filter((e) => e.includes("decision number"));

describe("wiki_lint · one number, one decision page", () => {
  it("the repository itself is green", () => {
    expect(lint(ROOT)).toEqual({ code: 0, errors: [] });
  });

  it("a sound copy has no number error", () => {
    expect(numberErrors(lint(copyRepo()).errors)).toEqual([]);
  });

  it("break: two pages numbered 0034 are caught, both named", () => {
    const dir = copyRepo();
    copyFileSync(
      join(dir, DECISIONS, "0042-cong-bat-khoi-khong-ke.md"),
      join(dir, DECISIONS, "0034-cong-bat-khoi-khong-ke.md"),
    );
    const r = lint(dir);
    expect(r.code).toBe(1);
    expect(numberErrors(r.errors)).toEqual([
      "wiki/decisions/: decision number 0034 used by 0034-component-register-written-by-design-assembly.md, 0034-cong-bat-khoi-khong-ke.md",
    ]);
  });

  it("different numbers are not caught: neighbours, and the same title under another number", () => {
    const dir = copyRepo();
    copyFileSync(
      join(dir, DECISIONS, "0042-cong-bat-khoi-khong-ke.md"),
      join(dir, DECISIONS, "0999-cong-bat-khoi-khong-ke.md"),
    );
    expect(numberErrors(lint(dir).errors)).toEqual([]);
  });
});
