import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { describe, expect, it } from "vitest";

const MODULES = `modules:
  - name: listings
    owns: []
    depends_on: [contacts]
  - name: contacts
    owns: []
    depends_on: []
`;

function errorsFor(files: Record<string, string>): string[] {
  const root = mkdtempSync(join(tmpdir(), "boundaries-"));
  const all: Record<string, string> = {
    "architecture/modules.yaml": MODULES,
    "src/modules/listings/index.ts": "export {};\n",
    "src/modules/contacts/index.ts": "export {};\n",
    ...files,
  };
  for (const [path, text] of Object.entries(all)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  }
  const out = execFileSync("python3", ["tools/boundaries.py", "--root", root, "--json"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
  return (JSON.parse(out) as { errors: string[] }).errors;
}

function errorsOrFailure(files: Record<string, string>): string[] {
  try {
    return errorsFor(files);
  } catch (failure) {
    const { stdout } = failure as { stdout: string };
    return (JSON.parse(stdout) as { errors: string[] }).errors;
  }
}

describe("module boundaries", () => {
  it("allows the server door of a declared dependency", () => {
    expect(
      errorsOrFailure({
        "src/modules/listings/a.ts": 'import { x } from "../contacts/server";\n',
      }),
    ).toEqual([]);
  });

  it("rejects internal files through the @/ alias", () => {
    const errors = errorsOrFailure({
      "src/modules/listings/a.ts": 'import { x } from "@/modules/contacts/phones";\n',
    });
    expect(errors.join()).toContain("public API");
  });

  it("rejects an undeclared dependency through the @/ alias", () => {
    const errors = errorsOrFailure({
      "src/modules/contacts/a.ts": 'import { x } from "@/modules/listings";\n',
    });
    expect(errors.join()).toContain("may not use");
  });

  it("allows the ui door of a module from src/app", () => {
    expect(
      errorsOrFailure({
        "src/app/page.tsx": 'import { x } from "@/modules/contacts/ui";\n',
      }),
    ).toEqual([]);
  });

  it("rejects internal module files imported from src/app", () => {
    const errors = errorsOrFailure({
      "src/app/page.tsx": 'import { x } from "@/modules/contacts/phones";\n',
    });
    expect(errors.join()).toContain("public API");
  });

  it("rejects server code imported by a client file", () => {
    const errors = errorsOrFailure({
      "src/app/widget.tsx": '"use client";\nimport { x } from "@/modules/contacts/server";\n',
    });
    expect(errors.join()).toContain("client file");
  });

  it("allows server code in a server component", () => {
    expect(
      errorsOrFailure({
        "src/app/page.tsx": 'import { x } from "@/modules/contacts/server";\n',
      }),
    ).toEqual([]);
  });
});
