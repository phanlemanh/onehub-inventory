#!/usr/bin/env node
// AC-6 (wiki part): a decision page records the convention that every lint exception carries a reason, and
// points at the ledger line that asked the owner. Prints "E10 THIẾU: …" and exits 1 when it is not there.
//
//   node wiki.mjs [--dir <wiki/decisions>]
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const at = args.indexOf("--dir");
const DIR = path.resolve(at === -1 ? path.join(HERE, "../../../wiki/decisions") : args[at + 1]);
const LINE = "d-20261126T061152Z-5";

console.log(`wiki: dir ${DIR}`);
const pages = readdirSync(DIR).filter((f) => f.endsWith(".md"));
const page = pages.find((f) => readFileSync(path.join(DIR, f), "utf8").includes(LINE));
if (page) {
  console.log(`E10 có: ${page} trỏ ${LINE}`);
  process.exit(0);
}
console.log(`E10 THIẾU: không trang quyết định nào trỏ ${LINE}`);
process.exit(1);
