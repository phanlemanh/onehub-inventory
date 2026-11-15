// AC-11: the design tokens file records the primary colour as #0246ff.
// Usage: node tokens-primary.mjs --root <repository> [--tokens F]
import { readFileSync } from "node:fs";
import path from "node:path";
import { exit, stdout } from "node:process";

import { option } from "./linked-copy.mjs";

const root = path.resolve(option("--root", "."));
const tokens = JSON.parse(readFileSync(option("--tokens", path.join(root, "design/tokens.json")), "utf8"));

// The first `primary` entry anywhere in the tree, by its `$value`.
const find = (node) => {
  if (!node || typeof node !== "object") return null;
  if (node.primary && typeof node.primary === "object" && "$value" in node.primary) return node.primary.$value;
  for (const child of Object.values(node)) {
    const value = find(child);
    if (value) return value;
  }
  return null;
};
const value = find(tokens);
stdout.write(`primary ${value}\n`);
exit(value === "#0246ff" ? 0 : 1);
