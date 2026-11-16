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

/**
 * Identity's tables, read from the migrations: every table in the identity schema, plus the two public tables the
 * identity module owns (companies and company_members, migrations 001 and 002). A table in the identity schema is
 * matched with or without its schema prefix.
 */
const IDENTITY_TABLES: string[] = (() => {
  const dir = join(ROOT, "db/migrations");
  const sql = readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .map((f) => readFileSync(join(dir, f), "utf8"))
    .join("\n");
  const inSchema = [...sql.matchAll(/create table (?:if not exists )?identity\.(\w+)/gi)].map(
    (m) => m[1]!,
  );
  const owned = ["companies", "company_members"].filter((t) =>
    new RegExp(`create table (?:if not exists )?(?:public\\.)?${t}\\b`, "i").test(sql),
  );
  return [...new Set([...owned, ...inSchema])];
})();

/** Each of identity's tables that `text` reads or writes in SQL. */
export function identityTablesIn(text: string): string[] {
  return IDENTITY_TABLES.filter((table) =>
    new RegExp(`\\b(from|join|into|update)\\s+(identity\\.)?${table}\\b`, "i").test(text),
  );
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

describe("company-config reaches people only through identity's door", () => {
  it("identity's tables come from the migrations", () => {
    expect(IDENTITY_TABLES).toEqual(
      expect.arrayContaining([
        "companies",
        "company_members",
        "users",
        "sessions",
        "login_codes",
        "code_requests",
      ]),
    );
  });

  it("no company-config file names identity's tables in SQL", () => {
    const files = sourceFiles(MODULE).map((path) => relative(ROOT, path));
    // The scan really reads the module: the fee store and the HTTP handlers are among the files.
    expect(files).toEqual(
      expect.arrayContaining([
        "src/modules/company-config/fee-store.ts",
        "src/modules/company-config/fee-schedule-http.ts",
      ]),
    );
    const hits = sourceFiles(MODULE).flatMap((path) =>
      identityTablesIn(readFileSync(path, "utf8")).map((t) => `${relative(ROOT, path)}: ${t}`),
    );
    expect(hits).toEqual([]);
  });

  it("break: the statement the store used to run is caught", () => {
    const before =
      "select name from company_members where user_id::text = current_setting('app.user_id', true)";
    expect(identityTablesIn(before)).toEqual(["company_members"]);
    expect(identityTablesIn("select name from identity.users where id = $1")).toEqual(["users"]);
    expect(identityTablesIn("delete from identity.sessions")).toEqual(["sessions"]);
    expect(
      identityTablesIn("select c.name from companies c join company_members m on true"),
    ).toEqual(["companies", "company_members"]);
  });

  it("control: company-config's own tables are not caught", () => {
    expect(identityTablesIn("select code from company_fee_items")).toEqual([]);
    expect(identityTablesIn("update company_fee_items set removed = true")).toEqual([]);
  });
});
