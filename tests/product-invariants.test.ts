// decision:product-invariants
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const text = readFileSync("PRODUCT-INVARIANTS.md", "utf8");

function signature(code: string): RegExp {
  const block = text.split(/^## /m).find((b) => b.startsWith(`${code} `));
  const source = block?.match(/^- Dấu hiệu: `(.*)`$/m)?.[1];
  if (!source) throw new Error(`${code}: no signature`);
  return new RegExp(source);
}

const CASES: Record<string, { breaks: string[]; clean: string[] }> = {
  "SP-1": {
    breaks: [
      "const db = new pg.Pool(config);",
      "await pool.query('select 1');",
      "alter table listings disable row level security;",
      "alter role app BYPASSRLS;",
    ],
    clean: ["await withCompany(ctx, (tx) => tx.query('select 1'));", "force row level security;"],
  },
  "SP-3": {
    breaks: [
      "await fetch('https://openapi.zalo.me/v3/message');",
      "zaloClient.sendMessage(text);",
      "postToZalo(group);",
    ],
    clean: ["navigator.share({ url });", "const hasZaloPreview = true;"],
  },
  "SP-4": {
    breaks: ['import { x } from "@/modules/contacts";', 'label("ListAgent");'],
    clean: ['import { y } from "@/modules/sharing";', 'label("Listing");'],
  },
};

describe("product invariants", () => {
  for (const [code, { breaks, clean }] of Object.entries(CASES)) {
    it(`${code} flags known violations and leaves clean code alone`, () => {
      const re = signature(code);
      for (const line of breaks) expect(re.test(line), line).toBe(true);
      for (const line of clean) expect(re.test(line), line).toBe(false);
    });
  }

  it("declares every invariant as hard to reverse with an owner", () => {
    const blocks = text.split(/^## /m).filter((b) => b.startsWith("SP-"));
    expect(blocks).toHaveLength(3);
    for (const block of blocks) {
      expect(block).toContain("- Mức: khó đảo");
      expect(block).toMatch(/^- Chủ luật: \S/m);
    }
  });
});
