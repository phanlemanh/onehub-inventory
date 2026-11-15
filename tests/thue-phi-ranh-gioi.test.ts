// Row 19 (thue-phi), supervisor ruling G-1511-59: saving the fee schedule records who changed it, and that name comes
// through the identity module's public door (sessionMemberName in src/modules/identity/server.ts). Company-config
// never names identity's tables in its own SQL; AGENTS.md: "never reach into another module's tables". The import
// check (tools/boundaries.py) reads imports only, so this test reads the SQL text.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MODULE = join(ROOT, "src/modules/company-config");

/** Identity's tables that hold people and their membership. */
const IDENTITY_TABLES = ["company_members", "users", "companies"];

/** Each statement in `text` that reads or writes one of identity's tables, as «table». */
export function identityTablesIn(text: string): string[] {
  const found: string[] = [];
  for (const table of IDENTITY_TABLES) {
    if (new RegExp(`\\b(from|join|into|update)\\s+${table}\\b`, "i").test(text)) found.push(table);
  }
  return found;
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

describe("company-config reaches people only through identity's door", () => {
  it("no company-config file names identity's tables in SQL", () => {
    const hits = sourceFiles(MODULE).flatMap((path) =>
      identityTablesIn(readFileSync(path, "utf8")).map((t) => `${relative(ROOT, path)}: ${t}`),
    );
    expect(hits).toEqual([]);
  });

  it("break: the statement the store used to run is caught", () => {
    const before =
      "select name from company_members where user_id::text = current_setting('app.user_id', true)";
    expect(identityTablesIn(before)).toEqual(["company_members"]);
    expect(
      identityTablesIn("select c.name from companies c join company_members m on true"),
    ).toEqual(["company_members", "companies"]);
  });

  it("control: company-config's own tables are not caught", () => {
    expect(identityTablesIn("select code from company_fee_items")).toEqual([]);
    expect(identityTablesIn("update company_fee_items set removed = true")).toEqual([]);
  });
});
