// KIT_TAG of the gate job in .github/workflows/ci.yml, and the kit of the matrix it names.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { NEW_KIT, OLD_KIT } from "./matrix.mjs";

export function ciTag(ciText) {
  const lines = ciText.split("\n");
  const start = lines.findIndex((l) => /^ {2}gate:\s*$/.test(l));
  if (start < 0) return null;
  for (let i = start + 1; i < lines.length && !/^ {2}[A-Za-z0-9_-]+:\s*$/.test(lines[i]); i++) {
    const m = lines[i].match(/^\s+KIT_TAG:\s*(\S+)\s*$/);
    if (m) return m[1];
  }
  return null;
}

export function ciKit(root) {
  const tag = ciTag(readFileSync(join(root, ".github/workflows/ci.yml"), "utf8"));
  const kit = [OLD_KIT, NEW_KIT].find((k) => k.tag === tag);
  if (!kit) throw new Error(`ci-tag: KIT_TAG of the gate job is ${tag ?? "missing"}, want ${OLD_KIT.tag} or ${NEW_KIT.tag}`);
  return kit;
}
